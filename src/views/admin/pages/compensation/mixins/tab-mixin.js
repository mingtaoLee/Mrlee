/**
 * Created by ZHANZF on 2018-1-24.
 */
export default {
  data () {
    return {
      // 判断是否显示当前组件的函数
      judgeShowComponent: this.initCacheComponentFn()
    }
  },
  methods: {
    /** 缓存已渲染组件 */
    initCacheComponentFn () {
      let arr = new Set([])

      return function () {
        const curIndex = Array.from(arguments).shift()
        const index = Array.from(arguments).pop()

        if (arr.has(index)) return true

        if (curIndex === (index + 1)) {
          arr.add(index)
          return true
        } else {
          return false
        }
      }
    }
  }
}
