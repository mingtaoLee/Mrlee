<template>
  <div class="navbar" :style="{'height': height+'px', 'backgroundColor': backgroundColor}">
    <nav class="container">
      <slot></slot>
    </nav>
  </div>
</template>
<script>
export default {
  props: {
    height: {
      type: Number,
      default: 60
    },
    backgroundColor: {
      type: String,
      default: '#28283C'
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar{
  // width:70%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.container{
  /*width: 80%;*/
  display: flex;
  justify-content: flex-start;
  margin-left: 45px;
  height:100%;
  align-items: center;
}
</style>
