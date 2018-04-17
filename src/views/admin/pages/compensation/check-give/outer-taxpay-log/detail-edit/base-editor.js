/**
 * Created by liumian on 2017-12-2.
 */
import { showMessage, proxy } from 'utils/index'
import req from 'api/compensation/check-give/outer-taxpay-log'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.datesKey = ['taxMonth']
  }
  initData () {}

  save () {
    const submitData = Object.assign(JSON.parse(JSON.stringify(this.vm.form)), this.vm.formDate)
    return new Promise(resolve => {
      req('addTaxpay', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      })
    })
  }

  showReqMessage (res, successText = '保存成功！', failText = '保存失败！') {
    if (res) {
      showMessage('success', successText)
    } else {
      showMessage('warning', failText)
    }
  }
}
