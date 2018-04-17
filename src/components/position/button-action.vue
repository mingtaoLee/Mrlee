<template>
  <div class="wrap">
    <div class="button-action">
      <el-button type="info" @click="newOc">新建</el-button>
    </div>
    <div class="button-action">
      <el-button type="info" @click="modifyOc">修改</el-button>
    </div>
    <div class="button-action">
      <el-button type="info" @click="cancelOc">撤销</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ButtonAction',
  data () {
    return {

    }
  },

  methods: {

  },

  created () {

  }
}
</script>

<style lang="scss" scoped>
  .wrap{
    width:100%
  }
  .button-action{
    display: inline-block;
    width:60px;
    height:36px;
    margin-right:20px;
  }
</style>
