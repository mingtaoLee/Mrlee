// import { OrgType } from 'config/dict'
// import moment from 'moment'
const validOrgName = /^[\u4e00-\u9fa5\-#()（）/a-zA-Z0-9]+$/
export default {
  data () {
    return {
      visible: this.value,
      activeIndex: 0,
      validateStandardCheck: true,
      descModel: {
        effectiveDate: '', // 生效日期
        desc: '', // 描述
        reason: ''  // 原因
      },

      createPosition: 0,
      treeHeight: 400
    }
  },
  computed: {
    formRules () {
      return {
        VALIDATE_REQUIRED: ['costCentralId'],
        orgUnitName: [{
          required: true,
          validator: this.validateOrgUnitName
        }],
        orgShortName: [{
          validator: this.validateOrgShortName
        }],
        businessType: [{
          required: true,
          message: '请选择业态'
        }],
        belongArea: [{
          required: true,
          message: '请选择所在地区',
          validator: this.belongArea
        }],
        managedArea: [{
          required: true,
          message: '请选择管理分区'
        }],
        effectiveDate: [{
          required: true,
          // type: 'date',
          validator: this.validateEffectiveDate
        }],
        orgType: [{
          required: true,
          trigger: 'change',
          validator: this.validateOrgType
        }],
        parentId: [{
          required: true,
          message: '请选择上级组织'
        }],
        costCentralId: [{
          required: true,
          message: '请选择成本中心'
        }],
        orgStandardName: this.formData.orgType === '8' && (
          this.formData.businessType === '7' ||
          this.formData.businessType === '8' ||
          this.formData.businessType === '9' ||
          this.formData.businessType === 'a'
        ) ? [{
          required: true,
          message: '请选择标准组织库',
          trigger: 'blur'
        }] : [],
        sapOrgType: [{
          required: true,
          message: '请选择组织类型'
        }],
        sapDeptProp: [{
          required: true,
          message: '请选择部门属性'
        }],
        superReportingDeptId: [{
          required: true,
          message: '请选择上级汇报部门'
        }]
      }
    }
  },
  props: {
    value: Boolean
  },
  mounted () {
    this.calculateTreeHeight()

    if (this.taskKey === 'undefined') {
      let now = new Date()
      if (this.formData) {
        this.formData.effectiveDate = new Date(now.getFullYear(), now.getMonth(), 1)
      }
      if (this.descModel) {
        this.descModel.effectiveDate = new Date(now.getFullYear(), now.getMonth(), 1)
      }
    }
  },
  methods: {
    validateCostCentralId (rule, value, callback) {
      if (!value) {
        callback(new Error('请选择成本中心'))
      } else {
        if (/^[a-zA-Z0-9]+$/.test(value)) {
          callback()
        } else {
          callback(new Error('成本中心只能填写数字和字母代码'))
        }
      }
    },
    validateOrgType (rule, value, callback) {
      if (!value) {
        callback(new Error('请选择组织类别'))
      } else {
        if (value === '8') {
          let parentOrgType = this.formData.parentOrgType
          if (parentOrgType && parentOrgType !== '7' && parentOrgType !== '8' && parentOrgType !== '9') {
            callback(new Error('客户经营单元需放在客户经营单元/客户经营主体/虚拟机构下'))
          } else {
            callback()
          }
        }
        callback()
      }
    },
    clearStandardLib () {
      this.standardOrg = {}
    },
    validateEffectiveDate (rule, value, callback) {
      if (!value) {
        callback(new Error('请选择组织生效日期'))
      }
      if (this.parent && value < this.parent.effectiveDate) {
        callback(new Error('组织生效日期不能早于上级组织生效日期'))
      } else {
        callback()
      }
    },
    validateOrgUnitName (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入组织名称'))
        return
      }
      if (!(validOrgName.test(value))) {
        callback(new Error('组织名含有非法字符'))
        return
      }
      if (this.parentNode && this.selected) {
        let childNodes = this.parentNode.childNodes
        childNodes.forEach((child, index) => {
          if (child.data.orgUnitName === value && this.selected.data.orgUnitName !== value) {
            callback(new Error('组织名重复'))
            return
          }
        })
      }
      callback()
    },
    validateOrgShortName (rule, value, callback) {
      if (value && !(validOrgName.test(value))) {
        callback(new Error('组织名含有非法字符'))
      } else {
        callback()
      }
    },
    handleOrgTypeChange (val) {
      if (val === '7' || val === '8') {
        this.formData.businessType = '1'
      }
      this.validateStandardCheck = true
    },
    confirm () {
    },
    cancel () {
      this.closeDialog()
    },
    closeDialog () {
      this.$emit('input', false)
    },
    resetFormData () {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    setLib () {
      let { orgStandardId, orgStandardName, businessType, orgType, renameable } = this.standardOrg
      Object.assign(this.formData, { orgStandardId, orgStandardName, businessType, orgType, renameable })
      this.formData.orgUnitName = orgStandardName
      this.formData.orgShortName = orgStandardName
      this.libDialogVisible = false
      this.closeSelectLibDialog()
    },
    cancelSetLib () {
      this.closeSelectLibDialog()
    },
    closeSelectLibDialog () {
      if (this.formData.orgStandardName) {
        this.isSelectDisabled = true
      }
      this.libDialogVisible = false
    },
    showSelectLib () {
      this.libDialogVisible = true
      this.vlaueShow = !!this.formData.orgStandardName
    },
    calculateTreeHeight () {
      if (this.$refs.formBox) {
        this.treeHeight = this.$refs.formBox.clientHeight - 60
      }
    }
  },
  watch: {
    value () {
      this.visible = this.value
    },
    // standardOrg (val) {
    //   let { orgStandardId, orgStandardName, businessType, orgType, renameable } = val
    //   Object.assign(this.formData, { orgStandardId, orgStandardName, businessType, orgType, renameable })
    //   this.formData.orgUnitName = orgStandardName
    //   this.formData.orgShortName = orgStandardName
    //   this.formData.renameable = renameable
    // },
    createPosition (val) {
      this.formData.createPosition = Boolean(this.createPosition)
    }
  }
}
