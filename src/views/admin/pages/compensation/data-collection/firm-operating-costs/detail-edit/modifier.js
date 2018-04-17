/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/data-collection/firm-operating-costs'
export class Modifier extends BaseEditor {

  initData (id) {
    // this.vm.form = Object.assign({}, id)
    this.vm.loading = true
    req('modifyFirmOperatingCosts', {id: id}).then(res => {
      if (res) {
        this.vm.form = this.transformData(res)
      }
      this.vm.loading = false
    })
  }

  transformData (data) {
    data.effectiveDate = new Date(data.effectiveDate)
    data.uneffectiveDate = new Date(data.uneffectiveDate)
    return data
  }

  save () {
    return new Promise((resolve, reject) => {
      req('modifyFirmOperatingCosts', this.vm.form).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
