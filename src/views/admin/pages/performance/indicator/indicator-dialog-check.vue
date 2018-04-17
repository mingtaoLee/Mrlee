<template>
  <div>
    <el-form :model="formData" ref="form">
      <el-form-item label="指标名称" :label-width="'100px'" prop="name">
        <el-input disabled v-model="formData.name" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="评估方向" :label-width="'100px'">
        <el-select disabled clearable v-model="formData.evaluationDirection" placeholder="请选择评估方向">
          <el-option v-for="item in evaluationDirectionDict" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="指标类别" :label-width="'100px'">
        <el-select disabled clearable v-model="formData.indicatorType" placeholder="请选择指标类别">
          <el-option v-for="item in indicatorTypedDict" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="评估类型" :label-width="'100px'" prop="evaluationType">
        <el-select disabled v-model="formData.evaluationType" placeholder="请选择评估类型">
          <el-option v-for="item in evaluationTypeDict" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="评估方法" :label-width="'100px'" prop="evaluationMethod">
        <el-select disabled v-model="formData.evaluationMethod" placeholder="请选择评估方法">
          <el-option v-for="item in evaluationMethodDict" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="formData.evaluationMethod == 1" label="评分标准" :label-width="'100px'" prop="standardId" :rules="[
      { required: true, message: '请选择评分标准', trigger: 'change' },
    ]">
        <el-select disabled v-model="formData.standardId" placeholder="请选择评分标准">
          <el-option v-for="item in standardALlList" :key="item.value" :label="item.name"
                     :value="item.standardId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="formData.evaluationType == 2" label="指标单位" :label-width="'100px'">
        <el-select disabled v-model="formData.unit" placeholder="请选择单位">
          <el-option v-for="item in unitDict" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="评价标准" :label-width="'100px'" prop="standard">
        <el-input disabled type="textarea" v-model="formData.standard" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="指标描述" :label-width="'100px'" prop="description">
        <el-input disabled type="textarea" v-model="formData.description" :rows="5"></el-input>
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
    evaluationMethodDict,
    unitDict
  } from '../../../../../config/dict'

  export default {
    name: 'indicator-dialog-check',
    props: {
      indicatorId: String
    },
    data () {
      return {
        evaluationDirectionDict: evaluationDirectionDict,
        indicatorTypedDict: indicatorTypedDict,
        evaluationTypeDict: evaluationTypeDict,
        evaluationMethodDict: evaluationMethodDict,
        unitDict: unitDict,
        unit: '',
        formData: {},
        rules: {
          name: [
            {required: true, message: '请输入绩效指标名称', trigger: 'blur'},
            {min: 1, max: 128, message: '长度最大为128个字符', trigger: 'blur'}
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
        standardALlList: [],
        type: 0
      }
    },
    created () {
      this.getStandard()
      this.initData()
    },
    methods: {
      // 获取标准列表
      getStandard () {
        req('standardsAll').then((data) => {
          this.standardALlList = data
        }).catch((err) => {
          console.log(err)
        })
      },
      initData () {
        if (this.indicatorId) {
          req('oneIndicatorDetail', {indicatorId: this.indicatorId}).then((data) => {
            let {unit, name, standard, evaluationType, indicatorType, evaluationDirection, evaluationMethod, description, standardId, status} = data
            this.formData = {
              unit: unit,
              name: name,
              standard: standard,
              evaluationType: evaluationType,
              indicatorType: indicatorType,
              evaluationDirection: evaluationDirection,
              evaluationMethod: evaluationMethod,
              description: description,
              standardId: standardId,
              status: status
            }
            this.type = 1
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.formData = {
            name: '',
            evaluationDirection: '',
            indicatorType: '',
            evaluationType: '',
            evaluationMethod: '',
            standardId: '',
            unit: '',
            standard: '',
            description: '',
            status: 1
          }
          this.type = 0
        }
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
              if (this.type) {
                req('modifiedIndicator', {indicatorId: this.indicatorId, ...res}).then((res) => {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                  })
                  resolve(res)
                })
              } else {
                req('addOneIndicator', res).then((data) => {
                  this.$message({
                    message: '恭喜你，添加成功',
                    type: 'success'
                  })
                  resolve(res)
                })
              }
            } else {
              resolve(false)
            }
          })
        })
      }
    }
  }
</script>

