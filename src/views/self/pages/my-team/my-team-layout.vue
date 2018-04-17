<template>
  <div class="my-team-layout" :style="height">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'MyTeamLayout',
    data () {
      return {
        elMainPadding: 0
      }
    },
    computed: {
      height () {
        var padding = parseInt(this.elMainPadding)
        return `height: calc(100% - ${padding * 2}px);`
      }
    },
    mounted () {
      var main = document.getElementsByClassName('el-main')[0]
      this.elMainPadding = this.getStyle(main, 'padding')
    },
    methods: {
      getStyle (obj, name) {
        if (obj.currentStyle) {
          // return obj.currentStyle[name]
          return getComputedStyle(obj, false)[name]
        } else {
          return getComputedStyle(obj, false)[name]
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .my-team-layout {
    box-sizing: border-box;
  }
</style>
