/**
 * Created by zzf on 2017-10-18.
 */
import { Util } from './utils'
import { BaseTree } from './baseTree'
export class LazyTree extends BaseTree {
  loadNode (node, resolve) {
    if (node.level === 0) {
      this.getRootNode().then(node => {
        if (!Array.isArray(node)) node = [node]
        resolve(node)
        // this._setDefaultCheckedKeys(node)
        // this._batchLoad(node, resolve)
        this.vm.loading = false
        this.vm.$nextTick(() => {
          this.vm.$emit('loaded', node)
        })
      })
    } else {
      this.getChildrenNode(node.data[this.nodeKey]).then(node => {
        resolve(node)
        // this._setDefaultCheckedKeys(node)
        // this._batchLoad(node, resolve)
      })
    }
  }
  // 获取根节点
  getRootNode () {
    let url = window.globalComponentVariable.iTree[this.dataKey].lazy.rootUrl(this.rootId, this.vm.hasGrant)
    return Util.fetNodeData(url)
  }
  // 获取子节点
  getChildrenNode (id) {
    const url = window.globalComponentVariable.iTree[this.dataKey].lazy.childUrl(id, this.vm.hasGrant)
    return Util.fetNodeData(url)
  }
  // 每隔200毫秒加载20个节点
  _batchLoad (node, resolve) {
    const resolveData = Util.batchLoad(node, function (data) {
      resolve(data)
      this._setDefaultCheckedKeys(data)
    }.bind(this), 20, 200, this.vm)
    resolveData(node)
  }
}
