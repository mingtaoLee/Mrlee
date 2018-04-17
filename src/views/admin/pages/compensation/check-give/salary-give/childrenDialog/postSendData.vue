<template>
  <p><i class="el-icon-warning"></i>{{msg}}</p>
</template>
<script>
export default {
  data () {
    return {
      msg: '确定要进行过账及数据推送吗？'
    }
  }
}
</script>
<style lang="scss" scoped>
    p{
        height:100px;
        line-height:100px;
        text-align:center;
        position:relative;
        font-family: '微软雅黑';
        font-weight: 410;
        font-size:14px;
    }
    .el-icon-warning{
        position: absolute;
        top:35px;
        left:85px;
        font-size:30px;
        color:#409EFF;
    }
</style>


