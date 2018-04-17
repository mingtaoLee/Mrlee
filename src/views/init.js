// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'utils/polyfill.js'
import Vue from 'vue'
import '../filters'
import constants from 'config/constants'
import { loadingText } from 'config/constant'
import Element from 'element-ui'
import moment from 'moment'

// 全局配置moment为中文
moment.locale('zh-cn')

// 更改Element默认Attribute区域

// 更改el-button默认size属性为medium
Element.Button.props.size = {
  type: String,
  default: constants.button.size
}

// 更改el-select默认size属性为medium
Element.Select.props.size = {
  type: String,
  default: constants.select.size
}

// 更改el-select默认placeholder属性为请选择
Element.Select.props.placeholder = {
  type: String,
  default: constants.select.placeholder
}

// 更改el-input默认size属性为mini
Element.Input.props.size = {
  type: String,
  default: constants.input.size
}

// 更改el-input默认placeholder属性为请选择
Element.Input.props.placeholder = {
  type: String,
  default: constants.input.placeholder
}

// 更改el-datePiker默认size属性为mini
Element.DatePicker.props.size = {
  type: String,
  default: constants.datePiker.size
}

// 更改el-datePiker默认placeholder属性为请选择
Element.DatePicker.props.placeholder = {
  type: String,
  default: constants.datePiker.placeholder
}

// 更改el-table列的溢出隐藏属性showOverflowTooltip默认为true
Element.TableColumn.props.showOverflowTooltip = {
  type: Boolean,
  default: constants.table.showOverflowTooltip
}

// 更改el-table表格默认border属性为true
Element.Table.props.border = {
  type: Boolean,
  default: constants.table.border
}

// 更改el-table表格默认stripe属性为true
Element.Table.props.stripe = {
  type: Boolean,
  default: constants.table.stripe
}

// 更改el-table表格默认pageSizes属性为true
Element.Pagination.props.pageSizes = {
  type: Array,
  default () {
    return constants.table.pageSizes
  }
}

// 更改日期输入框不能输入
Element.DatePicker.props.editable = false

// import 'element-ui/lib/theme-default/index.css'
import '@/styles/element-theme/index.css'
import '@/styles/index.scss'
import '@/assets/fonts/iconfont.css'
import {dictFormat, currencyFormat} from 'utils/index'

Vue.prototype.$d = dictFormat
Vue.prototype.$$ = constants
Vue.prototype.$loadingText = loadingText
Vue.prototype.currencyFormat = currencyFormat
Vue.prototype.$eventBus = new Vue()

Vue.use(Element)

// 更改message的时间延时,默认5秒
let tempMessageFunc = Vue.prototype.$message
let updateMessageFunc = options => {
  return typeof options === 'string'
    ? tempMessageFunc({message: options, duration: 4000})
  : tempMessageFunc(Object.assign({duration: 4000}, options))
}
for (let key in tempMessageFunc) {
  let kind = ['success', 'warning', 'info', 'error']
  if (!kind.includes(key)) {
    updateMessageFunc[key] = tempMessageFunc[key]
  } else {
    updateMessageFunc[key] = message => updateMessageFunc({type: key, message})
  }
}
Vue.prototype.$message = updateMessageFunc

Vue.config.productionTip = false
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` 是组件的继承关系追踪
  return false
}

// i-layout组件全局注册
import ILayout from 'components/common/i-layout'
Vue.component('i-layout', ILayout)

// 全局重新注册el-form-item组件
import ElFormItem from 'components/common/el-form-item/el-form-item.vue'
Vue.component('el-form-item', ElFormItem)

// i-form组件全局注册
import IForm from 'components/common/i-form/i-form.vue'
Vue.component('i-form', IForm)

// i-select组件全局注册
import ISelect from 'components/common/i-select/i-select'
Vue.component('i-select', ISelect)

// i-select-tree组件全局注册
import ISelectTree from 'components/common/i-select-tree/i-select-tree'
Vue.component('i-select-tree', ISelectTree)

// i-select-field组件全局注册
import ISelectField from 'components/common/i-select-field'
Vue.component('i-select-field', ISelectField)

// i-search-conditions组件全局注册
import ISearchConditions from 'components/common/i-search-conditions'
Vue.component('i-search-conditions', ISearchConditions)

// i-table组件全局注册
import ITable from 'components/common/i-table'
Vue.component('i-table', ITable)

// i-table-cell组件全局注册
import ITableCell from 'components/common/i-table-cell'
Vue.component('i-table-cell', ITableCell)

// i-table-operator组件全局注册
import ITableOperator from 'components/common/i-table-operator'
Vue.component('i-table-operator', ITableOperator)

// 人员选择组件全局注册
import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
Vue.component('i-personnel-select', IPersonnelSelect)

// 弹窗组件全局注册
import IDialog from 'components/common/i-dialog/i-dialog.vue'
Vue.component('i-dialog', IDialog)

// popup弹窗组件全局注册
import IDialogPopup from 'components/common/i-dialog-popup'
Vue.component('i-dialog-popup', IDialogPopup)

// 地区选择组件全局注册
import ISelectArea from 'components/common/i-select-area'
Vue.component('i-select-area', ISelectArea)

import IProcessFlow from 'components/common/i-process-flow'
Vue.component('i-process-flow', IProcessFlow)

// 定义组件全局变量
import { globalComponentVariable } from 'config/globalComponentVariable'
window.globalComponentVariable = globalComponentVariable
// 函数原型方法
Function.prototype.after = function (afterFn = (() => {})) {
  let _this = this
  return function () {
    const ret = _this.apply(this, arguments)
    afterFn.apply(this, arguments)
    return ret
  }
}

Function.prototype.before = function (beforeFn = (() => {})) {
  let _this = this
  return function () {
    const next = beforeFn.apply(this, arguments)
    if (next) {
      return _this.apply(this, arguments)
    }
  }
}

/**
 * 改写Date对象原型方法
 */
// 改写toJSON方法修复在ajax请求中时间会被转换为标准时区时间
Date.prototype.toJSON = function dateToJSON () {
  return moment(this).format()
}

// 自定义指令
import drag from 'directives/drag'
Vue.directive('drag', drag)
