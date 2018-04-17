<template>
  <i-layout ref="layout">
    <div class="wrap" slot="section">
      <header>
        <div v-if="accessMap.orgPosJobAtlas">
        <span>职位</span>
        <div class="current-position" @click.stop="showPositionList">
          <span :style="{color:'#b4bccc'}">{{chosenText}}</span><i class="el-icon-menu"></i>
        </div>
      </div>
      </header>
      <div class="display-positionMap" :style="mapHeight">
        <org-chart :orgData="atlasData" />
      </div>
      <position-selection v-model="isShow" status="all" @change="save" loaded></position-selection>
    </div>
  </i-layout>
</template>

<script>
  import req from 'api/position/position-map'
  import OrgChart from 'components/position/org-chart'
  import PositionSelection from 'components/position/position-selection'
  import access from 'mixins/access'

  export default {
    name: 'PositionMap',
    components: {
      OrgChart,
      PositionSelection
    },
    mixins: [access],
    data () {
      return {
        mapHeight: {
          height: '100%'
        },
        // 职位选择面板
        isShow: false,
        // 选择的职位名字
        chosenText: '请选择',
        // 树形图的绑定值
        atlasData: {}
      }
    },
    methods: {
      // 改变选中职位框的文字
      changeText (e, scope) {
        this.chosenText = scope.row.name
      },
      // 确认图谱展示的模块，同时关闭面板
      save (radio) {
        this.isShow = false
        this.getPositionAtlas(radio.posPositionId)
      },
      // 根据选择职位的id获取图谱信息
      getPositionAtlas (id) {
        var params = {
          posPositionId: id
        }
        req('getPositionAtlas', params).then(res => {
          this.atlasData = res
        })
      },
      // 通过组织id获取职位信息
      search () {
        let params = {
          orgUnitId: this.chosenNode.orgUnitId
        }
        this.table.search = { ...params }
      },
      fetch (params = {}) {
        req('getPositionInfo', params)
        .then(res => {
          ({ info: this.table.info, data: this.table.data, total: this.table.total } = { ...res })
        })
      },
      // 显示职位面板
      showPositionList () {
        this.isShow = true
      },
      // 选择节点，同时获取数据
      chooseNode (node) {
        this.chosenNode = node
        this.search()
      }
    },
    mounted () {
      this.mapHeight.height = this.$refs.layout.minHeight + 'px'
    }
  }
</script>

<style lang="scss" scoped>
  .wrap{
    header{
      margin-bottom:10px;
      .current-position{
        position: relative;
        display: inline-block;
        min-width:180px;
        margin: 0 10px;
        border: 1px solid #ccc;
        padding: 4px 6px;
        cursor: pointer;
        .el-icon-menu{
          position: absolute;
          top:50%;
          right:10px;
          transform: translate(0, -50%);
        }
      }
    }
  }
</style>
