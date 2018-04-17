<template>
  <el-container>
    <el-main>
      <main class="home-main" :style="containerStyle">
        <feature-card ref="featureCard"></feature-card>
        <aside :style="asideStyle">
          <schedule-card :list="todoList" :style="asideStyle"/>
          <task-list :task="task"/>
        </aside>
      </main>
      <i-footer></i-footer>
    </el-main>
  </el-container>
</template>

<script>
// const data = require('./mock-data')
import req from 'api/common/home'
import FeatureCard from './feature-card'
import ScheduleCard from './schedule-card'
import TaskList from './task-list'
import IFooter from 'components/common/i-footer/i-footer'

export default {
  components: {
    FeatureCard,
    ScheduleCard,
    TaskList,
    IFooter
  },

  data () {
    return {
      todoList: [],
      // ...data,
      task: '',
      headerHeight: 0
    }
  },

  computed: {
    containerStyle () {
      return {
        padding: '15px 15px 0 15px',
        minHeight: window.innerHeight - 60 - 30 + 'px'
      }
    },
    asideStyle () {
      this.$nextTick(() => {
        this.headerHeight = this.$refs.featureCard.$el.offsetHeight
      })
      return {
        minHeight: window.innerHeight - this.headerHeight - 90 + 'px'
      }
    }
  },

  methods: {
    getTodoList () {
      return req('getTodoList', {status: 0, type: 1}).then(data => {
        this.todoList = data.data
      })
    },
    // 获取任务跟踪消息
    getTaskFollowData () {
      req('getTaskFollowData')
      .then(res => {
        this.task = res.content
      })
    }
  },

  created () {
    this.getTodoList()
    this.getTaskFollowData()
  }
}
</script>

<style lang="scss" scoped>
.el-main {
  padding: 0;
}
.home-main {
  aside {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
