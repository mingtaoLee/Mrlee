/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/base-setting/company-rules'
export class Modifier extends BaseEditor {

  initData (groupId) {
    this.vm.load()
    req('getPeoplGroup', {groupId: this.vm.groupId}).then(res => {
      if (res) {
        this.vm.isDisabled = true
      }
    })
    return req('getSalaryGroup', {groupId: groupId}).then(res => {
      if (res) {
        const form = this.transformData(res)
        this.vm.form = form
        this.vm.companyList = [{companyName: form.companyName, companyCode: form.companyCode}]
        this.vm.table.data = this.vm.form.payAccountList
        this.vm.paymentCompanyList = [{paymentCompanyName: form.paymentCompanyName, paymentCompanyCode: form.paymentCompanyCode}]
        this.vm.personnelGroupList = [{personnelGroupCode: form.personnelGroupCode, personnelGroupName: form.personnelGroupName}]
      }
      this.vm.setIsDateDisabled()
      this.vm.loaded()
    })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    data.payDate = parseInt(data.payDate)
    return data
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('putSalaryGroup', Object.assign(submitData, {groupId: this.vm.groupId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
