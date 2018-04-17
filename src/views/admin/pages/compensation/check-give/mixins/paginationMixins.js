/**
 * Created by liumian on 2018-1-24.
 * form表单搜索加表格分页基本Mixin
 */
export default {
  data () {
    return {
      pageLoading: false
    }
  },
  mounted () {
    // 第一次挂载完成时，给search赋值
    this.table.search = {}
  },
  computed: {
    // 分页信息
    pageInfo (value) {
      const pageInfo = this.table.info
      return { pageSize: pageInfo.pageSize, pageIndex: pageInfo.pageIndex }
    },
    // 全部搜索条件
    allParam (value) {
      return { ...this.pageInfo, ...this.form }
    }
  },
  methods: {
    /** 分页显示页数变化监听 */
    handleSizeChange (options) {
      this.fetch(options)
    },
    /** 当前页数变化监听 */
    handleCurrentChange (options) {
      this.pageLoading = true
      this.fetch(options)
    },
    /** 删除时重置allParam，当是最后一页且删除条数等于剩余条数时将pageIndex减1 */
    resetAllParam (deleteNum = 1) {
      const pageInfo = this.table.info

      const leftPage = this.table.total % pageInfo.pageSize

      if (leftPage === deleteNum && this.judgeIsLastPage(pageInfo)) {
        this.allParam.pageIndex = pageInfo.pageIndex - 1 || 1
      }
    },
    /** 判断是否是最后一页 */
    judgeIsLastPage (pageInfo) {
      return (pageInfo.prev + 1) === pageInfo.last
    },
    /** 重置搜索条件 */
    reset () {
      Object.keys(this.form).map(item => {
        this.form[item] = ''
      })
      this.form = Object.assign(this.form, {beginDate: null, endDate: null})
    },
    /** 执行搜索方法 */
    search () {
      this.pageLoading = true
      this.table.search = { ...this.form }
    },
    /** 行点击事件 */
    rowClickHandler ({ rowClickHandler }, row) {
      rowClickHandler(row)
    },
    /** 表格选取事件 */
    selectionChangeHandler ({ selectionChangeHandler }, selection) {
      selectionChangeHandler(selection)
    }
  }
}
