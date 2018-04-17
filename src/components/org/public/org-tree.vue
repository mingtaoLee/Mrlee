<template>
  <div class="org-tree-wrap" :class="[{border}]">
    <div class="search" v-if="showFilter">
      <el-autocomplete
        :debounce="1000"
        v-model="keyword"
        :style="inputStyle"
        class="auto"
        :placeholder="placeholder"
        :fetch-suggestions="getSearchResult"
        value-key="childAndParent"
        :trigger-on-focus="false"
        @select="handleSelect"
      >
      <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-autocomplete>
    </div>
    <div class="contorler">
      <el-checkbox @change="handlerFreezeOrg" v-show="isFreezeOrg" v-model="showFreezeOrg">标识已冻结的组织</el-checkbox>
      <el-button type="primary" v-if="showFilter" @click="reset" size="mini">重置组织树</el-button>
    </div>
    <el-tree
    ref="tree"
    :style="treeStyle"
    class="tree"
    :props="props || defaultProps"
    :node-key="nodeKey"
    :render-content="cstRenderContent || renderContent"
    :default-checked-keys="defaultCheckedKeys"
    lazy
    auto-expand-parent
    :default-expanded-keys="defaultExpandedKeys"
    @check-change="handleCheck"
    :check-strictly="checkStrictly"
    :show-checkbox="showCheckbox"
    highlight-current
    :load="cstLoadData || loadData"
    @node-click="curNodeClicked"
    :showIconNode="showIconNode"
    >
    </el-tree>
    <div class="freeze-checkbox" v-if="showFreezeCheckbox">
      
    </div>
  </div>
</template>
<script>
  /**
   * @prop showFilter 控制搜索条的显隐
   * @prop isFreezeOrg 控制是否显示冻结组织
   * @prop border 是否带边框
   * @prop requestUrls 相关接口地址
   * @prop inputStyle 输入框样式
   * @prop treeStyle 组织树样式
   * @prop rootNodes 根节点
   * @prop handleCheck 多选框选中事件
   * @prop showCheckbox 是否显示多选框
   * @event reset 重置事件
   */
  import req from 'api/org/tree'
  export default {
    name: 'orgTree',
    components: {},
    props: {
      props: {
        type: Object,
        default: null
      },
      inputStyle: Object,
      treeStyle: Object,
      showFilter: {
        type: Boolean,
        default: false // 控制组织树的搜索框显隐
      },
      isFreezeOrg: {
        type: Boolean,
        default: true // 不同页面是否显示冻结组织状态
      },
      defaultCheckedKeys: Array, // 控制组织树默认选中多选框（审批人节点显示选中节点）
      defaultExpandedKeys: Array, // 默认展开节点的数组
      checkStrictly: Boolean,
      showCheckbox: Boolean,
      showFreezeCheckbox: {
        type: Boolean,
        default: true
      },
      border: Boolean,
      height: {
        type: Number,
        default: 400
      },
      requestUrls: {
        type: Object,
        default: () => {
          return {
            root: {
              url: 'roots'
            },
            children: {
              url: 'children'
            },
            search: {
              url: 'searchData'
            }
          }
        }
      },
      rootNodes: Array,
      paramDate: String,
      placeholder: {
        type: String,
        default: '输入组织名称'
      },
      cstRenderContent: Function,
      cstLoadData: Function,
      showIconNode: Object
    },
    data () {
      return {
        defaultProps: {
          label: 'orgUnitName',
          children: 'children',
          value: 'orgUnitName',
          isLeaf: (data) => {
            return typeof data.isParent === 'undefined'
            ? false
            : !data.isParent
          }
        },
        treeData: [],
        keyword: '',
        showFreezeOrg: true,
        nodeKey: 'orgUnitId'
      }
    },
    watch: {
      paramDate () {
        this.reset()
      },
      rootNodes: {
        handler (val) {
          if (Array.isArray(val) && val.length) {
            this.treeData = val
          }
        }
      }
    },
    methods: {
      showNodeIcon (node) {
        // console.log(node)
        node.parent.data.showNodeIcon = true
        if (node.parent.level !== 1) {
          this.showNodeIcon(node.parent)
        }
      },
      renderContent (h, {node, data}) {
        let highlightFreeze = data.status === '2' && this.showFreezeOrg
        return (
            <span>
              <span
              class={
              (highlightFreeze ? 'iconfont icon-lock' : '')
              }
              style={
                (highlightFreeze ? 'color:#d8d8d8;' : '') +
                (node.level <= 2 ? 'fontSize: 14px;' : 'fontSize: 12px;')
                }
              title={node.level <= 1 ? data.orgPathName : ''}
              >{node.label}</span>

            </span>
        )
      },
      handleCheck (data, checked, indeterminate) {
        this.$emit('check-change', data, checked, indeterminate)
      },
      reset () {
        this.keyword = ''
        this.getTreeRoot().then(data => {
          this.$refs.tree.store.setData(data)
        })
        this.$emit('reset', this.rootNodes)
      },
      getTreeRoot () {
        if (Array.isArray(this.rootNodes) && this.rootNodes.length) {
          return Promise.resolve().then(() => {
            this.treeData = this.rootNodes
            return this.rootNodes
          })
        } else {
          return req(this.requestUrls.root.url, {paramDate: this.paramDate}).then(data => {
            this.treeData = data
            if (data.length) this.$emit('getRoot', data[0])
            return data
          })
        }
      },
      getSearchResult (queryString, resolve) {
        if (!queryString) resolve([])
  
        req(this.requestUrls.search.url, {name: queryString, paramDate: this.paramDate}).then(data => {
          data.length ? resolve(data) : this.$message('无搜索结果')
          resolve(data)
        }).catch(() => {
          resolve([])
        })
      },
      handleSelect (data) {
        // this.treeData = [data]
        this.$refs.tree.store.setData([data])
      },
      loadData (node, resolve) {
        if (node.level === 0) {
          this.getTreeRoot().then(() => {
            resolve(this.treeData)
            this.$nextTick(() => {
              this.$refs.tree.root.childNodes.forEach(node => {
                node.expand()
              })
            })
          })
        } else {
          req(this.requestUrls.children.url, {id: node.data[this.nodeKey], paramDate: this.paramDate}).then(data => {
            resolve(data)
          }).catch(() => {
            resolve([])
          })
        }
      },
      curNodeClicked (data, node) {
        this.currentNode = node
        // 传出orgUnitId
        this.$emit('node-click', data, node)
      },
      handlerFreezeOrg () {
        this.$emit('handler-freeze', this.showFreezeOrg)
      }
    },
    created () {
      // this.getTreeRoot().then(() => {
      //   // 挂载完根节点后展开根节点
      //   this.$nextTick(() => {
      //     this.$refs.tree.root.childNodes.forEach(node => {
      //       node.expand()
      //     })
      //   })
      // })
    }
  }
</script>
<style lang="scss" scoped>
  .org-tree-wrap{
    position: relative;
    text-align:center;
    .search{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom:10px;
      padding: 0 15px;
      .el-autocomplete {
        width: 100%;
      }
    }
    .contorler {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
    }
    .tree{
      text-align:left;
      border:none;
      color:#333333;
      font-size: 14px;
      overflow-y:auto;
    }
    &.border{
      border: 1px solid #e5e5e5;
    }
  }

  .freeze-checkbox{
    position:absolute;
    bottom:0;
    right:0;
    margin-right:5px;
  }

  .el-tree {
    /deep/ .el-tree-node {
      .el-tree-node__children {
        overflow: inherit;
        background-color: transparent;
      }
    }
  }
</style>
