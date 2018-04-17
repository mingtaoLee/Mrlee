<template>
<div class="flow">
  <el-container>
    <el-header height="60px">
      <flow-header :waiting-for-handle-info-number="waitingForHandleInfoNumber">
        <a href="/flow.html" class="flow-link" slot="link">流程中心</a>
      </flow-header>
    </el-header>

    <flow-home></flow-home>
  </el-container>
  <flow-footer></flow-footer>
</div>
</template>
<script>
  import req from 'api/common/home'
  import FlowHome from 'components/flow/home'
  import FlowHeader from 'components/common/i-header/i-header'
  import FlowFooter from 'components/common/i-footer/i-footer'
export default {
    components: {
      FlowHome,
      FlowHeader,
      FlowFooter
    },
    data () {
      return {
        // 代办消息条数
        waitingForHandleInfoNumber: ''
      }
    },

    methods: {
      updateCollection () {
        this.$refs.template.getCollection()
      },
      updataTree (deleteArr) {
        this.$refs.tree.updateCollection(deleteArr)
      },
      move ($event) {
        // console.log(arguments)
      },
      // 获取代办消息条数
      getCountUserTodo () {
        req('getCountUserTodo')
        .then(res => {
          this.waitingForHandleInfoNumber = res
        })
      }
    },

    created () {
      this.getCountUserTodo()
    }
  }
</script>

<style lang="scss" scoped>
.flow {
  .all {
    position: relative;
  }
  .content {
    display: flex;
    height: calc(100vh - 100px);
  }
  .flow-all {
    width: auto;
    margin-right: 15px;
    flex-basis: calc(100% - 400px);
  }
  .right {
    display: flex;
    flex-direction: column;
    flex-basis: 400px;
    justify-content: space-between;
    .template {
      height: calc(100% - 240px)
    }
    .recent {
      height: 220px;
    }
  }
}
</style>
<style lang="scss">
.flow{
  .el-main{
    flex: auto;
    -ms-flex: auto;
  }
}
</style>
