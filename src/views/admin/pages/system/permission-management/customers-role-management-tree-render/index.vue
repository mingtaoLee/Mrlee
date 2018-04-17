<template>
  <span class="tree-expand customers-role-management-tree-render" style="height:auto">
    <span class="tree-label">
        <div class="node-title-container">
          <span class="node-title">{{DATA.menuName}}：</span>
        </div>
        <div class="tree-url">
          <el-checkbox v-if="showCheckAllBox" v-model="checkAll" @change="handleCheckAllChange">全选当前菜单url</el-checkbox>
          <el-checkbox-group v-model="jurisdictionValue" @change="handleCheckedUrlChange">
            <el-checkbox v-for="urlObj in DATA.urlList" :label="urlObj.urlName" :key="urlObj">{{urlObj.urlName}}</el-checkbox>
          </el-checkbox-group>
        </div>
    </span>
  </span>
</template>

<script>
export default{
  props: ['NODE', 'DATA', 'STORE'],
  data () {
    return {
      // 记录菜单中url配置数据
      jurisdictionValue: [],
      // 是否显示全选当前菜单url按钮
      showCheckAllBox: false,
      // 全选url
      checkAll: false
    }
  },
  watch: {
    DATA: {
      handler: function (val) {
        this.DATAWatch(val)
      },
      deep: true
    }
  },
  methods: {
    // 处理urlList中数据并且判断urlLIst是否存在元素,
    showUrlBox () {
      this.DATA.isHadPower === 'Y' && this.$emit('setCheckBox', this.DATA.menuId)
      this.DATA.urlList.length > 0 && (this.DATA.urlList = this.DATA.urlList.filter((val, idx) => {
        return val.isPublic !== 'Y'
      }))
      if (this.DATA.urlList.length > 0) {
        this.showCheckAllBox = true
        this.DATA.urlList.map((val, idx) => {
          if (val.isHadPower === 'Y' && this.jurisdictionValue.indexOf(val.urlName) < 0) {
            this.jurisdictionValue.push(val.urlName)
          }
        })
      } else {
        this.showCheckAllBox = false
      }
    },
    handleCheckAllChange (boolean) {
      if (boolean) {
        this.checkAll = true
        this.jurisdictionValue = this.DATA.urlList.map(val => {
          val.isHadPower = 'Y'
          return val.urlName
        })
        this.$emit('jurisdictionValue', this.jurisdictionValue, this.DATA.menuId)
      } else {
        this.checkAll = false
        this.DATA.urlList.map(val => {
          val.isHadPower = 'N'
        })
        this.jurisdictionValue = []
      }
    },
    handleCheckedUrlChange (val) {
      val.length < this.DATA.urlList.length && (this.checkAll = false)
      val.length === this.DATA.urlList.length && (this.checkAll = true)
      // 告诉父组件，我选择了哪些数据
      this.$emit('jurisdictionValue', val, this.DATA.menuId)
    },
    // 当父组件树节点点击时DATA发生改变
    DATAWatch (data) {
      data.urlList.map((val, idx) => {
        if (val.isHadPower === 'Y') {
          if (this.jurisdictionValue.indexOf(val.urlName) < 0) {
            this.jurisdictionValue.push(val.urlName)
          }
        } else {
          if (this.jurisdictionValue.indexOf(val.urlName) >= 0) {
            let idx = this.jurisdictionValue.indexOf(val.urlName)
            this.jurisdictionValue.splice(idx, 1)
          }
        }
      })
      this.jurisdictionValue.length < this.DATA.urlList.length && (this.checkAll = false)
      this.jurisdictionValue.length === this.DATA.urlList.length && (this.checkAll = true)
    }
  },
  mounted () {
    this.showUrlBox()
  }
}
</script>

<style lang='scss'>
    .customers-role-management-tree-render {
      margin-left: 2px;
      width: 100%;
      .tree-label {
        // padding-top: 40px;
        .tree-url {
          .el-checkbox {
            margin: 5px 30px 0 0;
            padding: 3px 0;
            .el-checkbox__label {
              font-size: 13px;
              [class*=" el-icon-"] {
                vertical-align: topLine;
              }
            }
          }
        }
        .node-title-container {
          // background-color: rgb(65, 156, 187);
          .node-title {
            font-size: 14px;
            color: #5A5E36
          }
        }
      }
    }
</style>
