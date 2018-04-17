<template>
  <div class="card" :class="{ disabled:itemData.isCalculateByChidren === 'Y' ? true : false }">
    <div class="title">
      <h3 :class="classObject">
        {{title}}
      </h3>
    </div>
    <ul class="detail">
      <li>{{itemData.schemeName}}</li>
      <li>{{monthFormatter(itemData.period)}}</li>
      <li>{{itemData.totalScore | ScoreFilter}}</li>
      <li>{{planEmployeeter(itemData.employeePlanStatus)}}</li>
    </ul>
    <div class="tips">
      <span> {{planEmployeeStatusToDoter(itemData.employeePlanStatus)}}</span>
    </div>
  </div>

</template>
<script>
  import {
    periodDict,
    planEmployeeStatusDict,
    processStatusDict
  } from '@/config/dict'
  import { findDictLabel } from 'utils/index'

  export default {
    name: 'card',
    components: {},
    props: {
      itemData: {
        type: Object,
        default: function () {
          return {
            name: '永辉绩效方案A',
            month: '10',
            progress: '未获得绩效评分',
            progress2: '待制定计划'
          }
        }
      }
    },
    filters: {
      ScoreFilter (status) {
        if (status) {
          return status + '分'
        }
        return '未获得绩效评分'
      }
    },
    data () {
      return {}
    },
    methods: {
      monthFormatter (val) {
        return findDictLabel(periodDict, val)
      },
      planEmployeeter (val) {
        return findDictLabel(planEmployeeStatusDict, val)
      },
      planEmployeeStatusToDoter (val) {
        return findDictLabel(processStatusDict, val)
      }
    },
    computed: {
      title () {
        if (this.itemData.level && this.itemData.employeePlanStatus === '09') {
          return this.itemData.level
        } else {
          return this.planEmployeeter(this.itemData.employeePlanStatus)
        }
      },
      classObject: function () {
        return {
          'level-class': !(this.itemData.level === '' || this.itemData.level === null)
        }
      }
    }
  }

</script>
<style scoped lang="scss">
  .card {
    display: flex;
    position: relative;
    width: 275px;
    height: 107px;
    border: 1px solid #CCCCCC;
    cursor: pointer;
    &:nth-of-type(3n-1) {
      margin-left: 55px;
    }
    &:nth-of-type(3n) {
      margin-left: 55px;
    }

    .title {
      width: 55px;
      height: 81px;
      background-color: #F2F2F2;
      padding-top: 26px;
      padding-left: 15px;
      padding-right: 16px;
      line-height: 30px;
      text-align: center;
      h3 {
        font-size: 24px;
      }
      .level-class {
        font-size: 18px;
        line-height: 60px;
      }
    }
    .detail {
      width: 162px;
      padding: 2px 10px 5px 16px;
      font-family: 'PingFangSC Medium';
      line-height: 25px;
      font-size: 13px;
      color: #999999;
    }
    .tips {
      position: absolute;
      right: 15px;
      bottom: 5px;
      color: #999999;
      span {
        color: #4F869A;
      }
    }
  }

  .disabled {
    opacity: 0.5;
  }
</style>
