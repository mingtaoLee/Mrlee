<template>
  <div class="wrap">
    <i-layout :asidePadding="0" headerKey="orgPosStandardJob">

        <!-- 左侧树形图 -->
        <job-family-tree @nodeClick="showDetails" slot="aside" :treeHeight="elHeight" @familyArray="getFamilyArray" @tree="getOriginTree"
        @clearNode="clearNode" cancelButton />

        <!-- 高级搜索 -->
        <div slot="header">
            <i-form @reset="reset" @search="submitSearcher()">
              <el-form-item>
                <span slot="label">标准职位</span>
                <el-input v-model="searchBox.standardJobName" maxlength="20" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label">状态</span>
                <i-select v-model="searchBox.status" parameter="POSITION_STATUS" clearable placeholder="请选择"></i-select>
              </el-form-item>
              <el-form-item>
                <span slot="label">职务</span>
                <el-select v-model="searchBox.posTitleId" clearable filterable placeholder="请选择">
                  <el-option v-for="item in searcherTitle" :key="item.posTitleId" :label="item.name" :value="item.posTitleId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <span slot="label">编码</span>
                <el-input v-model="searchBox.code" maxlength="20" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="开始日期">
                <el-date-picker
                  v-model="searchBox.startEffectiveDate"
                  type="date"
                  :editable="false"
                  @change="monitor"
                  placeholder="请选择"
                  ref="startEffectiveDate">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束日期">
                <el-date-picker
                  v-model="endDate"
                  type="date"
                  :editable="false"
                  @change="addDate"
                  placeholder="请选择"
                  ref="endEffectiveDate"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </i-form>
        </div>

          <!-- 标准职位表格展示部分 -->
          <!-- <div slot="section-title" >
            <p class="topText">
              <span class="topTextLeft">当前选择:&nbsp;
                <span class="bold">{{chosen}}</span>
              </span>
            </p>
          </div> -->
        <div slot="section">
            <div class="standard-oc">
            <i-table
              :table="standardOcTable"
              @pageIndexChange="handleCurrentChange"
              @pageSizeChange="handleSizeChange"
              v-loading="allPanelLoading"
              :element-loading-text="$loadingText">
              <template slot="table"  slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="standardOcLoading"
                :element-loading-text="$loadingText">
                <el-table-column type="selection" width="55" fixed="left" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="标准职位名称" prop="name" align="left" min-width="220" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div class="width90 single-text-overflow">
                      <a class="controller-link" @click="checkStandardOc(scope.row.posStandardJobId)">
                        {{scope.row.name}}
                      </a>
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
                  prop="posTitleName"
                  label="职务"
                  align="left"
                  min-width="120"
                  show-overflow-tooltip
                />
                <el-table-column
                  :formatter="tableScope.formatter"
                  prop="effectiveDate"
                  label="生效日期"
                  align="left"
                  min-width="150"
                  show-overflow-tooltip
                />
                <el-table-column
                  :formatter="tableScope.formatter"
                  prop="uneffectiveDate"
                  label="失效日期"
                  align="left"
                  min-width="150"
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
                    <status-control  :scope="scope" :tableScope="tableScope" bussinessKey="posStandardJobId"></status-control>
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
                <i-table-operator :table="tableScope"/>
              </el-table>
              </template>
            </i-table>
            </div>

          <!-- 查看标准职位窗口 -->
          <check-standard-job-details ref="checkDetails" :id="posStandardJobId"></check-standard-job-details>

        </div>

    </i-layout>
  </div>
</template>

<script>
import { getTreeChosen } from 'utils/position'
import { windowOpen } from 'utils'
// import reqOc from 'api/position/occupation'
import req, {config} from 'api/position/standard-oc'
import moment from 'moment'
import CheckStandardJobDetails from './check-standard-job-details'
import IForm from 'components/common/i-form/i-form'
import ISelect from 'components/common/i-select/i-select'
import JobFamilyTree from './job-family-tree'
import {filter} from 'utils/compile'
import StatusControl from './status-control'
import date from './mixins/date'
import tableHadle from './mixins/table-handle'

export default {
  name: 'StandardOc',
  components: {
    CheckStandardJobDetails,
    IForm,
    ISelect,
    JobFamilyTree,
    StatusControl
  },
  mixins: [date, tableHadle],
  data () {
    return {
      filterText: '',
      chosen: '',
      kind: '',
      // 保存职群职种树的数据
      cancelArray: [],
      freezeArray: [],
      originTree: [],
      // 保存页面弹性高度
      elHeight: 0,
      // 保存被选择的标准职位id
      chosedOc: [],
      // 高级搜索数据
      searchBox: {
        startEffectiveDate: '',
        endEffectiveDate: '',
        standardJobName: '',
        posTitleId: '',
        status: ''
      },
      // 搜索栏职务列表
      searcherTitle: [],
      // 某个id下的标准职位对应的详细数据
      standardOcDetail: {},
      // 保存被选择的节点
      selectedPosStandardJobIds: [],
      allPanelLoading: false,
      standardOcLoading: false,
      standardOcTable: {
        columns: [
          { prop: 'status', display: { dict: 'POSITION_STATUS' } },
          { prop: 'effectiveDate', display: { date: '' } },
          { prop: 'uneffectiveDate', display: { date: '' } },
          { prop: 'lastUpdateDate', display: { date: '' } }
        ],
        setting: {
          operator: [{
            text: '修改',
            key: 'orgPosStdJobUpdate',
            func: row => this.modifyStandardOc(row, row.posStandardJobId)
          }, {
            text: '撤销',
            key: 'orgPosStdJobRepeal',
            func: row => this.cancelStandardOc(row, row.posStandardJobId, row.name)
          }],
          toolbar: [{
            text: '新增',
            key: 'orgPosStdJobCreate',
            func: this.newStandardOc
          }, {
            text: '删除',
            key: 'orgPosStdJobDel',
            type: 'danger',
            func: this.delStandardOc
          }],
          export: {
            text: '导出',              // 可选（不合规范，不推荐填写）
            key: 'orgPosStdJobExport',
            config: {                      // 可选
              fileName: '标准职位列表'            // 默认文件名
              // version: '',              // 默认后缀
              // range: '',                // 默认范围
              // sync: true                // 默认方式（同步/异步）
            },
            req: config.getStandardJobDetails        // 必填
          },
          import: {
            business: 'pos-standardJob',
            key: 'orgPosStdJobIntord'
          }
        },
        info: null,
        data: null,
        search: null,
        total: 0,
        showPagebar: true
      },
      posStandardJobId: ''
    }
  },

  methods: {
    getFamilyArray (cancelArray, freezeArray) {
      this.cancelArray = cancelArray
      this.freezeArray = freezeArray
      this.standardOcTable.search = this.getParams()
    },
    getOriginTree (originTree) {
      this.originTree = originTree
    },
    showDetails (node) {
      // var that = this
      // that.standardOcLoading = true
      this.allPanelLoading = true
      this.chosen = getTreeChosen(node)
      // var getByData = {
      //   posJobFamilyId: node.key,
      //   jobFamilyType: node.level - 1
      // }
      // reqOc('getDetailsByTreeId', getByData).then(data => {
      //   that.standardOcLoading = false
      //   if (data.error) {
      //     // 如果服务器出错了
      //     that.$message.error('信息加载失败')
      //   }
      //   // 将选择的节点存进store中
      //   that.$store.commit('SET_NODE', node)
      //   // 搜索详细标准职位数据
      //   // 重置搜索框
      //   this.reset()
      // })
      this.submitSearcher()
    },
    // 整理搜索的条件
    getParams () {
      var searchContent = filter(this.searchBox)
      if (Object.keys(this.$store.state.occupation.node).length !== 0) {
        searchContent.posJobFamilyId = this.$store.state.occupation.node.key
        searchContent.jobFamilyType = this.$store.state.occupation.node.level - 1
      }
      return searchContent
    },
    // 高级搜索查询事件
    submitSearcher () {
      // this.standardOcLoading = true
      this.standardOcTable.search = this.getParams()
    },
    // 高级搜索重置事件
    reset () {
      this.searchBox = {
        startEffectiveDate: '',
        endEffectiveDate: '',
        standardJobName: '',
        posTitleId: '',
        categoryId: [],
        status: ''
      }
      // 修复时间控件用户填写填写错误字段，重置不了的问题
      this.$refs.startEffectiveDate.$children[0].currentValue = ''
      this.$refs.endEffectiveDate.$children[0].currentValue = ''
    },
    // 标准职位选择事件
    handleSelectionChange (e) {
      this.selectedPosStandardJobIds = []
      e.map(ele => {
        if (!this.selectedPosStandardJobIds.includes(ele.posStandardJobId)) {
          this.selectedPosStandardJobIds.push(ele.posStandardJobId)
        }
      })
    },
    // 搜索函数
    fetch (options = {}) {
      var that = this
      this.standardOcLoading = true
      req('getStandardJobDetails', options).then(data => {
        that.standardOcLoading = false
        that.allPanelLoading = false
        that.standardOcTable.data = data.data
        that.standardOcTable.data.forEach(ele => {
          // 将对象数组中的数据分开，id为id数据，name为name数组
          // var temPosCategoryId = []
          // var temPosCategoryName = []
          // ele.categorys.forEach(el => {
          //   temPosCategoryId.push(el.posCategoryId)
          //   temPosCategoryName.push(el.posCategoryName)
          // })
          // ele.posCategoryId = temPosCategoryId
          // ele.posCategoryName = temPosCategoryName.join('，')
          // // 清空数据
          // temPosCategoryId = null
          // temPosCategoryName = null

          // 格式化生效时间
          ele.effectiveDate = ele.effectiveDate ? moment(ele.effectiveDate).format('YYYY-MM-DD') : ''
        })
        // 保存页码等信息
        that.standardOcTable.total = Number(data.total) || 0
        that.standardOcTable.info = data.info
        // todo:查询后由于列表高度变化，这里需要根据实际情况调整树的高度
        that.controlTreeHeight()
      })
    },
    searchStandardJobDetails () {
      this.standardOcTable.search = this.getParams()
    },
    clearNode (e) {
      this.chosen = ''
      this.panel = {}
      // 清空列表
      this.reset()
      this.standardOcTable.search = this.getParams()
    },
    checkStandardOc (id) {
      this.posStandardJobId = id
      this.$refs.checkDetails.showDialog = true
    },
    newStandardOc () {
      if (!this.checkPermited()) {
        return
      }
      if (this.cancelArray.includes(this.$store.state.occupation.node.key)) {
        return this.$message({
          message: '已撤销职群或职种节点下不允许新建标准职位',
          type: 'warning'
        })
      }
      if (
        Object.keys(this.$store.state.occupation.node) === 0 ||
        this.chosen === ''
      ) {
        return this.$message({
          message: '请先选择职种或子职种',
          type: 'warning'
        })
      }
      if (
        this.$store.state.occupation.node.childNodes.length !== 0 ||
        this.$store.state.occupation.node.level === 1 ||
        this.checkIfChildNode(this.originTree, this.$store.state.occupation.node)
      ) {
        return this.$message({
          message: '请选择该节点的最后一级的职种或子职种',
          type: 'warning'
        })
      }
      var params = {
        operationType: 0,
        posJobFamilyId: this.$store.state.occupation.node.key,
        posJobFamilyName: this.$store.state.occupation.node.label,
        // jobClassId: this.getNode(this.$store.state.occupation.node, 2).key || '',
        // jobClassName: this.getNode(this.$store.state.occupation.node, 2).label || '',
        // subJobClassId: this.getNode(this.$store.state.occupation.node, 3).key || '',
        // subJobClassName: this.getNode(this.$store.state.occupation.node, 3).label || '',
        jobFamilyType: this.$store.state.occupation.node.level - 1,
        processType: 'standardJobCreateProcess'
      }
      // console.log('新建标准职位的参数', params)
      windowOpen('/flow.html#/flow/standardJobCreateProcess', params)
      // 表单确认刷新页面
      // window.formConfirm = function (bool) {
      //   if (bool) {
      //     that.showDetails(that.$store.state.occupation.node)
      //   }
      // }
    },
    delStandardOc () {
      var that = this
      if (this.selectedPosStandardJobIds.length === 0) {
        return this.$message({
          message: '请先选择标准职位',
          type: 'warning'
        })
      }
      let params = {
        posStandardJobIds: this.selectedPosStandardJobIds.join(',')
      }
      req('checkDeleteStandardJob', params).then(res => {
        if (res) {
          this.$confirm('此操作将永久删除标准职位, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {
              posStandardJobIds: this.selectedPosStandardJobIds.join(',')
            }
            req('deleteStandardJob', params).then(res => {
              if (res) {
                this.$alert('删除成功！', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    that.standardOcTable.search = that.getParams()
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
    modifyStandardOc (row, id) {
      if (row.status !== '1') {
        return this.$message({
          message: '非启用状态下不允许修改标准职位',
          type: 'warning'
        })
      }
      if (this.cancelArray.includes(this.$store.state.occupation.node.key)) {
        return this.$message({
          message: '已撤销职群或职种节点下不允许修改标准职位',
          type: 'warning'
        })
      }
      var params = {
        operationType: 1,
        posStandardJobId: id,
        jobFamilyType: this.$store.state.occupation.node.level - 1,
        processType: 'standardJobUpdateProcess'
      }
      console.log('修改标准职位的参数', params)
      windowOpen('/flow.html#/flow/standardJobUpdateProcess', params)
      // 表单确认刷新页面
      // window.formConfirm = function (bool) {
      //   if (bool) {
      //     that.showDetails(that.$store.state.occupation.node)
      //   }
      // }
    },
    cancelStandardOc (row, id, name) {
      if (row.status !== '1') {
        return this.$message({
          message: '非启用状态下不允许撤销标准职位',
          type: 'warning'
        })
      }
      if (this.cancelArray.includes(this.$store.state.occupation.node.key)) {
        return this.$message({
          message: '已撤销职群或职种节点下不允许撤销标准职位',
          type: 'warning'
        })
      }
      var params = {
        operationType: 2,
        posStandardJobId: id,
        posJobFamilyId: this.$store.state.occupation.node.key,
        jobFamilyType: this.$store.state.occupation.node.level - 1,
        jobClassId: this.getNode(this.$store.state.occupation.node, 2).key || '',
        subJobClassId: this.getNode(this.$store.state.occupation.node, 3).key || '',
        name,
        processType: 'standardJobRepealProcess'
      }
      console.log('撤销标准职位的参数', params)
      windowOpen('/flow.html#/flow/standardJobRepealProcess', params)
      // 表单确认刷新页面
      // window.formConfirm = function (bool) {
      //   if (bool) {
      //     that.showDetails(that.$store.state.occupation.node)
      //   }
      // }
    },
    checkPermited () {
      // if (this.cancelArray.includes(this.$store.state.occupation.node.key)) {
      //   this.$message({
      //     message: '已撤销职群或职种节点下不允许操作',
      //     type: 'warning'
      //   })
      //   return false
      // }
      if (this.freezeArray.includes(this.$store.state.occupation.node.key)) {
        this.$message({
          message: '已冻结职群或职种节点下不允许操作',
          type: 'warning'
        })
        return false
      }
      return true
    },
    getNode (node, level) {
      if (node.level >= level) {
        if (node.level === level) {
          return node
        }
        return this.getNode(node.parent, level)
      } else {
        return ''
      }
    },
    // 检查节点是否具有下属节点
    checkIfChildNode (tree, node) {
      let flag = false
      tree.forEach(ele => {
        if (ele.posJobFamilyId === node.key) {
          tree.forEach(el => {
            if (el.parentId === ele.posJobFamilyId) {
              flag = true
            }
          })
        }
      })
      return flag
    },
    // 控制树的高度
    controlTreeHeight () {
      this.$nextTick(() => {
        let minHeight = window.innerHeight - 115
        let changingHeight = this.$children[0].$el.children[1].childNodes[0].clientHeight +
         this.$children[0].$el.children[1].childNodes[2].children[0].clientHeight + 15
        this.elHeight = (changingHeight > minHeight ? changingHeight : minHeight) - 95
      })
    }
  },

  mounted () {
    this.elHeight = this.$children[0].$el.clientHeight - 95
  },

  created () {
    var that = this
    // 加载职务列表
    req('getTitleList').then(data => {
      that.searcherTitle = data
    })
    // 清空点击的点
    this.$store.state.occupation.node = {}
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
.width90{
  width: 90%;
}
</style>
