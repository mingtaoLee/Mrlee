<template>
  <i-layout headerKey="cpsPayComponentGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="薪资项目名称">
          <el-input v-model="searchParam.componentName"></el-input>
        </el-form-item>
        <el-form-item label="项目分类">
          <i-select v-model="searchParam.componentType" parameter="COMPONENT_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="项目属性">
          <i-select v-model="searchParam.componentAttribute" parameter="COMPONENT_ATTRIBUTE"></i-select>
        </el-form-item>
        <el-form-item label="生效开始日期">
          <el-date-picker
            v-model="searchParam.effectiveDate"
            type="date"
            @change="handleEffectiveDateChange"
            :picker-options="effectOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束日期">
          <el-date-picker
            v-model="searchParam.uneffectiveDate"
            type="date"
            @change="handleUneffectDateChange"
            :picker-options="uneffectOptions">
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
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                />
              </template>
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="title"
        width="800px"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :idKey="idKey" :editorStatus="editorStatus" :componentId="componentId"></detail-edit>
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
        reqConfig: { req: req, getName: 'getCompensationItemList', deleteName: 'deleteCompensationItem' },
        idKey: 'componentId',
        title: '薪资项目',
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
            { prop: 'componentName', label: '薪资项目名称', sortable: true, width: '130' },
            { prop: 'componentType', label: '项目分类', width: '130', align: 'left', display: {dict: 'COMPONENT_TYPE'} },
            { prop: 'componentAttribute', label: '项目属性', width: '130', align: 'left', display: {dict: 'COMPONENT_ATTRIBUTE'} },
            { prop: 'accuracy', label: '精度', width: '100', align: 'right' },
            { prop: 'carryRule', label: '进位规则', width: '120', align: 'left', display: {dict: 'CARRY_RULE'} },
            { prop: 'effectiveDate', label: '生效日期', width: '120', align: 'left', display: {date: 'default'} },
            { prop: 'uneffectiveDate', label: '失效日期', width: '120', align: 'left', display: {date: 'default'} }
          ],
          setting: {
            export: {
              config: {
                fileName: '薪资项目'
              },
              key: 'cpsPayComponentExport',
              req: config.getCompensationItemList
            },
            import: {
              key: 'cpsPayComponentImport',
              business: 'cps-component',
              show: () => ({ empty: false })
            },
            operator: [
              {
                key: 'cpsPayComponentUpdate',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsPayComponentDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              key: 'cpsPayComponentCreate',
              text: '新增',
              func: this.addPage
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
          componentName: '',
          componentType: '',
          componentAttribute: '',
          componentForType: '',
          effectiveDate: null,
          uneffectiveDate: null
        }
      }
    },
    methods: {
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
