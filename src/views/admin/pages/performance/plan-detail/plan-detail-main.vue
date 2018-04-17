<template>
  <div class="container" v-if="requestedData">
    <router-view/>
  </div>
</template>

<script>
const PLAN_DETAIL_DICT = {
  '01': 'plan_make',
  '011': 'plan_reject',
  '02': 'plan_auditing',
  '03': 'plan_audited',
  '04': 'plan_audited',
  '05': 'plan_audited',
  '041': 'plan_audited',
  '06': 'plan_self_evaluate',
  '07': 'plan_re_evaluate',
  '071': 'plan_representation',
  '08': 'plan_confirm',
  '081': 'plan_confirm',
  '09': 'plan_end'
}

import request from 'api/performance/plan-manage'

export default {
  data () {
    return {
      requestedData: null
    }
  },

  methods: {
    getData () {
      request('getPlanDetail', {
        'planId': this.$route.params.planId
      }).then((res) => {
        this.requestedData = res
        this.$router.replace(
          `/performance/${this.$route.params.planId}/plan_detail/${PLAN_DETAIL_DICT[res.processStatus]}`)
      })
    },

    getPeriodData () {
      if (!this.requestedData) {
        this.getData()
        return
      }
      request('getPeriodPlanDetail', {
        'employeeId': this.requestedData.employeeId,
        'schemeId': this.requestedData.schemeId,
        'period': this.$store.state.performance.toggledPeriod
      }).then((res) => {
        this.$store.commit({
          type: 'PER_SET_TOGGLEDPERIOD',
          period: ''
        })
        this.requestedData = res
        this.$message.success('切换成功')
        this.$router.replace(
          `/performance/${this.$route.params.planId}/plan_detail/${PLAN_DETAIL_DICT[res.processStatus]}`)
      })
    }
  },

  mounted () {
    this.getData()
  },

  beforeRouteUpdate (to, from, next) {
    if (from.path !== `/performance/${this.$route.params.planId}/plan_detail`) {
      !this.$store.state.performance.toggledPeriod
        ? this.getData()
        : this.getPeriodData()
    }
    next()
  }
}
</script>
