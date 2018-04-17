<template>
  <el-form class="i-form clearfix" ref="form" :model="model" :rules="rules" @keydown.native.enter="search" v-cloak>
    <div class="i-form__operate clearfix" v-if="control">
      <el-button type="text" icon="arrow-down"  :class="{'icon-rotate': isCollapse}" v-if="isShowToggle" @click="handleCollapse">{{collapseText}}</el-button>
      <el-button type="plain" class="form-btn" @click="reset">重置</el-button>
      <el-button type="primary" class="form-btn" @click="search">查询</el-button>
    </div>
    <div ref="formItem" :class="['i-form__item', 'clearfix', `label-width-${sizeMap[labelWidth]}`]" :style="formItemStyle">
      <slot></slot>
    </div>
  </el-form>
</template>
<script>
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
    props: {
      model: Object,
      rules: Object,
      control: {
        type: Boolean,
        defalut: true
      },
      labelWidth: {
        type: String,
        default: 'standard'
      }
    },
    data () {
      return {
        isCollapse: false,
        isShowToggle: true,
        sizeMap: {
          'huge': 140,
          'large': 120,
          'standard': 100,
          'mini': 80
        }
      }
    },
    computed: {
      formItemStyle (value) {
        return {
          height: this.isCollapse ? 'auto' : '56px',
          marginRight: this.control ? '250px' : 0
        }
      },
      collapseText (value) {
        return this.isCollapse ? '收起' : '展开'
      }
    },
    mounted () {
      this.initLayout()
    },
    methods: {
      initLayout () {
        const formEl = this.$refs.form.$el
        const formItemEls = this.$refs.formItem.children
        this._resetLayout(formEl, formItemEls)
        this.addResizeListener(formEl, formItemEls)
      },
      addResizeListener (formEl, formItemEls) {
        window.onresize = function () {
          this._resetLayout(formEl, formItemEls)
        }.bind(this)
      },
      search () {
        this.$emit('search')
      },
      reset () {
        this.$emit('reset')
      },
      handleCollapse () {
        this.isCollapse = !this.isCollapse
      },
      // 获取dom元素占据空间属性
      _getElBoxProperty (el, property) {
        return parseInt(el.getBoundingClientRect()[property])
      },
      _resetLayout (formEl, formItemEls) {
        const formWidth = this._getElBoxProperty(formEl, 'width')
        let col = 0
        if (formWidth > 1000) {
          col = 4
        } else if (formWidth > 750) {
          col = 3
        } else if (formWidth < 500) {
          col = 1
        } else {
          col = 2
        }
        const widthPercent = parseFloat((1 / col) * 100) + '%'
        this.setIsShowToggle(formItemEls.length, col)
        Array.from(formItemEls).forEach(item => {
          item.style.width = widthPercent
        })
      },
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
    padding: 10px 0;
  }

  %fl {
    float: left;
  }

  .i-form.el-form {
    font-size: 12px;
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
      height: auto;
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
      float: right;
      width: $operateWidth;
      margin-top: 16px;
    }
  }
</style>
