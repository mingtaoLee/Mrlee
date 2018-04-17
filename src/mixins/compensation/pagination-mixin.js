/**
 * Created by ZHANZF on 2017-12-2.
 * form表单搜索加表格分页基本Mixin
 */
import BaseMixin from './base-mixin'
import { showMessage, confirmPopover } from '../../utils'

/**
 * 新增函数装饰器
 * @param target
 * @param name
 * @param descriptor
 * @returns {*}
 */
function beforeAdd (target, name, descriptor) {
  var oldValue = descriptor.value
  descriptor.value = function (vm) {
    const selected = vm.getMultipleSelection()
    this.editorStatus = '1'
    if (selected.length > 1) {
      return showMessage('warning', '请选择一个选项作为新增内容，或取消选择！')
    } else if (selected.length === 1) {
      this.editorStatus = '2'
    }
    return oldValue.apply(this, arguments)
  }
  return descriptor
}

/**
 * 行修改函数装饰器
 * @param target
 * @param name
 * @param descriptor
 * @returns {*}
 */
function beforeModify (target, name, descriptor) {
  var oldValue = descriptor.value
  descriptor.value = function (scope) {
    if (judgeIsConfirm(scope)) {
      return showMessage('warning', '已确认数据不允许修改！')
    }
    this.editorStatus = '3'
    return oldValue.apply(this, arguments)
  }
  return descriptor
}

/**
 * 行删除函数装饰器
 * @param target
 * @param name
 * @param descriptor
 * @returns {*}
 */
function beforeDeleteRow (target, name, descriptor) {
  let oldValue = descriptor.value
  descriptor.value = function (scope) {
    if (judgeIsConfirm(scope)) {
      return showMessage('warning', '已确认数据不允许删除！')
    }
    return oldValue.apply(this, arguments)
  }
  return descriptor
}

/**
 * 批量删除装饰放弃
 * @param target
 * @param name
 * @param descriptor
 * @returns {*}
 */
function beforeDelete (target, name, descriptor) {
  let oldValue = descriptor.value
  descriptor.value = function (vm) {
    const selected = vm.getMultipleSelection()
    const selectedIds = []

    if (!selected.length) return showMessage('info', '请选择至少一项！')

    for (let item of selected) {
      if (judgeIsConfirm(item)) {
        return showMessage('warning', '包含已确认数据不允许删除！')
      } else {
        selectedIds.push(item[this.idKey])
      }
    }
    return oldValue.call(this, selectedIds)
  }
  return descriptor
}

/**
 * 判断确认状态是否是确认
 * @param scope {Object}：行对象
 * @returns {*|boolean}
 */
function judgeIsConfirm (scope) {
  const confirmStatus = scope.row ? scope.row.confirmStatus : scope.confirmStatus
  return confirmStatus && confirmStatus === 'Y'
}

export default {
  mixins: [BaseMixin],

  beforeAdd: (target, name, descriptor) => {
    var oldValue = descriptor.value
    descriptor.value = function (vm) {
      const selected = vm.getMultipleSelection()
      this.editorStatus = '1'
      if (selected.length > 1) {
        return showMessage('warning', '请选择一个选项作为新增内容，或取消选择！')
      } else if (selected.length === 1) {
        this.editorStatus = '2'
      }
      return oldValue.apply(this, arguments)
    }
    return descriptor
  },

  beforeModify: (target, name, descriptor) => {
    var oldValue = descriptor.value
    descriptor.value = function (vm) {
      this.editorStatus = '3'
      return oldValue.apply(this, arguments)
    }
    return descriptor
  },

  data () {
    return {
      // 新增，有内容带入新增与修改的三种编辑状态
      editorStatus: '1',
      // 额外参数
      extraOption: () => {
        return {}
      },
      // 用来判断用户是否点击搜索
      isSearch: false,
      // 搜索栏搜索参数
      searchParam: {}
    }
  },

  computed: {
    // 分页信息
    pageInfo (value) {
      const pageInfo = this.table.info
      return pageInfo ? { pageSize: pageInfo.pageSize, pageIndex: pageInfo.pageIndex } : {}
    },

    // 全部搜索条件
    allParam (value) {
      return this.isSearch ? { ...this.pageInfo, ...this.searchParam } : { ...this.pageInfo }
    }
  },
  methods: {
    init () {
      // 克隆页面标题
      if (this.title) this.cloneTitle = this.title
      this.table.search = {}
    },

    /**
     * beforeFetch: 页面获取列表数据前的钩子函数，若需继续执行返回值promise需resolve（true）
     * @returns {Promise<boolean>}
     */
    beforeFetch () {
      return Promise.resolve(true)
    },

    /**
     * fetch: 列表数据获取
     * @param options {Object}：查询参数
     */
    fetch (options = {}) {
      this.beforeFetch().then(bef => {
        if (bef) {
          this.load()
          this.reqConfig.req(this.reqConfig.getName, {...options, ...this.extraOption()}).then(res => {
            this.afterFetch(res).then(aft => {
              if (aft) {
                Object.keys(res).map(key => {
                  this.table[key] = res[key]
                })
              }
              this.loaded()
            })
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },

    /**
     * afterFetch：列表数据请求完的钩子函数
     * @param res {any}: 列表数据获取返回值
     * @returns {Promise<boolean>}
     */
    afterFetch (res) {
      return Promise.resolve(true)
    },

    /** 搜索 */
    search () {
      this.allParam.pageIndex = 1
      if (this.judgeHasSearchParam()) this.isSearch = true
      // 搜索时，将搜索参数赋值给i-table的search参数
      this.table.search = Object.assign({}, this.searchParam)
      // 搜索时，重置pageIndex为1
      // this.allParam.pageIndex = 1
      // this.fetch(this.allParam)
    },

    /**
     * addPage：新增页面
     * @param vm(Object) 表格实例
     */
    @(beforeAdd)
    addPage (vm) {
      const selected = vm.getMultipleSelection()[0]
      this.openPage(this.cloneTitle + '新增', selected ? selected[this.idKey] : '')
    },

    /**
     * modifyRow：页面修改
     * @param scope {Object}: 表格行对象
     */
    @(beforeModify)
    modifyRow (scope) {
      this.openPage(this.cloneTitle + '修改', scope.row[this.idKey])
    },

    /** 打开新增修改页面 */
    openPage (title, id) {
      this[this.idKey] = id
      this.title = title
      this.openDetailDialog()
    },

    /** 行删除 */
    @(beforeDeleteRow)
    deleteRow (scope) {
      confirmPopover('warning', '确认删除该项吗？', () => {
        let option = {}
        let options = {}
        let selected = []
        let reqName = ''
        option[this.idKey] = scope.row[this.idKey]
        if (this.reqConfig.deleteName) {
          reqName = this.reqConfig.deleteName
          options = {...option, ...this.extraOption()}
        } else {
          reqName = this.reqConfig.deleteListName
          selected = [scope.row[this.idKey]]
        }
        this.reqConfig.req(reqName, this.reqConfig.deleteName ? {...options} : selected).then(res => {
          if (res) {
            showMessage('success', '删除成功！')
            this.resetAllParam(1)
            this.fetch(this.allParam)
          } else {
            showMessage('danger', '删除失败！')
          }
        })
      })
    },

    /** 多选删除 */
    @(beforeDelete)
    delete (selected) {
      confirmPopover('warning', '确认删除已选选项吗？', () => {
        this.reqConfig.req(this.reqConfig.deleteListName, selected).then(res => {
          if (res) {
            this.resetAllParam(selected.length)
            this.fetch(this.allParam)
            showMessage('success', '恭喜你！删除成功！')
          }
        })
      })
    },

    /** 重置搜索条件 */
    reset () {
      this.isSearch = false
      Object.keys(this.searchParam).map(key => {
        this.searchParam[key] = ''
      })
    },

    /** 删除时重置allParam，当是最后一页且删除条数等于剩余条数时将pageIndex减1 */
    resetAllParam (deleteNum = 1) {
      const pageInfo = this.table.info

      const leftPage = this.table.total % pageInfo.pageSize

      if (leftPage === deleteNum && this.judgeIsLastPage(pageInfo)) {
        this.allParam.pageIndex = pageInfo.pageIndex - 1 || 1
      }
    },

    /** 判断是否是最后一页 */
    judgeIsLastPage (pageInfo) {
      return (pageInfo.prev + 1) === pageInfo.last
    },

    /** 分页显示页数变化监听 */
    handleSizeChange (options) {
      this.fetch(Object.assign(this.table.info ? this.allParam : {}, options))
    },

    /** 当前页面数改变监听 */
    handleCurrentChange (options) {
      this.fetch(Object.assign(this.table.info ? this.allParam : {}, options))
    },

    /** 表格复选框改变监听 */
    selectionChangeHandler ({ selectionChangeHandler }, selection) {
      selectionChangeHandler(selection)
    },

    /** 分页页面新增与编辑确认事件 */
    handleSave (done) {
      return this.$refs.detailEdit.save().then(res => {
        if (res) {
          if (res === 'modifier') {
            this.fetch(this.allParam)
            // this.table.search = this.allParam
          } else {
            this.reset()
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
          }
          done()
        }
      })
    },

    /** 判断是否存在查询参数 */
    judgeHasSearchParam () {
      const search = this.searchParam
      for (let key in search) {
        if (search[key]) return true
      }
      return false
    },

    /**
     * cellClassName：表格列类名函数，页面中需要配置列类名时需配置cellClassConfigs
     * @param row
     * @param column
     * @param rowIndex
     * @param columnIndex
     * @returns {String}: 样式类名
     */
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      const configs = this.cellClassConfigs

      if (!configs || !configs.length) return

      for (let item of configs) {
        if (column.property === item.property) {
          const rule = item.rule
          if (!rule) {
            return row[item.property] === 'Y' ? 'blue' : 'red'
          }

          if (rule && (rule instanceof Function)) {
            return rule(row[item.property])
          } else {
            throw new Error('rule must be Function')
          }
        }
      }
    }
  }
}
