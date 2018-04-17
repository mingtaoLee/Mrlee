/**
 * Created by liumian on 2017-12-2.
 */
import { showMessage, proxy } from 'utils/index'
import req from 'api/compensation/check-give/cost-tranfer-log'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.datesKey = ['beginDate', 'endDate']
  }
  initData () {}

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    submitData.allocationProportion /= 100
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
