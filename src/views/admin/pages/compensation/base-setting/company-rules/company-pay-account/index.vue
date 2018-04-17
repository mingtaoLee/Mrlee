<template>
  <i-layout headerKey="cpsCompanyPayAccountGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="公司代码">
          <el-input v-model="searchParam.companyCode"></el-input>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="searchParam.companyName"></el-input>
        </el-form-item>
        <el-form-item label="基本户">
          <el-input v-model="searchParam.basicAccount"></el-input>
        </el-form-item>
        <el-form-item label="支付账户">
          <el-input v-model="searchParam.payAccount"></el-input>
        </el-form-item>
        <el-form-item label="支付主体">
          <el-input v-model="searchParam.paymentCompanyName"></el-input>
        </el-form-item>
        <el-form-item label="支付银行类别">
          <i-select v-model="searchParam.payBankType" parameter="BANK_TYPE"></i-select>
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
        <detail-edit ref="detailEdit" :editorStatus="editorStatus" :idKey="idKey" :companyAccountId="companyAccountId"></detail-edit>
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
        reqConfig: { req: req, getName: 'getPayAccounts', deleteName: 'deletePayAccount' },
        title: '公司支付账户信息',
        idKey: 'companyAccountId',
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
            { prop: 'companyCode', label: '公司代码', align: 'left', width: '120' },
            { prop: 'companyName', label: '公司名称', align: 'left', width: '200' },
            { prop: 'basicAccount', label: '基本户', align: 'left', width: '120' },
            { prop: 'paymentCompanyName', label: '支付主体', align: 'left', width: '120', display: { dict: 'dict' } },
            { prop: 'payAccount', label: '支付账户', align: 'left', width: '120' },
            { prop: 'payBankType', label: '支付银行类别', align: 'left', width: '120', display: { dict: 'BANK_TYPE' } },
            { prop: 'isDefault', label: '是否默认', align: 'left', width: '120', display: { dict: 'WHETHER_TYPE' } }
          ],
          setting: {
            export: {
              key: 'cpsCompanyPayAccountExport',
              config: {
                fileName: '公司支付账户维护'
              },
              req: config.getPayAccounts
            },
            import: {
              key: 'cpsCompanyPayAccountImpot',
              business: 'cps-payCompanyAccount',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '修改',
                key: 'cpsCompanyPayAccountInfoUpdate',
                func: this.modifyRow
              },
              {
                text: '删除',
                key: 'cpsCompanyPayAccountDelete',
                func: this.deleteRow
              }
            ],
            toolbar: [
              {
                text: '新增',
                key: 'cpsCompanyPayAccountCreate',
                func: this.addPage
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
          companyCode: '',
          basicAccount: '',
          payAccount: ''
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
