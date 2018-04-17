<template>
  <div class="wrap">
    <i-layout headerKey="CollectionQuery">
      <inquiry-search slot="header" @search="search"></inquiry-search>
      <i-table
        slot="section"
        :table="table"
        @pageIndexChange="handleCurrentChange"
        @pageSizeChange="handleSizeChange"
        >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            v-loading="collectLoading"
            :element-loading-text="$loadingText"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            >
            <el-table-column
              type="selection"
              fixed="left"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              v-for="col of table.columns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              :formatter="tableScope.formatter"
              :align="col.align"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <i-table-cell :row="scope.row" :col="col.prop" :table="tableScope"></i-table-cell>
              </template>
            </el-table-column>
            <i-table-operator :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
    </i-layout>

    <!--复制，查看的模态框-->
    <added-inquire-dialog ref="addedInquireDialog" @submit="reload"></added-inquire-dialog>

    <!-- 查看查询弹窗 -->
    <inquiry-result-dialog ref="inquiryResult"></inquiry-result-dialog>
  </div>
</template>

<script>
import reqCol from 'api/info-center/collect-inquiry'
import InquirySearch from '../components/inquiry-search'
import InquiryResultDialog from '../components/inquiry-result-dialog'
import AddedInquireDialog from 'views/admin/pages/info-center/components/added-inquire-dialog'

export default {
  name: 'CollectInquiry',
  components: {
    InquirySearch,
    InquiryResultDialog,
    AddedInquireDialog
  },
  data () {
    return {
      // 表格加载的初始状态
      collectLoading: false,
      // i-table配置项
      table: {
        columns: [
          { prop: 'queryName', label: '查询名称' },
          { prop: 'createBy', label: '创建者' },
          { prop: 'createDate', label: '收藏时间', display: { date: 'long' } }
        ],
        data: null,
        showPagebar: true,
        total: 0,
        info: null,
        dev: true,
        search: null,
        setting: {
          toolbar: [
            {
              text: '取消收藏',
              type: 'primary',
              key: 'CollectionQueryUnCollec',
              func: this.cancelCollection
            }
          ],
          operator: [
            {
              text: '复制',
              key: 'CollectionQueryCopy',
              func: row => this.copy(row)
            },
            {
              text: '查询',
              key: 'CollectionQueryRun',
              func: this.inquiry
            }
          ],
          editor: {
            queryName: {
              type: 'button',
              func: row => { this.checkDetail(row) }
            }
          }
        }
      },
      // 选中的查询id集合
      checkedInquiries: null
    }
  },

  mounted () {
    this.table.search = {}
  },

  methods: {
    // 每页展示数据数
    handleSizeChange (params) {
      this.fetch(params)
    },
    // 页数变化
    handleCurrentChange (params) {
      this.fetch(params)
    },
    search (params = {}) {
      this.table.search = {...params}
    },
    // 获取收藏查询列表
    fetch (params = {}) {
      this.collectLoading = true
      reqCol('getCollection', params).then(res => {
        this.collectLoading = false
        this.table = Object.assign(this.table, res)
      })
    },
    // 复制查询
    copy (row) {
      console.log(row)
      this.$refs.addedInquireDialog.openDialog(true, row, 'clone')
    },
    // 查看查询
    inquiry (scope) {
      // 打开查看查询弹窗
      this.$refs.inquiryResult.openDialog(true, scope.msgQueryId, 'operate')
    },
    // 监听多选
    handleSelectionChange (item) {
      this.checkedInquiries = item.map(obj => obj.msgCollectId)
    },
    // 取消收藏
    cancelCollection () {
      if (this.checkedInquiries == null || this.checkedInquiries.length === 0) {
        this.$message({type: 'warning', message: '请勾选要取消收藏的记录！'})
        return
      }
      let params = this.checkedInquiries
      this.$confirm('确定要取消选中的收藏吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reqCol('cancelCollection', params).then(res => {
          if (res) {
            this.$message({type: 'success', message: '取消收藏成功！'})
            this.reload()
          }
        }).catch(() => {
          this.$message({type: 'error', message: '取消收藏失败，请重试！'})
        })
      })
    },
    // 查看查询详情
    checkDetail (row) {
      this.$refs.addedInquireDialog.openDialog(true, row, 'check')
    },
    // 刷新列表
    reload () {
      this.table.search = {}
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
