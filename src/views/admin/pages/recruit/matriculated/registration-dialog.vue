<template>
  <i-dialog
    title='登记入职'
    v-model='ShowMeFalg'
    size='standard'
    :toolbar="toolbar"
    :appendToBody="false"
    :destroyedWhenClose="true"
    @close="handleClose">
    <div class="content">
    <el-form
      :model='dialogForm'
      :rules='rules'
      ref='dialogForm'
      :inline='true'
      style='width: 100%'
      label-width="100px">
        <el-row type="flex" justify="space-around">
        <el-col :span="12">
            <el-form-item label="应试人姓名:">
            <span>{{dialogForm.name}}</span>
            </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应试人手机:">
            <span>{{dialogForm.mobile}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-around">
        <el-col :span="12">
            <el-form-item label="应聘部门:">
            <span>{{dialogForm.applyOrgName}}</span>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="应聘职位:">
            {{dialogForm.applyPosition}}
            </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-around">
        <el-col :span="12">
            <el-form-item label="录用通知时间:" prop="hireDate" required>
            <el-date-picker
              v-model="dialogForm.hireDate"
              type="date"
              placeholder=""
              disabled>
            </el-date-picker>
            </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职时间:" prop="entryDate" required>
            <el-date-picker
              type="date"
              v-model="dialogForm.entryDate"
              placeholder=""
              disabled>
              </el-date-picker>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="背调结果:" prop="backgroundStatus">
            <i-select
            v-model="dialogForm.backgroundStatus"
            parameter="BACKGROUND_STATUS"
            placeholder="请选择">
            </i-select>
          </el-form-item>
        </el-col> -->
      <el-form-item label="入职结果:" prop="entryResult">
        <i-select
          v-model="dialogForm.entryResult"
          parameter="HIRE_RESULT"
          placeholder="请选择">
        </i-select>
      </el-form-item>
      </el-row>
    </el-form>
    </div>
  </i-dialog>
</template>
<script>
import req from 'api/recruit/matriclated'
import moment from 'moment'
export default {
  name: 'registration',

  props: {
    ShowMeFalg: {
      type: Boolean,
      default: false,
      required: true
    },
    dialogForm: {
      type: Object,
      default: {}
    }
  },

  data () {
    return {
      toolbar: [{
        text: '取消',
        type: 'default',
        func: (done) => {
          done()
        }
      }, {
        text: '确定',
        loading: false,
        type: 'primary',
        func: (done) => {
          this.$refs.dialogForm.validate(valid => {
            if (valid) {
              this.onConfirmHandler()
            }
          })
        }
      }],
      rules: {
        entryResult: {required: true, message: '请选择入职结果', trigger: 'change'}
      }
    }
  },

  methods: {
    // 确定
    onConfirmHandler () {
      this.toolbar[1].loading = true
      req('entryRegister', {
        interviewId: this.dialogForm.interviewId,
        resumeId: this.dialogForm.resumeId,
        // backgroundStatus: this.dialogForm.backgroundStatus,
        entryResult: this.dialogForm.entryResult
      }).then(rs => {
        this.$emit('getData')
        this.toolbar[1].loading = false
        this.$message.success('登记入职成功')
        this.handleClose()
      }).catch((err) => {
        this.toolbar[1].loading = false
        console.log(err)
      })
    },

    // 过滤时间
    dataFilter (data) {
      if (data) {
        return moment(data).format('YYYY-MM-DD')
      } else {
        return ''
      }
    },

    // 控制弹框标识
    handleClose () {
      this.ShowMeFalg = false
      this.$emit('update:ShowMeFalg', false)
    }
  }
}
</script>

