/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/base-setting/company-rules'
export class Modifier extends BaseEditor {

  initData () {
    req('getInsuranceDetail', {accountId: this.vm.accountId, accountPolicyId: this.vm.accountPolicyId}).then(res => {
      if (res) {
        this.vm.form = this.transformData(res)
        this.setDefaultPersonnel(res)
      }
      this.vm.setIsDateDisabled()
    })
  }

  setDefaultPersonnel (data) {
    this.vm.selectedPersonnel.push({ employeeName: data.fullName, employeeId: data.employeeId })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    return data
  }

  save () {
    return new Promise(resolve => {
      req('putInsuranceDetail', Object.assign(this.vm.form, {accountId: this.vm.accountId, accountPolicyId: this.vm.accountPolicyId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
