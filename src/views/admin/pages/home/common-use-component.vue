<template>
  <div class="lx-common-use-component">
    <div class="flag">
      <h3 v-if="firstArr.length">
        <i class="iconfont icon-menu"></i>
        {{menuObj.menuName}}
      </h3>
      <div class="indentDiv">
        <el-checkbox
        v-for="item of firstArr"
        :ref="item.menuId"
        :key="item" 
        :checked="item.weatherChecked"
        @change="handlerCheckboxEvent($event, item)">&nbsp;{{item.menuName}}</el-checkbox>
      </div>
    </div>
    <div class="item" v-for="item of menuObj.children" :key="item"  v-if="item.children.length">
      <h3>
        <i class="iconfont icon-menu"></i>
        {{item.menuName}}
      </h3>
      <div class="indentDiv">
        <div class="flagThree">
          <strong v-if="weatherShow(item)">{{item.menuName}}&nbsp;:&nbsp;</strong>
          <el-checkbox
            :ref="itemTwoTwo.menuId"
            v-if="!itemTwoTwo.children.length"
            v-for="itemTwoTwo of item.children"
            :key="itemTwoTwo"
            :checked="itemTwoTwo.weatherChecked"
            @change="handlerCheckboxEvent($event, itemTwoTwo)">&nbsp;{{itemTwoTwo.menuName}}</el-checkbox>
        </div>
        <div class="flagFinally" v-for="itemTwo of item.children" :key="itemTwo" v-if="itemTwo.children.length">
          <strong>{{itemTwo.menuName}}&nbsp;:&nbsp;</strong>
          <el-checkbox 
            v-for="itemThree of itemTwo.children"
            :ref="itemThree.menuId"
            :key="itemThree"
            :checked="itemThree.weatherChecked"
            @change="handlerCheckboxEvent($event, itemThree)">&nbsp;{{itemThree.menuName}}</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    menuObj: {
      default: {}
    },
    deleteObj: {
      default: {}
    }
  },

  data () {
    return {
      statu: false,
      firstArr: []
    }
  },

  watch: {
    deleteObj (newVal) {
      this.$refs[newVal.menuId] && (this.$refs[newVal.menuId][0]['selfModel'] = false)
    }
  },

  methods: {
    handlerFirstArr (data) {
      data.children.map(val => {
        !val.children.length && this.firstArr.push(val)
      })
    },
    weatherShow (data) {
      let count = 0
      data.children.map(val => {
        val.children.length && count++
      })
      if (!count || count === data.children.length) {
        return false
      }
      return true
    },
    handlerCheckboxEvent (statu, data) {
      this.$emit('handlerCheckboxEvent', {statu, data})
    }
  },

  created () {
    this.handlerFirstArr(this.menuObj)
  }
}
</script>

<style lang="scss" scoped>
.lx-common-use-component {
  .flag {
    margin-bottom: 15px;
    h3 {
      margin-bottom: 10px;
      font-size: 14px;
      color: #000;
    }
    .indentDiv {
      padding-left: 27px;
      line-height: 25px;
    }
  }
  .item {
    margin-bottom: 15px;
    h3 {
      margin-bottom: 10px;
      font-size: 14px;
      color: #000;
    }
    .indentDiv {
      padding-left: 27px;
      .flagThree {
        line-height: 30px;
        strong {
          color: #3f3d3d;
          font-size: 13px;
          font-weight: normal;
        }
      }
      .flagFinally {
        line-height: 30px;
        strong {
          color: #3f3d3d;
          font-size: 13px;
          font-weight: normal;
        }
      }
    }
  }
  .icon-menu::before {
    font-size: 12px;
    color: #878d99;
  }
}

</style>

<style lang="scss">
.lx-common-use-component {
  margin-top: 27px;
  .el-checkbox {
    margin-left: 0;
    margin-right: 30px;
    font-size: 12px;
  }
}
</style>


