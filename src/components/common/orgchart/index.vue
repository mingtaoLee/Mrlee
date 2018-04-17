<template>
  <div id="chart-container" @click="wrapClick" v-loading = "loading" :element-loading-text="$loadingText">
    <el-slider
      v-if="slider"
      class="chart-slider"
      v-model="depth"
      :step="1"
      vertical
      show-stops
      :max="sliderMaxNum"
      :min="1"
      height="200px"
      @change="handleSlider">
    </el-slider>
    <el-button
      v-if="accessMap.orgOrgsResetGet"
      type="primary"
      @click="centerChart"
      class="btn-recenter"
      >
      重置位置
    </el-button>
    <el-button
      v-if="accessMap.orgOrgsExportPicturePost"
      type="primary"
      @click="domToImage"
      class="btn-transfer"
      >
      导出图片
    </el-button>
  </div>
</template>

<script>
/**
 * orgchart.vue
 * @authors zhirong.liang@meicloud.com
*/

 // 递归查找 增加className
  // function addClass (data) {
  //   if (data.children) {
  //     data.children.forEach((item, index, arr) => {
  //       item.className = 'depth-' + item.z_index
  //       addClass(item)
  //     })
  //   }
  // }
  // 点击按钮生成详情dom与tooltip
  let secondMenuInit = (detail) => {
    return `
     <div class="second-menu">
       <div class="org-short-name">${detail.orgUnitName}</div>
       <div class="org-name">${detail.orgShortName}</div>
       <div class="org-info">
         <div class="info-item">上级组织：${detail.parentOrgName || '无'}</div>
         <div class="info-item">所在地区：${detail.belongAreaName}</div>
         <div class="info-item">组织类别：${detail.orgType || '无'}</div>
         <div class="info-item">包含下级组织数目：${detail.containOrgNum || 0}</div>
         <div class="info-item">包含人数：${detail.containEmpNum || 0}</div>
         <div class="info-item">部门负责人：${detail.orgLeader || '无'}</div>
       </div>
     </div>
     `
  }
  // 获取n层节点
  // let getAtlasData = async (nodeId, depth) => {
  //   return await req('atlasData', {
  //     id: nodeId,
  //     n: depth
  //   }).then(data => {
  //     // addClass(data)  // 每一层节点增加className，用于每层颜色区分需求
  //     return this.$store.dispatch('getAreas', data.belongArea)
  //     .then(areas => {
  //       if (areas.length) data.belongArea = areas.join('/')
  //       return data
  //     })
  //   }).catch(err => {
  //     throw (err)
  //   })
  // }
  let $ = require('jquery')
  import req from 'api/org/setting'
  import reqEmpTotal from 'api/org/tabs'
  import 'components/common/orgchart/jquery.orgchart.css'
  import 'components/common/orgchart/jquery.orgchart.js'
  import 'font-awesome/css/font-awesome.min.css'
  import access from 'mixins/access'
  import domtoimage from 'dom-to-image'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'org-chart',
    components: {
    },
    mixins: [access],
    props: {
      rootId: {
        type: String,
        default: '1'
      },
      slider: {
        type: Boolean,
        default: false
      },
      direction: {
        type: String,
        default: 'b2t'
      },
      ajaxUrls: {
        type: Object,
        required: true,
        default () {
          return {
            // children: 'http://10.16.85.135:80/api',
            children: 'http://10.16.72.89:9090/fanjq3@iHR/',
            root: 'atlasData',
            detail: 'orgDetail'
          }
        }
      }
    },
    data () {
      return {
        loading: false,
        sliderMaxNum: 3,
        depth: 3,   // 组织架构图显示的节点深度
        chartObj: null,  // orgChart的JQ对象
        orgData: {},  // ajax获取的数据
        secondMenuDom: null
        // ajaxUrl: 'http://10.16.72.89:9090/fanjq3@iHR/org/atlas/children/'  //用于懒加载children
      }
    },
    methods: {
      getAtlasData (nodeId, depth) {
        return req('atlasData', {
          id: nodeId,
          n: depth
        }).then(data => {
          return data
          // addClass(data)  // 每一层节点增加className，用于每层颜色区分需求
          // return this.$store.dispatch('getAreas', data.belongArea)
          // .then(areas => {
          //   if (areas.length) data.belongArea = areas.join('/')
          //   return data
          // })
        }).catch(err => {
          throw (err)
        })
      },
      getAtlasDetail (id) {
        return req('orgAtlasDetail', {
          id
        }).then(data => {
          return data
        }).catch(() => {})
      },
      initChart (data) {
        const _this = this
        this.chartObj = $('#chart-container').orgchart({
          'chartContainer': '#chart-container',
          'chartClass': 'ihr-org-chart',
          'data': data,
          'depth': this.depth,   // 树的展示深度
          'nodeTitle': 'orgUnitName',     // 指定标题
          'nodeContent': 'belongArea',  // 指定内容
          'pan': true,  // 拖动
          'zoom': true,   // 缩放
          'direction': _this.direction, // 展开方向
          'toggleSiblingsResp': true, //  通过点击arrow展示相邻的节点
          /* 用于ajax懒加载children,
            TODO： 重写源码中ajax懒加载children的部分 */
          'ajaxURL': {
            'children': (nodeData) => {
              return this.ajaxUrls.children + nodeData.orgUnitId
            },
            'headers': {
              'ihrAdminAuthorization': getToken()
            }
          },
          // 节点dom渲染后的钩子
          'createNode': function ($node, data) {
            var secondMenuIcon = $('<i>', {
              'class': 'fa fa-info-circle second-menu-icon',
              click: async function () {
                let detail = await _this.getAtlasDetail(data.orgUnitId)

                /***
                 * Hack
                 * 如果后台没有处理地区编码就用下面代码处理
                 */
                detail = await _this.$store.dispatch('GET_BELONEMANAGEDAREAS', detail)

                // 翻转所在地区顺序
                if (detail.belongAreaName) {
                  detail.belongAreaName = String(detail.belongAreaName.split('/').reverse().join('/'))
                } else {
                  detail.belongAreaName = ''
                }

                _this.$d('ORG_TYPE', detail.orgType).then(label => {
                  detail.orgType = label
                  reqEmpTotal('getEmpCount', {orgUnitId: detail.orgUnitId}).then(empTotal => {
                    detail.containEmpNum = empTotal

                    let secondMenu = secondMenuInit(detail)
                    if ($(this).siblings('.second-menu').length === 0) $(this).parent().append(secondMenu)
                    _this.secondMenuDom = $(this).siblings('.second-menu')
                    $(this).siblings('.second-menu').toggle()
                  }).catch(() => {
                    let secondMenu = secondMenuInit(detail)
                    if ($(this).siblings('.second-menu').length === 0) $(this).parent().append(secondMenu)
                    _this.secondMenuDom = $(this).siblings('.second-menu')
                    $(this).siblings('.second-menu').toggle()
                  })
                })
              }
            })
            $node.append(secondMenuIcon)
            // $node.children('.title').after(`<div class="tool-tip">${data.orgUnitName}</div>`)
          }
        })
        this.centerChart()
      },
      async handleSlider (depth) {
        this.depth = depth
        let orgData = await this.getAtlasData(this.rootId, depth)
        this.orgData = orgData
        this.chartObj.init({ 'depth': this.depth, 'data': this.orgData })
        this.centerChart()
      },
      // 重置图表位置
      centerChart () {
        var parent = $('#chart-container')
        var child = $('.orgchart')
        child.css('position', 'absolute')
        child.css('top', ((parent.height() - child.outerHeight()) / 2) + parent.scrollTop() + 'px')
        child.css('left', ((parent.width() - child.outerWidth()) / 2) + parent.scrollLeft() + 'px')
        if (this.direction === 'b2t') {
          child.css('transform', 'matrix(1, 0, 0, 1, 0,0) rotate(180deg)')
        }
      },
      wrapClick (event) {
        let className = event.target.className
        if (className !== 'second-menu' || className !== 'org-name' || className !== 'org-short-name' || className !== 'info-item') {
          this.secondMenuDom && this.secondMenuDom.hide()
        }
      },
      domToImage () {
        Promise.resolve(this.secondMenuDom && this.secondMenuDom.hide()).then(() => {
          var node = document.getElementsByClassName('ihr-org-chart')[0]
          node.style = ''
          domtoimage.toJpeg(node, { quality: 0.9 })
          .then(function (dataUrl) {
            var link = document.createElement('a')
            link.download = '永辉——组织架构图.jpeg'
            link.href = dataUrl
            link.click()
          })
        })
      }
    },
    watch: {
      // rootId变化时更新当前图表数据
      async rootId (val) {
        this.loading = true
        let orgData = []
        try {
          orgData = await this.getAtlasData(val, this.depth)
        } catch (err) {

        } finally {
          this.loading = false
        }
        this.orgData = orgData
        this.chartObj.init({ 'data': this.orgData, 'depth': this.depth })
        this.centerChart()
      }
    },
    async mounted () {
      let data = await this.getAtlasData(this.rootId, this.depth)
      this.orgData = data
      this.initChart(this.orgData)
    }
  }
</script>
<style lang="scss">
  #chart-container {
    position: relative;
    min-height: 500px;
  }
  .chart-slider.el-slider.is-vertical {
    position: absolute;
    top: 100px;
    right: 20px;
    background: #fff;
    z-index: 1;
    padding: 20px 0;
  }
  .btn-recenter {
    z-index: 1;
    position: absolute;
    top: 44px;
    right: 6px;
  }
  .btn-transfer {
    z-index: 1;
    position: absolute;
    top: 6px;
    right: 6px;
  }
  .oc-export-btn {
    z-index: 1;
  }

  // 多层时候的颜色
  .orgchart {
    .depth-1 {
      .title { background-color: #006699; }
      .content { border-color: #006699; }
    }
    .depth-2 {
      .title { background-color: #009933; }
      .content { border-color: #009933; }
    }
  }

  // 详情Tips
  .orgchart {
    background: #fff;
    border: 2px dashed #aaa;
    .second-menu-icon {
      transition: opacity .5s;
      opacity: 0;
      // b2t fix
      right: -5px;
      top: -5px;
      z-index: 2;
      color: rgba(68, 157, 68, 0.5);
      font-size: 18px;
      position: absolute;
      :hover { color: #449d44; }
    }
    .node:hover .second-menu-icon { opacity: 1; }
    .node .second-menu {
      display: none;
      box-sizing: border-box;
      text-align: left;
      position: absolute;
      top: -10px;
      right: -220px;
      width: 200px;
      padding: 20px;
      border-radius: 20px;
      box-shadow: 0 0 10px 1px #999;
      background-color: #fff;
      z-index: 1;
      .org-short-name {
        font-size: 14px;
        font-weight: bold;
      }
      .org-name {
        color: #999;
        font-size: 10px;
        padding-bottom: 4px;
      }
    }
    .node .tool-tip {
      // transition:all 0.1s ease-in-out;
      opacity: 0;
      position: absolute;
      right: 50px;
      top: 50px;
      color: #000;
      white-space:nowrap;
      background: rgb(31, 45, 61);
      font-size: 12px;
      line-height: 1.2;
      border-radius: 4px;
      padding: 10px;
      color: #fff;
      z-index: 1000;
      &:before {
        content: "";
        position: absolute;
        top: 32px;
        width: 0;
        height: 0;
        border-top: 8px solid #1f2d3d;
        border-right: 8px solid transparent;
        border-left: 8px solid transparent;
      }
    }
    .node .title:hover {
      & + .tool-tip {
        opacity:1;
      }
    }
  }
  .orgchart.b2t {
    .node {
      .second-menu-icon, .second-menu {
        transform: rotate(180deg);
      }
      .tool-tip {
        transform: rotate(180deg);
      }
      .second-menu {
        right: 100px;
        top: -200px;
      }
      .second-menu-icon {
        left: -5px;
        right: inherit;
      }
    }
  }
</style>
