<template>
  <div class="wrap">
    <i-layout>
      <task-search slot="header" @search="search" v-if="accessMap.sysSchedulerJobQuery"/>
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
              >
              </el-table-column>
              <i-table-operator :table="tableScope"></i-table-operator>
              <!-- <el-table-column
                label="操作"
                align="center"
                fixed="right"
                width="250">
                <template slot-scope="scope">
                  <el-button @click="exec(scope)" type="text" size="small">手动执行</el-button>
                  <el-button @click="modify(scope)" type="text" size="small">修改</el-button>
                  <el-button @click="check(scope)" type="text" size="small">查看任务历史</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>

    <!-- 新建任务弹窗 -->
    <new-task-dialog ref="newTaskDialog" @submit="reloadList" @addOver="handlerAddOver" @editorOver="handlerEditorOver" />

  </div>
</template>

<script>
  import req from 'api/system/dispatch-management'
  import NewTaskDialog from 'components/system/dispatch-management/dialog/new-task-dialog'
  import TaskSearch from 'components/system/dispatch-management/search/task-search'
  import ITableOperator from 'components/common/i-table-operator'
  import access from 'mixins/access'
  // import moment from 'moment'
  export default {
    name: 'TaskManagement',

    components: {
      NewTaskDialog,
      TaskSearch,
      ITableOperator
    },
  
    mixins: [access],

    data () {
      return {
        loading2: true,
        // 记录选择的条数
        multipleSelection: [],
        // 表格的配置
        table: {
          columns: [
            { prop: 'name', label: '任务名称' },
            { prop: 'status', label: '任务状态' },
            // { prop: 'type', label: '任务' },
            { prop: 'executor', label: 'RPC名称' },
            { prop: 'description', label: '描述' },
            { prop: 'createdBy', label: '创建人' },
            { prop: 'creationDate', label: '创建时间', display: { date: 'default' } }
          ],
          setting: {
            toolbar: [
              {
                text: '新增',
                key: 'sysSchedulerJobAdd',
                func: () => this.newTask()
              },
              {
                text: '删除',
                key: 'sysSchedulerJobDelete',
                type: 'danger',
                func: () => this.deleteTask()
              },
              {
                text: '暂停',
                key: 'sysSchedulerJobPause',
                type: 'danger',
                func: () => this.pauseTask()
              },
              {
                text: '恢复',
                key: 'sysSchedulerJobResume',
                type: 'primary',
                func: () => this.resumeTask()
              }
            ],
            operator: [
              {
                text: '手动执行',
                key: 'sysSchedulerJobExecute',
                func: this.exec,     // 与 toolbar 类似，在 func 绑定相应的方法
                show: null
              },
              {
                text: '修改',
                key: 'sysSchedulerJobUpdate',
                func: this.modify     // 与 toolbar 类似，在 func 绑定相应的方法
              },
              {
                text: '查看任务历史',
                key: 'sysSchedulerJobRecordsGet',
                func: this.check    // 与 toolbar 类似，在 func 绑定相应的方法
              }
            ]
          },
          data: null,
          showPagebar: true,
          total: 0,
          info: null,
          search: null
        },
        // 已选择的任务ID数组
        checkedTasks: null
      }
    },
    mounted () {
      this.table.search = {}
    },
    methods: {
      // 新增弹框关闭之后主页面刷新数据
      handlerAddOver () {
        this.loading2 = true
        this.fetch({pageIndex: 1, pageSize: this.table.info.pageSize})
      },
      // 主页面修改之后主页面刷新数据
      handlerEditorOver () {
        this.loading2 = true
        this.fetch(this.table.info)
      },
      // 跳转到新建页面
      newTask () {
        this.$refs.newTaskDialog.openDialog(true)
      },
      // 删除
      deleteTask () {
        if (this.multipleSelection.length < 1) {
          this.$message('请选择需要删除的任务')
        } else {
          let params = { ids: this.checkedTasks.join(',') }
          this.$confirm('此操作将永久删除任务, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            req('deleteTask', params).then(res => {
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
      // 暂停任务
      pauseTask () {
        if (this.multipleSelection.length < 1) {
          this.$message('请选择需要暂停的任务')
        } else {
          this.$confirm('确定要暂停选中的任务吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            req('pauseTask', this.checkedTasks).then(res => {
              if (res) {
                this.$message({
                  message: '暂停任务成功',
                  type: 'success'
                })
                this.reloadList()
              }
            })
          })
        }
      },
      // 恢复任务
      resumeTask () {
        if (this.multipleSelection.length < 1) {
          this.$message('请选择需要恢复的任务')
        } else {
          this.$confirm('确定要恢复选中的任务吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            req('resumeTask', this.checkedTasks).then(res => {
              if (res) {
                this.$message({
                  message: '恢复任务成功',
                  type: 'success'
                })
                this.reloadList()
              }
            })
          })
        }
      },
      // 跳转到修改页面
      modify (row) {
        this.$refs.newTaskDialog.openDialog(true, row)
      },
      // 手动执行
      exec (row) {
        this.table.setting.operator[0].show = () => { return {disable: true} }
        req('executeTask', {id: row.id}).then((res) => {
          if (res) {
            this.$message({
              message: '任务执行成功',
              type: 'success'
            })
            this.table.setting.operator[0].show = () => { return {disable: false} }
          }
        }).catch(() => {
          this.table.setting.operator[0].show = () => { return {disable: false} }
        })
      },
      // 查看历史纪录
      check ({id}) {
        this.$router.push({
          path: 'check_task_history',
          query: {id}
        })
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
        // 获取任务
        req('getTaskList', params)
          .then(data => {
            // this.loading = false
            this.table.data = data.data
            this.table.total = data.total
            this.table.info = data.info
            this.loading2 = false
          })
          .catch(e => {
            // this.loading = false
            this.loading2 = false
          })
      },
      // 搜索内容
      search (params = {}) {
        this.table.search = { ...params }
      },
      // 监测多选项
      handleSelectionChange (val) {
        this.multipleSelection = val
        this.checkedTasks = val.map(obj => {
          return obj.id
        })
      },
      // 刷新列表
      reloadList () {
        this.table.search = {}
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
