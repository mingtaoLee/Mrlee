<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="form">
      <el-form-item label="指标名称" :label-width="'100px'" prop="name">
        <el-input v-model.trim="formData.name" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="评估方向" :label-width="'100px'">
        <el-select v-model="formData.evaluationDirection" clearable placeholder="">
          <el-option v-for="item in evaluationDirectionDict" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="指标类别" :label-width="'100px'">
        <el-select v-model="formData.indicatorType" clearable placeholder="">
          <el-option v-for="item in indicatorTypedDict" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="评估类型" :label-width="'100px'" prop="evaluationType">
        <el-select v-model="formData.evaluationType" clearable placeholder="">
          <!--<el-option v-for="item in evaluationTypeDict" :key="item.value" :label="item.label"-->
          <!--:value="item.value"></el-option>-->
          <el-option key="1" label="评估打分"
                     value="1"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="评估方法" :label-width="'100px'" prop="evaluationMethod">
        <el-select v-model="formData.evaluationMethod" clearable placeholder="">
          <el-option v-for="item in evaluationMethodDict" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
          <!--<el-option key="item.value" label="选择评估方法"-->
          <!--value="1"></el-option>-->
        </el-select>
      </el-form-item>

      <el-form-item v-if="formData.evaluationMethod == 1" label="评分标准" :label-width="'100px'" prop="standardId" :rules="[
      { required: true, message: '请选择评分标准', trigger: 'change' },
    ]">
        <el-select v-model="formData.standardId" clearable placeholder="">
          <el-option v-for="item in standardALlList" :key="item.value" :label="item.name"
                     :value="item.standardId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="formData.evaluationType == 2" label="指标单位" :label-width="'100px'" prop="unit" :rules="[
      { required: true, message: '请选择指标单位', trigger: 'change' },
    ]">
        <el-select v-model="formData.unit" clearable placeholder="">
          <el-option label="亿元" value="1"></el-option>
          <el-option label="万元" value="2"></el-option>
          <el-option label="天" value="3"></el-option>
          <el-option label="次" value="4"></el-option>
          <el-option label="小时" value="5"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="评价标准" :label-width="'100px'" prop="standard">
        <el-input type="textarea" v-model.trim="formData.standard" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="指标描述" :label-width="'100px'" prop="description">
        <el-input type="textarea" v-model.trim="formData.description" :rows="5"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import req from 'api/performance/indicator'

  import {
    evaluationDirectionDict,
    indicatorTypedDict,
    evaluationTypeDict,
    evaluationMethodDict
  } from '../../../../../config/dict'

  export default {
    name: 'indicator-dialog',
    props: ['form', 'value'],
    data () {
      return {
        evaluationDirectionDict: evaluationDirectionDict,
        indicatorTypedDict: indicatorTypedDict,
        evaluationTypeDict: evaluationTypeDict,
        evaluationMethodDict: evaluationMethodDict,
        visible: false,
        unit: '',
        formData: {},
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 1, max: 128, message: '长度在128个字符以内', trigger: 'blur'}
          ],
          evaluationType: [
            {required: true, message: '请选择评估类型', trigger: 'change'}
          ],
          evaluationMethod: [
            {required: true, message: '请选择评估方法', trigger: 'change'}
          ],
          standardId: [
            {required: true, message: '请选择评分标准', trigger: 'change'}
          ],
          description: [
            {min: 1, max: 255, message: '长度最大为255个字符', trigger: 'blur'}
          ],
          standard: [
            {min: 1, max: 255, message: '长度最大为255个字符', trigger: 'blur'}
          ]
        },
        standardALlList: []
      }
    },
    created () {
      this.formData = JSON.parse(JSON.stringify(this.form))
      this.getStandard()
    },
    methods: {
      getStandard () {
        req('standardsAll').then((data) => {
          this.standardALlList = data
        }).catch((err) => {
          console.log(err)
        })
      },
      /* 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.formData)
            } else {
              resolve(false)
            }
          })
        })
      },
      // 确认按钮
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              res.indicatorName = res.name
              resolve(res)
            } else {
              resolve(false)
            }
          })
        })
      }
//      ensure (formName) {
//        this.$refs[formName].validate((valid) => {
//          if (valid) {
//            this.formData.indicatorName = this.formData.name
//            this.$emit('indicatorDialogVisible', false, this.formData)
//          } else {
//            return false
//          }
//        })
//      }
    }
  }
</script>

