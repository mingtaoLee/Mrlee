<template>
  <div>
    <!-- 费用划拨 -->
    <i-process-flow
      @fillin="fillIn"
      processType="organizationRelevelFlow"
      :taskI="taskId"
      :taskKey="taskKey"
    >
      <div slot="allFlow">
        <div class="module">
          <h2>挂靠工时明细</h2>
        </div>
      </div>
    </i-process-flow>
  </div>
</template>
<script>
import IProcessFlow from 'components/common/i-process-flow'

export default {
  components: {
    IProcessFlow
  },
  data () {
    return {
      flowData: {
        creator: '12345',
        isHasOfficialDocument: 'N',
        processDefinitionId: '',
        partnerId: '8a8ea06a5faf744d015faf7dc1f90010',
        financeId: '8a8ea06a5faf744d015faf7dc1f90010',
        hrEmpId: '8a8ea06a5faf744d015faf7dc1f90010',
        operateType: '4'
      }
    }
  },
  methods: {
    postFlow () {
      return Object.assign({}, {orgUnitMaintains: this.basicData}, this.flowData)
    },
    fillIn (data) {

    }
  }
}
</script>
<style lang="scss" scoped>
  .module{
    min-width: 850px;
    border-bottom: 1px solid #e5e5e5;
    margin: 20px;
    h2{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      letter-spacing: 0;
      margin-bottom: 20px;
    }
  }
</style>
