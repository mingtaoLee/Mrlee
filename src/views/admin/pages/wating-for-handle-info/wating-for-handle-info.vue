<template>
  <div class="wating-for-handle-info lx-wating-for-handle-info">
    <el-container>
      <el-header height="60px">
        <!-- 头部 -->
        <waiting-for-handle-info-numberHeader
          :showEm="false"
          :waiting-for-handle-info-number="waitingForHandleInfoNumber">
          <!-- <a href="/#/main" class="flow-link" slot="link">业务首页</a> -->
          <div slot="link">
            <el-popover
              ref="todoList"
              placement="bottom-start"
              width="400"
              trigger="hover">
              <div class="lx-icon-bell-i" slot="reference">
                <i class="iconfont icon-bell"></i>
                <span class="todoNumber">{{waitingForHandleInfoNumber}}</span>
              </div>
              <el-tabs v-model="activeName" @tab-click="handleClick" class="lx-todo-list-popover">
                <el-tab-pane :label="'待办(' + this.waitTodoListTotal + ')'" name="typeFirst">
                  <div :style="paneHeight" class="paneDiv">
                    <el-row class="item" v-for="(item, index) of waitTodoList" :key="index">
                      <el-col :span="18">
                        <div @click="showInfo(item)" class="infoContent">{{item.todoTitle}}</div>
                      </el-col>
                      <el-col :span="6" class="date">
                        <span>{{item.sendDate | dateFilter}}</span>
                      </el-col>
                    </el-row>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="'待阅(' + this.waitToLookListTotal + ')'" name="typeSecond">
                  <div :style="paneHeight" class="paneDiv">
                    <el-row class="item" v-for="(item, index) of waitToLookList" :key="index">
                      <el-col :span="18">
                        <div @click="showInfo(item)" class="infoContent">{{item.todoTitle}}</div>
                      </el-col>
                      <el-col :span="6" class="date">
                        <span>{{item.sendDate | dateFilter}}</span>
                      </el-col>
                    </el-row>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-popover>
          </div>
        </waiting-for-handle-info-numberHeader>
      </el-header>

      <el-main>
        <main class="content">
          <div class="contentChild" v-loading="todoListLoading" :element-loading-text="$loadingText">
            <header>
              <h3 class="title">我的待办</h3>
            </header>
            <i-form class="searchForm" @reset="reset" @search="search" @submit.native.prevent>
              <el-form-item label="待办标题">
                <el-input v-model="form.todoTitle" placeholder="请输入流程标题" maxlength="50"></el-input>
              </el-form-item>
              <el-form-item label="待办类型">
                <el-select v-model="form.type" clearable placeholder="请输入流程类型">
                  <el-option
                    v-for="item in flowType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="待办状态">
                <el-select v-model="form.status" clearable placeholder="请输入流程状态">
                  <el-option
                    v-for="item in flowStatu"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </i-form>
            <section class="todoList">
              <el-row class="item" v-for="(item, index) of infoList" :key="index">
                <el-col :span="10">
                  <div @click="showInfo(item)" class="infoContent">{{item.todoTitle}}</div>
                </el-col>
                <el-col :span="10" class="todo-person">
                  <span>申请人：{{item.sendUser}}</span>
                </el-col>
                <el-col :span="4" class="date">
                  <span>{{item.sendDate | dateFilter}}</span>
                </el-col>
              </el-row>
            </section>
            <p class="infoListStatu" v-if="infoList && !infoList.length">暂无数据</p>
            <!-- 通知弹框显示具体信息 -->
          </div>
        </main>
        <footer v-if="total && pageInfo">
          <div class="right tools">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageInfo.pageIndex"
              :page-size="pageInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </footer>
      </el-main>
    </el-container>
    <i-dialog
      v-model="isShow"
      :title='title'
      size="small"
      :toolbar="toolbar">
      <div v-if="content.indexOf('【到期提醒标识】') === -1">
        {{content}}
      </div>
      <div v-else v-html="content.replace('【到期提醒标识】','')"></div>
    </i-dialog>
  </div>
</template>

<script>
import req from 'api/common/home'
import waitingForHandleInfoNumberHeader from 'components/common/i-header/i-header'
export default {
  components: {
    waitingForHandleInfoNumberHeader
  },
  data () {
    return {
      // 未处理的待办和代阅消息条数
      waitingForHandleInfoNumber: 0,
      // 列表数据
      infoList: null,
      pageInfo: null,
      pageSize: null,
      pageIndex: null,
      total: null,
      isShow: false,
      title: '',
      content: '',
      todoId: '',
      toolbar: [{
        text: '确定',
        type: 'primary',
        func: () => {
          this.doRefresh()
        }
      }, {
        text: '取消',
        type: 'text',
        func: (done) => {
          done()
        }
      }],
      form: {
        todoTitle: '',
        type: '1',
        status: '0'
      },
      activeName: 'typeFirst',
      waitTodoList: [],
      waitToLookList: [],
      waitTodoListTotal: 0,
      waitToLookListTotal: 0,
      flowType: [
        {
          value: '1',
          label: '待办'
        },
        {
          value: '2',
          label: '待阅'
        }
      ],
      flowStatu: [
        {
          value: '0',
          label: '未处理'
        },
        {
          value: '1',
          label: '已处理'
        }
      ],
      todoListLoading: true
    }
  },
  computed: {
    paneHeight () {
      return {height: window.innerHeight / 2 + 'px'}
    }
  },
  methods: {
    // 获取代办消息条数
    getCountUserTodo () {
      req('getCountUserTodo')
      .then(res => {
        this.waitingForHandleInfoNumber = res
      })
    },
    // 获取分页待办列表数据
    // 默认获取未处理待办列表数据
    getCountUserTodoList (data) {
      return req('getCountUserTodoList', data)
      .then(res => {
        this.todoListLoading = false
        this.infoList = res.data
        this.pageInfo = res.info
        this.total = res.total
      })
    },
    // 获取待办消息列表
    getTodo () {
      return req('getTodoOrToLook', {type: '1'})
      .then(res => {
        this.waitTodoList = res
        this.waitTodoListTotal = res.length
      })
    },
    // 获取代阅消息列表
    getToLook () {
      return req('getTodoOrToLook', {type: '2'})
      .then(res => {
        this.waitToLookList = res
        this.waitToLookListTotal = res.length
      })
    },
    showInfo (item) {
      if (item.todoType === 2) {
        this.isShow = true
        this.title = item.todoTitle.split('：')[0]
        this.content = item.todoText
        this.todoId = item.todoId
      }
      if (1 - item.todoType === 0) {
        /^\/flow.html#\/flow/.test(item.linkPc) && window.open(item.linkPc)
        !(/^\/flow.html#\/flow/.test(item.linkPc)) && window.open(`#${item.linkPc}`)
      }
    },
    determineJump () {
      return req('putComplete', {todoId: this.todoId})
      .then(res => {
        this.isShow = false
        this.$message.success('待阅消息已被您阅读完毕')
      })
    },
    // 查看待阅消息确定后刷新数据
    async doRefresh () {
      await this.determineJump()
      this.getCountUserTodo({})
      this.todoListLoading = true
      this.getCountUserTodoList({...this.form, pageSize: this.pageSize, pageIndex: this.pageIndex})
      await this.getTodo()
      this.getToLook()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.todoListLoading = true
      this.getCountUserTodoList({...this.form, pageIndex: this.pageIndex, pageSize: val})
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.todoListLoading = true
      this.getCountUserTodoList({...this.form, pageIndex: val, pageSize: this.pageSize})
    },
    search () {
      this.todoListLoading = true
      this.getCountUserTodoList({...this.form, pageSize: this.pageSize})
    },
    reset () {
      Object.keys(this.form).map(val => {
        this.form[val] = ''
        this.form['status'] = '0'
        this.form['type'] = '1'
      })
      this.todoListLoading = true
      this.getCountUserTodoList({...this.form, pageSize: this.pageSize})
    }
  },
  async created () {
    // 由于使用接口共享，同时请求会存在阻断 所以使用异步函数
    this.getCountUserTodo({})
    this.todoListLoading = true
    this.getCountUserTodoList({status: 0, type: 1})
    await this.getTodo()
    this.getToLook()
  }
}
</script>

<style lang="scss" scoped>
.lx-todo-list-popover {
  .paneDiv {
    overflow: scroll;
  }
  .item{
    height: 36px;
    line-height: 36px;
    padding: 0 20px;
    color: #333;
    cursor: pointer;
    &:nth-child(even){
      background:#fafafa;
    }
    &:hover{
      background:#F5F7FA;
    }
    .infoContent {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .infoContent:hover {
      color: #409EFF;
    }
    .date {
      text-align: right;
      color: #8d8d8d;
    }
    .todo-person {
      padding-left: 20px;
    }
  }
}
.content {
  border: 1px solid #e5e5e5;
  // border-bottom: none;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 0 1px 0 rgba(0,0,0,.1);
  box-sizing: border-box;
  margin-bottom: 15px;
  .infoListStatu{
    font-size: 16px;
    color: #909399;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .title {
    line-height: 40px;
    height: 40px;
    padding: 0 20px;
    background: #fafafa;
    color: #000;
    font-size: 16px;
    font-family: PingFangSC-Regular;
  }
  .searchForm {
    margin: 10px 0;
  }
  .todoList {
    border-top: 1px solid #e5e5e5;
    // min-height: 100px;
    // border-bottom: 1px solid #e5e5e5;
  }
  .item{
    height: 36px;
    line-height: 36px;
    padding: 0 20px;
    color: #333;
    cursor: pointer;
    &:nth-child(even){
      background:#fafafa;
    }
    &:hover{
      background:#F5F7FA;
    }
    .infoContent {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .infoContent:hover {
      color: #409EFF;
    }
    .date {
      text-align: right;
      color: #8d8d8d;
    }
    .todo-person {
      padding-left: 20px;
    }
  }
}
</style>

<style lang="scss">
.lx-wating-for-handle-info {
  .el-main {
    overflow: visible;
    .el-pagination {
      text-align: right;
    }
  }
}
.lx-todo-list-popover {
  .el-tabs__nav {
    width: 100%;
    .el-tabs__item {
      margin: 0;
      width: 50%;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      height: 40px;
    }
    .el-tabs__active-bar {
      width: 50%;
    }
  }
}
.lx-icon-bell-i {
  // margin-left: 40px;
  margin-top: 1px;
  position: relative;
  .icon-bell:before {
    font-size: 24px;
  }
  .todoNumber {
    position: absolute;
    left: 100%;
    top: 0;
    transform: translateY(-60%);
    background: #FF6464;
    padding: 0 6px;
    font-style: normal;
    font-size: 14px;
    color: #ffffff;
    border-radius: 5px;
  }
}
</style>

