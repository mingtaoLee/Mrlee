/**
 * Created by Huangzp on 2017-1-17.
 */
import {filter} from '../compile'
export default {
  data () {
    return {
      reqParams: null,
      pageLoading: false
    }
  },
  methods: {
    // 监听页数变化
    handleSizeChange (options) {
      this.fetch(options)
    },
    handleCurrentChange (options) {
      this.pageLoading = true
      this.fetch(options)
    },
    // 获取查询参数
    getParms () {
      // 过滤搜索框
      let params = filter(this.searchParms, null, {
        month: 'YYYY-MM'
      })
      this.reqParams = params
    },
     // 查询
    search () {
      this.getParms()
      this.pageLoading = true
      this.table.search = this.reqParams
    },
        // 重置
    reset () {
          // 新添加方法重置
      Object.keys(this.searchParms).map(item => {
        this.searchParms[item] = ''
      })
    }
  }
}
