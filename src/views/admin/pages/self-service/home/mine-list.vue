<template>
  <section class="mine-list card" v-if="mine">
    <ul>
      <mine-card v-for="(item, index) of mine" :key="index" :card="item" />
    </ul>
  </section>
</template>

<script>
import MineCard from './mine-card'

export default {
  data () {
    return {
      mine: [{
        title: '我的社保',
        icon: `icon-wage`,
        list: [
          { subTitle: '社保查询', href: '/self_service' },
          { subTitle: '社保预缴/补缴申请', href: '/self_service' },
          { subTitle: '社保缴纳申请', href: '/self_service' },
          { subTitle: '社保申报', href: '/self_service' },
          { subTitle: '社保转移申请', href: '/self_service' },
          { subTitle: '社保基数变更申请', href: '/self_service' }
        ]
      }, {
        title: '我的公积金',
        icon: `icon-accumulation-fund`,
        list: [
          { subTitle: '公积金查询', href: '/self_service' },
          { subTitle: '公积金补缴/预缴申请', href: '/self_service' },
          { subTitle: '公积金缴纳申请', href: '/self_service' },
          { subTitle: '公积金基数变更', href: '/self_service' },
          { subTitle: '公积金专业', href: '/self_service' },
          { subTitle: '公积金支取申请', href: '/self_service' }
        ]
      }, {
        title: '我的福利',
        icon: `icon-welfare`,
        list: [
          { subTitle: '生日/结婚/生育礼', href: '/self_service' },
          { subTitle: '餐费补贴', href: '/self_service' },
          { subTitle: '高温补贴', href: '/self_service' },
          { subTitle: '退休感谢', href: '/self_service' },
          { subTitle: '夜班补贴', href: '/self_service' }
        ]
      }, {
        title: '异动',
        icon: `icon-redeploy`,
        list: [
          { subTitle: '如何转正', href: '/self_service' },
          { subTitle: '薪酬变更申请', href: '/self_service' },
          { subTitle: '提前转正', href: '/self_service' },
          { subTitle: '调动', href: '/self_service' }
        ]
      }, {
        title: '证明开具',
        icon: `icon-certificate`,
        list: [
          { subTitle: '在职证明', href: '/self_service' },
          { subTitle: '收入证明', href: '/self_service' },
          { subTitle: '参保证明', href: '/self_service' }
        ]
      }, {
        title: '发展通道',
        icon: `icon-development`,
        list: [
          { subTitle: '我的发展计划', href: '/self_service' },
          { subTitle: '带训(我是贴身教练)', href: '/self_service' },
          { subTitle: '我的评定结果', href: '/self_service' }
        ]
      }]
    }
  },
  components: {
    MineCard
  }
}
</script>

<style lang="scss" scoped>
.mine-list {
  width: 100%;
  height: 365px;

  ul {
    display: flex;
  }

  .mine-card {
    flex: 1;
    align-items: center;
    & + .mine-card {
      border-left: 1px solid #D8D8D8;
    }
  }
}
</style>
