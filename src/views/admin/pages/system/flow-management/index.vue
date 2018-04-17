<template>
  <div class="flow-management">
    <section>
      <div id="myChart" :style="{width: '1200px', height: '600px'}"></div>
    </section>
  </div>
</template>

<script>
  import ITable from 'components/common/i-table'
  import echarts from 'echarts'
  import req from 'api/system/flow-managent'
  
  export default {
    props: {
      flowPhoto: {
        type: Object,
        default: () => { return {} }
      }
    },
    async created () {
      await this.getDraw('empRenewContractProcess:4:302618')
      this.drawLine()
    },
    data () {
      return {
        /* eslint-disable */
        // data: {
        links: null,
        items: null,
        linkData: null,
        data: null,
        'pools': [],
        'lanes': []
      }

    },
    components: {
      ITable
    },
    computed: {
      linkGraph () {
        let links = []
      },
      lineLinks () {
        let links = []
        this.links && this.links.map(key => {
          key.xPointArray.map((co, idx) => {
            links.push([co, key.yPointArray[idx]])
          })
        })
        return links
      }
    },
    mounted () {
      this.drawLine()
    },
    methods: {
      getDraw (processDefinitionId) {
        return req('getDiagram', {processDefinitionId})
        .then(data => {
          this.items = data.activities
          this.links = data.sequenceFlows
          this.linkData = this.getlinkData()
          this.data = this.getData()
        })
      },

      getlinkData () {
        let links = []
        this.links && this.links.map(key => {
          let node = []
          let len = key.xPointArray.length
          if (len === 2) {
            key.xPointArray.map((co, idx) => {
              node.push({x: co, y: key.yPointArray[idx]})
            })
            links.push(node)
          } else {
            key.xPointArray.map((co, idx) => {
              idx % 2 === 1 && key.xPointArray.splice(idx, 0, co) && key.yPointArray.splice(idx, 0, key.yPointArray[idx])
            })

            let point = []
            key.xPointArray.map((co, idx) => {
              point.length < 2 && point.push({x: co, y: key.yPointArray[idx]})
              if (point.length === 2) {
                links.push(point)
                point = []
              }
            })
          }
        })
        console.log(links)
        return links
      },
      getData () {
        let data = []
        this.items && this.items.map(key => {
          data.push({
            x: key.x,
            y: key.y,
            width: key.width,
            height: key.height,
            name: key.properties.name
          })
        })
        console.log(data)
        return data
      },
      drawLine () {
        let myChart = echarts.init(document.getElementById('myChart'))
        myChart.on('click', params => {
          console.log(params)
        })
        myChart.setOption({
          backgroundColor: this.flowPhoto.background || '#fff',
          title: {
            text: '流程关系图'
          },
          grid: {
            left: 0,
            bottom: 0
          },
          tooltip: {},
          xAxis: {
            type: 'value',
            boundaryGap: false,
            max: '1200'
          },
          yAxis: {
            type: 'value',
            max: '600'
          },
          series: [
            {
              type: 'graph',
              coordinateSystem: 'cartesian2d',
              smooth: true,
              draggable: true,
              label: {
                normal: {
                  show: true
                }
              },
              data: this.data,
              markPoint: {
                symbol: 'circle',
                symbolOffset: ['50%', '50%'],
                symbolSize: (value, param) => [param.data.width, param.data.height],
                data: this.data
              },
              markLine: {
                data: this.linkData,
                symbol: ['circle', 'arrow'],
                symbolSize: 0,
                animation: false
                // animationDelay: function (idx) {
                //   console.log(idx)
                //   return idx * 1000
                // }
              },
              lineStyle: {
                normal: {
                  opacity: 0.9,
                  width: 2,
                  curveness: 0
                }
              }
            }
          ]
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
