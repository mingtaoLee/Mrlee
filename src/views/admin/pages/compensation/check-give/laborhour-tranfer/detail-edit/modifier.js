/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/check-give/laborhour-tranfer'
export class Modifier extends BaseEditor {

  initData (accountId) {
    req('getLaborhour', {transferId: accountId}).then(res => {
      if (res) this.vm.form = res
    })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    return data
  }

  save () {
    const submitData = JSON.parse(JSON.stringify(this.vm.form))
    return new Promise(resolve => {
      req('updateLaborhour', Object.assign(submitData, {transferId: this.vm.accountId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
