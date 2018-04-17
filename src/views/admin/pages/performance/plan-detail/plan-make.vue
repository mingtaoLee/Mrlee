<template>
  <div class="container" v-if="allDetail">

    <progress-bar
      :plan-status="allDetail.planProgressStatus"
      :all-status="allDetail.allStatus">
    </progress-bar>

    <el-form ref="form" :model="allDetail">
      <plan-layout
        :all-detail.sync="allDetail">

        <el-button
          slot="not-need-validate-buttons"
          @click="getPerformanceLastPlanConfirm('getPerformanceLastPlan')"
          type="primary">
          复制上阶段计划
        </el-button>

        <el-button
          slot="need-validate-buttons"
          @click="postSubmitConfirm('postPerformancePlanSubmit')"
          type="primary">
          提交计划
        </el-button>

        <el-button
          slot="need-validate-buttons"
          @click="postSaveConfirm('postPerformancePlanSave')"
          type="primary">
          保存
        </el-button>

        <kpi-table
          slot="kpi-table"
          :all-detail.sync="allDetail"
          :can-operate="allDetail.isOperatePermission !== 'N'">
        </kpi-table>

        <keywork-table
          slot="work-table"
          :all-detail.sync="allDetail"
          :can-operate="allDetail.isOperatePermission !== 'N'">
        </keywork-table>

        <approval-table
          slot="approval-table"
          :record="record">
        </approval-table>
      </plan-layout>
    </el-form>
  </div>
</template>

<script>
import reqMixin from './mixin-request'
import compsMixin from './mixin-components'
import lifecycleMixin from './mixin-lifecycle'
export default {

  mixins: [reqMixin, compsMixin, lifecycleMixin]

}
</script>

<style lang="scss" scoped>
@import "./plan-detail.scss";
</style>
