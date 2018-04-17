<template>
  <i-form @reset="reset" @search="search">
    <el-form-item label="模板名称">
      <el-input v-model.trim="searchBox.modName"></el-input>
    </el-form-item>
    <el-form-item label="适用范围">
      <i-select-tree
        placeholder=""
        lazy
        multiple
        dataKey="org"
        nodeKey="orgUnitId"
        v-model="searchBox.orgUnitId"
        :props="orgProps"
      ></i-select-tree>
    </el-form-item>
    <el-form-item>
      <span slot="label">状态</span>
      <i-select clearable v-model="searchBox.modStatus" parameter="SCALE_MOD_STATUS" placeholder=""></i-select>
    </el-form-item>
  </i-form>
</template>

<script>
/**
 * 封装高级搜索框,仅做过滤功能，抛出搜索方法
 */
import {filter} from 'utils/compile'
import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import ISelect from 'components/common/i-select/i-select.vue'
import IForm from 'components/common/i-form/i-form.vue'
export default {
  name: 'TemplateManageSearch',
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
        modName: '',
        orgUnitId: '',
        modStatus: ''
      }
    }
  },
  methods: {
    // 重置功能
    reset () {
      Object.keys(this.searchBox).map(key => {
        this.searchBox[key] = ''
      })
    },
    // 搜索功能，仅做过滤
    search () {
      var params = filter(this.searchBox)
      console.log('搜索内容为', params)
      this.$emit('search', params)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
