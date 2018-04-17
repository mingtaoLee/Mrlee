/**
 * 根据主体内容计算出侧边栏aside的高度来控制滚动条的长度
 */
export default {
  data () {
    return {
      asideHeight: ''
    }
  },
  computed: {
    // 组织树的样式
    treeStyle () {
      return `height:${this.asideHeight}px;`
    }
  },
  mounted () {
    this.calculateAsideHeight()
  },
  methods: {
    calculateAsideHeight () {
      if (this.$refs.main) {
        this.asideHeight = this.$refs.main.clientHeight
      }
    }
  }
}
