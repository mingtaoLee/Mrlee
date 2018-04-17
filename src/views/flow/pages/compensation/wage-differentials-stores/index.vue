<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      :model="signForm"
      :processType="processType"
      :createName="signForm.employeeName"
      @jurConfig="jurConfigHandler"
    >
      <section class="content-follow" slot="payDiffStoreList">
        <h2 class="info-title">工资差异明细</h2>
        <i-table class="info-content" :table="table" ref="table" @loaded="handleLoaded">
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
                type="index"
                label="序号"
                width="55">
              </el-table-column>
              <el-table-column
                v-if="showMap[col.prop]"
                v-for="(col, idx) of table.columns || []"
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
                    <div v-if="col.prop === 'approvalByName'">
                      <el-input
                        v-model="scope.row.approvalByName"
                        readonly
                        @click.native="handlePersonnelClickApprovalBy(scope)"
                      >
                        <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
                      </el-input>
                    </div>
                    <template v-if="col.prop === 'diffProject'">
                      <i-select
                        v-if="showDiffItems(col, scope)"
                        v-model="scope.row.diffProject"
                        :props="itemProps"
                        :parameter="showDiffItemsParams(scope)"
                        dataKey="paysRecordItem"
                        @option-click="handleItemClick($event, scope.row)"
                        filterable>
                      </i-select>
                      <i-select v-else disabled></i-select>
                    </template>
                  </i-table-cell>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </i-table>
        <i-personnel-select :isShow.sync="isShowPersonnel" :multiple="false" @confirm="handlePersonnelDialogConfirm"></i-personnel-select>
      </section>
    </i-process-flow>
  </div>
</template>
<script>
  import ButtonGroup from 'components/flow/button-group'
  import BasicInfo from 'components/flow/basic-info'
  import ISelect from 'components/common/i-select/i-select'
//  import req from 'api/employee/contract'
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
        itemProps: {
          value: 'payDiffProject',
          label: 'payDiffProject'
        },
        isShowPersonnel: false,
        isPersonnelApproval: false,
        activedIndex: null,
        table: {
          columns: [
            { prop: 'employeeCode', label: '员工工号' },
            { prop: 'employeeName', label: '姓名' },
            { prop: 'orgName', label: '所属部门' },
            { prop: 'checkMonth', label: '差异月份', display: { date: 'short' } },
            { prop: 'diffProject', label: '差异项目' },
            { prop: 'diffDesc', label: '差异原因' },
            { prop: 'diffValue', label: '差异金额' },
            { prop: 'approvalByName', label: '责任人' }
          ], // 表头
          setting: {
            // import: {
            //   business: '',
            //   show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            // },
            toolbar: [{
              text: '添加',
              show: () => {
                return { empty: !this.showMap['toolbarAdd'] }
              },
              func: vm => {
                vm.createData({
                  employeeCode: '',
                  empEmployeeId: '',
                  employeeName: '',
                  orgName: '',
                  checkMonth: '',
                  diffProject: '',
                  diffDesc: '',
                  diffValue: '',
                  approvalBy: '',
                  approvalByName: ''
                })
              }
            }, {
              text: '删除',
              type: 'danger',
              show: () => {
                return { empty: !this.showMap['toolbarDel'] }
              },
              func: vm => vm.deleteData()
            }],
            editor: {
              employeeCode: {
                disable: true
              },
              orgName: {
                disable: true
              },
              checkMonth: {
                type: 'date',
                options: {
                  type: 'month'
                }
              },
              diffProject: {
//                disable: true
              },
              diffDesc: {},
              diffValue: {
                type: 'number'
              },
              approvalBy: {}
            }
          },
          editable: true,
          disable: false,
          data: [] // 占位符，用于挂载数据
        },

        previewMode: false,
        isShow: false, // 人员选择器
        show: false,
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
          payDiffStoreList: []
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
        this.table.disable = !!disabledMap['payDiffStoreTable']
      },
      showDiffItems (col, scope) {
        return col.prop === 'diffProject' && scope.row.empEmployeeId && scope.row.checkMonth
      },
      showDiffItemsParams (scope) {
        let date = new Date(scope.row.checkMonth)
        return {
          checkMonth: date.getFullYear() + '-' + date.getMonth() + '-01',
          employeeId: scope.row.empEmployeeId
        }
      },
      handleItemClick (event, scope) {
        console.log(event, scope)
      },
      handlePersonnelClickApprovalBy (scope) {
        this.activedIndex = scope.$index
        this.isShowPersonnel = true
        this.isPersonnelApproval = true
      },
      handlePersonnelClick (scope) {
        this.activedIndex = scope.$index
        this.isShowPersonnel = true
      },
      handlePersonnelDialogConfirm (selected) {
        if (this.isPersonnelApproval) {
          this.signForm.payDiffStoreList[this.activedIndex].approvalByName = selected[0].employeeName
          this.signForm.payDiffStoreList[this.activedIndex].approvalBy = selected[0].employeeId
          this.isPersonnelApproval = false
        } else {
          this.signForm.payDiffStoreList[this.activedIndex].employeeName = selected[0].employeeName
          this.signForm.payDiffStoreList[this.activedIndex].empEmployeeId = selected[0].employeeId
          this.signForm.payDiffStoreList[this.activedIndex].employeeCode = selected[0].employeeCode
          this.signForm.payDiffStoreList[this.activedIndex].orgName = selected[0].unitName
        }
      },
      handleLoaded (vm) {
        this.signForm.payDiffStoreList = vm.clone
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },
      fillIn (data) {
        this.table.data = data.payDiffStoreList
//        Object.keys(data).map(key => {
//          this.signForm[key] = data[key]
//        })
//        Object.keys(this.date).map(key => {
//          this.date[key] = data[key]
//        })
      },

      postFlow () {
        return this.signForm
      }
    },

    created () {
    },

    computed: {
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
