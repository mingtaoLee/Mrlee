<template>
  <!-- <div class="pending-trial"> -->
    <section class="schedule-list list-card card pending-trial">
      <header>
        <h3>我的待办</h3>
        <router-link to="/waitingProcess" class="more">更多</router-link>
      </header>

      <section class="schedule-nav" v-if="list.length !== 0">
        <el-row :style="height" :class="['item', {'hoverColor':linkPcList[index]}]" v-for="(item, index) of list" :key="index">
            <a  :href="item.linkPc" :target="target[index]">
              <el-col :span="18" :style="lineHeight">
                <span>{{item.todoTitle}}</span>
              </el-col>
              <!-- 申请人 -->
              <!-- <el-col :span="10" class="send-user">
                <span> </span>
                <span>{{item.sendUser}}</span>
              </el-col> -->
              <el-col :span="6" class="date" :style="lineHeight">
                <span v-if="item.todoDate !== 'Invalid date'">{{item.todoDate}}</span>
                <span v-else></span>
              </el-col>
        </a>           
        </el-row>
      </section>
      <div class="CenterPhoto" v-else>
        <img src="../../../../assets/images/bg-photo.png" alt="">
        <p>还没有任务数据，请稍等片刻</p> 
      </div>
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
    </section>
  <!-- </div> -->
</template>

<script>
  import req from 'api/self/home.js'
  import moment from 'moment'

  export default{
    data () {
      return {
        list: [],
        linkPcList: [],
        publicHeight: 0,
        target: []
      }
    },
    computed: {
      height () {
        var height = parseInt(this.publicHeight)
        return `height: ${height / 5}px;`
      },
      lineHeight () {
        var height = parseInt(this.publicHeight)
        return `line-height: ${height / 5}px;`
      }
    },
    mounted () {
      this.init()
      let rowHeight = document.getElementsByClassName('pending-trial')[0]
      this.publicHeight = this.getStyle(rowHeight, 'height')
    },
    methods: {
      init () {
        req('todo', {pageIndex: 1, pageSize: 5}).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].todoDate = moment(res.data[i].todoDate).format('YYYY-MM-DD HH:mm')
            if (res.data[i].linkPc) {
              if (res.data[i].linkPc.indexOf('/flow.html#/flow')) {
                res.data[i].linkPc = '/self.html#' + res.data[i].linkPc
              } else {
                res.data[i].linkPc = res.data[i].linkPc
              }
            }
            if (res.data[i].todoTitle.slice(0, 6) === '【问卷发布】') {
              this.target.push('_self')
            } else {
              this.target.push('_blank')
            }
          }
          console.log(this.target)
          this.list = res.data
        })
      },
      getStyle (obj, name) {
        if (obj.currentStyle) {
          // return obj.currentStyle[name]
          return getComputedStyle(obj, false)[name]
        } else {
          return getComputedStyle(obj, false)[name]
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pending-trial {
    width: 49%;
    /* box-shadow: 0 0 2px 0 rgba(0,0,0,0.10); */
    border-radius: 1px;
    box-sizing: border-box;
    position: relative;
    /* min-height: 223px; */
    header {
      height: 20%;
    }
    .CenterPhoto {
      position: absolute;
      top: 64%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    .schedule-list{
      width: 100%;
    }
    .item{
      height:42px;
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
    }
    .hoverColor:hover {
        background: #DCE4F0;
        /* color: red; */
      }
  }
.el-col-20,.el-col-18 {
      word-break:keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 43px;
    }
.el-col-4 {
  font-size: 12px;
  color: #8D8D8D;
  line-height: 35px;
}
.send-user {
  text-align: center;
}
.el-row-style {
  line-height: 35px;
}
.schedule-nav {
  /* height: 80%;
  overflow:auto; */
}
</style>
