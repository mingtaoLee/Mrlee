<template>
  <div class="editor">
    <el-form :model="newTemplateParams" v-if="fill" :rules="rules" label-width="115px" ref="ruleForm">
      <el-form-item  label="模板名称" prop="templateName" required>
        <el-input v-model="newTemplateParams.templateName" :placeholder="defaultMsg.templateName" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item v-if="fill" label="模板类型" prop="templateType" required>
        <!-- <i-select parameter="CONTRACT_TYPE" v-model="newTemplateParams.templateType" ></i-select> -->
        <el-select v-model="newTemplateParams.templateType" clearable>
             <el-option :label="item.label" :value="item.value" v-for="(item,idx) in templateList" :key="idx"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item v-if="fill" label="适用用工类型">
        <i-select parameter="EMPLOYEE_TYPE" v-model="newTemplateParams.employeeType" ></i-select>
      </el-form-item> -->
    </el-form>

     <el-button
       class="btn"
       plain type="primary"
       v-for="(btn, idx) in buttonGroup"
       :key="idx"
       @click="appendTo(btn.content)"
       size="small"
       v-if="fill"
       >
       {{ btn.label }}
     </el-button>

    <script :id="editorId" type="text/plain" style="margin-bottom: 20px;"></script>
  
    <div class="footer" v-if="btn">
      <el-button type="default" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
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
    name: 'TemplateMaintain',
    components: {
      ISelect
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
    data () {
      return {
        input: '',
        msg: '测试',
        editor: null,
        content: '',
        edit: '',
        newTemplateParams: {
          templateName: '',
          // employeeType: '',
          templateContent: '',
          templateType: ''
        },
        rules: {
          templateName: [{required: true, message: '请输入模板名称(限30字以内)', trigger: 'blur'}],
          templateType: [{required: true, message: '请选择模板类型', trigger: 'change'}]
        },
        // 模板类型的数据字典
        templateList: [
          {
            label: '在职证明模板',
            value: '2'
          },
          {
            label: '薪资证明模板',
            value: '3'
          },
          {
            label: '工牌打印模板',
            value: '4'
          },
          {
            label: '离职证明模板',
            value: '5'
          }
        ],
        buttonGroup: [
          {label: '头像', content: 'headImage'},
          {label: '插入姓名', content: 'fullName'},
          {label: '插入证件号', content: 'idNum'},
          {label: '插入入职日期', content: 'hireDate'},
          {label: '插入离职日期', content: 'dimissionDate'},
          {label: '插入工号', content: 'employeeCode'},
          {label: '插入部门', content: 'orgUnitName'},
          {label: '插入职位', content: 'postionName'},
          {label: '插入职务', content: 'postionTitle'},
          {label: '插入薪资(数字)', content: 'salary'},
          {label: '插入薪资(大写)', content: 'capital'},
          {label: '插入申请时间', content: 'creatDate'}
        ]
      }
    },
    computed: {
      contractContent () {
        if (this.preview) {
          return this.preview.contractContent
        }
      },
      templateContent () {
        if (this.defaultMsg.templateContent) {
          return this.defaultMsg.templateContent
        }
      }
    },
    mounted () {
      const _this = this
      this.editor = window.UE.getEditor(_this.editorId, this.config)
      if (_this.defaultMsg) {
        Object.keys(this.newTemplateParams).map(item => {
          (item !== 'templateContent') && (this.newTemplateParams[item] = _this.defaultMsg[item])
        })
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
    watch: {
      defaultMsg (newVal, oldVal) {
        if (newVal !== oldVal) {
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
    },
    methods: {
      // init () {
      //   console.log(this.editorId)
      // },
      // 追加
      appendTo (item) {
        // this.editor.hasContents() ?
        let text = `<span style="text-decoration: underline;">{${item}}</span>`
        this.editor.execCommand('inserthtml', text)
        // this.editor.setContent('  <span style="text-decoration: underline;">  {' + item + '}  </span>  ', true)
      },
      // 获取模板内容
      getUEContent () {
         // 获取内容方法
        return this.editor.getContentTxt()
      },
      // 这只默认值
      setDefault (content) {
        this.editor.reset()
        this.editor.setContent(content)
      },
      // 重置
      reset () {
        this.editor.reset()
      },
      // 提交数据
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
      // 取消
      cancel () {
        this.$emit('cancel')
      }
    }
  
  }
</script>
<style lang="scss" scoped>
  .editor{
    .btn {
      margin:10px 5px;
    }
    .footer {
      text-align: right;
      margin:19px 0;
    }
  }
</style>