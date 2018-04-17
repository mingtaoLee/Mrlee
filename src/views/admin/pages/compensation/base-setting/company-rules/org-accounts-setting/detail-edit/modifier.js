/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import { getDict } from 'utils/index'
import req from 'api/compensation/base-setting/company-rules'
export class Modifier extends BaseEditor {

  initData (accountPersonnelId) {
    this.vm.load()
    req('getOrgAccount', {accountPersonnelId: accountPersonnelId}).then(res => {
      if (res) {
        this.vm.form = this.transformData(res)
        this.vm.defaultOrgNode = { orgUnitId: res.orgUnitId, orgUnitName: res.orgUnitName }
        this.getInsuranceTypeList()
      }
      this.vm.setIsDateDisabled()
      this.vm.loaded()
    })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    return data
  }

  // 获取保险类型字典
  getInsuranceTypeList () {
    getDict('INSURANCE_TYPE').then((data) => {
      this.vm.insuranceTypeList = data
    })
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise(resolve => {
      req('putOrgAccount', Object.assign(submitData, {accountPersonnelId: this.vm.accountPersonnelId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
