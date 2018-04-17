/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/iaf/policy-requirements'
export class Modifier extends BaseEditor {

  initData () {
    req('getSecurityPolicyDetail', {id: this.vm.id, areaInfoId: this.vm.areaInfoId}).then(res => {
      if (res) this.vm.form = this.transformData(res)
    })
  }

  transformData (data) {
    data.effectiveDate = new Date(data.effectiveDate)
    data.uneffectiveDate = new Date(data.uneffectiveDate)
    return data
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('putSecurityPolicyDetail', Object.assign(submitData, {id: this.vm.id, areaInfoId: this.vm.areaInfoId}))
      .then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
      .catch(err => reject(err))
    })
  }
}
