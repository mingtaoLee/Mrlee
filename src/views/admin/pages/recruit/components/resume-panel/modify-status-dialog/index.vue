<template>
  <i-dialog
  title="修改简历状态"
  size="small"
  :toolbar="toolbar"
  v-model="isShow"
  @close="handleClose"
  :close-on-click-modal="false"
  :destroyedWhenClose="true">
    <div class="content">
      <el-form
        class="formDialog"
        :model="dialogForm"
        label-width="80px">
          <el-form-item label="姓名">
          {{dialogForm.name}}
        </el-form-item>
        <el-form-item label="手机">
            {{dialogForm.mobile}}
        </el-form-item>
        <el-form-item label="学历">
          <i-select
            v-model="dialogForm.education"
            parameter="EDUCATIONAL_BACKGROUND"
            placeholder=""
            disabled></i-select>
        </el-form-item>
        <el-form-item label="简历状态">
           <i-select
            :filterable="true"
            :clearable="true"
            v-model="dialogForm.resumeStatus"
            parameter="RESUME_STATUS"
            placeholder="请输入招聘状态"></i-select>
        </el-form-item>
      </el-form>
    </div>
  </i-dialog>
</template>
<script>
export default {
  name: 'ModifyStatusDialog',
  props: {
    // 是否显示
    isShow: {
      type: Boolean,
      default: false
    },
    // 列表项
    value: Object
  },
  data () {
    return {
      // 表单
      dialogForm: this.value,
      // 底部两个按钮
      toolbar: [
        {
          text: '取消',
          type: 'defalut',
          func: (done) => {
            this.onCancelHandler()
            done()
          }
        }, {
          text: '确定',
          type: 'primary',
          func: (done) => {
            this.onConfirmHandler()
            done()
          }
        }
      ]
    }
  },
  watch: {
    // 表单
    value () {
      this.dialogForm = this.value
    }
  },
  methods: {
    // 取消
    onCancelHandler () {
      this.$emit('cancel')
    },
    // 确定
    onConfirmHandler () {
      this.$emit('confirm', this.dialogForm.resumeId, this.dialogForm.resumeStatus)
    },
    handleClose () {
      this.$emit('cancel')
    }
  }
}
</script>
