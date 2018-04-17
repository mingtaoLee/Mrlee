<template>
  <div class="container">
      <progress-bar 
        :plan-status="planDetail.planProgressStatus" 
        :all-status="planDetail.allStatus"
      >
      </progress-bar>
    <main>
      <el-form :model="planDetail" ref="form">
         <layout :all-detail.sync="tmp">
          <span slot="need-validate-buttons">
            <el-button type="primary" @click="submit"  v-if="planDetail.isOperatePermission === 'Y'">
              提交
            </el-button>
          </span>
<!-- kpi -->
          <table
            class="table"
            slot="kpi-table"
            border>
            <tr
              v-for="(indicator, index) in planDetail.fixedIndicators"
              :key="index">
              <td style="width:45%">
                <kpi-evaluate-info :indicator="indicator"></kpi-evaluate-info>
              </td>

              <td class="pb10">
                <self-evaluate-form
                :processStatus="planDetail.processStatus"
                :indicator.sync="indicator"
                :rowIndex="index"
                size="big">
              </self-evaluate-form>
              </td>
            </tr>

            <tr
              v-for="(indicator, index) in planDetail.supplementIndicators"
              :key="index">
              <td style="width:45%">
                <kpi-evaluate-info :indicator="indicator"></kpi-evaluate-info>
              </td>

              <td>
                <self-evaluate-form
                :processStatus="planDetail.processStatus"
                :indicator.sync="indicator"
                :rowIndex="index"
                isSupply
                size="big">
              </self-evaluate-form>
              </td>
            </tr>
          </table>

<!-- keywork -->
          <table
            class="table"
            slot="work-table"
            border>
            <tr
              v-for="(work, index) in planDetail.keyWork"
              :key="index">
              <td style="width: 45%">
                <kpi-evaluate-info :indicator="work" isKeywork></kpi-evaluate-info>
              </td>
              <td class="pb10">
                <self-evaluate-form
                  :processStatus="planDetail.processStatus"
                  :indicator.sync="work"
                  :rowIndex="index"
                  isKeywork
                  size="big">
                </self-evaluate-form>
              </td>
            </tr>
          </table>

<!-- 关键事件 -->
          <key-event-table slot="event-table" :all-detail="planDetail"></key-event-table>

<!-- approval -->
          <approval-table slot="approval-table" :record="checkRecords"></approval-table>
        </layout>
      </el-form>
    </main>
  </div>
</template>
<script>
import selfEvaluateForm from 'components/performance/self-evaluate-form.vue'
import leaderEvaluateForm from 'components/performance/leader-evaluate-form.vue'
import kpiEvaluateInfo from 'components/performance/kpi-evaluate-info.vue'
import progressBar from 'components/performance/progress-bar.vue'
import layout from 'components/performance/plan-layout.vue'
import approvalTable from 'components/performance/approval-table.vue'
import keyEventTable from 'components/performance/key-event.vue'
import request from 'api/performance/plan-manage'
import mixin from './mixin'
export default {
  mixins: [mixin],
  props: {
    id: String
  },
  data () {
    return {
      planDetail: {},
      tmp: null,
      submitData: {}
    }
  },
  components: {
    selfEvaluateForm,
    leaderEvaluateForm,
    kpiEvaluateInfo,
    progressBar,
    layout,
    approvalTable,
    keyEventTable
  },
  methods: {
    getDetail () {
      request('getPlanDetail').then(res => {
        this.tmp = res
      })
    },
    generateSubmitData () {
      if (this.planDetail) {
        this.submitData = Object.assign({}, {
          'leaderId': this.planDetail.leaderId || '',
          'planId': this.$route.params.planId,
          'fixedIndicators': this.planDetail.fixedIndicators,
          'supplementIndicators': this.planDetail.supplementIndicators,
          'keyWork': this.planDetail.keyWork,
          'events': this.planDetail.events
        })
        if (this.planDetail.isOperatePermission !== 'Y') this.needDisable = true
      }
    },

    validateLeaderAndEvaluator () {
      if (!this.planDetail.leaderId) {
        this.$message({
          type: 'error',
          message: '请设置直接上级'
        })
        return false
      } else {
        return true
      }
    },

    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.validateLeaderAndEvaluator()) return
          this.generateSubmitData()
          request('submitSelfEvaluate', this.submitData).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.replace('/self_performance')
          })
        }
      })
    }
  },
  watch: {
    tmp (newVal, oldVal) {
      if (newVal) {
        this.planDetail = newVal
      }
    }
  },
  created () {
    // this.getDetail()
    this.tmp = this.$parent.requestedData
    this.getCheckedRecord()
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  background: #fff;
  border: 1px solid #DFE6EC;

  th, td {
    border-color: #DFE6EC;
  }
}

</style>
