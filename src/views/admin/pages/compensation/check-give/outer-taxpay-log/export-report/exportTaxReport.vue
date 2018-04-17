<template>
  <div class="content" :visible.sync="dialogFormVisible">
    <el-form >
        <el-form-item label="请选择年分" :label-width="formLabelWidth">
          <el-date-picker
              v-model="fullYear"
              align="right"
              type="year"
              :placeholder="defaultYear"
              value-format="yyyy"
              @change='yearChange'>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="导出文件" :label-width="formLabelWidth">
          <el-input v-model="form.region" placeholder="年12万报税表.xls" :disabled="true">
          </el-input>
        </el-form-item>
        {{value5}}
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogFormVisible: false,
      defaultYear: new Date().getFullYear() - 1,
      fullYear: '',
      form: {
        name: '',
        region: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    yearChange () {
      this.$emit('yearChange', this.fullYear)
    }
  }
}
</script>
<style lang='scss' scoped>

</style>


