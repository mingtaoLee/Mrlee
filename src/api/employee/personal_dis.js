import request from '../index.js'

export const config = {
  // 离职列表
  getDimissionsList: {
    url: '/employee/dimissions',
    method: 'get'
  },
  // 到期提醒列表
  getReminderList: {
    url: '/employee/employees/reminders/getList',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 到期提醒新增
  addReminder: {
    url: '/employee/employees/reminders',
    method: 'post'
  },
  // 到期提醒修改
  editReminder: {
    url: '/employee/employees/reminders',
    method: 'put'
  },
  loadReminder: {
    url: '/employee/employees/getReminderByReminderId',
    method: 'get'
  },
  loadReminderList: {
    url: '/employee/employees/getEmpByReminderId/{empReminderId}/getList',
    method: 'get'
  },
  // 到期提醒启用
  enableReminder: {
    url: '/employee/employees/reminders/enable',
    method: 'put'
  },
  // 到期提醒禁用
  disableReminder: {
    url: '/employee/employees/reminders/disable',
    method: 'put'
  },
  // 到期提醒执行效果
  reminderInStanceList: {
    url: '/employee/employees/reminders/getEmpReminderJobInstanceList',
    method: 'get'
  },
  // 一键提醒
  reminderAll: {
    url: '/employee/employees/reminders/remindOneKey/{empReminderId}',
    method: 'put'
  },
  deleteReminder: {
    url: '/employee/employees/reminders',
    method: 'delete'
  },
  // 人员借调列表
  getSecondmentList: {
    url: '/employee/secondments',
    method: 'get'
  },
  // 新增人员借调
  newSecond: {
    url: '/employee/secondments',
    method: 'post'
  },
  // 加入黑名单
  addBlackList: {
    url: '/employee/dimissions/inBlack',
    method: 'put'
  },
  // 删除黑名单
  deleteBlackList: {
    url: '/employee/dimissions/outBlack',
    method: 'put'
  },
  // 查看黑名单操作记录
  checkBlackRecord: {
    url: '/employee/dimissions/black/list/{empEmployeeId}',
    method: 'get'
  },
  // 下载附件
  downloadFile: {
    url: '/system/attachments/files/{attachmentId}',
    method: 'get'
  },
    // 个人异动记录查询
  getPerRecord: {
    url: '/employee/employees/record/{employeeCode}',
    method: 'get'
  },
  // 异动记录查询
  postRecord: {
    url: '/employee/employees/record',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 根据empID获取借调信息
  getSecondInfo: {
    url: '/employee/employeeIds',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
