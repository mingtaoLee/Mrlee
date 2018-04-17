/*
标准职位模块的表单页面
逻辑判断：
1、判断各功能组件是否出现
2、operationType 0为新建；1为修改；2为撤销；3为删除
*/

<template>

   <i-process-flow @fillin="fillIn" :model="standardOcForm">

      <demand-desc slot="baseForm" :model="standardOcForm" :action="action" :limitTime="limitTime" :ifDesc="desc"></demand-desc>

      <standardjob-maintain
        slot="detailForm"
        v-if="standardOcForm.operationType!=='2'"
        :model="standardOcForm"
        :titleList="titleList"
        @limitTime="controlLimitTime"></standardjob-maintain>

      <standardjob-skill-demand slot="skillAquiredForm" :model="standardOcForm" v-if="standardOcForm.operationType!=='2'"></standardjob-skill-demand>

      <standardjob-experience-demand slot="experienceAquiredForm" :model="standardOcForm"  v-if="standardOcForm.operationType!=='2'"></standardjob-experience-demand>

      <standardjob-key-responsilities slot="keyResponsibilitiesForm" :model="standardOcForm"  v-if="standardOcForm.operationType!=='2'"></standardjob-key-responsilities>

      <standardjob-cancel
        slot="detailForm"
        :model="standardOcForm"
        v-if="standardOcForm.operationType==='2'"
        @limitTime="controlLimitTime"
      ></standardjob-cancel>

    </i-process-flow>

</template>

<script>
import req from 'api/position/standard-oc'
import DemandDesc from 'components/flow/demand-desc'
import StandardjobMaintain from 'components/position/standardjob-maintain'
import PositionPostMaintain from 'components/position/position-post-maintain'
import StandardjobSkillDemand from 'components/position/standardjob-skill-demand'
import StandardjobExperienceDemand from 'components/position/standardjob-experience-demand'
import StandardjobKeyResponsilities from 'components/position/standardjob-key-responsibilities'
import StandardjobCancel from 'components/position/standardjob-cancel'
import { operationName, getOperationTypeByProcess } from '@/config/dict'
import IProcessFlow from 'components/common/i-process-flow'

export default {
  name: 'StandardOcSetting',
  components: {
    DemandDesc,
    StandardjobMaintain,
    PositionPostMaintain,
    StandardjobSkillDemand,
    StandardjobExperienceDemand,
    StandardjobKeyResponsilities,
    StandardjobCancel,
    IProcessFlow
  },
  data () {
    return {
      processType: this.$route.query.processType,
      action: '',
      desc: false,
      // 保存标准职位的数据
      standardOcForm: {
        operationType: 0,
        effectiveDate: '',
        posStandardJobId: '',
        name: '',
        posJobFamilyId: '',
        jobClassId: '',
        subJobClassId: '',
        posTitleId: '',
        // posCategoryIds: '',
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
      // 职务的列表
      titleList: [],
      // 品类的列表
      // categoryList: [],
      // 限制选择生效时间
      limitTime: 0
    }
  },

  methods: {
    postFlow () {
      let postData = JSON.parse(JSON.stringify(this.standardOcForm))
      if (postData.operationType === '0') {
        delete postData.posStandardJobId
      }
      if (postData.operationType === '2') {
        delete postData.posTitleId
        delete postData.posCategoryIds
        delete postData.remark
        delete postData.academicRequirements
        delete postData.expertiseRequirements
        delete postData.skillRequirement
        delete postData.qualificationRequirement
        delete postData.otherRequirement
        delete postData.experienceRequirement
        delete postData.industryRequirement
        delete postData.enterpriseRequirement
        delete postData.keyResponsibilities
        delete postData.posJobFamilyName
        // delete postData.jobClassName
        // delete postData.subJobClassName
      }
      return postData
    },
    fillIn () {
      this.standardOcForm.effectiveDate = new Date(this.standardOcForm.effectiveDate)
      this.aboutData()
    },
    aboutData () {
      var that = this
      // 如果是新建或者修改的话，需要加入职务和品类选择，则需要加载对应的列表
      if (this.standardOcForm.operationType !== '2') {
        req('getTitleList').then(data => {
          that.titleList = data
        })
        // req('getCategoryList').then(data => {
        //   that.categoryList = data
        // })
      }
      if (this.standardOcForm.operationType !== '0' && this.$route.query.posStandardJobId) {
        this.standardOcForm.posStandardJobId = this.$route.query.posStandardJobId
        req('getJobDetailsById', {
          posStandardJobId: this.standardOcForm.posStandardJobId
        }).then(data => {
          delete data.effectiveDate
          if (this.standardOcForm.operationType === '1') {
            // 如果是修改的话，需要带出所有数据
            Object.assign(that.standardOcForm, data)
          }
          if (that.standardOcForm.operationType === '2') {
            // 如果是撤销，需要带过来名称
            if (that.$route.query.name) {
              that.standardOcForm.name = that.$route.query.name
            }
          }
        })
      }
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
    this.standardOcForm.operationType = getOperationTypeByProcess[this.$route.query.processType]
    // 获取该表单的操作是什么，判断是标准职位还是职位，新建还是修改等
    this.action = '标准职位' + operationName[this.standardOcForm.operationType]
    // 所属层数
    this.standardOcForm.jobFamilyType = Number(this.$route.query.jobFamilyType) || ''
    // 职群id
    this.standardOcForm.posJobFamilyId = Number(this.$route.query.posJobFamilyId) || ''
      // 职群名称
    this.standardOcForm.posJobFamilyName = this.$route.query.posJobFamilyName || ''
      // 职种id
    // this.standardOcForm.jobClassId = Number(this.$route.query.jobClassId) || ''
      // 职种名称
    // this.standardOcForm.jobClassName = this.$route.query.jobClassName || ''
      // 子职种id
    // this.standardOcForm.subJobClassId = Number(this.$route.query.subJobClassId) || ''
      // 子职种名称
    // this.standardOcForm.subJobClassName = this.$route.query.subJobClassName || ''
    this.aboutData()
  }
}
</script>

<style lang="scss" scoped>
</style>
