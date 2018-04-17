<template>
  <div class="wrap">
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'YhCl',
  props: {
    // 自由点击
    // 点击展开面板的时候，如果为true则各自展开关闭，如果为false则点击某个独自展开关闭，其余均关闭
    clickFree: {
      type: Boolean,
      default: false
    },
    // 组件安装后状态，
    // 值为normal则展开第一个，其余关闭
    // 值为target则新添加进来的打开
    // 值为all则全部都打开
    mountedType: {
      type: String,
      default: 'normal'
    }
  },
  data () {
    return {
      toggleChosen: {index: ''},
      // 保存所有yh-cl-item
      children: [],
      // 用来保存新增的index
      addingIndex: -1,
      // 用来保存上一次的children的个数
      preChildrenNum: 0
    }
  },
  methods: {
    reset () {
      this.toggleChosen = 'RESET'
    },
    openAll () {
      this.toggleChosen = 'OPEN_ALL'
    }
  },
  watch: {
    toggleChosen (val, oldVal) {
      switch (val) {
        case 'RESET':
          this.children.forEach((ele, index) => {
            if (index === 0) {
              ele.show = true
            } else {
              ele.show = false
            }
          })
          break
        case 'OPEN_ALL':
          this.children.forEach((ele, index) => {
            ele.show = true
          })
          break
        default:
          this.children.forEach(ele => {
          // 如果选择自由点击，则各自点击打开或关闭
            if (this.clickFree) {
              if (ele.index === val.index) {
                ele.show = !ele.show
              }
            } else {
            // 如果不是自由点击，则点击的打开，其他关闭
              if (ele.index === val.index) {
                ele.show = !ele.show
              } else {
                ele.show = false
              }
            }
          })
      }
    }
  },
  mounted () {
    this.children.forEach((ele, index) => {
      switch (this.mountedType) {
        case 'normal':
          if (index === 0) {
            ele.show = true
          } else {
            ele.show = false
          }
          break
        case 'target':
          ele.show = true
          break
        case 'all':
          ele.show = true
          break
      }
    })
  },
  updated () {
    switch (this.mountedType) {
      case 'target':
        this.children.forEach((ele, index) => {
          if (index === Number(this.addingIndex) && this.$children.length > this.preChildrenNum) {
            ele.show = true
          }
        })
        break
      case 'all':
        this.children.forEach((ele, index) => {
          ele.show = true
        })
        break
    }
    this.preChildrenNum = this.$children.length
  }
}
</script>

<style lang="scss" scoped>

</style>
