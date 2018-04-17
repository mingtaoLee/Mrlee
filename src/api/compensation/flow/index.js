/**
 * Created by ZHANZF on 2017-12-20.
 * 数据收集
 */
import request from '../../index'
export const config = {

  /** 原岗调薪流程页面 */

  // 时效数据列表获取
  getEmpAdjustSalary: {
    url: '/compensation/employee/salary-adjustment/{employeeId}',
    method: 'get'
  },

  // 后去短期激励方案
  getBestirPlans: {
    url: '/compensation/data/bestir-plans',
    method: 'get'
  },
  // 收银绩效奖惩项获取
  getCashPerfInfoList: {
    url: '/compensation/data/cashs/config',
    method: 'get'
  },
  // 利润分红(半年度)-根据员工id查询
  getProfitBonusInfoById: {
    url: '/compensation/data/ProfitBonus/info/{employeeId}',
    method: 'get'
  },
  // 政策调薪 查询调薪前信息
  getPolicyAdjust: {
    url: '/compensation/employee/policyadjust/{areaId}',
    method: 'get'
  },
  // 短期激励奖金包分配-查询当前人已通过的方案
  getBestirPlansAssignee: {
    url: '/compensation/data/bestir-plans/assignee',
    method: 'get'
  },
  // 短期激励奖金包分配-下发到个人-流程数据查询
  getBestirPlansStoreData: {
    url: '/compensation/data/bestir-plans/store/employees/{orgUnitId}',
    method: 'get'
  },
  // 根据员工id查询信息
  getEmpInfoById: {
    url: '/compensation/data/cashs/empInfo/{empEmployeeId}',
    method: 'get'
  },
  // 员工银行卡信息获取
  getEmpBankInfo: {
    url: '/compensation/employee/group/account/update/{empEmployeeId}',
    method: 'get'
  },
  // 新店利润分红流程数据获取
  getNewStoreBonus: {
    url: '/compensation/data/newProfitsBonus/data',
    method: 'put'
  },
  // 员工发薪主体流程获取员工发薪主体
  getMainAccountChange: {
    url: '/compensation/employee/empobject/{employeeId}',
    method: 'get'
  },
  // 工资差异流程根据employeeId获取更多信息（人事范围等）
  getWageDiffPersonnelInfo: {
    url: '/compensation/data/pays/info',
    method: 'get'
  },
  // OKR团队分红流程数据获取
  postWfPackageDetail: {
    url: '/compensation/data/okr-assessment-bonus-package/wf-package-detail',
    method: 'post'
  },
  // 获取额外支付导入数据
  getExtraPaymentImportData: {
    url: '/compensation/data/extraPays/importList',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
