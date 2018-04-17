<template>
  <div>
      <progress-bar :plan-status="planDetail.planProgressStatus" :all-status="planDetail.allStatus">
      </progress-bar>
    <main>
      <el-form :model="planDetail" ref="form">
         <layout :all-detail.sync="tmp">
          <el-button @click="confirmPlan" slot="need-validate-buttons" v-if="planDetail.isOperatePermission === 'Y'">
            接受
          </el-button v-if="planDetail.isOperatePermission === 'Y'">
          <el-button @click="doRepresentation" slot="need-validate-buttons">
            申诉
          </el-button>
           <el-form-item prop="operatorDescription" slot="diff" class="representation" :rules="rules.representation">
            <el-input
              v-model="planDetail.operatorDescription"
              placeholder="请输入申诉理由"
              type="textarea"
              :disabled="planDetail.isOperatePermission !== 'Y'">
            </el-input>
          </el-form-item>
        <!-- kpi -->
          <table border="1" slot="kpi-table" class="supplyment-table">
            <tr v-for="(indicator, index) in planDetail.fixedIndicators" :key="index" class="supplyment-row">
              <td class="supplyment-cell" style="width: 33%">
                <kpi-evaluate-info :indicator="indicator"></kpi-evaluate-info>
              </td>
              <td class="indicator-table-cell" style="width: 33%">
                <self-evaluate-form
                :processStatus="planDetail.processStatus"
                :indicator.sync="indicator"
                :rowIndex="index"
                needDisable
                ></self-evaluate-form>
              </td>
              <td class="indicator-table-cell">
                <leader-evaluate-form
                :processStatus="planDetail.processStatus"
                :indicator.sync="indicator"
                :rowIndex="index"
                v-for="(leader, _index) in indicator.evaluationLeaders"
                :key="_index"
                :leaderIndex="_index"
                ></leader-evaluate-form>
              </td>
            </tr>
          </table>
           <!-- supplyment-indicators -->
            <table border="1" slot="kpi-table" class="supplyment-table">
            <tr v-for="(indicator, index) in planDetail.supplementIndicators" :key="index" class="supplyment-row">
              <td class="supplyment-cell" style="width: 33%">
                <kpi-evaluate-info :indicator="indicator"></kpi-evaluate-info>
              </td>
              <td class="indicator-table-cell" style="width: 33%">
                <self-evaluate-form
                :processStatus="planDetail.processStatus"
                :indicator.sync="indicator"
                :rowIndex="index"
                needDisable
                isSupply
                ></self-evaluate-form>
              </td>
              <td class="indicator-table-cell">
                <leader-evaluate-form
                :processStatus="planDetail.processStatus"
                :indicator.sync="indicator"
                :rowIndex="index"
                v-for="(leader, _index) in indicator.evaluationLeaders"
                :key="_index"
                :leaderIndex="_index"
                isSupply
                ></leader-evaluate-form>
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
              <td style="width: 33%">
                <kpi-evaluate-info :indicator="work" isKeywork></kpi-evaluate-info>
              </td>
              <td class="pb10" style="width: 33%">
                <self-evaluate-form
                  :processStatus="planDetail.processStatus"
                  :indicator.sync="work"
                  :rowIndex="index"
                  needDisable
                  isKeywork>
                </self-evaluate-form>
              </td>
              <td class="pb10">
                 <leader-evaluate-form
                :processStatus="planDetail.processStatus"
                :indicator.sync="work"
                :rowIndex="index"
                v-for="(leader, $index) in work.evaluationLeaders"
                :key="$index"
                :leaderIndex="$index"
                isKeywork
                ></leader-evaluate-form>
              </td>
            </tr>
          </table>
          <!-- 关键事件 -->
          <key-event-table slot="event-table" :all-detail="planDetail" :lock="true"></key-event-table>
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
      planDetail: {
        operatorDescription: ''
      },
      operatorDescription: '',
      tmp: {},
      submitData: {},
      rules: {
        representation: {required: true, message: '请输入申述理由，200字以下', max: 200, trigger: 'blur'}
      }
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
    confirmPlan () {
      if (this.planDetail.isOverDeadline === 'Y') {
        this.$message({
          message: '已过提交日期',
          type: 'error'
        })
      } else {
        this.$confirm('是否确认当前评分？', '提示').then(() => {
          request('planConfirm', {planId: this.$route.params.planId}).then(() => {
            this.$message({
              message: '已确认评分',
              type: 'success'
            })
            this.$router.replace('/self_performance')
          })
        })
      }
    },
    doRepresentation () {
      if (this.planDetail.isOverDeadline === 'Y') {
        this.$message({
          message: '已过申诉日期',
          type: 'error'
        })
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$confirm('是否确认申诉？', '提示').then(() => {
              request('planGradeComplaint', {planId: this.$route.params.planId, operatorDescription: this.planDetail.operatorDescription}).then(() => {
                this.$message({
                  message: '成功提交申诉',
                  type: 'success'
                })
                this.$router.replace('/self_performance')
              })
            })
          }
        })
      }
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
  .representation {
    width: 100%;
    margin-top: 15px;
  }
.supplyment-table {
  border: 1px solid #dfe6ec;
  border-top: none;
  border-right: none;
  .supplyment-cell {
    text-align: center;
    width: 33%;
    padding-top: 10px;
  }
}
.indicator-table-cell {
  padding-top: 10px;
}
.table {
  width: 100%;
  background: #fff;
  border: 1px solid #DFE6EC;

  th, td {
    border-color: #DFE6EC;
  }
}
</style>


