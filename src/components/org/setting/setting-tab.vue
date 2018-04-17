<template>
  <el-tabs v-model="activeName" @tab-click="tabChange" v-loading="loading" :element-loading-text="$loadingText">
    <!-- <el-tab-pane style="width:20px;" disabled></el-tab-pane> -->
    <el-tab-pane v-if="hideTabs !== 'orgDetail'" name="details" v-loading = "tabLoading.details" :element-loading-text="$loadingText">
      <span slot="label" class="tabs-lebel-size">组织详情</span>
      <div class="key-value">
        <div class="item">
          <span class="key">组织名称</span>
          <span class="value">{{detailData.orgUnitName || '无'}}</span>
        </div>
        <div class="item">
          <span class="key">组织全称</span>
          <span class="value">{{detailData.orgPathName}}</span>
        </div>
        <div class="item">
          <span class="key">组织编码</span>
          <span class="value">{{detailData.orgUnitCode || '无'}}</span>
        </div>
        <div class="item">
          <span class="key">组织简称</span>
          <span class="value">{{detailData.orgShortName}}</span>
        </div>
        <div class="item">
          <span class="key">上级汇报部门</span>
          <span class="value">{{detailData.superReportingDept}}</span>
        </div>
        <div class="item">
          <span class="key">所属标准组织</span>
          <span class="value">{{detailData.orgStandardName}}</span>
        </div>
        <div class="item">
          <span class="key">组织类别</span>
          <span class="value">{{detailData.orgType || '无'}}</span>
        </div>
        <div class="item">
          <span class="key">业态</span>
          <span class="value">{{detailData.businessType || '无'}}</span>
          <!-- <span>{{detailData.businessType}}</span> -->
        </div>
        <div class="item">
          <span class="key">部门负责人</span>
          <span class="value">{{detailData.orgLeader}}</span>
        </div>
        <div class="item">
          <span class="key">成本中心</span>
          <span class="value">{{detailData.costCentralId}}</span>
        </div>
        <div class="item">
          <span class="key">上级组织</span>
          <span class="value">{{detailData.parentUnitName}}</span>
        </div>
        <div class="item">
          <span class="key">生效日期</span>
          <span class="value">{{detailData.effectiveDate | dateFormat('YYYY-MM-DD')}}</span>
        </div>
        <div class="item">
          <span class="key">关键职责</span>
          <span class="value">{{detailData.orgResponsibility}}</span>
        </div>
        <div class="item">
          <span class="key">组织类型</span>
          <span class="value">{{detailData.sapOrgType}}</span>
        </div>
        <div class="item">
          <span class="key">部门属性</span>
          <span class="value">{{detailData.sapDeptProp}}</span>
        </div>
        <div class="item">
          <span class="key">申请时间</span>
          <span class="value">{{detailData.lastUpdateDate | dateFormat('YYYY-MM-DD')}}</span>
        </div>
        <div class="item">
          <span class="key">申请人姓名</span>
          <span class="value">{{detailData.applicantName}}</span>
        </div>
        <div class="item">
          <span class="key">申请人员工号</span>
          <span class="value">{{detailData.applicantCode}}</span>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane v-if="hideTabs !== 'shopDetail'" label="门店" name="shop">
      <span slot="label" class="tabs-lebel-size">门店详情</span>
      <div class="key-value">
        <div class="item">
          <span class="key">公司代码</span>
          <span class="value">{{shopData.companyCode}}</span>
        </div>
        <div class="item">
          <span class="key">片/区代码</span>
          <span class="value">{{shopData.belongArea || '无'}}</span>
        </div>
        <div class="item">
          <span class="key">片区</span>
          <span class="value">{{shopData.belongAreaName || '无'}}</span>
        </div>
        <div class="item">
          <span class="key">省份</span>
          <span class="value">{{shopData.state}}</span>
        </div>
        <div class="item">
          <span class="key">城市</span>
          <span class="value">{{shopData.city}}</span>
        </div>
        <div class="item">
          <span class="key">城区</span>
          <span class="value">{{shopData.country}}</span>
        </div>
        <div class="item">
          <span class="key">店编</span>
          <span class="value">{{shopData.shopCode}}</span>
        </div>
        <div class="item">
          <span class="key">店面积</span>
          <span class="value">{{shopData.shopArea}}</span>
        </div>
        <div class="item">
          <span class="key">店地址</span>
          <span class="value">{{shopData.shopAddress}}</span>
        </div>
        <div class="item">
          <span class="key">店状态</span>
          <span class="value">{{shopData.shopStatus}}</span>
        </div>
        <div class="item">
          <span class="key">店类型</span>
          <span class="value">{{shopData.shopCategory}}</span>
        </div>
        <div class="item">
          <span class="key">店分类</span>
          <span class="value">{{shopData.shopType}}</span>
        </div>
        <div class="item">
          <span class="key">店类别</span>
          <span class="value">{{shopData.shopClass}}</span>
        </div>
        <div class="item">
          <span class="key">盈利状态</span>
          <span class="value">{{shopData.profitStatus}}</span>
        </div>
        <div class="item">
          <span class="key">实际运营日期</span>
          <span class="value">{{shopData.beginRunDate}}</span>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane v-if="hideTabs !== 'position'"  name="position">
    <span slot="label" class="tabs-lebel-size">包含职位({{this.posData.total}})</span>
    <div class="" >
      <i-form
        ref="IFormPos"
        :access-key="posSearchKey"
        @reset="resetPosInputs"
        @search="getPos"
      >
        <el-form-item label="职位编码">
          <el-input v-model="search.searchPosId"/>
        </el-form-item>
        <el-form-item label="职位名称">
          <el-input v-model="search.searchPosName"/>
        </el-form-item>
      </i-form>
    </div>
      <i-table :table="posData" @pageIndexChange="getPos" @pageSizeChange="getPos">
        <template slot-scope="scope" slot="table">
          <el-table
          border
          stripe
          :data="scope.clone"
          style="width: 100%"
          v-loading = "posLoading"
          :element-loading-text="$loadingText"
          >
            <el-table-column
              prop="code"
              align="center"
              label="职位编码">
            </el-table-column>
            <el-table-column
              prop="name"
              show-overflow-tooltip
              label="职位名称">
            </el-table-column>
            <el-table-column
              prop="posJobFamilyName"
              show-overflow-tooltip
              label="所属职群">
            </el-table-column>
            <el-table-column
              prop="jobClassName"
              show-overflow-tooltip
              label="所属职种">
            </el-table-column>
            <el-table-column
              prop="posStandardJobName"
              show-overflow-tooltip
              label="所属标准职位">
            </el-table-column>
            <el-table-column
              prop="remark"
              show-overflow-tooltip
              label="备注">
            </el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              label="操作"
              >
              <template slot-scope="scope">
                <el-button type="text" @click="showDetails(scope)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    <check-standard-job-details ref="checkDetails" :id="posPositionId" :isStandard="false"></check-standard-job-details>
    </el-tab-pane>
    <el-tab-pane  v-if="hideTabs !== 'staff'" name="staff">
    <span slot="label" class="tabs-lebel-size">包含员工({{empTotal}})</span>
    <div class="" >
      <i-form
        ref="IFormEmp"
        :access-key="empSearchKey"
        @reset="resetEmpInputs"
        @search="getEmp"
      >
        <el-form-item label="员工姓名">
          <el-input v-model="search.searchEmpName"/>
        </el-form-item>
        <el-form-item label="员工工号">
          <el-input v-model="search.searchEmpId"/>
        </el-form-item>
      </i-form>
    </div>
     <i-table
     :table="empData"
     @pageIndexChange="getEmp"
     @pageSizeChange="getEmp"
     >
      <template slot="table" slot-scope="scope">
        <el-table
          border
          stripe
          :data="scope.clone"
          v-loading = "scope.loading"
          :element-loading-text="$loadingText"
          style="width: 100%">
          <el-table-column
            prop="employeeCode"
            show-overflow-tooltip
            width="150"
            label="工号"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="fullName"
            label="员工姓名"
            width="100">
          </el-table-column>
          <el-table-column
            prop="gender"
            show-overflow-tooltip
            label="性别"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="posPositionName"
            show-overflow-tooltip
            label="职位"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="mobile"
            show-overflow-tooltip
            label="电话"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="hireDate"
            align="center"
            :formatter="dateFormat"
            label="入职时间"
            width="200">
          </el-table-column>
          <el-table-column
            prop="orgName"
            show-overflow-tooltip
            label="部门"
            width="150">
          </el-table-column>
          <el-table-column
            prop="employeeType"
            show-overflow-tooltip
            :formatter="scope.formatter"
            label="用工类型"
            width="100">
          </el-table-column>
          <el-table-column
            v-if="hideEmployeeTableItem.employeeStatus"
            prop="employeeStatus"
            show-overflow-tooltip
            :formatter="scope.formatter"
            label="员工状态"
            width="100">
          </el-table-column>
        </el-table>
      </template>
     </i-table>
    </el-tab-pane>
    <el-tab-pane v-if="!requestUrls.detail.paramDate || hideTabs !== 'history'" name="history">
      <span slot="label" class="tabs-lebel-size">历史变迁</span>
      <i-table :table="hisData" @pageIndexChange="getHistory" @pageSizeChange="getHistory">
        <template slot-scope="scope" slot="table">
          <el-table
          :data="scope.clone"
          stripe
          class="table-width">
          <el-table-column
            prop="operateType"
            width="120"
            align="center"
            label="变更类型"
            :formatter="changeOperateType"
            >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="120"
            prop="orgShortName"
            label="组织简称"
            >
          </el-table-column>
          <el-table-column
            prop="orgUnitName"
            min-width="150"
            show-overflow-tooltip
            label="组织名称"
            >
          </el-table-column>
          <el-table-column
            width="150"
            prop="parentName"
            label="上级组织"
           >
          </el-table-column>
          <el-table-column
          prop="parentCode"
          width="180"
          align="center"
          label="上级组织编码"
          >
          </el-table-column>
          <el-table-column
            :formatter="dateFormat"
            prop="effectiveDate"
            width="180"
            align="center"
            label="生效日期"
            >
          </el-table-column>
          <el-table-column
            prop="fullName"
            width="180"
            align="center"
            label="操作人"
            >
          </el-table-column>
          <el-table-column
            prop="employeeCode"
            width="180"
            align="center"
            label="操作人工号"
            >
          </el-table-column>
          <el-table-column
            :formatter="dateFormat"
            prop="lastUpdateDate"
            width="180"
            align="center"
            label="操作时间"
            >
          </el-table-column>
          </el-table>
        </template>
      </i-table>
    </el-tab-pane>

  </el-tabs>
</template>
<script>
import req from 'api/org/tabs'
import moment from 'moment'
import { dateFormat } from 'filters'
import ITable from 'components/common/i-table/index'
import IForm from 'components/common/i-form/i-form.vue'
import CheckStandardJobDetails from '@/views/admin/pages/position/check-standard-job-details'
export default {
  name: 'SettingTab',
  components: {
    ITable,
    IForm,
    CheckStandardJobDetails
  },
  data () {
    return {
      detailData: {},
      shopData: {},
      activeName: 'details',
      posPositionId: '',
      loading: false,
      hisData: {
        data: [],
        total: 1,
        showPagebar: true,
        search: null,
        info: null
      },
      posData: {
        data: [],
        total: 1,
        showPagebar: true,
        search: null,
        info: null
      },
      empData: {
        data: [],
        total: 1,
        showPagebar: true,
        search: null,
        info: null,
        columns: [
          {
            prop: 'employeeType',
            display: { dict: 'EMPLOYEE_TYPE' }
          },
          {
            prop: 'employeeStatus',
            display: { dict: 'EMPLOYEE_STATUS' }
          }
        ]
      },
      empTotal: '',
      orgPathName: '',
      search: {
        searchPosId: '',
        searchPosName: '',
        searchEmpId: '',
        searchEmpName: ''
      },
      tabLoading: {
        details: false,
        shop: false,
        position: false,
        staff: false,
        history: false
      },
      isDataInit: {
        details: false,
        shop: false,
        position: false,
        staff: false,
        history: false
      },
      posLoading: false
    }
  },
  computed: {
    posSearchKey () {
      if (this.$route.path === '/org/org/history') {
        return 'orgHistoryIdPosGet'
      } else {
        return 'orgHistoryIdPos'
      }
    },
    empSearchKey () {
      if (this.$route.path === '/org/org/history') {
        return 'orgHistoryIdEmpGet'
      } else {
        return 'orgHistoryIdEmp'
      }
    }
  },
  props: {
    tabData: Object,
    hideTabs: String,
    hideEmployeeTableItem: {
      type: Object,
      default: {
        employeeStatus: true
      }
    },
    requestUrls: {
      type: Object,
      default: () => {
        return {
          detail: {
            url: 'detail'
          },
          pos: {
            url: 'pos'
          },
          emp: {
            url: 'emp',
            total: 'getEmpCount'
          },
          history: {
            url: 'history'
          }
        }
      }
    },
    paramDate: String
  },
  watch: {
    tabData () {
      if (this.loading === true) {
        this.$message({
          type: 'warning',
          message: '请等待数据加载完再做下一步操作'
        })
      } else {
        Object.keys(this.isDataInit).forEach(item => {
          this.isDataInit[item] = false
        })
        this.loading = true
        Object.assign(this.search, {searchPosId: '', searchPosName: '', searchEmpId: '', searchEmpName: ''})
        /**
         * Hack
         * 这里无法用i-table改变search的方法，因为需要获取到每个请求的Promise的状态
         */
        Promise.all([this.getDetailData(), this.getPos(), this.getEmpTotal(), this.getHistory()])
        // this.getTabPaneData()
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      }
      // this.posData.search = {}
      // this.empData.search = {}
      // this.hisData.search = {}
    },
    paramDate () {}
  },
  filters: {dateFormat},
  mounted () {

  },
  methods: {
    getTabPaneData () {
      switch (this.activeName) {
        case 'details':
          return this.getDetailData()
        case 'position':
          return this.getPos()
        case 'staff':
          return this.getEmp()
        case 'history':
          return this.getHistory()
        case 'shop':
          // 门店详情还不做
          return Promise.resolve()
        default:
          break
      }
    },
    showDetails (scope) {
      this.posPositionId = scope.row.posPositionId
      this.$refs.checkDetails.showDialog = true
    },
    getDictData () {
      this.$d('ORG_BUSINESS_TYPE', this.detailData.businessType).then(label => {
        this.detailData.businessType = label
      })
      this.$d('ORG_TYPE', this.detailData.orgType).then(label => {
        this.detailData.orgType = label
      })
      this.$d('SAP_ORG_TYPE', this.detailData.sapOrgType).then(label => {
        this.detailData.sapOrgType = label
      })
      this.$d('SAP_DEPT_PROP', this.detailData.sapDeptProp).then(label => {
        this.detailData.sapDeptProp = label
      })
    },
    changeOperateType (row) {
      var operateType = row.operateType
      switch (operateType) {
        case '1': operateType = '创建'; break
        case '2': operateType = '更新'; break
        case '3': operateType = '调级'; break
        case '4': operateType = '合并'; break
        case '5': operateType = '拆分'; break
        case '6': operateType = '复制'; break
        case '7': operateType = '撤销'; break
        default: operateType = '删除'
      }
      return operateType
    },
    getDetailData () {
      return this.$store.dispatch('SELECT_NODE', {
        url: this.requestUrls.detail.url,
        params: {id: this.tabData.orgUnitId, paramDate: this.paramDate}
      }).then(data => {
        this.detailData = data
        // 处理门店状态字典数据问题
        let afterOrgShopStatus = data.shopStatus ? data.shopStatus.slice(-1) : ''
        this.$d('ORG_SHOP_STATUS', afterOrgShopStatus).then(data => {
          this.$set(this.shopData, 'shopStatus', data)
        })
        this.$d('ORG_SHOP_CATEGORY', data.shopCategory ? data.shopCategory : '').then(data => {
          this.$set(this.shopData, 'shopCategory', data)
        })
        data.shopArea > 0 ? data.shopArea = data.shopArea + '㎡' : ''
        // Promise.all([
        //   this.$d('ORG_SHOP_STATUS', afterOrgShopStatus),
        //   this.$d('ORG_SHOP_CATEGORY', data.shopCategory ? data.shopCategory : '')
        // ]).then(shoTypeData => {
        //   console.log(shoTypeData)
        //   this.shopData = Object.assign({}, data, {
        //     shopStatus: shoTypeData[0],
        //     shopCategory: shoTypeData[1]
        //   })
        // })
        this.shopData = data
        if (data.beginRunDate) {
          this.shopData.beginRunDate = moment(data.beginRunDate).format('YYYY-MM-DD') || ''
        } else {
          this.shopData.beginRunDate = ''
        }
        this.getDictData()

        if (data.belongArea) {
          req('getAreaField', {code: data.belongArea}).then(areaData => {
            this.shopData = Object.assign({}, this.shopData, {belongAreaName: areaData[0].areaName})
          })
        }
      })
      // req(this.requestUrls.detail.url, {id: this.tabData.orgUnitId, paramDate: this.paramDate}).then(data => {
      //   this.detailData = data
      //   this.getDictData()
      // })
    },
    getPos (option = this.posData.info) {
      this.posLoading = true

      let params = this.search.searchPosId
      ? Object.assign({orgUnitId: this.tabData.orgUnitId, id: this.tabData.orgUnitId, paramDate: this.paramDate, code: this.search.searchPosId, name: this.search.searchPosName}, option)
      : Object.assign({orgUnitId: this.tabData.orgUnitId, id: this.tabData.orgUnitId, paramDate: this.paramDate, name: this.search.searchPosName}, option)

      return req(this.requestUrls.pos.url, params).then(data => {
        Object.assign(this.posData, data)
        this.posLoading = false
      }).catch(() => {
        this.posLoading = false
      }).then(() => {
        this.$emit('heightChange')
      })
    },
    getEmp (o = this.empData.info) {
      return req(this.requestUrls.emp.url, Object.assign({id: this.tabData.orgUnitId, orgUnitId: this.tabData.orgUnitId, paramDate: this.paramDate, employeeCode: this.search.searchEmpId, fullName: this.search.searchEmpName}, o))
      .then(data => {
        Object.assign(this.empData, data)
        this.$emit('heightChange')
      })
      .catch(() => {
        this.$emit('heightChange')
      })
    },
    getEmpTotal () {
      return req(this.requestUrls.emp.total, { id: this.tabData.orgUnitId, orgUnitId: this.tabData.orgUnitId, paramDate: this.paramDate })
      .then(count => {
        this.empTotal = count
      })
    },
    getHistory (option = this.hisData.info) {
      return req(this.requestUrls.history.url, Object.assign({id: this.tabData.orgUnitId}, option)).then(data => {
        Object.assign(this.hisData, data)
      })
    },
    getShop () {
      return req('detail', {id: this.tabData.orgUnitId}).then(data => {
        this.shopData = data
        this.getShopArea()
      })
    },
    // 通过片区代码this.detailData.belongArea
    getShopArea () {
      // req('getAreaField', {code: this.detailData.belongArea}).then(data => {
      //   console.log(data)
      // })
    },
    tabChange (val) {
      if (val.name === 'staff') {
        this.empData.search = { id: this.tabData.orgUnitId, orgUnitId: this.tabData.orgUnitId, paramDate: this.paramDate }
      }

      this.$nextTick(() => {
        this.$refs.IFormPos.initLayout()
        this.$refs.IFormEmp.initLayout()
      })

      this.$emit('heightChange')
      // let stopAllTabLoading = () => {
      //   Object.keys(this.tabLoading).forEach(tabName => {
      //     this.tabLoading[tabName] = false
      //   })
      // }

      // if (!this.isDataInit[this.activeName]) {
      //   this.tabLoading[this.activeName] = true
      //   this.getTabPaneData()
      //   .then(() => {
      //     stopAllTabLoading()
      //     this.isDataInit[this.activeName] = true
      //   })
      //   .catch(() => {
      //     stopAllTabLoading()
      //   })
      // }
    },
    resetPosInputs () {
      this.search.searchPosId = ''
      this.search.searchPosName = ''
    },
    resetEmpInputs () {
      this.search.searchEmpId = ''
      this.search.searchEmpName = ''
    },
    dateFormat (row, col, value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD')
      } else {
        return ''
      }
    },
    setActiveTab (name) {
      this.activeName = 'details'
    }
  }
}
</script>
<style scoped>
  .center {
    display: flex;
    justify-content: center;
  }
  .key-value .item + .item {
    margin-top: 0px;
  }
  .key-value .item .value {
    margin-left: 10px;
    line-height: 24px;
    text-align: left;
    color: #8D8D8D;
  }
  .key-value .item .key {
    float: left;
    width:72px;
    line-height: 24px;
  }
  .table-width {
    width:99%;
    margin:0 auto;
  }
  .item {
    font-size:12px;
    font-weight: normal;
    color: #333333;
  }
  .tabs-lebel-size {
    font-size:14px;
    position:relative;
  }
</style>
