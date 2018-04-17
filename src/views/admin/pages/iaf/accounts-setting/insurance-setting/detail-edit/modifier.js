/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/iaf/company-rules'
export class Modifier extends BaseEditor {

  initData () {
    req('getInsuranceDetail', {accountId: this.vm.accountId, accountPolicyId: this.vm.accountPolicyId}).then(res => {
      if (res) {
        this.vm.form = this.transformData(res)
        this.vm.baseNumber = Object.assign({}, res)
        this.vm.baseNumber.compPayRatio = res.compPayRatioMax
        this.vm.baseNumber.empPayRatio = res.empPayRatioMax
        this.vm.baseNumber.empPayBaseLower = res.empPayBaseLowerMin // 社保基数下限
        this.vm.baseNumber.empPayBaseLimit = res.empPayBaseLimitMax // 社保基数上限
        this.vm.baseNumber.compPayBaseLower = res.compPayBaseLowerMin // 社保公司基数下限
        this.vm.baseNumber.compPayBaseLimit = res.compPayBaseLimitMax// 社保公司基数上限
        this.setDefaultPersonnel(res)
      }
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
    return new Promise((resolve, reject) => {
      req('putInsuranceDetail', Object.assign(this.vm.form, {accountId: this.vm.accountId, accountPolicyId: this.vm.accountPolicyId}))
      .then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
      .catch(err => reject(err))
    })
  }
}
