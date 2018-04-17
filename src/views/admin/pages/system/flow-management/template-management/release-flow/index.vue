<template>
  <div>
    <i-dialog
      title="发布"
      size="small"
      :toolbar="toolbar"
      v-model="visible"
      v-loading="loading"
      :element-loading-text="$loadingText"
      :close-on-click-modal="false"
      :before-close="onCancelHandler"
      :destroyedWhenClose="true">
      <div class="content">
        <el-upload
          ref="upload"
          :headers="headers"
          :file-list="fileList"
          :action="`${$$.BASE_URL}${uploadApi}`"
          :data="otherData"
          accept=".rar, .zip, .bpmn, .bpmn2"
          :on-remove="fileRemvoeFunc"
          :on-error="fileErrorFunc"
          :before-upload="beforeUploadFunc"
          :on-change="handleUploadChange"
          :on-success="uploadCtrlFunc"
          :on-exceed="handleExceed"
          :limit="1"
          :auto-upload="false">
          <el-button
            slot="trigger"
            type="plain">
            选择文件
          </el-button>
          <span
            slot="tip"
            v-if="tipFlag"
            class="el-upload__tip font-size-small ml10">
            未选择任何文件
          </span>
        </el-upload>
        <el-checkbox v-model="isUesd" class="mt20">沿用上一版本配置</el-checkbox>
      </div>
    </i-dialog>
  </div>
</template>
<script>
// import req from 'api/system/flow-managent'
import { getToken } from 'utils/auth'
export default {
  name: 'ReleaseFlow',
  props: {
    // 对话框是否可见标志
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      headers: null,
      // 弹窗显示控制
      visible: false,
      // 上传文件列表
      fileList: [],
      // loading
      loading: false,
      // 上传地址
      uploadApi: '/workflow/system/deploy/Y',
      // 其他数据
      otherData: null,
      // 确定done
      done: null,

      // 沿用上一版本配置
      isUesd: true,
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
            this.done = done
            this.onConfirmHandler()
            // done()
          }
        }
      ],
      tipFlag: true
    }
  },
  // computed: {
  //   tipFlag () {
  //     return !this.fileList.length
  //   }
  // },
  watch: {
    // 对话框是否可见标志
    isShow (val) {
      this.visible = val
    }
  },
  created () {
    this.headers = {
      ihrAdminAuthorization: getToken()
    }
  },
  methods: {
    // 取消
    onCancelHandler () {
      this.fileList = []
      this.$emit('cancel')
    },
    // 确定
    onConfirmHandler () {
      // if (!this.tipFlag) {
      this.release()
      // } else {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择待发布文件'
      //   })
      // }
    },
    // 删除文件钩子
    fileRemvoeFunc (file, fl) {
      // this.fileList = fl
      fl.length === 0 && (this.tipFlag = true)
    },
    // 文件成功时钩子
    uploadCtrlFunc (res, file, fl) {
      this.fileList = fl
      console.log(this.fileList)
      this.loading = false
      this.$emit('confirm')
      this.done()
      this.$message({
        type: 'success',
        message: '文件发布成功'
      })
    },
    // 文件失败时钩子
    fileErrorFunc (err, file, fileList) {
      this.loading = false
      console.log('error: ', err, file, fileList)
      this.$message({
        type: 'error',
        message: '文件发布失败'
      })
    },
    // 上传前增加loading
    beforeUploadFunc (file) {
      if (file) {
        this.loading = true
      }
    },
    // 上传文件数量超出的钩子
    handleExceed (file, fileList) {
      this.$message({
        message: '请勿多次上传',
        type: 'warning'
      })
    },
    // 文件上传到浏览器的钩子
    handleUploadChange (file, fl) {
      // console.log(file)
      // console.log(fl)
      fl.length > 0 && (this.tipFlag = false)
      // this.fileList = JSON.parse(JSON.stringify(fl))
    },
    // 发布
    release () {
      this.otherData = {
        inheritLastPower: this.isUesd ? 'Y' : 'N'
      }
      console.log(this.fileList)
      console.log(this.$refs.upload)
      this.$refs.upload.submit()
    }
  }
}
</script>
