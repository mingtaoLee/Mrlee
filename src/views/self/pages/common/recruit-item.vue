<template>
  <div class="recuit-item">
    <h3>【{{data.applyOrgName }}】 <i>|</i>{{data.applyPositionName}}</h3>
    <p>{{data.positionStatement}}</p>
    <div class="message">
      <address>{{data.workAddress}}</address>
      <time>{{data.todoDate}}</time>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'recruitItem',
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {}
    }
  }
</script>

<style lang="scss" scoped>
  .recuit-item {
    padding: 0 14px;
    border-bottom: 1px solid #E8E8E8;
    h3 {
      font-size: 12px;
      color: #000000;
      line-height: 36px;
      i {
        display:inline-block;
        padding: 0 13px;
        font-style: normal;
      }
    }
    p {
      font-size: 12px;
      color: #333333;
      line-height: 25px;
    }
    .message {
      font-size: 12px;
      color: #333333;
      line-height: 36px;
      zoom: 1;
      &:after{
        content:"";
        height:0;
        display:block;
        visibility:hidden;
        clear:both;
      }
      address {
        font-style: normal;
        float: left;
      }
      time {
        float: left;
        padding-left: 20px;
      }
    }
  }
</style>
