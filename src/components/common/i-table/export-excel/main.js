import { BASE_URL } from '@/config/api'
import { createTokenInput } from 'utils/auth'
const PREFIX = 'sahara_table_export_'
const MAPPING_PREFIX = 'sahara_'
import fetch from 'utils/fetch'
import qs from 'qs'

export default {
  dev: false,           // 调试模式
  isMultiple: false,    // 判断当前是否为多级表头
  isSelect: false,      // 判断当前是否为“选中数据”导出
  display: {},          // 存储 mapping 映射

  /**
   * 解析表格集合
   * @param {Object} param0 表格集合
   */
  parseTable ({ iTable: i, elTable: e = {} }) {
    const {
      pageIndex,
      pageSize,
      display,
      multipleSelection,
      table: {
        search = {},
        multiple = false
        // showPagebar = false
      }
    } = i

    // TODO:
    // const pageInfo = showPagebar
    //   ? { pageIndex, pageSize }
    //   : {}

    const pageInfo = { pageIndex, pageSize }

    this.display = display
    this.isMultiple = multiple

    this._filterSearch(search)
    let columns = this._getColumns(e)

    // 在非选中导出时，若为多级表头，则递归地移除子元素的前缀名，保障前后端数据能正常匹配
    if (!this.isSelect && this.isMultiple) {
      columns = this._unFlattenColumnsProperty(columns)
      this.dev && console.log(columns)
    }

    return {
      ...pageInfo,
      ...search,
      selection: JSON.stringify(multipleSelection),
      [PREFIX + 'column_metas']: JSON.stringify(columns)
    }
  },

  /**
   * 编辑配置信息
   * @param {Object} param0 配置
   */
  editConfig ({ fileName, version = 'xlsx', range = 'page', sync = true } = {}) {
    fileName || (fileName = Date.now())

    this.isSelect = range === 'select'

    return {
      fileName, version, range, sync
    }
  },

  /**
   * 移除子集 property 前缀
   * @param {Array} columns 表头
   * @param {String} parentProperty 父级的 property
   */
  _unFlattenColumnsProperty (columns, parentProperty = '') {
    return columns.map(col => {
      const reg = new RegExp(`(${parentProperty}--)`)
      const selfProperty = col.property
        ? col.property.replace(reg, '')
        : ''

      const ret = {
        ...col,
        property: selfProperty
      }

      if (col.children) {
        ret.children = this._unFlattenColumnsProperty(col.children, col.property)
      }

      return ret
    })
  },

  /**
   * 过滤查询参数，将值为 null 的数据转为 ''
   * @param {Object|Null} search 查询参数
   */
  _filterSearch (search) {
    if (!search) {
      return
    }

    Object.keys(search).map(key => {
      if (search[key] === null) {
        search[key] = ''
      }
    })
  },

  _filterColumns (columns) {
    return columns.filter(
      col => col.property || col.children
    )
  },

  /**
   * 依据 multiple 字段，获取 el 表格的 columns 列集合
   * @param {Object} param0 elTable 实例对象
   */
  _getColumns ({ columns = [], store: { states } }) {
    return this.isMultiple
      ? this._packMultipleColumns(states._columns)
      : this._columnsMap(columns)
  },

  /**
   * 递归获取、过滤多级表格的 columns
   * @param {Array} columns elTable 列集合
   */
  _packMultipleColumns (columns) {
    return this._columnsMap(columns).reduce((list, col) => {
      return list.concat(col.children
        ? Object.assign(col, {
          children: this._packMultipleColumns(
            col.children
          )
        })
        : col
      )
    }, [])
  },

  /**
   * 表格数据映射，转译为后端约定的形式
   * @param {Array} columns elTable 列集合
   */
  _columnsMap (columns) {
    return this._filterColumns(columns).map(col => {
      const ret = {
        ...this._siftColumns(col)
      }

      if (col.formatter) {
        ret.mapping = this._getMapping(col)
      }

      return ret
    })
  },

  /**
   * 解析请求参数信息
   * @param {Object} param0 请求参数对象
   */
  parseReq ({ req: { url = '', method }, param, conditions }) {
    if (typeof param === 'function') {
      const paramConfig = param()

      url = url.replace(/\{([\d\w_]+)\}/g, (str, $1) => paramConfig[$1])
    }

    const c = typeof conditions === 'function' ? conditions() : {}

    return {
      url, method, conditions: c
    }
  },

  /**
   * 发送导出表格的数据
   * @param {Object} param0 用于发送请求的数据集合
   */
  sendTable ({ url = '', method = 'get', conditions = null, tableInfo = {}, config = {} }) {
    config.range === 'all' && (tableInfo.pageSize = -1)

    if (this.isSelect) {
      url = '/common/exports'
      method = 'post'
      // 若无选中数据，拦截
      if (tableInfo.selection === '[]') {
        return false
      }
    } else {
      tableInfo.selection = '[]'
    }

    let taskId = ''
    if (!config.sync) {
      taskId = config.sahara_table_export_file_id
      delete config.sahara_table_export_file_id
    }

    let reqData = {
      [PREFIX + 'flag']: this.isMultiple ? 'multiple' : 'single',
      [PREFIX + 'config']: JSON.stringify(config),
      ...tableInfo
    }

    if (conditions) {
      Object.keys(conditions).map(key => (conditions[key] = JSON.stringify(conditions[key])))
      reqData = Object.assign(reqData, conditions)
    }
    if (taskId) {
      reqData.sahara_table_export_file_id = taskId
      return this.asyncSubmit(url, method, reqData)
    }
    const formConfig = {
      action: BASE_URL + url,
      method,
      type: 'hidden'
    }

    this.dev && console.log(reqData, formConfig)

    return this._submit({ reqData, formConfig })
  },

  /**
   * 过滤 columns 中的多余属性
   * @param {Array} column elTable 列集合
   */
  _siftColumns (column) {
    const ret = {
      label: column.label || '',
      property: column.property || '',
      align: column.align || 'is-left',
      width: column.width || column.realWidth,
      level: column.level
    }

    if (column.children) {
      ret.children = column.children
    }

    return ret
  },

  /**
   * 构建 DOM 并发送 submit 请求
   * @param {Object} param0 请求参数
   */
  _submit ({ formConfig, reqData }) {
    const form = document.createElement('form')

    Object.entries(formConfig).map(
      ([key, val]) => form.setAttribute(key, val)
    )

    Object.entries(reqData).map(
      ([key, val]) => {
        const input = document.createElement('input')

        input.setAttribute('name', key)
        input.setAttribute('value', val)
        form.appendChild(input)
      }
    )

    // 永辉生产环境上可能会过滤cookie, 所以需要用这种方式传递Token
    form.appendChild(createTokenInput())

    document.body.appendChild(form)

    this.dev || form.submit()
    form.remove()

    return true
  },

  asyncSubmit (url, method, reqData) {
    let config = {
      url,
      method,
      headers: { 'Content-Type': 'multipart/form-data' },
      paramsSerializer: function (params) {
        return qs.stringify(params, {arrayFormat: 'brackets'})
      }
    }
    if (method === 'get') {
      Object.assign(config, {
        params: reqData
      })
    } else {
      let formData = new FormData()
      for (let key in reqData) {
        formData.append(key, reqData[key])
      }
      Object.assign(config, {
        data: formData
      })
    }
    fetch(config)
    return true
  },

  /**
   * 挂载用于字典、数据、时间、货币转换的属性
   * @param {Object} param0 列对象
   * @param {Object} param1 数据转换映射集合
   */
  _getMapping ({ property }) {
    const { dictList, dateList } = this.display

    if (dictList[property]) {
      return dictList[property]
    }

    if (dateList[property]) {
      return {
        [MAPPING_PREFIX + 'date']: dateList[property]
      }
    }

    return null
  }
}
