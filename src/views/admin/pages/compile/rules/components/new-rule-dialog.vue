<template>
  <i-dialog
    v-model="isOpen"
    :title="title"
    :toolbar="toolbar"
    :before-close="handleClose"
    destroyedWhenClose
    size="standard"
  >
      <el-form
        ref="form"
        :model="model"
        :rules="rules"
        label-width="140px"
        label-position="right"
      >
        <el-form-item label="规则名称" prop="ruleName">
          <el-col :span="12">
            <el-input v-model="model.ruleName" :disabled="isView"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="所属集群" prop="clusterCode">
          <el-col :span="12">
            <i-select
              v-model="model.clusterCode"
              placeholder="请选择"
              :disabled="isView || isModify"
              parameter="CLUSTER_CODE"
            ></i-select>
          </el-col>
        </el-form-item>
        <el-form-item label="标准小店" prop="orgStandardId">
          <el-col :span="12">
            <i-select
              v-model="model.orgStandardId"
              placeholder="请选择"
              :disabled="isModify || isView"
              :options="shopOptions"
              :async="false"
              :props="{ value: 'orgStandardId', label: 'orgStandardName' }"
            ></i-select>
          </el-col>
        </el-form-item>
        <el-form-item v-if="isPosition" label="职     务" prop="posTitleId">
          <el-col :span="12">
            <i-select
              v-model="model.posTitleId"
              placeholder="请选择"
              :disabled="isView || isModify"
              :options="positionOptions"
              :async="false"
              :props="{value: 'posTitleId', label: 'name'}"
            ></i-select>
          </el-col>
        </el-form-item>
        <el-form-item label="日均销售额下限（万）" prop="saleLowerLimit">
          <el-col :span="12">
            <el-input v-model="model.saleLowerLimit" placeholder="0" :disabled="isView"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="日均销售额上限（万）" prop="saleUpperLimit">
          <el-col :span="12">
            <el-input v-model="model.saleUpperLimit" placeholder="9999" :disabled="isView"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="编制下限" prop="scaLowerLimit">
          <el-col :span="12">
            <el-input v-model="model.scaLowerLimit" placeholder="请输入" :disabled="isView"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="编制上限" prop="scaUpperLimit">
          <el-col :span="12">
            <el-input v-model="model.scaUpperLimit" placeholder="请输入" :disabled="isView"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="初 始 化" prop="isInit">
          <el-col :span="18">
            <el-radio-group v-model="model.isInit" :disabled="isView">
              <el-radio :label="'Y'">是</el-radio>
              <el-radio :label="'N'">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="描     述">
          <el-col :span="18">
            <el-input
              v-model="model.description"
              type="textarea"
              placeholder="请输入"
              maxlength="255"
              :disabled="isView"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </i-dialog>
</template>

<script>
import reqP from 'api/compile'
import req from 'api/compile/rules'

export default {
  name: 'NewRuleDialog',
  components: {

  },
  // 可用小店下拉选项，可用职务下拉选项
  props: ['shopOptions', 'positionOptions'],
  data () {
    // 规则名称校验
    let checkRuleName = (rule, value, callback) => {
      if (!value || this.isView) return callback()
      let params = {
        ruleName: value
      }
      this.ruleID && (params.scaRuleId = this.ruleID)
      let name = this.isPosition ? 'checkPositionRuleName' : 'checkShopRuleName'
      req(name, params).then(available => {
        if (available) { callback({successMessage: '该规则名称可用'}) } else { callback(new Error('该规则名称不可用')) }
      })
    }
    // 销售额下限校验
    let checkSaleLower = (rule, value, callback) => {
      // 限制两位小数
      let afterNumber = value.toString().split('.')
      if (afterNumber[1]) {
        if (afterNumber[1].length > 2) {
          callback(new Error('限制两位小数'))
        }
      }
      if (value !== '' && this.model.saleUpperLimit !== '') {
        this.$refs.form.validateField('saleUpperLimit')
        callback()
      } else {
        callback()
      }
    }
    // 销售额上限校验
    let checkSaleUpper = (rule, value, callback) => {
      // 限制两位小数
      let afterNumber = value.toString().split('.')
      if (afterNumber[1]) {
        if (afterNumber[1].length > 2) {
          callback(new Error('限制两位小数'))
        }
      }
      if (value !== '' && this.model.saleLowerLimit !== '') {
        this.model.saleLowerLimit >= value
         ? callback(new Error('销售额上限必须大于下限'))
         : callback()
      } else {
        callback()
      }
    }
    // 编制下限校验
    let checkScaLower = (rule, value, callback) => {
      if (value !== '' && this.model.scaUpperLimit !== '') {
        this.$refs.form.validateField('scaUpperLimit')
        callback()
      }
    }
    // 编制上限校验
    let checkScaUpper = (rule, value, callback) => {
      if (value !== '' && this.model.scaLowerLimit !== '') {
        if (this.model.scaLowerLimit > value) {
          callback(new Error('销售额上限必须大于下限'))
        } else {
          callback()
        }
      }
    }
    // 销售额最大值检验
    let checkMax = (rule, value, callback) => {
      // console.log(rule)
      if (rule.fullField === 'saleLowerLimit') {
        if (value >= 9999) {
          callback(new Error('销售额下限应小于9999万'))
        } else {
          callback()
        }
      } else if (rule.fullField === 'saleUpperLimit') {
        if (value > 9999) {
          callback(new Error('销售额上限不应大于9999万'))
        } else {
          callback()
        }
      }
    }
    // 负数校验
    let checkNegative = (rule, value, callback) => {
      if (value !== '') {
        value < 0
      ? callback(new Error('不能输入负数'))
      : callback()
      } else {
        callback()
      }
    }
    // 整数校验
    let checkInteger = (rule, value, callback) => {
      value = Number(value);
      (typeof value === 'number') && (value % 1 === 0)
      ? callback()
      : callback(new Error('只能输入整数'))
    }
    // 是否是数字校验
    let checkNumber = (rule, value, callback) => {
      if (value !== '') {
        if (isNaN(value)) {
          callback(new Error('请输入数字'))
        } else {
          this.model[rule.field] = Number(this.model[rule.field])
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      // 当前规则ID
      ruleID: '',
      // 是否为修改操作
      isModify: false,
      // 是否是职务界面
      isPosition: true,
      // 是否是查看
      isView: false,
      // i-dialog配置项
      title: '',
      isOpen: false,
      toolbar: [
        {
          text: '取消',
          type: 'plain',
          hide: false,
          func: done => {
            done()
          }
        }, {
          text: '确定',
          type: 'primary',
          hide: false,
          func: this.submit
        }
      ],
      // 表单绑定数据
      model: {
        clusterCode: '',
        orgStandardId: '',
        posTitleId: '',
        saleUpperLimit: '',
        saleLowerLimit: '',
        scaUpperLimit: '',
        scaLowerLimit: '',
        isInit: '',
        description: ''
      },
      // 表单项验证配置
      rules: {
        ruleName: [
          { required: true, message: '请填写规则名称', trigger: 'change' },
          { validator: checkRuleName, trigger: 'blur' }
        ],
        clusterCode: [{ required: true, message: '请选择所属集群', trigger: 'change' }],
        orgStandardId: [{ required: true, message: '请选择标准小店', trigger: 'change' }],
        posTitleId: [{ required: true, message: '请选择职务', trigger: 'change' }],
        saleLowerLimit: [{ validator: checkNumber, trigger: 'blur' },
                               { validator: checkNegative, trigger: 'blur' },
                               { validator: checkMax, trigger: 'blur' },
                               { validator: checkSaleLower, trigger: 'blur, change' }],
        saleUpperLimit: [{ validator: checkNumber, trigger: 'blur' },
                               { validator: checkNegative, trigger: 'blur' },
                               { validator: checkMax, trigger: 'blur' },
                               { validator: checkSaleUpper, trigger: 'change, blur' }],
        scaLowerLimit: [{ required: true, message: '编制下限不能为空', pattern: /.+/, trigger: 'blur' },
                              { validator: checkNumber, trigger: 'blur' },
                              { validator: checkNegative, trigger: 'blur' },
                              { validator: checkInteger, trigger: 'blur' },
                              { validator: checkScaLower, trigger: 'blur' }],
        scaUpperLimit: [{ required: true, message: '编制上限不能为空', pattern: /.+/, trigger: 'blur' },
                              { validator: checkNumber, trigger: 'blur' },
                              { validator: checkNegative, trigger: 'blur' },
                              { validator: checkInteger, trigger: 'blur' },
                              { validator: checkScaUpper, trigger: 'change, blur' }],
        isInit: [{ required: true, message: '请选择是否初始化', trigger: 'change' }]
      }
    }
  },
  created () {

  },
  methods: {
    /**
        *@description 打开弹框并初始化的方法
        *@param {boolean} isOpen 控制弹框是否打开
        *@param {string} type 弹框所属模块，{'positon'|'shop'}
        *@param {Object} row 行对象，在行内查看或修改操作时需要传入
        *@param {boolean} isView 是否是查看操作
        */
    openDialog (isOpen, type, row, isView) {
      // 打开前初始化表格
      this.initDialog()
      this.isPosition = type === 'positon'
      // 是否仅为查看
      if (isView) {
        this.title = '查看规则信息'
        this.isView = isView
        this.ruleID = row.scaRuleId
        this.toolbar[1].hide = isView
        this.getRuleData()
      } else {
        this.toolbar[1].hide = false
        // 拿到行对象则为修改操作
        if (row) {
          this.title = (type === 'positon') ? '修改职务规则' : '修改规则'
          this.ruleID = row.scaRuleId
          this.isModify = true
          this.getRuleData()
        } else {
          this.title = (type === 'positon') ? '新增职务规则' : '新增规则'
          this.ruleID = ''
          this.isModify = false
        }
      }
      this.isOpen = isOpen
    },
    // 初始化表格
    initDialog () {
      this.model = {
        clusterCode: '',
        orgStandardId: '',
        posTitleId: '',
        saleUpperLimit: '',
        saleLowerLimit: '',
        scaUpperLimit: '',
        scaLowerLimit: '',
        isInit: '',
        description: ''
      }
      this.ruleID = ''
      this.isModify = false
      this.isPosition = true
      this.isView = false
    },
    // 关闭前操作
    handleClose (done) {
      this.initDialog()
      done()
    },
    // 修改或查看操作时获取规则数据
    getRuleData () {
      let params = {scaRuleId: this.ruleID}
      // 职务还是小店规则
      if (this.isPosition) {
        req('getPosRuleDetail', params).then(res => {
          Object.assign(this.model, res)
        })
      } else {
        req('getShopRuleDetail', params).then(res => {
          Object.assign(this.model, res)
        })
      }
    },
    // 确认新增/保存
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 是否修改操作
          if (this.isModify) {
            // 是否是职务界面
            if (this.isPosition) {
              this.modifyPosRule()
            } else {
              this.modifyShopRule()
            }
          } else {
            if (this.isPosition) {
              this.addPosRule()
            } else {
              this.addShopRule()
            }
          }
        } else {
          this.$message({type: 'error', message: '请按照提示正确填写表单！'})
          return false
        }
      })
    },
    // 获取可用小店列表
    getShop () {
      reqP('getShopList').then(res => {
        this.shopOptions = res
      })
    },
    // 获取可用职务
    getPositon () {
      reqP('getTitleList').then(res => {
        this.positionOptions = res
      })
    },
    // 新增职务规则
    addPosRule () {
      let params = this.formmatData()
      req('addPosRule', params).then((res) => {
        if (res) {
          this.submitSuccess()
        }
      })
    },
    // 修改职务规则
    modifyPosRule () {
      let params = this.formmatData()
      req('modifyPosRule', params).then((res) => {
        if (res) {
          this.submitSuccess()
        }
      })
    },
    // 新增小店规则
    addShopRule () {
      let params = this.formmatData()
      req('addShopRule', params).then((res) => {
        this.submitSuccess()
      })
    },
    // 修改小店规则
    modifyShopRule () {
      let params = this.formmatData()
      req('modifyShopRule', params).then((res) => {
        this.submitSuccess()
      })
    },
    // 提交成功的操作
    submitSuccess () {
      // 通知父组件提交成功
      this.$emit('submit')
      this.$message({type: 'success', message: '提交成功！'})
      this.openDialog(false)
    },
    formmatData () {
      this.model.saleLowerLimit = this.model.saleLowerLimit || 0
      this.model.saleUpperLimit = this.model.saleUpperLimit || 9999
      return Object.assign({}, this.model)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 5px;
}

.el-form-item /deep/ .el-form-item__error,.el-form-item /deep/ .el-form-item__success {
  top: 25%;
  left: 55%;
}

.el-form-item:nth-last-of-type(2) /deep/ .el-form-item__error, .el-form-item:nth-last-of-type(2) /deep/ .el-form-item__success {
  left: 30%;
}
</style>
