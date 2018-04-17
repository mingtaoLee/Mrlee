<template>
<div class="flow">
  <el-main>
    <main class="content">
      <section class="flow-all section" >
        <flow-all @collection="updateCollection" ref="tree"></flow-all>
      </section>
      <div class="move" @mouseover="move"></div>
      <section class="section right">
        <flow-colect class="template" ref="template" @deleteCollection="updataTree"></flow-colect>
        <flow-recent-use class="recent"></flow-recent-use>
      </section>
    </main>
  </el-main>
  <flow-footer></flow-footer>
</div>
</template>
<script>
  import req from 'api/common/home'
  import FlowAll from './flow-all'
  import FlowColect from './flow-tempcolect'
  import FlowRecentUse from './flow-recentuse'
export default {
    components: {
      FlowAll,
      FlowColect,
      FlowRecentUse
    },
    data () {
      return {
        // 代办消息条数
        waitingForHandleInfoNumber: ''
      }
    },

    // computed: {
    //   flowAllStyle () {
    //     return {
    //       minHeight: window.innerHeight - 90 + 'px'
    //     }
    //   }
    // },

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
