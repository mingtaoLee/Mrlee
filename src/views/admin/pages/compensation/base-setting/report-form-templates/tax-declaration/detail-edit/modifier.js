/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/base-setting/report-form-templates'
export class Modifier extends BaseEditor {

  initData (iitTemplateId) {
    this.vm.load()
    return req('getTaxTplById', { iitTemplateId }).then(res => {
      if (res) this.vm.form = this.transformData(res)
      this.vm.loaded()
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
    return new Promise((resolve, reject) => {
      req('editTaxTpl', Object.assign(submitData)).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
