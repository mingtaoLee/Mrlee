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
      <el-form :model="model" :rules="rules" ref="form" label-width="120px" label-position="right">

        <el-row>
          <el-col :span="18">
            <el-form-item label="触发器名称" prop="triggerName">
              <el-input v-model.trim="model.triggerName" :disabled="ifMotify" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="触发器类型" prop="triggerType">
              <el-select v-model="model.triggerType" placeholder="">
                <el-option
                  v-for="item in triggerTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="model.triggerType === 'simple_repeat'">
          <el-col :span="7">
            <el-form-item label-width="160px" label="每隔">
              <el-input v-model.trim="model.triggerInterval"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label-width="10px" label="" prop="intervalType">
              <el-select v-model="model.intervalType" placeholder="">
                <el-option
                  v-for="item in timeTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label-width="10px" label="">
              <span>执行一次</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="model.triggerType === 'cron_expression'">
          <el-col :span="10">
            <el-form-item label="Cron表达式" prop="cronExpression">
              <el-input v-model.trim="model.cronExpression"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button class="check-formula" type="primary" @click="validateExpression">校验表达式</el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="model.startTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="结束时间" prop="isForever">
              <el-col v-if="model.triggerType === 'run_once'" :span="22">任务执行一次后即结束</el-col>              
              <el-select v-if="!(model.triggerType === 'run_once')" v-model="model.isForever" placeholder="">
                <el-option
                  v-for="item in endTimeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="!(model.triggerType ==='run_once')" :span="8">
            <el-form-item label-width="20px" prop="endTime">
                <el-date-picker
                v-model="model.endTime"
                type="datetime"
                :disabled="model.isForever === 'Y'"
                placeholder="选择日期时间"
                :picker-options="pickerOptions1">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item label="描述" prop="description">
              <el-input v-model="model.description" type="textarea" maxlength="255" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
  </i-dialog>
  </div>
</template>

<script>
import req from 'api/system/dispatch-management'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import ISelect from 'components/common/i-select/i-select.vue'
export default {
  name: 'NewTriggerDialog',
  components: {
    IDialog,
    ISelect
  },
  data () {
    return {
      title: '新建触发器',
      dialogVisible: false,
      triggerID: '',
      // 绑定数据
      model: {
        triggerName: '',
        triggerType: '',
        triggerInterval: '',
        intervalType: '',
        cronExpression: '',
        startTime: '',
        endTime: '',
        isForever: '',
        description: ''
      },
      // 保存模板下拉列表信息
      modNames: {},
      // 判断是否为修改操作
      ifMotify: false,
      // 表单的验证规则
      rules: {
        triggerName: [{ required: true, message: '请输入触发器名称', trigger: 'blur' }],
        triggerType: [{ required: true, message: '请选择触发器类型', trigger: 'blur' }],
        startTime: [{ type: 'date', required: true, message: '请选择任务开始时间', trigger: 'change' }],
        description: [{ required: true, message: '请输入触发器描述', triger: 'blur' }]
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
        },
        disabled: null
      }],
      // 结束时间下拉配置
      endTimeOptions: [{
        value: 'N',
        label: '设定结束时间'
      }, {
        value: 'Y',
        label: '无期限'
      }],
      // 触发器类型配置
      triggerTypeOptions: [{
        value: 'run_once',
        label: '单次触发'
      }, {
        value: 'simple_repeat',
        label: '简单重复触发'
      },
      {
        value: 'cron_expression',
        label: 'Cron表达式触发'
      }],
      // 简单重复触发类型的配置
      timeTypeOptions: [{
        value: 'M',
        label: '分钟'
      }, {
        value: 'H',
        label: '小时'
      }, {
        value: 'D',
        label: '天'
      }],
      chooseTimeType: 'minutes',
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() <= this.model.startTime
        }
      }
    }
  },

  watch: {
    'model.startTime': {
      handler (newVal, oldVal) {
        this.pickerOptions1 = {
          disabledDate: (time) => {
            return time.getTime() <= newVal - 3600 * 1000 * 24
          }
        }
      }
    }
  },

  methods: {
    // 打开弹框，如果存在id，则根据计划id获取计划明细信息
    openDialog (ifOpen, row) {
      // 打开之前先格式化表格
      this.initDialog()
      // 存在id，则为修改
      if (row) {
        this.title = '修改触发器'
        this.ifMotify = true
        this.triggerID = row.id
        this.initData()
      } else {
        this.title = '新建触发器'
        this.triggerID = ''
        this.ifMotify = false
      }
      this.dialogVisible = ifOpen
      // console.log(row)
      // console.log(this.model)
    },
    // 校验cron表达式
    checkCron () {
      return req('verifyCronExpression', { cron: this.model.cronExpression }).then(res => {
        if (res) {
          return true
        } else {
          return false
        }
      })
    },
    // 提交修改
    async submit (done) {
      let checkResult = null
      if (this.model.triggerType === 'cron_expression') {
        checkResult = await this.checkCron()
      }
      if (typeof this.model.startTime === 'number') {
        this.model.startTime = new Date(this.model.startTime)
      }
      if (this.model.endTime && this.model.endTime < this.model.startTime) {
        this.$message.error('结束时间不能小于开始时间')
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          let that = this
          // 提交之前校验一下表达式是否合格
          if (that.model.cronExpression || this.model.triggerType !== 'cron_expression') {
            if (checkResult || this.model.triggerType !== 'cron_expression') {
              // 提交之前判断一下时间间隔是否符合格式
              if ((/^\d+$/.test(this.model.triggerInterval) && this.model.triggerInterval - 0 > 0) || this.model.triggerType !== 'simple_repeat') {
                let params = that.formatData()
                // 发送提交请求时禁用提交按钮
                this.toolbar[1].disabled = true
                req('addTrigger', params).then(() => {
                  that.$emit('submit')
                  that.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                  this.toolbar[1].disabled = false
                  that.openDialog(false)
                }).catch(() => {
                  this.toolbar[1].disabled = false
                })
              } else {
                this.$message.error('时间间隔必须为大于0的正整数!')
              }
            } else {
              this.$message.error('表达式验证失败')
            }
          } else {
            this.$message.error('请填写Cron表达式！')
          }
        } else {
          this.$message.error('请先按要求输入')
          return false
        }
      })
    },
    // 初始化数据
    initData (data) {
      let that = this
      req('getTriggerInfo', { id: that.triggerID }).then(data => {
        that.model.triggerName = data.name
        that.model.triggerType = data.type
        that.model.triggerInterval = data.triggerInterval
        that.model.intervalType = data.intervalType
        that.model.cronExpression = data.cronExpression
        that.model.startTime = data.startTime
        that.model.endTime = data.endTime
        that.model.isForever = data.isForever
        that.model.description = data.description
        this.model.startTime = typeof this.model.startTime === 'number' ? new Date(this.model.startTime) : this.model.startTime
        this.model.endTime = typeof this.model.endTime === 'number' ? new Date(this.model.endTime) : this.model.endTime
      })
    },
    // 格式化数据，格式化后的数据用于提交
    formatData () {
      return {
        id: this.triggerID || '',
        name: this.model.triggerName,
        type: this.model.triggerType,
        startTime: this.model.startTime,
        endTime: this.model.endTime || '',
        isForever: this.model.isForever || '',
        cronExpression: this.model.cronExpression || '',
        intervalType: this.model.intervalType || '',
        triggerInterval: this.model.triggerInterval || '',
        description: this.model.description
      }
    },
    // 初始化弹框的页面
    initDialog () {
      this.model = {
        triggerName: '',
        triggerType: 'run_once',
        triggerInterval: '',
        intervalType: '',
        cronExpression: '',
        startTime: '',
        endTime: '',
        isForever: 'N',
        description: ''
      }
    },
    // 弹框关闭前操作
    handleClose (done) {
      this.initDialog()
      done()
    },
    validateExpression () {
      let that = this
      if (that.model.cronExpression) {
        req('verifyCronExpression', { cron: that.model.cronExpression }).then((res) => {
          if (res) {
            that.$message({
              message: '验证成功',
              type: 'success'
            })
            // that.$alert('验证成功！', '提示', { confirmButtonText: '确定' })
          } else {
            that.$message.error('验证失败！')
            // that.$alert('验证失败！', '提示', { confirmButtonText: '确定' })
          }
        })
      } else {
        that.$message.error('请填写Cron表达式！')
        // that.$alert('请填写Cron表达式！', '提示', { confirmButtonText: '确定' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .check-formula{
    margin-left: 10px;
  }
  .text{
    line-height: 36px;
  }
</style>
