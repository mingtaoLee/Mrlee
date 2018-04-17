<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      :postFlow="postFlow"
      :processType="processType"
      :createName="signForm.employeeName"
      @jurConfig="jurConfigHandler"
    >
      <section class="content-follow" slot="profitBonusList">
        <h2 class="info-title">利润分红数据明细</h2>
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
//  import {formatTableDate} from 'utils/employee.js'

  export default {
    data () {
      return {
        activedIndex: null,
        isShowPersonnel: false,
        table: {
          columns: [
            { prop: 'employeeCode', label: '员工工号' },
            { prop: 'employeeName', label: '姓名' },
            { prop: 'orgUnitName', label: '门店名称' },
            { prop: 'orgUnitCode', label: '店编' },
            { prop: 'storeName', label: '小店名称' },
            { prop: 'titleName', label: '职务' },
            { prop: 'groupName', label: '薪资组' },
            { prop: 'checkMonth', label: '核算月份', display: { date: 'short' } },
            { prop: 'shouldProfitBonus', label: '利润分红' }
          ], // 表头
          setting: {
            import: {
              business: 'cps-workflow-profitbonus',
              show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            },
            toolbar: [{
              text: '添加',
              show: () => {
                return { empty: !this.showMap['toolbarAdd'] }
              },
              func: vm => vm.createData({
                employeeCode: '',
                employeeName: '',
                shouldProfitBonus: '',
                checkMonth: '',
                groupName: '',
                orgUnitName: '',
                orgUnitCode: '',
                storeName: '',
                titleName: ''
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
              orgUnitName: {
                disable: true
              },
              orgUnitCode: {
                disable: true
              },
              storeName: {
                disable: true
              },
              titleName: {
                disable: true
              },
              employeeCode: {
                disable: true
              },
              groupName: {
                disable: true
              },
              shouldProfitBonus: {
                rules: [
                  {pattern: /^[1-9]\d{0,10}(\.\d{1,2})?$/, message: '文本框只能输入大于0的最长11位整数，两位小数', trigger: 'change'}
                ]
                // type: 'number'
              },
              checkMonth: {
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
          profitBonusList: []
        },

        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500,
          toolbars: [['print']]
        },
        dictArr: {
          contractType: 'CONTRACT_TYPE',
          contractPeriodType: 'CONTRACT_PERIOD_TYPE'
        },
        dict: {}
      }
    },

    methods: {
      jurConfigHandler (showMap, disabledMap) {
        this.table.disable = !!disabledMap['profitBonusWorkflowTable']
      },
      handleLoaded (vm) {
        this.signForm.profitBonusList = vm.clone
      },
      handlePersonnelClick (scope) {
        this.activedIndex = scope.$index
        this.isShowPersonnel = true
      },
      handlePersonnelDialogConfirm (selected) {
        this.signForm.profitBonusList[this.activedIndex].employeeName = selected[0].employeeName
        this.signForm.profitBonusList[this.activedIndex].empEmployeeId = selected[0].employeeId
        this.signForm.profitBonusList[this.activedIndex].employeeCode = selected[0].employeeCode
        this.signForm.profitBonusList[this.activedIndex].orgName = selected[0].unitName
        this.getProfitBonusListDataByEmployeeId(selected[0].employeeId)
          .then(res => {
            console.log(res)
            if (res) {
              Object.keys(res).map((v) => {
                this.signForm.profitBonusList[this.activedIndex][v] = res[v]
              })
            }
          })
      },
      getProfitBonusListDataByEmployeeId (employeeId) {
        return req('getProfitBonusInfoById', { employeeId })
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },
      fillIn (data) {
        console.log('fillin', data)
        this.table.data = data.profitBonusList
//        Object.keys(data).map(key => {
//          this.signForm[key] = data[key]
//        })
//        Object.keys(this.date).map(key => {
//          this.date[key] = data[key]
//        })
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
