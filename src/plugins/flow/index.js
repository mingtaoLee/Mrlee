
var FlowAccess = {}
FlowAccess.install = function (Vue, options) {
  Vue.mixin({
    computed: {
      showMap () {
        return this.$store.state.flow.showMap
      },
      disabledMap () {
        return this.$store.state.flow.disabledMap
      }
    }
  })
}

module.exports = FlowAccess
