<template>
  <div class="rank-anlystics-container">
    <section class="percent-bar">
      <ul class="bar-body">
        <li class="bar-part" 
        v-for="(item, index) in statisticsData.statistics" 
        :key="index"
        :style="partStyle"
        >{{item.percent}}%({{item.num}})人</li>
      </ul>
    </section>
    <section class="rank-tabs">
      <el-tabs v-model="currentRankName" @tab-click="handleTabClick">
        <el-tab-pane v-for="(rank, index) in statisticsData.statistics" :key="index" :name="rank.levelName" :label="`等级${rank.levelName}`"></el-tab-pane>
      </el-tabs>
    </section>
    <section class="rank-table">
      <el-table :data="tableData">
        <el-table-column label="工号" prop="employeeCode"></el-table-column>
        <el-table-column label="姓名" prop="employeeName"></el-table-column>
        <el-table-column label="部门" prop="orgName"></el-table-column>
        <el-table-column label="总分" prop="totalScore"></el-table-column>
        <el-table-column label="等级" prop="level"></el-table-column>
      </el-table>
    </section>
  </div>
</template>
<script>
import request from 'api/performance/plan-manage'
export default {
  name: 'rank-anlystics',
  props: {
    statisticsData: {
      type: Object
    },
    period: String,
    schemeId: String
  },
  methods: {
    getTableData () {
      let params = {
        schemeId: this.schemeId,
        period: this.period,
        level: this.currentRankName
      }
      request('getPlanList', params).then(res => {
        this.tableData = res.data
      })
    },
    handleTabClick (val) {
      this.currentRankName = val.name
      this.getTableData()
    }
  },
  created () {
    this.currentRankName = this.statisticsData.statistics[0].levelName
    this.getTableData()
  },
  data () {
    let that = this
    return {
      partStyle: {
        'min-width': `${Math.floor(100 / that.statisticsData.statistics.length)}%`
      },
      tableData: [],
      currentRankName: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.bar-body {
  overflow: hidden;
  display: flex;
  .bar-part {
    box-sizing: border-box;
  }
  .bar-body:last-child {
    border-top-right-radius:15px;
    border-bottom-right-radius:15px;
  }
  .bar-part:nth-child(1) {
    background-color: #58E3E3;
    border-bottom-left-radius:15px;
    border-top-left-radius:15px;
  }
  .bar-part:nth-child(2) {
    background-color: #29C4B1
  }
  .bar-part:nth-child(3) {
    background-color: #1CA8A8
  }
  .bar-part:nth-child(4) {
    background-color: #1DA090
  }
}
</style>
