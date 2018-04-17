<template>
  <el-form :model="formData" ref="form" :rules="rules">
    <el-form-item label="评估类型：" 
      :rules="optionType" 
      :label-width="'100px'" 
      prop="optionType" 
      required>
      <i-select v-model="formData.optionType" clearable parameter="EVALUATION_OPTION_TYPE" placeholder="请选择字典"></i-select>
    </el-form-item>
    <el-form-item label="评估项：" 
      :rules="description" 
      :label-width="'100px'"
      prop="description" 
      required>
      <el-input type="textarea" v-model.trim="formData.description" :rows="5"></el-input>
    </el-form-item>
    <el-form-item></el-form-item>
  </el-form>
</template>
<script type="text/javascript">
  import req from 'api/recruit/index'
  import ISelect from 'components/common/i-select/i-select.vue'
  export default {
    name: 'EvaluateDialog',
    components: {
      ISelect
    },
    props: ['form', 'evaluationOptionId', 'type'],
    data () {
      // 验证不能为所有空格
      const optionTypeValidator = (rule, val, cb) => {
        if (!val) {
          cb(new Error('请选择评估类型'))
        } else if (val.length > 128) {
          cb(new Error('长度最大为128个字符'))
        } else {
          cb()
        }
      }
      const descriptionValidator = (rule, val, cb) => {
        if (!val) {
          cb(new Error('请输入评估项'))
        } else if (val.replace(/\s+/g, '').length === 0) {
          cb(new Error('所有的字符不能都为空格'))
        } else if (val.length > 255) {
          cb(new Error('长度最大为255个字符'))
        } else {
          cb()
        }
      }
      return {
        formData: {
          optionType: '',
          description: ''
        },
        rules: {
          optionType: {
            validator: optionTypeValidator, trigger: 'blur, change'
          },
          description: {
            validator: descriptionValidator, trigger: 'blur, change'
          }
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.formData = JSON.parse(JSON.stringify(this.form))
        console.log(this.formData)
      },
      /* 数据校验 */
      validate () {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.formData)
            } else {
              reject()
            }
          })
        })
      },
      save () {
        // if (this.formData.optionType && this.formData.description) {
        //   console.log('保存成功')
        // } else if (!this.formData.optionType) {
        //   this.$message.error('评估类型不能为空')
        //   return false
        // } else if (!this.formData.description) {
        //   this.$message.error('评估项不能为空')
        //   return false
        // }
        return new Promise(resolve => {
          this.validate().then(res => {
            let obj = Object.assign({}, res)
            if (this.type) {
              req('updateEvaluate', {evaluationOptionId: this.evaluationOptionId, optionType: this.formData.optionType, description: this.formData.description, ...obj}).then((res) => {
                this.$message({
                  message: '恭喜你，修改成功',
                  type: 'success'
                })
                resolve(obj)
              })
            } else {
              req('addEvaluate', {optionType: this.formData.optionType, description: this.formData.description, ...obj}).then((data) => {
                console.log(data)
                this.$message({
                  message: '恭喜你，新建成功',
                  type: 'success'
                })
                resolve(obj)
              })
            }
          })
        })
      }
    }
  }
</script>
