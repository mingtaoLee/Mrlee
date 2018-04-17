<template>
  <div class="el-batch-select" :class="[stripe ? 'stripe' : 'common']" :style="style">
    <!-- 头部 -->
    <div class="el-batch-select-header" ref="header">
      <el-button @click.stop="add" size="mini">添加</el-button>
    </div>
    <!-- 主体部分 -->
    <transition-group name="slide" tag="ul" class="select-list" :style="bodyStyle">
      <li
        ref="item"
        :class="['select-item']"
        v-for="(item, index) in cloneData"
        :key="item.elSelectId"
        @click="clickItem">
        <span class="label">
          {{ item[label] || '请配置label属性' }}
        </span>
        <i @click.stop="removeItem" class="remove-icon el-icon-close"></i>
      </li>
    </transition-group>
    <!-- 尾部 -->
    <div class="el-batch-select-footer clearFix" ref="footer" v-if="footer">
      <slot name="footer">
        <div class="btn-group">
          <i @click.stop="add" class="el-icon-circle-plus-outline"></i>
          <i @click.stop="removeItems" class="el-icon-remove-outline"></i>
        </div>
      </slot>
    </div>

  </div>
</template>

<script>
/**
 *   @description  虽然不知道会不会用到，但是我有写啊哈哈哈哈哈
 *   @prop  [Boolean]   stripe                                  条纹显示
 *   @prop  [Number]    height                                  组件高度
 *   @prop  [Number]    width                                   组件宽度
 *   @prop  [footer]    footer                                  是否显示尾部组件， 支持插槽
 *   @prop  [String]    label         [require]                 需要显示的字段
 *   @prop  [Array]     model         [require]                 绑定的数据
 *   @prop  [String]  dataOptions     [require]                 新建数据的结构
 *   @prop  [Number, Boolean]  defaultSelect                    默认选中的数据
 *   @emit  [Function]  select                                  选中时派发的事件，参数是选中的数据数组
 *   @emit  [Function]  change                                  数据发生改变派发的事件，参数是[变动的值]和[整个数据对象]
 */
  import { hasClass, removeClass, addClass } from 'utils/dom'
  import operate from './operate'
  export default {
    name: 'ElBatchSelect',

    props: {
      stripe: {
        type: Boolean,
        default: false
      },
      height: {
        type: Number,
        default: 457
      },
      width: {
        type: Number,
        default: 240
      },
      footer: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: 'label'
      },
      model: {
        type: Array,
        required: true
      },
      defaultSelect: {
        type: [Number, Boolean],
        default: false
      },
      dataOptions: {
        required: true
      }
    },

    mixins: [operate],

    data () {
      return {
        // 样式绑定
        style: {
          height: this.height + 'px',
          width: this.width + 'px',
          paddingBottom: 0
        },
        bodyStyle: {
          height: 0
        }
      }
    },

    methods: {
      // 点击数据的操作
      clickItem (e) {
        this.clearActiveClass()
        this.toggleClass(e.currentTarget, 'active')
        let indexs = this.getSelectItems()
        let selectItems = this.getDataByIndex(indexs)
        this.$emit('select', selectItems)
        console.log('%c%s', 'color: #409EFF', '选中的数据为： ', selectItems)
      },
      // 获取所有选中的数据索引
      getSelectItems () {
        let items = this.$refs.item
        if (!items && items.length === 0) {
          return
        }
        let selectItems = items.map((item, index) => {
          if (hasClass(item, 'active')) {
            return index
          }
        })
        selectItems = selectItems.filter(item => item || item === 0)
        return selectItems
      },
      // 根据索引获取数据
      getDataByIndex (indexs) {
        return indexs.map(item => {
          return this.cloneData[item]
        })
      },
      // 切换类名
      toggleClass (el, className) {
        if (hasClass(el, className)) {
          removeClass(el, className)
        } else {
          addClass(el, className)
        }
      },
      // 清除类名
      clearActiveClass () {
        Array.from(this.$refs.item).forEach(item => {
          removeClass(item, 'active')
        })
      },
      // 计算fooster高度
      getFooterHeight () {
        if (!this.footer) {
          return
        }
        return this.$refs.footer.offsetHeight
      },
      // 计算body的高度
      getBodyHeight () {
        if (!this.$refs.header) {
          return
        }
        let headerHeight = this.$refs.header.offsetHeight
        let footerHeight = this.getFooterHeight() || 0
        return this.height - headerHeight - footerHeight
      },
      // 是否默认选中
      defaultOperation () {
        (this.defaultSelect === 0 || this.defaultSelect) && this.toggleClass(this.$refs.item[this.defaultSelect], 'active')
      }
    },

    created () {
    },

    mounted () {
      this.bodyStyle.height = this.getBodyHeight() + 'px'
      this.style.paddingBottom = this.getFooterHeight() + 'px'
      this.defaultOperation()
    }
  }
</script>

<style lang="scss" scoped>
  .el-batch-select {
    box-sizing: border-box;
    position: relative;
    border: 1px solid #d1d1d1;
    overflow: hidden;
    user-select: none;
    .el-batch-select-header{
      box-sizing: border-box;
      padding: 10px 10px;
      border-bottom: 1px solid #dfe4ed;
      background-color: #fff;
    }
    .select-list{
      overflow-y: auto;
      overflow-x: hidden;
      &:hover{
        .remove-icon{
          visibility: visible;
        }
      }
      .select-item{
        position: relative;
        padding: 15px 20px;
        transition: all 0.5s;
        &.active{
          padding-left: 30px;
          background-color: #f5f7fa;
        }
        &:hover{
          .remove-icon{
            visibility: visible;
          }
        }
        .remove-icon{
          position: absolute;
          right: 10px;
          top: 50%;
          font-size: 18px;
          transform: translate(0, -50%);
          visibility: hidden;
          cursor: pointer;
        }
      }
    }
    .el-batch-select-footer{
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 10px 10px;
      border-top: 1px solid #d1d1d1;
      background-color: #fafafa;
      .btn-group{
        float: right;
        i{
          font-size: 24px;
          color: red;
        }
        i + i{
          margin-left: 6px;
        }
      }
    }
  }
  .stripe{
    background-color: #fcfcfc;
    .select-item:nth-of-type(2n) {
      background-color: #fafafa;
    }
    .select-item:nth-of-type(2n + 1) {
      background-color: #fff;
    }
  }
  .common {
    background-color: #fff;
    .select-item {
      border-bottom: 1px solid #ccc;
      background-color: #fafafa;
    }
  }
</style>

/*  动画   */
<style  lang="scss" scoped>
  .el-icon-circle-plus-outline:active, .el-icon-remove-outline:active{
    transform-origin: 50% 50%;
    transform: scale(0.8);
  }
  .slide-enter, .slide-leave-to{
    opacity: 0;
    transform: translate(-100%, 0);
  }
  .slide-leave-active {
    position: absolute !important;
    .remove-icon{
      display: none;
    }
  }
</style>
