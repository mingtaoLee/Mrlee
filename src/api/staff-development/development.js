import request from '../index.js'
export const config = {
  //  ------------------------教练库管理------------------------------
    // 获取教练库列表
  getCoachList: {
    url: '/improve/coachlibs',
    method: 'get'
  },
  // 查询
  findCoach: {
    url: '/improve/coachlib/{coachlibId}',
    methog: 'get'
  },
      // 新增
  createCoach: {
    url: '/improve/coachlib',
    method: 'post'
  },
    // 修改
  updateCoach: {
    url: '/improve/coachlib',
    method: 'put'
  },
  // 删除
  delCoach: {
    url: '/improve/coachlibs',
    method: 'delete'
  },
  // 启动
  upCoach: {
    url: '/improve/coachlibs/enable',
    method: 'put'
  },
  // 禁用
  disableCoach: {
    url: '/improve/coachlibs/disable',
    method: 'put'
  },
  // ----------------------------教练库人员管理-------------------------------------
  // 获取人员列表
  getCoachStaffList: {
    url: '/improve/coachlib/employees',
    method: 'post'
  },
  // 新增入库
  insertCoach: {
    url: '/improve/coachlib/employee/in',
    method: 'post'
  },
  // 查询
  findCoachlibEmployee: {
    url: '/improve/coachlib/employee/{coachlibEmployeeId}',
    method: 'get'
  },
  // 修改
  updateCoachEmployee: {
    url: '/improve/coachlib/employee/in',
    method: 'put'
  },
  // 出库
  output: {
    url: '/improve/coachlib/employee/out',
    method: 'post'
  },
  // ---------------------员工发展计划模板----------------------------
  // 获取列表
  getStaffDevelopmentTemplateList: {
    url: '/improve/plan/templates',
    method: 'post'
  },
  // 删除
  delStaffTemplate: {
    url: '/improve/plan/templates',
    method: 'delete'
  },
  // 查询
  findStaffTemplate: {
    url: '/improve/plan/template/{planTemplateId}',
    method: 'get'
  },
  // 新增
  createStaffTemplate: {
    url: '/improve/plan/template',
    method: 'post'
  },
  // 修改
  updateStaffTemplate: {
    url: '/improve/plan/template/{impPlanTemplateId}',
    method: 'put'
  },
  // 启用
  upStaffTenplate: {
    url: '/improve/plan/templates/enabled',
    method: 'post'
  },
  // 禁用
  disabledStaffTmeplate: {
    url: '/improve/plan/templates/disabled',
    method: 'post'
  },
  //  -----------------员工发展计划管理---------------------
  // 获取列表
  getStaffManagementList: {
    url: '/improve/plans',
    method: 'get'
  },
  // 删除
  delStaffManagement: {
    url: '/improve/plans',
    method: 'delete'
  },
  // 启用
  upStaffManagement: {
    url: '/improve/plans/enabled',
    method: 'post'
  },
  // 禁用
  disabledStaffManagement: {
    url: '/improve/plans/disabled',
    method: 'post'
  }

}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
