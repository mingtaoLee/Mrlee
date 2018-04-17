<template>

   <i-process-flow @fillin="fillIn" :model="ocDetails">

        <demand-desc slot="baseForm" :model="ocDetails" :action="action" :ifDesc="desc" :limitTime="limitTime"></demand-desc>

        <kind-maintain
          slot="detailForm"
          v-if="ocDetails.operationType!=='2'"
          :model="ocDetails"
          @limitTime="controlLimitTime"
        ></kind-maintain>

        <kind-cancel
          slot="detailForm"
          v-if="ocDetails.operationType==='2'"
          :model="ocDetails"
          @limitTime="controlLimitTime"
        ></kind-cancel>

    </i-process-flow>

</template>

<script>
import req from 'api/position/occupation'
import DemandDesc from 'components/flow/demand-desc'
import KindMaintain from 'components/position/kind-maintain'
import GroupCancel from 'components/position/group-cancel'
import KindCancel from 'components/position/kind-cancel'
import IProcessFlow from 'components/common/i-process-flow'
import {getOperationTypeByProcess} from 'config/dict'

export default {
  name: 'OccupationSetting',
  components: {
    DemandDesc,
    KindMaintain,
    GroupCancel,
    KindCancel,
    IProcessFlow
  },
  data () {
    return {
      getControlList: [],
      processType: this.$route.query.processType,
      action: '',
      desc: false,
      ocDetails: {
        operationType: '',
        effectiveDate: '',
        attachmentIds: [],
        reason: '',
        parentId: 0,
        posJobFamilyId: 0,
        name: '',
        remark: '',
        // 带出已选择的节点
        selectedNode: {}
      },
      submitLoading: false,
      saveLoading: false,
      // 限制选择生效时间
      limitTime: 0,
      actionType: {
        '0': '新建',
        '1': '修改',
        '2': '撤销'
      }
    }
  },

  methods: {
    postFlow () {
      if (!this.ocDetails.name) {
        delete this.ocDetails.name
      }
      return this.ocDetails
    },
    fillIn () {
      this.ocDetails.effectiveDate = new Date(this.ocDetails.effectiveDate)
      this.getByData = {posJobFamilyId: Number(this.ocDetails.posJobFamilyId)}
    },
    controlLimitTime (limitTime) {
      this.limitTime = limitTime
    }
  },

  created () {
    var that = this
    // 必须点击树形图或待审批流程过来
    if (Object.keys(this.$route.query).length === 0) {
      return window.close()
    }
    // 插入操作类型
    this.ocDetails.operationType = getOperationTypeByProcess[this.processType]
    this.action = this.actionType[this.ocDetails.operationType] + '职群职种'
    // 如果传过来id，则在修改的时候带出数据
    if (this.$route.query.posJobFamilyId) {
      var params = {
        posJobFamilyId: Number(this.$route.query.posJobFamilyId)
      }
      that.ocDetails.posJobFamilyId = Number(this.$route.query.posJobFamilyId)
      req('getOcDetails', params).then(data => {
        delete data.effectiveDate
        delete data.name
        if (that.ocDetails.operationType === '1') {
          Object.assign(that.ocDetails, data)
        } else {
          that.ocDetails.name = data.name
          that.ocDetails.parentName = data.parentName
        }
      })
      this.ocDetails.selectedNode = {
        posJobFamilyId: this.ocDetails.posJobFamilyId,
        name: this.$route.query.posJobFamilyName,
        jobFamilyType: this.$route.query.jobFamilyType
      }
    } else {
      // 新建的时候，传过来所属职群的jobFamilyType(以此区分两个接口)
      this.ocDetails.selectedNode = {
        posJobFamilyId: Number(this.$route.query.parentId),
        name: this.$route.query.parentName,
        parentId: Number(this.$route.query.parentId),
        jobFamilyType: this.$route.query.jobFamilyType
      }
      this.ocDetails.parentId = Number(this.$route.query.parentId)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
