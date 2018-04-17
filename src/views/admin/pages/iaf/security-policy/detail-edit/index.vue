<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <!--<el-form-item label="社保政策名称" prop="name">-->
          <!--<el-input v-model="form.name"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="所在区域" prop="areaId">
          <i-select-area v-model="form.areaId" :disabled="!!id" search @change="selectArea"></i-select-area>
        </el-form-item>
        <!-- <el-form-item label="最低工资" prop="socialMinSalary">
          <el-input :id="form.MinSalaryId" v-model.number="form.socialMinSalary" type="number" :min="0" @change="handleMinChange"></el-input>
          <el-input type="number" v-model.number="form.socialMinSalary"></el-input>
        </el-form-item> -->
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            type="date"
            :editable="false"
            :picker-options="effectOptions"
            @change="changeEffectDate"
          >
          </el-date-picker>
        </el-form-item>
      </li>
      <li class="item">
        <!-- <el-form-item label="社平工资" prop="socialAverageSalary">
          <el-input v-model.number="form.socialAverageSalary" type="number" :min="0" @change="handleSalaryChange"></el-input>
        </el-form-item>
        <el-form-item label="最低小时工资" prop="socialMinHourSalary">
          <el-input v-model.number="form.socialMinHourSalary" type="number" :min="0" @change="handleMinHourSalaryChange"></el-input>
        </el-form-item> -->
        <el-form-item label="失效日期" prop="uneffectiveDate">
          <el-date-picker
            v-model="form.uneffectiveDate"
            type="date"
            :editable="false"
            :picker-options="uneffectOptions"
            :disabled="true"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="执行日期" prop="executeDate">
          <el-date-picker
            v-model="form.executeDate"
            type="date"
            :editable="false"
            :picker-options="executeDate"
            :disabled="false"
          >
          </el-date-picker>
        </el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select.vue'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  export default {
    mixins: [EditorMixin],
    components: {
      ISelect
    },
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      id: String,
      toolbar: Object
    },
    computed: {
    },
    data: function () {
      let checkEffectiveDate = (rule, value, cb) => {
        if (this.form.executeDate) {
          value.getTime() > this.form.executeDate.getTime() ? cb(new Error('生效日期不能大于执行日期')) : cb()
        }
      }
      // let checkSelectCounty = (rule, value, cb) => {
      //   this.isSelectCounty ? cb() : cb(new Error('必须要选择到县级或区级'))
      // }
      return {
        instance: null,
        form: {
          areaId: '',
          // socialMinSalary: '',
          // socialAverageSalary: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31'),
          executeDate: ''
          // MinSalaryId: 'MinSalaryId'
        },
        isSelectCounty: true,
        effectOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.parse(this.form.executeDate) || time.getDate() !== 1
          }
        },
        executeDate: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse(this.form.effectiveDate)
          }
        },
        areaProps: {
        },
        rules: {
          areaId: [
            getRule('请选择所在区域', 'change')
            // { validator: checkSelectCounty, trigger: 'change' }
          ],
          socialMinSalary: [
            { required: true, type: 'number', message: '请输入最低工资', trigger: 'change' },
            { min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' }
          ],
          socialAverageSalary: [
            { required: true, type: 'number', message: '请输入社平工资', trigger: 'change' },
            { min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' }
          ],
          socialMinHourSalary: [
            { required: true, type: 'number', message: '请输入最低小时工资', trigger: 'change' },
            { min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' }
          ],
          effectiveDate: [
            { required: true, type: 'date', message: '请选择生效日期' },
            { validator: checkEffectiveDate, trigger: 'change' }
          ],
          uneffectiveDate: [
            { required: true, type: 'date', message: '请选择失效日期', trigger: 'change' }
          ],
          executeDate: [
            { required: true, type: 'date', message: '请选择执行日期' }
          ]
        }
      }
    },
    methods: {
      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.id ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.id)
      },

      selectArea (areaId, area) {
        this.isSelectCounty = area.split('/').length === 3
      },
      handleSalaryChange () {
        let averageSalaryDecimal = this.form.socialAverageSalary.toFixed(2)
        if (this.form.socialAverageSalary !== averageSalaryDecimal) {
          this.form.socialAverageSalary = parseFloat(averageSalaryDecimal)
        }
      },
      handleMinChange () {
        let minDecimal = this.form.socialMinSalary.toFixed(2)
        if (this.form.socialMinSalary !== minDecimal) {
          this.form.socialMinSalary = parseFloat(minDecimal)
        }
      },
      changeEffectDate () {
        if (!this.form.executeDate) {
          this.id ? '' : (this.form.executeDate = new Date(this.form.effectiveDate))
        }
      },
      handleMinHourSalaryChange () {
        let minDecimal = this.form.socialMinHourSalary.toFixed(2)
        if (this.form.socialMinHourSalary !== minDecimal) {
          this.form.socialMinHourSalary = parseFloat(minDecimal)
        }
      }
    }
  }
</script>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
