<template>
  <div class="content" :visible.sync="dialogFormVisible">
    <el-form :model="form">
        <el-form-item label="导出文件" :label-width="formLabelWidth">
        <el-input v-model="form.region" disabled="true"  :placeholder="`${exportName}`">
        </el-input>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {exportName: String},
  data () {
    return {
      dialogFormVisible: false,
      form: {
        name: '',
        region: ''
      },
      formLabelWidth: '120px'
    }
  }
}
</script>
<style lang='scss' scoped>

</style>


