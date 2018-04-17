/**
 * Created by huangzp on 2017-11-30.
 */
import request from '../../index'
// 薪酬核算
export const config = {

  /** 工资发放明细页面 */

  // 工资汇总查询
  getTolalsalary: {
    url: '/pay/group-calculate',
    method: 'get'
  },
  // 确认工资
  comfirmSalary: {
    url: '/pay/group-calculate/confirm',
    method: 'put'
  },
  // 驳回
  reject: {
    url: '/pay/group-calculate/confirm/uncalculate/apply',
    method: 'put'
  },
  // 驳回取消
  rejectCancel: {
    url: '/pay/group-calculate/confirm',
    method: 'put'
  },
  // 确定取消
  confirmCancel: {
    url: '/pay/group-calculate/confirm/uncalculate/apply',
    method: 'put'
  },
   // 申请取消
  applyCancel: {
    url: '/pay/group-calculate/confirm/cancell/apply',
    method: 'put'
  },
  // 详细工资
  getSalaryDetail: {
    url: '/pay/group-calculate/{groupCalculateId}/records',
    method: 'post',
    // 多级表头的数据请求必须加这个，不然分页会炸
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 申请重算
  applySalary: {
    url: '/pay/group-calculate/confirm/recompute/apply',
    method: 'put'
  },
  // 明细页面头部
  getSalaryDetailNav: {
    url: '/pay/group-calculate/{groupCalculateId}/gather',
    method: 'get'
  },
  // 动态表头信息
  getSalaryConfirmHead: {
    url: '/pay/group-calculate/{groupCalculateId}/records-title',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
