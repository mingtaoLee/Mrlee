/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/employee-info/bank-accounts'
export class Modifier extends BaseEditor {

  /** 数据获取 */
  initData (empAccountId) {
    this.vm.load()
    return new Promise(resolve => {
      req('getBankAccount', {empAccountId: empAccountId}).then(res => {
        if (res) {
          // res.account = parseInt(res.account)
          this.vm.form = this.transformData(res)
          this.setDefaultPersonnel(res)
          resolve(res.bankCode)
        }
        this.vm.setIsDateDisabled()
        this.vm.loaded()
      })
    })
  }

  /** 设置默认选择人员 */
  setDefaultPersonnel (data) {
    this.vm.selectedPersonnel.push({ employeeName: data.employeeName, empEmployeeId: data.empEmployeeId })
  }
  /** 数据转换 */
  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    return data
  }

  /** 数据保存 */
  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('putBankAccount', Object.assign(submitData, {empAccountId: this.vm.empAccountId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve(!!res)
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
