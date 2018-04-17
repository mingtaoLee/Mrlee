<template>
  <div class="wrap">
    <i-dialog :title="isStandard ? '查看标准职位信息' : '查看职位信息'" v-model="showDialog" destroyedWhenClose>
      <div class="showing" v-loading="!loaded" :element-loading-text="$loadingText">
        <el-tabs @tab-click="getJobAndEmployee" v-model="activeName">
          <el-tab-pane :label="isStandard ? '标准职位' : '职位'"  name="main">
            <div class="controll-dialog">
            <div class="ml20 mt10">
              <div class="top-basic-info">
                <div class="top-basic-info-left">
                  <p class="mb10">{{isStandard ? '标准职位名称' : '职位名称'}}&nbsp;:{{ocDetail.name}}</p>
                  <p class="mb10">所属职群&nbsp;:{{ocDetail.posJobFamilyName}}</p>
                  <p class="mb10">所属职种&nbsp;:{{ocDetail.jobClassName}}</p>
                  <p class="mb10">所属子职种&nbsp;:{{ocDetail.subJobClassName}}</p>
                  <p class="mb10" v-if="!isStandard">所属组织&nbsp;:{{ocDetail.orgUnitName}}</p>
                  <p class="mb10" v-if="!isStandard">汇报职位&nbsp;:{{ocDetail.parentPositionName}}</p>
                </div>
                <div class="top-basic-info-right">
                  <p class="mb10">生效日期&nbsp;:{{ocDetail.effectiveDate}}</p>
                  <p class="mb10">职务&nbsp;:{{ocDetail.posTitleName}}</p>
                  <p class="mb10" v-if="!isStandard">品类&nbsp;:{{ocDetail.categoryNameList}}</p>
                  <p class="mb10">状态&nbsp;:{{showingStatus}}</p>
                  <p class="mb10">备注&nbsp;:{{ocDetail.remark}}</p>
                </div>
              </div>

              <p class="content-title bold mt10 padding5 ml-20 pl20">知识技能要求</p>

              <div class="mt20">
                <div class="top-basic-info mb10">
                  <p class="top-basic-info-left">学历要求&nbsp;:{{showingGetAcademic}}</p>
                  <p class="top-basic-info-right">专业要求&nbsp;:{{ocDetail.expertiseRequirements}}</p>
                </div>
                <p class="mb10">技能要求&nbsp;:{{ocDetail.skillRequirement}}</p>
                <p class="mb10">证书要求&nbsp;:{{ocDetail.qualificationRequirement}}</p>
                <p class="mb10">其他要求&nbsp;:{{ocDetail.otherRequirement}}</p>
              </div>

              <p class="content-title bold mt10 padding5 ml-20 pl20">经验要求</p>

              <div class="mt20">
                <p class="mb10">工作经验&nbsp;:{{ocDetail.experienceRequirement}}</p>
                <p class="mb10">行业要求&nbsp;:{{ocDetail.industryRequirement}}</p>
                <p class="mb10">其他要求&nbsp;:{{ocDetail.otherRequirement}}</p>
              </div>

              <p class="content-title bold mt10 padding5 ml-20 pl20">关键职责</p>

              <div class="mt20">
                <p class="mb10">关键职责&nbsp;:{{ocDetail.keyResponsibilities}}</p>
              </div>

            </div>
            </div>

          </el-tab-pane>

          <el-tab-pane v-if="isStandard" :label="`包含职位（${ocDetail.positionNum||0}）`" name="job">
            <div class="job controll-dialog">
            <i-table :table="jobTable" @pageIndexChange="handleJobChange" @pageSizeChange="handleJobChange">
              <template slot="table" slot-scope="tableScope">
              <el-table :data="tableScope.clone" style="width: 100%">
                <el-table-column prop="name" label="职位名称" width="180" align="center">
                </el-table-column>
                <el-table-column prop="code" label="职位编码" align="center">
                </el-table-column>
                <el-table-column prop="orgUnitName" label="所属组织" align="center">
                </el-table-column>
                <el-table-column prop="parentPositionName" label="汇报职位" align="center">
                </el-table-column>
              </el-table>
              </template>
            </i-table>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="`包含员工（${ocDetail.employeeNum||0}）`" name="employee">
            <div class="employee controll-dialog">
            <i-table
              :table="employeeTable"
              @pageIndexChange="handleEmployeeChange"
              @pageSizeChange="handleEmployeeChange">
              <template slot="table"  slot-scope="tableScope">
              <el-table :data="tableScope.clone" style="width: 100%"  >
                <el-table-column prop="employeeCode" label="员工工号" width="180" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="employeeName" label="员工姓名" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="unitName" label="所属组织" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column
                  prop="employeeStatus"
                  label="员工状态"
                  :formatter="tableScope.formatter"
                  show-overflow-tooltip
                  align="center"
                />
              </el-table>
              </template>
            </i-table>
            </div>
          </el-tab-pane>

        </el-tabs>
      </div>

    </i-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import req from 'api/position/occupation'
import reqPs from 'api/position/position-post'
import reqSj from 'api/position/standard-oc'
import ITable from 'components/common/i-table'
import IDialog from 'components/common/i-dialog/i-dialog'
/**
   * @prop ocDetail 父组件传进来的详细信息
   * @prop isStandard 区分是标准职位还是职位 true为标准职位 false为职位
   */
export default {
  name: '',
  components: {
    ITable,
    IDialog
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    isStandard: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    id (newVal) {
      if (newVal) {
        this.initDetails()
        this.showDetails()
      }
    }
  },
  data () {
    return {
      loaded: false,
      showDialog: false,
      // 选中的选项卡配置
      activeName: 'main',
      jobTab: false,
      employeeTab: false,
      // 状态字典
      showingStatus: '',
      // 学历要求字典
      showingGetAcademic: '',
      // 某个id下的职位对应的详细数据
      ocDetail: {},
      jobTable: {
        info: null,
        data: null,
        total: 0,
        search: null,
        showPagebar: true
      },
      employeeTable: {
        columns: [
          { prop: 'employeeStatus', display: { dict: 'EMPLOYEE_STATUS' } }
        ],
        info: null,
        data: null,
        total: 0,
        search: null,
        showPagebar: true
      }
    }
  },
  methods: {
    handleJobChange (info) {
      this.showJob(info)
    },
    handleEmployeeChange (info) {
      this.showEmployee(info)
    },
    getJobAndEmployee (tab) {
      if (tab.name === 'job') {
        if (!this.jobTab) {
          this.jobTable.search = {}
          this.jobTab = true
        }
      }
      if (tab.name === 'employee') {
        if (!this.employeeTab) {
          this.employeeTable.search = {}
          this.employeeTab = true
        }
      }
    },
    // 初始化明细信息
    initDetails () {
      this.employee = []
      this.activeName = 'main'
      this.jobTab = false
      this.employeeTab = false
      this.ocDetail = {}
      this.loaded = false
    },
    // 获取职位信息
    showJob (info) {
      // 必填参数
      var params = {
        posStandardJobId: this.ocDetail.posStandardJobId
      }
      Object.assign(params, info)
      var that = this
      reqSj('getPosition', params).then(data => {
        if (data.error) {
          that.jobTable.data = []
          that.jobTable.total = 0
        } else {
          that.jobTable.data = data.data
          that.jobTable.total = Number(data.total) || 0
          that.jobTable.info = data.info
        }
      })
    },
    // 获取员工信息
    showEmployee (info) {
      var that = this
      // 共享参数
      var params = {}
      Object.assign(params, info)
      var url = ''
      // 区分标准职位和职位的传值的参数
      if (this.isStandard) {
        params.posStandardJobId = this.ocDetail.posStandardJobId
        url = 'getEmployee'
        reqSj(url, params).then(data => {
          if (data.error) {
            that.employeeTable.data = []
            that.employeeTable.total = 0
          } else {
            that.employeeTable.data = data.data
            that.employeeTable.total = Number(data.total) || 0
            that.employeeTable.info = data.info
          }
        })
      } else {
        params.posPositionId = this.ocDetail.posPositionId
        url = 'searchPostEmployees'
        req(url, params).then(data => {
          if (data.error) {
            that.employeeTable.data = []
            that.employeeTable.total = 0
          } else {
            that.employeeTable.data = data.data
            that.employeeTable.total = Number(data.total) || 0
            that.employeeTable.info = data.info
          }
        })
      }
    },
    showDetails () {
      var that = this
      let params = null
      if (this.isStandard) {
        params = {
          posStandardJobId: this.id
        }
        reqSj('getJobDetailsById', params).then(data => {
          Object.assign(that.ocDetail, data)
          // 格式化显示时间
          that.ocDetail.effectiveDate = moment(that.ocDetail.effectiveDate).format('YYYY-MM-DD')
          reqSj('getPeopleDetails', {posStandardJobId: this.id}).then(num => {
            that.ocDetail.positionNum = num.positionNum
            that.ocDetail.employeeNum = num.employeeNum
            that.$d('EDUCATIONAL_BACKGROUND', this.ocDetail.academicRequirements).then(data => {
              that.showingGetAcademic = data
              that.$d('POSITION_STATUS', this.ocDetail.status).then(st => {
                that.showingStatus = st
                that.loaded = true
              })
            })
          })
        })
      } else {
        params = {
          posPositionId: this.id
        }
        // 获取该职位下员工数目
        reqPs('getEmployeeNum', params).then(res => {
          // 获取该职位明细信息
          let params = {
            posPositionId: this.id
          }
          reqPs('getPostDetailsById', params).then(data => {
            Object.assign(this.ocDetail, data)
            var temPosCategoryName = []
            data.categorys && data.categorys.forEach(ele => {
              temPosCategoryName.push(ele.posCategoryName)
            })
            // 数组的品类名称改为用逗号连接的字符串
            that.ocDetail.categoryNameList = temPosCategoryName.join('，')
            this.ocDetail.effectiveDate = moment(this.ocDetail.effectiveDate).format('YYYY-MM-DD')
            that.$d('POSITION_STATUS', this.ocDetail.status).then(res => {
              that.showingStatus = res
              that.$d('EDUCATIONAL_BACKGROUND', this.ocDetail.academicRequirements).then(res => {
                that.showingGetAcademic = res
                that.loaded = true
              })
            })
          })
          this.ocDetail.employeeNum = res.employeeNum
        })
      }
    }
  },
  mounted () {
  },
  created () {

  }
}
</script>

<style lang="scss" scoped>
  .top-basic-info {
    width:100%;
    display: flex;

    overflow-y:auto;
    flex-direction: row;
    .top-basic-info-left {
      margin-right: 20px;
      width: calc(50% - 20px);
    }
    .top-basic-info-right{
      width: 50%;
    }
  }

.content-title {
  background-color: #f2f2f2;
  border-radius: 3px;
}

.controll-dialog{
  height:390px;
  overflow-y: auto;
}
</style>
