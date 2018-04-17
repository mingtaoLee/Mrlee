<template>
  <div class="wrap" ref="wrap">
    <div class="node-list" ref="nodeList">
      <div :class="['node-item', {'actice-line': isActive}]" v-for="node in data" :key="node.id">
        <div class="node">
          <button style="position: absolute;top:10px;left:10px;" v-if="node.children" @click="toggleList($event, node)">{{node.id}}</button>
          <!-- 自定义内容 -->
          <transition name="stretch">
            <div class="line" ref="line" v-show="isUnfold && currentId === node.id"></div>
          </transition>
        </div>
        <transition name="widen">
          <div class="col-line" v-show="isUnfold && currentId === node.id" :style="{width: verticalWidth}"></div>
        </transition>
        <div class="line-shape"></div>
      </div>
    </div>
    <transition name="fade">
      <node v-if="children" :data="children" :isActive="true" :prevNode="currentNode" v-show="isUnfold" />
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'node',
    data () {
      return {
        isUnfold: false,
        verticalWidth: null,
        currentId: null,
        children: null,
        currentNode: {
          idx: null,
          node: null,
          level: -1
        }
      }
    },
    watch: {
      data (newVal) {
        this.init()
        if (this.isActive) {
          this.$nextTick(() => {
            let nodeList = this.$refs.nodeList
            this.currentNode = this.prevNode
            let node = this.currentNode.node
            let width = nodeList.offsetWidth
            let left = node.offsetLeft + node.parentNode.offsetLeft
            nodeList.style.position = 'absolute'
            nodeList.style.left = left + node.offsetWidth / 2 - width / 2 + 'px'
            this.$refs.wrap.style.height = node.offsetHeight + 'px'
            this.$refs.wrap.style.top = '100%'
            if (this.currentNode.level >= 1) {
              this.$refs.wrap.style.transform = 'translateY(10px)'
            }
          })
        }
      }
    },
    props: ['data', 'isActive', 'prevNode'],
    methods: {
      toggleList (e, data) {
        this.children = data.children
        if (!this.children) {
          return
        }
        if (this.isUnfold && this.currentId !== data.id) {
          this.isUnfold = !this.isUnfold
        } else if (this.isUnfold && this.currentId === data.id) {
          this.isUnfold = !this.isUnfold
          return
        }
        this.currentNode.idx = this.findInArr(this.data, data)
        this.currentNode.node = e.target.parentNode.parentNode
        this.currentId = data.id
        this.isUnfold = !this.isUnfold
        let node = e.target.parentNode
        let margin = this.getStyle(node, 'margin')
        margin = this.parseMargin(margin)
        let width = node.offsetWidth
        if (this.children.length === 1) {
          this.verticalWidth = '0'
          return
        }
        this.verticalWidth = (data.children.length - 1) * (width + margin) + 'px'
      },
      findInArr (arr, finder) {
        let idx = null
        arr.map((item, index) => {
          if (finder === item) {
            idx = index
          }
        })
        return idx
      },
      init () {
        this.isUnfold = false
        this.verticalWidth = null
        this.currentId = null
        this.children = null
      },
      getStyle (element, attr) {
        if (element.currentStyle) {
          return element.currentStyle[attr]
        } else {
          return window.getComputedStyle(element, null)[attr]
        }
      },
      parseMargin (str) {
        str = str.match(/\d+/g)
        if (str.length >= 2) {
          return parseInt(str[1]) * 2
        }
        if (str.length === 1) {
          return parseInt(str[0]) * 2
        }
        if (str.length === 4) {
          return parseInt(str[1]) + parseInt(str[3])
        }
      }
    },
    mounted () {
      if (this.isActive) {
        this.$nextTick(() => {
          let nodeList = this.$refs.nodeList
          this.currentNode = this.prevNode
          // 层级加一
          this.currentNode.level += 1
          let node = this.currentNode.node
          let width = nodeList.offsetWidth
          let left = node.offsetLeft + node.parentNode.offsetLeft
          nodeList.style.position = 'absolute'
          nodeList.style.left = left + node.offsetWidth / 2 - width / 2 + 'px'
          this.$refs.wrap.style.height = node.offsetHeight + 'px'
          this.$refs.wrap.style.top = '100%'
          if (this.currentNode.level >= 1) {
            this.$refs.wrap.style.transform = 'translateY(10px)'
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    position: relative;
    font-size: 0;
    .node-list {
      position: relative;
      display: inline-block;
      white-space:nowrap;
      &:nth-of-type(1){
        left:200px;
      }
      .node-item {
        display: inline-block;
        position: relative;
        height: 100%;
        .node {
          position: relative;
          width: 100px;
          height: 50px;
          margin: 0 5px;
          font-size: 16px;
          background-color: #ccc;
          .line {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translate(-50%, 0);
            width: 1px;
            height: 20px;
            border-left: 1px solid #ccc;
            &.stretch-enter-active {
              transition: all 0.3s;
            }
            &.stretch-leave-active {
              transition-property: all;
              transition-duration: 0.1s;
              transition-delay: 0.4s;
            }
            &.stretch-enter,
            &.stretch-leave-to {
              width: 1px;
              height: 0;
            }
          }
        }
        .col-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          height: 19px;
          border-bottom: 1px solid #ccc;
          &.widen-enter-active {
            transition-property: all;
            transition-duration: 0.3s;
          }
          &.widen-leave-active {
            transition-property: all;
            transition-duration: 0.1s;
            transition-delay: 0.3s;
          }
          &.widen-enter,
          &.widen-leave-to {
            width: 0;
            opacity: 0;
          }
        }
        .line-shape {
          position: relative;
          width: 1px;
          height: 20px;
        }
        &.actice-line {
          position: relative;
          &:before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            width: 0;
            height: 10px;
            margin-left: -1px;
            border-left: 1px solid #ccc;
            transform: translateX(-50%);
            transform: scaleX(0.8);
          }
        }
      }
    }
    .fade-enter-active {
      transition-property: all;
      transition-duration: 0.3s;
      transition-delay: 0.3s;
    }
    .fade-leave-active {
      transition: all 0.3s;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
      transform: translateY(10px);
    }
  }
</style>
