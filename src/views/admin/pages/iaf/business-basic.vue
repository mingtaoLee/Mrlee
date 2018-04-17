<template>
  <i-layout header-key="findLikeInsCommercialPolicyPost">
    <div slot="header">
      <i-form @reset="resetInputs" @search="search">
        <el-form-item label="人事范围代码:">
          <el-input v-model="searchData.personnelGroupCode"></el-input>
        </el-form-item>
        <el-form-item label="人事范围名称:">
          <el-input v-model="searchData.personnelGroupName"></el-input>
        </el-form-item>
        <el-form-item label="保险公司:">
          <el-input v-model="searchData.insuranceCompanyName"></el-input>
        </el-form-item>
        <el-form-item label="保单号:">
          <el-input v-model="searchData.policyCode"></el-input>
        </el-form-item>
        <el-form-item label="保单金额:">
          <el-input v-model="searchData.policyMoney"></el-input>
        </el-form-item>
        <el-form-item label="最大参保人数:">
          <el-input v-model="searchData.insuredNumberPeople"></el-input>
        </el-form-item>
      </i-form>
    </div>
    <div slot="section">
      <i-table
        :table="table"
        ref="table"
        @pageSizeChange="searchHandleSizeChange"
        @pageIndexChange="searchHandleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            @selection-change="selectionChange"
            @sort-change="sortChange"
            :border="$$.table.border"
            :stripe="$$.table.stripe"
            :data="tableScope.clone"
            v-loading="loading"
            :element-loading-text="$loadingText"
          >
              <el-table-column type="selection" :fixed="true"></el-table-column>
              <el-table-column
                :sortable="col.sort"
                v-if="col.show"
                v-for="(col, idx) in table.columns"
                :prop="col.prop"
                :label="col.label"
                :key="idx"
                align="center"
                :width="col.width"
                :formatter="tableScope.formatter">
              </el-table-column>
              <i-table-operator :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <business-dialog
        ref="businessDialog"
        :uneffectiveStatus="uneffectiveStatus"
        :isDialogShow="isDialogShow"
        :title="showTitle"
        :changeRow="changeRow"
        @confirm="dialogConfirm"
        @cancel="dialogCancel"
        :dialogForm.sync="dialogFormData"
      ></business-dialog>
    </div>
  </i-layout>
</template>

<script>
  import req, {config} from 'api/iaf/iaf-basic'
  import Screen from 'components/iaf/fund/screen.vue'
  import BusinessDialog from 'components/iaf/business-basic/business-dialog'
  import Access from 'mixins/access'
  import IafBaseInfo from 'mixins/compensation/iaf-base-info'
  export default {
    components: {
      Screen,
      BusinessDialog
    },
    data () {
      return {
        uneffectiveStatus: true,
        checkStatuVal: '',
        accessKey: {
          batchDeleteInsCommercialPolicy: '删除（按钮）',
          findLikeInsCommercialPolicy: '导出',
          findLikeInsCommercialPolicyPost: '查询',
          deleteInsCommercialPolicy: '删除（行）',
          importInsCommercialPolicy: '导入',
          updateInsCommercialPolicy: '修改',
          findLikeCommercialPolicys: '新增'
        },
        visible: false,
        changeRow: false,
        deleteArr: [],
        showTitle: '',
        loading: false,
        tableLoading: false,
        isDialogShow: false,
        isAddOrEdit: null,
        employeeId: this.$store.state.user.info.empEmployeeId,
        searchData: {
          personnelGroupCode: '',
          personnelGroupName: '',
          insuranceCompanyName: '',
          policyCode: '',
          policyMoney: '',
          insuredNumberPeople: ''
        },
        dialogFormData: {
          personnelGroupName: '',
          personnelGroupCode: '',
          insuranceCompanyName: '',
          policyCode: '',
          policyMoney: '',
          insuredNumberPeople: '',
          effectiveDate: '',
          uneffectiveDate: ''
        },
        table: {
          columns: [
            { prop: 'areaProvinceName', label: '省区', show: true, width: '200' },
            { prop: 'areaParentName', label: '市区', show: true, width: '200' },
            { prop: 'areaName', label: '区域', show: true, width: '200' },
            { prop: 'personnelGroupCode', label: '人事范围代码', show: true, width: '150' },
            { prop: 'personnelGroupName', label: '人事范围名称', show: true, width: '150' },
            { prop: 'insuranceCompanyName', label: '保险公司', show: true, width: '150' },
            { prop: 'policyCode', label: '保单号', show: true, width: '150' },
            { prop: 'insuredNumberPeople', label: '最大参保人数', show: true, width: '150' },
            { prop: 'policyMoney', label: '保单金额', show: true, width: '150' },
            { prop: 'effectiveDate', label: '生效日期', show: true, width: '150', display: {date: 'default'} },
            { prop: 'uneffectiveDate', label: '失效日期', show: true, width: '150', display: {date: 'default'} }
          ],
          setting: {
            toolbar: [{
              text: '新增',
              key: 'findLikeCommercialPolicys',
              func: this.addRecord
            },
            {
              text: '删除',
              type: 'danger',
              key: 'batchDeleteInsCommercialPolicy',
              func: this.deleteRecord
            }],
            export: {
              config: {
                fileName: '人事范围商业险设置表'
              },
              req: config.findLikeInsCommercialPolicy,
              key: 'findLikeInsCommercialPolicy'
            },
            operator: [
              {
                text: '修改',
                func: this.modificationRow,
                key: 'updateInsCommercialPolicy'
              },
              {
                text: '删除',
                func: this.deleteRow,
                key: 'deleteInsCommercialPolicy'
              }
            ],
            import: {
              business: 'iaf-InsCommercialPolicy',
              key: 'importInsCommercialPolicy',
              show: () => ({empty: false})
            }
          },
          data: null,
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        }
      }
    },
    mixins: [Access, IafBaseInfo],
    mounted () {
      this.loading = true
      this.table.search = Object.assign({}, this.searchData)
      this.testKey()
    },
    methods: {
      fetch (options = {}) {
        this.loading = true
        req('findLikeInsCommercialPolicy', Object.assign({}, options, this.searchData))
          .then(res => {
            Object.keys(res).map(key => (this.table[key] = res[key]))
            this.loading = false
          })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
      },
      search () {
        this.table.search = Object.assign({}, this.searchData)
      },
      resetInputs () {
        for (var key in this.searchData) {
          this.searchData[key] = ''
        }
      },
      // 每页显示的条数改变时
      searchHandleSizeChange (options) {
        this.fetch(options)
      },
      // 页数改变时
      searchHandleCurrentChange (options) {
        this.fetch(options)
      },
      // 监听多选
      selectionChange (row) {
        this.deleteArr = row
      },
      // 新增按钮
      addRecord () {
        this.editDefual()
        this.isAddOrEdit = 'add'
        this.showTitle = '新增人事范围商业险设置'
        this.isDialogShow = true
        this.changeRow = false
        this.uneffectiveStatus = true
      },
      // 删除按钮
      deleteRecord () {
        if (this.deleteArr.length === 0) {
          this.$message({
            type: 'warning',
            message: '请勾选要删除的记录！'
          })
          return false
        }
        this.$confirm('确定要删除这些记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          req('multipleDeleteCommercialPolicy', this.deleteArr).then((res) => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.table.search = {}
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
        })
      },
      dialogCancel () {
        this.isDialogShow = false
      },
      confirmResult (message) {
        this.fetch(this.table.info)
        this.isDialogShow = false
        this.$message({
          type: 'success',
          message
        })
        this.$refs.businessDialog.toolbar[1].loading = false
      },
      // dialog确定按钮
      dialogConfirm (data) {
        let submitData = Object.assign({}, this.dialogFormData, {employeeId: this.employeeId})
        // 如果新增弹出框请求otherAdd接口
        if (this.isAddOrEdit === 'add') {
          req('addInsCommercialPolicy', submitData)
          .then(data => {
            this.confirmResult('新增成功！')
          })
          .catch(() => (this.$refs.businessDialog.toolbar[1].loading = false))
        // 如果修改弹出框请求otherUpdate接口
        } else if (this.isAddOrEdit === 'edit') {
          req('updateInsCommercialPolicy', submitData)
          .then(data => {
            this.confirmResult('修改成功！')
          })
          .catch(() => (this.$refs.businessDialog.toolbar[1].loading = false))
        }
      },
      editDefual () {
        this.dialogFormData = {}
        this.$set(this.dialogFormData, 'personnelGroupName', '')
        this.$set(this.dialogFormData, 'personnelGroupCode', '')
        this.$set(this.dialogFormData, 'insuranceCompanyName', '')
        this.$set(this.dialogFormData, 'policyCode', '')
        this.$set(this.dialogFormData, 'insuredNumberPeople', '')
        this.$set(this.dialogFormData, 'policyMoney', '')
        this.$set(this.dialogFormData, 'effectiveDate', '')
        this.$set(this.dialogFormData, 'uneffectiveDate', '')
      },
      // 行操作修改
      modificationRow (row) {
        this.uneffectiveStatus = true
        this.isAddOrEdit = 'edit'
        row.effectiveDate && (row.effectiveDate = new Date(row.effectiveDate))
        row.uneffectiveDate && (row.uneffectiveDate = new Date(row.uneffectiveDate))
        this.dialogFormData = Object.assign({}, row)
        this.isDialogShow = true
        this.showTitle = '修改人事范围商业险设置'
        this.changeRow = true
      },
      // 行操作删除
      deleteRow (row) {
        this.deleteArr = {policyCode: row.policyCode, employeeId: this.employeeId}
        this.$confirm('确定要删除记录吗？').then(() => {
          req('deleteInsCommercialPolicy', row).then(data => {
            if (data) {
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
</style>
