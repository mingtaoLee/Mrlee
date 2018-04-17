/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, confirmPopover, proxy } from 'utils/index'
import req from 'api/compensation/data-collection/cashier-performance'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.datesKey = ['cashMonth']
  }
  initData () {}

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise(resolve => {
      req('postCashierPerformanceList', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      })
    })
  }

  addRow (scope) {
    this.vm.form.cashPerfInfoList.splice(scope.$index + 1, 0, {
      cashPerfConfigId: '',
      label: '',
      price: '',
      rewardPunishNum: ''
    })
  }
  deleteRow (scope) {
    if (this.vm.form.cashPerfInfoList.length === 1) {
      showMessage('warning', '已剩最后一项！')
    } else {
      confirmPopover('warning', '确认删除该项吗？', () => {
        // 删除完取消选项禁用
        this.vm.setDisabledOption(scope.row.cashPerfConfigId, false)
        this.vm.form.cashPerfInfoList.splice(scope.$index, 1)
        this.vm.calculateAmount()
      })
    }
  }
  showReqMessage (res, successText = '抽数成功！') {
    if (res) {
      showMessage('success', successText)
    }
    //  else {
    //   showMessage('warning', failText)
    // }
  }
  // showReqMessage (res, successText = '保存成功！', failText = '保存失败！') {
  //   if (res) {
  //     showMessage('success', successText)
  //   } else {
  //     showMessage('warning', failText)
  //   }
  // }

  transformSubmitData (data) {
    const submitData = JSON.parse(JSON.stringify(data))
    this.datesKey.map(key => {
      submitData[key] = Date.parse(submitData[key])
    })
    return submitData
  }
}
