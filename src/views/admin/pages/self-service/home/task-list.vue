<template>
  <section class="task-list card list-card">
    <header>
      <h3>任务跟踪</h3>
      <router-link to="/self_service" class="more">
        查看全部
        <i class="iconfont icon-linear-arrow-right"></i>
      </router-link>
    </header>

    <nav class="task-nav" v-if="task">
      <router-link v-for="(item, index) of task" :key="index" :to="item.href">
        <p class="title">{{ (index+1) + '. ' + item.title }}</p>
        <p class="name">{{ item.name }}</p>
        <p class="time">{{ item.time }}</p>
      </router-link>
    </nav>
  </section>
</template>

<script>
export default {
  props: ['task']
}
</script>

<style lang="scss" scoped>

.task-list {
  width: 523px;
}
</style>
