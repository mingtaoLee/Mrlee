<template>
  <div class="wrap">
    <i-layout headerKey="CustomQuery">
      <!-- 搜索部分 -->
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="查询方案">
            <el-input v-model.trim="searchBox.queryName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="共享状态">
            <i-select v-model="searchBox.shareStatus" parameter="WHETHER_TYPE"></i-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker 
              v-model="searchBox.createDate" 
              type="date"
            ></el-date-picker>
          </el-form-item>
        </i-form>
      </div>

      <!-- 表格 -->
      <i-table
        slot="section"
        :table="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            v-loading="inquiryLoading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" fixed="left" show-overflow-tooltip></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
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
            <i-table-operator :table="tableScope" width="250">
            </i-table-operator>
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
  import AddedInquireDialog from 'views/admin/pages/info-center/components/added-inquire-dialog'
  import reqCu from 'api/info-center/customize-inquiry'
  import InquiryResultDialog from '../components/inquiry-result-dialog'
  import req from 'api/info-center'
  import moment from 'moment'

  export default {
    name: 'CustomizeInquiry',
    components: {
      AddedInquireDialog,
      InquiryResultDialog
    },
    data () {
      return {
        // 表格加载的初始状态
        inquiryLoading: false,
        // 搜索条件对象
        searchBox: {
          queryName: '',
          shareStatus: '',
          createDate: ''
        },
        // 所勾选的查询名称的id的集合
        msgQueryIDS: null,
        table: {
          columns: [
            { prop: 'queryName', label: '查询方案' },
            {prop: 'shareStatus', label: '是否共享', display: { dict: 'WHETHER_TYPE' }},
            {prop: 'createDate', label: '创建时间', display: {date: ''}}
          ],
          setting: {
            toolbar: [
              {
                text: '新增',
                type: 'primary',
                key: 'CustomQueryCreate',
                func: this.addQuery
              }, {
                text: '收藏',
                type: 'primary',
                key: 'CustomQueryCollec',
                func: this.inquiryCollect
              }, {
                text: '共享',
                type: 'primary',
                key: 'CustomQueryShare',
                func: this.inquiryShare
              }, {
                text: '删除',
                type: 'danger',
                key: 'CustomQueryDel',
                func: this.inquiryDelete
              }, {
                text: '取消共享',
                type: 'plain',
                key: 'CustomQueryUnShare',
                func: this.inquiryUnShare
              }
            ],
            editor: {
              queryName: {
                type: 'button',
                func: row => { this.inquirySee(row) }
              }
            },
            operator: [{
              text: '复制',
              type: 'primary',
              key: 'CustomQueryCopy',
              func: row => this.inquiryClone(row)
            }, {
              text: '查询',
              key: 'CustomQueryRun',
              func: this.inquiry
            }, {
              text: '修改',
              type: 'primary',
              key: 'CustomQueryUpdate',
              func: row => this.inquiryModify(row)
            }]
          },
          data: null,
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        }
      }
    },
    mounted () {
      this.table.search = {}
    },
    methods: {
      // 将获取数据的函数捆绑在监听页数的回调中
      handleSizeChange (options) {
        this.fetch(options)
      },
      // 将获取数据的函数捆绑在监听页面大小的回调中
      handleCurrentChange (options) {
        this.fetch(options)
      },
      // 获取后台的表格数据
      fetch (options = {}) {
        this.inquiryLoading = true
        reqCu('getCustomInquiry', options).then(res => {
          console.log(res)
          this.inquiryLoading = false
          if (res) {
            this.table = Object.assign(this.table, res)
          }
        }
        )
      },
      // 勾选选择的表格项
      handleSelectionChange (val) {
        console.log(val)
        this.msgQueryIDS = val.map(obj => obj.msgQueryId)
      },
      // 重置搜索框
      reset () {
        Object.keys(this.searchBox).map(key => {
          this.searchBox[key] = null
        })
      },
      // 高级搜索
      search () {
        if (this.searchBox.createDate) {
          this.searchBox.createDate = moment(this.searchBox.createDate).format('YYYY-MM-DD HH:mm:ss')
        }
        let params = this.searchBox
        this.table.search = {...params}
      },
      // 新增查询按钮
      addQuery () {
        this.$refs.addedInquireDialog.openDialog(true)
      },
      // 收藏按钮
      inquiryCollect () {
        this.handleCollect()
      },
      // 共享按钮
      inquiryShare () {
        this.handleShare('共享')
      },
      // 取消共享按钮
      inquiryUnShare () {
        this.handleShare('取消共享')
      },
      // 删除按钮
      inquiryDelete () {
        if ((!this.msgQueryIDS) || (this.msgQueryIDS.length === 0)) {
          this.$message.warning('请先选择要删除的查询！')
        } else {
          this.$confirm('确定要进行删除操作吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {msgQueryIds: this.msgQueryIDS.join(',')}
            reqCu('deleteInquiry', params).then(res => {
              console.log(res)
              if (res) {
                this.$message.success('删除成功!')
                this.reload()
              }
            })
          }).catch(() => {
            console.log('已取消！')
          })
        }
      },
      // 表格里的查看按钮
      inquirySee (row) {
        console.log(row)
        this.$refs.addedInquireDialog.openDialog(true, row, 'check')
      },
      // 操作里的复制按钮
      inquiryClone (row) {
        this.$refs.addedInquireDialog.openDialog(true, row, 'clone')
      },
      // 操作里的查询按钮
      inquiry (row) {
        this.$refs.inquiryResult.openDialog(true, row.msgQueryId, 'operate')
      },
      // 操作里的修改按钮
      inquiryModify (row) {
        this.$refs.addedInquireDialog.openDialog(true, row, 'modify')
      },
      // 收藏的函数
      handleCollect () {
        if ((!this.msgQueryIDS) || (this.msgQueryIDS.length === 0)) {
          this.$message.warning(`请先选择要收藏的查询！`)
        } else {
          this.$confirm(`确定要进行收藏操作吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = this.msgQueryIDS
            req('addCollection', params).then(res => {
              console.log(res)
              if (res) {
                this.$message.success('收藏成功!')
                this.reload()
              }
            })
          }).catch(() => {
            console.log('已取消！')
          })
        }
      },
      // 共享，取消共享的公共函数
      handleShare (val) {
        if ((!this.msgQueryIDS) || (this.msgQueryIDS.length === 0)) {
          this.$message.warning(`请先选择要${val}的查询！`)
        } else {
          this.$confirm(`确定要进行${val}操作吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = this.msgQueryIDS
            if (val === '共享') {
              reqCu('addInquiryShare', params).then(res => {
                console.log(res)
                if (res) {
                  this.$message.success('共享成功!')
                  this.reload()
                }
              })
            } else {
              reqCu('cancelInquiryShare', params).then(res => {
                console.log(res)
                if (res) {
                  this.$message.success('取消共享成功!')
                  this.reload()
                }
              })
            }
          }).catch(() => {
            console.log('已取消！')
          })
        }
      },
      // 刷新页面
      reload () {
        this.table.search = {}
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
