<template>
  <div class="wrap">
      <!-- 树形图部分 -->
      <div slot="aside" class="around-filter-tree">
        <div class="filter" @click.stop>
          <div class="filterInput">
            <el-autocomplete placeholder="输入职群职种名称" v-model="filterText" :fetch-suggestions="querySearchAsync"
            @keyup.enter.native="filterTree" value-key="name" @select="filterTree">
            <i class="el-input__icon el-icon-search" slot="suffix" @click="filterTree"></i>
            </el-autocomplete>
          </div>
        </div>
        <div class="tree-button-group">
          <el-checkbox size="small" v-model="showCancel" @change="toggleCancel">显示已撤销</el-checkbox>
          <el-button class="reset-button" size="mini" type="primary" @click="clearNode">重置职群职种树</el-button>
        </div>

        <div :style="treeStyle" class="filter-tree">
          <el-tree  :data="ocTree" :props="defaultProps" highlight-current
          :filter-node-method="filterNode" @node-click="showDetails" node-key="posJobFamilyId"
          :render-content="renderContent" ref="ocTree" @click.stop>
          </el-tree>
        </div>
        <!-- 如果有显示撤销按钮的话，需要30px的占位 -->
        <!-- <div style="height:30px;" v-if="cancelButton"></div> -->
        <!-- <div class="treeBottom" @click.stop v-if="cancelButton">

        </div> -->
      </div>
  </div>
</template>

<script>
import req from 'api/position/occupation'
import { getCancel, getFreeze, filterCancel } from 'utils/position'
import { jsonTree } from 'utils'

export default {
  name: 'JobFamilyTree',
  components: {

  },
  props: {
    cancelButton: {
      type: Boolean,
      default: false
    },
    treeHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 树形图的过滤搜索
      filterText: '',
      // 是否展示撤销的树节点
      showCancel: false,
      // 保存已撤销的节点的key值
      cancelArray: [],
      // 保存已冻结的节点的key值
      freezeArray: [],
      // 原始数据长度，第一个位置保存完整树长度，第二个位置保存剔除撤销后树长度
      originTreeDataLength: [],
      // 展示的树形图数据
      ocTree: [],
      // 保存的所有树形图数据，包含已撤销
      allOcTree: [],
      // 保存树节点数
      treeNodeCount: 0,
      // 保存是否搜索节点
      ifTreeNodeResult: false,
      // 保存撤销后的树形图数据
      cutOcTree: [],
      // 初始树数据
      originTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'name'
      }
    }
  },

  methods: {
    // 模糊搜索的返回内容
    querySearchAsync (queryString, cb) {
      cb(this.originTreeData.filter(this.createStateFilter(queryString)))
    },
    // 树的数据过滤函数
    createStateFilter (queryString) {
      if (this.showCancel) {
        return (state) => {
          return (state.name.includes(queryString))
        }
      }
      return (state) => {
        return (state.name.includes(queryString) && state.status !== '0')
      }
    },
    filterNode (value, data) {
      this.treeNodeCount++
      if (!value) {
        return true
      }
      if (data.name.indexOf(value) !== -1) {
        this.ifTreeNodeResult = true
        return true
      } else {
        if (this.treeNodeCount === (this.showCancel ? this.originTreeDataLength[0] : this.originTreeDataLength[1]) && !this.ifTreeNodeResult) {
          this.$message({
            message: '无搜索结果，请联系管理员',
            type: 'info',
            duration: 3000
          })
        }
        return false
      }
    },
    renderContent (createElement, { node, data, store }) {
      var that = this
      if (that.cancelArray.includes(node.key)) {
        if (node.level === 1) {
          return createElement('span', [
            createElement('span', {
              attrs: {
                style: 'font-size:14px;color:#D8D8D8;'
              }
            }, node.label)
          ])
        } else {
          return createElement('span', [
            createElement('span', {
              attrs: {
                style: 'font-size:12px;color:#D8D8D8;'
              }
            }, node.label)
          ])
        }
      } else {
        if (node.level === 1) {
          return createElement('span', [
            createElement('span', {
              attrs: {
                style: 'font-size:14px;'
              }
            }, node.label)
          ])
        } else {
          return createElement('span', [
            createElement('span', {
              attrs: {
                style: 'font-size:12px;'
              }
            }, node.label)
          ])
        }
      }
    },
    toggleCancel (e) {
      if (this.showCancel) {
        this.ocTree = JSON.parse(JSON.stringify(this.allOcTree))
        this.filterText = ''
      } else {
        this.ocTree = JSON.parse(JSON.stringify(this.cutOcTree))
        this.filterText = ''
      }
    },
    showDetails (ob, node, self) {
      // 先保存node进去store
      this.$store.state.occupation.node = node
      this.$emit('nodeClick', node)
    },
    clearNode (e) {
      this.$store.commit('SET_NODE', {})
      // 清空搜索框
      this.filterText = ''
      this.ocTree = JSON.parse(JSON.stringify(this.ocTree))
      this.$emit('clearNode')
    },
    filterTree () {
      this.treeNodeCount = 0
      this.ifTreeNodeResult = false
      this.$refs.ocTree.filter(this.filterText)
    },
    loadTree () {
      var that = this
      req('getAllTree', null).then(data => {
        that.allOcTree = jsonTree(data, {id: 'posJobFamilyId', pid: 'parentId'})
        this.$emit('tree', that.allOcTree)
        that.originTreeData = data
        that.originTreeDataLength[0] = data.length
        that.cutOcTree = jsonTree(filterCancel(data), {id: 'posJobFamilyId', pid: 'parentId'})
        that.cancelArray = getCancel(data)
        that.originTreeDataLength[1] = data.length - that.cancelArray.length
        that.freezeArray = getFreeze(data)
        that.ocTree = JSON.parse(JSON.stringify(that.cutOcTree))
        that.toggleCancel()
        that.$emit('familyArray', this.cancelArray, this.freezeArray)
      })
    }
  },
  computed: {
    treeStyle () {
      return {
        maxHeight: `${this.treeHeight ? this.treeHeight + 'px' : 'calc(100%-91px)'}`
      }
    }
  },

  created () {
    this.$store.commit('SET_NODE', {})
    this.loadTree()
  }
}
</script>

<style lang="scss" scoped>
.wrap{
  height: 100%;
}
</style>
