<template>
  <div class="plan-status-container">
    <div class="status-left">
      <div class="plan-status-item">
        <span class="label">评估状态:</span>
        <span class="value">{{initData.projectStatus | statusFormat}}</span>
      </div>
      <div class="plan-status-item">
        <span class="label">起止时间:</span>
        <span class="value">{{initData.beginDate | dateFormat}}-{{initData.endDate | dateFormat}}</span>
      </div>
    </div>

    <div class="status-right">
      <div class="status-info">
        <div class="plan-status-item">
          <span class="label">未完成评估:</span>
          <span class="value">{{initData.unFinishedNum}}</span>
        </div>
        <div class="plan-status-item">
          <span class="label">完成评估:</span>
          <span class="value">{{initData.finishedNum}}</span>
        </div>
        <div class="plan-status-item">
          <span class="label">总人数:</span>
          <span class="value">{{initData.totalNum}}</span>
        </div>
      </div>
      <div class="rank" v-if="Number(status) > 3">
        <div 
          class="plan-status-item" 
          v-for="(rank,index) in initData.statistics" 
          :key="index" 
          @click="handleRankClick"
          v-if="rank.levelName !== '-1'"
        >
          <span class="label" >{{rank.levelName}}人数:</span>
          <span class="value">{{rank.num}}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- </div> -->
</template>
<script>
import {periodStatusDict} from '@/config/dict'
import {findDictLabel} from 'utils/index'
import moment from 'moment'
export default {
  name: 'planStatus',
  props: {
    status: {
      required: true
    },
    initData: {
      required: true,
      type: Object
    }
  },
  methods: {
    handleRankClick () {
      this.$emit('rankClick')
    }
  },
  filters: {
    statusFormat (val) {
      return findDictLabel(periodStatusDict, val)
    },
    dateFormat (val) {
      if (!val) return ''
      return moment(val).format('YYYY-MM-DD')
    }
  }
}
</script>
<style lang="scss" scoped>
.plan-status-container {
  display: flex;
  .status-right {
    border-left: 1px solid #ececec;
    margin-left: 40px;
    padding-left: 40px;
    .rank {
      display: flex;
    }
    .plan-status-item {
      margin-right: 40px;
    }
    .status-info {
      display: flex;
    }
  }
}
.plan-status-item {
  margin-bottom: 10px;
  cursor: pointer;
  .label {
    font-weight: 500;
    font-size: 14px;
  }
  .value {
    font-size: 14px;
  }
}
</style>
