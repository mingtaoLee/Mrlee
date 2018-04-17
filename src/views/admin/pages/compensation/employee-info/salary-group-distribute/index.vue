<template>
  <i-layout class="zzf-group-distribute">
    <template slot="section">
      <el-tabs class="table-tab" v-model="currentTabIndex" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(tab, index) in tabs"
          :key="index"
          :label="tab.name"
          :name="tab.index"
        >
          <component v-if="judgeShowComponent(currentTabIndex, index)" :is="tab.component"></component>
        </el-tab-pane>
      </el-tabs>
    </template>
  </i-layout>
</template>
<script>
  import ILayout from 'components/common/i-layout'
  // 薪资组成员页面
  const GroupEmployee = () => import('./group-employee')
  // 已调出薪资组人员页面
  // const EmployeeCallout = () => import('./employee-callout')
  // 未分配薪资组成员
  const EmployeeUndistributed = () => import('./undistributed-employee')
  // 薪资组分配历史记录
  const DistributeHistory = () => import('./history')
  export default {
    components: {
      ILayout
    },
    data () {
      return {
        // 导航栏
        currentTabIndex: 1,
        // 判断是否显示当前组件
        judgeShowComponent: this.initCacheComponentFn(),
        tabs: [
          {
            name: '薪资组员工',
            index: 1,
            component: GroupEmployee
          },
          // {
          //   name: '已调出人员',
          //   index: 2,
          //   component: EmployeeCallout
          // },
          {
            name: '未分配薪资组人员',
            index: 2,
            component: EmployeeUndistributed
          },
          {
            name: '薪资组分配历史记录',
            index: 3,
            component: DistributeHistory
          }
        ]
      }
    },
    methods: {
      /** 缓存已渲染组件 */
      initCacheComponentFn () {
        let arr = new Set([])

        return function () {
          const curIndex = Array.from(arguments).shift()
          const index = Array.from(arguments).pop()

          if (arr.has(index)) return true

          if (curIndex === (index + 1)) {
            arr.add(index)
            return true
          } else {
            return false
          }
        }
      },
      /** tab点击事件监听 */
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
  .zzf-group-distribute {
    .i-form {
      margin: 4.5px 0
    }
  }
</style>
