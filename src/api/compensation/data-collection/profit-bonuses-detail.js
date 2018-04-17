/**
 * Created by Younh on 2017/12/17.
 */

import request from '../../index'
export const config = {
  // getAreaManagerList: {
  //   url: '/compensation/data/profit-bonus/areas',
  //   method: 'get'
  // },
  // getCategoryCoachList: {
  //   url: '/compensation/data/profit-bonus/class-coach',
  //   method: 'get'
  // },
  // getStoreCoachList: {
  //   url: '/compensation/data/profit-bonus/store-coach',
  //   method: 'get'
  // },
  // getPartnerList: {
  //   url: '/compensation/data/profit-bonus/partner',
  //   method: 'get'
  // },
  getAreaManagerList: {
    url: '/compensation/data/profit-bonus/areas/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  getCategoryCoachList: {
    url: '/compensation/data/profit-bonus/class-coach/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  getStoreCoachList: {
    url: '/compensation/data/profit-bonus/store-coach/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  getPartnerList: {
    url: '/compensation/data/profit-bonus/partner/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // validAreaManager: {
  //   url: '/compensation/data/profit-bonus/areas/validaty-data',
  //   method: 'put'
  // },
  // validCategoryCoach: {
  //   url: '/compensation/data/profit-bonus/class-coach/validaty-data',
  //   method: 'put'
  // },
  // validStoreCoach: {
  //   url: '/compensation/data/profit-bonus/store-coach/validaty-data',
  //   method: 'put'
  // },
  // validPartner: {
  //   url: '/compensation/data/profit-bonus/partner/validaty-data',
  //   method: 'put'
  // },
  // 区总数据确认
  areaManagerConfirmData: {
    url: '/compensation/data/profit-bonus/areas/validaty-data',
    method: 'put'
  },
  // 品类教练数据确认
  categoryCoachConfirmData: {
    url: '/compensation/data/profit-bonus/class-coach/validaty-data',
    method: 'put'
  },
  // 门店数据确认
  storeCoachConfirmData: {
    url: '/compensation/data/profit-bonus/store-coach/validaty-data',
    method: 'put'
  },
  // 合伙人数据确认
  partnerConfirmData: {
    url: '/compensation/data/profit-bonus/partner/validaty-data',
    method: 'put'
  },
  // 区总区助抽数
  getNewProfitsBonusOne: {
    url: '/compensation/data/newProfitsBonus/sync-data/1/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  // 品类教练抽数
  getNewProfitsBonusTwo: {
    url: '/compensation/data/newProfitsBonus/sync-data/2/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  // 门店教练抽数
  getNewProfitsBonusThree: {
    url: '/compensation/data/newProfitsBonus/sync-data/3/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  // 合伙人抽数
  getNewProfitsBonusFour: {
    url: '/compensation/data/profit-bonus/partner/validaty-data/sync/{checkMonth}',
    method: 'get',
    timeout: 3600000
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
