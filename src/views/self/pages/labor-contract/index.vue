<template>
    <div>
        <div class="main">  
            <h1>我的劳动合同</h1>
            <i-table :table="myContract">
            <template slot="table" slot-scope="tableScope">
                <!-- :data="tableScope.clone" -->
                <el-table :data="tableScope.clone">
                <el-table-column
                    v-for="(col, idx) of myContract.columns"
                    :key="idx"
                    :prop="col.prop"
                    :label="col.label"
                    align="center"
                    :formatter="tableScope.formatter"
                />
                </el-table>
            </template>
            </i-table>
              <div v-if="false" class="text">
                  <p>1.合同期限类型包括：固定期限劳动合同和无固定期限合同。</p>
                  <p>2.固定期限劳动合同原则上签订3年期限；无固定期限劳动合同签订条件；连续在美的工作十年以上；或2018年1月1日后再同一经营单位连续订立两次固定期限劳动合同。</p>
                  <p>（例外条件：员工个人书面提出签订固定期限劳动合同除外）</p>
                  <p>3.合同类型包括：劳动合同、特聘合同、退休人员聘用合同。</p>
                  <p>4.所有MPA类员工需签订保密协议，视员工岗位性质及要求确定是否签订竞业限制协议。</p>
              </div>
        </div>
        <!-- 合同变更记录 -->
        <div class="main-bottom">
          <h1>合同变更记录</h1>
          <i-table :table="ChangeContract">
          <template slot="table" slot-scope="tableScope">
              <!-- :data="tableScope.clone" -->
              <el-table :data="tableScope.clone">
              <el-table-column
                  v-for="(col, idx) of ChangeContract.columns"
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
import req from 'api/self/labor-contract'
import ITable from 'components/common/i-table'
// import moment from 'moment'
export default {
  components: {
    Crumbs,
    ITable
  },
  data () {
    return {
      myContract: {
        columns: [
        { prop: 'hireDate', label: '入司时间', display: {date: 'default'} },
        { prop: 'startDate', label: '合同开始时间', display: {date: 'default'} },
        { prop: 'endDate', label: '合同结束时间', display: {date: 'default'} },
        { prop: 'companyName', label: '合同主体' },
        { prop: 'contractType', label: '合同类型', display: {dict: 'CONTRACT_TYPE'} },
        { prop: 'contractPeriodType', label: '合同期限类型', display: {dict: 'CONTRACT_PERIOD_TYPE'} }
        // { prop: 'isConfidentia', label: '保密协议', display: {dict: 'CONFIDENTIA_TYPE'} },
        // { prop: 'isNonCompetition', label: '竞业限制协议', display: {dict: 'CONFIDENTIA_TYPE'} }1111111111111111111111111
        ],
        data: null // 静态挂载
      },
      ChangeContract: {
        columns: [
        { prop: 'startDate', label: '开始时间', display: {date: 'default'} },
        { prop: 'endDate', label: '结束时间', display: {date: 'default'} },
        { prop: 'companyName', label: '合同主体' },
        { prop: 'status', label: '合同状态', display: {dict: 'CONTRACT_STATUS'} }
        ],
        data: null // 静态挂载
      },
      isHidden: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    toggleSidebar () {
      this.isHidden = !this.isHidden
    },
    init () {
      req('contract').then(res => {
        this.myContract.data = [res]
      })
      req('history').then(res => {
        this.ChangeContract.data = res
      })
    }
  }
}
</script>
<style  lang="scss" scoped>
    .crumb {
            padding-bottom: 10px
    }
    .main {
        background: #ffffff;
        padding-bottom: 20px;
        .i-table {
          padding: 20px 20px 0 20px;  
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
    .text {
      padding: 10px 20px 20px 60px;
      margin: 0 19px 0 19px;
      border: 1px solid #e8e8e8;
      background: #f4faff;
      border-top: none;
       p {
            padding-top: 10px;
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