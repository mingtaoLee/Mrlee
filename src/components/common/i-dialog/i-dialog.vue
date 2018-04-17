<template>
  <el-dialog
    ref="elDialog"
    :visible.sync="isShow"
    v-if="!destroyedWhenClose || isShow"
    :width="setWidth"
    :class="['i-dialog', customClass, modeClass]"
    @close="handleDialogClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :before-close="closeBefore"
    :title="title"
    :show-close="showClose"
    :modal="getModal"
    top="0"
    :append-to-body="appendToBody"
    v-drag
  >
    <div class="customBody"><slot></slot></div>
    <!--<component v-if="component" :is="component"></component>-->
    <div v-if="toolbar && toolbar.length" slot="footer" class="dialog-footer">
      <!-- <slot name="combineAction"></slot> -->
      <!-- <div class="footer-button"> -->
      <el-button
        v-for="(btn, index) of toolbar"
        v-show="!btn.hide"
        :disabled="btn.disabled"
        :loading="btn.loading"
        :key="index"
        :type="btn.type || 'primary'"
        @click="handleClick(btn)"
      >
        {{btn.text}}
      </el-button>
      <!-- </div> -->
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name: 'iDialog',
    components: {
    },
    props: {
      mode: {
        type: String,
        default: 'standard'
      },
      width: String,
      appendToBody: {
        type: Boolean,
        default: true
      },
      closeOnPressEscape: {
        type: Boolean,
        default: true
      },
      closeOnClickModal: {
        type: Boolean,
        default: false
      },
      beforeClose: Function,
      destroyedWhenClose: Boolean,
      toolbar: Array,
      modal: {
        type: Boolean,
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      value: Boolean,
      component: [Function, Object],
      title: String,
      size: {
        type: String,
        default: 'standard'
      },
      customClass: String
    },
    data: function () {
      return {
        isShow: this.value,
        sizeMap: {
          'huge': '1200px',
          'large': '900px',
          'standard': '700px',
          'small': '500px',
          'mini': '350px'
        }
      }
    },
    watch: {
      value (value) {
        this.isShow = value
      }
    },
    mounted () {
//      this.setDialogAttribute(this)
    },
    computed: {
      modeClass () {
        return this.mode === 'popup' && 'popup'
      },
      getModal () {
        return this.mode === 'popup' ? false : this.modal
      },
      setWidth () {
        let width = ''
        if (this.mode === 'popup') {
          width = '100%'
        } else {
          width = this.width || this.sizeMap[this.size]
        }
        return width
      }
    },
    methods: {
      closeBefore (done) {
        if (this.beforeClose) {
          this.beforeClose(() => {
            done()
            this.$emit('input', false)
          })
        } else {
          done()
          this.$emit('input', false)
        }
        this.resetThrottledBtn()
      },
      handleDialogClose () {
        this.$emit('input', false)
        this.$emit('close')
      },
      done () {
        this.resetThrottledBtn()
        this.handleDialogClose()
      },
      setDialogAttribute (vm) {
        if (!vm.$parent) return
        if (vm.$parent.$options._componentTag === 'el-dialog') {
          this.appendToBody = true
          return
        }
        this.setDialogAttribute(vm.$parent)
      },
      handleCancel () {
        this.handleDialogClose()
        this.$emit('cancel')
      },
      handleConfirm () {
        this.handleDialogClose()
        this.$emit('confirm')
      },
      handleClick (btn) {
        const { throttle, func } = btn

        if (throttle) {
          this.setLoadingBtn(btn, true)

          func && func(this.done).then(() => {
            this.setLoadingBtn(btn, false)
          }).catch(() => {
            this.setLoadingBtn(btn, false)
          })
        } else {
          func && func(this.done)
        }
      },
      /** 重置节流按钮 */
      resetThrottledBtn () {
        if (this.toolbar && Array.isArray(this.toolbar)) {
          this.toolbar.map(btn => {
            if (btn.loading) {
              btn.loading = false
            }
          })
        }
      },
      /** 节流条件下设置按钮禁用属性 */
      setLoadingBtn (btn, isLoading) {
        this.$set(btn, 'loading', isLoading)
      },
      /** 获取dom元素占据空间属性 */
      _getElBoxProperty (el, property) {
        return parseInt(el.getBoundingClientRect()[property])
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../styles/vars";
  $header-line-height: 50px;
  $header-bg-color: #FAFAFA;
  $header-border-color: #F6F6F6;
  $footer-line-height: 60px;
  $footer-bg-color: #FFFFFF;
  $footer-border-color: #E8E8E8;
  $body-max-height: 450px;
  $dialogWidths: (
    700: 700px,
    900: 900px,
    1200: 1200px,
    500: 500px,
    350: 350px
  );
  @each $dialogWidth in map_keys($dialogWidths) {
    .i-dialog-width-#{$dialogWidth} {
      .el-dialog {
        width: map_get($dialogWidths, $dialogWidth);
      }
    }
  }
  .i-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    &.popup {
      display: block;
      /*align-items: flex-end;*/
      /*justify-content: flex-end;*/
      top: 70px;
      left: 215px;
      padding-right: 15px;
      &.max{
        left: 15px;
      }
      .el-dialog {
        position: relative;
        /*margin: 0 10px 0 0;*/
        height: 100%;
        box-shadow: 0 0 3px 0 rgba(0,0,0,0.20);
        .el-dialog__header {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          text-align: left;
          padding-left: 15px;
          background: inherit;
        }
        .el-dialog__footer {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
        }
        .el-dialog__body {
          max-height: none;
          height: 100%;
          padding-top: 60px;
          padding-bottom: 60px;
        }
      }
      .customBody {
        height: 100%;
      }
    }

    .el-dialog {
      margin-bottom: 0;
      box-shadow: 0 2px 3px 0 rgba(0,0,0,0.20);
      border-radius: 3px;
      overflow: hidden;

      .el-dialog__header {
        box-sizing: border-box;
        padding: 0;
        height: $header-line-height;
        line-height: $header-line-height;
        border-bottom: 1px solid $header-border-color;
        text-align: center;
        background: $header-bg-color;
        span {
          vertical-align: middle;
        }
      }

      .el-dialog__title {
        color: #000000;
        font-size: 18px;
      }

      .el-dialog__close {
        color: #D1D1D1;
        font-size: 24px;
      }

      .el-dialog__headerbtn {
        top: 14px;
        right: 14px;
        transition: opacity 0.5s;
        &:hover {
          .el-dialog__close {
            color: #D1D1D1;
            opacity: 0.8;
          }
        }
      }

      .el-dialog__body {
        max-height: $body-max-height;
        overflow:auto;
        padding: 15px;
      }

      .el-dialog__footer {
        height: $footer-line-height;
        padding: 0 20px 0;
        line-height: $footer-line-height;
        border-top: 1px solid $footer-border-color;
        background: $footer-bg-color;
        .el-button {
          min-width: 80px;
        }
        // .dialog-footer {
        //   display: flex;
        //   .footer-button {
        //     flex: 1;
        //   }
        //   .action-info {
        //     flex: 1;
        //     text-align: left;
        //   }
        //   .action-time {
        //     padding-left: 10%;
        //   }
        // }
      }
    }

    .el-table__header{
      // table-layout: auto !important;
    }
  }
</style>
