/**
 * Created by Administrator on 2017-10-19.
 */
import { BaseSelect } from './baseSelect'
export class SingleSelect extends BaseSelect {
  // 设置选项值
  setValue (data) {
    this.vm.inputValue = data[this.props.label] || ''
    this.vm.selected = data
  }
  // 节点点击事件，节点点击后设置input框值，触发input事件，隐藏下拉框
  handleNodeClick (data) {
    this.setValue(data)
    this.vm.emitInput(this.vm.selected[this.nodeKey])
    this.vm.hideTree()
  }
  // 初始化选项
  initValue (value) {
    if (value) {
      this.getNodesByIds([value]).then(node => {
        node.length && this.setValue(node[0])
      })
    } else {
      this._resetValue()
    }
  }
  setSelectedNode (data) {
    let selectedNode = this.vm.selectedNode
    if (!selectedNode) selectedNode = {}
    for (let attr in data) {
      selectedNode[attr] = data[attr]
    }
  }
  // 删除选项
  deleteSelected () {
    this._resetValue()
    this.vm.emitInput('')
  }
  // 重置选项值
  _resetValue () {
    this.vm.inputValue = ''
    this.vm.selected = null
    this.vm.emitInput('')
    // 重置node节点高亮状态
    this.vm.$refs.iTree && this.vm.$refs.iTree.treeInstance.resetActiveNodeColor()
  }
}
