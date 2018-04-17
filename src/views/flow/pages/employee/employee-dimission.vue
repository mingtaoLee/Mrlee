<template>
  <div class="emp-dimission" id="a">
    <i-process-flow 
     @beforeSubmit="validateTable"
      :processType="processType" 
      :model="postParams"  
      :createName="postParams.employeeName"
      @sponsor="sponsor"
      @baseInfo="baseInfo"
      @postFlow="postFlow"
      >
      <!-- :createName="postParams.employeeName" -->
      
      <!-- <div slot="empFillIn" >
        <div  id="empFillIn"> -->
          <div slot="base"><emp-dimission :dimissionInfo="postParams"></emp-dimission></div>
          <div slot="financial"><emp-financial :dimissionInfo="postParams" ref="financial"/></div>
         <!-- </div>
      </div> -->
      <!-- 新增节点 -->
      <!-- <div slot="cashOffice" ></div>
      <div slot="familyOffice" ></div>
      
      <div slot="suretyFillIn" > -->
        <div slot="partner">
          <emp-partner :partnerInfo="postParams"></emp-partner>
        <!-- </div> -->
      </div>

      <div slot="hr">
        <!-- <div  id="hrFillIn"> -->
          <emp-hr :listParam="postParams" ></emp-hr>
        <!-- </div> -->
      </div>

    </i-process-flow>
  </div>
</template>
<script>
  import EmpDimission from 'components/employee/dimission/emp-dimission'
  import EmpFinancial from 'components/employee/dimission/emp-financial'
  import EmpPartner from 'components/employee/dimission/emp-partner'
  import EmpHr from 'components/employee/dimission/emp-hr'
  import req from 'api/employee/personal'
  import moment from 'moment'

  import IProcessFlow from 'components/common/i-process-flow'

  export default {
    components: {
      EmpDimission,
      EmpFinancial,
      EmpPartner,
      EmpHr,
      IProcessFlow
    },
    data () {
      return {
        empEmployeeId: this.$route.query.employeeId,
        processStatus: this.$route.query.processStatus,
        taskId: this.$route.query.taskId,
        processType: this.$route.query.processType,
        isFlowCenter: this.$route.query.isFlowCenter,
        slotArr: ['empFillIn', 'suretyFillIn', 'assetReceiver', 'cashOffice', 'familyOffice', 'hrFillIn', 'confirm', 'systemTask'],
        postParams: {
          rpcIsFailed: false,
          applicantId: '',
          applicantName: '',
          applicantDate: '',
          applicantCode: '',
          applicantPhone: '',
          dismissionNO: '',
          drafter: '',
          // 起草人电话
          // drafterMobile: '',
          empPfId: '',
          empEmployeeId: '',
          idNumber: '',
          employeeCode: '',
          fullName: '',
          posPositionId: '',
          posPositionName: '',
          hireDate: '',
          groupId: '', // 薪资组
          groupName: '',
          groupCode: '',
          personnelGroupCode: '', // 人事范围
          personnelGroupName: '', // 人事范围
          salaryAccounting: '',
          terminationType: '',
          // 基本信息离职原因
          terminationReason: '',
          terminationReasonDetail: '',
          // 合伙人填写的离职原因
          pterminationReason: '',
          isJobTransition: '',
          // 实际离职日期
          effectiveDate: '',
          // 期望离职日期，仅仅在前端层面
          expectDate: '',
          inBlackList: '',
          // deletePayGroup: '',
          attachmentIdList: [],
          attendHours: '',
          lateMinutes: '',
          earlyMinutes: '',
          leavehours: '',
          absentMinutes: '',
          oweHolidayHours: '',
          isAssetsTransition: '',
          dimissionInterviewResult: '',
          // dimissionCompensation: '',离职补偿金
          insuranceEndDate: '',
          ischeckSalary: '',
          isUnempBenefits: '',
          unCheckSalaryReason: '',
          dimssionReason: '', // 加入黑名单原因
          employeeName: '',
          salary: '', // 薪资
          salaryType: '', // 薪资类型

          assetList: [
            // {
            //   assetSysCode: '1',
            //   assetEntCode: '1',
            //   assetName: '1',
            //   menge: '1',
            //   meins: '1'
            //   // isAccord: 'Y'
            // }, {
            //   assetSysCode: '2',
            //   assetEntCode: '2',
            //   assetName: '2',
            //   menge: '2',
            //   meins: '2'
            //   // isAccord: 'Y'
            // }
          ],
          // 未清借款（线上）
          lineLoan: '',
          // 线下
          actualLoan: '',
          // 未清预付款
          unPaidPayment: '',
          // 未清报销金额
          unPaidAmount: '',
          // 未使用机票
          unUseTicker: '',
          // 临时表单数据
          fileList: [],
          // 截取好的离职原因
          terminationReasonList: [],
          firstSelectefPersonal: true, // 用于记录是否第一次选择资产承接人
          isAccord: 'Y' // 固资是否符合
        }
      }
    },
    watch: {
      'postParams.terminationType': {
        handler: function (newVal, oldVal) {
          // 自离或者被动默认加入黑名单
          // 主动则默认不加入黑名单
          // 自离默认不发放工资
          if (!this.disabledMap.inBlackList) {
            if (newVal === '1') {
              this.postParams.inBlackList = 'N'
              this.postParams.isUnempBenefits = 'N'
            } else if (newVal === '3' || newVal === '2') {
              this.postParams.inBlackList = 'Y'
            } else {
              this.postParams.inBlackList = ''
            }
            // !this.postParams.ischeckSalary ? (newVal === '3' ? (this.postParams.ischeckSalary = 'N') : (this.postParams.ischeckSalary = 'Y')) : ''
          }
         // 根据离职类型，显示离职原因
          // 每一次变化先把离职原因置空
          oldVal ? this.postParams.terminationReason = '' : ''
          this.getReasonList(newVal)
        },
        deep: true
      },
      'postParams.terminationReason': {
        handler: function (newVal, oldVal) {
          // 选择了被动离职-机构重组，则“是否申领失业金”默认为是
          if (!this.disabledMap.isUnempBenefits && newVal) {
            newVal.includes('2') ? (this.postParams.isUnempBenefits = 'Y') : ''
          }
  
          if (newVal) {
            let that = this
            req('getDistCode', {dictCode: 'TERMINATION_REASON'}, true, false)
             .then(res => {
               // 如果没有选择就显示全部
               res.forEach((item, i) => {
                 if (item.value === newVal) {
                   !that.disabledMap.pterminationReason && (that.postParams.pterminationReason = item.label)
                 }
               })
             })
          }
        },
        deep: true
      },
      '$store.state.user.info.fullName' (newVal, oldVal) {
        this.isFlowCenter && (this.postParams.fullName = newVal)
        this.isFlowCenter && (this.postParams.empEmployeeId = this.id)
        this.isFlowCenter && this.getDimissionInfo(this.id)
      }

    },
    created () {
      !this.isFlowCenter && this.empEmployeeId && this.getDimissionInfo()
    },
    computed: {
      id () {
        return this.$store.state.user.info.empEmployeeId
      }
    },
    methods: {
      postFlow () {
        if (this.postParams.rpcIsFailed) {
          this.$message({type: 'warning', message: '获取未清资产失败！'})
          return null
        } else {
          return this.postParams
        }
      },
      // 获取申请人id
      sponsor (id) {
        this.postParams.applicantId = id
        id && req('getBaseInfo', {employeeId: id}, true, false)
        // 获取申请人的基本信息
        .then(res => {
          this.postParams.applicantCode = res.employeeCode
          this.postParams.applicantPhone = res.mobile
          this.postParams.applicantName = res.fullName
        })
      },
      // 获取流程头部信息
      baseInfo (data) {
        this.postParams.applicantDate = data.date
      },
      validateTable () {
        this.$refs['financial'] && this.$refs['financial'].$refs.cell && this.$refs['financial'].$refs.cell.map(el => el.validate())
      },
       // 根据员工id获取对应的离职信息
      getDimissionInfo (id) {
        if (!id && !this.empEmployeeId) {
          return false
        }
        req('getDimissionInfo', { empEmployeeId: id || this.empEmployeeId }).then(res => {
          Object.assign(this.postParams, res)
          this.postParams.idNumber = res.employeeIdNumber
          // 生成流程单号
          this.postParams.dismissionNO = 'LZJJ' + moment(new Date()).format('YYYYMMDD') + this.postParams.employeeCode
        })
        // 获取资产列表
        req('getFinancilList', {empEmployeeId: id || this.empEmployeeId})
        .then(res => {
          let flag = false
          res.body && res.body.data && res.body.data.map(item => {
            for (let key in item) {
              if (item[key]) {
                flag = true
                break
              }
            }
          })
          flag ? this.postParams.assetList = res.body.data : this.postParams.assetList = []
          this.postParams.assetList && this.postParams.assetList.map(res => {
            this.$set(res, 'receptEmpolyeeName', '')
            this.$set(res, 'receptEmpolyeeId', '')
            this.$set(res, 'isAccord', 'Y')
          })
        })
        .catch(err => {
          err && (this.postParams.rpcIsFailed = true)
        })
      },

      // 根据离职类型获取离职原因列表
      getReasonList (newVal) {
        // 每一次变化先把离职原因列表清空
        this.postParams.terminationReasonList = []
        // 没有新值就用现有的离职原因值
        let a = newVal || this.postParams.terminationType
        req('getDistCode', {dictCode: 'TERMINATION_REASON'}, true, false)
             .then(res => {
            // 如果没有选择就显示全部
               res.forEach((item, i) => {
                 if (item.value.substring(0, 1) === a) {
                   this.postParams.terminationReasonList.push(item)
                 }
               })
             })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>


