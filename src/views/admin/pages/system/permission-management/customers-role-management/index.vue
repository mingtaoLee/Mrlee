<template>
  <div class="customersRoleManagement">
    <h1 class="base">
      <i class="el-icon-back goBackIcon" @click="goBack"></i>
      <span> {{roleName}}</span>
    </h1>
  <i-layout>
    <div slot="header">
      <template>
        <el-tabs v-model="activeTabName" type="card" @tab-click="getActiveTreeData">
          <el-tab-pane 
            v-for="item in tabsMennu"
            :key="item.menuId"
            :label="item.menuName"
            :name="item.menuId"
          ></el-tab-pane>
        </el-tabs>
      </template>
    </div>
    <div
      slot="section"
      class="myTree"
      v-loading="loading"
      :element-loading-text="$loadingText">
      <div class="section-tree" :style="{height: heightData}">
        <el-tree
          v-if="dataIsOk"
          ref="roleTree"
          :data="activeTreeData"
          :props="treeDataProps"
          show-checkbox
          accordion
          node-key="menuId"
          :render-after-expand="false"
          :expand-on-click-node="true"
          :render-content="renderContent"
          default-expand-all
          @node-click="nodeClick"
          @check-change="checkChange">
        </el-tree>
        <!-- :default-expanded-keys="defaultExpandedKeys" -->
      </div>
      <div class="btn" v-if="showBut">
        <el-button type="plain" size="mini" @click="goToRoleManagement">返回</el-button>
        <el-button type="primary" size="mini" @click="postSetting" :loading="loading || loading2">提交</el-button>
      </div>
    </div>
  </i-layout>
  </div>
</template>

<script>
import req from 'api/system/role-management'
export default {
  data () {
    return {
      loading: true,
      loading2: false,
      roleId: this.$route.query.roleId,
      roleName: this.$route.query.roleName,
      // 数据更新后重新渲染树节点
      dataIsOk: true,
      // tabs标签页数据
      tabsMennu: [],
      // 当前激活的tab标签页标识符
      activeTabName: '',
      // 记录当前页面请求到的扁平化数组数据，提交数据和对比数据变化都需要用到
      remeberActiveAarrayData: [],
      // 数据回显记录需要打勾节点urlId
      remeberActiveTreeDataUrlId: [],
      // 记录提交数据时所有isHadPower为Y的menuId和urlId
      remeberActiveTreeDataId: [],
      // 当前页面树结构数据
      activeTreeData: [],
      // 默认展开的节点
      defaultExpandedKeys: [],
      treeDataProps: {
        children: 'children',
        label: 'menuName'
      },
      // 是否显示返回和提交按钮
      showBut: false,
      // 功能权限配置修改是否被保存
      powerWeatherChanged: false,
      // 功能权限配置是否已经保存
      // powerWeatherSaved: false
      // 记录一下旧值
      remeberOldValue: '',
      heightData: '100px'
    }
  },

  watch: {
    activeTabName (newVal, oldVal) {
      if (oldVal !== '' && oldVal !== '0') {
        if (this.remeberOldValue !== newVal) {
          this.clickTabs(newVal, oldVal)
        }
      }
    }
  },

  methods: {
    goBack () {
      this.$router.go(-1)
    },
    // 获取tabs标签页数据
    getTabsMenuData () {
      req('getJurisdictionTabs')
      .then(res => {
        this.tabsMennu = this.doSort(res)
        this.activeTabName = this.tabsMennu[0].menuId
        this.remeberOldValue = this.tabsMennu[0].menuId
        // 获取tab标签对应树结构数据
        this.loading = true
        this.getTabTreeData()
      })
    },
    // 给tabs标签页重新排序
    doSort (arrData) {
      if (arrData.length <= 1) {
        return arrData
      }
      let midIndex = Math.floor(arrData.length / 2)
      let midValue = arrData.splice(midIndex, 1)
      let left = []
      let right = []
      arrData.map((val, idx) => {
        if (val.orderNo <= midValue[0].orderNo) {
          left.push(val)
        } else {
          right.push(val)
        }
      })
      return this.doSort(left).concat(midValue, this.doSort(right))
    },
    // tabs标签页点击事件
    clickTabs (newVal, oldVal) {
      this.weatherChange()
      console.log(this.powerWeatherChanged)
      if (this.powerWeatherChanged) {
        this.$confirm(`您即将切换配置项，请确定您的相关配置是否已经保存，您确定离开吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataIsOk = false
          this.activeTabName = newVal
          this.remeberOldValue = newVal
          this.powerWeatherChanged = false
          // this.dataIsOk = true
          this.loading = true
          this.getTabTreeData()
        }).catch(() => {
          this.activeTabName = oldVal
        })
      } else {
        this.dataIsOk = false
        this.activeTabName = newVal
        this.remeberOldValue = newVal
        // this.dataIsOk = true
        this.loading = true
        this.getTabTreeData()
      }
    },
    // 提示弹窗弹出之前先要判断当前数据配置是否被修改了
    weatherChange () {
      this.handlerSetting()
      // this.powerWeatherChanged = true
    },
    // 获取tab标签对应的树结构数据
    getTabTreeData () {
      req('getTabTreeData', {
        roleId: this.$route.query.roleId,
        topMenuId: this.activeTabName
      }).then(res => {
        this.dataIsOk = true
        this.ActiveTreeDataUrlId(res.roleMenuList)
        this.remeberActiveAarrayData = JSON.parse(JSON.stringify(res.roleMenuList))
        let obj = null
        res.roleMenuList.map((val, idx) => {
          // val.parentMenuId === '-1' && (obj = Object.assign({}, res.roleMenuList[idx]))
          val.parentMenuId === '-1' && (obj = JSON.parse(JSON.stringify(res.roleMenuList[idx])))
          return
        })
        this.activeTreeData = [this.handlerTreeDataUrlList(this.handlerTreeData(obj, res.roleMenuList))]
        this.remeberActiveAarrayData.map(val => {
          !val.urlList.length && this.defaultExpandedKeys.push(val.menuId)
        })
        this.showBut = true
        this.$nextTick(function () {
          this.doChecked(this.remeberActiveTreeDataUrlId)
        })
        this.loading = false
        // this.doChecked(this.remeberActiveTreeDataUrlId)
      })
      .catch(() => {
        this.loading = false
      })
    },
    // 数据回显，过滤出需要打勾的节点
    ActiveTreeDataUrlId (data) {
      let menuIdArr = []
      this.remeberActiveTreeDataUrlId = []
      data.map(val => {
        val.urlList && val.urlList.length && val.urlList.map(val2 => {
          val2.isHadPower === 'Y' && this.remeberActiveTreeDataUrlId.push(val2.urlId)
        })
        if (!val.urlList || !val.urlList.length) {
          val.isHadPower === 'Y' && menuIdArr.push(val.menuId)
        }
      })
      menuIdArr.map(val => {
        let count = 0
        data.map(val2 => {
          val === val2.parentMenuId && count++
        })
        !count && this.remeberActiveTreeDataUrlId.push(val)
      })
    },
    // 打勾
    doChecked (data) {
      this.$refs.roleTree.setCheckedKeys(data)
    },
    // 1、扁平数组树结构化
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
    // 2、处理树结构数据中urlList
    handlerTreeDataUrlList (data) {
      data.urlList && data.urlList.length && data.urlList.map(val => {
        this.$set(val, 'menuId', val.urlId)
        this.$set(val, 'menuName', val.urlName)
        // let obj = Object.assign({}, val, {'menuId': val.urlId, 'menuName': val.urlName})
        data.children.push(val)
      })
      data.children && data.children.length && data.children.map(val => {
        this.handlerTreeDataUrlList(val)
      })
      return data
    },
    renderContent (h, {data, node, store}) {
      let className2 = ''
      if (Object.keys(data).indexOf('urlId') >= 0) {
        className2 = 'urlSpan'
      } else {
        className2 = 'no'
      }
      return (
        <span class={className2}>
          <span>{node.label}</span>
        </span>)
    },
    // 返回角色列表页面
    goToRoleManagement () {
      this.$router.push('/system/permission/role_management')
      // this.$router.back(-1)
    },
    // 提交数据
    postSetting () {
      this.loading2 = true
      this.handlerSetting()
      req('submitJurisdictionList', {roleId: this.$route.query.roleId, topMenuId: this.activeTabName, roleMenuList: this.remeberActiveAarrayData})
      .then(res => {
        this.powerWeatherChanged = false
        this.$message.success('保存成功')
        this.loading2 = false
      })
      .catch(() => {
        this.loading2 = false
      })
    },
    // 1、提交数据前先处理一下数据的值
    handlerSetting () {
      let checkedKeyArr = this.$refs.roleTree.getCheckedKeys()
      this.remeberActiveTreeDataId = [...checkedKeyArr]
      this.findAll(checkedKeyArr)
      this.changeValue(this.remeberActiveTreeDataId)
    },
    // 找出所有isHadPower需要变为Y的menuId和urlId
    findAll (checkedKeyArr) {
      let active = []
      this.remeberActiveAarrayData.map(val => {
        if (checkedKeyArr.indexOf(val.menuId) >= 0) {
          this.remeberActiveTreeDataId.indexOf(val.parentMenuId) === -1 && this.remeberActiveTreeDataId.push(val.parentMenuId)
          active.push(val.parentMenuId)
        }
        val.urlList && val.urlList.length && val.urlList.map(urlVal => {
          if (checkedKeyArr.indexOf(urlVal.urlId) >= 0) {
            this.remeberActiveTreeDataId.indexOf(val.menuId) === -1 && this.remeberActiveTreeDataId.push(val.menuId)
            active.push(val.menuId)
          }
        })
      })
      if (active.length) {
        this.findAll(active)
      } else {
        return
      }
    },
    // 根据选择的menuId和urlId去改变原始数据的值
    changeValue (remeberActiveTreeDataId) {
      this.remeberActiveAarrayData.map(val => {
        // 先处理每个节点对象
        if (remeberActiveTreeDataId.indexOf(val.menuId) >= 0) {
          if (val.isHadPower !== 'Y') {
            val.isHadPower = 'Y'
            this.powerWeatherChanged = true
          }
          // val.isHadPower = 'Y'
        } else {
          if (val.isHadPower !== 'N') {
            val.isHadPower = 'N'
            this.powerWeatherChanged = true
          }
          // val.isHadPower = 'N'
        }
        // 在处理urlList
        val.urlList && val.urlList.length && val.urlList.map(val2 => {
          if (remeberActiveTreeDataId.indexOf(val2.urlId) >= 0) {
            if (val2.isHadPower !== 'Y') {
              val2.isHadPower = 'Y'
              this.powerWeatherChanged = true
            }
            // val2.isHadPower = 'Y'
          } else {
            if (val2.isHadPower !== 'N') {
              val2.isHadPower = 'N'
              this.powerWeatherChanged = true
            }
            // val2.isHadPower = 'N'
          }
        })
      })
    }
  },

  created () {
    this.getTabsMenuData()
  },

  mounted () {
    let sectionHeight = document.getElementsByClassName('customersRoleManagement')[0].offsetHeight
    this.heightData = (sectionHeight - 55 - 15 - 15 - 58) + 'px'
  },

  updated () {
    this.$nextTick(function () {
      if (this.activeTreeData.length) {
        let box = this.$el
        let boxarr = box.getElementsByClassName('is-leaf')
        for (let i = 0; i < boxarr.length; i++) {
          if (boxarr[i].nextSibling.nextSibling.nextSibling.className === 'urlSpan') {
            boxarr[i].parentNode.parentNode.style.display = 'inline-flex'
          }
        }
      }
    })
  }
}
</script>

<style lang="scss">
.customersRoleManagement {
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
.base {
  width: 100%;
  height: 50px;
  background: #FFFFFF;
  font-size: 18px;
  line-height: 50px;
  i {
    display: inline-block;
    padding: 0 20px;
    cursor: pointer;
  }
  i:hover{
    color: #409EFF;
  }
  span {
    display: inline-block;
    border-left: 1px solid #ccc;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
  }
}
  .el-tree {
    .el-tree-node {
      white-space: normal;
    }
  }
  .section-tree {
    // height: 420px;
    overflow: auto;
  }
  .btn {
    position: fixed;
    bottom: 30px;
    z-index: 999;
  }
}
</style>
