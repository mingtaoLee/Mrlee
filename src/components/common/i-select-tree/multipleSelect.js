/**
 * Created by Administrator on 2017-10-19.
 */
import { BaseSelect } from './baseSelect'
export class MultipleSelect extends BaseSelect {
  // 设置选中值
  setValue (selected, node, data, isChecked) {
    const nodeKey = this.nodeKey
    let selectedOption = selected.length ? JSON.parse(JSON.stringify(selected)) : []
    if (isChecked) {
      // 父子互不关联
      if (this.vm.checkStrictly) {
        selectedOption.push(data)
      } else if (node.checked && node.childNodes.length && node.childNodes[0].checked) {
        let childNodes = node.childNodes
        selectedOption = selectedOption.filter(item => {
          for (let node of childNodes) {
            if (node.data[nodeKey] === item[nodeKey]) return false
          }
          return true
        })
      }
      if (!(node.parent && node.parent.checked && (node.level !== 1)) && !this.vm.checkStrictly) selectedOption.push(data)
    } else {
      // 父子互不关联
      selectedOption = selectedOption.filter(item => {
        return item[nodeKey] !== data[nodeKey]
      })
      if (!this.vm.checkStrictly && node.parent && node.parent.childNodes) {
        let childNodes = node.parent.childNodes
        for (let item of childNodes) {
          if (item.checked) {
            let isIn = selectedOption.find(theItem => {
              return item.data[nodeKey] === theItem[nodeKey]
            })
            if (isIn) continue
            selectedOption.push(item.data)
          }
        }
      }
    }
    this.vm.selected = selectedOption
  }

  initValue (value) {
    if (value) {
      const ids = value.split(',')
      this.setDefaultCheckedKeys(ids)
      this.getNodesByIds(ids).then(nodes => {
        this.vm.selected.splice(0, -1, ...nodes)
      })
    } else {
      this.deleteSelected(this.vm.selected)
    }
  }
  deleteSelected (selected) {
    if (selected && selected.length) {
      this._resetChecked(selected)
      this._resetValue(selected)
    }
  }
  _resetChecked (selected) {
    selected.forEach(node => {
      this.vm.setChecked(node)
    })
  }
  _resetValue (selected) {
    this.vm.selected = []
  }
}
