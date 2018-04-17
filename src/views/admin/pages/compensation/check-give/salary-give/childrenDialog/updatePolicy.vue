<template>
    <p><i class="el-icon-warning"></i>{{msg}}</p>
</template>
<script>
export default {
  data () {
    return {
      msg: '将会向财务及资金系统发送取消过账及推送操作命令？'
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
        left:20px;
        font-size:30px;
        color:#409EFF;
    }
</style>