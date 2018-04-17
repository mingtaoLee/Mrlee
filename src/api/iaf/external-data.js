// 外部数据
import request from '../index.js'
export const config = {
  // 外部缴纳查询
  externalPaymentSearch: {
    url: '/iaf/external/external',
    method: 'get'
  },
  // 外部缴纳删除
  externalPaymentDelete: {
    url: '/iaf/external/external',
    method: 'DELETE'
  },
  // 员工保险信息查询
  empInsuranceSearch: {
    url: '/iaf/external/message',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 社保台账查询
  iafBillsBreedSearch: {
    url: '/iaf/external/tally',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 社保台账查询
  iafBillsRetireSearch: {
    url: '/iaf/external/tally',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 社保台账查询
  iafBillsInjueredSearch: {
    url: '/iaf/external/tally',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 社保台账查询
  iafBillsMedicalSearch: {
    url: '/iaf/external/tally',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 社保台账查询
  iafBillsUnemploymentSearch: {
    // url: '/iaf/external/tally',
    url: '/iaf/external/findUnemploymentTally',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 社保台账查询
  getInsuranceTypeByAccountCode: {
    url: '/iaf/basic/accounts/accountCode/{accountCode}',
    method: 'get'
  },

  // 社保台账查询
  updateIafBaseTally: {
    url: '/iaf/external/UpdateIafBaseTally',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 残疾人五险一金高级查询
  handSearchs: {
    url: '/iaf/external/handicappeds',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 残疾人五险一金新增
  handAdd: {
    url: '/iaf/external/handicapped',
    method: 'post'
  },
  // 残疾人五险一金修改
  handUpdate: {
    url: '/iaf/external/handicapped',
    method: 'put'
  },
  // 残疾人五险一金查询户头id
  handSearchAccoutId: {
    url: '/iaf/external/accoutId',
    method: 'get'
  },
  // 残疾人五险一金删除
  handDelete: {
    url: '/iaf/external/handicapped',
    method: 'DELETE'
  },
  // 残疾人五险一金户头代码验证
  accountCode: {
    url: '/iaf/external/handicapped/check/accountCode/{accountCode}',
    method: 'get'
  },
  // 点击修改请求
  findIafHandicappedRecords: {
    url: '/iaf/external/handicapped/findIafHandicappedRecords',
    method: 'get'
  },
  // 差异明细表
  difference: {
    url: '/iaf/accounting/difference',
    methods: 'get'// ,
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  },
  // 差异汇总
  summary: {
    url: '/iaf/accounting/difference/summary',
    methods: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
