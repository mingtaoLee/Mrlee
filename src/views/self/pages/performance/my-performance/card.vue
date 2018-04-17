<template>
  <div class="card" :class="{ disabled:itemData.isCalculateByChidren === 'Y' ? true : false }">
    <div :class="{title:title === '已结束' ? false : true,backgroundColor:title === '已生效' ? true : false}">
      <h3 :class="classObject" v-if="title  === '已结束' ? false : true">
        {{title}}
      </h3>
    </div>
    <ul class="detail">
      <li>{{itemData.schemeName}}</li>
      <li>{{monthFormatter(itemData.period)}}</li>
      <li>{{itemData.totalScore | ScoreFilter}}</li>
      <li>{{planEmployeeter(itemData.employeePlanStatus)}}
      <div class="tips">
        <span> {{planEmployeeStatusToDoter(itemData.employeePlanStatus)}}</span>
      </div>
      </li>
    </ul>
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
      return {
        isActive: true
      }
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
    width: 32%;
    // height: 112px;
    border: 1px solid #CCCCCC;
    cursor: pointer;
    float: left;
    margin: 5px;
    .title {
      position: absolute;
      text-align: center;
      color: #FFFFFF;
      line-height: 38.8px;
      top: 10px;
      right: -25px;
      width: 190px;
      height: 38.8px;
      background-color: #8ECBFF;
      // background-color: #FF8787;
      transform:rotate(30deg);
    }
    .backgroundColor {
      background-color: #FF8787;
    }
    .detail {
      width: 162px;
      margin: 19px 21px 19px 21px;
      font-family: 'PingFangSC-Regular';
      line-height: 25px;
      font-size: 13px;
      color: #333333;
      li:nth-of-type(1) {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 18px;
        color: #000000
      }
    }
    .tips {
      position: absolute;
      right: 15px;
      bottom: 21px;
      color: #999999;
      span {
        color: #3DA5FE;
      }
    }
  }
  .detail:after{
    content:'';
    clear: both;
    display: block;
  }
  .disabled {
    opacity: 0.5;
  }
</style>
