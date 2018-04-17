<template>
  <i-layout headerKey="rctHireListGet">
    <div slot="header">
      <i-form @reset="reset" @search="search">
        <el-form-item label="姓名">
          <el-input v-model.trim="params.name"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="applyPosition">
          <el-input
              v-model.trim="params.applyPosition"
              @focus="departmentNodeClick"
              placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="orgName">
          <i-select-tree
            dataKey="org"
            v-model="params.orgId"
            nodeKey="orgUnitId"
            clearable
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker
            v-model="params.entryDate"
            value-format="yyyy-MM-dd"
            clearable
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </i-form>
      <position-selection
        type="mini"
        v-model="positionSelectDialogFlag"
        @change="selectPositionConfirm">
        </position-selection>
    </div>
    <i-table slot="section"
     ref="itable"
     :table="table"
     @pageSizeChange="handleSizeChange"
     @pageIndexChange="handleCurrentChange"
    >

    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone"
      v-loading="loading"
      :element-loading-text="$loadingText"
      @selection-change="handleSelectionChange">

        <el-table-column
        v-for="(col, index) in table.columns || []"
        :key="index"
        :prop="col.prop"
        :align="col.align"
        :width="col.width"
        :fixed="col.fixed"
        :formatter="tableScope.formatter"
        :label="col.label"
        :sortable="col.sortable"></el-table-column>
        <i-table-operator :table="tableScope" width="350"/>
        <!-- <el-table-column label="操作" align="center" fixed="right" width="300" v-if="operatorColumn">
        <template slot-scope="scope">
          <i-table-operator @accessControl="accessControl" :table="tableScope" :row="scope.row"></i-table-operator>
          <div>
            <el-button type="text"
            v-show="scope.row.processStatus === '10' "
            @click="goApprove(scope.row,scope.$index)">录用审批</el-button>
            <el-button type="text"
            v-show="scope.row.processStatus > '10' "
             @click="lookApprove(scope.row,scope.$index)">查看录用审批</el-button>
          </div>
          <div>
            <el-button type="text" @click="goDetail(scope.row)">查看详情</el-button>
            <el-button type="text"
             v-show="scope.row.processStatus === '13' "
             @click="sendInterview(scope.row,scope.$index)">发送录用通知书</el-button>
            <el-button type="text"
             v-show="scope.row.processStatus === '13'"
             @click="registerInduction(scope.row,scope.$index)">登记入职</el-button>
          </div>
          </template>
        </el-table-column> -->
      </el-table>

      <!-- 登记入职 -->
      <registration-dialog
        slot="section"
        :ShowMeFalg.sync="matriculatedDialogFlag"
        :dialogForm="dialogForm"
        @getData="handleGetedData"
      >
      </registration-dialog>

      <!-- 背景调查 -->
      <background-check-dialog
      slot="section"
      :ShowBackgroundFalg.sync="matriclatedBgFlag"
      :dialogFormBackground="dialogFormBackground"
      @getBackgroundData="handleGetedData"
      >
      </background-check-dialog>

      <!-- 发送录用通知书 -->
      <notification-dialog
        v-if="notificationDialogFlag"
        notificationType="3"
        :showMe.sync="notificationDialogFlag"
        :notifyWho="notifyWho"
        @getMyData="handleGetedData">
      </notification-dialog>
    </template>
   </i-table>
  </i-layout>
</template>
<script>
  import req from 'api/recruit/matriclated'
  import access from 'mixins/access'
  import { ResumePageSource } from 'views/admin/pages/recruit/config'
  import NotificationDialog from 'views/admin/pages/recruit/components/notification-dialog'
  import PositionSelection from 'components/position/position-selection'
  import RegistrationDialog from './registration-dialog'
  import BackgroundCheckDialog from './background-check-dialog'
  import moment from 'moment'
  export default {
    name: 'matriculated',
    components: {
      NotificationDialog,
      PositionSelection,
      RegistrationDialog,
      BackgroundCheckDialog
    },
    mixins: [access],
    data () {
      return {
        params: {
          name: '',
          orgId: null,
          positionId: '',
          applyOrgName: '',
          entryDate: null
        },
        loading: true,
        matriclatedBgFlag: false, // 背景调查弹框控制
        matriculatedDialogFlag: false, // 控制登记入职的弹框
        positionSelectDialogFlag: false, // 职位选择弹框显隐
        table: {
          data: [],
          setting: {
            toolbar: [],
            operator: [{
              text: '录用审批',
              key: 'rctHireProcessPost',
              show (row) {
                if (row.processStatus !== '10') {
                  return {
                    empty: true
                  }
                }
              },
              func: this.goApprove
            }, {
              text: '查看录用审批',
              key: 'rctHireProcessInfoGet',
              show (row) {
                if (row.processStatus < '13') {
                  return {
                    empty: true
                  }
                }
              },
              func: this.lookApprove
            }, {
              text: '查看详情',
              key: 'rctHireResumeGet',
              func: this.goDetail
            }, {
              text: '发送录用通知书',
              key: 'rctPassInformPost',
              show (row) {
                if (row.processStatus !== '13') {
                  return {
                    empty: true
                  }
                }
              },
              func: this.sendInterview
            }, {
              text: '登记入职',
              key: 'rctHireRegisterPost',
              show (row) {
                if ((row.backgroundStatus !== '1' || row.processStatus !== '20' || row.isBackgroundCheck !== 'Y') && (row.isBackgroundCheck !== 'N' || row.processStatus !== '20')) {
                  return {
                    empty: true
                  }
                }
              },
              func: this.registerInduction
            }, {
              text: '背景调查',
              key: 'rctHireBackgroundCheckPost',
              show (row) {
                if (row.isBackgroundCheck !== 'Y' || row.processStatus !== '20' || row.backgroundStatus !== '0') {
                  return {
                    empty: true
                  }
                }
              },
              func: this.goBackgroundGround
            }]
          },
          info: null,
          search: null,
          total: 0,
          showPagebar: true,
          columns: [
            { prop: 'name', label: '姓名', fixed: 'left' },
            { prop: 'applyOrgName', label: '部门' },
            { prop: 'applyPosition', label: '职位' },
            { prop: 'entryDate',
              label: '拟入职时间',
              display: { date: '' },
              sortable: true
            },
            { prop: 'hireDate',
              label: '发送通知时间',
              display: { date: '' },
              sortable: true
            },
            { prop: 'isBackgroundCheck',
              label: '是否背调',
              display: { dict: 'WHETHER_TYPE' },
              sortable: true
            }
          ]
        },

        tableLoading: false, // 加载数据列表的loading无效果
        notificationDialogFlag: false, // 通知组件的显隐
        notifyWho: {}, // 通知组件的title
        resumePageSource: ResumePageSource, // 简历库字典
        selectList: [], // 多选
        dialogForm: {},
        rules: {
          // entryDate: [{required: true, message: '请选择入职时间', type: 'date', trigger: 'change'}], // 入职时间校验
          backgroundStatus: [{required: true, message: '请选择背调结果', trigger: 'change'}], // 背景调查校验
          entryResult: [{required: true, message: '请选择入职结果', trigger: 'change'}] // 入职结构校验
        }
      }
    },
    mounted () {
      // this.getTemplateList(this.table.info)
      this.search()
    },
    methods: {
      // 重置
      reset () {
        this.params = {
          name: '',
          applyJob: '',
          positionId: '',
          orgId: null,
          entryTime: ''
        }
      },

      // 查询
      search (val) {
        this.table.search = {...this.params}
      },
      goBackgroundGround (row) {
        this.dialogFormBackground = Object.assign({}, this.dialogFormBackground, row)
        this.matriclatedBgFlag = true
      },

      // 发送录用通知书
      sendInterview (row) {
        this.notifyWho = row
        this.notificationDialogFlag = true
      },

      // 登记入职
      registerInduction (row) {
        this.dialogForm = Object.assign({}, this.dialogForm, row)
        this.matriculatedDialogFlag = true
      },

      // 获取列表数据
      getTemplateList (opts) {
        req('matriculatedList', opts).then((res) => {
          Object.assign(this.table, res)
          this.loading = false
        }).catch((err) => {
          console.log(err)
          this.loading = false
        })
      },

      // 页数改变
      handleSizeChange (opts) {
        this.loading = true
        this.getTemplateList(opts)
      },

      // 页码改变
      handleCurrentChange (opts) {
        this.loading = true
        this.getTemplateList(opts)
      },

      // 表格选择行
      handleSelectionChange (list) {
        this.selectList = list || []
      },

      // 查看详情
      goDetail (row) {
        // this.$router.push({
        //   path: '/recruit/resume/resumeDetail',
        //   query: {
        //     source: ResumePageSource.DEMANDMANAGEER,
        //     resumeId: row.resumeId
        //   }
        // })
        this.$store.commit('REMUSEDETAIL_WINDOW_OPEN', {source: this.pageSource, resumeId: row.resumeId})
      },

      // 录用审批
      goApprove (row) {
        this.$store.commit('EMPLOY_WINDOW_OPEN', {
          interviewId: row.interviewId,
          name: row.name
        })
      },

      // 查看录用审批
      lookApprove (row) {
        this.$router.push({
          path: '/recruit/resume/enrollDetail',
          query: {
            interviewId: row.interviewId
          }
        })
      },

      // 时间过滤
      dataFilter (data) {
        if (data) {
          return moment(data).format('YYYY-MM-DD')
        } else {
          return ''
        }
      },

       // 显示职位弹窗
      departmentNodeClick (selected) {
        this.positionSelectDialogFlag = true
      },

      // 选择职位
      selectPositionConfirm (selected) {
        this.params.positionId = selected.posPositionId
        this.params.applyPosition = selected.name
        this.positionSelectDialogFlag = false
      },

      // 发送通知后刷新列表数据
      handleGetedData (data) {
        this.getTemplateList()
        for (let i of data) {
          this.$refs.itable.createData(i)
        }
        this.loading = false
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
