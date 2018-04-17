<template>
  <div class="show">
    <div class="hidden">
    <i class="iconfont icon-identity-card"  ></i>
    <div class="content" >
        <div class="left">
          <div class="img">
            <img :src="path" alt="" v-if="list.photoPath">
            <img src="../../../assets/images/avatar.png" alt="" v-else>
          <!-- <i class="iconfont icon-user-c" v-else></i> -->
          </div>
          <p>{{list.fullName}}</p>
        </div>
        <div class="right">
          <p>邮箱：{{list.email}}</p>
          <p>电话：{{list.mobile}}</p>
          <p>工号：{{list.employeeCode}}</p>
          <p>职位：{{list.posPositionName}}</p>
          <p>部门：{{list.orgUnitName}}</p>
          <p>人事范围：{{list.personnelGroupName}}</p>
        </div>
    </div>
  </div>
  </div>
</template>
  
<script>
import req from 'api/employee/personal.js'

export default {
  // 传入需要获取信息的id
  props: {
    id: { type: String, default: 'undefined' }
  },
  data () {
    return {
      list: {
        email: '',
        mobile: '',
        employeeCode: '',
        posPositionName: '',
        fullName: '',
        personnelGroupName: '',
        photoPath: ''
      },
      path: ''
    }
    // content: 'content'
  },
  watch: {
    // id改变的话就重新去获取对应的信息进行渲染
    id (newVal, oldVal) {
      if (newVal) {
        this.getBaseInfo(newVal)
      }
    }
  },

  created () {
    this.getBaseInfo()
  },
  methods: {
    getBaseInfo (id) {
      let that = this
      req('getBaseInfo', {employeeId: id || that.id}, true, false)
      .then(res => {
        Object.assign(that.list, res)
        this.path = this.list.photoPath ? `${this.$$.BASE_URL}/system/attachments/image/${this.list.photoPath}` : ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.show {
  /* position: absolute; */
  .hidden:hover .content {
    visibility: visible;
  }
  .content {
    display: flex;
    visibility: hidden;
    width:380px;
    min-height:182px;
    /* display: flex;*/
    position: absolute;
    z-index: 999;
    background-color: #FFFFFF;
    box-shadow:3px 3px 10px #ccc;
    .left {
      min-height: 182px;
      min-width: 134px;
      .img {
        display: block;
        width:93px;
        height:93px;
        margin: 21px 0 10px 30px;
        border-radius: 50%;
        background-color: #ccc;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;          
        }
      }
      p{
       /* margin-top:10px;*/
        /* line-height: 220px;*/
        text-align: center;
        padding-left:3px;
        word-wrap:break-word;
        font-size:14px;
      }
    }
    .right {
      flex: 1;
      margin:20px 32px 18px;
      p{
        color:#333;
        font-size: 12px;
        line-height:24px;
      }
    }
  }
  i{
    width:15px;
    height:12px;
    color: yellowgreen;
    position: relative;
  }

}
</style>