<template>
  <div class="wrap">
    <div class="content-card margin-twenty">

      <i-process-flow @fillin="fillIn" :model="model" >

      <div slot="posFormFillIn">
        <demand-desc :model="model" :action="action" :limitTime="limitTime" :ifDesc="desc"></demand-desc>
        <div class="content-follow">
          <h2 class="info-title">维护明细</h2>
          <div class="info-content">
            <position-post-batch-maintain :model="model.posPositionDtos"></position-post-batch-maintain>
          </div>
        </div>
      </div>

    </i-process-flow>

    </div>
  </div>
</template>

<script>
/**
 * 职位批量新建
 * operationType 0为新建；1为修改；2为撤销；3为删除
 */
// import moment from 'moment'
import DemandDesc from 'components/flow/demand-desc'
import PositionPostBatchMaintain from 'components/position/position-post-batch-maintain'
import PositionPostCancel from 'components/position/position-post-cancel'
import IProcessFlow from 'components/common/i-process-flow'

export default {
  name: 'PositionPostSetting',
  components: {
    DemandDesc,
    PositionPostBatchMaintain,
    PositionPostCancel,
    IProcessFlow
  },
  data () {
    return {
      processType: this.$route.query.processType,
      action: '',
      isStandard: false,
      desc: false,
      // 保存职位的数据
      model: {
        departmentId: '',
        applicantId: '',
        applicationDate: '',
        operationType: '',
        effectiveDate: '',
        posPositionDtos: [
          {
            reason: '',
            name: '',
            posStandardJobId: '',
            posStandardJobName: '',
            orgUnitId: '',
            parentPositionId: '',
            remark: '',
            academicRequirements: '',
            expertiseRequirements: '',
            skillRequirement: '',
            qualificationRequirement: '',
            otherRequirement: '',
            experienceRequirement: '',
            industryRequirement: '',
            enterpriseRequirement: '',
            keyResponsibilities: ''
          }
        ]
      },
      submitLoading: false,
      saveLoading: false,
      // 限制选择生效时间
      limitTime: 0
    }
  },

  methods: {
    postFlow () {
      let postData = JSON.parse(JSON.stringify(this.model))
      if (postData.operationType === '0') {
        delete postData.posPositionId
      }
      return postData
    },
    fillIn () {
    }
  },

  created () {
    // 必须点击树形图或待审批流程过来
    if (Object.keys(this.$route.query).length === 0) {
      return window.close()
    }
    // 操作类型
    this.model.operationType = '0'
    this.action = '职位批量新建'
    // 获取所属组织信息
    this.model.posPositionDtos.forEach(item => {
      item.orgUnitId = this.$route.query.orgUnitId || ''
      item.orgUnitName = this.$route.query.orgUnitName || ''
      item.orgNode = this.$route.query.orgNode ? JSON.parse(this.$route.query.orgNode) : {}
    })
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  margin-top: -20px;
}
</style>
