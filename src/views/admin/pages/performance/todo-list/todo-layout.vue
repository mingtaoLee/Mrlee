<template>
  <div class="todo-layout">
    <!-- <todo-header></todo-header> -->
    <router-view class="todo-content"></router-view>
    <todo-footer></todo-footer>
  </div>
</template>

<script>
import TodoHeader from 'components/common/i-header/i-header'
import TodoFooter from 'components/common/i-footer/i-footer'

export default {
  name: 'TodoLayout',

  components: {
    TodoHeader,
    TodoFooter
  }

}
</script>

<style lang="scss" scoped>
  .todo-content {
    box-sizing: border-box;
    position: relative;
    min-height: calc(100vh - 236px);
    padding: 20px;
  }
</style>

