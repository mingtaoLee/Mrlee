<template>
  <i-dialog
    title="背景调查"
    v-model='ShowBackgroundFalg'
    size='standard'
    :toolbar="toolbar"
    :appendToBody="false"
    :destroyedWhenClose="true"
    @close="handleClose">
    <div class='content'>
      <el-form
      :model='dialogFormBackground'
      :rules='rules'
      ref='dialogFormBackground'
      :inline='true'
      style='width: 100%'
      label-width="100px">
        <el-row type="flex" justify="space-around">
        <el-col :span="12">
            <el-form-item label="应试人姓名:">
            <span>{{dialogFormBackground.name}}</span>
            </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="应试人手机:">
            <span>{{dialogFormBackground.mobile}}</span>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="应聘部门:">
          <span>{{dialogFormBackground.applyOrgName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-around">
        <el-col :span="12">
            <el-form-item label="应聘职位:">
            {{dialogFormBackground.applyPosition}}
            </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="背调结果:" prop="backgroundStatus">
            <i-select
            v-model="dialogFormBackground.backgroundStatus"
            parameter="BACKGROUND_STATUS"
            placeholder="请选择">
            </i-select>
          </el-form-item>
        </el-col>
       </el-row>
      </el-form>
    </div>
  </i-dialog>
</template>
<script>
import req from 'api/recruit/matriclated'
export default {
  name: 'dialogFormBackground',

  props: {
    dialogFormBackground: {
      type: Object,
      default: {}
    },
    ShowBackgroundFalg: {
      type: Boolean,
      default: false,
      required: true
    }
  },

  data () {
    return {
      dialogFormBackground: {

      },
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
          this.$refs.dialogFormBackground.validate(valid => {
            if (valid) {
              this.onConfirmHandler()
            }
          })
        }
      }],
      rules: {
        backgroundStatus: {required: true, message: '请选择背景调查', trigger: 'change'}
      }
    }
  },
  methods: {
    onConfirmHandler () {
      let params = {
        interviewId: this.dialogFormBackground.interviewId,
        resumeId: this.dialogFormBackground.resumeId,
        backgroundStatus: this.dialogFormBackground.backgroundStatus
      }
      this.toolbar[1].loading = true
      req('backgroundCheck', params).then((res) => {
        this.$emit('getBackgroundData')
        this.toolbar[1].loading = false
        this.$message.success('背景调查提交成功')
        this.handleClose()
      }).catch((err) => {
        this.toolbar[1].loading = false
        console.log(err)
      })
    },
    handleClose () {
      this.ShowBackgroundFalg = false
      this.$emit('update:ShowBackgroundFalg', false)
    }
  }
}
</script>
<style>

</style>


