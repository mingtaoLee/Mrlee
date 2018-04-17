<template>
  <div class="level" ref="pie">
    <div id="main" style="width: 852px;height: 400px">
    </div>
    <i-layout headerKey="pfmResultAnalysisListGet">
      <!--<div slot="header">-->
      <!--<i-form @reset="reset" @search="search">-->
      <!--<el-form-item label="方案名称">-->
      <!--<el-input v-model="param.keyword"></el-input>-->
      <!--</el-form-item>-->
      <!--</i-form>-->
      <!--</div>-->
      <div slot="section">
        <div class="table">
          <i-table :table="table" @pageSizeChange="handleSizeChange"
                   @pageIndexChange="handleCurrentChange">
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="table.data"
                style="width: 100%"
                border
                ref="multipleTable"
                @selection-change="handleSelectionChange">
                <el-table-column prop="employeeCode" label="工号" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="employeeName" label="姓名" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="orgName" label="组织" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="schemeName" label="方案名称" show-overflow-tooltip align="left" sortable>
                </el-table-column>
                <el-table-column prop="period" label="阶段" align="center" sortable>
                  <template slot-scope="scope">
                    {{periodTyper(scope.row.period)}}
                  </template>
                </el-table-column>
                <el-table-column prop="level" label="等级" align="center" sortable>
                </el-table-column>
                <el-table-column prop="totalScore" label="分数" show-overflow-tooltip align="center"></el-table-column>
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-layout>
  </div>
</template>
<script>
  import req from 'api/performance/analyze'
  import ILayout from 'components/common/i-layout'
  // 查询组件
  import IForm from 'components/common/i-form/i-form.vue'
  import ITable from 'components/common/i-table'
  import { periodDict } from 'config/dict'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import { findDictLabel } from 'utils/index'

  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts')
  // 引入柱状图
  require('echarts/lib/chart/pie')
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip')

  export default {
    name: 'schemeId',
    props: ['schemeId', 'period'],
    data () {
      return {
        table: {
          data: [],
          info: null,
          search: null,
          total: 0, //  后台获取到的total个数
          showPagebar: true
        },
        periodDict: periodDict, // 搜索状态
        // 查询条件
        param: {
          keyword: ''
        },
        pieData: [],
        schemeId: '',
        level: '',
        period: '',
        scrollTop: 0,
        myChart: null
      }
    },
    components: {
      IForm,
      ITable,
      ILayout,
      IDialog
    },
    created () {
      this.percentPie()
    },
    mounted () {
//      console.dir(this.$refs.pie.offsetParent)
//      this.$refs.pie.offsetParent.children[1].onscroll = () => {
//        this.scrollTop = this.$refs.pie.offsetParent.children[1].scrollTop
//      }
      this.search()
      this.myChart = echarts.init(document.getElementById('main'))
      this.myChart.on('click', (params) => {
        // 控制台打印数据的名称
        if (params.data.flag === '-1') {
          params.data.name = '-1'
        }
        this.level = params.data.name
        // this.oneLevelGetDetail(this.schemeId, this.period, params.data.name,this.)
        this.search()
      })
      this.myChart.showLoading()
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: '关闭',
          1: '启用'
        }
        return statusMap[status]
      }
    },
    methods: {
      reset () {
        // 在这里写重置逻辑
        this.param = {
          keyword: ''
        }
        this.oneLevelGetDetail(this.schemeId, this.period, this.level, this.table.info)
      },
      // 搜索按钮
      search (val) {
//        this.getLevelList()
        this.table.search = {...this.param}
      },
      // 当分页器页码变动时调用
      handleCurrentChange (opt) {
        this.oneLevelGetDetail(this.schemeId, this.period, this.level, opt)
      },
      // 分页器每页显示几个
      handleSizeChange (opt) {
        this.oneLevelGetDetail(this.schemeId, this.period, this.level, opt)
      },
      // 字典转换
      periodTyper (val) {
        return findDictLabel(periodDict, val)
      },
      // 获取绩效等级列表
      percentPie () {
        req('percentPie', {
          schemeId: this.schemeId,
          period: this.period
        }).then((data) => {
          this.myChart.hideLoading()
          let newData = []
          data.forEach((val, index) => {
            newData.push({
              value: val.num,
              name: val.level ? val.level : '',
              flag: val.level ? '' : '-1'
            })
          })
          this.myChart.setOption({
            backgroundColor: '#2c343c',
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                return `点击可更新列表`
              }
            },
            series: [
              {
                name: '详细数据',
                type: 'pie',
                radius: '70%',
                label: {
                  normal: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    // shadowBlur:3,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                    // shadowColor: '#999',
                    // padding: [0, 7],
                    rich: {
                      a: {
                        color: '#999',
                        lineHeight: 22,
                        align: 'center'
                      },
                      // abg: {
                      //     backgroundColor: '#333',
                      //     width: '100%',
                      //     align: 'right',
                      //     height: 22,
                      //     borderRadius: [4, 4, 0, 0]
                      // },
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
//          this.pieData = data
//          let that = this
//          let list = []
//          let currentC
//          let start = 0
//          let end = 0
//          let nums = data.map(val => val.percent)
//          let level = data.map(val => val.level)
//          let level = data.map(val => val.level)
//          let colors = ['#983335', '#77963f', '#5d437c', '#35859f', '#d1702f', '#365e96']
//          let offseLsft = this.$refs.pie.offsetParent.offsetLeft
//          let Cricle = function (schemeId, period, level) {
//            this.schemeId = schemeId
//            this.period = period
//            this.level = level
//            this.isCurrent = false
//            this.drawC = function (ctx, x, y, i) {
//              ctx.save()
//              ctx.beginPath()
//              end += nums[i] / 50 * Math.PI// 终止角度
//              ctx.strokeStyle = 'white'
//              ctx.moveTo(0, 0)
//              ctx.arc(0, 0, 200, start, end)
//              if ((x && y && ctx.isPointInPath(x, y) && !currentC) || this.isCurrent) {
//                ctx.fillStyle = '#ffdf2a'
//                currentC = this
//                this.isCurrent = true
//                ctx.closePath()
//                ctx.stroke()
//                that.oneLevelGetDetail(schemeId, period, level)
//                that.level = level
//                start += nums[i] / 50 * Math.PI// 起始角度
//              } else {
//                ctx.fillStyle = colors[i]
//                ctx.closePath()
//                ctx.stroke()
//                start += nums[i] / 50 * Math.PI// 起始角度
//              }
//              ctx.fill()
//            }
//            this.drawT = function (ctx, x, y, i) {
//              start = nums[i] / 50 * Math.PI / 2
//              ctx.rotate(end + start)// 旋转数值
//              ctx.font = '18px scans-serif'
//              ctx.fillStyle = '#000'
//              ctx.fillText(that.pieData[i].percent + '%', 70, 0)
//              ctx.font = '25px scans-serif'
//              ctx.fillText(that.pieData[i].level === '其他' ? that.pieData[i].level === '其他' : '等级' + that.pieData[i].level, 140, 0)
//              ctx.font = '16px scans-serif'
//              ctx.fillText(that.pieData[i].num + '人', 20, 0)
//              ctx.fillText(that.pieData[i].period, 140, 0)
//              end = nums[i] / 50 * Math.PI / 2
//            }
//          }
//
//          function draw () {
//            let canvas = document.getElementById('tutorial')
//            if (canvas.getContext) {
//              let ctx = canvas.getContext('2d')
//              ctx.translate(400, 200)
//              for (let i = 0; i < nums.length; i++) {
//                let c = new Cricle(that.schemeId, that.period, level[i])
//                c.drawC(ctx, '', '', i)
//                list.push(c)
//              }
//              for (var i = 0; i < nums.length; i++) {
//                list[i].drawT(ctx, '', '', i)
//              }
//            }
//          }
//
//          function reDraw (e) {
//            e = e || event
//            let canvas = document.getElementById('tutorial')
//            let x = e.clientX - canvas.offsetLeft - offseLsft
//            let y = e.clientY - canvas.offsetTop + that.scrollTop - 20 // 这里的20是因为无法通过方法获取到i-dialog到页面顶部的距离，所以我写死了
//            if (canvas.getContext) {
//              let ctx = canvas.getContext('2d')
//              for (let i = 0; i < list.length; i++) {
//                let c = list[i]
//                c.drawC(ctx, x, y, i)
//              }
//              for (var i = 0; i < nums.length; i++) {
//                list[i].drawT(ctx, '', '', i)
//              }
//            }
//          }
//
//          let canvas = document.getElementById('tutorial')
//          draw()
//          canvas.onmousedown = function (e) {
//            e = e || event
//            if (currentC) {
//              currentC.isCurrent = false
//            }
//            currentC = null
//            reDraw(e)
//          }
//          console.log(list)
        }).catch((err) => {
          console.log(err)
        })
      },
      // 查看等级列表
      oneLevelGetDetail (schemeId, period, level, opt) {
        console.log(level)
        if (schemeId) {
          req('planList', {
            schemeId,
            period,
            level,
            ...opt
          }).then((res) => {
            // this.table.data = data
            // this.table.total = total
            // this.table.info.totalPage = Math.ceil(total / this.param.pageSize)
            Object.assign(this.table, res)
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .level {
    .pointer {
      cursor: pointer;
    }
  }
</style>

