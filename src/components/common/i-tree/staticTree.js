/**
 * Created by zzf on 2017-10-18.
 */
import { Util } from './utils'
import { jsonTree } from 'utils/index'
import { BaseTree } from './baseTree'
export class StaticTree extends BaseTree {
  loadNode () {
    const url = window.globalComponentVariable.iTree[this.dataKey].staticUrl(this.rootId)
    const config = {
      id: this.nodeKey,
      pid: window.globalComponentVariable.iTree[this.dataKey].parentNodeKey
    }
    return new Promise(resolve => {
      Util.fetNodeData(url).then(nodeData => {
        if (!Array.isArray(nodeData)) nodeData = [nodeData]
        resolve(jsonTree(nodeData, config))
        this.vm.$nextTick(() => {
          this.vm.$emit('loaded', nodeData)
        })
      })
    })
  }
}
