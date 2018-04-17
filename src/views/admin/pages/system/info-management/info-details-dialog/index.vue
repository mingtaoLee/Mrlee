<template>
  <i-dialog
    v-model="isOpen"
    :toolbar="toolbar"
    :before-close="handleClose"
    title="查看信息集详情"
    destroyedWhenClose
    size="standard"
  >
    <div class="top-basic-info mt10">
      <div class="top-basic-info-left">
        <p class="mb10">信息集名称：{{infoData.infName}}</p>
        <p class="mb10">规则配置是否引用：{{infoData.refStatus}}</p>
        <p class="mb10">状态：{{infoData.status}}</p>
        <p class="mb10">操作时间：{{infoData.lastUpdateDate}}</p>
      </div>
      <div class="top-basic-info-right">
        <p class="mb10">表名：{{infoData.tableName}}</p>
        <p class="mb10">类型：{{infoData.classification}}</p>
        <p class="mb10">操作人：{{infoData.lastUpdateBy}}</p>
        <p class="mb10">操作工号：{{infoData.lastUpdateCode}}</p>
      </div>
    </div>
    <p class="mb10">备注：{{infoData.description}}</p>
  </i-dialog>
</template>

<script>
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import reqIn from 'api/system/info-management/index'
  import moment from 'moment'
  export default {
    name: 'infoDetailsDialog',
    components: {
      IDialog
    },
    data () {
      return {
        isOpen: false,
        infoData: {}
      }
    },
    methods: {
      /**
       *@description 打开弹框并初始化的方法
       *@param {boolean} isOpen 控制弹框是否打开
       *@param {Object} row 行对象，在行内查看或修改操作时需要传入
       */
      openDialog (isOpen, row) {
        this.isOpen = isOpen
        if (row) {
          this.getInfoDetail(row.infTableId)
        }
      },
      // 根据id获取信息集信息
      getInfoDetail (id) {
        let params = {infTableId: id}
        reqIn('checkInfo', params).then(res => {
          console.log(res)
          this.infoData = res
          this.infoData.lastUpdateDate = this.infoData.lastUpdateDate === null ? '' : moment(this.infoData.lastUpdateDate).format('YYYY-MM-DD')
          this.$d('WHETHER_TYPE', this.infoData.refStatus).then(data => {
            this.infoData.refStatus = data
          })
          this.$d('MSG_INF_TABCODE', this.infoData.classification).then(data => {
            this.infoData.classification = data
          })
          this.$d('MSG_INF_STATUS', this.infoData.status).then(data => {
            this.infoData.status = data
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .top-basic-info {
    width:100%;
    display: flex;

    overflow-y:auto;
    flex-direction: row;
    .top-basic-info-left {
      margin-right: 20px;
      width: calc(50% - 20px);
    }
    .top-basic-info-right{
      width: 50%;
    }
  }
</style>
