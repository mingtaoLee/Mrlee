<template>
  <div class="i-table">
    <header v-if="table.title || toolbarJudge() || toolbarSlotJudge()">
      <h3 v-if="table.title" class="single-text-overflow">
        {{ table.title }}
      </h3>

      <nav class="toolbar">
        <el-button
          v-for="(tool, idx) of toolbar"
          v-if="!_toolbarDisableMap(tool, 'empty')"
          :key="idx"
          :disabled="_toolbarDisableMap(tool, 'disable')"
          :type="tool.next ? (editable ? '' : 'primary') : (tool.type || 'primary')"
          @click.stop.native="_toolbarClickHandler(tool)">
          <i :class="tool.icon"></i>
          {{ !editable ? tool.text : (tool.next || tool.text) }}
        </el-button>
      </nav>

      <!-- VERSION: v1.9.11+ -->
      <nav class="toolbar-slot" v-if="toolbarSlotJudge()">
        <!-- <i-table-search
          v-if="search"
          :search="search"
          :columns="columns"
          @search="searchHandler">
        </i-table-search> -->
        <slot name="search"/>
        <slot name="toolbar"/>
        <i-table-sift
          v-if="siftJudge()"
          :columns="columns"
          :config="table.sift"
          @sift="siftHandler"
        ></i-table-sift>
      </nav>
    </header>

    <main v-clickoutside="_tableClickOutsideHandler">
      <slot
        name="table"
        :clone="clone"
        :data="table.data"
        :columns="columns"
        :siftColumns="siftColumns"
        :disable="table.disable || false"
        :editable="editable"
        :loading="loading"
        :loaded="!loading"
        :editor="editor"
        :operator="operator"
        :leafMap="leafMap"
        :getDate="getDate"
        :error="error"
        :editingList="editingList"
        :dictList="display.dictList"
        :dateList="display.dateList"
        :mixinList="display.mixinList"
        :formatter="formatter"
        :toggleError="toggleError"
        :rowClickHandler="rowClickHandler"
        :selectionChangeHandler="selectionChangeHandler">
        <p>暂无 &lt;el-table/&gt;</p>
      </slot>
    </main>

    <footer v-if="table.showPagebar" v-show="clone.length" class="footerPage">
      <span class="single-text-overflow">
        {{ table ? (table.total || 0) : 0 }}条数据，
        共{{ table ? (table.info ? (table.info.totalPage || 0) : 0) : 0 }}页
      </span>
      <el-pagination
        ref="page"
        layout="sizes, prev, pager, next, jumper"
        :total="table.total || 0"
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        background
        @size-change="pageSizeChangeHandler"
        @current-change="pageIndexChangeHandler"
      ></el-pagination>
    </footer>

    <i-dialog
      v-if="exportSetting.req"
      v-model="exportVisible"
      :toolbar="exportToolbar"
      :title="exportSetting.text || '导出'"
      size="small">
      <i-table-export-excel
        v-if="exportVisible"
        ref="export"
        :setting="exportSetting"
        :tables="{
          elTable,
          iTable: {
            pageIndex,
            pageSize,
            display,
            multipleSelection,
            table
          }
        }"
        @exportFileId="controlExportFileId"
      />
    </i-dialog>

    <i-dialog
      v-if="importDialogShowing"
      v-model="importVisible"
      :toolbar="importToolbar"
      :title="importDialogTitle || '导入'"
      size="small">
      <i-table-import-excel
        v-if="importVisible"
        ref="import"
        :setting="impSetting"
        @submited="importSubmitedHandler"
      />
    </i-dialog>

    <i-task ref="exportDetais"></i-task>
  </div>
</template>

<script>
import IDialog from 'components/common/i-dialog/i-dialog'
import ITask from 'components/common/i-task'
import ITableExportExcel from './export-excel'
import ITableImportExcel from './import-excel'
import ITableSift from './sift'
import ITableSearch from './search'

import Clickoutside from 'directives/clickoutside'
import { getSelectData } from 'utils/index.js'

import access from 'mixins/access'

export default {
  name: 'ITable',

  mixins: [access],

  directives: {
    Clickoutside
  },

  props: {
    table: {
      type: Object,
      default: {},
      required: true
    },

    search: {
      type: String,
      default: '',
      required: false
    },

    fetchAfterImported: {
      type: Boolean,
      default: true
    }

  },

  data () {
    return {
      storage: {
        createList: [],
        deleteList: [],
        updateList: []
      },
      rule: {
        create: this.createData,
        delete: this.deleteData,
        toggle: this.toggleEditable
      },
      format: {
        dict: this.dictFormatter,
        date: this.dateFormatter,
        mixin: this.mixinFormatter
      },

      editable: this.table.editable || false,
      loading: true,
      editingCurId: -1,

      editingList: [],

      currentRow: null,
      multipleSelection: [],

      columns: [],
      treeColumns: [],
      leafColumns: {},
      rootColumns: {},
      parentColumns: {},
      dataColumns: {},
      headerColumns: {},
      siftColumns: [],

      init: [],
      clone: [],
      dust: [],
      count: 0,
      initCount: 0,

      display: {
        dictList: {},
        dateList: {},
        mixinList: {}
      },
      request: {},

      pageIndex: this._getPageInfo('pageIndex') || 1,
      pageSize: this._getPageInfo('pageSize') || (window.innerHeight >= 660 ? 10 : 8),
      pageSizes: window.innerHeight >= 660 ? this.$$.table.pageSizes : this.$$.table.smallPageSizes,

      elTable: {},
      elTableBody: {},
      elTableStates: {},

      exportVisible: false,
      exportToolbar: [{
        text: '取消',
        type: 'default',
        func: done => done()
      }, {
        text: '确定',
        func: done => {
          this.$refs.export && this.$refs.export.submit(done)
        }
      }],

      importToolbar: [{
        text: '取消',
        type: 'default',
        func: done => done()
      }, {
        text: '确定',
        func: done => {
          this.$refs.import && this.$refs.import.submit(done)
        }
      }],

      // 导入
      importVisible: false,
      importDialogTitle: '',
      impSetting: {},

      pageTimer: null,
      dev: !!this.table.dev,

      error: {},
      global: {}
    }
  },

  computed: {
    toolbar () {
      const toolbar = this.settingMap('toolbar') || []

      this._initImportToolControl(toolbar, this.importSetting)
      this._initExportTool(toolbar, this.exportSetting)
      return toolbar.filter(ele => {
        if (ele.hasOwnProperty('key') && ele.key) {
          return this.accessMap[ele.key]
        }
        return true
      })
    },

    editor () {
      return this.settingMap('editor') || null
    },

    exportSetting () {
      return this._accessMapFunc('export')
    },

    importSetting () {
      return this._accessMapFunc('import')
    },

    importDialogShowing () {
      return !!this.impSetting.business
    },

    operator () {
      const operator = this.settingMap('operator')

      return !Array.isArray(operator)
        ? null
        : operator.map(el => ({
          ...el,
          func: el.func.bind(this)
        }))
    }
  },

  watch: {
    // HACK: 后续验证是否需要
    // clone (data) {
    //   if (Array.isArray(data)) {
    //     this.elTable.$props.data = data
    //   }
    // },

    'table.data' (data) {
      this._initData(data)
      this.table.renderColumns && this._initColumns(this.init)
      this._cloneData()
      this._loadedHandler()
    },

    // 调用分页按钮时出发
    'table.info' (info) {
      this._setPageInfo(info)
    },

    'table.search' (data = {}) {
      // HACK: 临时解决，后续解耦 search / pageChange
      typeof data === 'object'
        ? this.pageIndex === 1
          ? this.pageIndexChangeHandler(1)
          : this._setPageInfo({ pageIndex: 1 })
        : console.error('请传入 {} 或者 null')
    },

    'table.header' (data) {
      this._initHeader(data)
    },

    'table.columns' (columns) {
      if (this.table.renderColumns) {
        this._initTable()
      }
    },

    'elTable.selection' (selection) {
      this.multipleSelection = selection
    },

    'elTableStates.currentRow' (row) {
      this.currentRow = row
    },

    /** 检测上一行的数据变动 */
    editingCurId (curId, preId) {
      if (curId !== -1) {
        this._checkData(preId)
      }
    },

    importVisible (val) {
      val && this.$refs.import && this.$nextTick(() => this.$refs.import.init())
    }
  },

  created () {
    this._initTable()
  },

  mounted () {
    this._bindElTable()
    this.$emit('Mounted')
    // this._bindPageChange()
  },

  methods: {
    /** 绑定 elTable 对象 */
    _bindElTable () {
      this.elTable = this.$children.find(
        ({ $options = {} }) => $options._componentTag === 'el-table'
      ) || {}

      this.elTableStates = this.elTable.store.states
      this._bindElTableRowClick()
    },

    /** 权限控制 */
    _accessMapFunc (type) {
      if (this.settingMap(type)) {
        if (type === 'import' && Array.isArray(this.settingMap(type))) {
          return this.settingMap(type).filter(ele => {
            return ele.hasOwnProperty('key') ? this.accessMap[ele.key] : true
          })
        }
        if (this.settingMap(type).hasOwnProperty('key')) {
          return this.accessMap[this.settingMap(type).key] ? this.settingMap(type) : {}
        }
        return this.settingMap(type)
      }
      return {}
    },

    // _bindPageChange (fn, opts = {}) {
    //   if (fn) {
    //     this.$on('pageSizeChange', fn(opts))
    //     this.$on('pageIndexChange', fn(opts))
    //   }
    // },

    /** 绑定 elTable 点击事件 */
    _bindElTableRowClick () {
      this.elTable.$on('cell-click', this._getCurrentRow)
    },

    /** 获取点击后返回的对象 */
    _getCurrentRow (row, column, cell, event) {
      // 如果是复选款，则不触发事件
      if (!column.label) return
      this._rowClickHandler(row)
    },

    /** 初始化表格 */
    async _initTable () {
      try {
        this._parseColumns()
        await this._initDisplay()
      } catch (err) {
        this.dev && this.$message({
          type: 'error', message: err
        })
      }

      this._initPage()
      this._initData()

      this.table.header
        ? this._initHeader()
        : this._initColumns(this.init)

      this._cloneData()
      this._loadedHandler()
    },

    /** 初始化数据 */
    _initData (data = this.table.data) {
      data && (this.init = this._flattenData('data', data))

      this.initCount = this.init.length
    },

    /** 根据 data 数据结构，构造动态表头 */
    _initHeader (data = this.table.header) {
      if (data) {
        const header = this._flattenData('header', data)

        this._initColumns(header)
      }
    },

    /** 初始化导出按钮 */
    _initExportTool (toolbar, { req, text = '导出', key, show }) {
      let last = toolbar[toolbar.length - 1] || {}

      last._btn === 'export' && toolbar.pop()
      last = toolbar[toolbar.length - 1] || {}

      if (last._btn !== 'export' && req) {
        toolbar.push({
          text,
          key,
          show,
          type: 'success',
          _btn: 'export',
          func: () => (this.exportVisible = true)
        })
      }
    },

    // 打开异步导出详情弹窗
    controlExportFileId (id) {
      this.$refs.exportDetais.openDialog(id)
    },

    /** 初始化导入按钮控制，用于判断是否多个传递,并分别处理 */
    _initImportToolControl (toolbar, importSetting) {
      if (Array.isArray(importSetting)) {
        importSetting.map((ele, index) => {
          this._initImportTool(toolbar, ele, index)
        })
      } else {
        this._initImportTool(toolbar, importSetting, 0)
      }
    },

    /** 初始化导入按钮的单个处理 */
    _initImportTool (toolbar, { business, text = '导入', key, show, callback }, index) {
      let importIdx = toolbar.findIndex(tool => tool._btn === 'import' + index)
      let exportIdx = toolbar.findIndex(tool => tool._btn === 'export')

      const tool = {
        text,
        key,
        show,
        type: 'success',
        _btn: 'import' + index,
        func: () => {
          let importSetting = this._accessMapFunc('import')
          this.impSetting = Array.isArray(importSetting) ? importSetting[index] : importSetting
          this.importDialogTitle = Array.isArray(importSetting) ? importSetting[index].text : importSetting.text
          this.importVisible = true
        },
        callback
      }
      if (business) {
        importIdx === -1
          ? exportIdx === -1
            ? toolbar.push(tool)
            : toolbar.splice(exportIdx, 0, tool)
          : toolbar.splice(importIdx, 1, tool)
      }
    },

    /** 克隆数据 */
    _cloneData () {
      this.clone = JSON.parse(JSON.stringify(this.init || []))
      this.count = this.clone.length

      this.clone.map((el, i) => {
        typeof el === 'object' && (el._id = i)
        this.editingList.push(false)
      })
    },

    /** 在多级表格中，构建唯一 prop */
    _columnsKeyMap ({ key, prefix, root }) {
      if (root) {
        return prefix
          ? prefix + '--' + root + '_'
          : root + '_'
      } else {
        return prefix
          ? prefix + '--' + key
          : key
      }
    },

    /** 扁平化数据，用于多级表格下的渲染 */
    _flattenData (type, data = []) {
      return data
        ? this.table.multiple
          ? data.map(row => this._$flattenData(type, row))
          : data
        : []
    },

    /** 递归扁平每一个节点树 */
    _$flattenData (type, row = {}, prefix = '') {
      return Object.entries(row).reduce((ret, [key, val]) => {
        const root = this[type + 'Columns'][key]
        key = this._columnsKeyMap({ key, prefix, root })

        if (!root) {
          return Object.assign(ret, { [key]: val })
        }

        const rootKey = key.substr(0, key.length - 1)

        if (Array.isArray(val)) {
          this.rootColumns[rootKey] = this.rootColumns[rootKey]
            ? Math.max(val.length, this.rootColumns[rootKey])
            : val.length

          val.map((col, idx) => (ret = Object.assign(ret, {
            ...this._$flattenData(type, col, key + idx)
          })))
        } else if (typeof val === 'object') {
          Object.entries(val).map(([key, col]) => {
            ret[rootKey + '--' + key] = col
          })
        }

        return ret
      }, {})
    },

    /** 反扁平化数据，用于返还后端 */
    _unFlattenData (data) {
      return this.table.multiple
        ? data.map(row => this._$unFlattenData(row))
        : data
    },

    /** 递归处理数据，构造树 */
    _$unFlattenData (row = {}) {
      const cloneRow = {}
      const arrReg = /^([a-zA-Z0-9]+)_(\d*)--([a-zA-Z0-9]+)/
      const objReg = /^([a-zA-Z0-9]+)--([a-zA-Z0-9]+)/

      Object.entries(row).map(([key, val]) => {
        let parent = cloneRow
        let target = key
        let isArr = arrReg.test(target)
        let isObj = objReg.test(target)

        !isArr && !isObj && (cloneRow[key] = val)

        while (isArr || isObj) {
          if (isArr) {
            target = target.replace(arrReg, (str, $1, $2, $3) => {
              const root = this.parentColumns[$1]

              cloneRow[root] || (cloneRow[root] = [])
              parent = cloneRow[root][$2] || (cloneRow[root][$2] = {})
              parent[$3] = val

              return $3
            })
          } else if (isObj) {
            target = target.replace(objReg, (str, $1, $2) => {
              const root = this.parentColumns[$1]

              if (root) {
                parent[root] || (parent[root] = {})
                parent = parent[root]
              }
              parent[$2] = val

              return ''
            })
          }

          isArr = arrReg.test(target)
          isObj = objReg.test(target)
        }
      })

      return cloneRow
    },

    /** 新增数据 */
    createData (data = {}) {
      this.storage.createList.push(this.count)
      let newRow = {}

      // HACK: 暂不支持多级表头的空数据注册
      this.table.multiple || Object.keys(this.leafColumns).map(col => (newRow[col] = ''))

      this.clone.push(Object.assign(newRow, data, { _id: this.count++ }))
      this.editingList.push(false)

      // TODO 暂时添加行不可编辑
      this.table.disable || data.disable || this.changeEditingWithCreate(this.editingList.length - 1)

      return Promise.resolve()
    },

    /** 删除数据 */
    deleteData (selection = this.multipleSelection) {
      const _selection = Array.isArray(selection)
        ? selection
        : [selection]

      this._toEditable()

      _selection.map(({ _id }) => {
        this._removeRowError(_id)

        const { deleteList, updateList, createList } = this.storage
        const uIdx = updateList.findIndex(el => el === _id)
        const cIdx = createList.findIndex(el => el === _id)

        deleteList.push(_id)

        if (uIdx > -1) {
          updateList.splice(uIdx, 1)
        } else if (cIdx > -1) {
          createList.splice(cIdx, 1)
          deleteList.pop()
        }

        const deleteIdx = this.getCloneIdx(_id)

        this.editingList[_id] = false
        this.dust.push(...this.clone.splice(deleteIdx, 1))
      })
    },

    /** 用于判断数据是否发生改变 */
    _checkData (preId) {
      if (preId === -1) { return }

      this.dev && console.log('上一次被聚焦的行_id：', preId)
      const { deleteList, updateList } = this.storage

      // 先判断是否被删除，若无，再判断 _id 是否小于初始数组长度
      // 若都满足，则判断与初始值的差异，若不同则进入 update 状态
      if (!deleteList.includes(preId) && preId < this.initCount) {
        const init = this.init[preId]
        const idx = this.getCloneIdx(preId)

        // 判断索引值对应的行对象上的数据，是否与原始值一致
        const isEqual = Object.keys(init).findIndex(key => {
          // 若改变后的值为 undefined 则至其为 null，即，判断为“未改变”
          // 若改变后的值为 '' 则判断为“改变”
          this.clone[idx][key] === undefined && (this.clone[idx][key] = null)

          // 若一个值从 1 至为 '1'，判断为“未改变”
          return init[key] + '' !== this.clone[idx][key] + ''
        }) === -1

        this.dev && console.log('数据是否变更：', !isEqual)

        // 判断两者是否相同
        // 若一致再判断该值在之前的修改并保存中，是否进入了 updateList，若有则移除
        // 若不一致则进入 updateList
        if (isEqual) {
          const idx = updateList.indexOf(preId)

          idx > -1 && updateList.splice(idx, 1)
        } else {
          updateList.includes(preId) || updateList.push(preId)
        }
      }
    },

    /** 用于修改数据 */
    // changeData ({ selection = this.multipleSelection, data = {} } = {}) {
    //   Array.isArray(selection) || (selection = [selection])

    //   selection.map(({ _id }) => {
    //     const idx = this.getCloneIdx(_id)

    //     try {
    //       Object.keys(data).map(key => {
    //         this.changeDataJudge(key)

    //         this.$set(this.clone[idx], key, data[key])
    //       })

    //       this._checkData(_id)
    //       this.changeEditing(_id, false)
    //     } catch (err) {
    //       this.$message({
    //         type: 'error', message: err.message
    //       })
    //     }
    //   })
    // },

    /** 保存数据 */
    saveData () {
      // 异常校验，若存在异常，则结束
      if (this.checkError()) {
        return false
      }

      this._checkData(this.editingCurId)
      this.changeEditing(this.editingCurId, false)
      this.editingCurId = -1

      ;['create', 'delete', 'update'].map(method => (
        this.request[method] = this._unFlattenData(
          this.storage[method + 'List'].map(
            _id => this.clone[this.getCloneIdx(_id)] || this.dust[this.getDustIdx(_id)]
          )
        )
      ))

      this.dev && console.log('增删改集合: ', this.request)
      const clone = this._unFlattenData(this.clone)

      this.$emit('save', this.request)
      this.$emit('clone', clone)

      return {
        request: this.request,
        clone
      }
    },

    /** 开启编辑状态 */
    _toEditable () {
      this.table.disable || this.editable || (this.editable = true)
    },

    /** 切换编辑状态 */
    toggleEditable () {
      if (this.table.disable) {
        this.$message({
          type: 'error', message: '禁止修改该表格的数据'
        })
        return
      }

      if (this.checkError()) { return }

      // 退出前
      this.editable
        ? this.saveData()
        : this.clone[0] && this.changeEditing(this.clone[0]._id, true)  // 进入编辑状态时，第一行可编辑

      this.editable = !this.editable
    },

    /** 更改行的编辑状态，控制视图层的渲染 */
    changeEditing (_id, toEditing) {
      this.$set(this.editingList, this.editingCurId, false)
      this.editingCurId = _id

      // 更改当前行的状态，并标记
      this.$set(this.editingList, _id,
        toEditing === undefined
          ? !this.editingList[_id]
          : toEditing
      )
    },

    /** 异常校验 */
    checkError (_id) {
      if (_id === -1) { return }
      const target = _id === undefined ? this.error : this.error[_id]

      return Object.keys(target || {}).length
    },

    /** 移除整行异常 */
    _removeRowError (_id) {
      delete this.error[_id]
    },

    /** 移除列异常 */
    _removeColError (_id, prop) {
      this.error[_id] && delete this.error[_id][prop]
    },

    /** 切换异常状态 */
    toggleError (row, col, isError) {
      const { _id } = row

      if (isError) {
        this.error[_id] || (this.error[_id] = {})
        this.error[_id][col] = true
      } else {
        if (this.error[_id]) {
          delete this.error[_id][col]
          Object.keys(this.error[_id]).length || delete this.error[_id]
        }
      }

      this.dev && Object.keys(this.error).length && console.log('error', this.error)
    },

    /** 作为 create 时的附加功能：移除上一次聚焦行的编辑状态 */
    changeEditingWithCreate (_id) {
      this._toEditable()
      this.changeEditing(_id, true)
    },

    /** 根据 _id 获取目标数组 target 下的索引值 */
    _getIdx (target) {
      return (_id) => target.findIndex(el => el._id === _id)
    },
    getCloneIdx (_id) {
      return this._getIdx(this.clone)(_id)
    },
    getDustIdx (_id) {
      return this._getIdx(this.dust)(_id)
    },

    /** 初始化分页数据 */
    _initPage () {
      this.pageSizes = this.pageSize
       ? [...new Set([...this.pageSizes, +this.pageSize])].sort((a, b) => a - b)
       : this.pageSizes
    },

    /** 获取外界配置的分页信息 */
    _getPageInfo (key) {
      const { info } = this.table

      return info && info[key]
    },

    /** 工具栏的点击回调 */
    _toolbarClickHandler ({ func, role }) {
      func && func(this)
    },

    /** 行点击事件的回调 */
    _rowClickHandler (row) {
      // 点击行默认多选选择
      !this.editable && this.elTable.toggleRowSelection(row)
      const { _id } = row

      // HACK: 暂时添加行不可编辑
      this.table.disable ||
      row.disable ||
      this.editable && this.changeEditing(_id)
    },

    // VERSION: v2.0 废弃
    rowClickHandler (row) {
      console.warn('i-table', 'rowClickHandler 将于 v2.0 废弃, 监听单选无需再使用该函数')
    },

    // VERSION: v2.0 废弃
    selectionChangeHandler (selection) {
      console.warn('i-table', 'selectionChangeHandler 将于 v2.0 废弃, 监听多选无需再使用该函数')
    },

    /** 导入完成处理事件 */
    importSubmitedHandler () {
      // HACK:
      this.fetchAfterImported && this.pageIndexChangeHandler(1)
    },

    /** 点击表格以外退出编辑 */
    _tableClickOutsideHandler () {
      this.changeEditing(this.editingCurId, false)

      // 移除如下，数据抛出的统一形式，由页面级按钮、组件级按钮决定
      // this.editingCurId === -1 || this.saveData()
    },

    /** 设置分页信息 */
    _setPageInfo ({ pageIndex, pageSize } = {}) {
      pageIndex && (this.pageIndex = pageIndex)
      pageSize && (this.pageSize = pageSize)
    },

    /** 防抖 */
    _debounce (fn, later = 0) {
      if (this.pageTimer) {
        clearTimeout(this.pageTimer)
      }
      this.pageTimer = setTimeout(fn, later)
    },

    /** pageSize 的变动回调 */
    pageSizeChangeHandler (pageSize) {
      const search = this.table.search || {}

      this.loading = true
      this._setPageInfo({ pageIndex: 1, pageSize })

      this._debounce(() => {
        this.$emit('pageSizeChange', {
          ...search,
          pageIndex: 1,
          pageSize
        })
      })
    },

    /** pageIndex 的变动回调 */
    pageIndexChangeHandler (pageIndex) {
      const search = this.table.search || {}

      this.loading = true
      this._setPageInfo({ pageIndex })

      this._debounce(() => {
        this.$emit('pageIndexChange', {
          ...search,
          pageSize: this.pageSize,
          pageIndex
        })
      })
    },

    /** 加载完毕后的执行函数 */
    _loadedHandler () {
      this.loading = false
      this.$emit('loaded', this)
    },

    /** 过滤表头 */
    siftHandler (columns) {
      const _columns = [...columns]

      this.siftColumns = []
      this.$nextTick(() => {
        this.siftColumns = _columns
        this.elTable.doLayout()
      })

      // this.elTable.doLayout()
      // this.siftColumns = _columns
    },

    /** 搜索回调 */
    searchHandler (val) {
      this.table.search = { ...this.table.search, [this.search]: val }
    },

    /** 获取选中的行对象集合 */
    getMultipleSelection () {
      return this.multipleSelection
    },

    /** 解析 columns */
    _parseColumns () {
      const { columns } = this.table

      return Array.isArray(columns)
        ? this._$parseColumns(columns)
        : null
    },

    /** 构建用于后续计算的多种 columns 集合 */
    _$parseColumns (columns = []) {
      return columns.reduce((ret, col) => {
        this._extendColumns(col)

        if (Array.isArray(col.children)) {
          if (col.parent) {
            const parents = col.parent.split('|')

            this.dataColumns[parents[0]] = col.prop
            this.parentColumns[col.prop] = parents[0]
            this.headerColumns[parents[1] || parents[0]] = col.prop
          } else {
            this.dataColumns[col.prop] = col.prop
            this.parentColumns[col.prop] = col.prop
          }

          return this._$parseColumns(col.children)
        }

        this.leafColumns[col.prop] = {
          ...(col.display ? { display: col.display } : {}),
          ...this.leafColumns[col.prop]
        }
      }, {})
    },

    /** 初始化表头 */
    _initColumns (header) {
      const { columns } = this.table

      // if (this.table.multiple && Array.isArray(columns)) {
      if (Array.isArray(columns)) {
        this.columns = []
        this._spreadColumns(header, columns)
        this._flattenColumns(this.columns)
        this._accessColumns(this.columns)
        this._initSiftColumns(this.columns)
      }
    },

    /** 初始化用于过滤筛选的表头集合 */
    _initSiftColumns (columns) {
      if (this.siftJudge()) {
        this.siftColumns = JSON.parse(JSON.stringify(
          columns
        ))
      }
    },

    /** 流程权限控制 */
    _accessColumns (columns) {
      // 判断是否是流程环境
      if (this.showMap) {
        columns = columns.filter(col => (
          !col.hasOwnProperty('key') || this.showMap[col.key]
        ))
      }
    },

    /** 填充表头 */
    _spreadColumns (header, columns = []) {
      columns.map(col => {
        if (!col.parent) {
          this.columns.push(JSON.parse(JSON.stringify(col)))
        }

        const cnt = this.rootColumns[col.prop]
        const reg = /\{([a-zA-Z_-]*)\}/g

        cnt && new Array(cnt).fill().map((el, i) => this.columns.push({
          ...JSON.parse(JSON.stringify(col)),
          prop: col.prop + '_' + i,
          label: col.label.replace(reg, (str, $1) => header[0]
            ? header[0][col.prop + '_' + i + '--' + $1]
            : '')
        }))
      })
    },

    /** 扁平化表头 */
    _flattenColumns (columns = [], prefix = '') {
      return columns.reduce((ret, col) => {
        let leafProp = col.prop
        prefix && (col.prop = prefix + '--' + leafProp)

        return ret.concat(
          col.children
            ? this._flattenColumns(col.children, col.prop)
            : col
        )
      }, [])
    },

    /** 拓展表头 */
    _extendColumns (col) {
      const { columnsExt } = this.table

      columnsExt && (
        col = Object.assign(col, columnsExt[col.prop])
      )
    },

    /** 初始化用于数据转换的字典、日期集合 */
    _initDisplay () {
      return Promise.all(
        Object.entries(this.leafColumns).map(
          ([prop, col]) => col.display
            ? this.format[Object.keys(col.display)[0]](col, prop)
            : Promise.resolve()
        )
      )
    },

    /** 获取字典 url */
    _getDictUrl (dictType) {
      return window.globalComponentVariable.iTable.dict.url(dictType)
    },

    /** 获取字典集合 */
    _getDict (url) {
      return getSelectData(url, true)
    },

    /** 日期转换 */
    getDate ({ format, val }) {
      if (!val) {
        return ''
      }
      let time
      if (isNaN(Number(val))) {
        switch (typeof val) {
          case 'string':
            time = new Date(val.replace(/-/g, '/'))
            break
          default:
            return ''
        }
      } else {
        time = new Date(Number(val))
      }

      const year = ('0000' + time.getFullYear()).slice(-4)
      const month = ('00' + (time.getMonth() + 1)).slice(-2)
      const date = ('00' + time.getDate()).slice(-2)
      const hour = ('00' + time.getHours()).slice(-2)
      const minute = ('00' + time.getMinutes()).slice(-2)
      const second = ('00' + time.getSeconds()).slice(-2)
      const milliSecond = ('000' + time.getMilliseconds()).slice(-3)

      return format
        .replace('yyyy', year)
        .replace('MM', month)
        .replace('dd', date)
        .replace('HH', hour)
        .replace('hh', hour) // 暂未对 12 小时制做处理，统一转换为 24 小时制
        .replace('mm', minute)
        .replace('ss', second)
        .replace('SSS', milliSecond)
    },

    /** 数据格式化 */
    formatter (row, { property = '' }, val) {
      const prop = this.leafMap(property)
      const listName = Object.keys(this.display).find(key => this.display[key][prop] !== undefined)
      const list = this.display[listName]

      if (!list) { return val }

      // HACK: 暂时都写成 if-else

      if (listName === 'dictList') {
        return list[prop] ? list[prop][val] : val
      }

      if (listName === 'dateList') {
        return this.getDate({ format: list[prop], val })
      }

      if (listName === 'mixinList') {
        return list[prop] && typeof list[prop] === 'function'
          ? list[prop](row, prop)
          : val
      }
    },

    /** 字典格式化 */
    dictFormatter (col, prop) {
      const { dictList } = this.display
      const { display: { dict } } = col

      const url = dict ? this._getDictUrl(dict) : ''

      return !url || dictList[prop]
        ? Promise.resolve()
        : this._getDict(url).then(
            dicts => dicts.map(dict => {
              dictList[prop] || (dictList[prop] = {})
              dictList[prop][dict.value] = dict.label
            })
          )
    },

    /** 日期格式化 */
    dateFormatter (col, prop) {
      const formatDate = this.$$.format.date
      const { dateList } = this.display
      let { display: { date } } = col

      // BUG:
      if (date) {
        if (!/(y{4}|M{2}|d{2}|H{2}|h{2}|m{2}|s{2}|S{3})/.test(date)) {
          date = formatDate[date.toString().toLowerCase()] || formatDate.default
        }
      } else {
        date = formatDate.default
      }

      dateList[prop] = date
      return Promise.resolve()
    },

    /** mixin格式化 */
    mixinFormatter (col, prop) {
      const { mixinList } = this.display
      const { display: { mixin } } = col

      mixinList[prop] = mixin
    },

    /** 设置信息匹配 */
    settingMap (key) {
      const { setting = {} } = this.table

      return setting[key]
    },

    /** 工具栏状态匹配 */
    toolbarStateMap (tool) {
      return tool.show ? tool.show() : null
    },

    /** 工具栏禁用状态匹配 */
    _toolbarDisableMap (tool, target) {
      const state = this.toolbarStateMap(tool)

      if (!state) { return null }

      return state[target]
    },

    /** 叶子节点匹配 */
    leafMap (prop) {
      return prop.split('--').slice(-1)[0]
    },

    /** 对传参进行判断，防止更改 _id、禁止修改 disable 的数据 */
    // changeDataJudge (col) {
    //   if (col === '_id') {
    //     throw new Error('传参不得为_id')
    //   }

    //   if (this.editor[col] && this.editor[col].disable) {
    //     throw new Error('不得修改该数据')
    //   }
    // },

    toolbarJudge () {
      return this.toolbar.find(tool => !this._toolbarDisableMap(tool, 'empty'))
    },

    siftJudge () {
      return this.$attrs.hasOwnProperty('sift')
    },

    toolbarSlotJudge () {
      return this.siftJudge() || this.$slots.toolbar || this.search
    }
  },

  components: {
    IDialog,
    ITableImportExcel,
    ITableExportExcel,
    ITableSift,
    ITableSearch,
    ITask
  }
}
</script>

<style lang="scss" scoped>
.i-table {
  header, footer {
    display: flex;
    flex-direction: row;
    padding: 0;
    width: 100%;
    overflow: hidden;
  }

  header {
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
    > h3 {
      font-size: 18px;
    }
    .toolbar, .toolbar-slot {
      padding-left: 0;
      margin: 0;
      font-size: 0;
      > * {
        vertical-align: top;
        margin-left: 10px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  footer {
    height: 28px;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    > span {
      margin-left: 4px;
      height: 24px;
      line-height: 24px;
      box-sizing: border-box;
    }
    > div {
      padding: 0;
    }
  }
}
</style>

<style lang="scss">
.i-table {
  .el-table {
    font-size: 12px;
    color: #333;
  }

  .el-table--border th:last-child {
    border: none;
  }
  .el-table--border td {
    border-right: none;
  }
  tr:not(:last-child) {
    td {
      border-bottom: none;
    }
  }
  .el-table__fixed-right {
    right: 1px;
  }

  .el-form-item {
    margin: 0;
  }
  .el-form-item__content {
    position: static;
  }
  .el-form-item__error {
    position: static;
    padding: 0;
    margin-bottom: 2px;
    font-size: 12px;
  }
  .el-table tr{
    height: 36px;
  }
  .el-table tr th, .el-table tr td{
    height: 36px;
    overflow: hidden;
  }
  //控制分页栏目控制
  .el-pagination {
    display: flex;
    align-items: center;
    .el-input__inner, &__editor {
      padding: 0 5px;
      margin: 0px;
    }
    &__jump {
      margin-left: 5px;
    }
    .el-select .el-input .el-input__inner {
      border-radius: 0;
      height: 24px;
    }
    span:not([class*=suffix]), button {
      height: 24px;
    }
    &__editor.el-input .el-input__inner {
      height: 24px;
    }
    el-input .el-pagination__editor {
      margin-left: 5px;
      margin-right: 5px;
    }
    &__sizes {
      margin-right: 0px;
    }
    .el-pager .more::before {
      line-height: 24px;
    }
    .el-icon {
      line-height: 24px;
    }
    &.is-background .btn-prev, &.is-background .btn-next, &.is-background .el-pager li {
      box-sizing: border-box;
      padding: 0 5px;
      min-width: 24px !important;
      height: 24px;
      line-height: 24px;
      background-color: #FFFFFF;
      border: 1px solid #E0E0E0;
      border-radius: 0;
      &.more {
        border: none;
      }
      &.active{
        background: #3DA5FE;
        border-color: #3DA5FE;
      }
    }
  }

  .el-table--border th:first-child .cell, .el-table .el-table--border td:first-child .cell {
    padding-left: 11px;
  }

  .el-table th,.el-table thead.is-group th{
    background: #F2F2F2;
    color: #3A3A53;
  }

  //table的border
  .el-table--border{
    border-color: #E0E0E0;
  }
  .el-table--border th{
    border-right: 1px solid #E0E0E0
  }
  //hover背景颜色，table的文字大小
  .el-table__body tr.hover-row > td, .el-table__body tr.hover-row.current-row > td, .el-table__body tr.hover-row.el-table__row--striped > td, .el-table__body tr.hover-row.el-table__row--striped.current-row > td {
    background-color:  #def0ff; }
  .el-pagination__sizes .el-input .el-input__inner,
  .el-pager li, .el-pagination span:not([class*=suffix]), .el-pagination button{
    font-size: 12px;
  }
  //表格内自定义tamplate的字体控制
  .el-button--text{
    font-size: 12px;
    color: #3da5fe;
  }
}
</style>
