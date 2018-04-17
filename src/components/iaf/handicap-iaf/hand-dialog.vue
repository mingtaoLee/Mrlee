<template>
  <i-dialog
    @close="cancel"
    v-model="visible"
    :toolbar="toolbar"
    :title="titleHeader"
    destroyedWhenClose
  >
    <el-form
      ref="formData"
      :model="formData"
      label-width="100px"
      :rules="rules"
    >
      <el-form-item label="人员姓名" prop="payerName">
        <el-input v-model="formData.payerName" :disabled="editInput"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="payerGender">
        <i-select :async="false" :options="payerGender" v-model="formData.payerGender" :disabled="editInput"></i-select>
      </el-form-item>
      <el-form-item label="身份证号码" prop="payerIdNumber">
        <el-input v-model.trim="formData.payerIdNumber" :disabled="editInput"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="payerPhone">
        <el-input v-model.trim="formData.payerPhone" :disabled="editInput"></el-input>
      </el-form-item>
      <el-form-item label="缴纳月份" prop="payMonth">
        <el-date-picker type="month" v-model="formData.payMonth"></el-date-picker>
      </el-form-item>
      <el-form-item label="参保记录" required>
        <i-table 
            @save="getTableData" 
            @clone="getTableClone"
            ref="table" 
            :table="table" 
          >
            <template slot="table" slot-scope="tableScope">
              <el-table :data="tableScope.clone" @selection-change="getDeleteArr" align="center">
                <el-table-column type="selection"></el-table-column>
                <el-table-column
                  v-for="(col, idx) of table.columns"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                  align="center"
                >
                  <template slot-scope="scope">
                    <i-table-cell
                      :row="scope.row"
                      :col="col.prop"
                      :table="tableScope"
                      ref="cell"
                      @blur="handVerification"
                      maxlength='8'
                    >
                      <remote-select
                        v-if="col.prop === 'accountCode'"
                        v-model="scope.row.accountCode"
                        dataKey="accountTwo"
                        @option-click="handlerOptions(scope.row)"
                        :props="remoteProps"
                        :extraParams="userParams"
                      ></remote-select>
                      <iaf-select
                        v-if="col.prop === 'insuranceType'"
                        v-model="scope.row.insuranceType"
                        dict="INSURANCE_TYPE"
                        :options="options"
                        :extraParameter="scope.row"
                        @visible-change="showOption"
                      ></iaf-select>
                    </i-table-cell>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </i-table>
      </el-form-item>
      <el-form-item label="建账年月">
        <el-date-picker type="month" v-model="formData.prepareMonthly"></el-date-picker>
      </el-form-item>
      <el-form-item label="划拨日期">
        <el-date-picker type="date" v-model="formData.allottedDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="合计">
        <el-input v-model="formData.totalValue" disabled></el-input>
      </el-form-item>
    </el-form>
  </i-dialog>
</template>
<script>
import ISelect from 'components/common/i-select/i-select'
import IDialog from 'components/common/i-dialog/i-dialog'
import req from 'api/iaf/external-data'
import RemoteSelect from 'components/compensation/remote-select/index.vue'
import IafSelect from './iaf-select.vue'
export default {
  name: 'HandDialog',
  components: {
    ISelect,
    IDialog,
    RemoteSelect,
    IafSelect
  },
  props: {
    visible: {
      type: Boolean
    },
    formData: Object,
    editInput: Boolean,
    tableData: Array,
    titleshow: Boolean,
    requestCheck: String
  },
  computed: {
    userParams () {
      return {
        userId: this.$store.getters.userId
      }
    }
  },
  data () {
    let checkName = (rule, value, cb) => {
      let name = /^[\u4E00-\u9FA5]+$/
      let nameEn = /^[A-Za-z]+((·| )[A-Za-z]+)*$/
      !value && cb(new Error('姓名不能为空'))
      setTimeout(() => {
        let isEn = false
        name.test(value) && (isEn = 1)
        nameEn.test(value) && (isEn = 2)

        !isEn && cb(new Error('姓名格式错误'))
        isEn === 1 && value.length > 20 ? cb(new Error('中文名不得超过20字')) : cb()
        isEn === 2 && value.length > 160 ? cb(new Error('英文名不得超过160字')) : cb()
      }, 0)
    }
    let checkIdNumber = (rule, value, cb) => {
      let city = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江 ',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北 ',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏 ',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外 '
      }

      let temp = value.replace(/\s+/g, '')

      !temp && cb(new Error('身份证不能为空'))
      setTimeout(function () {
        if (value.length === 0) {
          cb(new Error('证件号码不能为空'))
          return
        } else if (!value || !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
          cb(new Error('证件号码格式错误'))
          return
        } else if (!city[value.substr(0, 2)]) {
          cb(new Error('地址编码错误'))
          return
        } else {
          // 18位身份证需要验证最后一位校验位
          if (value.length === 18) {
            value = value.split('')
            // ∑(ai×Wi)(mod 11)
            // 加权因子
            let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            // 校验位
            let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
            let sum = 0
            let ai = 0
            let wi = 0
            for (let i = 0; i < 17; i++) {
              ai = value[i]
              wi = factor[i]
              sum += ai * wi
            }
            if (String(parity[sum % 11]) !== String(value[17])) {
              if (value[17] === 'x') {
                cb(new Error('校验位x必须要大写'))
              } else {
                cb(new Error('校验位错误'))
              }
              return
            }
          }
        }
        cb()
      }, 500)
    }
    let checkPhone = (rule, value, cb) => {
      let phoneTest = /^1[34578]\d{9}$/
      !value && cb(new Error('电话号码不能为空'))
      setTimeout(function () {
        !phoneTest.test(value) ? cb(new Error('请输入正确的电话号码格式')) : cb()
      }, 0)
    }
    return {
      deleteArr: [],
      remoteProps: {
        value: 'accountCode',
        label: 'accountCode'
      },
      options: [],
      cacheOptions: {},
      insuranceType: {
        '养老保险': '01',
        '失业保险': '02',
        '医疗保险': '03',
        '工伤保险': '04',
        '生育保险': '05',
        '补充工伤保险': '06',
        '补充大病医疗': '07',
        '住房公积金': '0A'
      },
      table: {
        columns: [
          { prop: 'accountCode', label: '户头代码' },
          { prop: 'insuranceType', label: '险种' },
          { prop: 'empPayValue', label: '个人' },
          { prop: 'compPayValue', label: '公司' }
        ],
        setting: {
          editor: {
            insuranceType: {
              type: 'select',
              rules: [{
                validator: this.validateInsuranceType
              }]
            },
            accountCode: {
              type: 'text',
              options: {
                change: (row, col) => this.handVerification(row, col)
              },
              rules: [
                {required: true, message: '请输入对应户头代码', trigger: 'change'}
              ]
            },
            empPayValue: {
              type: 'number',
              options: {
                change: (row, col) => this.cruentSelectVal(row, col)
              },
              rules: [{
                type: 'number', required: true, message: '请输入个人缴纳金额', trigger: 'change'
              }, {
                validator: this.checkAccountCode
              }]
            },
            compPayValue: {
              type: 'number',
              options: {
                change: (row, col) => this.cruentSelectVal(row, col)
              },
              rules: [{
                type: 'number', required: true, message: '请输入公司缴纳金额', trigger: 'change'
              }, {
                validator: this.checkAccountCode
              }]
            }
          },
          toolbar: [{
            text: '增加',
            func: this.createData,
            show: null
          }, {
            text: '删除',
            type: 'danger',
            func: this.deleteData,
            show: null
          }]
        },
        editable: true,
        dev: true,
        data: null
      },
      toolbar: [
        {
          text: '取消',
          type: 'plane',
          func: () => {
            this.cancel()
          }
        },
        {
          text: '确定',
          type: 'primary',
          loading: false,
          func: () => {
            this.toolbar[1].loading = true
            this.confirm()
          }
        }
      ],
      payerGender: [
        {label: '男', value: '男'},
        {label: '女', value: '女'}
      ],
      rules: {
        payerName: [{ required: true, validator: checkName, trigger: 'change' }],
        payerIdNumber: [
          { required: true, message: '证件号码不能为空', trigger: 'change' },
          { validator: checkIdNumber, trigger: 'change' }
        ],
        payerPhone: [
          { required: true, validator: checkPhone, trigger: 'change' }
        ],
        payerGender: [
          { required: true, message: '请选择性别' }
        ],
        payMonth: [
          { required: true, message: '请输入缴纳月份' }
        ]
      },
      titleHeader: '新增残疾人挂靠记录'
    }
  },
  methods: {
    /**
       * 校验险种类型不能重复
       */
    validateInsuranceType (rule, value, callback) {
      const cloneData = this.$refs.table.clone
      if (!value) {
        callback(new Error('请选择险种'))
      } else if (cloneData.filter((item, index) => {
        return item.insuranceType === value
      }).length > 1) {
        callback(new Error('险种不能重复'))
      } else {
        callback()
      }
    },
    close () {
      this.$emit('close')
    },
    open () {
      this.$emit('open')
    },
    cancel () {
      this.$emit('cancel')
    },
    handlerOptions (row) {
      row.insuranceType = ''
      this.options = []
      req('getInsuranceTypeByAccountCode', {accountCode: row.accountCode})
      .then(res => {
        this.options = this.cacheOptions[row.accountCode] = res
      })
    },
    confirm () {
      this.$refs.formData.validate((valid) => {
        this.tableValid = true
        this.$refs.cell.map(cell => {
          cell.$refs.form.validate(res => {
            !res && (this.tableValid = res)
          })
        })
        if (valid && this.tableValid) {
          let saveData = JSON.parse(JSON.stringify(this.$refs.table.clone))
          if (saveData.length) {
            this.formData.iafHandicappedRecordNewDtoList = saveData
            this.$emit('confirm', this.formData)
          } else {
            this.toolbar[1].loading = false
            this.$message.error('请至少输入一条完整参保记录')
            return false
          }
        } else {
          this.toolbar[1].loading = false
        }
      })
    },
    showOption (visible, {accountCode}) {
      if (!accountCode) return (this.options = [])
      this.cacheOptions[accountCode] && (this.options = this.cacheOptions[accountCode])
      !this.cacheOptions[accountCode] && visible && accountCode && req('getInsuranceTypeByAccountCode', {accountCode})
      .then(res => {
        this.options = this.cacheOptions[accountCode] = res
      })
    },
    // 调用i-table新增方法
    createData () {
      this.$refs.table.createData()
    },
    // 调用i-table删除方法
    deleteData () {
      if (!this.deleteArr.length) return this.$message({type: 'warning', message: '至少选择一条参保记录'})
      if (this.$refs.table.clone.length - this.deleteArr.length < 1 && this.requestCheck === 'update') return this.$message({type: 'warning', message: '至少保留一条参保记录'})
      this.$refs.table.deleteData()
      req('handDelete', this.deleteArr).then(res => {
        this.deleteArr = []
      })
    },
    // 校验个人缴纳金额的是否是正数
    checkAccountCode (rule, value, cb) {
      if (Number.isNaN(Number(value))) {
        cb(new Error('请输入数字'))
      } else if (Number(value) < 0) {
        cb(new Error('请输入正数'))
      } else if (value > 99999999) {
        cb(new Error('请输入8位以内的数'))
      }
    },
    // 计算合计的值
    cruentSelectVal (row, col, val) {
      if (col === 'empPayValue' || col === 'compPayValue') {
        let total = 0
        for (let i = 0; i < this.$refs.table.clone.length; i++) {
          const empPayValue = this.$refs.table.clone[i].empPayValue
          const compPayValue = this.$refs.table.clone[i].compPayValue
          if (typeof empPayValue === 'string' && typeof compPayValue === 'string') {
            this.formData.totalValue = 0
          } else if (typeof empPayValue === 'string' || typeof compPayValue === 'string') {
            if (typeof empPayValue === 'string') {
              total += compPayValue
            } else {
              total += empPayValue
            }
          } else {
            total += empPayValue + compPayValue
          }
        }
        this.formData.totalValue = total
      }
    },
    // 判断户头的正确的性
    handVerification (row) {
      if (row.col === 'accountCode') {
        req('accountCode', {accountCode: row.row.accountCode})
          .then(res => {
            if (!res) {
              this.$message.error('请输入正确的户头')
            }
          })
          .catch(() => {
            row.accountCode = ''
            row.insuranceType = ''
          })
      }
    },
    // 获取到勾选的值准备删除
    getDeleteArr (data, show) {
      this.deleteArr = data.map(item => {
        return item.handicappedRecordId
      })
    },
    // 重新给itable赋值
    handlerTableData (data) {
      this.table.data = data
    }
  },
  watch: {
    titleshow: function (val) {
      if (val) {
        this.titleHeader = '修改残疾人挂靠记录'
      } else {
        this.table.data = null
        this.titleHeader = '新增残疾人挂靠记录'
      }
    },
    tableData: {
      handler (newVal) {
        this.table.data = newVal
      },
      immediate: true
    }
  },
  updated () {

  }
}
</script>
<style lang="scss" scoped>
.dialog-footer{
  text-align:right;
}
</style>
