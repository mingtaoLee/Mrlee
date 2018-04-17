<template>
  <div class="wrap">
    <i-layout headerKey="orgTitRule">
      <!-- 搜索框 -->
      <position-rules-search
        v-if="accessMap.orgTitRule"
        slot="header"
        @search="search"
        :shopOptions="shopOptions"
        :positionOptions="positionOptions"
      ></position-rules-search>
      <i-table
        slot="section"
        :table="table"
        @pageIndexChange="handleCurrentChange"
        @pageSizeChange="handleSizeChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table ref="table" :data="tableScope.clone" v-loading="loading" :element-loading-text="$loadingText" @selection-change="handleSelectionChange">
            <el-table-column type="selection" fixed="left" show-overflow-tooltip></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :min-width="col['min-width']"
              :formatter="tableScope.formatter"
              :align="col.align"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <i-table-cell :row="scope.row" :col="col.prop" :table="tableScope"></i-table-cell>
              </template>
            </el-table-column>
            <i-table-operator :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
    </i-layout>

    <!-- 新增规则弹窗 -->
    <new-rule-dialog
      ref="newRuleDialog"
      :shopOptions="shopOptions"
      :positionOptions="positionOptions"
      @submit="reload"
    ></new-rule-dialog>

  </div>
</template>

<script>
import reqR, {config} from 'api/compile/rules'
import reqP from 'api/compile'
import access from 'mixins/access'
import PositionRulesSearch from './components/position-rules-search'
import NewRuleDialog from '../components/new-rule-dialog'

export default {
  name: 'PositonRules',
  components: {
    PositionRulesSearch,
    NewRuleDialog
  },
  mixins: [access],
  data () {
    return {
      // 选中的规则ID
      checkedRulesID: null,
      // i-table配置
      table: {
        columns: [
          // { prop: 'scaRuleId', label: '规则编号' },
          { prop: 'ruleName', label: '规则名称', 'min-width': 120 },
          { prop: 'clusterCode', label: '所属集群', display: { dict: 'CLUSTER_CODE' } },
          { prop: 'businessType', label: '业态', display: { dict: 'ORG_BUSINESS_TYPE' } },
          { prop: 'orgStandardCode', label: '标准小店编码', 'min-width': 100 },
          { prop: 'orgStandardName', label: '标准小店名称', 'min-width': 100 },
          { prop: 'posTitleName', label: '职务', 'min-width': 120 },
          { prop: 'saleLimit', label: '日均销售额范围（万）', 'min-width': 150, align: 'right' },
          { prop: 'scaLowerLimit', label: '编制下限', align: 'right' },
          { prop: 'scaUpperLimit', label: '编制上限', align: 'right' },
          { prop: 'isInit', label: '初始化', display: { dict: 'WHETHER_TYPE' } },
          { prop: 'ruleStatus', label: '规则状态', display: { dict: 'RULE_STATUS' } }
        ],
        data: null,
        showPagebar: true,
        total: 0,
        info: null,
        search: null,
        setting: {
          editor: {
            ruleName: {
              type: 'button',
              func: (row, col) => this.checkRuleDetails(row)
            }
          },
          toolbar: [
            {
              text: '新增',
              key: 'orgTitRuleCreate',
              type: 'primary',
              func: this.newForm
            },
            {
              text: '启用',
              key: 'orgTitRuleEnable',
              type: 'primary',
              func: this.enable
            },
            {
              text: '禁用',
              key: 'orgTitRuleDisable',
              type: 'primary',
              func: this.disable
            }
          ],
          operator: [
            {
              text: '修改',
              key: 'orgTitRuleUp',
              func: this.modify,
              show (row) {
                if (row.ruleStatus === '02') {
                  return {
                    disable: true
                  }
                }
              }
            }
          ],
          import: {
            business: 'sca-titleRule',
            key: 'orgTitRuleIntord'
          },
          export: {
            text: '导出',
            key: 'orgTitRuleExport',
            config: {
              fileName: '职务编制列表'      // 默认文件名
              // version: '',                   // 默认后缀
              // range: '',                     // 默认范围
              // sync: true                   // 默认方式（同步/异步）
            },
            req: config.getPosRulesList
          }
          // editor: {
          //   scaRuleId: {
          //     type: 'button',
          //     func: row => { this.check(row) }
          //   }
          // }
        },
        // 查看规则详情弹窗
        ifShow: false,
        row: {}
      },
      shopOptions: null,
      positionOptions: null,
      isView: false,
      // el-table加载状态
      loading: true
    }
  },
  mounted () {
    this.table.search = {}
    this.getShop()
    this.getPositon()
  },
  methods: {
    // 每页展示多少条数据
    handleSizeChange (params) {
      this.fetch(params)
    },
    // 获取页数数据
    handleCurrentChange (params) {
      this.fetch(params)
    },
    // 监测多选
    handleSelectionChange (val) {
      this.checkedRulesID = val.map(obj => obj.scaRuleId)
    },
    // 高级搜索
    search (params = {}) {
      this.table.search = {...params}
    },
    // 获取列表数据
    fetch (params = {}) {
      this.loading = true
      reqR('getPosRulesList', params).then(data => {
        this.table = Object.assign(this.table, data)
        this.loading = false
      })
    },
    // 获取可用小店
    getShop () {
      reqP('getShopList').then(res => {
        this.shopOptions = res
        // 修改查询标准小店下拉字段
        this.shopOptions.map(item => {
          item.orgStandardName = item.orgStandardName + '-' + item.orgStandardCode
        })
      })
    },
    // 获取可用职务
    getPositon () {
      reqP('getTitleList').then(res => {
        this.positionOptions = res
      })
    },
    // 新增规则
    newForm () {
      this.$refs.newRuleDialog.openDialog(true, 'positon')
    },
    // 查看规则
    // check (row) {
    //   this.$refs.newRuleDialog.openDialog(true, 'positon', row, true)
    // },
    // 启用规则
    enable () {
      // 已选规则id为null或为空数组
      if (!this.checkedRulesID || !this.checkedRulesID.length) {
        this.$message({type: 'warning', message: '请勾选要启用的规则！'})
        return
      }
      this.$confirm('确定要启用这些规则吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = this.checkedRulesID
        reqR('enablePosRule', params).then(() => {
          this.$message({type: 'success', message: '启用成功！'})
          this.reload()
        })
      })
    },
    // 禁用规则
    disable () {
      // 已选规则id为null或为空数组
      if (!this.checkedRulesID || !this.checkedRulesID.length) {
        this.$message({type: 'warning', message: '请勾选要禁用的规则！'})
        return
      }
      this.$confirm('确定要禁用这些规则吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = this.checkedRulesID
        reqR('disablePosRule', params).then(() => {
          this.$message({type: 'success', message: '禁用成功！'})
          this.reload()
        })
      })
    },
    // 修改规则
    modify (row) {
      this.$refs.newRuleDialog.openDialog(true, 'positon', row)
    },
    // 刷新页面
    reload () {
      this.table.search = {}
    },
    // 查看规则详情
    checkRuleDetails (row) {
      this.$refs.newRuleDialog.openDialog(true, 'positon', row, true)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


