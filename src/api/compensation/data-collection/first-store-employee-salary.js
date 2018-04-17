import request from '../../index'
export const config = {
  // 一集群门店全职员工时薪
  postfirstStoreEmployeeSalaryList: {
    url: '/compensation/data/cpshourlywage',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 抽数
  getfirstStoreEmployeeSalaryData: {
    url: '/compensation/formula/store/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/cpshourlywage/confirm',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
