<template>
  <div>
    <i-layout headerKey="cpsOrgSellInfoSelectGet">
      <template slot="header">
        <i-form @search="search" @reset="reset">
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
          <el-form-item label="小店名称">
            <el-input v-model="searchParam.orgUnitName"></el-input>
            <!-- <i-select-tree
              :multiple="false"
              dataKey="org"
              nodeKey="orgUnitId"
              v-model="searchParam.orgUnitId"
              size="small"
            ></i-select-tree> -->
          </el-form-item>
          <el-form-item label="核算月份起">
            <el-date-picker
              v-model="searchParam.effectiveDateStart"
              type="month"
              @change="handleEffectiveDateStartChange"
              :picker-options="effectStartOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="核算月份止">
            <el-date-picker
              v-model="searchParam.effectiveDateEnd"
              type="month"
              @change="handleEffectiveDateEndChange"
              :picker-options="effectEndOptions"
            ></el-date-picker>
          </el-form-item>
        </i-form>
      </template>
      <template slot="section">
      <i-table
        class="table"
        :table="table"
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
              :sortable="col.sortable"
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
  </div>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/sells'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import IsolateEdit from 'components/compensation/isolate-edit'
  import isolateMixin from 'mixins/compensation/isolate-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, ConfirmDataMixin, isolateMixin],
    components: {
      IsolateEdit,
      RemoteSelect
    },
    data () {
      return {
        idKey: 'id',
        id: String,
        // 人事范围选择器配置
        personnelGroupProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        // dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        reqConfig: { req: req, getName: 'getSellsList' },
        isolateConfig: { req: req, name: 'getSellsData' },
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', width: '120' },
            { prop: 'storeName', label: '门店名称', width: '120', align: 'left' },
            { prop: 'orgUnitName', label: '小店名称', align: 'left', width: '160' },
            { prop: 'checkMonth', label: '核算月份', width: '120', align: 'left' },
            { prop: 'profitAmount', label: '利润额', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'sellAmount', label: '销售额', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } }
          ],
          setting: {
            export: {
              config: {
                fileName: '门店销售数据'
              },
              key: 'cpsOrgSellInfoExportGet',
              req: config.getSellsList
            },
            toolbar: [
              {
                text: '抽数',
                key: 'cpsOrgSellInfoSelectDateGet',
                func: this.isolatePolicy
              }
              // , {
              //   text: '确认无误',
              //   key: '',
              //   func: (vm) => {
              //     return this.confirmAction(vm, 'Y')
              //   },
              //   show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              // }
            ]
          },
          data: [],
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        },
        searchParam: {
          orgUnitName: '',
          personnelGroupCode: '',
          effectiveDateStart: '',
          effectiveDateEnd: ''
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
