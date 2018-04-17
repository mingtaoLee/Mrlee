<template>
  <i-dialog v-model="showDialog" :title="'查看'+name+'信息'">
    <div class="top-basic-info" v-loading="loading" :element-loading-text="$loadingText">
      <div class="top-basic-info-left">
        <p class="mb10">{{name}}名称&nbsp;:{{$data.name}}</p>
        <p class="mb10" v-if="name==='职务'">职务编码&nbsp;:{{code}}</p>
        <p class="mb10" v-if="name==='职务'">职务类别&nbsp;:{{titleType}}</p>
        <p class="mb10">状态&nbsp;:{{status}}</p>
        <p class="mb10">生效日期&nbsp;:{{effectiveDate}}</p>
        <p class="mb10">备注&nbsp;:{{remark}}</p>
      </div>
      <div class="top-basic-info-right">
        <p class="mb10">操作人姓名&nbsp;:{{lastUpdateBy}}</p>
        <p class="mb10">操作人工号&nbsp;:{{lastUpdateCode}}</p>
        <p class="mb10">操作时间&nbsp;:{{lastUpdateDate}}</p>
      </div>
    </div>
  </i-dialog>
</template>

<script>
import req from 'api/position/position-job'
import categoryReq from 'api/position/position-category'
import moment from 'moment'

export default {
  name: 'CheckJobTitleDetails',
  components: {

  },
  props: {
    name: {
      type: String,
      default: ''
    },
    column: {
      type: Object,
      default: () => ({
        name: '',
        status: '',
        titleType: '',
        code: '',
        effectiveDate: '',
        remark: '',
        lastUpdateBy: '',
        lastUpdateCode: '',
        lastUpdateDate: ''
      })
    }
  },
  data () {
    return {
      showDialog: false,
      loading: false,
      name: '',
      status: '',
      titleType: '',
      code: '',
      effectiveDate: '',
      remark: '',
      lastUpdateBy: '',
      lastUpdateCode: '',
      lastUpdateDate: ''
    }
  },
  created () {

  },
  watch: {

  },
  methods: {
    openDialog () {
      this.showDialog = true
      this.$nextTick(() => {
        this.loading = true
        let params = {}
        switch (this.name) {
          case '职务':
            params.posTitleId = this.column.posTitleId
            req('getPosJobDetail', params).then(data => {
              data.effectiveDate && (data.effectiveDate = moment(data.effectiveDate).format('YYYY-MM-DD'))
              data.lastUpdateDate && (data.lastUpdateDate = moment(data.lastUpdateDate).format('YYYY-MM-DD'))
              Object.assign(this.$data, data)
              let getDicts = [
                {
                  dictCode: 'TITLE_TYPE',
                  value: data.titleType
                },
                {
                  dictCode: 'POSITION_STATUS',
                  value: data.status
                }
              ]
              this.$d(getDicts).then(val => {
                this.titleType = val[0]
                this.status = val[1]
                this.loading = false
              })
            })
            break
          case '品类':
            params.posCategoryId = this.column.posCategoryId
            categoryReq('getPosCategoryDetail', params).then(data => {
              data.effectiveDate && (data.effectiveDate = moment(data.effectiveDate).format('YYYY-MM-DD'))
              data.lastUpdateDate && (data.lastUpdateDate = moment(data.lastUpdateDate).format('YYYY-MM-DD'))
              Object.assign(this.$data, data)
              let getDicts = [
                {
                  dictCode: 'POSITION_STATUS',
                  value: data.status
                }
              ]
              this.$d(getDicts).then(val => {
                this.status = val[0]
                this.loading = false
              })
            })
        }
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
