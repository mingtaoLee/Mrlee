<template>
  <el-form :model="formInfo" :rules="rules" label-width="125px">
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item prop="componentName" label="薪资项目">
          <el-input v-model="formInfo.componentName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <!--<el-form-item prop="componentType" label="适用类型">-->
          <!--<ISelect v-model="formInfo.componentType" parameter="dict" disabled></ISelect>-->
        <!--</el-form-item>-->
      </el-col>
      <el-col :span="22" :offset="2">
        <h4 class="range-title">范围选择</h4>
        <RangeFilter v-model="rangeFilterData"></RangeFilter>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
//  import { showMessage, confirmPopover } from 'utils/index'
  import ISelect from 'components/common/i-select/i-select'
  import RangeFilter from 'components/compensation/range-filter'

  export default {
    components: {
      RangeFilter,
      ISelect
    },
    data () {
      return {
        rangeFilterData: {
          value: [],
          text: ''
        }
      }
    },
    props: {
      formInfo: {
        type: Object,
        default: () => {
          return {
            componentName: '',
            componentType: '',
            employeeRangeList: []
          }
        }
      }
    },
    created () {
      this.initData()
    },
    watch: {
      rangeFilterData () {
        console.log('this.rangeFilterData', this.rangeFilterData)
        this.$emit('getRangeFilterData', this.rangeFilterData)
      }
    },
    methods: {
      initData () {
        if (this.formInfo.employeeRangeList.length > 0) {
//          console.log('eeee2222', this.formInfo.employeeRangeList)
          this.rangeFilterData.value = this.formInfo.employeeRangeList.slice(0)
          console.log('eeee', this.rangeFilterData, this.formInfo.employeeRangeList)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../../../styles/vars.scss";
.range-title{
  padding-left: 15px;
  background: $color-grey;
  line-height: 35px;
  margin-bottom: 15px;
}
</style>
