<template>
  <section class="task-list card list-card">
    <header>
      <h3>流程跟踪</h3>
      <a href="/flow.html" class="more">
        更多
      </a>
    </header>

    <nav class="task-nav" v-if="task.length !== 0">
      <el-row class="el-row-style" :style="height">
      <a 
        v-for="(item, index) of task" 
        :class="['item', 'hoverColor']" 
        target="_blank"
        :key="index" 
        :style="height"
        :href="`/flow.html#/flow/${item.processType}?processType=${item.processType}&taskId=${item.taskId}&taskKey=${item.taskKey}&processInstanceId=${item.processInstanceId}`">
        <el-col :span="14" :style="lineHeight">
        <p class="title date">{{ (index+1) + '. ' + item.pfInfoName }}</p>
        </el-col>
        <el-col :span="6" :style="lineHeight">
        <p class="name date overflow" >当前处理人：{{ item.assignee }}</p>
        <!-- v-if="statusArr[index] == 1" 这里是判断是否要变颜色-->
        <!-- <p class="name date datestyel" v-else>{{ item.status }}</p> -->
        
      </el-col>
      <el-col :span="4" :style="lineHeight">
        <p class="time date date-style">{{ item.createDate }}</p>  
      </el-col>
      </a>
    </el-row>
    </nav>
    <div class="CenterPhoto" v-else>
      <img src="../../../../assets/images/bg-photo.png" alt="">
      <p>你还没有发起流程，请前往<a href="/flow.html" class="flowStyle">流程中心</a></p>  
    </div>
  </section>
</template>

<script>
import req from 'api/self/home.js'
import moment from 'moment'
export default {
  // props: ['task'],
  data () {
    return {
      task: [],
      statusArr: [],
      publicHeight: 0
    }
  },
  computed: {
    height () {
      let height = parseInt(this.publicHeight)
      return `height: ${height / 5}px;`
    },
    lineHeight () {
      let height = parseInt(this.publicHeight)
      return `line-height: ${height / 5}px;`
    }
  },
  mounted () {
    this.init()
    let rowHeight = document.getElementsByClassName('task-list')[0]
    this.publicHeight = this.getStyle(rowHeight, 'height')
  },
  methods: {
    init () {
      req('getMySelfProcess', {pageIndex: 1, pageSize: 5}).then(res => {
        req('items', {dictCode: 'WORKFLOW_STATUS'}).then(data => {
          // console.log(data[1].value)
          // console.log(data[1].label)
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].createDate = moment(res.data[i].createDate).fromNow()
          }
          // console.log(res)
          this.task = res.data
        })
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
.task-list {
  width: 49%;
  position: relative;
  .CenterPhoto {
      position: absolute;
      top: 64%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  .item{
      line-height: 19px;
      padding: 0 20px;
      font-size: 12px;
      color: #333;
      cursor:pointer;
      &:nth-child(even){
        background:#fafafa;
      }
      .date{
        width: 100%;
        text-align: left;
        color:#333;
        font-size: 12px;
        word-break:keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .date-style {
        font-size: 12px;
        color: #8D8D8D;
        text-align: right;
      }
      .el-col .el-col-10 {
        word-break:keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-col {
        height: 100% !important;
      }
      .list-card nav a:not(.icon-wrap) {
        line-height: none;
        font-size: 12px;
      }
      .datestyel {
        color: #fd8f8f;
      }
    }
    .hoverColor:hover {
        background: #DCE4F0;
        /* color: red; */
      }
}
.flowStyle {
  color: #60b5fe;
  padding: 4px 5px;
  border-bottom: 1px solid;
}
.list-card nav a:not(.icon-wrap) p.name {
  flex: none;
  font-size: 12px;
}
.task-nav {
  /* height: 80%;
  overflow:auto; */
}


</style>
