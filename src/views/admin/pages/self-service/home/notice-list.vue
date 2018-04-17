<template>
  <section class="card notice-list list-card">
    <header>
      <h3>招聘公告</h3>
      <router-link to="/self_service" class="more">
        查看全部
        <i class="iconfont icon-linear-arrow-right"></i>
      </router-link>
    </header>

    <nav class="notice-nav" v-if="notice">
      <router-link v-for="(item, index) of notice" :key="index" :to="item.href">
        <p class="title single-text-overflow">{{ (index+1) + '. ' + item.title }}</p>
        <p class="time single-text-overflow">{{ item.time }}</p>
      </router-link>
    </nav>
  </section>
</template>

<script>
export default {
  props: ['notice']
}
</script>

<style lang="scss" scoped>

</style>
