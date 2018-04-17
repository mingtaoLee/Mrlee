<template>
  <div class="member-item">
    <div class="header">
      <avatar v-if="data.photoPath" :gender="data.gender" :url="`${$$.BASE_URL}/system/attachments/image/${data.photoPath}`"></avatar>
      <avatar v-else :gender="data.gender"></avatar>
    </div>

    <div class="msg" v-if="data">
      <p class="job-title">{{data.posPositionName}}<span>（{{getEmp(data.employeeStatus)}}）</span></p>

      <el-row>
        <el-col :span="3" v-if="data.fullName" class="name">{{data.fullName}}</el-col>
        <el-col :span="3" v-else class="name">&nbsp;</el-col>
        <el-col :span="2" v-if="data.employeeAge" class="age">{{data.employeeAge}}岁</el-col>
        <el-col :span="2" v-else class="age">&nbsp;</el-col>
        <el-col :span="4" v-if="data.employeeCode" class="job-number">工号 {{data.employeeCode}}</el-col>
        <el-col :span="4" v-else class="job-number">工号</el-col>
        <el-col :span="5" v-if="data.hireDate !== 'Invalid date'" class="entry-date">入职 {{data.hireDate}}</el-col>
        <el-col :span="5" v-else class="entry-date">入职</el-col>
        <el-col :span="5"  class="phone-number"><i class="iconfont icon-phonenumber"></i>{{data.mobile}}</el-col>
        <el-col :span="5"  class="email"><i class="iconfont icon-email"></i>{{data.email}}</el-col>
        
      </el-row>
    </div>
  </div>
</template>

<script>
  import Avatar from 'views/self/pages/my-team/components/avatar'
  import { globalComponentVariable } from 'config/globalComponentVariable'
  import { getSelectData } from 'utils/index.js'
  export default {
    name: 'MemberItem',
    components: {
      Avatar
    },
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        empList: []
      }
    },
    created () {
      // 用工类型字典
      let empUrl = globalComponentVariable.iSelect['dict'].url('EMPLOYEE_STATUS')
      let empIsCache = globalComponentVariable.iSelect['dict'].isCache
      // 获取用工类型字典
      getSelectData(empUrl, empIsCache).then(res => {
        this.empList = res
      })
    },
    methods: {
      /**
       * @param {String} value: 用工类型value
       * @return {String} 对应用工类型的value的label值
       */
      getEmp (value) {
        var list = this.empList
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].value === value) {
            return list[i].label
          }
        }
        return null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .member-item {
    display: flex;
    padding: 15px 0px 15px 27px;

    .header {
      position: relative;
      width: 42px;
      height: 42px;
    }

    .msg {
      padding-left: 40px;
      width: 100%;
      .job-title {
        padding-bottom: 5px;
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
      }
      .el-row {
        display: inline-block;
        font-size: 12px;
        color: #333333;
        letter-spacing: 0;
        vertical-align: middle;
        width: 100%;
        &:nth-child(n + 2) {
          padding-left: 18px;
        }
      }
    }
    .email {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .job-number {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .icon-phonenumber,.icon-email {
      padding-right: 5px; 
      color: #959595;
      font-size: 12px;
    }
    .entry-date {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
