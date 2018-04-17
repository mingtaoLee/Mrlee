<template>
  <el-container>
    <el-main :style="containerStyle">
      <feature-card-two
        ref="featureCard"
        :list="chooseedCommonUse"
        :featureCardLoading="featureCardLoading"
        @haveDone="handlerHaveDone($event)"
        @deleteCollection="handlerDeleteCollection($event)"></feature-card-two>
      <aside class="schedule-list list-card card" :style="cardStyle">
        <header>
          <h3>添加常用功能</h3>
        </header>
        <section class="schedule-nav" v-loading="cardLoading" :element-loading-text="$loadingText">
          <template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane
                v-for="item of menuData"
                :key="item.menuId"
                :label="item.menuName"
                :name="item.menuId">
                <common-use-component
                  :menuObj="item"
                  :deleteObj="deleteObj"
                  @handlerCheckboxEvent="handlerCheckboxEvent($event)"></common-use-component>
              </el-tab-pane>
            </el-tabs>
          </template>
        </section>
      </aside>
    </el-main>
    <div class="saveBtn">
      <el-button type="plain" size="mini" @click="goBack()">返回</el-button>
      <el-button class="btn" type="primary" size="mini" @click="save()">保存</el-button>
    </div>
  </el-container>
</template>

<script>
import req from 'api/common/home'
import FeatureCardTwo from './feature-card-two'
import CommonUseComponent from './common-use-component'
export default {
  components: {
    FeatureCardTwo,
    CommonUseComponent
  },

  data () {
    return {
      activeName: '',
      cardLoading: true,
      featureCardLoading: true,
      menuData: [],
      cardStyle: {},
      chooseedCommonUse: [],
      deleteObj: {}
    }
  },

  computed: {
    containerStyle () {
      return {
        padding: '15px 15px 0 15px',
        minHeight: window.innerHeight - 60 - 30 + 'px'
      }
    }
  },

  methods: {
    getMenu (data) {
      req('getMenu')
      .then(res => {
        this.featureCardLoading = false
        this.handlerMenuData(this.handlerChecked(res, data))
        this.activeName = this.menuData[0].menuId
        this.cardLoading = false
      }).catch(() => {
        this.cardLoading = false
      })
    },
    handlerChecked (res, data) {
      data && data.map(val => {
        res.map(val2 => {
          if (val.menuId === val2.menuId) {
            this.$set(val2, 'weatherChecked', true)
            this.chooseedCommonUse.push(val2)
          }
        })
      })
      return res
    },
    handlerMenuData (data) {
      data.map(val => {
        val.parentMenuId === '-1' && this.menuData.push(val)
      })
      this.menuData.map(val => {
        val = this.handlerTreeData(val, data)
      })
    },
    handlerTreeData (obj, arrData) {
      obj.children = []
      arrData.map((val, idx) => {
        if (val.parentMenuId === obj.menuId) {
          obj.children.push(val)
        }
      })
      obj.children.map((val, idx) => {
        this.handlerTreeData(obj.children[idx], arrData)
      })
      return obj
    },
    handlerCardStyle () {
      this.headerHeight = this.$refs.featureCard.$el.offsetHeight
      return {
        minHeight: window.innerHeight - this.headerHeight - 90 + 'px'
      }
    },
    handlerCheckboxEvent (obj) {
      let statu = obj.statu
      let data = obj.data
      if (statu) {
        if (this.chooseedCommonUse.length >= 16) {
          this.$message.error('sorry！您最多只能选择16个常用功能')
          this.handlerDeleteCollection(data)
          return
        }
        this.chooseedCommonUse.push(data)
      } else {
        this.chooseedCommonUse.map((val, idx) => {
          val.menuId === data.menuId && this.chooseedCommonUse.splice(idx, 1)
        })
      }
    },
    goBack () {
      this.$router.push('/main')
    },
    save () {
      req('postCollection', {collectionContent: JSON.stringify(this.chooseedCommonUse), collectionType: 0})
      .then(res => {
        this.$message.success('保存成功')
        this.$router.push('/main')
      })
    },
    getCollection () {
      req('getCollection', {collectionType: 0})
        .then(res => {
          this.getMenu(JSON.parse(res.collectionContent))
        }).catch(() => {
          this.featureCardLoading = false
          this.cardLoading = false
        })
    },
    handlerDeleteCollection (data) {
      this.deleteObj = {...data}
      this.chooseedCommonUse.map((val, idx) => {
        val.menuId === data.menuId && this.chooseedCommonUse.splice(idx, 1)
      })
    }
  },

  created () {
    this.getCollection()
  },

  mounted () {
    this.cardStyle = this.handlerCardStyle()
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  padding-bottom: 50px;
}
.schedule-nav {
  padding: 20px;
}
.saveBtn {
  width: 100%;
  height: 50px;
  line-height: 50px;
  position: fixed;
  left: 0px;
  bottom: 0px;
  z-index: 999;
  background: #ffffff;
  opacity: 1;
  text-align: right;
  padding-right: 15px;
  border-top: 1px solid #e8e8e8;
  .btn {
    margin-right: 20px;
  }
}
</style>

<style lang="scss">
.schedule-nav {
  padding: 20px;
  .el-tabs {
    .el-tabs__header {
      margin: 0;
      .el-tabs__nav-prev {
        line-height: 36px;
      }
      .el-tabs__nav-next {
        line-height: 36px;
      }
      .el-tabs__item {
        height: 36px;
        line-height: 36px;
      }
    }
  }
}
</style>


