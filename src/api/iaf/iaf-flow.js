// 五险一金流程接口
import request from '../index.js'
export const config = {
  // 校验工号有效性
  validEmployeeCode: {
    url: '/iaf/public/insured/validEmployeeCode'
  },
  // 是否显示户口级别
  domicileLeve: {
    url: '/iaf/public/householdCode'
  },
  // 是否可减员
  isIafDecreaseUpdate: {
    url: '/iaf/public/insured/isIafDecreaseUpdate'
  },
  // 是否可增员
  isInsertIaf: {
    url: '/iaf/public/insured/isInsertIaf'
  },
  // 是否可调基
  isIafInsertBase: {
    url: '/iaf/public/insured/isIafInsertBase'
  },
  // 通过员工工号自动获取基本信息
  iafEmployeeBase: {
    url: '/iaf/public/insured/iafEmployeeBase'
  },
  // 获取五险一金基数
  iafPayBase: {
    url: '/iaf/public/insured/iafPayBase'
  },
  // 获取减员流程五险一金基数
  iafPayBaseForDecreasing: {
    url: '/iaf/public/insured/iafPayBaseForDecreasing'
  },
  // 获取五险一金增员可申请险种
  applyType: {
    url: '/iaf/public/insured/applyTypeByEmployeeCode'
  },
  // // 获取五险一金增员可申请险种
  // insuranceTypeByEmployeeCode: {
  //   url: '/iaf/public/insured/insuranceTypeByEmployeeCode'
  // },
  // 获取五险一金增员可申请险种后来
  iafValidInscreasing: {
    url: '/iaf/public/insured/iafValidInscreasing'
  },
  // 获取五险一金减员可申请险种
  decreasedInsuranceTypeByEmployeeCode: {
    url: '/iaf/public/insured/decreasedInsuranceTypeByEmployeeCode'
  },
  // 获取员工是否购买五险
  iafInsuranceState: {
    url: '/iaf/public/insured/iafInsuranceState'
  },
  // 获取员工是否购买公积金
  iafHpfundState: {
    url: '/iaf/public/insured/iafHpfundState'
  },
  // 获取员工是否购买七险一金
  iafValidTransfering: {
    url: '/iaf/public/insured/iafValidTransfering'
  },
  // 获取员工五险缴纳数据
  iafInsuranceLastPayBase: {
    url: '/iaf/public/insured/iafInsuranceLastPayBase'
  },
  // 获取员工公积金缴纳数据
  iafHpfundLastPayBase: {
    url: '/iaf/public/insured/iafHpfundLastPayBase'
  },
  // 获取员工公积金缴纳数据
  iafEndowmentPayBaseByAreaId: {
    url: '/iaf/public/insured/iafEndowmentPayBaseByAreaId'
  },
  // 五险一金商业险流程带出员工信息
  iafCommercial: {
    url: '/iaf/public/insured/iafEmployeeBase',
    method: 'get'
  },
  // 五险一金商业险流程带出accountid
  iafCommercialEmployeeId: {
    url: '/iaf/public/insured/findEmployeeId',
    method: 'get'
  },
  // 五险一金工伤流程基本信息带出
  iafJobBasicMsg: {
    url: '/iaf/insured/{employeeCode}/findBaseInformation',
    method: 'get'
  },
  // 五险一金医疗流程基本信息带出
  iafMedicalMsg: {
    url: '/iaf/insured/{employeeCode}/findMedicalBaseInformation',
    method: 'get'
  },
  iafGetEmployeeId: {
    url: '/iaf/public/insured/findEmployeeId',
    method: 'get'
  },
  // 五险一金退休流程获取员工id
  iafRetireGetEmpId: {
    url: '/iaf/public/insured/findEmployeeId',
    method: 'get'
  },
  // 五险一金退休流程获取员工id
  findInsuranceTypeByEmployeeCode: {
    url: '/iaf/insured/retirement/{employeeCode}/findInsuranceTypeByEmployeeCode',
    method: 'get'
  },
  // 五险一金流程获取员工基本信息
  iafRetireBasicData: {
    url: '/employee/employees/{empEmployeeId}/employeebaseInfo',
    method: 'get'
  },
  // 生育流程通过员工编号获取员工id
  iafGetEmpId: {
    url: '/iaf/public/insured/findEmployeeId',
    method: 'get'
  },
  // 生育流程获取员工基本信息
  iafMaternityBasicData: {
    url: '/iaf/insured/{employeeCode}/findProcreationBaseInformation',
    method: 'get'
  },
  // 退休流程通过工号带出基本信息接口
  iafGetEmpAccount: {
    // url: '/iaf/public/insured/findInsuranceAccountId',
    url: '/iaf/insured/retirement/{employeeCode}/retirementBaseInfomation',
    method: 'get'
  },
  // 公积金提取带出基本信息接口
  fundExtractGetBasicMsg: {
    url: '/iaf/public/insured/iafEmployeeBase',
    method: 'get'
  },
  // // 个人补缴申报通过员工id获取基本信息
  // iafEmpIdGetBasicMsg: {
  //   url: '/employee/employees/{empEmployeeId}/employeebaseInfo',
  //   method: 'get'
  // },
  // 个人补缴申报通过员工id获取基本信息
  iafEmpIdGetBasicMsg: {
    url: '/iaf/public/insured/iafEmployeeBaseByEmployeeId',
    method: 'get'
  },
  // 个人补缴流程弹出框确定按钮请求表格数据
  iafDeclareGetData: {
    url: '/iaf/public/insured/findIafPersonalAccountMessage',
    method: 'get'
  },
  // 工伤险通过工号带出工伤说明部分信息
  iafJobExplainMsg: {
    url: '/iaf/insured/employeeInformation',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = false) {
  return request(config, funcName, data, isToken, isCancel)
}
