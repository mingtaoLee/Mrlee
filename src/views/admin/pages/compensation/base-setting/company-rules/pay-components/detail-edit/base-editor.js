/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, confirmPopover, proxy } from 'utils/index'
import req from 'api/compensation/base-setting/company-rules'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.datesKey = ['effectiveDate', 'uneffectiveDate']
  }
  initData () {
    this.vm.loading = false
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postPayComponent', submitData).then(res => {
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
      submitData[key] = Date.parse(submitData[key])
    })
    this.vm.setUneffectiveDate(submitData)
    return submitData
  }

  deleteRow ({ $index }) {
    if (this.vm.form.payComponentListItemList.length === 1) {
      showMessage('warning', '已剩最后一项！')
    } else {
      confirmPopover('warning', '确认删除该项吗？', () => {
        this.vm.form.payComponentListItemList.splice($index, 1)
      })
    }
  }

  // 分时加载函数
  batchLoad (arr, fn, num = 15, interval = 200, instance) {
    let time = 0
    let newArr = []
    let timer = null
    const start = function () {
      newArr = arr.splice(0, num)
      fn(newArr)
    }
    return function () {
      if (!time) {
        start()
        time = interval
      }
      timer = setInterval(function () {
        if (arr.length === 0) {
          fn([])
          return clearInterval(timer)
        }
        instance.$nextTick(function () {
          start()
        })
      }, time)
    }
  }
}
