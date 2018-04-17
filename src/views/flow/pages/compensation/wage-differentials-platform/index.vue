<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      :model="signForm"
      :processType="processType"
      :createName="signForm.employeeName"
      @jurConfig="jurConfigHandler"
    >
      <section class="content-follow" slot="payDiffList">
        <h2 class="info-title">工资差异明细</h2>
        <i-table
          class="info-content"
          :table="table"
          ref="table"
          v-loading="loading"
          :element-loading-text="$loadingText"
          @loaded="handleLoaded"
        >
          <template slot="table" slot-scope="tableScope">
            <el-table :data="tableScope.clone">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                type="index"
                label="序号"
                width="80">
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
                    @change="handleTableCellChange"
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
                        :async="false"
                        :clearable="false"
                        :options="scope.row.componentInfoList"
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
  import req from 'api/compensation/flow'
  import Editor from 'components/employee/editor'
  import IProcessFlow from 'components/common/i-process-flow'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import IUpload from 'components/common/upload/uploader'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import moment from 'moment'
  import { showMessage } from 'utils/index'
//  import {formatTableDate} from 'utils/employee.js'
  const commonColumns = [
    { prop: 'employeeCode', label: '员工工号', width: '120' },
    { prop: 'employeeName', label: '姓名', width: '120' },
    { prop: 'checkMonth', label: '核算月份', display: { date: 'short' }, width: '120' },
    { prop: 'personnelGroupCode', label: '人事范围代码', width: '140' },
    { prop: 'personnelGroupName', label: '人事范围', width: '140' },
    { prop: 'groupCode', label: '薪资组代码', width: '140' },
    { prop: 'orgName', label: '组织名称', width: '120' },
    { prop: 'posTitleName', label: '职务', width: '120' },
    { prop: 'positionName', label: '职位', width: '120' },
    { prop: 'diffProject', label: '差异项目', width: '120' },
    { prop: 'originMoney', label: '原发放金额', width: '140' },
    { prop: 'updatedMoney', label: '修改后金额', width: '140' },
    { prop: 'diffValue', label: '差异金额', width: '140' },
    { prop: 'diffDesc', label: '工资差异说明', width: '140' }
//    { prop: 'approvalByName', label: '更正方' }
//    { prop: 'total', label: '合计(元)' }
  ]
  const tableColumns = commonColumns.slice(0)
//  tableColumns.splice(5, 3)
  const table2Columns = commonColumns.slice(0)
  table2Columns.splice(5, 2)
  const table3Columns = commonColumns.slice(0, 7)

  const EMPTYDATA = {
    employeeCode: '',
    employeeName: '',
    empEmployeeId: '',
    personnelGroupCode: '',
    personnelGroupName: '',
    groupCode: '',
    posTitleName: '',
    positionName: '',
    orgName: '',
    diffDesc: '',
    diffValue: '',
    checkMonth: '',
    diffProject: '',
    originMoney: '',
    updatedMoney: '',
    approvalBy: '',
    approvalByName: '',
    componentInfoList: [],
    total: ''
  }

  export default {
    data () {
      return {
        loading: false,
        isShowPersonnel: false,
        isPersonnelApproval: false,
        activedIndex: null,
        itemProps: {
          value: 'componentId',
          label: 'diffProject'
        },
        table: {
          columns: tableColumns, // 表头
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
              func: vm => vm.createData(EMPTYDATA)
            }, {
              text: '删除',
              type: 'danger',
              show: () => {
                return { empty: !this.showMap['toolbarDel'] }
              },
              func: vm => {
                if (vm.getMultipleSelection().length === vm.clone.length) {
                  return showMessage('warning', '至少保留一行数据')
                }
                vm.deleteData()
              }
            }],
            editor: {
              employeeCode: {
                disable: true
              },
              employeeName: {
                rules: [
                  { required: true, message: '不能为空', trigger: 'change' }
                ]
              },
              orgName: {
                disable: true
              },
              diffDesc: {
                rules: [
                  { required: true, message: '不能为空', trigger: 'change' }
                ]
              },
              originMoney: {
                disable: true
              },
              updatedMoney: {
                type: 'number',
                rules: [
//                  { required: true, message: '不能为空', trigger: 'change' }
                  {
                    validator: (rule, value, callback) => {
                      if (!value) {
                        return callback(new Error('不能为空'))
                      }
                      callback()
                    }
                  }
                ]
              },
              diffValue: {
                disable: true
              },
              checkMonth: {
                type: 'date',
                rules: [
//                  { required: true, message: '不能为空', trigger: 'change' }
                  {
                    validator: (rule, value, callback) => {
                      if (!value) {
                        return callback(new Error('不能为空'))
                      }
                      callback()
                    }
                  }
                ],
                options: {
                  type: 'month'
                }
              },
              diffProject: {
                rules: [
                  { required: true, message: '不能为空', trigger: 'change' }
                ]
              },
//              approvalBy: '',
              personnelGroupCode: {
                disable: true
              },
              personnelGroupName: {
                disable: true
              },
              groupCode: {
                disable: true
              },
              positionName: {
                disable: true
              },
              posTitleName: {
                disable: true
              },
              total: {
                disable: true
              }
            }
          },
          disable: false,
          editable: true,
          data: [EMPTYDATA] // 占位符，用于挂载数据
        },
        table2: {
          columns: table2Columns, // 表头
          setting: {
            // import: {
            //   business: '',
            //   show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            // },
            toolbar: [{
              text: '添加',
              func: vm => vm.createData()
            }, {
              text: '删除',
              type: 'danger',
              func: vm => vm.deleteData()
            }],
            editor: {
              credentialName: {},
              credentialUnit: {},
              beginDate: {
                type: 'date'
              },
              endDate: {
                type: 'date'
              }
            }
          },
          editable: true,
          data: null // 占位符，用于挂载数据
        },
        table3: {
          columns: table3Columns, // 表头
          setting: {
            // import: {
            //   business: '',
            //   show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            // },
            toolbar: [{
              text: '添加',
              func: vm => vm.createData()
            }, {
              text: '删除',
              type: 'danger',
              func: vm => vm.deleteData()
            }],
            editor: {
              credentialName: {},
              credentialUnit: {},
              beginDate: {
                type: 'date'
              },
              endDate: {
                type: 'date'
              }
            }
          },
          editable: true,
          data: null // 占位符，用于挂载数据
        },

        previewMode: false,
        isShow: false, // 人员选择器
        show: false,
        empEmployeeId: this.$route.query.empEmployeeId,
        taskId: this.$route.query.taskId,
        taskKey: this.$route.query.taskKey,
        processType: this.$route.query.processType,
        signForm: {
          payDiffList: []
        }
      }
    },

    methods: {
      jurConfigHandler (showMap, disabledMap) {
//        console.log('what the ??', showMap, disabledMap)
        this.table.disable = !!disabledMap['payDiffWorkFlowTable']
      },
      showDiffItems (col, scope) {
        return col.prop === 'diffProject' && scope.row.empEmployeeId && scope.row.checkMonth && scope.row.componentInfoList
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
        scope.originMoney = event.originMoney
        scope.diffValue = scope.updatedMoney - scope.originMoney
      },
      handleLoaded (vm) {
        this.signForm.payDiffList = vm.clone
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
          this.signForm.payDiffList[this.activedIndex].approvalByName = selected[0].employeeName
          this.signForm.payDiffList[this.activedIndex].approvalBy = selected[0].employeeId
          this.isPersonnelApproval = false
        } else {
          this.signForm.payDiffList[this.activedIndex].employeeName = selected[0] ? selected[0].employeeName : ''
          this.signForm.payDiffList[this.activedIndex].empEmployeeId = selected[0] ? selected[0].employeeId : ''
          this.signForm.payDiffList[this.activedIndex].employeeCode = selected[0] ? selected[0].employeeCode : ''
//          this.signForm.payDiffList[this.activedIndex].orgName = selected[0] ? selected[0].unitName : ''
          this.signForm.payDiffList[this.activedIndex].positionName = selected[0] ? selected[0].positionName : ''
          this.signForm.payDiffList[this.activedIndex].personnelGroupCode = ''
          this.signForm.payDiffList[this.activedIndex].personnelGroupName = ''
          this.signForm.payDiffList[this.activedIndex].groupCode = ''
          this.signForm.payDiffList[this.activedIndex].posTitleName = ''
          this.signForm.payDiffList[this.activedIndex].originMoney = ''
          this.signForm.payDiffList[this.activedIndex].componentInfoList = []
          this.signForm.payDiffList[this.activedIndex].orgName = ''
          if (selected[0] && this.signForm.payDiffList[this.activedIndex].checkMonth) {
            this.loading = true
            this.getWageDiffPersonnelInfo({
              checkMonth: moment(this.signForm.payDiffList[this.activedIndex].checkMonth).format('YYYYMM'),
              employeeId: selected[0].employeeId
            }).then(res => {
              console.log(res)
              this.signForm.payDiffList[this.activedIndex].personnelGroupCode = res.personnelGroupCode
              this.signForm.payDiffList[this.activedIndex].personnelGroupName = res.personnelGroupName
              this.signForm.payDiffList[this.activedIndex].groupCode = res.groupCode
              this.signForm.payDiffList[this.activedIndex].posTitleName = res.posTitleName
              this.signForm.payDiffList[this.activedIndex].componentInfoList = res.componentInfoList
              this.signForm.payDiffList[this.activedIndex].orgName = res.orgUnitName
            }).finally(() => {
              this.loading = false
            })
          }
        }
      },
      getWageDiffPersonnelInfo (params) {
        return req('getWageDiffPersonnelInfo', params)
      },
      handleTableCellChange (data) {
        console.log('sss', data)
        if (data.col === 'checkMonth' || data.col === 'employeeName') {
          if (data.row.empEmployeeId && data.row.checkMonth) {
            this.loading = true
            this.getWageDiffPersonnelInfo({
              checkMonth: moment(data.row.checkMonth).format('YYYYMM'),
              employeeId: data.row.empEmployeeId
            }).then(res => {
              console.log(res)
              data.row.personnelGroupCode = res.personnelGroupCode
              data.row.personnelGroupName = res.personnelGroupName
              data.row.groupCode = res.groupCode
              data.row.posTitleName = res.posTitleName
              data.row.componentInfoList = res.componentInfoList
              data.row.orgName = res.orgUnitName
            }).catch(() => {
              data.row.componentInfoList = []
              data.row.personnelGroupName = data.row.personnelGroupCode = data.row.groupCode = ''
              data.row.posTitleName = data.row.orgName = data.row.diffProject = data.row.diffValue = data.row.originMoney = ''
            }).finally(() => {
              this.loading = false
            })
          }
        }
        if (data.col === 'updatedMoney' && /^[0-9]+.?[0-9]*$/.test(data.row.originMoney)) {
          data.row.diffValue = data.val - data.row.originMoney
        }
      },
      fillIn (data) {
        this.table.data = data.payDiffList
//        Object.keys(data).map(key => {
//          this.signForm[key] = data[key]
//        })
//        Object.keys(this.date).map(key => {
//          this.date[key] = data[key]
//        })
      },

      postFlow () {
        let data = JSON.parse(JSON.stringify(this.signForm))
        data.payDiffList.forEach(v => {
          delete v.componentInfoList
        })
        return data
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
