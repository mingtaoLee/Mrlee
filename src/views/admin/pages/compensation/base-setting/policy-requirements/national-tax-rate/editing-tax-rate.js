/**
 * Created by ZHANZF on 2017-11-6.
 */
import req from 'api/compensation/base-setting/policy-requirements'
import { BaseTaxRate } from './base-tax-rate'

export class EditingTaxRate extends BaseTaxRate {
  initData (iitaxrateId) {
    this.vm.load()
    req('getBaseTaxRate', {iitaxrateId: iitaxrateId}).then(res => {
      if (res) this.vm.form = this.transformData(res)
      this.vm.setIsDateDisabled()
      this.vm.loaded()
    })
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('putBaseTaxRate', Object.assign(submitData, {iitaxrateId: this.vm.iitaxrateId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        reject(err)
      })
    })
  }
}

