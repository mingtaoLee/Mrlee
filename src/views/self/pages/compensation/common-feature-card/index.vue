<template>
 <el-container>
    <el-main :style="containerStyle">
      <feature-card
        ref="featureCard"
        :list="chooseedCommonUse"
        :featureCardLoading="featureCardLoading"
        @haveDone="handlerHaveDone($event)"
        @deleteCollection="handlerDeleteCollection($event)"></feature-card>
      <aside class="schedule-list list-card card" :style="cardStyle">
        <header class="cfc-header">
          <h3>添加常用功能</h3>
        </header>
        <section class="schedule-nav" v-loading="cardLoading" :element-loading-text="$loadingText">
            <table-structure
                :menuObj="menuData"
                :deleteObj="deleteObj"
                @handlerCheckboxEvent="handlerCheckboxEvent($event)">
            </table-structure> 
            <div class="saveBtn">
              <el-button type="plain" size="mini" @click="goBack()">返回</el-button>
              <el-button class="btn" :loading="savLoading" type="primary" size="mini" @click="save()">保存</el-button>
            </div>
        </section>
      </aside>
    </el-main>
  </el-container>
</template>
<script>
import featureCard from './feature-card'
import tableStructure from './table-structure'
import req from 'api/self/home'
// import reqs from 'api/common/home'
// import testData from './test-data.js'
// import {jsonTree} from 'utils'
export default {
  components: {
    featureCard,
    tableStructure
  },
  data () {
    return {
      data: '',
      menuData: [],
      chooseedCommonUse: [],
      savLoading: false
    }
  },
  created () {
    this.getCollection()
  },
  mounted () {
  },
  methods: {
    getMenu (data) {
      req('defaultmenus')
      .then(res => {
        console.log(data, '这里是传进来的data')
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
        Object.values(res).map(val2 => {
          if (val.menuId === val2.menuId) {
            console.log(val.menuId, 'val')
            console.log(val2.menuId, 'val2')
            this.$set(val2, 'weatherChecked', true)
            this.chooseedCommonUse.push(val2)
          }
        })
      })
      return res
    },
    handlerMenuData (data) {
      console.log(data, 'data')
      data.map(val => {
        val.parentMenuId === '-1' && this.menuData.push(val)
      })
      this.menuData.map(val => {
        val = this.handlerTreeData(val, data)
      })
      this.menuData.forEach(item => {
        this.menuData = item
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
      this.$router.push('/')
    },
    save () {
      this.savLoading = true
      req('postCollection', {collectionContent: JSON.stringify(this.chooseedCommonUse), collectionType: 1})
      .then(res => {
        this.savLoading = false
        this.$message.success('保存成功')
        this.$router.push('/')
      })
    },
    getCollection () {
      req('getCollection', {collectionType: 1})
        .then(res => {
          console.log(JSON.parse(res.collectionContent), 'JSON.parse(res.collectionContent)')
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
      console.log(this.chooseedCommonUse, 'this.choosed')
    }
  }
}
</script>

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
.card {
  width: 100%;
  padding-bottom: 50px;
  // max-height: 319px;
  // overflow: auto;
}
.schedule-nav {
  padding: 20px;
}
.saveBtn {
  width: 100%;
  height: 50px;
  line-height: 50px;
  // position: fixed;
  bottom: 0px;
  z-index: 999;
  background: #ffffff;
  opacity: 1;
  text-align: right;
  padding-right: 15px;
  // border-top: 1px solid #e8e8e8;
  .btn {
    margin-right: 20px;
  }
}

</style>

