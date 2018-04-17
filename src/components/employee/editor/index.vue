<template>
  <div class="editor">
    <el-form :model="newTemplateParams" v-if="fill" :rules="rules" label-width="115px" ref="ruleForm">
      <el-form-item label="合同模板名称" prop="templateName" required  >
        <el-input v-model="newTemplateParams.templateName" :placeholder="defaultMsg.templateName" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item v-if="fill" label="合同模板类型" prop="contractType" required>
        <i-select parameter="CONTRACT_TYPE" v-model="newTemplateParams.contractType"></i-select>
      </el-form-item>
      <!-- <el-form-item v-if="fill" label="适用用工类型" prop="employeeType" required>
        <i-select parameter="EMPLOYEE_TYPE" v-model="newTemplateParams.employeeType"></i-select>
      </el-form-item> -->
    </el-form>

    <el-button v-if="fill" class="btn" plain type="primary" v-for="(btn, idx) in buttonGroup" :key="idx" @click="appendTo(btn.content)"
      size="small">{{ btn.label }}</el-button>

    <script :id="editorId" type="text/plain" style="margin-bottom: 20px;"></script>
  
    <div class="footer" v-if="btn">
      <el-button type="default" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">保存</el-button>
    </div>
  </div>
</template>
<script>
  import 'static/ueditor/ueditor.config.js'
  import 'static/ueditor/ueditor.all.js'
  import 'static/ueditor/lang/zh-cn/zh-cn.js'
  import 'static/ueditor/ueditor.parse.js'
  import ISelect from 'components/common/i-select/i-select'

  export default {
    name: 'Editor',
    components: {
      ISelect
    },
    data () {
      return {
        rules: {
          templateName: [{required: true, message: '请输入模板名称(30字以内)', trigger: 'blur'}],
          contractType: [{required: true, message: '请选择模板类型', trigger: 'change'}]
          // employeeType: [{required: true, message: '请选择用工类型', trigger: 'change'}]
        },
        input: '',
        msg: '测试',
        editor: null,
        content: '',
        edit: '',
        newTemplateParams: {
          templateName: '',
          // employeeType: '',
          templateContent: '',
          contractType: ''
        },
        buttonGroup: [
          {label: '证件类型', content: 'idType'},
          {label: '证件号码', content: 'idNumber'},
          {label: '性别', content: 'gender'},
          {label: '员工姓名', content: 'employeeName'},
          {label: '联系方式', content: 'mobile'},
          {label: '户口性质', content: 'domicileType'},
          {label: '户籍地', content: 'domicilePlace'},
          {label: '居住地址', content: 'idRegisteredAddress'},
          {label: '现居地址', content: 'homeAddress'},
          {label: '紧急联系人', content: 'emergencyContact'},
          {label: '紧急联系人电话', content: 'emergencyContactPhone'},
          {label: '合同编号', content: 'contractNo'},
          {label: '合同类型', content: 'contractType'},
          {label: '合同期限类型', content: 'contractPeriodType'},
          {label: '合同期限', content: 'contractPeriod'},
          {label: '试用期时长', content: 'probationType'},
          {label: '转正前薪资', content: 'probationSalary'},
          {label: '转正后薪资', content: 'expectedRegularSalary'},
          {label: '合同主体', content: 'companyName'},
          {label: '开始时间', content: 'startDate'},
          {label: '合同结束时间', content: 'endDate'},
          {label: '试用期结束时间', content: 'expectedProbationEndDate'},
          {label: '最低工资', content: 'leastSalary'},
          {label: '上班地点', content: 'workAdress'},
          {label: '签订时间', content: 'signDate'},
          {label: '通讯地址', content: 'contractAddress'}
        ]
      }
    },
    props: {
      editorId: {
        type: String
      },
      defaultMsg: {
        type: Object,
        default: null
      },
      btn: {
        type: Boolean,
        default: true
      },
      preview: {
        type: Object,
        default: null
      },
      config: {
        type: Object
      },
      fill: {
        type: Boolean,
        default: true
      }
    },
    mounted () {
      const _this = this
      this.editor = window.UE.getEditor(_this.editorId, this.config)
      if (_this.defaultMsg) {
        this.loadVmodel()
        this.editor.ready(function () {
          _this.defaultMsg.templateContent && _this.editor.setContent(_this.defaultMsg.templateContent)
          // _this.defaultMsg.contractContent && _this.editor.setContent(_this.defaultMsg.contractContent)
        })
      } else if (_this.preview) {
        this.editor.ready(function () {
          _this.preview.contractContent && _this.editor.setContent(_this.preview.contractContent)
        })
      }
      // console.log(this.defaultMsg)
    },
    methods: {
      init () {
        console.log(this.editorId)
      },
      appendTo (item) {
        // this.editor.hasContents() ?
        let text = `  <span style="text-decoration: underline;">  #·{${item}}#·  </span>  `
        this.editor.execCommand('inserthtml', text)
        // this.editor.setContent('  <span style="text-decoration: underline;">  {' + item + '}  </span>  ', true)
      },
      getUEContent () { // 获取内容方法
        return this.editor.getContentTxt()
      },
      setDefault (content) {
        this.editor.reset()
        this.editor.setContent(content)
      },
      reset () {
        Object.keys(this.newTemplateParams).map(key => {
          this.newTemplateParams[key] = ''
        })
        this.editor.reset()
      },
      confirm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.content = window.UE.getEditor(this.editorId).getContent()
            this.newTemplateParams.templateContent = this.content
            this.$emit('templateContent', this.defaultMsg ? this.newTemplateParams : this.content)
          } else {
            this.$message('请按照要求输入')
            return false
          }
        })
      },
      cancel () {
        this.$emit('cancel')
      },
      loadVmodel () {
        Object.keys(this.newTemplateParams).map(item => {
          (item !== 'templateContent') && (this.newTemplateParams[item] = this.defaultMsg[item])
        })
      }
    },
    computed: {
      contractContent () {
        if (this.preview) {
          return this.preview.contractContent
        }
      },
      templateContent () {
        if (this.defaultMsg && this.defaultMsg.templateContent) {
          return this.defaultMsg.templateContent
        }
      }
    },
    watch: {
      defaultMsg (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.loadVmodel()
          // console.log(oldVal, '这里触发了一次watch', newVal, this.defaultMsg)
          this.setDefault(this.defaultMsg.templateContent)
        }
      },

      templateContent (newVal, oldVal) {
        if (newVal !== oldVal) {
          // console.log(oldVal, '这里触发了一次watch', newVal, this.defaultMsg)
          this.setDefault(this.defaultMsg.templateContent)
        }
      },

      contractContent (newVal, oldVal) {
        // console.log(newVal, oldVal)
        if (newVal !== oldVal) {
          // console.log(oldVal, '这里触发了一次watch', newVal, this.preview)
          this.setDefault(this.preview.contractContent)
        }
      }
    },
    destroyed () {
      this.editor.destroy()
    }
  }
</script>
<style lang="scss" scoped>
  .editor{
    .btn {
      margin:10px 5px;
    }
    .footer {
      text-align: center;
      margin:19px;
    }
  }
</style>