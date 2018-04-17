/**
 * Created by ZHANZF on 2017-11-23.
 */
import request from '../../index'
// 员工信息设置
export const config = {

  /** 员工工作日历 */

  // 获取员工工作日历列表
  getWorkCalendarList: {
    url: '/compensation/employee/pay/attend',
    method: 'get'
  },
  // 新增员工工作日历
  postWorkCalendarList: {
    url: '/compensation/employee/pay/attend',
    method: 'post'
  },
  // 员工工作日历批量删除
  deleteWorkCalendarList: {
    url: '/compensation/employee/pay/attend',
    method: 'put'
  },
  // 根据id获取对应员工工作日历
  getWorkCalendar: {
    url: '/compensation/employee/pay/attend/{attendanceBasisId}',
    method: 'get'
  },
  // 根据id更新对应员工工作日历
  putWorkCalendar: {
    url: '/compensation/employee/pay/attend/{attendanceBasisId}',
    method: 'put'
  },
  // 根据id删除对应员工工作日历
  deleteWorkCalendar: {
    url: '/compensation/employee/pay/attend/{attendanceBasisId}',
    method: 'delete'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
