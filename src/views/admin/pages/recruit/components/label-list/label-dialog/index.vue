<template>
  <el-form :model="formData" :rules="rules" ref="form">
    <el-form-item 
    label="标签名称：" 
    :label-width="'100px'" 
    prop="name" 
    :rules="name" 
    required>
      <el-input type="text" v-model.trim="formData.name"></el-input>
    </el-form-item>
    <el-form-item align="justify" label="描述：" :label-width="'100px'" prop="description" :rules="description" required>
      <el-input type="textarea" v-model.trim="formData.description" :rows="5"></el-input>
    </el-form-item>
  </el-form>
</template>
<script type="text/javascript">
  // api
  import req from 'api/recruit/index'
  export default {
    name: 'LabelDialog',
    props: ['form', 'labelId', 'type'],
    data () {
      // 验证不能为所有空格
      const nameValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入标签名称'))
        } else if (value.replace(/\s+/g, '').length === 0) {
          callback(new Error('所有的字符不能都为空格'))
        } else if (value.length > 128) {
          callback(new Error('长度最大为128个字符'))
        } else {
          callback()
        }
      }

      const descriptionValidator = (rule, val, cb) => {
        if (!val) {
          cb(new Error('请输入描述'))
        } else if (val.length > 255) {
          cb(new Error('长度最大为255个字符'))
        } else {
          cb()
        }
      }

      return {
        formData: {
          name: '',
          description: ''
        },
        rules: {
          name: [
            {validator: nameValidator, trigger: 'blur, change'}
          ],
          description: [
            {validator: descriptionValidator, trigger: 'change'}
            // {min: 1, max: 255, message: '长度最大为255个字符', required: true, trigger: 'blur'}
          ]
        }
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
      // 保存
      save () {
        // if (this.formData.name) {
        //   console.log('保存成功')
        // } else {
        //   this.$message.error('标签名称不能为空')
        //   return false
        // }
        return new Promise(resolve => {
          this.validate().then(res => {
            let obj = Object.assign({}, res)
            if (this.type === 1) {
              req('updateLabel', {labelId: this.labelId, name: this.formData.name, description: this.formData.description}).then((data) => {
                console.log(data)
                console.log(this.labelId)
                this.$message({
                  message: '恭喜你，修改成功',
                  type: 'success'
                })
                resolve(obj)
              })
            } else if (this.type === 0) {
              req('addLabel', {name: this.formData.name, description: this.formData.description, ...obj}).then((data) => {
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
