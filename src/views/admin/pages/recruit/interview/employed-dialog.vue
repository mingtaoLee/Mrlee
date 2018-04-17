<template>
  <i-dialog
  title="录用"
  v-model='ShowMeEmployFalg'
  size='standard'
  :toolbar="toolbar"
  :appendToBody="false"
  :destroyedWhenClose="true"
  @close="handleClose">
  <div class='content'>
    <el-form class='dialogFormEmploy'
        :model='dialogFormEmploy'
        :rules='rules'
        ref='dialogFormEmploy'
        :inline='true'
        style='width: 100%'
        label-width="100px">
        <el-row type="flex" justify="space-around">
          <el-col :span="12">
            <el-form-item label='应试人姓名'>
              <span>{{dialogFormEmploy.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label='应试人手机'>
            <span>{{dialogFormEmploy.mobile}}</span>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="12">
            <el-form-item label="应试人邮箱">
              <span>{{dialogFormEmploy.email}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label='应聘部门'>
            <span>{{dialogFormEmploy.applyOrgName}}</span>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="12">
            <el-form-item label="面试安排人">
              <span>{{dialogFormEmploy.arrangerName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否背调" prop="isCheck" required>
              <i-select
                v-model="dialogFormEmploy.isCheck"
                parameter="WHETHER_TYPE"
                placeholder='请选择'>
              </i-select>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
  </div>
  </i-dialog>
</template>
<script>
import req from 'api/recruit/interview'
export default {
  name: 'dialogFormEmploy',
  props: {
    ShowMeEmployFalg: {
      type: Boolean,
      default: false,
      required: true
    },
    dialogFormEmploy: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      dialogFormEmploy: {
        name: '', // 面试人的姓名
        mobile: '', // 面试人的手机号
        email: null, // 邮件
        applyOrgName: '', // 应聘部门
        applyPosition: '', // 申请职位
        isCheck: '', // 是否背调
        interviewId: null
      },

      // i-dialog
      toolbar: [{
        text: '取消',
        type: 'text',
        func: (done) => {
          done()
        }
      }, {
        text: '确定',
        loading: false,
        type: 'primary',
        func: (done) => {
          this.$refs.dialogFormEmploy.validate(valid => {
            if (valid) {
              this.onConfirmHandler()
              // done()
            }
          })
        }
      }],
      rules: {
        isCheck: [{required: true, message: '请选择是否背调', trigger: 'change'}]
      }
    }
  },
  methods: {
    onConfirmHandler () {
      let params = {
        interviewId: this.dialogFormEmploy.interviewId,
        isCheck: this.dialogFormEmploy.isCheck
      }
      this.toolbar[1].loading = true
      req('hire', params).then((res) => {
        this.$emit('getEmployData')
        this.toolbar[1].loading = false
        this.handleClose()
        this.$message.success('录用成功')
      }).catch((err) => {
        this.toolbar[1].loading = false
        console.log(err)
      })
    },

     // 控制弹框标识
    handleClose () {
      this.ShowMeEmployFalg = false
      this.$emit('update:ShowMeEmployFalg', false)
    }
  }
}
</script>
<style>

</style>