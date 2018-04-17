<template>
  <div class="download">
    <!-- <div> -->
    <img src="./pdf.png" alt="附件">
    <main id="main" >
      <p>附件：{{title}}.pdf</p>
      <el-button-group>
        <el-button type="text" @click="preview">预览</el-button>
        <el-button type="text" @click="download">下载</el-button>
      </el-button-group>
    </main>
  </div>
</template>
<script>
  import { windowOpen } from 'utils/index'
  import { createTokenInput, getToken } from 'utils/auth'
  import { AUTHORIZATION_KEY } from 'config/api'
  export default {
    props: {
      title: {
        type: String,
        default: '联保书'
      },
      url: {
        type: String,
        default: 'guarantor'
      }
    },
    data () {
      return {
        pre: '',
        dow: ''
      }
    },
    mounted () {
      this.getUrl(this.url)
    },
    methods: {
      getUrl (url) {
        switch (url) {
          case 'guarantor':
            this.pre = `${this.$$.BASE_URL}/employee/suretys/preview`
            this.dow = `${this.$$.BASE_URL}/employee/suretys/file`
            break
        }
      },
      preview () {
        windowOpen(this.pre, { [AUTHORIZATION_KEY]: getToken() })
      },
      download () {
        // windowOpen('api/employee/suretys/file')
        const form = document.createElement('form')

        const formConfig = {
          action: this.dow,
          method: 'get',
          type: 'hidden'
        }

        Object.entries(formConfig).map(
          ([key, val]) => form.setAttribute(key, val)
        )

        // 永辉生产环境上可能会过滤cookie, 所以需要用这种方式传递Token
        form.appendChild(createTokenInput())

        document.getElementById('main').appendChild(form)
        form.submit()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .download {
    display: flex;
    align-items: center;
    main {
      margin-left: 10px;
      .el-button {
        color: #2c3e50;
        margin-right: 10px;
        &:hover {
          color: #20a0ff
        }
      }
    }
  }
</style>
