<template>
<div>
  <i-layout :limitHeight="false">
    <div class="header" slot="section">
      <span class="title bold">编制计划名称：{{scaPlanName}}</span>
      <span class="title bold">维度：{{dimensionName}}</span>
      <span class="title bold">年度：{{year}}</span>
    </div>
  </i-layout>
  <div class="margin20"></div>
  <i-layout :eliminateHeight="160">
    <check-plan-tree @nodeClick="nodeClick" :rootNodes="orgs"  slot="aside" />
    <plan-detail-search slot="header" @search="search" />
    <plan-detail-home-table slot="section" :scaPlanId="scaPlanId"
    @form="form" @modify="modify" @check="check" :editable="editable"
     ref="scaPlanTable" />
  </i-layout>

  <!-- 常规填报、修改弹窗 -->
  <normal-plan-details ref="normal"></normal-plan-details>

  <!-- 小店填报、修改弹窗 -->
  <small-shop-plan-details ref="smallShop"></small-shop-plan-details>

</div>
</template>

<script>
import {windowOpen} from 'utils/'
import ILayout from 'components/common/i-layout'
import MainContainer from 'components/common/layout/main-container'
import PlanDetailSearch from 'components/compile/search/plan-detail-search'
import PlanDetailHomeTable from 'components/compile/table/plan-detail-home-table'
import CheckPlanTree from 'components/compile/tree/check-plan-tree'
import NormalPlanDetails from './normal-plan-details'
import SmallShopPlanDetails from './small-shop-plan-details'
import {scaReportType} from 'config/dict'

export default {
  name: 'CheckPlan',
  components: {
    ILayout,
    MainContainer,
    PlanDetailSearch,
    PlanDetailHomeTable,
    CheckPlanTree,
    NormalPlanDetails,
    SmallShopPlanDetails
  },
  data () {
    return {
      // 编制计划id
      scaPlanId: '',
      // 组织id逗号连接字符串
      orgUnitIds: '',
      // 编制计划名称
      scaPlanName: '',
      // 年份
      year: '',
      // 维度名称
      dimensionName: '',
      // 组织数组
      orgs: [],
      // 是否可编辑
      editable: false
    }
  },

  methods: {
    // 配置返回对应的column
    getColumns (data) {
      let newColumn = []
      data.map(ele => {
        newColumn.push({label: ele.bussinessName, prop: ele.bussinessId, havingProposal: Number(ele.havingProposal)})
      })
      return newColumn
    },
    // 点击组织节点
    nodeClick (node) {
      console.log(node)
    },
    // 高级搜索
    search (params) {
      this.$refs.scaPlanTable.showTempList(true, params)
    },
    // 填报计划
    form (header, data) {
      // todo:这里需要确定小店所属组织类型代码
      let planData = {header: JSON.stringify(header), data: JSON.stringify(data)}
      if (data[0].scaReportType === scaReportType.normal) {
        return windowOpen('/flow.html#/flow/scaReportCreateProcess', planData)
      }
      if (data[0].scaReportType === scaReportType.smallShop) {
        return windowOpen('/flow.html#/flow/storeScaReportCreateProcess', planData)
      }
      if (data[0].scaReportType === scaReportType.newShop) {
        return windowOpen('/flow.html#/flow/newStoreScaReportCreateProcess', planData)
      }
    },
    // 修改计划
    modify (header, data) {
      // todo:这里需要确定小店所属组织类型代码
      let planData = {header: JSON.stringify(header), data: JSON.stringify(data), modify: true}
      if (data[0].orgType === '8') {
        return windowOpen('/flow.html#/flow/smallShopModify', planData)
      }
      return windowOpen('/flow.html#/flow/normalModify', planData)
    },
    // 查看计划
    check (header, data) {
      if (data[0].scaReportType === scaReportType.normal) {
        return this.$refs.normal.openDialog(header, data)
      }
      if (data[0].scaReportType === scaReportType.smallShop) {
        return this.$refs.smallShop.openDialog(header, data)
      }
    },
    // 检查权限
    checkJurisdiction () {
      // todo:这里需要使用权限验证
      this.editable = this.$route.query.editable && this.$route.query.editable !== 'false'
    }
  },

  created () {
    if (this.$route.query.scaPlan) {
      let scaPlan = JSON.parse(this.$route.query.scaPlan)
      this.scaPlanId = scaPlan.scaPlanId
      this.orgs = scaPlan.orgs
      this.$d('DIMENSION', scaPlan.dimensionCode).then(data => {
        this.dimensionName = data
      })
      this.scaPlanName = scaPlan.scaPlanName
      this.year = scaPlan.year
      // 因为后端get方法不能接受数组，只能传逗号连接的字符串
      this.orgUnitIds = []
      this.orgs && this.orgs.map(ele => {
        this.orgUnitIds.push(ele.orgUnitId)
      })
      this.orgUnitIds = this.orgUnitIds.join(',')
    }
    this.checkJurisdiction()
  }
}
</script>

<style lang="scss" scoped>
.header{
  width: 100%;
  text-align: center;
}
.title{
  width:32%;
  display: inline-block;
  font-size:14px;
  text-align: center;
}
.title:first-of-type{
  text-align: left;
}
.title:last-of-type{
  text-align: right;
}
</style>
