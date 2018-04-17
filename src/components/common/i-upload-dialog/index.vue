<template>
  <div class="dialog-container">
    <el-dialog
      :title="title"
      :visible.sync="canVisit"
      :size="size"
      :before-close="emitClose">
      <el-upload
        ref="upload"
        :file-list="fl"
        :action="`${BASE_URL}${uploadApi}`"
        :accept="acceptType"
        :headers="headers"
        :multiple="multipleFlag"
        :on-remove="fileRemvoeFunc"
        :on-success="uploadCtrlFunc"
        :auto-upload="false">
        <el-button
          slot="trigger"
          type="plain">
          选择文件(Excel文件)
        </el-button>
        <span
          slot="tip"
          v-if="tipFlag"
          class="el-upload__tip font-size-small ml10">
          未选择任何文件
        </span>
        <div
          class="mt10"
          slot="tip">
          (推荐
          <a
            class="blue download-link"
            download
            :href="`${BASE_URL}${sampleUrl}`">
            下载模板文件
          </a>
          ,填写后上传)
        </div>
      </el-upload>
      <div slot="footer">
        <el-button
          @click="cancelUploadFunc">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="ensureUploadFunc">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { BASE_URL } from '@/config/api'
import { getToken } from 'utils/auth'
export default {
  name: 'Dialog-Upload',

  props: {
    // 对话框标题
    title: {
      type: String,
      default: '导入'
    },

    // 对话框是否可见标志
    canVisit: {
      type: Boolean,
      default: false
    },

    // 对话框尺寸
    size: {
      type: String,
      default: 'small'
    },

    // 上传文件API
    uploadApi: {
      required: true,
      type: String
    },

    // 模板文件URL
    sampleUrl: {
      require: true,
      type: String
    },

    // 多选文件标志
    multipleFlag: {
      type: Boolean,
      default: false
    },

    // 跟在.后的文件后缀名 | MIME类型
    acceptType: {
      type: String,
      default: '.xlsx, .xls'
    }
  },

  data () {
    return {
      fl: [],
      BASE_URL: BASE_URL,
      headers: {}
    }
  },
  created () {
    this.setHeaders()
  },
  computed: {
    tipFlag () {
      return this.fl.length < 1
    }
  },

  methods: {
      // 永辉生产环境上可能会过滤cookie, 所以需要用这种方式传递Token
    setHeaders () {
      this.headers = {
        ihrAdminAuthorization: getToken()
      }
    },
    // 上传文件
    ensureUploadFunc () {
      this.$refs.upload.submit()
      this.canVisit = false
      this.$emit('update:canVisit', false)
    },

    // 取消上传
    cancelUploadFunc () {
      this.canVisit = false
      this.$emit('update:canVisit', false)
      this.fl = []
    },

    // 删除文件钩子
    fileRemvoeFunc (file, fl) {
      this.fl = fl
    },

    // 上传成功钩子
    uploadCtrlFunc (res, file, fl) {
      if (res.isError) {
        this.$confirm('上传失败，是否查看错误', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let a = document.createElement('a')
          a.setAttribute('href', `api/errorFiles/${res.errorId}/download`)
          a.setAttribute('download', '')
          a.click()
          this.fl = []
        }).catch(() => {
          let a = document.createElement('a')
          a.setAttribute('href', `api/errorFiles/${res.errorId}`)
          a.setAttribute('download', '')
          a.click()
          this.fl = []
        })
      }
    },

    // 关闭按钮update canVisit
    emitClose (done) {
      this.$emit('update:canVisit', false)
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/vars";

.dialog-container {
  .download-link {
    text-decoration: underline;
    text-decoration-color: $light-blue;
  }
}
</style>
