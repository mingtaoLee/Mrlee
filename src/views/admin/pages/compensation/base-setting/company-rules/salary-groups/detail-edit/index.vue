<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="薪资组代码" prop="groupCode">
          <el-input v-model="form.groupCode" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="人事范围" prop="personnelGroupCode">
          <remote-select
            v-model="form.personnelGroupCode"
            dataKey="personnelGroup"
            placeholder="请输入代码或名称搜索"
            :extraParam="{ hasPower: 'Y' }"
            :displayKeys="['personnelGroupCode', 'personnelGroupName']"
            :defaultOptions="personnelGroupList"
            :props="personnelGroupProps"
          ></remote-select>
        </el-form-item>
        <el-form-item label="发薪日" prop="payDate">
          <el-input v-model.number="form.payDate" type="number"></el-input>
        </el-form-item>
        <el-form-item label="派遣人员薪资组" prop="isDispatch">
          <i-select v-model="form.isDispatch" parameter="WHETHER_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="支付主体" prop="paymentCompanyCode">
          <i-select
            v-model="form.paymentCompanyCode"
            :async="false"
            :options="paymentCompanyList"
            :props="paymentCompanyProps"
            :disabled='!form.basicAccount||isDisabled'
            @change="handlePaymentCompanyNameChange"
            @option-click="handlePaymentCompanyNameClick"
          ></i-select>
        </el-form-item>
        <!--<el-form-item label="支付银行类别" prop="payBankType">-->
          <!--<i-select v-model="form.payBankType" disabled parameter="BANK_TYPE"></i-select>-->
        <!--</el-form-item>-->
        <el-form-item label="失效日期" prop="uneffectiveDate">
          <el-date-picker
            v-model="form.uneffectiveDate"
            type="month"
            :picker-options="uneffectOptions"
            :disabled="isDateDisabled"
          ></el-date-picker>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="薪资组名称" prop="groupName">
          <el-input v-model="form.groupName" :disabled="isDisabled" :min="0" :max="20"></el-input>
        </el-form-item>
        <el-form-item label="省/区/范围" prop="areaId">
          <i-select-area v-model="form.areaId" type="yonghui" search></i-select-area>
        </el-form-item>
        <el-form-item label="发薪主体" prop="companyCode">
          <remote-select
            v-model="form.companyCode"
            dataKey="salaryCompany"
            placeholder="请输入代码或名称搜索"
            :displayKeys="['companyCode', 'companyName']"
            :props="companyProps"
            :defaultOptions="companyList"
            :disabled="isDisabled"
            @change="handleCompanyCodeChange"
            @option-click="handleCompanyCodeClick"
          ></remote-select>
        </el-form-item>
        <el-form-item label="基本户" prop="basicAccount">
          <el-input v-model="form.basicAccount" disabled></el-input>
        </el-form-item>
        <!--<el-form-item label="支付账户" prop="payAccount">-->
          <!--<i-select-->
            <!--v-model="form.payAccount"-->
            <!--:async="false"-->
            <!--:options="accountList"-->
            <!--:disabled="!form.paymentCompanyCode||isDisabled"-->
            <!--:props="payAccountProps"-->
            <!--@option-click="handlePayAccountChange"-->
          <!--&gt;</i-select>-->
        <!--</el-form-item>-->
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            type="month"
            :picker-options="effectOptions"
            :disabled="isDateDisabled"
          ></el-date-picker>
        </el-form-item>
      </li>
    </ul>
    <i-table :table="table" ref="iTable" @loaded="handleTableChange">
      <template slot="table" slot-scope="tableScope">
        <el-table
          :data="tableScope.clone"
          style="width: 100%"
        >
          <el-table-column
            v-for="(col, idx) of table.columns || []"
            :key="idx"
            :prop="col.prop"
            :label="col.label"
            :formatter="tableScope.formatter">
            <template slot-scope="scope">
              <i-table-cell
                ref="cell"
                :row="scope.row"
                :col="col.prop"
                :table="tableScope"
              >
                <i-select
                  :async="false"
                  v-if="col.prop === 'payAccount'"
                  v-model="scope.row['payAccount']"
                  :props="payAccountProps"
                  :options="accountList"
                  @change="handlePayAccountChange($event, scope)"
                  @option-click="handlePayAccountClick($event, scope)"
                  filterable
                ></i-select>
              </i-table-cell>
            </template>
          </el-table-column>
          <i-table-operator scope width="120" v-if="!(editorStatus === '3')" :table="tableScope"></i-table-operator>
        </el-table>
      </template>
    </i-table>
  </el-form>
</template>
<script>
  import { NewEditor } from './new-editor'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  import req from 'api/compensation/base-setting/company-rules'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  import RemoteSelect from 'components/compensation/remote-select/index.vue'
  const RULES = {
    groupCode: [
      getRule('请输入薪资组代码'),
      { min: 0, max: 20, message: '最多只能输入20个字', trigger: 'change' },
      { pattern: '^[A-Za-z0-9]+$', message: '只能输入英文和数字' }
    ],
    groupName: [
      getRule('请输入薪资组'),
      {min: 0, max: 50, message: '最多只能输入50个字', trigger: 'change'}
    ],
    personnelGroupName: getRule('请选择人事范围', 'change'),
    payDate: [
      getRule('请输入发薪日', 'change', 'number'),
      { pattern: /^[0-9]\d*$/, message: '请输入正确日期' },
      { min: 1, max: 31, message: '只能输入1到31号', type: 'number', trigger: 'change' }
    ],
    companyCode: getRule('请选择发薪主体', 'change'),
    basicAccount: getRule('请填写基本户', 'change'),
    paymentCompanyCode: getRule('请选择支付主体', 'change'),
    payAccount: getRule('请选择支付账号', 'change'),
    payBankType: getRule('请填写支付银行类别', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    uneffectiveDate: getRule('请选择失效日期', 'change', 'date')
  }
  export default {
    components: {
      RemoteSelect
    },
    mixins: [EditorMixin],
    props: {
      groupId: String
    },
    data: function () {
      return {
        accountList: [],
        paymentCompanyProps: {
          value: 'paymentCompanyCode',
          label: 'paymentCompanyName'
        },
        paymentCompanyList: [],
        companyList: [],
        personnelGroupList: [],
        personnelGroupProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },
        payAccountProps: {
          label: 'payAccount',
          value: 'payAccount'
        },
        instance: null,
        table: {
          columns: [
            {
              label: '支付账户',
              prop: 'payAccount'
            },
            {
              label: '银行类别',
              prop: 'payBankType',
              display: { dict: 'BANK_TYPE' }
            }
          ],
          data: [
            {
              companyAccountId: '',
              payAccount: '',
              payBankType: ''
            }
          ],
          editable: this.editorStatus !== '3',
          setting: {
            editor: {
              payAccount: {
                rules: getRule('请选择支付账户', 'change')
              },
              payBankType: {
                disable: true,
                type: 'select',
                rules: getRule('请选择支付账户', 'change')
              }
            },
            operator: [
              {
                text: '增加',
                func: this.addRow
              },
              {
                text: '删除',
                func: this.deleteRow
              }
            ]
          }
        },
        form: {
          groupCode: '',
          groupName: '',
          companyCode: '',
          isDispatch: 'N',
          basicAccount: '',
          areaId: '',
          paymentCompanyName: '',
          paymentCompanyCode: '',
          personnelGroupName: '',
          personnelGroupCode: '',
          payDate: '',
          effectiveDate: null,
          uneffectiveDate: new Date('9999-12-31 00:00:00')
        },
        cloneList: [],
        rules: RULES,
        companyProps: {
          value: 'companyCode',
          label: 'companyName'
        }
      }
    },
    methods: {
      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.getInstance(this.editorStatus, opts)
      },

      /** 获取对应实例 */
      getInstance (editorStatus, opts) {
        switch (editorStatus) {
          case '1':
            return new BaseEditor(opts)
          case '2':
            return new NewEditor(opts)
          default:
            return new Modifier(opts)
        }
      },

      getCloneData () {
        Promise.resolve().then(() => {
          this.cloneList = JSON.parse(JSON.stringify(this.$refs.iTable.clone))
        })
      },

      /* 删除行操作 */
      deleteRow (scope) {
        this.instance.deleteRow(scope)
        this.getCloneData()
      },

      /* 增加行操作 */
      addRow (scope) {
        this.instance.addRow(scope)
      },

      /** 人事范围选项点击事件监听 */
      handlePersonnelOptionClick (item) {
        this.form.personnelGroupCode = item.personnelGroupCode
      },
      /** 发薪主体 */
      handleCompanyCodeClick (option) {
        this.form.basicAccount = option.basicAccount
        this.getPaymentCompanyList(option.companyCode)
      },
      handleCompanyCodeChange () {
        this.resetPayAccountList()
      },
      resetPayAccountList () {
        this.table.data = [
          {
            companyAccountId: '',
            payAccount: '',
            payBankType: ''
          }
        ]
      },
      getPaymentCompanyList (companyCode) {
        req('getPayment', {companyCode: companyCode}).then(res => {
          this.paymentCompanyList = res
          this.form.paymentCompanyCode = ''
          for (let item of res) {
            if (item.paymentCompanyCode === companyCode) {
              this.form.paymentCompanyCode = companyCode
              this.getAccountList(companyCode)
            }
          }
        })
      },
      /** 支付主体 */
      handlePaymentCompanyNameClick (option) {
        this.getAccountList(option.paymentCompanyCode)
      },
      handlePaymentCompanyNameChange () {
        this.resetPayAccountList()
      },
      getAccountList (paymentCompanyCode) {
        return req('getPaymentCompanyCode', {paymentCompanyCode: paymentCompanyCode}).then(res => {
          if (res) {
            this.accountList = res
            // this.setCompanyAccountId(res)
          }
        })
      },
      handlePayAccountChange (value, {row, $index}) {
        this.getCloneData()
        if (!value) {
          row.payBankType = ''
          row.companyAccountId = ''
          this.filterOptions(value, $index)
        }
      },
      /** 支付账户 */
      handlePayAccountClick (option, {row, $index}) {
        if (option.disabled) return
        this.filterOptions(option.payAccount, $index)
        row.payBankType = option.payBankType
        row.companyAccountId = option.companyAccountId
      },

      /** 过滤已选支付账户 */
      filterOptions (value, index) {
        // 选中考勤项则禁用当前考勤项
        if (value) {
          this.setDisabledOption(value, true)
        }
        if (this.cloneList[index] && this.cloneList[index].payAccount !== value) {
          this.setDisabledOption(this.cloneList[index].payAccount, false)
        }
      },

      /** 设置选项是否禁用 */
      setDisabledOption (value, isDisabled) {
        for (let item of this.accountList) {
          if (item.payAccount === value) {
            this.$set(item, 'disabled', isDisabled)
            break
          }
        }
      },

      // /** 传companyAccountId给后台 */
      // setCompanyAccountId (res) {
      //   res.map(item => {
      //     this.form.companyAccountId = item.companyAccountId
      //   })
      // },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this[this.idKey])
        // this.getCompanyList()
      }
      // getCompanyList () {
      //   req('getCompanyCode').then(res => {
      //     if (res) this.companyList = res
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // }
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
