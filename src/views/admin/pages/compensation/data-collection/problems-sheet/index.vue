<template>
  <i-layout headerKey="cpsQuestionGet">
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="状态">
        <i-select v-model="searchParam.questionStatus" parameter="DATA_STATE"></i-select>
      </el-form-item>
      <el-form-item label="组织名称">
        <i-select-tree
          :multiple="false"
          dataKey="org"
          nodeKey="orgUnitId"
          v-model="searchParam.orgUnitId"
          size="small"
        ></i-select-tree>
      </el-form-item>
      <el-form-item label="所属月份">
        <el-date-picker
          v-model="searchParam.checkMonth"
          type="month"
          value-format="yyyyMM">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="问题类型">
        <!-- <i-select v-model="searchParam.questionType" parameter=""></i-select> -->
        <el-input v-model="searchParam.questionType"></el-input>
      </el-form-item>
      <el-form-item label="处理类别">
        <i-select v-model="searchParam.processType" parameter="QUESTION_HANDLE_TYPE"></i-select>
      </el-form-item>
    </i-form>
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
              :fixed="col.fixed"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        title="问题描述单"
        size="small"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :id="id" :problemsMode="problemsMode"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/data-collection/problems-sheet'
  import { dateFormat } from 'utils/index'
  import DetailEdit from './detail-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  export default {
    mixins: [Access, PaginationMixin, SearchDateMixin, ConfirmDataMixin],
    components: {
      DetailEdit
    },
    data () {
      return {
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        reqConfig: { req: req, getName: 'getSheetList' },
        searchParam: {
          questionStatus: '',
          orgUnitName: '',
          orgName: '',
          orgUnitId: '',
          questionType: '',
          bestirMonth: '',
          processType: '',
          postName: '',
          hireDate: ''
        },
        id: [],
        problemsMode: 1,
        selectedItems: [],

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
            throttle: true,
            text: '确认',
            func: done => {
              return this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            { prop: 'provinceAreaName', label: '省区', align: 'left', width: '120' },
            { prop: 'areaName', label: '区域', align: 'left', width: '120' },
            { prop: 'orgUnitCode', label: '组织代码', align: 'left', width: '120' },
            { prop: 'orgUnitName', label: '组织名称', align: 'left', width: '160' },
            { prop: 'checkMonth', label: '月份', align: 'left', width: '120' },
            { prop: 'questionType', label: '问题类型', align: 'left', width: '140', display: { dict: '' } },
            { prop: 'description', label: '详细描述', align: 'left', width: '200' },
            { prop: 'lastUpdateBy', label: '提交人', align: 'left', width: '120' },
            { prop: 'lastUpdateDate', label: '提交时间', align: 'left', width: '140', display: {date: ''} },
            { prop: 'processType', label: '处理类别', align: 'left', width: '140', display: { dict: 'QUESTION_HANDLE_TYPE' } },
            { prop: 'questionStatus', label: '状态', align: 'left', width: '140', display: { dict: 'DATA_STATE' } },
            { prop: 'processDesc', label: '处理描述', align: 'left', width: '200' }
          ],
          setting: {
            toolbar: [{
              text: '问题提交',
              key: 'cpsQuestionPost',
              func: this.submitProblems
            }],
            operator: [
              {
                text: '问题处理',
                key: 'cpsQuestionPut',
                func: this.handleProblems
              }
            ],
            import: {
              key: 'cpsQuestionImportPost',
              business: '',
              show: () => ({ empty: false })
            },
            export: {
              config: {
                fileName: '问题描述单'
              },
              req: config.getSheetList,
              key: 'cpsQuestionExport',
              elTable: null
            }
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
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
      },
      handleProblems (scope) {
        this.id = scope.row.id
        this.problemsMode = 2
        this.openDetailDialog()
      },
      submitProblems () {
        this.problemsMode = 1
        this.openDetailDialog()
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleSave (done) {
        const date = this.$refs.detailEdit
        date.checkMonth = dateFormat(date.checkMonth, 'YYYYMM')
        return date.save().then(res => {
          if (res) {
            // TODO search参数
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            done()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
