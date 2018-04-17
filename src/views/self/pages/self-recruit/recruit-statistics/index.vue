<template>
  <i-layout headerKey="rctStatisticsSelfGet">
    <div slot="header">
      <i-form @reset="reset" @search="search">
        <el-form-item label="开始时间">
            <el-date-picker
              v-model="param.beginDate"
              type="date"
              value-format="yyyy-MM-dd"
              @change="val => (this.param.beginDate = val)"
              :picker-options="dateStartPickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="param.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              @change="val => (this.param.endDate = val)"
              :picker-options="dateEndPickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="招聘岗位" prop="applyPosition">
            <el-input
              v-model.trim="param.applyPosition"
              @focus="departmentNodeClick"
              :disabled="editable"
              placeholder="请选择"
            ></el-input>
        </el-form-item>
      </i-form>
      <position-selection
        type="mini"
        v-model="positionSelectDialogFlag"
        @change="selectPositionConfirm">
      </position-selection>
    </div>
    <div slot="section">
      <!-- <div class="resumeNum">
        <div class="content">
          <p class="title">已发布岗位数</p>
          <p class="num">{{resumeNumber}}</p>
        </div>
      </div> -->
      <div v-if="showCanvas" class="pie" ref="pie">
        <div id="main">

        </div>
      </div>
      <div v-else class="no-canvas">
        <i-svg-icon iconName="jixiaokong" :styleName="iconStyle"/>
        <p>暂无数据</p>
      </div>
    </div>
  </i-layout>
</template>
<script type="text/javascript">
import ISvgIcon from 'components/common/i-svg-icon'
import req from 'api/recruit'
import PositionSelection from 'components/position/position-selection'
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/pie')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
import { globalComponentVariable } from 'config/globalComponentVariable'
import { getSelectData } from 'utils/index.js'
export default {
  name: 'Statistics',
  components: {
    PositionSelection,
    ISvgIcon
  },
  data () {
    return {
      param: {
        beginDate: '',
        endDate: '',
        positionName: ''
      },
      positionSelectDialogFlag: false,
      scrollTop: 0,
      myChart: null,
      stopWatch: '',
      resumeNumber: 0,
      showCanvas: true,
      iconStyle: {
        'width': '200px',
        'height': '100px'
      },
      // 开始时间参数
      dateStartPickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.parse(this.param.endDate) - 3600 * 1000 * 24
        }
      },
      // 结束时间参数
      dateEndPickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.parse(this.param.beginDate)
        }
      }
    }
  },
  created () {
    this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('RESUME_STATUS'))
  },
  mounted () {
    this.myChart = echarts.init(document.getElementById('main'))
    this.myChart.showLoading()
    // this.getStatisticsData()
  },
  methods: {
    // 码表的查询
    stopWatchInquiry (url) {
      getSelectData(url, true).then(res => {
        // console.log(res)
        this.stopWatch = res
        this.getStatisticsData()
      })
    },
    // 显示职位弹窗
    departmentNodeClick (selected) {
      this.positionSelectDialogFlag = true
    },
    // 选择职位
    selectPositionConfirm (selected) {
      this.param.applyPositionId = selected.posPositionId
      this.param.applyPosition = selected.name
      this.positionSelectDialogFlag = false
    },
    getStatisticsData () {
      req('statisticsData', {
        ...this.param,
        positionName: this.param.positionName.toString()
      }).then((res) => {
        console.log(res.data.length)
        if (res.data.length === 0) {
          console.log(1)
          this.showCanvas = false
        }
        console.log('11111', this.stopWatch)
        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < this.stopWatch.length; j++) {
            if (res.data[i].resumeStatus === this.stopWatch[j].value) {
              res.data[i].resumeStatus = this.stopWatch[j].label
            }
          }
        }
        this.resumeNumber = res.requirementNum
        let data = res.data
        let pieDate = []
        data.forEach((val, index) => {
          pieDate.push({
            value: val.num,
            name: val.resumeStatus ? val.resumeStatus : '',
            flag: val.resumeStatus ? '' : '-1'
          })
        })
        console.log(22222, pieDate)
        this.percentPieTest(pieDate)
      }).catch((err) => {
        console.log(err)
      })
    },
    percentPieTest (arr) {
      this.myChart.hideLoading()
      let newData = []
      newData = arr
      let newArr = []
      for (let i = 0; i < arr.length; i++) {
        newArr.push(arr[i].name)
      }
      this.myChart.setOption({
        title: {
          text: '招聘数据统计',
          subtext: '发布岗位数： ' + this.resumeNumber,
          x: 'center'
        },
        backgroundColor: '#2c343c',
        legend: {
          orient: 'vertical',
          x: '11%',
          // left: 'left',
          data: newArr
        },
        // tooltip: {
        //   trigger: 'item',
        //   formatter: function (params) {
        //     return `点击可更新列表`
        //   }
        // },
        series: [
          {
            name: '详细数据',
            type: 'pie',
            radius: '70%',
            center: ['50%', '60%'],
            label: {
              normal: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#fff',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: newData
          }
        ]
      })
    },
    reset () {
      this.param = {
        beginDate: '',
        endDate: '',
        positionName: ''
      }
      this.getStatisticsData()
    },
    search () {
      this.getStatisticsData()
    }
  }
}
</script>
<style type="text/css" scoped>
  #main {
    width: 100%;
    height: 500px;
    background-color: #fff!important;
  }
  .resumeNum {
    position: relative;
    top: 55px;
    right: -700px;
    height: 100px;
    width: 200px;
  }
  .title {
      font-size: 20px;
    }
  .num {
      margin:10px 0 0 40px;
      font-size: 20px;
      font-weight: bold;
    }
    .no-canvas {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      color: #999;
    }
</style>
