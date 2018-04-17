<template>
  <div class="i-control-layout" :style="layoutStyle">
    <div class="btn-control" :style="btnControlStyle">
      <span v-if="!!title" :style="titleStyle">{{title}}</span>
      <template v-for="(item, idx) of btnControl.topLevel">
        <el-button
          :key="idx"
          :type="item.type"
          :disabled="item.disabled"
          @click="handleTopLevelClick(item)"
        >{{item.text}}</el-button>
      </template>
      <template v-if="btnControl.lowLevel">
        <el-dropdown class="drop-down" :hideOnClick="hideOnClick" :trigger="trigger">
          <el-button :type="moreBtnType">{{moreText}}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, idx) of btnControl.lowLevel"
              :key="idx"
              :disabled="item.disabled"
              @click.native="handleLowLevelClick(item)"
            >{{item.text}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import access from 'mixins/access'

export default {
  name: 'iControlLayout',
  mixins: [access],
  props: {
    title: String,
    titleStyle: {
      type: Object,
      default () {
        return {
        }
      }
    },
    toolbar: Array,
    currentItem: Object,
    trigger: {
      type: String,
      default: 'click'
    },
    btnCol: {
      type: Number,
      default: 4
    },
    moreBtnType: {
      type: String,
      default: 'primary'
    },
    layoutWidth: {
      type: String,
      default: '100%'
    },
    justifyContent: {
      type: String,
      default: 'flex-start'
    },
    background: {
      type: String,
      default: 'white'
    },
    hideOnClick: {
      type: Boolean,
      default: true
    },
    moreText: {
      type: String,
      default: '更多操作'
    }
  },
  data: function () {
    return {
      btnControl: {}
    }
  },
  computed: {
    layoutStyle (value) {
      return {
        width: this.layoutWidth,
        background: this.background
      }
    },
    btnControlStyle (value) {
      return {
        justifyContent: this.justifyContent
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.init()
    })
  },
  components: {},
  methods: {
    init () {
      this.btnControl = this._transformToBtnLayoutData(this.toolbar)
    },
    _transformToBtnLayoutData (data) {
      let toolbar = []
      data.map(ele => {
        if (ele.hasOwnProperty('key')) {
          if (this.accessMap[ele.key]) {
            toolbar.push(ele)
          }
        } else {
          toolbar.push(ele)
        }
      })
      let newToolbar = {}
      const length = toolbar.length
      if (length < this.btnCol + 1) {
        newToolbar.topLevel = toolbar
      } else {
        newToolbar.topLevel = this.btnCol ? toolbar.splice(0, this.btnCol - 1) : []
        newToolbar.lowLevel = toolbar
      }
      return newToolbar
    },
    handleLowLevelClick (btnControl) {
      btnControl.func(this.currentItem)
    },
    handleTopLevelClick (btnControl) {
      btnControl.func(this.currentItem)
    }
  }
}
</script>
<style lang="scss">
  .i-control-layout {
    box-sizing: border-box;

    .btn-control {
      display: flex;
      align-items: center;
      //padding: 10px;
      //border-bottom: 1px solid #e5e5e5;
    }
    .drop-down {
      margin-left: 9px;
    }
  }
</style>
