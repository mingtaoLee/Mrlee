<template>
  <i-dialog
      :title="title"
      v-model="isDialogVisible"
      :toolbar="toolbar"
      destroyedWhenClose
      size="large"
  >
    <i-table
      v-if="table.columns.length"
      :table="table"
      @pageIndexChange="handleCurrentChange"
      @pageSizeChange="handleSizeChange"
    >
      <template slot="table" slot-scope="tableScope">
        <el-table :data="tableScope.clone" v-loading="loading" :element-loading-text="$loadingText" style="width: 100%">
          <el-table-column
            v-for="(col, index) of table.columns"
            :key="index"
            :prop="col.prop"
            :label="col.label"
            :formatter="tableScope.formatter"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </template>
    </i-table>
  </i-dialog>
</template>

<script>
import req, {config} from 'api/info-center'
import reqCu from 'api/info-center/customize-inquiry'
import {clone} from 'utils/index'

export default {
  name: 'InquiryResultDialog',
  components: {
  },
  data () {
    return {
      // 查询的ID
      inquiryID: '',
      // 加载状态
      loading: false,
      // 当前点击查看是在表格操作行里的查询还是在模态框里面点击的直接查询按钮（false=在表格操作行的查询）
      queryType: '',
      // 当前模态框所处理的业务的名称（是新增，复制，查看，还是修改）
      handleName: '',
      handleObj: {},
      // i-dialog的设置
      title: '查询结果',
      isDialogVisible: false,
      toolbar: [
        {
          text: '确定',
          type: 'primary',
          hide: false,
          func: done => {
            done()
          }
        }
      ],
      // i-table的设置
      table: {
        columns: [],
        data: null,
        showPagebar: true,
        search: null,
        total: 0,
        info: null,
        dev: true,
        setting: {
          export: {
            text: '导出结果',
            show: () => {
              if (this.table.data == null || !this.table.data.length) {
                return {empty: true}
              }
            },
            req: config.getInquiryTable,
            param: () => ({msgQueryId: this.inquiryID})
          }
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    // 打开弹框
    openDialog (isOpen, scope, queryType, handleName) {
      // 解决窗口打开后按enter和space莫名其妙的调用此函数问题
      if (isOpen && this.isDialogVisible) return
      this.initDialog()
      this.isDialogVisible = isOpen
      this.queryType = queryType
      this.handleName = handleName
      if (queryType === 'operate' || handleName === 'check') {
        if (queryType === 'operate') {
          this.inquiryID = scope
        } else {
          this.inquiryID = scope.bodyName.msgQueryId
        }
        this.getTableTitle()
      } else {
        this.inquiryID = scope.bodyName.msgQueryId
        this.table.columns = clone(scope.titleName)
        this.table.columns.map(item => {
          item.prop = item.id
          if (item.componentType === '04') {
            item.display = {date: ''}
          }
          return item
        })
        this.handleObj = clone(scope.bodyName)
        this.$nextTick(() => {
          this.table.search = {}
        })
      }
    },
    // 监测页数变化
    handleCurrentChange (params) {
      this.fetch(params)
    },
    // 监测每页页数变化
    handleSizeChange (params) {
      this.fetch(params)
    },
    // 获取表头
    getTableTitle () {
      this.loading = true
      let params = {msgQueryId: this.inquiryID}
      req('getInquiryTableHead', params).then(res => {
        if (Array.isArray(res) && !res.length) {
          this.loading = false
          this.$message({type: 'warning', message: '该条查询无数据！'})
          return
        }
        let col = res.map(obj => {
          obj.prop = obj.titleKey
          obj.label = obj.titleValue
          if (obj.dictCode) {
            obj.display = {dict: obj.dictCode}
          }
          if (obj.componentType === '04') {
            obj.display = {date: ''}
          }
          return obj
        })
        this.table.columns.push(...col)
        // 请求到表头后请求表格内容
        this.$nextTick(() => {
          this.table.search = {}
        })
      })
      // .catch(() => {
      //   this.loading = false
      //   this.$message({type: 'error', message: '获取查询结果失败，请重试！'})
      // })
    },
    // 获取表格内容
    fetch (params = {}) {
      this.loading = true
      if (this.queryType === 'direct' && this.handleName !== 'check') {
        if (this.handleObj.msgQueryId) {
          params.msgQueryId = this.handleObj.msgQueryId
        }
        params.groups = this.handleObj.groups
        params.infColumnIds = this.handleObj.infColumnIds
        reqCu('buttonCheckQuery', params).then(res => {
          this.table = Object.assign(this.table, res)
          this.loading = false
        }).catch((res) => {
          this.loading = false
          this.$message({type: 'error', message: res.message})
        })
      } else {
        params.msgQueryId = this.inquiryID
        req('getInquiryTable', params).then(res => {
          this.table = Object.assign(this.table, res)
          this.loading = false
        })
        // .catch(() => {
        //   this.loading = false
        //   this.$message({type: 'error', message: '获取查询结果失败，请重试！'})
        // })
      }
    },
    // 关闭弹窗前的处理方法
    handleClose (done) {
      done()
    },
    // 初始化dialog
    initDialog () {
      this.inquiryID = ''
      this.queryType = ''
      this.table.columns.length = 0
      this.table.data = null
      this.table.total = 0
      // this.table.info = null
      // this.table.search = null
    }
  }
}
</script>
