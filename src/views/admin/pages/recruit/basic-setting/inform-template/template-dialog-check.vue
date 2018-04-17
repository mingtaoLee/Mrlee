<template>
  <div>
    <el-form :model="formData"  ref="form" :label-width="'100px'">
      <el-form-item label="模板名称" prop="name">
        <el-input v-model.trim="formData.name" disabled auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="适用范围" prop="orgName" >
        <i-select-tree
          dataKey="org"
          v-model="formData.orgId"
          nodeKey="orgUnitId"
          :selectedNode.sync="node"
          clearable
          disabled>
        </i-select-tree>
      </el-form-item>
      <el-form-item label="模板类型" prop="informType">
        <i-select v-model="formData.informType"
                  parameter="INFORM_TYPE"
                  placeholder="请选择"
                  disabled>
        </i-select>
      </el-form-item>
      <el-form-item label="通知方式"  prop="informMode">
        <el-checkbox v-model="formData.isNote" disabled  @change="noteChange">短信</el-checkbox>
        <el-checkbox v-model="formData.isMail" disabled @change="mailChange">邮件</el-checkbox>
      </el-form-item>
      <el-form-item
        v-show="isNote"
        label="编辑短信"
        :label-width="'100px'"
        prop="noteContent"
        disabled>
        <!-- <script
          :id="noteEditorId"
          type="text/plain"
          style="margin-bottom: 20px;">
        </script> -->
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8}"
          placeholder=""
          v-model="formData.noteContent"
          disabled>
        </el-input>
        </el-form-item>
        <el-form-item
         v-show="isMail"
         label="编辑邮件"
         :label-width="'100px'"
         prop="mailContent"
         disabled>
          <!-- <script
         :id="mailEditorId"
         type="text/plain"
         style="margin-bottom: 20px;">
        </script> -->
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8}"
          placeholder=""
          v-model="formData.mailContent"
          disabled>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import req from 'api/recruit/inform-template'
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
  import ISelect from 'components/common/i-select/i-select.vue'
  // import 'static/ueditor/ueditor.config.js'
  // import 'static/ueditor/ueditor.all.js'
  // import 'static/ueditor/lang/zh-cn/zh-cn.js'
  // import 'static/ueditor/ueditor.parse.js'
  //  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  export default {
    name: 'template-dialog',
    props: ['form', 'value', 'type', 'templateId'],
    components: {
      ISelectTree,
      ISelect
    },
    data () {
      return {
        noteEditor: null, // 短信
        noteEditorId: 'new', // 短信id
        mailEditor: null, // 邮件
        mailEditorId: 'new1', // 邮件id
        isNote: false, // 短信不选中
        isMail: false, // 邮件不选中
        // isShow: false,
        formData: {}, // 表单容器
        node: '' // 组织结构

        // config: {
        //   initialFrameWidth: null,
        //   initialFrameHeight: 500,
        //   readonly: true // 默认只读
        //   // toolbars: [['print']]
        // }
      }
    },
//    created () {
//
//    },
    mounted () {
      // this.noteEditor = window.UE.getEditor(this.noteEditorId, this.config)
      // this.mailEditor = window.UE.getEditor(this.mailEditorId, this.config)
      this.initData()
    },
    methods: {
      // 通知方式的短信判断
      noteChange (val) {
//        console.log(val)
        if (val === true) {
          this.isNote = true
        } else {
          this.isNote = false
        }
      },
      // 通知方式的邮件判断
      mailChange (val) {
//        console.log(val)
        if (val === true) {
          this.isMail = true
        } else {
          this.isMail = false
        }
      },
      init () {
        // console.log(this.editorId)
      },
      appendTo (item) {
        // this.editor.hasContents() ?
        // let text = `  <span style="text-decoration: underline;">  #·{${item}}#·  </span>  `
        // this.editor.execCommand('inserthtml', text)
        // this.editor.setContent('  <span style="text-decoration: underline;">  {' + item + '}  </span>  ', true)
      },

      // // 获取内容方法
      // getUEContent () {
      //   return this.editor.getContentTxt()
      // },

      // setDefault (content) {
      //   this.editor.reset()
      //   this.editor.setContent(content)
      // },

      // // 富文本重置
      // reset () {
      //   Object.keys(this.newTemplateParams).map(key => {
      //     this.newTemplateParams[key] = ''
      //   })
      //   this.editor.reset()
      // },

      // confirm () {
      //   this.content = window.UE.getEditor(this.editorId).getContentTxt()
      //   this.newTemplateParams.templateContent = this.content
      //   this.$emit('templateContent', this.defaultMsg ? this.newTemplateParams : this.content)
      // },
      cancel () {
        // this.$emit('cancel')
      },

      // 查看数据显示
      initData () {
        if (this.templateId) {
          req('oneTemplateDetail', {templateId: this.templateId}).then((data) => {
            let {name, orgId, orgName, informType, isNote, isMail, noteContent, mailContent, status} = data
            this.formData = {
              name: name,
              orgId: orgId,
              orgName: orgName,
              informType: informType,
              isNote: isNote === 'Y',
              isMail: isMail === 'Y',
              noteContent: noteContent,
              mailContent: mailContent,
              status: status
            }
            this.orgHandler()
            this.isNote = isNote === 'Y'
            this.isMail = isMail === 'Y'
            this.type = 1
            // this.$nextTick(() => {
            //   if (this.formData.noteContent) {
            //     this.noteEditor.ready(() => {
            //       this.noteEditor.setContent(this.formData.noteContent)
            //       this.noteEditor.setDisabled()
            //     })
            //   }
            //   if (this.formData.mailContent) {
            //     this.mailEditor.ready(() => {
            //       this.mailEditor.setContent(`<p>${this.formData.mailContent}</p>`)
            //       this.mailEditor.setDisabled()
            //     })
            //   }
            // })
          }).catch((err) => {
            console.log(err)
          })
        }
      },

      // 获取组织结构
      orgHandler () {
        req('getOrgUnitName', {orgUnitIds: this.formData.orgId})
        .then(res => {
          this.node = res[0]
        })
      }
    }

    // // 富文本销毁
    // destroyed () {
    //   this.noteEditor.destroy()
    //   this.mailEditor.destroy()
    // }
  }
</script>
<style scoped lang="scss">

</style>
