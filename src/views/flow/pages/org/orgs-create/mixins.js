
export default {
  data () {
    return {
      // 需求描述表单
      descModel: {
        effectiveDate: '',
        desc: '',
        reason: '',
        attachmentIds: []
      },
      requestUrls: {
        root: {
          url: 'roots'
        },
        children: {
          url: 'children'
        },
        search: {
          url: 'searchData'
        }
      },
      // 设置组织树显示名称，非叶子结点时不显示
      defaultProps: {
        label: 'orgUnitName',
        children: 'children',
        value: 'orgUnitName',
        isLeaf: (data) => {
          return !data.isParent
        }
      }
    }
  },
  methods: {
    // 禁用下级节点的多选框
    disabledChildrenStatus (node, checked) {
      node.childNodes.forEach(item => {
        this.$set(item.data, 'disabled', checked)
        if (item.childNodes && item.childNodes.length) {
          this.disabledChildrenStatus(item, checked)
        }
      })
    },

    // 隐藏多选框
    hideTreeCheckboxs () {
      let checkBoxs = document.querySelectorAll('.org-tree .el-tree-node .el-tree-node__content .el-checkbox')
      checkBoxs.forEach(item => {
        item.style.display = 'none'
      })
    },

    // 显示多选框
    showTreeCheckboxs () {
      let checkBoxs = document.querySelectorAll('.org-tree .el-tree-node .el-tree-node__content .el-checkbox')
      checkBoxs.forEach(item => {
        item.style.display = 'inline-block'
      })
    },

    setOrgTypeName (value) {
      this.$d('ORG_TYPE', value).then(typeName => {
        this.formData.orgTypeName = typeName
      })
    },

    setBusinessTypeName (value) {
      this.$d('ORG_BUSINESS_TYPE', value).then(typeName => {
        this.formData.businessTypeName = typeName
      })
    },

    setSapOrgTypeName (value) {
      this.$d('SAP_ORG_TYPE', value).then(typeName => {
        this.formData.sapOrgTypeName = typeName
      })
    },

    setSapDeptPropName (value) {
      this.$d('SAP_DEPT_PROP', value).then(typeName => {
        this.formData.sapDeptPropName = typeName
      })
    }
  }
}
