<template>
  <i-layout headerkey="cpsAccountSelectGet">
    <template slot="header">
      <i-form @search="search" @reset="reset" labelWidth="large">
        <el-form-item label="户头代码">
          <el-input v-model="searchParam.accountCode"></el-input>
        </el-form-item>
        <el-form-item label="户头名称">
          <el-input v-model="searchParam.accountName"></el-input>
        </el-form-item>
        <el-form-item label="公司代码">
          <el-input v-model="searchParam.companyCode"></el-input>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="searchParam.companyName"></el-input>
        </el-form-item>
        <el-form-item label="户头类型">
          <i-select v-model="searchParam.accountType" parameter="ACCOUNT_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="社保编号">
          <el-input v-model="searchParam.securityNumber"></el-input>
        </el-form-item>
        <el-form-item label="开户社保局">
          <el-input v-model="searchParam.bohrssName"></el-input>
        </el-form-item>
        <el-form-item label="户头管理员工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="户头管理员姓名">
          <el-input v-model="searchParam.fullName"></el-input>
        </el-form-item>
        <el-form-item label="行业代码">
          <el-input v-model="searchParam.tradeCode"></el-input>
        </el-form-item>
        <el-form-item label="行业">
          <el-input v-model="searchParam.trade"></el-input>
        </el-form-item>
        <!--<el-form-item label="是否失效">-->
          <!--<el-input v-model="searchParam.isEffective"></el-input>-->
        <!--</el-form-item>-->
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
        <el-form-item label="执行日期起">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="date"
            @change="handleEffectiveDateStartChange"
            :picker-options="effectStartOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="执行日期止">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="date"
            @change="handleEffectiveDateEndChange"
            :picker-options="effectEndOptions">
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
              :fixed="col.fixed"
              :sortable="sortable"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
            <el-table-column
              v-if="accessMap['cpsAccountAreaPolicyBtn']"
              label="地方社保政策"
              width="130"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="openPolicyDetail(scope)" size="mini">政策详情</el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-if="accessMap['cpsAccountPolicyBtn']"
              label="保险设置"
              width="100"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="setInsurance(scope)" size="mini">设置</el-button>
              </template>
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
        <detail-edit ref="detailEdit" :accountId="accountId"></detail-edit>
      </i-dialog>
      <i-dialog
        v-model="isShowCombineDialog"
        title="户头合并"
        :toolbar="combineToolbar"
        destroyedWhenClose
      >
        <accounts-combine ref="accountsCombine" :accountSelected="accountSelected" :accountId="accountId"></accounts-combine>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/base-setting/company-rules'
  import DetailEdit from './detail-edit'
  import AccountsCombine from './accounts-combine'
  import { showMessage, confirmPopover } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
      DetailEdit,
      AccountsCombine
    },
    data () {
      return {

        // 详情编辑
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

        // 户头合并
        combineToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              done()
            }
          },
          {
            text: '确认',
            func: done => this.handleAccountsCombineSave(done)
          }
        ],
        isShowCombineDialog: false,
        accountSelected: [],

        // 表格
        table: {
          columns: [
            { prop: 'accountCode', sortable: true, label: '户头代码', width: '120', align: 'left' },
            { prop: 'accountName', label: '户头名称', width: '160', align: 'left' },
            { prop: 'companyCode', label: '公司代码', align: 'left', width: '120' },
            { prop: 'companyName', label: '公司名称', width: '160', align: 'left' },
            { prop: 'accountType', label: '户头类型', align: 'left', width: '100', display: {dict: 'ACCOUNT_TYPE'} },
            { prop: 'insuredNumber', label: '参保人数', align: 'right', width: '120' },
            { prop: 'securityNumber', label: '社保编号', align: 'left', width: '120' },
            { prop: 'openingDate', label: '开户时间', align: 'left', width: '120', display: {date: ''} },
            { prop: 'bohrssName', label: '开户社保局', align: 'left', width: '120' },
            { prop: 'employeeCode', label: '户头管理员工号', align: 'left', width: '140' },
            { prop: 'fullName', label: '户头管理员姓名', width: '120', align: 'left' },
            { prop: 'mobile', label: '户头管理员电话', align: 'left', width: '140' },
            { prop: 'effectiveDate', label: '生效日期', align: 'left', width: '120', display: {date: ''} },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'left', width: '120', display: {date: ''} },
            { prop: 'addApplyDate', label: '增员申请时间', align: 'left', width: '130', display: {date: ''} },
            { prop: 'addEffectiveDate', label: '增员生效时间', align: 'left', width: '130', display: {date: ''} },
            { prop: 'delApplyDate', label: '减员申请时间', align: 'left', width: '130', display: {date: ''} },
            { prop: 'delEffectiveDate', label: '减员生效时间', align: 'left', width: '130', display: {date: ''} },
            { prop: 'provinceName', label: '省份', sortable: true, align: 'left', width: '120' },
            { prop: 'cityName', label: '城市', width: '120', align: 'left' },
            { prop: 'countryName', label: '区/县', width: '120', align: 'left' },
            { prop: 'unempAuditTime', label: '失业险年检时间', align: 'left', width: '120' },
            { prop: 'tradeCode', label: '行业代码', align: 'left', width: '120' },
            { prop: 'trade', label: '行业', align: 'left', width: '120' },
            { prop: 'executeDate', label: '执行日期', align: 'left', width: '120', display: {date: 'default'} }
          ],
          setting: {
            export: {
              key: 'cpsAccountExport',
              config: {
                fileName: '户头数据'
              },
              req: config.getAccounts
            },
            import: {
              key: 'cpsAccountImport',
              business: 'cps-account',
              show: () => ({ empty: false })
            },
            operator: [
              {
                key: 'cpsAccountUpdatePut',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsAccountDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              key: 'cpsAccountCreatePost',
              text: '新增',
              func: this.addPage
            }, {
              key: 'cpsAccountMerging',
              text: '户头合并',
              func: this.combineAccounts
            }, {
              key: 'cpsAccountUnemploymentBtn',
              text: '失业险年审',
              func: this.openAnnualAudit
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          accountCode: '',
          accountName: '',
          companyCode: '',
          companyName: '',
          securityNumber: '',
          bohrssName: '',
          employeeCode: '',
          fullName: '',
          accountType: '',
          tradeCode: '',
          trade: '',
          effectiveDateStart: '',
          effectiveDateEnd: '',
//          isEffective: '',
          effectiveDate: null,
          uneffectiveDate: null
        }
      }
    },
    methods: {
      fetch (options = {}) {
        this.load()
        req('getAccounts', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },
      addPage () {
        this.title = '户头新增'
        this.accountId = ''
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.title = '户头修改'
        this.accountId = scope.row.accountId
        this.openDetailDialog()
      },
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('deleteAccount', {accountId: scope.row.accountId}).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              this.resetAllParam(1)
              this.fetch(this.allParam)
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleCancel (done) {
        done()
      },
      openPolicyDetail ({ row }) {
        this.$router.push({path: '/compensation/base-setting/company-rules/security-policy-detail', query: {areaId: row.areaId}})
      },
      setInsurance ({ row }) {
        this.$router.push({path: '/compensation/base-setting/company-rules/insurance-setting', query: { accountId: row.accountId, accountInfo: row }})
      },
      openAnnualAudit () {
        this.$router.push({ path: '/compensation/base-setting/company-rules/insurance-annual-audit' })
      },
      combineAccounts (vm) {
        const selected = vm.getMultipleSelection()
        if (selected.length === 0) {
          return showMessage('info', '请选择户头')
        }
        if (this.isTypeRepeat(selected)) {
          return showMessage('info', '请选择相同户头类型数据！')
        }
        this.openCombineDialog(selected)
      },
      openCombineDialog (selected) {
        this.accountSelected = selected
        this.isShowCombineDialog = true
      },
      handleAccountsCombineSave (done) {
        this.$refs.accountsCombine.save().then(res => {
          if (res) {
            showMessage('success', '户头合并成功！')
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            done()
          }
        })
      },
      isTypeRepeat (selected) {
        let type = selected[0].accountType
        for (let item of selected) {
          if (item.accountType !== type) {
            return true
          }
        }
        return false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
