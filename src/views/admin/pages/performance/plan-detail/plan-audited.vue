<template>

  <div class="container" v-if="allDetail">

    <progress-bar
      :plan-status="allDetail.planProgressStatus"
      :all-status="allDetail.allStatus">
    </progress-bar>

    <plan-layout
      :all-detail.sync="allDetail">

      <kpi-table
        slot="kpi-table"
        :all-detail.sync="allDetail"
        :can-operate="false">
      </kpi-table>

      <keywork-table
        slot="work-table"
        :all-detail.sync="allDetail"
        :can-operate="false">
      </keywork-table>

      <approval-table
        slot="approval-table"
        :record="record">
      </approval-table>

    </plan-layout>
  </div>
</template>

<script>
import reqMixin from './mixin-request'
import compsMixin from './mixin-components'
import lifecycleMixin from './mixin-lifecycle'
export default {

  mixins: [reqMixin, compsMixin, lifecycleMixin]

}
</script>
