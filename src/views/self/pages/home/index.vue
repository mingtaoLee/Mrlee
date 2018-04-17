<template>
<Index class="self-service"></Index>
</template>

<script>
const data = require('./mock-data')

import Index from './index.js'

export default {
  data () {
    return {
      ...data,
      iamge: 'assets/images/bg-photo.png'
    }
  },
  components: {
    Index
  }
}
</script>

<style scoped>

.self-service {
  background: #FAFAFA;
}
</style>
<style lang="scss">
  .el-main {
    background-color: #F8F8F8 !important;
    min-width: 600px;
    height: 100%
  }
  header {
    padding-top: 20px;
  }
  .CenterPhoto{
  text-align: center;
    p{
      color: #b5b5b5;
      padding: 10px;
    }
}
.is-vertical {
  height: 100%;
  .self-service{
    height: 100%;
    .self-main {
      height: 100%;
      .header-first {
        height: 36%;
      }
      .feature-list {
        height: 28%;
      }
      aside {
        height: 36%;
      }
    }
  }
}
</style>
