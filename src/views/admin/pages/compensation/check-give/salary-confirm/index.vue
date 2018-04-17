<template>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="payCalculateGet">
    <template slot="header">
      <i-form  @reset="reset" @search="search" >
         <el-form-item label="核算月份" >
           <el-date-picker
             v-model="searchParms.payMonth"
             type="month"
             placeholder="请选择"
             :editable="false"
            >
           </el-date-picker>
         </el-form-item>

         <el-form-item label="薪资组">
           <remote-select
            v-model="searchParms.groupId"
            :props="groupProps"
            dataKey="salaryGroup"
            :multiple="false"
            :collapseTags="false"
            :displayKeys="displayKeys"
            filterable
           ></remote-select>
          </el-form-item>

          <el-form-item label="工资类型">
            <i-select
             v-model="searchParms.componentListType"
             :maxlength="20"
             parameter="COMPONENT_LIST_TYPE"
             >
             </i-select>
          </el-form-item>
       </i-form>
     </template>
     <template slot="section">
        <i-table
         :table="table"
         v-loading="pageLoading"
         :element-loading-text="$loadingText"
         @pageSizeChange="handleSizeChange"
         @pageIndexChange="handleCurrentChange"
         >
          <template slot="table" slot-scope="tableScope">
            <el-table
              border
              :data="tableScope.clone"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="getStatus"
              >
                <el-table-column
                  type="selection"
                  width="55"
                  >
                </el-table-column>

                <el-table-column
                   v-for="(item, idx) in table.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :formatter="tableScope.formatter"
                  :align="item.align"
                  sortable
                 >
                </el-table-column>

                <i-table-operator :table="tableScope"/>
            </el-table>
          </template>
      </i-table>
    </template>
  </i-layout>
</template>

<script>
import req, { config } from 'api/compensation/check-give/salary-confirm'
import { showMessage, confirmPopover } from 'utils/index'
import access from 'mixins/access'
import searchMixin from '../mixins/searchMixin'
import RemoteSelect from 'components/compensation/remote-select/index'

export default {
  mixins: [access, searchMixin],
  components: {
    RemoteSelect
  },
  data () {
    return {
      loading: true,
      idselected: [],
      statusSelected: '01',
      searchParms: {
        payMonth: '',
        groupName: '',
        dictItemName: ''
      },
       // 工资组选择器配置
      groupProps: {
        value: 'groupId',
        label: 'groupName'
      },
      isRejcet: '01', // 判断是否可以驳回
      isapplyCancel: '01', // 判断是否可以申请取消(01代表按钮可以点)
      isConfirmCancel: '01', // 判断是否可以确认取消
      isrejectCancel: '01', // 判断是否可以驳回取消
      isapplyCount: '01', // 判断申请重算
      displayKeys: ['groupCode', 'groupName'],
      // 表格
      table: {
        columns: [
          { prop: 'groupCode', label: '薪资组代码', width: 120, align: 'center' },
          { prop: 'groupName', label: '薪资组', width: 140, align: 'left' },
          { prop: 'componentListName', label: '工资套', align: 'left', width: '120' },
          { prop: 'componentListType', label: '工资类型', width: 140, align: 'center', display: {dict: 'COMPONENT_LIST_TYPE'} },
          { prop: 'payMonth', label: '核算月份', width: 140, align: 'center' },
          { prop: 'calculateStatus', label: '状态', width: 140, align: 'center', display: {dict: 'CALCULATE_STATUS'} },
          { prop: 'totalNumber', label: '总人数', width: 150, align: 'right' },
          { prop: 'finalPayingAmount', label: '实发合计', width: 150, align: 'right', display: {mixin: (row, col) => this.currencyFormat(row[col])} }
        ],
        setting: {
          export: {
            req: config.getTolalsalary,
            config: {
              fileName: '工资确认明细表'
            },
            key: 'payCalculateSomeExport'
          },
          // 按钮
          toolbar: [
            // {
            //   text: '驳回',
            //   func: this.reject,
            //   // key: 'payCalculateConfirmPut',
            //   show: () => {
            //     return { disable: this.rejectIsDisabled() }
            //   }
            // },
            {
              text: '确认无误',
              func: this.confirmStatus,
              key: 'payCalculateConfirmPut',
              show: () => {
                return { disable: this.rejectIsDisabled() }
              }
            },
            {
              text: '申请重算',
              func: this.applyRecount,
              key: 'payCalculateRecomputeApplyPut',
              show: () => {
                return { disable: this.applyCountDisabled() }
              }
            },
            {
              text: '申请取消',
              func: this.applyCancel,
              key: 'payGroupcalculateConfirmCancellApplyPut',
              show: () => {
                return { disable: this.applyCancelDisabled() }
              }
            },
            {
              text: '确认取消',
              func: this.confirmCancel,
              key: 'payGroupcalculateConfirmUncalculateApplyPut',
              show: () => {
                return { disable: this.confirmCancelDisabled() }
              }
            },
            {
              text: '驳回取消',
              func: this.rejectCancel,
              key: 'payGroupcalculateConfirmPut',
              show: () => {
                return { disable: this.confirmCancelDisabled() }
              }
            }
          ],
          operator: [{
            text: '查看详细',
            key: 'payCalculateRecordsConfirmGet',
            func: this.detail     // 与 toolbar 类似，在 func 绑定相应的方法
          }]
        },
        data: [],
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      }
    }
  },
  mounted () {
    this.table.search = {}
  },
  methods: {
        // ---------------------------------页面通用----------------------------------------
    // 获取工资列表
    fetch (options = {}) {
      req('getTolalsalary', options)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(key => {
          this.table[key] = res[key]
        })
        this.pageLoading = false
        this.loading = false
      })
    },
    // --------------------------------------页面业务-------------------------------------------------------------
    // 获取groupCalculateId
    getGroupCalculateId (vm) {
      const selected = vm.getMultipleSelection().map(item => {
        return item.groupCalculateId
      })
      this.idselected = selected
    },
    // 获得数据状态
    getStatus (selection) {
      this.statusSelected = '01'
      this.isRejcet = '01'
      this.isapplyCount = '01'
      // 判断是否可以(驳回/确认无误）
      const isRejcetList = selection.every(function (status) {
        return status.calculateStatus === '04'
      })
      this.isRejcet = isRejcetList ? '01' : '02'
      // 判断申请重算（只有发起确认和重新计算可点）
      const isapplyCountList = selection.every(function (status) {
        return status.calculateStatus === '04' || status.calculateStatus === '01'
      })
      this.isapplyCount = isapplyCountList ? '01' : '02'
      // 判断是否可以申请取消（已确认05才可申请取消）
      const isapplyCancelList = selection.every(function (status) {
        return status.calculateStatus === '05'
      })
      this.isapplyCancel = isapplyCancelList ? '01' : '02'
      // 判断是否为可以(取消确认/驳回取消）（只有申请取消08）
      const isConfirmCancelList = selection.every(status => {
        return status.calculateStatus === '08'
      })
      this.isConfirmCancel = isConfirmCancelList ? '01' : '02'
    },
        // 按钮功能封装
    bottonOperation (message, request) {
      if (!this.idselected.length) return showMessage('info', '请选择至少一项！')
      confirmPopover('warning', message, () => {
        return req(request, this.idselected).then(res => {
          if (res) {
            this.getParms()
            this.table.search = this.reqParams
            showMessage('success', '申请成功!')
          } else {
            showMessage('danger', '申请失败!')
          }
        })
      })
    },
    // 按钮状态控制
    dataButtonIsDisabled () {
      if (this.statusSelected === '02') {
        return true
      }
    },
    // 驳回按钮状态控制
    rejectIsDisabled () {
      if (this.isRejcet === '02') {
        return true
      }
    },
    // 申请重算状态控制
    applyCountDisabled () {
      if (this.isapplyCount === '02') {
        return true
      }
    },
    // 申请取消取消按钮状态控制
    applyCancelDisabled () {
      if (this.isapplyCancel === '02') {
        return true
      }
    },
    // 确认取消按钮状态控制
    confirmCancelDisabled () {
      if (this.isConfirmCancel === '02') {
        return true
      }
    },
    // // 确认取消按钮状态控制
    // confirmCancelDisabled () {
    //   if (this.isapplyCancel === '02') {
    //     return true
    //   }
    // },
    // 驳回
    reject (vm) {
      this.getGroupCalculateId(vm)
      this.bottonOperation('确定要进行驳回吗？', 'reject')
    },
    // 确认无误
    confirmStatus (vm) {
      this.getGroupCalculateId(vm)
      this.bottonOperation('结果确认后，将不能再进行重新计算，确定要进行确认吗？', 'comfirmSalary')
    },
     // 申请重算
    applyRecount (vm) {
      this.getGroupCalculateId(vm)
      this.bottonOperation('确定要申请重算吗？', 'applySalary')
    },
    // 申请取消（只有已确认（05）状态的才可以申请取消）
    applyCancel (vm) {
      this.getGroupCalculateId(vm)
      this.bottonOperation('确定要申请取消吗？', 'applyCancel')
    },
    // 确认取消（只有申请取消（08）状态才可以确认取消
    confirmCancel (vm) {
      this.getGroupCalculateId(vm)
      this.bottonOperation('确定要确认取消吗？', 'confirmCancel')
    },
    // 驳回取消（只有驳回取消（08）状态才可以确认取消
    rejectCancel (vm) {
      this.getGroupCalculateId(vm)
      this.bottonOperation('确定要驳回取消吗？', 'rejectCancel')
    },
    // 查看详细
    detail (row) {
      // 获取当前行的groupCalculateId
      this.$router.push({path: '/compensation/check-give/salary-confirm-detail', query: { groupCalculateId: row.groupCalculateId }})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
