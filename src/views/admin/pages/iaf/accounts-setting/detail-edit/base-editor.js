/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, proxy } from 'utils/index'
import req from 'api/iaf/company-rules'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.datesKey = ['openingDate', 'effectiveDate', 'executeDate', 'uneffectiveDate']
  }
  initData () {}

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postAccounts', submitData)
      .then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      })
      .catch(err => {
        reject(err)
      })
    })
  }

  showReqMessage (res, successText = '保存成功！', failText = '保存失败！') {
    if (res) {
      showMessage('success', successText)
      let paramData = {
        userId: this.vm.$store.getters.userId,
        accountHasAll: 'N',
        account: [
          {
            accountCode: this.vm.form.accountCode
          }
        ]
      }
      req('dataGrant', paramData).then(res => {
        console.log(res, 'res')
      })
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