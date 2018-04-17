<template>
    <i-dialog
      v-model="showDialog"
      title="任务详情"
      size="small"
      destroyedWhenClose
    >
      <div class="tips">
        点击关闭可以最小化窗口到查看任务中，随时可以查看。
      </div>
      <div class="content">
        <div class="title">
          <div v-for="(item, index) in titleList" :key="index.title">{{item.title}}</div>
        </div>
        <div class="body">
          <div v-for="(item, index) in titleList" :key="index.name">
            <a v-if="item.name==='download'" :href="downloadHref">{{details[item.name]}}</a>
            <span v-else>{{details[item.name]}}<i v-if="item.name==='status'" v-show="loading" class="el-icon-loading"></i></span>
            <!-- 占位符号 -->
            <span class="placeholder">'</span>
          </div>
        </div>
      </div>
    </i-dialog>
</template>

<script>
import req from 'api/common/home'
import moment from 'moment'
import { getToken } from 'utils/auth'

export default {
  name: 'ITask',
  components: {

  },
  data () {
    return {
      // loading
      loading: true,
      // 打开任务详情窗口
      showDialog: false,
      // id
      exportFileId: '',
      // 定时任务
      interval: '',
      // 下载地址
      downloadHref: '',
      // 保存任务详细信息
      details: {
        taskName: '',
        status: '',
        createDate: '',
        lastUpdateDate: '',
        wasteTime: '',
        isSuccess: '',
        message: '',
        download: ''
      },
      // 保存title的数组
      titleList: [
        {title: '任务标题', name: 'taskName'},
        {title: '任务状态', name: 'status'},
        {title: '添加时间', name: 'createDate'},
        {title: '完成时间', name: 'lastUpdateDate'},
        {title: '任务耗时', name: 'wasteTime'},
        {title: '是否成功', name: 'isSuccess'},
        {title: '返回信息', name: 'message'},
        {title: '下载附件', name: 'download'}
      ],
      // 保存配置
      typeConfig: {
        1: '导入',
        2: '导出'
      },
      statusConfig: {
        1: '等待中',
        2: '正在执行中',
        3: '已完成'
      },
      isSuccessConfig: {
        1: '成功',
        3: '失败'
      }
    }
  },

  watch: {
    showDialog (val, oldVal) {
      if (val === false) {
        clearInterval(this.interval)
        for (let key in this.details) {
          this.details[key] = ''
        }
      } else {
        this.details.status = this.statusConfig[1]
        this.loading = true
      }
    }
  },

  methods: {
    // 打开窗口函数
    openDialog (exportFileId) {
      if (!exportFileId) return
      this.exportFileId = exportFileId
      this.downloadHref = this.$$.BASE_URL + '/common/fileSchedule/' + this.exportFileId + '/download?ihrAdminAuthorization=' + getToken()
      this.running()
      this.showDialog = true
    },
    // 获取任务详情
    getExportDetails () {
      if (!this.exportFileId) return
      let params = {
        exportFileId: this.exportFileId
      }
      if (this.loading) {
        this.details.status = this.statusConfig[1]
      }
      req('getExportDetails', params, true, false).then(data => {
        if (!data) return
        this.loading = false
        this.details.taskName = this.typeConfig[data.type] + data.fileName
        this.details.status = data.status && Number(data.status) === 2 ? this.statusConfig[2] : this.statusConfig[3]
        this.details.createDate = moment(data.createDate).format('YYYY-MM-DD HH:mm:ss')
        this.details.lastUpdateDate = data.lastUpdateDate && moment(data.lastUpdateDate).format('YYYY-MM-DD HH:mm:ss') || ''
        this.details.wasteTime = data.remark && Math.floor(Number(data.remark) / 1000) + 's' || ''
        this.details.isSuccess = data.status && this.isSuccessConfig[data.status] || ''
        this.details.message = data.status && this.details.isSuccess && (this.typeConfig[data.type] + this.isSuccessConfig[data.status] + '!') || ''
        this.details.download = data.status === 1 && '点击下载' || ''
        if (data.status === 1) {
          clearInterval(this.interval)
        }
      })
    },
    // 定时任务
    running () {
      this.interval = setInterval(() => {
        this.getExportDetails()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
  .tips{
    width: 100wh;
    padding: 10px 12px 9px;
    margin-bottom: 9px;
    line-height: 17px;
    background: #F4FAFF;
    border: 1px solid rgba(61,164,254,0.20);
  }
  .content{
    display: flex;
    font-size: 12px;
    line-height: 24px;
  }
  .title, .body{
    display: flex;
    flex-direction: column;
  }
  .title{
    width: 64px;
    color: #333;
  }
  .body{
    color: #8d8d8d;
    .placeholder{
      color:white;
    }
  }
  .body div:last-child{
    color: #3DA5FE;
    cursor: pointer;
  }
</style>
