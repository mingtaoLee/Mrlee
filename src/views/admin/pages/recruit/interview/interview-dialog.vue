<template>
  <i-dialog title='登记面试'
    v-model='ShowMeFalg'
    size='standard'
    :toolbar="toolbar"
    :appendToBody="false"
    :destroyedWhenClose="true"
    @close="handleClose"
  >
    <div class='content'>
      <el-form class='formDialog'
        :model='dialogForm'
        :rules='rules'
        ref='dialogForm'
        :inline='true'
        style='width: 100%'
        label-width="100px">
        <el-row type="flex" justify="space-around">
          <el-col :span="12">
            <el-form-item label='应试人姓名'>
              <span>{{dialogForm.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label='应试人手机'>
            <span>{{dialogForm.mobile}}</span>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="12">
            <el-form-item label="应试人邮箱">
              <span>{{dialogForm.email}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label='应聘部门'>
            <span>{{dialogForm.applyOrgName}}</span>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="12">
          <el-form-item label='应聘职位'>
            <span>{{dialogForm.applyPosition}}</span>
          </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
          <el-form-item label='通知时间'>
            <span>{{dataFilter(dialogForm.noticeDate)}}</span>
          </el-form-item>
          </el-col>  -->
        <el-col :span="12">
          <!-- <el-form-item label='面试时间:'>
            <span>{{dataFilter(dialogForm.interviewDate)}}</span>
          </el-form-item> -->
          <el-form-item label="面试时间" prop="interviewDate" required>
            <el-date-picker
              v-model="dialogForm.interviewDate"
              type="datetime"
              :picker-options="interviewDatePickerOpts"
              :disabled="dateDisable"
              placeholder="选择面试时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="12">
          <el-form-item  prop="interviewerName" required>
            <span slot='label'>面试官</span>
            <el-input v-model='dialogForm.interviewerName' @click.native='handleIconClick'>
            <i
            slot='suffix'
            class='el-icon-menu'
            @click.stop='handleIconClick'
            ></i>
            </el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item
            label='面试状态'
            prop="interviewStatusQ"
            required>
            <i-select
              v-model='dialogForm.interviewStatusQ'
              parameter='INTERVIEW_SHOW_STATUS'
              placeholder='请选择'>
            </i-select>
          </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 人员选择 -->
    <i-personnel-select
      :isShow.sync='isShow'
      :limit="3"
      :autoClose="false"
      @confirm='handleConfirm'
    >

    </i-personnel-select>
  </i-dialog>
</template>
<script>
import req from 'api/recruit/interview'
export default {
  name: 'interviewDialog',
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
      // 校验面试官
    const interviewerNameValidator = (rule, val, cb) => {
      if (!val) {
        cb(new Error('请选择面试官'))
      } else {
        cb()
      }
    }
    // 面试时间校验
    const interviewDateValidator = (rule, val, cb) => {
      if (!val) {
        cb(new Error('请选择面试时间'))
      } else {
        cb()
      }
    }

    return {
      isShow: false,
      dialogForm: {
        name: '', // 面试人的姓名
        mobile: '', // 面试人的手机号
        email: null, // 邮件
        applyOrgName: '', // 应聘部门
        applyPosition: '', // 申请职位
        interviewDate: '', // 面试时间
        interviewerName: null, // 面试官的名字
        interviewers: [], // 面试官Id
        interviewStatus: null, // 面试状态
        interviewStatusQ: '',
        resumeId: null
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
          this.$refs.dialogForm.validate(valid => {
            if (valid) {
              this.onConfirmHandler()
              // done()
            }
          })
        }
      }],

      rules: {
        interviewDate: [{validator: interviewDateValidator, trigger: 'change'}], // 面试时间校验
        interviewerName: [{validator: interviewerNameValidator, trigger: 'change'}],
        interviewStatusQ: [{required: true, message: '请选择面试状态', trigger: 'change'}]
      },
      interviewDatePickerOpts: {                              // 面试时间选择限制
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },

  methods: {
    // 人员选择遍历
    handleConfirm (selected) {
      // console.log(selected)
      let nameList = []
      let idList = []
      selected.map(item => {
        idList.push(item.employeeId)
        nameList.push(item.employeeName)
      })
      // console.log(nameList.toString())
      this.dialogForm.interviewerName = nameList.toString()
      this.dialogForm.interviewers = idList
      this.isShow = false
    },

    // 人员选择的弹框
    handleIconClick () {
      this.isShow = !this.isShow
    },

    // 确定
    onConfirmHandler () {
      // this.$refs.dialogForm.validate(valid => {
      //   if (valid) {
          // console.log(valid)
          // 放请求后端接口
      let params = {
        interviewId: this.dialogForm.interviewId,
        resumeId: this.dialogForm.resumeId,
        // ...this.dialogForm
        interviewDate: this.dialogForm.interviewDate,
        interviewers: this.dialogForm.interviewers.map(ele => ele.interviewerId ? ele.interviewerId : ele),
        interviewStatus: this.dialogForm.interviewStatusQ
      }
      this.toolbar[1].loading = true
      req('register', params).then(res => {
        this.$emit('getData')
        this.toolbar[1].loading = false
        this.handleClose()
        this.$message.success('登记面试成功')
      }).catch((err) => {
        this.toolbar[1].loading = false
        console.log(err)
      })
      //   }
      // })
    },

    // 控制弹框标识
    handleClose () {
      this.ShowMeFalg = false
      this.$emit('update:ShowMeFalg', false)
    }
  }
}
</script>
<style scoped lang='scss'>

</style>
