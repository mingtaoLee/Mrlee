<template>
  <i-form @reset="reset" @search="search">
    <el-form-item label="查询名称">
      <el-input v-model.trim="searchBox.queryName" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <el-form-item label="创建者">
      <el-input v-model.trim="searchBox.createBy" placeholder="请输入" clearable></el-input>
    </el-form-item>
  </i-form>
</template>

<script>
export default {
  name: 'InquirySearch',
  components: {

  },
  data () {
    return {
      // 搜索条件对象
      searchBox: {
        queryName: null,
        createBy: null
      }
    }
  },
  created () {

  },
  methods: {
    // 重置搜索框
    reset () {
      Object.keys(this.searchBox).map(key => {
        this.searchBox[key] = null
      })
    },
    // 搜索
    search () {
      let params = this.searchBox
      this.$emit('search', params)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
