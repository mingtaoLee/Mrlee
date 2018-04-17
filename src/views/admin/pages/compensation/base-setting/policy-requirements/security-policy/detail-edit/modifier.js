/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/base-setting/policy-requirements'
export class Modifier extends BaseEditor {

  initData (id) {
    this.vm.load()
    return req('getSecurityPolicy', {id: id}).then(res => {
      if (res) this.vm.form = this.transformData(res)
      this.vm.setIsDateDisabled()
      this.vm.loaded()
    })
  }

  transformData (data) {
    data.effectiveDate = new Date(data.effectiveDate)
    data.uneffectiveDate = new Date(data.uneffectiveDate)
    return data
  }

  save () {
    return new Promise((resolve, reject) => {
      req('putSecurityPolicy', Object.assign(this.vm.form, {id: this.vm.id})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
