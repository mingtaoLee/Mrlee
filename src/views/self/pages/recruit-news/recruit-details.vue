<template>
  <div class="recruit-details-page">
    <div class="header">
      <div class="position-name">
        <p class="position-name-h5">{{info.applyPositionName }}</p>
        <p class="position-name-time">发布时间：{{info.createDate | dateFilter}}</p>
      </div>
      <p class="address">
        {{info.workAddress }}&nbsp;/&nbsp;联系人：{{info.relationManName}}{{info.mobile}}
      </p>
      <div class="job-news">
        <p>
          <!-- <span class="treatment">{{info.floorSalary }}-{{info.ceilSalary }}元/月</span> -->
          <span class="treatment">{{info.salaryScope}}元/月</span>
          <span>&nbsp;/&nbsp;{{info.workAddress }}</span>
          <span>&nbsp;/&nbsp;{{getEmp(info.empType)}} </span>
          <!-- <span>&nbsp;/&nbsp;{{info.floorAge }}-{{info.ceilAge }}岁  </span> -->
          <span>&nbsp;/&nbsp;{{info.workRequirement}}</span>
          <!-- <span>&nbsp;/&nbsp;{{info.floorExperienceYear}}年经验 </span> -->
          <span>&nbsp;/&nbsp;{{info.experienceScope}}</span>
          <span>&nbsp;/&nbsp;{{getEducation(info.educationBackground )}} </span>
          <span>&nbsp;/&nbsp;招{{info.recruitNum}}人</span>
        </p>
        <button v-if="false">投简历</button>
      </div>
    </div>
    <div class="job-description">
      <h5 class="job-title">岗位职责：</h5>
      <p class="detail">{{info.positionStatement }}</p>
    </div>
    <div class="job-requirements">
      <h5 class="job-title">职位要求：</h5>
      <p class="detail">{{info.otherRequirement}}</p>
    </div>
  </div>
</template>
<script>
  import req from 'api/self/home'
  import { globalComponentVariable } from 'config/globalComponentVariable'
  import { getSelectData } from 'utils/index.js'
  export default {
    name: 'RecruitDetail',
    data () {
      return {
        info: {},
        // 教育背景字典
        educationList: [],
        // 用工类型字典
        empList: []
      }
    },
    created () {
      let id = this.$route.params.id
      // 教育字典
      let educationUrl = globalComponentVariable.iSelect['dict'].url('EDUCATION_TYPE')
      let educationIsCache = globalComponentVariable.iSelect['dict'].isCache
      // 用工类型字典
      let empUrl = globalComponentVariable.iSelect['dict'].url('EMPLOYEE_TYPE')
      let empIsCache = globalComponentVariable.iSelect['dict'].isCache
      req('getRecruitDetail', {rctRequirementId: id}).then(res => {
        this.info = res
      })
      // 获取教育背景字典
      getSelectData(educationUrl, educationIsCache).then(res => {
        this.educationList = res
      })
      // 获取用工类型字典
      getSelectData(empUrl, empIsCache).then(res => {
        this.empList = res
      })
    },
    methods: {
      /**
       * @param {String} value: 教育背景
       * @param {String} dataKey: 下拉数据类型，默认为'dict'
       * @return {String} 对应教育背景的value的label值
       */
      getEducation (value, dataKey = 'dict') {
        var list = this.educationList
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].value === value) {
            return list[i].label
          }
        }
        return null
      },
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
      .recruit-details-page {
        background: #FFFFFF;
        box-shadow: 0 0 2px 0 rgba(0,0,0,0.10);
        border-radius: 1px;
        .header {
          padding: 30px;
          background-color: rgba(61,165,254,0.06);
        }
        .position-name {
          display: flex;
          justify-content: space-between;
          align-content: center;
        }
        .position-name-h5 {
          font-size: 36px;
          color: #000000;
          letter-spacing: 0;
          line-height: 36px;
        }
        .position-name-time {
          font-size: 14px;
          color: #686868;
          letter-spacing: 0;
          line-height: 14px;
        }
        .address {
          padding-top: 20px;
          font-size: 14px;
          color: #000000;
          letter-spacing: 0;
          line-height: 14px;
        }
        .job-news {
          display: flex;
          padding-top: 14px;
          justify-content: space-between;
          align-content: center;
          p {
            font-size: 14px;
            color: #2C2C2C;
            letter-spacing: 0;
            line-height: 18px;
          }
          .treatment {
            color: #FF5500;
          }
          button {
            display: block;
            padding: 8px 16px;
            background: #3DA5FE;
            border-radius: 1px;
            font-size: 14px;
            color: #FFFFFF;
            line-height: 14px;
            cursor: pointer;
          }
        }
        .job-title {
          font-size: 18px;
          color: #000000;
          letter-spacing: 0;
        }
        .detail {
          padding-top: 13px;
          padding-left: 4px;
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
          line-height: 22px;
        }
        .job-description {
          padding: 20px 30px 17px;
        }
        .job-requirements {
          padding: 0 30px 60px;
        }
      }
    </style>
    <style lang="scss">
    .el-main {
      background: #f8f8f8 !important;
    }
    </style>
