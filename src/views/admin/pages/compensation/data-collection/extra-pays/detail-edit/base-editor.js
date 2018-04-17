/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, confirmPopover, proxy } from 'utils/index'
import req from 'api/compensation/data-collection/extra-pays'
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
      req('postExtraPaysPerformanceList', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }

  addRow (scope) {
    this.vm.form.extraPayInfoDtosList.splice(scope.$index + 1, 0, {
      itemKey: '',
      itemValue: null,
      rowId: Math.random()
    })
  }
  deleteRow (scope) {
    if (this.vm.form.extraPayInfoDtosList.length === 1) {
      showMessage('warning', '已剩最后一项！')
    } else {
      confirmPopover('warning', '确认删除该项吗？', () => {
        // 删除完取消选项禁用
        this.vm.setDisabledOption(scope.row.key, false)
        this.vm.form.extraPayInfoDtosList.splice(scope.$index, 1)
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
    this.datesKey.map(key => {
      submitData[key] = moment(submitData[key]).format('YYYYMM')
      // submitData[key] = Date.parse(submitData[key])
    })
    return submitData
  }
  // transformSubmitData (data) {
  //   const submitData = JSON.parse(JSON.stringify(data))
  //   // 重新排列上传数据
  //   // submitData.extraPayInfoDtosList.map(item => {
  //   //   submitData[item.key] = item.value
  //   // })
  //   // submitData.submitData = submitData.extraPayInfoDtosList.map(item => {
  //   //   submitData[item.itemKey] = item.itemValue
  //   // })
  //   this.datesKey.map(key => {
  //     submitData[key] = Date.parse(submitData[key])
  //   })
  //   // delete submitData.extraPayInfoDtosList
  //   return submitData
  // }
}
