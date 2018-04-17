<template>
  <div>
    <el-button type="text"
    v-if="renderStatus.c && isCalculateByChildren !== 'Y' && accessMap['pfmPlanDetailGet']"
    @click="goPlanDetail"
    >查看计划</el-button>
    <el-button type="text"
    v-if="renderStatus.k && schemeStatus === '1' && Number(row.processStatus <= 3) && isCalculateByChildren !== 'Y' && accessMap['pfmPlanCheckRalationPost']"
    @click="showDialog = true">考核关系</el-button>
    <el-button
    type="text"
    v-if="renderStatus.l && schemeStatus === '1' && accessMap['pfmDealGradeComplaint']"
    @click="goCharge">处理申诉</el-button>
    <el-button
    type="text"
    v-if="renderStatus.d && schemeStatus === '1' && accessMap['pfmLevelAdjustGet']"
    @click="showAjustment">等级调整</el-button>

    <i-dialog title="考核关系" v-model="showDialog"  size="mini" destroyedWhenClose :modal="false">
      <table-assessment
      :row="row"
      @modifyAssessment="emitModify"
      :selected="tableAssessmentSelected"
      v-if="showDialog"
      @close="showDialog = fasle"></table-assessment>
    </i-dialog>
  </div>
</template>
<script>
import access from 'mixins/access'

import tableAssessment from './table-assessment.vue'
import iDialog from 'components/common/i-dialog/i-dialog.vue'
export default {
  props: [
    'rowStatus',
    'status',
    'row',
    'tableAssessmentSelected',
    'schemeStatus',
    'isCalculateByChildren'
  ],

  mixins: [access],

  data () {
    return {
      renderStatus: {
        c: false,
        k: false,
        l: false,
        d: false
      },
      showDialog: false
    }
  },
  methods: {
    goPlanDetail () {
//      this.$router.replace(`/performance/${this.row.planId}/plan_detail`)
      window.open(`/#/performance/${this.row.planId}/plan_detail`)
    },
    goCharge () {
      // this.$router.replace(`/performance/${this.row.planId}/plan_detail`)
      window.open(`/#/performance/${this.row.planId}/plan_detail`)
    },
    emitModify (val) {
      this.$emit('modifyAssessment', val)
    },
    showAjustment () {
      this.$emit('showAdjustment')
    },
    changeRenderStatus (status, rowStatus) {
      let result = {}
      result = {
        c: true,
        k: false,
        l: false,
        d: false
      }
      if (status === '0') {
        if (rowStatus === '00') {
          result = {
            c: false,
            k: false,
            l: false,
            d: false
          }
        }
      } else if (status === '4') {
        if (rowStatus === '09') {
          result = {
            c: true,
            k: false,
            l: false,
            d: true
          }
        }
      } else if (status === '1') {
        if (rowStatus === '00') {
          result = {
            c: true,
            k: true,
            l: false,
            d: false
          }
        } else if (rowStatus === '011' || rowStatus === '01' || rowStatus === '02' || rowStatus === '03') {
          result = {
            c: true,
            k: true,
            l: false,
            d: false
          }
        }
      } else if (status === '2') {
        if (rowStatus === '071') {
          result = {
            c: true,
            k: false,
            l: true,
            d: false
          }
        } else if ((Number(rowStatus) > 0 && Number(rowStatus) < 9) || (rowStatus === '041' || rowStatus === '011')) {
          result = {
            c: true,
            k: false,
            l: false,
            d: false
          }
        }
      }
      this.renderStatus = result
    }
  },
  created () {
    this.changeRenderStatus(this.status, this.rowStatus)
  },
  components: {
    tableAssessment,
    iDialog
  },
  watch: {
    status (val) {
      this.changeRenderStatus(val, this.rowStatus)
    },
    rowStatus (val) {
      this.changeRenderStatus(this.status, val)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
