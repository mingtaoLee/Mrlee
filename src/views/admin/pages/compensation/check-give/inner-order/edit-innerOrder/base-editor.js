/**
 * Created by liumian on 2017-12-2.
 */
import { showMessage, proxy } from 'utils/index'
import req from 'api/compensation/check-give/inner-order'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.datesKey = ['beginDate', 'endDate', 'allocationProportion']
  }
  initData () {}

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise(resolve => {
      req('postCostTranferLog', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      })
    })
  }

  showReqMessage (res, successText = '保存成功！', failText = '保存失败！') {
    if (res) {
      showMessage('success', successText)
    } else {
      showMessage('error', failText)
    }
  }

  transformSubmitData (data) {
    const submitData = JSON.parse(JSON.stringify(data))
    this.datesKey.map(key => {
      if (key === 'allocationProportion') {
        // 将百分比转换为小数
        submitData[key] = data[key] ? data[key] / 100 : ''
      } else {
        submitData[key] = Date.parse(submitData[key])
      }
    })
    return submitData
  }
}
