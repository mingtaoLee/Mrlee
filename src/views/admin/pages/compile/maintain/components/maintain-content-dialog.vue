<template>
  <div class="wrap">
    <i-dialog title="查看编制信息" v-model="showDialog">
      <div class="showing">
        <el-tabs @tab-click="getTabList" v-model="activeName">
          <!-- 职务编制 -->
          <el-tab-pane label="职务编制" name="jobTab">
            <div class="controll-dialog" v-loading="loaded" :element-loading-text="$loadingText">
              <div class="mt10">
                <!-- 上部 -->
                <div class="top-basic-info">
                  <div class="top-basic-info mb10">
                    <p class="top-basic-info-left">组织名称：{{jobInfo.orgUnitName}}</p>
                    <p class="top-basic-info-right">所在地区：{{jobInfo.belongArea}}</p>
                  </div>
                </div>

                <p class="content-title bold mt10 padding5 ml-20 data-pl30">职务编制情况</p>

                <!-- 中部 -->
                <div class="top-basic-info mt10">
                  <div class="top-basic-info-left">
                    <p class="mb10">职务：{{jobInfo.posTitleName}}</p>
                    <p class="mb10">编制下限：{{jobInfo.scaLowerLimit}}</p>
                    <p class="mb10">编制上限：{{jobInfo.scaUpperLimit}}</p>
                    <p class="mb10">状态：{{jobInfo.scaStatus}}</p>
                    <p class="mb10">操作时间：{{jobInfo.lastUpdateDate}}</p>
                  </div>
                  <div class="top-basic-info-right">
                    <p class="mb10">实 际 数：{{jobInfo.actualScaleNum}}</p>
                    <p class="mb10">生效月份：{{jobInfo.effectiveDate}}</p>
                    <p class="mb10">失效月份：{{jobInfo.uneffectiveDate}}</p>
                    <p class="mb10">操 作 人：{{jobInfo.operator}}</p>
                    <p class="mb10">操作工号：{{jobInfo.employeeCode}}</p>
                  </div>
                </div>
                <p class="mb10">原因：{{jobInfo.remark}}</p>

                <!-- 下部 -->
                <div v-show="isShop && hasDailySales">
                  <p class="content-title bold mt10 padding5 ml-20 data-pl30">同省区/区域同业态同类型编制</p>

                  <div class="mt10">
                    <i-table :table="jobTable">
                      <template slot="table" slot-scope="tableScope">
                        <el-table :data="job" style="width: 100%" ref="jobTable">
                          <el-table-column
                            prop="dailySales"
                            label="日均销售额（万）"
                            align="right"
                            min-width="90"
                          >
                          </el-table-column>
                          <el-table-column
                            label="销售额幅度（±10%）"
                            align="right"
                            min-width="110"
                          >
                            <template slot-scope="scope">
                              <span>
                                {{scope.row.salesVolume}}
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="posTitleName"
                            label="当前职务"
                          >
                          </el-table-column>
                          <el-table-column
                            prop="avgLikeOrgStateNum"
                            label="同省区平均编制数"
                            align="right"
                            min-width="90"
                          >
                          </el-table-column>
                          <el-table-column
                            prop="avgLikeOrgAreaNum"
                            label="同区域平均编制数"
                            align="right"
                            min-width="90"
                          >
                          </el-table-column>
                        </el-table>
                      </template>
                    </i-table>
                  </div>
                </div>

              </div>
            </div>
          </el-tab-pane>

          <!-- 职务历史编制 -->
          <el-tab-pane label="职务历史编制" name="historyTab">
            <div class="controll-dialog" v-loading="loaded" :element-loading-text="$loadingText">
              <div class="mt10">
                <!-- 上部 -->
                <div class="top-basic-info">
                  <div class="top-basic-info mb10">
                    <p class="top-basic-info-left">组织名称：{{parentObj.orgUnitName}}</p>
                    <p class="top-basic-info-right">职务：{{parentObj.posTitleName}}</p>
                  </div>
                </div>

                <!-- 下部表格 -->
                <div class="mt10">
                  <i-table
                    :table="historyTable"
                    @pageSizeChange="handleHistoryChange"
                    @pageIndexChange="handleHistoryChange"
                  >
                    <template slot="table" slot-scope="tableScope">
                      <el-table
                        :data="tableScope.clone"
                        style="width: 100%"
                        ref="historyTable"
                      >
                        <el-table-column
                          v-for="(col, idx) of historyTable.columns"
                          :key="idx"
                          :prop="col.prop"
                          :label="col.label"
                          :formatter="tableScope.formatter"
                          :align="col.align"
                          show-overflow-tooltip
                        >
                        </el-table-column>
                      </el-table>
                    </template>
                  </i-table>
                </div>

              </div>
            </div>
          </el-tab-pane>

          <!-- 组织编制情况 -->
          <el-tab-pane label="组织编制情况" name="orgTab">
            <div class="controll-dialog" v-loading="loaded" :element-loading-text="$loadingText">
              <div class="mt10">
                <!-- 上部 -->
                <div class="top-basic-info">
                  <div class="top-basic-info mb10">
                    <p class="top-basic-info-left">组织名称：{{parentObj.orgUnitName}}</p>
                    <p class="top-basic-info-right">合计人数：{{totalPerson}}</p>
                  </div>
                </div>

                <!-- 下部表格 -->
                <div class="mt10">
                  <i-table
                    :table="orgTable"
                    @pageSizeChange="handleOrgChange"
                    @pageIndexChange="handleOrgChange"
                  >
                    <template slot="table" slot-scope="tableScope">
                      <el-table
                        :data="tableScope.clone"
                        style="width: 100%"
                        ref="orgTable"
                      >
                        <el-table-column
                          v-for="(col, idx) of orgTable.columns"
                          :key="idx"
                          :prop="col.prop"
                          :label="col.label"
                          :formatter="tableScope.formatter"
                          :align="col.align"
                          show-overflow-tooltip
                        >
                        </el-table-column>
                      </el-table>
                    </template>
                  </i-table>
                </div>

              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </i-dialog>
  </div>
</template>

<script>
  import reqMa from 'api/compile/maintain/index'
  import moment from 'moment'

  export default {
    name: '',
    components: {
    },
    props: {
      parentObj: {
        type: Object
      }
    },
    data () {
      return {
        loaded: true,
        isJobTab: false,
        isHistoryTab: false,
        isOrgTab: false,
        // 模态框的初始值
        showDialog: false,
        orgUnitId: this.parentObj.orgUnitId,
        posTitleId: this.parentObj.posTitleId,
        // 选中的选项卡配置
        activeName: 'jobTab',
        // 职务编制的数据
        jobInfo: {},
        job: [{
          dailySales: '',
          posTitleName: '',
          avgLikeOrgStateNum: '',
          avgLikeOrgAreaNum: '',
          salesVolume: ''
        }],
        isShop: false,
        hasDailySales: false,
        // 职务历史编制的列表数据
        historyTable: {
          columns: [
            { prop: 'effectiveDate', label: '生效月份', display: { date: 'short' } },
            { prop: 'uneffectiveDate', label: '失效月份', display: { date: 'short' } },
            { prop: 'scaLowerLimit', label: '编制下限', align: 'right' },
            { prop: 'scaUpperLimit', label: '编制上限', align: 'right' },
            { prop: 'employeeCode', label: '操作工号' },
            { prop: 'operator', label: '操作人' },
            { prop: 'lastUpdateDate', label: '操作时间', display: { date: '' } },
            { prop: 'remark', label: '原因' }
          ],
          info: null,
          data: null,
          search: null,
          total: 0,
          showPagebar: true
        },
        // 组织编制情况的列表数据
        totalPerson: '',
        orgTable: {
          columns: [
            { prop: 'posTitleName', label: '职务' },
            { prop: 'scaLowerLimit', label: '编制下限', align: 'right' },
            { prop: 'scaUpperLimit', label: '编制上限', align: 'right' },
            { prop: 'actualScaleNum', label: '实际数', align: 'right' },
            { prop: 'scaStatus', label: '状态', display: { dict: 'SCA_STATUS' } },
            { prop: 'effectiveDate', label: '生效月份', display: { date: 'short' } },
            { prop: 'uneffectiveDate', label: '失效月份', display: { date: 'short' } }
          ],
          info: null,
          data: null,
          search: null,
          total: 0,
          showPagebar: true
        }
      }
    },
    computed: {
      salesVolume () {
        let salesLower = 0
        let salesUp = 0
        if (!this.job[0].dailySales) {
          return ''
        } else {
          salesLower = parseFloat(this.job[0].dailySales * 0.9)
          salesUp = parseFloat(this.job[0].dailySales * 1.1)
          return `${Math.round(salesLower * 100) / 100} ~ ${Math.round(salesUp * 100) / 100}`
        }
      }
    },
    watch: {
      'parentObj' (newVal) {
        if (newVal) {
          this.parentObj = newVal
          this.initDetails()
          this.getJobList()
        }
      }
    },
    methods: {
      // tab卡的切换
      getTabList (tab) {
        if (tab.name === 'orgTab') {
          if (!this.isOrgTab) {
            this.isOrgTab = true
            this.orgTable.search = {}
            this.getTotalPerson()
          }
        } else if (tab.name === 'historyTab') {
          if (!this.isHistoryTab) {
            this.historyTable.search = {}
            this.isHistoryTab = true
          }
        } else {
          if (!this.isJobTab) {
            this.isJobTab = true
            this.getJobList()
          }
        }
      },
      // 初始化明细信息
      initDetails () {
        this.loaded = true
        this.activeName = 'jobTab'
        this.isJobTab = false
        this.isHistoryTab = false
        this.isOrgTab = false
        this.isShop = false
        this.hasDailySales = false
        this.job = []
        this.jobInfo = {}
        this.totalPerson = ''
      },
      // 获取职务编制的信息
      getJobList () {
        var params = {
          orgUnitId: this.parentObj.orgUnitId
        }
        var params1 = {
          scaTitleId: this.parentObj.scaTitleId
        }
        // 先判定是否为小店
        reqMa('selectOrgUnit', params).then(data => {
          if (data) {
            this.isShop = data
          }
        })
        reqMa('getJobList', params1).then(data => {
          if (data) {
            this.loaded = false
            // 生效，失效月份的转换
            data.effectiveDate = data.effectiveDate === null ? '' : moment(data.effectiveDate).format('YYYY-MM')
            data.uneffectiveDate = data.uneffectiveDate === null ? '' : moment(data.uneffectiveDate).format('YYYY-MM')
            data.lastUpdateDate = data.lastUpdateDate === null ? '' : moment(data.lastUpdateDate).format('YYYY-MM-DD')
            this.jobInfo = data
            this.$d('SCA_STATUS', this.jobInfo.scaStatus).then(data => {
              this.jobInfo.scaStatus = data
            })
            if (this.jobInfo.dailySales !== null) {
              this.hasDailySales = true
            }
            // 同省区平均编制数限制两位小数
            if (data.avgLikeOrgAreaNum) {
              data.avgLikeOrgAreaNum = Math.round(data.avgLikeOrgAreaNum * 100) / 100
            }
            if (data.avgLikeOrgStateNum) {
              data.avgLikeOrgStateNum = Math.round(data.avgLikeOrgStateNum * 100) / 100
            }
            this.job[0] = {
              dailySales: data.dailySales === null ? '' : data.dailySales,
              posTitleName: data.posTitleName,
              avgLikeOrgStateNum: data.avgLikeOrgStateNum,
              avgLikeOrgAreaNum: data.avgLikeOrgAreaNum
            }
            this.job[0].salesVolume = this.salesVolume
            this.loaded = false
          }
        })
      },
      // 获取职务历史编制的信息
      getHistoryList (params = {}) {
        this.loaded = true
        params.orgUnitId = this.parentObj.orgUnitId
        params.posTitleId = this.parentObj.posTitleId
        reqMa('getHistoryList', params).then(data => {
          if (data) {
            this.loaded = false
            this.historyTable = Object.assign(this.historyTable, data)
            this.loaded = false
          }
        })
      },
      // 每页展示多少条数据,获取置顶页数数据----职务历史编制列表
      handleHistoryChange (params) {
        this.getHistoryList(params)
      },
      // 获取组织编制情况的信息
      getOrgList (options = {}) {
        this.loaded = true
        options.orgUnitId = this.parentObj.orgUnitId
        reqMa('getOrgList', options).then(data => {
          if (data) {
            this.loaded = false
            this.orgTable = Object.assign(this.orgTable, data)
            this.loaded = false
          }
        })
      },
      // 每页展示多少条数据,获取置顶页数数据----组织编制情况的列表
      handleOrgChange (options) {
        this.getOrgList(options)
      },
      // 获取组织编制情况的信息--合计人数接口
      getTotalPerson () {
        var params = {
          orgUnitId: this.parentObj.orgUnitId
        }
        reqMa('getTotalPerson', params).then(data => {
          if (data) {
            this.totalPerson = data.scaleNum
          }
        })
      }
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
  .data-pl30{
    padding-left: 30px;
  }
</style>
