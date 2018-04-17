<template>
  <div
    ref="container"
    class="bpmn-container"
    v-loading="bpmnLoading"
    :element-loading-text="$loadingText">
    <el-button-group v-if="!bpmnLoading">

      <el-button
        title="复位"
        type="round"
        icon="el-icon-refresh"
        class="font-size-extra"
        @click="transformCtrl(1, 1, 0, 0)">
      </el-button>

      <el-button
        title="放大"
        type="round"
        icon="el-icon-plus"
        class="font-size-extra"
        @click="expand(1)">
      </el-button>

      <el-button
        title="缩小"
        type="round"
        icon="el-icon-minus"
        class="font-size-extra"
        @click="shrink(1)">
      </el-button>

    </el-button-group>

    <svg
      ref="bpmn-svg"
      class="draggable"
      @mousedown.self="grab"
      @mousemove.self="drag"
      @mouseup.self="drop"
      @mouseleave.self="drop"
      @mousewheel="mouseWheelHandler">
      <!-- 显示区域 -->
      <g
        ref="bpmn-g"
        class="viewport"
        :transform="`matrix(${transform.scaleX},0,0,${transform.scaleY},${transform.translateX},${transform.translateY})`"
        transform-origin="50% 50%">
      </g>

      <!-- 箭头 -->
      <defs xmlns="http://www.w3.org/2000/svg"></defs>
    </svg>

    <!-- 提示框 -->
    <transition name="fade">
      <div
        ref="tip"
        class="tip">

        <template v-if="tipContent">
          <p>节点ID: {{ tipContent.taskKey }}</p>
          <p>节点名称: {{ tipContent.taskName }}</p>
          <p>节点类型: {{ tipContent.isMulit === 'Y' ? '多人审批节点' : '单人审批节点' }}</p>
          <p>节点处理人: {{ tipContent.assigneeName }}</p>
        </template>

        <p v-else>暂无内容...</p>

      </div>
    </transition>
  </div>
</template>

<script>
import hollowEventTypes from './hollowEventTypes.js'
import solidEventTypes from './solidEventTypes.js'
import doubleHollowEventTypes from './doubleHollowEventTypes.js'
import doubleSolidEventTypes from './doubleSolidEventTypes.js'
import taskTypes from './taskTypes.js'
import gatewayTypes from './gatewayTypes.js'
import multiTypes from './multiTypes.js'
import req from 'api/common/flow.js'

export default {
  props: {
    // 流程图类型
    type: {
      required: true,
      type: String
    },

    // 流程实例ID
    insId: {
      type: String
    },

    // 流程定义ID
    defId: {
      type: String
    },

    // 点击状态
    isActive: {
      type: Boolean,
      default: false
    },

    // 经过Task
    processedTask: {
      type: Array,
      default: null
    },

    // 经过Flow
    processedFlow: {
      type: Array,
      default: null
    }
  },

  data () {
    return {
      // hover 节点ID
      activitiId: '',

      // 拖拽标识
      isMoving: false,

      // 开始
      startCoords: {
        startX: 0,
        startY: 0
      },

      // 加载标识
      bpmnLoading: true,

      // transform对象
      transform: {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0
      },

      // 已经translate坐标
      translatedX: 0,
      translatedY: 0
    }
  },

  computed: {
    // 请求接口地址
    url () {
      return this.type === 'def'
        ? 'getFlowDefinitionById'
        : this.insId
          ? 'getFlowInstance'
          : 'getFlowDefinitionByKey'
    },

    // 提示内容
    tipContent () {
      if (this.processedTask && this.processedTask.length && this.activitiId) {
        return this.processedTask.find(val => {
          if (val) return val.taskKey === this.activitiId
          return false
        })
      }
    }
  },

  watch: {
    isActive (val) {
      if (!val) {
        this.clearActiveState()
      }
    },

    processedFlow (val) {
      this.init()
    }
  },

  mounted () {
    if (this.type === 'ins') {
      this.$refs['bpmn-g'].addEventListener('mousemove', this.positionTip)
    }
  },

  methods: {
    // 初始化
    init () {
      this.$refs['bpmn-g'].innerHTML = ''
      this.$nextTick(this.initSvg)
      this.initMarkers()
      let id = this.type === 'def'
        ? this.defId
        : this.insId
          ? this.insId
          : this.defId
      req(this.url, {
        id: id
      }).then(res => {
        if (this.type === 'ins' && !this.insId) res = this.manualStart(res)
        let elmAttrsObj = this.flowsSort(this.resetAxis(res))
        this.generateElms(elmAttrsObj)
        this.bpmnLoading = false
      })
    },

    // 初始化Svg宽高
    initSvg () {
      this.$refs['bpmn-svg'].setAttributeNS(
        null,
        'width',
        this.$refs.container.clientWidth
      )
      this.$refs['bpmn-svg'].setAttributeNS(
        null,
        'height',
        this.$refs.container.clientHeight
      )
      this.transformCtrl(1, 1, 0, 0)
    },

    // 手动开始第一步
    manualStart (elmAttrsObj) {
      for (let obj of elmAttrsObj.activities) {
        if (obj.type === 'startEvent') {
          obj.status = '1'
          break
        }
      }
      return elmAttrsObj
    },

    // 重置后端返回坐标
    resetAxis (elmAttrsObj) {
      let xArr = this.quickSort(this.getCoordsArray(elmAttrsObj, 'x'))
      let yArr = this.quickSort(this.getCoordsArray(elmAttrsObj, 'y'))
      let gapX = this.$refs.container.clientWidth / 2 - (xArr[0] + xArr[xArr.length - 1]) / 2
      let gapY = this.$refs.container.clientHeight / 2 - (yArr[0] + yArr[yArr.length - 1]) / 2
      elmAttrsObj = this.resetX(elmAttrsObj, gapX)
      elmAttrsObj = this.resetY(elmAttrsObj, gapY)
      return elmAttrsObj
    },

    // 重置x坐标
    resetX (elmAttrsObj, gapX) {
      for (let activity of elmAttrsObj.activities) activity.x += gapX
      for (let flow of elmAttrsObj.flows) {
        for (let point of flow.points) {
          point.x += gapX
        }
      }
      return elmAttrsObj
    },

    // 重置y坐标
    resetY (elmAttrsObj, gapY) {
      for (let activity of elmAttrsObj.activities) activity.y += gapY
      for (let flow of elmAttrsObj.flows) {
        for (let point of flow.points) {
          point.y += gapY
        }
      }
      return elmAttrsObj
    },

    // 按状态排序Flows
    flowsSort (elmAttrsObj) {
      elmAttrsObj.flows.sort((a, b) => parseInt(b.status) - parseInt(a.status))
      return elmAttrsObj
    },

    // 生成元素
    generateElms (elmAttrsObj) {
      for (let key of Object.keys(elmAttrsObj)) {
        for (let obj of elmAttrsObj[key]) {
          obj.type === 'startEvent'
            ? this.createSvg(obj, this.createStartEvent(obj))
            : obj.type === 'endEvent'
              ? this.createSvg(obj, this.createEndEvent(obj))
              : obj.type === 'boundaryEvent'
                ? this.createSvg(obj, this.createBoundaryEvent(obj))
                : obj.type === 'sequenceFlow'
                  ? this.createSvg(obj, this.createSequenceFlow(obj))
                  : obj.type === 'messageFlow'
                    ? this.createSvg(obj, this.createMessageFlow(obj))
                    : /\w+Task/.test(obj.type)
                      ? this.createSvg(obj, this.createTask(obj))
                      : /\w+Gateway/.test(obj.type)
                        ? this.createSvg(obj, this.createGateway(obj))
                        : null
        }
      }
    },

    // 拼接坐标数组
    getCoordsArray (elmAttrsObj, type, needWidth = false) {
      return elmAttrsObj.activities.map(activiti => {
        return !needWidth
          ? activiti[type]
          : activiti[type] + type === 'x'
            ? activiti.width
            : activiti.height
      }).concat(
        elmAttrsObj.flows.reduce((res, flow) => res.concat(
          flow.points.map(point => point[type])),
          []
        )
      )
    },

    // 创建箭头
    initMarkers () {
      const types = ['sequenceflow', 'association']
      const attrs = [
        { status: 'default', color: '#A4CCE6' },
        { status: 'curr', color: '#E9797B' },
        { status: 'been', color: '#83C933' }
      ]

      for (let type of types) {
        for (let attr of attrs) {
          const arrow = document.createElementNS('http://http://www.w3.org/2000/svg', 'marker')
          this.$refs['bpmn-g'].appendChild(arrow)
          arrow.outerHTML = `<marker
            id="${type}-end-${attr.status}"
            viewBox="0 0 20 20"
            refX="${type === 'sequenceflow' ? '11' : '12'}"
            refY="10"
            markerWidth="10"
            markerHeight="10"
            orient="auto">
            <path
              d="${type === 'sequenceflow'
                ? 'M 1 5 L 11 10 L 1 15 Z'
                : 'M 1 5 L 11 10 L 1 15'}"
              style="fill: ${attr.color}; stroke-width: ${type === 'sequenceflow'
                ? '1px'
                : '1.5px'}; stroke-linecap: round; stroke-dasharray: 10000, 1;">
            </path>
          </marker>`
        }
      }
    },

    // 创建 SVG 元素
    createSvg (elmAttrsObj, ...childElms) {
      const svgElmGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      const svgElmShape = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      const svgElmVisual = document.createElementNS('http://www.w3.org/2000/svg', 'g')

      this.initAttrs(elmAttrsObj, svgElmGroup, svgElmShape, svgElmVisual)
      this.combineSvg(0, svgElmGroup, svgElmShape, svgElmVisual, ...childElms)
      this.attachElmEvents(elmAttrsObj, svgElmVisual)
    },

    // 初始化 SVG 属性
    initAttrs (elmAttrsObj, ...elms) {
      this.setClass(elms[0], 'bpmn-group')

      if (/\w+Flow/.test(elmAttrsObj.type)) this.setClass(elms[1], 'bpmn-element', 'bpmn-connection')
      else this.setClass(elms[1], 'bpmn-element', 'bpmn-shape')

      this.setClass(elms[2], 'bpmn-visual')
      this.setGroupAttrs(elmAttrsObj, elms[1])
    },

    // 单个元素设置一组属性
    setGroupAttrs (elmAttrsObj, elm) {
      elm.setAttribute('data-activity-id', elmAttrsObj.id)
      elm.setAttribute('data-activity-type', elmAttrsObj.type)

      if (!['sequenceFlow', 'messageFlow'].includes(elmAttrsObj.type)) {
        elm.setAttribute('style', `display: block; width: ${elmAttrsObj.width}px; height: ${elmAttrsObj.height}px`)
        elm.setAttribute('transform', `translate(${elmAttrsObj.x} ${elmAttrsObj.y})`)
      }
    },

    // 设置 SVG 类名
    setClass (elm, ...classList) {
      elm.setAttribute(
        'class',
        classList.length > 1
          ? classList.join(' ')
          : classList[0]
      )
    },

    // 整合父子元素
    combineSvg (i = 0, ...elms) {
      if (elms.length <= i) return

      if (elms[i] instanceof Array) this.combineBrotherSvg(elms[i - 1], elms[i])
      else {
        if (i <= 0) this.$refs['bpmn-g'].appendChild(elms[0])
        else elms[i - 1].appendChild(elms[i])
      }

      return this.combineSvg(++i, ...elms)
    },

    // 整合兄弟元素
    combineBrotherSvg (parentElm, childElms) {
      for (let elm of childElms) {
        if (elm) parentElm.appendChild(elm)
      }

      return parentElm
    },

    // 创建开始或结束事件
    createStartOrEndEventSvg (type, obj) {
      const event = document.createElementNS('http://www.w3.org/2000/svg', 'circle')

      event.setAttribute('cx', '17.5')
      event.setAttribute('cy', '17.5')
      event.setAttribute('r', '17.5')
      event.setAttribute('style', `stroke-width: ${type === 'start' ? '2' : '4'}px; fill-opacity: 0.95;`)

      return event
    },

    // 创建事件类型 SVG
    createEventTypeSvg (obj) {
      const elm = obj.eventType === 'none'
        ? null
        : obj.type === 'startEvent'
          ? hollowEventTypes[obj.eventType]()
          : obj.type === 'endEvent'
            ? solidEventTypes[obj.eventType]()
            : ['boundaryEvent', 'intermediateCatchEvent'].includes(obj.type)
              ? doubleHollowEventTypes[obj.eventType]()
              : obj.type === 'throwEvent'
                ? doubleSolidEventTypes[obj.eventType]()
                : null

      return elm
    },

    // 创建开始事件
    createStartEvent (obj) {
      return this.setElmColor(
        obj,
        this.createStartOrEndEventSvg('start', obj),
        this.createEventTypeSvg(obj),
        this.createHasRuleSvg(obj)
      )
    },

    // 创建结束事件
    createEndEvent (obj) {
      return this.setElmColor(
        obj,
        this.createStartOrEndEventSvg('end', obj),
        this.createEventTypeSvg(obj),
        this.createHasRuleSvg(obj)
      )
    },

    // 创建任务 SVG
    createTaskSvg (obj) {
      const task = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

      task.setAttribute('x', '0')
      task.setAttribute('y', '0')
      task.setAttribute('width', obj.width)
      task.setAttribute('height', obj.height)
      task.setAttribute('rx', '4')
      task.setAttribute('ry', '4')
      task.setAttribute('style', 'stroke-width: 2px; fill-opacity: 0.95;')

      return task
    },

    // 创建文本 SVG
    createTaskTextSvg (elmAttrsObj) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')

      this.setClass(text, 'bpmn-label')

      text.setAttribute('style', 'font-family: Arial, sans-serif; font-size: 12px; fill: #333;')

      return this.combineBrotherSvg(text, this.generateCenterText(elmAttrsObj))
    },

    // 居中文本
    generateCenterText (elmAttrsObj) {
      const maxLen = this.getMaxLengthOneLine(elmAttrsObj.width)
      const textArr = this.subText(elmAttrsObj.name, maxLen)
      const textNodeArr = textArr.map((text, idx, arr) => {
        const textSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
        textSpan.appendChild(document.createTextNode(text))
        this.setCenterAttrs(elmAttrsObj, textSpan, idx, arr)
        return textSpan
      })

      return textNodeArr
    },

    // 设置文本居中属性
    setCenterAttrs (elmAttrsObj, textSpan, idx, arr) {
      this.$nextTick(() => {
        const maxWidth = elmAttrsObj.width
        const maxHeight = elmAttrsObj.height
        // 获取textspan标签的实际宽度
        const width = textSpan.getComputedTextLength()
        const height = textSpan.getBoundingClientRect().height

        textSpan.setAttribute('x', ((maxWidth - width) / 2))

        this.setVerticalCenterAttr(textSpan, maxHeight, height, idx, arr.length)
      })
    },

    // 设置垂直居中属性
    setVerticalCenterAttr (textSpan, maxHeight, height, idx, totalSpanLen) {
      const standard = Math.ceil(totalSpanLen / 2)
      const startPoint = (maxHeight - height) / 2 - 4.25 + 17 * (standard - 1)

      textSpan.setAttribute('y', startPoint + 17 * (idx + 1))
    },

    // 截取字符串用于分行
    subText (text, maxLen, textArrs = []) {
      let length = 0

      for (let i = 0; i < text.length; i++) {
        if (text.charAt(i).match(/[^\x00-\xff]/ig) !== null) length += 2
        else length += 1
        if (length >= maxLen) {
          textArrs.push(text.slice(0, i))
          return this.subText(text.slice(i), maxLen, textArrs)
        }
      }

      textArrs.push(text)

      return textArrs
    },

    // 获取单行可写字符长度
    getMaxLengthOneLine (maxWidth) {
      const length = Math.floor((parseInt(maxWidth) / 15) * 2)
      return length
    },

    // 创建任务类型 SVG
    createTaskTypeSvg ({ type }) {
      if (type !== 'callActivity') {
        return taskTypes[type]()
      }
      // TODO: 需要添加callActivity类型图标
      return null
    },

    // 创建任务多实例 Svg
    createMultiTypeSvg ({ multi, width, height }) {
      if (multi && multi !== '0') return multiTypes[multi](width, height)
      return null
    },

    // 创建任务
    createTask (obj) {
      return this.setElmColor(
        obj,
        this.createTaskSvg(obj),
        this.createTaskTextSvg(obj),
        this.createTaskTypeSvg(obj),
        this.createMultiTypeSvg(obj),
        this.createHasRuleSvg(obj)
      )
    },

    // 创建中间抛出或边界事件 SVG
    createBoundaryEventSvg (obj) {
      const circleOutter = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      const circleInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle')

      circleOutter.setAttribute('cx', '15')
      circleOutter.setAttribute('cy', '15')
      circleOutter.setAttribute('r', '15')
      circleOutter.setAttribute('style', `stroke-width: 2px; fill-opacity: 1;`)
      circleInner.setAttribute('cx', '15')
      circleInner.setAttribute('cy', '15')
      circleInner.setAttribute('r', '11')
      circleInner.setAttribute('style', `stroke-width: 1px; fill-opacity: 1;`)

      return [circleOutter, circleInner]
    },

    // 创建中间抛出或边界事件
    createBoundaryEvent (obj) {
      return this.setElmColor(
        obj,
        ...this.createBoundaryEventSvg(obj),
        this.createEventTypeSvg(obj),
        this.createHasRuleSvg(obj)
      )
    },

    // 创建网关 SVG
    createGatewaySvg (obj) {
      const gateway = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')

      gateway.setAttribute('points', '20,0 40,20 20,40 0,20')
      gateway.setAttribute('style', 'stroke-width: 2px; fill-opacity: 0.95;')

      return gateway
    },

    // 创建网关类型 SVG
    createGatewayTypeSvg ({ type }) {
      if (type) return gatewayTypes[type]()
      return null
    },

    // 创建网关
    createGateway (obj) {
      return this.setElmColor(
        obj,
        this.createGatewaySvg(obj),
        this.createGatewayTypeSvg(obj),
        this.createHasRuleSvg(obj)
      )
    },

    // 创建顺序流
    createSequenceFlow (obj) {
      const sequenceflow = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title')

      sequenceflow.setAttribute('d', obj.points.reduce((str, curr, idx) => {
        idx === 0
          ? str += `m${curr.x},${curr.y}`
          : str += `L${curr.x},${curr.y}`
        return str
      }, ''))
      sequenceflow.setAttribute('style', `stroke-width: 2px; stroke-linejoin: round; marker-end: url('#sequenceflow-end-${this.formatStatus(obj.status)}');`)
      title.appendChild(document.createTextNode(`${obj.id}`))

      this.processedFlow &&
      this.processedFlow.includes(obj.id) &&
      this.setClass(sequenceflow, 'bpmn-flow__flowed')

      return this.setElmColor(obj, sequenceflow, title)
    },

    // 创建信息流
    createMessageFlow (obj) {
      const messageFlow = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')

      messageFlow.setAttribute('points', obj.points.reduce((str, curr, idx) => {
        str += `${curr.x},${curr.y} `
        return str
      }, ''))
      messageFlow.setAttribute('style', `stroke-width: 2px; stroke-dasharray: 0.5, 5; stroke-linecap: round; stroke-linejoin: round; marker-end: url('#association-end-${this.formatStatus(status)}')`)

      return this.setElmColor(obj, messageFlow)
    },

    // 转换状态字符
    formatStatus (status = '') {
      return status === '0'
        ? 'been'
        : status === '1'
          ? 'curr'
          : 'default'
    },

    // 元素着色
    setElmColor ({ status }, ...elms) {
      const statusColor = status === '0'
        ? 'bpmn-been'
        : status === '1'
          ? 'bpmn-curr'
          : 'bpmn-default'

      for (let elm of elms) {
        if (elm) {
          if (!elm.classList.contains('bpmn-label')) {
            elm.classList.add(statusColor)
          }
        }
      }

      return elms
    },

    // 添加事件
    attachElmEvents (obj, elm) {
      if (obj.type !== 'startEvent' && obj.type !== 'endEvent' && !/\w+Flow/.test(obj.type)) {
        this.elmClickEvent(obj, elm)
        this.elmHoverEvent(obj, elm)
      }
    },

    // 点击事件
    elmClickEvent (obj, elm) {
      elm.addEventListener('click', (event) => {
        if (this.type === 'def') {
          event.stopPropagation()
          this.clearActiveState()
          for (let e of elm.childNodes) {
            if (!e.classList.contains('bpmn-label')) {
              e.classList.add('bpmn-active')
            }
          }
          this.$emit('elm-click', obj)
        }
      })
    },

    // Hover事件
    elmHoverEvent (obj, elm) {
      elm.addEventListener('mouseenter', (event) => {
        if (this.type === 'ins' && /\w+Task/.test(obj.type)) {
          this.$refs.tip.style.visibility = 'visible'
          this.activitiId = obj.id
        }
      })
      elm.addEventListener('mouseleave', (event) => {
        if (this.type === 'ins' && /\w+Task/.test(obj.type)) {
          this.$refs.tip.style.visibility = 'hidden'
          this.activitiId = ''
        }
      })
    },

    // 定位提示框
    positionTip (event) {
      const tipClientRect = this.$refs.tip.getBoundingClientRect()
      const documentWidth = document.documentElement.clientWidth || document.body.clientWidth

      this.$refs.tip.style.left = event.clientX + tipClientRect.width + 40 >= documentWidth
        ? event.clientX - tipClientRect.width - 100 + 'px'
        : event.clientX + 'px'
      this.$refs.tip.style.top = event.clientY - 10 <= tipClientRect.height
        ? event.offsetY + 20 + 'px'
        : event.offsetY - tipClientRect.height - 10 + 'px'
    },

    // 清除点击状态
    clearActiveState () {
      let allStates = this.$refs['bpmn-svg'].querySelectorAll('.bpmn-visual > *')
      for (let state of allStates) state.classList.remove('bpmn-active')
    },

    // 快速排序
    quickSort (arr) {
      if (arr.length <= 1) {
        return arr
      }
      let leftArr = []
      let rightArr = []
      let comparison = arr[0]

      for (let i = 1; i < arr.length; i++) {
        if (arr[i] > comparison) {
          rightArr.push(arr[i])
        } else {
          leftArr.push(arr[i])
        }
      }

      return [].concat(this.quickSort(leftArr), comparison, this.quickSort(rightArr))
    },

    // 创建已配置规则小「绿」点
    createHasRuleSvg (obj) {
      if (obj.hasRule === '1' && this.type === 'def') {
        let gap = /\w+Gateway/.test(obj.type) ? 5 : 10
        const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        point.setAttribute('cx', '1')
        point.setAttribute('cy', '1')
        point.setAttribute('r', '2')
        point.setAttribute('style', 'stroke-width: 1px; fill-opacity: 0.95; fill: #49BA88; stroke: #49BA88')
        point.setAttribute('transform', `translate(${obj.width - gap}, ${gap})`)
        point.classList.add('bpmn-label')
        return point
      }
      return null
    },

    // 控制流程图缩放以及移动
    transformCtrl (scaleX, scaleY, translateX, translateY) {
      this.transform = { scaleX, scaleY, translateX, translateY }
    },

    // 鼠标点击事件
    grab (event) {
      this.isMoving = true
      this.startCoords.startX = event.clientX
      this.startCoords.startY = event.clientY
      this.translatedX = this.transform.translateX
      this.translatedY = this.transform.translateY
    },

    // 鼠标移动事件
    drag (event) {
      if (this.isMoving) {
        let translateX = (event.clientX - this.startCoords.startX)
        let translateY = (event.clientY - this.startCoords.startY)
        this.locateSvg(translateX, translateY, this.translatedX, this.translatedY)
      }
    },

    // 鼠标释放事件
    drop (event) {
      this.isMoving = false
    },

    // 设置SVG坐标
    locateSvg (x, y, oldX = 0, oldY = 0) {
      this.transform.translateX = x + oldX
      this.transform.translateY = y + oldY
    },

    // 放大
    expand (multiple = 1) {
      this.transform.scaleX = this.transform.scaleX > 3
        ? this.transform.scaleX
        : this.transform.scaleX + (0.1 * multiple)
      this.transform.scaleY = this.transform.scaleY > 3
        ? this.transform.scaleY
        : this.transform.scaleY + (0.1 * multiple)
    },

    // 缩小Svg
    shrink (multiple = 1) {
      this.transform.scaleX = this.transform.scaleX < 0.3
        ? this.transform.scaleX
        : this.transform.scaleX - (0.1 * multiple)
      this.transform.scaleY = this.transform.scaleY < 0.3
        ? this.transform.scaleY
        : this.transform.scaleY - (0.1 * multiple)
    },

    // 鼠标滚轮事件
    mouseWheelHandler (event) {
      event.preventDefault()
      if (event.deltaY < 0) return this.expand(event.deltaY / -100)
      else return this.shrink(event.deltaY / 100)
    }
  }
}
</script>

<style lang="scss">
@keyframes bpmn-flow {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -100;
  }
}

.bpmn-container {
  position: relative;
  user-select: none;
  text-align: center;
  overflow: hidden;

  @media screen and (min-height: 632px) {
    & {
      min-height: calc(100vh - 215px);
      max-height: calc(100vh - 215px);
    }
  }

  > .el-button-group {
    position: absolute;
    top: 0;
    left: 0;

    z-index: 6;
  }

  > svg.draggable {
    cursor: move;
  }
}

.bpmn-shape, .bpmn-connection {
  cursor: pointer;
}

.bpmn-shape > .bpmn-visual > .bpmn-curr {
  fill: #FFF8F8;
  stroke: #E9797B;
}

.bpmn-shape > .bpmn-visual > .bpmn-been {
  fill: #EFFEDD;
  stroke: #83C933;
}

.bpmn-shape > .bpmn-visual > .bpmn-default {
  fill: #F7FCFF;
  stroke: #A4CCE6;
}

.bpmn-shape > .bpmn-visual > .bpmn-active {
  fill: #F8FCFF !important;
  stroke: #3DA5FE !important;
}

.bpmn-shape > .bpmn-visual > .bpmn-icon.bpmn-curr {
  fill: #E9797B;
  stroke: none;
}

.bpmn-shape > .bpmn-visual > .bpmn-icon.bpmn-been {
  fill: #83C933;
  stroke: none;
}

.bpmn-shape > .bpmn-visual > .bpmn-icon.bpmn-default {
  fill: #A4CCE6;
  stroke: none;
}

.bpmn-shape > .bpmn-visual > .bpmn-icon.bpmn-active {
  fill: #3DA5FE !important;
  stroke: none !important;
}

.bpmn-connection > .bpmn-visual > .bpmn-curr {
  stroke: #E9797B;
  fill: none;
}

.bpmn-connection > .bpmn-visual > .bpmn-been {
  stroke: #83C933;
  fill: none;
}

.bpmn-connection > .bpmn-visual > .bpmn-default {
  stroke: #A4CCE6;
  fill: none;
}

.bpmn-connection > .bpmn-visual > .bpmn-flow__flowed {
  stroke-width: 3px !important;
  stroke-dasharray: 7, 7;
  animation: bpmn-flow 3s linear infinite;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease-in-out;
}

.tip {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  box-sizing: border-box;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 7;

  min-width: 220px;
  min-height: 100px;

  border: 2px solid #E6D0A4;
  border-radius: 4px;
  box-shadow: 0 0 3px 2px rgba(230, 208, 164, .2);

  background-color: #FFFCF7;
  visibility: hidden;

  font-size: 12px;

  & > p {
    padding-left: calc(20%);
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
