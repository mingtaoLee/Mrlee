<template>
  <div>
    <i-dialog
      title="合并小店"
      v-model="visible"
      :toolbar="dialogToolbar"
      size="huge"
      @close="closeDialog">
      <div class="transfer">
        <header class="header">
          <el-row v-if="combineInputStatus">
            <strong>门店名称:&nbsp;&nbsp;</strong>
            <span>{{orgShopNameVal}}</span>
          </el-row>
          <el-row v-else>
              <el-col :span="24">
              <span>选择门店
                <el-autocomplete
                  class="inline-input"
                  v-model="dateForm.state"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  @select="handleSelect"
                  :disabled="oldData.type"
                  maxlength="64">
                    <template slot-scope="props">
                      <div>{{ props.item.code + '：' + props.item.label }}</div>
                    </template>
                </el-autocomplete>
              </span>
                  <el-button
                    :disabled="combineStatus"
                    type="primary"
                    size="small"
                    @click="reset">重置</el-button>
                </el-col>
            </el-row>
            <el-row>
              <el-form
                ref="dateForm"
                prop="dateForm"
                :rules="dateRules"
                :inline="true"
                :model="dateForm">
                <el-form-item label="生效日期" prop="effectiveDate">
                <el-date-picker
                  :disabled="noResetTime"
                  v-model="dateForm.effectiveDate"
                  type="date"
                  placeholder="选择生效日期"
                  :picker-options="pickerStart"/>
                </el-form-item>
                <el-form-item label="失效日期" prop="uneffectiveDate">
                <el-date-picker
                  :disabled="formStatus === 'look' || (noResetTime === false && formStatus === 'edit')"
                  v-model="dateForm.uneffectiveDate"
                  type="date"
                  placeholder="选择失效日期"
                  :picker-options="pickerStart"/>
                </el-form-item>
              </el-form>
            </el-row>
        </header>
        <section>
          <el-row type="flex" justify="space-between">
            <el-col :span="11">
              <div>
                <strong class="no-merge-list">未合并列表</strong>
                <i-table
                  :table="beforeTable"
                  @save="getTableData"
                  @pageSizeChange="pageChange"
                  @pageIndexChange="pageChange" > 
                  <template slot="table" slot-scope="tableScope">
                    <el-table
                      border
                      :data="before"
                      max-height="250"
                      ref="multipleTable"
                      @select="selectionChange"
                      @selection-change="checkboxChange"
                      @row-click="rowClick"
                      v-loading="tableScope.loading"
                      @select-all="chooseAll"
                      highlight-current-row>
                      <el-table-column ref="beforeSelect" :selectable="selectable" type="selection" fixed="left"/>
                      <el-table-column
                        v-for="(col, idx) of beforeTable.columns || []"
                        :key="idx"
                        :label="col.label"
                        :prop="col.prop"
                        :align="col.align"
                        show-overflow-tooltip>
                      </el-table-column>
                    </el-table>
                  </template>
                </i-table>
              </div>
            </el-col>

            <el-col :span="2">
              <div class="combine">
                <el-button type="primary" @click="combine" :disabled="combineStatus">合并 -></el-button>
              </div>
            </el-col>

            <el-col :span="11">
              <div>
                <strong class="merge-list">已合并列表</strong>
                <i-table :table="afterTable" @save="getTableData">
                  <template slot="table" slot-scope="tableScope">
                    <el-table
                      max-height="250"
                      ref="table"
                      border
                      :data="tableScope.clone"
                      highlight-current-row>
                      <el-table-column
                        v-for="(col, idx) of afterTable.columns || []"
                        :key="idx"
                        :prop="col.prop"
                        :label="col.label"
                        :formatter="combineFormatter"
                        :align="col.align"
                        show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        width="150"
                        align="center">
                        <template slot-scope="scope">
                          <el-button
                            :disabled="combineStatus"
                            type="text"
                            size="small"
                            @click="cancelCombine(scope.row, scope.$index)">
                            取消合并
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </i-table>
                <el-row type="flex" justify="space-between">
                  <el-form class="last-form" :inline="true">
                    <el-col :span="12">
                      <el-form-item style="font-weight:bold" label="最后操作人">
                        <span>{{oldData.lastUpdateBy}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="4">
                      <el-form-item style="font-weight:bold;" label="最后操作时间">
                        <span>{{oldData.lastUpdateDate}}</span>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </section>
      </div>
      <!-- <template class="action-info" slot="combineAction">
        <strong>最后操作人:</strong>
        <span>张三</span>
        <strong class="action-time">最后操作时间:</strong>
        <span>2018-11-30</span>
      </template> -->
    </i-dialog>
  </div>
</template>

<script>
import req from 'api/org/combinestore'
import ITable from 'components/common/i-table'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
export default {
  name: 'dlog-modify',
  components: {
    ITable,
    IDialog
  },
  props: {
    noResetTime: Boolean,
    orgShopNameVal: String,
    combineInputStatus: Boolean,
    value: Boolean,
    oldData: Object,
    combineStatus: Boolean,
    checkStoresInfo: String,
    formStatus: String
  },
  data () {
    // 结束日期校验规则
    // 如果为空抛出异常'请输入结束日期'，如果结束日期早于开始日期抛出异常'结束日期不能早于开始日期'
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入结束日期'))
      }

      if (this.dateForm.effectiveDate > value) {
        callback(new Error('结束日期不能早于开始日期'))
      }

      callback()
    }
    return {
      visible: false,
      before: [],
      beforeTable: {
        columns: [
          {
            prop: 'orgStoreCode',
            label: '组织编码',
            width: '250px',
            align: 'center'
          },
          {
            prop: 'orgStoreName',
            label: '小店名称',
            width: '250px',
            align: 'center'
          }
        ],
        data: null,
        info: {
          pageSize: 10,
          pageIndex: 1
        },
        total: 0,
        showPagebar: true
      },
      afterTable: {
        columns: [
          {
            prop: 'orgCombineStoreList',
            label: '已组合小店',
            width: '400px',
            align: 'center'
          }
        ],
        data: [],
        info: {
          pageSize: 10,
          pageIndex: 1
        },
        search: ''
      },
      dialogToolbar: [
        {
          text: '取消',
          type: 'defalut',
          disabled: false,
          func: done => {
            this.cancel(done)
          }
        },
        {
          text: '确定',
          disabled: false,
          func: done => {
            this.confirm(done)
          }
        }
      ],
      // 开始日期，结束日期校验规则
      dateRules: {
        effectiveDate: [
          { required: true, message: '请输入开始日期' }
        ],
        uneffectiveDate: [
          { required: true, validator: validatePass }
        ]
      },
      pickerStart: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 2.592e9
        }
      },
      // element1.0版本远程搜索下拉菜单显示方式配置
      // inputProps: {
      //   value: 'orgShopId',
      //   label: 'orgShopName'
      // },
      dateForm: {
        state: '',
        effectiveDate: '',
        uneffectiveDate: ''
      },
      multiSelection: [],
      formData: [],
      orgShopId: '',
      orgCombineShopId: '',
      itemReadOnly: false
    }
  },
  watch: {
    value () {
      this.visible = this.value
      if (this.value) {
        this.init()
      }
    }
  },
  methods: {
    checkboxChange (selection) {
      // this.multiSelection = selection.map(item => {
      //   return item
      // })
      // console.log(this.multiSelection)
    },
    rowClick (row) {
      let index = this.multiSelection.findIndex(item => {
        return item.orgStoreId === row.orgStoreId
      })
      index >= 0 ? this.multiSelection.splice(index, 1) : this.multiSelection.push(row)
    },
    // 数据初始化
    init () {
      let today = new Date()
      let endDay = new Date('9999-12-31 00:00:00')
      this.dateForm.effectiveDate = this.oldData.effectiveDate ? this.oldData.effectiveDate : today.setDate(1)
      this.dateForm.uneffectiveDate = this.oldData.uneffectiveDate ? this.oldData.uneffectiveDate : endDay
      this.dialogToolbar[0].disabled = this.combineStatus
      this.dialogToolbar[1].disabled = this.combineStatus
      this.dateForm.state = this.checkStoresInfo
      this.beforeTable.total = 0
      if (this.oldData.data.constructor === Array) {
        this.oldData.data.forEach((item) => {
          this.afterTable.data.push(item)
        })
      }
      if (this.oldData.orgShopId) {
        this.itemReadOnly = true
        this.orgShopId = this.oldData.orgShopId
        this.orgCombineShopId = this.oldData.orgCombineShopId
        this.getShopStore(this.beforeTable.info)
      }
    },
    // before-table selection 改变时调用
    // 参数value:当前selection, row:操作当前行
    selectionChange (value, row) {
      let index = this.multiSelection.map(item => {
        return item.orgStoreId
      }).indexOf(row.orgStoreId)

      index === -1 ? this.multiSelection.push(row) : this.multiSelection.splice(index, 1)
    },
    // 合并操作
    combine () {
      if (this.multiSelection.length < 2) {
        return
      }
      let conbimeObj = {orgCombineStoreList: []}
      this.multiSelection.forEach(item => {
        item.effectiveDate = this.dateForm.effectiveDate
        item.uneffectiveDate = this.dateForm.uneffectiveDate
        conbimeObj.orgCombineStoreList.push(item)
      })
      this.afterTable.data.push(conbimeObj)
      this.multiSelection = []
    },
    // 控制before表格select是否可选
    // 参数row:当前行
    // 如果row当前行在afterTable中，则return false，否则return true
    selectable (row) {
      return !this.isInAfterTable(row.orgStoreId)
    },
    // 小店合并全选
    chooseAll (data) {
      // data.forEach(item => {
      //   let index = this.multiSelection.map(items => {
      //     return items.orgStoreId
      //   }).indexOf(item.orgStoreId)
      //   index === -1 ? this.multiSelection.push(item) : this.multiSelection.splice(index, 1)
      // })
      this.multiSelection = []
      let storeIdArray = []
      this.afterTable.data.forEach(item => {
        item.orgCombineStoreList.forEach(obj => {
          storeIdArray.push(obj.orgStoreId)
        })
      })
      data.forEach(item => {
        if (storeIdArray.includes(item.orgStoreId) === false) {
          this.multiSelection.push(item)
        }
      })
    },
    // 取消合并
    // 参数row:当前行, idx:当前行索引
    cancelCombine (row, idx) {
      this.afterTable.data.splice(idx, 1)
      this.before.forEach((item, index) => {
        if (!this.isInAfterTable(item.orgStoreId)) {
          this.$refs.multipleTable.toggleRowSelection(item, false)
        }
      })
    },
    // 判断某个小店是否在afterTable中
    // 参数storeId:传入的唯一小店Id
    // 如果在，则return true，否则return false
    isInAfterTable (storeId) {
      let combineArray = []
      if (!this.afterTable.data.length) {
        return
      }

      this.afterTable.data.forEach(item => {
        item.orgCombineStoreList.forEach(store => {
          combineArray.push(store.orgStoreId)
        })
      })
      if (combineArray.indexOf(storeId) === -1) {
        return false
      }

      return true
    },
    // after-table 数据格式化
    combineFormatter (row, column, cellValue) {
      let str = ''
      if (!row.orgCombineStoreList) {
        return
      }

      row.orgCombineStoreList.forEach((item, idx) => {
        idx !== row.orgCombineStoreList.length - 1 ? str += item.orgStoreName + ' + ' : str += item.orgStoreName
      })
      return str
    },
    // 模糊查询请求
    querySearch (queryString, resolve) {
      req('querySearch', {codeOrName: queryString}).then(data => {
        let selectArr = []
        selectArr = data.map(item => {
          return {value: item.orgShopId, label: item.orgShopName, code: item.shopCode ? item.shopCode : '未关联店编'}
        })
        resolve(selectArr)
      })
    },
    // 查询门店请求
    handleSelect (item) {
      this.orgShopId = item.value
      this.dateForm.state = item.label
      this.getShopStore()
    },
    // 获取门店下的小店
    getShopStore (option = {}) {
      // this.before = []
      if (!this.oldData.type) {
        this.orgCombineShopId = ''
      }
      req('addReq', Object.assign({orgShopId: this.orgShopId, orgCombineShopId: this.orgCombineShopId}, option)).then(data => {
        Object.assign(this.before, data.data)
        Object.assign(this.beforeTable, data)
        this.before.forEach((item, index) => {
          if (this.isInAfterTable(item.orgStoreId)) {
            this.$refs.multipleTable.toggleRowSelection(item)
          }
        })
      })
      this.formData.orgShopId = this.orgShopId
    },
    // 重置模糊查询input
    reset () {
      this.dateForm.state = ''
      this.before = []
      this.afterTable.data = []
    },
    // 关闭dialog前数据重置
    closeDialog () {
      this.afterTable.data = []
      this.before = []
      this.value = false
      this.$nextTick(() => {
        this.$refs.dateForm.resetFields()
      })
      this.$emit('input', false)
    },
    // 取消操作
    cancel () {
      this.closeDialog()
    },
    // 提交新增合并
    addCombine () {
      req('add', this.formData).then(data => {
        this.formData.combineInfo = []
        this.$emit('refreshList')
      })
    },
    // 提交编辑合并
    editCombine () {
      req('editPut', Object.assign(this.formData, {orgShopId: this.oldData.orgShopId, orgCombineShopId: this.oldData.orgCombineShopId})).then(data => {
        if (data) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
        let obj = {
          unCombineInfo: [],
          combineInfo: [],
          orgCombineShopDto: {
            orgShopId: '',
            effectiveDate: '',
            uneffectiveDate: ''
          }
        }
        Object.assign(this.formData, obj)
        this.$emit('refreshList')
      })
    },
    // 确定后整理提交数据
    confirm () {
      this.$refs.dateForm.validate(valid => {
        if (!valid) {
          return false
        }
        this.formData = []
        this.afterTable.data.forEach(items => {
          let array = []
          let orgShopId = ''
          items.orgCombineStoreList.forEach(item => {
            array.push(item.orgStoreId)
            orgShopId = item.orgShopId
          })
          let obj = {
            orgShopId: orgShopId,
            effectiveDate: this.dateForm.effectiveDate,
            uneffectiveDate: this.dateForm.uneffectiveDate,
            orgCombineShopId: this.oldData.orgCombineShopId,
            combineInfo: array
          }
          this.formData.push(obj)
        })
        this.oldData.type ? this.editCombine() : this.addCombine()
        this.closeDialog()
      })
    },
    // 当前页数改变时调用
    pageChange (page) {
      this.getShopStore(page)
    }
  }
}
</script>
<style scoped lang="scss">
  .transfer {
    align-items: flex-start;
    min-width: 1000px;
    max-height: 400px;
    header {
      margin-bottom: 20px;
      .el-row {
        display: flex;
        align-items: center;
        margin-top: 20px;
        .el-autocomplete {
          width: 440px;
          margin-left: 12px;
        }
      }
      .el-col {
        display: flex;
        justify-content: flex-start;
        padding-left: 10px;
      }
      .el-input{
        width: 200px;
      }
      .el-form-item {
        margin-bottom: 0px;
      }
      .el-button {
        margin-left: 10px;
      }
    }
    section {
      // display: flex;
      // justify-content: space-between;
      // align-items: center;
      .no-merge-list , .merge-list{
        height: 40px;
        background: #d4d3d3;
        display: flex;
        align-items: center;
        padding-left: 20px;
      }
    }
  }

  .uncombine {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    margin-bottom: 2px;
    border: 1px #e4e4e4 solid;
    background-color: #eef1f6;
  }
  .action-info{
    padding-right: 60%;
  }
  .combine{
    padding: 0 10px;
    margin-top: 150px;
  }
  .last-form{
    width: 100%;
  }
</style>
