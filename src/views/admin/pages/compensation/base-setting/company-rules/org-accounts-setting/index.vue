<template>
  <i-layout headerKey="cpsPersonnelAccountSelectGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="人事范围代码">
          <el-input v-model="searchParam.personnelGroupCode"></el-input>
        </el-form-item>
        <el-form-item label="人事范围名称">
          <el-input v-model="searchParam.personnelGroupName"></el-input>
        </el-form-item>
        <el-form-item label="社保编号">
          <el-input v-model="searchParam.securityNumber"></el-input>
        </el-form-item>
        <el-form-item label="户头代码">
          <el-input v-model="searchParam.accountCode"></el-input>
        </el-form-item>
        <el-form-item label="户头名称">
          <el-input v-model="searchParam.accountName"></el-input>
        </el-form-item>
        <el-form-item label="开户社保局">
          <el-input v-model="searchParam.mohrssName"></el-input>
        </el-form-item>
        <el-form-item label="开户时间起">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="date"
            :picker-options="effectStartOptions"
            @change="handleEffectiveDateStartChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开户时间止">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="date"
            :picker-options="effectEndOptions"
            @change="handleEffectiveDateEndChange">
          </el-date-picker>
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
        <detail-edit ref="detailEdit" :accountPersonnelId="accountPersonnelId"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import moment from 'moment'
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req, { config } from 'api/compensation/base-setting/company-rules'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import DetailEdit from './detail-edit'
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
    data () {
      return {
        title: '',
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
            { prop: 'personnelGroupCode', label: '人事范围代码', sortable: true, align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', sortable: true, width: '140', align: 'left' },
            { prop: 'accountCode', label: '户头代码', width: '120', align: 'left' },
            { prop: 'insuranceType', label: '险种', width: '120', align: 'center', display: {dict: 'INSURANCE_TYPE'} },
            { prop: 'accountName', label: '户头名称', width: '140', align: 'left' },
            { prop: 'securityNumber', label: '社保编号', width: '120', align: 'center' },
            { prop: 'bohrssName', label: '开户社保局', width: '160', align: 'left' },
            { prop: 'openingDate', label: '开户时间', width: '120', align: 'center', display: {date: ''} },
            { prop: 'effectiveDate', label: '生效日期', width: '120', align: 'center', display: {date: ''} },
            { prop: 'uneffectiveDate', label: '失效日期', width: '120', align: 'center', display: {date: ''} }
          ],
          setting: {
            export: {
              config: {
                fileName: '人事范围户头'
              },
              key: 'cpsPersonnelAccountExport',
              req: config.getOrgAccounts
            },
            import: {
              key: 'cpsPersonnelAccountImport',
              business: 'cps-accountPersonnel',
              show: () => ({ empty: false })
            },
            operator: [
              {
                key: 'cpsPersonnelAccountUpdatePut',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsPersonnelAccountDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              key: 'cpsPersonnelAccountCreatePost',
              text: '新增',
              func: this.addPage
            }, {
              key: 'cpsPersonnelAccountBtn',
              text: '无户头人事范围',
              func: this.setNoneAccountsOrg
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          personnelGroupCode: '',
          personnelGroupName: '',
          accountCode: '',
          accountName: '',
          securityNumber: '',
          mohrssName: '',
          openingDate: '',
          effectiveDateStart: '',
          effectiveDateEnd: '',
          effectiveDate: null,
          uneffectiveDate: null
        }
      }
    },
    methods: {
      fetch (options = {}) {
        this.load()
        req('getOrgAccounts', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },
      handleOpeningDate (value) {
        this.searchParam.openingDate = moment(value).format('YYYY-MM-DD')
      },
      addPage () {
        this.title = '人事范围户头新增'
        this.accountPersonnelId = ''
        this.openDetailDialog()
      },
      setNoneAccountsOrg () {
        this.$router.push({ path: '/compensation/base-setting/company-rules/none-accounts-org' })
      },
      modifyRow (scope) {
        this.title = '人事范围户头修改'
        this.accountPersonnelId = scope.row.accountPersonnelId
        this.openDetailDialog()
      },
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('deleteOrgAccount', {accountPersonnelId: scope.row.accountPersonnelId}).then(res => {
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
