<template>
  <div class="wrap">
    <div class="ml20 mt20 mb10">
      <el-button type="primary" @click="newFrom">新增</el-button>
      <el-button type="primary" @click="deleteForm">删除</el-button>
    </div>
  </div>
</template>

<script>
/**
 * @emit newFrom 抛出一个新建的方法
 * @emit deleteForm 抛出一个删除的方法
 */
export default {
  name: 'NewDelBtn',
  methods: {
    newFrom () {
      this.$emit('newFrom')
    },
    deleteForm () {
      this.$emit('deleteFrom')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>