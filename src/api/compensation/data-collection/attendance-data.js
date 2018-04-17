/**
 * Created by ZHANZF on 2017-11-24.
 * 数据收集
 */
import request from '../../index'
export const config = {

  /** 考勤数据页面 */

  // 考勤数据列表获取
  getAttendances: {
    url: '/compensation/data/attendances/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 考勤数据批量删除
  deleteAttendances: {
    url: '/compensation/data/attendances',
    method: 'put'
  },
  // 新增考勤数据
  postAttendances: {
    url: '/compensation/data/attendances',
    method: 'post'
  },
  // 根据id获取对应员工的考勤数据
  getAttendance: {
    url: '/compensation/data/attendances/{id}',
    method: 'get'
  },
  // 根据id新增对应员工考勤数据
  putAttendance: {
    url: '/compensation/data/attendances/{id}',
    method: 'put'
  },
  // 根据id删除对应员工考勤数据
  deleteAttendance: {
    url: '/compensation/data/attendances/{id}',
    method: 'delete'
  },
  getAttendanceData: {
    url: '/integration/sharegooRpc/getAttendanceData/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/attendances/updateConfirmStatus',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
