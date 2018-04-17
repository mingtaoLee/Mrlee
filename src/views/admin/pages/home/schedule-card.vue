<template>
  <section class="schedule-list list-card card">
    <header>
      <h3>我的待办</h3>
      <a href="/#/watingForHandleInfo" target="_blank" class="more">更多</a>
    </header>

    <section class="schedule-nav">
        <el-row class="item" v-for="(item, index) of list" :key="index">
          <el-col class="todo-text" :span="10">
            <div class="todo-text-content" @click="showInfo(item)">{{item.todoText}}</div>
          </el-col>
          <el-col class="todo-person" :span="10">
            <span>申请人：{{item.sendUser}}</span>
          </el-col>
          <el-col :span="4" class="date">
            <span>{{item.sendDate | dateFilter}}</span>
          </el-col>
        </el-row>
    </section>

    <!-- <footer v-if="schedule.total">
      <div class="right tools">
        <p class="tools-desc">{{ schedule.total }} 条数据，共 {{ totalPage }} 页</p>

        <el-button size="small" @click="currentPage = 1">首页</el-button>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="schedule.total">
        </el-pagination>

        <el-button size="small" @click="currentPage = totalPage">末页</el-button>
      </div>
    </footer> -->

    <!-- 通知弹框显示具体信息 -->
    <i-dialog
      v-model="isShow"
      :title='title'
      size="small"
      :toolbar="toolbar"
    >
      <div>
        {{content}}
      </div>
    </i-dialog>

  </section>
</template>

<script>
import req from 'api/common/home'
export default {
  name: 'ScheduleCard',

  props: {
    list: Array
  },

  data () {
    return {
      todoList: [],
      currentPage: 1,
      pageSize: 5,
      // totalPage: Math.ceil(this.schedule.total / this.pageSize)
      // 控制待阅消息弹窗显示隐藏
      isShow: false,
      title: '',
      content: '',
      todoId: '',
      toolbar: [{
        text: '确定',
        type: 'primary',
        func: () => {
          this.determineJump()
        }
      }, {
        text: '取消',
        type: 'text',
        func: (done) => {
          done()
        }
      }]
    }
  },

  methods: {
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
    },
    // 弹出待阅弹窗
    showInfo (item) {
      // 2 - item.todoType === 0 && (this.isShow = true)
      if (item.todoType === 2) {
        this.isShow = true
        this.title = item.todoTitle.split('：')[0]
        this.content = item.todoTitle.split('：')[1]
        this.todoId = item.todoId
      }
      // 1 - item.todoType === 0 && (location.href = item.linkPc)
      // 1 - item.todoType === 0 && window.open('#' + item.linkPc)
      if (1 - item.todoType === 0) {
        /^\/flow.html#\/flow/.test(item.linkPc) && window.open(item.linkPc)
        !(/^\/flow.html#\/flow/.test(item.linkPc)) && window.open(`#${item.linkPc}`)
      }
    },
    determineJump () {
      this.isShow = false
      req('putComplete', {todoId: this.todoId})
      .then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule-list{
  width: 70%;
  margin-right: 15px;
}

.item{
  height:36px;
  line-height:36px;
  padding: 0 20px;
  color:#333;
  cursor:pointer;
  &:nth-child(even){
    background:#fafafa;
  }
  .date{
    text-align:right;
    color:#8d8d8d;
  }
  &:hover{
    background: #def0ff;
  }
  .todo-text {
    .todo-text-content {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .todo-person {
    padding-left: 20px;
  }
}
</style>

