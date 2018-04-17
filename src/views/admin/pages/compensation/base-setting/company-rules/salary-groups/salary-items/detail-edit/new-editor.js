/**
 * Created by ZHANZF on 2017-11-8.
 */
import { Modifier } from './modifier'
import req from 'api/compensation/base-setting/company-rules'
export class NewEditor extends Modifier {
  initData () {
    this.vm.load()
    req('getSalaryItem', { groupListId: this.vm.groupListId, groupId: this.vm.groupId }).then(res => {
      if (res) {
        const form = this.transformData(res)
        this.vm.form = form
        this.vm.componentList = [{keyword: form.componentListName, componentListId: form.componentListId}]
        this.vm.payComponentList = [{componentName: form.componentName, componentId: form.componentId}]
        this.vm.payslipList = [{payslipName: form.payslipName, payslipId: form.payslipId}]
      }
      this.vm.loaded()
    })
  }

  save () {
    delete this.vm.form[this.vm.idKey]
    const submitData = JSON.parse(JSON.stringify(this.vm.form))
    return new Promise(resolve => {
      req('postSalaryItems', Object.assign(submitData, { groupId: this.vm.groupId })).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      })
    })
  }
}
