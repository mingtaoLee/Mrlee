<template>
   <i-process-flow @postFlow="postFlow" :slotArr="slotArr" :model="planModel" :processType="processType">

      <div slot="scaReportFormFillIn">
        <demand-desc :model="planModel" :ifDesc="false" :action="action" :limitTime="limitTime"></demand-desc>
        <div class="content-follow">
          <h2 class="info-title">编制情况</h2>
          <div class="info-content">
            <div class="mt10 mb20">
              <people-effect-table :orgUnitId="planModel.planData[0].orgUnitId"
              :tableModel="planModel"  @change="changeEffect" edite-cell  />
            </div>
            <div class="mt10 mb20">
             <plan-detail-home-table :standardable="false" :header="planModel.planHeader" :having-org-name="false"
             :data="planModel.planData" edite-cell  @change="changeEffect" ref="planTable"/>
            </div>
          </div>
        </div>
        <div class="content-follow">
          <h2 class="info-title">人效情况</h2>
          <div class="info-content">
            <people-effect-table tableType="effect"  :orgUnitId="planModel.planData[0].orgUnitId"
            :tableModel="planModel" edite-cell ref="effectTable" />
          </div>
        </div>
      </div>

    </i-process-flow>
</template>

<script>
import IProcessFlow from 'components/common/i-process-flow'
import DemandDesc from 'components/flow/demand-desc'
import PlanDetailHomeTable from 'components/compile/table/plan-detail-home-table'
import PeopleEffectTable from 'components/compile/table/people-effect-table'

export default {
  name: 'SmallShopPlanApply',
  components: {
    IProcessFlow,
    DemandDesc,
    PlanDetailHomeTable,
    PeopleEffectTable
  },
  props: {

  },
  watch: {

  },
  data () {
    return {
      processType: 'storeScaReportCreateProcess',
      slotArr: ['scaReportFormFillIn', 'partnerResult', 'prePartnerResult', 'updateData'],
      // 限制选择生效时间
      limitTime: 0,
      // 提交的编制计划数据
      planModel: {
        effectiveDate: '',
        desc: '',
        reason: '',
        // 多级表头表格的计划表头
        planHeader: [],
        // 多级表头表格的计划内容
        planData: [{
          scaPlanReportMasterId: '',
          scaPlanId: '',
          orgUnitId: '',
          preDailySales: '',
          preDailyPassFlow: '',
          reportStatus: '',
          effectiveDate: '',
          remark: '',
          scaPlanReportSlaves: []
        }],
        // 流量/人效表格表格的内容
        flowEffectData: []
      },
      action: '填报小店编制计划',
      // 用来暂存数据，编制数和日均销售额
      tempPredict: {
        scaNum: '',
        dailySales: ''
      }
    }
  },
  methods: {
    // 处理上传的数据
    postFlow () {
      this.planModel.planHeader = this.$refs.planTable.table.header
      this.planModel.planData = this.$refs.planTable.getTableClone()
      // 提取预测日销售额和预测日客流量
      this.planModel.preDailySales = this.planModel.flowEffectData[0].preDailySales
      this.planModel.preDailyPassFlow = this.planModel.flowEffectData[0].preDailyPassFlow
      // 处理最后上传的数据
      if (this.$route.query.taskKey && this.$route.query.taskKey === 'updateData') {
        delete this.planModel.planHeader
        delete this.planModel.planData
        delete this.planModel.flowEffectData
      }
      let formatData = this.$refs.planTable.formatData()[0]
      // 先删除可能影响覆盖的参数
      delete formatData.effectiveDate
      delete formatData.preDailySales
      delete formatData.preDailyPassFlow
      Object.assign(this.planModel, formatData)
      return this.planModel
    },
    // 获取维护功能
    getAction () {
      this.$route.query.modify && (this.action = '修改小店编制计划') && (this.taskId = 'todo')
    },
    // 获取路由上的header和data
    getTableDetail () {
      if (this.$route.query.header) {
        this.planModel.planHeader = JSON.parse(this.$route.query.header)
      }
      if (this.$route.query.data) {
        let data = JSON.parse(this.$route.query.data)
        this.planModel.planData = data
        // todo:预测日均销售额，预测日均客流量先放进去
        this.planModel.flowEffectData[0] = {
          preDailyPassFlow: data[0].preDailyPassFlow || '',
          preDailySales: data[0].preDailySales || ''
        }
      }
    },
    // 改变人效对应的数据
    changeEffect (target) {
      this.tempPredict[target.label] = target.value
      this.$refs.effectTable.predictEffect(this.tempPredict.scaNum, this.tempPredict.dailySales)
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
