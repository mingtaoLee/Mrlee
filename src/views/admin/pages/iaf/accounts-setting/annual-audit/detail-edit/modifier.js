/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/iaf/company-rules'
export class Modifier extends BaseEditor {

  initData (unempAuditId) {
    req('getAnnualAudit', {unempAuditId: unempAuditId}).then(res => {
      if (res) this.vm.form = this.transformData(res)
      this.vm.form.orgUnitCode = '数据库暂时没有'
      this.vm.form.orgUnitName = '数据库暂时没有'
    })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    data.auditYear = new Date(data.auditYear)
    return data
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('putAnnualAudit', Object.assign(submitData, {unempAuditId: this.vm.unempAuditId}))
      .then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        this.vm.toolbar[1].loading = false
        resolve('modifier')
      })
      .catch(err => {
        this.vm.toolbar[1].loading = false
        reject(err)
      })
    })
  }
}
