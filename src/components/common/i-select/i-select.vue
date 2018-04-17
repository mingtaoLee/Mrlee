<template>
  <el-tooltip
    ref="tooltip"
    :disabled="multiple || !key || !isOverflow"
    :content="getToolTip()"
    effect="dark"
    placement="top"
  >
    <el-select
      class="i-select"
      ref="iSelect"
      v-model="key"
      :filterable="filterable"
      :clearable="clearable"
      :placeholder="controlPlaceholder"
      :disabled="disabled"
      :size="size"
      :multiple="multiple"
      :collapse-tags="collapseTags"
      :allow-create="allowCreate"
      @clear="clear"
      @change="handleChange"
      @mouseenter.native="handleMouseEnter"
    >
      <!-- <el-option v-if="async && !clearable" value="" label="- - 请选择 - -"></el-option> -->
      <el-option
        v-for="item in list"
        v-show="!item.hide"
        :key="item[props.value]"
        :label="item[props.label]"
        :value="item[props.value]"
        :disabled="item.disabled"
        @click.native="handleOptionClick(item)"
      >
      </el-option>
    </el-select>
  </el-tooltip>
</template>
<script>
  import { getSelectData } from 'utils/index.js'
  export default {
    /**
     * @component i-select: 需要从后台拉取数据显示的下拉选择器组件
     * @prop {String} dataKey: 下拉数据类型，默认为'dict'
     * @prop {String} parameter: 数据地址参数
     * @prop {String} placeholder: 提示语句
     * @prop {String} value
     */
    name: 'i-select',
    data: function () {
      return {
        isOverflow: false,
        list: this.options,
        key: this.value
      }
    },
    props: {
      props: {
        type: Object,
        default () {
          return {
            label: 'label',
            value: 'value'
          }
        }
      },
      size: {
        type: String,
        default: 'mini'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      collapseTags: {
        type: Boolean,
        default: true
      },
      async: {
        type: Boolean,
        default: true
      },
      options: Array,
      filterable: {
        type: Boolean,
        default: true
      },
      dataKey: {
        type: String,
        default: 'dict'
      },
      parameter: String,
      placeholder: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      clearable: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      hideKeys: {
        type: Array,
        default () {
          return []
        }
      },
      allowCreate: {
        type: Boolean,
        default: false
      },
      // 自动显示第一项
      autoShow: Boolean
    },
    computed: {
      controlPlaceholder () {
        return this.placeholder || (this.disabled ? '' : '请选择')
      }
    },
    watch: {
      value (value) {
        this.key = value
      },
      options (value) {
        this.list = value
      },
      parameter (value) {
        value && this.init()
      },
      hideKeys (value) {
        value.length && this.handleOptionHide(value)
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        let url = this.handleUrl()
        const isCache = this.getIsCache()
        this.async && this.getData(url, isCache)
      },
      getIsCache () {
        return window.globalComponentVariable.iSelect[this.dataKey].isCache
      },
      handleUrl () {
        return window.globalComponentVariable.iSelect[this.dataKey].url(this.parameter)
      },
      getData (url, isCache) {
        getSelectData(url, isCache).then((data) => {
          this.list = data
          this.autoShow && (this.key = data[0][this.props.value])
          this.hideKeys.length && this.handleOptionHide(this.hideKeys)
        })
      },
      handleOptionClick (option) {
        this.$emit('option-click', option)
      },
      handleChange (value) {
        this.$emit('input', value)
        this.$emit('change', value)
      },
      setDisabled (value, isDisabled) {
        for (let item of this.list) {
          if (item.value === value) {
            item.disabled = isDisabled
            break
          }
        }
      },
      setHideOption (value, isHide) {
        for (let item of this.list) {
          if (item.value === value) {
            item.hide = isHide
            break
          }
        }
      },
      handleOptionHide (keys) {
        if (!this.list || !this.list.length) return
        for (let item of this.list) {
          if (keys.includes(item[this.props.value])) {
            item.hide = true
          }
        }
      },
      clear () {
        this.isOverflow && this.closeTooltip()
        this.$emit('clear')
      },
      getToolTip () {
        if (this.key && Array.isArray(this.list) && this.list.length) {
          const item = JSON.parse(JSON.stringify(this.list)).filter(item => item[this.props.value] === this.key)[0]
          return item ? item[this.props.label] : ''
        }
      },
      /** 彻底关闭tooltip */
      closeTooltip () {
        const tooltip = this.$refs.tooltip
        tooltip && tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
      },
      handleMouseEnter () {
        const input = this.$refs.iSelect.$el.querySelector('.el-input__inner')
        this.isOverflow = input.scrollWidth > input.offsetWidth
      }
    }
  }
</script>
<style lang="scss">
  .i-select {
    .el-input__inner {
      text-overflow: ellipsis;
    }
  }
</style>
