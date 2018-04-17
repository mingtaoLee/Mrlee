<template>
  <div class="cjy-newsecond">
   <i-process-flow
     @fillin="fillIn"
     :processType="processType"
     :model="newParams"
     :createName ="newParams.employeeNamesList"
     >
      <!-- :createName ="employeeNamesList" -->
     <!-- <h1 class="header title">{{flowBasicInfo.applicantName}}在{{flowBasicInfo.applicationDate}}提交的{{actionType}}申请流程</h1>
     <basic-info @basicInfo="getFlowBasicInfo"></basic-info> -->
     <!-- 基本信息 -->
     <div slot="base" class="content-follow new-second">
      <!-- <section class="content-follow new-second"> -->
        <h2 class="info-title">借调信息</h2>
        <el-form
          :model="newParams"
          class="info-content"
          label-width="150px"
          :rules="rule">

            <el-form-item
            label="借调人员"
            prop="employeeNamesList"
            v-if="showMap.employeeNamesList"
            >
              <el-input
              v-model="newParams.employeeNamesList"
              :disabled="disabledMap.employeeNamesList"
              readonly>
                  <i
                  v-if="!disabledMap.employeeNamesList"
                  slot="suffix"
                  class="el-icon-menu"
                  @click="handleIconClick"
                  ></i>
              </el-input>
              <i-personnel-select
                :isShow.sync="isShow"
                :disabled="disabledMap.employeeNamesList"
                @confirm="handleConfirm"
                 :modal='false'
                 :multiple="false"
                 :hasGrant="false"
                  filterType="personnelGroup"
                 />
            </el-form-item>

            <el-form-item
             label="借入方组织"
             prop="toOrgUnitId"
             v-if="showMap.toOrgUnitId"
             >
              <i-select-tree
                v-model="newParams.toOrgUnitId"
                dataKey="org"
                nodeKey="orgUnitId"
                :props="orgProps"
                :lazy="true"
                :disabled="disabledMap.toOrgUnitId"
                :hasGrant="false"
                >
              </i-select-tree>
            </el-form-item>

            <el-form-item
             label="调动类型"
            prop="salaryType"
            v-if="showMap.salaryType"
            >
                <i-select
                parameter="SECONDMENT_TYPE"
                v-model="newParams.salaryType"
                :disabled="disabledMap.salaryType && disTimeSalary"
                ></i-select>
            </el-form-item>

            <el-form-item label="借调开始时间" prop="beginDate" v-if="showMap.beginDate">
              <el-date-picker 
              :disabled="disabledMap.beginDate" 
              v-model="newParams.beginDate" 
              value-format="yyyy-MM-dd" 
              :picker-options="pickerOptions1"
              ></el-date-picker>
            </el-form-item>

          <el-form-item label="借调结束时间" prop="endDate" v-if="showMap.endDate">
            <el-date-picker :disabled="disabledMap.endDate" v-model="newParams.endDate" value-format="yyyy-MM-dd" :picker-options="pickerOptions2"></el-date-picker>
          </el-form-item>

            <el-form-item label="备注" class="wilder" prop="des" v-if="showMap.des">
              <el-input
                v-model="newParams.des"
                type="textarea"
                width='100%'
                maxlength="100"
                 :disabled="disabledMap.des"
                :autosize="{ minRows: 2, maxRows: 4}">
              </el-input>
            </el-form-item>

              <!-- <el-form-item label="附件" class="uploaderForm">
                <i-upload
                  :previewMode="previewMode"
                  :fileList="newParams.fileList"
                  @onRemove="onFileRemove"
                  @onSuccess="onFileSuccess"
                  @onError="onFileError"
                >
                </i-upload>
              </el-form-item> -->
        </el-form>
      <!-- </section> -->
     </div>
     <!-- 费用以及工时 -->
     <div slot="cost"  class="content-follow">
      <!-- <section class="content-follow"> -->
        <h2 class="info-title">借调工时及费用信息</h2>
        <el-form
          class="info-content"
          :model="newParams"
          label-width="150px"
          :rules='rules'
          ref="ruleForm">

          <el-form-item label="借调工时" prop="manHour" v-if="showMap.manHour">
            <el-input v-model="newParams.manHour" :disabled="disabledMap.manHour && disTimeSalary"></el-input>
          </el-form-item>

          <el-form-item label="借调费用(元)" prop="salary" v-if="showMap.salary">
              <el-input v-model="newParams.salary" :disabled="disabledMap.salary && disTimeSalary"></el-input>
          </el-form-item>

        </el-form>
      <!-- </section> -->
     </div>
     <!-- 生成工时报表 -->
     <!-- <div slot="hrFillIn">
      <div class='showTimeSalary'>
       <el-button type="primary">生成工时报表</el-button>
       <el-button type="primary">生成费用报表</el-button>
      </div>
     </div> -->
   </i-process-flow>
  </div>
</template>
<script>
  import ButtonGroup from 'components/flow/button-group'
  import BasicInfo from 'components/flow/basic-info'
  import ISelect from 'components/common/i-select/i-select'
  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import ISelectTree from 'components/common/i-select-tree/i-select-tree'
  import IProcessFlow from 'components/common/i-process-flow/index'
  import req from 'api/employee/personal'
  import IUpload from 'components/common/upload/uploader'
  export default {
    components: {
      ButtonGroup,
      BasicInfo,
      ISelect,
      IPersonnelSelect,
      ISelectTree,
      IProcessFlow,
      IUpload
    },
    data () {
      const validateMoney = (rule, value, cb) => {
        var num = /^[0-9]+([.]{1}[0-9]+){0,1}$/
        !value && cb(new Error('不能为空'))
        // !this.jobInfo.expectedRegularSalaryType && cb(new Error('薪资单位不能为空'))
        // !this.jobInfo.probationSalaryType && cb(new Error('薪资单位不能为空'))
        setTimeout(function () {
          !num.exec(value) ? cb(new Error('必须为数字')) : cb()
        }, 0)
      }
      return {
        previewMode: false,
        date: {
          start: '',
          end: '',
          exstart: '',
          exend: ''
        },
        isShow: false,
        newParams: {
          employeeIdsList: [],
          employeeNamesList: '',
          // TODO:借入组织ID
          toOrgUnitId: '',
          orgUnitIds: '', // 原组织
          // TODO:备注字段
          des: '',
          expectedBeginDate: '',
          expectedEndDate: '',
          beginDate: '',
          endDate: '',
          manHour: '',
          salary: '',
          salaryType: '',
          fileList: []
        },
        pickerOptions1: {
          disabledDate: (time) => {
            let endDate = new Date(this.newParams.endDate)
            if (endDate) {
              return time.getTime() > endDate
            }
            // return time.getTime() < Date.now() - 8.64e7
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let beginDateVal = new Date(this.newParams.beginDate)
            if (beginDateVal) {
              return time.getTime() < beginDateVal
            }
          }
        },
        // 验证
        rule: {
          employeeNamesList: [{ required: true, message: '借调人员不能为空', trigger: 'change' }],
          toOrgUnitId: [{ required: true, message: '借调组织不能为空', trigger: 'change' }],
          salaryType: [{ required: true, message: '薪水类型不能为空', trigger: 'change' }],
          beginDate: [{ required: true, message: '开始日期不能为空', trigger: 'blur' }],
          endDate: [{ required: true, message: '结束日期不能为空', trigger: 'change' }]
        },
        rules: {
          manHour: [
            { required: true, validator: validateMoney, trigger: 'blur' }
          ],
          salary: [
            { required: true, validator: validateMoney, trigger: 'blur' }
          ]
        },
        // 保存路由带来的信息
        empEmployeeId: this.$route.query.employeeId,
        processStatus: this.$route.query.processStatus,
        taskId: this.$route.query.taskId,
        taskKey: this.$route.query.taskKey,
        processType: this.$route.query.processType,
        slotArr: ['debtorFillIn', 'loanerFillIn', 'debtorFillInCost', 'loanerFillInCost', 'hrFillIn'],
        // // 基础信息禁用
        // // 工时费用禁用
        disTimeSalary: false,
          // 组织下拉树的配置
        orgProps: {
          children: 'children',
          label: 'orgShortName',
          disabled: (data, node) => {
            // console.log(data.orgUnitId === this.newParams.orgUnitIds)
            if (data.orgUnitId === this.newParams.orgUnitIds) {
              return true
            } else {
              return false
            }
          }
        }
      }
    },
    created () {
      if (this.$route.query.taskId) {
        this.previewMode = true
      }
    },
    computed: {
      isSelect: {

      }
    },
    methods: {
       // 日期选择器改变时，赋值
      changeDate ($event, param) {
        this.newParams[param] = $event
      },

       // 人员选择器的显示隐藏
      handleIconClick () {
        this.isShow = !this.isShow
      },

       // 人员选择器的显选中人员
      handleConfirm (selected) {
        this.newParams.employeeIdsList = []
        this.newParams.employeeNamesList = []
        selected.map(key => {
          this.newParams.employeeIdsList.push(key.employeeId)
          this.newParams.employeeNamesList += this.newParams.employeeNamesList.length ? ',' + key.employeeName : key.employeeName
        })
        console.log('selected', selected)
        console.log('this.newParams', this.newParams)
        this.newParams.orgUnitIds = selected[0].unitId
      },
       // 表单的填充
      fillIn () {
        // this.date.start = this.newParams.beginDate
        // this.date.end = this.newParams.endDate
        // 根据组织id获取名字
        // console.log(this.newParams.toOrgUnitId)
        if (!this.newParams.toOrgUnitId) {
          return false
        }
        req('getOrgUnitName', {orgUnitIds: this.newParams.toOrgUnitId})
          .then(res => {
            this.$set(this.newParams, 'node', res[0])
          })
      },

       // 文件成功上传
      onFileSuccess (response, file, fileList) {
        console.log(response, file, fileList)
        this.$message.success('文件上传成功！')
        this.newParams.fileList.push(response)
      },

       // 文件失败上传
      onFileError (err, file, fileList) {
        console.log('err', err, file, fileList)
      },

       // 文件列表移除文件时
      onFileRemove (file, fileList) {
        this.newParams.fileList.map(id => {
          id === file.response && this.newParams.fileList.splice(this.newParams.fileList.indexOf(id), 1)
        })
      }
      // TODO需要修改
      // 生成工时报表
      // getSecondTime () {
      //   this.SecondTime = true
      //   // if (this.SecondTime && this.SecondSalary) {
      //   //   reqFlow('putWorkflowSecondSubmit', this.newParams)
      //   //       .then(data => {
      //   //         this.$message(`提交成功`)
      //   //       })
      //   //       .catch(err => console.log(err))
      //   // }
      // },
      //  // 生成费用报表
      // getSecondSalary () {
      //   this.SecondSalary = true
      //   // if (this.SecondTime && this.SecondSalary) {
      //   //   console.log('true')
      //   //   reqFlow('putWorkflowSecondSubmit', this.newParams)
      //   //       .then(data => {
      //   //         this.$message(`提交成功`)
      //   //       })
      //   //       .catch(err => console.log(err))
      //   // }
      // },
    }
  }
</script>
<style lang="scss">
  .cjy-newsecond {
    .content-follow {
      .el-form-item__content {
        width: 193px;
      }
      .btn {
        position: absolute;
        // right: -69px;
        top:0px;
        margin-right:-32px;
      }
    }
    .showTimeSalary {
      text-align: center;
      padding-bottom: 5px;
    }
    .new-second {
      .wilder {
        .el-form-item__content {
          width: 502px;
        }
    }
    .uploaderForm {
      .uploader {
        width: 800px;
      }
     }
    }
  }

</style>
