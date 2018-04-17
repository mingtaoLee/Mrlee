<template>
  <div
    class="i-search-conditions"
    :style="{ height: height + 'px' }">
    <section
      v-if="async"
      class="section tree-section">
      <div class="title">
        <h3>字段列表</h3>
      </div>
      <!-- :load="loadNode" -->
      <div class="section-body">
        <el-tree
          :load="loadTree"
          :props="{
            label: 'label',
            children: 'children',
            isLeaf: 'leaf'
          }"
          :default-checked-keys="defaultCheckedKeys"
          :default-expanded-keys="defaultExpandedKeys"
          node-key="id"
          ref="tree"
          lazy
          show-checkbox
          @check-change="handleCheckChange">
        </el-tree>
      </div>
    </section>

    <section
      v-if="async"
      class="section checked-section">
      <div class="title">
        <h3>已选列表({{ selfColumns.length }})</h3>
      </div>
      <draggable
        v-model="selfColumns"
        @start="moveStart"
        @end="moveEnd"
        class="section-body drag-section"
        :options="{ animation: 150, dragClass: 'dragging-active', disabled }">
        <span
          v-for="(col, idx) of selfColumns"
          :key="col.id"
          :class="['box', { dragging: dragging && draggingIdx === idx }, { disabled: disabled }]">
          {{ col.label }}
          <div :class="['delete', { disabled: disabled }]" @click="deleteChecked(col)">
            <i class="el-icon-close"></i>
          </div>
        </span>
      </draggable>
    </section>

    <i-search-main
      :async="async"
      :columns="async ? selfColumns : columns"
      :editor="async ? selfEditor : editor"
      :groups="custom.groups || []"
      :disabled="disabled"
      class="section search-section"
    />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import ISearchMain from './src/main'
import req from 'api/info-center/common-inquiry'
import request from 'api'

// import { columnList, customList, tableList } from './mock-data'

const REQ_NAME = '_'
const _req = function (url) {
  return request({ [REQ_NAME]: { url } }, REQ_NAME, true, false)
}

export default {
  name: 'ISearchConditions',

  props: {
    async: {
      default: true,
      type: Boolean,
      required: false
    },
    columns: {
      default: [],
      type: Array,
      required: false
    },
    editor: {
      default: {},
      type: Object,
      required: false
    },
    data: {
      default: () => ({ groups: [] }),
      type: Object,
      required: false
    },
    queryId: {
      type: [String, Number],
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    height: {
      type: [String, Number],
      default: 220,
      required: false
    }
  },

  watch: {
    checked (list, oldList) {
      this._removeOldChecked(list, oldList)
    },

    data (val) {
      this.custom = val
    },

    showTree (val) {
      val && this.loaded()
    }
  },

  data () {
    return {
      // main 配置
      selfColumns: [],
      selfEditor: {},
      // 左侧树
      tree: [],
      // 保存节点数据
      saveTables: {},
      showTree: false,
      defaultCheckedKeys: [],
      defaultExpandedKeys: [],
      // 已选列表拖拽数据
      checked: [],
      draggingIdx: -1,
      dragging: false,
      // 载入的查询条件
      custom: { groups: [] },
      // 组件类型
      componentType: {
        '01': 'input',
        '02': 'dict',
        '03': 'select',
        '04': 'date',
        '05': 'org',
        '06': 'per',
        '07': 'job'
      }
    }
  },

  created () {
    this.async
      ? this.fetchCustomList()
      : this.custom = this.data
  },

  async mounted () {
    this.async && await this._initTree()

    this._watchConditions()
    this.showTree = true
  },

  methods: {
    // 懒加载树
    loadTree (node, resolve) {
      if (node.level === 0) {
        return this._fetchTableList().then(data => {
          resolve(data)
        })
      } else {
        return this._fetchColumnList(node.data.infTableId).then(data => {
          resolve(data)
        })
      }
    },

    // 初始化树
    _initTree () {
      // const _ = []

      // return this._fetchTableList()
      //   .then(data => _.push(...data))
      //   .then(async () => {
      //     try {
      //       await Promise.all(
      //         _.map((el, i) => {
      //           return this._fetchColumnList(el.infTableId).then(data => {
      //             el.children.push(...data)
      //           })
      //         })
      //       )
      //     } catch (e) {
      //       throw new Error(e)
      //     }

      //     this.tree = [{
      //       id: 'root-1',
      //       label: '全部字段',
      //       children: _,
      //       disabled: this.disabled
      //     }]

      this.initChecked()
      this.$nextTick(() => this.getChecked())
        // })
    },

    // 监听条件变化
    _watchConditions () {
      this.$watch(
        function () {
          return this.custom.groups.map(group => group.conditions)
        },
        function (conditions) {
          conditions.map(condition => {
            condition[0] && (condition[0].conditionLogic = null)
          })
        }
      )
    },

    // 加载完毕后抛出 this 对象
    loaded () {
      this.$emit('loaded', this)
    },

    // 查找被删除的字段
    _removeOldChecked (checked, oldChecked) {
      oldChecked.map(oldEl => {
        const ret = checked.find(el => oldEl.infColumnId === el.infColumnId)

        // 若不存在，则表示该字段被删除，根据 id 查找 groups 中的数据，进行整行清零
        if (!ret) {
          const id = oldEl.infColumnId

          this.custom.groups.map(group => {
            if (group.conditions) {
              group.conditions.map(condition => {
                if (condition.infColumnId === id) {
                  this._clearCondition(condition)
                }
              })
            }
          })
        }
      })
    },

    // 清楚条件
    _clearCondition (condition) {
      // condition.conditionLogic = null
      condition.infColumnId = null
      condition.operator = ''
      condition.componentType = '01'
      condition.columnValue = ''
    },

    // 获取已有的查询方案
    fetchCustomList () {
      this.queryId && req('getCustomList', {
        msgQueryId: this.queryId
      }).then(data => {
        this.custom = data
      })
      // this.custom = this.async ? customList : this.data
    },

    // 用于外部获取组件数据
    getData () {
      const ids = []

      this.selfColumns.map(col => {
        ids.push(col.id)
      })
      this.custom.infColumnIds = ids

      return this.custom
    },

    // 加载节点
    // loadNode (node, resolve) {
    //   if (node.level > 2) {
    //     return resolve([])
    //   }

    //   if (node.level === 2) {
    //     this._fetchColumnList(node.data.infTableId).then(data => resolve(data))
    //   }

    //   if (node.level === 1) {
    //     this._fetchTableList().then(data => resolve(data))
    //   }
    // },

    // 初始化已选字段
    initChecked () {
      // custom -> tree -> checked
      if (this.custom.infColumnIds) {
        this.defaultCheckedKeys = [...this.custom.infColumnIds]
        this.defaultExpandedKeys = [...this.custom.infColumnIds]
      }
    },

    handleCheckChange (data, checked, indeterminate) {
      let allCheckedNodes = this.$refs.tree.getCheckedNodes()
      let allCheckedTabledIds = allCheckedNodes.map(ele => ele.infTableId)
      let leafCheckedNodes = this.$refs.tree.getCheckedNodes(true)
      let leafCheckedTableIds = leafCheckedNodes.map(ele => ele.infTableId)
      // 收集需要需要另外获取的表格id集合
      let needToGetTableIds = []
      allCheckedTabledIds.forEach(ele => {
        if (!leafCheckedTableIds.includes(ele)) {
          needToGetTableIds.push(ele)
        }
      })
      // 如果只是取消勾选，则代表数据已存在
      if (!checked) {
        if (!needToGetTableIds.length) {
          return this.getChecked()
        }
        return needToGetTableIds.forEach(ele => {
          let index = allCheckedNodes.findIndex(el => !el.infColumnId && el.infTableId === ele)
          allCheckedNodes.splice(index, 1, ...this.saveTables[ele])
          this.getChecked(allCheckedNodes)
        })
      }
      // 如果增加勾选，但是无需捞取时候
      if (checked && !needToGetTableIds.length) {
        return this.getChecked()
      }
      // 如果是增加勾选，则需要捞取数据
      let index = allCheckedNodes.findIndex(el => !el.infColumnId && el.infTableId === data.infTableId)
      // 保存的数据捞取不到，就要请求了
      if (!this.saveTables[data.infTableId]) {
        return this._fetchColumnList(data.infTableId).then(res => {
          this.saveTables[data.infTableId] = res
          allCheckedNodes.splice(index, 1, ...res)
          if (needToGetTableIds.length === 1) {
            return this.getChecked(allCheckedNodes)
          }
          needToGetTableIds.forEach(ele => {
            if (ele !== data.infTableId) {
              let index = allCheckedNodes.findIndex(el => !el.infColumnId && el.infTableId === ele)
              allCheckedNodes.splice(index, 1, ...this.saveTables[ele])
              this.getChecked(allCheckedNodes)
            }
          })
        })
      }
      // 保存的数据有，就直接捞取
      needToGetTableIds.forEach(ele => {
        let index = allCheckedNodes.findIndex(el => !el.infColumnId && el.infTableId === ele)
        allCheckedNodes.splice(index, 1, ...this.saveTables[ele])
        this.getChecked(allCheckedNodes)
      })
    },

    // 获取被选中的字段
    getChecked (node = this.$refs.tree.getCheckedNodes(true)) {
      // this.checked = node.filter(ele => ele.infColumnId)
      this.checked = node
      this._parseChecked()
    },

    moveStart (e) {
      this.draggingIdx = e.oldIndex
      this.dragging = true
    },
    moveEnd (e) {
      this.dragging = false
    },

    deleteChecked (col) {
      if (this.disabled) {
        return
      }

      const tree = this.$refs.tree
      // const nodes = tree.getCheckedNodes(true)

      // const ids = nodes
      //   .filter(node => node.id !== col.id)
      //   .map(node => node.id)

      const ids = this.selfColumns
        .filter(node => node.id !== col.id)
        .map(node => node.id)

      tree.setCheckedKeys(ids)
      this.handleCheckChange()
    },

    // 获取表集合 01 启用、02 禁用
    _fetchTableList () {
      // 搜索启用的表集合
      return req('getTableList', {
        status: '01'
      }).then(data => {
        return data.map(el => ({
          ...el,
          label: el.infName,
          id: 'table-' + el.infTableId,
          children: [],
          disabled: this.disabled
        }))
      })
    },
    // 获取搜索集合
    _fetchColumnList (id) {
      return req('getColumnList', { infTableId: id }, true, false)
        .then(data => {
          return data.map(el => {
            return {
              ...el,
              label: el.columnName,
              id: el.infColumnId,
              leaf: true,
              disabled: this.disabled
            }
          })
        })
    },

    // 解析集合参数
    _parseChecked () {
      this.selfColumns = []

      this.checked.map(async col => {
        this._packColumns(col)
        await this._packEditor(col)
      })
    },

    // 封装 <main/> 需要的 columns
    _packColumns (col) {
      const config = {
        prop: col.columnFieldName,
        label: col.columnName,
        id: col.infColumnId,
        componentType: col.componentType
      }

      if (col.dictCode) {
        config.display = {
          dict: col.dictCode
        }
      }

      this.selfColumns.push(config)
    },

    // 封装 <main/> 需要的 editor
    _packEditor (col) {
      if (this.selfEditor[col.columnFieldName]) {
        return Promise.resolve()
      }

      this.selfEditor[col.columnFieldName] = {
        type: this.componentType[col.componentType],
        options: []
      }

      const target = this.selfEditor[col.columnFieldName]

      // HACK:
      col.urlAddress && !target.options.length
        ? this._getColumnOptions(col).then(data => {
          target.options = this._formatSelectOptions(data, col.componentType)
        })
        : Promise.resolve()
    },

    _getColumnOptions (col) {
      return this._fetchColumnOptions(col)
    },

    _formatSelectOptions (options, type) {
      return options
    },

    // 获取 url 的数据
    _fetchColumnOptions ({ urlAddress: url }) {
      return _req(url)
    }
  },

  components: {
    ISearchMain,
    Draggable
  }
}
</script>

<style lang="scss" scoped>
.i-search-conditions {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  > * {
    box-sizing: border-box;
  }

  .section {
    border: 1px solid #E8E8E8;
    height: 100%;
    overflow: hidden;
  }

  .tree-section {
    width: 240px;
  }
  .checked-section {
    width: 240px;
    .drag-section {
      padding: 10px;
      padding-right: 0;
      padding-bottom: 0;
    }
  }
  .i-search-main {
    flex-basis: 506px;
  }

  .box {
    overflow: hidden;
    box-sizing: border-box;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 3px 15px;
    background: #fff;
    border: 1px solid #3da5fe;
    font-size: 11px;
    color: #3da5fe;
    text-align: center;
    position: relative;
    cursor: move;
    .delete {
      display: block;
      position: absolute;
      top: -16px;
      right: -16px;
      width: 0;
      height: 0;
      border: 15px solid transparent;
      border-bottom-color: #3da5fe;
      transform: rotate(45deg);
      cursor: pointer;
      &.disabled {
        display: none;
      }
      i {
        position: absolute;
        top: 2px;
        right: -7px;
        transform: rotate(-45deg);
        color: #fff;
        font-size: 10px;
        font-weight: 500;
      }
    }
    &.dragging {
      opacity: 0;
    }
    &.disabled {
      user-select: none;
      cursor: not-allowed;
    }
  }
  .dragging-active {
    transition: all 1s;
    opacity: 0;
  }
}
</style>

<style lang="scss">
.i-search-conditions {
  $title-height: 50px;

  .title {
    position: relative;
    height: $title-height;
    line-height: $title-height;
    text-align: center;
    border-bottom: 1px solid #E8E8E8;
    background: #FAFAFA;
    font-size: 14px;
    color: #000;
  }

  .section-body {
    height: calc(100% - #{$title-height});
    overflow-x: auto;
    box-sizing: border-box;
    // padding-bottom: 5px;
  }

  .el-form {
    line-height: 28px;
    margin: 0;
    .el-form-item {
      margin: 0;
    }
    .el-form-item__content {
      line-height: 28px;
    }
    .el-form-item__error {
      font-size: 0;
      padding-top: 0;
    }
  }
}
</style>
