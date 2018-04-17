<template>
  <i-layout headerKey="rctStatisticsSelfGet">
    <div slot="section">
      <div class="pie" ref="pie">
        <div id="main">

        </div>
      </div>
    </div>
    <div v-show="tryShow" slot="header">
      22222222222222222222222222222222222222
    </div>
  </i-layout>
</template>
<script type="text/javascript">
// 引入 ECharts 主模块
// var echarts = require('echarts')
var echarts = require('echarts/lib/echarts')
// this.Vue.use(echarts)
// 引入柱状图
require('echarts/lib/chart/funnel')
//   // 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
import req from 'api/recruit'
export default {
  name: 'Statistics',
  data () {
    return {
      myChart: null,
      num: 60,
      data: [
             {value: 0, name: '收到的简历（）', itemStyle: {normal: {color: '#ff7f7e'}}},
             {value: 40, name: '面试数', itemStyle: {normal: {color: '#ffb868'}}},
             {value: 60, name: '到岗数', itemStyle: {normal: {color: '#4dabf5'}}}
      ],
      tryShow: false
    }
  },
  mounted () {
    this.myChart = echarts.init(document.getElementById('main'))
    this.myChart.showLoading()
    this.init()
    let _this = this
    this.myChart.on('click', function (params) {
      console.log(params.name)
      if (params.name === '面试数') {
        console.log(1)
        _this.tryShow = true
        console.log(_this.tryShow)
      }
    })
  },
  methods: {
    init () {
      req('statisticsData').then(res => {
        console.log(res)
        this.data[0].name = res.hireDetail.description + '(' + res.hireDetail.resumeNum + ')'
        this.data[1].name = res.interviewDetail.description + '(' + res.interviewDetail.resumeNum + ')'
        this.data[2].name = res.totalDetail.description + '(' + res.totalDetail.resumeNum + ')'
        this.data[0].value = res.hireDetail.percent
        this.data[1].value = res.interviewDetail.percent
        this.data[2].value = res.totalDetail.percent
        // console.log(this.data[0].name)
        this.percentPieTest()
      })
    },
    percentPieTest (arr) {
      this.myChart.hideLoading()
      this.myChart.setOption({
        title: {
          text: '招聘数据统计分析'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        // toolbox: {
        //   feature: {
        //     dataView: {readOnly: false},
        //     restore: {},
        //     saveAsImage: {}
        //   }
        // },
        legend: {
          data: [this.data[0].name, this.data[1].name, this.data[2].name],
          height: '10px'
        },
        calculable: true,
        series: [
          {
            name: '招聘数据统计',
            type: 'funnel',
            left: '20%',
            top: 100,
            // x2: 80,
            bottom: 60,
            width: '50%',
            // height: '100%',
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                textStyle: {
                  fontSize: 20
                }
              }
            },
            labelLine: {
              normal: {
                length: 50,
                lineStyle: {
                  width: 1,
                  type: 'solid'
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1
              }
            },
            data: this.data
          }
        ]
      })
    }
  }
}
</script>
<style type="text/css" scoped>
  #main {
    /* width: 100%; */
    height: 500px;
    background-color: #fff!important;
  }

</style>
