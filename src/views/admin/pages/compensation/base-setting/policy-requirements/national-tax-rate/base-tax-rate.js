/**
 * Created by ZHANZF on 2017-11-6.
 */
import { showMessage, confirmPopover, proxy } from 'utils/index'
import req from 'api/compensation/base-setting/policy-requirements'
export class BaseTaxRate {
  constructor (opt) {
    proxy.call(this, opt)
  }
  initData () {
    // delete this.vm.selected.payIitaxrateInfoList
    delete this.vm.selected.id
    delete this.vm.selected.iitaxrateId
    this.vm.form = this.transformData(Object.assign(this.vm.form, this.vm.selected))
    this.vm.loading = false
  }
  transformData (data) {
    const length = data.payIitaxrateInfoList.length
    data.effectiveDate = new Date(data.effectiveDate)
    data.uneffectiveDate = new Date(data.uneffectiveDate)
    for (let [index, item] of data.payIitaxrateInfoList.entries()) {
      // 为表格行增加唯一标识，避免增加行时复用之前的dom
      // data.id = Math.random()
      if (index === length - 1) {
        this.vm.$set(item, 'taxableIncomeMax', '正无穷')
      } else {
        this.vm.$set(item, 'taxableIncomeMax', data.payIitaxrateInfoList[index + 1].taxableIncomeMin)
      }
    }
    return data
  }
  addRow (scope) {
    // 如果是最后一行，则将该行的最大上限改为null
    if (this.isLastRow(scope.$index)) {
      if (isNaN(parseFloat(scope.row.taxableIncomeMax))) {
        scope.row.taxableIncomeMax = null
      } else {
        scope.row.taxableIncomeMax = parseFloat(scope.row.taxableIncomeMax)
      }
    }
    const min = scope.row.taxableIncomeMax
    this.vm.form.payIitaxrateInfoList.splice(scope.$index + 1, 0, {
      taxableIncomeMin: min,
      taxableIncomeMax: this.isLastRow(scope.$index) ? '正无穷' : null,
      taxrate: null,
      qdnumber: null,
      id: Math.random()
    })
  }
  deleteRow (scope) {
    if (this.vm.form.payIitaxrateInfoList.length === 1) {
      showMessage('warning', '已剩最后一项！')
    } else {
      confirmPopover('warning', '确认删除该项吗？', () => {
        this.vm.form.payIitaxrateInfoList.splice(scope.$index, 1)
      })
    }
  }
  handleChange (value, scope) {
  }
  handleMinChange (value, scope) {
    if (scope.store.states.data[scope.$index - 1]) {
      scope.store.states.data[scope.$index - 1].taxableIncomeMax = parseFloat(value)
    }
    // // 推入校验信息
    // this.pushRules(this.vm.minRules, {
    //   max: scope.row.taxableIncomeMax, type: 'number', message: '不能超过上限！', trigger: 'blur'
    // })
    // // 进行校验
    // this.vm.$refs[`taxableIncomeMin${scope.$index}`].validate('blur')
    // // 推入校验信息
    // this.pushRules(this.vm.maxRules, {
    //   min: value, type: 'number', message: '不能低于下限！', trigger: 'blur'
    // })
    // // 进行校验
    // this.vm.$refs[`taxableIncomeMax${scope.$index}`].validate('blur')
  }
  handleMaxChange (value, scope) {
    if (scope.store.states.data[scope.$index + 1]) {
      scope.store.states.data[scope.$index + 1].taxableIncomeMin = parseFloat(value)
    }
    // // 推入校验信息
    // this.pushRules(this.vm.maxRules, {
    //   min: scope.row.taxableIncomeMin, type: 'number', message: '不能低于下限！', trigger: 'blur'
    // })
    // // 进行校验
    // this.vm.$refs[`taxableIncomeMax${scope.$index}`].validate('blur')
    // // 推入校验信息
    // this.pushRules(this.vm.minRules, {
    //   max: value, type: 'number', message: '不能超过上限！', trigger: 'blur'
    // })
    // // 进行校验
    // this.vm.$refs[`taxableIncomeMin${scope.$index}`].validate('blur')
  }

  save () {
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postBaseTaxRate', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }
  isLastRow (rowIndex) {
    return rowIndex === this.vm.form.payIitaxrateInfoList.length - 1
  }
  isFirstRow (rowIndex) {
    return rowIndex === 0
  }
  compareData (a, b) {
    return b ? !b : parseInt(a) < parseInt(b)
  }
  pushRules (rules, rule) {
    const length = rules.length
    if (length > 1) {
      rules.pop()
      rules.push(rule)
    } else {
      rules.push(rule)
    }
  }

  showReqMessage (res, successText = '保存成功！', failText = '保存失败！') {
    if (res) {
      showMessage('success', successText)
    } else {
      showMessage('warning', failText)
    }
  }

  transformSubmitData (data) {
    const submitData = JSON.parse(JSON.stringify(data))
    submitData.effectiveDate = Date.parse(submitData.effectiveDate)
    submitData.uneffectiveDate = Date.parse(submitData.uneffectiveDate)
    this.vm.setUneffectiveDate(submitData)
    return submitData
  }
}
