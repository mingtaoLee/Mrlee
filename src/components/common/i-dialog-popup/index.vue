<template>
  <transition name="el-zoom-in-bottom">
    <div
      v-if="visible"
      v-clickoutside="handleClickoutside"
      :class="['popup-dialog', getSizeClass, getAppendToClass]"
      :style="getCustomClass"
    >
      <div class="popup-dialog-box">
        <h3 class="popup-dialog-title">
          <i class="el-icon-back close" @click="hide"></i>
          <span class="popup-dialog-title-text">{{ title }}</span>
        </h3>
        <div class="popup-dialog-content">
          <slot></slot>
        </div>
        <div v-if="toolbar && toolbar.length" :class="['dialog-footer', getBtnClass]">
          <el-button
            v-for="(btn, index) of toolbar"
            v-show="!btn.hide"
            :disabled="btn.disabled"
            :key="index"
            :loading="btn.loading"
            :type="btn.type || 'primary'"
            @click="btn.func(hide)"
          >
            {{btn.text}}
        </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
//  import Popup from 'element-ui/src/utils/vue-popper'
  import Clickoutside from 'directives/clickoutside'

  export default {
    name: 'i-dialog-popup',
    directives: {
      Clickoutside
    },
//    mixins: [Popup],
    props: {
      // 接收的v-model的值，显示和隐藏窗口
      value: {
        type: Boolean,
        default: true
      },
      // 弹窗的标题
      title: {
        type: String
      },
      // 弹窗自定义样式，控制left,top
      customClass: {
        type: Object
      },
      btnPosition: {
        type: String,
        default: 'right'
      },
      // 弹窗尺寸,small/standard/large
      size: {
        type: String,
        default: 'standard'
      },
      // 弹窗下方固定按钮组
      toolbar: Array,
      // 弹窗插入的DOM位置,可为 #app, .app等
      appendTo: {
        type: String,
        default: ''
      }
    },
    data: () => {
      return {
        // 窗口显示隐藏的内部状态
        visible: false
      }
    },
    computed: {
      getBtnClass () {
        let className = 'btn-right'
        if (this.btnPosition === 'left') {
          className = null
        }
        return className
      },
      getCustomClass () {
        return this.customClass ? this.customClass : null
      },
      getAppendToClass () {
        return this.appendTo ? 'append-to' : null
      },
      getSizeClass () {
        return this.appendTo ? null : this.size
      }
    },
    watch: {
      value () {
        this.visible = this.value
      }
    },
    mounted () {
      this.appendToAction()
    },
    methods: {
      // 组件dom插入位置处理
      appendToAction () {
        if (this.appendTo) {
          document.querySelector(this.appendTo).appendChild(this.$el)
        }
      },
      // clickoutside 处理
      handleClickoutside () {
//        let diaEle = document.getElementsByClassName('el-dialog__wrapper')
//        let popEle = document.getElementsByClassName('el-popper')
//        let isOpenPop = false
//        if (popEle.length > 0) {
//          isOpenPop = [...popEle].some(v => {
//            return getComputedStyle(v, null).display !== 'none'
//          })
//        }
//        console.log(isOpenPop, popEle)
//        if (diaEle.length === 0 && isOpenPop) {
//          console.log('handleClickoutside:', diaEle.length)
//          this.hide()
//        } else if (diaEle.length > 0 && isOpenPop) {
//          let bool = [...diaEle].some(v => {
//            return getComputedStyle(v, null).display !== 'none'
//          })
//          console.log('handleClickoutside:', bool, diaEle)
//          !bool && this.hide()
//        }
      },
      // 隐藏组件
      hide () {
//        this.$emit('update:visible', false)
        this.$emit('input', false)
        this.$emit('close')
      }
    }
  }
</script>
<style lang="scss" scoped>
  $border-color: #E8E8E8;
  .popup-dialog {
    position: fixed;
    top: 100px;
    left: 215px;
    right: 15px;
    bottom: 0;
    padding: 0;
    background: #fff;
    font-family: 'PingFangSC-Regular', Arial, Verdana, '\5b8b\4f53';
    box-shadow: 0 0 3px 0 rgba(0,0,0,0.20);
    z-index: 2000;
    &.large {
      left: 15px;
    }
    &.append-to {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .popup-dialog-title {
      position: absolute;
      width: 100%;
      top:0;
      padding: 0 15px;
      font-size: 18px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid $border-color;
      box-sizing: border-box;
      background: #fff;
      z-index: 1;
      .close {
        /*padding-right: 15px;*/
        /*margin-right: 15px;*/
        /*border-right: 1px solid #E8E8E8;*/
        /*float: right;*/
        line-height: inherit;
        color: #D1D1D1;
        font-size: 20px;
        cursor: pointer;
      }
      .popup-dialog-title-text {
        border-left: 1px solid $border-color;
        padding-left: 15px;
        margin-left: 14px;
      }
    }
    .popup-dialog-content {
      padding: 60px 15px;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    }
    .popup-dialog-box {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .dialog-footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 13px 15px;
      border-top: 1px solid $border-color;
      box-sizing: border-box;
      background: #fff;
      .el-button {
        min-width: 80px;
      }
      &.btn-right {
        text-align: right;
      }
    }
  }
</style>
