<template>
  <div class="requirment">
    <i-layout headerKey="rctRequirementsListGet">
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="申请部门">
            <i-select-tree
              :multiple="false"
              dataKey="org"
              nodeKey="orgUnitId"
              :rootId="rootId"
              v-model="param.applyOrgId"
              :lazy="true"
              @input="handleNodeClick"
              :readonly="true"
              size="small"
              treeMaxHeight="180"
              :accordion="true"
              sizeAuto
              :selectedNode.sync="node"
              clearable
              placeholder="请选择"
            ></i-select-tree>
          </el-form-item>
          <el-form-item label="招聘岗位" prop='applyPosition'>
            <el-input
              v-model.trim="param.applyPosition"
              @focus="departmentNodeClick"
              :disabled="editable"
              placeholder="请选择"
            ></el-input>
          </el-form-item>
          <el-form-item label="招聘状态">
            <i-select v-model="param.releaseStatus" clearable parameter="RELEASE_STATUS" placeholder="请选择"></i-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="param.applyBeginDate"
              type="date"
              value-format="yyyy-MM-dd"
              @change="val => (this.param.applyBeginDate = val)"
              :picker-options="dateStartPickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="param.applyEndDate"
              type="date"
              value-format="yyyy-MM-dd"
              @change="val => (this.param.applyEndDate = val)"
              :picker-options="dateEndPickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="申请人工号">
            <el-input v-model="param.applyManCode"></el-input>
          </el-form-item>
        </i-form>
        <position-selection
          type="mini"
          v-model="positionSelectDialogFlag"
          @change="selectPositionConfirm">
        </position-selection>
      </div>
      <div slot="section">
        <div class="table">
          <i-table
            :table="table"
            @pageSizeChange="handleSizeChange"
            @pageIndexChange="handleCurrentChange">
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                v-loading="loading"
                :element-loading-text="$loadingText"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="40"
                  fixed="left">
                </el-table-column>
                <el-table-column
                  prop="applyOrgName"
                  label="申请部门"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="applyManName" label="申请人"></el-table-column>
                <el-table-column prop="applyManCode" label="申请人工号" width="100"></el-table-column>
                <el-table-column prop="applyDate" label="申请时间" width="140"></el-table-column>
                <el-table-column prop="applyPositionName" label="招聘岗位"></el-table-column>
                <el-table-column
                  prop="releaseStatus"
                  label="状态"
                  align="left">
                  <template slot-scope="scope">
                    {{scope.row.releaseStatus | statusFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="releaseManName" label="发布人"></el-table-column>
                <el-table-column prop="releaseManCode" label="发布人工号" width="100"></el-table-column>
                <el-table-column
                  prop="resumeNum"
                  label="简历数"
                  align="right">
                </el-table-column>
                <el-table-column
                  prop="requireNum"
                  label="需求数"
                  align="right">
                </el-table-column>
                <el-table-column
                  prop="finishedNum"
                  label="已招聘"
                  align="right">
                </el-table-column>
                <el-table-column
                  prop="unfinished"
                  label="待招聘"
                  align="right">
                </el-table-column>
                <i-table-operator width="210" :table="tableScope"/>
                <!-- <el-table-column
                  label="操作"
                  fixed="right"
                  width="210"
                  align="center"
                  v-if="operatorColumn">
                  <template slot-scope="scope">
                    <i-table-operator @accessControl="accessControl" :table="tableScope" :row="scope.row"></i-table-operator>
                    <el-button type="text" @click="goResumeList(scope.row.requirementId)">查看简历详情</el-button>
                    <el-button type="text" @click="goDemonFlow(scope.row.requirementId)">查看需求详情</el-button>
                  </template>
                </el-table-column> -->
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-layout>
  </div>
</template>
<script type="text/javascript">
  // 公共组件
  import access from 'mixins/access'
//  import { EvaluateStatus } from 'config/dict.js'
  import req from 'api/recruit/index.js'
  import { selectMutiId, filterId } from 'utils/performance'
  import { ResumePageSource } from 'views/admin/pages/recruit/config'
  import PositionSelection from 'components/position/position-selection'
  export default {
    name: 'RecruitRequirement',
    components: {
      PositionSelection
    },
    filters: {
      statusFilter (releaseStatus) {
        const statusMap = {
          0: '未发布',
          1: '已发布',
          2: '已撤销'
        }
        return statusMap[releaseStatus]
      }
    },
    mixins: [access],
    data () {
      return {
        // loading
        loading: false,
        param: {
          applyOrgId: '',
          applyPositionId: '',
          releaseStatus: '',
          applyBeginDate: '',
          applyEndDate: '',
          applyManCode: '',
          applyPosition: ''
        },
        positionSelectDialogFlag: false,
        applyPositionId: '',
        multiSelection: [],
        // 开始时间参数
        dateStartPickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.parse(this.param.applyEndDate) - 3600 * 1000 * 24
          }
        },
        // 结束时间参数
        dateEndPickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse(this.param.applyBeginDate)
          }
        },
        table: {
          data: [],
          setting: {
            toolbar: [
              {
                text: '发布需求',
                type: 'primary',
                key: 'rctRequirementsReleasePost',
                func: () => this.releaseMutiRequirments()
              }, {
                text: '关闭需求',
                type: 'default',
                key: 'rctRequirementsCancelPost',
                func: () => this.closeMutiRequirments()
              }
            ],
            operator: [{
              text: '查看简历详情',
              key: 'rctRequirementResumesListGet',
              func: this.goResumeList
            }, {
              text: '查看需求详情',
              key: 'rctRequirementInfoSelectGet',
              func: this.goDemonFlow
            }]
          },
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        }
      }
    },
    // created () {
    //   this.getRequirementsList()
    // },
    mounted () {
      this.search()
    },
    methods: {
      reset () {
        this.param = {
          applyOrgId: '',
          applyPositionId: '',
          releaseStatus: '',
          applyBeginDate: '',
          applyEndDate: '',
          applyManCode: '',
          applyPosition: ''
        }
      },
      search () {
        // this.getRequirementsList()
        this.table.search = {...this.param}
      },
      // 显示职位弹窗
      departmentNodeClick (selected) {
        this.positionSelectDialogFlag = true
      },
      // 选择职位
      selectPositionConfirm (selected) {
        this.param.applyPositionId = selected.posPositionId
        this.param.applyPosition = selected.name
        this.positionSelectDialogFlag = false
      },
      // 多选
      handleSelectionChange (val) {
        this.multiSelection = val
      },
       // 当分页器页码变动时调用
      handleCurrentChange (opts) {
        // this.table.info = opts
        this.loading = true
        this.getRequirementsList(opts)
      },
      // 分页器每页显示几个
      handleSizeChange (opts) {
        this.loading = true
        // this.table.info = opts
        this.getRequirementsList(opts)
      },
      getRequirementsList (opts) {
        req('requirementList', opts).then((res) => {
          Object.assign(this.table, res)
          this.loading = false
        }).catch((err) => {
          console.log(err)
          this.loading = false
        })
      },
      releaseMutiRequirments () {
        if (this.multiSelection.length > 0) {
          let requirmentsIdArr = selectMutiId(this.multiSelection, 'requirementId')
          // 拿着这个id去删除,然后重新获取listArr
          this.$confirm('确定发布需求吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            for (let i of this.multiSelection) {
              if (i.releaseStatus === '1' || i.releaseStatus === '2') {
                this.$message.warning('所选值含有已发布或者已撤销状态,不可发布,请重选')
                return
              }
            }
            req('releaseRequirementList', requirmentsIdArr).then((data) => {
              filterId(requirmentsIdArr, this.table.data, 'requirementId', 'enable')
              this.$message({
                message: '恭喜你，发布成功',
                type: 'success'
              })
              this.getRequirementsList()
            }).catch((err) => {
              console.log(err)
            })
            return
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发布'
            })
          })
        } else {
          this.$message({
            message: '请至少选择一个需求',
            type: 'warning'
          })
        }
      },
      closeMutiRequirments () {
        if (this.multiSelection.length > 0) {
          let requirmentsIdArr = selectMutiId(this.multiSelection, 'requirementId')
          // 拿着这个id去删除,然后重新获取listArr
          this.$confirm('确定关闭需求吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            for (let i of this.multiSelection) {
              if (i.releaseStatus === '0' || i.releaseStatus === '2') {
                this.$message.warning('所选值含有未发布或者已撤销状态,不可关闭,请重选')
                return
              }
            }
            req('cancelRequirementList', requirmentsIdArr).then((data) => {
              filterId(requirmentsIdArr, this.table.data, 'requirementId', 'disable')
              this.$message({
                message: '恭喜你，关闭成功',
                type: 'success'
              })
              this.getRequirementsList()
            }).catch((err) => {
              console.log(err)
            })
            return
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消关闭'
            })
          })
        } else {
          this.$message({
            message: '请至少选择一个需求',
            type: 'warning'
          })
        }
      },
      // 跳转简历列表
      goResumeList (row) {
        this.$router.push({
          path: '/recruit/resume/resumeView',
          query: {
            requirementId: row.requirementId,
            source: ResumePageSource.DEMANDRELEASE
          }
        })
      },
      // 查看需求详情
      goDemonFlow (row) {
        this.$router.push({
          path: '/recruit/resume/requirementDetail',
          query: {
            requirementId: row.requirementId
          }
        })
      }
    }
  }
</script>
