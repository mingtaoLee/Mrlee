<template>
  <header class="self-header">
      <div class="header-container flex-space-between">
        <!-- <router-link class="brand" to="/"></router-link> -->
        <a class="brand" href="/"></a>
        <div class="nav-side">
          <slot name="navbar" class="navbar"><em></em></slot>
        </div>
        <div class="link">
          <!-- <a href="javascript:void(0)"><i class="iconfont icon-search-o  iconSearch"></i></a> -->
          <em v-if="showEm">|</em>
          <slot name="link" class="flow-link">
            <router-link class="flow-link" to="/flow">流程中心</router-link>
          </slot>
          <!-- <a href="/flow.html" class="flow-link">流程中心</a> -->
          <em v-if="showEm">|</em>
          <el-popover
            class="taskList"
            ref="taskList"
            placement="bottom"
            width="300"
            :visible-arrow="true"
            trigger="hover"
            @show="refreshTaskLIst()">
            <i slot="reference" class="iconfont icon-checklist iconChecklist"></i>
            <i-task-list
              :taskList="taskList"
              :taskNumber="6"
              v-loading="taskListLoading"
              :element-loading-text="$loadingText"></i-task-list>
            <p v-if="weatherShowNoTask" class="noTask">暂无任务</p>
          </el-popover>
          <el-popover
            ref="popHeader"
            placement="bottom"
            width="160"
            :visible-arrow="true"
            trigger="hover">
            <i slot="reference" class="iconfont icon-user-c iconfontUser"></i>
            <user-dropdown :waiting-for-handle-info-number="waitingForHandleInfoNumber"></user-dropdown>
          </el-popover>
        </div>
      </div>
  </header>
</template>

<script>
import UserDropdown from './user-dropdown.vue'
import ITaskList from '../i-task-list'
import req from 'api/common/home'
export default {
  name: 'IHeader',
  props: {
    autoSize: {
      type: Boolean,
      default: true
    },
    // 记录代办消息条数
    waitingForHandleInfoNumber: {
      // type: Number,
      default: 0
    },
    homeLink: {
      type: String,
      default: '/'
    },
    showEm: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 任务列表数据
      taskList: [],
      taskListLoading: true,
      weatherShowNoTask: false
    }
  },
  components: {
    UserDropdown,
    ITaskList
  },
  methods: {
    // 请求任务列表数据
    getExportTaskList () {
      req('getExportTaskList')
      .then(res => {
        this.taskList = res
        !this.taskList.length && (this.weatherShowNoTask = true)
        this.taskListLoading = false
      })
    },
    // 刷新任务列表数据
    refreshTaskLIst () {
      // this.weatherShowNoTask = false
      this.showTaskListLoading()
      this.getExportTaskList()
    },
    showTaskListLoading () {
      this.taskListLoading = true
      this.taskList = []
      this.weatherShowNoTask = false
    }
  },
  created () {
    this.getExportTaskList()
  }
}
</script>

<style lang="scss" scoped>
.self-header {
  height: 60px;
  padding: 0;
  z-index: 9;
  background:  #28283C;
  border: 0 solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 0 1px 0 rgba(0,0,0,0.10);
  overflow-x: hidden;

  .header-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    margin-left: 21px;
  }

  .brand, .link {
    color: #A8A8C3;
  }
  .nav-side{
    flex: 2 2 auto;
    display: flex;
    justify-content: flex-start;
  }
  .brand {
    flex: 0 0 118px;
    background: url(../../../assets/images/logo-g.png) center no-repeat;
    background-size: contain;
    width: 118px;
    height: 32px;
    display: inline-block;
  }
  .link {
    display: flex;
    justify-content: space-between;
    min-width: 157.1px;
    height: 28px;
    align-items: center ;
  }
  .iconSearch{
    font-size: 20px;
    line-height: 60px;
  }
  .iconfontUser{
    font-size: 28px;
    line-height: 31px;
    color:  #A7B3C4;
  }
  .iconChecklist {
    font-size: 24px;
    line-height: 27px;
    color:  #A7B3C4;
  }
  .flow-link{
    width: 48px;
  }
  .container{
    .link {
      padding-right: 0;
    }
  }
  .taskList {
    margin: 0px 6px;
  }
}
.noTask {
  text-align: center;
  height: 60px;
  line-height: 60px;
  font-size: 13px;
  color: #333;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 100%;
  font-family: HelveticaNeue Regular,PingFangSC-Regular,Helvetica,Arial,sans-serif;
  letter-spacing: 1px;
}
</style>

