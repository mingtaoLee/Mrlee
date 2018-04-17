<template>
  <div>
    <!-- 基本信息 -->
    <info-template :title="'基本信息'" :data="formInfo"></info-template>

    <!-- 教育背景 -->
    <table-template
      :title="educationData.title"
      :columns="educationData.columns"
      :data="educationData.data"></table-template>

    <!-- 工作经历 -->
    <table-template
      :title="workData.title"
      :columns="workData.columns"
      :data="workData.data"></table-template>

    <!-- 家庭情况及主要社会关系 -->
    <table-template
      :title="familyData.title"
      :columns="familyData.columns"
      :data="familyData.data"></table-template>
  </div>
</template>
<script>
import infoTemplate from 'views/admin/pages/recruit/components/resume-detail/template/info'
import tableTemplate from 'views/admin/pages/recruit/components/resume-detail/template/table'
import moment from 'moment'
export default {
  name: 'ResumeDetail',
  components: {
    tableTemplate,
    infoTemplate
  },
  props: {
    detailTotalData: Object
  },
  data () {
    return {
      // 基本信息数据
      formInfo: [],
      // 教育背景数据
      educationData: {
        title: '教育背景',
        columns: [
          {
            prop: 'institution',
            label: '单位名称'
          },
          {
            prop: 'learnDate',
            label: '学习时间',
            width: 200
          },
          {
            prop: 'major',
            label: '专业',
            display: { dict: 'MAJOR' }
          },
          {
            prop: 'degree',
            label: '学位',
            display: { dict: 'DEGREE' }
          },
          {
            prop: 'certifier',
            label: '证明人'
          },
          {
            prop: 'phone',
            label: '联系方式'
          }
        ],
        data: []
      },
      // 工作经历数据
      workData: {
        title: '工作经历',
        columns: [
          {
            prop: 'company',
            label: '单位名称'
          },
          {
            prop: 'workDate',
            label: '工作时间',
            width: 200
          },
          {
            prop: 'positionName',
            label: '担任职务'
          },
          {
            prop: 'leaveReason',
            label: '离职原因'
          },
          {
            prop: 'witness',
            label: '证明人'
          },
          {
            prop: 'witnessContact',
            label: '联系方式'
          }
        ],
        data: []
      },
      // 家庭关系数据
      familyData: {
        title: '家庭情况及主要社会关系',
        columns: [
          {
            prop: 'name',
            label: '姓名'
          },
          {
            prop: 'relationship',
            label: '关系'
          },
          {
            prop: 'familyCompany',
            label: '工作单位'
          },
          {
            prop: 'position',
            label: '职务'
          },
          {
            prop: 'phone',
            label: '联系方式'
          }
        ],
        data: []
      }
    }
  },
  watch: {
    // 简历详情数据
    detailTotalData () {
      this.updateFormInfo()
      this.updateEducationData()
      this.updateWorkData()
      this.updateFamilyData()
    }
  },
  methods: {
    // 格式化时间
    dateFormat (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD')
      }
    },
    // 更新基本信息
    updateFormInfo () {
      this.formInfo = [
        {label: '姓名', value: this.detailTotalData.name},
        {label: '性别', value: this.detailTotalData.gender, dict: 'GENDER'},
        {label: '年龄', value: this.detailTotalData.age + ''},
        {label: '出生日期', value: this.dateFormat(this.detailTotalData.birthDate)},
        {label: '民族', value: this.detailTotalData.nation, dict: 'NATION'},
        {label: '籍贯', value: this.detailTotalData.domicilePlace},
        {label: '政治面貌', value: this.detailTotalData.politicsStatus, dict: 'POLITICS_STATUS'},
        {label: '婚姻状况', value: this.detailTotalData.maritalStatus, dict: 'MARITAL_STATUS'},
        {label: '户口性质', value: this.detailTotalData.domicileType, dict: 'DOMICILE_TYPE'},
        {label: '证件类型', value: this.detailTotalData.idType, dict: 'ID_TYPE'},
        {label: '证件号码', value: this.detailTotalData.idNumber},
        {label: '联系电话', value: this.detailTotalData.mobile},
        // {label: '外语程度', value: this.detailTotalData.foreignLanguages.foreignLanguage + '-' + this.detailTotalData.foreignLanguages.skilled},
        {label: '最高学历', value: this.detailTotalData.education, dict: 'EDUCATIONAL_BACKGROUND'},
        {label: '专业', value: this.detailTotalData.major},
        {label: '健康状况', value: this.detailTotalData.healthStatus},
        {label: '证件地址', value: this.detailTotalData.idAddress, span: 12},
        {label: '现通讯地址', value: this.detailTotalData.homeAddress, span: 12},
        {label: '紧急联系人', value: this.detailTotalData.contactMan},
        {label: '紧急联系人电话', value: this.detailTotalData.contactPhone}
      ]
    },
    // 更新教育背景
    updateEducationData () {
      let len = this.detailTotalData.educationBackgrounds.length
      let list = []
      let educationBackgrounds = null
      while (len--) {
        educationBackgrounds = this.detailTotalData.educationBackgrounds[len]
        educationBackgrounds.learnDate = (educationBackgrounds.admissionDate === null ? '' : this.dateFormat(educationBackgrounds.admissionDate)) + ' 至 ' + (educationBackgrounds.graduationDate === null ? '' : this.dateFormat(educationBackgrounds.graduationDate))
        list.push(educationBackgrounds)
      }
      this.educationData.data = list
    },
    // 更新工作经历
    updateWorkData () {
      let len = this.detailTotalData.experiences.length
      let list = []
      let experience = null
      while (len--) {
        experience = this.detailTotalData.experiences[len]
        experience.workDate = (experience.beginDate === null ? '' : this.dateFormat(experience.beginDate)) + ' 至 ' + (experience.endDate === null ? '' : this.dateFormat(experience.endDate))
        list.push(experience)
      }
      this.workData.data = list
    },
    // 更新家庭情况
    updateFamilyData () {
      this.familyData.data = this.detailTotalData.relations
    }
  }
}
</script>
