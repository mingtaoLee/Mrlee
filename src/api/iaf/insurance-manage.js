// 参保管理
import request from '../index.js'
export const config = {
  // 商业险管理 参保查询
  insuredSearch: {
    url: '/iaf/insured/commercial',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 商业险管理 参保查询
  insuredAddSearch: {
    url: '/iaf/insured/commercial',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 商业险管理 参保查询
  insuredDeleteSearch: {
    url: '/iaf/insured/commercial',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 商业险管理 变更管理查询
  insuredChangeSearch: {
    url: '/iaf/insured/commercial/changing',
    method: 'get'
  },
  // 商业险管理 删除按钮
  addRequestDelete: {
    url: '/iaf/insured/commercial',
    method: 'DELETE'
  },
  // 公积金高级查询
  fundQuerySearch: {
    url: '/iaf/insured/hpfund',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 公积金增员申请
  fundQueryAddApplySearch: {
    url: '/iaf/insured/hpfund',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 公积金增员完成
  fundQueryAddSuccessSearch: {
    url: '/iaf/insured/hpfund',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 公积金减员申请
  fundQueryDeleteApplySearch: {
    url: '/iaf/insured/hpfund',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 公积金减员完成
  fundQueryDeleteSuccessSearch: {
    url: '/iaf/insured/hpfund',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 公积金增员删除
  hpfundIncreased: {
    url: '/iaf/insured/hpfundIncreased',
    method: 'DELETE'
  },
  // 公积金减员删除
  hpfundDecreased: {
    url: '/iaf/insured/hpfundDecreased',
    method: 'DELETE'
  },
  // 社保管理查询
  socialSecurityInsurance: {
    url: '/iaf/insured/insurance',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 社保管理增员申请
  socialAddApplyInsurance: {
    url: '/iaf/insured/insurance',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 社保管理增员完成
  socialAddSuccessInsurance: {
    url: '/iaf/insured/insurance',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 社保管理增员申请
  socialDeleteApplyInsurance: {
    url: '/iaf/insured/insurance',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 社保管理增员完成
  socialDeleteSuccessInsurance: {
    url: '/iaf/insured/insurance',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 退休管理通过工号获取员工信息
  retireGetEmpBasicMsg: {
    url: '/iaf/insured/retirement/{employeeCode}/personalRetirementBaseData',
    method: 'get'
  },
  // 社保管理增员删除
  socialSecurityInsuranceIncreasedDelete: {
    url: '/iaf/insured/insuranceIncreased',
    method: 'DELETE'
  },
  // 社保管理减员删除
  socialSecurityInsuranceDecreasedDelete: {
    url: '/iaf/insured/insuranceDecreased',
    method: 'DELETE'
  },
  // 退休管理查询
  retirementGet: {
    url: '/iaf/insured/retirement',
    method: 'get'
  },
  // 退休管理修改
  retirementPut: {
    url: '/iaf/insured/retirement',
    method: 'PUT'
  },
  // 退休管理新增
  retirementPost: {
    url: '/iaf/insured/retirement',
    method: 'POST'
  },
  // 退休管理删除
  retirementDelete: {
    url: '/iaf/insured/retirement',
    method: 'DELETE'
  },
  // 其他社保管理查询
  otherSecuritySearch: {
    url: '/iaf/insured/others',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 通过员工工号自动获取基本信息
  iafEmployeeBase: {
    url: '/iaf/public/insured/iafEmployeeBase'
  },
  // 其他社保管理批量删除
  otherSecurityDelete: {
    url: '/iaf/insured/others',
    method: 'DELETE'
  },
  // 其他参保管理新增接口
  otherAdd: {
    url: '/iaf/insured/other',
    method: 'post'
  },
  // 其他参保通过行id获取该行数据
  otherGetDialogData: {
    url: '/iaf/insured/other/{otherRecordId}',
    method: 'get'
  },
  // 其他参保修改弹出框数据
  otherUpdate: {
    url: '/iaf/insured/other/{otherRecordId}',
    method: 'put'
  },
  // 异地参保查询
  remoteInsurance: {
    url: '/iaf/external/nonlocalRecords',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 异地参保查询
  advanceInsurance: {
    url: '/iaf/external/nonlocalRecords',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 异地参保汇总表查询
  remoteInsuranceSummary: {
    url: '/iaf/external/nonlocalStatistics',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 根据条件查询零申报记录
  findLikeInsNodeclareRecord: {
    url: '/iaf/nodeclareRecord/findLikeInsNodeclareRecord',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 删除零申报数据
  deleteInsNodeclareRecord: {
    url: '/iaf/nodeclareRecord/deleteInsNodeclareRecord',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 批量删除零申报数据
  batchDeleteInsNodeclareRecord: {
    url: '/iaf/nodeclareRecord/batchDeleteInsNodeclareRecord',
    method: 'post'
  },
  // 更新零申报数据
  updateInsNodeclareRecord: {
    url: '/iaf/nodeclareRecord/UpdateInsNodeclareRecord',
    method: 'post'
  },
  // 新增零申报数据
  addInsNodeclareRecord: {
    url: '/iaf/nodeclareRecord/AddInsNodeclareRecord',
    method: 'post'
  },
  // 校验户头是否存在
  checkAccountCode: {
    url: '/iaf/nodeclareRecord/whetherExistAccount',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 根据记录id获取记录信息
  findIafInsNodeclareRecordDto: {
    url: '/iaf/nodeclareRecord/findIafInsNodeclareRecordDto',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 通过工号获取信息接口
  getEmployeeInfoById: {
    url: '/iaf/insured/backUp/{employeeCode}',
    method: 'get'
  },
    // 预缴补缴户头查询
  Account: {
    url: '/iaf/insured/preOrSupply/account',
    method: 'get'
  },

  // 预缴补缴查询险种
  findInsuranceType: {
    url: '/iaf/insured/preOrSupply/findInsuranceType',
    method: 'get'
  },
    // 预缴补缴根据险种社保类型带出基数
  findPayBaseAndPayRatio: {
    url: '/iaf/insured/preOrSupply/findPayBaseAndPayRatio',
    method: 'get'
  },
  getAccountCode: {
    url: '/iaf/insured/backUp/findAccountCodeByInsuranceType',
    method: 'get'
  },
  findFullNameAndpersonnelGroupCode1: {
    url: '/iaf/nodeclareRecord/findFullNameAndpersonnelGroupCode1',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  findFullNameAndpersonnelGroupCode: {
    url: '/iaf/nodeclareRecord/findFullNameAndpersonnelGroupCode',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  insuredInfo: {
    url: '/iaf/nodeclareRecord/findInsType',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  examineInfo: {
    url: '/iaf/nodeclareRecord/batchUpdateInsNodeclareRecord',
    method: 'post'
  },
  // 社保管理增员申请修改
  editAddApply: {
    url: '/iaf/insured/updateInsuredIncreasedRecords',
    method: 'post'
  },
  // 修改增员信息过去上下限基数
  limitPayBase: {
    url: '/iaf/insured/iafInsuranceDtoSelectAccountPolicyData',
    method: 'post'
  },
  // 公积金理增员申请修改
  fundEditAddApply: {
    url: '/iaf/insured/updateIafFundManagementDto',
    method: 'post'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
