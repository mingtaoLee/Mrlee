<template>
  <el-form :model="data" :rules="rules" label-width="130px">
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item prop="componentName" label="薪资项目">
          <el-input v-model="data.componentName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <!--<el-form-item prop="componentType" label="适用类型">-->
          <!--<ISelect v-model="data.componentType" parameter="dict" disabled></ISelect>-->
        <!--</el-form-item>-->
      </el-col>
      <el-col :span="24">
        <IFormula v-model="formulaData" ref="IFormula"></IFormula>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  //  import { showMessage, confirmPopover } from 'utils/index'
  import ISelect from 'components/common/i-select/i-select'
  import IFormula from 'components/compensation/formula-calculator'
  import mixin from 'components/compensation/formula-calculator/mixin'

  export default {
    components: {
      IFormula,
      ISelect
    },
    mixins: [mixin],
    data () {
      return {
        formulaData: {
          value: [],
          label: ''
        }
      }
    },
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    watch: {
      'formulaData.value' () {
        this.emitData()
      },
      'formulaData.label' () {
//        this.emitData()
      }
    },
    created () {
      this.initData()
    },
    methods: {
      emitData () {
        this.$emit('getFormulaData', this.formulaData)
      },
      initData () {
        if (this.data.calculateRuleInfoDto) {
          this.formulaData = Object.assign({}, this.data.calculateRuleInfoDto)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
