<template>
  <li class="mine-card">
    <h3>
      <i :class="['iconfont', card.icon]"></i>
      {{ card.title }}
    </h3>
    <ul>
      <li v-for="(item, idx) of card.list" :key="idx">
        <router-link :to="item.href">
          {{ item.subTitle }}
          <i class="iconfont icon-solid-arrow-right"></i>
        </router-link>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  props: ['card']
}
</script>

<style lang="scss" scoped>
$icon-size: 20px;

.mine-card {
  margin-top: 43px;
  h3 {
    text-align: center;
    color: #000000;
    letter-spacing: 0;
    font: {
      family: 'PingFangSC Medium';
      size: 20px;
    }
    .iconfont {
      color: #252628;
      font-size: 22px;
    }
  }

  ul {
    margin-top: 24px;
    padding: 0 20px;
    li {
      text-align: left;
      color: #4D4D4D;
      letter-spacing: 0;
      line-height: 40px;
      a {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      font: {
        family: 'PingFangSC Regular';
        size: 14px;
      }
      .iconfont {
        color: #969696;
        font-size: 12px;
      }
    }
  }
}
</style>
