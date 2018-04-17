/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/base-setting/company-rules'
export class Modifier extends BaseEditor {

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

  // 每隔100毫秒加载20个节点
  _batchLoad (payComponentListItemList, resolve) {
    const resolveData = this.batchLoad(payComponentListItemList, function (data) {
      resolve(data)
    }, 10, 100, this.vm)
    resolveData(payComponentListItemList)
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('putPayComponent', Object.assign(submitData, {componentListId: this.vm.componentListId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
