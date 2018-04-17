/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/employee-info/work-calendar'
export class Modifier extends BaseEditor {

  /** 数据获取 */
  initData (attendanceBasisId) {
    this.vm.load()
    return req('getWorkCalendar', {attendanceBasisId: attendanceBasisId}).then(res => {
      if (res) {
        this.vm.form = this.transformData(res)
        this.setDefaultPersonnel(res)
      }
      this.vm.setIsDateDisabled()
      this.vm.loaded()
    })
  }

  /** 设置默认选择人员 */
  setDefaultPersonnel (data) {
    this.vm.selectedPersonnel.push({ employeeName: data.fullName, employeeId: data.employeeId })
  }

  /** 数据转换 */
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
      req('putWorkCalendar', Object.assign(submitData, {attendanceBasisId: this.vm.attendanceBasisId})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
