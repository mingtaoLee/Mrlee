<template>
  <section class="pers-change table-card">
  <i-layout v-loading="loading" :element-loading-text="$loadingText">
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="月份:">
         <el-date-picker
            v-model="form.monthDate"
            type="month"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="薪资组:">
          <el-input v-model="form.belongOrg"></el-input>
      </el-form-item>
      <el-form-item label="工资套类型:">
          <i-select v-model="form.belongOrg" parameter="COMPONENT_LIST_TYPE"></i-select>
      </el-form-item>
      <el-form-item label="已通知:">
          <i-select v-model="form.belongOrg" parameter="WHETHER_TYPE"></i-select>
      </el-form-item>
      <el-form-item label="工号:">
          <el-input v-model="form.belongOrg"></el-input>
      </el-form-item>
      <el-form-item label="姓名:">
          <el-input v-model="form.belongOrg"></el-input>
      </el-form-item>
    </i-form>

    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            border
            @selection-change="selectionChangeHandler(tableScope, $event)">
            <el-table-column type="selection"/>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              :align="col.align"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>

  </section>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import IForm from 'components/common/i-form/i-form'
  import ISelect from 'components/common/i-select/i-select'
  import req from 'api/compensation/base-setting/company-rules'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import { showMessage, confirmPopover } from 'utils/index'

  export default {
    components: {
      ITable,
      ITableCell,
      ISelect,
      IDialog,
      ILayout,
      IForm
    },
    data () {
      return {
        form: {
          monthDate: null,
          belongOrg: ''
        },

        // 表格
        table: {
          columns: [
            { prop: 'accountCode', label: '工号', width: '80', align: 'center' },
            { prop: 'accountCode', label: '姓名', width: '80', align: 'center' },
            { prop: 'accountCode', label: '组织', width: '80', align: 'center' },
            { prop: 'accountCode', label: '职位', width: '80', align: 'center' },
            { prop: 'accountCode', label: '手机号', width: '80', align: 'center' },
            { prop: 'accountName', label: '邮箱', width: '80', align: 'center' },
            { prop: 'orgUnitCode', label: '出款月份', align: 'center', width: '100' },
            { prop: 'orgUnitName', label: '发放过程', align: 'center', width: '100' },
            { prop: 'accountType', label: '薪资组', align: 'center', width: '80', display: {dict: 'dict'} },
            { prop: 'insuredNumber', label: '工资套', align: 'center', width: '100' },
            { prop: 'securityNumber', label: '异常信息', align: 'center', width: '100' },
            { prop: 'securityNumber', label: '状态', align: 'center', width: '80' },
            { prop: 'securityNumber', label: '异常时间', align: 'center', width: '120' },
            { prop: 'securityNumber', label: '已通知', align: 'center', width: '100' }
          ],
          setting: {
            toolbar: [{
              text: '返回',
              func: this.back
            }
            ]
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: true
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.fetch()
      },
      handleSizeChange (options) {
        this.fetch(options)
      },
      handleCurrentChange (options) {
        this.fetch(options)
      },
      fetch (options = {}) {
        req('getAccounts', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loading = false
          console.log(this.loading)
        })
      },
    //   // 重置搜索条件
    //   reset () {
    //     console.log(this.listParams)
    //     Object.keys(this.listParams).map(item => {
    //       this.listParams[item] = ''
    //     })
    //   },
    //   // 执行搜索方法
    //   search () {
    //     // this.getEmpStaffRecord(this.listParams)
    //     this.table.search = { ...this.listParams }
    //   },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },
      sendAll () {
        this.$refs.table.saveData()
      },
      addPolicy () {
        this.accountId = ''
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.accountId = scope.row.accountId
        this.openDetailDialog()
      },
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('deleteAccount', {accountId: scope.row.accountId}).then(res => {
            if (res) {
              // this.table.data.splice(scope.$index, 1)
              showMessage('success', '删除成功！')
              // TODO 需要iTable抛出search参数
              this.fetch()
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleCancel (done) {
        done()
      },
      handleSave (done) {
        this.$refs.detailEdit.save().then(res => {
          if (res) {
            // TODO search参数
            this.fetch()
            done()
          }
        })
      },
      unusualOutList () {
        console.log(666)
        this.$router.push({ path: '/compensation/check-give/unusual-takeout-log' })
      },
      setInsurance ({ row }) {
        this.$router.push({path: '/compensation/base-setting/company-rules/insurance-setting', query: { accountId: row.accountId }})
      },
      openAnnualAudit () {
        this.$router.push({ path: '/compensation/base-setting/company-rules/insurance-annual-audit' })
      },
      combineAccounts (vm) {
        const selected = vm.getMultipleSelection()
        if (selected.length === 0) {
          return showMessage('info', '请选择户头')
        }
        if (this.isTypeRepeat(selected)) {
          return showMessage('info', '请选择相同户头类型数据！')
        }
        this.openCombineDialog(selected)
      },
      openCombineDialog (selected) {
        this.accountSelected = selected
        this.isShowCombineDialog = true
      },
      handleAccountsCombineSave (done) {
        this.$refs.accountsCombine.save().then(res => {
          if (res) {
            // TODO search参数
            this.fetch()
            done()
          }
        })
      },
      import () {},
      export () {},
      back () {
        this.$router.back()
      },
    //   loading () {
    //     this.loading = true
    //   },
    //   loaded () {
    //     this.loading = false
    //   },
      isTypeRepeat (selected) {
        let type = selected[0].accountType
        for (let item of selected) {
          if (item.accountType !== type) {
            return true
          }
        }
        return false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
