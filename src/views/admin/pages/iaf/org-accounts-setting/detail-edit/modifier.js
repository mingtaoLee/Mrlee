/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import { getDict } from 'utils/index'
import req from 'api/iaf/company-rules'
export class Modifier extends BaseEditor {

  initData (accountPersonnelId) {
    req('getOrgAccount', {accountPersonnelId: accountPersonnelId}).then(res => {
      if (res) {
        this.vm.form = this.transformData(res)
        this.vm.defaultOrgNode = { orgUnitId: res.orgUnitId, orgUnitName: res.orgUnitName }
        this.getInsuranceTypeList()
      }
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
    return new Promise((resolve, reject) => {
      req('putOrgAccount', Object.assign(submitData, {accountPersonnelId: this.vm.accountPersonnelId}))
      .then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
      .catch(err => reject(err))
    })
  }
}
