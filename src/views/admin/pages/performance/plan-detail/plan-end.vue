<template>
  <div>
      <progress-bar :plan-status="planDetail.planProgressStatus" :all-status="planDetail.allStatus">
      </progress-bar>
    <main>
      <el-form :model="planDetail" ref="form">
         <layout :all-detail.sync="tmp">
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
  .supplyment-row:hover {
    background-color: #eef1f6;
  }
  .supplyment-cell {
    text-align: center;
    width: 33%;
    padding-top: 10px;
  }
}
.indicator-table-cell {
  padding-top: 10px;
   width: 33%;
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


