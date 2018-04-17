<template>
  <el-form ref="data" v-loading="loading" :element-loading-text="$loadingText" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="data" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="人事范围">{{data.personnelGroupName}}</el-form-item>
        <el-form-item label="组织代码">{{data.orgCode}}</el-form-item>
        <el-form-item label="所属组织">{{data.orgName}}</el-form-item>
      </li>
      <li class="item">
        <el-form-item label="员工姓名">{{data.employeeName}}</el-form-item>
        <el-form-item label="员工工号">{{data.employeeCode}}</el-form-item>
        <el-form-item label="核算月份" prop="cashMonth">
          {{data.cashMonth | dateFilter('YYYY-MM')}}
        </el-form-item>
      </li>
    </ul>
    <el-form-item label="奖惩项：">
      <el-table
        :data="data.cashPerfInfoList"
      >
        <el-table-column
          label="项目"
          prop="label"
        >
        </el-table-column>
        <el-table-column
          label="单价"
          prop="price"
          align="right"
        >
        </el-table-column>
        <el-table-column
          label="次数"
          prop="rewardPunishNum"
        >
        </el-table-column>
      </el-table>
    </el-form-item>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="奖惩合计：">{{data.cashTotal}}</el-form-item>
        <el-form-item label="操作者：">{{data.createBy}}</el-form-item>
        <el-form-item label="操作时间：">{{data.createDate | dateFilter('YYYY-MM-DD hh:mm:ss')}}</el-form-item>
      </li>
      <li class="item">
        <el-form-item label="收银奖励：">{{data.reward}}</el-form-item>
        <el-form-item label="收银系数：">{{data.cashRatio}}</el-form-item>
        <el-form-item label="收银绩效：">{{data.cashPerf}}</el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  export default {
    props: {
      data: Object
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
