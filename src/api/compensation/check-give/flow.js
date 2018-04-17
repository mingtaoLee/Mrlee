/**
 * Created by huangzp on 2017-12-5.
 */
import request from '../../index'
// 流程
export const config = {
// 紧急止付流程-根据输入年月查询员工工资
  geturgentStopMoney: {
    url: '/pay/processes/workflow/employees/money',
    method: 'get'
  },
  // 紧急止付流程-根据输入查询员工信息
  geturgentStopData: {
    url: '/pay/processes/workflow/employees',
    method: 'get'
  },
  // 工时划拨-根据员工信息(employeeId)查找('门店','门店编号','薪资组','小店')
  postTransferQuery: {
    url: '/pay/work-hour/transfer/query-for-create/out-org-info',
    method: 'post'
  },
  // 工时划拨-通过划入门店id获取店编
  getTransferInPunitcode: {
    url: '/pay/work-hour/transfer/query-for-create/{transferInUnit}/in-org-info',
    method: 'get'
  },
  // 工时费用划拨-通过选择姓名查询
  getCostAllocation: {
    url: '/pay/cost/transfer/query-for-create/employees/{employeeId}/emp-info',
    method: 'get'
  },
  // 内部订单费用划拨
  getInsideCostAllocation: {
    url: '/pay/cost/aufn/employees/{employeeId}',
    method: 'get'
  },
  // 查询分摊计算信息(工资费用合计/应出勤天数)
  getCount: {
    url: '/pay/cost/aufn/employees/{employeeId}/{month}',
    method: 'get'
  },
  getTransferInCostCenterCode: {
    url: '/pay/cost/transfer/query-for-create/units/{unitId}/out-cost-info',
    method: 'get'
  },
  // 获得成本中心信息
  postCostCenter: {
    url: '/pay/cost/transfer/cost-center',
    method: 'get'
  },
  // 工时费用划拨流程通过'划入组织 查询 门店-小店
  getStore: {
    url: '/pay/work-hour/transfer/query-for-create/in-org-info/{transferInUnitId}',
    method: 'get'
  },
  // 根据员工id 查找划出（工号-组织-门店-小店）
  getOutStore: {
    url: '/pay/work-hour/transfer/query-for-create/out-org-info/{employeeId}',
    method: 'get'
  },
  // 费用划拨分摊金额计算
  postCostAllocationCount: {
    url: '/pay/cost/transfer/calculate',
    method: 'post'
  },
  // 效验划拨金额是否大于员工月工资总额
  postTrueCostAllocationCount: {
    url: '/pay/cost/transfer/validateCalculate',
    method: 'post'
  },
  // 离职补偿金流程员工带出相关信息
  getSeveranceByEmployeeId: {
    url: '/pay/severance/emp/{employeeId}',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
