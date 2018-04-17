<template>
  <i-form
    slot="header" @reset="reset" @search="search">
    <el-form-item>
      <span slot="label">所属集群</span>
      <i-select v-model="searchBox.clusterCode" parameter="CLUSTER_CODE" clearable></i-select>
    </el-form-item>
    <el-form-item label="业态">
      <i-select v-model="searchBox.businessType" parameter="ORG_BUSINESS_TYPE" clearable></i-select>
    </el-form-item>
    <el-form-item>
      <span slot="label">标准小店</span>
      <el-select v-model="searchBox.orgStandardId" filterable clearable>
        <el-option
          v-for="item in shopList"
          :key="item.orgStandardId"
          :label="item.orgStandardName"
          :value="item.orgStandardId"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <span slot="label">规则状态</span>
      <i-select v-model="searchBox.ruleStatus" parameter="RULE_STATUS" clearable></i-select>
    </el-form-item>
  </i-form>
</template>

<script>
  export default {
    name: 'ShopRulesSearch',
    components: {

    },
    props: ['shopList'],
    data () {
      return {
        // 存放搜索的表单数据
        searchBox: {
          clusterCode: '',
          businessType: '',
          orgStandardId: '',
          ruleStatus: ''
        },
        clusterOptions: null,
        shopOptions: null,
        statusOptions: {}
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
