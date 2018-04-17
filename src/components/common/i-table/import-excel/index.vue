<template>
  <div class="i-table-import-excel">
    <div v-if="!submited" class="beforeSubmit">
       <el-upload
         class="upload"
         :http-request="customUpload"
         :data="params"
         :on-change="handleChange"
         :on-success="handleSuccess"
         :on-progress="handleProgress"
         :show-file-list="false"
         :auto-upload="false"
         :multiple="false"
         ref="upload">
         <el-button>选择文件(Excel文件)</el-button>
         <div slot="tip" class="table-import-tip">
           {{ uploadVm.uploadFiles && uploadVm.uploadFiles.length !== 0
             ? uploadVm.uploadFiles[0].name
             : '未选择任何文件' }}
         </div>
       </el-upload>

       <div class="download" v-if="!this.setting.hideDownloadTemplate">
         文件格式：*.xls 或 *.xlsx，请先在当前页<a :href="exampleUrl">下载导入模板</a>，用该模板填写好后再导入。
       </div>
    </div>

    <div
      v-else
      class="afterSubmit">
      <p class="upload-info">
        共 <span class="total color-default">{{ total }}</span> 条数据，成功导入 <span class="success color-success">{{ success }}</span> 条，其中失败 <span class="fail color-danger">{{ fail }}</span> 条，还剩 <span class="remainder">{{ total - fail - success }}</span> 条
      </p>
      <el-progress :percentage="percentage" />
      <a v-if="failUrl" :href="failUrl" class="failUrl">下载错误数据</a>
    </div>
  </div>
</template>


<script>
import req from 'api/common/upload'
import axios from 'axios'
import { getToken } from 'utils/auth'

export default {
  name: 'ITableImportExcel',

  props: {
    setting: {
      type: Object,
      default: {},
      require: true
    }
  },

  data () {
    return {
      uploadVm: {},
      submited: false,
      business: null,
      params: null,
      id: null,
      cur: 0,
      total: 0,
      fail: 0,
      success: 0,
      percentage: 0,
      isError: false, // 控制进度条状态
      timer: null,
      exampleUrl: `${this.$$.BASE_URL}/common/imports/${this.settingMap('business')}/templates/download?ihrAdminAuthorization=${getToken()}`,
      failUrl: '',
      url: this.$$.BASE_URL + '/' + this.$$.table.import.urlPrefix + this.settingMap('business')
    }
  },

  created () {
    this.business = this.settingMap('business')
    this.setting.params ? this.params = JSON.stringify(this.settingMap('params')) : this.params = this.settingMap('params')
  },

  mounted () {
    this.uploadVm = this.$refs.upload
  },

  watch: {
    percentage () {
      if (this.percentage === 100 && this.fail > 0) {
        this.failUrl = `${this.$$.BASE_URL}/common/imports/${this.business}/fails/${this.id}?ihrAdminAuthorization=${getToken()}`
      }
    }
  },

  methods: {

    customUpload (arg) {
      let {file} = arg
      let data = new FormData()
      data.append('file', file)
      this.params && data.append('params', this.params)
      axios({
        method: 'post',
        url: this.url,
        data: data,
        headers: { ihrAdminAuthorization: getToken() },
        onUploadProgress: this.handleProgress
      }).then((res) => {
        // 处理上传空的模板文件情况
        if (res.data.total === '0' && res.data.success === '0' && res.data.fail === '0') {
          Object.assign(this, res.data)
          this.percentage = 100
        } else {
          this.handleSuccess(res.data)
        }
      }).catch(err => this.$message.error(err.message))
    },

    settingMap (prop) {
      return this.setting
        ? this.setting[prop]
        : null
    },

    submit (done) {
      console.log(this.uploadVm.uploadFiles)

      if (this.submited) {
        // 通知i-table 刷新表格列表数据
        this.$emit('submited')
        if (this.success) {
          this.$emit('success', this.percentage, this.success)
          this.setting.callback && this.setting.callback()
        } else {
          this.$emit('fail')
          this.setting.callback && this.setting.callback('fail')
        }
        done()
      } else {
        this.uploadVm.uploadFiles.length
          ? this.uploadVm.submit()
          : this.$message.warning('请先选择需要导入的文件')
      }
    },

    check () {
      return req('check', {
        business: this.business,
        id: this.id
      })
      .then(res => {
        this.cur = Number(res.fail) + Number(res.success)
        this.fail = Number(res.fail)
        this.success = Number(res.success)

        this.percentage = Math.floor((this.cur / this.total) * 100)
      })
    },

    poll () {
      // TODO: flag 取消标识
      if (this.cur < this.total) {
        this.check()
        this.timer = setTimeout(() => this.poll(), 500)
      } else {
        clearTimeout(this.timer)
      }
    },

    handleChange (file, fileList) {
      const typeReg = /\.(xlsx|xls){1}$/
      let { uploadFiles } = this.uploadVm

      if (!typeReg.test(file.name)) {
        this.$message.warning(`文件格式错误`)
        uploadFiles.length === 2
          ? uploadFiles.pop()
          : uploadFiles.splice(0, uploadFiles.length)
      } else {
        uploadFiles.splice(0, uploadFiles.length, file)
      }
    },

    handleSuccess (response, file, fileList) {
      const { id, total } = response
      this.id = id
      this.total = +total
      this.poll()
    },

    handleProgress (event, file, fileList) {
      this.submited = true
    }
  }
}
</script>

<style lang="scss" scoped>
.color-default {
  color: #66b1ff;
}
.color-danger {
  color: #fa5555;
}
.color-success {
  color: #67c23a;
}
.failUrl{
  color: #3DA5FE;
}

.i-table-import-excel {
  .table-import-tip {
    display: inline-block;
    margin-left: 10px;
    color: #999;
  }
  .download {
    margin-top: 10px;
    a {
      color: #3DA5FE;
      text-decoration: underline;
    }
  }
  .upload-info {
    margin-bottom: 10px;
  }
}
</style>
