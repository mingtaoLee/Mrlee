/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, proxy } from 'utils/index'
import moment from 'moment'
import req from 'api/iaf/company-rules'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.datesKey = ['auditDate', 'uditEndDate']
  }
  initData () {}

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postAnnualAuditList', submitData)
      .then(res => {
        this.showReqMessage(res)
        resolve(!!res)
        this.vm.toolbar[1].loading = false
      })
      .catch(err => {
        console.log('err', err)
        this.vm.toolbar[1].loading = false
        reject(err)
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
