<template>
  <div class="avatar" :style="avatarUrl">
    <div class="avatar" v-if="url">
    <i-svg-icon v-if="gender === 'F'"  iconName="woman" :styleName="iconStyle"></i-svg-icon>
    <i-svg-icon v-else-if="gender === 'M'" iconName="man" :styleName="iconStyle"></i-svg-icon>
    </div>
    <div class="avatar" v-else>
    <i-svg-icon v-if="gender === 'F'"  iconName="nvxingtouxiang" :styleName="iconPortraitStyle"></i-svg-icon>
    <i-svg-icon v-if="gender === 'M'"  iconName="nanxingtouxiang" :styleName="iconPortraitStyle"></i-svg-icon>
    </div>
  </div>
</template>

<script>
  import ISvgIcon from 'components/common/i-svg-icon'
  export default {
    name: 'Avatar',
    components: {
      ISvgIcon
    },
    props: {
      url: {
        type: String,
        default: null
      },
      gender: String
    },
    computed: {
      avatarUrl () {
        return `background-image: url(${this.url})`
      }
    },
    data () {
      return {
        iconStyle: `width: 15px; position: absolute; top: -36px;right: -4px;`,
        iconPortraitStyle: `width: 100%; height: 100%; border-radius: 50%;`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .avatar {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 42px;
    min-width: 42px;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    background-origin: border-box;
    background-position: top center;
    background-clip: border-box;
  }
</style>
