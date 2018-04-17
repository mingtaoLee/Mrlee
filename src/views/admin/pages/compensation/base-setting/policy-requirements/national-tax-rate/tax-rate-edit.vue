<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-tax-rate-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="类型" prop="iitaxrateType">
          <i-select v-model="form.iitaxrateType" parameter="IITAXRATE_TYPE" :disabled="!!iitaxrateId"></i-select>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            type="month"
            :picker-options="effectOptions"
            :disabled="isDateDisabled"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="本国员工起征点" prop="nativeStartPoint">
          <el-input v-model.number="form.nativeStartPoint" :disabled="isDateDisabled" type="number" :min="0"></el-input>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="版本" prop="version">
          <el-input v-model="form.version" :disabled="!!iitaxrateId"></el-input>
        </el-form-item>
        <el-form-item label="失效日期" prop="uneffectiveDate">
          <el-date-picker
            v-model="form.uneffectiveDate"
            type="month"
            :picker-options="uneffectOptions"
            :disabled="isDateDisabled"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="外籍员工起征点" prop="foreignStartPoint">
          <el-input v-model.number="form.foreignStartPoint" :disabled="isDateDisabled" type="number" :min="0"></el-input>
        </el-form-item>
      </li>
    </ul>
      <el-table
        :row-key="getRowKey"
        :style="{width: '100%'}"
        :data="form.payIitaxrateInfoList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="应纳税所得额下限" prop="taxableIncomeMin" minWidth="120">
          <template slot-scope="scope">
            <el-form-item labelWidth="0" :ref="`taxableIncomeMin${scope.$index}`" :prop="`payIitaxrateInfoList[${scope.$index}].taxableIncomeMin`" :rules="getMinRules(scope)">
              <el-input type="number" v-model.number="scope.row.taxableIncomeMin" :disabled="isDateDisabled" :min="0" @input="handleMinChange($event, scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="应纳税所得额上限" prop="taxableIncomeMax" minWidth="120">
          <template slot-scope="scope">
            <el-form-item v-show="getIsLastRow(scope)" labelWidth="0" :ref="`taxableIncomeMax${scope.$index}`" :prop="`payIitaxrateInfoList[${scope.$index}].taxableIncomeMax`" :rules="getMaxRules(scope)">
              <el-input type="number" v-model.number="scope.row.taxableIncomeMax" :disabled="isDateDisabled" :min="0" @input="handleMaxChange($event, scope)"></el-input>
            </el-form-item>
            <el-form-item v-show="!getIsLastRow(scope)" labelWidth="0">
              <el-input v-model="scope.row.taxableIncomeMax" :disabled="isDateDisabled" @input="handleMaxChange($event, scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="税率（%）" prop="taxrate" minWidth="100">
          <template slot-scope="scope">
            <el-form-item labelWidth="0" :prop="`payIitaxrateInfoList[${scope.$index}].taxrate`" :rules="taxRateRules">
              <el-input type="number" v-model.number="scope.row.taxrate" :disabled="isDateDisabled" :min="0" :max="100" @change="handleChange"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="速算扣除数" prop="qdnumber" minWidth="100">
          <template slot-scope="scope">
            <el-form-item labelWidth="0" :prop="`payIitaxrateInfoList[${scope.$index}].qdnumber`" :rules="getQdnumberRules(scope)">
              <el-input type="number" v-model.number="scope.row.qdnumber" :disabled="isDateDisabled" :min="0" :max="scope.taxableIncomeMax" @change="handleChange($event, scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column v-if="!isDateDisabled" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <i class="el-icon-plus operate-icon" @click="addRow(scope)"></i>
            <i class="el-icon-minus operate-icon" @click="deleteRow(scope)"></i>
          </template>
        </el-table-column>
      </el-table>
    <!--</div>-->
  </el-form>
</template>
<script>
  import moment from 'moment'
  import { BaseTaxRate } from './base-tax-rate'
  import { EditingTaxRate } from './editing-tax-rate'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    iitaxrateType: [
      { required: true, message: '请选择税率类型', trigger: 'change' }
    ],
    version: [
      { required: true, message: '请输入版本号', trigger: 'change' },
      { min: 0, max: 20, message: '字符长度不能超过20个', trigger: 'change' }
    ],
    effectiveDate: [
      { required: true, type: 'date', message: '请选择生效日期', trigger: 'change' }
    ],
    uneffectiveDate: [
      { required: true, type: 'date', message: '请选择失效日期', trigger: 'change' }
    ],
    nativeStartPoint: [
      { required: true, type: 'number', message: '请输入字符为数字的起征点', trigger: 'change' },
      { min: 0, max: 99999999, message: '请输入8位以内的正数', trigger: 'change', type: 'number' }
    ],
    foreignStartPoint: [
      { required: true, type: 'number', message: '请输入字符为数字的起征点', trigger: 'change' },
      { min: 0, max: 99999999, message: '请输入8位以内的正数', trigger: 'change', type: 'number' }
    ]
  }
  export default {
    mixins: [EditorMixin],
    props: {
      iitaxrateId: String,
      selected: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
    },
    data: function () {
      return {
        instance: null,
        form: {
          iitaxrateType: '',
          version: '',
          nativeStartPoint: '',
          foreignStartPoint: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00'),
          payIitaxrateInfoList: [{
            taxableIncomeMin: 0,
            taxableIncomeMax: '正无穷',
            taxrate: null,
            qdnumber: null,
            id: Math.random()
          }]
        },
        effectOptions: {
          disabledDate: (time) => {
            return time.getTime() < moment().startOf('month').valueOf() || time.getTime() > Date.parse(this.form.uneffectiveDate)
            // return time.getTime() > Date.parse(this.form.uneffectiveDate) - 3600 * 1000 * 24
          }
        },
        uneffectOptions: {
          disabledDate: (time) => {
            return time.getTime() <= Date.parse(this.form.effectiveDate) || time.getTime() < moment().startOf('month').valueOf()
          }
        },
        rules: RULES,
        minRules: [
          { required: true, type: 'number', message: '请输入应纳税所得额下限', trigger: 'blur' },
          { min: 0, message: '不能小于0' }
        ],
        maxRules: [
          { required: true, type: 'number', message: '请输入应纳税所得额上限', trigger: 'blur' }
        ],
        taxRateRules: [
          { required: true, type: 'number', message: '请输入税率', trigger: 'blur' },
          { min: 0, message: '税率不能小于0', type: 'number', trigger: 'blur' },
          { max: 100, message: '税率不能大于100', type: 'number', trigger: 'blur' }
        ],
        qdnumberRules: {
          required: true, type: 'number', message: '请输入速算扣除数', trigger: 'blur'
        }
      }
    },
    methods: {

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.iitaxrateId ? new EditingTaxRate(opts) : new BaseTaxRate(opts)
      },

      /** 动态获取应纳所得额下限rule */
      getMinRules ({ row }) {
        return [
          { required: true, type: 'number', message: '请输入应纳税所得额下限', trigger: 'blur' },
          { min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' },
          { max: row.taxableIncomeMax - 0.01, type: 'number', message: '必须小于应纳税所得额上限！', trigger: 'blur' }
        ]
      },

      /** 动态获取应纳所得额下限rule */
      getMaxRules (scope) {
        if (!this.getIsLastRow(scope)) return []
        return [
          { required: true, type: 'number', message: '请输入应纳税所得额上限', trigger: 'blur' },
          { min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' },
          { min: scope.row.taxableIncomeMin + 0.01, type: 'number', message: '必须大于应纳税所得额下限！', trigger: 'blur' }
        ]
      },

      /** 动态获取速算扣除数rule */
      getQdnumberRules ({ row }) {
        return [
          { required: true, type: 'number', message: '请输入速算扣除数', trigger: 'blur' },
          { min: 0, message: '不能小于0', type: 'number', trigger: 'blur' },
          { max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' },
          { max: row.taxableIncomeMax, type: 'number', message: '不能大于应纳税所得额上限' }
        ]
      },

      /** 获取表格行key值 */
      getRowKey (row) {
        return row.id
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.iitaxrateId)
      },

      /** 删除行操作 */
      deleteRow (scope) {
        this.instance.deleteRow(scope)
      },

      /** 增加行操作 */
      addRow (scope) {
        this.instance.addRow(scope)
      },

      /** 处理税率下限变动 */
      handleMinChange (value, scope) {
        this.instance.handleMinChange(value, scope)
      },

      /** 处理税率上限变动 */
      handleMaxChange (value, scope) {
        this.instance.handleMaxChange(value, scope)
      },

      /** 处理税率表除税率上下限的数据变动 */
      handleChange (value, scope) {
        this.instance.handleChange(value, scope)
      },

      /** 获取是否是最后一行 */
      getIsLastRow (scope) {
        return scope.$index !== (this.form.payIitaxrateInfoList.length - 1)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../../../../styles/vars.scss";
  .operate-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    transition: opacity 0.3s;
    &:hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }
  .el-icon-plus {
    display: inline-block;
    margin-right: 10px;
    color: $color-theme;
  }
  .el-icon-minus {
    color: $color-red;
  }
  /**.zzf-tax-rate-edit {*/
    /**min-height: 300px;*/
  /**}*/
</style>
<style lang="scss">
  .zzf-tax-rate-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
    .el-table__body-wrapper {
      overflow: hidden;
    }
  }
</style>
