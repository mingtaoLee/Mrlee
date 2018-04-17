<template>
  <i-process-flow :model="model">

    <demand-desc
      slot="baseForm"
      action="批量新建职群职种"
      :model="model"
      :ifDesc="false"
      :limitTime="limitTime"
    ></demand-desc>

    <new-batch-position slot="detailForm" @confirm="confirmData" :inputData="model.treeData"></new-batch-position>

  </i-process-flow>
</template>

<script>
import DemandDesc from 'components/flow/demand-desc'
import NewBatchPosition from 'components/position/new-batch-position'
import req from 'api/position/occupation'

export default {
  name: 'NewBatchOccupationSetting',
  components: {
    DemandDesc,
    NewBatchPosition
  },
  data () {
    return {
      // 控制生效时间的禁用时间
      limitTime: 0,
      // 存放的数据
      model: {
        operationType: '4',
        effectiveDate: '',
        attachmentIds: [],
        reason: '',
        detail: [],
        treeData: []
      }
    }
  },

  created () {

  },

  methods: {
    confirmData (treeData, data) {
      this.model.detail = data
      this.model.treeData = treeData
      this.getLimitTime()
    },
    getLimitTime () {
      let parentIds = []
      this.model.detail.forEach(ele => {
        parentIds.push(ele.parentId)
      })
      parentIds = parentIds.join(',')
      req('getBatchLimitTime', {parentIds}).then(data => {
        this.limitTime = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
