<template>
  <i-layout headerKey="cpsFinanceSelectGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="薪资项目">
          <remote-select v-model="searchParam.componentName" dataKey="salaryItem" :props="componentProps"></remote-select>
          <!--<el-input v-model="searchParam.componentName"></el-input>-->
        </el-form-item>
        <el-form-item label="项目属性">
          <i-select v-model="searchParam.componentAttribute" parameter="COMPONENT_ATTRIBUTE"></i-select>
        </el-form-item>
        <el-form-item label="借方科目编码">
          <i-select v-model="searchParam.debitAccountCode" :props="accountCodeOptionProps" parameter="ACCOUNT_TITLE"></i-select>
        </el-form-item>
        <el-form-item label="借方科目名称">
          <i-select v-model="searchParam.debitAccountCode" parameter="ACCOUNT_TITLE"></i-select>
        </el-form-item>
        <el-form-item label="贷方科目编码">
          <i-select v-model="searchParam.creditAccountCode" :props="accountCodeOptionProps" parameter="ACCOUNT_TITLE"></i-select>
        </el-form-item>
        <el-form-item label="贷方科目名称">
          <i-select v-model="searchParam.creditAccountCode" parameter="ACCOUNT_TITLE"></i-select>
        </el-form-item>
        <!--<el-form-item label="贷方科目名称">-->
          <!--<i-select v-model="searchParam.creditAccountCode"></i-select>-->
        <!--</el-form-item>-->
        <el-form-item label="是否反记账">
          <i-select v-model="searchParam.isNegativePosting" parameter="WHETHER_TYPE"></i-select>
        </el-form-item>
      </i-form>
    </template>
    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        @save="getTableData"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            v-loading="loading"
            :element-loading-text="$loadingText"
            border
            :data="tableScope.clone"
            @selection-change="selectionChangeHandler(tableScope, $event)">
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              label="薪资项目"
              prop="componentName"
              width="120"
              sortable
              align="left"
            ></el-table-column>
            <el-table-column
              label="项目属性"
              width="130"
              prop="componentAttribute"
              align="left"
              :formatter="tableScope.formatter"
            ></el-table-column>
            <el-table-column
              label="凭证类型"
              prop="voucherType"
              width="120"
              align="left"
              :formatter="tableScope.formatter"
            ></el-table-column>
            <el-table-column label="借方" prop="debit">
              <el-table-column
                label="记账编码"
                width="100"
                align="left"
                prop="debitPostingKey"
              ></el-table-column>
              <el-table-column
                label="科目编码"
                align="left"
                width="100"
                prop="debitAccountCode"
              ></el-table-column>
              <el-table-column
                label="科目名称"
                align="left"
                width="140"
                prop="debitAccountCode"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="贷方" prop="credit">
              <el-table-column
                label="记账编码"
                align="left"
                width="100"
                prop="creditPostingKey"
              ></el-table-column>
              <el-table-column
                align="left"
                width="100"
                label="科目编码"
                prop="creditAccountCode"
              ></el-table-column>
              <el-table-column
                label="科目名称"
                align="left"
                width="140"
                prop="creditAccountCode"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column
              label="是否反记账"
              align="left"
              width="120"
              prop="isNegativePosting"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
            <el-table-column
              label="备注"
              align="left"
              width="200"
              prop="remark"
            ></el-table-column>
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
        <detail-edit ref="detailEdit" :editorStatus="editorStatus" :idKey="idKey" :componentFinanceId="componentFinanceId"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/base-setting/company-rules'
  import DetailEdit from './detail-edit/index.vue'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, Access],
    components: {
      DetailEdit,
      RemoteSelect
    },
    data () {
      return {
        reqConfig: { req: req, getName: 'getFinances', deleteName: 'deleteFinance' },
        idKey: 'componentFinanceId',
        title: '薪资项目财务属性',
        // 薪资项目配置
        componentProps: {
          value: 'componentName',
          label: 'componentName'
        },
        accountCodeOptionProps: {
          value: 'value',
          label: 'value'
        },
        componentFinanceId: '',
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
          multiple: true,
          columns: [
            {prop: 'voucherType', display: { dict: 'VOUCHER_TYPE' }},
            {prop: 'debitAccountCode', display: {dict: 'ACCOUNT_TITLE'}},
            {prop: 'componentAttribute', display: {dict: 'COMPONENT_ATTRIBUTE'}},
            {prop: 'creditAccountCode', display: {dict: 'ACCOUNT_TITLE'}},
            {prop: 'isNegativePosting', display: {dict: 'WHETHER_TYPE'}}
          ],
          setting: {
            export: {
              config: {
                fileName: '薪资组财务属性'
              },
              key: 'cpsFinanceExport',
              req: config.getFinances
            },
            import: {
              key: 'cpsFinanceImport',
              business: 'cps-payComponentFinance',
              show: () => ({ empty: false })
            },
            operator: [
              {
                key: 'cpsFinanceUpdatePut',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsFinanceDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              key: 'cpsFinanceCreatePost',
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
          componentName: '',
          componentAttribute: '',
          debitAccountCode: '',
          creditAccountCode: ''
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
