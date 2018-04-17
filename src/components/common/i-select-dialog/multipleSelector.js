import {BasicSelector} from './basicSelector'

export class MultipleSelector extends BasicSelector {
  handleWriteBack (selected) {
    const selectedValue = selected.map(item => {
      return item[this.valueKey]
    }).toString()
    this.vm.selected = selected.map(item => {
      return item[this.vm.props.label]
    }).join(' / ')
    this.vm.$emit('confirm', selected)
    this.vm.currentEmitValue = selectedValue
    this.vm.$emit('input', selectedValue)
  }
}
