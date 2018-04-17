/**
 * Created by Administrator on 2017-7-11.
 */
import {BaseClickFn} from './base-click'
export class SelectedClickFn extends BaseClickFn {

  handleItemClick (item) {
    this.vm.currentSelectedItem = item
    this.vm.leftSelectedItems = this._resetSelectedItems(this.vm.leftSelectedItems)
    this.vm.rightSelectedItems = this._resetSelectedItems(this.vm.rightSelectedItems)
    this.vm.rightSelectedItems = []
    this.vm.leftSelectedItems = []
    this.vm.rightSelectedItems.push(item)
    item.isActive = 'Y'
  }

  handleItemCtrlClick (item) {
    if (item.isActive === 'Y') {
      this.vm.rightSelectedItems = this.vm.rightSelectedItems.filter(value => {
        return value[this.vm.personnelProps.id] !== item[this.vm.personnelProps.id]
      })
      item.isActive = 'N'
      return
    }
    this.vm.rightSelectedItems.push(item)
    this.vm.currentSelectedItem = item
    item.isActive = 'Y'
  }

  handleItemDoubleClick (rightItem) {
    this.vm.rightItems = this.vm.rightItems.filter(item => item[this.vm.personnelProps.id] !== rightItem[this.vm.personnelProps.id])// 为什么无效
    this.vm.currentSelectedItem = null
  }

  // 上下移动功能，暂时屏蔽
  handleItemMove (status) {
    let currentIndex
    currentIndex = this.vm.rightItems.findIndex(item => item[this.vm.personnelProps.id] === this.vm.currentSelectedItem[this.vm.personnelProps.id])

    if (!this.vm.currentSelectedItem.id) return
    if (status === 'up') {
      if (currentIndex === 0) return
      currentIndex--
      this.vm.rightSelectedItems = this._resetSelectedItems(this.vm.rightSelectedItems)
      this.vm.rightSelectedItems = []
      this.vm.currentSelectedItem = this.vm.rightItems[currentIndex]
      this.vm.currentSelectedItem.isActive = 'Y'
      this.vm.rightSelectedItems.push(this.vm.rightItems[currentIndex])
    } else {
      if (currentIndex === this.vm.rightItems.length - 1) return
      currentIndex++
      this.vm.rightSelectedItems = this._resetSelectedItems(this.vm.rightSelectedItems)
      this.vm.rightSelectedItems = []
      this.vm.currentSelectedItem = this.vm.rightItems[currentIndex]
      this.vm.currentSelectedItem.isActive = 'Y'
      this.vm.rightSelectedItems.push(this.vm.currentSelectedItem)
    }
  }
}
