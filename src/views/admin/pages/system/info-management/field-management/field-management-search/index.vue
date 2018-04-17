<template>
  <i-form slot="header" @reset="reset" @search="search">
    <el-form-item>
      <span slot="label">字段名称</span>
      <el-input v-model="searchBox.columnName" clearable placeholder="请输入" maxlength="100"></el-input>
    </el-form-item>
    <el-form-item>
      <span slot="label">数据库列</span>
      <el-select 
        v-model="searchBox.columnFieldName" 
        clearable
        filterable 
        placeholder="请选择" 
        maxlength="100"
      >
        <el-option
          v-for="item in fieldNameList"
          :key="item.columnFieldName"
          :label="item.columnFieldName"
          :value="item.columnFieldName"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <span slot="label">状态</span>
      <i-select v-model="searchBox.status" parameter="MSG_INF_STATUS" clearable placeholder="请选择"></i-select>
    </el-form-item>
  </i-form>
</template>

<script>
  import IForm from 'components/common/i-form/i-form.vue'
  import reqFd from 'api/system/info-management/field-management/index.js'

  export default{
    name: 'FieldManagementSearch',
    components: {
      IForm
    },
    props: ['tableName'],
    data () {
      return {
        // 数据库列表
        fieldNameList: [],
        // 存放表单数据
        searchBox: {
          columnName: '',
          columnFieldName: '',
          status: ''
        }
      }
    },
    mounted () {
      this.getFieldNameList()
    },
    methods: {
      // 获取数据库列
      getFieldNameList () {
        reqFd('getFieldNameList', {tableName: this.tableName}).then(res => {
          if (res) {
            this.fieldNameList = res
          }
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

