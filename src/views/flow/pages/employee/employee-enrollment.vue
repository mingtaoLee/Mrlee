<template>
  <div class="emp-enrollment">
    <i-process-flow 
      :model="hireInfo" 
      :processType="processType" 
      @submit="saveTableData" 
      @fillin="fillIn"
      @beforeSubmit="validateTable"
      :createName = "hireInfo.empEmployeeEmpContacts.fullName" 
      @sponsor="sponsor"
      @jurConfig="jurConfig"
      @baseInfo="baseInfo"
      >
      <!-- :createName = "hireInfo.empEmployeeEmpContacts.fullName" -->
      
      <!-- 申请人填写 -->
      <div slot="baseInformation">
        <emp-basic :hireInfo="hireInfo" @fillBase="fillBase"></emp-basic>
      </div>

      <div slot="family">
        <emp-family 
        v-if="hireInfo.allEmpFamilyMemberList && isShow || regis"
          :hireInfo="hireInfo" 
          @sendFamilyData="getSendData($event, 'EmpFamilyMemberList')"
          ref="family"/>
      </div>

      <div slot="education">
        <emp-education 
        v-if="hireInfo.allEmpEducationList && isShow|| regis"
          :tableEducationData="hireInfo.allEmpEducationList" 
          @sendEducationData="getSendData($event, 'EmpEducationList')" 
          ref="education"
          :base="hireInfo.empEmployeeEmpContacts"/>
      </div>

      <div slot="preEmployer">
        <emp-pre-employer 
        v-if="hireInfo.allEmpWorkExperienceList && isShow || regis"
          :tableEmployerData="hireInfo.allEmpWorkExperienceList"
          @sendPreemployerData="getSendData($event, 'EmpWorkExperienceList')"
          ref="preemployer"
          :base="hireInfo.empEmployeeEmpContacts"/>
      </div>
          <!-- <el-button type="danger" @click="saveTableData">biaoge</el-button> -->

        <div slot="credential">
          <emp-credential 
          v-if="hireInfo.allEmpCredentialList && isShow|| regis"
          :hireInfo="hireInfo"
          @sendCredentialData="getSendData($event, 'EmpCredentialList')"
          ref="credential"/>
        </div>

        <div slot="bankInformation">
          <emp-bank :empBankTaxList="hireInfo.empBankTaxList" :empId="hireInfo.empEmployeeId"></emp-bank>
        </div>

        <div slot="other">
          <emp-others :hireInfo="hireInfo"></emp-others>
        </div>

        <div slot="job">
          <emp-job :jobInfo="hireInfo.empPosition" :hireInfo="hireInfo" @shortWorkersChosed="controlShortWorkersChosed" :code="hireInfo.empEmployeeEmpContacts.employeeStatus"></emp-job>
        </div>

        <div slot="guarantorInformation">
          <emp-guarantor :hireInfo="hireInfo" :isSur="hireInfo.empPosition.isSurety" v-show="hireInfo.empPosition.isSurety"></emp-guarantor>
        </div>


      <div slot="insurance">
        <emp-insurance :hireInfo="hireInfo" ref="empInsurance"></emp-insurance>
        <emp-commercial-insurance :hireInfo="hireInfo"></emp-commercial-insurance>
      </div>

      <div slot="contractInformation">
        <emp-contract
        :hireInfo="hireInfo"
        ref="contract"
        v-if="hireInfo.empPosition.employeeType !== '7' && hireInfo.empPosition.employeeType !== '8'"
        ></emp-contract>
      </div>
    <!-- 权限开通 -->
      <!-- <div slot="authority">
        <emp-authority :authorityInfo="hireInfo.empGrant"></emp-authority>
      </div> -->
    </i-process-flow>



  </div>
</template>
<script>
  import req from 'api/employee/personal'
  import EmpBasic from 'components/employee/enrollment/emp-basic'
  import EmpEducation from 'components/employee/enrollment/emp-education'
  import EmpPreEmployer from 'components/employee/enrollment/emp-preemployer'
  import EmpFamily from 'components/employee/enrollment/emp-family'
  import EmpBank from 'components/employee/enrollment/emp-bank'
  import EmpJob from 'components/employee/enrollment/emp-job'
  import EmpGuarantor from 'components/employee/enrollment/emp-guarantor'
  import EmpCredential from 'components/employee/enrollment/emp-credential'
  import EmpOthers from 'components/employee/enrollment/emp-others'
  import EmpInsurance from 'components/employee/enrollment/emp-insurance'
  import EmpCommercialInsurance from 'components/employee/enrollment/emp-commercial-insurance'
  import EmpContract from 'components/employee/enrollment/emp-contract'
  // import EmpAuthority from 'components/employee/enrollment/emp-authority'
  import IProcessFlow from 'components/common/i-process-flow'

  export default {
    components: {
      EmpBasic,
      EmpEducation,
      EmpPreEmployer,
      EmpFamily,
      EmpBank,
      EmpJob,
      EmpGuarantor,
      EmpOthers,
      EmpInsurance,
      EmpCommercialInsurance,
      EmpContract,
      // EmpAuthority,
      EmpCredential,
      IProcessFlow
    },
    data () {
      return {
        empEmployeeId: this.$route.query.employeeId,
        processStatus: this.$route.query.processStatus,
        taskId: this.$route.query.taskId,
        processType: this.$route.query.processType,
        isFlowCenter: this.$route.query.isFlowCenter,
        regis: false,
        isShow: false,
        dialogVisible: false,
        rules: {
          hasPower: [
            { required: true, message: '请选择开通或者不开通', trigger: 'change' }
          ]
        },
        // TODO:下面的value需要删除
        hireInfo: {
          copyInfo: [], // 保存保险信息
          insuranceAreaType: 'Y',
          insuranceArea: '',  // 参保地
          insuranceCityId: '', //  参保城市
          insuranceCityName: '', //  参保城市
          personalSupplement: '', // 个人补充公积金部分
          disableCommercial: false, // 是否禁用商业保险
          yearOrMonth: 'year',
          'inBlackList': null,
          familyData: null,
          tip: false,
          // 入职员工基本信息
          isShowHouseFund: '',
          empEmployeeId: this.$route.query.employeeId,
          employeeCode: '',
          empEmployeeEmpContacts: {
            'idNumber': '',
            'idType': '',
            'fullName': '',
            'mobile': '',
            'email': '',
            'gender': '',
            'birthDate': '',
            'maritalStatus': '',
            'areaCitizenship': '', // 国籍
            'domicilePlace': '', // 籍贯
            // "domicileType":"1"
            'nation': '',
            'politicsStatus': '',
            'idRegisteredAddress': '', // 身份证地址
            'homeAddress': '', // 现居地址
            'photoPath': '',
            // 'emergencyContact': '',
            // 'emergencyContactPhone': '',
            'orgUnitId': '',
            // 'emergencyRelationship': '',
            'hasInsurance': '',
            'hasHouseFund': '',
            'idStartTime': '',
            'idEndTime': '',
            'idAddress': '',
            'domicileType': '' // 户口性质
          },
          // 教育信息
          'allEmpEducationList': [], // 临时流程表单数据
          'allEmpWorkExperienceList': [], // 临时流程表单数据
          'allEmpFamilyMemberList': [], // 临时流程表单数据
          // 银行卡信息
          empBankTaxList: [{
            'bankNumber': '',
            'bankType': '',
            'provinceNo': '',
            // 'cityNo': '',
            // 'bankNo': '', // 联行号不要了
            'bankName': ''
          }],
          // 岗位信息
          'empPosition': {
            probationType: '',
            dimissionDate: '', // 离职两个月的时间
            isShowDomicileGrade: false, // 是否显示户口等级
            isGetAgain: false, // 是否需要在请求保险信息
            // workAddress: '',  // 办公地点
            'employeeSource': '',
            parentEmployeeName: '',
            parentEmployeeId: '',
            empCluster: '',  // 组织所属员工的集群
            probationSalaryType: '1', // 转正前薪资单位
            expectedRegularSalaryType: '1', // 转正前薪资单位
            // TODO: 职群字段
            'jobFamily': '',
            'posTitleId': '',  // 职务ID
            'posPositionId': '',
            'artisanLevel': '',
            'employeeType': '',  // 用工类型
            // TODO:人事范围薪资组字段
            'newSalaryAccounting': '', // 薪资组
            'newSalaryAccountingName': '', // 薪资组
            newIsAgingFloat: '',
            'personnelArea': '', // 人事范围
            'personnelAreaName': '', // 人事范围
            'workSystem': '',
            'beginWorkDate': '',
            'revenueType': '1',
            'hireDate': '',
            'probationSalary': '',
            'expectedRegularSalary': '',
            'hasCommercialInsurance': 'N',
            'orgUnitId': '',
            orgUnitName: '',
            'isSurety': false,
            'domicileGrade': '', // 户口等级
            // 仅仅用于上传流程表单的字段
            orgs: {
              personnelArea: ''  // 人事范围
            },
            // posList: [],  // 职位列表
            selectedPos: { // 选择的职位
              posJobFamilyName: '', // 职群
              posTitleName: '' // 职务
            }
          },
          // 联保人信息
          'empSuretyList': [{
            'cosuretyId': '',
            'cosuretyName': '',
            'isShow': false
          }, {
            'cosuretyId': '',
            'cosuretyName': '',
            'isShow': false
          }],
          'empCredential': {
            'credentialType': '',
            'beginDate': '',
            'endDate': ''
          },
          // 证件信息
          // 'createEmpCredentialList': [],
          // 'updateEmpCredentialList': [],
          // 'deleteEmpCredentialList': [],
          'allEmpCredentialList': [], // 临时流程表单数据
          // 其他信息
          'empOthers': {
            'isHandicapped': '',
            'handicappedGroup': '',
            'handicappedType': '',
            'isVeteran': '',
            'healthyCondition': '',
            'hadInfectious': '',
            // 'infectious': '', // 详述
            'hadSeriousDisease': '',
            // 'seriousDisease': '', // 详述
            'jobCertificate': '',
            'beginDate': '',
            'endDate': ''
          },
          // 保险信息
          'empInsuranceList': [],
          // 劳动合同信息
          'empContract': {
            'contractType': '',
            'startDate': '',
            'endDate': '',
            // 'signNumber': '',
            // 合同期限
            'contractPeriod': '',
            // 合同期限类型
            'contractPeriodType': '',
            leastSalary: '',
            workAdress: '',
            employeeName: '',
            employeeCode: '',
            orgUnitName: '',
            positionName: '',
            empEmployeeId: '',
            empContractId: '',
            contractNo: '',
            empTemplateId: '',
            contractAddress: '',
            companyName: '',
            signDate: '',
            contractContent: '',
            fileList: [],
            yearOrMonth: 'year',
            isSignContract: 'N'
          },
          // 权限管理
          // 'empGrant': [
          //   {
          //     'powerType': '1',
          //     'hasPower': 'N'
          //   },
          //   {
          //     'powerType': '2',
          //     'hasPower': 'N'
          //   },
          //   {
          //     'powerType': '3',
          //     'hasPower': 'N'
          //   },
          //   {
          //     'powerType': '4',
          //     'hasPower': 'N'
          //   }
          // ],
          'fileList': []
          // 用于流程添加的字段
        }
      }
    },
    watch: {
      // 主要是组织id后台保存在员工表中，而我在取的时候时取的岗位信息中的组织id
      'hireInfo.empPosition.orgUnitId': {
        handler: function (newVal, oldVal) {
          if (newVal) {
            this.hireInfo.empEmployeeEmpContacts.orgUnitId = newVal
          }
        },
        deep: true
      },
      // 'hireInfo.empEmployeeEmpContacts': {
      //   handler: function (newVal, oldVal) {
      //     // console.log(newVal)
      //     switch (newVal.hasInsurance) {
      //       // 如果不买五险，商业保险必须为是,保险必须为否
      //       // case 'N':
      //       //   this.hireInfo.hasCommercialInsurance = 'Y'
      //       //   this.hireInfo.empInsuranceList.map(insurance => {
      //       //     if (insurance.insuranceType !== '6') {
      //       //       insurance.isInsured = 'N'
      //       //     }
      //       //   })
      //       //   break
      //       // 如果买五险，五险必须为是
      //       case 'Y':
      //         this.hireInfo.empInsuranceList.map(insurance => {
      //           if (insurance.insuranceType !== '6') {
      //             insurance.isInsured = 'Y'
      //           }
      //         })
      //     }
      //     switch (newVal.hasHouseFund) {
      //       // 如果不买公积金，公积金必须为N
      //       case 'N':
      //         this.hireInfo.empInsuranceList.map(insurance => {
      //           if (insurance.insuranceType === '6') {
      //             insurance.isInsured = 'N'
      //           }
      //         })
      //         break
      //         // 如果买公积金，公积金必须为Y
      //       case 'Y':
      //         this.hireInfo.empInsuranceList.map(insurance => {
      //           if (insurance.insuranceType === '6') {
      //             insurance.isInsured = 'Y'
      //           }
      //         })
      //         break
      //     }
      //   },
      //   deep: true
      // },
      // 'hireInfo.empInsuranceList': {
      //   handler (newVal, oldVal) {
      //     if (newVal) {
      //       newVal.map(item => {
      //         if (item.insuranceType === '4' && item.isInsured === 'N') {
      //           // this.hireInfo.empPosition.hasCommercialInsurance = 'Y'
      //           // this.disableCommercial = true
      //         }
      //       })
      //     } else {
      //       // this.disableCommercial = false
      //     }
      //   },
      //   deep: true
      // },
      'hireInfo.empOthers': {
        handler: function (newVal, oldVal) {
          if (newVal && newVal.isHandicapped === 'N') {
            this.hireInfo.empOthers.handicappedGroup = ''
            this.hireInfo.empOthers.handicappedType = ''
          }
        },
        deep: true
      },
      'isShowHasHouseFund': {
        handler: function (newVal, oldVal) {
          this.hireInfo.isShowHouseFund === '' && newVal && (this.isFlowCenter || this.$route.query.employeeId) && req('getCluster', {orgUnitId: this.$store.state.user.info.orgUnitId})
         .then(res => {
           if (res === 1) {
             this.hireInfo.isShowHouseFund = false
           } else {
             this.hireInfo.isShowHouseFund = true
           }
         })
        },
        deep: true
      }
    },
    created () {
      if (this.$route.query.isFlowCenter && !this.$route.query.idNumber) {
        this.regis = true
      }
      if (this.$route.query.employeeId) {
        this.getEmpInfoByCard()
      }
    },
    computed: {
      isShowHasHouseFund () {
        return this.$store.state.user.info.orgUnitId
      }
    },
    methods: {
      // jurConfig (a, b) {
      //   console.log(a, b)
      // },
      getEmpInfoByCard (isVal) {
        if (!this.$route.query.idNumber && !isVal) {
          return false
        }
        req('getEmpInfoByCard', { idNumber: this.$route.query.idNumber })
          .then(res => {
            if (res.inBlackList) {
              this.$message.error('该员工在黑名单中，不符合入职条件')
              return false
            } else {
              this.fillBase(res)
              this.regis = true
              this.isShow = true
            }
          })
      },
      fillBase (res) {
        // console.log('sssss', res)
        // 清空前一次的信息
        if (!res) {
          this.hireInfo.inBlackList = null
          this.hireInfo.employeeCode = null
          this.hireInfo.empEmployeeId = null
          Object.keys(this.hireInfo.empEmployeeEmpContacts).map(item => {
            (item !== 'idNumber' && item !== 'idType') && (this.hireInfo.empEmployeeEmpContacts[item] = '')
          })
          this.hireInfo.empEmployeeEmpContacts.empEmployeeId = null
          Object.keys(this.hireInfo.empPosition).map(item => {
            this.hireInfo.empPosition[item] = null
          })
          this.hireInfo.empPosition.revenueType = '1'
          this.hireInfo.empPosition.hasCommercialInsurance = 'N'
          this.hireInfo.empPosition.probationSalaryType = '1'
          this.hireInfo.empPosition.expectedRegularSalaryType = '1'
          Object.keys(this.hireInfo.empContract).map(item => {
            Array.isArray(item) ? this.hireInfo.empContract[item] = [] : this.hireInfo.empContract[item] = ''
            // this.hireInfo.empContract[item] = ''
          })
          this.hireInfo.empContract.isSignContract = 'N'
          Object.keys(this.hireInfo.empOthers).map(item => {
            // this.hireInfo.empOthers[item] = ''
            Array.isArray(item) ? this.hireInfo.empOthers[item] = [] : this.hireInfo.empOthers[item] = ''
          })
          this.hireInfo.allEmpEducationList = []
          this.hireInfo.allEmpWorkExperienceList = []
          this.hireInfo.allEmpFamilyMemberList = []
          this.hireInfo.allEmpCredentialList = []
          this.hireInfo.empBankTaxList = [{'bankNumber': '', 'bankType': '', 'provinceNo': '', 'bankName': ''}]
          // this.hireInfo.empGrant = [{'powerType': '1', 'hasPower': 'N'}, {'powerType': '2', 'hasPower': 'N'}, {'powerType': '3', 'hasPower': 'N'}, {'powerType': '4', 'hasPower': 'N'}]
          return
        }
        if (res.employeeCode === this.hireInfo.employeeCode) return
        let keys = Object.keys(this.hireInfo.empEmployeeEmpContacts)

        // let prop = Object.keys(this.hireInfo)
        this.hireInfo.empEmployeeId = res.empEmployeeId
        Object.keys(res).map(key => {
          if (/List/.test(key) && key !== 'inBlackList' || key === 'empGrant') {
            this.hireInfo[key] && res[key] && (this.hireInfo[key] = res[key])
          } else if (/emp/.test(key) && key !== 'empEmployeeId' && key !== 'employeeCode') {
            this.hireInfo[key] && res[key] && (this.hireInfo[key] = res[key])

            key === 'empEmployeeEmpContacts' && keys.map(prop => { this.hireInfo[key][prop] = res[key][prop] })
            // key === 'empPosition' && (this.hireInfo.empPosition.selectedPos.posTitleName = '')
            // key === 'empPosition' && (this.hireInfo.empPosition.selectedPos.posJobFamilyName = '')
            key === 'empPosition' && (this.hireInfo.empPosition.hasCommercialInsurance = 'N')
            key === 'empPosition' && (this.hireInfo.empPosition.revenueType = '1')
            key === 'empPosition' && (this.hireInfo.empPosition.probationSalaryType = '1')
            key === 'empPosition' && (this.hireInfo.empPosition.expectedRegularSalaryType = '1')
          } else {
            // console.log(prop[key], res[key], key)
            res[key] && (this.hireInfo[key] = res[key])
          }
        })
        this.hireInfo.employeeCode && this.hireInfo.empEmployeeEmpContacts.employeeStatus === '3' && (this.hireInfo.empPosition.probationType = '0')
        // console.log(this.hireInfo)
      },
      validateTable () {
        Object.keys(this.$refs).map(vm => {
          this.$refs[vm].$refs.cell && this.$refs[vm].$refs.cell.map(el => el.validate())
        })
      },
      baseInfo (data) {
        // console.log(data)
      },
      // sponsor (data) {
      //   console.log('dddd', data)
      // },
      // 手动触发事件 将所有i-table中的数据保存到hireInfo中
      saveTableData () {
        // console.log(this.hireInfo)
        Object.keys(this.$refs).map(ref => {
          // console.log(this.$refs[ref].$refs)
          // 拿到clone里面最新的数据

          if (!this.$refs[ref].$refs.table) {
            return false
          }
          var tableObj = this.$refs[ref].$refs.table.clone
          // console.log('哈哈', tableObj)
          if (ref === 'preemployer') {
            this.hireInfo.allEmpWorkExperienceList = tableObj
          } else if (ref === 'education') {
            this.hireInfo.allEmpEducationList = tableObj
          } else if (ref === 'family') {
            this.hireInfo.allEmpFamilyMemberList = tableObj
          } else if (ref === 'credential') {
            this.hireInfo.allEmpCredentialList = tableObj
          }
        })
      },
      // flow组件获取我的数据
      postFlow () {
        this.$refs.contract && this.$refs.contract.showContract()

        return this.hireInfo
      },
      getSendData (data, type) {
        // 只需要把clone里面的数据复制给对应的数组即可，不需要拼接
        this.hireInfo[`all${type}`] = data
      },
      fillIn (data) {
        Object.assign(this.hireInfo, data) && (this.isShow = true)
      },
      // 短期工被选择时候触发
      controlShortWorkersChosed () {
        this.hireInfo.empEmployeeEmpContacts.hasInsurance = 'N'
      },
      // 如果五险被选择否的时候
      controlNoneInsurance (bool) {
        this.$refs.empInsurance.controlDisable = bool
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>


