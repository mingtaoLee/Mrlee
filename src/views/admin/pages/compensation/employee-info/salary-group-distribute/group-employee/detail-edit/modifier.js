/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/employee-info/salary-distribute'
export class Modifier extends BaseEditor {

  initData (empgroupId) {
    this.vm.load()
    return req('getEmpgroupItem', {empgroupId: empgroupId}).then(res => {
      if (res) this.vm.form = this.transformData(res)
      this.vm.setIsDateDisabled()
      this.vm.loaded()
    })
  }

  transformData (data) {
    data.effectiveDate = new Date(data.effectiveDate)
    // data.uneffectiveDate = new Date(data.uneffectiveDate)
    return data
  }

  save () {
    return new Promise((resolve, reject) => {
      req('putEmpgroupItem', Object.assign(this.vm.form, {empgroupId: this.vm.empgroupId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
