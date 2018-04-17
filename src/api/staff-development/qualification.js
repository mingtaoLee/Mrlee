import request from '../index.js'
export const config = {
  //  ------------------------课程库------------------------------
    // 获取课程列表
  getCourseList: {
    url: '/improve/courses',
    method: 'get'
  },
  // 查询
  findCourse: {
    url: '/improve/course/{impCourseId}',
    methog: 'get'
  },
      // 新增
  createCourse: {
    url: '/improve/course',
    method: 'post'
  },
    // 修改
  updateCourse: {
    url: '/improve/course/{impCourseId}',
    method: 'put'
  },
  // 删除
  delCourse: {
    url: '/improve/courses',
    method: 'delete'
  },
  // 启动
  upCourse: {
    url: '/improve/courses/enabled',
    method: 'put'
  },
  // 禁用
  disableCourse: {
    url: '/improve/courses/disable',
    method: 'put'
  },
  // -----------------------能力库管理-------------------------=-----------
  // 获取能力库列表
  getAbilityList: {
    url: '/improve/abilitys',
    methid: 'get'
  },
  // 能力库课程列表
  getAbilityCourseList: {
    url: '/improve/abilitys/{impAbilityId}/courses',
    method: 'get'
  },
  // 查询
  findAbility: {
    url: '/improve/ability/{impAbilityId}',
    method: 'get'
  },
  // 新增
  createAbility: {
    url: '/improve/ability',
    method: 'post'
  },
  // 修改
  updateAbility: {
    url: '/improve/ability/{impAbilityId}',
    method: 'put'
  },
  //  删除
  delAbility: {
    url: '/improve/abilitys',
    method: 'delete'
  },
  // 启用
  upAbility: {
    url: '/improve/abilitys/enabled',
    method: 'put'
  },
  //  禁用
  disableAbility: {
    url: '/improve/abilitys/disable',
    method: 'put'
  },
  // ------------------职业发展通道管理---------------------------
  // 获取列表
  getDevelopmentTubeList: {
    url: '/improve/paths',
    method: 'get'
  },
  // 查询职业发展通道接口
  findDevelopmentTube: {
    url: '/improve/path/{impPathId}',
    method: 'get'
  },
  // 查询课程接口
  findCourseList: {
    url: '/improve/path/{impPathId}/courses',
    method: 'get'
  },
  // 新增
  createDevelopmentTube: {
    url: '/improve/path',
    method: 'post'
  },
  // 修改
  updateDevelopmentTube: {
    url: '/improve/path/{impPathId}',
    method: 'put'
  },
  // 删除
  delDevelopmentTube: {
    url: '/improve/paths',
    method: 'delete'
  },
  // 启用
  upDevelopmentTube: {
    url: '/improve/paths/enabled',
    method: 'put'
  },
  // 禁用
  disableDevelopmentTube: {
    url: '/improve/paths/disable',
    method: 'put'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
