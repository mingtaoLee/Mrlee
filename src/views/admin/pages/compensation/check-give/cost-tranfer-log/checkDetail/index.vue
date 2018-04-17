<template>
  <el-form ref="form" class="laborhour-tranfer-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
        <ul class="i-dialog-form">
            <li class="item">
                <el-form-item label-width="140px" label="工号">
                    <el-input v-model="form.employeeCode" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划出人事范围">
                    <el-input v-model="form.transferOutPersonnelName" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划出人事范围代码">
                    <el-input v-model="form.transferOutPersonnelCode" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="费用类型">
                    <i-select v-model="form.costType" parameter="EXPENSE_TRANSFER_TYPE" disabled></i-select>
                </el-form-item>
                <el-form-item label-width="140px" label="开始日期">
                    <el-date-picker
                        v-model="form.beginDate"
                        type="date"
                        disabled
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="140px" label="费用分摊天数">
                    <el-input type="number" v-model.number="form.allocationDays" disabled ></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划入人事范围">
                    <el-input v-model="form.transferInPersonnelName" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划入人事范围代码">
                    <el-input v-model="form.transferInPersonnelCode" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊金额">
                    <el-input type="number" v-model.number="form.allocationAmount" disabled></el-input>
                </el-form-item>
            </li>
            <li class="item">
                <el-form-item label-width="140px" label="姓名">
                    <el-input v-model="form.employeeName" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划出成本中心">
                    <el-input v-model="form.costCenterOutName" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划出成本中心代码">
                    <el-input v-model="form.costCenterOutCode" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划拨月份">
                    <el-date-picker
                        v-model="form.transferMonth"
                        type="month"
                        disabled
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="140px" label="结束日期">
                    <el-date-picker
                        v-model="form.endDate"
                        type="date"
                        disabled
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="140px" label="含法定节假日天数">
                    <el-input type="number" v-model.number="form.holidayDays" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划入成本中心">
                    <el-input v-model="form.costCenterInName" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划入成本中心代码">
                    <el-input v-model="form.costCenterInCode" disabled></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊比例">
                    <el-input type="number" v-model.number="form.allocationProportion" disabled></el-input>
                </el-form-item>
            </li>
        </ul>
        <el-form-item label-width="140px" label="备注">
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
      this.form = this.detailShow
    }
  }
</script>
<style lang="scss">

</style>