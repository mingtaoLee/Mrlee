/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/employee-info/salary-standard'
export class Modifier extends BaseEditor {

  initData (empfullsalaryId) {
    this.vm.load()
    return req('getUpdatesStandard', {empfullsalaryId: empfullsalaryId}).then(res => {
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
    return new Promise(resolve => {
      req('putUpdatesStandard', Object.assign(this.vm.form, {empfullsalaryId: this.vm.empfullsalaryId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
