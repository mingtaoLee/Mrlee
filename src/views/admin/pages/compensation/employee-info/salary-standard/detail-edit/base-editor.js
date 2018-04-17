/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, proxy } from 'utils/index'
import req from 'api/compensation/base-setting/company-rules'
export class BaseEditor {
  constructor (opt) {
    // 重定向参数属性
    proxy.call(this, opt)
    this.datesKey = ['effectiveDate', 'uneffectiveDate']
  }

  /** 数据初始化 */
  initData () {}

  /** 数据保存 */
  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postSalaryGroups', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }

  /** 消息提示 */
  showReqMessage (res, successText = '保存成功！', failText = '保存失败！') {
    if (res) {
      showMessage('success', successText)
    } else {
      showMessage('warning', failText)
    }
  }

  /** 提交数据转换 */
  transformSubmitData (data) {
    const submitData = JSON.parse(JSON.stringify(data))
    this.datesKey.map(key => {
      submitData[key] = Date.parse(submitData[key])
    })
    return submitData
  }
}
