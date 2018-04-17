<template>
  <el-form :model="formData" ref="form">
    <el-form-item label="标签名称：" :label-width="'100px'" prop="name">
      <el-input v-model.trim="formData.name" disabled></el-input>
    </el-form-item>
    <el-form-item align="justify" label="描述：" :label-width="'100px'" prop="description">
      <el-input type="textarea" v-model.trim="formData.description" :rows="5" disabled></el-input>
    </el-form-item>
  </el-form>
</template>
<script type="text/javascript">
  // api
  // import req from 'api/recruit/index'
  export default {
    name: 'LabelDialogCheck',
    props: ['form', 'labelId', 'type'],
    data () {
      return {
        formData: {}
      }
    },
    created () {
      this.init()
    },
    methods: {
      // 初始化
      init () {
        this.formData = JSON.parse(JSON.stringify(this.form))
        console.log(this.formData)
      }
    }
  }
</script>
