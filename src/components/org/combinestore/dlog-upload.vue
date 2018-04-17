<template>
  <div>
    <el-dialog
      title="导入"
      :visible.sync="visible"
      @close="closeDialog"
      @open="openDialog">
      <el-upload
        class="upload-demo"
        :action="`${$$.BASE_URL}/org/combine/import`"
        multiple
        :limit="1"
        :auto-upload="false"
        :on-exceed="onExceed"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :before-upload="handleBefore"
        :on-success="handleSuccess"
        :on-error="handleError"
        accept=".xls, .xlsx"
        ref="upload">
        <el-button>选择文件(Excel文件)</el-button>
        <div slot="tip" class="el-upload__tip" v-if="tipVisible">未选择任何文件</div>
      </el-upload>
      <div class="sample">
        (推荐<a :href="`${$$.BASE_URL}/org/combine/import/template`">下载模板文件，</a>填写后上传)
        <!-- (推荐<el-button type="text" @click="downloadFile">下载模板文件</el-button>，填写后上传) -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'dlog-modify',
  data () {
    return {
      visible: false,
      tipVisible: true,
      fileList: []
    }
  },
  props: {
    value: Boolean
  },
  methods: {
    openDialog () {
      this.$refs.upload.clearFiles()
    },
    closeDialog () {
      this.$emit('input', false)
    },
    cancel () {
      this.closeDialog()
    },
    confirm () {
      if (this.fileList.length > 1) {
        return this.$message.warning('每次只能上传一个文件')
      }
      this.$refs.upload.submit()
    },
    downloadFile () {
      window.open(`${this.$dd.BASE_URL}/org/combine/import/template`)
    },
    handleBefore (file) {
      this.tipVisible = false
      const isExcel = (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      if (!isExcel) {
        this.$message.error('只能上传Excel文件')
        this.tipVisible = true
      }
      return isExcel
    },
    handleChange (file, fileList) {
      if (file.status === 'ready') {
        this.tipVisible = false
        this.fileList = fileList
      }
    },
    handleRemove (file, fileList) {
      fileList.length === 0 ? this.tipVisible = true : this.tipVisible = false
    },
    handleSuccess (message) {
      this.$emit('receiveMessage', message)
      this.closeDialog()
    },
    handleError (err) {
      let jsonMsg = err.message.slice(err.message.indexOf(' '))
      let msg = JSON.parse(jsonMsg).message
      this.$message({
        type: 'error',
        message: msg
      })
    }
  },
  watch: {
    value () {
      this.visible = this.value
    }
  }
}
</script>
<style lang="scss" scoped>
  .upload-demo {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-upload__tip {
    margin-left: 10px;
  }
  
  .sample a {
    color: #20a0ff
  }
</style>
