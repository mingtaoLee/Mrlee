<template>
   <i-process-flow @postFlow="postFlow" :slotArr="slotArr" :model="planModel" :processType="processType">

      <div slot="scaReportFormFillIn">
        <demand-desc  :model="planModel" :action="action" :ifDesc="false" :limitTime="limitTime"></demand-desc>
        <div class="content-follow">
          <h2 class="info-title">编制情况</h2>
          <plan-detail-home-table :standardable="false" :header="planModel.planHeader" :data="planModel.planData" edite-cell ref="planTable"/>
        </div>
      </div>

    </i-process-flow>
</template>

<script>
import IProcessFlow from 'components/common/i-process-flow'
import DemandDesc from 'components/flow/demand-desc'
import PlanDetailHomeTable from 'components/compile/table/plan-detail-home-table'

export default {
  name: 'NormalPlanApply',
  components: {
    IProcessFlow,
    DemandDesc,
    PlanDetailHomeTable
  },
  data () {
    return {
      processType: 'scaReportCreateProcess',
      slotArr: ['scaReportFormFillIn', 'prePartnerResult', 'updateData'],
      // 限制选择生效时间
      limitTime: 0,
      // 缓存表格数据，用来reset
      resetTable: {},
      // 提交的编制计划数据
      planModel: {
        effectiveDate: '',
        reason: '',
        planHeader: [],
        planData: [{
          scaPlanReportMasterId: '',
          scaPlanId: '',
          orgUnitId: '',
          reportStatus: '',
          effectiveDate: '',
          reason: '',
          scaPlanReportSlaves: []
        }]
      },
      action: '填报常规编制计划'
    }
  },

  methods: {
    // 处理上传的数据
    postFlow () {
      this.planModel.planHeader = this.$refs.planTable.table.header
      this.planModel.planData = this.$refs.planTable.getTableClone()
      // 处理最后上传的数据
      if (this.$route.query.taskKey && this.$route.query.taskKey === 'updateData') {
        delete this.planModel.planHeader
        delete this.planModel.planData
      }
      let formatData = this.$refs.planTable.formatData()[0]
      delete formatData.effectiveDate
      Object.assign(this.planModel, formatData)
      return this.planModel
    },
    // 获取维护功能
    getAction () {
      this.$route.query.modify && (this.action = '修改常规编制计划') && (this.taskId = 'todo')
    },
    // 获取路由上的header和data
    getTableDetail () {
      this.$route.query.header && (this.planModel.planHeader = JSON.parse(this.$route.query.header))
      if (this.$route.query.data) {
        let data = JSON.parse(this.$route.query.data)
        this.planModel.planData = data
      }
    }
  },

  created () {
    this.getTableDetail()
    this.getAction()
  }
}
</script>

<style lang="scss" scoped>

</style>
