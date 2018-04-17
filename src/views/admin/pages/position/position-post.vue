<template>
  <div class="wrap">
    <i-layout :asidePadding="0" headerKey="orgPosPos">

        <!-- 左侧组织树形图 -->
        <div slot="aside">
          <div class="pt15"></div>
          <org-tree showFilter @node-click="chooseNode"  :treeStyle="treeStyle" @reset="resetTree"></org-tree>
        </div>


        <!-- 高级搜索 -->
        <div slot="header">
           <i-form @reset="reset" @search="search">
              <el-form-item>
                <span slot="label">职位名称</span>
                <el-input v-model="searchBox.name" maxlength="20" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label">状态</span>
                <i-select v-model="searchBox.status" parameter="POSITION_STATUS" clearable placeholder="请选择"></i-select>
              </el-form-item>
              <el-form-item>
                <span slot="label">职群职种</span>
                <i-select-tree
                  :lazy="false"
                  dataKey="jobFamilys"
                  nodeKey="posJobFamilyId"
                  v-model="searchBox.posJobFamilyId"
                  :selectedNode.sync="node"
                  :props="defaultProps"
                  @input="handleOccupationChange"
                   placeholder="请选择"
                ></i-select-tree>
              </el-form-item>
              <el-form-item>
                <span slot="label">标准职位</span>
                <el-select v-model="searchBox.posStandardJobId" clearable filterable placeholder="请选择">
                  <el-option v-for="item in searcherStandardOc" :key="item.posStandardJobId" :label="item.posStandardJobName" :value="item.posStandardJobId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <span slot="label">品类</span>
                <el-select v-model="searchBox.categoryId" multiple filterable placeholder="请选择" collapse-tags>
                  <el-option v-for="item in searcherCategory" :key="item.posCategoryId" :label="item.name" :value="item.posCategoryId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <span slot="label">编码</span>
                <el-input v-model="searchBox.code" maxlength="20" placeholder="请输入"></el-input>
              </el-form-item>
             <el-form-item>
                <span slot="label">开始日期</span>
                <el-date-picker
                  v-model="searchBox.startEffectiveDate"
                  type="date"
                  :editable="false"
                  @change="monitor"
                  placeholder="请选择"
                  ref="startEffectiveDate">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <span slot="label">结束日期</span>
                <el-date-picker
                  v-model="endDate"
                  type="date"
                  :editable="false"
                  @change="addDate"
                  ref="endEffectiveDate"
                  placeholder="请选择"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
           </i-form>
        </div>

        <!-- 职位列表展示 -->
        <div slot="section">
            <div class="position-post">
            <i-table
              :table="table"
              @pageIndexChange="handleCurrentChange"
              @pageSizeChange="handleSizeChange"
              v-loading="allPanelLoading"
              :element-loading-text="$loadingText"
            >
              <template slot="table"  slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="positionLoading"
                :element-loading-text="$loadingText">
                <el-table-column
                  type="selection"
                  width="55"
                  fixed="left"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="职位名称"
                  min-width="220"
                  align="left"
                  prop="name"
                  show-overflow-tooltip
                  >
                  <template slot-scope="scope">
                    <div>
                      <div class="width90 single-text-overflow">
                        <a class="controller-link"
                          @click="showDetails(scope)">
                          {{scope.row.name}}
                        </a>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="code"
                  label="编码"
                  align="left"
                  width="100"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="posJobFamilyName"
                  label="所属职群"
                  align="left"
                  min-width="120"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="jobClassName"
                  label="所属职种"
                  align="left"
                  min-width="160"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="subJobClassName"
                  label="所属子职种"
                  align="left"
                  min-width="160"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="posStandardJobName"
                  label="所属标准职位"
                  align="left"
                  min-width="150"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="posTitleName"
                  label="职务"
                  align="left"
                  min-width="120"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="posCategoryName"
                  label="品类"
                  align="left"
                  min-width="200"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="status"
                  label="状态"
                  align="left"
                  min-width="100"
                  :formatter="tableScope.formatter"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <status-control  :scope="scope" :tableScope="tableScope" bussinessKey="posPositionId"></status-control>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="lastUpdateCode"
                  label="操作人工号"
                  align="left"
                  min-width="150"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="lastUpdateBy"
                  label="操作人姓名"
                  align="left"
                  min-width="150"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="lastUpdateDate"
                  label="操作时间"
                  min-width="150"
                  :formatter="tableScope.formatter"
                  align="left"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="effectiveDate"
                  label="生效日期"
                  min-width="150"
                  :formatter="tableScope.formatter"
                  align="left"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="uneffectiveDate"
                  label="失效日期"
                  min-width="150"
                  :formatter="tableScope.formatter"
                  align="left"
                  show-overflow-tooltip
                />
                <i-table-operator :table="tableScope"/>
              </el-table>
              </template>
            </i-table>
            </div>
          <!-- 查看标准职位窗口 -->
          <check-standard-job-details ref="checkDetails" :id="posPositionId" :isStandard="false"></check-standard-job-details>
        </div>

    </i-layout>
  </div>
</template>

<script>
import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import IForm from 'components/common/i-form/i-form.vue'
import ISelect from 'components/common/i-select/i-select.vue'
import { windowOpen } from 'utils'
import OrgTree from 'components/org/public/org-tree'
import req, {config} from 'api/position/position-post'
import CheckStandardJobDetails from './check-standard-job-details'
import StatusControl from './status-control'
import {filter} from 'utils/compile'
import date from './mixins/date'
import tableHadle from './mixins/table-handle'

export default {
  name: 'StandardOc',
  components: {
    OrgTree,
    CheckStandardJobDetails,
    IForm,
    ISelect,
    ISelectTree,
    StatusControl
  },
  mixins: [date, tableHadle],
  data () {
    return {
      allPanelLoading: false,
      // 表格的loading
      positionLoading: false,
      // 选择的组织节点
      chosenNode: null,
      // 保存页面弹性高度
      elHeight: 0,
      options: [],
      // 存放标准职位可选列表
      searcherStandardOc: [],
      // 职群职种选中的节点
      node: {},
      // 存放表单数据
      searchBox: {
        name: '',
        posStandardJobId: '',
        status: '',
        categoryId: [],
        startEffectiveDate: '',
        endEffectiveDate: '',
        posJobFamilyId: ''
      },
      // 实际树节点数据
      ocTree: [],
      // 完整树节点数据
      allOcTree: [],
      // 保存选择职位id
      selectedPosPositionIds: [],
      // 搜索栏品类列表
      searcherCategory: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      table: {
        columns: [
          { prop: 'status', display: { dict: 'POSITION_STATUS' } },
          { prop: 'lastUpdateDate', display: { date: '' } },
          { prop: 'effectiveDate', display: { date: '' } },
          { prop: 'uneffectiveDate', display: { date: '' } }
        ],
        setting: {
          operator: [{
            text: '修改',
            key: 'orgPosPosUpdate',
            func: row => this.modifyStandardOc(row)
          }, {
            text: '撤销',
            key: 'orgPosPosRepeal',
            func: row => this.cancelStandardOc(row)
          }],
          toolbar: [{
            text: '新增',
            key: 'orgPosPosCreate',
            func: this.newPosition
          }, {
            text: '删除',
            key: 'orgPosPosDel',
            type: 'danger',
            func: this.deletePosition
          }],
          export: {
            text: '导出',              // 可选（不合规范，不推荐填写）
            key: 'orgPosPosExport',
            config: {                      // 可选
              fileName: '职位列表',            // 默认文件名
              // version: '',              // 默认后缀
              // range: '',                // 默认范围
              sync: false                // 默认方式（同步/异步）
            },
            req: config.getPostList        // 必填
          },
          import: {
            business: 'pos-position',
            key: 'orgPosPosIntord'
          }
        },
        info: null,
        data: null,
        total: 0,
        search: '',
        showPagebar: true
      },
      posPositionId: ''
    }
  },

  methods: {
    chooseNode (node) {
      this.allPanelLoading = true
      this.chosenNode = node
      this.$store.commit('SET_ORG_NODE', node)
      this.reset()
      this.search()
    },
    // 每页展示多少条数据
    handleSizeChange (params) {
      params.orgUnitId = this.$store.state.occupation.orgNode.orgUnitId
      this.fetch(params)
    },
    // 获取置顶页数数据
    handleCurrentChange (params) {
      params.orgUnitId = this.$store.state.occupation.orgNode.orgUnitId
      this.fetch(params)
    },
    // 获取选择的项
    handleSelectionChange (c) {
      this.selectedPosPositionIds = []
      c.map(ele => {
        if (!this.selectedPosPositionIds.includes(ele.posPositionId)) {
          this.selectedPosPositionIds.push(ele.posPositionId)
        }
      })
    },
    // 重置函数
    reset () {
      this.searchBox = {
        name: '',
        posStandardJobId: '',
        status: '',
        categoryId: [],
        startEffectiveDate: '',
        endEffectiveDate: '',
        posJobFamilyId: ''
      }
      // 修复重置字段问题
      this.$refs.startEffectiveDate.$children[0].currentValue = ''
      this.$refs.endEffectiveDate.$children[0].currentValue = ''
    },
    // 根据搜索条件，获取职位列表
    fetch (params = {}) {
      this.positionLoading = true
      req('getPostList', params).then(res => {
        if (res) {
          ({ info: this.table.info, data: this.table.data, total: this.table.total } = { ...res })
          this.table.data.forEach(ele => {
          // 将对象数组中的数据分开，id为id数据，name为name数组
            var temPosCategoryId = []
            var temPosCategoryName = []
            ele.categorys.forEach(el => {
              temPosCategoryId.push(el.posCategoryId)
              temPosCategoryName.push(el.posCategoryName)
            })
            ele.posCategoryId = temPosCategoryId
            ele.posCategoryName = temPosCategoryName.join('，')
          // 清空数据
            temPosCategoryId = null
            temPosCategoryName = null

          // 格式化生效时间
            // ele.effectiveDate = ele.effectiveDate ? moment(ele.effectiveDate).format('YYYY-MM-DD') : ''
          })
        }
        // todo:查询后由于列表高度变化，这里需要根据实际情况调整树的高度
        this.controlTreeHeight()
        this.positionLoading = false
        this.allPanelLoading = false
      })
    },
    search () {
      // 过滤，拼接参数
      let params = filter(this.searchBox)
      if (this.chosenNode) {
        params.orgUnitId = this.chosenNode.orgUnitId
      }
      if (this.node && this.searchBox.posJobFamilyId) {
        params.jobFamilyType = this.node.jobFamilyType
      }
      this.table.search = { ...params }
    },
    // 重置组织树
    resetTree () {
      this.$store.commit('SET_ORG_NODE', {})
      this.reset()
      this.search()
    },
    // 选择不同的职群职种，加载不同的标准职位列表
    handleOccupationChange (id) {
      this.searchBox.posStandardJobId = ''
      req('getStandardJobByOccupation', {posJobFamilyId: id}).then(data => {
        this.searcherStandardOc = data
      })
    },
    // 根据职位id查看明细
    showDetails (scope) {
      this.posPositionId = scope.row.posPositionId
      this.$refs.checkDetails.showDialog = true
    },
    // 跳转新增页面
    newPosition () {
      if (this.chosenNode && this.chosenNode.status === '2') {
        return this.$message.warning('已冻结组织下不允许新建职位！')
      }
      var that = this
      let params = {
        operationType: 0,
        orgUnitId: this.$store.state.occupation.orgNode.orgUnitId,
        orgUnitName: this.$store.state.occupation.orgNode.orgPathName,
        orgNode: JSON.stringify(this.$store.state.occupation.orgNode),
        processType: 'positionCreateProcess'
      }
      windowOpen('/flow.html#/flow/positionCreateProcess', params)
      // 表单确认刷新页面
      window.formConfirm = function (bool) {
        if (bool) {
          that.fetch()
        }
      }
    },
    // 批量新建职位页面
    newBatchPosition () {
      let params = {
        operationType: 0,
        orgUnitId: this.$store.state.occupation.orgNode.orgUnitId,
        orgUnitName: this.$store.state.occupation.orgNode.orgPathName,
        orgNode: JSON.stringify(this.$store.state.occupation.orgNode),
        processType: 'positionBatchCreateProcess'
      }
      windowOpen('/flow.html#/flow/positionBatchCreateProcess', params)
    },
    // 跳转修改页面
    modifyStandardOc (row) {
      if (row.status !== '1') {
        return this.$message({
          message: '非启用状态下不允许修改职位',
          type: 'warning'
        })
      }
      var that = this
      let params = {
        operationType: 1,
        posPositionId: row.posPositionId,
        orgNode: Object.keys(this.$store.state.occupation.orgNode).length > 0
        ? JSON.stringify(this.$store.state.occupation.orgNode)
        : JSON.stringify(
          {
            orgUnitId: row.orgUnitId,
            orgUnitName: row.orgUnitName
          }
        ),
        processType: 'positionUpdateProcess'
      }
      windowOpen('/flow.html#/flow/positionUpdateProcess', params)
      // 表单确认刷新页面
      window.formConfirm = function (bool) {
        if (bool) {
          that.fetch()
        }
      }
    },
    // 跳转撤销页面
    cancelStandardOc (row) {
      if (row.status !== '1') {
        return this.$message({
          message: '非启用状态下不允许撤销职位',
          type: 'warning'
        })
      }
      var that = this
      let params = {
        operationType: 2,
        posPositionId: row.posPositionId,
        posPositionName: row.name,
        processType: 'positionRepealProcess'
      }
      windowOpen('/flow.html#/flow/positionRepealProcess', params)
      // 表单确认刷新页面
      window.formConfirm = function (bool) {
        if (bool) {
          that.fetch()
        }
      }
    },
    deletePosition () {
      var that = this
      if (this.selectedPosPositionIds.length === 0) {
        return this.$message({
          message: '请先选择职位',
          type: 'warning'
        })
      }
      let params = {
        posPositionIds: this.selectedPosPositionIds.join(',')
      }
      req('checkDeletePosition', params).then(res => {
        if (res) {
          this.$confirm('此操作将永久删除职位, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {
              posPositionIds: this.selectedPosPositionIds.join(',')
            }
            req('deletePosition', params).then(res => {
              if (res) {
                this.$alert('删除成功！', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    that.chooseNode(this.$store.state.occupation.orgNode)
                  }
                })
              }
            })
          }).catch(() => {
            that.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      })
    },
    // 控制树的高度
    controlTreeHeight () {
      this.$nextTick(() => {
        let minHeight = window.innerHeight - 115
        let changingHeight = this.$children[0].$el.children[1].childNodes[0].clientHeight +
         this.$children[0].$el.children[1].childNodes[2].children[0].clientHeight + 15
        this.elHeight = (changingHeight > minHeight ? changingHeight : minHeight) - 96
      })
    }
  },

  computed: {
    treeStyle () {
      return {
        height: this.elHeight + 'px'
      }
    }
  },

  mounted () {
    this.elHeight = this.$children[0].$el.offsetHeight - 90
    this.search()
  },

  created () {
    this.$store.commit('SET_ORG_NODE', {})
    // 加载品类列表
    req('getCategoryList').then(data => {
      this.searcherCategory = data
    })
  }
}
</script>

<style lang="scss" scoped>
.topText {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
  line-height: 11px;
  width: 100%;
}
.right{
  float: right;
}
.width90{
  width: 90%;
}
</style>
