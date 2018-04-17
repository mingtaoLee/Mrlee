<template>
  <div class="emp-movement">
    <i-process-flow
      :model="transferInfo"
      :processType="processType"
      :createName="transferInfo.fullName"
      @beforeSubmit="validateTable"
      @fillin="fillIn"
      @postFlow="postFlow"
      >
      <!-- @beforeApprove='beforeApprove'-->
      
      <div slot="base">
        <emp-basic :transferInfo="transferInfo"></emp-basic>
      </div>

      <div slot="EmpFinancialHandover">        
        <emp-financial-handover v-if="isShowFinancia" :transferInfo="transferInfo" ref="financial"></emp-financial-handover>
      </div>
    </i-process-flow>
  </div>
</template>
<script>
  import req from 'api/employee/personal'
  import BasicInfo from 'components/flow/basic-info'
  import EmpBasic from 'components/employee/movement/emp-basic'
  import EmpFinancialHandover from 'components/employee/movement/emp-financial-handover'
  import IProcessFlow from 'components/common/i-process-flow'
  import moment from 'moment'

  export default {
    components: {
      BasicInfo,
      EmpBasic,
      EmpFinancialHandover,
      IProcessFlow
    },
    data () {
      return {
        empEmployeeId: this.$route.query.employeeId,
        processStatus: this.$route.query.processStatus,
        processType: this.$route.query.processType,
        isFlowCenter: this.$route.query.isFlowCenter,
        transferInfo: {
          rpcIsFailed: false,
          empEmployeeId: '',
          employeeCode: '',
          empPositionId: '',
          hireDate: '',
          fullName: '',
          transferType: null,
          staffRecordId: null,
          transferReason: null,
          transferDate: '',
          // 职务
          newPosTitleId: '',  // 职务ID
          newPosTitleName: '',  // 职务ID
          oldPosTitleId: '',   // 职务ID
          oldPosTitleName: '',   // 职务ID
          // 公司
          oldCompanyCode: null,
          oldCompanyName: '',
          newCompanyName: '',
          newCompanyCode: '',
          // 组织
          oldOrgUnitId: '',
          oldOrgUnitName: '',
          newOrgUnitId: '',
          newOrgUnitName: '',
          // 人事范围
          oldPersonnelGroupCode: '',
          oldPersonnelGroupName: '',
          newPersonnelGroupCode: '',
          newPersonnelGroupName: '',
            // 职位
          oldPosPositionId: '',
          oldPosPositionName: '',
          newPosPositionId: '',
          newPosPositionName: '',
          idNumber: '1023',
          empTypeConversion: null,
          transferReasonList: [],
          // 组织默认值
          selectedOrgNode: {},
          // 是否显示联保人
          isShowSalary: false,
          // posStandardJobId: null,
          oldWorkSystem: '',

          oldEmployeeType: '',
          oldSalary: '',
          oldSalaryType: '1',
          oldSurety1: '',
          oldSurety2: '',
          newWorkSystem: null, // 工作制新
          oldPayGroupId: '', // 薪资组
          oldPayGroupName: '', // 薪资组
          newPayGroupId: null, // 薪资组
          newPayGroupName: null, // 薪资组
          newEmployeeType: '',
          newSalary: null,
          newSalaryType: '1', // 薪资单位
          newSurety1: '',
          newSurety2: '',
          status: null,
          // 随时效浮动
          newIsAgingFloat: '',
          oldIsAgingFloat: '',
          posList: [], // 根据组织id出现的职位列表
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
          ], // 未清资产
          // 联保人信息
          oldSuretyName1: '',
          oldSuretyName2: '',
          newSuretyName1: '',
          newSuretyName2: '',
          // 临时表单数据
          fileList: [],
          firstSelectefPersonal: true, // 用于记录是否第一次选择资产承接人
          isAccord: 'Y' // 固资是否符合
        }
      }
    },
    created () {
      !this.isFlowCenter && this.empEmployeeId && this.getTransferInfo()
    },
    watch: {
      '$store.state.user.info.fullName' (newVal, oldVal) {
        this.isFlowCenter && (this.transferInfo.fullName = newVal)
        this.isFlowCenter && (this.transferInfo.empEmployeeId = this.id)
        this.isFlowCenter && this.getTransferInfo(this.id)
      },
      isShowFinancia (newVal, oldVal) {
          // 未清资产清楚
        newVal && (this.empEmployeeId || this.isFlowCenter) && req('getFinancilList', {empEmployeeId: this.transferInfo.empEmployeeId})
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
               flag ? this.transferInfo.assetList = res.body.data : this.transferInfo.assetList = []
               this.transferInfo.assetList && this.transferInfo.assetList.map(res => {
                 this.$set(res, 'receptEmpolyeeName', '')
                 this.$set(res, 'receptEmpolyeeId', '')
                 this.$set(res, 'isAccord', 'Y')
               })
             })
              .catch(err => {
                err && (this.transferInfo.rpcIsFailed = true)
              })
        !newVal && (this.transferInfo.assetList = [])
      }
    },
    computed: {
      id () {
        return this.$store.state.user.info.empEmployeeId
      },
      isShowFinancia () {
        return this.transferInfo.oldOrgUnitId !== this.transferInfo.newOrgUnitId
      }
    },
    methods: {
      // beforeApprove (done) {
      //   if (this.id === this.transferInfo.newSurety1 || this.id === this.transferInfo.newSurety2) {
      //     this.$confirm('我已阅读联保书相关内容，并明确联保责任内容!', '提示', {
      //       confirmButtonText: '同意',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       done()
      //     }).catch(() => {})
      //   } else {
      //     done()
      //   }
      // },
      validateTable () {
        this.$refs['financial'] && this.$refs['financial'].$refs.cell && this.$refs['financial'].$refs.cell.map(el => el.validate())
      },
      postFlow () {
        if (this.transferInfo.rpcIsFailed) {
          this.$message({type: 'warning', message: '获取未清资产失败！'})
          return null
        } else {
          return this.transferInfo
        }
      },
       // 获取调动人员的基本信息
      getTransferInfo (id) {
        if (!id && !this.empEmployeeId) {
          return false
        }
        let _this = this
        // 选择人员进入时，先根据人员id获取基本信息
        new Promise(function (resolve, reject) {
          req('getTransfer', { empEmployeeId: id || _this.empEmployeeId })
          .then(res => {
            Object.keys(res).map(key => {
              if (res[key]) {
                _this.transferInfo[key] = res[key]
              }
            })
             // 左边的信息---》右边
            //  如果入职时间存在，则调动默认值是入职月份的下一个月
            if (_this.transferInfo.hireDate) {
              let val = new Date(_this.transferInfo.hireDate)
              val.setMonth(val.getMonth() + 1)
              val.setDate(val.getDate() - val.getDate() + 1)
              // _this.transferInfo.transferDate = moment(val).format('YYYY-MM-DD')
              let a = new Date().setDate(new Date().getDate() - new Date().getDate() + 1)
              if (a < val) {
                _this.transferInfo.transferDate = moment(val).format('YYYY-MM-DD')
              } else {
                _this.transferInfo.transferDate = moment(a).format('YYYY-MM-DD')
              }
            }
            // _this.transferInfo.newPosTitleId = _this.transferInfo.oldPosTitleId
            _this.transferInfo.newOrgUnitId = _this.transferInfo.oldOrgUnitId
            _this.transferInfo.newOrgUnitName = _this.transferInfo.oldOrgUnitName
            _this.transferInfo.newEmployeeType = _this.transferInfo.oldEmployeeType
            // _this.transferInfo.newPayGroupId = _this.transferInfo.oldPayGroupId
            // _this.transferInfo.newPayGroupName = _this.transferInfo.oldPayGroupName
            // _this.transferInfo.newSalary = _this.transferInfo.oldSalary
            // _this.transferInfo.newSalaryType = _this.transferInfo.oldSalaryType
            // _this.transferInfo.newSurety1 = _this.transferInfo.oldSurety1
            // _this.transferInfo.newSuretyName1 = _this.transferInfo.oldSuretyName1
            // _this.transferInfo.newSurety2 = _this.transferInfo.oldSurety2
            // _this.transferInfo.newSuretyName2 = _this.transferInfo.oldSuretyName2
            // _this.transferInfo.newWorkSystem = _this.transferInfo.oldWorkSystem
            _this.transferInfo.newCompanyCode = _this.transferInfo.oldCompanyCode
            _this.transferInfo.newCompanyName = _this.transferInfo.oldCompanyName
            _this.transferInfo.newPersonnelGroupCode = _this.transferInfo.oldPersonnelGroupCode
            _this.transferInfo.newPersonnelGroupName = _this.transferInfo.oldPersonnelGroupName
            // _this.transferInfo.oldPersonnelGroupName = _this.transferInfo.oldPersonnelGroupCode + '_' + _this.transferInfo.oldPersonnelGroupName

            resolve(res)
          })
        })
        .then((res) => {
             // 获取资产列表
          // req('getFinancilList', {empEmployeeId: res.empEmployeeId})
          //    .then(res => {
          //      console.log(res)
          //      this.transferInfo.assetList = res.body ? res.body.data : ''
          //    })
          // 根据组织id获取公司名称，人事范围
          if (res.oldOrgUnitId) {
            req('getPosList', {orgUnitId: res.oldOrgUnitId, status: '1'})
              .then(res => {
                this.transferInfo.posList = res
              })
            req('getArea', {id: res.oldOrgUnitId})
            .then(data => {
              // console.log(data)
              // 公司名称
              // this.transferInfo.oldCompanyName = data.orgCompanyName
              // this.transferInfo.newCompanyName = data.orgCompanyName

              // // 所属组织
              // this.transferInfo.oldOrgUnitName = data.orgUnitName
              // // 人事范围
              // this.transferInfo.oldPersonnelArea = data.personnelArea
              // this.transferInfo.newPersonnelArea = data.personnelArea
            })
             // 组织
            // req('getOrgUnitName', {orgUnitIds: res.oldOrgUnitId})
            //   .then(res => {
            //     if (res) {
            //       // console.log(res)
            //       this.transferInfo.selectedOrgNode = res[0]
            //     }
            //   })
          }
          // 根据组织id获取职群，标准职位
          if (res.oldPosPositionId) {
            // this.transferInfo.newPosPositionId = res.oldPosPositionId
            req('getPositions', {posPositionId: res.oldPosPositionId})
            .then(pos => {
              // //  标准职位
              // this.transferInfo.posStandardJobName = pos.posStandardJobName
              // this.transferInfo.selectedPos.posStandardJobName = pos.posStandardJobName
              // // 职群
              // this.transferInfo.posJobFamilyName = pos.posJobFamilyName
              // this.transferInfo.selectedPos.posJobFamilyName = pos.posJobFamilyName

              // // 职位
              // this.transferInfo.oldPosPositionName = pos.name
              // this.transferInfo.newPosPositionName = pos.name
              // 根据职务是否显示联保人
              // if (pos.posTitleName.includes('合伙人')) {
              //   this.transferInfo.isShowSalary = true
              // }
              // this.transferInfo.newPosTitleId = pos.posTitleId
              // this.transferInfo.newPosTitleName = pos.posTitleName
            })
          }
          req('checkIsSurety', {posTitleId: res.oldPosTitleId})
              .then(res => {
                // console.log(res)
                if (res) {
                  this.transferInfo.isOldShowSalary = true
                  // this.labelList.push('联保人1')
                  // this.labelList.push('联保人2')
                } else {
                  this.transferInfo.isOldShowSalary = false
                }
              })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>


