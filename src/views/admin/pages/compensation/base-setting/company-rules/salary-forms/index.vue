<template>
  <i-layout headerKey="cpsSalarySelectGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="适用范围" prop="orgUnitId">
          <i-select-tree
            multiple
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="searchParam.orgUnitId"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="组织类别">
          <i-select v-model="searchParam.orgType" parameter="CPS_ORG_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="职务">
          <i-select
            multiple
            dataKey="posTitles"
            v-model="searchParam.posTitleId"
            :props="posTitleProps"
            filterable
          ></i-select>
        </el-form-item>
        <el-form-item label="档级">
          <el-input v-model="searchParam.salaryGrade"></el-input>
        </el-form-item>
        <el-form-item label="计薪方式">
          <i-select v-model="searchParam.calculateSalaryWay" parameter="CALCULATE_SALARY_WAY"></i-select>
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
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="title"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :editorStatus="editorStatus" :idKey="idKey" :salaryMatrixId="salaryMatrixId"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/base-setting/company-rules'
  import DetailEdit from './detail-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
      DetailEdit
    },
    data () {
      return {
        reqConfig: { req: req, getName: 'getSalaryForms', deleteName: 'deleteSalaryForm' },
        // 行id键值
        idKey: 'salaryMatrixId',
        // 职务配置选项
        posTitleProps: {
          value: 'posTitleId',
          label: 'name'
        },
        title: '薪档表',
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
            { prop: 'orgType', label: '组织类别', sortable: true, align: 'left', width: '120', display: { dict: 'CPS_ORG_TYPE' } },
            { prop: 'orgUnitName', label: '适用范围', sortable: true, align: 'left', width: '180', display: { dict: '' } },
            { prop: 'titleName', label: '职务', sortable: true, align: 'left', width: '120' },
            { prop: 'salaryGrade', label: '档级', sortable: true, align: 'left', width: '120' },
            { prop: 'calculateSalaryWay', label: '计薪方式', sortable: true, align: 'left', width: '120', display: { dict: 'CALCULATE_SALARY_WAY' } },
            { prop: 'standardSalary', label: '标准工资', sortable: true, align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } }
          ],
          setting: {
            export: {
              key: 'cpsSalaryExport',
              config: {
                fileName: '薪档表'
              },
              req: config.getSalaryForms
            },
            import: {
              key: 'cpsSalaryImport',
              business: 'cps-salary-matrix',
              show: () => ({ empty: false })
            },
            operator: [
              {
                key: 'cpsSalaryUpdatePut',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsSalaryDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '新增',
              key: 'cpsSalaryCreatePost',
              func: this.addPage
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          orgType: '',
          orgUnitId: '',
          titleName: '',
          posTitleId: '',
          salaryGrade: '',
          calculateSalaryWay: ''
        }
      }
    },
    methods: {
      /** 搜索 */
      search () {
        this.allParam.pageIndex = 1
        if (this.judgeHasSearchParam()) this.isSearch = true
        this.table.search = Object.assign({}, this.searchParam)
        // 列表查询职务转换为字符串
        if (this.searchParam.posTitleId) this.table.search.posTitleId = this.searchParam.posTitleId.toString()
      },
      openDetailDialog () {
        this.isShowDialog = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
