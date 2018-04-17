<template>
  <div class="plan-layout .font-size-small mb10">

    <section class="basic-information mb10">
      <h3 v-if="allDetail['schemeName']">
        方案名称： {{ allDetail['schemeName'] }}
      </h3>

      <h3 v-if="allDetail['planEmployeeStatus']">
        状态： {{ allDetail['planEmployeeStatus'] | statusFormat}}
      </h3>

      <h3>
        直接上级：
        <span
          :class="selectLeaderClassName ? ['selectable', 'blue'] : ''"
          @click="selectPerson">
          {{ allDetail['leader'] | emptyFormat }}
        </span>
      </h3>

      <h3 v-if="allDetail['period']">
        阶段： {{ allDetail['period'] | periodFormat }}
      </h3>

      <h3 v-if="allDetail['employeeName']">
        员工姓名： {{ allDetail['employeeName'] }}
      </h3>

      <h3 v-if="allDetail['employeeCode']">
        工号： {{ allDetail['employeeCode'] }}
      </h3>

      <span v-if="allDetail['isOperatePermission'] !== 'N'">
        <slot name="not-need-validate-buttons"></slot>

        <slot name="need-validate-buttons"></slot>
      </span>

      <slot name="diff"></slot>

    </section>
    <section class="performance-plan">

      <month-tab
        :periods="allDetail.periods"
        @toggled="getPeriodPlan"
        :current-period="allDetail.period">
      </month-tab>

      <el-collapse v-model="activeNames">
        <el-collapse-item
          title="KPI绩效"
          v-if="allDetail.isShowKpi === 'Y'"
          name="kpi">
          <slot name="kpi-table"></slot>
        </el-collapse-item>

        <el-collapse-item
          title="重点工作"
          v-if="allDetail.isShowKeyWork === 'Y'"
          name="key-work">
          <slot name="work-table"></slot>
        </el-collapse-item>

        <el-collapse-item
          title="关键事件"
          v-if="allDetail.isShowEvent === 'Y'"
          name="key-event">
          <slot name="event-table"></slot>
        </el-collapse-item>

        <el-collapse-item title="审批记录" name="record">
          <slot name="approval-table"></slot>
        </el-collapse-item>
      </el-collapse>

    </section>

    <i-personnel-select
      v-if="personSelectShow"
      :isShow.sync="personSelectShow"
      :multiple="false"
      @confirm="handleConfirm">
    </i-personnel-select>

  </div>
</template>

<script>
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import { planEmployeeStatusDict, periodDict } from '@/config/dict'
import MonthTab from 'components/performance/month-tab'

export default {
  name: 'PlanLayout',

  props: ['allDetail'],

  data () {
    return {
      personSelectShow: false,
      activeNames: ['kpi']
    }
  },

  components: {
    iPersonnelSelect,
    MonthTab
  },

  computed: {
    selectLeaderClassName () {
      // :class="[allDetail.isOperatePermission !== 'N' &&
      //       (allDetail.processStatus === '011' ||
      //       allDetail.processStatus === '01')
      //         ? ['selectable', 'blue']
      //         : '']"
      if (this.allDetail.isOperatePermission !== 'N') {
        if (this.allDetail.processStatus === '011' || this.allDetail.processStatus === '01') {
          return true
        } else if (this.allDetail.processStatus === '06') {
          return true
        }
      } else {
        return false
      }
    }
  },

  methods: {
    handleConfirm (selected) {
      if (selected.length === 1) {
        this.allDetail.leader = selected[0]['employeeName']
        this.allDetail.leaderId = selected[0]['employeeId']
      } else {
        this.$message({
          message: '领导只能选择一个',
          type: 'warning',
          duration: 1000
        })
        return
      }
    },

    selectPerson () {
      // if (this.allDetail.isOperatePermission !== 'N' &&
      //     (this.allDetail.processStatus === '011' ||
      //     this.allDetail.processStatus === '01') ) {
      //   this.personSelectShow = true
      // }
      this.selectLeaderClassName && (this.personSelectShow = true)
    },

    // 切换月份
    getPeriodPlan (val) {
      this.$store.commit({
        type: 'PER_SET_TOGGLEDPERIOD',
        period: val.period
      })
      this.$router.replace(`/performance/${this.$route.params.planId}/plan_detail`)
    }
  },

  filters: {
    statusFormat (val) {
      for (let dict of planEmployeeStatusDict) {
        if (dict['value'] === val) {
          return dict['label']
        }
      }
      return ''
    },

    periodFormat (val) {
      for (let dict of periodDict) {
        if (dict['value'] === val) {
          return dict['label']
        }
      }
      return ''
    },

    emptyFormat (val) {
      if (!val) {
        return '请设置'
      } else {
        return val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .plan-layout {

    h3 {
      font-weight: bold;
      font-size: 1.17em;
      line-height: 28px;
      height: 28px;
    }

    .basic-information {
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      align-items: center;
    }

    .performance-plan {
      display: flex;
      justify-content: center;
      flex-flow: column nowrap;
    }

    .selectable {
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
