<template>
  <section>
      <i-layout>
          <div slot="section" v-loading="loading">
            <h2 class="contract-template-title"><i class="el-icon-back goBackIcon" @click="goBack"></i><span>{{title}}</span></h2>
            <div v-if="isNew && !isPrint && !readOnly">
              <editor
              defaultMsg="请输入合同模板内容"
              :config="config"
              editorId="new"
              @templateContent="postTemplate"
              @cancel="goBack"
              ref="newTemplate"></editor>
            </div>

            <div v-if="isPrint">
              <editor
                :defaultMsg="defaultMsg"
                :fill="false"
                :config="print"
                editorId="print"
                @cancel="goBack"
                :btn="false"></editor>
                <div class="text-align-center"><el-button @click="goBack">返 回</el-button></div>
            </div>

            <div v-if="!isNew && !isPrint && !readOnly">
              <editor
              :defaultMsg="defaultMsg"
              :config="config"
              editorId="editorId"
              @templateContent="putTemplate"
              @cancel="goBack"></editor>
            </div>

            <div v-if="readOnly">
                  <h2 class="contract-title">合同模板名称: <span class="contract-title-content" v-text="showContent.templateName"/></h2>
                  <h2 class="contract-title">合同模板内容: </h2>
                  <p v-html="showContent.templateContent" />
                  <!-- <editor :defaultMsg="showContent" :fill="false" :config="print" editorId="look" @templateContent="visible.showTemplate=false" @cancel="visible.showTemplate=false"></editor>               -->
              <div class="text-align-center"><el-button @click="goBack">返 回</el-button></div>
            </div>
          </div>
      </i-layout>
  </section>
</template>
<script>
  import req from 'api/employee/contract'
  import Editor from 'components/employee/editor'
  import access from 'mixins/access'
  export default {
    components: {
      Editor
    },
    mixins: [access],
    data () {
      return {
        // 新建模板的参数
        isNew: true,
        isPrint: false,
        loading: false,
        readOnly: false,
        title: '新建合同模板',
        templateId: '',
        newTemplateParams: null,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500
        },
        print: {
          initialFrameWidth: null,
          initialFrameHeight: 500,
          toolbars: [['print']]
        },
        showContent: {
          templateName: '',
          templateContent: ''
        },
        defaultMsg: '',
        editorId: ''
      }
    },

    computed: {
      employmentType () {
        return this.newTemplateParams.employmentType
      }
    },

    created () {
      const _this = this
      if (_this.$route.query.id !== 'new' && _this.$route.query.print !== 'true' && _this.$route.query.read !== 'true') {
        _this.isNew = false
        _this.title = '修改合同模板'
        _this.showTemplate(_this.$route.query.id)
      } else if (_this.$route.query.print === 'true') {
        _this.isNew = false
        _this.title = '打印合同模板'
        _this.isPrint = true
        _this.printTemplate(_this.$route.query.id)
      } else if (_this.$route.query.read === 'true') {
        _this.isNew = false
        _this.readOnly = true
        _this.title = '查看合同模板'
        _this.look(_this.$route.query.id)
      } else {
      }
    },
    methods: {
      // 新建合同模板
      postTemplate (data) {
        const _this = this
        _this.newTemplateParams = data
        _this.loading = true
        req('postContractTemplate', this.newTemplateParams)
        .then(data => {
          _this.loading = false
          _this.$message('新建模板成功')
          _this.$refs.newTemplate.reset()
          setTimeout(() => {
            _this.goBack()
          }, 1000)
        })
        .catch(err => {
          console.log(err)
          _this.loading = false
        })
      },

      // 查看合同模板内容
      showTemplate (templateId) {
        const _this = this
        _this.loading = true
        _this.editorId = templateId
        req('showTemplate', {templateId})
        .then(data => {
          data.templateContent = data.templateContent.replace(/_ueditor_page_break_tag_/g, '<p style="page-break-after: always;"><i style="display:none">1111</i></p>')
          _this.defaultMsg = data
          _this.loading = false
        })
        .catch(err => {
          console.log(err)
          _this.loading = false
        })
      },

      // 修改合同模板
      putTemplate (data) {
        const _this = this
        _this.loading = true
        data.empTemplateId = _this.editorId
        req('putTemplate', data)
        .then(data => {
          _this.loading = false
          _this.$message('修改成功')
          setTimeout(() => {
            _this.goBack()
          }, 1000)
        })
        .catch(err => {
          _this.loading = false
          _this.$message(err + '修改不成功')
        })
      },

      // 打印合同模板
      printTemplate (templateId) {
        this.editorId = templateId
        req('showTemplate', {templateId})
        .then(data => {
          data.templateContent = data.templateContent.replace(/#·{.+?}#·/g, '               ')
          data.templateContent = data.templateContent.replace(/_ueditor_page_break_tag_/g, '<p style="page-break-after: always;"><i style="display:none">1111</i></p>')
          this.defaultMsg = data
        })
      },

      // 查看合同模板
      look (templateId) {
        req('showTemplate', {templateId})
        .then(data => {
          data.templateContent = data.templateContent.replace(/_ueditor_page_break_tag_/g, '<div style="page-break-after: always;"></div>')
          this.showContent = data
        })
        .catch(err => console.log(err))
      },

      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .text-align-center {
    margin-top: 20px;
    text-align: center;
  }
  .contract-template-title{
    font-size: 16px;
    margin-bottom: 30px;
    i {
      display: inline-block;
      padding: 0 20px;
      cursor: pointer;
    }
    i:hover{
      color: #409EFF;
    }
    span {
      display: inline-block;
      border-left: 1px solid #ccc;
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
    }
  }
    .contract-title {
      font-size: 20px;
      margin:  20px 5px;;
      span {
        padding-left: 20px;
      }
    }
    .checkTemplate{
      padding:20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      min-width: 600px;
      min-height: 500px;
    }
</style>