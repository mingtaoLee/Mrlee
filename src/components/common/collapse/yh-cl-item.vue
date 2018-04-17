<template>
  <div class="wrap">
    <div class="line" :style="lineStyle" @click="beClicked">{{title}}
      <slot name="title" class="title"></slot>
      <!-- <i class="el-icon-arrow-down arrow" v-show="!show" @click="beClicked"></i> -->
      <i :class="['el-icon-arrow-down', 'arrow',{'icon-rotate': show}]"></i>
    </div>
    <el-collapse-transition>
      <div v-show="show" :style="panelStyle">
        <slot></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>

export default {
  name: 'YhClItem',
  props: {
    title: {
      type: String,
      default: ''
    },
    index: {
      type: String,
      required: true
    },
    linePadding: {
      type: Number,
      default: 10
    },
    lineMargin: {
      type: Number,
      default: 10
    },
    lineColor: {
      type: String,
      default: '#f2f2f2'
    },
    lineBorder: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      show: false
    }
  },

  methods: {
    beClicked () {
      var index = this.index
      var show = this.show
      // 原始是关闭的，再次展开才请求数据
      if (!show) {
        this.$emit('showPanel')
      } else {
        this.$emit('closePanel')
      }
      this.$parent.toggleChosen = {index}
    }
  },

  computed: {
    lineStyle () {
      return {
        padding: this.linePadding + 'px',
        marginBottom: this.lineMargin + 'px ', // + this.lineMargin + 'px ' + this.lineMargin + 'px',
        backgroundColor: this.lineColor
      }
    },
    panelStyle () {
      return {
        margin: '-' + (this.lineMargin + this.lineBorder) + 'px 0px ' + this.lineMargin + 'px',
        border: this.lineBorder + 'px solid ' + this.lineColor
      }
    }
  },

  created () {

  },

  mounted () {
    this.$parent.addingIndex = this.index
    this.$parent.children[this.index] = this
  }
}
</script>

<style lang="scss" scoped>
.wrap{
  width:100%;
  .line{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000000;
  }
  .arrow{
    float: right;
    cursor: pointer;
    height:14px;
    transition-duration: 0.5s;
  }
  .icon-rotate {
    transform: rotate(180deg);
  }
  .title{
    display: inline;
  }
}
</style>
