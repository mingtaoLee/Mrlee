<template>
  <section class="feature-list card list-card">
    <header>
      <h3>常用功能</h3>
      <div class="header-edit">
        <span class="edit" v-show="editing" @click="cancelUpdate">取消</span>
        <span class="edit" @click="updateCollection">{{ editing ? '完成' : '编辑' }}</span>
      </div>
    </header>
    <draggable
      v-model="list"
      :options="{ animation: 150, disabled: !editing, dragClass: 'dragging-active', draggable:'a.icon-wrap' }"
      @start="moveStart"
      @end="moveEnd"
      element="nav"
      class="icon-nav"
      v-loading="loading"
      :element-loading-text="$loadingText">
      <p class="noCommonUse" v-if="!noCommonUseStatu">您暂未选择常用功能</p>
      <router-link
        v-for="(item, idx) of list"
        :key="idx"
        :to="item.menuAddress"
        :class="['icon-wrap', { editing: editing, dragging: dragging && draggingIdx === idx }]"
        @click="routerPush(item.menuAddress)">
        <i
          class="iconfont icon-reduce delete"
          v-show="editing"
          @click="deleteCollection(idx)"
        />
        <!-- <i-svg-icon :iconName="item.icon" :styleName="iconStyle"/> -->
        <!-- <img :src="handlerSrc(item)" :style="iconStyle"> -->
        <img :src="handlerSrc(item)" :style="iconStyle" :onerror="errorWay + ';this.onerror=null'">
        <p class="label">
          <el-tooltip effect="dark" :content="item.menuName" placement="top-start">
            <span>{{item.menuName}}</span>
          </el-tooltip>
          <!-- {{ item.menuName }} -->
        </p>
      </router-link>

      <span
        class="icon-wrap"
        style="margin-top: 35px"
        v-show="editing && list.length < 16"
        @click="dialogVisible = true">
        <i class="iconfont icon-add-o create"></i>
        <p class="label">添加</p>
      </span>
    </draggable>

    <i-dialog
      v-model="dialogVisible"
      :toolbar="dialogToolbar"
      title="添加"
      size="small">
      <el-checkbox-group v-model="checked" v-if="checkList.length">
        <el-checkbox
          v-for="checkbox of checkList"
          :key="checkbox"
          :label="checkbox">
        </el-checkbox>
      </el-checkbox-group>

      <p v-else>暂无更多</p>
    </i-dialog>
  </section>
</template>

<script>
import Draggable from 'vuedraggable'
import ISvgIcon from 'components/common/i-svg-icon'
import IDialog from 'components/common/i-dialog/i-dialog'
import req from 'api/common/home'
import Icon from '@/assets/images/623893360654657755.png'

export default {
  data () {
    return {
      errorWay: 'this.src="' + require('@/assets/images/623893360654657755.png') + '"',
      noCommonUseStatu: true,
      getImageApi: '/system/attachments/image/',
      imageResource: Icon,
      iconStyle: {
        width: '56px',
        height: '56px'
      },

      checked: [],
      editing: false,
      dragging: false,
      draggingIdx: -1,
      loading: false,

      featureList: [
        { label: '劳动合同', href: '/employee/employee/contract_template', icon: 'contract' },
        { label: '我的绩效', href: '/performance/basic/level', icon: 'performance-file' },
        { label: '培训业务', href: '/main/', icon: 'degree' },
        { label: '我的工资', href: '/main/', icon: 'dollar-cards' },
        { label: '政策制度', href: '/main/', icon: 'policy' },
        { label: '组织架构', href: '/main/', icon: 'org' },
        { label: '招聘渠道', href: '/main/', icon: 'recruit' },
        { label: '薪酬发放', href: '/main/', icon: 'compensation' },
        { label: '分配薪资', href: '/main/', icon: 'circle-chart' },
        { label: '合同模板', href: '/main/', icon: 'tpl' },
        { label: '绩效指标', href: '/main/', icon: 'trend-chart' },
        { label: '公积金+社保', href: '/main/', icon: 'cards' }
      ],
      checkList: [],
      list: [],

      dialogVisible: false,
      dialogToolbar: [{
        text: '取消',
        type: 'default',
        func: done => done()
      }, {
        text: '确定',
        func: done => {
          this.checked.map(label => {
            if (!this.list.find(el => el.label === label)) {
              const checkbox = this.featureList.find(el => el.label === label)

              this.list.push(checkbox)
            }
          })
          done()
        }
      }]
    }
  },

  watch: {
    dialogVisible (val) {
      if (val) {
        this.initCheckList()
        this.checked = []
      }
    }
  },

  // computed: {
  //   noCommonUseStatu () {
  //     if (this.list && this.list.length && !this.featureCardLoading) {
  //       return true
  //     }
  //     return false
  //   }
  // },

  created () {
    // this.noCommonUseStatu = true
    this.getCollection()
  },

  methods: {
    handlerCommonUseStatu () {
      if (this.list && this.list.length && !this.featureCardLoading) {
        this.noCommonUseStatu = true
        return
      }
      this.noCommonUseStatu = false
    },
    handlerSrc (item) {
      if (item.icon) {
        return `${this.$$.BASE_URL}${this.getImageApi}${item.icon}`
      } else {
        return this.imageResource
      }
    },
    // BUG: 无法跳转
    routerPush (href) {
      this.$router.push(href)
    },

    moveStart (e) {
      this.draggingIdx = e.oldIndex
      this.dragging = true
    },

    moveEnd (e) {
      this.dragging = false
    },

    deleteCollection (idx) {
      this.list.splice(idx, 1)
    },

    getCollection () {
      this.loading = true

      return req('getCollection', {collectionType: 0}).then(res => {
        this.loading = false
        this.list = JSON.parse(res.collectionContent)
        this.handlerCommonUseStatu()
        this.checked = this.list.map(el => el.label)
        this.initCheckList()
      }).catch(
        () => (this.loading = false)
      )
    },

    postCollection () {
      return req('postCollection', {
        collectionContent: JSON.stringify(this.list)
      })
    },

    toggleEditing () {
      this.editing = !this.editing
    },

    updateCollection () {
      this.$router.push({ path: '/commonUse' })
      // this.toggleEditing()

      // this.editing || this.postCollection().then(
      //   res => res && this.getCollection()
      // )
    },

    cancelUpdate () {
      this.toggleEditing()
      this.getCollection()
    },

    initCheckList () {
      const ret = this.featureList.filter(
        f => !this.list.find(l => l.label === f.label)
      )

      this.checkList = ret.map(el => el.label)
    }
  },

  components: {
    ISvgIcon,
    Draggable,
    IDialog
  }
}
</script>

<style lang="scss" scoped>
$icon-width: 80px;

.feature-list {
  width: 100%;
  .header-edit {
    .edit + .edit {
      margin-left: 10px;
    }
  }
  .icon-nav {
    width: 100%;
    min-height: 149px;
    padding: 11px 0;
    box-sizing: border-box;
    overflow: hidden;
    font-size: 0;
    .noCommonUse {
      text-align: center;
      letter-spacing: 3px;
      font-size: 16px;
      height: 100px;
      line-height: 100px;
      color: #909399;
    }
    .icon-wrap {
      display: inline-block;
      width: $icon-width;
      cursor: pointer;
      margin: 19px calc((100% - #{$icon-width * 8}) / 16);
      text-align: center;
      position: relative;
      // transition: all 1s;
      &:hover:not(.editing) {
        .label {
          color: #3DA5FE;
        }
      }
      &.editing {
        cursor: move;
      }
      .delete {
        position: absolute;
        right: 0;
        color: #e7463e;
        font-size: 15px;
        cursor: pointer;
      }
      .create {
        border: 1px dashed #E5E5E5;
        color: #E5E5E5;
        padding: 10px;
        vertical-align: 20px;
        border-radius: 2px;
        font-size: 30px;
      }
      &.dragging {
        opacity: 0;
      }
      .label {
        margin-top: 6px;
        font-size: 12px;
        color: #4D4D4D;
        height: 18px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}

.dragging-active {
  transition: all 1s;
  opacity: 0;
}
</style>
