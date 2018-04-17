<template>
  <el-tooltip
    ref="tooltip"
    :disabled="multiple || !selected || !isOverflow"
    :content="getToolTip()"
    effect="dark"
    placement="top"
  >
    <el-select
      ref="remoteSelect"
      class="remote-select"
      v-model="selected"
      :multiple="multiple"
      :collapse-tags="collapseTags"
      :loading="loading"
      :disabled="disabled"
      :clearable="clearable"
      :placeholder="placeholder"
      :remote-method="remoteMethod"
      remote
      reserve-keyword
      filterable
      @change="handleChange"
      @focus="handleFocus"
      @clear="handleClear"
      @mouseenter.native="handleMouseEnter"
    >
      <el-option
        v-for="(item, index) in options"
        :key="index"
        @click.native="handleOptionClick(item)"
        :label="getLabel(item)"
        :value="item[props.value]">
      </el-option>
    </el-select>
  </el-tooltip>
</template>
<script>
  import axios from 'utils/fetch'
  let timer = null
  export default {
    name: 'RemoteSelect',
    props: {
      placeholder: {
        type: String,
        default: '请输入关键词'
      },
      // 组件分类名称
      dataKey: String,
      defaultOptions: Array,
      disabled: Boolean,
      clearable: {
        type: Boolean,
        default: true
      },
      apiConfig: Object,
      value: [String, Array],
      keyword: String,
      props: {
        type: Object,
        default () {
          return {
            label: 'label',
            value: 'value'
          }
        }
      },
      searchKey: {
        type: String,
        default: 'keyword'
      },
      // 是否多选
      multiple: {
        type: Boolean,
        default: false
      },
      // 多选时是否只显示一个标签
      collapseTags: {
        type: Boolean,
        default: true
      },
      displayKeys: Array,
      extraParams: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    watch: {
      value (value) {
        this.selected = value
        this.setCachedOptions()
        this.setSelected()
      },
      defaultOptions (value) {
        if (value) {
          this.options = value
          this.setSelected()
        }
      }
    },
    data: function () {
      return {
        cachedOptions: [],
        loading: false,
        isOverflow: false,
        options: [],
        selected: this.value,
        searchUrl: window.globalComponentVariable.remoteSelect[this.dataKey].searchUrl,
        searchParam: window.globalComponentVariable.remoteSelect[this.dataKey].searchParams
      }
    },
    created () {
      this.options = this.defaultOptions || []
    },
    methods: {
      handleChange (value) {
        this.$emit('input', value)
        this.$emit('change', value)
      },
      handleOptionClick (item) {
        this.$emit('option-click', item)
      },
      handleFocus () {
        if (this.multiple) {
          if (Array.isArray(this.selected)) {
            if (!this.selected.length) {
              this.getFocusOptions()
            }
          } else {
            throw new Error('多选时，绑定的变量类型必须为数组！')
          }
        } else {
          if (!this.selected) {
            this.getFocusOptions()
          }
        }
      },
      handleClear () {
        this.closeTooltip()
      },
      getFocusOptions () {
        this.fetchOptions('').then(res => {
          if (res) {
            this.$refs.remoteSelect.visible = true
          }
        })
      },
      remoteMethod (keyword) {
        clearTimeout(timer)
        if (!keyword) return
        timer = setTimeout(() => {
          this.fetchOptions(keyword)
        }, 500)
      },
      getToolTip () {
        if (this.selected && Array.isArray(this.options) && this.options.length) {
          const item = JSON.parse(JSON.stringify(this.options)).filter(item => item[this.props.value] === this.selected)[0]
          return item ? this.getLabel(item) : ''
        }
      },
      getLabel (item) {
        if (!this.displayKeys) {
          return item[this.props.label]
        } else {
          if (Array.isArray(this.displayKeys)) {
            let label = ''
            this.displayKeys.map(key => {
              label = label + item[key] + '_'
            })
            return label.slice(0, -1)
          } else {
            throw new Error('the props displayKeys must be Array')
          }
        }
      },
      fetchOptions (keyword) {
        this.loading = true
        const params = this.searchParam(keyword)
        return new Promise(resolve => {
          axios.get(this.searchUrl, { params: Object.assign(params, this.extraParams) }).then(res => {
            if (this.multiple && res.length) {
              res = res.filter(item => {
                return !this.value.includes(item[this.props.value])
              })
              this.options = [...this.cachedOptions, ...res]
            } else {
              this.options = res || []
            }
            this.loading = false
            resolve(true)
          })
        })
      },
      /** 重新设置已选值(防止el-select内部提前设置出现无效状态) */
      setSelected () {
        Promise.resolve().then(() => {
          this.$refs.remoteSelect.setSelected()
        })
      },
      /** 设置缓存数据 */
      setCachedOptions () {
        if (this.multiple) {
          this.cachedOptions = this.options.filter(item => {
            return this.value.includes(item[this.props.value])
          })
        }
      },
      /** 彻底关闭tooltip */
      closeTooltip () {
        const tooltip = this.$refs.tooltip
        tooltip && tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
      },
      handleMouseEnter () {
        const input = this.$refs.remoteSelect.$el.querySelector('.el-input__inner')
        this.isOverflow = input.scrollWidth > input.offsetWidth
      }
    }
  }
</script>
<style lang="scss">
  .remote-select {
    .el-input__inner {
      text-overflow: ellipsis;
    }
  }
</style>
