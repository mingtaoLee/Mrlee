<template>
  <i-layout headerKey="rctInterviewsListGet">
    <div slot='header'>
      <i-form @reset='reset' @search='search'>
        <el-form-item label='姓名'>
          <el-input v-model.trim='param.name'></el-input>
        </el-form-item>
        <el-form-item label='面试职位' prop='applyPosition'>
          <el-input
              v-model.trim="param.applyPosition"
              @focus="departmentNodeClick"
              :disabled="editable"
              placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label='面试类型'>
          <i-select
            v-model='param.interviewProcess'
            parameter='INTERVIEW_PROCESS'
            placeholder='请选择'>
          </i-select>
        </el-form-item>
        <el-form-item label='面试时间'>
          <el-date-picker
            v-model='param.interviewDate'
            clearable
            value-format="yyyy-MM-dd"
            placeholder='选择日期'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <span slot='label'>面试官</span>
          <el-input v-model='param.interviewerName' @click.native='handleIconClick'>
            <i slot='suffix' class='el-icon-menu' @click.stop='handleIconClick'></i>
          </el-input>
        </el-form-item>
        <el-form-item label='面试状态'>
          <i-select
            v-model='param.status'
            parameter='INTERVIEW_STATUS'
            placeholder='请选择'>
          </i-select>
        </el-form-item>
      </i-form>
      <position-selection
        type="mini"
        v-model="positionSelectDialogFlag"
        @change="selectPositionConfirm">
        </position-selection>
    </div>
    <i-table slot='section'
     ref="itable"
     :table='table'
     @pageSizeChange="handleSizeChange"
     @pageIndexChange="handleCurrentChange"
    >

      <template slot='table' slot-scope='tableScope'>
        <el-table :data='tableScope.clone'
          v-loading="loading"
          :element-loading-text="$loadingText"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column
            type="selection"
            width="40">
          </el-table-column> -->
          <el-table-column
          v-for='(col, index) in table.columns || []'
          :key='index'
          :prop='col.prop'
          :align='col.align'
          :width='col.width'
          :fixed='col.fixed'
          :formatter='tableScope.formatter'
          :label='col.label'
          :sortable='col.sortable'></el-table-column>
          <!-- <el-table-column label='面试官' width="120">
            <template slot-scope='scope'>
              <span>{{getListName(scope.row.interviewers)}}</span>
            </template>
          </el-table-column> -->

          <i-table-operator :table="tableScope" width="250" />
          <!-- <el-table-column label='操作' align='center' fixed='right' width="200" v-if="operatorColumn">
          <template slot-scope='scope'>
            <i-table-operator @accessControl="accessControl" :table="tableScope" :row="scope.row"></i-table-operator>
            <div>
              <el-button type='text' @click='registerInterview(scope.row)'>登记面试</el-button>
              <el-button type='text'
               v-show="scope.row.interviewStatus === '07' "
               @click='employed(scope.row)'>录用</el-button>
            </div>
            <div>
              <el-button type='text' @click='goResume(scope.row)'>查看详情</el-button>
              <el-button type='text' @click='secondInterview(scope.row)'>安排复试</el-button>
            </div>
            </template>
          </el-table-column> -->
        </el-table>

        <!-- 安排复试 -->
        <notification-dialog
          v-if='notificationDialogFlag'
          slot='section'
          notificationType='2'
          @getMyData="handleGetedData"
          :showMe.sync='notificationDialogFlag'
          :notifyWho='notifyWho'>
        </notification-dialog>

        <!-- 人员选择 -->
        <i-personnel-select
          :isShow.sync='isShow'
          @confirm='handleConfirm'
        >

        </i-personnel-select>

      <interview-dialog
        slot="section"
        :ShowMeFalg.sync="interviewDialogFlag"
        :dialogForm="dialogForm"
        @getData="handleGetedData"
      >
      </interview-dialog>

      <!-- 录用 -->
      <employed-dialog
        slot="section"
        :ShowMeEmployFalg.sync="interviewEmployFalg"
        :dialogFormEmploy="dialogFormEmploy"
        @getEmployData="handleGetedData"
      >
      </employed-dialog>

      <!-- 合规检查 -->
      <compliced-dialog
      slot="section"
      :ShowMeComplicedFalg.sync="interviewComplicedFalg"
      :dialogFormCompliced="dialogFormCompliced"
      @getComplicedData="handleGetedData">
      </compliced-dialog>
      </template>
    </i-table>
  </i-layout>
</template>
<script>
import req, { config } from 'api/recruit/interview'
import access from 'mixins/access'
import { ResumePageSource } from 'views/admin/pages/recruit/config'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import NotificationDialog from 'views/admin/pages/recruit/components/notification-dialog'
import PositionSelection from 'components/position/position-selection'
import InterviewDialog from './interview-dialog'
import EmployedDialog from './employed-dialog'
import ComplicedDialog from './compliced-dialog'
// import moment from 'moment'
export default {
  name: 'interview',
  components: {
    iPersonnelSelect,
    NotificationDialog,
    PositionSelection,
    InterviewDialog,
    EmployedDialog,
    ComplicedDialog
  },

  mixins: [access],
  data () {
    return {
      param: {
        name: '', // 姓名
        applyPosition: '', // 应聘职位
        interviewDate: '', // 面试时间
        interviewerName: null, // 面试官
        interviewerId: '', // 面试官id
        interviewProcess: null, // 面试类型
        interviewStatus: null, // 面试状态
        postionId: '', // 职位id
        status: null // 状态
      },
      loading: true,
      interviewComplicedFalg: false, // 合规检查弹框控制
      interviewEmployFalg: false, // 录用弹框控制
      interviewDialogFlag: false, // 登记面试弹框控制
      positionSelectDialogFlag: false, // 职位选择器默认显示
      notificationDialogFlag: false, // 发送通知书组件默认不显示
      notifyWho: {}, // 选中当前人
      isShow: false, // 选择面试官是否显示
      resumePageSource: ResumePageSource, // 简历库相关的字典
      dialogForm: {},
      dialogFormEmploy: {},
      selectList: [], // 多选
      table: {
        data: [], // 存储后台返回来数据
        info: null,
        search: null,
        total: 0, // 根据后台返回来的数据
        showPagebar: true,
        columns: [
          { prop: 'name', label: '姓名', fixed: 'left' },
          { prop: 'applyPosition', label: '面试职位', width: 120 },
          {
            prop: 'interviewDate',
            label: '面试时间',
            width: '140',
            display: { date: 'yyyy-MM-dd hh:mm' },
            sortable: true
          },
          {
            prop: 'interviewProcess',
            label: '面试类型',
            width: '100',
            display: { dict: 'INTERVIEW_PROCESS' },
            sortable: true
          },
          {
            prop: 'interviewStatus',
            label: '面试状态',
            width: '120',
            display: { dict: 'INTERVIEW_STATUS' },
            sortable: true
          },
          {
            prop: 'qualifyStatus',
            label: '合规检查结果',
            width: '120',
            display: { dict: 'QUALIFY_STATUS' },
            sortable: true
          },
          { prop: 'arrangerName', label: '面试安排人', width: '120' },
          {
            prop: 'invitationDate',
            label: '邀请时间',
            width: '120',
            display: { date: '' }
          },
          {
            prop: 'interviewerNames',
            label: '面试官'
          }
        ],
        setting: {
          export: {
            text: '导出',                // 不合规范，以自身业务为准【可选】
            key: 'rctInterviewExport',
            config: {                   // 【可选】
              fileName: '面试信息'             // 默认文件名
              // version: '',              // 默认后缀
              // range: '',                // 默认范围
              // sync: true                // 默认方式（同步/异步）
            },
            req: config.interviewList
          },
          operator: [{
            text: '登记面试',
            key: 'rctInterviewRegisterPost',
            show (row) {
              if (row.interviewStatus !== '00') {
                return {
                  empty: true
                }
              }
            },
            func: this.registerInterview
          }, {
            text: '录用',
            key: 'rctInterviewHirePost',
            show (row) {
              if (row.interviewStatus !== '07' || row.qualifyStatus !== '1') {
                return {
                  empty: true
                }
              }
            },
            func: this.employed
          }, {
            text: '查看详情',
            key: 'rctInterviewResumeGet',
            func: this.goResume
          }, {
            text: '安排复试',
            key: 'rctInterviewInformPost',
            show (row) {
              if (row.interviewStatus !== '07' || row.qualifyStatus !== '1') {
                return {
                  empty: true
                }
              }
            },
            func: this.secondInterview
          }, {
            text: '合规检查',
            key: 'rctInterviewComplicedPost',
            show (row) {
              if (row.qualifyStatus !== '0') {
                return {
                  empty: true
                }
              }
            },
            func: this.handleCompliance
          }]
        }
      }
    }
  },
  //    created () {
  //      this.getTableData()
  //    },
  mounted () {
    // this.getTableData(this.table.info)
    this.search()
  },
  methods: {
    // 重置
    reset () {
      this.param = {
        name: '',
        applyJob: '',
        applyPosition: '',
        interviewDate: '',
        interviewerName: null,
        interviewStatus: null
      }
      // this.getTableData()
    },

    // 查询
    search () {
      // console.log(this.param.interviewDate)
      this.table.search = {...this.param}
    },

    // 人员选择遍历
    handleConfirm (selected) {
      let nameList = []
      let idList = []
      selected.map(item => {
        idList.push(item.employeeId)
        nameList.push(item.employeeName)
      })
      // console.log(nameList.toString())
      this.param.interviewerName = nameList.toString()
      this.param.interviewerId = idList.toString()
    },

    // 人员选择的弹框
    handleIconClick () {
      this.isShow = !this.isShow
    },

    // 页数改变
    handleSizeChange (opts) {
      this.loading = true
      this.getTableData(opts)
    },

    // 页码改变
    handleCurrentChange (opts) {
      this.loading = true
      this.getTableData(opts)
    },

    // 表格选择行
    handleSelectionChange (list) {
      this.selectList = list || []
    },

    //  查看详情
    goResume (row) {
      this.$store.commit('REMUSEDETAIL_WINDOW_OPEN', {
        source: ResumePageSource.INTERINTERVIEW,
        resumeId: row.resumeId
      })
      // this.$router.push({
      //   path: '/recruit/resume/resumeDetail',
      //   query: {
      //     source: ResumePageSource.INTERINTERVIEW,
      //     resumeId: row.resumeId  // 传简历id
      //   }
      // })
    },

    // 安排复试
    secondInterview (row, index) {
      this.notifyWho = row
      this.notificationDialogFlag = true
    },

    // 录用
    employed (row) {
      this.dialogFormEmploy = Object.assign({}, this.dialogFormEmploy, row)
      this.interviewEmployFalg = true
    },

    // 录用
    // employed (rowData) {
    //   this.$confirm('确定录用' + rowData.name + '吗？', '提示', {
    //     confirmButtonText: '确定 ',
    //     cancelButtonText: '取消 '
    //   }).then(() => {
    //     if (rowData.interviewId) {
    //       req('hire', {
    //         interviewId: rowData.interviewId
    //       }).then(data => {
    //         this.$message({
    //           message: '录用成功',
    //           type: 'success'
    //         })
    //         this.getTableData()
    //       }).catch(err => {
    //         console.log(err)
    //       })
    //     }
    //   }).catch((err) => {
    //     console.log(err)
    //   })
    // },

    // 面试官拼接
    getListName (row) {
      let len = row.length
      let item
      let arr = []
      if (len === 0) {
        return ''
      } else {
        while (len--) {
          item = row[len]
          arr.push(item.interviewerName)
        }
        return arr.toString()
      }
    },

    // 登记面试
    registerInterview (row) {
      this.dialogForm = Object.assign({}, this.dialogForm, row)
      this.dialogForm.interviewDate = new Date(this.dialogForm.interviewDate)
      // this.dialogForm.disQualifyStatus = row.qualifyStatus
      this.dialogForm.interviewerName = this.getListName(row.interviewers)
      this.interviewDialogFlag = true
    },

    // 合规检查
    handleCompliance (row) {
      this.dialogFormCompliced = Object.assign({}, this.dialogFormCompliced, row)
      this.interviewComplicedFalg = true
    },

    // 获取列表
    getTableData (opts) {
      req('interviewList', opts).then(res => {
        Object.assign(this.table, res)
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },

    // 过滤时间
    // dataFilter (data) {
    //   if (!data) return ' '
    //   return moment(data).format('YYYY-MM-DD HH:mm')
    // },

    // 显示职位弹窗
    departmentNodeClick (selected) {
      this.positionSelectDialogFlag = true
    },

    // 选择职位
    selectPositionConfirm (selected) {
      this.param.postionId = selected.posPositionId
      this.param.applyPosition = selected.name
      this.positionSelectDialogFlag = false
    },

    handleGetedData (data) {
      this.loading = true
      this.getTableData()
      for (let i of data) {
        this.$refs.itable.createData(i)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang='scss'>

</style>
