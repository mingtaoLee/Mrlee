/**
 * Created by ZHANZF on 2017-11-9.
 */
import request from '../../index'

export const config = {

  /** 薪资项目设置 */

  // 获取薪资项目列表
  getCompensationItemList: {
    url: '/compensation/basic/pay-projects',
    method: 'get'
  },
  // 更新薪资项目
  putCompensationItem: {
    url: '/compensation/basic/pay-projects/{componentId}',
    method: 'put'
  },
  // 根据id获取对应薪资项目
  getCompensationItem: {
    url: '/compensation/basic/pay-projects/{componentId}',
    method: 'get'
  },
  // 新增薪资项目
  postCompensationItem: {
    url: '/compensation/basic/pay-projects',
    method: 'post'
  },
  // 根据id删除对应薪资项目
  deleteCompensationItem: {
    url: '/compensation/basic/pay-projects/{componentId}',
    method: 'delete'
  },

  /** 计算规则设置 */
  // 获取员工计算规则列表
  getEmployeesRules: {
    url: '/compensation/basic/rules/employees',
    method: 'get'
  },
  getEmployeesRule: {
    url: '/compensation/basic/rules/employee',
    method: 'get'
  },
  // 项目计算规则下发到个人
  publishProjRules: {
    url: '/compensation/basic/rules/publish',
    method: 'post'
  },
  // 更新项目计算规则
  modifyProjRules: {
    url: '/compensation/basic/rules/{calculateRuleId}',
    method: 'put'
  },
  // 新增项目计算规则
  addProjRules: {
    url: '/compensation/basic/rules',
    method: 'post'
  },
  // 删除对应的项目计算规则
  deleteProjRules: {
    url: '/compensation/basic/rules/{calculateRuleId}',
    method: 'delete'
  },
  // 获取项目计算规则列表
  getProjRules: {
    url: '/compensation/basic/rules',
    method: 'get'
  },
  /** 工资套设置 */

  // 获取工资套列表
  getPayComponentList: {
    url: '/compensation/basic/pay-components',
    method: 'get'
  },
  // 新增工资套
  postPayComponent: {
    url: '/compensation/basic/pay-components',
    method: 'post'
  },
  // 根据id更新对应工资套
  putPayComponent: {
    url: '/compensation/basic/pay-components/{componentListId}',
    method: 'post'
  },
  // 根据id删除对应工资套
  deletePayComponent: {
    url: '/compensation/basic/pay-components/{componentListId}',
    method: 'delete'
  },
  // 根据id获取对应工资套
  getPayComponent: {
    url: '/compensation/basic/pay-components/{componentListId}',
    method: 'get'
  },
  getSalarySheetList: {
    url: '/compensation/basic/pay-components/{componentListId}/paysliplist',
    method: 'get'
  },
  putSalarySheet: {
    url: '/compensation/basic/pay-components/{componentListId}/paysliplist',
    method: 'put'
  },
  deleteSalarySheet: {
    url: '/compensation/basic/pay-components/{componentListId}/paysliplist/{payslipId}',
    method: 'delete'
  },
  // 获取薪资项目列表
  getPayItemList: {
    url: '/compensation/basic/pay-projects',
    method: 'get'
  },

  /** 户头设置页面 */

  // 获取户头列表
  getAccounts: {
    url: '/compensation/basic/accounts',
    method: 'get'
  },
  // 新增户头
  postAccounts: {
    url: '/compensation/basic/accounts',
    method: 'post'
  },
  // 根据id获取对应户头
  getAccount: {
    url: '/compensation/basic/accounts/{accountId}',
    method: 'get'
  },
  // 根据id更新对应户头
  putAccount: {
    url: '/compensation/basic/accounts/{accountId}',
    method: 'put'
  },
  // 根据id删除对应户头
  deleteAccount: {
    url: '/compensation/basic/accounts/{accountId}',
    method: 'delete'
  },
  // 获取户头设置-地方社保政策列表
  getSecurityPolicyDetail: {
    url: '/compensation/basic/accounts/{areaId}/areas',
    method: 'get'
  },
  // 根据地域id，户口性质householdCode，保险类型insuranceType获取五险一金信息详情
  getInsuranceInfo: {
    url: '/compensation/basic/accounts/insurance',
    method: 'get'
  },
  // 根据地域id获取保险列表与户口性质联动数据
  getOptionsByAreaId: {
    url: '/compensation/basic/accounts/{areaId}/insurance',
    method: 'get'
  },
  // 获取户头设置-保险列表
  getInsuranceList: {
    url: '/compensation/basic/accounts/{accountId}/policys',
    method: 'get'
  },
  // 新增户头设置-保险项
  postInsuranceList: {
    url: '/compensation/basic/accounts/{accountId}/policys',
    method: 'post'
  },
  // 根据id获取对应户头设置保险项
  getInsuranceDetail: {
    url: '/compensation/basic/accounts/{accountId}/policys/{accountPolicyId}',
    method: 'get'
  },
  // 根据id更新户头设置保险项
  putInsuranceDetail: {
    url: '/compensation/basic/accounts/{accountId}/policys/{accountPolicyId}',
    method: 'put'
  },
  // 删除户头设置-保险设置项
  deleteInsuranceDetail: {
    url: '/compensation/basic/accounts/{accountId}/policys/{accountPolicyId}',
    method: 'delete'
  },
  // 获取户头设置-失业保险年审列表
  getAnnualAuditList: {
    url: '/compensation/basic/accounts/unemployments',
    method: 'get'
  },
  // 新增户头设置-失业保险年审
  postAnnualAuditList: {
    url: '/compensation/basic/accounts/unemployments',
    method: 'post'
  },
  // 根据id更新户头设置-失业保险年审
  putAnnualAudit: {
    url: '/compensation/basic/accounts/unemployments/{unempAuditId}',
    method: 'put'
  },
  // 根据id删除户头设置-失业保险年审
  deleteAnnualAudit: {
    url: '/compensation/basic/accounts/unemployments/{unempAuditId}',
    method: 'delete'
  },
  // 根据id获取对应户头设置-失业保险
  getAnnualAudit: {
    url: '/compensation/basic/accounts/unemployments/{unempAuditId}',
    method: 'get'
  },
  // 户头合并
  postAccountsCombine: {
    url: '/compensation/basic/accounts/merging',
    method: 'post'
  },
  getTargetAccounts: {
    url: '/compensation/basic/accounts/merging/{accountType}',
    method: 'get'
  },

  /** 人事范围户头设置页面 */

  // 获取组织户头列表
  getOrgAccounts: {
    url: '/compensation/basic/personnel-accounts',
    method: 'get'
  },
  // 新增组织户头
  postOrgAccounts: {
    url: '/compensation/basic/personnel-accounts',
    method: 'post'
  },
  // 根据id获取对应组织户头
  getOrgAccount: {
    url: '/compensation/basic/personnel-accounts/{accountPersonnelId}',
    method: 'get'
  },
  // 根据id更新对应组织户头
  putOrgAccount: {
    url: '/compensation/basic/personnel-accounts/{accountPersonnelId}',
    method: 'put'
  },
  // 根据id删除对应组织户头
  deleteOrgAccount: {
    url: '/compensation/basic/personnel-accounts/{accountPersonnelId}',
    method: 'delete'
  },

  /** 无户头组织设置 */

  // 获取无户头组织列表
  getNoneAccountOrgs: {
    url: '/compensation/basic/personnel-accounts/noaccounts',
    method: 'get'
  },
  // 根据id获取对应无户头组织
  getNoneAccountOrg: {
    url: '/compensation/basic/personnel-accounts/noaccounts/{personnelGroupCode}',
    method: 'get'
  },
  // 根据id更新对应无户头组织
  putNoneAccountOrg: {
    url: '/compensation/basic/personnel-accounts/noaccounts/{personnelGroupCode}',
    method: 'put'
  },

  /** 联行号设置页面 */

  // 获取联行号列表页面
  getBankNumbers: {
    url: '/compensation/basic/bankings',
    method: 'get'
  },
  // 新增联行号
  postBankNumbers: {
    url: '/compensation/basic/bankings',
    method: 'post'
  },
  // 根据id更新对应联行号
  putBankNumber: {
    url: '/compensation/basic/bankings/{payBankingFirmId}',
    method: 'put'
  },
  // 根据id获取对应联行号
  getBankNumber: {
    url: '/compensation/basic/bankings/{payBankingFirmId}',
    method: 'get'
  },
  // 根据id删除对应联行号
  deleteBankNumber: {
    url: '/compensation/basic/bankings/{payBankingFirmId}',
    method: 'delete'
  },

  /** 薪资项目财务设置页面 */

  // 获取薪资项目财务属性列表
  getFinances: {
    url: '/compensation/basic/finances/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 新增薪资项目财务属性
  postFinances: {
    url: '/compensation/basic/finances',
    method: 'post'
  },
  // 根据id删除对应薪资财务属性
  deleteFinance: {
    url: '/compensation/basic/finances/{componentFinanceId}',
    method: 'delete'
  },
  // 根据id获取对应薪资财务属性
  getFinance: {
    url: '/compensation/basic/finances/{componentFinanceId}',
    method: 'get'
  },
  // 根据id更新对应薪资财务属性
  putFinance: {
    url: '/compensation/basic/finances/{componentFinanceId}',
    method: 'put'
  },

  /** 薪资组设置页面 */

  // 获取薪资组列表
  getSalaryGroups: {
    url: '/compensation/basic/groups',
    method: 'get'
  },
  // 新增薪资组
  postSalaryGroups: {
    url: '/compensation/basic/groups',
    method: 'post'
  },
  // 根据id删除对应薪资组
  deleteSalaryGroup: {
    url: '/compensation/basic/groups/{groupId}',
    method: 'delete'
  },
  // 根据id获取对应薪资组
  getSalaryGroup: {
    url: '/compensation/basic/groups/{groupId}',
    method: 'get'
  },
  // 根据id获取对应薪资组
  putSalaryGroup: {
    url: '/compensation/basic/groups/{groupId}',
    method: 'put'
  },
  // 根据id查询是否有人关联薪资组
  getPeoplGroup: {
    url: '/compensation/basic/groups/people/{groupId}',
    method: 'get'
  },
  // 搜索发薪主体
  // getCompanyCode: {
  //   url: '/compensation/basic/pay-account/companycode',
  //   method: 'get'
  // },
  // 搜索支付账号
  getPaymentCompanyCode: {
    url: '/compensation/basic/pay-account/companycode/payaccount/{paymentCompanyCode}',
    method: 'get'
  },
  // 搜索支付主体
  getPayment: {
    url: '/compensation/basic/pay-account/companycode/payment/{companyCode}',
    method: 'get'
  },

  /** 薪资组工资套设置页面 */

  // 根据薪资组id获取薪资组工资套列表
  getSalaryItems: {
    url: '/compensation/basic/groups/{groupId}/pay-components',
    method: 'get'
  },
  // 新增根据薪资组工资套
  postSalaryItems: {
    url: '/compensation/basic/groups/{groupId}/pay-components',
    method: 'post'
  },
  // 根据薪资组id和工资套id获取工资套详情
  getSalaryItem: {
    url: '/compensation/basic/groups/{groupId}/pay-components/{groupListId}',
    method: 'get'
  },
  // 根据薪资组id和工资套id删除对应工资套
  deleteSalaryItem: {
    url: '/compensation/basic/groups/{groupId}/pay-components/{groupListId}',
    method: 'delete'
  },
  // 根据薪资组id和工资套id更新对应工资套
  putSalaryItem: {
    url: '/compensation/basic/groups/{groupId}/pay-components/{groupListId}',
    method: 'put'
  },

  /** 薪档表页面 */

  // 获取薪资表列表
  getSalaryForms: {
    url: '/compensation/basic/salarys',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 新增薪档表
  postSalaryForms: {
    url: '/compensation/basic/salarys',
    method: 'post'
  },
  // 根据id获取对应薪档表
  getSalaryForm: {
    url: '/compensation/basic/salarys/{salaryMatrixId}',
    method: 'get'
  },
  // 根据id删除对应薪档表
  deleteSalaryForm: {
    url: '/compensation/basic/salarys/{salaryMatrixId}',
    method: 'delete'
  },
  // 根据id更新对应薪档表
  putSalaryForm: {
    url: '/compensation/basic/salarys/{salaryMatrixId}',
    method: 'put'
  },
  // 服装底薪
  getClothingList: {
    url: '/compensation/basic/clothings',
    method: 'get'
  },
  delClothingList: {
    url: '/compensation/basic/clothings/{id}',
    method: 'delete'
  },
  modifyClothingList: {
    url: '/compensation/basic/clothings/{id}',
    method: 'put'
  },
  getClothingDetailById: {
    url: '/compensation/basic/clothings/{id}',
    method: 'get'
  },
  addClothingList: {
    url: '/compensation/basic/clothings',
    method: 'post'
  },

  /** 公司支付账户 */
  // 获取公司支付账户列表
  getPayAccounts: {
    url: '/compensation/basic/pay-account',
    method: 'get'
  },
  // 新增公司支付账户
  postPayAccounts: {
    url: '/compensation/basic/pay-account',
    method: 'post'
  },
  // 根据id获取对应详情
  getPayAccount: {
    url: '/compensation/basic/pay-account/{companyAccountId}',
    method: 'get'
  },
  // 根据id删除对应公司支付账户
  deletePayAccount: {
    url: '/compensation/basic/pay-account/{companyAccountId}',
    method: 'delete'
  },
  // 根据id更新对应公司支付账户
  putPayAccount: {
    url: '/compensation/basic/pay-account/{companyAccountId}',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
