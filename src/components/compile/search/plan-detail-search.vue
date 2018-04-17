<template>
  <i-form @reset="reset" @search="search">
    <el-form-item>
      <span slot="label">区域</span>
      <i-area-select v-model="searchBox.area"></i-area-select>
    </el-form-item>
    <el-form-item>
      <span slot="label">品类</span>
      <el-select
        collapse-tags
        placeholder=""
        v-model="searchBox.categorys"
        size="small"
        :multiple="true"
        clearable>
        <el-option
          v-for="item in searcherCategory"
          :key="item.posCategoryId"
          :label="item.name"
          :value="item.posCategoryId"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="组织类型">
      <i-select v-model="searchBox.orgType" parameter="ORG_TYPE" placeholder=""></i-select>
    </el-form-item>
    <el-form-item label="编制月份">
      <el-date-picker
        :editable="false"
        ref="month"
        v-model="searchBox.month"
        type="month">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="编制状态">
      <i-select v-model="searchBox.scaStatus" parameter="SCALE_REPORT_STATUS" placeholder=""></i-select>
    </el-form-item>
  </i-form>
</template>

<script>
/**
 * 封装高级搜索框,仅做过滤功能，抛出搜索方法
 */
import req from 'api/compile/index'
import {filter} from 'utils/compile'
import ISelect from 'components/common/i-select/i-select.vue'
import IForm from 'components/common/i-form/i-form.vue'
import IAreaSelect from 'components/common/i-area-select/i-area-select'
export default {
  name: 'PlanDetailSearch',
  components: {
    ISelect,
    IForm,
    IAreaSelect
  },
  data () {
    return {
      // 搜索的内容
      searchBox: {
        area: '',
        categorys: '',
        orgType: '',
        month: '',
        scaStatus: ''
      },
      // 品类列表数据
      searcherCategory: null
    }
  },
  methods: {
    // 重置功能
    reset () {
      Object.keys(this.searchBox).map(key => {
        this.searchBox[key] = ''
      })
      // 修复时间控件用户填写填写错误字段，重置不了的问题
      this.$refs.month.$children[0].currentValue = ''
    },
    // 搜索功能，仅做过滤
    search () {
      var params = filter(this.searchBox)
      console.log('搜索内容为', params)
      this.$emit('search', params)
    }
  },
  created () {
    req('getCategoryList').then(data => {
      this.searcherCategory = data
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
