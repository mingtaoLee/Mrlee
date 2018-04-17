<template>
  <i-layout header-key="cpsAccountSelectGet">
    <template slot="header">
      <i-form @search="search" @reset="reset" labelWidth="large">
        <el-form-item label="所在区域">
          <i-select-area  ref="selectArea" v-model="searchParam.areaId" search></i-select-area>
        </el-form-item>
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
        <el-form-item label="生效开始日期">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="date"
            :picker-options="effectStartOptions"
            @change="handleDateChange(searchParam.effectiveDateStart, 'searchParam', 'effectiveDateStart', 'string')"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="生效结束日期">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="date"
            :picker-options="effectEndOptions"
            :editable="false"
            @change="handleDateChange(searchParam.effectiveDateEnd, 'searchParam', 'effectiveDateEnd', 'string')">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效开始日期">
          <el-date-picker
            v-model="searchParam.uneffectiveDateStart"
            type="date"
            :editable="false"
            :picker-options="uneffectStartOptions"
            @change="handleDateChange(searchParam.uneffectiveDateStart, 'searchParam', 'uneffectiveDateStart', 'string')">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束日期">
          <el-date-picker
            v-model="searchParam.uneffectiveDateEnd"
            type="date"
            :editable="false"
            :picker-options="uneffectEndOptions"
            @change="handleDateChange(searchParam.uneffectiveDateEnd, 'searchParam', 'uneffectiveDateEnd', 'string')">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="执行日期起">
          <el-date-picker
            v-model="searchParam.executeDateStart"
            type="date"
            :editable="false"
            :picker-options="executeStartOptions"
            @change="handleDateChange(searchParam.executeDateStart, 'searchParam', 'executeDateStart', 'string')">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="执行日期止">
          <el-date-picker
            v-model="searchParam.executeDateEnd"
            type="date"
            :editable="false"
            :picker-options="executeEndOptions"
            @change="handleDateChange(searchParam.executeDateEnd, 'searchParam', 'executeDateEnd', 'string')">
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
            :data="tableScope.clone"
            border
            @selection-change="selectionChangeHandler(tableScope, $event)"
            v-loading="loading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
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
        ref="detailEditDialog"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit 
          ref="detailEdit" 
          :accountId="accountId"
          :toolbar="detailEditToolbar"
        ></detail-edit>
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
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req, { config } from 'api/iaf/company-rules'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import DetailEdit from './detail-edit'
  import AccountsCombine from './accounts-combine'
  import { showMessage, confirmPopover } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/iaf-pagination-mixin'
  import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
  import Access from 'mixins/access'
  import moment from 'moment'

  export default {
    mixins: [PaginationMixin, IafSearchMixin, Access],
    components: {
      ITable,
      ITableCell,
      IDialog,
      DetailEdit,
      ILayout,
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
            throttle: true,
            func: done => {
              return this.handleSave(done)
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
            { prop: 'accountCode', sortable: true, label: '户头代码', width: '120', align: 'left', fixed: true },
            { prop: 'accountName', label: '户头名称', width: '160', align: 'left', fixed: true },
            { prop: 'companyCode', label: '公司代码', align: 'left', width: '120' },
            { prop: 'companyName', label: '公司名称', width: '160', align: 'left' },
            { prop: 'accountType', label: '户头类型', align: 'center', width: '100', display: {dict: 'ACCOUNT_TYPE'} },
            { prop: 'insuredNumber', label: '参保人数', align: 'right', width: '120' },
            { prop: 'effectiveDate', label: '生效日期', align: 'center', width: '120', display: {date: ''} },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'center', width: '120', display: {date: ''} },
            { prop: 'provinceName', label: '省份', sortable: true, align: 'left', width: '120' },
            { prop: 'cityName', label: '城市', width: '120', align: 'left' },
            { prop: 'countryName', label: '区/县', width: '120', align: 'left' },
            { prop: 'unempAuditTime', label: '失业险年检时间', align: 'center', width: '120', display: {date: 'yyyy-MM'} },
            { prop: 'executeDate', label: '执行日期', align: 'center', width: '120', display: {date: 'default'} }
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
              business: 'iaf-account',
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
              func: this.addPolicy
            },
            // {
            //   key: 'cpsAccountMerging',
            //   text: '户头合并',
            //   func: this.combineAccounts
            // },
            {
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
          areaId: '',
          accountCode: '',
          accountName: '',
          companyCode: '',
          companyName: '',
          // securityNumber: '',
          bohrssName: '',
          employeeCode: '',
          fullName: '',
          accountType: '',
          tradeCode: '',
          trade: '',
          effectiveDateStart: '',
          effectiveDateEnd: '',
          executeDateStart: '',
          executeDateEnd: '',
          uneffectiveDateStart: '',
          uneffectiveDateEnd: ''
        }
      }
    },
    methods: {
      fetch (options = {}) {
        this.loading = true
        req('getAccounts', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
      },
      addPolicy () {
        this.title = '户头新增'
        this.accountId = ''
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.title = '户头修改'
        this.accountId = scope.row.accountId
        this.openDetailDialog()
      },
      deleteRow ({row}) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('accountByUsed', {accountId: row.accountId, accountType: row.accountType}).then(data => {
            req('deleteAccount', {accountId: row.accountId}).then(res => {
              if (res) {
                showMessage('success', '删除成功！')
                this.resetAllParam(1)
                this.fetch(this.allParam)
              } else {
                showMessage('danger', '删除失败！')
              }
            })
          })
        })
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleCancel (done) {
        done()
      },
      handleSizeChange (search, pageIndex, pageSize) {
        console.log(search, pageIndex, pageSize, 'handleSizeChange')
      },
      openPolicyDetail ({ row }) {
        this.$router.push({path: '/compensation/iaf/basic/area-policy-detail', query: {areaId: row.areaId, effectiveDate: moment(new Date(row.effectiveDate)).format('YYYY-MM-DD')}})
      },
      setInsurance ({ row }) {
        this.$router.push({path: '/compensation/iaf/basic/insurance-setting', query: { accountId: row.accountId, accountInfo: row }})
      },
      openAnnualAudit () {
        this.$router.push({ path: '/compensation/iaf/basic/insurance-annual-audit' })
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
