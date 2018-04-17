<template>
  <div>
    <div>
      <p class="head">
        <span>总金额 : <b>{{totalMoney}} 元</b></span>
        <span class="headPeopel">总人数 : <b>{{totalPeople}} 人</b></span>
      </p>
    </div>
    <div class="table">
      <p><span class="title">转账-直连</span><span class="totalMoney">总金额 : <b>{{DirectSummaryTotalMoney}} 元</b></span><span class="totalPeople">总人数 : <b>{{DirectSummaryTotalPeopel}} 人</b></span></p>
      <div class="tab">
        <el-table
          :data="applyCheckData.DirectSummary"
          border
          :summary-method="getSummaries"
          show-summary
          style="width: 100%">
          <el-table-column
            prop="companyName"
            label="发薪主体"
            align="center"
            width="280">
          </el-table-column>
          <el-table-column
            prop="groupName"
            label="薪资组"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="totalNumber"
            label="人数"
            align="center"
            width="170">
          </el-table-column>
          <el-table-column
            prop="finalPayingAmount"
            label="金额"
            align="center"
            width="169">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table">
      <p><span class="title">转账-报盘</span><span class="totalMoney">总金额 : <b>{{OfferSummaryTotalMoney}} 元</b></span><span class="totalPeople">总人数 : <b>{{OfferSummaryTotalPeopel}} 人</b></span></p>
      <div class="tab">
        <el-table
          :data="applyCheckData.OfferSummary"
          border
          show-summary
          style="width: 100%">
          <el-table-column
            prop="companyName"
            label="发薪主体"
            align="center"
            width="280">
          </el-table-column>
          <el-table-column
            prop="groupName"
            label="薪资组"
            align="center"
            width="190">
          </el-table-column>
          <el-table-column
            prop="totalNumber"
            label="人数"
            align="center"
            width="160">
          </el-table-column>
          <el-table-column
            prop="finalPayingAmount"
            label="金额"
            align="center"
            width="169">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table">
      <p><span class="title">现金支付</span><span class="totalMoney">总金额 : <b>{{CashSummaryTotalMoney}} 元</b></span><span class="totalPeople">总人数 : <b>{{CashSummaryTotalPeopel}} 人</b></span></p>
      <div class="tab">
        <el-table
          :data="applyCheckData.CashSummary"
          border
          show-summary
          style="width: 100%">
          <el-table-column
            prop="companyName"
            label="发薪主体"
            align="center"
            width="280">
          </el-table-column>
          <el-table-column
            prop="groupName"
            label="薪资组"
            align="center"
            width="190">
          </el-table-column>
          <el-table-column
            prop="totalNumber"
            label="人数"
            align="center"
            width="160">
          </el-table-column>
          <el-table-column
            prop="finalPayingAmount"
            label="金额"
            align="center"
            width="169">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    applyCheckData: Object
  },
  data () {
    return {
      DirectSummaryTotalPeopel: '',
      DirectSummaryTotalMoney: '',
      OfferSummaryTotalPeopel: '',
      OfferSummaryTotalMoney: '',
      CashSummaryTotalPeopel: '',
      CashSummaryTotalMoney: '',
      totalPeople: '',
      totalMoney: ''
    }
  },
  // 计算每一分项的总计
  created () {
    const arr1 = this.applyCheckData.DirectSummary.map(item => {
      return item.totalNumber
    })
    const arr2 = this.applyCheckData.DirectSummary.map(item => {
      return item.finalPayingAmount
    })
    const arr3 = this.applyCheckData.OfferSummary.map(item => {
      return item.totalNumber
    })
    const arr4 = this.applyCheckData.OfferSummary.map(item => {
      return item.finalPayingAmount
    })
    const arr5 = this.applyCheckData.CashSummary.map(item => {
      return item.totalNumber
    })
    const arr6 = this.applyCheckData.CashSummary.map(item => {
      return item.finalPayingAmount
    })
    this.DirectSummaryTotalPeopel = this.addArr(arr1)
    this.DirectSummaryTotalMoney = this.addArr(arr2)
    this.OfferSummaryTotalPeopel = this.addArr(arr3)
    this.OfferSummaryTotalMoney = this.addArr(arr4)
    this.CashSummaryTotalPeopel = this.addArr(arr5)
    this.CashSummaryTotalMoney = this.addArr(arr6)
    this.totalPeople = this.DirectSummaryTotalPeopel + this.OfferSummaryTotalPeopel + this.CashSummaryTotalPeopel
    this.totalMoney = this.DirectSummaryTotalMoney + this.OfferSummaryTotalMoney + this.CashSummaryTotalMoney
  },
  methods: {
    addArr (arr) {
      let total = 0
      arr.map(item => {
        total += item
      })
      return total
    }
  }
}
</script>
<style lang="scss" scoped>
  .head{
    padding-bottom:20px;
    font-family: '微软雅黑';
    font-weight: 410;
    color:#f00;
    .headPeopel{
      margin-left:60px;
    }
  }
  .table{
    border:1px solid #eee;
    margin-bottom:10px;
    p{
      padding:0 15px;
      height: 40px;
      line-height: 40px;
      background:#eee;
      .title{
        font-family: "微软雅黑 Bold", "微软雅黑 Regular", 微软雅黑;
        font-weight: 700;
        font-style: normal;
        font-size: 16px;
        color: rgb(102, 102, 102);
      }     
      .totalMoney{
        margin-left:300px;
      }
      .totalPeople{
        margin-left:140px;
      }
    }
  }
  .tab{
    padding:10px 15px;
  }
</style>


