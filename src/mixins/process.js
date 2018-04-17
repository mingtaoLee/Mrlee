export default {
  computed: {
    taskId () {
      return this.$route.query.taskId || 'undefined'
    },
    actionType () {
      return this.$route.query.actionType || 'undefined'
    },
    taskKey () {
      return this.$route.query.taskKey || 'undefined'
    }
  }
}
