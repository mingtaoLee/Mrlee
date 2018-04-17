<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      :postFlow="postFlow"
      :processType="processType"
      :createName="signForm.employeeName"
      @jurConfig="jurConfigHandler"
    >
      <section class="content-follow" slot="cashPerfList">
        <h2 class="info-title">收银绩效明细</h2>
        <i-table
          class="info-content"
          :table="table"
          ref="table"
          @loaded="handleLoaded"
        >
          <template slot="table" slot-scope="tableScope">
            <el-table :data="tableScope.clone"
                      style="width: 100%"
                      @selection-change="selectionChangeHandler(tableScope, $event)"
                      @row-click="rowClickHandler(tableScope, $event)">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                v-for="(col, idx) of table.columns || []"
                v-if="showMap[col.prop]"
                :key="idx"
                :prop="col.prop"
                :label="col.label"
                :formatter="tableScope.formatter">
                <template slot-scope="scope">
                  <i-table-cell
                    :row="scope.row"
                    :col="col.prop"
                    :table="tableScope"
                  >
                    <div v-if="col.prop === 'employeeName'">
                      <el-input
                        v-model="scope.row.employeeName"
                        readonly
                        @click.native="handlePersonnelClick(scope)"
                      >
                        <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
                      </el-input>
                    </div>
                    <el-button
                      type="text"
                      v-if="col.prop === 'cashPerfInfoListName'"
                      @click="setCashPerfInfo(scope)"
                    >
                      填写明细
                    </el-button>
                  </i-table-cell>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </i-table>
        <i-dialog
          v-model="isShowDialog"
          title="收银奖惩项目明细"
          :toolbar="detailEditToolbar"
          destroyedWhenClose
        >
          <i-table :table="tableDetail" ref="tableDetail" @loaded="handleTableDetailLoaded">
            <template slot="table" slot-scope="tableScope">
              <el-table :data="tableScope.clone"
                        style="width: 100%"
                        @selection-change="selectionChangeHandler(tableScope, $event)"
                        @row-click="rowClickHandler(tableScope, $event)">
                <el-table-column
                  type="index"
                  label="序号"
                  width="55">
                </el-table-column>
                <el-table-column
                  v-for="(col, idx) of tableDetail.columns"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                  :formatter="tableScope.formatter">
                  <template slot-scope="scope">
                    <i-table-cell
                      :row="scope.row"
                      :col="col.prop"
                      :table="tableScope"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </i-table>
        </i-dialog>
        <i-personnel-select :isShow.sync="isShowPersonnel" :multiple="false" @confirm="handlePersonnelDialogConfirm"></i-personnel-select>
      </section>
    </i-process-flow>
  </div>
</template>
<script>
  import ButtonGroup from 'components/flow/button-group'
  import BasicInfo from 'components/flow/basic-info'
  import ISelect from 'components/common/i-select/i-select'
  import req from 'api/compensation/flow'
  import Editor from 'components/employee/editor'
  import IProcessFlow from 'components/common/i-process-flow'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import IUpload from 'components/common/upload/uploader'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
//  import {formatTableDate} from 'utils/employee.js'

  export default {
    data () {
      return {
        isShowPersonnel: false,
        activedIndex: null,
        currentCashPerfInfoList: [],
        isShowDialog: false,
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '保存',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        tableDetail: {
          columns: [
            { prop: 'label', label: '奖惩项目' },
            { prop: 'rewardPunishNum', label: '数目' }
          ], // 表头
          setting: {
            editor: {
              label: {
                disable: true
              },
              rewardPunishNum: {
                type: 'number'
              }
            }
          },
          editable: true,
          data: [{
            cashPerfConfigId: '收银绩效配置idstring',
            rewardPunishNum: '收银绩效奖惩项对应次数int'
          }]
        },
        table: {
          columns: [
            { prop: 'employeeCode', label: '员工工号' },
            { prop: 'employeeName', label: '姓名' },
            { prop: 'orgName', label: '组织' },
            { prop: 'hireDate', label: '入职时间（仅做收银员）', display: { date: 'default' } },
            { prop: 'cashMonth', label: '核算月份', display: { date: 'short' } },
            { prop: 'cashPerfInfoListName', label: '奖惩项目' },
            { prop: 'cashTotal', label: '奖惩合计(元）' }
          ], // 表头
          setting: {
            import: {
              business: '',
              show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            },
            toolbar: [{
              text: '添加',
              show: () => {
                return { empty: !this.showMap['toolbarAdd'] }
              },
              func: vm => vm.createData({
                employeeCode: '',
                empEmployeeId: '',
                employeeName: '',
                orgName: '',
                cashPerfInfoList: [
                  {
                    cashPerfConfigId: '收银绩效配置项id',
                    rewardPunishNum: '9999'
                  }
                ],
                cashPerfInfoListName: '填写明细',
                hireDate: '',
                cashMonth: '',
                cashTotal: ''
              })
            }, {
              text: '删除',
              type: 'danger',
              show: () => {
                return { empty: !this.showMap['toolbarDel'] }
              },
              func: vm => vm.deleteData()
            }],
            editor: {
              orgName: {
                disable: true
              },
              employeeCode: {
                disable: true
              },
//              cashPerfInfoList: {
//                type: 'button',
//                func: () => {
//                }
//              },
              cashTotal: {
                disable: true
              },
              hireDate: {
                disable: true
              },
              cashMonth: {
                type: 'date',
                options: {
                  type: 'month'
                }
              }
            }
          },
          disable: false,
          editable: true,
          data: null // 占位符，用于挂载数据
        },

        previewMode: false,
        empEmployeeId: this.$route.query.empEmployeeId,
        taskId: this.$route.query.taskId,
        taskKey: this.$route.query.taskKey,
        processType: this.$route.query.processType,
        date: {
          startDate: '',
          signDate: ''
        },
        pickerOptions: {
          disabledDate: (time) => {
            let endDate = this.date.startDate
            if (endDate) {
              return time.getTime() > endDate
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = this.date.signDate
            if (beginDateVal) {
              return time.getTime() < beginDateVal
            }
            // } else {
            //   return time.getTime() < Date.now() - 8.64e7
            // }
          }
        },
        rules: {
          contractNo: [{ required: true, message: '请获取合同编号', trigger: 'change' }],
          contractType: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
          contractAddress: [{ required: true, trigger: 'blur', message: '请输入地址' }],
          empTemplateId: [{ required: true, message: '请选择合同模板', trigger: 'change' }],
          contractSubject: [{ required: true, message: '请选择合同主体', trigger: 'change' }],
          leastSalary: [{ required: true, trigger: 'blur', message: '请输入工资' }],
          workAdress: [{ required: true, trigger: 'blur', message: '请输入地址' }],
          signDate: [{ required: true, message: '请选择签订时间', trigger: 'change' }],
          startDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
          contractPeriodType: [{ required: true, message: '请选择合同期限类型', trigger: 'change' }],
          contractPeriod: [{ required: true, message: '请输入合同期限', trigger: 'blur' }]
        },
        signForm: {
          cashPerfList: []
        },

        contractContent: '',
        rulesShow: false,
        templateList: null,
        contractSubjectList: [],
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500,
          toolbars: [['print']]
        },

        filln: '',
        dictArr: {
          contractType: 'CONTRACT_TYPE',
          contractPeriodType: 'CONTRACT_PERIOD_TYPE'
        },
        dict: {}
      }
    },

    methods: {
      jurConfigHandler (showMap, disabledMap) {
        this.table.disable = !!disabledMap['cashPerfSubmitWorkFlowTable']
      },
      handleTableDetailLoaded (vm) {
      },
      handleLoaded (vm) {
        this.signForm.cashPerfList = vm.clone
      },
      handlePersonnelClick (scope) {
        this.activedIndex = scope.$index
        this.isShowPersonnel = true
      },
      handlePersonnelDialogConfirm (selected) {
        this.signForm.cashPerfList[this.activedIndex].employeeName = selected[0].employeeName
        this.signForm.cashPerfList[this.activedIndex].empEmployeeId = selected[0].employeeId
        this.signForm.cashPerfList[this.activedIndex].employeeCode = selected[0].employeeCode
        this.signForm.cashPerfList[this.activedIndex].orgName = selected[0].unitName
        this.getHireDateByEmployeeId(selected[0].employeeId)
          .then((res) => {
            if (res) {
              this.signForm.cashPerfList[this.activedIndex].hireDate = res.hireDate
            }
          })
      },
      getHireDateByEmployeeId (empEmployeeId) {
        return req('getEmpInfoById', { empEmployeeId })
      },
      handleCancel (done) {
        done()
      },
      handleSave (done) {
        const DATA = this.$refs['tableDetail'].clone.map(v => {
          return {
            cashPerfConfigId: v.cashPerfConfigId,
            rewardPunishNum: v.rewardPunishNum
          }
        })
        this.signForm.cashPerfList[this.activedIndex].cashPerfInfoList = DATA
        done()
      },
      setCashPerfInfo (scope) {
        this.activedIndex = scope.$index
        this.isShowDialog = true
        this.currentCashPerfInfoList = scope.row.cashPerfInfoList
        console.log('scope', scope)
        this.getCashPerfInfoListItem().then(res => {
          console.log('setCashPerfInfo', res)
          if (res) {
            res.forEach(v => {
              this.currentCashPerfInfoList.length > 0 && this.currentCashPerfInfoList.forEach(item => {
                if (v.cashPerfConfigId === item.cashPerfConfigId) {
                  v.rewardPunishNum = item.rewardPunishNum
                }
              })
            })
            this.tableDetail.data = res
          }
        })
      },
      getCashPerfInfoListItem () {
        return req('getCashPerfInfoList')
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },
      fillIn (data) {
        if (data.cashPerfList.length > 0) {
          this.table.data = data.cashPerfList
          this.table.editable = false
        }
//        Object.keys(data).map(key => {
//          this.signForm[key] = data[key]
//        })
//        Object.keys(this.date).map(key => {
//          this.date[key] = data[key]
//        })
      },

      handleIconClick () {
        this.isShow = !this.isShow
      },
      postFlow () {
        return this.signForm
      },
      onFileSuccess (response, file, fileList) {
        this.$message.success('文件上传成功！')
        this.signForm.fileList.push(response)
      },
      onFileError (err, file, fileList) {
        console.log('err', err, file, fileList)
      },
      onFileRemove (file, fileList) {
        this.signForm.fileList.map(id => {
          id === file.response && this.signForm.fileList.splice(this.signForm.fileList.indexOf(id), 1)
        })
      }
    },

    created () {
    },

    computed: {
    },

    watch: {
    },

    components: {
      ButtonGroup,
      BasicInfo,
      ISelect,
      Editor,
      IProcessFlow,
      IDialog,
      ITable,
      ITableCell,
      IUpload
    }
  }
</script>
<style lang="scss">
  .contract-new {
    .base {
      margin-left: 20px;
    }
    .rules {
      font-size: 12px;
      color: #ff4949;
      margin-left: 5px;
    }
    .info-content {
      .el-input {
        width: 300px;
      }
    }
    .uploaderForm {
      width: 800px;
    }
  }
</style>
