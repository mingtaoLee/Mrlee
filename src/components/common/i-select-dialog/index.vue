<template>
  <div>
    <el-input v-model="selected" @click.native="openSelector" readonly></el-input>
    <i-dialog v-model="isShowDialog" :toolbar="toolbar">
      <item-selection
        ref="component"
        :props="props"
        :value="value"
        :multiple="multiple"
        :dataKey="dataKey"
        :listTitle="listTitle"
        :selectedTitle="selectedTitle"
      ></item-selection>
    </i-dialog>
  </div>
</template>
<script>
  import { MultipleSelector } from './multipleSelector'
  import { BasicSelector } from './basicSelector'
  import ItemSelection from '../../compensation/item-selection/index'

  export default {
    components: { ItemSelection },
    name: 'i-select-dialog',
    props: {
      // 数据类型
      dataKey: String,
      // 输入框绑定值
      value: String,
      // 数据配置项
      props: {
        // 选中值字段配置
        value: 'value',
        // 显示值字段配置
        label: 'label',
        // 禁用项配置
        disabled (item) {
          return item.disabled
        },
        // 显示隐藏配置
        hide (item) {
          return item.hide
        }
      },
      // 是否多选
      multiple: {
        type: Boolean,
        default: false
      },
      // 选择器弹窗载入数据函数
      load: Function,
      // 选项列表标题
      listTitle: {
        type: String,
        default: '列表选项'
      },
      // 已选列表标题
      selectedTitle: {
        type: String,
        default: '已选列表'
      },
      // 选项区域高度
      optionHeight: {
        type: String,
        default: '350px'
      }
    },
    data () {
      return {
        // 列表数据
        data: [],
        // 输入框绑定值
        selected: '',
        // 当前emit的selectedValue
        currentEmitValue: '',
        // 是否显示弹窗
        isShowDialog: false,
        // 选择器弹窗控制按钮组
        toolbar: [
          {
            text: '取消',
            type: 'plain',
            func: this.cancel
          },
          {
            text: '确认',
            type: 'primary',
            func: this.confirm
          }
        ]
      }
    },
    watch: {
      value (value) {
        if (!value || (value === this.currentEmitValue)) return
        this.initValue(value)
      }
    },
    created () {
      this.init()
    },
    methods: {
      // 初始化
      init () {
        this.initSelector()
        this.initData()
      },
      initSelector () {
        const opt = {
          vm: this,
          dataKey: this.dataKey
        }
        this.selector = this.multiple ? new MultipleSelector(opt) : new BasicSelector(opt)
      },
      initData () {
        this.initValue(this.value)
        // 获取项目列表
        // this.load(data => {
        //   if (!Array.isArray(data)) throw new Error('the data for callback must be array!')
        //   this.data = data
        //   this.initSelected(this.value)
        // })
      },
      /** 初始化选项 */
      initValue (value) {
        if (value) {
          this.initSelected(value)
        } else {
          this.reset()
        }
      },
      /** 初始化选项 */
      initSelected (value) {
        this.selector.initSelected(value)
      },
      /** 打开选择器弹框 */
      openSelector () {
        this.selector.openSelector()
      },
      /** 关闭选择器弹窗 */
      closeSelector () {
        this.selector.closeSelector()
      },
      /** 选择弹窗取消 */
      cancel () {
        this.closeSelector()
      },
      /** 选择器弹窗确认 */
      confirm () {
        this.selector.confirm()
      },
      /** 重置已选选项 */
      reset () {
        this.$refs.component && this.$refs.component.reset()
      }
    }
  }
</script>
<style></style>
