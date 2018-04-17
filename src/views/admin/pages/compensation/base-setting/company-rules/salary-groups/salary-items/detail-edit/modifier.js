/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/base-setting/company-rules'
export class Modifier extends BaseEditor {

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
      this.vm.setIsDateDisabled()
      this.vm.loaded()
    })
    req('getPeoplGroup', {groupId: this.vm.groupId}).then(res => {
      if (res) {
        this.vm.isDisabled = true
      }
    })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    return data
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise(resolve => {
      req('putSalaryItem', Object.assign(submitData, { groupListId: this.vm.groupListId, groupId: this.vm.groupId })).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
