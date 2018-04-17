/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, proxy } from 'utils/index'
import moment from 'moment'
import req from 'api/compensation/base-setting/company-rules'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.datesKey = ['auditDate', 'uditEndDate']
  }
  initData () {}

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise(resolve => {
      req('postAnnualAuditList', submitData).then(res => {
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
    submitData.auditYear = moment(submitData.auditYear).format('YYYY')
    return submitData
  }
}
