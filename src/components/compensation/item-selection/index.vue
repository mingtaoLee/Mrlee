<template>
  <el-row class="zzf-item-selection item-selection" :style="{minHeight: minHeight}">
    <div class="search-bar">
      <el-input
        v-model="keyword"
        size="medium"
        :validate-event="false"
        :autofocus="true"
        placeholder="请输入搜索条件"
        @input="handleSearchChange"
      >
        <el-button slot="prepend" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-col class="section" :span="12">
      <title class="title">
        <h2>{{listTitle}}</h2>
        <el-checkbox v-if="multiple" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
      </title>
      <ul class="item-list" :style="{ height: optionHeight }">
        <el-checkbox-group v-if="multiple" class="check-group" v-model="selected" @change="handleCheckedChange">
          <template v-for="(item, index) of itemList">
            <li class="item flex-space-between" @click="handleOptionClick(item, index)">
              <span class="single-text-overflow">{{item.componentName}}</span>
              <el-checkbox :label="item" :key="item.componentName"></el-checkbox>
            </li>
          </template>
        </el-checkbox-group>
        <el-radio-group class="check-group" v-else v-model="selected" @change="handleRadioChange">
          <template v-for="(item, index) of itemList">
            <li class="item flex-space-between" @click="handleOptionClick(item, index)">
              <span class="single-text-overflow">{{item.componentName}}</span>
              <el-radio :label="item" :key="item.componentName"></el-radio>
            </li>
          </template>
        </el-radio-group>
      </ul>
    </el-col>
    <el-col class="section" :span="12">
      <h2 class="title">{{selectedTitle}}</h2>
      <ul class="item-list" :style="{height: optionHeight}">
        <template v-if="multiple">
          <li class="item flex-space-between" v-for="(item, index) of selected">
            <span class="single-text-overflow">{{item.componentName}}</span>
            <i class="el-icon-circle-close icon" @click="handleDelete(index)"></i>
          </li>
        </template>
        <li v-else class="item flex-space-between">
          <span class="single-text-overflow">{{selected.componentName}}</span>
          <i v-if="selected.componentName" class="el-icon-circle-close icon" @click="handleDelete()"></i></li>
      </ul>
    </el-col>
  </el-row>
</template>
<script>
  import axios from 'utils/fetch'
  export default {
    name: 'ItemSelection',
    props: {
      // 默认选中值
      value: '',
      multiple: {
        type: Boolean,
        default: true
      },
      filterIds: {
        type: Array,
        default () {
          return []
        }
      },
      dataKey: String,
      load: Function,
      selectedTitle: String,
      listTitle: String,
      optionHeight: {
        type: String,
        default: '350px'
      },
      props: {
        type: Object,
        default () {
          return {
            value: 'componentName',
            label: 'componentName'
          }
        }
      }
    },
    watch: {
      filterIds (value) {
        this.filterItems(value)
      },
      selected (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.itemList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.itemList.length
      },
      value (value) {
        if (value) this.initSelected()
      }
    },
    data: function () {
      return {
        keyword: '',
        isIndeterminate: false,
        checkAll: false,
        selected: this.multiple ? [] : {},
        itemList: [],
        cacheList: [],
        searchUrl: this.dataKey ? window.globalComponentVariable.remoteSelect[this.dataKey].searchUrl : '',
        searchParam: this.dataKey ? window.globalComponentVariable.remoteSelect[this.dataKey].searchParams : ''
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.dataKey ? this.getOptions() : this.doLoad()
      },
      getOptions () {
        // TODO 需等确定时配置正式的optionSelection配置选项
        axios.get(this.searchUrl, {
          params: this.searchParam('')
        }).then(res => {
          const data = res
          if (!Array.isArray(data)) throw new Error('the data for callback must be array!')
          this.itemList = data
          this.cacheList = JSON.parse(JSON.stringify(data))
          this.filterIds && this.filterItems(this.filterIds)
          this.value && this.initSelected()
        })
      },
      doLoad () {
        // 获取项目列表
        this.load(data => {
          this.itemList = data
          this.cacheList = JSON.parse(JSON.stringify(data))
          this.filterIds && this.filterItems(this.filterIds)
          this.value && this.initSelected(data)
          // this.handleRadioChange(value)
        })
      },
      /** 初始化选项 */
      initSelected () {
        const selectedValues = this.value.split(',')
        const props = this.props
        const selected = this.itemList.filter(item => {
          return selectedValues.includes(item[props.value])
        })
        this.selected = this.multiple ? selected : selected[0]
      },
      handleSearchChange (keyword) {
        // const params = this.searchParam(keyword)
        // axios.get(this.searchUrl, { params: params }).then(res => {
        //   this.itemList = res || []
        // })
        this.itemList = this.cacheList.filter(item => {
          return item[this.props.label].includes(keyword)
        })
      },
      filterItems (filterIds) {
        this.itemList = this.cacheList.filter(item => {
          return !filterIds.includes(item[this.props.value])
        })
      },
      handleCheckAllChange (checked) {
        this.selected = checked ? [...this.itemList] : []
        this.isIndeterminate = false
      },
      handleCheckedChange (value) {
        this.selected = value
      },
      handleRadioChange (value) {
        this.selected = value
      },
      writeBack () {
        return this.selected
      },
      checkedItem (value) {
        let len = this.itemList.length
        let item
        if (len !== 0) {
          while (len--) {
            item = this.itemList[len]
            if (value.componentId === item.componentId) {
              this.selected = item
            }
          }
        }
      },
      reset () {
        this.isIndeterminate = false
        this.checkAll = false
        this.selected = this.multiple ? [] : {}
        this.keyword = ''
      },
      /** 已选选项双击事件 */
      handleDelete (index) {
        if (this.multiple) {
          this.selected.splice(index, 1)
        } else {
          this.selected = {}
        }
      },
      /** 选项点击事件 */
      handleOptionClick (item, index) {
        if (this.multiple) {
          if (this.selected.includes(item)) {
            this.selected.splice(this.selected.findIndex(theItem => {
              return theItem[this.props.value] === item[this.props.value]
            }), 1)
          } else {
            this.selected.push(item)
          }
        } else {
          this.selected = item
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

  $border: 1px solid #e8e8e8;
  $padding: 0 20px;
  %title-line-height {
    height: 40px;
    line-height: 40px;
  }

  .search-bar {
    margin-bottom: 10px;
  }

  .flex-space-between {
    display: flex;
    justify-content: space-between;
  }

  .item-selection {
  }

  .section {
    border: $border;
    &:first-child {
      border-right: none;
    }
  }

  .check-group {
    display: block;
  }

  .title {
    padding: $padding;
    background: #f2f2f2;
    border-bottom: 1px solid #e8e8e8;
    @extend %title-line-height;
    @extend .flex-space-between
  }

  .item {
    padding: $padding;
    line-height: 30px;
    transition: 0.1s;
    cursor: pointer;
    &:hover {
      background-color: #f5f7fa;
      .icon {
        margin-right: -2px;
        font-size: 18px;
        color: red;
      }
    }
  }
  .active-item {
    background-color: #f1f3f6;
  }

  .item-list {
    overflow: auto;
  }

  h2 {
    font-size: 14px;
    font-weight: bold;
    @extend %title-line-height;
  }
</style>
<style lang="scss">
  .zzf-item-selection {

    .el-checkbox__label {
      display: none;
    }

    .el-radio__input {
      padding-top: 7px;
    }

    .el-radio__label {
      display: none;
    }

    .el-radio__inner {
      width: 16px;
      height: 16px;
    }

    .el-radio-group {
      font-size: 14px;
    }

    .el-checkbox-group {
      margin: 0;
      font-size: 14px;
    }

    .el-input__inner {
      height: 34px;
    }

    .icon {
      line-height: 30px;
    }
  }
</style>
