/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, confirmPopover, proxy } from 'utils/index'
import req from 'api/compensation/data-collection/attendance-data'
import moment from 'moment'

export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.datesKey = ['checkMonth']
  }
  initData () {
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postAttendances', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }

  addRow (scope) {
    this.vm.form.list.splice(scope.$index + 1, 0, {
      key: '',
      value: null,
      id: Math.random()
    })
  }
  deleteRow (scope) {
    if (this.vm.form.list.length === 1) {
      showMessage('warning', '已剩最后一项！')
    } else {
      confirmPopover('warning', '确认删除该项吗？', () => {
        // 删除完取消选项禁用
        this.vm.setDisabledOption(scope.row.key, false)
        this.vm.form.list.splice(scope.$index, 1)
      })
    }
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
    // 重新排列上传数据
    submitData.list.map(item => {
      submitData[item.key] = item.value
    })
    this.datesKey.map(key => {
      submitData[key] = moment(submitData[key]).format('YYYYMM')
      // submitData[key] = Date.parse(submitData[key])
    })
    delete submitData.list
    return submitData
  }
}