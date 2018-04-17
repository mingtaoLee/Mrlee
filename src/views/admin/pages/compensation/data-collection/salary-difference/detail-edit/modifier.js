/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import { dateFormat } from 'utils/index'

export class Modifier extends BaseEditor {
  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    submitData.checkMonth = dateFormat(submitData.checkMonth, 'YYYYMM')
    return new Promise((resolve, reject) => {
      this.dataConfirmConfig.req('putSalaryDiff', Object.assign(submitData, {id: this.vm.id})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
