<template>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="cpsAccountPolicySelectGet" v-cloak>
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="保险类型">
          <i-select v-model="searchParam.insuranceType" parameter="INSURANCE_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="户口性质">
          <i-select v-model="searchParam.householdCode" parameter="IAF_ACCOUNT_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="户头管理员">
          <el-input v-model="searchParam.fullName"></el-input>
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
        @save="getTableData"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            border
            :data="tableScope.clone"
            @selection-change="selectionChangeHandler(tableScope, $event)">
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              label="保险代码"
              prop="insuranceType"
              width="120"
              sortable
              align="center"
            ></el-table-column>
            <el-table-column
              label="保险类型"
              sortable
              prop="insuranceType"
              :formatter="tableScope.formatter"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column
              label="户头管理员工号"
              prop="employeeCode"
              width="130"
              align="center"
            ></el-table-column>
            <el-table-column
              label="户头管理员姓名"
              prop="fullName"
              width="130"
              align="left"
            ></el-table-column>
            <el-table-column
              label="户头管理员电话"
              prop="mobile"
              width="130"
              align="center"
            ></el-table-column>
            <el-table-column
              label="省份"
              width="120"
              align="left"
              prop="provinceName"
            ></el-table-column>
            <el-table-column
              label="城市"
              width="120"
              align="left"
              prop="cityName"
            ></el-table-column>
            <el-table-column
              label="区/县"
              width="120"
              align="left"
              prop="countryName"
            ></el-table-column>
            <el-table-column
              label="户口性质"
              prop="householdCode"
              width="120"
              align="center"
              :formatter="tableScope.formatter"
            ></el-table-column>
            <el-table-column label="个人缴纳">
              <el-table-column
                label="基数上限"
                width="100"
                align="right"
                prop="empPayBaseLimit"
              ></el-table-column>
              <el-table-column
                label="基数下限"
                align="right"
                width="100"
                prop="empPayBaseLower"
              ></el-table-column>
              <el-table-column
                label="比例%"
                align="right"
                width="100"
                prop="empPayRatio"
              ></el-table-column>
              <el-table-column
                label="固定金额"
                align="right"
                width="100"
                prop="empPayFixedAmount"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="公司缴纳">
              <el-table-column
                label="基数上限"
                align="right"
                width="100"
                prop="compPayBaseLimit"
              ></el-table-column>
              <el-table-column
                align="right"
                width="100"
                label="基数下限"
                prop="compPayBaseLower"
              ></el-table-column>
              <el-table-column
                label="比例%"
                align="right"
                width="100"
                prop="compPayRatio"
              ></el-table-column>
              <el-table-column
                label="固定金额"
                align="right"
                width="100"
                prop="compPayFixedAmount"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column
              label="生效日期"
              align="center"
              width="120"
              prop="effectiveDate"
              :formatter="tableScope.formatter"
            ></el-table-column>
            <el-table-column
              label="失效日期"
              align="center"
              width="120"
              prop="uneffectiveDate"
              :formatter="tableScope.formatter"
              disabled="true"
            ></el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="title"
        size="large"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :areaId="accountInfo.areaId" :accountId="accountId" :accountPolicyId="accountPolicyId"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req, { config } from 'api/compensation/base-setting/company-rules'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import DetailEdit from './detail-edit/index.vue'
  import { showMessage, confirmPopover } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
      ITable,
      ITableCell,
      IDialog,
      DetailEdit,
      ILayout
    },
    props: {
      accountInfo: Object,
      accountId: String
    },
    data () {
      return {
        accountPolicyId: '',
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
          title: `户头代码：${this.accountInfo.accountCode} ` + ' ' + `户头名称：${this.accountInfo.accountName}`,
          columns: [
            {prop: 'insuranceType', display: { dict: 'INSURANCE_TYPE' }},
            {prop: 'areaId', display: {dict: 'INSURANCE_TYPE'}},
            {prop: 'householdCode', display: {dict: 'IAF_ACCOUNT_TYPE'}},
            {prop: 'empPayFixedAmount', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'compPayFixedAmount', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'effectiveDate', display: { date: '' }},
            {prop: 'uneffectiveDate', display: { date: '' }}
          ],
          setting: {
            export: {
              config: {
                fileName: '五险一金'
              },
              key: 'cpsAccountPolicyExport',
              req: config.getInsuranceList,
              param: () => ({accountId: this.accountId})
            },
            import: {
              key: 'cpsAccountPolicyImport',
              business: 'cps-account-policy',
              show: () => ({ empty: false })
            },
            operator: [
              {
                key: 'cpsAccountPolicyUpdatePut',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsAccountPolicyDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '返回',
              type: 'plain',
              func: this.back
            }, {
              key: 'cpsAccountPolicyCreatePost',
              text: '新增',
              func: this.add
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          insuranceType: '',
          fullName: '',
          householdCode: '',
          effectiveDate: '',
          uneffectiveDate: ''
        }
      }
    },
    created () {
      console.log(this.accountInfo, this.$route.query.accountInfo)
    },
    methods: {
      fetch (options = {}) {
        req('getInsuranceList', {accountId: this.accountId, ...options}).then(res => {
          res = res.accountPolicyDtoList
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },
      add () {
        this.title = '五险一金新增'
        this.accountPolicyId = ''
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.title = '五险一金修改'
        this.accountPolicyId = scope.row.accountPolicyId
        this.openDetailDialog()
      },
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('deleteInsuranceDetail', {accountId: this.accountId, accountPolicyId: scope.row.accountPolicyId}).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              this.fetch({accountId: this.accountId, ...this.allParam})
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      setFiveOne (scope) {
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleSave (done) {
        this.$refs.detailEdit.save().then(res => {
          if (res) {
            this.fetch({accountId: this.accountId})
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
