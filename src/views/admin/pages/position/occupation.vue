<template>
<div>
  <i-layout ref="layout" :asidePadding="0">

      <!-- 树形图部分 -->
      <div slot="aside">
        <div
          v-if="accessMap.orgPosJobFamilyCreate||accessMap.orgPosJobFamilyUpdate||accessMap.orgPosJobFamilyRepeal||accessMap.orgPosJobFamilyDel"
          class="top-button"
          @click.stop
        >
          <i-control-layout :toolbar="toolbar" :btnCol="3" moreBtnType="default"></i-control-layout>
        </div>

        <job-family-tree @nodeClick="showDetails" ref="tree"  :treeHeight="elHeight" @familyArray="getFamilyArray"
        @clearNode="clearNode" cancelButton  />
      </div>

      <!-- 信息表格展示面板 -->
      <!-- <div slot="section-title" @click.stop>
        <p class="topText">
          <span class="topTextLeft">当前选择:&nbsp;
            <span class="bold">{{chosen}}</span>
          </span>
        </p>
      </div> -->
      <div slot="section" @click.stop  v-loading="panelLoading" :element-loading-text="$loadingText">
        <el-tabs v-model="activeName" @tab-click="handleClick">

          <!-- 基本信息栏目 -->
          <el-tab-pane label="基本信息" name="first">
            <div>
              <div>
                <p class="nameControl"><span class="nameTitle">编码</span></p>
                <span class="content">{{panel.code}}</span>
              </div>
              <div>
                <p class="nameControl"><span class="nameTitle">类别</span></p>
                <span class="content">{{typeConfig[$store.state.occupation.node.level - 1]}}</span>
              </div>
              <div>
                <p class="nameControl"><span class="nameTitle">状态</span></p>

                <div class="content" :style="{display:'inline-block'}">
                  <status-control type="section" :label="showingStatus" :status="panel.status"
                  bussinessKey="bussinessKey" :id="panel.posJobFamilyId"></status-control>
                </div>
              </div>
              <div>
                <p class="nameControl"><span class="nameTitle">生效日期</span></p>
                <span class="content">{{panel.effectiveDate}}</span>
              </div>
              <div>
                <p class="nameControl"><span class="nameTitle">失效日期</span></p>
                <span class="content">{{panel.uneffectiveDate}}</span>
              </div>
              <div>
                <p class="nameControl"><span class="nameTitle">操作人</span></p>
                <span class="content">{{panel.lastUpdateBy}}</span>
              </div>
              <div>
                <p class="nameControl"><span class="nameTitle">操作人工号</span></p>
                <span class="content">{{panel.lastUpdateCode}}</span>
              </div>
              <div>
                <p class="nameControl"><span class="nameTitle">操作时间</span></p>
                <span class="content">{{panel.lastUpdateDate?moment(new Date(panel.lastUpdateDate)).format('YYYY-MM-DD'):''}}</span>
              </div>
              <div>
                <p class="nameControl"><span class="nameTitle">备注</span></p>
                <span class="content">{{panel.remark}}</span>
              </div>
            </div>
          </el-tab-pane>

          <!-- 标准职位表格展示栏目 -->
          <el-tab-pane name="second">
            <span slot="label">标准职位({{panel.standardJobNum}})</span>
            <div class="ac">
              <div class="panel-right-searcher">
                <el-input placeholder="搜索标准职位" v-model="ocFilter" @keyup.enter.native="searchStandardOc">
                  <i class="el-icon-search" slot="suffix" @click="searchStandardOc"></i>
                </el-input>
              </div>
              <div class="standard-oc">
              <i-table :table="standardOcTable" @pageIndexChange="handleOcChange" @pageSizeChange="handleOcChange" v-loading="standardOcLoading" :element-loading-text="$loadingText">
                <template slot="table" slot-scope="tableScope">
                <el-table :data="tableScope.clone" style="width: 100%" ref="standardOcTable" v-loading="standardOcTableLoading" :element-loading-text="$loadingText">
                  <el-table-column prop="name" label="标准职位名称" width="180" align="left" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="posJobFamilyName" label="所属职群" width="180" align="left" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="jobClassName" label="所属职种" align="left" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="subJobClassName" label="所属子职种" align="left" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="posTitleName" label="职务" align="left" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" align="left" :formatter="tableScope.formatter" show-overflow-tooltip>
                  </el-table-column>
                </el-table>
                </template>
              </i-table>
              </div>
            </div>
          </el-tab-pane>

          <!-- 职位表格展示栏目 -->
          <el-tab-pane name="third">
            <span slot="label">职位({{panel.positionNum}})</span>
            <div class="ac">
              <div class="panel-right-searcher">
                <el-input placeholder="搜索职位" v-model="jobFilter" @keyup.enter.native="searchJob">
                  <i class="el-icon-search" slot="suffix" @click="searchJob"></i>
                </el-input>
              </div>
              <div class="job">
              <i-table :table="jobTable" @pageIndexChange="handleJobChange" @pageSizeChange="handleJobChange" v-loading="jobLoading" :element-loading-text="$loadingText">
                <template slot="table" slot-scope="tableScope">
                  <el-table :data="tableScope.clone" style="width: 100%"
                   ref="jobTable" v-loading="jobTableLoading" :element-loading-text="$loadingText">
                    <el-table-column prop="name" label="职位名称" width="180" align="left" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="posStandardJobName" label="所属标准职位" align="left" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="orgUnitName" label="所属组织" align="left">
                      <template slot-scope="scope">
                        <el-tooltip :content="scope.row.orgPathName" placement="top">
                          <span>{{ scope.row.orgUnitName }}</span>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column prop="parentPositionName" label="汇报职位" align="left" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="left" :formatter="tableScope.formatter" show-overflow-tooltip>
                    </el-table-column>
                  </el-table>
                </template>
              </i-table>
              </div>
            </div>
          </el-tab-pane>

          <!-- 员工表格展示栏目 -->
          <el-tab-pane name="fourth">
            <span slot="label">员工({{panel.employeeNum}})</span>
            <div class="ac">
              <div class="panel-right-searcher">
                <el-input placeholder="搜索员工" v-model="employeeFilter" @keyup.enter.native="searchEmployee">
                  <i class="el-icon-search" slot="suffix" @click="searchEmployee"></i>
                </el-input>
              </div>
              <div class="employee">
              <i-table
                :table="employeeTable"
                @pageIndexChange="handleEmployeeChange"
                @pageSizeChange="handleEmployeeChange"
                v-loading="employeeLoading"
                :element-loading-text="$loadingText"
                show-overflow-tooltip>
                <template slot="table" slot-scope="tableScope">
                  <el-table :data="tableScope.clone" style="width: 100%" show-overflow-tooltip
                   ref="employeeTable" v-loading="employeeTableLoading" :element-loading-text="$loadingText">
                    <el-table-column prop="employeeCode" label="员工工号" width="180" align="left" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="fullName" label="员工姓名" align="left" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="orgUnitName" label="所属组织" align="left" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="employeeStatus" label="员工状态" align="left" :formatter="tableScope.formatter" show-overflow-tooltip>
                    </el-table-column>
                  </el-table>
                </template>
              </i-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

      </div>

  </i-layout>
</div>
</template>

<script>
import moment from 'moment'
import { getTreeChosen } from 'utils/position'
import req, {config} from 'api/position/occupation'
import IControlLayout from 'components/common/i-control-layout/i-control-layout'
import JobFamilyTree from './job-family-tree'
import StatusControl from './status-control'
import access from 'mixins/access'

export default {
  name: 'Occupation',
  components: {
    IControlLayout,
    JobFamilyTree,
    StatusControl
  },
  mixins: [access],
  data () {
    return {
      moment,
      toolbar: [
        {
          text: '新建',
          key: 'orgPosJobFamilyCreate',
          type: 'primary',
          disabled: false,
          func: () => {
            this.newOc()
          }
        },
        {
          text: '修改',
          key: 'orgPosJobFamilyUpdate',
          type: 'default',
          disabled: false,
          func: () => {
            this.modifyOc()
          }
        },
        {
          text: '撤销',
          key: 'orgPosJobFamilyRepeal',
          type: 'default',
          disabled: false,
          func: () => {
            this.cancelOc()
          }
        },
        {
          text: '删除',
          key: 'orgPosJobFamilyDel',
          type: 'default',
          disabled: false,
          func: () => {
            this.deleteOc()
          }
        },
        {
          text: '批量新建',
          key: 'orgPosJFBatchCreate',
          type: 'default',
          disabled: false,
          func: () => {
            this.newBatchOc()
          }
        }
      ],
      // 保存页面弹性高度
      elHeight: 0,
      // 保存职群职种树的数据
      cancelArray: [],
      freezeArray: [],
      // 各表格的过滤搜索
      ocFilter: '',
      jobFilter: '',
      employeeFilter: '',
      chosen: '',
      kind: '',
      panel: {
        posJobFamilyId: '',
        name: '',
        effectiveDate: '',
        uneffectiveDate: '',
        remark: '',
        status: '',
        lastUpdateBy: '',
        lastUpdateCode: '',
        lastUpdateDate: '',
        standardJobNum: 0,
        positionNum: 0,
        employeeNum: 0
      },
      // 面板激活的栏目
      activeName: 'first',
      saveOriginNum: {},
      // 展示的状态名称
      showingStatus: '',
      // 各表格的loading
      panelLoading: false,
      standardOcLoading: false,
      standardOcTableLoading: false,
      jobLoading: false,
      jobTableLoading: false,
      employeeLoading: false,
      employeeTableLoading: false,
      // 显示标准职位的表格配置项
      standardOcTable: {
        columns: [
          { prop: 'status', display: { dict: 'POSITION_STATUS' } }
        ],
        setting: {
          export: {
            text: '导出',              // 可选（不合规范，不推荐填写）
            key: 'orgPosJFStjExport',
            config: {                      // 可选
              fileName: '标准职位列表'            // 默认文件名
              // version: '',              // 默认后缀
              // range: '',                // 默认范围
              // sync: true                // 默认方式（同步/异步）
            },
            req: config.searchStandardJobs,        // 必填
            elTable: null                  // 必填
          }
        },
        info: null,
        data: null,
        total: 0,
        search: null,
        showPagebar: true
      },
      // 显示职位的表格配置项
      jobTable: {
        columns: [
          { prop: 'status', display: { dict: 'POSITION_STATUS' } }
        ],
        setting: {
          export: {
            text: '导出',              // 可选（不合规范，不推荐填写）
            key: 'orgPosJFPosExport',
            config: {                      // 可选
              fileName: '职位列表'            // 默认文件名
              // version: '',              // 默认后缀
              // range: '',                // 默认范围
              // sync: true                // 默认方式（同步/异步）
            },
            req: config.searchJobs,        // 必填
            elTable: null                  // 必填
          }
        },
        info: null,
        data: null,
        total: 0,
        search: null,
        showPagebar: true
      },
      // 显示员工的表格配置项
      employeeTable: {
        columns: [
          { prop: 'employeeStatus', display: { dict: 'EMPLOYEE_STATUS' } }
        ],
        setting: {
          export: {
            text: '导出',              // 可选（不合规范，不推荐填写）
            key: 'orgPosJFEmpExport',
            config: {                      // 可选
              fileName: '员工列表'            // 默认文件名
              // version: '',              // 默认后缀
              // range: '',                // 默认范围
              // sync: true                // 默认方式（同步/异步）
            },
            req: config.searchEmployees,        // 必填
            elTable: null                  // 必填
          }
        },
        info: null,
        data: null,
        total: 0,
        search: null,
        showPagebar: true
      },
      typeConfig: {
        0: '职群',
        1: '职种',
        2: '子职种'
      }
    }
  },

  methods: {
    getFamilyArray (cancelArray, freezeArray) {
      this.cancelArray = cancelArray
      this.freezeArray = freezeArray
    },
    showDetails (node) {
      this.panelLoading = true
      var that = this
      that.panel = {}
      if (node) {
        this.activeName = 'first'
        that.chosen = getTreeChosen(node)
        var getByData = {
          posJobFamilyId: node.key,
          jobFamilyType: node.level - 1
        }
      }
      req('getDetailsByTreeId', getByData).then(data => {
        // todo:查询后由于列表高度变化，这里需要根据实际情况调整树的高度
        that.controlTreeHeight()
        // 根据字典转换状态名称
        that.$d('POSITION_STATUS', data.status).then(st => {
          that.showingStatus = st
          that.panelLoading = false
          that.panel = data
          that.standardOcTable.total = Number(that.panel.standardJobNum) || 0
        // 格式化时间
          if (that.panel.effectiveDate !== '') {
            that.panel.effectiveDate = moment(that.panel.effectiveDate).format('YYYY-MM-DD')
          }
          if (that.panel.uneffectiveDate) {
            that.panel.uneffectiveDate = moment(that.panel.uneffectiveDate).format('YYYY-MM-DD')
          }
        }).catch(e => {
          that.panelLoading = false
          this.$message.error('状态加载失败')
        })
      })
      // 清空各搜索框
      this.ocFilter = ''
      this.jobFilter = ''
      this.employeeFilter = ''
    },

    handleClick (tab, event) {
      switch (tab.name) {
        case 'first':
          this.ocFilter = ''
          this.jobFilter = ''
          this.employeeFilter = ''
          // todo:查询后由于列表高度变化，这里需要根据实际情况调整树的高度
          this.controlTreeHeight()
          break
        case 'second':
          this.jobFilter = ''
          this.employeeFilter = ''
          this.searchStandardOc()
          break
        case 'third':
          this.ocFilter = ''
          this.employeeFilter = ''
          this.searchJob()
          break
        case 'fourth':
          this.ocFilter = ''
          this.jobFilter = ''
          this.searchEmployee()
          break
      }
    },
    showStandardOc (params) {
      var that = this
      // console.log('标准职位查询条件', searchStandardJobsData)
      req('searchStandardJobs', params).then(data => {
        that.standardOcLoading = false
        that.standardOcTableLoading = false
        // console.log('标准职位查询结果为', data)
        that.standardOcTable.data = data.data
        that.standardOcTable.total = Number(data.total) || 0
        that.standardOcTable.info = data.info
        // todo:查询后由于列表高度变化，这里需要根据实际情况调整树的高度
        that.controlTreeHeight()
      })
    },
    showJob (params) {
      var that = this
      req('searchJobs', params).then(data => {
        that.jobLoading = false
        that.jobTableLoading = false
          // console.log('职位', data)
        that.jobTable.data = data.data
        that.jobTable.total = Number(data.total) || 0
        that.jobTable.info = data.info
        // todo:查询后由于列表高度变化，这里需要根据实际情况调整树的高度
        that.controlTreeHeight()
      })
    },
    showEmployee (params) {
      var that = this
      req('searchEmployees', params).then(data => {
        that.employeeLoading = false
        that.employeeTableLoading = false
          // console.log('员工', data)
        that.employeeTable.data = data.data
        that.employeeTable.total = Number(data.total) || 0
        that.employeeTable.info = data.info
        // todo:查询后由于列表高度变化，这里需要根据实际情况调整树的高度
        that.controlTreeHeight()
      })
    },

    handleOcChange (info) {
      this.standardOcTableLoading = true
      let params = {
        standardJobName: this.ocFilter,
        posJobFamilyId: this.$store.state.occupation.node.key,
        jobFamilyType: this.$store.state.occupation.node.level - 1
      }
      Object.assign(info, params)
      this.showStandardOc(info)
    },
    handleJobChange (info) {
      this.jobTableLoading = true
      let params = {
        name: this.jobFilter,
        posJobFamilyId: this.$store.state.occupation.node.key,
        jobFamilyType: this.$store.state.occupation.node.level - 1
      }
      Object.assign(info, params)
      this.showJob(info)
    },
    handleEmployeeChange (info) {
      this.employeeTableLoading = true
      let params = {
        name: this.employeeFilter,
        posJobFamilyId: this.$store.state.occupation.node.key,
        jobFamilyType: this.$store.state.occupation.node.level - 1
      }
      Object.assign(info, params)
      this.showEmployee(info)
    },
    clearNode () {
      this.chosen = ''
      this.panel = {}
      Object.assign(this.panel, this.saveOriginNum)
      this.showingStatus = ''
      this.activeName = 'first'
      // todo:查询后由于列表高度变化，这里需要根据实际情况调整树的高度
      this.controlTreeHeight()
    },
    searchStandardOc () {
      this.standardOcLoading = true
      let params = {
        standardJobName: this.ocFilter
      }
      if (Object.keys(this.$store.state.occupation.node).length !== 0) {
        params.posJobFamilyId = this.$store.state.occupation.node.key
        params.jobFamilyType = this.$store.state.occupation.node.level - 1
      }
      this.standardOcTable.search = params
    },
    searchJob () {
      this.jobLoading = true
      let params = {
        name: this.jobFilter
      }
      if (Object.keys(this.$store.state.occupation.node).length !== 0) {
        params.posJobFamilyId = this.$store.state.occupation.node.key
        params.jobFamilyType = this.$store.state.occupation.node.level - 1
      }
      this.jobTable.search = params
    },
    searchEmployee () {
      this.employeeLoading = true
      let params = {
        name: this.employeeFilter
      }
      if (Object.keys(this.$store.state.occupation.node).length !== 0) {
        params.posJobFamilyId = this.$store.state.occupation.node.key
        params.jobFamilyType = this.$store.state.occupation.node.level - 1
      }
      this.employeeTable.search = params
    },
    newOc () {
      // if (this.ocTree.length === 0) {
      //   return this.$message({
      //     message: '暂不允许新建',
      //     type: 'warning'
      //   })
      // }
      if (!this.checkPermited()) {
        return
      }
      this.$store.commit('SET_ACTION', 0)
      if (Object.keys(this.$store.state.occupation.node) === 0 || this.chosen === '') {
        // 新建职群
        this.$store.commit('OC_WINDOW_OPEN')
      } else {
        // 若為職種的話，含有標準職位或若為子職種，均不允許新建
        if (this.$store.state.occupation.node.level === 2 && this.$store.state.occupation.node.childNodes.length === 0 && this.panel.standardJobNum) {
          return this.$message({
            message: '该职种包含标准职位，不允许新建',
            type: 'warning'
          })
        }
        if (this.$store.state.occupation.node.level === 3) {
          return this.$message({
            message: '子职种已为最后一级，不允许新建',
            type: 'warning'
          })
        }
        this.$store.commit('OC_WINDOW_OPEN')
      }
    },
    modifyOc () {
      if (!this.checkPermited()) {
        return
      }
      if (Object.keys(this.$store.state.occupation.node) === 0 || this.chosen === '') {
        return this.$message({
          message: '请先选择职群或职种',
          type: 'warning'
        })
      }
      this.$store.commit('SET_ACTION', 1)
      if (this.$store.state.occupation.node.level === 1) {
        this.$store.commit('OC_WINDOW_OPEN_BY_ID')
      } else {
        this.$store.commit('OC_WINDOW_OPEN_BY_ID')
      }
    },
    cancelOc () {
      if (!this.checkPermited()) {
        return
      }
      if (Object.keys(this.$store.state.occupation.node) === 0 || this.chosen === '') {
        return this.$message({
          message: '请先选择职群或职种',
          type: 'warning'
        })
      }
      this.$store.commit('SET_ACTION', 2)
      if (this.$store.state.occupation.node.level === 1) {
        this.$store.commit('OC_WINDOW_OPEN_BY_ID')
      } else {
        this.$store.commit('OC_WINDOW_OPEN_BY_ID')
      }
    },
    deleteOc () {
      if (this.freezeArray.includes(this.$store.state.occupation.node.key)) {
        this.$message({
          message: '已冻结职群或职种节点下不允许操作',
          type: 'warning'
        })
        return
      }
      var that = this
      if (Object.keys(this.$store.state.occupation.node) === 0 || this.chosen === '') {
        return this.$message({
          message: '请先选择职群或职种',
          type: 'warning'
        })
      }
      var params = {
        posJobFamilyId: this.$store.state.occupation.node.key
      }
      req('checkJobFamilyDelPermission', params).then(data => {
        if (data) {
          this.$confirm('此操作将永久删除职群/职种, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var params = {
              posJobFamilyId: this.$store.state.occupation.node.key
            }
            req('deleteOc', params).then(data => {
              if (data) {
                this.$alert('删除成功！', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    that.$refs.tree.loadTree()
                    that.clearNode()
                    that.getTotalNum()
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
    newBatchOc () {
      this.$store.commit('SET_ACTION', 4)
      this.$store.commit('NEW_BATCH_POSITION')
    },
    checkPermited () {
      if (this.cancelArray.includes(this.$store.state.occupation.node.key)) {
        this.$message({
          message: '已撤销职群或职种节点下不允许操作',
          type: 'warning'
        })
        return false
      }
      if (this.freezeArray.includes(this.$store.state.occupation.node.key)) {
        this.$message({
          message: '已冻结职群或职种节点下不允许操作',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 获取初始数据
    getTotalNum () {
      var that = this
      var getByData = {
        posJobFamilyId: -1
      }
      req('getDetailsByTreeId', getByData).then(data => {
        that.saveOriginNum = data
        Object.assign(that.panel, that.saveOriginNum)
      })
    },
    // 返回该节点的父节点生效时间
    getParentEffectTime (parentId) {
      let limitDate = ''
      this.$refs.tree.allOcTree.map(ele => {
        if (ele.posJobFamilyId === parentId) {
          limitDate = ele.effectiveDate
        }
      })
      return limitDate ? {limitDate} : {}
    },
    // 控制树的高度
    controlTreeHeight () {
      this.$nextTick(() => {
        let minHeight = window.innerHeight - 115
        let changingHeight = this.$children[0].$el.children[1].childNodes[2].children[0].clientHeight
        this.elHeight = (changingHeight > minHeight ? changingHeight : minHeight) - 147
      })
    }
  },

  created () {
    this.getTotalNum()
            // 表单确认刷新页面
    const that = this
    window.formConfirm = function () {
      that.$refs.tree.loadTree()
    }
  },

  mounted () {
    this.standardOcTable.setting.export.elTable = this.$refs.standardOcTable
    this.jobTable.setting.export.elTable = this.$refs.jobTable
    this.employeeTable.setting.export.elTable = this.$refs.employeeTable
    this.elHeight = this.$children[0].$el.clientHeight - 147
  },

  computed: {

  }
}
</script>

<style lang="scss" scoped>
  .topText {
    font-family: HelveticaNeue Regular,;
    font-size: 12px;
    line-height: 12px;
    color: #333333;;
    width: 100%;
  }
  .nameControl{
    display: inline-block;
    text-align: right;
    color: #333;
    line-height: 24px;
    // text-align-last: justify;
    width:60px;
  }
  .content{
    color: #8d8d8d;
    padding-left: 5px;
  }
  .top-button{
    padding-top: 15px;
  }
</style>
