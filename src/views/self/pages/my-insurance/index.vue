<template>
    <div>
        <div class="main">    
                      <!-- 合同变更记录 -->
            <h1>我的保险</h1>
            
            <h2>参保地：{{InsuredPlace}}
                <el-date-picker
                v-model="searchMonth"
                type="month"
                placeholder="选择月"
                class="searchMonth"
                @blur="monthBlur"
                >
                <!-- v-model="searchMonth" -->
              </el-date-picker>
            </h2>
            <i-table :table="myInsurance">
            <template slot="table" slot-scope="tableScope" align="center">
                <!-- :data="tableScope.clone" -->
                <el-table :data="tableScope.clone">
                    <el-table-column
                    v-for="col of myInsurance.columns"
                    align="center"
                    :key="col.prop"
                    :prop="col.prop"
                    :label="col.label"
                    :width="col.width"
                    :formatter="tableScope.formatter">
                    <el-table-column
                      v-for="son of col.children"
                      align="center"
                      :key="son.prop"
                      :prop="son.prop"
                      :label="son.label"
                      :width="son.width"
                      :formatter="tableScope.formatter"/>
                  </el-table-column>
          
                </el-table>
            </template>
            </i-table>
            </div>
            <div class="main-bottom">
            <h1>我的商业险</h1>
            <i-table :table="commerceInsurance">
            <template slot="table" slot-scope="tableScope">
                <!-- :data="tableScope.clone" -->
                <el-table :data="tableScope.clone">
                <el-table-column
                    v-for="(col, idx) of commerceInsurance.columns"
                    :key="idx"
                    :prop="col.prop"
                    :label="col.label"
                    align="center"
                    :formatter="tableScope.formatter"
                />
                </el-table>
            </template>
            </i-table>
        </div>
    </div>
</template>
      

<script>
import Crumbs from 'components/common/layout/crumbs'
import req from 'api/self/my-insurances'
import ITable from 'components/common/i-table'
import moment from 'moment'
export default {
  components: {
    Crumbs,
    ITable
  },
  data () {
    return {
      myInsurance: {
        columns: [
         { prop: 'insuranceType', label: '险种', display: {dict: 'INSURANCE_TYPE'} },
         { prop: 'empInsuredAccount', label: '个人号码' },
         { prop: 'accountCode', label: '户头编码' },
         { prop: 'accountName', label: '户头名称' },
          { label: '缴纳基数',
            children: [
              {prop: 'compPayBase', label: '单位'},
              {prop: 'empPayBase', label: '个人'}
            ] },
          { label: '缴纳比例',
            children: [
              {prop: 'compPayRatio', label: '单位'},
              {prop: 'empPayRatio', label: '个人'}
            ] },
          { label: '缴纳金额',
            children: [
              {prop: 'compPayValue', label: '单位'},
              {prop: 'empPayValue', label: '个人'}
            ] },
          { prop: 'sumPay', label: '合计' }
        ],
        data: null // 静态挂载
      },
      commerceInsurance: {
        columns: [
        { prop: 'insuranceCompanyName', label: '保险公司' },
        { prop: 'numberOfPolicy', label: '保单号' },
        { prop: 'effectiveDate', label: '保单生效时间', display: {date: 'default'} },
        { prop: 'uneffectiveDate', label: '保单失效时间', display: {date: 'default'} }
        ],
        data: null // 静态挂载
      },
      searchMonth: '',
      InsuredPlace: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init (date) {
      req('findIafInformations', {payMonth: date}).then(res => {
        this.myInsurance.data = res
        // console.log(this.myInsurance.data)
        // if (res[0] === null) {
        //   console.log(this.myInsurance.data)
        // }
        if (!date) {
          this.searchMonth = moment(res[0].payMonth).format('YYYY-MM')
        }
      })
      req('findCommercialRecordByEmployeeId', {payMonth: date}).then(data => {
        if (data) {
          this.commerceInsurance.data = data
        }
        // req('findInsuredLand', {payMonth: this.searchMonth}).then(res => {
        //   this.InsuredPlace = res
        // })
      })
      if (this.searchMonth) {
        req('findInsuredLand', {payMonth: this.searchMonth}).then(res => {
          this.InsuredPlace = res
        })
      }
    },
    monthBlur () {
      this.searchMonth = moment(this.searchMonth).format('YYYY-MM-DD, hh:mm:ss')
      if (this.searchMonth !== 'Invalid date') {
        this.init(this.searchMonth)
      }
    }
  }
}
</script>
<style  lang="scss" scoped>
    .crumb {
            padding-bottom: 10px
    }
    .main {
      background: #fff;
      position: relative;
      .i-table {
        padding: 0 20px 20px 20px;  
      }
      
      h1 {
        font-size: 18px;
        font-weight: 800;
        height: 60px;
        line-height: 60px;
        background: #fafafa;
        padding: 0 20px;
      }
      h2 {
        height: 66px;
        line-height: 66px;
        font-size: 14px;
        padding-left: 20px;
        position: relative;
        .searchMonth {
            position: absolute;
            right: 20px;
            top: 4px;
            width: 170px;
        }
      }
  }
  .main-bottom {
      margin-top: 15px;
      background: #ffffff;
      .i-table {
        padding: 20px;
      }
    h1 {
        font-size: 18px;
        font-weight: 800;
        height: 60px;
        line-height: 60px;
        background: #fafafa;
        padding: 0 20px;
      }
  }

</style>
<style lang="scss">
  .el-main {
    background: #f8f8f8
  }
  .main th{
    font-weight: normal;
    color: #000000 !important;
  }
  .main-bottom th{
    font-weight: normal;
    color: #000000 !important;
  }
</style>