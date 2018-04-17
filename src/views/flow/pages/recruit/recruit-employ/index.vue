<template>
  <div>
    <i-process-flow
      :model="employForm"
      :processType="processType"
      :createName="employForm.name"
      reloadOpener>

      <div slot="employForm">
        <!-- 员工录用信息 -->
        <employ-info
          :employInfo="employForm"
          :isEditWithName="isEditWithEmployFormName"
          @showJob="showJobHandler"></employ-info>
      </div>

    </i-process-flow>
  </div>
</template>
<script>
import IProcessFlow from 'components/common/i-process-flow'
import EmployInfo from 'views/flow/pages/recruit/components/employ'
// import { getActionType } from 'utils/flow'
import req from 'api/recruit/matriclated'
export default {
  components: {
    IProcessFlow,
    EmployInfo
  },
  data () {
    return {
      // 流程id
      taskId: this.$route.query.taskId,
      // 流程key
      taskKey: this.$route.query.taskKey,
      // 处理类型
      processType: this.$route.query.processType,
      // 录用者／面试者id
      interviewId: this.$route.query.interviewId,
      // 是否可编辑
      // isEditable: this.checkIsEditable(),
      // 名字是否可编辑
      isEditWithEmployFormName: false,
      // 流程表单
      employForm: {
        //  ------- 员工录用信息 ----------
        name: '',
        company: '',
        // department: '',
        orgUnitId: '',
        orgUnitName: '',
        selectedOrgNode: '',
        // departmentNode: '',
        positionId: '',
        positionName: '',
        entryDate: '',
        contractTime: '3',
        probationTime: '6',
        hireType: '',
        // employWorkType: '',
        empType: '',
        probationPay: '',
        salary: '',
        salaryType: '1',
        probationPayType: '1',
        otherExplain: '',
        posList: [],
        rctInterviewId: this.$route.query.interviewId
      }
    }
  },
  created () {
    console.log(this.$route.query.name)
    // this.createName = this.$route.query.name
    if (this.interviewId !== '-1' && this.interviewId) {
      this.getInterviewInfo()
    }
  },
  mounted () {
    this.employForm.name = this.$route.query.name || ''
  },
  methods: {
    // 获取详情
    getInterviewInfo () {
      req('hireDetail', {
        interviewId: this.interviewId
      }).then(res => {
        // console.log(res)
        this.employForm.name = res.name
        this.isEditWithEmployFormName = true
        this.employForm.orgUnitId = res.applyOrgId
        this.employForm.selectedOrgNode = {
          orgUnitId: res.applyOrgId,
          orgUnitName: res.applyOrgName
        }
        // this.employForm.position = res.applyPositionId
        this.employForm.company = res.company
        this.employForm.positionId = res.applyPositionId
        this.employForm.positionName = res.applyPosition
        this.employForm.empType = res.empType
      }).catch(err => {
        console.log(err)
      })
    }
    // 检查是否可编辑
    // checkIsEditable () {
    //   if (getActionType(this.$route.query.processType) === '录用审批') {
    //     let taskKey = this.$route.query.taskKey
    //     if (taskKey && (taskKey === 'respFillIn' || taskKey === 'HRFillIn')) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   } else {
    //     return true
    //   }
    // }
  }
}
</script>
