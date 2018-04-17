/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/base-setting/company-rules'
export class Modifier extends BaseEditor {

  initData () {
    req('getAccount', {accountId: this.vm.accountId}).then(res => {
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
      if (data[key]) {
        data[key] = new Date(data[key])
      }
    })
    return data
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise(resolve => {
      req('putAccount', Object.assign(submitData, {accountId: this.vm.accountId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
