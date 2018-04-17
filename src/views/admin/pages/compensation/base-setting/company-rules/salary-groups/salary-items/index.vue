<template>
  <i-layout headerKey="cpsPayGroupInfoGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工资套名称">
          <el-input v-model="searchParam.componentListName"></el-input>
        </el-form-item>
        <el-form-item label="工资套分类">
          <i-select v-model="searchParam.componentListType" parameter="COMPONENT_LIST_TYPE"></i-select>
        </el-form-item>
      </i-form>
    </template>
    <template slot="section">
      当前薪资组：
      <remote-select
        class="mb10"
        v-model="groupId"
        :props="groupProps"
        :clearable="false"
        :defaultOptions="groupOptions"
        :displayKeys="['groupCode', 'groupName']"
        dataKey="salaryGroup"
        @change="handleSelectChange"
      ></remote-select>
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
            ></el-table-column>
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
        <detail-edit ref="detailEdit" :editorStatus="editorStatus" :idKey="idKey" :groupId="groupId" :groupListId="groupListId"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>
<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/base-setting/company-rules'
  import reqIndex from 'api/compensation'
  import DetailEdit from './detail-edit'
  import { showMessage } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
      DetailEdit,
      RemoteSelect
    },
    data () {
      return {
        reqConfig: { req: req, getName: 'getSalaryItems', deleteName: 'deleteSalaryItem' },
        // 行id健名
        idKey: 'groupListId',
        // 新增修改弹窗标题
        title: '关联工资套',
        // 薪资组id
        groupId: '',
        extraOption: () => {
          return { groupId: this.groupId }
        },
        // 薪资组关联工资套id
        groupListId: '',
        // 薪资组下拉选项配置
        groupProps: {
          label: 'groupName',
          value: 'groupId'
        },
        // 薪资组下拉选项
        groupOptions: [],
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
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            { prop: 'componentListName', label: '工资套名称', sortable: true, align: 'left', width: '120' },
            { prop: 'componentListType', label: '工资套类型', width: '120', align: 'left', display: { dict: 'COMPONENT_LIST_TYPE' } },
            { prop: 'isDefault', label: '是否默认', width: '100', display: { dict: 'WHETHER_TYPE' }, align: 'left' },
            { prop: 'payslipName', label: '工资条', align: 'left', width: '120' },
            { prop: 'componentName', label: '报盘项目', align: 'left', width: '120' }
          ],
          setting: {
            export: {
              key: 'cpsPayGroupInfoExport',
              config: {
                fileName: '工资套'
              },
              param: () => ({groupId: this.groupId}),
              req: config.getSalaryItems
            },
            operator: [
              {
                key: 'cpsPayGroupInfoUpdate',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsPayGroupInfoDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '返回',
              type: 'plain',
              func: this.back
            }, {
              key: 'cpsPayGroupInfoCreate',
              text: '新增关联工资套',
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
          componentListType: ''
        }
      }
    },
    methods: {
      fetchGroupOptions () {
        if (this.groupId) return Promise.resolve(this.groupId)
        return new Promise(resolve => {
          reqIndex('getGroups', {num: 50}).then(res => {
            if (res && res.length) {
              this.groupOptions = res
              this.groupId = res[0].groupId
              resolve(res[0].groupId)
            } else {
              showMessage('warning', '当前没有可选薪资组，请先设置薪资组！')
              this.back()
            }
          })
        })
      },
      beforeFetch () {
        return this.fetchGroupOptions()
      },
      handleSelectChange (value) {
        this.groupId = value
        this.fetch()
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleSave (done) {
        this.$refs.detailEdit.save().then(res => {
          if (res) {
            this.fetch({ groupId: this.groupId })
            done()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .nav {
    line-height: 50px;
    height: 50px;
  }
  .label {
    display: inline-block;
    margin-right: 10px;
    font-size: 14px;
    font-weight: 600;
  }
  .btn {
    margin-top: 10px;
  }
</style>
