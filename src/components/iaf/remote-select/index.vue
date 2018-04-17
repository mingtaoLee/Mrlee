<template>
  <el-select
    ref="remoteSelect"
    v-model="selected"
    filterable
    remote
    :disabled="disabled"
    :clearable="clearable"
    reserve-keyword
    placeholder="请输入人事范围"
    :remote-method="remoteMethod"
    @change="handleChange"
    @focus="handleFocus"
    :loading="loading">
    <el-option
      v-for="(item, index) of options"
      :key="index"
      @click.native="handleOptionClick(item)"
      :label="item[props.label]"
      :value="item[props.value]">
    </el-option>
  </el-select>
</template>
<script>
  let timer = null
  export default {
    name: 'remoteSelect',
    props: {
      defaultOptions: Array,
      disabled: Boolean,
      clearable: {
        type: Boolean,
        default: true
      },
      apiConfig: Object,
      value: String,
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
      extraParams: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    components: {},
    watch: {
      value (value) {
        this.selected = value
      },
      defaultOptions (value) {
        value && (this.options = value)
      }
    },
    data: function () {
      return {
        loading: false,
        options: [],
        selected: this.value
      }
    },
    created () {
      this.options = this.defaultOptions || []
    },
    methods: {
      handleChange (value) {
        this.$emit('input', value)
      },
      handleOptionClick (item) {
        this.$emit('option-click', item)
      },
      handleFocus () {
        if (!this.selected) {
          this.fetchOptions('')
          this.$refs.remoteSelect.visible = true
        }
      },
      remoteMethod (keyword) {
        if (keyword !== '') {
          clearTimeout(timer)
          timer = setTimeout(() => {
            this.fetchOptions(keyword)
          }, 500)
        } else {
          this.options = []
        }
      },
      fetchOptions (keyword) {
        this.loading = true
        const options = {}
        options[this.searchKey] = keyword
        this.apiConfig.req(this.apiConfig.name, Object.assign(options, this.extraParams))
        .then(res => {
          this.options = res || []
          this.loading = false
        })
      }
    }
  }
</script>
<style lang="sass"></style>
