// 社保核算
import request from '../index.js'
export const config = {
  // 预缴补缴查询
  apapSearch: {
    url: '/iaf/insured/preOrSupply',
    method: 'get'
  },
  // 预缴补缴 删除按钮
  apapRequestDelete: {
    url: '/iaf/insured/preOrSupply',
    method: 'DELETE'
  },
  // 预缴补缴 新增
  apapAdd: {
    url: '/iaf/insured/preOrSupply',
    method: 'POST'
  },
  // 预缴补缴 修改
  apapUpdate: {
    url: '/iaf/insured/preOrSupply',
    method: 'PUT'
  },
  // 预缴补缴新增 输入工号带出员工信息
  apapAddMsg: {
    url: 'employee/employees',
    method: 'get'
  },
  // 补退新增
  backUp: {
    url: '/iaf/insured/backUp',
    method: 'POST'
  },
  // 补退修改
  backU: {
    url: '/iaf/insured/backUp/{otherRecordId}',
    method: 'PUT'
  },
  // 补退查询
  backUps: {
    url: '/iaf/insured/backUp/backUps',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 批量删除
  deletes: {
    url: '/iaf/insured/backUp/deletes',
    method: 'DELETE'
  },
  // 单行删除
  delete: {
    url: '/iaf/insured/backUp/delete',
    method: 'DELETE'
  },
  // 批量导入
  returnExcel: {
    url: '/iaf/insured/backUp/excel',
    method: 'POST'
  },
  // 五险一金计算高级查询
  iafCompute: {
    url: '/iaf/calculation',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 预缴补缴查询
  PreBack: {
    url: '/iaf/insured/preOrSupply/find',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 预缴补缴高级查询
  Prepay: {
    url: '/iaf/insured/preOrSupply/find',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
// 预缴补缴点击修改

  find: {
    url: '/iaf/insured/preOrSupply/find',
    method: 'get'
  },
  // 预缴补缴删除
  PreOrDelete: {
    url: '/iaf/insured/preOrSupply',
    method: 'DELETE'
  },
  baseInfo: {
    url: '/iaf/public/insured/iafEmployeeBase'
  },
  // 获取修改数据
  getTableList: {
    url: '/iaf/insured/backUp/{backUpRecordId}/list',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
