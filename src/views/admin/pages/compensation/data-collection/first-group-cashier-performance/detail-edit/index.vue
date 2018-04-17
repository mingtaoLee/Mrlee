<template>
  <el-form ref="form" v-loading="loading" :element-loading-text="$loadingText" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="员工姓名" prop="employeeName">
          <el-input v-model="form.employeeName" :disabled="!!id" readonly @click.native="handlePersonnelClick">
            <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
          </el-input>
          <i-personnel-select
            filterType="all"
            :isShow.sync="isShowPersonnel"
            :defaultSelectedPersonnel="selectedPersonnel"
            @confirm="handlePersonnelDialogConfirm"
          ></i-personnel-select>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="核算月份" prop="checkMonth">
          <el-date-picker
            v-model="form.checkMonth"
            type="month"
          >
          </el-date-picker>
        </el-form-item>
      </li>
    </ul>
    <el-form-item label="奖惩项：">
      <el-table
        :row-key="getRowKey"
        :data="form.cashPerfInfoList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="项目"
          prop="label"
        >
          <template slot-scope="scope">
            <el-form-item labelWidth="0" :ref="`key${scope.$index}`" :prop="`cashPerfInfoList[${scope.$index}].cashPerfConfigId`" :rules="keyRule">
              <i-select
                v-model="scope.row.cashPerfConfigId"
                :async="false"
                filterable
                :props="priceItemProps"
                :options="options"
                @clear="clearOptions"
                @click.native="handleKeyClick(scope.row.cashPerfConfigId)"
                @option-click="handleOptionClick($event, scope.row)"
                @change="handleKeyChange">
              </i-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="单价"
          prop="key"
        >
          <template slot-scope="scope">
            <el-form-item labelWidth="0">
              <i-select
                :options="options"
                :props="optionProps"
                v-model="scope.row.cashPerfConfigId"
                :async="false"
                disabled></i-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="次数"
          prop="rewardPunishNum"
        >
          <template slot-scope="scope">
            <el-form-item
              labelWidth="0"
              :prop="`cashPerfInfoList[${scope.$index}].rewardPunishNum`"
              :rules="valueRule">
              <el-input type="number" :min="0" v-model.number="scope.row.rewardPunishNum" @input="handleTimesChange"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <i class="el-icon-plus operate-icon" @click="addRow(scope)"></i>
            <i class="el-icon-minus operate-icon" @click="deleteRow(scope)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="奖惩合计：" prop="cashTotal">{{form.cashTotal}}</el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select.vue'
  import {BaseEditor} from './base-editor'
  import {Modifier} from './modifier'
  import {getRule} from 'utils/index'
  import req from 'api/compensation/data-collection/cashier-performance'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    employeeName: getRule('请选择员工', 'change'),
    checkMonth: getRule('请选择考勤月份', 'change', 'date')
  }
  export default {
    mixins: [EditorMixin],
    components: {
      ISelect
    },
    props: {
      id: String
    },
    computed: {},
    data: function () {
      return {
        selectedPersonnel: [],
        isShowPersonnel: false,
        loading: false,
        // 下拉框改变前的value值
        preValue: '',
        // 奖惩项
        options: [],
        // 奖惩项props
        priceItemProps: {
          label: 'label',
          value: 'id'
        },
        // 奖惩单价props
        optionProps: {
          label: 'price',
          value: 'id'
        },
        instance: null,
        form: {
          empEmployeeId: '',
          checkMonth: '',
          cashTotal: 0,
          cashPerfInfoList: [
            {
              cashPerfConfigId: '',
              label: '',
              price: '',
              rewardPunishNum: ''
            }
          ]
        },
        keyRule: getRule('请选择奖惩项', 'change'),
        valueRule: getRule('请输入对应奖惩项次数', 'blur', 'number'),
        rules: RULES
      }
    },
    methods: {

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.id ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 初始化数据 */
      initData () {
        // 获取奖惩项数据
        req('getCashierOptions').then(res => {
          if (res) {
            this.options = this.transformAttendanceOptions(res)
            // 加载奖惩详情数据
            this.instance.initData(this.id)
          }
        })
      },

      /** 人员选择事件监听 */
      handlePersonnelClick () {
        if (this.id) return
        this.isShowPersonnel = true
      },

      /** 人员选择确认事件 */
      handlePersonnelDialogConfirm (selected) {
        this.form.employeeName = selected[0].employeeName
        this.form.empEmployeeId = selected[0].employeeId
      },

      /** 处理奖惩选项数据，新增disabled属性 */
      transformAttendanceOptions (data) {
        return data.map(item => {
          this.$set(item, 'disabled', false)
          return item
        })
      },

      /* 获取表格行key值 */
      getRowKey (row) {
        return row.cashPerfConfigId
      },

      /* 删除行操作 */
      deleteRow (scope) {
        this.instance.deleteRow(scope)
      },

      /* 增加行操作 */
      addRow (scope) {
        this.instance.addRow(scope)
      },

      /** 奖惩清除事件监听 */
      clearOptions (value) {
//        this.setPreValue(value)
      },

      /** 点击选项时事件监听 */
      handleKeyClick (value) {
        this.setPreValue(value)
      },

      /** 点击奖惩下拉选项事件监听 */
      handleOptionClick (option, row) {
        row.label = option.label
        row.price = option.price
      },

      /** 设置奖惩选项改变前选中值 */
      setPreValue (value) {
        this.preValue = value
      },

      /** 选项改变时事件监听 */
      handleKeyChange (value) {
        this.filterOptions(value)

        this.setPreValue(value)

        this.calculateAmount()
      },

      /** 次数改变时监听 */
      handleTimesChange () {
        this.calculateAmount()
      },

      /** 过滤已选奖惩项 */
      filterOptions (value) {
        // 选中奖惩项则禁用当前项
        if (value) {
          this.setDisabledOption(value, true)
        }
        // 存在之前选项则释放禁用选项
        if (this.preValue) {
          this.setDisabledOption(this.preValue, false)
        }
      },

      /** 计算奖惩总数 */
      calculateAmount () {
        let cashTotal = 0
        const list = this.form.cashPerfInfoList
        for (let item of list) {
          if (!item.label) continue
          cashTotal = cashTotal + parseInt(item.price || 0) * parseInt(item.rewardPunishNum || 0)
        }
        this.form.cashTotal = cashTotal
      },

      /** 获取奖惩项价格 */
      getItemPrice (value) {
        for (let item of this.options) {
          if (item.id === value) {
            return parseFloat(item.price)
          }
        }
      },

      /** 设置选项是否禁用 */
      setDisabledOption (value, isDisabled) {
        for (let item of this.options) {
          if (item.id === value) {
            item.disabled = isDisabled
            break
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../../../../styles/vars.scss";

  .operate-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    transition: opacity 0.3s;
    &:hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }

  .el-icon-plus {
    display: inline-block;
    margin-right: 10px;
    color: $color-theme;
  }

  .el-icon-minus {
    color: $color-red;
  }
</style>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
