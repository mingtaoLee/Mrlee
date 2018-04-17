<template>
  <i-form slot="header" labelWidth="large" @reset="reset" @search="search">
    <el-form-item>
      <span slot="label">信息集名称</span>
      <el-input
        v-model="searchBox.infName"
        clearable
        placeholder="请输入"
        maxlength="100"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <span slot="label">数据库表</span>
      <el-select
        v-model="searchBox.tableName"
        filterable
        clearable
        placeholder="请选择"
        maxlength="100"
      >
        <el-option
          v-for="item in tableNameList"
          :key="item.tableName"
          :label="item.tableName"
          :value="item.tableName"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <span slot="label">相关类型</span>
      <i-select
        v-model="searchBox.classification"
        parameter="MSG_INF_TABCODE"
        clearable
        placeholder="请选择"
      ></i-select>
    </el-form-item>
    <el-form-item>
      <span slot="label">规则引用</span>
      <i-select
        v-model="searchBox.refStatus"
        parameter="WHETHER_TYPE"
        clearable
        placeholder="请选择"
      ></i-select>
    </el-form-item>
    <el-form-item>
      <span slot="label">状态</span>
      <i-select
        v-model="searchBox.status"
        parameter="MSG_INF_STATUS"
        clearable
        placeholder="请选择"
      ></i-select>
    </el-form-item>
  </i-form>
</template>

<script>
  import IForm from 'components/common/i-form/i-form.vue'
  import req from 'api/system/info-management'

  export default {
    name: 'InfoManagementSearch',
    components: {
      IForm
    },
    data () {
      return {
        // 存放数据库表
        tableNameList: [],
        // 存放表单数据
        searchBox: {
          infName: '',
          tableName: '',
          classification: '',
          status: '',
          refStatus: ''
        }
      }
    },
    mounted () {
      this.fetch()
    },
    methods: {
      // 获取
      fetch () {
        req('getTableNameList').then(data => {
          this.tableNameList = data
        })
      },
      // 搜索按钮
      search () {
        let params = this.searchBox
        this.$emit('search', params)
      },
      // 重置按钮
      reset () {
        Object.keys(this.searchBox).map(key => {
          this.searchBox[key] = null
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

