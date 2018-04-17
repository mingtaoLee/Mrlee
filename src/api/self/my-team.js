/**
 * Created by admin on 2018/1/31.
 */
import request from '../index.js'
export const config = {
  // 默认菜单
  getMyTeam: {
    url: '/self/employee/findMyTeam',
    method: 'get'
  },
  // 查询人才结构数据
  employeeAnalysis: {
    url: '/self/employee/employeeAnalysis',
    method: 'get'
  },
  // 查询人才结构弹出框详细列表数据
  getMyTeamList: {
    url: '/self/employee/findEmployeeStatisticsData',
    method: 'get'
  },
  // 人才结构导出数据
  getMyTeamLists: {
    url: '/self/employee/exportEmployeeStatisticsData',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = false) {
  return request(config, funcName, data, isToken, isCancel)
}
