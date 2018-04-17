/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/base-setting/company-rules'
export class Modifier extends BaseEditor {

  initData () {
    this.vm.load()
    req('getFinance', {componentFinanceId: this.vm.componentFinanceId}).then(res => {
      if (res) this.vm.form = this.transformData(res)
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
    return new Promise((resolve, reject) => {
      req('putFinance', Object.assign(this.vm.form, {componentFinanceId: this.vm.componentFinanceId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
