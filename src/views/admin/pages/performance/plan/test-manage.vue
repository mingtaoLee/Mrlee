<template>
  <div class="detail-manage-container" v-loading.body="bigLoading">
    <i-layout>
      <div class="my-header" slot="header">
      <div class="header-item name-item">
        <span class="label">方案名称:</span>
        <span class="value">{{schemeDetailData.schemeName}}</span>
      </div>
      <div class="header-item">
        <span class="label">方案状态:</span>
        <!-- 0:启用，1:禁用 -->
        <span>{{schemeDetailData.status | schemeStatus}}</span>
      </div>
      <div class="header-item">
        <span class="label">方案年度:</span>
        <span>{{schemeDetailData.year}}</span>
      </div>
      <div class="header-item">
        <span class="label">适用范围:</span>
        <span>{{schemeDetailData.orgName}}</span>
      </div>
      <div class="back-icon" @click="goBack">
        <i class="el-icon-back"></i>
      </div>

    </div>

      <!-- TODO 部门筛选的组件 -->

        <section class="plans-table-data" slot="section" v-show="schemeDetailData.periods && schemeDetailData.periods.length">

      <div class="month-tab__performance">
          <el-tabs v-model="params.period" @tab-click="handleTabClick">
            <el-tab-pane
            v-for="(item, index) in schemeDetailData.periods"
            :name="item.period"
            :key="index"
            :label="`${ monthFormatter(item.period)}(${statusFormatter(item.projectStatus)})`"></el-tab-pane>
          </el-tabs>
        </div>

        <i-form
        @search="doSearch"
        @reset="reset"
        v-if="+status !== -1 && accessMap.pfmStagePerformanceListGet" class="pfm-form"
        >
          <el-form-item label="工号">
            <el-input v-model="params.employeeCode" ></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="params.employeeName"></el-input>
          </el-form-item>
          <el-form-item label="组织">
            <i-select-tree
            dataKey="org"
            v-model="params.orgId"
            nodeKey="orgUnitId"
            clearable
            ></i-select-tree>
          </el-form-item>
          <!-- <el-form-item label="职位">
            <i-select-tree
            dataKey="jobFamilys"
            nodeKey="posJobFamilyId"
            :lazy="false"
            v-model="params.position"
            :props="jobProps"
            clearable
            ></i-select-tree>
          </el-form-item> -->
          <el-form-item label="计划状态" >
            <el-select
              v-model="params.planManageStatus"
              placeholder="选择计划状态"
              multiple
              collapse-tags
              clearable
              >
              <el-option
                v-for="item in planStatusDict"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                ></el-option>
            </el-select>
          </el-form-item>
        </i-form>
          <div class="table-header">
             <!-- 方案状态信息 -->
            <plan-status :status="status" :initData="staticsData" v-if="+status >= 2" @rankClick="showPlanAnlyze" class="plan-status mt20"></plan-status>
          </div>

       <!-- 表格筛选条件 字典planManageStatusDict-->
      <section class="create-area"
      v-if="+status === -1 && +schemeDetailData.status !== 0 &&accessMap.pfmPlanPost ">
        <el-button type="primary" @click="createPlan" class="create-btn font-size-large">生成计划</el-button>
      </section>

      <section
      v-if="+schemeDetailData.status === 0"
      class="create-area font-size-large">
          <div>绩效方案已经失效</div>
      </section>

      <section
      v-if="+status >= 0 && +schemeDetailData.status !== 0"
      class="performance-table-wrapper">
        <div class="table">
          <i-table
            :table="tableConfig"
            @pageSizeChange="handleSizeChange"
            @pageIndexChange="handlePageChange">
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                @selection-change="selectionChangeHandler(tableScope, $event)"
                @cell-click="handleTableCellClick">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="工号" prop="employeeCode" sortable/>
                <el-table-column label="姓名" prop="employeeName" show-overflow-tooltip>
                  <template slot-scope="nameScope">
                    <span style="cursor:pointer;color:#3da5fe;">{{nameScope.row.employeeName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                label="组织"
                prop="orgName"
                show-overflow-tooltip></el-table-column>
                <el-table-column
                label="职位名称"
                prop="position"
                sortable
                show-overflow-tooltip ></el-table-column>
                <el-table-column
                label="计划状态"
                prop="planManageStatus"
                :formatter="tableScope.formatter"
                sortable
                align="center"></el-table-column>
                <el-table-column label="总分" prop="totalScore" v-if="status >= 3 && status !== null"></el-table-column>
                <el-table-column label="等级" prop="level" v-if="status >= 4 && status !== null"></el-table-column>

                <el-table-column label="操作" width="250" fixed="right" align="center">
                  <template slot-scope="scope">
                    <table-column-btn
                    :status="status"
                    :schemeStatus="schemeDetailData.status"
                    :rowStatus="scope.row.processStatus"
                    :row="scope.row"
                    :tableAssessmentSelected="tableAssessmentSelected"
                    :isCalculateByChildren = "isCalculateByChildren"
                    style="display: inline-block"
                    @showAdjustment = "handleShowAdjust(scope.row)"
                    @modifyAssessment="modifyTableAssessment"
                    ></table-column-btn>

                    <el-button
                    type="text"
                    @click="deleteSingleRow(scope.$index)"
                    v-if="Number(status) < 4 && schemeDetailData.status === '1' && accessMap.pfmPlansDelete"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>

          </i-table>

        </div>
      </section>
    </section>

    </i-layout>

   <section class="dialog-area">
      <!-- 员工详情弹窗 -->
      <i-dialog title="员工信息" v-model="showPersonInfo" v-if="showPersonInfo" size="mini" :toolbar="dialogToolBar">
        <person-info :initData="personInfo"></person-info>
      </i-dialog>
      <!-- 员工考勤 -->
      <i-dialog v-model="showAssementRelation" title="设置考核关系" size="standard">
         <asessment-relation
            :selectedEmployees="selectedRows"
            @selectPerson="showAssessment"
            :assessment.sync="assessmentObj"
            :period="params.period"
            :schemeId="params.schemeId"
            @confirm="assessmentFinish"
            v-if="showAssementRelation"
            @close="handleAssessmentClose"
        ></asessment-relation>
      </i-dialog>

      <!-- 等级调整 -->
      <i-dialog title="等级调整" v-model="showRankAdjustment" v-if="showRankAdjustment">
        <rank-adjustment
        :showSelf.sync="showRankAdjustment"
        :row="currentRow"
        @reload="handleRankReload"
        ></rank-adjustment>
      </i-dialog>

       <!--分析结果 -->
      <i-dialog
        title="分析结果"
        v-model="showAnalytics"
        v-if="showAnalytics"
        :toolbar="dialogToolBar"
        >
        <rank-anlystics :statisticsData="staticsData" :period="params.period" :schemeId="params.schemeId"></rank-anlystics>
      </i-dialog>

      <!-- 外部考核关系选择 -->
      <i-personnel-select
      :isShow.sync="showPersonSelect"
      v-if="showPersonSelect"
      @confirm="assessmentPersonSelected"
      :multiple="multipleSelect"></i-personnel-select>

      <!-- 考核对象选择 -->
      <add-target
      :show.sync="showAddTarget"
      v-if="showAddTarget"
      :schemeId="params.schemeId"
      :period="params.period"
      ></add-target>
    </section>
    <i-upload-dialog
      :upload-api="`/performance/schemes/${this.params.schemeId}/periods/${this.params.period}/plans/import`"
      sample-url="/templates/pfmPlanTemplate/download"
      :can-visit.sync="uploadDialogFlag">
    </i-upload-dialog>
  </div>
</template>

<script>
import {
  planManageStatusDict,
  periodDict,
  periodStatusDict,
  btnTextDict
} from '@/config/dict'
// import { selectMutiId, filterId } from 'utils/performance'
import { findDictLabel, clone } from 'utils/index'
import { pageSize } from '../../../../../config/constant'
import req, {config} from 'api/performance/plan-manage.js'
import tableBtns from './detail-manage-btns'
import planStatus from './plan-status'
import IForm from 'components/common/i-form/i-form.vue'
import iSelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import iDialog from 'components/common/i-dialog/i-dialog'
import iLayout from 'components/common/i-layout'
import iTable from 'components/common/i-table'
import iTableOperator from 'components/common/i-table-operator'
import tableColumnBtn from './table-column-btn'
import {funcs} from './main-btn-funcs'
// 上传对话框组件 zhengwq5 2017/11/25 add
import IUploadDialog from 'components/common/i-upload-dialog'
import access from 'mixins/access'
export default {

  mixins: [access],

  data () {
    // const that = this
    return {
      bigLoading: false,
      dialogToolBar: [
        {
          text: '确定',
          type: 'primary',
          func: done => {
            done()
          }
        },
        {
          text: '取消',
          type: 'text',
          func: done => {
            done()
          }
        }
      ],
      planStatusDict: planManageStatusDict,
      status: '0', // 当前计划状态
      isCalculateByChildren: '', // 是否由自周期控制
      params: { // 表格查询参数
        schemeId: '',
        orgId: '',
        planManageStatus: [],
        employeeName: '',
        employeeCode: '',
        period: ''
      },
      pageSizes: pageSize,
      total: 0,
      // 方案详细信息和period数据
      schemeDetailData: {
        periods: []
      },
      // 统计数据
      staticsData: {},
      // 列表数据
      tableData: [],
      // 列表勾选项
      selectedRows: [],
      currentRow: {},
      // dialog显示控制
      showPersonInfo: false,
      personInfo: {},
      showAssementRelation: false,
      showRankAdjustment: false,
      showAnalytics: false,
      showPersonSelect: false,
      showTableAssessment: false,
      // 人员选择多选控制
      multipleSelect: false,
      // 人物勾选储存
      // 外层添加考核关系的数组
      selectedPerson: [],
      // 表格中添加考核关系的数组
      tableAssessmentSelected: [],
      // 添加考核对象的数组
      addTarget: [],
      isAddTarget: false,
      assessmentObj: {
        leader: {},
        assessmenter: [],
        collector: {},
        collectLeader: {}
      },
      currentAssessment: '',
      tableCurrentAssessment: '',
      isInit: true,
      tabIndex: null,
      showAddTarget: false,
      // 上传对话框标志 zhengwq5 2017/11/25 add
      uploadDialogFlag: false,
      jobProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      // itable table控制参数
      tableConfig: {
        data: [],
        total: 0,
        info: null,
        showPagebar: true,
        search: null,
        columns: [
          { prop: 'planManageStatus', display: { dict: 'PLAN_MANAGE_STATUS' } }
        ],
        setting: {
          toolbar: [
            {
              text: '',
              func: () => this.handleProjectStatusChange(),
              key: 'pfmPlansEnablePost',
              show: () => {
                let res
                if (Number(this.status > 5)) {
                  res = false
                } else if (this.status === '1' || this.status === '2') {
                  if (this.schemeDetailData.isCalculateByChildren === 'Y') {
                    res = false
                  } else {
                    res = true
                  }
                } else {
                  res = true
                }
                return {empty: !res}
              }
            },
            {
              text: '添加考核对象',
              func: () => this.addTargetPerson(),
              key: 'pfmPlansStaffsPost',
              show: () => {
                let res
                ;(this.status === '0' || this.status === '1' || this.status === '2') ? res = true : res = false
                return {empty: !res}
              }
            },
            {
              text: '设置考核关系',
              func: () => this.doBigAssessment(),
              key: 'pfmPlansCheckRalationPost',
              show: () => {
                let res
                ;(this.status === '1' || this.status === '2') ? res = true : res = false
                return {empty: !res}
              }
            },
            {
              text: '发送消息提醒',
              func: vm => this.sendMessage(vm),
              key: 'pfmSendMessageNotification',
              show: () => {
                let res
                ;(this.status === '1' || this.status === '2') ? res = true : res = false
                return {empty: !res}
              }
            },
            {
              text: '删除',
              key: 'pfmPlansDelete',
              func: (vm) => {
                this.delete(vm.getMultipleSelection())
              },
              show: () => {
                let res
                (+this.status === 1) || (+this.status === 0) || (+this.status === 2) ? res = true : res = false
                return {empty: !res}
              }
            }
          ],
          import: {
            business: 'pfm-paln',
            key: 'pfmPlanImportPost',
            params: {
              schemeId: null
            },
            show: () => (this.status === '0' || this.status === '1' || this.status === '2') ? {empty: false} : {empty: true}
          },
          export: {
            text: '导出',
            key: 'pfmPlanExportPost',             // 不合规范，以自身业务为准【可选】
            config: {                      // 【可选】
              fileName: '绩效计划数据'            // 默认文件名
              // version: '',              // 默认后缀
              // range: '',                // 默认范围
              // sync: true                // 默认方式（同步/异步）
            },
            req: config.getPlanList,
            param: () => { return {schemeId: this.params.schemeId, period: this.params.period} }     // api 配置信息（参数名以自身业务为准）【必填】
          }

        }
      }
    }
  },
  methods: {
    goBack () {
      this.$router.push('/performance/plan/manage')
    },
    // 发送消息提醒
    sendMessage (vm) {
      // let arr = vm.getMultipleSelection().map(ele => ele.planId)
      // if (!arr.length) {
      //   this.$message({
      //     message: '请选择发送消息的计划',
      //     type: 'warning'
      //   })
      //   return
      // } else {

      // }
      this.$msgbox.confirm('是否给未开始计划的员工发送提醒?', '确认').then(() => {
        req('postMessages', {schemeId: this.params.schemeId, period: this.params.period}).then(() => {
          this.$message({
            type: 'success',
            message: '发送消息成功'
          })
        })
      })
    },
    showPlanAnlyze () {
      this.showAnalytics = true
    },
    createPlan () {
      req('createPlan', {
        schemeId: this.params.schemeId,
        period: this.params.period
      }).then(() => {
        this.getSchemeInfo()
      })
    },
    handleAssessmentClose () {
      this.assessmentObj = {
        leader: {},
        assessmenter: [],
        collector: {},
        collectLeader: {}
      }
      this.multipleSelect = false
      this.showAssementRelation = false
    },
    handleRankReload () {
      this.getPlanTableData(this.tableConfig.info)
      this.getSchemeStatics()
    },
    doSearch () {
      let tmp = this.getQuery
      if (tmp.planManageStatus) tmp.planManageStatus = tmp.planManageStatus.join(',')
      this.tableConfig.search = {...tmp}
    },
    showAssessment (val) {
      if (val) this.currentAssessment = val
      val === 'assessmenter'
        ? (this.multipleSelect = true)
        : (this.multipleSelect = false)
      this.showPersonSelect = true
    },
    // 表格考核关系处理
    modifyTableAssessment (val) {
      // console.log(val)
      this.showPersonSelect = true
      this.tableCurrentAssessment = val
    },
    doBigAssessment () {
      if (this.selectedRows.length > 0) {
        this.showAssementRelation = true
      } else {
        this.$message({
          message: '请在列表中选择员工',
          type: 'warning'
        })
      }
    },
    // 选人组件的confirm函数
    assessmentPersonSelected (arr) {
      // 判断此时进行的是设置考核关系
      if (this.currentAssessment !== '') {
        this.selectedPerson = arr
        if (this.currentAssessment === 'assessmenter') {
          this.assessmentObj[this.currentAssessment] = arr
        } else {
          this.assessmentObj[this.currentAssessment] = arr[0]
        }
        this.currentAssessment = ''
        // 判断此时进行的是行内设置考核关系
      } else if (!this.isAddTarget && this.tableCurrentAssessment !== '') {
        if (this.tableCurrentAssessment.indexOf('evaluator') !== -1) {
          let config = this.tableCurrentAssessment.split('.')
          this.$set(
            this.storeTableAssessment[config[0]],
            [Number(config[1])],
            arr[0]
          )
        } else {
          this.storeTableAssessment[this.tableCurrentAssessment] = arr[0]
        }
        this.$store.commit('PER_SET_ASSESSMENT', this.storeTableAssessment)
        this.tableCurrentAssessment = ''
        // 此时为设置考核对象
      } else {
        this.doAddTarget(arr)
      }
    },
    // 添加考核对象
    addTargetPerson () {
      this.isAddTarget = true
      this.multipleSelect = true
      this.showPersonSelect = true
      // this.showAddTarget = true
    },
    doAddTarget (arr) {
      let addList = arr.map(add => add.employeeId)
      // let checkRes = addList.filter(ele => {
      //   for (let i of this.tableConfig.data) {
      //     if (i.employeeId === ele) return ele
      //   }
      // })
      // if (checkRes.length) {
      //   this.$message({
      //     type: 'error',
      //     message: '重复了'
      //   })
      //   return
      // }
      let param = {
        period: this.params.period,
        schemeId: this.params.schemeId,
        deleteEmpId: [],
        addEmpId: addList
      }
      req('modifyTargets', param).then(() => {
        this.isAddTarget = false
        this.getSchemeInfo()
      })
    },
    // 外部考核关系处理完毕
    assessmentFinish () {
      this.showAssementRelation = false
      this.assessmentObj = {
        leader: {},
        assessmenter: [],
        collector: {},
        collectLeader: {}
      }
      this.getSchemeInfo()
    },
    // 表格数据load
    getPlanTableData (options = {}) {
      let params = options || this.getQuery
      // params.planManageStatus = params.planManageStatus.join(',')
      req('getPlanList', { ...params, schemeId: this.params.schemeId, period: this.params.period }).then(res => {
        // this.tableConfig.data = res.data
        // this.tableConfig.total = res.total
        // this.tableConfig.info = res.info
        Object.assign(this.tableConfig, res)
      }).catch(err => err.status === 500 && this.$router.push('/404'))
    },
    handleTabClick (tab, event) {
      this.tabIndex = tab.index
      if (this.schemeDetailData.periods[tab.index].projectStatus === null) {
        this.status = -1
      } else {
        this.status = this.schemeDetailData.periods[tab.index].projectStatus
      }
      this.isCalculateByChildren = this.schemeDetailData.periods[tab.index].isCalculateByChildren
      // this.tableConfig.setting.export = {}
      this.initToolBar()
      this.$store.commit('PER_SET_PERIOD_INDEX', tab.index)
      this.getPlanTableData(this.tableConfig.info)
      this.getSchemeStatics()
    },
    handlePageChange (options) {
      // this.params.pageIndex = index
      // Object.assign(options, this.params)
      // this.tableConfig.search = this.getQuery
      this.getPlanTableData(options)
    },
    handleSizeChange (options) {
      // Object.assign(options, this.params)
      // this.tableConfig.search = this.getQuery
      this.getPlanTableData(options)
    },
    reset () {
      this.params.employeeCode = ''
      this.params.employeeName = ''
      this.params.orgId = ''
      this.params.position = ''
      this.params.orgId = ''
      this.params.planManageStatus = []
    },
    tableSelected (selection) {
      this.selectedRows = selection
    },
    handleTableCellClick (row, col, e) {
      if (col.property === 'employeeName') {
        this.personInfo = row
        this.showPersonInfo = true
      }
    },
    delete (arr) {
      if (arr.length > 0) {
        this.$msgbox
        .confirm('确认删除这些数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(() => {
          req('deletePlan', arr.map(obj => obj.planId)).then(() => {
            // filterId(
            //   selectMutiId(arr, 'planId'),
            //   this.tableConfig.data,
            //   'planId',
            //   'delete'
            // )
            this.doSearch()
          })
        })
      } else {
        this.$message({
          message: '请选择',
          type: 'warning'
        })
      }
    },
    deleteSingleRow (index) {
      this.$msgbox
        .confirm('确认删除这行数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(() => {
          req('deletePlan', [this.tableConfig.data[index].planId]).then(() => {
            this.tableConfig.data.splice(index, 1)
            this.getSchemeStatics()
          })
        })
    },
    // 方案信息load
    getSchemeInfo () {
      req('getSchemeInfo', { schemeId: this.params.schemeId }).then(res => {
        this.schemeDetailData = res
        this.bigLoading = false
        if (res.periods && res.periods.length > 0) {
          if (this.storePeriodIndex) {
            this.params.period = res.periods[this.storePeriodIndex].period
            this.status = res.periods[this.storePeriodIndex].projectStatus
            this.isCalculateByChildren = res.periods[this.storePeriodIndex].isCalculateByChildren
          } else {
            this.params.period = res.periods[res.periods.length - 1].period
            this.status = res.periods[res.periods.length - 1].projectStatus
            this.isCalculateByChildren = res.periods[res.periods.length - 1].isCalculateByChildren
          }
        }
        this.tableConfig.setting.import.params.period = this.params.period

        if (this.status === null) this.status = -1
        this.isInit = false
        // this.getPlanTableData()
        this.doSearch()
        this.initToolBar()
        this.getSchemeStatics()
      }).catch(err => err.status === 500 && this.$router.push('/404'))
    },
    // 方案统计信息load
    getSchemeStatics () {
      req('getSchemeStatics', {
        schemeId: this.params.schemeId,
        period: this.params.period
      }).then(res => {
        this.staticsData = res
      })
    },
    // 点击改变状态按钮回调
    changeStatusRequest (name, params, callback) {
      req(name, params).then(res => {
        this.getSchemeInfo()
        if (callback) callback(res)
      })
    },
    checkPlanStatus (status, requesetName) {
      req(requesetName, {
        schemeId: this.schemeDetailData.schemeId,
        period: this.params.period
      }).then(res => {
        if (typeof res !== 'number') return
        if (res === 0) {
          this.projectStatusChangeRequest(status)
        } else {
          this.$confirm(
            status === 1 ? `有${res}条计划未生效，是否开始评估？` : `有${res}条计划未评估，是否结束评估？`,
            '提示'
          ).then(() => {
            this.changeStatusRequest(funcs[Number(status) + 1].name, {
              schemeId: this.schemeDetailData.schemeId,
              period: this.params.period
            })
          })
        }
      })
    },
    projectStatusChangeRequest (status) {
      let state = status || this.status
      this.$msgbox(`确定要${btnTextDict[state]}吗？`, '提示').then(() => {
        this.changeStatusRequest(funcs[Number(state) + 1].name, {
          schemeId: this.schemeDetailData.schemeId,
          period: this.params.period
        })
      })
    },
    checkTargets () {
      if (this.tableConfig.data.length > 0) {
        this.changeStatusRequest(funcs[Number(status) + 1].name, {
          schemeId: this.schemeDetailData.schemeId,
          period: this.params.period
        })
      } else {
        this.$message({
          message: '请先添加考核对象',
          type: 'warning'
        })
      }
    },
    handleProjectStatusChange (test) {
      let status = test || +this.status
      // 开始评估时检测未生效计划情况
      if (status === 1) {
        this.checkPlanStatus(status, 'getNotActiveNumber')
      } else if (status === 2) {
        this.checkPlanStatus(status, 'getNotEvaluateNumber')
        // 启动计划是检查是否已经添加了考核对象
      } else if (status === 0) {
        this.checkTargets()
      } else {
        this.projectStatusChangeRequest(status)
      }
    },
    handleShowAdjust (row) {
      this.currentRow = row
      this.showRankAdjustment = true
    },
    // 工具函数
    dictDealer (val, dict) {
      for (let i of dict) {
        if (val === i.value) {
          return i.label
        }
      }
    },
    monthFormatter (val) {
      return findDictLabel(periodDict, val)
    },
    statusFormatter (val) {
      return findDictLabel(periodStatusDict, val)
    },
    tableStatusFormat (row, col) {
      return findDictLabel(planManageStatusDict, row[col.property])
    },
    // ITalble 表格顶端按钮控制
    initToolBar () {
      this.$set(this.tableConfig.setting.toolbar[0], 'text', btnTextDict[this.status])
    },
    selectionChangeHandler ({selectionChangeHandler}, selection) {
      selectionChangeHandler(selection)
      this.selectedRows = selection
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('PER_SET_PERIOD_INDEX', null)
    next()
    // this.status = this.schemeDetailData.periods[this.schemeDetailData.periods.length - 1].projectStatus
  },
  created () {
    this.bigLoading = true
    this.params.schemeId = this.$route.params.id
    this.tableConfig.setting.import.params.schemeId = this.$route.params.id
    this.getSchemeInfo()
  },
  computed: {

    defaultSelectedPersonnel () {
      let result = []
      if (this.currentAssessment !== '') {
        this.currentAssessment === 'assessmenter'
          ? (result = this.assessmentObj[this.currentAssessment])
          : this.assessmentObj[this.currentAssessment].employeeName
            ? result.push(this.assessmentObj[this.currentAssessment])
            : (result = undefined)
      }
      return result
    },

    getQuery () {
      let query = clone(this.params)
      delete query.schemeId
      return query
    },

    storeTableAssessment () {
      return this.$store.state.performance.tableAssessment
    },

    storePeriodIndex () {
      return this.$store.state.performance.performancePeriodIndex
    },

    // 返回已经选择的考核对象的Id,name数组
    selectedTargets () {
      return this.tableConfig.data.map(ele => ({
        employeeId: ele.employeeId,
        employeeName: ele.employeeName
      }))
    }
  },
  filters: {
    schemeStatus (val) {
      let dict = {
        1: '有效',
        0: '无效'
      }
      return dict[val]
    }
  },
  components: {
    // UploadDialog zhengwq5 2017/11/25 add
    IUploadDialog,
    tableBtns,
    planStatus,
    IForm,
    tableColumnBtn,
    iSelectTree,
    iPersonnelSelect,
    iDialog,
    iLayout,
    iTable,
    iTableOperator,
    personInfo: () => import('./person-info.vue'),
    asessmentRelation: () => import('./assessment-relations.vue'),
    rankAdjustment: () => import('./rank-adjustment.vue'),
    rankAnlystics: () => import('./rank-anlystics.vue'),
    tableAssessment: () => import('./table-assessment.vue'),
    addTarget: () => import('./add-target/add-target.vue')
  }
}
</script>

<style lang="scss" scoped>
.detail-manage-container {
  .pfm-form{
    // height: 160px;
  }
  .my-header {
    display: flex;
    justify-content: space-around;
    .header-item {
      font-size: 14px;
      .label {
        // font-weight: 600;
      }
    }
    .name-item {
      display: flex;
      .value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 150px;
      }
    }
    .back-icon {
      cursor: pointer;
      font-size: 18px;
    }
  }
  .plan-detail-form {
    margin-top: 20px;
  }
  .create-area {
    width: 100%;
    height: 150px;
    line-height: 150px;
    text-align: center;
    .create-btn {
      width: 150px;
      height: 50px;
    }
  }
  .plan-status {
    // margin-left: 40px;
  }
  .table {
    // margin-left: 40px;
  }
  .plans-table-data {
    .table-header {
      margin-bottom: 5px;
      // margin-left: 20px;
    }
  }
  .tabs {
    width: 400px;
    // margin-left: 40px;
  }
  .pagination {
    text-align: right;
  }
}
</style>
