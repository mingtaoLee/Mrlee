<template>
  <i-form @reset="reset" @search="search">
    <el-form-item label="计划名称">
      <el-input v-model="searchBox.scaPlanName"></el-input>
    </el-form-item>
    <el-form-item label="计划状态">
      <i-select v-model="searchBox.planStatus" clearable parameter="SCALE_PLAN_STATUS" placeholder=""></i-select>
    </el-form-item>
    <el-form-item label="适用范围">
      <i-select-tree
        placeholder=""
        :lazy="true"
        :multiple="true"
        dataKey="org"
        nodeKey="orgUnitId"
        v-model="searchBox.orgUnitIds"
        :props="orgProps"
      ></i-select-tree>
    </el-form-item>
    <el-form-item>
      <span slot="label">年度</span>
      <el-date-picker
        ref="year"
        :editable="false"
        v-model="searchBox.year"
        type="year"
        >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="模板名称">
      <el-select
        placeholder=""
        v-model="searchBox.scaModMasterIds"
        multiple
        clearable>
        <el-option
          v-for="item in modNames"
          :key="item.scaModMasterId"
          :label="item.modName"
          :value="item.scaModMasterId"
        ></el-option>
      </el-select>
    </el-form-item>
  </i-form>
</template>

<script>
/**
 * 封装高级搜索框,仅做过滤功能，抛出搜索方法
 */
import req from 'api/compile/index'
import {filter} from 'utils/compile'
import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import ISelect from 'components/common/i-select/i-select.vue'
import IForm from 'components/common/i-form/i-form.vue'
export default {
  name: 'PlanSearch',
  components: {
    ISelect,
    IForm,
    ISelectTree
  },
  data () {
    return {
      // 组织下拉树的配置
      orgProps: {
        children: 'children',
        label: 'orgUnitName'
      },
      // 搜索的内容
      searchBox: {
        scaPlanName: '',
        scaModMasterIds: [],
        orgUnitIds: '',
        year: '',
        planStatus: ''
      },
      // 模板名称集合
      modNames: []
    }
  },
  methods: {
    // 重置功能
    reset () {
      Object.keys(this.searchBox).map(key => {
        if (key === 'scaModMasterIds') {
          this.searchBox[key] = []
        } else {
          this.searchBox[key] = ''
        }
      })
      // 修复时间控件用户填写填写错误字段，重置不了的问题
      this.$refs.year.$children[0].currentValue = ''
    },
    // 搜索功能，仅做过滤
    search () {
      var params = filter(this.searchBox, null, {
        year: 'YYYY-MM-DD'
      })
      console.log('搜索内容为', params)
      this.$emit('search', params)
    }
  },
  created () {
    req('getAvailableMods').then(res => {
      this.modNames = res
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
