/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/check-give/outer-taxpay-log'
export class Modifier extends BaseEditor {

  initData (accountId) {
    req('getTaxpayById', {transferId: accountId}).then(res => {
      if (res) {
        this.vm.formDate.taxMonth = res.taxMonth
        this.vm.form = this.transformData(res)
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
    const submitData = Object.assign(JSON.parse(JSON.stringify(this.vm.form)), this.vm.formDate)
    return new Promise(resolve => {
      req('updateTaxpayById', Object.assign(submitData, {transferId: this.vm.accountId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
