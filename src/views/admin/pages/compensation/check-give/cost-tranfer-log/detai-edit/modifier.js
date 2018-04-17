/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/check-give/cost-tranfer-log'
export class Modifier extends BaseEditor {

  initData (accountId) {
    req('getByIdCostTranfer', {transferId: accountId}).then(res => {
      if (res) {
        // this.vm.defaultNode = { orgUnitId: res.transferInUnit, orgUnitName: res.transferInUnitName }
        res.allocationProportion *= 100
        this.vm.form = this.transformData(res)
        this.costType = res.costType
      }
    })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    return data
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    submitData.allocationProportion /= 100
    Object.keys(submitData).forEach(key => {
      if (key === 'createBy' || key === 'createDate' || key === 'lastUpdateBy' || key === 'lastUpdateDate') {
        delete submitData[key]
      }
    })
    return new Promise(resolve => {
      req('updateByIdCostTranfer', submitData).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
