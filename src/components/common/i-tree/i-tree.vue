<template>
  <div class="wrap">
    <el-tree
      :data="staticNodeData"
      :expand-on-click-node="false"
      :show-checkbox="showCheckbox"
      :lazy="lazy"
      :load="loadNode"
      :loading="loading"
      :node-key="nodeKey"
      ref="tree"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :check-strictly="checkStrictly"
      :props="props"
      :highlight-current="highlightCurrent"
      :render-content="renderContent"
      :filter-node-method="filterNodeMethod"
      @node-expand="handleNodeExpand"
      @node-click="handleNodeClick"
      @check-change="handleCheckChange"
      ></el-tree>
  </div>
</template>
<script type="text/jsx">
  import Emitter from 'mixins/emitterMixin'
  import { StaticTree } from './staticTree'
  import { LazyTree } from './lazyTree'
  import ITreeSearch from './i-tree-search.vue'
  import ElTree from '../tree/src/tree.vue'
  export default {
    name: 'ITree',
    mixins: [Emitter],
    props: {
      hasGrant: {
        type: Boolean,
        default: true
      },
      // 对应下拉树分类名称
      dataKey: {
        type: String,
        default: 'org'
      },
      nodeKey: {
        type: String,
        default: 'orgUnitId'
      },
      // 是否显示搜索框
      isSearch: {
        type: Boolean,
        default: true
      },
      // 是否懒加载
      lazy: {
        type: Boolean,
        default: true
      },
      // 根节点id
      rootId: String,
      // 是否每次只打开一个同级树节点
      accordion: {
        type: Boolean,
        default: true
      },
      // 是否显示多选框
      showCheckbox: {
        type: Boolean,
        default: false
      },
      // 是否遵循父子互不关联,默认为关联
      checkStrictly: {
        type: Boolean,
        default: false
      },
      props: Object,
      defaultCheckedKeys: {
        type: Array,
        default () {
          return []
        }
      },
      defaultExpandedKeys: {
        type: Array,
        default () {
          return []
        }
      },
      renderContent: {
        type: Function,
        default (h, { node, data, store}) {
          return node.disabled ? (<span>
              <span
                class={
                  ('iconfont icon-lock')
                }
                style={
                  ('color:#d8d8d8;' + 'font-size: 12px;')
                }
                title={node.level <= 1 ? data.orgPathName : node.label}
              >{node.label}</span>
            </span>) : (<span class="el-tree-node__label" title={ node.label }>{ node.label }</span>)
        }
      },
      filterNodeMethod: {
        type: Function
      },
      highlightCurrent: Boolean
    },
    data: function () {
      return {
        selected: [],                         // 已选节点
        staticNodeData: [],                   // 静态数据，在非懒加载下用到
        preActiveNode: null,                  // 前一个高亮node节点
        loading: true,                        // 控制是否加载完成
        treeInstance: null                    // 树操作实例
      }
    },
    created () {
      this.init()
    },
    components: {
      ITreeSearch,
      ElTree
    },
    methods: {
      init () {
        let opts = {
          multiple: this.showCheckbox,
          defaultCheckedKeys: this.defaultCheckedKeys || [],
          dataKey: this.dataKey,
          nodeKey: this.nodeKey,
          props: this.props,
          rootId: this.rootId,
          vm: this
        }
        if (this.lazy) {
          this.treeInstance = new LazyTree(opts)
        } else {
          this.treeInstance = new StaticTree(opts)
          this.loadAllNode()
        }
      },
      handleCheckChange (node, data, isChecked, isChildrenChecked) {
        this.$emit('check-change', node, data, isChecked, isChildrenChecked)
//        this.setValue(this.selected, node, data, isChecked)
      },
      handleNodeExpand (data, node, instance) {
        this.$emit('node-expand', data, node, instance)
      },
      setValue (selected, node, data, isChecked) {
        let selectedOption = (selected && selected.length) ? JSON.parse(JSON.stringify(selected)) : []
        if (isChecked) {
          if (this.checkStrictly) {
            selectedOption.push(data)
          } else if (node.checked && node.childNodes.length && node.childNodes[0].checked) {
            let childNodes = node.childNodes
            selectedOption = selectedOption.filter(item => {
              for (let node of childNodes) {
                if (node.data[this.nodeKey] === item[this.nodeKey]) return false
              }
              return true
            })
          }
          if (!(node.parent && node.parent.checked) && !this.checkStrictly) selectedOption.push(data)
        } else {
          if (this.checkStrictly) {
            selectedOption = selectedOption.filter(item => {
              return item[this.nodeKey] !== data[this.nodeKey]
            })
          } else if (node.parent && node.parent.childNodes) {
            let childNodes = node.parent.childNodes
            for (let item of childNodes) {
              if (item.checked) {
                let isIn = selectedOption.find(theItem => {
                  return item.data[this.nodeKey] === theItem[this.nodeKey]
                })
                if (isIn) continue
                selectedOption.push(item.data)
              }
            }
          }
        }
        this.selected = selectedOption
        this.$emit('select', selectedOption)
      },
      // 全加载数据载入
      loadAllNode () {
        this.treeInstance.loadNode().then(nodeData => {
          this.staticNodeData = nodeData
        })
      },
      // 懒加载数据载入
      loadNode (node, resolve) {
        this.treeInstance.loadNode(node, resolve)
      },
      // 节点点击事件
      handleNodeClick (data, node, instance) {
        this.treeInstance.setActiveNodeColor(instance.$el.children[0], this)
        this.$emit('node-click', data, node, instance)
        if (!this.showCheckbox) {
          this.selected = [data]
          this.$emit('select', data)
        }
      },
      // 搜索下拉树
      searchTree (nodeId) {
        this.$emit('search', nodeId)
      },
      // 作为弹窗嵌入时所提供callBack
      writeBack () {
        return this.selected
      },
      // 作为嵌入时清空选择时的回调
      deleteSelected () {
        if (this.showCheckbox) {
          if (this.selected && this.selected.length) {
            this.selected.forEach(node => {
              this.$refs.tree.setChecked(node[this.nodeKey], false, true)
            })
          }
          this.selected = []
        } else {
          this.treeInstance.resetActiveNodeColor()
          this.selected = null
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.wrap{
  font-family: PingFangSC-Regular;
  font-size: 12px;
}
</style>
