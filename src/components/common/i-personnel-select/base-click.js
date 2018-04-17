/**
 * Created by Administrator on 2017-7-11.
 */
export class BaseClickFn {
  constructor (vm) {
    this.vm = vm
  }

  handleItemClick (item) {
    this.vm.currentSelectedItem = item
    this.vm.rightSelectedItems = this._resetSelectedItems(this.vm.rightSelectedItems)
    this.vm.leftSelectedItems = this._resetSelectedItems(this.vm.leftSelectedItems)
    this.vm.leftSelectedItems = []
    this.vm.rightSelectedItems = []
    this.vm.leftSelectedItems.push(item)
    item.isActive = 'Y'
  }

  handleItemCtrlClick (item) {
    if (!this.vm.multiple) return
    if (item.isActive === 'Y') {
      this.vm.leftSelectedItems = this.vm.leftSelectedItems.filter(value => {
        return value[this.vm.personnelProps.id] !== item[this.vm.personnelProps.id]
      })
      item.isActive = 'N'
      return
    }
    this.vm.leftSelectedItems.push(item)
    this.vm.currentSelectedItem = item
    item.isActive = 'Y'
  }

  handleItemDoubleClick (item) {
    this._handleAddItem(item)
  }

  handleItems (status) {
    if (status === 'add') {
      if (!this.vm.leftSelectedItems.length) return
      for (let item of this.vm.leftSelectedItems) {
        this._handleAddItem(item)
      }
    } else {
      if (!this.vm.rightSelectedItems.length) return
      for (let item of this.vm.rightSelectedItems) {
        this.vm.rightItems = this.vm.rightItems.filter(theItem => theItem[this.vm.personnelProps.id] !== item[this.vm.personnelProps.id])
      }
      this.vm.currentSelectedItem = null
      this.vm.rightSelectedItems = []
    }
  }

  handleAllItems (status) {
    if (status === 'add') {
      if (!this.vm.leftItems.length) return
      for (let item of this.vm.leftItems) {
        this._handleAddItem(item)
      }
      this.vm.leftSelectedItems = this._resetSelectedItems(this.vm.leftSelectedItems)
      this.vm.leftSelectedItems = []
    } else {
      if (!this.vm.rightItems.length) return
      this.vm.rightItems = []
      this.vm.rightSelectedItems = []
      this.vm.leftSelectedItems = this._resetSelectedItems(this.vm.leftSelectedItems)
      this.vm.leftSelectedItems = []
    }
    this.vm.currentSelectedItem = null
  }

  // 上下移动功能，暂时屏蔽
  handleItemMove (status) {
    let currentIndex
    currentIndex = this.vm.leftItems.findIndex(item => item[this.vm.personnelProps.id] === this.vm.currentSelectedItem[this.vm.personnelProps.id])
    if (!this.vm.currentSelectedItem.id) return
    if (status === 'up') {
      if (currentIndex === 0) return
      currentIndex--
      this.vm.leftSelectedItems = this._resetSelectedItems(this.vm.leftSelectedItems)
      this.vm.leftSelectedItems = []
      this.vm.currentSelectedItem = this.vm.leftItems[currentIndex]
      this.vm.currentSelectedItem.isActive = 'Y'
      this.vm.leftSelectedItems.push(this.vm.leftItems[currentIndex])
    } else {
      if (currentIndex === this.vm.leftItems.length - 1) return
      currentIndex++
      this.vm.leftSelectedItems = this._resetSelectedItems(this.vm.leftSelectedItems)
      this.vm.leftSelectedItems = []
      this.vm.currentSelectedItem = this.vm.leftItems[currentIndex]
      this.vm.currentSelectedItem.isActive = 'Y'
      this.vm.leftSelectedItems.push(this.vm.currentSelectedItem)
    }
  }

  _handleAddItem (item) {
    let theItem = JSON.parse(JSON.stringify(item))
    theItem.isActive = 'N'
    let isIn = this.vm.rightItems.find(item => {
      return item[this.vm.personnelProps.id] === theItem[this.vm.personnelProps.id]
    })
    if (isIn) return
    // 多选单选条件分别处理
    if (!this.vm.multiple) {
      this.vm.rightItems.splice(0, 1, theItem)
    } else {
      this.vm.rightItems.push(theItem)
    }
  }

  _resetSelectedItems (items) {
    return items.filter(item => {
      item.isActive = 'N'
      return item
    })
  }

  _cloneOpts (opts) {
    for (let [key, value] of Object.entries(opts)) {
      this.vm[key] = value
    }
  }
}
