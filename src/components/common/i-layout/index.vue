<template>
  <div  :style="LayoutStyle" ref="layout" class="i-layout">

    <transition name="toggle-aside">
      <div :style="[ILayoutStyle,asideContainerStyle]" v-if="aside" v-show="showAside" class="i-layout-aside">
        <header :style="titleStyle" v-if="ifShow('aside-title')" ref="asideTitle">
          <slot name="aside-title"></slot>
        </header>
        <aside :style="asideStyle">
          <slot name="aside"></slot>
        </aside>
      </div>
    </transition>

    <section :style="besideStyle" class="i-layout-beside">
      <div v-if="header" :style="this.header?[ILayoutStyle,{backgroundColor}]:[ILayoutStyle,{display:'none'}]" ref="header" @click="controlClick">
        <div :style="titleStyle" v-if="ifShow('header-title')">
          <slot name="header-title"></slot>
        </div>
        <header :style="headerStyle">
          <slot name="header"></slot>
        </header>
      </div>

      <div v-if="section" :style="[ILayoutStyle,sectionContainerStyle]">
        <div :style="titleStyle" v-if="ifShow('section-title')">
          <slot name="section-title"></slot>
        </div>
        <section :style="sectionStyle">
          <slot name="section"></slot>
        </section>
      </div>

    </section>


    <div v-if="toggleAside&&aside" :style="controlAsideIconStyle">
      <div :style="asideIconStyle"
        @click="controlAsideIconClick"
        @mousemove="controlAsideIconHover"
        @mouseout="controlAsideIconOut"
      >
      <i :class="showAside?'el-icon-arrow-left':'el-icon-arrow-right'"></i>
      </div>
    </div>

  </div>
</template>

<script>
import access from 'mixins/access'

export default {
  name: 'ILayout',
  mixins: [access],
  props: {
    // 直接定义的layout高度
    height: {
      type: Number,
      default: 0
    },
    // 剔除导航栏、面包屑等高度
    eliminateHeight: {
      type: Number,
      default: 100
    },
    // 限制面板高度
    limitHeight: {
      type: Boolean,
      default: true
    },
    // 显示切换左侧aside的显示
    toggleAside: {
      type: Boolean,
      default: true
    },
    // 是否fixtoggleaside的icon
    fixedToggleAsideIcon: {
      type: Boolean,
      default: true
    },
    // 左侧aside的宽度
    asideWidth: {
      type: Number,
      default: 282
    },
    // 右侧beside的宽度
    besideWidth: {
      type: Number,
      default: 0
    },
    // 左侧aside的高度
    asideHeight: {
      type: Number,
      default: 0
    },
    // 固定左侧高度
    fixAside: {
      type: Boolean,
      default: false
    },
    // 固定左侧高度之后需要减去的高度
    fixAsideLimitHeight: {
      type: Number,
      default: 0
    },
    // 整个面板的最小宽度
    panelMinWidth: {
      type: Number,
      default: 600
    },
    // 右侧区块的最小宽度
    besideMinWidth: {
      type: Number,
      default: 600
    },
    // 不同区块之间的margin
    margin: {
      type: Number,
      default: 15
    },
    // 标题的padding
    titlePadding: {
      type: Number,
      default: 15
    },
    // 区块内的padding
    padding: {
      type: Number,
      default: 15
    },
    asidePadding: {
      type: Number,
      default: -1
    },
    asideKey: {
      type: String,
      default: ''
    },
    headerPadding: {
      type: Number,
      default: -1
    },
    headerKey: {
      type: String,
      default: ''
    },
    sectionPadding: {
      type: Number,
      default: -1
    },
    sectionKey: {
      type: String,
      default: ''
    },
    // border的宽度
    borderWidth: {
      type: Number,
      default: 1
    },
    // border的颜色
    borderColor: {
      type: String,
      default: '#e0e0e0'
    },
    // 背景颜色
    backgroundColor: {
      type: String,
      default: '#fff'
    }
  },
  data () {
    return {
      aside: false,
      showAside: true,
      tempAsideWidth: 0,
      toggleAsideIconHover: false,
      header: false,
      section: false,
      layoutHeight: 0,   // 用来保存layout的高度，以此计算section的实际高度
      headerHeight: 0,  // 用来保存header的高度，以此计算section的实际高度
      asideTitleHeight: 0, // 用来保存aside-title的高度，用来计算aside的实际高度
      minHeight: 0       // 整个面板的最小高度
    }
  },
  methods: {
    // 捕捉可能的鼠标点击
    controlClick (e) {
      const target = ['button', 'i', 'span']
      if (target.includes(e.target.localName)) {
        this.controlHeaderHeight()
        if (!this.$parent) return
        if (this.$parent.controlTreeHeight && typeof this.$parent.controlTreeHeight === 'function') {
          this.$parent.controlTreeHeight()
        }
        if (this.$parent.controlHeightWithHeader && typeof this.$parent.controlHeightWithHeader === 'function') {
          this.$parent.controlHeightWithHeader()
        }
      }
    },
    // 点击toggle 左侧栏
    controlAsideIconClick () {
      this.showAside = !this.showAside
      if (this.showAside) {
        this.asideWidth = this.tempAsideWidth
      } else {
        this.asideWidth = 0
      }
    },
    // 左侧栏的控制icon的hover事件
    controlAsideIconHover () {
      this.toggleAsideIconHover = true
    },
    // 移出鼠标
    controlAsideIconOut () {
      this.toggleAsideIconHover = false
    },
    // 需要计算的header高度
    controlHeaderHeight () {
      this.$nextTick(() => {
        this.headerHeight = this.$refs.header ? this.$refs.header.offsetHeight : 0
      })
    },
    ifShow (name) {
      return Object.keys(this.$slots).includes(name)
    },
    reSize (that = this, controlMinHeight = 420) {
      let minusMargin = that.header ? 2 * that.margin : that.margin
      if (window.innerHeight) {
        that.minHeight = that.limitHeight ? window.innerHeight - that.eliminateHeight - minusMargin : 0
        that.minHeight = that.minHeight !== 0 && that.minHeight <= controlMinHeight ? controlMinHeight : that.minHeight
      } else if ((document.body) && (document.body.clientHeight)) {
        that.minHeight = that.limitHeight ? document.body.clientHeight - that.eliminateHeight - minusMargin : 0
        that.minHeight = that.minHeight !== 0 && that.minHeight <= controlMinHeight ? controlMinHeight : that.minHeight
      }
      that.minHeight = that.height ? that.height : that.minHeight
    },
    // 控制权限
    controlAccess (target) {
      if (this[target + 'Key']) {
        if (!this.accessMap[this[target + 'Key']]) {
          this[target] = false
        }
      }
    }
  },
  computed: {

    LayoutStyle () {
      return this.height
      ? {
        display: 'flex',
        width: '100%',
        height: this.height + 'px'
        // overflow: 'auto'
      } : {
        display: 'flex',
        width: '100%',
        minHeight: this.minHeight + 'px'
        // overflow: 'auto'
      }
    },
    ILayoutStyle () {
      return this.borderWidth
      ? {
        border: this.borderWidth + 'px solid #E5E5E5',
        borderRadius: '2px',
        // overflow: 'hidden',
        boxShadow: '0 0 1px 0 rgba(0, 0, 0, 0.10)',
        boxSizing: 'border-box'
      } : {
        // overflow: 'hidden'
      }
    },
    asideStyle () {
      return this.aside
      ? this.fixAside
      ? {
        padding: (this.asidePadding >= 0 ? this.asidePadding : this.padding) + 'px',
        backgroundColor: this.backgroundColor,
        maxHeight: `${this.asideHeight ? this.asideHeight + 'px' : 'calc(100% - ' + (this.asideTitleHeight + 2 * (this.asidePadding >= 0 ? this.asidePadding : this.padding)) + 'px)'}`,
        overflow: 'auto'
      } : {
        padding: (this.asidePadding >= 0 ? this.asidePadding : this.padding) + 'px',
        backgroundColor: this.backgroundColor,
        height: `${this.asideHeight ? this.asideHeight + 'px' : 'calc(100% - ' + (this.asideTitleHeight + 2 * (this.asidePadding >= 0 ? this.asidePadding : this.padding)) + 'px)'}`
      }
     : {
       display: 'none'
     }
    },
    controlAsideIconStyle () {
      return {
        position: 'absolute',
        left: this.showAside ? this.asideWidth + 'px' : -this.margin + 'px',
        transition: 'all 0.3s'
        // zIndex: '-1'
      }
    },
    asideIconStyle () {
      return {
        width: this.padding + 'px',
        height: 2 * this.padding + 'px',
        lineHeight: 2 * this.padding + 'px',
        display: 'inline-block',
        position: this.fixedToggleAsideIcon ? 'fixed' : 'absolute',
        top: !this.fixedToggleAsideIcon ? this.minHeight / 2 - this.padding + 'px' : this.minHeight / 2 + 100 - this.padding + 'px',
        background: '#3DA5FE',
        color: 'white',
        opacity: this.toggleAsideIconHover ? '1' : '0.3',
        cursor: 'pointer',
        transition: 'opacity 0.3s'
      }
    },
    besideStyle () {
      return {
        display: 'flex',
        flexDirection: 'column',
        width: this.besideWidth ? this.besideWidth + 'px' : `calc(100% - ${this.aside && this.showAside ? this.asideWidth + this.margin : 0}px)`,
        minWidth: this.besideWidth ? '0px' : this.besideMinWidth + 'px',
        marginLeft: `${this.aside && this.showAside ? this.margin : 0}px`,
        height: 'auto'
      }
    },
    headerStyle () {
      return this.header
      ? {
        padding: (this.headerPadding >= 0 ? this.headerPadding : Math.floor(this.padding / 2)) + 'px',
        backgroundColor: this.backgroundColor
        // overflow: 'auto'
      } : {
        display: 'none'
      }
    },
    sectionStyle () {
      return {
        padding: (this.sectionPadding >= 0 ? this.sectionPadding : this.padding) + 'px',
        backgroundColor: this.backgroundColor
        // overflow: 'auto'
      }
    },
    titleStyle () {
      return {
        borderBottom: '2px solid ' + this.borderColor,
        padding: this.titlePadding + 'px'
      }
    },
    asideContainerStyle () {
      return this.aside
      ? {
        backgroundColor: this.backgroundColor,
        width: this.asideWidth + 'px',
        minWidth: this.asideWidth + 'px',
        minHeight: this.minHeight + 'px'
      }
      : {
        display: 'none'
      }
    },
    sectionContainerStyle () {
      this.controlHeaderHeight()
      return this.section
      ? {
        backgroundColor: this.backgroundColor,
        marginTop: `${this.header ? this.margin : 0}px`,
        minHeight: `${this.header ? (this.layoutHeight - this.headerHeight) + 'px' : (this.minHeight - this.headerHeight) + 'px'}`,
        height: `calc(100% - ${this.header ? (this.headerHeight + this.margin) : 0}px)`
        // overflow: 'auto'
      }
      : {
        display: 'none'
      }
    }
  },
  mounted () {
    this.layoutHeight = this.$refs.layout.offsetHeight
    this.headerHeight = this.$refs.header ? this.$refs.header.offsetHeight : 0
    this.asideTitleHeight = this.$refs.asideTitle ? this.$refs.asideTitle.offsetHeight : 0
  },
  created () {
    this.tempAsideWidth = this.asideWidth
    this.aside = this.ifShow('aside')
    this.aside && this.controlAccess('aside')
    this.header = this.ifShow('header')
    this.header && this.controlAccess('header')
    this.section = this.ifShow('section')
    this.section && this.controlAccess('section')
    this.reSize()
    const that = this
    const originFn = window.onresize
    window.onresize = function temp () {
      originFn && originFn()
      return that.reSize()
    }
  }
}
</script>

<style lang="scss" scoped>
.i-layout{
  position: relative;
  .toggle-aside-enter-active{
    transition: all .3s ease;
  }
  .toggle-aside-leave-active{
    transition: all .3s ease;
  }
  .toggle-aside-enter, .toggle-aside-leave-to{
    transform: translateX(-282px);
    opacity: 0;
  }
}
</style>
