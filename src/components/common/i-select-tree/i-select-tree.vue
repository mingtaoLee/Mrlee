<template>
  <el-dropdown
    ref="iSelectTree"
    class="i-select-tree drop-down"
    trigger="click"
    placement="bottom-start"
    @mouseleave.native="handleLeave"
    @mouseenter.native="handleEnter"
  >
    <!--占位符-->
    <span></span>
    <!--输入框-->
    <el-tooltip ref="inputTooltip" :disabled="isTooltipDisabled" effect="dark" :content="toolTip" placement="top">
      <div>
        <el-input
          ref="iSelectInput"
          :class="['i-select-input', {'icon-rotate': isRotate}]"
          :placeholder="selectPlaceholder"
          :readonly="readonly"
          v-model="inputValue"
          :disabled="disabled"
          @mouseenter.native="handleInputMouseenter"
          @mouseleave.native="handleInputMouseleave"
          @mousedown.native="handleMouseDown"
        >
          <i slot="suffix"
             :class="['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass]"
             @click="handleIconClick"
          ></i>
        </el-input>
        <!--多选时显示的tag标签-->
        <div
          :class="['el-select__tags', {'tab-size': !sizeAuto}]"
          v-if="multiple"
          ref="tags"
          :style="{ 'max-width': inputWidth - 32 + 'px' }"
          @click="toggleTree"
        >
          <transition-group @after-leave="resetInputHeight">
            <el-tag
              class="el-select__tag"
              size="mini"
              v-for="(item, index) in selected"
              :key="index"
              :closable="true"
              type="primary"
              @close="deleteTag($event, item, index)"
              :close-transition="false"
            >
              {{item[props.label]}}
            </el-tag>
          </transition-group>
        </div>
      </div>
    </el-tooltip>
    <!--下拉树区域-->
    <el-dropdown-menu ref="dropdown" class="dropdown" slot="dropdown">
      <div ref="treeContent" :class="['i-select-content']">
        <div v-if="search" class="search-nav">
          <el-input
            class="search-input"
            placeholder="请输入关键词"
            prefix-icon="el-icon-search"
            :validate-event="false"
            v-model="searchName"
            @input="handleSearch"
            :autofocus="true"
          ></el-input>
          <el-button class="search-btn" type="primary" size="mini" @click="resetSearch">重置</el-button>
        </div>
        <div class="node-content" :style="treeContentStyle" @scroll="handleSearchNodesScroll">
            <ul v-show="lazy && searchName" class="search-result">
              <template v-if="multiple">
                <el-checkbox-group v-model="selected" @change="handleSearchedNodesChange">
                  <el-checkbox
                    v-for="node of searchNodes"
                    class="search-item"
                    :label="node"
                    :key="node[nodeKey]"
                    :checked="getSearchedDefaultChecked(node)"
                    @change="handleSearchedNodeChange($event, node)"
                    @mouseenter.native="handleSearchListMouseEnter($event, node)"
                    @mouseleave.native="handleSearchListMouseLeave"
                  >
                    {{node[props.label]}}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
              <template v-else>
                <li
                  v-for="(node, index) of searchNodes"
                  :key="node[nodeKey]"
                  :class="['search-item', 'single-text-overflow', { 'active-item': node.isActive}]"
                  @click="handleSearchNodeClick(node, index)"
                  @mouseenter="handleSearchListMouseEnter($event, node)"
                  @mouseleave="handleSearchListMouseLeave"
                >
                  {{node[searchLabelKey]}}
                </li>
              </template>
            </ul>
          <el-tooltip effect="dark" ref="listTooltip" :content="listTooltipContent" placement="top"></el-tooltip>
          <i-tree
            v-show="!searchName || !lazy"
            ref="iTree"
            :hasGrant="hasGrant"
            :rootId="rootId"
            :dataKey="dataKey"
            :show-checkbox="multiple"
            :accordion="accordion"
            :lazy="lazy"
            :defaultCheckedKeys="defaultCheckedKeys"
            :node-key="nodeKey"
            :check-strictly="checkStrictly"
            :props="props"
            :render-content="renderContent"
            :filter-node-method="filterNode"
            :highlight-current="highlightCurrent"
            @check-change="handleCheckChange"
            @node-click="handleNodeClick"
            @node-expand="handleNodeExpand"
            @loaded="handleLoaded"
          ></i-tree>
        </div>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
  import {MultipleSelect} from './multipleSelect'
  import {SingleSelect} from './singleSelect'
  import ITree from '../i-tree/i-tree.vue'
  import debounce from 'throttle-debounce/debounce'
  import throttle from 'throttle-debounce/throttle'
  import { globalComponentVariable } from 'config/globalComponentVariable'
  // 输入框对应尺寸
  const sizeMap = {
    'medium': 36,
    'small': 32,
    'mini': 28
  }
  export default {
    name: 'ISelectTree',
    components: {
      ITree
    },
    props: {
      // 是否有权限控制
      hasGrant: {
        type: Boolean,
        default: true
      },
      //
      searchLabelKey: {
        type: String,
        default: 'childAndParent'
      },
      value: [String, Array],
      disabled: Boolean,
      // 下拉树应用范围
      type: {
        type: String,
        default: 'search'
      },
      // 是否为多选
      multiple: {
        type: Boolean,
        default: false
      },
      // 是否只读
      readonly: {
        type: Boolean,
        default: false
      },
      // 提示语句
      placeholder: {
        type: String,
        default: '请选择'
      },
      // 下拉树类型
      dataKey: {
        type: String,
        default: ''
      },
      // 下拉树对应id属性名
      nodeKey: {
        type: String,
        default: globalComponentVariable.iTree.nodeKey || ''
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
      // 下拉树显示最大高度
      treeMaxHeight: {
        type: [Number, String],
        default: 180
      },
      // 下拉树显示最小高度
      treeMinHeight: {
        type: [Number, String],
        default: 108
      },
      // 下拉树宽度
      treeWidth: [String, Number],
      // 下拉树默认选择选项同element-ui
      props: {
        type: Object,
        default () {
          return {
            children: 'children',
            label: 'orgUnitName',
            hide ({status}) {
              return status === '2'
            },
            isLeaf ({isParent}) {
              return !isParent
            }
          }
        }
      },
      sizeAuto: {
        type: Boolean,
        default: false
      },
      // 默认选中节点
      selectedNode: {
        type: [Object, Array],
        default () {
          return this.multiple ? [] : {}
        }
      },
      // 输入框大小类型
      size: {
        type: String,
        default: 'mini'
      },
      // 是否可清除
      clearable: {
        type: Boolean,
        default: true
      },
      // 是否遵循父子互不关联,默认为关联
      checkStrictly: {
        type: Boolean,
        default: false
      },
      checkSameLevel: {
        type: Boolean,
        default: false
      },
      // 树节点的内容区的渲染 Function
      renderContent: {
        type: Function
      },
      // 是否显示搜索框
      search: {
        type: Boolean,
        default: true
      },
      // 当前选中节点是否高亮
      highlightCurrent: {
        type: Boolean,
        default: true
      },
      // 输入框提示默认显示key
      tooltipProps: {
        type: Object,
        default () {
          return {
            inputLabel: 'orgPathName',
            nodeLabel: 'orgUnitName',
            listLabel: 'orgPathName'
          }
        }
      }
    },
    data: function () {
      return {
        listTooltipContent: '',                     // 搜索列表提示语
        currentSelectedIds: '',              // 当前选中的ids
        searchTimer: null,                   // 懒加载搜索事件触发定时器
        isInit: false,                       // 是否初始化
        isSearchNodeChecked: false,          // 是否是搜索到的节点被选中
        searchName: '',                      // 搜索关键字
        searchNodes: [],                     // 搜索到的节点集合
        timers: [],                          // 定时器集合
        inputHovering: false,                // 鼠标移入移出记录
        selectInstance: null,                // 下拉树实例
        selected: this.multiple ? [] : {},   // 选中节点
        selectPlaceholder: this.placeholder, // 提示语
        inputValue: '',                      // 输入框值
        isRotate: false,                     // 是否收起下拉树
        contentWidth: 300,                   // 下拉树显示宽度
        inputWidth: '',                      // 输入框宽度
        defaultCheckedKeys: []
      }
    },
    watch: {
      'selected.length': {
        handler (value) {
          this.handleSelectedData(value)
          this.resetInputHeight()
          this.setSelectPlaceholder(value)
        }
      },
      'value': {
        handler (value) {
          if (this.currentSelectedIds !== value) this.initValue(value)
        }
      }
    },
    computed: {
      iconClass () {
        let criteria = this.clearable &&
          !this.disabled &&
          this.inputHovering &&
          // !this.multiple &&
          (this.inputValue !== undefined &&
          this.inputValue !== '' || this.selected && this.selected.length)
        return criteria ? 'circle-close is-show-close' : 'arrow-down'
      },
      treeContentStyle () {
        return {
          minWidth: '200px',
          width: this.contentWidth + 'px',
          maxHeight: this.treeMaxHeight + 'px',
          minHeight: this.treeMinHeight + 'px'
        }
      },
      isTooltipDisabled () {
        if (this.multiple) {
          return !this.selected.length
        } else {
          return !this.inputValue
        }
      },
      toolTip () {
        if (this.multiple) {
          return this.selected.map(node => {
            return node[this.props.label]
          }).join(' / ')
        } else {
          return this.inputValue ? this.selected[this.tooltipProps.inputLabel] ? this.selected[this.tooltipProps.inputLabel] : this.selected[this.props.label] : ''
        }
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.$nextTick(() => {
        this.initLayout()
      })
    },
    beforeDestroy () {
      document.removeEventListener('click', this.hideTree)
    },
    methods: {
      init () {
        this.throttleCloseListTooltip = throttle(200, true, this.closeListToolTip)
        this.activateTooltip = debounce(200, tooltip => tooltip.handleShowPopper())
        this.initSelectInstance()
      },

      filterNode (value, data) {
        if (!value) return true
        return data[this.props.label].indexOf(value) !== -1
      },

      /** 全加载条件下，初始化节点禁用层级 */
      initDisabledLevel () {
        if (!this.lazy && this.checkStrictly && this.checkSameLevel && this.selected.length) {
          this.$nextTick(() => {
            const node = this.getNode(this.selected[0])
            const currentLevel = node.level
            this.setDisabledLevel(currentLevel, true)
          })
        }
      },

      /** 初始化单选多选实例 */
      initSelectInstance () {
        const opts = {
          nodeKey: this.nodeKey,
          props: this.props,
          value: this.value,
          vm: this
        }
        this.selectInstance = this.multiple ? new MultipleSelect(opts) : new SingleSelect(opts)
        this.initValue(this.value)
      },

      /** 初始化默认选项 */
      initValue (value) {
        this.selectInstance.initValue(value)
        this.resetInputHeight()
      },

      handleLoaded (nodeData) {
        this.initDisabledLevel()
        this.$emit('loaded', nodeData)
      },

      /** 初始化布局 */
      initLayout () {
        // 初始化tags标签宽度
        this.inputWidth = this._getElBoxProperty(this.$refs['iSelectInput'].$el, 'width')
        // 初始化下拉框宽度
        if (!this.treeWidth) {
        }
      },

      /** 处理复选框改变事件 */
      handleCheckChange (node, data, isChecked, isChildrenChecked) {
        // 如果是搜索节点的选中状态改变则返回
        if (this.searchName) return
        this.selectInstance.setValue(this.selected, node, data, isChecked)

        // 严格模式下，限制只能选同一层级节点
        if (this.checkStrictly && this.checkSameLevel) {
          if (this.selected.length) {
            this.setDisabledLevel(node.level, true)
          } else {
            this.setDisabledLevel(node.level, false)
          }
        }

        // 复选框多次改变时，将emitInput时间推到宏任务队列中并控制只执行一次
        const timer = setTimeout(() => {
          const selected = this.selected.map(node => {
            return node[this.nodeKey]
          }).toString()
          this.emitInput(selected)
//          this.emitSelectedNode(this.selected)
          this.clearTimer(this.timers)
        }, 0)
        this.timers.push(timer)
      },

      clearTimer (timers) {
        timers.forEach(timer => {
          clearTimeout(timer)
        })
      },

      /** 触发节点展开事件 */
      handleNodeExpand (data, node, instance) {
        this.$emit('node-expand', data, node, instance)
      },

      /** 触发input事件 */
      emitInput (selected) {
        this.currentSelectedIds = selected
        this.$emit('input', selected)
        this.$emit('change', this.selected)
      },

      /** 设置选择框提示语 */
      setSelectPlaceholder (value) {
        this.selectPlaceholder = value ? '' : this.placeholder
      },

      /** tag数量发生改变时重置input框高度与下拉树到input框顶部距离 */
      resetInputHeight () {
        if (this.multiple && this.sizeAuto) {
          this.$nextTick(function () {
            const inputEl = this.$refs['iSelectInput'].$el
            if (!inputEl) return
            const inputChildNodes = inputEl.childNodes
            const input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0]
            const tagsHeight = this._getElBoxProperty(this.$refs.tags, 'height')
            input.style.height = Math.max(tagsHeight, sizeMap[this.size]) + 'px'
            this.$refs['dropdown'].updatePopper()
          })
        }
      },

      /** 删除tag事件, 删除选项，设置下拉树checked为false，重置输入框高度 */
      deleteTag (ev, node, index) {
        if (this.disabled) return
        ev = ev || window.event
        this.selected.splice(index, 1)
        // 如果所删除节点没有在全部已加载的节点中，剃除默认选中节点
        if (!this.getNodesMap()[node[this.nodeKey]]) {
          this.removeDefaultCheckedKey(node[this.nodeKey])
        } else {
          this.setChecked(node, false)
        }
        // 重置input宽高度
        this.$nextTick(() => {
          this.resetInputHeight()
        })
        ev.stopPropagation()
        this.$emit('delete', node)
        this.emitInput(this.selected.map(node => {
          return node[this.nodeKey]
        }).toString())
      },

      /** 移除默认选中节点 */
      removeDefaultCheckedKey (key) {
        this.defaultCheckedKeys = this.defaultCheckedKeys.filter(item => {
          return key !== item
        })
      },

      /** 多选条件下，设置当前所选层级的其他层级为禁用选项 */
      setDisabledLevel (level, isDisabled) {
        const nodes = this.getAllNode()
        for (let node of nodes) {
          if (node.level !== level) node.disabled = isDisabled
        }
      },

      /** 获取全部节点 */
      getAllNode () {
        return this.$refs['iTree'].$refs.tree.getAllNode()
      },

      /** 获取节点map */
      getNodesMap () {
        return this.$refs['iTree'].$refs.tree.getNodesMap()
      },

      getNode (data) {
        return this.$refs['iTree'].$refs.tree.getNode(data)
      },

      /** 取消树节点选中 */
      setChecked (item, isChecked) {
        this.$refs['iTree'].$refs.tree.setChecked(item[this.nodeKey], isChecked, true)
      },

      /** 处理节点点击事件，单选模式时为选中节点并且收起下拉框 */
      handleNodeClick (data, node, instance) {
        this.selectInstance.handleNodeClick(data)
        this.$emit('node-click', data, node, instance)
      },

      /** 处理搜索节点点击事件 */
      handleSearchNodeClick (data) {
        this.resetActiveNode()
        this.$set(data, 'isActive', true)
        this.selectInstance.handleNodeClick(data)
        this.$emit('node-click', data)
        this.emitInput(data[this.nodeKey])
        this.closeListToolTip()
      },

      /** 重置高亮节点 */
      resetActiveNode () {
        const searchNodes = this.searchNodes
        for (let node of searchNodes) {
          if (node.isActive) {
            node.isActive = false
            return
          }
        }
      },

      /** 重置搜索 */
      resetSearch () {
        this.searchName = ''
        this.lazy || this.searchStaticTree()
      },

      handleSearchedNodeChange (checked, node) {
        this.setChecked(node, checked)
      },

      /** 多选时搜索节点改变事件监听 */
      handleSearchedNodesChange (selected) {
        this.emitInput(selected.map(node => node[this.nodeKey]).toString())
      },

      /** 获取搜索到的节点默认是否选中 */
      getSearchedDefaultChecked (node) {
        this.isSearchedDefaultChecked = true
        for (let item of this.selected) {
          if (item[this.nodeKey] === node[this.nodeKey]) return true
        }
        return false
      },

      /** 防止重复加入node节点 */
      handleSelectedData (length) {
        const selected = this.selected
        const nodeKey = this.nodeKey
        if (Array.isArray(selected)) {
          for (let i = 0; i < length - 1; i++) {
            if (selected[i][nodeKey] === selected[length - 1][nodeKey]) {
              selected.splice(i, 1, selected.pop())
              return
            }
          }
        }
      },

      /** 隐藏下拉树 */
      hideTree () {
        this.isRotate = false
        this.$refs.iSelectTree.visible = false
      },

      /** 移出时添加document点击事件监听 */
      handleLeave () {
        document.addEventListener('click', this.hideTree, false)
      },

      /** 移入时移除document点击事件 */
      handleEnter () {
        document.removeEventListener('click', this.hideTree)
      },

      /** 输入框icon点击事件，有选项时执行删除操作，没有时打开下拉树 */
      handleIconClick () {
        if (this.disabled) return
        if (this.iconClass.indexOf('circle-close') > -1) {
          this.closeTooltip()
          this.emitInput('')
          this.deleteSelected()
        } else {
          this.toggleTree()
        }
      },

      /** 切换下拉框显示隐藏 */
      toggleTree () {
        if (this.disabled) return
        this.isRotate = !this.isRotate
        this.$refs.iSelectTree.visible = !this.$refs.iSelectTree.visible
      },

      /** 删除已选选项 */
      deleteSelected () {
        this.selectInstance.deleteSelected(this.selected)
        this.$emit('delete', this.selected)
      },

      /** 原生input输入框点击事件 */
      handleMouseDown (event) {
        if (this.disabled) return
        if (event.target.tagName !== 'INPUT') return
        this.toggleTree()
        event.preventDefault()
      },

      /** 输入框鼠标移入事件 */
      handleInputMouseenter () {
        if (this.disabled) return
        this.inputHovering = true
      },

      /** 输入框移出事件 */
      handleInputMouseleave () {
        if (this.disabled) return
        this.inputHovering = false
      },

      /** 获取dom元素占据空间属性 */
      _getElBoxProperty (el, property) {
        return parseInt(el.getBoundingClientRect()[property])
      },

      /** 搜索事件监听 */
      handleSearch (value) {
        if (!this.lazy) {
          this.searchStaticTree()
          return
        }
        this.searchTimer && clearTimeout(this.searchTimer)
        this.searchTimer = setTimeout(() => {
          this.selectInstance.searchNodes(value)
        }, 300)
      },

      /** 单选搜索列表鼠标移入监听 */
      handleSearchListMouseEnter (ev, node) {
        const cell = ev.target

        if (this.$refs.listTooltip) {
          const tooltip = this.$refs.listTooltip
          this.listTooltipContent = node[this.tooltipProps.listLabel]
          tooltip.referenceElm = cell
          tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
          tooltip.doDestroy()
          tooltip.setExpectedState(true)
          this.activateTooltip(tooltip)
        }
      },

      /** 单选搜索列表鼠标移出监听 */
      handleSearchListMouseLeave () {
        this.closeListToolTip()
      },

      /** 监听搜索区域滚动事件 */
      handleSearchNodesScroll (ev) {
        this.throttleCloseListTooltip()
      },

      /** 关闭搜索项移入显示的tooltip */
      closeListToolTip () {
        const tooltip = this.$refs.listTooltip
        if (tooltip) {
          tooltip.setExpectedState(false)
          tooltip.handleClosePopper()
          tooltip.$refs.popper.style.display = 'none'
        }
      },

      /** 搜索静态树节点 */
      searchStaticTree () {
        this.$refs['iTree'].$refs.tree.filter(this.searchName)
      },

      /** 彻底关闭tooltip */
      closeTooltip () {
        const tooltip = this.$refs.inputTooltip
        tooltip && tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
      }
    }
  }
</script>
<style lang="scss" scoped>
  $searchPadding: 10px;

  .search-result {

  }
  .search-item {
    display: block;
    transition: 0.1s;
    padding: 10px 10px;
    margin-left: 0;
    cursor: pointer;
    font-size: 12px;
    color: #666666;
    border-radius: 4px;
    &:hover {
      background-color: #f5f7fa;
    }
  }
  .active-item {
    background-color: #f1f3f6;
  }
  .node-content {
    overflow: auto;
  }
  .search-nav {
    position: relative;
    padding: 0 $searchPadding $searchPadding;
  }

  .search-btn {
    position: absolute;
    top: 0;
    right: $searchPadding;
  }

  .search-input {
    box-sizing: border-box;
    width: 100%;
    padding-right: 70px;
  }

  .i-select-content {
    box-sizing: border-box;
    z-index: 2;
    width: 100%;
    background: white;
  }
</style>
<style lang="scss">
  .i-select-tree {
    width: 100%;

    .i-select-input {
      &:hover {
        cursor: pointer;
      }
    }

    .i-select-input {
      .el-input__inner {
        text-overflow: ellipsis;
      }
    }

    .tab-size {
      overflow: hidden;
      white-space: nowrap;
    }

    .icon-rotate {
      transition: 0.3s;
      .el-icon-caret-bottom {
        transform: rotate(180deg);
      }
    }
  }
</style>
