<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <i-table
      class="table mb20"
      ref="iTable"
      :table="table"
      @loaded="initSelected"
    >
      <template slot="table" slot-scope="tableScope">
        <el-table
          :data="tableScope.clone"
          border
          ref="elTable"
          @selection-change="selectionChangeHandler(tableScope, $event)"
        >
          <el-table-column
            fixed="left"
            :formatter="selectionFormatter"
            type="selection"></el-table-column>
          <el-table-column
            v-for="(col, idx) of table.columns"
            :key="idx"
            :prop="col.prop"
            :label="col.label"
            :minWidth="col.width"
            :align="col.align"
            :formatter="tableScope.formatter"
          >
          </el-table-column>
        </el-table>
      </template>
    </i-table>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="目标户头" prop="accountId">
          <i-select v-model="form.accountId" :async="false" :props="accountProps" :options="currentAccountOptions"></i-select>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            type="date"
            :editable="false"
            :picker-options="effectiveDateOptions"
          >
          </el-date-picker>
        </el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req from 'api/iaf/company-rules'
  import ISelect from 'components/common/i-select/i-select.vue'
  import { getRule, showMessage } from 'utils/index'
  export default {
    name: '',
    components: {
      ITable,
      ISelect,
      ITableCell
    },
    props: {
      accountSelected: Array,
      accountId: String
    },
    computed: {
    },
    data: function () {
      return {
        // 当前选项集合最大生效日期
        maxEffectiveDate: '',
        // 生效日期范围配置
        effectiveDateOptions: {
//          disabledDate: (time) => {
//            return time.getTime() < this.maxEffectiveDate + 3600 * 1000 * 24
//          }
        },
        accountProps: {
          value: 'accountId',
          label: 'accountName'
        },
        currentAccountOptions: [],
        accountOptions: [],
        instance: null,
        form: {
          accountId: '',
          effectiveDate: null
        },
        rules: {
          accountId: getRule('目标户头', 'change'),
          effectiveDate: [
            getRule('请选择生效日期', 'change', 'date')
          ]
        },
        // table
        table: {
          columns: [
            { prop: 'accountCode', label: '户头代码', width: '120', align: 'left' },
            { prop: 'accountName', label: '户头名称', align: 'left', width: '160' },
            { prop: 'companyCode', label: '公司代码', align: 'left', width: '120' },
            { prop: 'companyName', label: '公司名称', width: '160', align: 'left' },
            { prop: 'effectiveDate', label: '生效日期', width: '120', align: 'center', display: { date: '' } }
          ],
          data: []
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      /** 初始化 */
      init () {
        this.initData()
        this.getTargetAccounts()
      },
      /** 初始化默认选择项 */
      initSelected (iTable) {
        this.$nextTick(() => {
          iTable.clone.forEach(item => {
            this.$refs.elTable.toggleRowSelection(item)
          })
        })
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
        const selecteds = this.$refs['iTable'].getMultipleSelection()

        const selectedIds = selecteds.map(item => {
          return item.accountId
        })
        const effectiveDates = selecteds.map(item => {
          return item.effectiveDate
        })

        this.setMaxEffectiveDate(effectiveDates)
        this.filterAccounts(selectedIds)
        this.resetSelect()
      },
      /** 重置选择 */
      resetSelect () {
        this.form.accountId = ''
        this.form.effectiveDate = ''
      },
      /** 获取当前选项集合最大生效日期 */
      setMaxEffectiveDate (dates) {
        this.maxEffectiveDate = Math.max(...dates)
      },
      /** 过滤户头选项 */
      filterAccounts (selectedIds) {
        this.currentAccountOptions = this.accountOptions.filter(item => {
          return !selectedIds.includes(item.accountId)
        })
      },
      /** 初始化数据 */
      initData () {
        this.table.data = this.accountSelected
      },

      /** 获取目标户头数据 */
      getTargetAccounts () {
        req('getTargetAccounts', { accountType: this.accountSelected[0].accountType }).then(res => {
          if (res) {
            this.accountOptions = res
            this.filterAccounts(this.accountSelected.map(item => item.accountId))
          }
        })
      },

      /** 数据保存 */
      save () {
        this.accountSelected = this.$refs['iTable'].getMultipleSelection()
        return new Promise((resolve, reject) => {
          if (this.accountSelected.length === 0) {
            showMessage('info', '请选择要合并户头！')
            return resolve(false)
          }
          this.validate().then(res => {
            if (res) {
              this.submitData().then(res => {
                resolve(res)
              })
            } else {
              resolve(false)
            }
          })
        })
      },

      /** 提交数据 */
      submitData () {
        const submitData = this.transformSubmitData(this.form)
        return new Promise(resolve => {
          req('postAccountsCombine', submitData).then(res => {
            resolve(res)
          })
        })
      },

      /** 提交数据转换 */
      transformSubmitData (data) {
        data.effectiveDate = Date.parse(data.effectiveDate)
        data.accountIdList = data.accountIdList || []
        this.accountSelected.map(item => {
          data.accountIdList.push(item.accountId)
        })
        return data
      },

      /** 数据校验 */
      validate () {
        if (this.validateDate()) return Promise.resolve(false)
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.form)
            } else {
              resolve(false)
            }
          })
        })
      },

      /** 日期校验 */
      validateDate () {
        let boolean = false
        if (this.maxEffectiveDate >= Date.parse(this.form.effectiveDate)) {
          boolean = true
          showMessage('warning', '生效日期需大于被合并户头的生效日期！')
        }
        return boolean
      }
    }
  }
</script>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
