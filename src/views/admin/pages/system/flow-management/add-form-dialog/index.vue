<template>
  <el-form 
  :model="model" 
  class="sys-form" 
  :rules="rules" 
  ref="form">
    <el-form-item label="KEY" prop="fieldValue" class="sys-form-item" required >
      <el-input v-model="model.fieldValue" maxlength="100"></el-input>
    </el-form-item>
    <el-form-item label="名称" prop="fieldName" class="sys-form-item" required >
      <el-input v-model="model.fieldName" maxlength="100"></el-input>
    </el-form-item>

  </el-form>
</template>
<script>

export default {
  name: 'add-form-dialog',

  props: {
    detailData: {
      type: Object
    },
    index: {
      type: Number
    },
    status: {
      type: Number
    }
  },

  data () {
    let validateForms = (rule, val, cb) => {
      let {fieldList} = this.detailData
      let res = fieldList.filter(ele => ele.fieldValue === val)
      res.length > 0 ? cb(new Error('表单key不能重复')) : cb()
    }
    return {
      model: {},

      addData: {
        fieldName: '',
        fieldValue: ''
      },

      rules: {
        fieldName: {required: true, message: '请输入名称', trigger: 'blur'},
        fieldValue: [
          {required: true, message: '请输入Key', trigger: 'blur'},
          {validator: validateForms, trigger: 'blur'}
        ]
      }
    }
  },

  created () {
    this.status === 1 ? this.model = this.detailData.fieldList[this.index] : this.model = this.addData
  },

  methods: {
    save () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          valid && resolve()
        })
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.sys-form {
  display: flex;
}
.sys-form-item {
  display: flex;
  width: 50%;
}
</style>
