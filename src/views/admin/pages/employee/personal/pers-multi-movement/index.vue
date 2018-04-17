<template>
  <div class="emp-multi-movement">
    <!-- <i-process-flow 
      :taskI="taskId" 
      :processType="processType" 
      :slotArr="slotArr" 
      :createName="multiInfo.transFerList.fullName"
      :model="multiInfo" 
      :taskKey="taskKey"
      > -->
      <!-- <div slot="empFillIn"> -->
        <emp-multi-info :multiInfo="multiInfo" ref="infoRef"></emp-multi-info>        
      <!-- </div> -->
      <div class="submitButton">
        <div class="button">
          <!-- v-if="accessMap.empEmployeesTransfersPut" -->
          <el-button type="primary" size="small" @click="submitMultiInfo" >提交</el-button>
        </div>
        <div class="button">
          <el-button size="small" @click="cancel">取消</el-button>
        </div>
      </div>

      <!-- </i-process-flow> -->
      <el-dialog title="提示信息" :visible.sync="messageVisible" size="small">
          <div v-for="(key, idx) in message" :key="idx" class='text'>{{key}}</div>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="cancel">取 消</el-button> -->
          </div>
      </el-dialog>

  </div>
</template>
<script>
  // 引入处理按钮显示隐藏的文件
  import access from 'mixins/access'
  import req from 'api/employee/personal'
  import EmpMultiInfo from 'components/employee/multi-movement/emp-multi-info'
   // import IProcessFlow from 'components/common/i-process-flow'
  // import { getActionType } from 'utils/employee'
  import {formatTableDate} from 'utils/employee.js'
export default {
    components: {
      EmpMultiInfo
      // IProcessFlow
    },
    mixins: [access],
    data () {
      return {
        actionType: '',
        empEmployeeId: this.$route.query.empEmployeeId,
        processStatus: this.$route.query.processStatus,
        taskId: this.$route.query.taskId,
        taskKey: this.$route.query.taskKey,
        processType: this.$route.query.processType,
        slotArr: ['empFillIn', 'groupTask', 'empTask', 'outEmpFillIn', 'inEmpFillIn'],
        multiInfo: {
          transFerList: [
            // {
            //   'empEmployeeId': '',
            //   'employeeCode': '',
            //   'employeeStatus': '',
            //   'empPositionId': '',
            //   'hireDate': '',
            //   'fullName': '',
            //   'transferType': null,
            //   'empStaffRecordId': null,
            //   'transferReason': null,
            //   'transferDate': '',
            //   'oldCompanyId': null,
            //   'oldOrgUnitId': '',
            //   'oldPersonnelArea': null,
            //   'idNumber': '',
            //   'empTypeConversion': null,
            //   'posJobFamilyId': null,
            //   'posStandardJobId': null,
            //   'oldPosPositionId': '11',
            //   'oldWorkSystem': '2',
            //   'oldSalaryAccounting': null,
            //   'oldEmployeeType': '',
            //   'oldSalary': '',
            //   'oldSurety1': '',
            //   'oldSurety2': '',
            //   'oldSuretyName1': '',
            //   'oldSuretyName2': '',
            //   'newCompanyId': null,
            //   'newOrgUnitId': null,
            //   'newPersonnelArea': null,
            //   'newPosPositionId': null,
            //   'newWorkSystem': null,
            //   'newSalaryAccounting': null,
            //   'newEmployeeType': null,
            //   'newSalary': null,
            //   'newSurety1': null,
            //   'newSurety2': null,
            //   'status': null
            // }
          ]
        },
        message: '',
        messageVisible: false
      }
    },
    methods: {
      // getFlowBasicInfo (data) {
      //   Object.assign(this.flowBasicInfo, data)
      // },
  
       // 清楚选中
      clearSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
          this.resetSelection()
          this.employeeStatusList.length = 0
          this.employeeIdList.length = 0
        }
      },

       // 取消操作的提示
      cancel () {
        this.$alert('取消操作会关闭窗口，是否关闭窗口', '注意', {
          confirmButtonText: '确定',
          showCancelButton: true,
          callback: action => {
            if (action === 'cancel') {
              return
            }
            window.close()
          }
        })
      },

       // 操作成功提示
      handleClose () {
        this.$alert('提交成功，是否关闭窗口', '注意', {
          confirmButtonText: '确定',
          showCancelButton: true,
          callback: action => {
            if (action === 'cancel') {
              return
            }
            window.close()
          }
        })
      },

       // 提交批量调动信息
      submitMultiInfo () {
        let flag = true
        let message = []
        this.multiInfo.transFerList.forEach((item, i) => {
          // 必填项：调动日期，用工类型，薪资范围，薪资，工作制，调动类型，调动原因, 用工类型转换,人事范围，公司, 组织， 职位
          if (!item.transferDate || !item.newEmployeeType || !item.newSalaryAccounting || !item.newSalary || !item.newWorkSystem || !item.transferType || !item.transferReason || !item.newCompanyCode || !item.newPersonnelGroupCode || !item.newOrgUnitId || !item.newPosPositionId) {
            // 已经有改人员的提示信息，则不需要在添加
            if (message.includes(item.fullName)) {
              flag = false
              return false
            }
            message.push(`${item.fullName}调动异常,请先填写必填信息`)
            flag = false
          }
          // 调动原因为6 则必须要填写用工类型转换
          if (item.transferReason === '6' && !item.empTypeConversion) {
                // 已经有改人员的提示信息，则不需要在添加
            if (message.includes(item.fullName)) {
              flag = false
              return false
            }
            message.push(`${item.fullName}调动异常,请先填写必填信息`)
            flag = false
          }
           // 如果显示了联保人，则必须要选择联保人
          if (item.isShowSalary && (!item.newSuretyName1 || !item.newSuretyName2)) {
                  // 已经有改人员的提示信息，则不需要在添加
            if (message.includes(item.fullName)) {
              flag = false
              return false
            }
            message.push(`${item.fullName}调动异常,请先填写必填信息`)
            flag = false
          }
          if (!item.newPosPositionId || item.newPosPositionId === item.oldPosPositionId) {
            // message += ` <p>${item.fullName}调动异常,人员没有调动 </p> `
            message.push(`${item.fullName}调动异常,人员没有调动 `)
            flag = false
          }
        })
        if (!flag) {
          this.messageVisible = true
          this.message = message
          return false
        }
        // 通过校验之后才发送数据
        //  提交之前需要将transferDate转换为string
        formatTableDate(this.multiInfo.transFerList, ['transferDate'])
        req('putMultiTransfer', this.multiInfo)
          .then(res => {
            if (res) {
              // this.$refs.infoRef.clearSelection()
              this.handleClose()
            } else {
              this.$message.warning('批量调动操作失败，请重新操作')
            }
          })
      }
      //  发起流程前的检测
      // postFlow () {
        // let flag = true
        // let message = []
        // this.multiInfo.transFerList.forEach((item, i) => {
        //   // 必填项：调动日期，员工类型，薪资范围，薪资，工作制，调动类型，调动原因
        //   if (!item.transferDate || !item.newEmployeeType || !item.newSalaryAccounting || !item.newSalary || !item.newWorkSystem || !item.transferType || !item.transferReason) {
        //     // 已经有改人员的提示信息，则不需要在添加
        //     if (message.includes(item.fullName)) {
        //       flag = false
        //       return false
        //     }
        //     message.push(`${item.fullName}调动异常,请先填写必填信息`)
        //     flag = false
        //   }
        //   if (!item.newPosPositionId || item.newPosPositionId === item.oldPosPositionId) {
        //     // message += ` <p>${item.fullName}调动异常,人员没有调动 </p> `
        //     message.push(`${item.fullName}调动异常,人员没有调动 `)
        //     flag = false
        //   }
        // })
        // if (flag) {
        //   return this.multiInfo
        // } else {
        //   console.log(message)
        //   // this.$message({
        //   //   dangerouslyUseHTMLString: true,
        //   //   message: message,
        //   //   type: 'warning'
        //   // })
        //   this.messageVisible = true
        //   this.message = message
        //   return null
        // }
      // }
      // fillIn (data) {
      //   Object.keys(data).map(key => {
      //     this.multiInfo[key] = data[key]
      //   })
      // }
    }
    // created () {
    //   // this.processType = getActionType(this.$route.query.processType)
    //   // if (this.$route.query.empEmployeeId === '-1') {
    //   //   return false
    //   // } else {
    //   //   // this.getTransferInfo()
    //   // }
    // }
  }
</script>
<style lang="scss" scoped>
  .text {
    margin: 8px;
    font-size: 16px
  }
  .submitButton {
    float: right;
    margin-right: 20px;
    .button {
      display: inline-block;
      margin: 0px 15px 20px 0px;
    }
  }
</style>


