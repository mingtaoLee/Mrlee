/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/data-collection/costume-performance'
export class Modifier extends BaseEditor {

  initData (attendanceBasisId) {
    req('getWorkCalendar', {attendanceBasisId: attendanceBasisId}).then(res => {
      if (res) this.vm.form = this.transformData(res)
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
    return new Promise(resolve => {
      req('putWorkCalendar', Object.assign(submitData, {attendanceBasisId: this.vm.attendanceBasisId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
