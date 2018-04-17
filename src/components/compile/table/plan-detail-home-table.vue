<template>
  <div class="wrap" v-loading="loading" :element-loading-text="$loadingText">
    <i-table :table="table"
    ref="ITable"
    @pageSizeChange="handleChange"
    @pageIndexChange="handleChange">
      <template slot="table" slot-scope="tableScope">
        <el-table
          @row-click="rowClickHandler(tableScope, $event)"
          :data="tableScope.clone"
          @selection-change="selectionChangeHandler">
        <el-table-column
            v-for="(col,index) in tableScope.columns"
            v-if="!col.hasOwnProperty('show')||col.show"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            align="center"
            :min-width="col.minWidth">
              <template slot-scope="scope">
                <i-table-cell :row="scope.row" :col="col.prop" :table="tableScope"/>
              </template>
            <el-table-column
              v-for="(son,sonIndex) in col.children"
              v-if="controlProposal(index,sonIndex)"
              :key="son.prop"
              :prop="son.prop"
              :label="son.label"
              :min-width="col.minWidth"
              :formatter="formatBussiness"
              align="center"
              show-overflow-tooltip>
                <template slot-scope="scope">
                  <i-table-cell :row="scope.row" :col="son.prop" :table="tableScope"  @change="changeData"/>
                </template>
              </el-table-column>
          </el-table-column>
          <el-table-column label="合计数"  align="center">
            <el-table-column prop="sumScaleNum" label="编制数"  align="center" min-width="100" show-overflow-tooltip />
            <el-table-column prop="sumActualNum" label="实际数"  align="center" min-width="100" show-overflow-tooltip />
          </el-table-column>
          <el-table-column
            v-if="tableScope.operator && standardable"
            label="操作"
            fixed="right"
            align="center"
            min-width="90"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <i-table-operator
                :table="tableScope"
                :row="scope.row"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </div>
</template>

<script>
import reqPl, {config} from 'api/compile/plan'
import ITable from 'components/common/i-table'
import ITableOperator from 'components/common/i-table-operator'
import ITableCell from 'components/common/i-table-cell'
// import {TempStatusDict} from 'config/dict'

export default {
  name: 'PlanDetailHomeTable',
  components: {
    ITable,
    ITableOperator,
    ITableCell
  },
  props: {
    scaPlanId: {
      type: String,
      default: ''
    },
    // 是否可编辑（判断权限）
    editable: {
      type: Boolean,
      default: false
    },
    // 是否标准使用的，否就减去页数栏目、导出功能等
    standardable: {
      type: Boolean,
      default: true
    },
    // 是否有组织名称
    havingOrgName: {
      type: Boolean,
      default: true
    },
    // 是否可以直接编辑表格内容
    editeCell: {
      type: Boolean,
      default: false
    },
    header: {
      type: Object,
      default: {}
    },
    data: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      // 模板管理主页的表格内容配置项
      table: {
        columns: [
          { prop: 'orgUnitName', label: '组织名称', show: this.havingOrgName, minWidth: 150 },
          { prop: 'effectiveDate', label: '编制月份', show: this.standardable, display: { date: 'short' }, minWidth: 150 },
          {
            prop: 'scaPlanReportMasterId',
            label: '{bussinessName}',
            parent: 'scaPlanReportSlaves|dimensions',
            children: [
              { prop: 'product', label: '建议数', minWidth: 100 },
              { prop: 'scaleNum', label: '编制数', minWidth: 100 },
              { prop: 'actualNum', label: '实际数', minWidth: 100 }
            ]
          }
        ],
        multiple: true,
        setting: {
          operator: [ {
            text: '填报',
            func: this.form,
            show: row => {
              // todo:确定是否已填报状态码
              return {empty: !this.editable || row.reportStatus !== '01'}
            }
          }, {
            text: '修改',
            func: this.modify,
            show: row => {
              // todo:确定是否已填报状态码
              return {empty: !this.editable || row.reportStatus !== '02'}
            }
          }, {
            text: '查看',
            func: this.check,
            show: row => {
              // todo:确定是否已填报状态码
              return {empty: this.editable}
            }
          }],
          toolbar: [{
            text: '导入',
            func: this.inTemp,
            show: () => {
              return { empty: !this.editable }
            }
          }],
          export: {
            text: '导出',              // 可选（不合规范，不推荐填写）
            show: () => {
              return { empty: !this.standardable }
            },
            config: {                      // 可选
              fileName: '编制计划列表'            // 默认文件名
              // version: '',              // 默认后缀
              // range: '',                // 默认范围
              // sync: true                // 默认方式（同步/异步）
            },
            req: config.getPlanTableById        // 必填
          },
          editor: {
            orgUnitName: {
              disable: true
            },
            scaDate: {
              type: 'date',
              options: {
                type: 'short',
                rules: [
                { required: true, message: '请选择编制月份' }
                ]
              }
            },
            product: {
              disable: true
            },
            scaleNum: {
              type: 'number',
              rules: [
                { required: true, message: '请填写编制数' }
              ]
            },
            actualNum: {
              disable: true
            }
          }
        },
        editable: this.editeCell,
        header: null,
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: this.standardable
      },
      // 保存列表被选择的项
      selection: [],
      // loading
      loading: false,
      // 保存header的各项title
      titles: []
    }
  },

  methods: {
    // 获取内部所有数据
    getTableClone (data) {
      return this.$refs.ITable.clone
    },
    /** 监听行点击事件，并返回被点击的行对象 */
    rowClickHandler ({ rowClickHandler }, row) {
      rowClickHandler(row)
    },
    controlProposal (index, sonIndex) {
      // todo:这里需要根据实际表格的位置确定某些index值
      // sonIndex为0，也就是column中定义的第一个参数，建议数，这里需要按实际决定是否显示
      return sonIndex === 0 ? this.titles[index - 2].havingProposal === '1' : true
    },
    // 获取表格表头信息
    getTableHead (id) {
      let params = {
        scaPlanId: id || this.scaPlanId
      }
      reqPl('getTableHeadByPlanId', params).then(data => {
        this.titles = data.dimensions
        this.table.header = [data]
        this.table.search = {}
      })
    },
    // 展示模板列表,ifRefresh为是否刷新，searcher为搜索内容
    showTempList (searcher) {
      this.table.search = {...searcher}
    },
    // 表格请求函数
    fetch (params = {}) {
      var that = this
      that.loading = true
      Object.assign(params, {scaPlanId: this.scaPlanId})
      reqPl('getPlanTableById', params).then(data => {
        that.loading = false
        that.table.data = data.data
        that.table.total = data.total
        that.table.info = data.info
      }).catch(e => {
        that.loading = false
      })
    },
    // 列表被选择的行
    selectionChangeHandler (selection) {
      this.selection = selection
    },
    // 转化适用范围的格式
    getRange (orgs) {
      let range = []
      orgs.map(ele => {
        if (!range.includes(ele.orgUnitName)) {
          range.push(ele.orgUnitName)
        }
      })
      return range.join('，')
    },
    formatBussiness (row, props, val) {
      console.log(row, props, val)
      return val
    },
    // 导入编制按钮触发
    inTemp () {

    },
    // 填报计划
    form (row) {
      this.$emit('form', this.table.header, [row])
    },
    // 修改计划
    modify (row) {
      this.$emit('modify', this.table.header, [row])
    },
    // 查看计划
    check (row) {
      this.$emit('check', this.table.header, [row])
    },
    // 页量改变/页码改变
    handleChange (info) {
      this.fetch(info)
    },
    // 编辑表格内容时候change事件
    changeData (val) {
      let total = 0
      for (let ele in val.row) {
        if (ele.includes('scaleNum')) {
          total += Number(val.row[ele])
        }
      }
      val.row.sumScaleNum = total
      this.$emit('change', {label: 'scaNum', value: total})
    },
    // 反扁平化data数据
    formatData () {
      return this.$refs.ITable.saveData().clone
    }
  },

  created () {
    Object.keys(this.header).length && (this.table.header = this.header) && (this.titles = this.header[0].dimensions) || this.getTableHead()
    Object.keys(this.data).length && (this.table.data = this.data)
  }
}
</script>

<style lang="scss" scoped>
.checkTemp{
  color:#3da5fe;
  cursor: pointer;
}
</style>
