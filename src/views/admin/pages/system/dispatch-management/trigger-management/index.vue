<template>
  <div>
    <i-layout>
      <trigger-search slot="header" @search="search" v-if="accessMap.sysSchedulerTriggerQuery"/>
      <div slot="section">
        <i-table
          :table="table"
          @pageIndexChange="handleCurrentChange"
          @pageSizeChange="handleSizeChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              ref="multipleTable"
              :data="tableScope.clone"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              v-loading="loading2"
              :element-loading-text="$loadingText"
              >
              <el-table-column
                type="selection"
                fixed="left"
                show-overflow-tooltip
              />
              <el-table-column
                v-for="col of table.columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :formatter="tableScope.formatter"
                align="center"
                show-overflow-tooltip
              />
              <i-table-operator :table="tableScope"></i-table-operator>
              <!-- <el-table-column
                label="操作"
                align="center"
                fixed="right"
                width="250">
                <template slot-scope="scope">
                  <el-button @click="modify(scope)" type="text" size="small">修改</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>

     <!-- 新建任务弹窗 -->
    <new-trigger-dialog ref="newTriggerDialog" @submit="reloadList" />

  </div>
</template>

<script>
  import req from 'api/system/dispatch-management'
  import NewTriggerDialog from 'components/system/dispatch-management/dialog/new-trigger-dialog'
  import TriggerSearch from 'components/system/dispatch-management/search/trigger-search'
  import access from 'mixins/access'
  // import moment from 'moment'
  export default {
    components: {
      TriggerSearch,
      NewTriggerDialog
    },
    mixins: [access],
    data () {
      return {
        loading2: true,
        multipleSelection: [],
        // 表格的配置
        table: {
          columns: [
            { prop: 'name', label: '触发器名称' },
            { prop: 'type', label: '触发器类型' },
            { prop: 'startTime', label: '生效时间', display: { date: 'default' } },
            { prop: 'endTime', label: '失效时间', display: { date: 'default' } },
            { prop: 'description', label: '描述' },
            { prop: 'createdBy', label: '创建人' },
            { prop: 'creationDate', label: '创建时间', display: { date: 'default' } }
          ],
          data: null,
          showPagebar: true,
          total: 0,
          info: null,
          search: null,
          setting: {
            toolbar: [
              {
                text: '新增',
                key: 'sysSchedulerTriggerAdd',
                func: () => this.newTrigger()
              },
              {
                text: '删除',
                key: 'sysSchedulerTriggerDelete',
                type: 'danger',
                func: () => this.deleteTrigger()
              }
            ],
            operator: [
              {
                text: '修改',
                key: 'sysSchedulerTriggerUpdate',
                func: this.modify     // 与 toolbar 类似，在 func 绑定相应的方法
              }
            ]
          }
        },
        // 已选择的触发器ID数组
        checkedTriggers: null
      }
    },
    mounted () {
      this.table.search = {}
    },
    methods: {
      // 跳转到新建页面
      newTrigger () {
        this.$refs.newTriggerDialog.openDialog(true)
      },
      // 删除
      deleteTrigger () {
        if (this.multipleSelection.length < 1) {
          this.$message('请选择需要删除的触发器')
        } else {
          let params = { ids: this.checkedTriggers.join(',') }
          this.$confirm('此操作将永久删除任务, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            req('deleteTrigger', params).then(res => {
              if (res) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.reloadList()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      // 跳转到修改页面
      modify (row) {
        this.$refs.newTriggerDialog.openDialog(true, row)
      },
      // 每页展示多少条数据
      handleSizeChange (params) {
        this.loading2 = true
        this.fetch(params)
      },
      // 获取置顶页数数据
      handleCurrentChange (params) {
        this.loading2 = true
        this.fetch(params)
      },
      // 高级搜索
      fetch (params = {}) {
        // this.loading = true
        // 获取触发器
        req('getTriggerList', params).then(data => {
          // this.loading = false
          this.table = Object.assign(this.table, data)
          this.loading2 = false
        }).catch(e => {
          // this.loading = false
          this.loading2 = false
        })
      },
      // 刷新列表
      reloadList () {
        this.table.search = {}
      },
      // 监听多选
      handleSelectionChange (val) {
        this.multipleSelection = val
        this.checkedTriggers = val.map(obj => {
          return obj.id
        })
      },
      // 搜索内容
      search (params = {}) {
        // 过滤，拼接参数
        this.table.search = { ...params }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
