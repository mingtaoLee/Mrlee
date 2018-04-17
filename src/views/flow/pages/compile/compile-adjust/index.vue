<template>
  <div class="compile-adjust">
    <i-process-flow
      :processType="processType"
      :model="planModel"
      :taskId="taskId"
      @postFlow="postFlow"
      @err="FlowErr"
      >
      <template slot="baseInfo">
        <base-info
          :model="planModel"
          :orgType.sync="orgType"
          :taskId="taskId"
          :loading="loading"
          @orgChange="orgChange"
          @loadingChange="loadingChange"
        ></base-info>
      </template>
      <template slot="commonCondition">
        <common-condition
          v-if="showCommonCondition"
          :model="planModel"
          :key="orgType"
          :loading="loading"
        ></common-condition>
      </template>
      <template slot="adjustDetail">
        <adjust-detail :model="planModel" :loading="loading"></adjust-detail>
      </template>
    </i-process-flow>
  </div>
</template>

<script>
  import req from 'api/compile/maintain/index'
  import IProcessFlow from 'components/common/i-process-flow/index'
  import BaseInfo from './components/base-info'
  import CommonCondition from './components/common-condition'
  import AdjustDetail from './components/adjust-detail'
  export default{
    name: 'CompileAdjust',
    components: {
      IProcessFlow,
      BaseInfo,
      CommonCondition,
      AdjustDetail
    },
    data () {
      return {
        // 调整明细的loading状态
        loading: false,
        // 组织类型
        orgType: '01',
        processType: 'scaTitleUpdateProcess',
        taskId: undefined,
        taskKey: undefined,
        planModel: {
          orgUnitId: '',
          posTitleId: '',
          scaUpperLimit: '',
          scaLowerLimit: '',
          effectiveDate: '',
          // 失效日期
          uneffectiveDate: '9999-12-31',
          // 编制调整原因
          remark: '',
          // 选择的组织
          selectedOrgUnit: {}
        }
      }
    },
    computed: {
      showCommonCondition () {
        if (this.planModel.adjustBefore) {
          let dailySales = this.planModel.adjustBefore.dailySales
          let type = (this.orgType === '02' || this.orgType === '03')
          return type && !!dailySales && dailySales !== '0' && dailySales !== '0.00'
        }
        return false
      }
    },
    created () {
      let taskId = this.$route.query.taskId
      if (taskId && taskId !== 'undefined' && taskId !== 'null') {
        this.taskId = taskId
      }
      this.$route.query.taskKey ? this.taskKey = this.$route.query.taskKey : ''
    },
    methods: {
      // 处理上传的数据
      postFlow () {
        for (let key in this.planModel.selectedOrgUnit) {
          if (this.planModel.selectedOrgUnit.hasOwnProperty(key) && !(key === 'orgUnitId' || key === 'orgUnitName')) {
            delete this.planModel.selectedOrgUnit[key]
          }
        }
        // 失效日期没选默认9999-12-31
        this.planModel.uneffectiveDate === null || this.planModel.uneffectiveDate === '' ? this.planModel.uneffectiveDate = '9999-12-31' : ''
        return this.planModel
      },
      // 流程提交错误
      FlowErr () {
        // this.planModel.uneffectiveDate = null
      },
      // 检查组织类型
      orgChange (orgUnitId) {
        req('getOrgType', {orgUnitId}).then(res => {
          this.orgType = res
        })
      },
      // 由base-info组件emit的loading状态
      loadingChange (loading) {
        this.loading = loading
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
