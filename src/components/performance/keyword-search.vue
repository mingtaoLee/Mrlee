<template>
  <div class="search fr mt10 mb10">
    <span class="icon-container fr" @click="toggleInput" v-if="!show">
      <i class="icon iconfont icon-search"></i>
    </span>
    <transition name="slide">
      <el-input
        :value="keyword"
        @input.native="updateValue($event.target.value)"
        placeholder="关键字搜索"
        @blur="toggleInput"
        @keyup.enter.native="triggerSearch"
        v-if="show"
        v-focus
        size="small">
      </el-input>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'KeywordSearch',
  props: ['keyword'],
  data () {
    return {
      show: false
    }
  },
  methods: {
    toggleInput () {
      this.show = !this.show
      if (!this.show) {
        this.updateValue('')
      }
    },
    updateValue (value) {
      let formattedValue = value.trim()
      this.$emit('input', formattedValue)
    },
    triggerSearch () {
      this.$emit('search')
    }
  },
  directives: {
    focus: {
      inserted (el) {
        if (el.classList.contains('el-input')) {
          el.getElementsByTagName('input')[0].focus()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .search {
    height: 36px;
    line-height: 36px;
    .icon-container {
      .iconfont {
        color: #3da5fe;
        font-size: 25px;
        cursor: pointer;
      }
    }
    .slide-enter-active, .slide-leave {
      transition: transform .2s ease-in;
    }
    .slide-enter, .slide-leave-to {
      transform: translateX(50%) scaleX(0);
    }
  }
</style>
