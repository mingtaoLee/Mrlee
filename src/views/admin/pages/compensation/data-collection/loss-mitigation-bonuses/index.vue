<template>
  <i-layout headerKey="cpsReducePageSelectGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="开始月份">
          <el-date-picker
            v-model="searchParam.beginDate"
            type="month">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束月份">
          <el-date-picker
            v-model="searchParam.endDate"
            type="month">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="区域">
          <i-select-area
            v-model="searchParam.areaId"
            type="yonghui"
            search
            parameter="COMPONENT_TYPE"
          ></i-select-area>
        </el-form-item>
        <el-form-item label="门店名称">
          <el-input v-model="searchParam.orgUnitName" parameter="COMPONENT_TYPE"></el-input>
        </el-form-item>
        <el-form-item label="门店编号">
          <el-input v-model="searchParam.orgUnitCode" parameter="COMPONENT_TYPE"></el-input>
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
            @selection-change="selectionChangeHandler(tableScope, $event)">
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
            >
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="附件"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="uploadAction(scope)">
                  上传
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/data-collection/loss-mitigation-bonuses'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access, ConfirmDataMixin],
    data () {
      return {
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        reqConfig: { req: req, getName: 'getLossMitigationList' },
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        /* detail-edit */
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确认',
            func: done => {
              this.handleSave(done)
            }
          }
        ],

        /* table */
        table: {
          columns: [
            { prop: 'checkMonth', label: '月份', width: '120', align: 'left' },
            { prop: 'areaId', label: '区域', width: '130', align: 'left' },
            { prop: 'total', label: '区总', width: '130', align: 'left' },
            { prop: 'orgUnitName', label: '门店名称', width: '160', align: 'left' },
            { prop: 'orgUnitCode', label: '店编', width: '120', align: 'left' },
            { prop: 'bigTarget', label: '大店', width: '140', align: 'left' },
            { prop: 'fishMeatStore', label: '鱼肉小店', width: '140', align: 'left' },
            { prop: 'dryGoodsStore', label: '干货小店', width: '140', align: 'left' },
            { prop: 'drugStore', label: '干杂日配小店', width: '140', align: 'left' },
            { prop: 'fruitStore', label: '蔬果小店', width: '140', align: 'left' },
            { prop: 'processStore', label: '加工小店', width: '140', align: 'left' },
            { prop: 'lifeStore', label: '家居生活小店', width: '140', align: 'left' },
            { prop: 'applianceStore', label: '家用文体家电小店', width: '140', align: 'left' },
            { prop: 'cleanStore', label: '清洁小店', width: '140', align: 'left' },
            { prop: 'leisureStore', label: '休闲食品小店', width: '140', align: 'left' },
            { prop: 'beveragesStore', label: '烟酒饮料小店', width: '140', align: 'left' },
            {prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' }},
            { prop: 'lastUpdateBy', label: '操作者', width: '120', align: 'left' },
            { prop: 'lastUpdateDate', label: '操作时间', width: '120', align: 'left', display: {date: ''} }
          ],
          setting: {
            export: {
              config: {
                fileName: '减亏分红'
              },
              key: 'cpsReduceExportGet',
              req: config.getLossMitigationList
            },
            import: {
              key: 'cpsReduceImportPost',
              business: 'cps-reduce-profit',
              show: () => ({ empty: false })
            },
            toolbar: [{
              text: '减亏分红历史',
              key: 'cpsReduceHistoryGet',
              func: () => {
                this.$router.push('/compensation/data-collection/loss-mitigation-bonuses-history')
              }
            }]
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          search: null
        },
        // 查询参数
        searchParam: {
          beginDate: '',
          endDate: '',
          areaId: '',
          orgUnitName: '',
          orgUnitCode: ''
        }
      }
    },
    methods: {
      uploadAction (data) {
        console.log(data)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
