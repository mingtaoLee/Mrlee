import { proxy } from 'utils/index'
import axios from 'utils/fetch'
export class BasicSelector {
  constructor (opt) {
    proxy.call(this, opt)
    this.valueKey = this.vm.props.value
    this.labelKey = this.vm.props.label
  }

  initSelected (value) {
    if (!value) return
    this.getOptionsByValueKey(value).then(res => {
      if (Array.isArray(res)) {
        this.setSelected(res)
      } else {
        throw new Error('初始化显示数据返回值必须是数组！')
      }
    }).catch(err => {
      console.log(err)
    })
  }

  setSelected (data) {
    this.vm.selected = data.map(item => { item[this.labelKey] }).join(' / ')
  }

  openSelector () {
    this.vm.isShowDialog = true
  }

  closeSelector () {
    this.vm.isShowDialog = false
  }

  confirm () {
    const selected = this.vm.$refs.component.writeBack()
    this.handleWriteBack(selected)
    this.closeSelector()
  }

  getOptionsByValueKey (value) {
    const params = {}
    params[this.valueKey] = value
    return axios.get(window.globalComponentVariable.remoteSelect[this.dataKey].searchUrl, {
      params: params
    })
  }

  handleWriteBack (selected) {
    this.vm.selected = selected[this.vm.props.label]
    this.vm.currentEmitValue = selected[this.valueKey]
    this.vm.$emit('confirm', selected)
    this.vm.$emit('input', selected[this.valueKey])
  }

}
