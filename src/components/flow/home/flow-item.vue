<template>
  <div class="flow-item">
    <el-radio v-model="radio" label="1">入职流程</el-radio>
    <span>
      <i class="icon iconfont icon-star-full cancel-colect"></i>
      <i class="icon iconfont icon-star-empty colect"></i>
    </span>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        radio: '2'
      }
    },

    methods: {

    },

    created () {

    }
  }
</script>

<style lang="scss" scoped>
  .flow-item {
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    margin-left: 20px;
    padding: 0 10px;
    &:hover {
      background-color: #F1F3F6;
    }
    span > i {
      font-size: 20px;
      cursor: pointer;
      &.colect {
        color: #D3DCE6;
      }
      &.cancel-colect {
        color: #3DA5FE;
      }
    }
  }
</style>