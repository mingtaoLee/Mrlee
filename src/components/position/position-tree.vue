<template>
  <div class="wrap">
    <div class="position-tree" ref="positionTree">
    <Node :data="data" ref="node">
      <!-- <template slot-scope="props">
       <span>{{ props.name }}</span>
      </template> -->
    </Node>
  </div>
  </div>
</template>

<script>
  import Node from 'components/position/position-tree-node'
  export default {
    name: 'JobTree',
    data () {
      return {
        data: [
          {
            name: 1,
            id: 1,
            children: [
              {
                name: 2,
                id: 2,
                children: [
                  {
                    id: 3,
                    name: 3
                  },
                  {
                    id: 22,
                    name: 22
                  }
                ]
              },
              {
                id: 4,
                name: 4,
                children: [
                  {
                    id: 5,
                    name: 5
                  },
                  {
                    id: 6,
                    name: 6
                  },
                  {
                    id: 7,
                    name: 7
                  }
                ]
              },
              {
                id: 9,
                name: 9,
                children: [
                  {
                    id: 10,
                    name: 10
                  },
                  {
                    id: 11,
                    name: 11,
                    children: [
                      {
                        id: 12,
                        name: 12,
                        children: [
                          {
                            id: 23,
                            name: 23
                          },
                          {
                            id: 24,
                            name: 24
                          },
                          {
                            id: 25,
                            name: 25
                          },
                          {
                            id: 26,
                            name: 26,
                            children: [
                              {
                                id: 27,
                                name: 27
                              },
                              {
                                id: 28,
                                name: 28
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        scale: 1
      }
    },
    components: {
      Node
    },
    methods: {
      listenerWheel () {
        var el = this.$refs.positionTree
        if (window.addEventListener) {
          // 兼容火狐
          el.addEventListener('DOMMouseScroll', this.onMouseWheel, false)
          // 常规浏览器
          el.addEventListener('mousewheel', this.onMouseWheel, false)
        } else {
          el.attachEvent('onDOMMouseScroll', this.onMouseWheel)
          el.attachEvent('onmousewheel', this.onMouseWheel)
        }
      },
      onMouseWheel (e) {
        e.preventDefault()
        e = e || window.event
        var el = this.$refs.positionTree
        var scaleValue = this.scale
        // 兼容火狐的detail detail = (3, -3)
        var detail = e.wheelDelta ? e.wheelDelta / 120 : -e.detail / 3
        if (detail < 0) {
          scaleValue = scaleValue * 0.8
          el.style.transformOrigin = `${e.offsetX} ${e.offsetY}`
          el.style.transform = `scale(${scaleValue}, ${scaleValue})`
          this.scale = scaleValue
        } else {
          scaleValue = scaleValue * 1.3
          el.style.transformOrigin = `${e.offsetX} ${e.offsetY}`
          console.log(`${e.offsetX} ${e.offsetY}`)
          el.style.transform = `scale(${scaleValue}, ${scaleValue})`
          this.scale = scaleValue
        }
      }
    },
    mounted () {
      this.listenerWheel()
    }
  }
</script>

<style lang="scss">
.wrap{
  width:100%;
  overflow: hidden;
  .position-tree{
  min-height:300px;
  overflow: auto;
}
}
</style>
