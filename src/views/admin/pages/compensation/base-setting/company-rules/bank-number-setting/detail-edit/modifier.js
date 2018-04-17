/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/base-setting/company-rules'
export class Modifier extends BaseEditor {

  initData (payBankingFirmId) {
    this.vm.load()
    return req('getBankNumber', {payBankingFirmId: payBankingFirmId}).then(res => {
      if (res) {
        if (res.bankingFirmId === '' || res.bankingFirmId === null) {
          this.vm.isDisabledBankType = true
        } else {
          this.vm.isDisabledBankingFirmId = true
        }
        this.vm.form = this.transformData(res)
      }
      this.vm.loaded()
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
    return new Promise((resolve, reject) => {
      req('putBankNumber', Object.assign(submitData, {payBankingFirmId: this.vm.payBankingFirmId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
