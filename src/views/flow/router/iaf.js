const iafResetBase = () => import('../pages/iaf/reset-base/index')
const iafMemberAdd = () => import('../pages/iaf/member-add')
const iafMemberDecrease = () => import('../pages/iaf/member-decrease')
const iafTransfer = () => import('../pages/iaf/iaf-transfer/index')
const iafPayment = () => import('../pages/iaf/iaf-payment')
// const iafPayBackBatch = () => import('../pages/iaf/pay-back-batch')
const iafPayBack = () => import('../pages/iaf/pay-back')
// const fundPayment = () => import('../pages/iaf/fund-payment')
// const fundExtra = () => import('../pages/iaf/fund-extra')
const employmentInjury = () => import('../pages/iaf/employment-injury')
const maternity = () => import('../pages/iaf/maternity')
const medicare = () => import('../pages/iaf/medicare')
const retire = () => import('../pages/iaf/retire')
// const commercial = () => import('../pages/iaf/commercial')
export default [
  {
    path: 'iafUpdateBaseFlow',
    name: '五险一金调基流程',
    hide: true,
    component: iafResetBase
  },
  {
    path: 'iafAddMemberFlow',
    name: '五险一金增员挂靠流程',
    hide: true,
    component: iafMemberAdd
  },
  {
    path: 'iafDecreaseMemberFlow',
    name: '五险一金减员申请流程',
    hide: true,
    component: iafMemberDecrease
  },
  {
    path: 'iafTransferMemberFlow',
    name: '五险一金转移流程',
    hide: true,
    component: iafTransfer
  },
  // {
  //   path: 'iafHpfundApplicationFlow',
  //   name: '公积金申报缴费流程',
  //   hide: true,
  //   component: fundPayment
  // },
  // {
  //   path: 'iafReservedFundExtractFlow',
  //   name: '公积金提取流程',
  //   hide: true,
  //   component: fundExtra
  // },
  {
    path: 'iafWorkingInjuryFlow',
    name: '工伤工亡申报流程',
    hide: true,
    component: employmentInjury
  },
  {
    path: 'iafProcreationFlow',
    name: '生育险申报流程',
    hide: true,
    component: maternity
  },
  {
    path: 'iafMedicalFlow',
    name: '医疗申报流程',
    hide: true,
    component: medicare
  },
  {
    path: 'iafRetirementInsuranceApplicationFlow',
    name: '退休保险申请流程',
    hide: true,
    component: retire
  },
  // {
  //   path: 'iafAddCommerceFlow',
  //   name: '商业险申报流程',
  //   hide: true,
  //   component: commercial
  // },
  {
    path: 'iafInsuranceApplicationFlow',
    name: '社保申报缴费流程',
    hide: true,
    component: iafPayment
  },
  // {
  //   path: 'iafComplementarityFlow',
  //   name: '社保补缴流程',
  //   hide: true,
  //   component: iafPayBackBatch
  // },
  {
    path: 'iafComplementarityPersonalFlow',
    name: '个人社保补缴流程',
    hide: true,
    component: iafPayBack
  }
]
