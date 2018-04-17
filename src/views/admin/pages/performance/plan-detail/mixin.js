import request from 'api/performance/plan-manage'
export default {
  data () {
    return {
      checkRecords: []
    }
  },
  methods: {
    getCheckedRecord () {
      request('getPlanCheckRecord', {
        'planId': this.$route.params.planId
      }).then(res => {
        this.checkRecords = res
      })
    }
  }
}
