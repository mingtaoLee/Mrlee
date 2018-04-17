/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/data-collection/welfare-subsidy'
// import moment from 'moment'
export class Modifier extends BaseEditor {

  initData (id) {
    this.vm.load()
    req('getAllowancesById', { id }).then(res => {
      if (res) {
        if (res.checkMonth !== null) {
          res.checkMonth = this.transformToDate(res.checkMonth)
        }
        this.vm.form = this.transformData(res)
        res.allowanceInfoList.length > 0 && (this.vm.table.data = res.allowanceInfoList)
        // this.setDefaultPersonnel(res)
        // this.initDisabledOptions(this.vm.form.list)
      }
      this.vm.loaded()
    })
  }

  transformToDate (value) {
    return new Date(value.slice(0, 4) + '-' + value.slice(4))
  }
  setDefaultPersonnel (data) {
    this.vm.selectedPersonnel.push({ employeeName: data.employeeName, employeeId: data.employeeId })
  }

  initDisabledOptions (data) {
    data.forEach(item => {
      this.vm.setDisabledOption(item.key, true)
    })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    // data.list.map(item => {
    //   Object.keys(item).map(key => {
    //     item.key = key
    //     item.value = item[key]
    //     item.id = Math.random()
    //     delete item[key]
    //   })
    // })
    return data
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('modifyAllowances', Object.assign(submitData, {id: this.vm.id})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
