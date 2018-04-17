/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, proxy } from 'utils/index'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
  }

  initData (id) {
    this.vm.load()
    this.dataConfirmConfig.req('getSalaryDiff', {id: id}).then(res => {
      if (res) {
        if (res.checkMonth !== null) {
          res.checkMonth = this.transformToDate(res.checkMonth)
        }
        this.vm.form = this.transformData(res)
      }
      this.vm.loaded()
    })
  }
  transformToDate (value) {
    return value.slice(0, 4) + '-' + value.slice(4)
  }
  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    return data
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
