module.exports = {
  employeebaseInfo: {
    fullName: { value: '', label: '姓名', disabled: false, prop: 'fullName' },
    employeeCode: { value: '', label: '员工工号', disabled: true, forbid: true, prop: 'employeeCode' },
    idType: { value: '', label: '证件类型', disabled: true, par: 'DOCUMENT_TYPE', prop: 'idType', select: true, forbid: true },
    idNumber: { value: '', label: '证件号码', disabled: true, forbid: true, prop: 'idNumber' },
    // employeeCode: { value: '', label: '工号', disabled: true, forbid: true, prop: 'employeeCode' },
    issuingAuthority: { value: '', label: '证件签发机构', disabled: false, prop: 'issuingAuthority' },
    idBeginDate: { value: '', label: '证件有效期', disabled: false, prop: 'idBeginDate', option: { flag: true }, index: 1 },
    idEndDate: { value: '', label: '至', disabled: false, prop: 'idEndDate', option: { flag: true } },
    mobile: { value: '', label: '手机号码', disabled: false, prop: 'mobile' },
    beginWorkDate: { value: '', label: '参加工作时间', disabled: true, prop: 'beginWorkDate', option: { flag: true }, forbid: true },
    email: { value: '', label: '邮箱', disabled: false, showEmail: true, prop: 'email' },
    gender: { value: '', label: '性别', disabled: false, par: 'GENDER', select: true, prop: 'gender' },
    nation: { value: '', label: '民族', disabled: false, par: 'NATION', select: true, prop: 'nation' },
    birthDate: { value: '', label: '出生日期', disabled: true, option: { flag: true }, forbid: true, prop: 'birthDate' },
    // age: { value: '', label: '年龄', disabled: true, prop: 'age', forbid: true },
    //  婚姻状况
    maritalStatus: { value: '', label: '婚姻状况 ', disabled: false, par: 'MARITAL_STATUS', select: true, prop: 'maritalStatus' },
    // 政治面貌
    politicsStatus: { value: '', label: '政治面貌', disabled: false, par: 'POLITICS_STATUS', select: true, prop: 'politicsStatus' },
    areaCitizenship: { value: '', label: ' 国籍/地区', disabled: false, par: 'COUNTRY', select: true, prop: 'areaCitizenship' },
    domicileType: { value: '', label: '户口性质', disabled: false, par: 'DOMICILE_TYPE', select: true, prop: 'domicileType' },
    // employeeType: {value: '', label: '用工类型', disabled: true, par: 'EMPLOYEE_TYPE', select: true, forbid: true, prop: 'employeeType'},
    // posPositionName: { value: '', label: '职位', disabled: true, forbid: true, prop: 'posPositionName' },
    // hireDate: { value: '', label: '入职日期', disabled: true, option: { flag: true }, forbid: true, prop: 'hireDate' },
    domicilePlace: { value: '', label: '籍贯', disabled: false, prop: 'domicilePlace' },
    // institution: { value: '', label: '毕业学院', disabled: false },
    // healthyCondition: { value: '', label: '健康状况', disabled: false, prop: 'healthyCondition', par: 'WHETHER_TYPE', select: true },
    // hadInfectious: { value: '', label: '有无传染病史', disabled: false, par: 'HAVE_OR_NOT', select: true, prop: 'hadInfectious' },
    idRegisteredAddress: { value: '', label: '证件住址', disabled: false, type: 'textarea', prop: 'idRegisteredAddress', size: 24 },
    // homePhone: {value: '', label: '家庭电话', disabled: false},
    homeAddress: { value: '', label: '现居地址', disabled: false, prop: 'homeAddress', type: 'textarea', size: 24 },
    photoPath: { value: '', display: true }

    // emergencyContact: {value: '', label: '紧急联系人', disabled: false},
    // emergencyContactPhone: {value: '', label: '紧急联系人联系方式', disabled: false}
    // posPositionId: {value: '', label: '职位编号', disabled: false}
  },
  empPosition: {
    employeeSource: { value: '', label: '招聘渠道', disabled: true, prop: 'employeeSource', select: true, par: 'EMPLOYEE_SOURCE' },
    orgUnitName: { value: '', label: '所属组织', disabled: true, prop: 'orgUnitName' },
    posJobFamilyName: { value: '', label: '职群', disabled: true, prop: 'posJobFamilyName' },
    posTitleName: { value: '', label: '职务', disabled: true, prop: 'posTitleName' },
    posPositionName: { value: '', label: '职位', disabled: true, prop: 'posPositionName' },
    artisanLevel: { value: '', label: '技工等级', disabled: true, prop: 'artisanLevel', select: true, par: 'ARTISAN_LEVEL' },
    employeeType: { value: '', label: '用工类型', disabled: true, prop: 'employeeType', select: true, par: 'EMPLOYEE_TYPE' },
    personnelGroupName: { value: '', label: '人事范围', disabled: true, prop: 'personnelArea' },
    workSystem: { value: '', label: '工作制', disabled: true, prop: 'workSystem', select: true, par: 'WORK_SYSTEM' },
    revenueType: { value: '', label: '员工税类型', disabled: true, prop: 'revenueType', select: true, par: 'REVENUE_TYPE' },
    hireDate: { value: '', label: '入职日期', disabled: true, prop: 'hireDate', option: true }
    // workAddress: { value: '', label: '办公地点', disabled: true, prop: 'workAddress', type: 'address' }
  },
  healthyInfo: {
    isHandicapped: { value: '', label: '是否残疾人', disabled: false, prop: 'isHandicapped', par: 'WHETHER_TYPE', show: true },
    handicappedGroup: { value: '', label: '伤残组', disabled: false, prop: 'handicappedGroup', par: 'HANDICAPPED_GROUP', show: false },
    handicappedType: { value: '', label: '伤残类型', disabled: false, prop: 'handicappedType', par: 'DISABILITY_GRADE', show: false },
    isVeteran: { value: '', label: '是否退伍军人', disabled: false, prop: 'isVeteran', par: 'WHETHER_TYPE', show: true },
    healthyCondition: { value: '', label: '健康状况', disabled: false, prop: 'healthyCondition', par: 'WHETHER_TYPE', show: true },
    hadInfectious: { value: '', label: '有无传染病史', disabled: false, prop: 'hadInfectious', par: 'HAVE_OR_NOT', show: true },
    hadSeriousDisease: { value: '', label: '有无重大疾病史', disabled: false, prop: 'hadSeriousDisease', par: 'HAVE_OR_NOT', show: true }
  },

  navbarList: [
    { title: '基本信息', ref: 'employeebaseInfo', top: 0 },
    { title: '岗位信息', ref: 'empPosition', top: 0 },
    { title: '其他信息', ref: 'healthyInfo', top: 0 },
    { title: '家庭成员', ref: 'empFamilyMember', top: 0 },
    { title: '教育信息', ref: 'empEducation', top: 0 },
    { title: '工作经历', ref: 'empWorkExperience', top: 0 },
    // { title: '培训信息', ref: 'empTraining', top: 0 },
    { title: '资格证书', ref: 'empCredential', top: 0 },
    { title: '异动信息', ref: 'empStaffRecordById', top: 0 },
    { title: '奖惩信息', ref: 'empRewards', top: 0 },
    { title: '定岗信息', ref: 'empDetermine', top: 0 },
    { title: '生鲜卖手标识信息', ref: 'empFreshSelling', top: 0 },
    { title: '历史记录', ref: 'empHistoryForm', top: 0 }
  ]
}
