<template>
  <div class="i-select-area" @click.stop.prevent="clickArea" @mouseover="mouseover" @mouseout="mouseout">
    <el-dropdown placement="top-start" trigger="click"  ref="areaPanel">
      <!-- <el-tooltip effect="dark" :disabled="!tooltip||selectedModel===''" :content="selectedModel" placement="top-start"> -->
        <el-input v-model="selectedModel" :placeholder="placeholder" :disabled="disabled" readonly>
          <i slot="suffix" v-show="disabled||!ifHover" :class="[{'arrow':!disabled} ,'el-icon-arrow-down',{'icon-rotate': showPanel}]"></i>
          <i slot="suffix" v-show="!disabled&&ifHover" class="el-icon-circle-close hover" @click.stop.prevent="deleteSelected"></i>
        </el-input>
      <!-- </el-tooltip> -->

      <el-dropdown-menu slot="dropdown" v-show="!disabled">
        <div class="i-select-area-dropdown" v-if="!disabled" :style="panelStyle">
          <header class="area-header">
            <span v-for="n in panelAmount" :key="n"
            :class="['area-header-list',{'activeItem':chosenTab===n-1}]"
            v-if="n===1||n===2&&selected.length>0||
            selected.length>1&&selected[1][option.name]!==(chosenAllList[n-3]||chosenAllList[chosenAllList.length-1])"
            @click="controlTitle(n-1)">
            {{(n<3)&&(selected[n-1]&&selected[n-1][option.name]||(panelTitleList[n-1]||panelTitleList[panelTitleList.length-1]))||
            (selected[n-1]&&selected[n-1][option.name]!==(chosenAllList[n-2]||chosenAllList[chosenAllList.length-1])&&selected[n-1][option.name]||(panelTitleList[n-1]||panelTitleList[panelTitleList.length-1]))}}
            </span>
            <!-- <span :class="['area-header-list',{'activeItem':chosenTab===0}]" @click="controlTitle(0)">
              {{selected[0]&&selected[0][option.name]||'选择省份/自治区'}}
            </span>
            <span :class="['area-header-list',{'activeItem':chosenTab===1}]" v-if="selected.length>0" @click="controlTitle(1)">
              {{selected[1]&&selected[1][option.name]||'选择市'}}
            </span>
            <span :class="['area-header-list',{'activeItem':chosenTab===2}]" v-if="selected.length>1&&selected[1][option.name]!==chosenAllList[0]" @click="controlTitle(2)">
              {{selected[2]&&selected[2][option.name]!==chosenAllList[0]&&selected[2][option.name]||'选择区县'}}
            </span> -->
            <i class="closeIcon el-icon-close fr" @click="closePanel"></i>
            <div v-if="search" class="inline-block searcher fr" @mouseover="searchMouseOver" @mouseout="searchMouseOut">
              <el-input placeholder="搜索片区" v-model="searchContent" :validate-event="false">
                 <i slot="suffix" v-show="ifSearchHover" class="el-icon-circle-close" @click="deleteSearchContent"></i>
                 <i slot="suffix" v-show="!ifSearchHover" class="el-icon-search"></i>
              </el-input>
            </div>
          </header>
          <section class="area-section">

            <div class="area-option"  v-for="item in panelAreas" :key="item[option.id]" :style="optionStyle">

              <el-checkbox v-if="multiple" @change="controlSelection(item)" :checked="controlChecked(item)" ref="checkbox"></el-checkbox>
              <span @click="controlArea(item)" >{{item[option.name]}}</span>

            </div>

          </section>
        </div>

      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import req from 'api/common/base'

export default {
  name: 'ISelectArea',
  components: {

  },
  props: {
    // 区域类型，默认为行政区域
    type: {
      type: String,
      default: 'administrativeRegion'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    // 占位字
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 所搜框占位字
    searchholder: {
      type: String,
      default: '搜索片区'
    },
    // 区域面板的宽度
    panelWidth: {
      type: Number,
      default: 476
    },
    // 总共的面板数
    panelAmount: {
      type: Number,
      default: 3
    },
    // 区域占位的宽度
    optionWidth: {
      type: Number,
      default: 60
    },
    value: {

    },
    // 参数配置
    option: {
      type: Object,
      default: {
        id: 'areaId',
        parentId: 'parentAreaId',
        name: 'areaName'
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: false
    },
    returnNode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ifShowPanel: false,
      ifHover: false,
      ifSearchHover: false,
      // 搜索内容
      searchContent: '',
      // 保存的所有区域信息
      allAreas: [],
      // 保存第一个面板的区域信息
      baseAreas: [],
      // 保存面板的area数据，每个面板数据重新渲染
      panelAreas: [],
      // 临时保存该页面的area数据
      tempPanelAreas: [],
      // 保存每一个栏目的选择item,然后跳转到下一个面板
      selected: [],
      // 多项选择保存选择的item的id
      selectedIds: [],
      // 展示的第几个栏目的面板
      chosenTab: 0,
      // 实际选择显示框显示的字
      selectedModel: '',
      // 保存的所有面板的标题
      panelTitleList: ['选择省份/自治区', '选择市', '选择区县'],
      // 保存的是如果前一个面板需要全选的话，后一个面板首个显示的字，第二个面板开始
      chosenAllList: ['全省', '全市']
    }
  },

  methods: {
    mouseover () {
      this.ifHover = true
    },
    mouseout () {
      this.ifHover = false
    },
    searchMouseOver () {
      this.ifSearchHover = true
    },
    searchMouseOut () {
      this.ifSearchHover = false
    },
    clickArea () {
      if (this.disabled) {
        this.$refs.areaPanel.visible = false
        return
      }
      this.ifShowPanel = this.$children[0].visible
      if (this.selected.length === 0) {
        this.getBaseAreas().then(data => {
          this.panelAreas = data
          // fixbug:清除内容后checkbox首页被仍选bug
          if (this.multiple) {
            this.multiple = false
            this.$nextTick(() => {
              this.multiple = true
            })
          }
        })
      }
    },
    // 删除选择item的面板选择
    deleteSelected () {
      this.showPanel = this.$refs.areaPanel.visible = false
      this.selected = []
      this.selectedIds = []
      this.chosenTab = 0
      this.selectedModel = ''
      this.searchContent = ''
      if (this.multiple) {
        this.$emit('input', [])
        return this.$emit('change', [], [])
      }
      let returnData = this.returnNode ? {} : ''
      this.$emit('input', '')
      return this.$emit('change', returnData, '')
    },
    // 删除搜索内容
    deleteSearchContent () {
      this.searchContent = ''
    },
    // 多选时候保存的选项
    controlSelection (item) {
      this.selectedIds[item[this.option.id]] = !this.selectedIds[item[this.option.id]]
      this.handleMultipleSelected()
    },
    // 控制被选择的项
    controlChecked (item) {
      return this.selectedIds[item[this.option.id]] || false
    },
    // 异步请求获取所有区域信息
    getAreas () {
      let reqName = 'allAreas'
      let NAME = 'ALL_ADMINISTRATIVE_REGIONS'
      if (this.type === 'yonghui') {
        reqName = 'allYongHuiAreas'
        NAME = 'ALL_YONGHUI_REGIONS'
      }
      if (sessionStorage.getItem(NAME)) {
        return Promise.resolve(JSON.parse(sessionStorage.getItem(NAME)))
      }
      return new Promise(resolve => {
        req(reqName).then(data => {
          sessionStorage.setItem(NAME, JSON.stringify(data))
          resolve(data)
        })
      })
    },
    // 异步请求获取基础（第一个）面板信息
    getBaseAreas () {
      let NAME = 'PROVINCE_ADMINISTRATIVE_REGIONS'
      let areaType = '2'
      if (this.type === 'yonghui') {
        NAME = 'BASE_YONGHUI_REGIONS'
        areaType = '1'
      }
      if (sessionStorage.getItem(NAME)) {
        return Promise.resolve(JSON.parse(sessionStorage.getItem(NAME)))
      }
      return new Promise(resolve => {
        let baseAreas = []
        this.getAreas().then(data => {
          data.map(ele => {
            if (ele.areaType === areaType) {
              baseAreas.push(ele)
            }
          })
          baseAreas.sort(this.sortWay)
          // 后端数据返回已经去掉公司总部、第一集群等内容，不需要此作此操作 138环境
          // if (this.type === 'yonghui') {
          //   // todo:这里纯粹为了组织部分不显示公司总部、第一集群等内容
          //   baseAreas.splice(-5, 5)
          // }
          sessionStorage.setItem(NAME, JSON.stringify(baseAreas))
          resolve(baseAreas)
        })
      })
    },
    // 同步请求获取所有下属节点信息
    getChildArea (areaId) {
      let children = []
      this.allAreas.map(ele => {
        if (ele[this.option.parentId] === areaId) {
          children.push(ele)
        }
      })
      return children
    },
    controlTitle (index) {
      this.chosenTab = index
      if (index === 0) {
        return this.getBaseAreas().then(data => {
          this.panelAreas = data
          this.filterPanelOption(this.searchContent)
        })
      }
      this.panelAreas = this.getChildArea(this.selected[index - 1][this.option.id])
      this.panelAreas.sort(this.sortWay)
      !this.multiple && this.controlChooseAll()
      this.filterPanelOption(this.searchContent)
    },
    controlArea (item) {
      for (let i = this.selected.length - 1; i > this.chosenTab; i--) {
        this.selected.pop()
      }
      this.selected[this.chosenTab] = item
      if (this.multiple && !this.getChildArea(item[this.option.id]).length) {
        if (this.chosenTab === this.panelAmount - 1) {
          delete this.selected[this.selected.length - 1]
        } else {
          this.panelAreas = []
        }
        return
      }
      if (!this.multiple && (item[this.option.name] === this.chosenAllList[0])) {
        return this.handleSelected()
      }
      if (this.chosenTab < this.panelAmount - 1) {
        this.chosenTab++
      }
      if (!this.multiple && (!item.areaCode || this.selected.length === this.panelAmount)) {
        return this.handleSelected()
      }
      this.panelAreas = this.getChildArea(item[this.option.id])
      this.panelAreas.sort(this.sortWay)
      this.controlChooseAll()
      this.multiple && this.filterPanelOption(this.searchContent)
    },
    sortWay (a, b) {
      if (this.type === 'administrativeRegion') {
        if (a[this.option.name] === '其他地区') {
          return 1
        }
        if (b[this.option.name] === '其他地区') {
          return -1
        }
      } else {
        if (a[this.option.name] === '全国') {
          return -1
        }
        if (b[this.option.name] === '全国') {
          return 1
        }
      }
      if (a[this.option.name].length !== b[this.option.name].length) {
        return a[this.option.name].length - b[this.option.name].length
      }
      if (this.type === 'yonghui') {
        return a.areaCode.localeCompare(b.areaCode, 'zh')
      }
      return a[this.option.name].localeCompare(b[this.option.name], 'zh')
    },
    controlChooseAll () {
      if (this.chosenTab > 0 && !this.multiple) {
        this.panelAreas.unshift({
          [this.option.name]: this.chosenAllList[this.chosenTab - 1] || this.chosenAllList[this.chosenAllList.length - 1]
        })
      }
    },
    handleSelected () {
      this.selectedModel = this.getRealAreaNameBySelected(this.selected)
      let changeId = this.selected[this.selected.length - 1][this.option.id] || this.selected[this.selected.length - 2][this.option.id]
      let returnData = this.returnNode
      ? this.selected[this.selected.length - 1][this.option.id]
      ? this.selected[this.selected.length - 1] : this.selected[this.selected.length - 2]
       : changeId
      this.$emit('input', changeId)
      this.$emit('change', returnData, this.selectedModel)
      // this.togglePanel()
      this.$refs.areaPanel.visible = false
      this.ifShowPanel = this.$children[0].visible
    },
    handleMultipleSelected () {
      let areas = []
      let areasNode = []
      let name = ''
      this.allAreas.map(ele => {
        if (this.selectedIds[ele[this.option.id]]) {
          areas.push(ele[this.option.id])
          areasNode.push(ele)
        }
      })
      areas.map(ele => {
        name = name ? name + ',' + this.getRealAreaNameById(ele) : this.getRealAreaNameById(ele)
      })
      this.selectedModel = name
      let returnData = this.returnNode ? areasNode : areas
      this.$emit('input', areas)
      this.$emit('change', returnData, this.selectedModel.split(','))
    },
    togglePanel () {
      this.$refs.areaPanel.visible = !this.$refs.areaPanel.visible
    },
    getRealAreaNameBySelected (list) {
      let realAreaName = ''
      for (let i = 0; i < list.length; i++) {
        realAreaName = realAreaName ? realAreaName + '/' + list[i][this.option.name] : list[i][this.option.name]
      }
      realAreaName = realAreaName.replace('/' + this.chosenAllList[0], '').replace('/' + this.chosenAllList[1], '')
      return realAreaName
    },
    getRealSelectedById (areaId) {
      let result = []
      this.allAreas.map(ele => {
        if (ele[this.option.id] === areaId) {
          if (!ele[this.option.parentId]) {
            result = result.concat([ele])
          }
          result = result.concat(this.getRealSelectedById(ele[this.option.parentId]))
        }
      })
      return result.reverse()
    },
    getRealAreaNameById (areaId) {
      let name
      this.allAreas.map(ele => {
        if (ele[this.option.id] === areaId) {
          if (ele[this.option.parentId] && ele[this.option.parentId] !== 'root') {
            if (this.getRealAreaNameById(ele[this.option.parentId]) === '中国') {
              name = ele[this.option.name]
            } else {
              name = this.getRealAreaNameById(ele[this.option.parentId])
              ? (this.getRealAreaNameById(ele[this.option.parentId]) + '/' + ele[this.option.name])
              : ele[this.option.name]
            }
          } else {
            name = ele[this.option.name]
          }
        }
      })
      return name
    },
    getRealAreaNameByIds () {
      let areas = []
      let name = ''
      this.allAreas.map(ele => {
        if (this.selectedIds[ele[this.option.id]]) {
          areas.push(ele[this.option.id])
        }
      })
      areas.map(ele => {
        name = name ? name + ',' + this.getRealAreaNameById(ele) : this.getRealAreaNameById(ele)
      })
      return name
    },
    // 过滤面板结果
    filterPanelOption (val) {
      if (this.chosenTab === 0) {
        return this.getBaseAreas().then(data => {
          this.tempPanelAreas = data
          this.panelAreas = this.tempPanelAreas.filter((ele) => {
            return ele[this.option.name].includes(val)
          })
        })
      } else {
        this.tempPanelAreas = this.getChildArea(this.selected[this.chosenTab - 1][this.option.id])
        this.tempPanelAreas.sort(this.sortWay)
        this.panelAreas = this.tempPanelAreas.filter((ele) => {
          return ele[this.option.name].includes(val)
        })
      }
    },
    closePanel () {
      this.togglePanel()
    },
    init () {
      if (this.type === 'yonghui') {
        this.panelTitleList = ['选择省区', '选择片区']
        this.chosenAllList = ['全区']
        this.panelAmount = 2
      }
      this.getAreas().then(data => {
        this.allAreas = data
        if (!this.multiple && this.value && !(this.value instanceof Object)) {
          this.selectedModel = this.getRealAreaNameById(this.value)
        }
        if (this.multiple && this.value instanceof Array && this.value.length > 0) {
          this.value.map(ele => {
            this.selectedIds[ele] = true
          })
          this.selectedModel = this.getRealAreaNameByIds()
        }
        this.getBaseAreas().then(data => {
          this.baseAreas = data
        })
      })
    }
  },

  computed: {
    panelStyle () {
      return {
        width: this.panelWidth + 'px'
      }
    },
    showPanel () {
      return this.ifShowPanel
    },
    optionStyle () {
      return {
        minWidth: this.optionWidth + 'px'
      }
    }
  },

  watch: {
    value (val) {
      if (!this.multiple) {
        this.selectedModel = this.getRealAreaNameById(val)
        return
      }
      this.selectedIds = []
      val.map(ele => {
        this.selectedIds[ele] = true
      })
      this.selectedModel = this.getRealAreaNameByIds()
    },
    searchContent (val) {
      this.filterPanelOption(val)
    }
  },

  created () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.i-select-area{
  .arrow{
    cursor: pointer;
    transition-duration: 0.5s;
  }
  .icon-rotate {
    transform: rotate(180deg);
  }
  .hover {
    cursor: pointer;
  }
}
.i-select-area-dropdown{
  padding: 12px 20px 0px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  .area-header{
    color: #333333;
    height:32px;
    line-height: 12px;
    width: 100%;
    border-bottom: 1px solid #E8E8E8;
    .area-header-list{
      padding-right:15px;
      cursor: pointer;
      &:hover{
        color: #3DA5FE;
      }
    }
    .searcher{
      margin: -8px 18px;
      border-radius: 64px;
      &:hover{
        cursor: pointer;
      }
    }
  }
  .area-section{
    margin-top: 15px;
    margin-right: -20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .area-option{
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover{
        color: #3DA5FE;
      }
    }
  }
  .activeItem{
    color: #3DA5FE;
  }
  .closeIcon{
    cursor: pointer;
    font-size: 15px;
  }
}
</style>

<style lang="scss">
.i-select-area{
  .el-input__suffix{
    line-height: 0px;
  }
  .el-input{
    outline-style: none;
  }
  .el-input.el-input--mini.el-input--suffix.el-dropdown-selfdefine{
    outline-style: none;
  }
  .el-tooltip.el-input.el-input--mini.el-input--suffix.el-dropdown-selfdefine{
    outline-style: none;
  }
}
.i-select-area .el-dropdown{
  width: 100%;
}
.i-select-area-dropdown .el-input__inner{
  border-radius: 64px;
  font-size: 12px;
  color: #3DA5FE;
}
</style>
