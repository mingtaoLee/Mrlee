<template>
  <div class="wrap" v-loading="loading" :element-loading-text="$loadingText">
    <iframe 
    class="form-iframe"
    :src="iframeSrc"
    width="100%"
    height="100%"
    ></iframe>
  </div>
</template>

<script>
  import req from 'api/form-center'
  export default {
    name: 'FormReport',
    data () {
      return {
        iframeSrc: '',
        loading: true
      }
    },
    computed: {
      reportPath () {
        let path = this.$route.path
        return path.substr(path.lastIndexOf('/') + 1)
      }
    },
    methods: {
      getIframeSrc () {
        req('getReportsUrl', {
          reportPath: this.reportPath
        })
        .then(data => {
          if (data.url) {
            this.iframeSrc = data.url
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      }
    },
    // beforeMount () {
    //   this.getIframeSrc()
    // },
    watch: {
      $route: {
        handler (val) {
          this.getIframeSrc()
        },
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>
.wrap{
  height: calc(100vh - 115px)
}
.form-iframe {
  border-width: 0;
}
</style>