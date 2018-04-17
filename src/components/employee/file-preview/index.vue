<template>
  <div class="file-preview">
    <el-row v-if="fileList.length !== 0">
      <template v-for="(file, index) in fileList">
        <el-col :span="24">
          <div class="flex-space-between file-item">
            <div>
              {{index + 1 + '、'}}
              <el-button type="text" icon="document" @click="openFilePreviewPage(file)">{{file.attachmentName}}</el-button>
            </div>
            <el-tooltip class="item" effect="light" content="下载" placement="top">
              <a class="icon" :href="getDownload(file)" download><i class="iconfont icon-download"></i></a>
              <a class="icon" @click="download(file)"><i class="iconfont icon-download"></i></a>
            </el-tooltip>
          </div>
        </el-col>
      </template>
    </el-row>

    <el-row v-if="fileList.length === 0">
      <el-col :span="24">
        <h3>暂无附件</h3>
      </el-col>
    </el-row>

  </div>
</template>
<script>
  import { uploaderLinks } from 'api/common/upload'
  import { windowOpen, showMessage } from 'utils/index'
  import req from 'api/employee/contract'
  export default {
    name: '',
    props: {
      businessId: String,
      businessType: String
    },
    data: function () {
      return {
        fileList: []
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.fetchFileList()
      },
      fetchFileList () {
        req('getContractFileList', {businessId: this.businessId, businessType: this.businessType || null}).then(res => {
          if (res) {
            this.fileList = res.attachmentList
          }
          //  else {
          //   this.$message({ type: 'warning', message: '暂无附件' })
          // }
        })
      },
      getDownload (file) {
        return `${uploaderLinks.download}?attachmentId=${file.attachmentId}`
      },

      getPreviewUrl (file) {
        return `${uploaderLinks.filePreview}/${file.attachmentId}`
      },
      // 打开文件预览
      openFilePreviewPage (file) {
        if (this.isPdf(file.attachmentName)) {
          windowOpen(this.getPreviewUrl(file))
        } else {
          showMessage('info', '当前只支持pdf文件预览！其他格式请先下载！')
        }
      },
      // 判断文件是否是pdf
      isPdf (url) {
        return url.match(/pdf/g)
      },
      download (file) {
        const form = document.createElement('form')

        const formConfig = {
          action: this.getDownload(file),
          method: 'get',
          type: 'hidden'
        }

        Object.entries(formConfig).map(
          ([key, val]) => form.setAttribute(key, val)
        )
        form.submit()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .file-preview {
    min-height: 100px;
    line-height: 34px;
  }
  .file-item {
    padding: 0 20px;
  }
  .icon {
    transition: 0.3s;
    &:hover {
      color: #3da5fe;
    }
  }
</style>
