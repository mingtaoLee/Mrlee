/**
 * Created by liumian on 2017-12-2.
 */
import { showMessage, proxy } from 'utils/index'
import req from 'api/compensation/check-give/laborhour-tranfer'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
  }
  initData () {}

  save () {
    const submitData = JSON.parse(JSON.stringify(this.vm.form))
    return new Promise(resolve => {
      req('postLaborhour', submitData).then(res => {
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

  transformSubmitData (data) {
    const submitData = JSON.parse(JSON.stringify(data))
    this.datesKey.map(key => {
      submitData[key] = Date.parse(submitData[key])
    })
    return submitData
  }
}
