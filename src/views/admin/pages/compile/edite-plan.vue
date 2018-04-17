<template>
  <div class="wrap p20">
  <i-dialog
    :title="title"
    v-model="dialogVisible"
    :toolbar="toolbar"
    :before-close="handleClose"
    destroyedWhenClose
    size="large">
    <div class="content">
      <el-form :model="model" :rules="rules" ref="form" label-width="140px" label-position="right">
        <el-form-item label="计划名称" prop="scaPlanName">
          <el-col :span="12">
            <el-input v-model.trim="model.scaPlanName" :disabled="ifMotify"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="编制模板" prop="scaModMasterId">
          <el-col :span="12">
            <el-select
              placeholder=""
              :disabled="isOnlyRead"
              v-model="model.scaModMasterId"
              @change="getDimension"
              clearable>
              <el-option
                v-for="item in modNames"
                :key="item.scaModMasterId"
                :label="item.modName"
                :value="item.scaModMasterId"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="适用范围" prop="orgs">
          <el-col :span="12">
            <el-select
              placeholder=""
              :disabled="isOnlyRead"
              v-model="model.orgs"
              :multiple="true"
              clearable>
              <el-option
                v-for="item in model.orgNodes"
                :key="item.orgUnitId"
                :label="item.orgUnitName"
                :value="item.orgUnitId"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item prop="year">
          <span slot="label">年度</span>
          <el-col :span="12">
            <el-date-picker
              :disabled="isOnlyRead"
              v-model="model.year"
              align="right"
              type="year"
              :picker-options="pickerOptions"
              placeholder="">
            </el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </i-dialog>
  </div>
</template>

<script>
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import ISelectTree from 'components/common/i-select-tree/i-select-tree'
import req from 'api/compile/index'
import reqPl from 'api/compile/plan'
import { objReplaceAttr, clone } from 'utils/compile'
import moment from 'moment'
export default {
  name: 'EditePlan',
  components: {
    ISelectTree,
    IDialog
  },
  data () {
    var check = (rule, value, callback) => {
      // 非空, 修改操作下,返回，不进行校验
      value && this.ifMotify && callback()
      // 非空, 新建操作下, 检查名称唯一性
      value && !this.ifMotify && this.checkName()
      .then(res => {
        res ? callback({ successMessage: '该名称可以使用' }) : callback(new Error('该名称不可用'))
      })
      .catch(() => {
        console.log('获取数据失败')
      })
    }
    return {
      title: '新建编制计划',
      // 修改第一次带进数据时的阻塞
      once: false,
      dialogVisible: false,
      // 时间的限定
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now()
        }
      },
      // 绑定数据
      model: {
        scaPlanName: '',
        orgs: [],
        scaModMasterId: '',
        year: '',
        orgNodes: []
      },
      // 组织下拉树的配置
      orgProps: {
        children: 'children',
        label: 'orgUnitName'
      },
      // 保存传进来一行的数据
      row: null,
      // 保存模板下拉列表信息
      modNames: {},
      // 判断为是否只读
      isOnlyRead: false,
      // 判断是否为修改操作
      ifMotify: false,
      // 表单的验证规则
      rules: {
        scaPlanName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { validator: check, trigger: 'blur' }
        ],
        orgs: [
          { required: true, type: 'array', message: '请选择适用范围', trigger: 'change' }
        ],
        scaModMasterId: [
          { required: true, message: '请选择编制模板', trigger: 'change' }
        ],
        year: [
          { required: true, type: 'date', message: '请选择年份', trigger: 'blur' }
        ]
      },
      // 弹框按钮配置
      toolbar: [{
        text: '取消',
        type: 'plain',
        hide: false,
        func: (done) => {
          done()
        }
      }, {
        text: '保存',
        type: 'primary',
        hide: false,
        func: (done) => {
          this.submit(done)
        }
      }]
    }
  },
  methods: {
    // 打开弹框，如果存在id，则根据计划id获取计划明细信息
    openDialog (ifOpen, row, isOnlyRead) {
      // 打开之前先格式化表格
      this.initDialog()
      // 存在id，则为修改
      if (row) {
        this.title = '修改编制计划'
        // 如果时查看，则禁用输入，隐藏按钮
        if (isOnlyRead) {
          this.title = '查看编制计划'
          this.isOnlyRead = isOnlyRead
          this.changeBtnsStatus('保存', true)
          this.changeBtnsStatus('取消', true)
        }
        this.ifMotify = true
        this.row = row
        let params = {
          scaPlanId: row.scaPlanId
        }
        reqPl('getPlanDetail', params)
        .then(res => {
          this.initData(res)
        }).catch(() => {
          console.log('获取数据失败')
        })
      } else {
        this.title = '新建编制计划'
        this.ifMotify = false
        this.row = null
      }
      this.dialogVisible = ifOpen
    },
    // 提交修改
    submit (done) {
      // 修改模式下的提交
      const motifyMode = () => {
        let data = this.formatData(this.model)
        console.log('修改操作下的提交数据:', data)
        reqPl('motifyPlan', data).then(res => {
          this.dialogVisible = false
          this.$parent.$refs.homeTable.showPlanList()
          this.$message.info('提交成功')
          done()
        })
      }
      // 新建模式下的提交
      const newMode = () => {
        let data = this.formatData(this.model)
        console.log('新建操作下提交的数据', data)
        reqPl('newPlan', data).then(res => {
          this.dialogVisible = false
          this.$parent.$refs.homeTable.showPlanList()
          this.$message.info('提交成功')
          done()
        })
      }
      // 是否确认提交， callback是确认执行的操作
      const comfirmSave = (fn) => {
        this.$confirm('是否确认保存', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => fn())
        .catch(() => this.$message.info('取消提交'))
      }
      // 执行流程
      let mode = this.ifMotify ? motifyMode : newMode
      this.$refs.form.validate((valid) => {
        valid ? comfirmSave(mode) : this.$message.warning('校验未通过，请重新填写')
      })
    },
    // 初始化数据
    initData (data) {
      console.log('请求的数据为:', data)
      // 赋值数据
      data.year = new Date(data.year)
      this.model = Object.assign({}, this.model, data)
      this.model.orgNodes = clone(this.model.orgs)
      // 格式化适用范围
      this.model.orgs = this.model.orgs.map(item => item.orgUnitId)
      console.log('处理后的数据为:', this.model)
    },
    // 格式化数据，格式化后的数据用于提交
    formatData (data) {
      var cloneData = objReplaceAttr(data, {
        orgs: 'orgUnitId'
      })
      var params = {
        orgs: cloneData.orgs,
        scaPlanName: cloneData.scaPlanName,
        scaModMasterId: cloneData.scaModMasterId,
        year: moment(new Date(cloneData.year)).format('YYYY-MM-DD')
      }
      if (this.ifMotify) {
        params.scaPlanId = this.row.scaPlanId
      }
      return params
    },
    // 初始化弹框的页面
    initDialog () {
      this.model = {
        scaPlanName: '',
        orgs: [],
        scaModMasterId: '',
        year: '',
        orgNodes: []
      }
      this.once = false
      this.isOnlyRead = false
      this.changeBtnsStatus('保存', false)
      this.changeBtnsStatus('取消', false)
    },
    // 检查模板名称唯一性
    checkName () {
      return reqPl('checkName', {scaPlanName: this.model.scaPlanName})
    },
    // 根据模板获取适用范围
    getDimension (id) {
      if (!id) {
        return
      }
      // 阻塞第一次带进数据
      if (!this.once && this.ifMotify) {
        this.once = true
        return
      } else {
        this.once = true
      }
      // 清空适用范围的绑定
      this.model.orgs = []
      // 获取数据
      let params = {
        scaModMasterId: id
      }
      req('getOrgs', params)
      .then(res => {
        this.model.orgNodes = res
      })
    },
    // 弹框关闭前操作
    handleClose (done) {
      this.initDialog()
      done()
    },
    // 改变按钮的状态
    changeBtnsStatus (name, status) {
      var btns = this.toolbar.filter(btn => btn.text === name)
      btns.forEach(btn => {
        btn.hide = status
      })
    },
    // 获取编制模板信息
    getModsName () {
      req('getAvailableMods', {available: true}).then(res => {
        this.modNames = res
      }).catch(() => {
        console.log('获取数据失败')
      })
    }
  },
  // 获取模板信息
  created () {
    this.getModsName()
  }
}
</script>

<style lang="scss" scoped>

</style>
