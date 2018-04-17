<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      :model="signForm"
      :taskI="taskId"
      :processType="processType"
      :createName="signForm.employeeName"
      :taskKey="taskKey">

      <section class="content-follow" slot="allFlow">
        <h2 class="info-title">工资差异明细</h2>
        <i-table class="info-content" :table="table" ref="table">
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
      </section>
    </i-process-flow>
  </div>
</template>
<script>
  import ButtonGroup from 'components/flow/button-group'
  import BasicInfo from 'components/flow/basic-info'
  import ISelect from 'components/common/i-select/i-select'
  import req from 'api/employee/contract'
  import Editor from 'components/employee/editor'
  import IProcessFlow from 'components/common/i-process-flow'
  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import IUpload from 'components/common/upload/uploader'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
//  import {formatTableDate} from 'utils/employee.js'

  export default {
    data () {
      return {
        table: {
          columns: [
            { prop: 'credentialName', label: '序号' },
            { prop: 'credentialUnit', label: '员工工号' },
            { prop: 'credentialName', label: '姓名' },
            { prop: 'credentialUnit', label: '所属部门' },
            { prop: 'credentialName', label: '差异总金额' }
          ], // 表头
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
            }, {
              text: '查看未汇总差异',
              func: vm => {}
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
          leastSalary: '',
          workAdress: '',
          employeeName: '',
          employeeCode: '',
          orgUnitName: '',
          positionName: '',
          empEmployeeId: '',
          empContractId: '',
          contractNo: '',
          contractType: '',
          empTemplateId: '',
          contractAddress: '',
          startDate: '',
          endDate: '',
          contractSubject: '',
          companyName: '',
          contractPeriod: '',
          contractPeriodType: '',
          signDate: '',
          contractContent: '',
          fileList: []
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
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },
      fillIn (data) {
        Object.keys(data).map(key => {
          this.signForm[key] = data[key]
        })
        Object.keys(this.date).map(key => {
          this.date[key] = data[key]
        })
      },

      getContractNo () {
        req('getContactNo')
          .then(data => (this.signForm.contractNo = data))
      },

      dateChange ($event, param) {
        this.signForm[param] = $event
      },
      handleIconClick () {
        this.isShow = !this.isShow
      },
      handleConfirm (selected) {
        // 拼接字段
        this.signForm.employeeName = selected[0].employeeName
        this.signForm.empEmployeeId = selected[0].employeeId
        this.signForm.employeeCode = selected[0].employeeCode
        this.signForm.orgUnitName = selected[0].unitName
        this.signForm.positionName = selected[0].positionName
      },
      previewContract () {
        if (this.signForm.empTemplateId) {
          this.showContract()
          console.log('3', this.signForm)
          this.show = true
        } else {
          this.rulesShow = true
        }
      },

      ruleShow () {
        this.signForm.empTemplateId ? this.rulesShow = false : this.rulesShow = true
      },

      showContract () {
        this.signForm.contractContent = this.contractContent
        this.dd(this.signForm, this.dictArr)

        // await Object.keys(this.signForm).map((key, idx) => {
        //   let reg = new RegExp('{' + key + '}', 'g')
        //   let fill

        //   let dd = async (dictCode, value) => {
        //     if (this.dictArr[key] && this.signForm[key]) {
        //       let data = await req('getDict', {dictCode})

        //       data.map(key => (key.value === value) && (fill = key.label))
        //     } else {
        //       fill = this.signForm[key] ? this.signForm[key] : ' '

        //       key === 'contractSubject' && (this.contractSubjectList.map(key => {
        //         this.signForm.contractSubject === key.empCompanyCode && (fill = key.empCompanyName)
        //       }))
        //     }

        //     this.signForm.contractContent = this.signForm.contractContent.replace(reg, fill)
        //     console.log('啦啦啦啦绿', this.signForm.contractContent)
        //   }

        //   dd(this.dictArr[key], this.signForm[key])
        // })
      },

      dd (obj, dictArr) {
        let dict = this.dict

        Object.keys(obj).map(key => {
          let reg = new RegExp('{' + key + '}', 'g')
          let fill

          if (dict[key]) {
            dict[key].map(fil => {
              fil.value === obj[key] && (fill = fil.label)
            })
          } else {
            fill = this.signForm[key] ? this.signForm[key] : ''
            key === 'contractSubject' && (this.contractSubjectList.map(key => {
              this.signForm.contractSubject === key.empCompanyCode && (fill = key.empCompanyName)
            }))
          }

          this.signForm.contractContent = this.signForm.contractContent.replace(reg, fill)
        })
      },

      postFlow () {
        this.showContract()
        return this.signForm
        // await this.showContract().then(
        //   () => {
        //     return this.signForm
        //    }
        // )
        // console.log(1, this.signForm)
      },
      submitContract () {
        if (this.signForm.empTemplateId) {
          let aa = async () => {
            await this.showContract()
            this.putContractsSign()
          }

          aa()
        } else {
          this.rulesShow = true
        }
      },

      /** 发起合同新签 */
      putContractsSign (data) {
        data && (this.signForm.contractContent = data)
        let a

        (this.empPfId !== 'undefined') ? a = 'putContractsSignByFlow' : a = 'putContractsSign'
        this.signForm.empPfId = this.empPfId === 'undefined' ? '' : this.empPfId
        ;(this.signForm.contractPeriodType !== '1') && (this.signForm.endDate = '')

        req(a, this.signForm)
          .then(data => {
            this.$message(`${data}新签成功`)
            ;(this.show) && (this.show = false)
            ;(this.empEmployeeId !== 'undefined') && this.getDefaultSign(this.empEmployeeId)
            ;(this.empPfId !== 'undefined') && this.getDefaultSignByFlow(this.empPfId)
          }).catch(err => (console.log(err)))
      },

      getFlowBasicInfo (data) {
        Object.assign(this.flowBasicInfo, data)
      },

      getTemplateList (contractType) {
        let status = {status: 1}

        contractType && (status.contractType = contractType)

        req('getContractList', status)
          .then(data => {
            this.templateList = data.data
            // console.log(this.templateList)
          })
      },

      getDefaultSign (empEmployeeId) {
        req('getDefaultSign', {empEmployeeId})
          .then(data => {
//            data.endDate && formatTableDate([data], ['endDate'])
            Object.keys(data).map(key => {
              data[key] && (this.signForm[key] = data[key])
            })
            // this.signForm = data
          })
      },

      getDefaultSignByFlow (empPfId) {
//        req('getContractWorkflow', {empPfId})
//        .then(data => {
//          let buss = JSON.parse(data.bussinessData)
//          Object.keys(buss).map(key => {
//            this.signForm[key] = buss[key]
//          })
//        })
      },

      getContractContent (templateId) {
        req('showTemplate', {templateId})
          .then(data => {
            this.signForm.contractContent = data.templateContent
            this.contractContent = data.templateContent
          })
          .catch(err => console.log(err))
      },
      // 获取合同主体列表
      getContentDetailList () {
        req('getContentDetailList', {}).then(res => {
          this.contractSubjectList = res
        })
      },

      setDate (date, per) {
        let now = new Date(date)

        this.signForm.endDate = (new Date(now.setFullYear(now.getFullYear() + +per))).toISOString().substr(0, 10)
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
//      ;(this.empEmployeeId !== 'undefined') && this.getDefaultSign(this.empEmployeeId)
//      this.getContentDetailList()
//      Object.keys(this.dictArr).map(dic => {
//        console.log(this.dictArr[dic])
//        req('getDict', {dictCode: this.dictArr[dic]}).then(res => {
//          this.dict[dic] = res
//        })
//      })
//      console.log(this.dict)
    },

    computed: {

      empTemplateId () {
        return this.signForm.empTemplateId
      },

      contractType () {
        return this.signForm.contractType
      },

      contractPeriod () {
        return this.signForm.contractPeriod
      },

      startDate () {
        return this.signForm.startDate
      },

      employeeName () {
        return this.signForm.employeeName
      },
      contractSubject () {
        return this.signForm.contractSubject
      }
    },

    watch: {
      // 监听员工姓名，如果姓名为空，则以下信息为空
      employeeName (newVal, oldVal) {
        if (newVal === '') {
          this.signForm.employeeName = ''
          this.signForm.empEmployeeId = ''
          this.signForm.employeeCode = ''
          this.signForm.orgUnitName = ''
          this.signForm.positionName = ''
          console.log(this.signForm)
        }
      },

      empTemplateId (newVal, oldVal) {
        (newVal !== oldVal) && this.getContractContent(newVal)
      },

      contractType (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getTemplateList(newVal)
          ;(newVal === '') && (this.signForm.empTemplateId = '')
        }
      },

      contractSubject (newVal, oldVal) {
        this.contractSubjectList.map(key => {
          key.empCompanyCode === newVal && (this.signForm.companyName = key.empCompanyName)
        })
      },

      contractPeriod (newVal, oldVal) {
        newVal ? this.signForm.startDate && this.setDate(this.signForm.startDate, newVal) : this.signForm.endDate = ''
      },

      startDate (newVal, oldVal) {
        newVal ? this.signForm.contractPeriod && this.setDate(newVal, this.signForm.contractPeriod) : this.signForm.endDate = ''
      }
    },

    components: {
      ButtonGroup,
      BasicInfo,
      ISelect,
      Editor,
      IProcessFlow,
      IPersonnelSelect,
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
