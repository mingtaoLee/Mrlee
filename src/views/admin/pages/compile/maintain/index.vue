<template>
  <div class="wrap">
    <i-layout headerKey="orgScaTitle">
      <!-- 左侧组织树形图 -->
      <div slot="aside">
        <org-tree showFilter @node-click="chooseNode" :treeStyle="treeStyle" @reset="resetTree"></org-tree>
      </div>

      <!-- 搜索部分 -->
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item>
            <span slot="label">组织类别</span>
            <i-select
              v-model="searchBox.orgType"
              parameter="ORG_TYPE"
              clearable
              placeholder="请选择"
            ></i-select>
          </el-form-item>
          <el-form-item>
            <span slot="label">所在地区</span>
            <i-select-area v-model="searchBox.belongArea" search></i-select-area>
          </el-form-item>
          <el-form-item>
            <span slot="label">组织业态</span>
            <i-select
              v-model="searchBox.businessType"
              parameter="ORG_BUSINESS_TYPE"
              clearable
              placeholder="请选择"
            ></i-select>
          </el-form-item>
          <el-form-item>
            <span slot="label">标准小店</span>
            <el-select v-model="searchBox.orgStandardId" filterable clearable>
              <el-option
                v-for="item in shopList"
                :key="item.orgStandardId"
                :label="item.orgStandardName"
                :value="item.orgStandardId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span slot="label">月份</span>
            <el-date-picker v-model="searchBox.scaDate" type="month" :editable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <span slot="label">编制状态</span>
            <i-select v-model="searchBox.scaStatus" parameter="SCA_STATUS" clearable></i-select>
          </el-form-item>
          <el-form-item>
            <span slot="label">职务</span>
            <el-select v-model="searchBox.posTitleId" filterable clearable>
              <el-option
                v-for="item in searcherTitle"
                :key="item.posTitleId"
                :label="item.name"
                :value="item.posTitleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </i-form>
      </div>

      <!-- 列表展示部分 -->
      <div slot="section">
        <div class="position-post">
          <i-table
            :table="table"
            v-loading="maintainLoading"
            :element-loading-text="$loadingText"
            @pageSizeChange="handleSizeChange"
            @pageIndexChange="handleCurrentChange"
          >
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                :cell-style="statusColor"
                style="width: 100%"
              >
                <el-table-column
                  prop="parentName"
                  label="上级组织"
                  min-width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="orgUnitCode"
                  label="组织代码"
                  min-width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="orgUnitName"
                  label="组织名称"
                  min-width="120"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-tooltip :content="scope.row.orgPathName" placement="top">
                      <div class="width90 single-text-overflow">
                      <span class="controller-link" @click="showDetails(scope)">
                        {{scope.row.orgUnitName}}
                      </span>
                    </div>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="posTitleName"
                  label="职务"
                  min-width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="scaLowerLimit"
                  label="编制下限"
                  align="right"
                  min-width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="scaUpperLimit"
                  label="编制上限"
                  align="right"
                  min-width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="actualScaleNum"
                  label="实际数"
                  align="right"
                  min-width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="scaStatus"
                  label="编制状态"
                  :formatter="tableScope.formatter"
                  min-width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="effectiveDate"
                  label="生效月份"
                  :formatter="tableScope.formatter"
                  min-width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="uneffectiveDate"
                  label="失效月份"
                  :formatter="tableScope.formatter"
                  min-width="120"
                  show-overflow-tooltip
                ></el-table-column>
                <!-- 组织全称 -->
                <el-table-column
                  prop="orgPathName"
                  label="组织全称"
                  :formatter="tableScope.formatter"
                  min-width="120"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </template>
          </i-table>
        </div>

        <!-- 查看编制信息的模态框组件-->
        <maintain-content-dialog ref="showDetails" :parentObj="parentObj"></maintain-content-dialog>
      </div>

    </i-layout>
  </div>
</template>

<script>
  import OrgTree from 'components/org/public/org-tree'
  import {filter} from 'utils/compile'
  import { windowOpen } from 'utils'
  import reqMa, {config} from 'api/compile/maintain/index'
  import req from 'api/compile'
  import MaintainContentDialog from './components/maintain-content-dialog'
  import ISelectArea from 'components/common/i-select-area'
  import asideMixin from 'mixins/aside'

  export default {
    name: 'MaintainHome',
    components: {
      OrgTree,
      MaintainContentDialog,
      ISelectArea
    },
    mixins: [asideMixin],
    data () {
      return {
        // 有效编制id集合
        scaTitleIds: [],
        // 表格的加载
        maintainLoading: false,
        // 保存页面弹性高度
        elHeight: 0,
        // 选择的组织节点
        chosenNode: null,
        // 搜索栏标准小店列表
        shopList: [],
        // 搜索栏职务列表
        searcherTitle: [],
        // 单击某行组织名称，将该行的信息传给子组件
        parentObj: {},
        // 存放表单数据
        searchBox: {
          orgType: '',
          area: '',
          businessType: '',
          orgStandardId: '',
          scaDate: '',
          scaStatus: '',
          posTitleId: ''
        },
        // 列表的内容
        table: {
          columns: [
            { prop: 'scaStatus', display: { dict: 'SCA_STATUS' } },
            { prop: 'effectiveDate', display: { date: 'short' } },
            { prop: 'uneffectiveDate', display: { date: 'short' } }
          ],
          // 配置在 setting 中
          setting: {
            toolbar: [{
              text: '调整编制',
              key: 'orgScaTitleUp',
              func: this.adjustOrg
            }, {
              text: '刷新状态',
              key: 'orgScaTitleNumUp',
              func: () => this.updateState()
            }],
            import: {
              text: '导入',
              key: 'orgScaTitleIntord',
              business: 'sca-title'
            },
            export: {
              text: '导出',                // 不合规范，以自身业务为准【可选】
              key: 'orgScaTitleExport',
              config: {                        // 【可选】
                fileName: '编制列表'              // 默认文件名
                // version: '',                // 默认后缀
                // range: '',                  // 默认范围
                // sync: true                  // 默认方式（同步/异步）
              },
              // sift: true,                   // 筛选导出字段
              req: config.getMaintainList     // api 配置信息（参数名以自身业务为准）【必填】
            }
          },
          info: null,
          data: null,
          total: 0,
          search: null,
          showPagebar: true
        }
      }
    },

    computed: {
      treeStyle () {
        return {
          height: this.elHeight + 'px'
        }
      }
    },

    created () {
      // 加载标准小店列表
      req('getShopList').then(data => {
        this.shopList = data
      })
      // 加载职务列表
      req('getTitleList').then(data => {
        this.searcherTitle = data
      })
    },

    mounted () {
      this.elHeight = this.$children[0].$el.offsetHeight - 118
      this.search()
    },

    methods: {
      // 状态颜色
      statusColor ({row, column, rowIndex, columnIndex}) {
        if (column.property === 'scaStatus') {
          // 缺编为蓝色，超编为红色
          if (row.scaStatus === '01') {
            return 'color: #409eff'
          } else if (row.scaStatus === '03') {
            return 'color: #f56c6c'
          }
        }
      },
      // 所选择的节点
      chooseNode (node) {
        this.chosenNode = node
        this.search()
      },
      // 重置组织树
      resetTree () {
        this.chosenNode = null
        this.reset()
        this.search()
      },
      // 根据搜索条件，获取编制列表
      fetch (params = {}) {
        this.maintainLoading = true
        reqMa('getMaintainList', params).then(res => {
          if (res) {
            this.maintainLoading = false
            this.table = Object.assign(this.table, res)
            // 获取页面编制id
            this.scaTitleIds = []
            this.table.data.map(obj => {
              this.scaTitleIds.push(obj.scaTitleId)
            })
            // 调用asideMixin的控制高度方法，使得每页数据量改变时高度随之改变
            this.controlHeightWithoutHeader(96)
          }
        })
      },
      // 搜索按钮---过滤，拼接参数
      search () {
        let params = filter(this.searchBox)
        if (this.chosenNode) {
          params.orgUnitId = this.chosenNode.orgUnitId
        }
        this.table.search = params
      },
      // 重置的按钮
      reset () {
        Object.keys(this.searchBox).map(key => {
          this.searchBox[key] = null
        })
      },
      // 每页展示多少条数据
      handleSizeChange (params) {
        if (this.chosenNode) {
          params.orgUnitId = this.chosenNode.orgUnitId
        }
        this.fetch(params)
      },
      // 获取置顶页数数据
      handleCurrentChange (params) {
        if (this.chosenNode) {
          params.orgUnitId = this.chosenNode.orgUnitId
        }
        this.fetch(params)
      },
      // 根据职位id查看明细
      showDetails (scope) {
        this.parentObj = scope.row
        this.$refs.showDetails.showDialog = true
      },
      // 刷新状态
      updateState () {
        let params = this.scaTitleIds
        reqMa('updateState', params).then(res => {
          if (res) {
            this.$message.success('刷新成功')
            this.table.search = {}
          } else {
            this.$message.warning('刷新失败')
          }
        })
      },
      // 跳转修改页面
      adjustOrg () {
        windowOpen('/flow.html#/flow/scaTitleUpdateProcess', { processType: 'scaTitleUpdateProcess' })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

