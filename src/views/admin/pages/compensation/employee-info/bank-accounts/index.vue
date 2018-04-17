<template>
  <i-layout headerKey="cpsEmployeeAccountGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchParam.employeeName"></el-input>
        </el-form-item>
        <el-form-item label="薪资组">
          <remote-select
            v-model="searchParam.groupId"
            dataKey="salaryGroup"
            placeholder="请输入代码或名称搜索"
            :displayKeys="['groupCode', 'groupName']"
            :props="groupProps"
          ></remote-select>
        </el-form-item>
        <el-form-item label="组织名称">
          <i-select-tree
            v-model="searchParam.orgUnitId"
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            size="small"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="账户类型">
          <i-select v-model="searchParam.cardType" parameter="CARD_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="发放方式">
          <i-select v-model="searchParam.deliverType" parameter="DELIVER_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="开户银行">
          <i-select v-model="searchParam.bankCode" parameter="BANK_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="生效开始日期">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="date"
            :picker-options="effectStartOptions"
            @change="handleEffectiveDateStartChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束日期">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="date"
            :picker-options="effectEndOptions"
            @change="handleEffectiveDateEndChange"
          ></el-date-picker>
        </el-form-item>
      </i-form>
    </template>
    <template slot="section">
      <i-table
        ref="table"
        class="table"
        :table="table"
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
        <detail-edit ref="detailEdit" :idKey="idKey" :editorStatus="editorStatus" :empAccountId="empAccountId"></detail-edit>
      </i-dialog>
      <!-- <i-dialog
        v-model="isShowDialog"
        title="员工银行账户修改"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :empAccountId="empAccountId"></detail-edit>
      </i-dialog> -->
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, {config} from 'api/compensation/employee-info/bank-accounts'
  import DetailEdit from './detail-edit'
  // import {showMessage, confirmPopover} from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    components: {
      DetailEdit,
      RemoteSelect
    },
    mixins: [PaginationMixin, SearchDateMixin, Access],
    data () {
      return {
        reqConfig: { req: req, getName: 'getBankAccounts', deleteName: 'deleteBankAccount', deleteListName: 'deleteBankAccounts' },
        idKey: 'empAccountId',
        title: '员工银行账户',
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
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

        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', sortable: true, align: 'left', width: '120', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', width: '120', align: 'left', fixed: 'left' },
            { prop: 'orgUnitCode', label: '组织代码', width: '120', align: 'left' },
            { prop: 'orgUnitName', label: '组织名称', width: '120', align: 'left' },
            { prop: 'groupName', label: '薪资组', width: '120', align: 'left' },
            { prop: 'cardType', label: '账户类型', width: '120', display: {dict: 'CARD_TYPE'}, align: 'left' },
            { prop: 'account', label: '银行卡号', width: '120', align: 'left' },
            { prop: 'bankCode', label: '开户银行', width: '140', display: {dict: 'BANK_TYPE'}, align: 'left' },
            { prop: 'provinceName', label: '开户行省份', sortable: true, width: '140', align: 'left' },
            { prop: 'cityName', label: '开户行城市', width: '140', align: 'left' },
            { prop: 'bankName', label: '开户行名称', width: '140', align: 'left' },
            { prop: 'deliverType', label: '发放方式', width: '120', display: {dict: 'DELIVER_TYPE'}, align: 'left' },
            { prop: 'effectiveDate', label: '生效日期', align: 'left', width: '120', display: {date: 'default'} },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'left', width: '120', display: {date: 'default'} }
          ],
          setting: {
            export: {
              config: {
                fileName: '员工银行账户',
                sync: {
                  page: true,
                  select: true,
                  all: false
                }
              },
              key: 'cpsEmployeeAccountExport',
              req: config.getBankAccounts
            },
            import: {
              key: 'cpsEmpAccountImportPost',
              business: 'cps-employeeAccount',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '修改',
                key: 'cpsEmployeeAccountPut',
                func: this.modifyRow
              // }, {
              //   text: '删除',
              //   key: 'empAccountDelete',
              //   func: this.deleteRow
              }
            ],
            toolbar: [{
              key: 'cpsEmployeeAccountPost',
              text: '新增',
              func: this.addPage
            }, {
              text: '删除',
              key: 'cpsEmployeeAccountBatchDelete',
              type: 'danger',
              func: this.delete
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          employeeName: '',
          employeeCode: '',
          groupName: '',
          groupId: '',
          effectiveDateEnd: '',
          effectiveDateStart: '',
          cardType: '',
          orgUnitId: '',
          deliverType: '',
          account: '',
          bankCode: ''
        }
      }
    },
    methods: {
      /** 打开员工银行账号设置页面 */
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
