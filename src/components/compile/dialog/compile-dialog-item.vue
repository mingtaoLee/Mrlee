<template>
  <div class="wrap" v-if="isDestroy" v-show="isShow">
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'CompileDialogItem',
  data () {
    return {
      isDestroy: false,
      isShow: false
    }
  },
  methods: {
    // 销毁弹框内容
    destroyItem (show) {
      this.isDestroy = !show
    },
    // 隐藏弹框内容
    hiddenItem (show) {
      this.isShow = !show
    }
  },
  mounted () {
    var parent = this.$parent.$parent.$parent
    if (parent.children.length === 0) {
      // 显示第一个页面
      this.destroyItem(false)
      this.hiddenItem(false)
      parent.changeBtnsStatus('上一步', true)
      parent.changeBtnsStatus('下一步', true)
      parent.changeBtnsStatus('保存', false)
    } else {
      parent.changeBtnsStatus('保存', true)
      parent.changeBtnsStatus('下一步', false)
    }
    parent.children.push(this)
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>

</style>