<template>
  <section class="card notice-list list-card">
    <header>
      <h3>招聘信息</h3>
      <router-link to="/recruit" class="more">
        更多
      </router-link>
    </header>
    <!-- {{notice.data}} -->
    <nav class="notice-nav" v-if="notice.length !== 0">
      <el-row>
      <router-link 
      v-for="(item, index) of notice" :key="index" 
      :to='`/recruit/recruitDetail/${item.rctRequirementId}`'
      :style="height"
      >
          <!-- :to="item.href" -->
        <span class="now" >NEW</span>
        <!-- v-if="lastUpdateDate[index] > preDate && lastUpdateDate[index] < curDate" -->
        <!-- {{item}} -->
        <!-- <el-col :span="2" class="title single-text-overflow" > -->
        <!-- <p class="title single-text-overflow" v-if="item.engage"><span class="engage">急聘</span>{{item.name }}</p> -->
        
      <!-- </el-col> -->
       <!-- :class="{'engage': engage}" -->
       <el-col :span="12" class="time single-text-overflow" :style="lineHeight">
        <span >
          <span v-if="item.applyOrgName"><span class="recruit">招聘</span>&nbsp;&nbsp;【{{item.applyOrgName}}】&nbsp;&nbsp;{{item.applyPositionName}}</span>
        </span>
       </el-col>
        <!-- <el-col :span="3" class="time single-text-overflow">
            
        </el-col> -->
        <el-col :span="8" class="time single-text-overflow" :style="lineHeight">
            <span >  招聘要求： </span>{{ item.name }}
        </el-col>
        <el-col :span="5" style="text-align: right; color: #8D8D8D;" :style="lineHeight">
          <span v-if="item.lastUpdateDate !== 'Invalid date'">{{item.lastUpdateDate}}</span>
          <span v-else></span>
        </el-col>
      </router-link>
    </el-row>
    </nav>
    <div class="CenterPhoto" v-else>
        <img src="../../../../assets/images/bg-photo.png" alt="">
        <p>还没有招聘信息，请等待</p>  
    </div>
  </section>
</template>

<script>
import req from 'api/self/home'
import moment from 'moment'
export default {
  // props: ['notice'],
  data () {
    return {
      notice: [],
      newShow: false,
      curDate: 0,
      preDate: 0,
      lastUpdateDate: [],
      publicHeight: 0
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
    let rowHeight = document.getElementsByClassName('notice-list')[0]
    this.publicHeight = this.getStyle(rowHeight, 'height')
  },
  methods: {
    init () {
      req('requirements', {pageSize: '5', pageIndex: '1'}).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.curDate = new Date()
          this.preDate = this.curDate.getTime() - 24 * 60 * 60 * 1000
          this.lastUpdateDate.push(res.data[i].lastUpdateDate)
          res.data[i].lastUpdateDate = moment(res.data[i].lastUpdateDate).fromNow()
        }
        this.notice = res.data
      })
    },
    getStyle (obj, name) {
      if (obj.currentStyle) {
        return getComputedStyle(obj, false)[name]
      } else {
        return getComputedStyle(obj, false)[name]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-list{
  width: 49%;
  position: relative;
  .CenterPhoto {
      position: absolute;
      top: 64%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
}
 .engage{
  background: #fe7b7b;
  color: #ffffff;
  padding: 2px;
  margin-right: 5px;
  box-sizing: border-box;
  border-radius: 3px;
}
.recruit {
  background: #3da5fe;
  color: #ffffff;
  padding: 2px;
  margin-right: 5px;
  box-sizing: border-box;
  border-radius: 3px
}
.notice-nav {
  position: relative;
  /* height: 80%;
  overflow: auto; */
  a {
    &:hover {
      background: #DCE4F0 !important;
    }
  }
}
.now {
      background: #6cc60a;
      height: 14px;
      width: 33px;
      line-height: 15px;
      padding-left: 6px;
      margin-right: 6px;
      color: #fff;
      font-size: 5px;
      border-radius: 3px;
      position: absolute;
      right: 66px;
      z-index: 3;
  &::before {
    content: '';
    width: 0;
    position: absolute;
    top: 1px;
    left: -6px;
    height: 0;
    border-top: 6px solid transparent;
    border-right: 9px solid #6cc60a;
    border-bottom: 6px solid transparent;
    z-index: 1;
  }
}
</style>
