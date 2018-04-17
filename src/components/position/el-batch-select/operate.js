/**
 * el-batch-select 数据操作
 * @author yyq 2017-12-15
 * @version 1.0
 * 虽然不知道有什么卵用，但是也确实好像没什么卵用
 */

import { clone } from 'utils/index'
export default {

  data () {
    return {
      originData: [],
      deleteData: [],
      cloneData: [],
      defaultDataOptions: clone(this.dataOptions)
    }
  },

  methods: {
    /**
     * 数据初始化，克隆副本
     */
    initData () {
      this.originData = clone(this.model)
      this.cloneData = clone(this.model)
      // 初始化给每条数据携带唯一id
      this.cloneData.map(item => {
        this.generateKey(item)
      })
    },

    /**
     * 映射数据，对数据本身的属性进行监听，非本身数据不做处理
     * @param [Object, Array] data
     * 暂未完成
     */
    initDataMap (data) {
      var that = this
      const listen = data => {
        let selfProperty = Object.keys(data).filter(item => this.defaultDataOptions.hasOwnProperty(item))
        selfProperty.forEach(key => {
          let value = data[key]
          Object.defineProperty(data, key, {
            set (newValue) {
              if (!newValue || newValue === value) {
                return
              }
              let obj = that.findDataFromArray(data)
              if (obj.value) {
                that.model[obj.index] && (that.model[obj.index][key] = newValue)
                value = newValue
                that.refresh(data, obj.index)
              } else {
                console.log('%c%s', 'color: red', '赋值失败！，model找不到')
              }
            },
            get () {
              return value
            }
          })
        })
      }
      listen(data)
    },

    /**
     * 更新视图
     * @param [Object] obj 改动的数据
     * obj = {value: xx, index: xx}
     */
    refresh (data, index) {
      if (!data) {
        return
      }
      let label = Array.from(this.$refs.item)[index].querySelector('.label')
      label.innerHTML = data[this.label]
    },

    /**
     * 保存副本数据，用于创建新数据
     */
    getNewData () {
      if (!this.defaultDataOptions) {
        console.log('Does\'t have data-options')
        return
      }
      return clone(this.defaultDataOptions)
    },

    /**
     * 添加已删除的数据
     * @param {*} deleteItem 删除的数据
     */
    refreshDeleteData (deleteItem) {
      this.deleteData.push(deleteItem)
    },

    /**
     * 添加新一条数据
     */
    add () {
      let data = this.getNewData()
      if (!data) {
        return
      }
      this.model.push(clone(data))
      this.generateKey(data)
      this.cloneData.push(data)
      this.initDataMap(data)
      this.$emit('change', data, this.model)
      console.log('%c%s', 'color: blue', '添加数据为：', data)
    },

    /**
     * 移除选择的数据  [批量删除] 功能暂不启用
     */
    removeItems () {
      let selectItems = this.getSelectItems()
      this.remove(selectItems)
    },

    /**
     * 移除选择的数据  [单项删除]
     * @param {*} e 需要移除的dom节点
     */
    removeItem (e) {
      let removeItem = e.currentTarget.parentNode
      let currentIndex
      this.$refs.item.forEach((item, index) => {
        if (removeItem === item) {
          currentIndex = index
        }
      })
      this.remove(currentIndex)
    },

    /**
     * 移除指定index的数据
     * @param [Array, Number] indexs 移除指定index的数据
     */
    remove (indexs) {
      // 移除数据，防止多次渲染
      let tempArr = clone(this.cloneData)
      let items = []
      const arrMode = () => {
        indexs.forEach((item, index) => {
          items.push(tempArr.splice(item - index, 1))
          this.model.splice(item - index, 1)
        })
        this.cloneData = tempArr
        items = this.formatReturnValue(items)
        this.$emit('change', items, this.model)
        console.log('%c%s', 'color: red', '移除数据为：', items)
      }
      const numberMode = () => {
        let item = this.cloneData.splice(indexs, 1)
        this.model.splice(indexs, 1)
        item = this.formatReturnValue(item)
        this.$emit('change', item, this.model)
        console.log('%c%s', 'color: red', '移除数据为：', item)
      }
      Array.isArray(indexs) ? arrMode() : numberMode()
    },

    /**
     * 给数据产生唯一的key
     * @param {*} data 要添加key的数据
     */
    generateKey (data) {
      (data.elSelectId = Date.parse(new Date()) + Math.floor(Math.random() * 100))
    },

    /**
     * 格式化传出的数据
     * [{}] ===> {}
     * @param [Array] data 需要格式化的数据
     */
    formatReturnValue (data) {
      if (data.length > 1 && Array.isArray(data[0])) {
        return data.map(item => item[0])
      } else {
        return data[0]
      }
    },

    /**
     * 从对象数组中找到对应数据
     */
    findDataFromArray (data) {
      let obj = {}
      this.cloneData.forEach((item, index) => {
        if (item === data) {
          obj.value = item
          obj.index = index
        }
      })
      return obj
    }
  },

  created () {
    this.initData()
    this.initDataMap(this.cloneData[0])
  },

  mounted () {
  }
}
