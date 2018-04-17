import request from 'api/index'

export const config = {
  // 获取工时划拨列表
  getLabhourList: {
    url: '/pay/work-hour/transfer',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 保存新的工时划拨信息
  postLaborhour: {
    url: '/pay/work-hour/transfer/add',
    method: 'post'
  },
  // 通过id查询单条工时划拨信息
  getLaborhour: {
    url: '/pay/work-hour/transfer/{transferId}',
    method: 'get'
  },
  // 修改单条工时划拨信息
  updateLaborhour: {
    url: '/pay/work-hour/transfer/update',
    method: 'put'
  },
  // 删除工时划拨信息
  delLabhour: {
    url: '/pay/work-hour/transfer/delete',
    method: 'put'
  },
  // 导入工时划拨信息
  importLaborhour: {
    url: '/pay/work-hour/transfer/import',
    method: 'post'
  },
  // 新增页面，根据员工Id查询相关信息
  getInfoByemployeeId: {
    url: '/pay/work-hour/transfer/query-for-create/out-org-info/{employeeId}',
    method: 'get'
  },
  // 新增页面，根据划入组织Id查找相关信息
  getTransferInInfor: {
    url: '/pay/work-hour/transfer/query-for-create/in-org-info/{transferInUnitId}',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
