/**
 * Created by ZHANZF on 2017-12-2.
 * 基本表格mixin
 */
import { showMessage } from 'utils/index'
export default {
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.fetch()
    },

    /** 弹窗取消 */
    handleCancel (done) {
      done()
    },

    /** 路由返回 */
    back () {
      this.$router.back()
    },
    /** 导入 */
    import () {
      showMessage('info', '功能暂缓')
    },
    /** 抽数 */
    takeData () {
      showMessage('info', '功能暂缓')
    },
    load () {
      this.loading = true
    },
    loaded () {
      this.loading = false
    }
  },
  beforeDestroy () {
    this.loaded()
  }
}
