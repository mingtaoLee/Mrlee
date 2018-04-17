<template>
  <section class="feature-list card list-card lx-feature-list">
    <header>
      <h3>常用功能<span class="remind">选中图标可以拖动调整显示顺序</span></h3>
    </header>
    <p class="noCommonUse" v-if="!noCommonUseStatu">您暂未选择常用功能</p>
    <div class="draggableAreaBox" v-loading="featureCardLoading" :element-loading-text="$loadingText">
      <draggable v-if="noCommonUseStatu && !featureCardLoading" class="draggableArea" :list="list" :options="{draggable:'.item'}">
        <div class="item" v-for="(item, idx) in list" :key="item">
          <div class="image" @click="routerPush(item.menuAddress)">
            <i class="iconfont icon-reduce delete" @click.stop="deleteCollection(item, idx)"/>
            <img :src="handlerSrc(item)" :onerror="errorWay + ';this.onerror=null'">
          </div>
          <div class="info">
            <el-tooltip effect="dark" :content="item.menuName" placement="top-start">
              <span>{{item.menuName}}</span>
            </el-tooltip>
          </div>
        </div>
      </draggable>
    </div>
  </section>
</template>

<script>
import Draggable from 'vuedraggable'
import ISvgIcon from 'components/common/i-svg-icon'
import Icon from '@/assets/images/623893360654657755.png'

export default {
  components: {
    ISvgIcon,
    Draggable
  },

  props: {
    featureCardLoading: {
      default: true
    },
    list: {
      default: []
    }
  },

  data () {
    return {
      getImageApi: '/system/attachments/image/',
      imageResource: Icon,
      noCommonUseStatu: true,
      errorWay: 'this.src="' + require('../../../../assets/images/623893360654657755.png') + '"'
    }
  },
  watch: {
    featureCardLoading (val) {
      !val && this.handlerCommonUseStatu2(val)
    },
    list (val) {
      this.handlerCommonUseStatu(val)
    }
  },
  methods: {
    handlerCommonUseStatu (val) {
      if (val && val.length) {
        this.noCommonUseStatu = true
        return
      }
      this.noCommonUseStatu = false
    },
    handlerCommonUseStatu2 (val) {
      if (this.list && this.list.length) {
        this.noCommonUseStatu = true
        return
      }
      this.noCommonUseStatu = false
    },
    routerPush (href) {
      this.$router.push(href)
    },
    deleteCollection (item, idx) {
      this.list.splice(idx, 1)
      this.$emit('deleteCollection', item)
    },
    handlerSrc (item) {
      if (item.icon) {
        return `${this.$$.BASE_URL}${this.getImageApi}${item.icon}`
      } else {
        return this.imageResource
      }
    }
  }
}
</script>

<style lang="scss">
.lx-feature-list {
  .remind {
    margin-left: 8px;
    color: #a3a0a0;
  }
  .noCommonUse {
      text-align: center;
      letter-spacing: 3px;
      font-size: 16px;
      height: 100px;
      line-height: 100px;
      color: #909399;
    }
  .draggableAreaBox{
    min-height: 149px;
    .draggableArea {
      min-height: 149px;
      overflow: hidden;
      .item{
        float: left;
        margin: 19px calc((100% - 641px) / 16);
        width: 80px;
        height: 100px;
        box-sizing: border-box;
        // display: flex;
        // flex-direction: column;
        // justify-content: space-between;
        // align-items: center;
        cursor: move;
        .image {
          width: 56px;
          height: 56px;
          position: relative;
          img {
            width: 56px;
            height: 56px;
          }
          i {
            position: absolute;
            right: -17px;
            top: 0;
            cursor: pointer;
            color: #e7463e;
          }
        }
        .info {
          padding: 0;
          width: 100%;
          white-space: nowrap;
          margin-bottom: 14px;
          color: #4D4D4D;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: left;
        }
      }
    }
  }
}
</style>

