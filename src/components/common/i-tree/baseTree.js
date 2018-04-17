/**
 * Created by Administrator on 2017-10-18.
 */
import { Util } from './utils'
export class BaseTree {
  constructor (opts) {
    Util.proxyOpts.call(this, opts)
  }
  // 设置当前高亮节点
  setActiveNodeColor (currentNode, instance) {
    if (instance.preActiveNode) instance.preActiveNode.style.color = 'black'
    currentNode.style.color = '#1894E1'
    instance.preActiveNode = currentNode
  }
  // 设置默认选中节点
  _setDefaultCheckedKeys (node) {
    if (!this.vm.defaultCheckedKeys.length || !this.multiple) return
    const nowCheckedIds = JSON.parse(JSON.stringify(this.vm.defaultCheckedKeys))
    for (let id of nowCheckedIds) {
      for (let item of node) {
        if ((item[this.nodeKey] + '') === (id + '')) {
          this.vm.$refs.tree.setChecked(item[this.nodeKey], true, true)
        }
      }
    }
  }
  resetActiveNodeColor () {
    if (this.vm.preActiveNode) {
      this.vm.preActiveNode.style.color = 'black'
    }
  }
}
