<template>
  <div id="chart-container" class="yeyq-chart-container">
    <el-slider
      v-if="slider"
      class="chart-slider"
      v-model="depth"
      :step="1"
      show-stops
      :max="sliderMaxNum"
      :min="1"
      height="200px"
      @change="handleSlider">
    </el-slider>
    <el-button type="primary" class="btn-recenter">重置</el-button>
    <el-button type="primary" @click="domToImage" class="btn-transfer">导出图片</el-button>
  </div>
</template>

<script>
/**
 * orgchart.vue
 * @authors zhirong.liang@meicloud.com
*/

  let $ = require('jquery')
  var baseUrl = require('utils/fetch').default.defaults.baseURL
  import domtoimage from 'dom-to-image'
  import req from 'api/position/position-map'
  import 'components/common/orgchart/jquery.orgchart.css'
  import 'components/common/orgchart/jquery.orgchart.js'
  import 'font-awesome/css/font-awesome.min.css'
  import html2canvas from 'html2canvas'
  import { getToken } from '@/utils/auth'

  // 处理baseUrl
  baseUrl = baseUrl.slice(-1) === '/' ? baseUrl.slice(0, -1) : baseUrl
  export default {
    name: 'org-chart',
    components: {
    },
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
        default: 't2b'
      },
      orgData: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        sliderMaxNum: 5,
        depth: 2,   // 组织架构图显示的节点深度
        chartObj: null,  // orgChart的JQ对象
        ajaxUrl: `${baseUrl}/org/pos/positionAtlas/`,
        node: null,
        pageArr: []
      }
    },
    methods: {
      initChart (data) {
        const _this = this
        this.chartObj = $('#chart-container').orgchart({
          'chartContainer': '#chart-container',
          'chartClass': 'ihr-org-chart',
          'data': data,
          'depth': this.depth,   // 树的展示深度
          'pan': true,  // 拖动
          'zoom': true,   // 缩放
          'direction': _this.direction, // 展开方向
          'toggleSiblingsResp': true, //  通过点击arrow展示相邻的节点
          /* 用于ajax懒加载children,
            TODO： 重写源码中ajax懒加载children的部分 */
          'ajaxURL': {
            'children': (nodeData) => {
              return this.ajaxUrl + nodeData.posPositionId
            },
            'headers': {ihrAdminAuthorization: getToken()}
          },
          // 节点dom渲染后的钩子
          'createNode': function ($node, data) {
            _this.node = $node
            $node.addClass('org-chart-node-border')
            $node.append(_this.mainDiv(data))
            $node.append(_this.detailDiv())
            $node.find('.right-hook .emploeeNum')[0].onclick = function (e) {
              e = e || window.event
              // 阻止冒泡
              e.cancelBubble = true
              e.stopPropagation()
              // 判断scale的数值，如果为1，则缩放，如果为0，则放大
              var detailDiv = $node.find('.detail-div-hook')
              var zeros = detailDiv.css('transform').match(/\d/g)
              // 根据点击的职位ID，获取详细信息,显示详细面板
              if ($node.find('.detail-div-hook ul li').length !== 0) {
                if (+zeros[0] === 0 && +zeros[3] === 0) {
                  $('.detail-div-hook').each(function () {
                    $(this).css({transform: 'scale(0, 0)'})
                  })
                  detailDiv.css({transform: 'scale(1, 1)'})
                } else {
                  detailDiv.css({transform: 'scale(0, 0)'})
                }
                return
              }
              _this.pageArr[data.posPositionId] = {
                pageIndex: 1,
                pageSize: 5
              }
              let params = {
                pageIndex: _this.pageArr[data.posPositionId].pageIndex,
                pageSize: _this.pageArr[data.posPositionId].pageSize,
                posPositionId: data.posPositionId
              }
              req('getPositionAllEmploee', params).then(res => {
                // console.log('--职位全部员工信息--', res)
                // 如果返回的数据不是数组，则不做渲染
                if (!res || !(res.data instanceof Array)) {
                  return
                }
                // 遍历返回数据，在详细内容面板上增加数据
                for (var i = 0; i < res.data.length; i++) {
                  $node.find('.detail-div-hook ul').append(`
                  <li class="item">
                    <span class="name">${res.data[i].employeeName}</span>
                    <span class="id">(${res.data[i].employeeCode})</span>
                  </li>
                  `)
                  // 等待全部li添加完毕，最后显示面板
                  if (i === (res.data.length - 1)) {
                    $node.find('.detail-div-hook').append(`
                    <i class="arrowLeft el-icon el-icon-arrow-left"></i>
                      <i class="arrowRight el-icon el-icon-arrow-right"></i>
                    `)
                    // 加载下一页
                    $node.find('.detail-div-hook .arrowRight')[0].onclick = function (e) {
                      e.stopPropagation()
                      e.cancelBubble = true
                      console.log(_this.pageArr[data.posPositionId].pageIndex, res.total)
                      if (_this.pageArr[data.posPositionId].pageIndex === Math.ceil(res.total / 5)) {
                        return
                      }
                      _this.pageArr[data.posPositionId].pageIndex = _this.pageArr[data.posPositionId].pageIndex + 1
                      if (_this.pageArr[data.posPositionId].pageIndex <= 0) {
                        _this.pageArr[data.posPositionId].pageIndex = 1
                        return
                      }
                      let params = {
                        pageIndex: _this.pageArr[data.posPositionId].pageIndex,
                        pageSize: _this.pageArr[data.posPositionId].pageSize,
                        posPositionId: data.posPositionId
                      }
                      req('getPositionAllEmploee', params).then(res => {
                        // 清空所有子节点
                        $node.find('.detail-div-hook ul')[0].innerHTML = ''
                        for (let i = 0; i < res.data.length; i++) {
                          $node.find('.detail-div-hook ul').append(`
                          <li class="item">
                            <span class="name">${res.data[i].employeeName}</span>
                            <span class="id">(${res.data[i].employeeCode})</span>
                          </li>
                          `)
                        }
                      })
                    }
                    // 加载上一页
                    $node.find('.detail-div-hook .arrowLeft')[0].onclick = function (e) {
                      e.stopPropagation()
                      e.cancelBubble = true
                      _this.pageArr[data.posPositionId].pageIndex = _this.pageArr[data.posPositionId].pageIndex - 1
                      if (_this.pageArr[data.posPositionId].pageIndex <= 0) {
                        _this.pageArr[data.posPositionId].pageIndex = 1
                        return
                      }
                      let params = {
                        pageIndex: _this.pageArr[data.posPositionId].pageIndex,
                        pageSize: _this.pageArr[data.posPositionId].pageSize,
                        posPositionId: data.posPositionId
                      }
                      req('getPositionAllEmploee', params).then(res => {
                        // 清空所有子节点
                        $node.find('.detail-div-hook ul')[0].innerHTML = ''
                        for (let i = 0; i < res.data.length; i++) {
                          $node.find('.detail-div-hook ul').append(`
                          <li class="item">
                            <span class="name">${res.data[i].employeeName}</span>
                            <span class="id">(${res.data[i].employeeCode})</span>
                          </li>
                          `)
                        }
                      })
                    }
                    if (+zeros[0] === 0 && +zeros[3] === 0) {
                      $('.detail-div-hook').each(function () {
                        $(this).css({transform: 'scale(0, 0)'})
                      })
                      detailDiv.css({transform: 'scale(1, 1)'})
                    } else {
                      detailDiv.css({transform: 'scale(0, 0)'})
                    }
                  }
                }
              })
            }
            // 修复懒加载子节点时候，节点隐藏的bug
            if ($node.hasClass('slide-up')) {
              $node.removeClass('slide-up')
            }
          }
        })
        this.centerChart()
      },
      // 导出图片
      domToImage () {
        // 隐藏详细面板
        setTimeout(() => {
          var node = document.getElementsByClassName('ihr-org-chart')[0]
          node.style = ''
          domtoimage.toJpeg(node, { quality: 0.9 })
          .then(function (dataUrl) {
            var link = document.createElement('a')
            link.download = '永辉——组织架构图.jpeg'
            link.href = dataUrl
            link.click()
          })
          .catch(function (error) {
            console.error('oops, something went wrong!', error)
          })
        }, 500)
      },
      // 重置图表位置
      centerChart () {
        var child = $('.orgchart')
        child.css({
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        })
      },
      // 定制主界面样式
      mainDiv (data) {
        return `
          <div class="org-chart-info">
            <div class="org-chart-detail">
              <div class="left">
                <div class="department" title="${data.orgUnitName}">${data.orgUnitName}</div>
              </div>
              <div class="right right-hook">
                <div class="avatar"></div>
                <div class="emploeeNum">${data.employeeNum}</div>
              </div>
            </div>
          </div>
         `
      },
      // 详细内容界面样式
      detailDiv (data) {
        return `
          <div class="detail-div detail-div-hook">
            <ul class="item-list">
            </ul>
          </div>
        `
      },
      // 隐藏详细内容面板
      hidenDetailPanel () {
        $('#chart-container')[0].onclick = function () {
          $('.detail-div-hook').css({transform: 'scale(0, 0)'})
        }
      }
    },
    watch: {
      orgData (newVal) {
        this.chartObj.init({ 'data': newVal })
        this.centerChart()
      }
    },
    mounted () {
      // console.log(`${baseUrl}org/pos/positionAtlas/`)
      window.html2canvas = html2canvas
      this.initChart(this.orgData)
      $('.btn-recenter').on('click', () => {
        this.centerChart()
      })
      this.hidenDetailPanel()
    }
  }
</script>
<style lang="scss">
  .yeyq-chart-container {
    position: relative;
    height:100%;
    .btn-recenter{
      position: absolute;
      z-index: 2;
      top:0;
      right:20px;
      font-size: 14px;
      line-height: 1.42857143;
      padding: 6px 12px;
      width:82px;
      text-align: center;
    }
    .btn-transfer{
      position: absolute;
      z-index: 2;
      top:40px;
      right:20px;
      font-size: 14px;
      line-height: 1.42857143;
      padding: 6px 12px;
      width:82px;
      text-align: center;
    }
    .orgchart{
      border: 2px dashed #aaa;
      background-image:none;
      background-color: #fff;
    }
    .org-chart-node-border{
      position:relative;
      top:0;
      background-color: #fdf5f5 !important;
      text-align:left;
      border: 1px solid #4084f7;
      border-radius: 3px;
      margin: 0 10px;
      .org-chart-info{
        padding: 0;
        .header{
          padding: 0 5px;
          font-size:14px;
          word-wrap: break-word;
          word-break: normal;
        }
        .org-chart-detail{
          display:flex;
          padding: 3px 5px 3px 3px;
          overflow:hidden;
          .left{
            width:62px;
            margin-right:5px;
            .name{
              color:#b893f1;
            }
          }
          .right{
            position: relative;
            flex: 1;
            text-align:center;
            .emploeeNum{
              position: absolute;
              right:-2px;
              top:0;
              width:13px;
              height:13px;
              border-radius:50%;
              text-align:center;
              line-height: 13px;
              background-color: #b893f1;
              color: #fff;
              cursor: pointer;
            }
            .avatar{
              width:35px;
              height:35px;
              border-radius: 50%;
              background-image: url('../../assets/images/avatar.png');
              background-repeat: no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
      .detail-div{
        position: absolute;
        z-index: 999;
        left:100%;
        top:48%;
        margin-left:5px;
        width:165px;
        height: 200px;
        border: 1px solid #b893f1;
        border-radius: 5px;
        box-shadow: 0 0 12px 1px #d8c8f1;
        background-color: #fff;
        transform: scale(0,0);
        transform-origin:0 0;
        transition: all 0.5s;
        .arrowRight{
          display: block;
          position: absolute;
          top: 50%;
          left: 100%;
          width: 26px;
          height: 26px;
          z-index: 999;
          font-size: 28px;
          color: #4084f7;
          cursor: pointer;
          margin-left: 10px;
        }
        .arrowLeft{
          display: block;
          position: absolute;
          top: 50%;
          right: 100%;
          width: 26px;
          height: 26px;
          z-index: 999;
          font-size: 28px;
          color: #4084f7;
          cursor: pointer;
          margin-right: 10px;
        }
        .item-list{
          overflow: hidden;
          height: 100%;
          .item{
            box-sizing: border-box;
            height:40px;
            padding: 8px 13px;
            border-bottom: 1px solid #eeeaf5;
            .name{
              font-weight: bold;
              font-size:14px;
              margin-right:6px;
            }
            .id{
              font-size:12px;
              color:#4084f7;
            }
          }
        }
      }
      .bottomEdge{
        bottom: 1px;
        left:90%;
        transform: translateX(-50%);
      }
      .topEdge {
        top: 1px;
        left:90%;
        transform: translateX(-50%);
      }
      .rightEdge{
        top:20%;
      }
      .leftEdge{
        top:20%;
      }
    }
  }
</style>
