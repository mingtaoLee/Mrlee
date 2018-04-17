<template>
  <section class="icon-list card">
    <nav>
      <router-link v-for="(item, index) of list" :key="index" :to="item.url">
        <div class="wrap">
          <i :class="['iconfont', item.icon]"></i>
        </div>
        <p>{{ item.title }}</p>
      </router-link>
    </nav>
  </section>
</template>

<script>
export default {
  data () {
    return {
      list: [{
        title: '我的工资',
        url: '/self_service',
        icon: 'icon-wage'
      }, {
        title: '我的绩效',
        url: '/self_performance',
        icon: 'icon-performance'
      }, {
        title: '我的团队',
        url: '/self_service',
        icon: 'icon-team'
      }, {
        title: '培训业务',
        url: '/self_service',
        icon: 'icon-train'
      }, {
        title: '劳动合同',
        url: '/self_service',
        icon: 'icon-contract'
      }, {
        title: '政策制度',
        url: '/self_service',
        icon: 'icon-policy'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
$wrap-size: 96px;
$icon-size: 56px;

.icon-list {
  width: 100%;
  height: 199px;

  nav {
    display: flex;
    justify-content: space-between;
    width: calc(100% - 84px * 2);
    margin: 30px auto 39px;
    text-align: center;
  }

  a {
    &:nth-child(1) { .wrap { background: #FDA045; } }
    &:nth-child(2) { .wrap { background: #5990EC; } }
    &:nth-child(3) { .wrap { background: #2DC9AA; } }
    &:nth-child(4) { .wrap { background: #6C75E4; } }
    &:nth-child(5) { .wrap { background: #CA6CE4; } }
    &:nth-child(6) { .wrap { background: #DE617E; } }

    &:hover {
      .wrap {
        transform: translateY(-10px);
      }
    }
    outline: unset;
  }

  .wrap {
    width: $wrap-size;
    height: $wrap-size;
    border-radius: 50%;
    overflow: hidden;
    transition: all .6s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;

    & + p {
      margin-top: 12px;
      color: #434343;
      letter-spacing: 0;
      font: {
        family: 'PingFangSC Medium';
        size: 16px;
      }
    }

    .iconfont {
      color: #fff;
      font-size: 52px;
    }
  }
}
</style>
