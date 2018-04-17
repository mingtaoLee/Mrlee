<template>
  <div class="added-inquire-dialog">
    <i-dialog
      v-model="showDialog"
      :title="title"
      :toolbar="toolbar"
      size="huge"
      @close="closeDialog"
    >
      <div v-loading="loading">
        <!-- 上部 -->
        <div class="inquire-dialog-wrapper">
          <div v-if="showDialog">
            <i-search-conditions ref="inquireSearch" :queryId="queryId" :disabled="isChecked" @loaded="load"></i-search-conditions>
          </div>
        </div>

        <!-- 下部 -->
        <el-form
          ref="queryForm"
          :model="queryModel"
          :rules="queryRules"
          label-width="100px"
          label-position="right"
        >
          <el-form-item label="是否保存">
            <el-radio-group v-model="queryModel.isKeep" @change="selectKeep" :disabled="isChecked">
              <el-radio :label="'Y'">是</el-radio>
              <el-radio :label="'N'">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="isShow" label="查询名称" prop="queryName">
            <el-input v-model="queryModel.queryName" placeholder="请输入" :disabled="isChecked"></el-input>
          </el-form-item>
          <el-form-item v-show="isShow" label="备注">
            <el-input
              v-model="queryModel.description"
              type="textarea"
              placeholder="请输入"
              maxlength="255"
              :disabled="isChecked"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

    </i-dialog>

    <!--直接查看的模态框-->
    <inquiry-result-dialog ref="inquiryResult"></inquiry-result-dialog>

  </div>
</template>

<script>
  import inquiryResultDialog from 'views/admin/pages/info-center/components/inquiry-result-dialog'
  import reqCu from 'api/info-center/customize-inquiry'

  export default{
    name: 'addedInquireDialog',
    components: {
      inquiryResultDialog
    },
    data () {
      // 校验查询名称
      let checkQueryName = (rule, value, callback) => {
        var params = { queryName: this.queryModel.queryName }
        if (this.queryId && this.handleName === 'modify') {
          params.msgQueryId = this.queryId
        }
        reqCu('validateQueryName', params).then(res => {
          if (!res && value) {
            callback(new Error('该查询名称已存在，请勿重复输入！'))
          } else {
            callback()
          }
        })
      }
      return {
        // 加载的初始值
        loading: true,
        // 需要查看，修改，复制的查询名称的id
        queryId: '',
        // 模态框的初始值
        showDialog: false,
        // 当前模态框所处理的业务的名称（是新增，复制，查看，还是修改）
        handleName: null,
        // 查询名称，备注是否隐藏的初始值
        isShow: false,
        // 是否为查看的初始值
        isChecked: false,
        // 模态框标题的初始值
        title: '',
        // 下半部分的表单数据
        queryModel: {
          isKeep: 'N',
          queryName: '',
          description: ''
        },
        toolbar: [
          {
            text: '直接查询',
            type: 'plain',
            disabled: true,
            func: this.directQuery
          }, {
            text: '取消',
            type: 'plain',
            func: done => {
              done()
            }
          }, {
            text: '确定',
            type: 'primary',
            disabled: true,
            hide: false,
            func: this.submit
          }
        ],
        // 表单验证配置
        queryRules: {
          queryName: [{ required: true, message: '查询名称不能为空', trigger: 'blur' },
                      { validator: checkQueryName, trigger: 'blur' }]
        }
      }
    },
    methods: {
      /**
       *@description 打开弹框并初始化的方法
       *@param {boolean} isOpen 控制弹框是否打开
       *@param {Object} row 行对象，在行内查看或修改操作时需要传入
       *@param {boolean} isCheck 是否为查看，复制或者修改
       */
      openDialog (isOpen, row, isCheck) {
        this.showDialog = isOpen
        this.handleName = isCheck
        this.initDialog()
        if (row) {
          this.queryId = row.msgQueryId
          this.queryModel = {
            isKeep: 'Y',
            queryName: row.queryName,
            description: row.description
          }
          if (isCheck === 'check') {
            this.title = '查看查询'
            this.isShow = true
            this.isChecked = true
            this.toolbar[2].hide = true
          } else {
            this.isShow = true
            if (isCheck === 'clone') {
              this.title = '复制查询'
            } else {
              this.title = '修改查询'
            }
          }
        } else {
          this.title = '新增查询'
        }
      },
      // 关闭模态框的函数
      closeDialog () {
        this.$refs.queryForm.resetFields()
      },
      // 初始化的数据
      initDialog () {
        this.loading = true
        this.queryId = ''
        this.isShow = false
        this.isChecked = false
        this.toolbar[0].disabled = true
        this.toolbar[2].disabled = true
        this.toolbar[2].hide = false
        this.queryModel = {
          isKeep: 'N',
          queryName: '',
          description: ''
        }
      },
      // 页面加载的函数
      load (val) {
        console.log(val)
        if (val) {
          this.loading = false
          this.toolbar[0].disabled = false
          if (this.handleName === 'clone' || this.handleName === 'modify') {
            this.toolbar[2].disabled = false
          }
        }
      },
      // 选择是否保存的按钮
      selectKeep (val) {
        if (val === 'Y') {
          this.isShow = true
          this.toolbar[2].disabled = false
        } else {
          this.isShow = false
          this.toolbar[2].disabled = true
          if (!this.queryModel.queryName) {
            this.$refs.queryForm.resetFields()
          }
        }
      },
      // 直接查询按钮
      directQuery () {
        const queryObj = {
          titleName: this.$refs.inquireSearch.selfColumns,
          bodyName: this.$refs.inquireSearch.getData()
        }
        console.log(this.$refs.inquireSearch)
        if (queryObj.bodyName.infColumnIds.length === 0) {
          this.$message.error('请选择需要查询的字段列表！')
          return false
        }
//        for (let i = 0; i < queryObj.bodyName.groups.length; i++) {
//          for (let j = 0; j < queryObj.bodyName.groups[i].conditions.length; j++) {
//            if (queryObj.bodyName.groups[i].conditions[j].conditionLogic !== null && !queryObj.bodyName.groups[i].conditions[j].infColumnId) {
//              this.$message.error('请选择查询条件中的已选字段！')
//              return false
//            }
//            if (queryObj.bodyName.groups[i].conditions[j].infColumnId && !queryObj.bodyName.groups[i].conditions[j].operator) {
//              this.$message.error('请选择查询条件中的关系符！')
//              return false
//            }
//            if (!queryObj.bodyName.groups[i].conditions[j].infColumnId && queryObj.bodyName.groups[i].conditions[j].operator) {
//              this.$message.error('请选择查询条件中的已选字段！')
//              return false
//            }
//          }
//        }
        this.$refs.inquiryResult.openDialog(true, queryObj, 'direct', this.handleName)
      },
      // 确定按钮
      submit () {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            this.handleSuccess(this.handleName)
          }
        })
      },
      // 确定按钮--新增/复制/修改--所调用的函数
      handleSuccess (val) {
        console.log(val)
        const params = this.$refs.inquireSearch.getData()
        params.queryName = this.queryModel.queryName
        params.description = this.queryModel.description
        if (val === 'clone') {
          delete params.msgQueryId
        }
        if (val === 'clone' || val === undefined) {
          reqCu('addCustomInquiry', params).then(res => {
            if (res) {
              if (val === 'clone') {
                this.$message.success('复制成功!')
              } else {
                this.$message.success('新增成功!')
              }
              this.$emit('submit')
              this.openDialog(false)
            }
          })
        } else {
          reqCu('modifyCustomInquiry', params).then(res => {
            if (res) {
              this.$message.success('修改成功!')
              this.$emit('submit')
              this.openDialog(false)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .inquire-dialog-wrapper {
    height: 240px;
    overflow: scroll;
  }
</style>
