## ElForm组件使用说明
- 原生el-form-item组件的校验修改
- 将会在全局注册
- 异步校验成功，调用callback({ successMessage: '身份证校验通过！'})
### Attributes

参数 | 说明 | 类型 | 默认值
--- | --- | --- | --- |
prop | el-form中model与rules数据所对应的属性查找map | String | —
rules | 在表格中使用时，由于表格有增删行，所以将rules写在对应el-form-item的rules中 | String | —

### 使用试例
```html
<template>
  <div>
    <el-form ref="form" labelWidth="140px" :model="ruleForm" :rules="rules">
      <div class="base">
        <el-form-item label="身份证异步校验" prop="base.id">
          <el-input v-model="ruleForm.base.id" placeholder="请输入身份证"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="base.region">
          <el-select v-model="ruleForm.base.region" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="content">
        <el-table
          :data="ruleForm.tableData"
          style="width: 100%"
        >
          <el-table-column label="国籍">
            <template slot-scope="scope">
              <el-form-item labelWidth="0" :prop="`tableData[${scope.$index}].country`" :rules="countryRule">
                <el-input v-model="scope.row.country"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <el-form-item labelWidth="0" :prop="`tableData[${scope.$index}].name`" :rules="nameRule">
                <el-input v-model="scope.row.name"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
</template>
<script>
  export default {
    name: 'asyncValidate',
    data () {
      const checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('身份证不能为空'))
        }
        if (value.match(/[^\w]/g)) {
          return callback(new Error('字符格式不合法'))
        }
        if (value.length !== 18) {
          return callback(new Error('请输入18位证件号码'))
        }
        setTimeout(() => {
          if (value.length === 18) {
            callback({
              successMessage: '验证通过'
            })
          }
        }, 1000)
      }
      return {
        ruleForm: {
          base: {
            id: '',
            region: ''
          },
          tableData: [{
            country: 'China',
            name: 'Mike'
          }, {
            country: 'China',
            name: 'Mike'
          }, {
            country: 'China',
            name: 'Mike'
          }]
        },
        rules: {
          base: {
            id: [
              { required: true, validator: checkAge, trigger: 'blur' }
            ],
            region: [
              { required: true, message: '请选择活动区域', trigger: 'change' }
            ]
          }
        },
        countryRule: {
          required: true, message: '请输入国籍', trigger: 'blur'
        },
        nameRule: {
          required: true, message: '请输入名字', trigger: 'blur'
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs['form'].validate(res => {
          if (res) {
            console.log('对了')
          } else {
            console.log('错了')
          }
        })
      }
    }
  }
</script>
<style>
  .el-table .el-form-item__error {
    top: 32px;
  }
  .el-table .el-form-item {
    margin: 16px 0;
  }
</style>



```
