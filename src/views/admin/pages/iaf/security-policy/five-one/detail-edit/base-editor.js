/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, proxy } from 'utils/index'
import req from 'api/iaf/policy-requirements'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.initFormKeys = Object.keys(this.vm.form)
  }
  initData () {}

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postSecurityPolicyDetail', {id: this.vm.id, ...submitData})
      .then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      })
      .catch(err => reject(err))
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
    let submitData = {}
    this.initFormKeys.forEach(item => {
      submitData[item] = JSON.parse(JSON.stringify(data))[item]
    })
    submitData.effectiveDate = Date.parse(submitData.effectiveDate)
    submitData.uneffectiveDate = Date.parse(submitData.uneffectiveDate)
    return submitData
  }
}
