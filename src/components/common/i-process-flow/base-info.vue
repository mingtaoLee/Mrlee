<template>
  <div>
    <h1 class="flow-header" ref="title" id="title">
      <div ref="child" class="title-control">
        <span class="title-word" v-if="!(flowBaseInfo&&flowBaseInfo.pfInfoName)||changeTitle">{{username}}发起的</span>
        <span class="title-word" ref="edit" >{{ (flowBaseInfo&&flowBaseInfo.pfInfoName) ? flowBaseInfo.pfInfoName : ''}}</span>
        <!-- {{ (flowBaseInfo&&flowBaseInfo.pfInfoName) ? flowBaseInfo.pfInfoName : ''}} -->
        <span class="title-word" v-if="!(flowBaseInfo&&flowBaseInfo.pfInfoName)||changeTitle">{{flowType}}流程</span>
      </div>
      </h1>
    <div class="content-follow">
        <h2 class="info-title">流程信息</h2>
        <div class="info-content">
          <header class="title-content">
            <span class="name">
              <i-show-personnel-info :id="userid" class="btn"></i-show-personnel-info>
            申请人姓名：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{flowBaseInfo ? flowBaseInfo.createName : username}}
            </span>
            <!-- <span class='btn1'></span> -->
            <span>所在部门： {{flowBaseInfo ? flowBaseInfo.orgUnitName : orgUnitName}}</span>
            <span v-if="flowBaseInfo">申请时间： {{flowBaseInfo ? flowBaseInfo.createDate : ''}}</span>
          </header>
        </div>
    </div>
  </div>
  </template>

  <script>
  import { formatDateToMi } from 'utils/employee.js'
  import IShowPersonnelInfo from 'components/common/i-show-personnelInfo'
  export default {
    name: 'BaseInfo',
    props: {
      flowType: {type: String},
      flowBaseInfo: {
        type: Object,
        default: () => {
          return null
        }
      },
      edit: {type: Boolean, default: true}
    },
    data () {
      return {
        applicant: {
          username: '',
          orgUnitName: '',
          date: ''
        },
        da: new Date(),
        changeTitle: false
        // id: this.flowBaseInfo ? this.flowBaseInfo.createId : this.userid
      }
    },
    computed: {
      /* 获取登录信息 */
      username () {
        return this.$store.state.user.info.fullName
      },
      userid () {
        return this.flowBaseInfo ? this.flowBaseInfo.createId : this.$store.state.user.info.empEmployeeId
      },

      orgUnitName () {
        return this.$store.state.user.info.orgUnitName
      },

      date () {
        let date = new Date()

        console.log(formatDateToMi(date).c)
        return formatDateToMi(date).c
      }
    },

    methods: {
      console () {
        return this.$refs.title.innerHTML.replace(/ ?<.+?> ?/g, '')
      },
      sponsor () {
        return this.userid
      },
      inner (text) {
        this.changeTitle = true
        this.$refs.edit.innerHTML = text + '的'
      },

      titleInner (text) {
        let myText = document.createTextNode(text)
        this.$refs.title.replaceChild(myText, this.$refs.child)
        // document.getElementById('title').innerHTML = text
      },

      /* 返回流程头部信息 */
      base () {
        this.applicant.username = this.username
        this.applicant.orgUnitName = this.orgUnitName
        this.applicant.date = this.date
        let data = this.flowBaseInfo ? this.flowBaseInfo : this.applicant

        return data
      }
    },
    components: {
      IShowPersonnelInfo
    }
  }
  </script>

  <style lang="scss" scoped>
    .flow-header {
      background: #FAFAFA;
      border: 1px solid #F6F6F6;
      height: 18px;
      padding: 21px 20px;
      font-size: 18px;
      color: #000000;
      letter-spacing: 0;
      line-height: 18px;
    }
  .title-content {
    display: flex;
    span:not(.name) {
      display: block;
      padding-left: 141px;
      position: relative;
    }
    .name {
      padding-left: 15px;
     position: relative;
     .btn {
       position: absolute;
      top: 1px;
      left:90px;
      display: inline;
      }
    }

  }
  .title-control{
    font-size: 0px;
  }
  .title-word{
    font-size: 18px;
  }
  </style>
