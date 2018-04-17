<template>
  <div class="emp-enrollment">
    <emp-basic :hireInfo="hireInfo"></emp-basic>
    <emp-family :hireInfo="hireInfo" @sendFamilyData="getSendData($event, 'EmpFamilyMemberList')" ref="family"/>

    <emp-education
      :tableEducationData="hireInfo.allEmpEducationList"
      @sendEducationData="getSendData($event, 'EmpEducationList')"
      ref="education"
      :base="hireInfo.empEmployeeEmpContacts"
    >
    </emp-education>

    <emp-pre-employer
      :tableEmployerData="hireInfo.allEmpWorkExperienceList"
      @sendPreemployerData="getSendData($event, 'EmpWorkExperienceList')"
      ref="preemployer"
      :base="hireInfo.empEmployeeEmpContacts"
    >
    </emp-pre-employer>
 

    <emp-credential 
    :hireInfo="hireInfo" 
    @sendCredentialData="getSendData($event, 'createEmpCredentialList', 'updateEmpCredentialList', 'deleteEmpCredentialList')"
    ref="credential"/>

    <!-- <emp-bank :empBankTaxList="hireInfo.empBankTaxList"></emp-bank> -->

    <!-- <emp-job :jobInfo="hireInfo.empPosition"></emp-job> -->

    <emp-others :hireInfo="hireInfo"></emp-others>

    <div class="submitButton">
        <div class="button">
          <el-button type="primary" size="small" @click="submitHireInfo" v-if="accessMap.empEmployeesHireSubmissionPost">提交</el-button>
        </div>
        <div class="button">
          <el-button size="small" @click="cancle">取消</el-button>
        </div>
    </div>
  </div>
</template>
<script>
  // 引入处理按钮显示隐藏的文件
  import access from 'mixins/access'
  import req from 'api/employee/personal'
  // import BasicInfo from 'components/flow/basic-info'
  import EmpBasic from 'components/employee/enrollment/emp-basic'
  import EmpEducation from 'components/employee/enrollment/emp-education'
  import EmpPreEmployer from 'components/employee/enrollment/emp-preemployer'
  import EmpFamily from 'components/employee/enrollment/emp-family'
  // import EmpBank from 'components/employee/enrollment/emp-bank'
  // import EmpJob from 'components/employee/enrollment/emp-job'
  import EmpCredential from 'components/employee/enrollment/emp-credential'
  import EmpOthers from 'components/employee/enrollment/emp-others'
  // import ButtonGroup from 'components/flow/button-group'

  export default {
    components: {
      // BasicInfo,
      EmpBasic,
      EmpEducation,
      EmpPreEmployer,
      EmpFamily,
      // EmpBank,
      // EmpJob,
      EmpOthers,
      // ButtonGroup,
      EmpCredential
    },
    mixins: [access],
    data () {
      return {
        // 这个idNumber是从入职返聘传递过来的。
        idNumber: this.$route.query.idNumber,
        validates: [],
        // TODO:下面的value需要删除
        hireInfo: {
          'inBlackList': null,
          familyData: null,
          // 入职员工基本信息
          empEmployeeId: this.$route.query.empEmployeeId,
          'empEmployeeEmpContacts': {
            'idNumber': '',
            'fullName': '',
            'mobile': '',
            'email': '',
            'idType': '',
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
            // 'emergencyRelationship': '',
            'hasInsurance': '',
            'hasHouseFund': '',
            'beginWorkDate': '', // 数据库并不需要这个字段自己加的，以防校验报错
            'idStartTime': '',
            'idEndTime': '',
            'idAddress': '',
            'domicileType': '' // 户口性质
          },
          // 教育信息
          // 'createEmpEducationList': [],
          // 'updateEmpEducationList': [],
          // 'deleteEmpEducationList': [],
          'allEmpEducationList': [], // 临时流程表单数据
          // 先前雇主信息
          // 'createEmpWorkExperienceList': [],
          // 'updateEmpWorkExperienceList': [],
          // 'deleteEmpWorkExperienceList': [],
          'allEmpWorkExperienceList': [], // 临时流程表单数据
          // 家庭成员
          // 'createEmpFamilyMemberList': [],
          // 'updateEmpFamilyMemberList': [],
          // 'deleteEmpFamilyMemberList': [],
          'allEmpFamilyMemberList': [], // 临时流程表单数据
          // 银行卡信息
          empBankTaxList: [{
            'bankNumber': '',
            'bankType': '',
            'provinceNo': '',
            'cityNo': '',
            'bankNo': '',
            'bankName': ''
          }],
          // 岗位信息
          'empPosition': {
            'employeeSource': '',
            'orgUnitId': '',
            // TODO: 职群字段
            'jobFamily': '',
            'posTitleId': '',  // 职务ID
            'posPositionId': '',
            'artisanLevel': '',
            'employeeType': '',  // 用工类型
            // TODO:人事范围薪资组字段
            'workSystem': '',
            'beginWorkDate': '',
            'revenueType': '',
            'hireDate': '',
            'probationType': '', // 试用期类型
            'probationSalary': '',
            'expectedRegularSalary': '',
            'hasCommercialInsurance': 'N',
            'isSurety': false,
            // 仅仅用于上传流程表单的字段
            orgs: {
              personnelArea: ''  // 人事范围
            },
            posList: [],  // 职位列表
            selectedPos: { // 选择的职位
              posJobFamilyName: '', // 职群
              posTitleName: '' // 职务
            }
          },
          // 联保人信息
          'empSuretyList': [{
            'cosuretyId': '',
            'fullName': '',
            'isShow': false
          }, {
            'cosuretyId': '',
            'fullName': '',
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
            'hadSeriousDisease': ''
            // 'jobCertificate': '',
            // 'beginDate': '',
            // 'endDate': ''
          },
          // 保险信息
          // 'empInsuranceList': [
          //   {
          //     'insuranceType': '01',
          //     'isInsured': 'N',
          //     'noInsuredType': '',
          //     'insuredNo': '',
          //     'insuredCardinal': '',
          //     'beginDate': ''
          //   },
          //   {
          //     'insuranceType': '02',
          //     'isInsured': 'N',
          //     'noInsuredType': '',
          //     'insuredNo': '',
          //     'insuredCardinal': '',
          //     'beginDate': ''
          //   },
          //   {
          //     'insuranceType': '03',
          //     'isInsured': 'N',
          //     'noInsuredType': '',
          //     'insuredNo': '',
          //     'insuredCardinal': '',
          //     'beginDate': ''
          //   },
          //   {
          //     'insuranceType': '04',
          //     'isInsured': 'N',
          //     'noInsuredType': '',
          //     'insuredNo': '',
          //     'insuredCardinal': '',
          //     'beginDate': ''
          //   },
          //   {
          //     'insuranceType': '05',
          //     'isInsured': 'N',
          //     'noInsuredType': '',
          //     'insuredNo': '',
          //     'insuredCardinal': '',
          //     'beginDate': ''
          //   },
          //   {
          //     // 公积金
          //     'insuranceType': '0A',
          //     'isInsured': 'N',
          //     'noInsuredType': '',
          //     'insuredNo': '',
          //     'insuredCardinal': '',
          //     'beginDate': ''
          //   }
          // ],
          // 劳动合同信息
          // 'empContract': {
          //   'contractType': '',
          //   'startDate': '',
          //   'endDate': '',
          //   // 'signNumber': '',
          //   // 合同期限
          //   'contractPeriod': '',
          //   // 合同期限类型
          //   'contractPeriodType': ''
          // },
          // 权限管理
          'empGrant': [
            {
              'powerType': '1',
              'hasPower': ''
            },
            {
              'powerType': '2',
              'hasPower': ''
            },
            {
              'powerType': '3',
              'hasPower': ''
            },
            {
              'powerType': '4',
              'hasPower': ''
            }
          ]
          // 用于流程添加的字段
        }
      }
    },
    watch: {
      'hireInfo.empOthers': {
        handler: function (newVal, oldVal) {
          if (newVal.isHandicapped === 'N') {
            this.hireInfo.empOthers.handicappedGroup = ''
            this.hireInfo.empOthers.handicappedType = ''
          }
        },
        deep: true
      }
    },
    created () {
      if (this.$route.query.empEmployeeId === '-1') {
        return false
      } else {
        this.getEmpInfoByCard()
      }
    },
    methods: {
       // 根据身份信息判断该员工是否符合条件
      getEmpInfoByCard () {
        // 入职或者返聘，需要根据身份证去查询员工信息
        req('getEmpInfoByCard', { idNumber: this.idNumber }).then(res => {
          // 格式化返回的日期
          console.log('返回值', res)
          // 未在黑名单
          if (!res.inBlackList) {
            this.$message.success('该员工满足入职条件，可以入职')
            Object.assign(this.hireInfo, res)
            console.log(this.hireInfo + 'hello')
          } else {
            this.$message.error('该员工在黑名单中，不符合入职条件')
            return false
          }
        })
      },

       // 得到每个组件中传回来的数据
      getSendData (data, dataType) {
        this.hireInfo[`all${dataType}`] = data
      },

       // 操作成功关闭页面提示
      closePage () {
        this.$alert('操作成功，是否关闭窗口', '注意', {
          confirmButtonText: '确定',
          showCancelButton: true,
          callback: action => {
            if (action === 'cancel') {
              // 如果取消，则不关闭窗口
              this.flash()
              return
            }
            this.flash()
            window.close()
          }
        })
      },

      // 获取需要校验的信息
      getValidates (node) {
        let childSub = true

        node.map(ele => {
          ele.$options._componentTag === 'el-form' && this.validates.push(ele)
          ;(ele.$children.length !== 0) && (childSub = this.getValidates(ele.$children) && childSub)
        })
        return this.validates
      },

      // 表单检验
      handleValidate (callback = () => {}) {
        const validates = this.getValidates(this.$children)

        if (validates.length === 0 && callback) {
          return callback(true)
        }

        let count = 0
        let pass = true

        validates.map((ele, index) => {
          ele.validate(res => {
            if (!res) {
              pass = false
            }

            if (++count === validates.length) {
              callback(pass)
            }
          })
        })
      },

       // 提交入职信息
      submitHireInfo () {
        Object.keys(this.$refs).map(vm => {
          this.$refs[vm].$refs.cell && this.$refs[vm].$refs.cell.map(el => el.validate())
        })
        this.handleValidate(res => {
          console.log(res)
          if (res) {
            Object.keys(this.$refs).map(ref => {
              switch (ref) {
                case 'preemployer':
                  this.hireInfo.allEmpWorkExperienceList = this.$refs[ref].$refs.table.clone
                  break
                case 'education':
                  this.hireInfo.allEmpEducationList = this.$refs[ref].$refs.table.clone
                  break
                case 'family':
                  this.hireInfo.allEmpFamilyMemberList = this.$refs[ref].$refs.table.clone
                  break
                case 'credential':
                  this.hireInfo.allEmpCredentialList = this.$refs[ref].$refs.table.clone
                  break
                default:
                  break
              }
            })
            // 登记是post请求
            if (this.$route.query.processType === '0') {
              req('postHireInfo', this.hireInfo).then((res) => {
                res && this.closePage()
              })
            }
          } else {
            this.$message.warning('请确保信息无误后再试')
            return
          }
        })
      },

       // 取消操作的提示
      cancle () {
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
      // 刷新人事页面
      flash () {
        // 获取父窗口，并且父窗口还在的话就刷新
        (/employee/).test(window.opener.location.href) && window.opener.location.reload()
        console.log(window.opener.location.href)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .submitButton {
    float: right;
    margin-right: 20px;
    .button {
      display: inline-block;
      margin: 0px 15px 20px 0px;
    }
  }
</style>


