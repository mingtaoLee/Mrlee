<template>
  <div v-if="planDetail" v-loading.fullscreen.lock="fullscreenLoading">
      <progress-bar :plan-status="planDetail.planProgressStatus" :all-status="planDetail.allStatus">
      </progress-bar>
    <main>
      <el-form :model="planDetail" ref="form">
         <layout :all-detail.sync="tmp">
          <el-button @click="submit" slot="need-validate-buttons" v-if="planDetail.isOperatePermission === 'Y'">
            提交
          </el-button>
          <!-- <el-button @click="submit(true)" slot="need-validate-buttons">
            保存
          </el-button> -->
           <div slot='diff' class="operatorDescription-area mb10 mt10">
            <span class="operatorDescription-title">申述理由:</span>
            <el-form-item prop="operatorDescription" slot="diff" class="representation" :rules="null" >
            <el-input v-model="planDetail.complaintReason" placeholder="请输入申诉理由" type="textarea" :disabled="true"></el-input>
          </el-form-item>
          </div>
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
                isSupply
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
      fullscreenLoading: false,
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
    generateSubmitData () {
      if (this.planDetail) {
        Object.assign(this.submitData, {
          'planId': this.$route.params.planId,
          'fixedIndicators': this.planDetail.fixedIndicators,
          'supplementIndicators': this.planDetail.supplementIndicators,
          'keyWork': this.planDetail.keyWork,
          'events': this.planDetail.events
          // 'operatorDescription': this.operatorDescription
        })
      }
    },
    submit (save) {
      if (this.planDetail.isOverDeadline === 'Y') {
        this.$message({
          message: '评估已结束，不能处理申诉',
          type: 'error'
        })
      } else {
        this.$confirm(`是否确认${save === true ? '保存' : '申述'}？`, '提示').then(() => {
          let req = ''
          save === true ? req = 'savePlan' : req = 'planRepresentation'
          this.$refs.form.validate(valid => {
            if (valid) {
              this.generateSubmitData()
              this.fullscreenLoading = true
              request(req, this.submitData).then(() => {
                this.fullscreenLoading = false
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                // this.$router.replace('/self_performance')
                this.$confirm('是否离开当前页面', '确认').then(() => {
                  window.opener.location.reload()
                  window.close()
                })
              }).catch((err) => {
                this.$message.error(err.message)
                this.fullscreenLoading = false
              })
            }
          })
        })
      }
    },
    reject () {
      if (this.planDetail.isOverDeadline === 'Y') {
        this.$message({
          message: '评估已结束，不能处理申诉',
          type: 'error'
        })
      } else {
        request('rejectPlan', {planId: this.$route.params.id}).then(() => {
          this.$message({
            message: '计划已驳回',
            type: 'success'
          })
          this.$router.replace('/self_performance')
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
  mounted () {},
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
  }
  .operatorDescription-area {
    width:100%;
    display: flex;
    .operatorDescription-title {
      width:5%;
      display: flex;
      align-items: top;
      font-size: 14px;
    }
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


