<template>
  <div class="emp-conversion">
    <i-process-flow 
      :processType="processType" 
      :model="listParams" 
      :createName = "listParams.fullName" 
      @sponsor="sponsor"
      :postFlow="postFlow"
      >
      <!-- :createName = "listParams.fullName" -->
      
      <div slot="base">
        <emp-basic :conversionInfo="listParams"></emp-basic>
      </div>

      <div slot="conversionInfo">        
        <emp-conversion-info :conversionInfo="listParams"></emp-conversion-info>
      </div>
        
    </i-process-flow>
  </div>
</template>
<script>
  import BasicInfo from 'components/flow/basic-info'
  import EmpBasic from 'components/employee/conversion/emp-basic'
  import EmpConversionInfo from 'components/employee/conversion/emp-conversion-info'
  import IProcessFlow from 'components/common/i-process-flow'
  import ButtonGroup from 'components/flow/button-group'
  import req from 'api/employee/personal'

  export default {
    components: {
      BasicInfo,
      EmpBasic,
      EmpConversionInfo,
      IProcessFlow,
      ButtonGroup
    },
    data () {
      return {
        // TODO:人员ID需要单独去做
        empEmployeeId: this.$route.query.employeeId,
        processType: this.$route.query.processType,
        isFlowCenter: this.$route.query.isFlowCenter,
        flowBasicInfo: {
          applicantName: '',
          applicationDate: ''
        },
        listParams: {
          isShowDiff: false,

          createId: '',
          empEmployeeId: '',
          fullName: '',
          // employeeStatus: '',
          // costCenter: '',
          idNumber: '',
          posPositionId: '',
          posPositionName: '',
          posStandardJobName: '',
          expectedProbationEndDate: '',
          personnelGroupCode: '', // 人事范围
          personnelGroupName: '', // 人事范围
          hireDate: '',
          empPositionId: '',
          probationType: '',
          probationEndDate: '',
          probationSalary: '',
          expectedRegularSalary: '',
          probationSalaryType: '', // 转正前薪资单位
          expectedRegularSalaryType: '', // 转正前薪资单位,
          regularSalaryType: '', // 转正前薪资单位,
          regularSalary: '',
          diffSalaryDescription: '',
          posStandardJobId: '',
          orgUnitName: '',
          regularizationType: '1',
          checkDescription: '',
          evaluationDescription: '',
          selfEvaluation: '',
          empPfId: '',
          personnelArea: '',
          // 临时表单信息
          fileList: [],
          // 自评
          selfContent: '',
          checkResult: '',
          opition: ''
        }
        // 信息禁用&启动
      }
    },
    created () {
      (this.isFlowCenter || this.empEmployeeId) && this.getConversionInfo()
    },
    watch: {
      '$store.state.user.info.fullName' (newVal, oldVal) {
        this.isFlowCenter && (this.listParams.fullName = newVal)
        this.isFlowCenter && (this.listParams.empEmployeeId = this.id)
        this.isFlowCenter && this.getConversionInfo(this.id)
      }
    },
    computed: {
      id () {
        return this.$store.state.user.info.empEmployeeId
      },
      isShowContent () {
        return this.listParams.createId === this.listParams.empEmployeeId
      }
    },
    methods: {
      // fillIn (data) {
      //   console.log(data)
      //   Object.keys(data).map(key => {
      //     this.listParams[key] = data[key]
      //   })
      // },
       // 获取对应的人员的转正信息
      getConversionInfo (id) {
        req('getConversionInfo', { empEmployeeId: id || this.empEmployeeId }).then(async res => {
          await this.getStardardJobName(res.posPositionId)
          Object.assign(this.listParams, res)
          this.listParams.regularizationType = '1'
          this.listParams.regularSalary = res.expectedRegularSalary
          this.listParams.regularSalaryType = res.expectedRegularSalaryType
        })
      },

       // 获取标准职位名称
      getStardardJobName (posPositionId) {
        posPositionId && req('getPositions', {posPositionId})
        .then(data => {
          this.listParams.posStandardJobName = data.posStandardJobName
        })
      },
      // 获取发起人id
      sponsor (id) {
        console.log(id)
        !this.listParams.createId && (this.listParams.createId = id)
      },
      postFlow () {
        // 当合伙人填写薪资时，本人填写的不一致才需要让上一级代提，如果本来就不是本人发起的话就可以直接通过
        // 如果不是合伙人节点的话则不需要校验
        if (this.showMap.regularizationType && this.isShowContent && (this.listParams.expectedRegularSalaryType !== this.listParams.regularSalaryType || this.listParams.regularSalary !== this.listParams.expectedRegularSalary)) {
          this.$message('若工资发生变化，请让您的上一级代提起！')
          return false
        } else {
          return this.listParams
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>



