
export default {
  data () {
    return {
      elHeight: 500
    }
  },
  methods: {
    controlHeightWithHeader (minusHeight = 0) {
      this.$nextTick(() => {
        let minHeight = window.innerHeight - 115
        let changingHeight = this.$children[0].$el.children[1].childNodes[0].clientHeight +
         this.$children[0].$el.children[1].childNodes[2].children[0].clientHeight + 15
        this.elHeight = (changingHeight > minHeight ? changingHeight : minHeight) - minusHeight
      })
    },
    controlHeightWithoutHeader (minusHeight = 0) {
      this.$nextTick(() => {
        let minHeight = window.innerHeight - 115
        let changingHeight = this.$children[0].$el.children[1].childNodes[2].children[0].clientHeight
        this.elHeight = (changingHeight > minHeight ? changingHeight : minHeight) - minusHeight
      })
    }
  }
}
