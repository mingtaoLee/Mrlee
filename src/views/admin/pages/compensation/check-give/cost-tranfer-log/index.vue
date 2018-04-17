<template>
  <div>
    <div class="content-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="内部订单" name="innerOrder">
          <inner-order ref="order"></inner-order>
        </el-tab-pane>
        <el-tab-pane label="费用划拨" name="cost">
          <cost-transfer v-if="cost" ref="cost"></cost-transfer>
        </el-tab-pane>
        <el-tab-pane label="工时划拨" name="laborhour">
          <laborhour-transfer v-if="laborhour" ref="laborhour"></laborhour-transfer>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import costTransfer from './cost-transfer'
import innerOrder from '../inner-order'
import laborhourTransfer from '../laborhour-tranfer'
// import test from './test'

export default {
  name: 'CostTransfer',
  components: {
    costTransfer,
    innerOrder,
    laborhourTransfer
  },
  data () {
    return {
      activeName: 'innerOrder',
      innerOrder: true,
      cost: false,
      laborhour: false
    }
  },
  methods: {
    handleClick (tab) {
      tab.name === 'cost' && (this.cost = true)
      tab.name === 'laborhour' && (this.laborhour = true)
      this.$nextTick(() => {
        switch (tab.name) {
          // 对切换的每一个tab的i-form初始化
          case 'cost': this.$refs.cost.$refs.search.initLayout(); break
          case 'laborhour': this.$refs.laborhour.$refs.search.initLayout(); break
          default: this.$refs.order.$refs.search.initLayout(); break
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content-card{
  padding: 15px;
}
</style>
