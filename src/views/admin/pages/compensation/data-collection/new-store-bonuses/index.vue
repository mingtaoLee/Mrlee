<template>
  <i-layout class="new-store-bonuses">
    <template slot="section">
      <el-tabs class="table-tab" v-model="currentTabIndex" @tab-click="handleTabClick">
        <el-tab-pane v-for="(tab, index) in tabs" :key="index" :label="tab.name" :name="tab.index">
          <component v-if="judgeShowComponent(currentTabIndex, index)" :is="tab.component"></component>
        </el-tab-pane>
      </el-tabs>
    </template>
  </i-layout>
</template>

<script>
  import TabMixin from '../../mixins/tab-mixin'
  const HalfYear = () => import('./half-year')
  const QuarterYear = () => import('./quarter-year')

  export default {
    mixins: [TabMixin],
    components: {
    },
    data () {
      return {
        // 导航栏
        currentTabIndex: 1,
        tabs: [
          {
            name: '半年度',
            index: 1,
            component: HalfYear
          },
          {
            name: '季度',
            index: 2,
            component: QuarterYear
          }
        ]
      }
    },
    created () {
    },
    methods: {
      handleTabClick ({index}) {
        this.$nextTick(() => {
          this.$eventBus.$emit(`initLayout${index}`)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
<style lang="scss">
  .new-store-bonuses {
    .i-form {
      margin: 4.5px 0
    }
  }
</style>
