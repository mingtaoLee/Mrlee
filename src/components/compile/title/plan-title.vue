<template>
  <div class="title">
    {{ title }}
  </div>
</template>

<script>
  export default{
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title{
    height: 33px;
    line-height: 33px;
    padding: 0 10px;
    font-size: 18px;
    font-family: 'Arial Normal', 'Arial';
    font-weight: 400;
    background-color: rgba(242, 242, 242, 1);
    color: #333;
  }
</style>

