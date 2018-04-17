<template>
  <div @click="directTo" :class="['i-cell-item', fixedWarnColor && 'fixedWarnColor']">
    <div class="i-cell-item-left-icon">
      <slot name="left-icon" />
    </div>
    <div class="i-cell-item-title">{{ content }}</div>
    <div class="i-badge-container" v-if="waitingForHandleInfoNumber">
      <em class="i-badge" :class="{'primary': primary, 'warn': warn}">
        {{ waitingForHandleInfoNumber }}
      </em>
    </div>
    <div class="i-cell-item-right-icon">
      <slot name="right-icon" />
    </div>
  </div>
</template>
<script>
  import { windowOpen } from 'utils'
  export default{
    name: 'iCell',
    props: {
      to: String,
      content: {
        type: String
      },
      badge: {
        type: String
      },
      primary: {
        type: Boolean,
        default: false
      },
      fixedWarnColor: {
        type: Boolean,
        default: false
      },
      warn: {
        type: Boolean,
        default: false
      },
      // 记录代办消息条数
      waitingForHandleInfoNumber: {
        // type: Number,
        default: 0
      },
      newTab: {
        type: Boolean
      }
    },
    methods: {
      directTo () {
        if (this.to) {
          if (this.newTab) {
            windowOpen(this.to)
          } else {
            if (this.to.indexOf('watingForHandleInfo') !== -1) {
              this.$router.push({ path: '/watingForHandleInfo' })
            } else {
              window.location.href = this.to
            }
          }
        } else {
          this.$emit('handleClick')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../styles/vars";
  .i-cell-item {
    padding:0 10px;
    cursor:pointer;
    transition: all .4s ease;
    height:36px;
    line-height:36px;
    font-size:12px;
    display:flex;
    align-items:center;
    &:hover{
      background: #F1F3F6;
      color: $color-theme;
    }
    &.fixedWarnColor,&.fixedWarnColor:hover{
      color: #FF6464;
    }
    .i-cell-item-title{
      flex:1;
      padding-left:10px;
      overflow: hidden;
    }

    .i-icon{
      font-size:20px;
    }
  }

  .i-badge-container{
    display:inline-block;
    position:relative;
    .i-badge{
      background-color: #bdbdbd;
      border-radius:4px;
      color:#fff;
      padding:0 6px;
      font-style:normal;
      font-size:14px;
      &.primary{
        background-color:#7e57c2;
      }
      &.warn{
        background-color: #FF6464;
      }
    }
  }
</style>
