/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/base-setting/company-rules'
export class Modifier extends BaseEditor {

  initData (componentId) {
    req('getClothingDetailById', {id: componentId}).then(res => {
      if (res) {
        this.vm.form = this.transformData(res)
        this.setDefaultNode(res)
      }
      this.vm.setIsDateDisabled()
    })
  }

  setDefaultNode (data) {
    this.vm.defaultNode = { orgUnitId: data.orgId, orgUnitName: data.orgUnitName }
  }

  transformData (data) {
    data.effectiveDate = new Date(data.effectiveDate)
    data.uneffectiveDate = new Date(data.uneffectiveDate)
    return data
  }

  save () {
    return new Promise(resolve => {
      req('modifyClothingList', Object.assign(this.vm.form, {id: this.vm.componentId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
