/**
 * Created by Administrator on 2017-10-19.
 */
import { Util } from '../i-tree/utils'
import axios from 'utils/fetch'
export class BaseSelect {
  constructor (opts) {
    Util.proxyOpts.call(this, opts)
  }
  setDefaultCheckedKeys (keys) {
    this.vm.defaultCheckedKeys = keys || []
  }
  emitInput (value) {
    this.vm.emitInput(value || '')
  }
  handleNodeClick () {
  }
  deleteSelected () {
  }
  /** 查询节点 */
  searchNodes (searchName) {
    if (!searchName) {
      this.vm.searchNodes = []
      return
    }
    axios.get(window.globalComponentVariable.iTree[this.vm.dataKey].searchUrl(searchName), { params: {hasGrant: this.vm.hasGrant} }).then(res => {
      if (!res) return
      if (res.length > 50) res.length = 50
      this.vm.searchNodes = res
    }).catch(err => {
      console.log(err)
    })
  }
  /** 根据ids集合获取对应节点集合 */
  getNodesByIds (ids) {
    return new Promise(resolve => {
      if (this.vm.lazy) {
        axios.get(window.globalComponentVariable.iTree[this.vm.dataKey].lazy.someUrl(ids)).then(res => {
          if (res) {
            resolve(res)
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.vm.$on('loaded', res => {
          let arr = []
          if (!res && !res.length) return resolve([])
          for (let node of res) {
            if (ids.includes(node[this.vm.nodeKey])) {
              arr.push(node)
            }
          }
          resolve(arr)
        })
      }
    })
  }
}
