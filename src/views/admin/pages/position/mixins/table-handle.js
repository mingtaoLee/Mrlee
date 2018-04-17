/**
 * 表格固定的方法
 */
import {filter} from 'utils/compile'

export default {
  methods: {
    // 搜索内容
    search () {
      // 过滤，拼接参数
      let params = filter(this.searchBox)
      this.table.search = { ...params }
    },
    // 每页展示多少条数据
    handleSizeChange (params) {
      this.fetch(params)
    },
    // 获取置顶页数数据
    handleCurrentChange (params) {
      this.fetch(params)
    }
  }
}
