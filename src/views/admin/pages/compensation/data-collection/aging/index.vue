<template>
  <i-layout headerKey="cpsPrescriptionsOneGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
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
        <el-form-item label="薪资组">
          <remote-select
            v-model="searchParam.groupId"
            dataKey="salaryGroup"
            placeholder="请输入代码或名称搜索"
            :displayKeys="['groupCode', 'groupName']"
            :props="groupProps"
          ></remote-select>
        </el-form-item>
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
        <el-form-item label="店龄">
          <i-select v-model="searchParam.orgType" parameter="SHOP_CATEGORY"></i-select>
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
            :data="tableScope.clone"
            :cell-class-name="cellClassName"
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
              :fixed="col.fixed"
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
            ></el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
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
  import req, { config } from 'api/compensation/data-collection/aging'
  import IsolateEdit from 'components/compensation/isolate-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import RemoteSelect from 'components/compensation/remote-select'
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
        reqConfig: { req: req, getName: 'getAgings', deleteName: 'deleteAging', deleteListName: 'deleteAgings' },
        // id键值标识
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        // 人事范围选择器配置
        personnelGroupProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        isolateConfig: { req: req, name: 'getSyncPrescriptData' },

        /* table */
        table: {
          columns: [
            { prop: 'provinceAreaName', label: '省区', sortable: true, align: 'left', width: '120' },
            { prop: 'areaName', label: '区域', width: '200', align: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', width: '120' },
            { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '100' },
//            { prop: 'orgUnitCode', label: '门店代码', align: 'left', width: '120' },
            { prop: 'orgUnitName', label: '门店名称', align: 'left', width: '120' },
            { prop: 'orgType', label: '店龄', align: 'left', width: '120', display: {dict: 'SHOP_CATEGORY'} },
            { prop: 'openDate', label: '开业日期', align: 'left', width: '120', display: { date: '' } },
            { prop: 'type', label: '门店类型', align: 'left', width: '140', display: {dict: 'STORE_TYPE'} },
            { prop: 'checkMonth', label: '核算月份', align: 'left', width: '120' },
            { prop: 'sellAmount', label: '门店销售', align: 'right', width: '120' },
            { prop: 'totalHour', label: '门店总工时', align: 'right', width: '120' },
            { prop: 'prescription', label: '门店时效', align: 'right', width: '120' },
            { prop: 'normSellAmount', label: '对标总销售', align: 'right', width: '120' },
            { prop: 'normTotalHour', label: '对标总工时', align: 'right', width: '120' },
            { prop: 'normPrescription', label: '对标时效', align: 'right', width: '120' },
            { prop: 'prescriptionLevelFour', label: '档次等级(四档)', align: 'left', width: '120', display: {dict: 'PRESCRIPTION_LEVEL'} },
            { prop: 'prescriptionLevelThree', label: '档次等级(三档)', align: 'left', width: '120', display: {dict: 'PRESCRIPTION_LEVEL'} },
            { prop: 'confirmStatus', label: '确认状态', width: '120', align: 'left', display: { dict: 'CONFIRM_STATUS' } },
            { prop: 'createBy', label: '操作者工号', align: 'left', width: '120' },
            { prop: 'createDate', label: '操作时间', align: 'left', width: '160', display: { date: 'long' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '一集群门店时效'
              },
              key: 'cpsPrescriptionsOneExport',
              req: config.getAgings
            },
            import: {
              key: 'cpsPrescriptionOneImportPost',
              business: 'cps-prescriptionOne',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '删除',
                key: 'cpsPrescriptionsOneDelete',
                func: this.deleteRow
              }
            ],
            toolbar: [
              {
                text: '抽数',
                key: 'cpsAgingCoefficientOneGets',
                func: this.isolatePolicy
              }, {
                text: '确认无误',
                key: 'cpsPrescriptionsOneConfirm',
                func: (vm) => {
                  return this.confirmAction(vm, 'Y')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }, {
                text: '取消确认',
                key: 'prescriptionsConfirmCancelPut',
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
          orgType: '',
          groupId: '',
          personnelGroupCode: '',
          provinceAreaId: '',
          areaId: '',
          orgUnitCode: '',
          orgUnitName: '',
          orgUnitId: '',
          effectiveDateStart: null,
          effectiveDateEnd: null,
          effectiveDate: null,
          uneffectiveDate: null
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
