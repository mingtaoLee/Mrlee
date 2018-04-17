<template>

  <div class="container" v-if="allDetail">

    <progress-bar
      :plan-status="allDetail.planProgressStatus"
      :all-status="allDetail.allStatus">
    </progress-bar>

      <plan-layout
        :all-detail.sync="allDetail">

        <el-button
          v-if="allDetail.isOperatePermission !== 'N'"
          slot="need-validate-buttons"
          @click="postPassConfirm('postPerformanceAuditPass')"
          type="primary">
          审核通过
        </el-button>

        <el-button
          v-if="allDetail.isOperatePermission !== 'N'"
          slot="need-validate-buttons"
          @click="postRejectConfirm('postPerformanceAuditReject')"
          type="primary">
          驳回
        </el-button>

        <div
          class="mt10 diff-area"
          slot="diff"
          v-if="allDetail.isOperatePermission !== 'N'">

          <span>
            <h3>审批说明：</h3>
          </span>

          <el-form
            ref="planAuditingForm"
            :model="ruleForm"
            :rules="rules"
            class="diff-textarea">

            <el-form-item
              prop="operatorDescription">
              <el-input
                type="textarea"
                placeholder="请填写审核说明"
                v-model="ruleForm.operatorDescription">
              </el-input>
            </el-form-item>

          </el-form>

        </div>

        <month-tab
          slot="tab"
          :periods="allDetail.periods"
          @toggled="getPeriodPlan"
          :current-period="allDetail.period">
        </month-tab>

        <kpi-table
          slot="kpi-table"
          :all-detail.sync="allDetail"
          :can-operate="false">
        </kpi-table>

        <keywork-table
          slot="work-table"
          :all-detail.sync="allDetail"
          :can-operate="false">
        </keywork-table>

        <approval-table
          slot="approval-table"
          :record="record">
        </approval-table>

      </plan-layout>

    <!-- </el-form> -->

  </div>

</template>

<script>
import reqMixin from './mixin-request'
import compsMixin from './mixin-components'
import lifecycleMixin from './mixin-lifecycle'
export default {
  mixins: [reqMixin, compsMixin, lifecycleMixin],

  data () {
    const checkText = (rule, val, cb) => {
      !val
        ? cb(new Error('请填写审核说明'))
        : /^\s+$/.test(val)
          ? cb(new Error('不能为纯空格'))
          : val.length < 1 || val.length > 255
           ? cb(new Error('字符长度为 1 ~ 255'))
           : cb()
    }
    return {
      ruleForm: {
        operatorDescription: ''
      },
      rules: {
        operatorDescription: [{
          validator: checkText,
          trigger: 'change'
        }, {
          validator: checkText,
          trigger: 'blur'
        }]
      }
    }
  },

  methods: {
    handleSubmit (url) {
      this.$refs['planAuditingForm'].validate(res => {
        if (!res) {
          this.$message.warning('请规范填写审批说明')
        } else {
          if (this.allDetail.isOverDeadline !== 'Y') {
            this.postData(url)
          } else {
            this.$message.warning('评估已结束，不能进行操作')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./plan-detail.scss";
</style>
