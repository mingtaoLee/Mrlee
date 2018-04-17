<template>
  <el-form :model="formData" ref="form">
    <el-form-item label="评估类型：" :label-width="'100px'" prop="optionType" required>
       <i-select v-model="formData.optionType" clearable parameter="EVALUATION_OPTION_TYPE" disabled></i-select>
    </el-form-item>
    <el-form-item label="评估项：" prop="description" :label-width="'100px'" required>
      <el-input type="textarea" v-model.trim="formData.description" :rows="5" disabled></el-input>
    </el-form-item>
  </el-form>
</template>
<script type="text/javascript">
  import ISelect from 'components/common/i-select/i-select.vue'
  export default {
    name: 'EvaluateDialogCheck',
    components: {
      ISelect
    },
    props: ['form', 'evaluationOptionId', 'type'],
    data () {
      return {
        formData: {}
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.formData = JSON.parse(JSON.stringify(this.form))
        console.log(this.formData)
      }
    }
  }
</script>
