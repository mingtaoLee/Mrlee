<template>
  <div class="compensation-detail-layout">
    <h2 v-if="!!header">{{header}}</h2>
    <footer></footer>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {
      header: String
    },
    data: function () {
      return {}
    },
    created () {
    },
    components: {},
    methods: {}
  }
</script>
<style lang="scss" scoped>
  .compensation-detail-layout {
    padding: 20px;
  }
  h2 {
    font-size: 16px;
    font-weight: bold;
    line-height: 40px;
  }

</style>
