<template>
  <section class="evaluate-info-container">
    <header
      class="al font-size-medium bold pl10 line-below">
      {{isKeywork ? indicator.keyWorkName : indicator.indicatorName}}
    </header>

    <table class="table mt10">
      <tr>
        <td>
          <span>指标权重:</span>
          <span class="blue"> &nbsp;{{indicator.weight}}%</span>
        </td>
        <td>
          <span>评估类型:</span>
          <span> &nbsp;{{indicator.evaluationType | evaluationType}}</span>
        </td>
        <td>
          <span>评估方法:</span>
          <span> &nbsp;{{indicator.evaluationMethod | evaluationMethod}}</span>
        </td>
      </tr>
      <tr v-if="indicator.evaluationType && indicator.evaluationType === '2'">
        <td>
          <span style="vertical-align:middle;">收集人:</span>
          <span class="text-content"> {{indicator.collectorName}}</span>
        </td>
        <td>
          <span style="vertical-align:middle;">收集负责人:</span>
          <span class="text-content">{{indicator.collectManagerName}}</span>
        </td>
        <td>
          <span>目标值:</span>
          <span class="text-content">{{indicator.target}}</span>
        </td>
        <td>
            <span>达成值:</span>
            <span class="text-content">{{ indicator.selfEvaluationScore }}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span>评估人:</span>
          <span v-for="(leader, index) in indicator.evaluationLeaders" :key="index">
             &nbsp;{{leader.leaderName}}
          </span>
        </td>
      </tr>
      <tr class="fourth-row" v-if="isKeywork">
        <td>
          <span>达成目标:</span>
          <!-- <ol>
            <li
              v-for="(target, index) in indicator.target.split(/(\d\.)|(\d\、)/)"
              :key="index"
              v-if="index > 0 && index % 3 === 0">
              {{ target }}
            </li>
          </ol> -->
          <span>
             &nbsp;{{ indicator.target }}
          </span>
        </td>
      </tr>
      <tr class="evaluate-info-item evaluate-info-textarea" v-if="!isKeywork">
        <td>
          <span>指标说明:</span>
          <span class='info_content'> &nbsp;{{indicator.description}}</span>
        </td>
      </tr>
      <tr class="evaluate-info-item evaluate-info-textarea" v-if="!isKeywork">
        <td>
          <span>评价标准:</span>
          <span class='info_content'> &nbsp;{{indicator.standard}}</span>
        </td>
      </tr>
    </table>
  </section>
</template>
<script>
export default {
  name: 'kpi-evaluate-info',
  props: {
    indicator: {
      type: Object
    },
    isKeywork: {
      type: Boolean
    }
  },

  filters: {
    evaluationType (val) {
      let dict = {
        '1': '评估打分',
        '2': '收集数据'
      }
      return dict[val]
    },

    evaluationMethod (val) {
      let dict = {
        '1': '选择评估方法',
        '2': '输入评估方法'
      }
      return dict[val]
    }
  },

  created () {
    this.reachVal = Math.ceil((this.indicator.selfEvaluationScore * this.indicator.target) / 100) + '%'
    console.log(this.indicator.selfEvaluationScore)
    console.log(this.indicator.target)
    console.log(this.reachVal)
  },

  data () {
    return {
      reachVal: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.evaluate-info-container {

  tr {
    display: block;
    margin-top: 10px;

    &::last-child {
      margin-bottom: 10px;
    }
  }

  .line-below {
    border-bottom: 1px solid #DFE6EC;
  }

  .table {
    width: 550px;

    td {
      text-align: left;
      padding-left: 10px;

      & + td {
        padding-left: 30px;
      }
    }
  }
}
.info_content {
  width: 100%;
  overflow:hidden; 
  text-overflow:ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.text-content {
  display: inline-block;
  vertical-align: middle;
  width: 55px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
