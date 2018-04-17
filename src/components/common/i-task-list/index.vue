<template>
  <div class="wrap" :style="wrapStyle">
    <div class="task" v-for="item of taskList" :key="item" @click.stop="showTaskInfo(item.exportFileId)">
      <div class="fileName">{{taskType(item.type)}}{{item.fileName}}</div>
      <div class="info">
        <span class="time">{{handlerCreateDate(item.createDate)}}</span>
        <span class="statuText" :style="statuTextColor(item.status)">{{handlerStatu(item.status)}}</span>
      </div>
    </div>
    <i-task ref="taskDialog"></i-task>
  </div>
</template>

<script>
import ITask from '../i-task'
import moment from 'moment'
export default {
  name: 'ITaskList',
  components: {
    ITask
  },

  props: {
    // 任务列表数据
    taskList: {
      default: [],
      type: Array
    },
    // 任务列表popover弹出框显示任务条数
    taskNumber: {
      default: 6,
      type: Number
    }
  },

  computed: {
    wrapStyle () {
      return {height: this.taskNumber * 70 + 'px'}
    }
  },

  methods: {
    // 弹出下载弹窗
    showTaskInfo (exportFileId) {
      this.$refs['taskDialog'].openDialog(exportFileId)
    },
    // 下载状态转换
    handlerStatu (statu) {
      let statuText = '未完成'
      statu === 1 && (statuText = '已完成')
      statu === 2 && (statuText = '正在进行中')
      statu === 3 && (statuText = '失败')
      return statuText
    },
    // 处理任务列表任务创建时间
    handlerCreateDate (time) {
      const data = moment(time).format('YYYY-MM-DD HH:mm:ss')
      return data
    },
    // 根据状态设置状态文字的颜色
    statuTextColor (statu) {
      let fontColor = ''
      statu === 1 && (fontColor = '#6CC60A')
      statu === 2 && (fontColor = '#F8A82B')
      statu === 3 && (fontColor = '#f31a1a')
      return {color: fontColor}
    },
    // 任务名称增加任务类型taskType
    taskType (data) {
      if (data === 1) return '导入'
      if (data === 2) return '导出'
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  overflow: auto;
  .task {
    border-bottom: 1px solid #f1f1f1;
    padding: 10px 15px;
    height: 60px;
    box-sizing: border-box;
    cursor: pointer;
    .fileName {
      font-size: 14px;
      color: #333;
      line-height: 20px;
      height: 20px;

    }
    .info {
      margin-top: 2px;
      padding: 0;
      font-size: 12px;
      line-height: 17px;
      height: 17px;
      display: flex;
      justify-content: space-between;
      .time {
        color: #959595;
      }
    }
  }
  .task:hover {
    background: #F5F8FD;
  }
}
</style>
