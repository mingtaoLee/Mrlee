<template>
  <i-layout headerKey="cpsPrescriptionsTwoGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <!-- <el-form-item label="省区">
          <i-select-area v-model="searchParam.provinceAreaId" type="yonghui" search></i-select-area>
        </el-form-item> -->
        <el-form-item label="区域">
          <i-select-area v-model="searchParam.areaId" type="yonghui" search></i-select-area>
        </el-form-item>
        <el-form-item label="人事范围">
          <remote-select
            v-model="searchParam.personnelGroupCode"
            dataKey="personnelGroup"
            placeholder="请输入代码或名称搜索"
            :extraParam="{ hasPower: 'Y' }"
            :displayKeys="['personnelGroupCode', 'personnelGroupName']"
            :props="personnelGroupProps"
          ></remote-select>
        </el-form-item>
        <!-- <el-form-item label="门店代码">
          <el-input v-model="searchParam.orgUnitCode"></el-input>
        </el-form-item>
        <el-form-item label="门店名称">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="searchParam.orgUnitId"
            size="small"
          ></i-select-tree>
        </el-form-item> -->
        <el-form-item label="开业日期起">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="date"
            :picker-options="effectStartOptions"
            @change="handleEffectiveDateStartChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开业日期止">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="date"
            :picker-options="effectEndOptions"
            @change="handleEffectiveDateEndChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="核算月份起">
          <el-date-picker
            v-model="searchParam.effectiveDate"
            type="month"
            :picker-options="effectOptions"
            @change="handleEffectiveDateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="核算月份止">
          <el-date-picker
            v-model="searchParam.uneffectiveDate"
            type="month"
            :picker-options="uneffectOptions"
            @change="handleUneffectDateChange"
          >
          </el-date-picker>
        </el-form-item>
      </i-form>
    </template>
    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            v-loading="loading"
            :element-loading-text="$loadingText"
            :data="tableScope.clone" :cell-class-name="cellClassName"
            border
            @selection-change="selectionChangeHandler(tableScope, $event)"
          >
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowIsolate"
        title="抽数"
        size="mini"
        :toolbar="isolateEditToolbar"
        destroyedWhenClose
      >
        <isolate-edit ref="isolateEdit" :id="id"></isolate-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/prescriptions-two'
  import IsolateEdit from 'components/compensation/isolate-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import isolateMixin from 'mixins/compensation/isolate-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access, ConfirmDataMixin, isolateMixin],
    components: {
      IsolateEdit,
      RemoteSelect
    },
    data () {
      return {
        // id键值标识
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        reqConfig: { req: req, getName: 'getPrescriptTwoList' },
        dataConfirmConfig: { req: req, name: 'confirmData', params: {confirmStatus: 'Y'}, cancelParams: {confirmStatus: 'N'} },
        isolateConfig: { req: req, name: 'getPrescriptionTwos' },
        personnelGroupProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },

        /* table */
        table: {
          columns: [
            { prop: 'provinceAreaName', label: '省区', align: 'left', width: '140' },
            { prop: 'areaName', label: '区域', align: 'left', width: '140' },
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', align: 'left', width: '120' },
            // { prop: 'orgUnitCode', label: '门店代码', align: 'left', width: '120' },
            // { prop: 'orgUnitName', label: '门店名称', width: '140', align: 'left' },
            { prop: 'type', label: '店类型', align: 'left', width: '120', display: {dict: 'STORE_TYPE'} },
            { prop: 'openDate', label: '开业日期', align: 'left', width: '140', display: { date: '' } },
            { prop: 'checkMonth', label: '核算月份', align: 'left', width: '120' },
            { prop: 'sellAmount', label: '门店销售金额', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'totalHour', label: '门店总工时', width: '120', align: 'right' },
            { prop: 'prescription', label: '门店时效', align: 'right', width: '120' },
            { prop: 'normSellAmount', label: '对标总销售', width: '120', align: 'right' },
            { prop: 'normTotalHour', label: '对标总工时', width: '120', align: 'right' },
            { prop: 'normPrescription', label: '对标时效', align: 'right', width: '120' },
            { prop: 'prescriptionLevel', label: '档次等级', width: '120', align: 'left', display: {dict: 'PRESCRIPTION_LEVEL'} },
            { prop: 'confirmStatus', label: '确认状态', width: '120', align: 'left', display: { dict: 'CONFIRM_STATUS' } },
            { prop: 'createBy', label: '操作者工号', width: '120', align: 'left' },
            { prop: 'createDate', label: '操作时间', width: '120', display: { date: 'long' }, align: 'left' }
          ],
          setting: {
            export: {
              config: {
                fileName: '二集群门店时效'
              },
              key: 'cpsPrescriptionsTwoExport',
              req: config.getPrescriptTwoList
            },
            import: {
              key: 'cpsPrescriptionTwoImportPost',
              business: 'cps-prescriptionTwo',
              show: () => ({ empty: false })
            },
            toolbar: [
              {
                text: '抽数',
                key: 'cpsTwoPrescriptionSync',
                func: this.isolatePolicy
              }, {
                text: '确认无误',
                key: 'cpsPrescriptionTwoConfirm',
                func: (vm) => {
                  return this.confirmAction(vm, 'Y')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }, {
                text: '取消确认',
                key: 'prescriptionTwosConfirmCancelPut',
                func: (vm) => {
                  return this.confirmAction(vm, 'N')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }
            ]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          areaId: '',
          orgUnitId: '',
          provinceAreaId: '',
          orgUnitCode: '',
          orgUnitName: '',
          effectiveDate: null,
          uneffectiveDate: null,
          effectiveDateStart: null,
          effectiveDateEnd: null
        }
      }
    },
    methods: {
      afterFetch (res) {
        res.data.map(item => {
          if (item.checkMonth) {
            item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
          }
        })
        return Promise.resolve(true)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
