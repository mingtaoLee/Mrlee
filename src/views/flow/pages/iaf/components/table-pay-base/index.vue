<template>
  <section>
    <div v-if="header" class="table-head">{{header}}</div>
    <el-form class="wrap" :model="iafInfo" :rules="benchmarkRules" >
        <div v-if="columns.includes('selectType')" class="table-column type-select">
          <div class="table-cell table-top">
            <div>险种</div>
            <!-- <el-checkbox v-model="isCheckAll" @change="handleCheckAllChange" :indeterminate="isIndeterminateAll">全选</el-checkbox> -->
            <!-- <el-checkbox v-model="isCheckNull" @change="handleCheckNullChange" :indeterminate="isIndeterminateNull">不参保</el-checkbox> -->
          </div>
          <el-checkbox-group v-model="checkedType" @change="handleCheckedTypeChange">
            <div class="table-cell" v-for="(item, idx) of typeAll" v-if="canAddInsuranceType.includes(item)" :key="item">
              <el-checkbox :label="item" :key="idx">{{insuranceAll[item]}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <div v-if="columns.includes('type')" class="table-column type">
          <div class="table-cell table-top">险种</div>
          <div class="table-cell" v-for="(item, key) of insuranceAll"  v-if="canAddInsuranceType.includes(key)" :key="item">{{item}}</div>
        </div>
  
        <div v-if="columns.includes('compbase')" class="table-column compbase">
          <div class="table-cell table-top">单位缴纳基数</div>
          <template v-for="item of typeAll" v-if="canAddInsuranceType.includes(item)">
            <div v-if="!isSelect ? !editPayBase : !iafInfo[item]" class="table-cell" :key="item">{{iafInfo[item + fieldAll[0]]}}</div>
            <el-form-item v-if="!isSelect ? editPayBase : iafInfo[item]" :key="item" :prop="item + fieldAll[0]">
              <el-input v-model.number="iafInfo[item + fieldAll[0]]" @input="changeItem(item, `${item + fieldAll[0]}`, `${item + fieldAll[1]}`, `${item + fieldAll[2]}`)"></el-input>
            </el-form-item>
          </template>
        </div>

        <div v-if="columns.includes('empbase')" class="table-column empbase">
          <div class="table-cell table-top">个人缴纳基数</div>
          <template v-for="item of typeAll" v-if="canAddInsuranceType.includes(item)">
            <div class="table-cell" v-if="!isSelect ? !editPayBase : !iafInfo[item]" :key="item">{{iafInfo[item + fieldAll[1]]}}</div>
            <el-form-item :prop="item + fieldAll[1]" v-if="!isSelect ? editPayBase : iafInfo[item]" :key="item">
              <el-input v-model.number="iafInfo[item + fieldAll[1]]" @input="changeItem(item, `${item + fieldAll[0]}`, `${item + fieldAll[1]}`, `${item + fieldAll[2]}`)"></el-input>
            </el-form-item>
          </template>
        </div>

        <div v-if="columns.includes('payMethods')" class="table-column empbase">
          <div class="table-cell table-top">支付方式</div>
          <template v-for="item of typeAll" v-if="canAddInsuranceType.includes(item)">
            <!-- <div 
              class="table-cell" 
              v-if="!isSelect ? !editPayBase : !iafInfo[item]" 
              :key="item"
            >{{payMethods[iafInfo[item + fieldAll[2]]]}}</div> -->
            <dict-show 
              class="table-cell" 
              v-if="!isSelect ? !editPayBase : !iafInfo[item]" 
              v-model="iafInfo[item + fieldAll[2]]" 
              parameter="IAF_PAYMENT_TYPE" 
              :key='item'
            ></dict-show>
            <el-form-item :prop="item + fieldAll[2]" v-if="!isSelect ? editPayBase : iafInfo[item]" :key="item">
              <i-select 
                v-model="iafInfo[item + fieldAll[2]]" 
                parameter="IAF_PAYMENT_TYPE"  
                @change="changeItem(item, `${item + fieldAll[0]}`, `${item + fieldAll[1]}`, `${item + fieldAll[2]}`)"
              ></i-select>
            </el-form-item>
          </template>
        </div>

        <div v-if="columns.includes('number')" class="table-column number">
          <div class="table-cell  table-top">个人号码</div>
            <div class="table-cell" v-for="item of typeAll" v-if="canAddInsuranceType.includes(item)" :key="item">{{iafInfo[item + fieldAll[3]]}}</div>
        </div>

        <div v-if="columns.includes('area')" class="table-column area">
          <div class="table-cell table-top">缴纳地</div>
            <div class="table-cell" v-for="item of typeAll" v-if="canAddInsuranceType.includes(item)" :key="item">{{iafInfo.InsuranceAreaId}}</div>
        </div>
  
        <div v-if="columns.includes('account')" class="table-column account">
          <div class="table-cell table-top">参保户头</div>
            <div class="table-cell" v-for=" item of typeAll" v-if="canAddInsuranceType.includes(item)" :key="item">
              <el-tooltip  placement="top" :content="iafInfo[item + fieldAll[4]]">
                <span class="table-tooltip">{{iafInfo[item + fieldAll[4]]}}</span>
              </el-tooltip>
            </div>
        </div>

        <div v-if="columns.includes('confirmTransferDate')" class="table-column account">
          <div class="table-cell table-top">确认转出时间</div>
            <div class="table-cell" v-for="item of typeAll" v-if="canAddInsuranceType.includes(item)" :key="item">{{iafInfo.InsuranceAreaId}}</div>
        </div>

        <div v-if="columns.includes('confirmIntoDate')" class="table-column account">
          <div class="table-cell table-top">确认转入时间</div>
            <div class="table-cell" v-for="item of typeAll" v-if="canAddInsuranceType.includes(item)" :key="item">{{iafInfo.InsuranceAreaId}}</div>
        </div>
    </el-form>
        <!-- <div class="no-data" v-if="!canAddInsuranceTypeNumber">该员工无险种可发起流程</div> -->
  </section>
</template>
<script>
import DictShow from '../dict-show'
export default {

  name: 'TablePayBase',

  components: {
    DictShow
  },
  data () {
    return {
      // 是否全参保
      isCheckAll: false,
      // 是否不参保
      isCheckNull: true,
      // 险种类别中文
      insuranceAll: {
        endowment: '养老',
        unemployment: '失业',
        medicare: '医疗',
        employmentInjury: '工伤',
        maternity: '生育',
        supplyEmployeeInjury: '补充工伤',
        supplyMedicare: '大病补医疗',
        hpfund: '公积金'
      },
      // // 支付方式字典
      // payMethods: {},
      // 险种类别英文
      typeAll: ['endowment', 'unemployment', 'medicare', 'employmentInjury', 'maternity', 'supplyEmployeeInjury', 'supplyMedicare', 'hpfund'],
      // 拼接字段后辍
      fieldAll: ['CompPayBase', 'EmpPayBase', 'PaymentMethods', 'AccountPersonalCode', 'AccountName'],
      // 是否不确定 el-checkbox-group 组件
      isIndeterminateAll: false,
      // 是否不确定 el-checkbox-group 组件
      isIndeterminateNull: false
    }
  },

  props: {
    // 是否有选择险种列
    isSelect: Boolean,
    // 选择的险种
    checkedType: {
      type: Array,
      default: []
    },
    // 要显示的列
    columns: {
      type: Array,
      default: () => ['type', 'compbase', 'empbase', 'number', 'payMethods', 'area', 'account']
    },
    // 表头
    header: String,
    // 七险一金基本信息
    iafInfo: Object,
    // 调整前七险一金基本信息
    beforeIafInfo: Object,
    // 是否可编辑
    editPayBase: {
      type: Boolean,
      default: undefined
    },
    // 七险一金基数范围
    benchmarks: {
      type: Object,
      default: {}
    },
    // 可参保的保险类型
    canAddInsuranceType: {
      type: Array,
      default: []
    },
    // 可参保的保险数量
    canAddInsuranceTypeNumber: {
      type: Number,
      default: 0
    },
    // 任务节点
    taskNumber: {
      type: Number
    }
  },

  computed: {
    // 校验规则
    benchmarkRules () {
      return {
        endowmentCompPayBase: [
          {required: true, message: '请输入单位养老基数'},
          {type: 'number', min: this.benchmarks.endowmentCompPayBaseLower, max: this.benchmarks.endowmentCompPayBaseLimit, message: '基数范围' + this.benchmarks.endowmentCompPayBaseLower + '~' + this.benchmarks.endowmentCompPayBaseLimit}
        ],
        endowmentEmpPayBase: [
          {required: true, message: '请输入个人养老基数'},
          {type: 'number', min: this.benchmarks.endowmentEmpPayBaseLower, max: this.benchmarks.endowmentEmpPayBaseLimit, message: '基数范围' + this.benchmarks.endowmentEmpPayBaseLower + '~' + this.benchmarks.endowmentEmpPayBaseLimit}
        ],
        endowmentPaymentMethods: [
          {required: true, message: '请输入养老支付方式'}
        ],
        medicareCompPayBase: [
          {required: true, message: '请输入单位医疗基数'},
          {type: 'number', min: this.benchmarks.medicareCompPayBaseLower, max: this.benchmarks.medicareCompPayBaseLimit, message: '基数范围' + this.benchmarks.medicareCompPayBaseLower + '~' + this.benchmarks.medicareCompPayBaseLimit}
        ],
        medicareEmpPayBase: [
          {required: true, message: '请输入个人医疗基数'},
          {type: 'number', min: this.benchmarks.medicareEmpPayBaseLower, max: this.benchmarks.medicareEmpPayBaseLimit, message: '基数范围' + this.benchmarks.medicareEmpPayBaseLower + '~' + this.benchmarks.medicareEmpPayBaseLimit}
        ],
        medicarePaymentMethods: [
          {required: true, message: '请输入医疗支付方式'}
        ],
        unemploymentCompPayBase: [
          {required: true, message: '请输入单位失业基数'},
          {type: 'number', min: this.benchmarks.unemploymentCompPayBaseLower, max: this.benchmarks.unemploymentCompPayBaseLimit, message: '基数范围' + this.benchmarks.unemploymentCompPayBaseLower + '~' + this.benchmarks.unemploymentCompPayBaseLimit}
        ],
        unemploymentEmpPayBase: [
          {required: true, message: '请输入个人失业基数'},
          {type: 'number', min: this.benchmarks.unemploymentEmpPayBaseLower, max: this.benchmarks.unemploymentEmpPayBaseLimit, message: '基数范围' + this.benchmarks.unemploymentEmpPayBaseLower + '~' + this.benchmarks.unemploymentEmpPayBaseLimit}
        ],
        unemploymentPaymentMethods: [
          {required: true, message: '请输入失业支付方式'}
        ],
        employmentInjuryCompPayBase: [
          {required: true, message: '请输入单位工伤基数'},
          {type: 'number', min: this.benchmarks.employmentInjuryCompPayBaseLower, max: this.benchmarks.employmentInjuryCompPayBaseLimit, message: '基数范围' + this.benchmarks.employmentInjuryCompPayBaseLower + '~' + this.benchmarks.employmentInjuryCompPayBaseLimit}
        ],
        employmentInjuryEmpPayBase: [
          {required: true, message: '请输入个人工伤基数'},
          {type: 'number', min: this.benchmarks.employmentInjuryEmpPayBaseLower, max: this.benchmarks.employmentInjuryEmpPayBaseLimit, message: '基数范围' + this.benchmarks.employmentInjuryEmpPayBaseLower + '~' + this.benchmarks.employmentInjuryEmpPayBaseLimit}
        ],
        employmentInjuryPaymentMethods: [
          {required: true, message: '请输入工伤支付方式'}
        ],
        maternityCompPayBase: [
          {required: true, message: '请输入单位生育基数'},
          {type: 'number', min: this.benchmarks.maternityCompPayBaseLower, max: this.benchmarks.maternityCompPayBaseLimit, message: '基数范围' + this.benchmarks.maternityCompPayBaseLower + '~' + this.benchmarks.maternityCompPayBaseLimit}
        ],
        maternityEmpPayBase: [
          {required: true, message: '请输入个人生育基数'},
          {type: 'number', min: this.benchmarks.maternityEmpPayBaseLower, max: this.benchmarks.maternityEmpPayBaseLimit, message: '基数范围' + this.benchmarks.maternityEmpPayBaseLower + '~' + this.benchmarks.maternityEmpPayBaseLimit}
        ],
        maternityPaymentMethods: [
          {required: true, message: '请输入工伤支付方式'}
        ],
        supplyMedicareCompPayBase: [
          {required: true, message: '请输入单位大病补医保基数'},
          {type: 'number', min: this.benchmarks.supplyMedicareCompPayBaseLower, max: this.benchmarks.supplyMedicareCompPayBaseLimit, message: '基数范围' + this.benchmarks.supplyMedicareCompPayBaseLower + '~' + this.benchmarks.supplyMedicareCompPayBaseLimit}
        ],
        supplyMedicareEmpPayBase: [
          {required: true, message: '请输入个人大病补医保基数'},
          {type: 'number', min: this.benchmarks.supplyMedicareEmpPayBaseLower, max: this.benchmarks.supplyMedicareEmpPayBaseLimit, message: '基数范围' + this.benchmarks.supplyMedicareEmpPayBaseLower + '~' + this.benchmarks.supplyMedicareEmpPayBaseLimit}
        ],
        supplyMedicarePaymentMethods: [
          {required: true, message: '请输入大病补医保支付方式'}
        ],
        supplyEmployeeInjuryCompPayBase: [
          {required: true, message: '请输入单位补充工伤基数'},
          {type: 'number', min: this.benchmarks.supplyEmployeeInjuryCompPayBaseLower, max: this.benchmarks.supplyEmployeeInjuryCompPayBaseLimit, message: '基数范围' + this.benchmarks.supplyEmployeeInjuryCompPayBaseLower + '~' + this.benchmarks.supplyEmployeeInjuryCompPayBaseLimit}
        ],
        supplyEmployeeInjuryEmpPayBase: [
          {required: true, message: '请输入个人补充工伤基数'},
          {type: 'number', min: this.benchmarks.supplyEmployeeInjuryEmpPayBaseLower, max: this.benchmarks.supplyEmployeeInjuryEmpPayBaseLimit, message: '基数范围' + this.benchmarks.supplyEmployeeInjuryEmpPayBaseLower + '~' + this.benchmarks.supplyEmployeeInjuryEmpPayBaseLimit}
        ],
        supplyEmployeeInjuryPaymentMethods: [
          {required: true, message: '请输入补充工伤支付方式'}
        ],
        hpfundCompPayBase: [
          {required: true, message: '请输入单位公积金基数'},
          {type: 'number', min: this.benchmarks.hpfundCompPayBaseLower, max: this.benchmarks.hpfundCompPayBaseLimit, message: '基数范围' + this.benchmarks.hpfundCompPayBaseLower + '~' + this.benchmarks.hpfundCompPayBaseLimit}
        ],
        hpfundEmpPayBase: [
          {required: true, message: '请输入个人公积金基数'},
          {type: 'number', min: this.benchmarks.hpfundEmpPayBaseLower, max: this.benchmarks.hpfundEmpPayBaseLimit, message: '基数范围' + this.benchmarks.hpfundEmpPayBaseLower + '~' + this.benchmarks.hpfundEmpPayBaseLimit}
        ],
        hpfundPaymentMethods: [
          {required: true, message: '请输入补充工伤支付方式'}
        ]
      }
    }
  },
  watch: {
    checkedType: {
      handler (val) {
        if (!val.length) {
          this.isCheckNull = true
          this.isCheckAll = false
        }
        this.typeAll.forEach(item => {
          this.iafInfo[item] = val.includes(item)
        })
        if (val.length === this.canAddInsuranceTypeNumber) {
          this.isCheckAll = true
          this.isCheckNull = false
          this.isIndeterminateNull = false
        } else if (val.length === 0) {
          this.isIndeterminateAll = false
          this.isCheckNull = true
          this.isCheckAll = false
        } else {
          this.isCheckAll = false
          this.isCheckNull = false
          this.isIndeterminateAll = val.length > 0 && val.length < this.canAddInsuranceTypeNumber
        }
      },
      immediate: true
    },
    canAddInsuranceType: {
      handler (val) {
        if (val.length && this.taskNumber === 0) {
          this.isCheckNull = true
          this.isCheckAll = false
          this.isIndeterminateAll = false
        }
      },
      immediate: true
    }
  },
  methods: {

    /**
     * 判断对应保险类型缴纳基数是否有调整
     *
     * @param {String} type 保险类型
     * @param {String} compPayBase 单位缴纳基数
     * @param {String} empPayBase 个人缴纳基数
     */

    changeItem (type, compPayBase, empPayBase, PaymentMethods) {
      if (!this.beforeIafInfo) return
      this.iafInfo[type] = this.iafInfo[compPayBase] !== this.beforeIafInfo[compPayBase] || this.iafInfo[empPayBase] !== this.beforeIafInfo[empPayBase] || this.iafInfo[PaymentMethods] !== this.beforeIafInfo[PaymentMethods]
    },

    /**
     *选择险种
     *
     * @param {Array} value 选择的保险种类
     */

    handleCheckedTypeChange (value) {
      this.$emit('update:checkedType', value)
      // let checkedCount = value.length
      // this.isCheckAll = checkedCount === this.canAddInsuranceTypeNumber
      // this.isCheckNull = checkedCount === 0
      // this.isIndeterminateAll = checkedCount > 0 && checkedCount < this.canAddInsuranceTypeNumber
    },
    /**
     *选择不参保
     *
     * @param {Boolean} val 选择的保险种类
     */

    handleCheckNullChange (val) {
      this.$emit('update:checkedType', val ? [] : this.canAddInsuranceType)
      this.isIndeterminateNull = false
      this.isCheckAll = !val
    },

    /**
     *选择全参保
     *
     * @param {Boolean} val 选择的保险种类
     */

    handleCheckAllChange (val) {
      this.$emit('update:checkedType', val ? this.canAddInsuranceType : [])
      this.isCheckNull = !val
      this.isIndeterminateAll = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .wrap{
    margin:0 auto;
    border:1px solid #e5e5e5;
    border-left:0 none;
    border-bottom:0 none;
    font-size:14px;
    display: flex;
  }
  // .no-data{
  //   border: 1px solid #e5e5e5;
  //   border-top: none;
  //   height: 60px;
  //   font-size: 14px;
  //   text-align: center;
  //   line-height: 60px;
  // }
  .table-head{
    margin:0;
    text-align: center;
    border: 1px solid #e5e5e5;
    line-height: 30px;
  }
  .table-column{
    text-align:center;
    border-left: 1px solid #e5e5e5;
    .table-cell{
      min-height: 50px;
      line-height: 40px;
      border-bottom: 1px solid #e5e5e5;
      .table-tooltip{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    &.account{
      flex:1;
      .table-top{
        min-height: 60px;
        line-height:60px;
        border-bottom:1px solid #e5e5e5;
      }
    }
    &.type-select{
      flex-basis: 200px;
      .table-top{
        min-height: 60px;
        // line-height:30px;// 有选择按纽时
        line-height:60px;
        border-bottom:1px solid #e5e5e5;
      }
    }
    &.type, &.compbase, &.empbase, &.number, &.area{
      flex-basis: 180px;
      .table-top{
        min-height: 60px;
        line-height:60px;
        border-bottom:1px solid #e5e5e5;
      }
    }
  }
  .el-form-item{
    margin-bottom: 0;
    border-bottom: 1px solid #e5e5e5;
    padding: 0px 10px 10px 10px;
    /deep/ .el-input__inner{
      height: 22px;
    }
    /deep/ .el-form-item__error{
      top: 30px;
    }
  }

</style>
