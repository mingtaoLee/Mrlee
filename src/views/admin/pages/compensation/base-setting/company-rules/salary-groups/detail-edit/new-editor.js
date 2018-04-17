/**
 * Created by ZHANZF on 2017-11-8.
 */
import { Modifier } from './modifier'
import req from 'api/compensation/base-setting/company-rules'
export class NewEditor extends Modifier {
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
        this.vm.table.data = this.vm.form.payAccountList
        this.vm.companyList = [{companyName: form.companyName, companyCode: form.companyCode}]
        this.vm.paymentCompanyList = [{paymentCompanyName: form.paymentCompanyName, paymentCompanyCode: form.paymentCompanyCode}]
        this.vm.personnelGroupList = [{personnelGroupCode: form.personnelGroupCode, personnelGroupName: form.personnelGroupName}]
        this.vm.getAccountList(form.paymentCompanyCode).then(() => {
          this.initDisabledOptions(this.vm.accountList)
        })
      }
      this.vm.loaded()
    })
  }

  initDisabledOptions (data) {
    data.forEach(item => {
      this.vm.setDisabledOption(item.payAccount, true)
    })
  }

  save () {
    delete this.vm.form[this.vm.idKey]
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postSalaryGroups', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
