/**
 * Created by ZHANZF on 2017-11-8.
 */
import { Modifier } from './modifier'
import req from 'api/compensation/base-setting/company-rules'
export class NewEditor extends Modifier {
  initData (componentListId) {
    req('getPayComponent', {componentListId: componentListId}).then(res => {
      if (res) {
        this.vm.form = this.transformData(res)
        this.vm.loading = false
      }
      this.vm.setIsDateDisabled()
    })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    let arr = JSON.parse(JSON.stringify(data.payComponentListItemList))
    data.payComponentListItemList = []
    this._batchLoad(arr, (batchData) => {
      data.payComponentListItemList = [...data.payComponentListItemList, ...batchData]
    })
    return data
  }

  // 每隔200毫秒加载20个节点
  _batchLoad (payComponentListItemList, resolve) {
    const resolveData = this.batchLoad(payComponentListItemList, function (data) {
      resolve(data)
    }, 20, 200, this.vm)
    resolveData(payComponentListItemList)
  }

  transformSubmitData (data) {
    const submitData = JSON.parse(JSON.stringify(data))
    delete submitData.componentListId
    for (let item of submitData.payComponentListItemList) {
      delete item.listItemId
      delete item.componentListId
    }
    for (let item of submitData.payPayslipList) {
      delete item.componentListId
      delete item.payslipId
      for (let component of item.payslipItemInfoDtos) {
        delete component.oldPayslipItemType
        for (let salaryItem of component.payPayslipItemCategoryInfoDtos) {
          delete salaryItem.payslipItemId
        }
      }
    }
    this.datesKey.map(key => {
      submitData[key] = Date.parse(submitData[key])
    })
    this.vm.setUneffectiveDate(submitData)
    return submitData
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
}
