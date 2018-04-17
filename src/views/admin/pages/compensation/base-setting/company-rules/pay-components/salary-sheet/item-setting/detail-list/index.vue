<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <title class="title">
        <h2>备选项目库</h2>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
      </title>
      <ul class="item-list">
        <el-checkbox-group class="flex-space-between" v-model="checkedItems" @change="handleCheckedChange">
          <template v-for="item in itemList">
            <li>{{item.componentName}}</li>
            <el-checkbox :label="item.componentName" :key="item.componentName"></el-checkbox>
          </template>
        </el-checkbox-group>
      </ul>
    </el-col>
    <el-col :span="12">
      <h2>已选项目</h2>
      <ul>
        <li v-for="item of checkedItem">{{item.componentName}}</li>
      </ul>
    </el-col>
  </el-row>
</template>
<script>
//  import req from 'api/compensation/base-setting/company-rules'
  export default {
    name: '',
    props: {
      load: Function
    },
    components: {},
    data: function () {
      return {
        isIndeterminate: false,
        checkAll: false,
        checkedItems: []
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        // 获取项目列表
        this.load(data => {
          this.itemList = data
        })
      },
      handleCheckAllChange () {},
      handleCheckedChange () {},
      writeBack () {
      }
    }
  }
</script>
<style lang="scss" scoped>

  %title-line-height {
    height: 34px;
    line-height: 34px;
  }

  .title {
    @extend %title-line-height;
    @extend .flex-space-between
  }

  .h2 {
    font-size: 14px;
    font-weight: bold;
    @extend %title-line-height;
  }
</style>
