<template>
  <div class="wrap">
    <i-layout headerKey="orgStoreRule">
      <!-- 搜索框部分-->
      <shop-rules-search
        v-if="accessMap.orgStoreRule"
        slot="header"
        @search="search"
        :shopList="shopList"
      ></shop-rules-search>

      <!-- 列表部分-->
      <i-table
        slot="section"
        :table="table"
        @pageIndexChange="handleCurrentChange"
        @pageSizeChange="handleSizeChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table :data="tableScope.clone" v-loading="loading" :element-loading-text="$loadingText" @selection-change="handleSelectionChange">
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
    <new-rule-dialog ref="newRuleDialog" @submit="reload" :shopOptions="shopList"></new-rule-dialog>
  </div>
</template>

<script>
import ShopRulesSearch from './components/shop-rules-search'
import access from 'mixins/access'
import reqRu, {config} from 'api/compile/rules'
import reqSP from 'api/compile'
import NewRuleDialog from '../components/new-rule-dialog'

export default {
  name: 'ShopRules',
  components: {
    ShopRulesSearch,
    NewRuleDialog
  },
  mixins: [access],
  data () {
    return {
      // 选中的ID
      hasShopRulesID: null,
      // 搜索栏标准小店列表
      shopList: [],
      // 列表
      table: {
        columns: [
          // { prop: 'scaRuleId', label: '规则编号' },
          { prop: 'ruleName', label: '规则名称', 'min-width': 120 },
          { prop: 'clusterCode', label: '所属集群', display: { dict: 'CLUSTER_CODE' } },
          { prop: 'businessType', label: '业态', display: { dict: 'ORG_BUSINESS_TYPE' } },
          { prop: 'orgStandardCode', label: '标准小店编码', 'min-width': 120 },
          { prop: 'orgStandardName', label: '标准小店名称', 'min-width': 120 },
          { prop: 'saleLimit', label: '日均销售额范围（万）', 'min-width': 170, align: 'right' },
          { prop: 'scaLowerLimit', label: '编制下限', align: 'right' },
          { prop: 'scaUpperLimit', label: '编制上限', align: 'right' },
          { prop: 'isInit', label: '初始化', display: { dict: 'WHETHER_TYPE' } },
          { prop: 'ruleStatus', label: '规则状态', display: { dict: 'RULE_STATUS' } }
        ],
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
              key: 'orgStoreRuleCreate',
              func: this.addShopRule
            },
            {
              text: '启用',
              key: 'orgStoreRuleEnable',
              func: this.enableShopRule
            },
            {
              text: '禁用',
              key: 'orgStoreRuleDisable',
              func: this.disableShopRule
            }
          ],
          import: {
            text: '导入',
            key: 'orgStoreRuleIntord',
            business: 'sca-storeRule'
          },
          export: {
            text: '导出',
            key: 'orgStoreRuleExport',
            config: {
              fileName: '小店编制列表'      // 默认文件名
              // version: '',                   // 默认后缀
              // range: '',                     // 默认范围
              // sync: true                   // 默认方式（同步/异步）
            },
            req: config.getShopRulesList
          },
          // editor: {
          //   scaRuleId: {
          //     type: 'button',
          //     func: row => { this.checkDetails(row) }
          //   }
          // },
          operator: [{
            text: '修改',
            key: 'orgStoreRuleUp',
            func: row => this.changeShopRule(row),
            show (row) {
              if (row.ruleStatus === '02') {
                return {
                  disable: true
                }
              }
            }
          }]
        },
        data: null,
        showPagebar: true,
        total: 0,
        search: null,
        info: null
      },
      // el-table加载状态
      loading: true
    }
  },
  mounted () {
    this.table.search = {}
    this.getShopList()
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
    // 根据搜索条件，获取小店列表
    fetch (params = {}) {
      this.loading = true
      reqRu('getShopRulesList', params).then(res => {
        if (res) {
          this.table = Object.assign(this.table, res)
          this.loading = false
        }
      })
    },
    // 加载标准小店列表
    getShopList () {
      reqSP('getShopList').then(data => {
        this.shopList = data
        // 修改查询标准小店下拉字段
        this.shopList.map(item => {
          item.orgStandardName = item.orgStandardName + '-' + item.orgStandardCode
        })
      })
    },
    // 搜索按钮
    search (params = {}) {
      this.table.search = {...params}
    },
    // 勾选选择的表格项
    handleSelectionChange (val) {
      this.hasShopRulesID = val.map(obj => obj.scaRuleId)
    },
    // 查看小店规则详情
    // checkDetails (row) {
    //   this.$refs.newRuleDialog.openDialog(true, 'shopRule', row, true)
    // },
    // 修改小店规则的操作按钮
    changeShopRule (row) {
      this.$refs.newRuleDialog.openDialog(true, 'shopRule', row)
    },
    // 新增小店规则的按钮
    addShopRule () {
      this.$refs.newRuleDialog.openDialog(true, 'shopRule')
    },
    // 启用小店规则的按钮
    enableShopRule () {
      if ((!this.hasShopRulesID) || (this.hasShopRulesID.length === 0)) {
        this.$message.warning('请勾选要启用的规则！')
      } else {
        this.$confirm('确定要启用这些规则吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = this.hasShopRulesID
          reqRu('enableShopRule', params).then(res => {
            // console.log(res)
            if (res) {
              this.$message({
                type: 'success',
                message: '启用成功!'
              })
              this.reload()
            }
          })
        }).catch(() => {
          console.log('已取消！')
        })
      }
    },
    // 禁用小店规则的按钮
    disableShopRule () {
      if ((!this.hasShopRulesID) || (this.hasShopRulesID.length === 0)) {
        this.$message.warning('请勾选要禁用的规则！')
      } else {
        this.$confirm('确定要禁用这些规则吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = this.hasShopRulesID
          reqRu('disableShopRule', params).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '禁用成功!'
              })
              this.reload()
            }
          })
        }).catch(() => {
          console.log('已取消！')
        })
      }
    },
    // 刷新页面
    reload () {
      this.table.search = {}
    },
    // 查看规则详情
    checkRuleDetails (row) {
      this.$refs.newRuleDialog.openDialog(true, 'shopRule', row, true)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
