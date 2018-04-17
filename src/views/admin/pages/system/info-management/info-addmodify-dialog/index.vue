<template>
  <i-dialog
    v-model="isOpen"
    :title="title"
    :toolbar="toolbar"
    destroyedWhenClose
    size="standard"
  >
    <el-form
      ref="infoForm"
      :model="infoModel"
      :rules="infoRules"
      label-width="120px"
      label-position="right"
    >
      <el-form-item label="信息集名称" prop="infName">
        <el-input
          v-model="infoModel.infName"
          placeholder="请输入"
          :disabled="isCheck"
          :clearable="!isCheck"
          maxlength="100"
        ></el-input>
      </el-form-item>
      <el-form-item label="数据库表" prop="tableName">
        <el-select
          v-model="infoModel.tableName"
          filterable
          clearable
          placeholder="请选择"
          :disabled="infoID !== ''"
          @change="selectTableName"
        >
          <el-option
            v-for="item in tableNameList"
            :key="item.tableName"
            :label="item.tableName"
            :value="item.tableName"
            :disabled="isCheck"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规则引用" prop="refStatus">
        <i-select
          v-model="infoModel.refStatus"
          parameter="WHETHER_TYPE"
          :disabled="isCheck"
          clearable
          placeholder="请选择"
        ></i-select>
      </el-form-item>
      <el-form-item label="相关类型" prop="classification">
        <i-select
          v-model="infoModel.classification"
          parameter="MSG_INF_TABCODE"
          :disabled="isCheck"
          clearable
          placeholder="请选择"
        ></i-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          type="textarea"
          v-model="infoModel.description"
          :disabled="isCheck"
          placeholder="请输入"
          maxlength="100"
        ></el-input>
      </el-form-item>
    </el-form>

  </i-dialog>
</template>

<script>
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import reqIn from 'api/system/info-management/index'
  export default {
    name: 'infoAddmodifyDialog',
    components: {
      IDialog
    },
    data () {
      // 校验信息集表名的唯一性
      let checkTableName = (rule, value, callback) => {
        var params = { tableName: value }
        reqIn('validateTableName', params).then(res => {
          if (!res && !this.infoID) {
            callback(new Error('该数据库表名已存在，请重新选择！'))
          } else {
            callback()
          }
        })
      }
      // 校验信息集名称长度（10字符）
      let checkInfoNameLength = (rule, value, callback) => {
        if (value.length > 10) {
          callback(new Error('限制10字符'))
        } else {
          callback()
        }
      }
      // 校验信息集名称的唯一性
      let checkInfoName = (rule, value, callback) => {
        var params = { infName: this.infoModel.infName }
        if (this.infoID) {
          params.infTableId = this.infoID
        }
        reqIn('validateInfoName', params).then(res => {
          if (!res && value) {
            callback(new Error('该信息集名称已存在，请重新输入！'))
          } else {
            callback()
          }
        })
      }
      return {
        // 当前信息集ID
        infoID: '',
        // 当前信息集是否为查看状态
        isCheck: false,
        // 下拉的表面列表
        tableNameList: [],
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
          func: this.submit
        }],
        // 表单的数据
        infoModel: {
          infName: '',
          tableName: '',
          classification: '',
          refStatus: '',
          description: ''
        },
        // 表单验证配置
        infoRules: {
          tableName: [{ required: true, message: '请选择数据库表名' },
                      { validator: checkTableName, trigger: 'change' }],
          infName: [{ required: true, message: '请输入信息集名称' },
                      { validator: checkInfoName, trigger: 'blur' },
                      { validator: checkInfoNameLength, trigger: 'blur' }],
          refStatus: [{ required: true, message: '请选择规则配置是否引用', trigger: 'change' }],
          classification: [{ required: true, message: '请选择类型', trigger: 'change' }]
        }
      }
    },
    methods: {
      /**
       *@description 打开弹框并初始化的方法
       *@param {boolean} isOpen 控制弹框是否打开
       *@param {Object} row 行对象，在行内查看或修改操作时需要传入
       */
      openDialog (isOpen, row, isCheck) {
        this.isOpen = isOpen
        this.initDialog()
        this.getTableNameList()
        if (row) {
          this.infoID = row.infTableId
          this.infoModel = Object.assign(this.infoModel, row)
          if (isCheck === 'check') {
            this.title = '查看信息集详情'
            this.isCheck = true
            this.toolbar[1].hide = true
          } else {
            this.title = '修改信息集'
            this.toolbar[1].hide = false
          }
        } else {
          this.title = '新增信息集'
          this.toolbar[1].hide = false
        }
      },
      // 获取表名列表的函数
      getTableNameList () {
        reqIn('getTableNameList', {}).then(res => {
          if (res) {
            this.tableNameList = res
          }
        })
      },
      // 初始化表格
      initDialog () {
        this.infoID = ''
        this.isCheck = false
        this.infoModel = {
          infName: '',
          tableName: '',
          classification: '',
          refStatus: '',
          description: ''
        }
      },
      // 选择数据库表项带出描述的函数
      selectTableName (val) {
        this.tableNameList.forEach(item => {
          if (val === item.tableName) {
            this.infoModel.description = item.infName
          }
        })
      },
      // 确认新增/修改按钮
      submit () {
        this.$refs.infoForm.validate((valid) => {
          if (valid) {
            if (this.infoID) {
              this.modifySuccess()
            } else {
              this.addSuccess()
            }
          }
        })
      },
      // 添加成功的函数
      addSuccess () {
        var params = this.infoModel
        console.log(params)
        reqIn('addInfo', params).then(res => {
          if (res) {
            this.noticeSuccess()
          } else {
            this.noticeLose()
          }
        })
      },
      // 修改成功的函数
      modifySuccess () {
        var params = this.infoModel
        console.log(params)
        reqIn('modifyInfo', params).then(res => {
          console.log(res)
          if (res) {
            this.noticeSuccess()
          } else {
            this.noticeLose()
          }
        })
      },
      // 新增/修改成功的提示函数
      noticeSuccess () {
        this.$message({
          type: 'success',
          message: '提交成功!'
        })
        this.$emit('submit')
        this.openDialog(false)
      },
      // 新增/修改失败的提示函数
      noticeLose () {
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

