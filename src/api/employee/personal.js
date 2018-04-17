import request from '../index.js'

export const config = {
  postRoster: {
    url: '/employee/employees/roster',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 检查流程是否在进行
  getFlowStatus: {
    url: '/employee/employees/process/check',
    method: 'get'
  },
  // 查询员工基本信息
  getEmployeebaseInfo: {
    url: '/employee/employees/{empEmployeeId}/employeebaseInfo',
    method: 'get'
  },
      // 根据被联保人部门或ID检查是否存在可选联保人
  getOptionalCosurety: {
    url: '/employee/suretys/surety/optional',
    method: 'get'
  },
      // 根据被联保人部门或ID检查是否存在必选联保人
  getEssentialCosurety: {
    url: '/employee/suretys/surety/essential',
    method: 'get'
  },
  // 查询家庭信息
  getEmpFamilyMember: {
    url: 'employee/employees/{empEmployeeId}/empFamilyMember',
    method: 'get'
  },
  // 查询教育信息
  getEmpEducation: {
    url: '/employee/employees/{empEmployeeId}/empEducation',
    method: 'get'
  },
  // 查询历史记录
  getHistoryInfo: {
    url: '/employee/operate/logs/{empEmployeeId}',
    method: 'get'
  },
  // 工作经历
  getEmpWorkExperience: {
    url: '/employee/employees/{empEmployeeId}/empWorkExperience',
    method: 'get'
  },
  // 职位
  getEmpPosition: {
    url: '/employee/employees/{empEmployeeId}/empPosition',
    method: 'get'
  },
  // 其他信息
  getHealthyInfo: {
    url: '/employee/employees/{empEmployeeId}/healthy',
    method: 'get'
  },
  // 异动管理首页获取
  getEmpStaffRecordById: {
    url: '/employee/employees/{empEmployeeId}/empStaffRecord',
    method: 'get'
  },
  getEmpCredential: {
    url: '/employee/employees/{empEmployeeId}/empCredential',
    method: 'get'
  },
  // 奖惩信息
  getEmpRewards: {
    url: '/employee/employees/{empEmployeeId}/empRewardsPenalties',
    method: 'get'
  },
  // 定岗信息
  getEmpDetermine: {
    url: '/employee/employees/{empEmployeeId}/empDeterminePost',
    method: 'get'
  },
  // 生鲜标识
  getEmpFreshSelling: {
    url: '/employee/employees/{empEmployeeId}/empFreshSellingHandLogo',
    method: 'get'
  },
  // 根据身份证获取人员信息
  getEmpInfoByCard: {
    url: '/employee/employees/hire/validateInBlack',
    method: 'get'
  },
  // 获取码表的对应的内容
  getDistCode: {
    url: '/public-access/dicts/{dictCode}/items',
    method: 'get'
  },
  // 一次性全部提交履历表的内容
  putAllInfo: {
    url: '/employee/employees',
    method: 'put'
  },
  // 提交基础信息
  putEmployeebaseInfo: {
    url: '/employee/employees/employeebaseInfo',
    method: 'put'
  },

  putEmpFamilyMember: {
    url: '/employee/employees/empFamilyMember',
    method: 'put'
  },
  // 异动管理首页信息获取
  getEmpStaffRecord: {
    url: '/employee/employees',
    method: 'get'
  },
  // 员工登记
  postHireInfo: {
    url: '/employee/employees/hire/submission',
    method: 'post'
  },
  // 根据组织ID获取该组织下的职位
  getPosList: {
    url: '/org/pos/positions/emp/{orgUnitId}/posList',
    method: 'get'
  },
  // 根据组织ID获取人事范围，组织名字，公司名字
  getArea: {
    url: '/org/orgs/{id}/personnel/area',
    method: 'get'
  },
  // 根据组织ID判断集群
  getCluster: {
    url: '/org/public/checkClusterBelonging',
    method: 'get'
  },
  // 根据职位id获取标准职位和职群
  getPositions: {
    url: '/org/pos/positions/{posPositionId}',
    method: 'get'
  },
  // 获取可用人事范围
  getPersonnelGroup: {
    url: '/common/personnelGroup/usable',
    method: 'get'
  },
  getEmployeeCompany: {
    url: '/common/personnelGroup/{personnelGroupCode}',
    method: 'get'
  },
  // 获取薪资组列表
  getSarayList: {
    url: '/compensation/basic/groups/groupsearch',
    method: 'get'
  },
   // 获取兼职列表
  getConcurrentOrgUnitList: {
    url: '/employee/concurrents/job',
    method: 'get'
  },
  // 新增兼职
  newEmployeePartTime: {
    url: '/employee/concurrents/job',
    method: 'post'
  },
  // 结束兼职
  stopEmployeePartTime: {
    url: '/employee/concurrents/job',
    method: 'delete'
  },
  // 获取五险一金的接口
  getInsuranceInfo: {
    url: '/iaf/public/insured/findAccountData',
    method: 'post'
  },
  // 获取区域id
  getInsuranceCity: {
    url: '/common/personnelGroup/{personnelGroupCode}/area',
    method: 'get'
  },
  // 入职&返聘
  putHireInfo: {
    url: '/employee/employees/hire/submission',
    method: 'put'
  },
  checkIsSurety: {
    url: '/employee/employees/check/surety/{posTitleId}',
    method: 'get'
  },
  // 检查银行卡号
  checkBankNumber: {
    url: '/compensation/employee/group/account/check',
    method: 'post'
  },
  // 是否显示户口等级
  getDomicileGrade: {
    url: '/iaf/public/findHouseholdLevel',
    method: 'post'
  },
  // 根据area_type获取省份地区
  getProvince: {
    url: 'public-access/areas/province',
    method: 'get'
  },
  getSalary: {
    url: 'compensation/basic/groups/groupsearchdup',
    method: 'get'
  },
  getLowestSalary: {
    url: 'public-access/employees/lowest-salary/{personnelGroupCode}',
    method: 'get'
  },
  // 根据area_code获取省份下面的地区县
  getCity: {
    url: '/public-access/areas/{code}/code/child',
    method: 'get'
  },
  // 转正提交
  putConversion: {
    url: '/employee/employees/regular/submit',
    method: 'put'
  },
  // 转正信息获取
  'getConversionInfo': {
    url: '/employee/employees/{empEmployeeId}/regular',
    method: 'get'
  },
  // 离职信息获取
  getDimissionInfo: {
    url: '/employee/employees/{empEmployeeId}/dimission',
    method: 'get'
  },
  // 离职账单列表获取
  getFinancilList: {
    url: '/employee/employees/fix/info',
    method: 'get'
  },
  getFinancilPersonList: {
    url: '/employee/profitEmployees/{employeeId}',
    method: 'get'
  },
  // 离职提交
  putDimission: {
    url: '/employee/employees/dimission',
    method: 'put'
  },
  // 调动前信息获取
  getTransfer: {
    url: '/employee/employees/{empEmployeeId}/transfer',
    method: 'get'
  },
  // 调动提交
  putTransfer: {
    url: '/employee/employees/transfer',
    method: 'put'
  },
  // 批量调动根据员工id获取调动员工信息
  postTransferIds: {
    url: '/employee/employees/transfers',
    method: 'post'
  },
  // 批量调动提交
  putMultiTransfer: {
    url: '/employee/employees/transfers',
    method: 'put'
  },
  // 批量调动导入
  getImportsData: {
    url: '/employee/employees/getImportsData/{importsDataKey}',
    method: 'get'
  },
  // 根据部门id取部门名字&信息
  getOrgUnitName: {
    url: '/org/orgs/organizations',
    method: 'get'
  },
    // 根据工号查找该员工的id
  getEmployeeId: {
    url: 'employee/findEmployeeIdByCode',
    method: 'get'
  },
  // 搜索方案的增删改查
  getSearchTemplate: {
    url: '/employee/employees/search/template',
    method: 'get'
  },
  postSearchTemplate: {
    url: '/employee/employees/search/template',
    method: 'post'
  },
  putSearchTemplate: {
    url: '/employee/employees/search/template',
    method: 'put'
  },
  deleteSearchTemplate: {
    url: '/employee/employees/search/template/{templateId}',
    method: 'delete'
  },
  getOneSearchTemplate: {
    url: '/employee/employees/search/template/{templateId}',
    method: 'get'
  },
  postSearchTemplateData: {
    url: '/employee/employees/search/template/find',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 花名册模版的增删改查
  getRosterTemplate: {
    url: '/employee/employees/roster/template',
    method: 'get'
  },
  postRosterTemplate: {
    url: '/employee/employees/roster/template',
    method: 'post'
  },
  putRosterTemplate: {
    url: '/employee/employees/roster/template',
    method: 'put'
  },
  putRosterTemplateOrder: {
    url: '/employee/employees/roster/template/move',
    method: 'put'
  },
  deleteRosterTemplate: {
    url: '/employee/employees/roster/template/{templateId}',
    method: 'delete'
  },
  putRosterTemplateRename: {
    url: '/employee/employees/roster/template/rename',
    method: 'put'
  },
  // 获取证明列表
  getCertificationList: {
    url: '/employee/print',
    method: 'get'
  },
  // 获取证明打印内容
  getPintContent: {
    url: '/employee/print/{printId}',
    method: 'get'
  },
  // 获取批量打印内容
  getBatchPrintContent: {
    url: '/employee/batchPrint',
    method: 'get'
  },
  // 获取模板列表
  getTemplateList: {
    url: '/employee/print/template',
    method: 'get'
  },
  getDicts: {
    url: '/public-access/dicts/items',
    method: 'get'
  },
  // 获取明信片的信息
  getBaseInfo: {
    url: '/public-access/employees/base/message',
    method: 'get'
  },
  getEmployeeCode: {
    url: '/employee/code',
    method: 'get'
  },
  getContractNum: {
    url: 'employee/contracts/contract-num/{employeeCode}',
    method: 'get'
  },
  // 人事范围接口
  getPersonnelData: {
    url: 'common/personnelGroup/usableByPage',
    method: 'get'
  },
  // ---------------品类管理---------------------------
  // 获取品类管理列表
  getCategorytList: {
    url: '/employee/category/query',
    method: 'get'
  },
  // 新增品类
  createCategory: {
    url: '/employee/category/create',
    method: 'post'
  },
  // 更新
  stopCategory: {
    url: '/employee/category/stop',
    method: 'post'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
