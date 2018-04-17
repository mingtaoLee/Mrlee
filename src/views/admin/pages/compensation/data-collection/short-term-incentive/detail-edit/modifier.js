/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/data-collection/short-term-incentive'
export class Modifier extends BaseEditor {

  initData (id) {
    this.vm.load()
    req('getBestirsById', {id: id}).then(res => {
      if (res) {
        res.checkMonth = this.transformToDate(res.checkMonth)
        this.vm.form = this.transformData(res)
        this.vm.table.data = res.bestirInfoDto
        // this.setDefaultPersonnel(res)
        // this.initDisabledOptions(this.vm.form.extraPayInfoDtosList)
      }
      this.vm.loaded()
    })
  }
  transformToDate (value) {
    return new Date(value.slice(0, 4) + '-' + value.slice(4))
  }
// 默认把工号姓名添加进去
  setDefaultPersonnel (data) {
    this.vm.selectedPersonnel.push({ employeeName: data.employeeName, empEmployeeId: data.empEmployeeId })
  }

  initDisabledOptions (data) {
    data.forEach(item => {
      this.vm.setDisabledOption(item.itemKey, true)
    })
  }

  transformData (data) {
    this.datesKey.map(key => {
      data[key] = new Date(data[key])
    })
    // data.extraPayInfoDtosList.map(item => {
    //   Object.keys(item).map(key => {
    //     item.key = key
    //     item.value = item[key]
    //     item.id = Math.random()
    //     delete item[key]
    //   })
    // })
    return data
  }

// 修改数据
  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('modifyBestirs', Object.assign(submitData, {id: this.vm.id})).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
