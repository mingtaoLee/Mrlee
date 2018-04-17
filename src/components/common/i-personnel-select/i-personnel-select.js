import {BaseClickFn} from './base-click'
import {SelectedClickFn} from './selected-click'
import { showMessage } from 'utils/index'
import ITree from 'components/common/i-tree/i-tree.vue'
import IDialog from 'components/common/i-dialog/i-dialog'
import axios from 'utils/fetch'
import { getDict, findDictLabel } from 'utils'
export default {
  name: 'personnelSelect',
  data () {
    return {
      defaultProps: window.globalComponentVariable.iPersonnelSelect.org.props,
      nodeKey: window.globalComponentVariable.iPersonnelSelect.org.nodeKey,
      searchName: '',
      leftSelectedItems: [],
      rightSelectedItems: [],
      isActive: false,
      leftItems: [],
      rightItems: [],
      // 默认展开节点
      defaultExpandedKeys: [],
      currentSelectedItem: null,
      personnelClickFn: Function,
      personnelClickObj: null,
      top: '20px',
      personnelProps: {
        name: 'employeeName',
        id: 'employeeId'
      },
      toolbar: [{
        text: '取消',
        type: 'default',
        func: (done) => {
          this.handleCancel()
          done()
        }
      }, {
        text: '重置',
        type: 'default',
        func: (done) => {
          this.resetData()
        }
      }, {
        text: '确定',
        type: 'primary',
        func: (done) => {
          this.handleConfirm()
          if (this.autoClose) {
            done()
          }
        }
      } ],
      // 保存常选人员的列表
      usualNameList: [],
      employeeDict: [],
      findDictLabel
    }
  },
  components: {
    ITree,
    IDialog
  },
  props: {
    // 是否有权限控制
    hasGrant: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '人员选择'
    },
    limit: Number,
    treeDataKey: {
      type: String,
      default: 'org'
    },
    modal: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    isShow: Boolean,
    defaultSelectedPersonnel: Array,
    maxNum: {
      type: Number,
      default: 100
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    filterType: String,
    showStatus: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    defaultSelectedPersonnel (value) {
      value && this.initSelected()
    }
  },
  computed: {
    isDialogShow: {
      get () {
        return this.isShow
      },
      set (value) {
        this.isShow = value
      }
    },
    fullName () {
      return this.currentSelectedItem ? this.currentSelectedItem.unitPathName + '_' + this.currentSelectedItem.positionName + '_' + this.currentSelectedItem.employeeName : ''
    }
  },
  created () {
    this.initData()
    this.personnelClickFn = this._toCache(this.createPersonnelClickClass)
    this.personnelClickObj = this.personnelClickFn('left')
    this.controlUsual().then(data => {
      this.usualNameList = data
    })
    if (this.defaultExpandedKeys.length > 0) {
      // this.searchPersonnel('', this.defaultExpandedKeys[0])
    }
    getDict('EMPLOYEE_STATUS').then(data => {
      this.employeeDict = data
    })
    // this.handleCalculateTop()
  },
  methods: {
    initData () {
      this.initTreeData()
      this.initSelected()
    },
    /** 初始化默认选择人员 */
    initSelected () {
      if (!this.defaultSelectedPersonnel) return
      let defaultSelected = JSON.parse(JSON.stringify(this.defaultSelectedPersonnel))
      if ((typeof defaultSelected[0]) === 'object' && !defaultSelected[0].hasOwnProperty('unitPathName')) {
        let employeeIds = []
        defaultSelected.map(ele => {
          if (!employeeIds.includes(ele.employeeId)) {
            employeeIds.push(ele.employeeId)
          }
        })
        this.searchPersonnelById(employeeIds).then(res => {
          this.rightItems = res
        })
      } else {
        this.rightItems = defaultSelected
      }
    },
    initTreeData () {
      this.defaultProps = window.globalComponentVariable.iPersonnelSelect[this.treeDataKey].props
      this.nodeKey = window.globalComponentVariable.iPersonnelSelect[this.treeDataKey].nodeKey
    },

    /** 数组织加载完事件监听 */
    handleTreeLoaded (nodes) {
      this.defaultExpandedKeys = [nodes[0][this.nodeKey]]
    },

    // 处理人员搜索事件
    handleSearchClick () {
      this.searchPersonnel(this.searchName)
    },

    // 查询人员
    searchPersonnel (searchName, orgId = '', maxNum = this.maxNum, type = this.filterType) {
      axios.get(window.globalComponentVariable.iPersonnelSelect.personnelUrl, {
        params: {
          employee: searchName,
          orgUnitId: orgId,
          maxNum: maxNum,
          type: type || null
        }
      }).then(res => {
        if (!res) return
        if (res.length === this.maxNum) {
          this.$message('当前部门人数较多，只显示前' + this.maxNum + '条')
        }
        this.leftItems = res
        this.leftSelectedItems = []
      }).catch(err => {
        this._showError(err)
      })
    },

    // 根据id查询人员
    searchPersonnelById (employeeIds) {
      return new Promise((resolve, reject) => {
        axios.post(window.globalComponentVariable.iPersonnelSelect.personnelByIdUrl,
          {
            employeeIds,
            type: this.filterType
          }
        ).then(res => {
          resolve(res)
        }).catch(err => {
          this._showError(err)
        })
      })
    },

    // 处理节点点击事件
    handleNodeClick (data, node, instance) {
      this.searchPersonnel('', node.data[this.nodeKey])
      // this._setActiveNodeColor(instance.$el.children[0], this.oldActiveNode)
    },

    // 计算弹窗距离顶部高度
    handleCalculateTop () {
      const clientHeight = document.documentElement.clientHeight
      const top = parseInt(((clientHeight - 590) / clientHeight / 2) * 100)
      this.top = top > 0 ? top + '%' : this.top
    },

    // 重置数据
    resetData () {
      this.searchName = ''
      this.leftItems = []
      this.leftSelectedItems = []
      this.rightSelectedItems = []
      this.rightItems = []
      this.currentSelectedItem = null
      // 树形图及人员重置
      if (this.defaultExpandedKeys.length > 0) {
        this.$nextTick(() => {
          this.$refs.departmentTree.$children[0].setCurrentKey(this.defaultExpandedKeys[0])
          this.searchPersonnel('', this.defaultExpandedKeys[0])
        })
      }
    },

    // 处理取消事件
    handleCancel () {
      this.$emit('cancel')
      this._handleDialogClose()
    },

    // 处理确认事件
    handleConfirm () {
      if (this.isOverLimit(this.rightItems)) {
        showMessage('warning', `最大选中人数为${this.limit}人，请重新选择！`)
      } else {
        this._handleDialogClose()
        this.controlUsual(this.rightItems)
        this.controlUsual().then(data => {
          this.usualNameList = data
        })
        this.$emit('confirm', this.rightItems)
      }
    },

    // 是否超过最大显示人数
    isOverLimit (selected) {
      if (!this.limit) return false
      return (selected.length > this.limit)
    },

    // 设置节点字体颜色
    _setActiveNodeColor (currentNode, oldNode) {
      if (oldNode) oldNode.style.color = 'black'
      currentNode.style.color = '#1894E1'
      this.oldActiveNode = currentNode
    },

    // 弹框关闭前触发事件
    beforeClose (done) {
      this.$emit('update:isShow', false)
      done()
    },

    // 处理弹窗关闭
    _handleDialogClose () {
      this.isDialogShow = false
      this.$emit('update:isShow', false)
    },

    // 错误信息提示
    _showError (err) {
      console.warn('数据加载错误：' + err.message)
    },

    // 初始化personnelClick对象
    createPersonnelClickClass (status) {
      switch (status) {
        case 'left':
          return new BaseClickFn(this)
        default:
          return new SelectedClickFn(this)
      }
    },

    // 处理列表人员点击事件
    handleItemClick (event, item, status, choose) {
      // 造出实例//
      this.personnelClickObj = this.personnelClickFn(status)
      if (event.ctrlKey) {
        // ctrl键单击事件处理
        this.personnelClickObj.handleItemCtrlClick(item)
      } else if (event.detail === 2) {
        // 双击事件处理
        this.personnelClickObj.handleItemDoubleClick(item)
      } else {
        // 单击事件处理
        this.personnelClickObj.handleItemClick(item)
      }
      if (choose) {
        this.handleItems('add')
      }
    },

    // 处理添加删除事件
    handleItems (status) {
      this.personnelClickObj.handleItems(status)
    },

    // 处理全部添加删除事件
    handleAllItems (status) {
      this.personnelClickObj.handleAllItems(status)
    },

    // 处理上移下移事件
    handleItemMove (direct) {
      this.personnelClickObj.handleItemMove(direct)
    },

    // 缓存函数
    _toCache (fn) {
      let cache = {}
      return function () {
        let key = arguments.length + Array.from(arguments).join(',')
        if (cache[key]) return cache[key]
        cache[key] = fn.apply(this, arguments)
        return cache[key]
      }
    },

    // 缓存和读取常选人员
    controlUsual (items) {
      if (items && !(items instanceof Array)) return
      if (items) {
        let nameList = localStorage.getItem('usualPeopleChosen')
          ? (JSON.parse(localStorage.getItem('usualPeopleChosen'))[this.filterType || 'all'] || [])
          : []
        let joinNames = []
        items.map(ele => {
          let count = 0
          nameList.forEach(el => {
            if (el.employeeId !== ele.employeeId) {
              count++
            } else {
              el.times ++
            }
          })
          if (count === nameList.length) {
            ele.times = 0
            joinNames.push(ele)
          }
        })
        joinNames = joinNames.concat(nameList)
        joinNames.sort((a, b) => {
          return b.times - a.times
        })
        joinNames = joinNames.slice(0, 10)
        let inputItem = JSON.parse(localStorage.getItem('usualPeopleChosen')) || {}
        inputItem[this.filterType || 'all'] = joinNames
        localStorage.setItem('usualPeopleChosen', JSON.stringify(inputItem))
        return
      }
      let itemsGetting = localStorage.getItem('usualPeopleChosen')
      ? (JSON.parse(localStorage.getItem('usualPeopleChosen'))[this.filterType || 'all'] || [])
        : []
      let ids = []
      itemsGetting.map(ele => {
        if (!ids.includes(ele.employeeId)) {
          ids.push(ele.employeeId)
        }
      })
      return new Promise((resolve) => {
        this.searchPersonnelById(ids).then(data => {
          resolve(data)
        })
      })
    }
  }
}
