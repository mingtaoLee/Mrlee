import request from '../index.js'
export const config = {
  orgDetail: {
    url: '/org/orgs/{id}/detail/echo',
    method: 'get'
  },
  orgAtlasDetail: {
    url: '/org/atlas/{id}/detail',
    method: 'get'
  },
  atlasData: {
    url: '/org/atlas/{id}/{n}/children',
    method: 'get'
  },
  // 获取组织下的员工
  emp: {
    url: '/org/orgs/employees',
    method: 'get'
  },
  // 获取组织下的在职员工
  getWorkingEmp: {
    url: '/public-access/employees',
    method: 'get'
  },
  // 批量获取组织下的员工
  findEmployeesByOrgIds: {
    url: '/org/orgs/findEmployeesByOrgIds',
    method: 'get'
  },
  // 组织回显
  echo: {
    url: '/org/orgs/{id}/echo'
  },
  // 组织全内容回显
  echoDetail: {
    url: '/org/orgs/{id}/detail/echo'
  },
  positions: {
    url: '/org/positions/org/positions'
  },
  // 组织导出
  orgExport: {
    url: '/org/excel/{orgUnitId}/orgs',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 组织更新
  update: {
    url: '/org/orgs/update',
    method: 'put'
  },
  // 组织新建
  creation: {
    url: '/org/orgs/creation',
    method: 'post'
  },
  // 批量创建
  creationBatch: {
    url: '/org/orgs/creation/batch',
    method: 'post'
  },
  // 组织复制
  copy: {
    url: '/org/orgs/copy',
    method: 'post'
  },
  // 组织拆分
  split: {
    url: '/org/orgs/split',
    method: 'post'
  },
  // 拆分人员异动
  empTransfer: {
    url: '/employee/employee/transfer',
    method: 'put'
  },
  // 组织合并
  mergence: {
    url: '/org/orgs/mergence',
    method: 'put'
  },
  // 组织调级
  relevel: {
    url: '/org/orgs/relevel',
    method: 'put'
  },
  // 组织撤销
  repeal: {
    url: '/org/orgs/repeal',
    method: 'put'
  },
  // 组织批量撤消
  batch: {
    url: '/org/orgs/repeal/batch',
    method: 'put'
  },
  // 组织删除
  deleteOrg: {
    url: '/org/orgs/delete/{id}/org',
    method: 'DELETE'
  },
  // 设置/ 更改联系人
  edit: {
    url: '/org/orgs/{oId}/leader/{leaderId}',
    method: 'put'
  },
  // 组织维护树节点查找
  searchData: {
    url: '/org/orgs/{name}/like'
  },
  // 返回结构化的所有地区信息
  allArea: {
    url: '/org/public/areas/all/child',
    method: 'get'
  },
  // 是否为门店
  isShop: {
    url: '/org/public/isShop',
    method: 'get'
  },
  // 是否为区总教练
  isAreaCoach: {
    url: '/org/public/isAreaCoach'
  },
  // 获取标准组织下包含的标准职位
  containJobs: {
    url: '/org/standard/{id}/jobs',
    method: 'get'
  },
  // 获取标准组织下的职位(旧)
  getStdPosition: {
    url: '/org/orgs/findPositionsByStdOrgId',
    method: 'get'
  },
  // 获取标准组织下的职位(新)
  newGetStdPosition: {
    url: '/org/standard/{id}/jobs',
    method: 'get'
  },
  // 成本中心数据
  costCentral: {
    url: '/common/sysCostCenter/listAll',
    method: 'get'
  },
  // 成本中心数据校验是否已使用
  valiDateCostCentral: {
    url: '/common/sysCostCenter/isUsed',
    method: 'get'
  },
  // 根据区域code或者id获取区域信息
  getAreaMsg: {
    url: '/org/public/areas/{code}/code',
    method: 'get'
  },
  // // 获取门店编码(新)
  getShopType: {
    url: '/org/orgShop/list',
    method: 'get'
  },
  // 获取门店编码(旧)
  // getShopType: {
  //   url: '/org/intStore/list',
  //   method: 'get'
  // },
  // 导入成本中心
  importCostCenter: {
    url: '/common/intCostCenter',
    method: 'post'
  },
  // 检查批量新增时增加的节点是否属于同一集群
  validateCluster: {
    url: '/org/orgs/check/isSameCluster',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = false) {
  return request(config, funcName, data, isToken, isCancel)
}
