/**
 * Created by ZHANZF on 2017-11-8.
 */
import { showMessage, proxy } from 'utils/index'
import req from 'api/compensation/base-setting/company-rules'
export class BaseEditor {
  constructor (opt) {
    proxy.call(this, opt)
    this.datesKey = ['effectiveDate', 'uneffectiveDate']
  }
  initData () {}

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

  addRow (scope) {
    let data = Object.assign({}, scope.row)
    delete data['_id']
    this.vm.$refs['iTable'].createData({
      companyAccountId: '',
      payAccount: '',
      payBankType: ''
    })
  }
  deleteRow (scope) {
    let vm = this.vm.$refs['iTable']
    if (vm.clone.length === 1) {
      showMessage('warning', '已剩最后一项！')
    } else {
      this.vm.setDisabledOption(scope.row.payAccount, false)
      vm.deleteData([scope.row])
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
      submitData[key] = Date.parse(submitData[key])
    })
    submitData.payAccountList = this.vm.$refs.iTable.clone
    this.vm.setUneffectiveDate(submitData)
    return submitData
  }
}
