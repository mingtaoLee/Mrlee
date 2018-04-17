<template>
  <div class="wrap">
    <i-dialog
      :title="title"
      v-model="dialogVisible"
      destroyedWhenClose
      :toolbar="toolbar"
      size="huge">
      <plan-title title="编制情况" />
      <div class="mt10 mb10">
        <people-effect-table :orgUnitId="planModel.planData[0].orgUnitId"
        :tableModel="planModel"  @change="changeEffect" />
      </div>
      <div class="mt10 mb10">
        <plan-detail-home-table :header="planModel.planHeader" :data="planModel.planData"
        :standardable="false"  @change="changeEffect" />
      </div>
      <div class="mt10 mb20">
        <el-collapse>
          <el-collapse-item title="查看历史编制" name="1">
            <check-history-table :table="cloneTable" />
          </el-collapse-item>
        </el-collapse>
      </div>
      <plan-title title="人效情况" />
      <div class="mt10 mb20">
        <people-effect-table tableType="effect"  :orgUnitId="planModel.planData[0].orgUnitId"
        :tableModel="planModel"  ref="effectTable" />
      </div>
      <plan-title title="同省同业态类型情况" />
      <div class="mt10 mb10">
        <business-mode-table />
      </div>
      <div class="mt10 mb20">
        <el-collapse>
          <el-collapse-item title="查看类似小店编制情况" name="1">
            <similar-shop-table />
          </el-collapse-item>
        </el-collapse>
      </div>
    </i-dialog>
  </div>
</template>

<script>
import IDialog from 'components/common/i-dialog/i-dialog'
import PlanDetailHomeTable from 'components/compile/table/plan-detail-home-table'
import PeopleEffectTable from 'components/compile/table/people-effect-table'
import BusinessModeTable from 'components/compile/table/business-mode-table'
import CheckHistoryTable from 'components/compile/table/check-history-table'
import SimilarShopTable from 'components/compile/table/similar-shop-table'
import PlanTitle from 'components/compile/title/plan-title'

export default {
  name: 'SmallShopPlanDetails',
  components: {
    IDialog,
    PlanDetailHomeTable,
    PeopleEffectTable,
    BusinessModeTable,
    CheckHistoryTable,
    SimilarShopTable,
    PlanTitle
  },
  props: {
    table: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // 折叠面板设置
      similarShopPanel: true,
      checkHistoryPanel: true,
      // 弹框的显示隐藏
      dialogVisible: false,
      // 弹框标题
      title: '查看编制计划',
      // 弹框按钮配置
      toolbar: [{
        text: '关闭',
        type: 'plain',
        func: (done) => {
          done()
        }
      }],
      // 查看的编制计划数据
      planModel: {
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
      }
    }
  },

  methods: {
    // 显示弹框
    openDialog (header, data) {
      this.planModel.planHeader = header
      this.planModel.planData = data
      this.init()
      this.dialogVisible = true
    },
    init () {
      // todo:预测日均销售额，预测日均客流量先放进去
      this.planModel.flowEffectData[0] = {
        preDailyPassFlow: this.planModel.planData[0].preDailyPassFlow || '',
        preDailySales: this.planModel.planData[0].preDailySales || ''
      }
    },
    // 改变人效对应的数据
    changeEffect (target) {
      this.tempPredict[target.label] = target.value
      this.$refs.effectTable.predictEffect(this.tempPredict.scaNum, this.tempPredict.dailySales)
    }
  },

  created () {

  }
}
</script>

<style lang="scss" scoped>

</style>
