<template>
  <el-form ref="form" class="laborhour-tranfer-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
        <ul class="i-dialog-form">
            <li class="item">
                <el-form-item label-width="140px" label="工号" prop="employeeCode">
                    <el-input v-model="form.employeeCode" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划出人事范围" prop="transferOutPersonnelName">
                    <el-input v-model="form.transferOutPersonnelName" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划出人事范围代码" prop="transferOutPersonnelCode">
                    <el-input v-model="form.transferOutPersonnelCode" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划拨月份" prop="transferMonth">
                    <el-date-picker
                        v-model="form.transferMonth"
                        type="month"
                        disabled
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="140px" label="订单类型" prop="aufnType">
                    <i-select v-model="form.aufnType" parameter="AUFN_TRANSFER_TYPE" placeholder="请选择" disabled></i-select>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊金额" prop="allocationAmount">
                    <el-input type="number" v-model.number="form.allocationAmount" disabled ></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="内部订单号" prop="internalOrder">
                    <el-input type="number" v-model.number="form.internalOrder" disabled ></el-input>
                </el-form-item>
                <!-- <el-form-item label-width="140px" label="费用划入单位" prop="transferInUnitName">
                    <el-input v-model="form.transferInUnitName" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="费用类型" prop="costType">
                    <i-select v-model="form.costType" parameter="EXPENSE_TYPE" disabled></i-select>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊工资" prop="allocationPayroll">
                    <el-input type="number" v-model.number="form.allocationPayroll" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊事业保险费用" prop="allocationUnemploymentInsurance">
                    <el-input type="number" v-model.number="form.allocationUnemploymentInsurance" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊工伤保险费用" prop="allocationInjuryInsurance">
                    <el-input type="number" v-model.number="form.allocationInjuryInsurance" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊公积金费用" prop="allocationHousingFund">
                    <el-input type="number" v-model.number="form.allocationHousingFund" disabled></el-input>
                </el-form-item> -->
            </li>
            <li class="item">
                <el-form-item label-width="140px" label="姓名" prop="employeeName">
                    <el-input v-model="form.employeeName" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划出成本中心" prop="transferCostCenterOutName">
                    <el-input v-model="form.costCenterOutName" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划出成本中心代码" prop="transferCostCenterOutCode">
                    <el-input v-model="form.costCenterOutCode" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="开始日期" prop="beginDate">
                    <el-date-picker
                        v-model="form.beginDate"
                        type="date"
                        disabled
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="140px" label="结束日期" prop="endDate">
                    <el-date-picker
                        v-model="form.endDate"
                        type="date"
                        disabled
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊比例" prop="allocationProportion">
                    <el-input type="number" v-model.number="form.allocationProportion" disabled >
                        <!-- <template slot="append">%</template> -->
                    </el-input>
                </el-form-item>
                <!-- <el-form-item label-width="140px" label="含法定节假日天数" prop="holidayDays">
                    <el-input type="number" v-model.number="form.holidayDays" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="费用划入成本中心" prop="transferInCostCenterCode">
                    <el-input v-model="form.transferInCostCenterCode" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="内部订单号" prop="internalOrder">
                    <el-input v-model="form.internalOrder" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊养老保险费用" prop="allocationEndowmentInsurance">
                    <el-input type="number" v-model.number="form.allocationEndowmentInsurance" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊医疗保险费用" prop="allocationMedicalInsurance">
                    <el-input type="number" v-model.number="form.allocationMedicalInsurance" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊生育保险费用" prop="allocationMaternityInsurance">
                    <el-input type="number" v-model.number="form.allocationMaternityInsurance" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="小计分摊金额" prop="allocationTotal">
                    <el-input type="number" v-model.number="form.allocationTotal" disabled></el-input>
                </el-form-item> -->
            </li>
        </ul>
        <el-form-item label-width="140px" label="备注" prop="remark">
            <el-input v-model="form.remark" disabled></el-input>
        </el-form-item>
  </el-form>
</template>
<script>
  export default {
    name: 'CheckDetail',
    props: {
      detailShow: Object
    },
    data: function () {
      return {
        form: {}
      }
    },
    created () {
      this.detailShow.beginDate = new Date(this.detailShow.beginDate)
      this.detailShow.endDate = new Date(this.detailShow.endDate)
    //   this.detailShow.allocationProportion = this.detailShow.allocationProportion ? this.detailShow.allocationProportion * 100 : ''
      this.form = this.detailShow
    }
  }
</script>
<style lang="scss">

</style>