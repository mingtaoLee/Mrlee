<template>
  <div class="wrap" :style="wrapStyle">
    <header :style="headerStyle">{{title}}</header>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {
      title: String,
      headerLineHeight: {
        type: String,
        default: '30px'
      },
      headerBackground: {
        type: String,
        default: 'white'
      },
      border: {
        type: String,
        default: '1px solid black'
      },
      padding: {
        type: String,
        default: '20px'
      },
      background: {
        type: String,
        default: 'white'
      }
    },
    computed: {
      wrapStyle (value) {
        return {
          border: this.border,
          padding: this.padding,
          background: this.background
        }
      }
    },
    data: function () {
      return {}
    },
    created () {
    },
    components: {},
    methods: {}
  }
</script>
<style lang="scss" scoped>
</style>
