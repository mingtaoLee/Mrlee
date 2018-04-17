<template>
  <header class="self-header">
      <div class="header-container flex-space-between">
        <a class="brand" href="/self.html">
        </a>
        <div class="link flex-space-between">
          <div class="user-pop">
            <el-popover
              popper-class="popover"
              ref="popHeader"
              placement="bottom-start"
              width="340"
              :visible-arrow="false"
              trigger="hover">
                <!-- <div class="user-pop"> -->
                <i class="iconfont icon-bell" slot="reference"></i>  
                <!-- <div :class="['pop-up', {'popShow':dapShow}]" ref="popUp"> -->
                <div :class="['pop-up']" ref="popUp">
                  <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="`待办(${todo.length})`" name="first">
                      <a :href="item.linkPc"
                        class="toRead"
                        v-for="(item, index) in todo"
                        :key="index"
                        :target="target[index]"
                        >
                        <div class="work-style">
                          <p class ="work-style-top" v-if="todo[index].todoTitle.length < '14'">{{todo[index].todoTitle}}</p>
                            <el-tooltip class="item" v-else effect="dark" :content="todo[index].todoTitle" placement="top">
                              <p class ="work-style-top">
                                {{todo[index].todoTitle}}
                              </p>
                            </el-tooltip>
                          <span v-if="todo[index].todoDate !== 'Invalid date'">{{todo[index].todoDate}}</span>
                          <p style="padding-left: 10px;">
                            <!-- <span style="margin-left: 107px;">申请人：{{todo[index].sendUser}}</span> -->
                          </p>
                        </div>
                      </a>
                    </el-tab-pane>
                    <el-tab-pane :label="`待阅(${toRead.length})`" name="second">
                      <span @click="showInfo(item)" class="toRead" v-for="(item, index) in toRead" :key="index">
                        <!-- <p class="toRead" v-for="(item, index) in toRead" :key="index"></p> -->
                        <i-svg-icon iconName="file-confirm-o" :styleName="iconStyle"/>
                      <!-- <i-svg-icon class="iconfont icon-bell"></i-svg-icon> -->
                        <div class="toRead-text">
                          <p style="color: #000000;" v-if="item.todoTitle.length < '20'">{{item.todoTitle}}</p>
                          <el-tooltip class="item" v-else effect="dark" :content="item.todoTitle" placement="top">
                                <p class ="work-style-top">
                                  {{item.todoTitle}}
                                </p>
                          </el-tooltip>
                          <p>{{item.sendDate}}</p>
                        </div>
                      </span>
                    </el-tab-pane>
                  </el-tabs>
                </div>
                <!-- </div> -->
            </el-popover>
          <span v-if="totalShow && total < '100'" class="circle-Other">{{total}}</span>  
          <span v-else-if="totalShow" class="circle">99+</span>   
        </div>
          <el-popover
            popper-class="popover"
            ref="popHeader"
            placement="bottom"
            width="120"
            :visible-arrow="false"
            trigger="hover">
            <div slot="reference" class="icont-title">
              <i class="iconfont icon-user-c iconfontUser"></i>
              <span>{{username}}</span>
            </div>
            <div class="dropdown">
              <ul>
                <div class="tools">
                  <li v-if = "!empSelfAuth" class="dropdown-item"><a href="/">业务首页</a></li>
                  <li class="dropdown-item">
                    <router-link to="/essential">基本信息</router-link>
                    <!-- <i class="iconfont icon-file-n"></i> -->
                  </li>
                  <!-- <li class="dropdown-item"><router-link to="/">修改密码</router-link></li> -->
                </div>
                <li class="logout dropdown-item">
                  <a href="javascript:void(0)" @click="logout">退出登录</a>
                  <!-- <i class="iconfont icon-exit"></i> -->
                </li>
              </ul>
            </div>
          </el-popover>
        </div>
      </div>

    <!-- 通知弹框显示具体信息 -->
    <i-dialog
      v-model="isShow"
      :title='title'
      size="small"
      :toolbar="toolbar"
    >
      <div v-if="content.indexOf('【到期提醒标识】') === -1">
        {{content}}
      </div>

      <div v-else v-html="content.replace('【到期提醒标识】','')"></div>
    </i-dialog>

  </header>
</template>

<script>
import ISvgIcon from 'components/common/i-svg-icon'
import req from 'api/self/home.js'
import moment from 'moment'
export default {
  name: 'IHeader',
  components: {
    ISvgIcon
  },
  props: {
    autoSize: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dapShow: true,
      activeName: 'first',
      iconStyle: {
        width: '48px',
        height: '48px'
      },
      totalShow: false,
      todo: [],
      toRead: [],
      total: '',

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
      }],
      target: []
    }
  },
  computed: {
    username () {
      return this.$store.state.user.info.fullName || ''
    },
    empSelfAuth () {
      return this.$store.state.user.info.empSelfAuth
    },
    execute () {
      // console.log(this.$store.state.self.status, '555')
      return this.$store.state.self.status
    }
  },
  created () {
    this.init()
  },
  watch: {
    execute (newVal) {
      if (newVal > '1') {
        this.init()
      }
    }
  },
  methods: {
    logout () {
      window.sessionStorage.removeItem('TEAM_MEMBER_JUMP_HISTORY')
      this.$store.dispatch('logout').then(() => {
        // this.$router.push({ path: '/login' })
        this.$router.push({path: '/login'})
      })
    },
    popShow () {
      this.dapShow = !this.dapShow
    },
    init () {
      console.log(88888)
      req('listToRead').then(res => {
        for (let i = 0; i < res.length; i++) {
          res[i].sendDate = moment(res[i].sendDate).fromNow()
        }
        this.toRead = res
      })
      req('listTodo').then(res => {
        for (let i = 0; i < res.length; i++) {
          res[i].todoDate = moment(res[i].todoDate).format('YYYY-MM-DD HH:mm')
          if (res[i].linkPc) {
            if (res[i].linkPc.indexOf('/flow.html#/flow')) {
              res[i].linkPc = '/self.html#' + res[i].linkPc
            } else {
              res[i].linkPc = res[i].linkPc
            }
          }
          if (res[i].linkPc.indexOf('/self.html#/employee/guarantor') > -1) {
            this.target.push('_self')
          } else {
            this.target.push('_blank')
          }
        }
        this.todo = res
      })
      req('countUserTodo').then(res => {
        // console.log(res)
        if (res > 0) {
          this.totalShow = true
        }
        this.total = res
      })
    },

    // 弹出待阅弹窗
    showInfo (item) {
      // 2 - item.todoType === 0 && (this.isShow = true)
      if (item.todoType === 2) {
        this.isShow = true
        this.title = item.todoTitle.split('：')[0]
        this.content = item.todoText
        this.todoId = item.todoId
      }
      // 1 - item.todoType === 0 && (location.href = item.linkPc)
      1 - item.todoType === 0 && window.open(item.linkPc)
    },
    determineJump () {
      this.isShow = false
      req('putComplete', {todoId: this.todoId})
      .then(res => {
        console.log(res)
        if (res) {
          this.init()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
%dropdown-item {
  padding: 0 20px;
  a {
    display: inline-block;
    width: 100%;
    &:hover {
      color: #3da5fe;
    }
  }
}

.self-header {
  position: fixed;
  height: 50px;
  padding: 0 14px 0 0;
  z-index: 9;
  top: 0;
  left: 0;
  right: 0;
  background:  #28283C;
  border: 0 solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 0 1px 0 rgba(0,0,0,0.10);

  .header-container {
    align-items: center;
    height: 100%;
    margin: 0;
  }

  .brand, .link {
    color: #A8A8C3;
  }
  .brand {
    flex: 0 0 198px;
    background: url(../../../assets/images/self-logo.svg) center no-repeat;
    background-size: contain;
    width: 200px;
    height: 50px;
    display: inline-block;
  }
  .link {
    align-items: center ;
    min-width: 114px;
    height: 28px;
    font-size: 14px;
    .iconfont {
      font-size: 20px;
      &:hover{
        color: #3da5fe;
      }
    }
  }
}
.popShow {
  display: none;
}
.dropdown {
  padding: 15px 0;
  .tools {
    border-bottom: 1px solid #e8e8e8;
    .dropdown-item {
      @extend %dropdown-item;
      margin-bottom: 15px;
    }
  }
  .logout {
    margin-top: 5px;
    @extend %dropdown-item;
  }
}
.user-pop {
  position: relative;
  margin-right: 20px;
  .pop-up {
    background: #fff;
    box-shadow: -1px 0px 2px 0px;
    position: absolute;
    width: 300px;
    top: 37px;
    right: -20px;
    &:hover {
      display: block;
    }
  }
    &:hover .popShow{
      display: block !important;
      /* color: red !important; */
    }
}
.icont-title{
  padding: 0;
  .iconfontUser {
    padding-right: 14px;
  }
}
.toRead {
  padding: 10px 20px;
  display: block;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  i, .toRead-text {
    margin-left: 10px;
    
  }
  .toRead-text {
    display: inline-block;
    width: 78%;
    p {
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  i {
    padding-top: 10px;
  }
}
.work-style {
  width: 100%;
  .work-style-top {
    width: 64%;
    color: #000000;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  span {
    text-align: right;
    width: 34%;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.circle, .circle-Other {
  background: #ff6464;
  position: absolute;
  color: #fff;
  font-size: 12px;
  display: block;
  text-align: center;
}
.circle {
  top: -13px;
  right: -28px;
  width: 38px;
  height: 16px;
  line-height: 18px;
  border-radius: 10px;
}
.circle-Other {
  border-radius: 50%;
  line-height: 21px;
  width: 20px;
  height: 20px;
  top: -12px;
  right: -10px;
  /* background-color: #000000; */
}
</style>
<style lang="scss">
  .pop-up .el-tabs__nav {
    width: 100%;
    .el-tabs__item {
      width: 50%;
      text-align: center;
      height: 50px;
      line-height: 50px;
      overflow: auto;
    }
  }
  .pop-up .el-tab-pane {
    overflow: auto;
    max-height: 390px;
  }
</style>
