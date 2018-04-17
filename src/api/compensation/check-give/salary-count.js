/**
 * Created by huangzp on 2017-12-07.
 */
import request from '../../index'
// 薪酬核算
export const config = {

  /** 工资计算页面 */

  // 工资汇总查询
  getTolalsalary: {
    url: '/pay/group-calculate/list',
    method: 'get'
  },
  // 发起确认
  comfirmSalary: {
    url: '/pay/group-calculate/confirm/apply',
    method: 'put'
  },
  // 取消确认
  confirmCancel: {
    url: '/pay/group-calculate/confirm/uncalculate/apply',
    method: 'put'
  },
  // 详细工资计算页面
  getSalaryDetail: {
    url: '/pay/group-calculate/{groupCalculateId}/records',
    method: 'post',
    // 多级表头的数据请求必须加这个，不然分页会炸
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 申请重新计算
  applySalary: {
    url: '/pay/group-calculate/recompute',
    method: 'put'
  },
  // 个人成功明细申请重新计算
  successSalaryRecompute: {
    url: '/pay/group-calculate/success-recompute',
    method: 'put'
  },
  // 个人失败明细申请重新计算
  failSalaryRecompute: {
    url: '/pay/group-calculate/failure-recompute',
    method: 'put'
  },
  // 明细页面头部
  getSalaryDetailNav: {
    url: '/pay/group-calculate/{groupCalculateId}/gather',
    method: 'get'
  },
  // 查询工资计算异常明细
  getSalaryFail: {
    url: '/pay/group-calculate/{groupCalculateId}/exceptions',
    method: 'post',
    // 多级表头的数据请求必须加这个，不然分页会炸
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 动态表头信息
  getSalaryConfirmHead: {
    url: '/pay/group-calculate/{groupCalculateId}/records-title',
    method: 'get'
  },
   // 获取薪资组列表
  getSalaryGroup: {
    url: 'compensation/basic/groups/groupsearch',
    method: 'get'
  },
  // 新建计算
  createCount: {
    url: '/pay/group-calculate/create',
    method: 'post',
    timeout: '600000'
  },
  // 工资计算过程新建-根据工资套id查询工资套类别
  getSalaryTypeByGroup: {
    url: '/pay/processes/component-type',
    method: 'get'
  },
    // 根据薪资组id列表查找工资套列表
  postSalaryGroupById: {
    url: '/pay/group-calculate/components',
    method: 'post'
  },
  // 导出工资计算明细
  getGroupCalculateDetail: {
    url: '/pay/group-calculate/{groupCalculateId}/export-records',
    method: 'post',
    // 多级表头的数据请求必须加这个，不然分页会炸
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
    // 获取开始下载任务的id
  getExportTaskId: {
    url: '/common/getFileScheduleId',
    method: 'get'
  },
  // 启动定时刷新接口
  getIntervalData: {
    url: '/pay/group-calculate/taskqueue',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
