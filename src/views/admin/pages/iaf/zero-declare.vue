<template>
  <i-layout  header-key="findLikeInsNodeclareRecordPost">
    <i-form  
      slot="header"
      @reset="resetInputs" 
      @search="search"
      v-model="searchData"
    >
      <el-form-item label="工号">
        <el-input v-model="searchData.employeeCode" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchData.fullName" clearable></el-input>
      </el-form-item>
      <el-form-item label="人事范围代码">
        <el-input v-model="searchData.personnelGroupCode" clearable></el-input>
      </el-form-item>
      <el-form-item label="人事范围名称">
        <el-input v-model="searchData.personnelGroupName" clearable></el-input>
      </el-form-item>
      <el-form-item label="保险类型">
        <i-select
          v-model="searchData.insuranceType"
          :hideKeys="hideInsuranceType"
          parameter="INSURANCE_TYPE"
          clearable
          placeholder="请选择"
      ></i-select>
      </el-form-item>
      <el-form-item label="户头代码">
        <el-input v-model="searchData.accountCode" clearable></el-input>
      </el-form-item>
      <el-form-item label="户头名称">
        <el-input v-model="searchData.accountName" clearable></el-input>
      </el-form-item>
      <el-form-item label="0申报月份起">
        <el-date-picker 
        type="month" 
        v-model="searchData.startMonth" 
        clearable
        :picker-options="startMonthOptions"
        @change="handleDateChange(searchData.startMonth, 'searchData', 'startMonth', 'string')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="0申报月份止">
        <el-date-picker 
        type="month" 
        v-model="searchData.endMonth" 
        clearable
        :picker-options="endMonthOptions"
        @change="handleDateChange(searchData.endMonth, 'searchData', 'endMonth', 'string')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="是否申报">
        <i-select v-model="searchData.declareStatus" :options="declareStatusOptions" clearable placeholder="请选择" :async="false"></i-select>
      </el-form-item>
    </i-form>
    <div slot="section">
      <i-table 
        @pageSizeChange="handleSizeChange" 
        @pageIndexChange="handleCurrentChange" 
        :table="table"
        ref="table"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            @selection-change="getDeleteArr"
            @sort-change="tableSort"
            v-loading="loading"
            :element-loading-text="$loadingText"
            :data="tableScope.clone"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column
              v-for="(col, key) in table.columns"
              :prop="col.prop"
              :min-width="col.width"
              :sortable="col.sort"
              align="center"
              :label="col.label"
              :formatter="tableScope.formatter"
              :key="key"
            >
              <el-table-column
                v-for="(item, index) in col.children"
                :prop="item.prop"
                :label="item.label"
                align="center"
                :min-width="item.width"
                :formatter="tableScope.formatter"
                :key="index"
              ></el-table-column>
            </el-table-column>
            <i-table-operator :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <zero-dialog
        @cancel="dialogCancel"
        @confirm="dialogConfirm"
        ref="otherDialog"
        :title="showTitle"
        :isEdit="isEdit"
        :noEdit="noEdit"
        :isDialogShow="isDialogShow"
        :dialogForm.sync="dialogFormData"
        :tableData="tableData"
        :showStatus="showStatus"
      ></zero-dialog>
    </div>
  </i-layout>
</template>

<script>
import ZeroDialog from 'components/iaf/zero-declare/zero-dialog'
import req, { config } from 'api/iaf/insurance-manage'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'

export default {
  name: 'ZeroDeclare',
  components: {
    ZeroDialog
  },
  data () {
    return {
      hideInsuranceType: ['03', '04', '05', '06', '07', '0A'],
      showStatus: false,
      noEdit: true,
      // 控制新增或修改的变量
      isEdit: false,
      isDialogShow: false,
      showTitle: '',
      // 删除的记录id数组
      deleteArr: [],
      loading: true,
      // 高级搜索数据
      searchData: {
        employeeCode: '',
        fullName: '',
        personnelGroupName: '',
        personnelGroupCode: '',
        startMonth: '',
        endMonth: '',
        insuranceType: '',
        accountName: '',
        declareStatus: '',
        accountCode: ''
      },
      declareStatusOptions: [
        { label: '是', value: 'Y' },
        { label: '否', value: 'N' }
      ],
      // 对话框表单数据
      dialogFormData: {
        employeeCode: '',
        fullName: '',
        personnelGroupName: '',
        personnelGroupCode: '',
        month: new Date(),
        declareDate: new Date()
      },
      // 对话框表格数据
      tableData: {
        lists: [
          // {typeCode: '', policyMoney: ''}
        ]
      },
      table: {
        columns: [
          {prop: 'personnelGroupCode', label: '人事范围代码', sort: false, width: '150'},
          {prop: 'personnelGroupName', label: '人事范围名称', sort: false, width: '150'},
          {prop: 'employeeCode', label: '工号', sort: false, width: '100'},
          {prop: 'fullName', label: '姓名', width: '100'},
          {prop: 'insuranceType', label: '保险类别', sort: false, width: '150', display: { dict: 'INSURANCE_TYPE' }},
          {prop: 'accountCode', label: '户头代码', sort: false, width: '150'},
          {prop: 'accountName', label: '户头名称', sort: false, width: '180'},
          {prop: 'month', label: '0申报月份', sort: false, width: '150', display: { date: 'yyyy-MM' }},
          {prop: 'declareStatus', label: '是否申报', sort: false, width: '150', display: { dict: 'WHETHER_TYPE' }},
          {prop: 'declareDate', label: '申请时间', sort: false, width: '150', display: { date: 'yyyy-MM-dd hh:mm:ss' }},
          {prop: 'createBy', label: '操作者', sort: false, width: '150'},
          {prop: 'createDate', label: '操作时间', sort: false, width: '150', display: { date: 'default' }}
        ],
        setting: {
          export: {
            config: {
              fileName: '0申报表'
            },
            key: 'findLikeInsNodeclareRecord',
            req: config.findLikeInsNodeclareRecord        // api 配置信息（参数名以自身业务为准）【必填】
          },
          toolbar: [
            {
              key: 'whetherExistAccountPost',
              text: '新增',
              func: this.addRecord
            }, {
              key: 'batchDeleteInsNodeclareRecordPost',
              text: '删除',
              func: this.deleteRecord
            }, {
              key: 'batchUpdateInsNodeclareRecord',
              text: '审核',
              func: this.examine
            }
          ],
          operator: [
            {
              key: 'UpdateInsNodeclareRecordPost',
              text: '修改',
              func: this.modificationRow
            }, {
              key: 'deleteInsNodeclareRecordPost',
              text: '删除',
              func: this.deleteRow
            }
          ],
          import: {
            key: 'importInsNodeclareRecordPost',
            business: 'Iaf-InsNodeclareRecord',
            show: () => ({empty: false})
          }
        },
        data: null,
        total: 0,
        info: null,
        search: null,
        showPagebar: true
      }
    }
  },
  mixins: [IafSearchMixin],
  mounted () {
    this.table.search = Object.assign({}, this.searchData)
  },
  methods: {
    fetch (options = {}) {
      this.searchData.payStartMonth && (this.searchData.payStartMonth = new Date(Date.parse(this.searchData.payStartMonth) + 3600 * 1000 * 8))
      this.searchData.payEndMonth && (this.searchData.payEndMonth = new Date(Date.parse(this.searchData.payEndMonth) + 3600 * 1000 * 8))
      this.loading = true
      req('findLikeInsNodeclareRecord', Object.assign({}, options, this.searchData))
        .then(res => {
          Object.assign(this.table, res)
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    // 将获取数据的函数捆绑在监听页面大小的回调中
    handleSizeChange (options) {
      this.fetch(options)
    },
    // 将获取数据的函数捆绑在监听页数的回调中
    handleCurrentChange (options) {
      this.fetch(options)
    },
    // 多选框选中时，或的删除数据的数组
    getDeleteArr (data) {
      this.deleteArr = data.map(item => {
        return item.iafInsNodeclareRecordId
      })
    },
    // 重置表单
    resetInputs () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    // 搜索按钮
    search () {
      this.table.search = Object.assign({}, this.searchData)
      this.fetch(this.table.info)
    },
    // 新增按钮
    addRecord () {
      // 清空弹出框数据
      for (let key in this.dialogFormData) {
        if (key !== 'declareDate' && key !== 'month') {
          this.dialogFormData[key] = ''
        }
      }
      this.dialogFormData.month = new Date()
      this.dialogFormData.declareDate = new Date()
      this.$refs.otherDialog.resetTableData()
      this.isEdit = false
      this.noEdit = true
      this.showTitle = '新增记录'
      this.isDialogShow = true
    },
    dialogCancel () {
      this.initZeroDialog()
    },
    // dialog确定按钮
    dialogConfirm (data) {
      if (!data.length) {
        this.$message({
          type: 'error',
          message: '请增加需要申报的险种'
        })
        this.$refs.otherDialog.toolbar[1].loading = false
        return
      }
      let submitData = Object.assign({}, this.dialogFormData)
      submitData.lists = data
      // 如果新增弹出框请求新增接口
      if (this.isEdit === false) {
        req('addInsNodeclareRecord', submitData)
        .then(data => {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.fetch(this.table.info)
          this.initZeroDialog()
          this.$refs.otherDialog.toolbar[1].loading = false
        })
        .catch(() => {
          this.$refs.otherDialog.toolbar[1].loading = false
        })
      // 如果修改弹出框请求更新接口
      } else if (this.isEdit === true) {
        req('updateInsNodeclareRecord', submitData)
        .then(data => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.fetch(this.table.info)
          this.initZeroDialog()
          this.$refs.otherDialog.toolbar[1].loading = false
        })
        .catch(() => {
          this.$refs.otherDialog.toolbar[1].loading = false
        })
      }
    },
    // 初始化zero-dialog
    initZeroDialog () {
      this.isEdit = false
      this.isDialogShow = false
      this.showTitle = ''
      for (let key in this.dialogFormData) {
        this.dialogFormData[key] = ''
      }
      this.tableData.lists.length = 0
    },
    // 审核
    examine () {
      if (this.deleteArr.length) {
        this.$confirm('确定要审核吗？').then(() => {
          req('examineInfo', this.deleteArr).then(data => {
            if (data === true) {
              this.$message({
                type: 'success',
                message: '审核成功'
              })
              this.fetch(this.table.info)
            } else {
              this.$message({
                type: 'error',
                message: '审核失败'
              })
            }
          })
        })
      } else {
        this.$message({
          type: 'info',
          message: '请至少选择一条记录'
        })
      }
    },
    // 删除按钮
    deleteRecord () {
      if (this.deleteArr.length) {
        this.$confirm('确定要删除记录吗？').then(() => {
          req('batchDeleteInsNodeclareRecord', this.deleteArr).then(data => {
            if (data === true) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.fetch(this.table.info)
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
        })
      } else {
        this.$message({
          type: 'info',
          message: '请至少选择一条记录'
        })
      }
    },
    // 行操作修改
    modificationRow (row) {
      this.noEdit = false
      this.isEdit = true
      req('findIafInsNodeclareRecordDto', {iafInsNodeclareRecordId: row.iafInsNodeclareRecordId}).then(data => {
        if (data) {
          if (data.lists[0].declareStatus === 'Y') {
            this.showStatus = true
          } else {
            this.showStatus = false
          }
          // 将时间戳转换为标准时间格式，否则表单验证出错
          data.declareDate = new Date(data.declareDate)
          data.month = new Date(data.month)
          this.dialogFormData = Object.assign({}, data)
          // 将list赋给表格
          this.$refs.otherDialog.handlerTableData(data.lists)
          this.isDialogShow = true
          this.showTitle = '修改记录'
        }
      })
    },
    // 行操作删除
    deleteRow (row) {
      this.$confirm('确定要删除记录吗？').then(() => {
        let params = {iafInsNodeclareRecordId: row.iafInsNodeclareRecordId}
        req('deleteInsNodeclareRecord', params).then(data => {
          if (data === true) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.fetch(this.table.info)
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content-card{
  padding:10px;
}
</style>
