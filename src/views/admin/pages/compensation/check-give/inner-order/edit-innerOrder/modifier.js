/**
 * Created by ZHANZF on 2017-11-8.
 */
import { BaseEditor } from './base-editor'
import req from 'api/compensation/check-give/inner-order'
export class Modifier extends BaseEditor {

  initData (accountId) {
    req('getByIdCostTranfer', {costAufnId: accountId}).then(res => {
      if (res) {
        this.vm.defaultNode = { orgUnitId: res.transferInUnit, orgUnitName: res.transferInUnitName }
        this.getFetchSalaryCount(res)
        this.vm.form = this.transformData(res)
        this.vm.form.shareWay = res.allocationProportion ? '分摊比例' : '分摊金额'
      }
    })
  }
    // 获取应出勤天数和工资总额
  getFetchSalaryCount (data) {
    if (data.employeeId && data.transferMonth) {
      req('getSalaryCount', {employeeId: data.employeeId, month: data.transferMonth}).then(res => {
        this.vm.salaryAmount = res.salaryAmount == null ? 0 : res.salaryAmount
        this.vm.attendanceDay = res.attendanceDay == null ? 0 : res.attendanceDay
        this.verifyDay = res.verifyDay == null ? 0 : res.verifyDay
      }).catch(() => {
        this.verifyDay = false
      })
    }
  }
  transformData (data) {
    this.datesKey.map(key => {
      // 将小数转换为百分比
      if (key === 'allocationProportion') {
        data[key] = data[key] ? data[key] *= 100 : ''
      } else {
        data[key] = new Date(data[key])
      }
    })
    return data
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    // Object.keys(submitData).forEach(key => {
    //   if (key === 'createBy' || key === 'createDate' || key === 'lastUpdateBy' || key === 'lastUpdateDate') {
    //     delete submitData[key]
    //   }
    // })
    return new Promise(resolve => {
      req('updateByIdCostTranfer', submitData).then(res => {
        this.showReqMessage(res, '更新成功！', '更新失败！')
        resolve('modifier')
      })
    })
  }
}
