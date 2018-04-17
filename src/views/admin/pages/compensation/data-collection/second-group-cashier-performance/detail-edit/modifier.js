/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/data-collection/cashier-performance'
export class Modifier extends BaseEditor {

  initData (id) {
    this.vm.loading = true
    req('getCashierPerformance', {id: id}).then(res => {
      if (res) {
        this.vm.form = this.transformData(res)
        this.setDefaultPersonnel(res)
        this.initDisabledOptions(this.vm.form.cashPerfInfoList)
      }
      this.vm.loading = false
    })
  }

  setDefaultPersonnel (data) {
    this.vm.selectedPersonnel.push({ employeeName: data.employeeName, employeeId: data.empEmployeeId })
  }

  initDisabledOptions (data) {
    data.forEach(item => {
      this.vm.setDisabledOption(item.key, true)
    })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    data.list.map(item => {
      Object.keys(item).map(key => {
        item.key = key
        item.value = item[key]
        item.id = Math.random()
        delete item[key]
      })
    })
    return data
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise(resolve => {
      req('putCashierPerformance', Object.assign(submitData, {id: this.vm.id})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
