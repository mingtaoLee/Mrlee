<template>
  <el-form
    v-if="access"
    :class="['i-form', 'clearfix']"
    :style="formItemStyle"
    ref="form"
    @keydown.native.enter.prevent="search"
     v-cloak
  >
    <div class="i-form__operate clearfix">
      <el-button type="text" icon="el-icon-arrow-down"  :class="{'icon-rotate': isCollapse}" v-if="isShowToggle" @click="handleCollapse">{{collapseText}}</el-button>
      <el-button type="plain" class="form-btn" @click="reset">重置</el-button>
      <el-button type="primary" class="form-btn" @click="search">查询</el-button>
    </div>
    <div ref="formItem" :class="['i-form__item', 'clearfix', `label-width-${sizeMap[labelWidth]}`]">
      <slot></slot>
    </div>
  </el-form>
</template>
<script>
import access from 'mixins/access'
// import velocity from 'velocity-animate'
export default {
    /**
     * @component i-form:给查询表单提供自适应布局的组件，
     * 表单宽度小于700提供1列布局，
     * 大于700小于1000提供2列布局，
     * 大于1000小于1300提供3列布局，
     * 大于1300提供4列布局
     * @props {}
     */
  name: 'i-form',
  mixins: [access],
  props: {
    labelWidth: {
      type: String,
      default: 'standard'
    },
    accessKey: {
      type: String,
      default: ''
    },
    transition: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formHeight: '',
      isCollapse: false,
      isShowToggle: true,
      sizeMap: {
        'huge': 140,
        'large': 120,
        'standard': 100,
        'mini': 80,
        'superMini': 75
      },
      access: true
    }
  },
  computed: {
    formItemStyle (value) {
      return this.transition ? {} : { height: this.isCollapse ? 'auto' : '47px' }
    },
    collapseText (value) {
      return this.isCollapse ? '收起' : '展开'
    }
  },
  created () {
    if (this.accessKey && !this.accessMap[this.accessKey]) {
      this.access = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initLayout()
    })
  },
  methods: {
    initLayout () {
      if (!this.$refs.form || !this.$refs.formItem) return

      const formEl = this.$refs.form.$el
      const formItemEls = this.$refs.formItem.children
      this._resetLayout(formEl, formItemEls)
      this.addResizeListener(formEl, formItemEls)
    },
    addResizeListener (formEl, formItemEls) {
        // 监听宽口变化事件，且避免事件覆盖
      window.onresize = (window.onresize || (() => {})).after(() => {
        this._resetLayout(formEl, formItemEls)
      })
    },
    search () {
      this.$emit('search')
    },
    reset () {
      this.$emit('reset')
    },

    /** 处理收起与展开事件 */
    handleCollapse () {
      this.isCollapse = !this.isCollapse

      this.transition && this.handleTransition(this.isCollapse)

      this.$emit('handleCollapse')
    },

    /** 展开关闭动画 */
    handleTransition (isCollapse) {
      // if (isCollapse) {
      //   velocity(this.$refs.form.$el, {height: this.formHeight}, {duration: 350, easing: 'ease-in-out'})
      // } else {
      //   velocity(this.$refs.form.$el, {height: 47}, {duration: 350, easing: 'ease-in-out'})
      // }
    },

    /** 获取dom元素占据空间属性 */
    _getElBoxProperty (el, property) {
      return parseInt(el.getBoundingClientRect()[property])
    },

    /** 重置布局 */
    _resetLayout (formEl, formItemEls) {
      const formWidth = this._getElBoxProperty(formEl, 'width')
      let col = 0
      if (formWidth > 1300) {
        col = 4
      } else if (formWidth > 1000) {
        col = 3
      } else if (formWidth > 700) {
        col = 2
      } else {
        col = 1
      }
      const widthPercent = parseFloat((1 / col) * 100) + '%'
      this.setIsShowToggle(formItemEls.length, col)
      Array.from(formItemEls).forEach(item => {
        item.style.width = widthPercent
      })
      // this.formHeight = this._getElBoxProperty(this.$refs.formItem, 'height')
    },

    /** 设置是否展示收起与展开按钮 */
    setIsShowToggle (length, col) {
      this.isShowToggle = length > col
    }
  }
}
</script>
<style lang="scss" scoped>
  .form-btn {
    width: 60px;
  }
</style>
<style lang="scss">
  $labelWidths: (
    75: 75px,
    80: 80px,
    100: 100px,
    120: 120px,
    140: 140px
  );
  @each $labelWidth in map_keys($labelWidths) {
    .i-form .label-width-#{$labelWidth} {
      .el-form-item__label {
        @extend %fl;
        width: map_get($labelWidths, $labelWidth);
      }
      .el-form-item__content {
        margin-left: map_get($labelWidths, $labelWidth);
      }
    }
  }

  $operateWidth: 250px;
  %padding-vertical-10 {
    padding: 3.5px 0;
  }

  %fl {
    float: left;
  }

  .i-form {
    height: 47px;
    margin: -3.5px 0;
    overflow: hidden;
  }

  .i-form.el-form {
    border-radius: 5px;
    background: white;
    font-size: 12px;

    .el-form-item__content, .el-form-item__label {
      height: 40px;
    }

    .el-button {
      padding: 6px 15px;
    }

    .el-icon-arrow-down {
      transition: 0.3s;
    }

    .icon-rotate {
      .el-icon-arrow-down {
        transform: rotate(180deg);
      }
    }

    .i-form__item {
      transition: 1s;
      margin-right: $operateWidth;
      overflow: hidden;
    }

    .el-form-item {
      @extend %fl;
      @extend %padding-vertical-10;
      margin-bottom: 0;
    }

    .el-select, .el-date-editor.el-input {
      width: 100%;
    }

    .i-form__operate {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      float: right;
      width: $operateWidth;
      margin-top: 10px;
      margin-right: 7px;
    }
  }
</style>
