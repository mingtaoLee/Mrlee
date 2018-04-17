/**
 * Created by ZHANZF on 2017-11-9.
 */
import request from '../index'

export const config = {

  /** 薪资项目设置 */

  // 获取薪资项目列表
  getCompensationItemList: {
    url: '/iaf/basic/pay-projects',
    method: 'get'
  },
  // 更新薪资项目
  putCompensationItem: {
    url: '/iaf/basic/pay-projects/{componentId}',
    method: 'put'
  },
  // 根据id获取对应薪资项目
  getCompensationItem: {
    url: '/iaf/basic/pay-projects/{componentId}',
    method: 'get'
  },
  // 新增薪资项目
  postCompensationItem: {
    url: '/iaf/basic/pay-projects',
    method: 'post'
  },
  // 根据id删除对应薪资项目
  deleteCompensationItem: {
    url: '/iaf/basic/pay-projects/{componentId}',
    method: 'delete'
  },

  /** 计算规则设置 */
  // 获取员工计算规则列表
  getEmployeesRules: {
    url: '/iaf/basic/rules/employees',
    method: 'get'
  },
  getEmployeesRule: {
    url: '/iaf/basic/rules/employee',
    method: 'get'
  },
  // 项目计算规则下发到个人
  publishProjRules: {
    url: '/iaf/basic/rules/publish',
    method: 'post'
  },
  // 更新项目计算规则
  modifyProjRules: {
    url: '/iaf/basic/rules/{calculateRuleId}',
    method: 'put'
  },
  // 新增项目计算规则
  addProjRules: {
    url: '/iaf/basic/rules',
    method: 'post'
  },
  // 删除对应的项目计算规则
  deleteProjRules: {
    url: '/iaf/basic/rules/{calculateRuleId}',
    method: 'delete'
  },
  // 获取项目计算规则列表
  getProjRules: {
    url: '/iaf/basic/rules',
    method: 'get'
  },
  /** 工资套设置 */

  // 获取工资套列表
  getPayComponentList: {
    url: '/iaf/basic/pay-components',
    method: 'get'
  },
  // 新增工资套
  postPayComponent: {
    url: '/iaf/basic/pay-components',
    method: 'post'
  },
  // 根据id更新对应工资套
  putPayComponent: {
    url: '/iaf/basic/pay-components/{componentListId}',
    method: 'post'
  },
  // 根据id删除对应工资套
  deletePayComponent: {
    url: '/iaf/basic/pay-components/{componentListId}',
    method: 'delete'
  },
  // 根据id获取对应工资套
  getPayComponent: {
    url: '/iaf/basic/pay-components/{componentListId}',
    method: 'get'
  },
  getSalarySheetList: {
    url: '/iaf/basic/pay-components/{componentListId}/paysliplist',
    method: 'get'
  },
  putSalarySheet: {
    url: '/iaf/basic/pay-components/{componentListId}/paysliplist',
    method: 'put'
  },
  deleteSalarySheet: {
    url: '/iaf/basic/pay-components/{componentListId}/paysliplist/{payslipId}',
    method: 'delete'
  },
  // 获取薪资项目列表
  getPayItemList: {
    url: '/iaf/basic/pay-projects',
    method: 'get'
  },

  /** 户头设置页面 */

  // 获取户头列表
  getAccounts: {
    url: '/iaf/basic/accounts/accountList',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 新增户头
  postAccounts: {
    url: '/iaf/basic/accounts',
    method: 'post'
  },
  // 新增户头自动赋权给新增人
  dataGrant: {
    url: 'system/dataGrant',
    method: 'post'
  },
  // 根据id获取对应户头
  getAccount: {
    url: '/iaf/basic/accounts/{accountId}',
    method: 'get'
  },
  // 根据id更新对应户头
  putAccount: {
    url: '/iaf/basic/accounts/{accountId}',
    method: 'put'
  },
  // 根据id删除对应户头
  deleteAccount: {
    url: '/iaf/basic/accounts/{accountId}',
    method: 'delete'
  },
   // 删除校验是否可删除
  accountByUsed: {
    url: '/iaf/public/insured/accountByUsed',
    method: 'get'
  },

  // 获取户头设置-地方社保政策列表
  getSecurityPolicyDetail: {
    url: '/iaf/basic/accounts/{areaId}/areas',
    method: 'get'
  },
  // 根据地域id，户口性质householdCode，保险类型insuranceType获取五险一金信息详情
  getInsuranceInfo: {
    url: '/iaf/basic/accounts/insurance',
    method: 'get'
  },
  // 根据地域id获取保险列表与户口性质联动数据
  getOptionsByAreaId: {
    url: '/iaf/basic/accounts/{areaId}/insurance',
    method: 'get'
  },
  // 获取户头设置-保险列表
  getInsuranceList: {
    url: '/iaf/basic/accounts/{accountId}/policy',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 新增户头设置-保险项
  postInsuranceList: {
    url: '/iaf/basic/accounts/{accountId}/policys',
    method: 'post'
  },
  // 根据id获取对应户头设置保险项
  getInsuranceDetail: {
    url: '/iaf/basic/accounts/{accountId}/policys/{accountPolicyId}',
    method: 'get'
  },
  // 根据id更新户头设置保险项
  putInsuranceDetail: {
    url: '/iaf/basic/accounts/{accountId}/policys/{accountPolicyId}',
    method: 'put'
  },
  // 删除户头设置-保险设置项
  deleteInsuranceDetail: {
    url: '/iaf/basic/accounts/{accountId}/policys/{accountPolicyId}',
    method: 'delete'
  },
  // 获取户头设置-失业保险年审列表
  getAnnualAuditList: {
    url: '/iaf/basic/accounts/unemployments',
    method: 'get'
  },
  // 新增户头设置-失业保险年审
  postAnnualAuditList: {
    url: '/iaf/basic/accounts/unemployments',
    method: 'post'
  },
  // 根据id更新户头设置-失业保险年审
  putAnnualAudit: {
    url: '/iaf/basic/accounts/unemployments/{unempAuditId}',
    method: 'put'
  },
  // 根据id删除户头设置-失业保险年审
  deleteAnnualAudit: {
    url: '/iaf/basic/accounts/unemployments/{unempAuditId}',
    method: 'delete'
  },
  // 根据id获取对应户头设置-失业保险
  getAnnualAudit: {
    url: '/iaf/basic/accounts/unemployments/{unempAuditId}',
    method: 'get'
  },
  // 户头合并
  postAccountsCombine: {
    url: '/iaf/basic/accounts/merging',
    method: 'post'
  },
  getTargetAccounts: {
    url: '/iaf/basic/accounts/merging/{accountType}',
    method: 'get'
  },

  /** 人事范围户头设置页面 */

  // 获取组织户头列表
  getOrgAccounts: {
    url: '/iaf/basic/personnel-accounts',
    method: 'get'
  },
  // 新增组织户头
  postOrgAccounts: {
    url: '/iaf/basic/personnel-accounts',
    method: 'post'
  },
  // 根据id获取对应组织户头
  getOrgAccount: {
    url: '/iaf/basic/personnel-accounts/{accountPersonnelId}',
    method: 'get'
  },
  // 根据id更新对应组织户头
  putOrgAccount: {
    url: '/iaf/basic/personnel-accounts/{accountPersonnelId}',
    method: 'put'
  },
  // 根据id删除对应组织户头
  deleteOrgAccount: {
    url: '/iaf/basic/personnel-accounts/{accountPersonnelId}',
    method: 'delete'
  },

  /** 无户头组织设置 */

  // 获取无户头组织列表
  getNoneAccountOrgs: {
    url: '/iaf/basic/personnel-accounts/noaccounts',
    method: 'get'
  },
  // 根据id获取对应无户头组织
  getNoneAccountOrg: {
    url: '/iaf/basic/personnel-accounts/noaccounts/{personnelGroupCode}',
    method: 'get'
  },
  // 根据id更新对应无户头组织
  putNoneAccountOrg: {
    url: '/iaf/basic/personnel-accounts/noaccounts/{personnelGroupCode}',
    method: 'put'
  },

  /** 联行号设置页面 */

  // 获取联行号列表页面
  getBankNumbers: {
    url: '/iaf/basic/bankings',
    method: 'get'
  },
  // 新增联行号
  postBankNumbers: {
    url: '/iaf/basic/bankings',
    method: 'post'
  },
  // 根据id更新对应联行号
  putBankNumber: {
    url: '/iaf/basic/bankings/{payBankingFirmId}',
    method: 'put'
  },
  // 根据id获取对应联行号
  getBankNumber: {
    url: '/iaf/basic/bankings/{payBankingFirmId}',
    method: 'get'
  },
  // 根据id删除对应联行号
  deleteBankNumber: {
    url: '/iaf/basic/bankings/{payBankingFirmId}',
    method: 'delete'
  },

  /** 薪资项目财务设置页面 */

  // 获取薪资项目财务属性列表
  getFinances: {
    url: '/iaf/basic/finances/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 新增薪资项目财务属性
  postFinances: {
    url: '/iaf/basic/finances',
    method: 'post'
  },
  // 根据id删除对应薪资财务属性
  deleteFinance: {
    url: '/iaf/basic/finances/{componentFinanceId}',
    method: 'delete'
  },
  // 根据id获取对应薪资财务属性
  getFinance: {
    url: '/iaf/basic/finances/{componentFinanceId}',
    method: 'get'
  },
  // 根据id更新对应薪资财务属性
  putFinance: {
    url: '/iaf/basic/finances/{componentFinanceId}',
    method: 'put'
  },

  /** 薪资组设置页面 */

  // 获取薪资组列表
  getSalaryGroups: {
    url: '/iaf/basic/groups',
    method: 'get'
  },
  // 新增薪资组
  postSalaryGroups: {
    url: '/iaf/basic/groups',
    method: 'post'
  },
  // 根据id删除对应薪资组
  deleteSalaryGroup: {
    url: '/iaf/basic/groups/{groupId}',
    method: 'delete'
  },
  // 根据id获取对应薪资组
  getSalaryGroup: {
    url: '/iaf/basic/groups/{groupId}',
    method: 'get'
  },
  // 根据id获取对应薪资组
  putSalaryGroup: {
    url: '/iaf/basic/groups/{groupId}',
    method: 'put'
  },
  // 根据id查询是否有人关联薪资组
  getPeoplGroup: {
    url: '/iaf/basic/groups/people/{groupId}',
    method: 'get'
  },
  // 搜索发薪主体
  getCompanyCode: {
    url: '/iaf/basic/pay-account/companycode',
    method: 'get'
  },
  // 搜索支付账号
  getPaymentCompanyCode: {
    url: '/iaf/basic/pay-account/companycode/payaccount/{paymentCompanyCode}',
    method: 'get'
  },
  // 搜索支付主体
  getPayment: {
    url: '/iaf/basic/pay-account/companycode/payment/{companyCode}',
    method: 'get'
  },

  /** 薪资组工资套设置页面 */

  // 根据薪资组id获取薪资组工资套列表
  getSalaryItems: {
    url: '/iaf/basic/groups/{groupId}/pay-components',
    method: 'get'
  },
  // 新增根据薪资组工资套
  postSalaryItems: {
    url: '/iaf/basic/groups/{groupId}/pay-components',
    method: 'post'
  },
  // 根据薪资组id和工资套id获取工资套详情
  getSalaryItem: {
    url: '/iaf/basic/groups/{groupId}/pay-components/{groupListId}',
    method: 'get'
  },
  // 根据薪资组id和工资套id删除对应工资套
  deleteSalaryItem: {
    url: '/iaf/basic/groups/{groupId}/pay-components/{groupListId}',
    method: 'delete'
  },
  // 根据薪资组id和工资套id更新对应工资套
  putSalaryItem: {
    url: '/iaf/basic/groups/{groupId}/pay-components/{groupListId}',
    method: 'put'
  },

  /** 薪档表页面 */

  // 获取薪资表列表
  getSalaryForms: {
    url: '/iaf/basic/salarys',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 新增薪档表
  postSalaryForms: {
    url: '/iaf/basic/salarys',
    method: 'post'
  },
  // 根据id获取对应薪档表
  getSalaryForm: {
    url: '/iaf/basic/salarys/{salaryMatrixId}',
    method: 'get'
  },
  // 根据id删除对应薪档表
  deleteSalaryForm: {
    url: '/iaf/basic/salarys/{salaryMatrixId}',
    method: 'delete'
  },
  // 根据id更新对应薪档表
  putSalaryForm: {
    url: '/iaf/basic/salarys/{salaryMatrixId}',
    method: 'put'
  },
  // 服装底薪
  getClothingList: {
    url: '/iaf/basic/clothings',
    method: 'get'
  },
  delClothingList: {
    url: '/iaf/basic/clothings/{id}',
    method: 'delete'
  },
  modifyClothingList: {
    url: '/iaf/basic/clothings/{id}',
    method: 'put'
  },
  getClothingDetailById: {
    url: '/iaf/basic/clothings/{id}',
    method: 'get'
  },
  addClothingList: {
    url: '/iaf/basic/clothings',
    method: 'post'
  },

  /** 公司支付账户 */
  // 获取公司支付账户列表
  getPayAccounts: {
    url: '/iaf/basic/pay-account',
    method: 'get'
  },
  // 新增公司支付账户
  postPayAccounts: {
    url: '/iaf/basic/pay-account',
    method: 'post'
  },
  // 根据id获取对应详情
  getPayAccount: {
    url: '/iaf/basic/pay-account/{companyAccountId}',
    method: 'get'
  },
  // 根据id删除对应公司支付账户
  deletePayAccount: {
    url: '/iaf/basic/pay-account/{companyAccountId}',
    method: 'delete'
  },
  // 根据id更新对应公司支付账户
  putPayAccount: {
    url: '/iaf/basic/pay-account/{companyAccountId}',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
