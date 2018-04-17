<template>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="payCalculateListGet">
    <template slot="header">
      <i-form ref="form" @reset="reset" @search="search" >
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
        class="table"
        :table="table"
        ref="table"
        v-loading="pageLoading"
        :element-loading-text="$loadingText"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange">
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
             <el-table-column v-for="(item, idx) in table.columns"
               :key="idx"
               :prop="item.prop"
               :label="item.label"
               :min-width="item.width"
               :formatter="tableScope.formatter"
               :align="item.align"
                sortable
              >
              </el-table-column>

                <!-- 编辑按钮 -->
              <el-table-column
                prop="successNumber"
                label="计算成功人数"
                :min-width="successWidth"
                :align="successAlign"
                show-overflow-tooltip
                fixed="right"
                :sortable='successSortable'
               >
               <template slot-scope="scope">
                    <span style="width:80px;display:inline-block;">
                      {{scope.row.successNumber}}
                    </span>
                    <span 
                     class="padding5 controller-link" 
                     v-if="accessMap['payCalculateRecordsGet']"
                     @click="detailSuccess(scope.row.groupCalculateId,scope.row.calculateStatus)"
                     >
                      <a>成功明细</a>
                    </span>
                  </template>
              </el-table-column>

                <!-- 编辑按钮 -->
              <el-table-column
                prop="failNumber"
                label="计算失败人数"
                :min-width="failWidth"
                :align="failAlign"
                show-overflow-tooltip
                fixed="right"
                :sortable='failSortable'
               >
               <template slot-scope="scope">
                    <span style="width:80px;display:inline-block;">
                      {{scope.row.failNumber}}
                    </span>
                    <span 
                     class="padding5 controller-link" 
                     v-if="accessMap['payCalculateExceptionsGet']"
                     @click="detailFail(scope.row.groupCalculateId,scope.row.calculateStatus)"
                     >
                      <a>失败明细</a>
                    </span>
                  </template>
              </el-table-column>
              </el-table>
            </template>
        </i-table>
        <i-dialog
          v-model="isShowDialog"
          title="请选择要计算的薪资组"
          :toolbar="detailEditToolbar"
          size="small"
          destroyedWhenClose
        >
           <create-edit ref="detailEdit" :salaryGroupList="salaryGroupList"></create-edit>
        </i-dialog>
        <i-dialog
           v-model="isShowDialogSecond"
           title="新建计算过程"
           :toolbar="detailEditToolbarSecond"
           size="standard"
           destroyedWhenClose
         >
            <create-edit-second ref="detailEditSecond" :selectList="selectList"></create-edit-second>
        </i-dialog>
        <i-dialog
          v-model="isShowExportTax"
          title="导出工资计算明细数据"
          :toolbar="exportToolbar"
          size="small"
          ref='exportTax'
          destroyedWhenClose
          >
              <export-tax-report exportName='工资计算明细表.xls'></export-tax-report>
        </i-dialog>
        <!-- 用于提示正在重算 -->
        <i-dialog
          v-model="isShowAlert"
          title="提示"
          size="small"
          ref="mask"
          :showClose="false"
        >
          <div id="mask">
            <i class="el-icon-loading"></i>
            <span>正在校验计算入队中,请等待...</span>
          </div>     
        </i-dialog>  
        <!-- 用于导出工资计算明细 -->
        <!-- <template v-show='false'>
          <i-table
            class="table"
            :table="exportTable"
            ref="exportTable"
            @pageSizeChange="handleSizeChange"
            @pageIndexChange="handleCurrentChange"
            v-show="false"
            >
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                border
                > -->
                <!-- 动态、多级表头需要使用 tableScope.columns -->
                <!-- <el-table-column type="selection">
                </el-table-column>

                <el-table-column
                  v-for="col of tableScope.columns"
                  :key="col.prop"
                  :prop="col.prop"
                  :label="col.label"
                  :width="col.width"
                  :align="col.align"
                  :formatter="tableScope.formatter"
                  >
                  <el-table-column
                    v-for="son of col.children"
                    :key="son.prop"
                    :prop="son.prop"
                    :label="son.label"
                    :width="son.width"
                    :align="son.align"
                    :formatter="tableScope.formatter"
                    >
                   </el-table-column>
                 </el-table-column>
               </el-table>
             </template>
           </i-table>
           <i-task ref="exportDetais"></i-task>
         </template> -->
      </template>
    </i-layout>
</template>

<script>
import req, { config } from 'api/compensation/check-give/salary-count'
import CreateEdit from './salary-count-create'
import CreateEditSecond from './salary-count-create-second'
import { showMessage, confirmPopover } from 'utils/index'
import access from 'mixins/access'
import searchMixin from '../mixins/searchMixin'
import RemoteSelect from 'components/compensation/remote-select/index'
import ExportTaxReport from './export-report/exportTaxReport'
import ee from 'components/common/i-table/export-excel/main'
import ITask from 'components/common/i-task'

export default {
  mixins: [access, searchMixin],
  components: {
    CreateEdit,
    CreateEditSecond,
    RemoteSelect,
    ExportTaxReport,
    ITask
  },
  data () {
    return {
      isShowDialog: false,
      isShowDialogSecond: false,
      loading: true,
      idselected: [],
      confirmStatusSelected: '',
      recountStatusSelected: '',
      // 根据功能权限控制成功和失败两列参数
      successWidth: '165',
      successAlign: 'center',
      successSortable: false,
      failAlign: 'center',
      failWidth: '165',
      isShowAlert: false, // 控制重新计算弹框提示
      isLock: '', // 判断数据是否锁定
      isNoCancelConfirm: '', // 取消确认是否可点
      isconfirmCancel: '', // 是否可以发起确认
      failSortable: false,
      // 导出弹框的显示
      isShowExportTax: false,
      // 导出类型列表
      // exportDetialList: [],
      salaryGroupList: [], // 薪资组列表
       // 薪资组选择器配置
      groupProps: {
        value: 'groupId',
        label: 'groupName'
      },
      exportConfig: {
        fileName: '工资计算成功明细表',
        version: 'xlsx',
        range: 'all'
      },
      displayKeys: ['groupCode', 'groupName'],
      searchParms: {
        payMonth: '',
        groupId: '',
        componentListType: ''
      },

     // 计算薪资组页面编辑按钮
      detailEditToolbar: [
        {
          text: '取消',
          type: 'plain',
          func: done => {
            this.handleCancel(done)
          }
        },
        {
          text: '确定',
          func: done => {
            this.handleSave(done)
          },
          key: 'payAuditCheckCompanyAccountsUpdatePut'
        }
      ],
        // 计算过程页面编辑按钮
      detailEditToolbarSecond: [
        {
          text: '返回',
          type: 'plain',
          func: done => {
            this.handleCancelSecond(done)
          }
        },
        {
          text: '确定',
          func: done => {
            this.handleSaveSecond(done)
          }
        }
      ],
      // 导出明细页面按钮
      exportToolbar: [
        {
          text: '取消',
          type: 'plain',
          func: done => {
            this.cancelExportTax(done)
          }
        },
        {
          text: '确定',
          func: done => {
            this.exportTax(done)
          }
        }
      ],
      // 表格
      table: {
        columns: [
          { prop: 'groupCode', label: '薪资组代码', width: 120, align: 'center' },
          { prop: 'groupName', label: '薪资组', width: 120, align: 'left' },
          { prop: 'componentListName', label: '工资套', align: 'left', width: '120' },
          { prop: 'componentListType', label: '工资类型', width: 120, display: {dict: 'COMPONENT_LIST_TYPE'}, align: 'center' },
          { prop: 'payMonth', label: '核算月份', width: 120, align: 'center' },
          { prop: 'calculateStatus', label: '状态', width: 100, align: 'center', display: {dict: 'CALCULATE_STATUS'} },
          { prop: 'exceptionInfo', label: '计算结果', width: 140, align: 'right' },
          { prop: 'totalNumber', label: '总人数', width: 100, align: 'right' },
          { prop: 'finalPayingAmount', label: '实发合计', width: 120, align: 'right', display: {mixin: (row, col) => this.currencyFormat(row[col])} }
        ],
        setting: {
          export: {
            req: config.getTolalsalary,
            config: {
              fileName: '工资计算明细表'
              // range: 'select' // 默认为选中导出
            },
            // handleBeforeSend: (data) => { // 导出前回调函数
            //   const res = JSON.parse(data.tableInfo.selection)
            //   if (res.length > 0 && res.length < 6) {
            //     return true
            //   } else if (res.length > 5) {
            //     return showMessage('warning', '最多可选择5条薪资组记录！')
            //   } else {
            //     return showMessage('warning', '至少选择1条薪资组记录！')
            //   }
            // },
            key: 'payCalculateExport'
          },
          // 按钮
          toolbar: [
            {
              text: '新建计算',
              func: this.newCount,
              key: 'payCalculateCreatePost'
            },
            {
              text: '重新计算',
              func: this.recount,
              key: 'payCalculateRecomputePut',
              show: () => {
                return { disable: this.recountDataButtonIsDisabled() }
              }
            },
            {
              text: '发起确认',
              func: this.initiateConfirmation,
              key: 'payCalculateConfirmApplyPut',
              show: () => {
                return { disable: this.confirmDataButtonIsDisabled() }
              }
            },
            {
              text: '取消确认',
              func: this.cancelConfirmation,
              key: 'calculateConfirmUncalculateApplyPut',
              show: () => {
                return { disable: this.comfirmCancelDisable() }
              }
            }
            // {
            //   text: '导出成功明细',
            //   func: this.exportDetail,
            //   // key: 'payCalculateExport',
            //   type: 'success'
            // }
          ]
        },
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
      // 导出工资明细
      listParams: {},
      selectedOb: {},
      //  字典数据
      calculateStatusDict: [],
      componentListTypeDict: [],
      // 表格
      exportTable: {
        columns: [
        ],
        setting: {
          export: {
            req: config.getSalaryDetail,
            key: 'payCalculateRecordsExport',
            config: {
              fileName: '工资计算成功明细表',
              range: 'all',
              sync: false
            },
            param: () => ({
              groupCalculateId: this.idselected
            })
          }
        },
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        display: null,
        renderColumns: true,
        multiple: true,
        total: 0
      },
      // loading: true,
      groupCalculateId: '',
      calculateStatus: ''
      // recountStatusSelected: ''
    }
  },
  created () {
    if (!this.accessMap['payCalculateRecordsGet']) {
      this.successWidth = '120'
      this.successAlign = 'right'
      this.successSortable = true
    }
    if (!this.accessMap['payCalculateExceptionsGet']) {
      this.failWidth = '120'
      this.failAlign = 'right'
      this.failSortable = true
    }
  },
  mounted () {
    this.table.search = {}
   // this.exportTable.search = {groupCalculateId: this.groupCalculateId}
  },
  beforeDestroy () {
    this.stopTimer()
  },
  methods: {
        // ---------------------------------页面通用----------------------------------------
    // 获取工资列表
    fetch (options = {}) {
      req('getTolalsalary', {...options})
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(key => {
          this.table[key] = res[key]
        })
        this.pageLoading = false
        this.loading = false
        const arr = res.data
        const loop = arr.some(item => {
          return item.calculateStatus === '06' || item.calculateStatus === '09'
        })
        if (loop) {
          this.refreshIntime()
        } else {
          this.stopTimer()
        }
        // for (let i = 0; i < arr.length; i++) {
        //   if (arr[i].calculateStatus === '06' || arr[i].calculateStatus === '09') {
        //     this.refreshIntime()
        //     break
        //   } else {
        //     this.stopTimer()
        //   }
        // }
      })
    },
    // // 监听 pageIndex 和 pageSize 的变动
    // handleSizeChange (options) {
    //   this.myfetchDetail(options)
    // },
    // handleCurrentChange (options) {
    //   this.myfetchDetail(options)
    // },
    // ---------------------------------------页面业务------------------------------------------------------------
    // 获取groupCalculateId
    getGroupCalculateId (vm) {
      const selected = vm.getMultipleSelection().map(item => {
        return item.groupCalculateId
      })
      this.idselected = selected
      this.groupCalculateId = selected[0]
    },
    // 获取数据状态是否为锁定
    getIsLock (vm) {
      this.isconfirmCancel = vm.getMultipleSelection().every(item => {
        return item.calculateStatus === '05' || item.calculateStatus === '04'
      })
      this.isLock = vm.getMultipleSelection().some(item => {
        return item.calculateStatus === '07'
      })
    },
        // 获得数据状态
    getStatus (selection) {
      this.confirmStatusSelected = '01'
      this.recountStatusSelected = '01'
      this.isNoCancelConfirm = '01'
      // 发起确认只有已计算（02）才能点
      const selectionComfirm = selection.filter(function (status) {
        return status.calculateStatus !== '02'
      })
      // 重新计算(只有03申请重算/10计算失败/未计算01/已计算02可点)
      const selectionRecount = selection.filter(function (status) {
        return status.calculateStatus !== '03' && status.calculateStatus !== '10' && status.calculateStatus !== '01' && status.calculateStatus !== '02'
      })
      // 取消确认只有（发起确认04）能点
      const isNoLock = selection.filter(item => {
        return item.calculateStatus !== '04'
      })
      this.isNoCancelConfirm = isNoLock.length ? '02' : '01'
      // 判断申请重算
      this.recountStatusSelected = selectionRecount.length ? '02' : '01'
      // 判断发起确认
      this.confirmStatusSelected = selectionComfirm.length ? '02' : '01'
      // if (selection.length === 0) {
      //   this.confirmStatusSelected = '01'
      //   // this.recountStatusSelected = '01'
      // } else {
      //   if (!selectionComfirm.length) {
      //     this.confirmStatusSelected = '02'
      //   }
      //   if (!selectionRecount.length) {
      //    // this.recountStatusSelected = '02'
      //   }
      // }
    },
    // 按钮状态控制，01为开启，02为关闭
    confirmDataButtonIsDisabled () {
      if (this.confirmStatusSelected === '02') {
        return true
      } else {
        return false
      }
    },
    recountDataButtonIsDisabled () {
      if (this.recountStatusSelected === '02') {
        return true
      } else {
        return false
      }
    },
    comfirmCancelDisable () {
      if (this.isNoCancelConfirm === '02') {
        return true
      } else {
        return false
      }
    },
    // 获取工资细节表头配置
    fetchHead (options = {}) {
      req('getSalaryConfirmHead', options)
      .then(res => {
        for (let key in res.columns) {
          if (res.columns[key].prop === 'calculateStatus') {
            res.columns[key].display = {dict: 'CALCULATE_STATUS'}
          }
        }
        this.exportTable.columns = res.columns
      })
    },
      // 获取工资细节列表
    fetchDetail (options = {}) {
      req('getSalaryDetail', options)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(key => {
          this.selectedOb.groupCalculateId = this.groupCalculateId
          this.exportTable[key] = res[key]
        })
        this.loading = false
      })
    },
     // 获取工资细节列表
    myfetchDetail (options = {}) {
      req('getGroupCalculateDetail', options)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(key => {
          this.selectedOb.groupCalculateId = this.groupCalculateId
          this.exportTable[key] = res[key]
        })
        this.loading = false
      })
    },
    // 按钮功能封装
    bottonOperation (message, request) {
      if (!this.idselected.length) return showMessage('info', '请选择至少一项！')
      confirmPopover('warning', message, () => {
        return req(request, this.idselected).then(res => {
          if (res) {
            showMessage('success', '申请成功!')
            this.getParms()
            this.table.search = this.reqParams
          } else {
            showMessage('error', '申请失败!')
          }
        })
      })
    },
    // 重新计算增加提示框
    recountCheck (message, request) {
      if (!this.idselected.length) return showMessage('info', '请选择至少一项！')
      confirmPopover('warning', message, () => {
        this.isShowAlert = true
        return req(request, this.idselected).then(res => {
          if (res) {
            this.isShowAlert = false
            showMessage('success', '申请成功!')
            this.getParms()
            this.table.search = this.reqParams
            // this.fetch(this.reqParams)
          } else {
            this.isShowAlert = false
            showMessage('error', '申请失败!')
          }
        }).catch(err => {
          if (err) {
            this.isShowAlert = false
           // showMessage('error', '申请失败!')
          }
        })
      })
    },
    recount (vm) {
      this.getGroupCalculateId(vm)
      this.recountCheck('确定要申请重新计算吗？', 'applySalary')
    },
    initiateConfirmation (vm) {
      this.getGroupCalculateId(vm)
      this.bottonOperation('确定要发起确认吗？', 'comfirmSalary')
    },
    // 取消确认按钮
    cancelConfirmation (vm) {
      this.getGroupCalculateId(vm)
      this.getIsLock(vm)
      this.bottonOperation('确定要取消确认吗？', 'confirmCancel')
      // if (this.isLock) {
      //   return showMessage('info', '工资数据含已锁定数据，不允许取消确认')
      // } else if (this.isconfirmCancel) {
      //   this.bottonOperation('确定要发起取消确认吗？', 'confirmCancel')
      // }
    },
    // 查看详细
    detailSuccess (groupCalculateId, calculateStatus) {
      // 获取当前行的groupCalculateId
      this.$router.push({path: '/compensation/check-give/view-count-detail', query: { id: groupCalculateId, status: calculateStatus }})
    },
    detailFail (groupCalculateId, calculateStatus) {
      this.$router.push({path: '/compensation/check-give/view-count-detail-fail', query: { id: groupCalculateId, status: calculateStatus }})
    },
    // 导出
    export (Arr = []) {
      showMessage('success', '导出成功!')
    },
     /** 导出工资计算明细表() */
    exportDetail (vm) {
      // 选择导出判断提示
      if (vm.getMultipleSelection().length <= 0) {
        return showMessage('info', '请选择1至5条相同工资类型的薪资组！')
      } else if (vm.getMultipleSelection().length > 5) {
        return showMessage('info', '最多可选择5条薪资组记录！')
      }
      // 判断工资类型是否相同
      let isTypeEqual = vm.getMultipleSelection().every(item => {
        return item.componentListType === vm.getMultipleSelection()[0].componentListType
      })
      if (!isTypeEqual) {
        return showMessage('info', '请选择相同工资类型的薪资组')
      }
      this.getGroupCalculateId(vm)
      this.fetchHead({groupCalculateId: this.idselected[0]})
     // this.myfetchDetail({groupCalculateId: this.idselected})
      this.isShowExportTax = true
    },
    /** 确认导出工资计算明细表() */
    // closeDone () { },
    exportTax (done) {
      const configs = {fileName: '工资计算成功明细表', version: 'xlsx', range: 'all', sync: false}
      const tables = {}
      tables.elTable = this.$refs.exportTable.elTable
      tables.iTable = { display: this.$refs.exportTable.display, pageIndex: this.$refs.exportTable.pageIndex, pageSize: this.$refs.exportTable.pageSize, multipleSelection: this.$refs.exportTable.multipleSelection, table: this.$refs.exportTable.table }
      const setting = this.$refs.exportTable.exportSetting
      const config = ee.editConfig(configs)
      const reqInfo = ee.parseReq(setting)
      const tableInfo = ee.parseTable(tables)
      const ret = {
        config,
        tableInfo,
        ...reqInfo
      }
      this._getExportTaskId().then(id => {
        console.log(id)
        ret.config.sahara_table_export_file_id = id
        ee.sendTable(ret)
        // 打开异步弹窗
        this.$refs.exportDetais.openDialog(id)
      })
      // ee.sendTable(ret)
      done()
    },
      /**
   * 异步发起导出请求,获取任务id
   */
    _getExportTaskId () {
      return new Promise(resolve => {
        req('getExportTaskId').then(id => {
          resolve(id)
        })
      })
    },
    /** 取消导出工资计算明细() */
    cancelExportTax (done) {
      done()
    },
    /** 文件下载函数 */
    downLoad (url) {
      let el = document.createElement('a')
      document.body.appendChild(el)
      el.href = url
      el.target = '_self'
      var e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      el.dispatchEvent(e)
      document.body.removeChild(el)
    },
    // 新建计算
    newCount () {
      req('getSalaryGroup', {}).then(res => {
        this.salaryGroupList = []
        this.salaryGroupList = res
      })
      this.openDetailDialog()
    },
    openDetailDialog () {
      this.isShowDialog = true
    },
    // -----------------新建计算按钮----------------------
    // 选择计算薪资组
    handleCancel (done) {
      done()
    },
    handleSave (done) {
      if (this.$refs.detailEdit.salaryGroupId.length <= 0) {
        return showMessage('info', '请至少选择一个薪资组！')
      }
      this.$refs.detailEdit.getSalaryGroup().then(res => {
        this.selectList = res
        this.isShowDialogSecond = true
        done()
      })
    },
      // 新建计算过程页面
    handleCancelSecond (done) {
      done()
      this.isShowDialog = true
    },
    handleSaveSecond (done) {
      let payMonth = this.$refs.detailEditSecond.data.every(item => {
        return item.payMonth
      })
      let componentListTypeName = this.$refs.detailEditSecond.data.every(item => {
        return item.componentListTypeName
      })
      if (payMonth && componentListTypeName) {
        this.$refs.detailEditSecond.buildProcess().then(res => {
          done()
          if (res === true) {
            showMessage('success', '计算过程创建成功')
          } else {
            showMessage('error', '计算过程创建失败')
          }
          this.reset()
          this.table.search = {}
        })
      } else {
        showMessage('warning', '信息填写不完整')
      }
    },
    refreshIntime () {
      clearInterval(this.timer)
      this.timer = setTimeout(() => {
        this.fetch()
      }, 20000)
    },
    stopTimer () {
      clearTimeout(this.timer)
    },
    getCalculteStatus () {
      req('getIntervalData').then(res => {
        console.log(res)
      })
    }
    // refreshData () {
    //   setInterval(this.fetch, 20000)
    // }
  }
}
</script>

<style lang="scss" scoped>
  #mask{
    text-align: center;
  }
</style>
