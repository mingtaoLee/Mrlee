<template>
  <div>
    <i-layout>
      <el-tabs slot="section" v-model="activeName" @tab-click="tabChange">
        <!-- <el-tab-pane style="width:20px;" disabled></el-tab-pane> -->
          <el-tab-pane name="shop">
            <span slot="label" class="tabs-lebel-size">合并小店管理</span>
            <div>
              <i-form 
                access-key="orgCombineShopsGet"
                ref="shop"
                @reset="resetInputs" 
                @search="searchForm" 
              >
                <el-form-item label="门店查询">
                <el-input  placeholder="输入关键字搜索"  v-model="searchShop.codeOrName" maxlength="64"/>
                </el-form-item>
                <!-- <el-form-item label="大区区域">
                <el-select v-model="searchShop.largeArea" placeholder="选择所在区域">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
                </el-select>
                </el-form-item> -->
                <el-form-item label="大区区域">
                  <i-select-area
                  type="yonghui"
                  search
                  returnNode
                  v-model="searchShopLargeArea"
                  @change="handleBelongAreaChange"></i-select-area>
                </el-form-item>
                <el-form-item label="生效日期">
                <el-date-picker placeholder="选择日期" type="date" :editable="false" v-model="searchShop.effectiveStartDate"></el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="生效期结束">
                <el-date-picker placeholder="选择日期" type="date" :editable="false" v-model="searchShop.effectiveEndDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="失效期开始">
                <el-date-picker placeholder="选择日期" type="date" :editable="false" v-model="searchShop.uneffectiveStartDate"></el-date-picker>
                </el-form-item> -->
                <el-form-item label="失效日期">
                <el-date-picker placeholder="选择日期" type="date" :editable="false" v-model="searchShop.uneffectiveEndDate"></el-date-picker>
                </el-form-item>
              </i-form>
            </div>
            <div class="content">
              <div>
                <i-table :table="shopTable"
                @pageSizeChange="pageChange"
                @pageIndexChange="pageChange"
                @save="getTableData"
                ref="iTable">
                <template slot="table" slot-scope="tableScope">
                  <el-table
                    border
                    :data="tableScope.clone"
                    v-loading="shopLoading"
                    :element-loading-text="$loadingText"
                    @selection-change="selectionChange"
                    highlight-current-row>
                    <!-- <el-table-column type="selection" fixed="left"/> -->
                    <el-table-column
                      v-for="(col, idx) of shopTable.columns || []"
                      :key="idx"
                      :prop="col.prop"
                      :label="col.label"
                      :formatter="tableScope.formatter"
                      :width="col.width"
                      :align="col.align"
                      show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column  label="操作" fixed="right" width="120" align="center">
                      <template slot-scope="scope">
                        <el-button
                          v-if="scope.row.status !== '1'"
                          type="text" size="small"
                          @click="check(scope.row)">
                          查看
                        </el-button>
                        <template v-else slot-scope="scope">
                          <el-button
                            v-if="accessMap.orgCombineShopOrgShopIdCombineInfoPost"
                            type="text"
                            size="small"
                            @click="edit(scope.row)">
                            编辑
                          </el-button>
                          <el-button
                            v-if="accessMap.orgCombineShopUneffectiveDatePut"
                            type="text"
                            size="small"
                            @click="endShop(scope.row)">
                            结束
                          </el-button>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
                </i-table>
              </div>
            </div>
            <dlog-addmodify
              @refreshList="init"
              v-model="dlogAddModifyVisible"
              :oldData="oldData"
              :checkStoresInfo="checkStoresInfo"
              :combineInputStatus="combineInputStatus"
              :orgShopNameVal="orgShopNameVal"
              :noResetTime="noResetTime"
              :formStatus="formStatus"
              :combineStatus="combineStatus">
            </dlog-addmodify>
            <i-dialog
              title="结束日期"
              v-model="endVisible"
              :toolbar="dialogToolbar"
              class="i-dialog-width-350"
              @close="closeDialog">
               <el-date-picker placeholder="选择日期" type="date" v-model="uneffectiveDate.uneffectiveDate"></el-date-picker>
            </i-dialog>
          </el-tab-pane>
          <el-tab-pane name="details">
            <span slot="label" class="tabs-lebel-size">合并小店详情</span>
            <div>
              <i-form 
                access-key="orgCombineStoresGet"
                @reset="resetInputs"
                @search="searchFormDetails"
                ref="store">
              <el-form-item label="门店搜索">
                <el-autocomplete
                  class="inline-input"
                  v-model="orgShopId"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  @select="handleSopSelect"
                  maxlength="64">
                    <template slot-scope="props">
                      <div>{{ props.item.code + '：' + props.item.label }}</div>
                    </template>
                    <i
                      class="el-icon-close"
                      slot="suffix"
                      @click="handleIconClear"
                    >
                    </i>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="搜索小店">
                <el-input  placeholder="请输入小店名称" v-model="searchStore.codeOrName" maxlength="64"/>
              </el-form-item>
              <el-form-item label="搜索标准小店">
                <el-autocomplete
                  class="inline-input"
                  v-model="orgStandardIds"
                  :fetch-suggestions="getorgStandardList"
                  placeholder="请输入标准小店名称"
                  @select="handleSelect">
                    <template slot-scope="props">
                      <div>{{ props.item.code + "：" + props.item.label }}</div>
                    </template>
                  <i
                    class="el-icon-close"
                    slot="suffix"
                    @click="handleIconClick"
                  >
                  </i>
                </el-autocomplete>
              </el-form-item>
              <!-- <el-form-item label="大区区域">
                <el-select v-model="searchStore.largeArea" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item> -->
              <el-form-item label="大区区域">
                  <i-select-area
                  type="yonghui"
                  search
                  returnNode
                  v-model="searchStoreLargeArea"
                  @change="handleBelongStoreAreaChange"></i-select-area>
              </el-form-item>
              <el-form-item label="生效日期">
                <el-date-picker
                  placeholder="选择日期"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="searchStore.effectiveStartDate"/>
              </el-form-item>
              <!-- <el-form-item label="生效期结束">
                <el-date-picker
                  placeholder="选择日期"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="searchStore.effectiveEndDate"/>
              </el-form-item>
              <el-form-item label="失效期开始">
                <el-date-picker
                  placeholder="选择日期"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="searchStore.uneffectiveStartDate"/>
              </el-form-item> -->
              <el-form-item label="失效日期">
                <el-date-picker
                  placeholder="选择日期"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="searchStore.uneffectiveEndDate"/>
              </el-form-item>
              </i-form>
            </div>

            <div class="content">
              <div>
                <i-table :table="storeTable"
                @pageSizeChange="getCombineDetailsList"
                @pageIndexChange="getCombineDetailsList"
                @save="getTableData">
                <template slot="table" slot-scope="tableScope">
                <el-table
                  ref="table"
                  border
                  :data="tableScope.clone"
                  v-loading="tableScope.loading"
                  :element-loading-text="$loadingText"
                  @selection-change="selectionChange"
                  highlight-current-row>
                  <!-- <el-table-column type="selection" fixed="left"/> -->
                  <el-table-column
                    v-for="(col, idx) of storeTable.columns || []"
                    :key="idx"
                    :prop="col.prop"
                    :label="col.label"
                    :formatter="tableScope.formatter"
                    :width="col.width"
                    :align="col.align"
                    show-overflow-tooltip="true">
                  </el-table-column>
                  <!-- <el-table-column  label="操作" fixed="right" width="120" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="endStore(scope.row)">结束</el-button>
                      <el-button type="text" size="small" @click="deleteStore(scope.row)">删除</el-button>
                    </template>
                  </el-table-column> -->
                </el-table>
                </template>
                </i-table>
              </div>
            </div>
        </el-tab-pane>
      </el-tabs>
    </i-layout>
  </div>
</template>
<script>
import ITable from 'components/common/i-table'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import ILayout from 'components/common/i-layout'
import IForm from 'components/common/i-form/i-form.vue'
import dlogAddmodify from 'components/org/combinestore/dlog-addmodify'
import dlogUpload from 'components/org/combinestore/dlog-upload'
import req, {config} from 'api/org/combinestore'
import {filter} from 'utils/compile'
import access from 'mixins/access'
import ISelectArea from 'components/common/i-select-area'
import moment from 'moment'
export default {
  name: 'combinestore',
  components: {
    dlogAddmodify,
    IForm,
    ITable,
    IDialog,
    ILayout,
    dlogUpload,
    ISelectArea
  },
  mixins: [access],
  data () {
    return {
      orgStandardIds: '',
      orgShopId: '',
      lastData: true,
      searchStoreLargeArea: '',
      searchShopLargeArea: '',
      noResetTime: false,
      orgShopNameVal: '',
      combineInputStatus: false,
      checkStoresInfo: '',
      combineStatus: false,
      multiSelection: null,
      dlogAddModifyVisible: false,
      dialogUploadVisible: false,
      shopLoading: false,
      formStatus: 'add',
      oldData: {
        data: {},
        type: ''
      },
      uneffectiveDate: {
        uneffectiveDate: '',
        orgCombineShopId: ''
      },
      endVisible: false,
      activeName: 'shop',
      messageVisible: false,
      endShopId: '',
      searchShop: {
        codeOrName: '',
        effectiveStartDate: '',
        effectiveEndDate: '',
        uneffectiveStartDate: '',
        uneffectiveEndDate: '',
        orgShopId: ''
      },
      searchStore: {
        codeOrName: '',
        effectiveStartDate: '',
        effectiveEndDate: '',
        uneffectiveStartDate: '',
        uneffectiveEndDate: '',
        orgStandardId: ''
      },
      dialogToolbar: [
        {
          text: '保存',
          func: done => {
            this.confirm(done)
          }
        },
        {
          text: '取消',
          type: 'defalut',
          func: done => {
            this.cancel(done)
          }
        }
      ],
      shopTable: {
        title: '',     // 标题【可选】
        columns: [    // 表头【必填】
          {
            prop: 'shopCode',
            label: '门店编号',
            align: 'center'
          },
          {
            prop: 'largeAreaName',
            label: '大区',
            align: 'center'
          },
          {
            prop: 'areaName',
            label: '区域',
            align: 'center'
          },
          {
            prop: 'orgShopName',
            label: '门店',
            align: 'center'
          },
          {
            prop: 'effectiveDate',
            label: '生效日期',
            align: 'center',
            display: {date: 'default'}
          },
          {
            prop: 'uneffectiveDate',
            label: '失效日期',
            align: 'center',
            display: {date: 'default'}
          }
          // {
          //   prop: 'remark',
          //   label: '备注说明'
          // }
        ],
        setting: {        // 可编辑表格的相关设置【可选】
          toolbar: [
            {
              text: '新增',
              func: this.addOrg,
              key: 'orgCombineShopCombineInfoPost'
            }
            // {
            //   text: '导入',
            //   func: this.uploadFile,
            //   key: 'orgCombineImportPost'
            // }
            // {
            //   text: '导入',
            //   func: this.uploadFile
            // }
          ],     // 工具栏【可选】
          export: {
            req: config.shops,        // api 配置信息（参数名以自身业务为准）【必填】
            elTable: null,                 // el-table 实例，在 mounted 时挂载【必填】
            key: 'orgCombineExportPost',
            config: {
              fileName: '合并小店管理列表',
              sync: {
                all: false,
                page: true,
                select: true
              }
            }
          },
          import: {
            key: 'orgCombineImportPost',
            business: 'org-combineStore',
            show: () => ({empty: false})
          }
        },
        data: null,   // 占位符，用于挂载数据【必填】
        info: null,
        search: '',
        total: 0,
        showPagebar: true
      },
      storeTable: {
        title: '',     // 标题【可选】
        columns: [    // 表头【必填】
          {
            prop: 'shopCode',
            label: '门店编码',
            align: 'center'
          },
          {
            prop: 'largeAreaName',
            label: '大区',
            align: 'center'
          },
          {
            prop: 'areaName',
            label: '区域',
            align: 'center'
          },
          {
            prop: 'orgStoreName',
            label: '小店名称',
            align: 'center'
          },
          {
            prop: 'orgShopName',
            label: '门店',
            align: 'center'
          },
          {
            prop: 'storesName',
            label: '合并小店情况',
            align: 'center'
          },
          {
            prop: 'effectiveDate',
            label: '生效日期',
            align: 'center',
            display: {date: 'yyyy-MM-dd'}
          },
          {
            prop: 'uneffectiveDate',
            label: '失效日期',
            align: 'center',
            display: {date: 'yyyy-MM-dd'}
          },
          {
            prop: 'lastUpdateBy',
            label: '最后操作人',
            align: 'center'
          },
          {
            prop: 'lastUpdateDate',
            label: '最后操作时间',
            align: 'center',
            display: {date: 'yyyy-MM-dd'}
          }
        ],
        setting: {        // 可编辑表格的相关设置【可选】
          export: {
            config: {
              fileName: '合并小店详情列表',
              sync: {
                all: false,
                page: true,
                select: true
              }
            },
            req: config.stores,        // api 配置信息（参数名以自身业务为准）【必填】
            elTable: null,                 // el-table 实例，在 mounted 时挂载【必填】
            key: 'orgCombineDetileExportPost'
          }

        },
        data: null,   // 占位符，用于挂载数据【必填】
        info: null,
        search: '',
        total: 0,
        showPagebar: true
      }
    }
  },
  // created () {
  //   this.init()
  // },
  mounted () {
    // this.shopTable.setting.export.elTable = this.$refs.table  // 挂载
    this.storeTable.setting.export.elTable = this.$refs.table  // 挂载
    // this.$refs.iTable.pageIndexChangeHandler(1)
    this.shopTable.setting.export.elTable = this.$refs.iTable
    this.shopTable.search = Object.assign({}, this.searchShop, {lastData: this.lastData})
    this.storeTable.search = Object.assign({}, this.searchStore, {lastData: this.lastData})
  },
  methods: {
    // 初始化列表数据
    init () {
      // let arr = ['']
      // let obj = {
      //   codeOrName: '',
      //   effectiveStartDate: '',
      //   effectiveEndDate: '',
      //   uneffectiveStartDate: '',
      //   uneffectiveEndDate: '',
      //   // orgStoreIdList: arr,
      //   largeArea: ''
      // }
      req('shops').then(data => Object.assign(this.shopTable, data))
      // req('stores', obj).then(data => {
      //   Object.assign(this.storeTable, data)
      // })
      req('stores', Object.assign(this.searchStore, {largeArea: ''})).then(data => {
        Object.assign(this.storeTable, data)
      })
    },
    // 重置按钮
    resetInputs () {
      this.searchStoreLargeArea = ''
      this.searchShopLargeArea = ''
      this.orgStandardIds = ''
      this.orgShopId = ''
      Object.assign(this.searchShop, {
        codeOrName: '',
        effectiveStartDate: '',
        effectiveEndDate: '',
        uneffectiveStartDate: '',
        uneffectiveEndDate: '',
        largeArea: '',
        pageIndex: 1
      })
      Object.assign(this.searchStore, {
        codeOrName: '',
        effectiveStartDate: '',
        effectiveEndDate: '',
        uneffectiveStartDate: '',
        uneffectiveEndDate: '',
        orgShopId: '',
        largeArea: '',
        pageIndex: 1,
        orgStandardId: ''
      })
    },
    handleIconClear () {
      this.orgShopId = ''
      this.searchStore.orgShopId = ''
    },
    // 复选框改变事件
    // 参数selection返回当前选择，type为Array
    selectionChange (selection) {
      this.multiSelection = selection
    },
    // tabs页改变事件
    tabChange ({name}) {
      // this.$nextTick(() => this.$refs[name][0].initLayout())
      this.$nextTick(() => {
        this.searchStoreLargeArea = ''
        this.searchShopLargeArea = ''
        this.$refs.shop && this.$refs.shop.initLayout()
        this.$refs.shop && this.$refs.store.initLayout()
      })
    },
    // 请求表格数据
    // 参数currentPage表示请求当前页
    getCombineList (options) {
      this.shopLoading = true
      req('shops', Object.assign({}, this.searchShop, options)).then(data => {
        Object.assign(this.shopTable, data)
        this.multiSelection = null
        this.shopLoading = false
      }).catch(() => {
        this.shopTable.data = []
        this.shopLoading = false
      })
    },
    // 合并小店详情翻页
    getCombineDetailsList (options) {
      let pageOption = filter(options)
      req('stores', Object.assign({}, this.searchStore, pageOption)).then(data => {
        Object.assign(this.storeTable, data)
        // this.loading = false
      }).catch(() => {
        this.storeTable.data = []
      })
    },
    // 查询按钮点击事件，格式化搜索数据
    searchForm () {
      let param = filter(this.searchShop)
      this.shopTable.search = { ...param }
    },
    searchFormDetails () {
      // let arr = ['']
      // let obj = this.searchStore
      // obj.orgStoreIdList = arr
      // req('stores', this.searchStore).then(data => {
      //   Object.assign(this.storeTable, data)
      // })
      let param = filter(this.searchStore)
      this.storeTable.search = { ...param }
    },
    // 新增按钮点击事件，打开新增dialog
    addOrg () {
      let obj = {
        data: {
          unCombineInfo: [],
          combineInfoDetail: [],
          orgCombineShopDto: {
            orgUnitId: '',
            effectiveDate: '',
            uneffectiveDate: ''
          }
        },
        type: false
      }
      this.formStatus = 'add'
      this.oldData = obj
      this.dlogAddModifyVisible = true
      this.combineStatus = false
      this.combineInputStatus = false
      this.noResetTime = false
      this.checkStoresInfo = ''
    },
    // 编辑按钮点击事件，请求当前行数据传入dialog模块
    edit (row) {
      req('edit', {orgCombineShopId: row.orgCombineShopId, orgShopId: row.orgShopId}).then(data => {
        let obj = {
          data: data,
          type: true,
          orgShopId: row.orgShopId,
          orgCombineShopId: row.orgCombineShopId,
          effectiveDate: row.effectiveDate,
          uneffectiveDate: row.uneffectiveDate,
          lastUpdateBy: row.lastUpdateBy,
          lastUpdateDate: row.lastUpdateDate ? moment(row.lastUpdateDate).format('YYYY-MM-DD') : ''
        }
        this.formStatus = 'edit'
        this.oldData = obj
        this.orgShopNameVal = row.orgShopName
        this.dlogAddModifyVisible = true
        this.combineStatus = false
        this.combineInputStatus = true
        this.noResetTime = false
        this.checkStoresInfo = ''
      })
    },
    // 导入按钮点击事件
    uploadFile () {
      this.dialogUploadVisible = true
    },
    // 结束按钮点击事件
    // 参数row为当前行数据
    endShop (row) {
      this.endShopId = row.orgShopId
      this.uneffectiveDate.orgCombineShopId = row.orgCombineShopId
      this.endVisible = true
    },
    closeDialog () {
      this.endVisible = false
    },
    cancel () {
      this.closeDialog()
    },
    confirm () {
      let param = this.uneffectiveDate
      if (!param.uneffectiveDate) {
        return this.$message.error('请选择失效日期')
      }
      req('end', {orgShopId: this.endShopId, ...param}).then(data => {
        this.init()
      })
      this.closeDialog()
    },
    check (row) {
      req('edit', {orgCombineShopId: row.orgCombineShopId, orgShopId: row.orgShopId}).then(data => {
        let obj = {
          data: data,
          type: true,
          orgShopId: row.orgShopId,
          orgCombineShopId: row.orgCombineShopId,
          effectiveDate: row.effectiveDate,
          uneffectiveDate: row.uneffectiveDate,
          lastUpdateBy: row.lastUpdateBy,
          lastUpdateDate: row.lastUpdateDate ? moment(row.lastUpdateDate).format('YYYY-MM-DD') : ''
        }
        this.formStatus = 'look'
        this.oldData = obj
        this.dlogAddModifyVisible = true
        this.combineStatus = true
        this.combineInputStatus = false
        this.noResetTime = true
        this.checkStoresInfo = row.orgShopName
      })
    },
    // 当前页改变事件
    // 参数page为当前page
    pageChange (page) {
      this.getCombineList(page)
    },
    handleBelongAreaChange (area) {
      this.searchShop.largeArea = area.areaCode
    },
    handleBelongStoreAreaChange (area) {
      this.searchStore.largeArea = area.areaCode
    },
    getorgStandardList (queryString, resolve) {
      req('orgStandard', {orgStandardCodeOrName: queryString}).then(data => {
        let selectArr = []
        selectArr = data.map(item => {
          return {value: item.orgStandardId, code: item.orgStandardCode, label: item.orgStandardName}
        })
        resolve(selectArr)
      })
    },
    handleSelect (item) {
      this.orgStandardIds = item.label
      this.searchStore.orgStandardId = item.value
    },
    handleSopSelect (item) {
      this.orgShopId = item.label
      this.searchStore.orgShopId = item.value
    },
    handleIconClick () {
      this.orgStandardIds = ''
      this.searchStore.orgStandardId = ''
    },
    // 模糊查询请求
    querySearch (queryString, resolve) {
      req('querySearch', {codeOrName: queryString}).then(data => {
        let selectArr = []
        if (data.length === 0) {
          this.searchStore.orgShopId = 'notdata'
        }
        selectArr = data.map(item => {
          return {value: item.orgShopId, label: item.orgShopName, code: item.shopCode ? item.shopCode : '未关联店编'}
        })
        resolve(selectArr)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-tabs {
    /deep/ .el-tabs__header {
      margin-bottom: 10px;
    }
  }

  .el-dialog {
    display: flex;
    justify-content: center;
  }

  .el-upload-list {
    display: inline-block;
    width: 200%;
  }

  .el-upload-list--text {
    width: 200%;
  }

  .upload {
    width: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    ul {
        width: 100px;
    }
  }

  .content {
    margin-top: 10px;
  }
  
  .head-content-card {
    background: #FFFFFF !important;
      border: 1px solid #E5E5E5;
      border-radius: 2px;
      height: 100%;
      overflow: hidden;
      box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding:30px;
  }
</style>
