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
          v-if="allDetail.isOperatePermission !== 'N'"
          slot="not-need-validate-buttons"
          @click="getPerformanceLastPlanConfirm('getPerformanceLastPlan')"
          type="primary">
          复制上阶段计划
        </el-button>

        <el-button
          v-if="allDetail.isOperatePermission !== 'N'"
          slot="need-validate-buttons"
          @click="postSubmitConfirm('postPerformancePlanSubmit')"
          type="primary">
          提交计划
        </el-button>

        <el-button
          v-if="allDetail.isOperatePermission !== 'N'"
          slot="need-validate-buttons"
          type="primary"
          @click="postSaveConfirm('postPerformancePlanSave')">
          保存
        </el-button>

        <div class="mt10 diff-area" slot="diff">

          <span>

            <h3>审批说明：</h3>

          </span>

          <div class="diff-textarea reason-area padding5 font-size-small">
            {{ allDetail.rejectReason }}
          </div>

        </div>

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
.reason-area {
  border: 1px solid #e5e5e5;
  height: 50px;
}
</style>

