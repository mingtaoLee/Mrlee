/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/iaf/company-rules'
export class Modifier extends BaseEditor {

  initData (personnelGroupCode) {
    req('getNoneAccountOrg', {personnelGroupCode: personnelGroupCode}).then(res => {
      if (res) {
        this.vm.form = Object.assign(this.vm.form, this.transformData(res))
      }
    })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] && (data[key] = new Date(data[key]))
    })
    return data
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postOrgAccounts', Object.assign(submitData, {personnelGroupCode: this.vm.personnelGroupCode}))
      .then(res => {
        this.showReqMessage(res, '设置成功！', '设置失败！')
        resolve('modifier')
      })
      .catch(err => reject(err))
    })
  }
}
