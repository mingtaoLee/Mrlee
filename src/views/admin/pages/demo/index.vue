<template>
  <div>
    <i-layout>
      <div slot="section">
        <i-select-area search type="yonghui" v-model="ids" @change="change" multiple></i-select-area>
        <!-- <i-personnel-select :isShow="true" :multiple="false" @confirm="handleConfirm" :defaultExpandedKeys="['org10014']"></i-personnel-select> -->
        <!-- <i-select-field :columns="columns" @change="change"></i-select-field> -->
        <!-- <i-search-conditions :columns="columns"></i-search-conditions> -->
      </div>
    </i-layout>
  </div>
</template>

<script>
import ILayout from 'components/common/i-layout'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import ISelectArea from 'components/common/i-select-area'

export default {
  name: 'Demo',
  data () {
    return {
      personnels: '',
      ids: ['8ac98f876044f60201604501ca640005'],
      columns: [
          { prop: 'employeeCode', label: '工号', width: 200, align: 'center' },
          { prop: 'orgUnitName', label: '归属组织', width: 200 },
          { prop: 'costCenter', label: '成本中心', width: 140 },
          { prop: 'parentEmployeeName', label: '直属领导', width: 160 },
          { prop: 'positionName', label: '职位', width: 250 },
          { prop: 'idType', label: '证件类型', width: 150, display: { dict: 'DOCUMENT_TYPE' } },
          { prop: 'idNumber', label: '证件号码', width: 200, align: 'center' },
          { prop: 'gender', label: '性别', width: 100, display: { dict: 'GENDER' }, align: 'center' },
          { prop: 'nation', label: '民族', width: 140 },
          { prop: 'birthDate', label: '出生日期', value: '', width: 200, display: { date: '' }, align: 'center' },
          { prop: 'age', label: '年龄', width: 100, align: 'center' },
          { prop: 'compAge', label: '司龄', width: 100, align: 'center' },
          { prop: 'maritalStatus', label: '婚姻状态', width: 120, display: { dict: 'MARITAL_STATUS' } },
          { prop: 'politicsStatus', label: '政治面貌', width: 250, display: { dict: 'POLITICS_STATUS' } },
          { prop: 'areaCitizenship', label: ' 国籍/地区', width: 160, display: { dict: 'COUNTRY' } },
          { prop: 'email', label: '电子邮箱', width: 250 },
          { prop: 'employeeType', label: '用工类型', width: 150, display: { dict: 'EMPLOYEE_TYPE' } },
          { prop: 'employeeStatus', label: '员工状态', width: 120, display: { dict: 'EMPLOYEE_STATUS' } },
          { prop: 'isTransfer', label: '是否借调', width: 150, display: { dict: 'WHETHER_TYPE' }, align: 'center' },
          { prop: 'employeeSource', label: '招聘来源', width: 150, display: { dict: 'EMPLOYEE_SOURCE' } },
          { prop: 'posTitleId', label: '职务', width: 180 },
          { prop: 'artisanLevel', label: '技工等级', width: 180, display: { dict: 'ARTISAN_LEVEL' } },
          { prop: 'revenueType', label: '税收类型', width: 180, display: { dict: 'REVENUE_TYPE' } },
          { prop: 'workSystem', label: '工作制', width: 180, display: { dict: 'WORK_SYSTEM' } },
          { prop: 'beginWorkDate', label: '开始工作日期', width: 180, display: { date: '' }, align: 'center' },
          { prop: 'hireDate', label: '入职日期', width: 180, display: { date: '' }, align: 'center' },
          { prop: 'probationType', label: '试用期期限类型', width: 180 },
          // TODO: 业务需要合并为“转正日期” probation
          // { prop: 'probationDateBegin', label: '转正日期', width: 180, display: { date: '' } },
          // { prop: 'probationDateEnd', label: '转正日期', width: 180, display: { date: '' } },
          { prop: 'probationSalary', label: '试用期薪资', width: 150, align: 'right' },
          { prop: 'regularSalary', label: '转正薪资', width: 150, align: 'right' },
          { prop: 'domicilePlace', label: '户籍地', width: 180 },
          { prop: 'domicileType', label: '户籍性质', width: 180, display: { dict: 'DOMICILE_TYPE' } },
          { prop: 'homeAddress', label: '现居住地址', width: 220 },
          { prop: 'idRegisteredAddress', label: '身份证详细地址', width: 280 },
          { prop: 'mobile', label: '联系电话', width: 180, align: 'center' },
          { prop: 'emergencyContact', label: '紧急联系人', width: 180 },
          { prop: 'emergencyContactPhone', label: '紧急联系人电话', width: 180, align: 'center' },
          { prop: 'institution', label: '最高学历学校', width: 180 },
          { prop: 'major', label: '最高学历专业', width: 180 },
          { prop: 'graduationDate', label: '毕业时间', width: 180, display: { date: '' }, align: 'center' },
          { prop: 'degree', label: '最高学历', width: 180, display: { dict: 'EDUCATIONAL_BACKGROUND' } },
          { prop: 'certificateNumber', label: '学位证书', width: 180, display: { dict: 'DEGREE' } },
          { prop: 'isHandicapped', label: '是否残疾人', width: 120, display: { dict: 'WHETHER_TYPE' }, align: 'center' },
          { prop: 'handicappedGroup', label: '伤残组', width: 180, display: { dict: 'HANDICAPPED_GROUP' } },
          { prop: 'isVeteran', label: '是否退伍军人', width: 150, display: { dict: 'WHETHER_TYPE' }, align: 'center' },
          { prop: 'healthyCondition', label: '身体状况', width: 180 },
          { prop: 'hadInfectious', label: '有无传染病史', width: 160, display: { dict: 'HAVE_OR_NOT' }, align: 'center' },
          { prop: 'hadSeriousDisease', label: '有无重大疾病', width: 160, display: { dict: 'HAVE_OR_NOT' }, align: 'center' },
          { prop: 'handicappedType', label: '伤残类型', width: 180, display: { dict: 'DISABILITY_GRADE' } }
      ]
    }
  },
  components: {
    ILayout,
    iPersonnelSelect,
    ISelectArea
  },
  methods: {
    handleConfirm (selected) {
      this.personnels = selected.map(item => { item.employeeName }).toString()
    },
    change (item) {
      // console.log(item)
    }
  }
}
</script>
