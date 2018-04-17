<template>
  <i-dialog
    v-model="isOpen"
    :title="title"
    :toolbar="toolbar"
    destroyedWhenClose
    @close="closeDialog"
    size="standard"
  >
    <el-form
      ref="fieldForm"
      :model="fieldModel"
      :rules="fieldRules"
      label-width="120px"
      label-position="right"
    >
      <el-form-item label="字段名称" prop="columnName">
        <el-input
            v-model="fieldModel.columnName"
            placeholder="请输入"
            :clearable="!isShow"
            :disabled="isShow"
        ></el-input>
      </el-form-item>
      <el-form-item label="数据库列" prop="columnFieldName">
        <el-select
          v-model="fieldModel.columnFieldName"
          filterable
          clearable
          placeholder="请选择"
          :disabled="isShow || fieldModifyID!==''"
        >
          <el-option
            v-for="item in fieldNameList"
            :key="item.columnFieldName"
            :label="item.columnFieldName"
            :value="item.columnFieldName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段类型" prop="columnType">
        <el-input
          v-model="fieldModel.columnType"
          :disabled="true"
          placeholder="请输入"
          maxlength="100"
        ></el-input>
      </el-form-item>
      <el-form-item label="组件类型" prop="componentType">
        <i-select
          v-model="fieldModel.componentType"
          parameter="MSG_COMPONENT_TYPE"
          placeholder="请选择"
          clearable
          :disabled="isShow"
          @change="selectComponentType"
        ></i-select>
      </el-form-item>
      <el-form-item
        v-show="fieldModel.componentType === '03' "
        label="url名称"
        prop="urlId"
        :required="fieldModel.componentType === '03' "
      >
        <el-select
          v-model="fieldModel.urlId"
          filterable
          clearable
          placeholder="请选择"
          :disabled="isShow"
          @change="selectUrl"
        >
          <el-option
            v-for="item in fieldUrlList"
            :key="item.urlId"
            :label="item.urlName"
            :value="item.urlId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="fieldModel.componentType === '02' "
        label="字典名称"
        prop="dictCode"
        :required="fieldModel.componentType === '02' "
      >
        <el-select
          v-model="fieldModel.dictCode"
          filterable
          clearable
          placeholder="请选择"
          :disabled="isShow"
          @change="selectDictCode"
        >
          <el-option
            v-for="item in dictCodeList"
            :key="item.dictName"
            :label="item.dictName"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="引用信息" prop="referenceInfo">
        <el-input
          v-model="fieldModel.referenceInfo"
          placeholder="请输入"
          :disabled="isShow"
          maxlength="100"
        ></el-input>
      </el-form-item>
    </el-form>

  </i-dialog>
</template>

<script>
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import reqFd from 'api/system/info-management/field-management/index'

  export default {
    name: 'fieldAddmodifyDialog',
    components: {
      IDialog
    },
    props: ['fieldID', 'tableName'],
    data () {
      // 校验字段名称
      let checkColumnName = (rule, value, callback) => {
        let params = { columnName: value }
        if (this.fieldID) {
          params.infTableId = this.fieldID
        }
        if (this.fieldModifyID) {
          params.infColumnId = this.fieldModifyID
        }
        reqFd('validateColumnName', params).then(res => {
          if (res) {
            callback()
          } else {
            callback(new Error('该字段名称已存在，请重新输入！'))
          }
        })
      }
      // 校验字段名称长度
      let checkColumnNamelen = (rule, value, callback) => {
        if (value.length > 10) {
          callback(new Error('限制10字符'))
        } else {
          callback()
        }
      }
      // 校验数据库列
      let checkColumnFieldName = (rule, value, callback) => {
        if (value && !this.fieldModifyID) {
          let params = { columnFieldName: value }
          if (this.fieldID) {
            params.infTableId = this.fieldID
          }
          reqFd('validateFieldName', params).then(res => {
            if (res) {
              callback()
            } else {
              callback(new Error('该数据库列已存在，请重新选择！'))
            }
          })
        } else {
          callback()
        }
      }
      return {
        // 点击修改的字段集ID
        fieldModifyID: '',
        // 是否为查看
        isShow: false,
        // 字段名称列表
        fieldNameList: [],
        // url列表
        fieldUrlList: [],
        // 字典编码列表
        dictCodeList: [],
        // i-dialog配置项
        isOpen: false,
        title: '',
        toolbar: [{
          text: '取消',
          type: 'plain',
          func: (done) => {
            done()
          }
        }, {
          text: '确定',
          type: 'primary',
          hide: false,
          func: this.submitField
        }],
        // 表单的数据
        fieldModel: {
          columnName: '',
          columnFieldName: '',
          columnType: '',
          componentType: '',
          urlId: '',
          dictCode: '',
          referenceInfo: ''
        },
        // 表单验证配置
        fieldRules: {
          columnName: [{ required: true, message: '请输入字段名称' },
                            { validator: checkColumnName, trigger: 'blur' },
                            { validator: checkColumnNamelen, trigger: 'blur' }],
          columnFieldName: [{ required: true, message: '请选择数据库列' },
                            { validator: checkColumnFieldName, trigger: 'change' }],
          columnType: [{ required: true, message: '请输入字段类型' }],
          componentType: [{ required: true, message: '请选择组件类型', trigger: 'change' }],
          urlId: [{ required: false, message: '请选择url名称' }],
          dictCode: [{ required: false, message: '请选择字典编码' }],
          referenceInfo: [{required: true, message: '请输入引用信息'}]
        }
      }
    },
    watch: {
      'fieldModel.columnFieldName' (newVal) {
        if (newVal && !this.fieldModifyID && !this.isShow) {
          this.fieldNameList.forEach(item => {
            if (item.columnFieldName === newVal) {
              this.fieldModel.columnType = item.columnType
              this.fieldModel.referenceInfo = item.columnName
            }
          })
        }
      }
    },
    methods: {
      /**
       *@description 打开弹框并初始化的方法
       *@param {boolean} isOpen 控制弹框是否打开
       *@param {Object} row 行对象，在行内查看或修改操作时需要传入
       */
      openDialog (isOpen, row, isShow) {
        this.isOpen = isOpen
        this.initDialog()
        this.getFieldNameList()
        this.getFieldUrlList()
        this.getDictCodeList()
        if (isShow) {
          this.title = '查看字段'
          this.isShow = isShow
          this.toolbar[1].hide = isShow
          this.fieldModel = Object.assign(this.fieldModel, row)
        } else {
          this.toolbar[1].hide = false
          if (row) {
            this.title = '修改字段'
            this.fieldModifyID = row.infColumnId
            this.fieldModel = Object.assign(this.fieldModel, row)
          } else {
            this.title = '新增字段'
          }
        }
      },
      // 获取字段名称列表的函数
      getFieldNameList () {
        reqFd('getFieldNameList', {tableName: this.tableName}).then(res => {
          if (res) {
            this.fieldNameList = res
          }
        })
      },
      // 获取url列表的函数
      getFieldUrlList () {
        reqFd('getFieldUrlList', {}).then(res => {
          if (res) {
            this.fieldUrlList = res
          }
        })
      },
      // 获取字典编码列表的函数
      getDictCodeList () {
        reqFd('getDictCodeList', {}).then(res => {
          if (res) {
            this.dictCodeList = res
          }
        })
      },
      // 初始化表单
      initDialog () {
        this.isShow = false
        this.fieldModifyID = ''
        this.fieldModel = {
          columnName: '',
          columnFieldName: '',
          columnType: '',
          componentType: '',
          urlId: '',
          dictCode: '',
          referenceInfo: ''
        }
      },
      // 选择不同组件类型时，url或字典编码的验证规则
      selectComponentType (val) {
        this.fieldModel.urlId = ''
        this.fieldModel.dictCode = ''
        this.fieldRules.dictCode[0].required = false
        this.fieldRules.urlId[0].required = false
        if (val === '02') {
          this.fieldRules.dictCode[0].required = true
        }
        if (val === '03') {
          this.fieldRules.urlId[0].required = true
        }
      },
      // url选项变化时的函数
      selectUrl () {
        this.fieldRules.urlId[0].required = true
      },
      // 字典编码选项变化时的函数
      selectDictCode () {
        this.fieldRules.dictCode[0].required = true
      },
      // 关闭模态框时候的函数
      closeDialog () {
        this.fieldRules.urlId[0].required = false
        this.fieldRules.dictCode[0].required = false
      },
      // 确认新增/修改按钮
      submitField () {
        this.$refs.fieldForm.validate((valid) => {
          if (valid) {
            if (this.fieldModifyID) {
              this.modifyFieldSuccess()
            } else {
              this.addFieldSuccess()
            }
          }
        })
      },
      // 新增成功的函数
      addFieldSuccess () {
        var params = this.fieldModel
        if (this.fieldID) {
          params.infTableId = this.fieldID
        }
        console.log(params)
        reqFd('addField', params).then(res => {
          if (res) {
            this.noticeFieldSuccess()
          } else {
            this.noticeFieldLose()
          }
        })
      },
      // 修改成功的函数
      modifyFieldSuccess () {
        var params = this.fieldModel
        if (this.fieldID) {
          params.infTableId = this.fieldID
        }
        console.log(params)
        reqFd('modifyField', params).then(res => {
          if (res) {
            this.noticeFieldSuccess()
          } else {
            this.noticeFieldLose()
          }
        })
      },
      // 新增/修改成功的提示函数
      noticeFieldSuccess () {
        this.$message({
          type: 'success',
          message: '提交成功!'
        })
        this.$emit('submit')
        this.openDialog(false)
      },
      // 新增/修改失败的提示函数
      noticeFieldLose () {
        this.$message({
          type: 'success',
          message: '提交失败!'
        })
        this.openDialog(false)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
