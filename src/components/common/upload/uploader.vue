<template>
  <el-upload
    :class="uploaderClass"
    :auto-upload="true"
    :action="uploadUrl"
    :headers="headers"
    multiple
    :drag="!previewMode && type==='normal'"
    :limit="fileLimit"
    :disabled="previewMode"
    with-credentials
    name="file"
    :on-preview="onPreview"
    :before-upload="beforeUpload"
    :onError="uploadError"
    :onSuccess="uploadSuccess"
    :file-list="fileListInfo"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :on-exceed="handleExceed"
  >
    <template v-if="!previewMode">
      <slot name="uploadPanel">
        <template v-if="type==='text' || type==='button'">
          <el-button :type="type">点击上传</el-button>
        </template>
        <template v-else>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
            <p>文件大小不能超过{{ fileLimitSize }}M,最多上传{{ fileLimit }}个</p>
          </div>
        </template>
      </slot>
    </template>
  </el-upload>
</template>

<script>
  import req, { uploaderLinks } from 'api/common/upload'
  import { windowOpen } from 'utils/index'
  import { getToken } from 'utils/auth'
  import { AUTHORIZATION_KEY } from 'config/api'
  export default {
    data () {
      return {
        fileListInfo: [
          // {
          //   attachmentId: '8a90d50f622a4dba01622cab5f520030',
          //   name: '附件名称',
          //   attachmentSize: '附件大小',
          //   createDate: '创建时间'
          // },
          // {
          //   attachmentId: '8a90d50f622a4dba01622cab5f520030',
          //   name: '附件名称',
          //   attachmentSize: '附件大小',
          //   createDate: '创建时间'
          // }
        ],
        uploadUrl: uploaderLinks.upload,
        previewUrl: uploaderLinks.preview,
        headers: {}
      }
    },
    props: {
      // 附件展示模式，normal为普通模式，table为在表格行中展示
      mode: {
        type: String,
        default: 'normal'
      },
      // 上传按钮展示类型，normal为拖拉模式，text、button为按钮模式（配合mode配置使用）
      type: {
        type: String,
        default: 'normal'
      },
      previewMode: {
        type: Boolean,
        default: false
      },
      fileList: {
        type: Array,
        default: () => []
      },
      businessId: {
        type: String,
        default: ''
      },
      businessType: {
        type: String,
        default: ''
      },
      fileLimitType: {
        type: String,
        default: 'image/png,image/gif,image/jpg,image/jpeg,image/bmp,application/zip,application/x-zip-compressed,application/pdf,application/msword,application/vnd.ms-powerpoint,application/vnd.ms-excel,application/x-rar-compressed,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      fileLimitTypeName: {
        type: String,
        default: 'png, jpg, gif, rar, zip, pdf, word, excel, ppt'
      },
      fileLimit: {
        type: Number,
        default: 5
      },
      fileLimitSize: {
        type: Number,
        default: 10
      }
    },
    computed: {
      uploaderClass () {
        const CLASS = ['uploader']
        if (this.mode === 'table' && (this.type === 'text' || this.type === 'button')) {
          CLASS.push('button-type')
        }
        if (this.previewMode) {
          CLASS.push('preview')
        }
        return CLASS
      }
    },
    created () {
      this.setHeaders()
      this.requestFileList()
    },
    methods: {
      // 永辉生产环境上可能会过滤cookie, 所以需要用这种方式传递Token
      setHeaders () {
        this.headers = {
          ihrAdminAuthorization: getToken()
        }
      },
      // 根据fileList或businessId,businessType请求数据获取附件列表
      requestFileList () {
        const params = {}
        if (this.fileList.length > 0) {
          for (let i = 0; i < this.fileList.length; i++) {
            if (this.fileList[i] === '' || typeof (this.fileList[i]) === 'undefined' || this.fileList[i] === null) {
              this.fileList.splice(i, 1)
              i = i - 1
            }
          }
          params.fileList = this.fileList.toString()
        } else if (this.businessId || this.businessType) {
          this.businessId && (params.businessId = this.businessId)
          this.businessType && (params.businessType = this.businessType)
        }
        if (Object.keys(params).length > 0) {
          req('getFileList', params)
            .then(res => {
              if (res) {
                const data = res
                data.attachmentList.forEach(v => {
                  v.name = v.attachmentName
                })
                this.fileListInfo = data.attachmentList
              }
            }).catch((res) => {
              console.log(res)
            })
        }
      },
      uploadSuccess (response, file, fileList) {
        if (response) {
          file.attachmentId = file.response
          this.$emit('onSuccess', response, file, fileList)
          this.$emit('onChange', file, fileList)
        }
      },
      uploadError (err, file, fileList) {
        this.$emit('onError', err, file, fileList)
      },
      onPreview (file) {
        // window.open(this.previewUrl + '?attachmentId=' + (file.attachmentId || file.response))
        windowOpen(this.previewUrl, { attachmentId: file.attachmentId || file.response, [AUTHORIZATION_KEY]: getToken() })
      },
      beforeUpload (file) {
        let reg, limitType
        if (file.type) {
          reg = new RegExp(file.type)
          limitType = reg.test(this.fileLimitType)
        } else if (file.type === '' && file.name.match(/\.(rar|zip)$/)) {
          // 解决rar、zip文件上传
          limitType = true
        } else {
          limitType = false
        }
        const limitNumber = this.fileListInfo.length < this.fileLimit
        const limitSize = file.size / 1024 / 1024 < this.fileLimitSize

        if (!limitType) {
          this.$message.warning(`上传文件只能是 ${this.fileLimitTypeName} 格式!`)
        } else {
          (!limitSize) && this.$message.warning(`上传文件大小不能超过 ${this.fileLimitSize}MB!`)
        }
        return limitType && limitSize && limitNumber
      },
      handleChange (file, fileList) {
      },
      handleExceed (file, fileList) {
        this.$message.warning(`上传文件限制 ${this.fileLimit}个!`)
      },
      handleRemove (file, fileList) {
        this.$emit('onRemove', file, fileList)
        this.$emit('onChange', file, fileList)
      }
    },
    watch: {
//      fileList () {
//        this.requestFileList()
//      }
    }
  }
</script>
<style lang="scss" scoped>
  .uploader {
    max-width: 360px;
  }
</style>
<style lang="scss">
.el-upload {
  display: inline;
}
.el-upload-list__item.is-success:focus:not(:hover) .el-icon-close-tip {
  display: none;
}
.uploader.button-type {
  position: relative;
  .el-upload-list {
    display: none;
  }
  &:hover > .el-upload-list, &.preview > .el-upload-list {
    display: block;
  }
  &.preview .el-upload-list .el-upload-list__item {
    display: block;
  }
  .el-upload-list .el-upload-list__item {
    width: 100%;
    font-size: inherit;
  }
}
</style>
