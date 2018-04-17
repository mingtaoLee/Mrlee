/**
 * Created by ZHANZF on 2017-11-8.
 */
import { Modifier } from './modifier'
import req from 'api/compensation/employee-info/work-calendar'
export class NewEditor extends Modifier {
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

  save () {
    delete this.vm.form[this.vm.idKey]
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postWorkCalendarList', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
