/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/base-setting/company-rules'
export class Modifier extends BaseEditor {
  /** 初始化数据 */
  initData (salaryMatrixId) {
    this.vm.load()
    return req('getSalaryForm', {salaryMatrixId: salaryMatrixId}).then(res => {
      if (res) this.vm.form = this.transformData(res)
      this.vm.loaded()
    })
  }

  /** 数据格式转换 */
  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    return data
  }

  /** 数据保存 */
  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('putSalaryForm', Object.assign(submitData, {salaryMatrixId: this.vm.salaryMatrixId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
