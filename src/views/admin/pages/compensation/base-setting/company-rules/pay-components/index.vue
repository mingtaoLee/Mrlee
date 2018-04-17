<template>
  <i-layout headerKey="cpsPayComponentListGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工资套名称">
          <el-input v-model="searchParam.componentListName"></el-input>
        </el-form-item>
        <el-form-item label="工资套分类">
          <i-select v-model="searchParam.componentListType" parameter="COMPONENT_LIST_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="生效开始日期">
          <el-date-picker
            v-model="searchParam.effectiveDate"
            type="date"
            :picker-options="effectOptions"
            @change="handleEffectiveDateChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束日期">
          <el-date-picker
            v-model="searchParam.uneffectiveDate"
            type="date"
            :picker-options="uneffectOptions"
            @change="handleUneffectDateChange"
          ></el-date-picker>
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
              :minWidth="col.minWidth"
              :align="col.align"
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
            ></el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/base-setting/company-rules'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
    },
    data () {
      return {
        reqConfig: { req: req, getName: 'getPayComponentList', deleteName: 'deletePayComponent' },
        title: '工资套',
        idKey: 'componentListId',
        type: '',
        /* detail-edit */
        detailEditToolbar: [
          {
            text: '取消',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确认',
            func: done => {
              this.handleDetailSave(done)
            }
          }
        ],
        isShowDetailEdit: false,
        isShowSalarySheet: false,
        /* table */
        table: {
          columns: [
            { prop: 'componentListName', label: '工资套名称', sortable: true, minWidth: '130', align: 'left' },
            { prop: 'effectiveDate', label: '生效日期', minWidth: '120', align: 'left', display: {date: ''} },
            { prop: 'uneffectiveDate', label: '失效日期', minWidth: '120', align: 'left', display: {date: ''} },
            { prop: 'componentListType', label: '工资套分类', minWidth: '130', align: 'left', display: {dict: 'COMPONENT_LIST_TYPE'} }
          ],
          setting: {
            export: {
              key: 'cpsPayComponentListExport',
              config: {
                fileName: '工资套'
              },
              req: config.getPayComponentList
            },
            import: {
              key: 'cpsPayComponentListImport',
              business: 'cps-componentList',
              show: () => ({ empty: false })
            },
            operator: [
              {
                key: 'cpsPayComponentListUpdate',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsPayComponentListDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              key: 'cpsPayComponentListCreate',
              text: '新增',
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
          componentListName: '',
          componentListType: '',
          effectiveDate: null,
          uneffectiveDate: null
        }
      }
    },
    methods: {
      /** 打开工资套编辑页面 */
      openDetailDialog () {
        const pathName = this.editorStatus === '3' ? 'edit' : 'add'
        this.$router.push({path: `/compensation/base-setting/company-rules/pay-component-${pathName}`, query: {componentListId: this.componentListId, editorStatus: this.editorStatus, title: this.title, idKey: this.idKey}})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
