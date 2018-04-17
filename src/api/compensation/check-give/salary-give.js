import request from 'api/index'

export const config = {
  // 获取工资发放过程列表
  getSalaryGiveList: {
    url: '/pay/processes',
    method: 'get'
  },
  // 导出个税报表
  getTaxReporting: {
    url: 'pay/processes/export?processId={processId}',
    method: 'get'
  },
  // 导出报盘报税表
  getBankReporting: {
    url: 'pay/processes/exportbank?processId={processId}',
    method: 'get'
  },
  // 删除发放过程
  delSalaryGiveById: {
    url: '/pay/processes/{processId}/delete',
    method: 'put'
  },
  // 删除员工发放
  delEmployeeById: {
    url: '/pay/processes/{processId}/process-records/delete',
    method: 'put'
  },
  // 根据薪资组Id查看详细人员名单
  getSalaryGiveDetail: {
    url: '/pay/processes/{processId}/process-records',
    method: 'post',
    // 多级表头的数据请求必须加这个，不然分页会炸
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 根据薪资组Id查看页面信息
  getSalaryGiveMarkDetail: {
    url: '/pay/processes/{processId}/gather',
    method: 'get'
  },
  // 过账及推送数据
  postSendData: {
    url: '/pay/processes/audit/data-push',
    method: 'get'
  },
  // 申请出款--数据统计返回
  getapplyCheck: {
    url: '/pay/processes/audit/summary',
    method: 'post'
  },
  // 取消过账
  postCancelPost: {
    url: '/pay/processes/audit/cancel-push',
    method: 'post'
  },
  // 新建发放过程
  postBuildProcess: {
    url: '/pay/processes/create',
    method: 'post',
    timeout: '600000'
  },
  // 发起紧急止付
  putStopPay: {
    url: '/pay/processes/{processId}/process-records/suspend',
    method: 'put'
  },
  // 修正发放
  putUpdatePolicy: {
    url: '/pay/processes/confirm/uncalculate/apply',
    method: 'put'
  },
  // 追加员工发放
  putAddPay: {
    url: '/pay/processes/{processId}/process-records/add',
    method: 'put'
  },
  // 获取薪资组列表
  getSalaryGroup: {
    url: 'compensation/basic/groups/groupsearch',
    method: 'get'
  },
  // 根据薪资组id列表查找工资套列表
  postSalaryGroupById: {
    url: '/pay/processes/components',
    method: 'post'
  },
  // 根据薪资组id查询省区
  getAreaBySalaryGroup: {
    url: '/pay/processes/areas',
    method: 'get'
  },
  // 表头数据
  getProcessSheetHead: {
    url: '/pay/processes/{processId}/process-records-title',
    method: 'get'
  },
  // 根据工资套Id查询工资套类别
  getSalaryTypeByGroup: {
    url: '/pay/processes/component-type',
    method: 'get'
  },
  // 紧急止付页面数据请求
  getStopPayFlow: {
    url: '/pay/processes/{processId}/process-records/suspend/workflow',
    method: 'post'
  },
  // 根据薪资组ID和月份查询对应的工资套
  getcomponentListName: {
    url: 'pay/processes/component',
    method: 'post'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
