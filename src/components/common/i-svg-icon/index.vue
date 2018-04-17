<template>
  <span>
    <svg :style="styleName" aria-hidden="true" class="icon">
      <use :xlink:href="'#icon-' + iconName"></use>
    </svg>
  </span>
</template>

<script>
  import './iconfont'
  export default {
    props: {
      iconName: {
        type: String,
        default: 'cards'
      },
      styleName: {
        type: Object
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icon {
    width: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
