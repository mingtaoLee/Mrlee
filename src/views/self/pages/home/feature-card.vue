<template>
  <section class="feature-list card list-card">
    <header>
      <h3>常用功能 </h3>
      <div class="header-edit">
        <span class="edit" v-show="editing" @click="cancelUpdate">取消</span> 
        <span class="edit" @click="updateCollection">{{ editing ? '完成' : '编辑' }}</span>
      </div>
    </header>
    <div class="icon-arrows" >
      <!-- 左右箭头的图标 -->
      <i class="iconfont icon-style icon-linear-arrow-right" @click.stop="featureRight" v-show="list.length != 0"></i>
      <i class="iconfont icon-style icon-goback" @click.stop="featureLeft" v-show="list.length != 0"></i>
      <div class="icon-card" ref="icon_card" v-if="list.length != 0">
        <div ref="icon_nav" class="icon-nav activeRight" >
            <draggable
            v-model="list"
            :options="{ animation: 150, disabled: !editing, dragClass: 'dragging-active', draggable:'a.icon-wrap' }"
            @start="moveStart"
            @end="moveEnd"
            element="nav"
            :style="`width:${appearWidth}px`"
            v-loading="loading"
            :element-loading-text="$loadingText">
            <router-link
              v-for="(item, idx) of list"
              tag="div"
              :key="idx"
              :to="item.menuAddress"
              :class="['icon-wrap', { editing: editing, dragging: dragging && draggingIdx === idx }]"
              :style="featureMargin"
              >
              <!-- <i
                class="iconfont icon-reduce delete"
                v-show="editing"
                @click.stop="deleteCollection(idx)"
              >
              </i> -->
              <!-- <i-svg-icon :iconName="item.icon" :styleName="iconStyle"/> -->
              <img :src="handlerSrc(item)" :style="iconStyle" :onerror="errorWay + ';this.onerror=null'">
              <p class="label">{{ item.menuName }}</p>
            </router-link>
  
            <!-- <span
              class="icon-wrap"
              style="margin-top: 35px"
              v-show="editing && list.length < 16"
              @click="dialogVisible = true">
              <i class="iconfont icon-add-o create"></i>
              <p class="label">添加</p>
            </span> -->
          </draggable>
        </div>
      </div>
      <div v-else>
        <p class="defaultText">你还有没有常用功能，请去添加你的常用功能吧!</p>
      </div>
    </div>

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

export default {
  data () {
    return {
      iconStyle: {
        width: '56px',
        height: '56px'
      },
      appearWidth: '',
      appearMargin: '',
      checked: [],
      editing: false,
      dragging: false,
      draggingIdx: -1,
      loading: false,
      hist: 0,
      sum: 0,
      RightSum: 0,
      featureWidths: 0,
      featureListMargin: 0,
      errorWay: 'this.src="' + require('@/assets/images/623893360654657755.png') + '"',
      list: [
        // { label: '我的工资', href: '/self_compensation', icon: 'wodegongzi' },
        // { label: '我的绩效', href: '/self_performance', icon: 'wodejixiao' },
        // { label: '我的团队', href: '/myTeam', icon: 'tuanduichengyuan' },
        // { label: '我的保险', href: '/myInsurance', icon: 'wodebaoxian' },
        // { label: '劳动合同', href: '/labor-contract', icon: 'laodonghetong' },
        // { label: '我的招聘', href: '/self_recruit', icon: 'wodezhaopin' },
        // { label: '我的招聘', href: '/self_recruit', icon: 'wodezhaopin' },
        // { label: '我的招聘', href: '/self_recruit', icon: 'wodezhaopin' },
        // { label: '我的招聘', href: '/self_recruit', icon: 'wodezhaopin' },
        // { label: '流程中心', href: '/flow', icon: 'liuchengzhongxin' }
        // { label: '个人发展', href: '/self.html#/self_recruit', icon: 'user-thunder' },
      ],
      checkList: [],
      // list: [],

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
              // console.log(this.list)
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

  created () {
    this.getCollection()
  },
  mounted () {
    let featureWidth = document.getElementsByClassName('icon-arrows')[0]
    this.featureWidths = this.getStyle(featureWidth, 'width')
  },
  computed: {
    featureMargin () {
      this.featureListMargin = parseInt((parseInt(this.featureWidths) - (85 * 8) - 120) / 8 / 2)
      return `margin: 19px ${this.featureListMargin}px;`
    }
  },
  methods: {
    // 点击左边
    featureLeft () {
      // clientWidth()
      let num = Math.ceil(this.appearWidth / this.$refs.icon_card.offsetWidth)
      // let leftNum = this.$refs.icon_card.offsetWidth * this.sum - this.$refs.icon_card.offsetWidth
      if (this.hist > 0) {
        this.hist -= 1
      }
      if (this.hist >= 0 && this.hist < num) {
        this.$refs.icon_nav.style.transform = `translateX(${-this.$refs.icon_card.offsetWidth * this.hist}px)`
      }
    },
    // 点击右边
    featureRight () {
      let num = Math.ceil(this.appearWidth / this.$refs.icon_card.offsetWidth)
      if (this.hist < (num - 1)) {
        this.hist += 1
      }
      if (this.hist < num) {
        this.RightSum = -this.$refs.icon_card.offsetWidth * this.hist
        this.$refs.icon_nav.style.transform = `translateX(${-this.$refs.icon_card.offsetWidth * this.hist}px)`
      }
    },
    // BUG: 无法跳转
    routerPush (href) {
      this.$router.push(href)
    },

    moveStart (e) {
      // console.log(e)
      this.draggingIdx = e.oldIndex
      this.dragging = true
    },

    moveEnd (e) {
      // console.log(e)
      this.dragging = false
    },

    deleteCollection (idx) {
      this.list.splice(idx, 1)
    },

    getCollection () {
      this.loading = true
      return req('getCollection', {collectionType: 1}).then(res => {
        this.list = JSON.parse(res.collectionContent)
        // this.appearMargin = '19px ' +
        // this.checked = this.list.map(el => el.label)
        // console.log(this.checked, 'checked')
        // this.initCheckList()
        // this.appearWidth = this.list.length * (85 + this.featureListMargin * 2) + 120
        if (this.list.length > 8) {
          this.appearWidth = (parseInt(this.featureWidths) - 120) * 2
        } else {
          this.appearWidth = parseInt(this.featureWidths) - 120
        }
        console.log(this.appearWidth)
        this.loading = false
        // console.log(this.list)
      }).catch(
        () => (this.loading = false)
      )
    },

    postCollection () {
      return req('postCollection', {
        collectionContent: JSON.stringify(this.list)
      })
    },

    // toggleEditing () {
    //   this.editing = !this.editing
    // },

    updateCollection () {
      // this.toggleEditing()

      // this.editing || this.postCollection().then(
      //   res => res && this.getCollection()
      // )
      this.$router.push({path: '/CommonFeatureCard'})
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
    },
    handlerSrc (item) {
      if (item.icon) {
        return `${this.$$.BASE_URL}${this.getImageApi}${item.icon}`
      } else {
        return this.imageResource
      }
    },
    // 动态获取宽度
    getStyle (obj, name) {
      if (obj.currentStyle) {
        // return obj.currentStyle[name]
        return getComputedStyle(obj, false)[name]
      } else {
        return getComputedStyle(obj, false)[name]
      }
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
.activeRight {
  transition: all 1s;
  position: absolute;
  width: 100%
}
.feature-list {
  width: 100%;
  .header-edit {
    .edit + .edit {
      margin-left: 10px;
    }
  }
  .icon-arrows {
    position: relative;
    height: 100%;
    /* height: 70%;
    overflow: auto; */
    .icon-style {
      position: absolute;
      color: #999999;
      top: 33%;
      transform: rotateY(-50%);
      font-size: 22px;
      cursor: pointer;
      z-index: 5;
      &:hover {
        color: #3DA5FE;
      }
    }
    .icon-linear-arrow-right{
      right:20px;

    }
    .icon-goback {
      left: 20px;
    }
    .icon-card {
      margin: 0 60px;
      box-sizing: border-box;
      overflow: hidden;
      height: 100%;
      position: relative;
    }
    .defaultText {
      text-align: center;
      margin: 5%;
    }
  }
  .icon-nav {
    position: absolute;
    transition: all 1s;
    min-height: 80px;
    box-sizing: border-box;
    // overflow: hidden;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%,-50%);
    .icon-wrap {
      display: inline-block;
      width: 85px;
      cursor: pointer;
      margin: 20px;
      // margin: 19px calc((100% - #{$icon-width * 8}) / 8);
      text-align: center;
      position: relative;
      // transition: all 1s;
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
        vertical-align: 13px;
        border-radius: 2px;
        font-size: 30px;
      }
      &.dragging {
        opacity: 0;
      }
      .label {
        margin-top: 6px;
        font-size: 13px;
        color: #4D4D4D;
        font-family: 'PingFangSC-Medium';
      }
    }
  }
}

.dragging-active {
  transition: all 1s;
  opacity: 0;
}
</style>
