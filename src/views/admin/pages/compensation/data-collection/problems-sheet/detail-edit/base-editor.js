/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, proxy } from 'utils/index'
import req from 'api/compensation/data-collection/problems-sheet'
import moment from 'moment'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.datesKey = ['createDate', 'lastUpdateDate', 'checkMonth']
  }
  initData () {}

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('addSheet', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      }).catch(err => {
        console.log(`Error: ${err.message}`)
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
      submitData[key] = moment(submitData[key]).format('YYYYMM')
      // submitData[key] = Date.parse(submitData[key])
    })
    return submitData
  }
}