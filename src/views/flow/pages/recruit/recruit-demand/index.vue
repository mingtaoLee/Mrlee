<template>
  <div>
    <i-process-flow
      :model="demandForm"
      :processType="processType">

      <div slot="requirementInfo">
        <!-- 职位信息 -->
        <demand-info
          :positionInfo="demandForm.requirementInfo"
          @showJob="showJobHandler"></demand-info>
        <!-- 职位选择器 -->
        <position-selection
          type="mini"
          v-model="isShow"
          @change="selectPositionConfirm">
        </position-selection>
      </div>

      <div slot="reasons">
        <!-- 招聘原因 -->
        <demand-reason :reasonInfo="demandForm.reasons"></demand-reason>
      </div>

      <!-- 岗位详情 -->
      <div slot="jobDetail">
         <!-- 岗位详情 -->
        <demand-detail
          :detailInfo="demandForm.jobDetail"
          @showJob="showJobHandler"></demand-detail>

          <!-- 岗位详情2 -->
        <!-- <demand-new-detail
          :detailInfo="demandForm.jobDetail"
          :editable="isEditable"
          @showJob="showJobHandler"></demand-new-detail> -->

          <!-- 任职要求 -->
         <demand-require :requireInfo="demandForm.jobDetail"></demand-require>

         <!-- 职位选择器 -->
        <position-selection
          type="mini"
          v-model="isShow"
          @change="selectPositionConfirm">
        </position-selection>
      </div>


    </i-process-flow>
  </div>
</template>
<script>
import IProcessFlow from 'components/common/i-process-flow'
import DemandInfo from 'views/flow/pages/recruit/components/demand/info'
import DemandReason from 'views/flow/pages/recruit/components/demand/reason'
import DemandRequire from 'views/flow/pages/recruit/components/demand/require'
import DemandDetail from 'views/flow/pages/recruit/components/demand/detail'
import DemandNewDetail from 'views/flow/pages/recruit/components/demand/newDetail'
import PositionSelection from 'components/position/position-selection'
// import { getActionType } from 'utils/flow'
// import req from 'api/employee/personal'
export default {
  components: {
    IProcessFlow,
    DemandInfo,
    DemandReason,
    DemandRequire,
    DemandDetail,
    DemandNewDetail,
    PositionSelection
  },
  data () {
    return {
      // 流程id
      taskId: this.$route.query.taskId,
      // 流程key
      taskKey: this.$route.query.taskKey,
      // 处理类型
      processType: this.$route.query.processType,
      // 需求id
      demandId: this.$route.query.demandId,
      // 需求是否可编辑
      // isEditable: this.checkIsEditable(),
      // 调用职位选择器的模块  info/detail
      jobSelectData: '',
      // 是否显示职位选择器
      isShow: false,
      demandForm: {
        //  ------- 职位信息 ----------
        requirementInfo: {
          name: '',
          applyOrgId: '',
          applyOrgNode: '',
          applyPositionId: '',
          applyPositionName: '',
          reportManId: '',
          reportManName: '',
          relationManId: '',
          relationManName: '',
          receiveEmail: '',
          fixationNum: '',
          existingNum: '',
          recruitNum: '',
          // floorSalary: '',
          // ceilSalary: '',
          salaryScope: '',
          // workAddress: '',
          areaId: '',
          posList: [],
          planInDate: '',
          empType: '',
          isPlatform: '',
          officeSupplies: ''
        },

        //  ------- 招聘原因 ----------
        reasons: {
          reasonType: '',
          reason: ''
        },

        jobDetail: {
          //  ------- 任职要求 ----------
          educationBackground: '',
          major: '',
          // floorWorkYear: '',
          // floorAge: '',
          // ceilAge: '',
          experienceType: '',
          workRequirement: '',
          specialSkill: '',
          gender: '',
          otherRequirement: '',

          // ------- 岗位详情 ----------
          positionStatement: '',
          targetProfession: '',
          targetEnterprise: '',
          targetPosition: '',
          targetPositionName: ''
        }
      }
    }
  },
  methods: {
    // 检查是否可编辑
    // checkIsEditable () {
    //   if (getActionType(this.$route.query.processType) === '门店端招聘需求填报' ||
    //       getActionType(this.$route.query.processType) === '综合事务岗招聘需求填报' ||
    //       getActionType(this.$route.query.processType) === '平台端招聘需求填报') {
    //     let taskKey = this.$route.query.taskKey
    //     if (taskKey && (taskKey === 'compFillIn' || taskKey === 'respFillIn' || taskKey === 'coachFillIn' || taskKey === 'HRFillIn')) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   } else {
    //     return true
    //   }
    // },
    // 显示职位弹窗
    showJobHandler (val) {
      this.jobSelectData = val
      this.isShow = true
    },
    // 选择职位
    selectPositionConfirm (selected) {
      if (this.jobSelectData === 'info') {
        this.demandForm.requirementInfo.applyPositionId = selected.posPositionId
        this.demandForm.requirementInfo.applyPositionName = selected.name
      } else {
        this.demandForm.jobDetail.targetPositionName = selected.name
        this.demandForm.jobDetail.targetPosition = selected.posPositionId
      }
      this.isShow = false
    }
  }
}
</script>
