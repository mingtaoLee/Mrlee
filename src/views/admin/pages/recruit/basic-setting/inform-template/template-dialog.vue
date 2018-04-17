<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="form" :label-width="'100px'">
      <el-form-item label="模板名称" prop="name" :rules="name" required>
        <el-input v-model.trim="formData.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="适用范围" prop="orgId" required>
        <i-select-tree
          dataKey="org"
          v-model="formData.orgId"
          nodeKey="orgUnitId"
          @node-click="orgNodeClick"
          clearable>
        </i-select-tree>
      </el-form-item>
      <el-form-item label="模板类型" prop="informType" required>
        <i-select v-model="formData.informType"
                  parameter="INFORM_TYPE"
                  placeholder="请选择">
        </i-select>
      </el-form-item>
      <el-form-item
          label="通知方式"
          prop="way"
          required>
          <el-checkbox
            v-model="msgChecked"
            @change="msgCheckedChange">
            短信
          </el-checkbox>
          <el-checkbox
            v-model="mailChecked"
            @change="mailCheckedChange" >
            邮件
          </el-checkbox>
        </el-form-item>
      <el-form-item
          v-show="msgChecked"
          prop="noteContent"
          label="短信内容"
          :rules="msgChecked === false ? {} : msgEditorRules">
          <!-- <notification-editor
            editorId="msgEditor"
            @ready="msgEditorReadyHandler"
            ref="msgEditor">
          </notification-editor> -->
          <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8}"
          placeholder="请输入短信内容"
          v-model="formData.noteContent"
          ref="noteContent">
        </el-input>
        </el-form-item>
        <el-form-item
          v-show="mailChecked"
          prop="mailContent"
          label="邮件内容"
          :rules="mailChecked === false ? {} : mailEditorRules">
          <!-- <notification-editor
            editorId="mailEditor"
            @ready="mailEditorReadyHandler"
            ref="mailEditor">
          </notification-editor> -->
          <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8}"
          placeholder="请输入邮件内容"
          v-model="formData.mailContent"
          ref="mailContent">
        </el-input>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import req from 'api/recruit/inform-template'
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
  import ISelect from 'components/common/i-select/i-select.vue'
  // import NotificationEditor from '../../components/notification-dialog/editor'
  export default {
    name: 'template-dialog',
    props: ['form', 'value', 'type', 'templateId'],
    components: {
      ISelectTree,
      ISelect
      // NotificationEditor
    },
    data () {
      // 校验模板名称
      const nameValidator = (rule, val, cb) => {
        // console.log(val.length)
        if (!val) {
          cb(new Error('请输入模板名称'))
        } else if (val.length > 128) {
          cb(new Error('长度最大为128个字符'))
        } else {
          cb()
        }
      }

      // 通知方式校验
      const wayValidator = (rule, val, cb) => {
        if (!this.msgChecked && !this.mailChecked) {
          cb(new Error('请至少选择一种通知方式'))
        } else {
          cb()
        }
      }
      const noteContentvalidator = (rule, val, cb) => {
        if (!val) {
          cb(new Error('请输入短信内容'))
        } else if (val.length > 200) {
          cb(new Error('字符最大长度为200'))
        } else {
          cb()
        }
      }
      const mailcontentValidator = (rule, val, cb) => {
        if (!val) {
          cb(new Error('请输入邮件内容'))
        } else {
          cb()
        }
      }
      // // 短信内容的校验
      // const msgEditorValidator = (rule, val, cb) => {
      //   if (!this.$refs.msgEditor.getUEContent()) {
      //     cb(new Error('请输入短信内容'))
      //   } else if ((this.$refs.msgEditor.getUEContent().length > 200)) {
      //     cb(new Error('字符最大长度为200'))
      //   } else {
      //     cb()
      //   }
      // }
      // const mailEditorDataValidator = (rule, val, cb) => {
      //   if (!this.$refs.mailEditor.getUEContent()) {
      //     cb(new Error('请输入邮件内容'))
      //   } else {
      //     cb()
      //   }
      // }

      return {
        msgEditor: null, // 短信
        noteEditorId: 'new', // 短信Id
        noteEditorIsReady: false, // 默认短信未ready
        mailEditorIsReady: false, // 默认邮件未ready
        noteEditorData: '', // 存储短信内容
        mailEditorData: '', // 存储邮件内容
        mailEditor: null, // 邮件
        mailEditorId: 'new1', // 邮件Id
        msgChecked: false, // 短信默认不选中
        mailChecked: false, // 默认邮件不选中
        node: '', // 组织结构
        formData: {}, // 表单存储容器
        rules: {
          way: [{validator: wayValidator, trigger: 'change'}], // 通知方式校验
          name: [{validator: nameValidator, trigger: 'blur'}], // 模板名称校验
          orgId: [{required: true, message: '请选择适用范围', trigger: 'change'}], // 适用范围校验
          informType: [{required: true, message: '请选择模板类型', trigger: 'change'}], // 模板类型校验
          noteContent: [{validator: noteContentvalidator, trigger: 'change'}],
          mailContent: [{validator: mailcontentValidator, trigger: 'changer'}]
        }
        // msgEditorRules: [{validator: msgEditorValidator, trigger: 'change'}], // 短信内容校验
        // mailEditorRules: [{validator: mailEditorDataValidator, trigger: 'change'}] // 邮件内容校验

        // 富文本配置
        // config: {
        //   initialFrameWidth: null,
        //   initialFrameHeight: 500
        //   // toolbars: [['print']]
        // }
      }
    },
//    created () {
//
//    },
    mounted () {
      this.initData()
    },
    methods: {
      //  // 获取短信内容
      // getMsgContent () {
      //   return this.$refs.msgEditor.getUEContent()
      // },

      // // 获取邮件内容
      // getMailContent () {
      //   return this.$refs.mailEditor.getUEContent()
      // },

      // 处理短信通知方式勾选事件
      msgCheckedChange (val) {
        this.$refs.form.validateField('way')
        this.formData.isNote = val
      },

     // 处理邮件通知方式勾选事件
      mailCheckedChange (val) {
        this.$refs.form.validateField('way')
        this.formData.isMail = val
      },
      initData () {
        if (this.templateId) {
          req('oneTemplateDetail', {templateId: this.templateId}).then((data) => {
            // console.log(data)
            let {name, orgId, orgName, informType, isNote, isMail, noteContent, mailContent} = data
            this.formData = {
              name: name,
              orgId: orgId,
              orgName: orgName,
              informType: informType,
              isNote: this.msgChecked ? 'Y' : 'N',
              isMail: this.mailChecked ? 'Y' : 'N',
              noteContent: noteContent,
              mailContent: mailContent
            }
            this.orgHandler()
            this.msgChecked = isNote === 'Y'
            this.mailChecked = isMail === 'Y'
            this.type = 1
            // this.noteEditorData = this.formData.noteContent
            // this.setMsgEditorData()
            // this.mailEditorData = this.formData.mailContent
            // this.setMailEditorData()
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.formData = {
            name: '',
            orgId: '',
            orgName: '',
            informType: '',
            isNote: 'N',
            isMail: 'N',
            noteContent: null,
            mailContent: null,
            status: ''
          }
          this.type = 0
        }
      },
      /* 数据校验 */
      validate () {
        // this.$refs.form.validateField('informMode')
        // this.formData.noteContent = this.$refs.msgEditor.getUEContent()
        // this.formData.mailContent = this.$refs.mailEditor.getUEContent()
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.formData)
            } else {
              resolve(false)
            }
          })
        })
      },
      // 保存
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            let templateData = {
              name: res.name,
              orgId: res.orgId,
              orgName: res.orgName,
              isNote: this.msgChecked ? 'Y' : 'N',
              isMail: this.mailChecked ? 'Y' : 'N',
              // noteContent: this.getMsgContent(),
              // mailContent: this.getMailContent(),
              noteContent: res.noteContent,
              mailContent: res.mailContent,
              informType: res.informType
            }
            if (this.type) {
              req('modifiedTemplate', {templateId: this.templateId, ...templateData}).then((data) => {
                this.$message({
                  message: '恭喜你修改成功',
                  type: 'success'
                })
                resolve(templateData)
              })
            } else {
              req('addOneTemplate', templateData).then((data) => {
                this.$message({
                  message: '恭喜你，添加成功',
                  type: 'success'
                })
                resolve(templateData)
              })
            }
          })
        })
      },

      // 获取组织结构
      orgHandler () {
        req('getOrgUnitName', {orgUnitIds: this.formData.orgId})
          .then(res => {
            this.node = res[0]
          })
      },

      // // 判断短信ready
      // msgEditorReadyHandler () {
      //   this.noteEditorIsReady = true
      //   this.setMsgEditorData()
      // },

      // // 获取短信内容
      // setMsgEditorData () {
      //   if (this.noteEditorIsReady) {
      //     this.$refs.msgEditor.setUEContent(this.noteEditorData)
      //   }
      // },

      // // 判断邮件ready
      // mailEditorReadyHandler () {
      //   this.mailEditorIsReady = true
      //   this.setMailEditorData()
      // },

      // // 获取邮件内容
      // setMailEditorData () {
      //   if (this.mailEditorIsReady) {
      //     this.$refs.mailEditor.setUEContent(this.mailEditorData)
      //   }
      // },
      // 选择使用范围
      orgNodeClick (selected) {
        this.formData.orgId = selected.orgUnitId
        this.formData.orgName = selected.orgUnitName
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
