<template>
  <div class="wrap">
    <div class="base">
      <h1>
        <i class="el-icon-back goBackIcon" @click="goBack"></i>
        <span>查询结果</span>
      </h1>
    </div>
    <i-layout>
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
                v-for="col of table.columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :formatter="tableScope.formatter"
                align="center"
                show-overflow-tooltip
              />
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>
  </div>
</template>

<script>
  import req from 'api/system/dispatch-management'
  import NewTaskDialog from 'components/system/dispatch-management/dialog/new-task-dialog'
  import TaskSearch from 'components/system/dispatch-management/search/task-search'
  // import moment from 'moment'
  export default {
    components: {
      NewTaskDialog,
      TaskSearch
    },
    data () {
      return {
        loading2: true,
        // 表格的配置
        table: {
          columns: [
            { prop: 'startTime', label: '开始时间', display: { date: 'long' } },
            { prop: 'endTime', label: '结束时间', display: { date: 'long' } },
            { prop: 'result', label: '结果' },
            { prop: 'executeType', label: '触发方式' },
            { prop: 'message', label: '异常信息', width: 300 }
          ],
          data: null,
          showPagebar: true,
          total: 0,
          info: null,
          search: null
        },
        // 查看的任务id
        queryID: ''
      }
    },
    mounted () {
      this.table.search = {}
    },
    methods: {
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
      fetch (params = {}) {
        // this.loading = true
        this.queryID = this.$route.query.id
        params.id = this.queryID
        // 获取任务
        req('getExecuteRecord', params)
          .then(data => {
            // this.loading = false
            this.table = Object.assign(this.table, data)
            this.loading2 = false
          })
          .catch(e => {
            // this.loading = false
            this.loading2 = false
          })
      },
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  // .title{
  //   padding: 10px;
  //   font-size: 16px;
  //   background-color: #e5e5e5;
  // }
  .base {
  width: 100%;
  height: 50px;
  background: #FFFFFF;
  font-size: 18px;
  line-height: 50px;
  i {
    display: inline-block;
    padding: 0 20px;
    cursor: pointer;
  }
  i:hover{
    color: #409EFF;
  }
  span {
    display: inline-block;
    border-left: 1px solid #ccc;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
  }
}
</style>
