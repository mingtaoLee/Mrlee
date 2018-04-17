/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/data-collection/problems-sheet'
import { formatDate } from 'utils/organization'
export class Modifier extends BaseEditor {

  initData (id) {
    this.vm.load()
    req('getSheetById', {id: id}).then(res => {
      if (res.checkMonth !== null) {
        res.checkMonth = this.transformToDate(res.checkMonth)
      }
      if (res) this.vm.form = this.transformData(res)
      this.vm.loaded()
    })
  }
  transformToDate (value) {
    return new Date(value.slice(0, 4) + '-' + value.slice(4))
  }
  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    return data
  }

  save () {
    this.vm.form.createDate = formatDate(this.vm.form.createDate).slice(0, 10)
    this.vm.form.lastUpdateDate = formatDate(this.vm.form.lastUpdateDate).slice(0, 10)
    this.vm.form.questionMonth = formatDate(this.vm.form.questionMonth).slice(0, 10)
    const submitData = this.vm.form
    console.log(submitData)
    return new Promise((resolve, reject) => {
      req('modifySheet', Object.assign(submitData, {id: this.vm.id})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
