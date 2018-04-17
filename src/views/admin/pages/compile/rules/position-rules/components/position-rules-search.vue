<template>
  <i-form slot="header" @reset="reset" @search="search">
    <el-form-item label="所属集群">
      <i-select v-model="searchBox.clusterCode" parameter="CLUSTER_CODE"></i-select>
    </el-form-item>
    <el-form-item label="业态">
      <i-select v-model="searchBox.businessType" parameter="ORG_BUSINESS_TYPE" clearable></i-select>
    </el-form-item>
    <el-form-item label="标准小店">
      <i-select v-model="searchBox.orgStandardId" :options="shopOptions" :props="{value: 'orgStandardId', label: 'orgStandardName'}"></i-select>
    </el-form-item>
    <el-form-item label="职     务">
      <i-select v-model="searchBox.posTitleId" :options="positionOptions" :props="{value: 'posTitleId', label: 'name'}"></i-select>
    </el-form-item>
    <el-form-item label="规则状态">
      <i-select v-model="searchBox.ruleStatus" parameter="RULE_STATUS"></i-select>
    </el-form-item>
  </i-form>
</template>

<script>
export default {
  name: 'PositionRulesSearch',
  components: {

  },
  // 可用小店下拉选项，可用职务下拉选项
  props: ['shopOptions', 'positionOptions'],
  data () {
    return {
      // 绑定对象
      searchBox: {
        clusterCode: null,
        businessType: null,
        orgStandardId: null,
        posTitleId: null,
        ruleStatus: null
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
