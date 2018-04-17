<template>
  <el-select 
    v-model="key"
    @visible-change="handleOption"
    @change="selectOption"
    clearable
  >
    <el-option 
      v-for="(item, ids) of options" 
      :key="ids"
      :label="item.label"
      :value="item.value"
      :class="{
        'selected': key === item.label,
        'hover': key === item.label
      }"
    ></el-option>
  </el-select>
</template>

<script>
    import req from 'api/iaf/index'
    export default {
      name: 'IafSelect',
      data () {
        return {
          visible: true,
          key: '',
          text: ''
        }
      },
      props: {
        // 变化传入的数据，用于显示
        options: {
          type: Array,
          default () {
            return []
          }
        },
        // 字典
        dict: String,
        // 基础数据：用于传入值找对应显示值
        baseOptions: {
          type: Array,
          default () {
            return []
          }
        },
        // 额外数据 || 任意类型 || 触发事件时将额外数据作为最后一个参数传出去,解决如当前行数据不好拿
        extraParameter: null,
        value: String
      },
      watch: {
        value (newVal) {
          this.key = this.getkey(this.baseOptions, newVal)
        }
      },
      created () {
        this.init()
      },
      methods: {
        init () {
          if (this.dict && !this.baseOptions.length) this.getDictData(this.dict)
          this.key = this.getkey(this.baseOptions, this.value)
        },
        // 获取key值, 取label值
        getkey (baseOptions, value) {
          if (!value || !baseOptions.length) return ''
          for (let item of baseOptions) {
            if (item.value === value) return item.label
          }
        },
        // 选项下拉时触发
        handleOption (visible) {
          this.visible = visible
          this.$emit('visible-change', visible, this.extraParameter)
        },
        // 获取字典值,先取sessionStorage里的值, 没有再请求字典
        getDictData (dict) {
          const dictName = `/public-access/dicts/${dict}/items`
          const dictSession = JSON.parse(sessionStorage.getItem(dictName))
          if (dictSession && dictSession.length) return (this.baseOptions = dictSession)
          req('getDictData', {dict}).then(res => {
            this.baseOptions = res
          })
        },
        // 选择选项后,将value值转为label值
        selectOption (value) {
          this.text = value
          this.$emit('change', value, this.extraParameter)
          this.$emit('input', value)
          this.key = value ? this.getkey(this.baseOptions, value) : ''
        }
      }
    }
</script>
<style lang="scss" scoped>
  .selected{
    color: #3da5fe;
    font-weight: 700;
  }
  .hover{
    background-color: #f5f7fa
  }
</style>