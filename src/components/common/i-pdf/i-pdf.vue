<template>
  <div id="pdf"></div>
</template>
<script>
/**
 * 描述：预览pdf格式文件的组件
 * 属性：url：pdf文件的路径
 * 使用：<i-pdf :url=""></i-pdf>
 */
  import PdfObj from 'pdfobject'
  export default {
    data: function () {
      return {
        options: {
          pdfOpenParams: {
            navpanes: 0,
            toolbar: 0,
            statusbar: 0,
            pagemode: 'thumbs',
            view: 'FitV'
          }
        }
      }
    },
    props: {
      url: {
        type: String,
        required: true
      }
    },
    mounted () {
      this.showPdf()
    },
    methods: {
      showPdf () {
        PdfObj.embed(this.url, '#pdf', this.options)
      }
    }
  }

</script>
<style>
  .pdfobject-container {
    width: 100%;
    height: 100%;
    margin: auto;
  }
</style>