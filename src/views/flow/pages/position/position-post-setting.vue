/*
职位模块的表单页面
逻辑判断：
1、判断各功能组件是否出现
2、operationType 0为新建；1为修改；2为撤销；3为删除
*/

<template>

      <i-process-flow @fillin="fillIn" :model="jobForm">

        <demand-desc slot="baseForm" :model="jobForm" :action="action" :limitTime="limitTime" :ifDesc="desc"></demand-desc>

        <position-post-maintain
          slot="detailForm"
          v-if="jobForm.operationType!=='2'"
          :categoryList="categoryList"
          :model="jobForm"
          :ifShowBelongOrg="jobForm.operationType==='0'"
          :belongOrgDisabled="belongOrgDisabled"
          @limitTime="controlLimitTime"></position-post-maintain>

        <standardjob-skill-demand slot="skillAquiredForm" :model="jobForm" v-if="jobForm.operationType!=='2'"></standardjob-skill-demand>

        <standardjob-experience-demand slot="experienceAquiredForm" :model="jobForm" v-if="jobForm.operationType!=='2'"></standardjob-experience-demand>

        <standardjob-key-responsilities slot="keyResponsibilitiesForm" :model="jobForm" v-if="jobForm.operationType!=='2'"></standardjob-key-responsilities>

        <position-post-cancel
          slot="detailForm"
          v-if="jobForm.operationType==='2'"
          :model="jobForm"
          @limitTime="controlLimitTime"
        ></position-post-cancel>

    </i-process-flow>

</template>

<script>
import req from 'api/position/position-post'
// import moment from 'moment'
import DemandDesc from 'components/flow/demand-desc'
import PositionPostMaintain from 'components/position/position-post-maintain'
import StandardjobSkillDemand from 'components/position/standardjob-skill-demand'
import StandardjobExperienceDemand from 'components/position/standardjob-experience-demand'
import StandardjobKeyResponsilities from 'components/position/standardjob-key-responsibilities'
import PositionPostCancel from 'components/position/position-post-cancel'
import { operationName, getOperationTypeByProcess } from '@/config/dict'
import IProcessFlow from 'components/common/i-process-flow'

export default {
  name: 'PositionPostSetting',
  components: {
    DemandDesc,
    PositionPostMaintain,
    StandardjobSkillDemand,
    StandardjobExperienceDemand,
    StandardjobKeyResponsilities,
    PositionPostCancel,
    IProcessFlow
  },
  data () {
    return {
      processType: this.$route.query.processType,
      action: '',
      isStandard: false,
      desc: false,
      // 保存职位的数据
      jobForm: {
        departmentId: '',
        applicantId: '',
        applicationDate: '',
        operationType: '',
        effectiveDate: '',
        reason: '',
        name: '',
        posStandardJobId: '',
        posStandardJobName: '',
        posCategoryIds: [],
        categorys: [],
        orgUnitId: '',
        parentPositionId: '',
        remark: '',
        academicRequirements: '',
        expertiseRequirements: '',
        skillRequirement: '',
        qualificationRequirement: '',
        otherRequirement: '',
        experienceRequirement: '',
        industryRequirement: '',
        enterpriseRequirement: '',
        keyResponsibilities: ''
      },
      submitLoading: false,
      saveLoading: false,
      // 限制选择生效时间
      limitTime: 0,
      // 所属组织是否disabled
      belongOrgDisabled: false,
      // 品类的列表
      categoryList: []
    }
  },

  methods: {
    postFlow () {
      let postData = JSON.parse(JSON.stringify(this.jobForm))
      if (postData.operationType === '0') {
        delete postData.posPositionId
      }
      if (postData.operationType === '1') {
        delete postData.posJobFamilyName
        delete postData.jobClassName
        delete postData.subJobClassName
        delete postData.posTitleName
        delete postData.posTitleId
        this.belongOrgDisabled = true
      }
      return postData
    },
    fillIn () {
      this.jobForm.effectiveDate = new Date(this.jobForm.effectiveDate)
    },
    controlLimitTime (limitTime) {
      this.limitTime = limitTime
    }
  },

  created () {
    // 必须点击树形图或待审批流程过来
    if (Object.keys(this.$route.query).length === 0) {
      return window.close()
    }
    // 操作类型
    this.jobForm.operationType = getOperationTypeByProcess[this.$route.query.processType]
    // 获取该表单的操作是什么，判断是标准职位还是职位，新建还是修改等
    this.action = '职位' + operationName[this.jobForm.operationType]
    // 获取所属组织信息
    this.jobForm.orgUnitId = this.$route.query.orgUnitId || ''
    this.jobForm.orgUnitName = this.$route.query.orgUnitName || ''
    this.jobForm.orgNode = this.$route.query.orgNode ? JSON.parse(this.$route.query.orgNode) : {}
    if (this.jobForm.operationType !== '0' && this.$route.query.posPositionId) {
      this.jobForm.posPositionId = this.$route.query.posPositionId

        // 如果是修改的话，需要带出所有数据
        // 修改的时候，带过来orgUnitId
      req('getPostDetailsById', {
        posPositionId: this.jobForm.posPositionId
      }).then(data => {
        // 修改不带出时间
        this.limitTime = data.effectiveDate
        delete data.effectiveDate
        if (this.jobForm.operationType === '1') {
          Object.assign(this.jobForm, data)
            // 将对象数组中的数据分开，id为id数据数组
          var temPosCategoryIds = []
          this.jobForm.categorys.forEach(ele => {
            temPosCategoryIds.push(ele.posCategoryId)
          })
          this.jobForm.posCategoryIds = temPosCategoryIds
            // 清空数据
          temPosCategoryIds = null
          this.belongOrgDisabled = true
        }
        if (this.jobForm.operationType === '2') {
          // 如果是撤销，需要带过来名称
          this.jobForm.name = this.$route.query.posPositionName
        }
      })
    }
    if (this.jobForm.operationType !== '2') {
      req('getCategoryList').then(data => {
        this.categoryList = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
