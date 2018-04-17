<template>
  <div>
    <i-dialog
      @close="dialogCancel"
      v-model="isDialogShow"
      size="huge"
      :title="title"
      :toolbar="toolbar"
      destroyedWhenClose
    >
      <el-form 
        ref="ruleForm"
        label-width="100px" 
        :model="dialogForm" 
        :rules="rules" 
      >
        <el-form-item label="工号" prop="employeeCode">
          <el-input 
            @click.native="handleIconClick" 
            v-model="dialogForm.employeeCode" 
            readonly
          >
            <i slot="suffix" class="el-input__icon el-icon-menu"></i>
          </el-input>
          <i-personnel-select :isShow.sync="isShow" :multiple="false" @confirm="handleConfirm" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="dialogForm.fullName" disabled></el-input>
        </el-form-item>
        <el-form-item label="人事范围代码" required>
          <el-input v-model="dialogForm.personnelGroupCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="人事范围名称" required>
          <el-input v-model="dialogForm.personnelGroupName" disabled></el-input>
        </el-form-item>
        <el-form-item label="组织名称" required>
          <el-input v-model="dialogForm.orgUnitName" disabled></el-input>
        </el-form-item>
        <el-form-item label="实际缴纳月份" prop="realPayMonth">
          <el-date-picker 
            type="month" 
            v-model="dialogForm.realPayMonth" 
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="startMonthLable" prop="payMonth">
          <el-date-picker 
            type="month" 
            v-model="dialogForm.payMonth" 
            :picker-options="payMonth"
            @change="handleDateChange(dialogForm.payMonth, 'dialogForm', 'payMonth', 'date')"
            @blur="payMothBlur"
            :editable="false"
          ></el-date-picker>
          
        </el-form-item>
        <el-form-item :label="endMonthLable" prop="payEndMonth">
          <el-date-picker 
            type="month" 
            v-model="dialogForm.payEndMonth" 
            :picker-options="payEndMonth"
            @change="handleDateChange(dialogForm.payEndMonth, 'dialogForm', 'payEndMonth', 'date')"
            @blur="payEndMothBlur"
            :editable="false"
          ></el-date-picker>
          <!-- @change="handleMonthDayDateChange(dialogForm.payEndMonth, 'dialogForm', 'payEndMonth')" -->
        </el-form-item>
        <el-form-item :label="reasonLable" prop="reason">
          <i-select
           v-model="dialogForm.reason"
           parameter="IAF_SUPPLEMENT_REASON"
           @change="changeReason"
           :hideKeys="hideKeysArr"
           ></i-select>
        </el-form-item>
        <el-form-item label="缴费状态:" prop="paymentStatus">
          <i-select v-model="dialogForm.paymentStatus" parameter="PAYMENT_STATUS"></i-select>
        </el-form-item>
        <el-form-item label="其他数据" required>
          <i-table 
            @save="getTableData" 
            @clone="getTableClone"
            ref="table" 
            :table="table" 
          >
            <template slot="table" slot-scope="tableScope">
              <el-table
                @selection-change="selectionChangeHandler(tableScope, $event)"
                :data="tableScope.clone"
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column
                  v-for="(col, idx) of tableScope.columns"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                  :width="col.width"
                  align="center"
                  ref="tableScopeColumn"
                >
                  <template slot-scope="scopes">
                    <i-table-cell 
                      :row="scopes.row"
                      :col="col.prop"
                      :table="tableScope"
                      ref="OneRowCell"
                    >
                    <remote-select
                        v-if="col.prop === 'accountId'" 
                        v-model="scopes.row.accountId"
                        dataKey="Account"
                        :props="remoteProps"
                        @option-click="accountIdOptionClick"
                        :extraParams="accountIdEmployeeCode"
                      ></remote-select>
                        <!-- @option-click="handlerOptions(scopes.row)" -->
                        <!-- :extraParams="userParams" -->
                      <iaf-select 
                        v-else
                        v-model="scopes.row.insuranceType" 
                        dict="INSURANCE_TYPE"
                        :extraParameter="scopes.row"
                        :options="insuranceTypeOptions"
                        @change="InsuranceTypeOptionClick"
                        ref="iafSelectOption"
                      ></iaf-select>
                      </i-table-cell>
                  </template>
                  <el-table-column
                    v-for="(item, index) of col.children"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label" 
                    :width="item.width"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <i-table-cell
                        v-if="item.prop === 'comPayAmount' || item.prop === 'empPayAmount' || item.prop === 'compPenalty' || item.prop === 'selfPenalty'"
                        @change="changeDataMoney(scope.row, item.prop)"
                        :row="scope.row"
                        :col="item.prop"
                        ref="RowCellOne"
                        :table="tableScope"
                      ></i-table-cell>
                       <i-table-cell
                        @change="changeData(scope.row, item.prop)"
                        :row="scope.row"
                        :col="item.prop"
                        :table="tableScope"
                        ref="RowCellTow"
                        v-else
                      ></i-table-cell>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </template>
          </i-table>
        </el-form-item>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
  import IDialog from 'components/common/i-dialog/i-dialog'
  import req from 'api/iaf/insurance-manage'
  import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
  import RemoteSelect from 'components/compensation/remote-select/index.vue'
  import moment from 'moment'
  import IafSelect from 'components/iaf/handicap-iaf/iaf-select.vue'
  import {carryRule} from 'utils/compensation'
  export default {
    name: 'PayDialog',
    components: {
      IDialog,
      RemoteSelect,
      IafSelect
    },
    props: {
      isDialogShow: {
        type: Boolean
      },
      dialogForm: {
        type: Object
      },
      tableData: {
        type: Object
      },
      title: {
        type: String
      },
      pageName: {
        type: String
      },
      reasonMessage: {
        type: String
      },
      startMonthMessage: {
        type: String
      },
      endMonthMessage: {
        type: String
      },
      showDisabled: {
        type: Boolean
      },
      hideKeysArr: {
        type: Array,
        default: []
      }
    },
    mixins: [IafSearchMixin],
    created () {
      if (this.pageName === 'prepayTable') {
        this.table = {
          columns: [{
            prop: 'accountId', label: '户头名称', width: '150'
          }, {
            prop: 'insuranceType', label: '险种', width: '150', display: {dict: 'INSURANCE_TYPE'}
          },
          {
            prop: 'payCount', label: '缴纳月数', width: '100'
          },
          {
            label: '单位',
            children: [{
              prop: 'compPayBase', label: '基数', width: '150'
            }, {
              prop: 'compPayRatio', label: '比例(%)', width: '100'
            }, {
              prop: 'compPayFixedAmount', label: '固定金额', width: '150'
            }, {
              prop: 'comPayAmount', label: '单位缴纳金额', width: '150'
            }, {
              prop: 'comBearAmount', label: '单位承担（个人缴费金额）', width: '100'
            }]
          }, {
            label: '个人',
            children: [{
              prop: 'empPayBase', label: '基数', width: '150'
            }, {
              prop: 'empPayRatio', label: '比例(%)', width: '100'
            }, {
              prop: 'empPayFixedAmount', label: '固定金额', width: '150'
            },
            {
              prop: 'empPayAmount', label: '个人缴费金额', width: '150'
            }, {
              prop: 'empBearAmount', label: '个人承担（单位缴费金额）', width: '100'
            }]
          }, {
            label: '合计',
            children: [{
              prop: 'comTotal', label: '单位', width: '100'
            }, {
              prop: 'empTotal', label: '个人', width: '100'
            }]
          }],
          setting: {
            editor: {
              insuranceType: {
                type: 'select',
                rules: {validator: (rule, value, callback) => {
                  const cloneData = this.$refs.table.clone
                  if (!value) {
                    callback(new Error('请选择险种'))
                  } else if (cloneData.length >= 2) {
                    let arr = cloneData.reduce((current, item) => {
                      if (item.insuranceType === value) {
                        current.push(item.accountId)
                        return current
                      }
                    }, [])
                    arr.length === Array.from(new Set(arr)).length ? callback() : callback(new Error('险种不能重复'))
                  }
                }}
              },
              compPayBase: {
                type: 'number',
                rules: {
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入基数'))
                    }
                  }
                }
              },
              payCount: {
                disable: true
              },
              accountId: {
                type: 'select',
                rules: [
                  {required: true, message: '请输入对应户头名称', trigger: 'change'}
                ]
              },
              comPayAmount: {
                disable: false,
                type: 'number',
                rules: [{required: true,
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入金额'))
                    }
                  }
                }
                ]
              },
              comBearAmount: {
                disable: true
              },
              empPayBase: {
                type: 'number',
                rules: {
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入基数'))
                    }
                  }
                }
              },
              empPayRatio: {
                disable: false,
                type: 'number',
                rules: [{
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入金额'))
                    } else if (value > 100) {
                      cb(new Error('请输入小于100的比例'))
                    }
                  }
                }
                ]
              },
              empPayAmount: {
                disable: false,
                type: 'number',
                rules: [{
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入金额'))
                    }
                  }
                }
                ]
              },
              compPayRatio: {
                disable: false,
                type: 'number',
                rules: [{
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入金额'))
                    } else if (value > 100) {
                      cb(new Error('请输入小于100的比例'))
                    }
                  }
                }
                ]
              },
              empBearAmount: {
                disable: true
              },
              compPayFixedAmount: {
                disable: true
              },
              empPayFixedAmount: {
                disable: true
              },
              comTotal: {
                disable: true
              },
              empTotal: {
                disable: true
              }
            },
            toolbar: [{
              text: '增加',
              func: vm => this.createData(vm)
            }, {
              text: '删除',
              type: 'danger',
              func: vm => this.deleteData(vm)
            }]
          },
          dev: true,
          editable: true,
          data: []
        }
      }
    },
    data () {
      // 后台新增成功，页面无数据展示
      // 修改的接口后台还没有写
      // 查询接口有问题，
      // 后台导入导出 没有给接口
      return {
        rowInsuranceType: {},
        deleteComplementarityRecordId: [],
        insuranceTypeOptions: [],
        remoteProps: {
          value: 'accountId',
          label: 'accountName'
        },
        moneyIsChange: false,
        toArray: '',
        isShow: false,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        // 表格数据
        table: {
          columns: [{
            prop: 'accountId', label: '户头名称', width: '150'
          }, {
            prop: 'insuranceType', label: '险种', width: '150', display: {dict: 'INSURANCE_TYPE'}
          },
          {
            prop: 'payCount', label: '缴纳月数', width: '100'
          },
          {
            label: '单位',
            children: [{
              prop: 'compPayBase', label: '基数', width: '150'
            }, {
              prop: 'compPayRatio', label: '比例(%)', width: '100'
            }, {
              prop: 'compPayFixedAmount', label: '固定金额', width: '150'
            },
            {
              prop: 'comPayAmount', label: '单位缴纳金额', width: '150'
            },
            {
              prop: 'comBearAmount', label: '单位承担（个人缴费金额）', width: '100'
            }]
          }, {
            label: '个人',
            children: [{
              prop: 'empPayBase', label: '基数', width: '150'
            }, {
              prop: 'empPayRatio', label: '比例(%)', width: '100'
            }, {
              prop: 'empPayFixedAmount', label: '固定金额', width: '150'
            }, {
              prop: 'empPayAmount', label: '个人缴费金额', width: '150'
            }, {
              prop: 'empBearAmount', label: '个人承担（单位缴费金额）', width: '100'
            }]
          }, {
            label: '滞纳金',
            children: [{
              prop: 'compPenalty', label: '单位', width: '120'
            }, {
              prop: 'selfPenalty', label: '个人', width: '120'
            }]
          }, {
            label: '合计',
            children: [{
              prop: 'comTotal', label: '单位', width: '100'
            }, {
              prop: 'empTotal', label: '个人', width: '100'
            }]
          }],
          setting: {
            editor: {
              insuranceType: {
                type: 'select',
                rules: {validator: (rule, value, callback) => {
                  const cloneData = this.$refs.table.clone
                  if (!value) {
                    callback(new Error('请选择险种'))
                  } else if (cloneData.length >= 2) {
                    let arr = cloneData.reduce((current, item) => {
                      if (item.insuranceType === value) {
                        if (current) {
                          current.push(item.accountId)
                        }
                        return current
                      }
                    }, [])
                    if (Array.from(new Set(arr)).length) {
                      arr.length === Array.from(new Set(arr)).length ? callback() : callback(new Error('险种不能重复'))
                    }
                  }
                }}
              },
              compPayBase: {
                type: 'number',
                rules: {
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入基数'))
                    }
                  }
                }
              },
              payCount: {
                disable: true
              },
              accountId: {
                type: 'select',
                rules: [
                  {required: true, message: '请输入对应户头名称', trigger: 'change'}
                ]
              },
              comPayAmount: {
                disable: false,
                type: 'number',
                rules: [{required: true,
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入金额'))
                    }
                  }
                }
                ]
              },
              comBearAmount: {
                disable: true
              },
              empPayBase: {
                type: 'number',
                rules: {
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入基数'))
                    }
                  }
                }
              },
              empPayAmount: {
                disable: false,
                type: 'number',
                rules: [{
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入金额'))
                    }
                  }
                }
                ]
              },
              empPayRatio: {
                disable: false,
                type: 'number',
                rules: [{
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入比例'))
                    } else if (value > 100) {
                      cb(new Error('请输入小于100的比例'))
                    }
                  }
                }
                ]
              },
              compPayRatio: {
                disable: false,
                type: 'number',
                rules: [{
                  validator: (rule, value, cb) => {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入比例'))
                    } else if (value > 100) {
                      cb(new Error('请输入小于100的比例'))
                    }
                  }
                }
                ]
              },
              compPayFixedAmount: {
                disable: true
              },
              empPayFixedAmount: {
                disable: true
              },
              empBearAmount: {
                disable: true
              },
              comTotal: {
                disable: true
              },
              compPenalty: {
                rules: [{
                  validator (ruel, value, cb) {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入滞纳金'))
                    }
                  }
                }
                ]
              },
              selfPenalty: {
                rules: [{
                  validator (ruel, value, cb) {
                    if (value < 0) {
                      cb(new Error('请输入正数'))
                    } else if (value === '') {
                      cb(new Error('请输入滞纳金'))
                    }
                  }
                }
                ]
              },
              empTotal: {
                disable: true
              }
            },
            toolbar: [{
              text: '增加',
              func: vm => this.createData(vm)
            }, {
              text: '删除',
              type: 'danger',
              func: vm => this.deleteData(vm)
            }]
          },
          dev: true,
          editable: true,
          data: []
        },
        toolbar: [
          {text: '取消', type: 'plane', func: this.dialogCancel},
          {text: '确定',
            type: 'primary',
            loading: false,
            func: () => {
              this.toolbar[1].loading = true
              this.confirm()
            }}
        ]
      }
    },
    // mixins: [IafSearchMixin],
    computed: {
      accountIdEmployeeCode () {
        return {employeeCode: this.dialogForm.employeeCode}
      },
      startMonthLable () {
        if (this.pageName === 'payBackTable') return '补缴开始月份'
        if (this.pageName === 'prepayTable') return '预缴开始月份'
      },
      endMonthLable () {
        if (this.pageName === 'payBackTable') return '补缴结束月份'
        if (this.pageName === 'prepayTable') return '预缴结束月份'
      },
      reasonLable () {
        if (this.pageName === 'payBackTable') return '补缴原因'
        if (this.pageName === 'prepayTable') return '预缴原因'
      },
      rules () {
        return {
          realPayMonth: {
            type: 'date', required: true, message: '请选择实际缴纳月份'
          },
          accountId: {
            required: true, message: '请输入户头代码'
          },
          payMonth: [
            {
              type: 'date', required: true, message: this.startMonthMessage, trigger: 'change'
            }
          ],
          payEndMonth: [
            {
              type: 'date', required: true, message: this.endMonthMessage, trigger: 'change'
            }
          ],
          employeeCode: [
            {
              required: true, message: '请输入员工工号', trigger: 'change'
            }
          ],
          reason: [
            {
              required: true, message: this.reasonMessage, trigger: 'change'
            }
          ],
          paymentStatus: [
            {
              required: true, message: '请输入缴费状态', trigger: 'change'
            }
          ],
          fullName: [
            {
              required: true, message: '请输入员工姓名'
            }
          ]
        }
      }
    },
    methods: {
      // 通过工号获得员工基本信息
      getBasicMsg () {
        req('iafEmployeeBase', {employeeCode: this.dialogForm.employeeCode}).then(data => {
          this.dialogForm = this.$emit('update:dialogForm', Object.assign({}, this.dialogForm, data))
        })
        // req('Account', {employeeCode: this.dialogForm.employeeCode}).then(res => {
        //   for (var key in res) {
        //     this.accountIdOptions.push({label: res[key].accountName, value: res[key].accountId})
        //   }
        // })
        this.$emit('update:showDisabled', false)
      },
      // 将编辑后的表格数据回显到表格中
      handlerTableData (data) {
        this.table.data = data
      },
      // 清空表格数据
      resetTableData () {
        this.table.data = []
      },
      dialogCancel () {
        this.$emit('cancel')
      },
      confirm () {
        this.$refs.ruleForm.validate((valid) => {
          this.tableValid = true
          this.$refs.OneRowCell.map(cell => {
            cell.$refs.form.validate(res => {
              !res && (this.tableValid = res)
            })
          })
          this.$refs.RowCellOne.map(cell => {
            cell.$refs.form.validate(res => {
              !res && (this.tableValid = res)
            })
          })
          if (valid && this.tableValid) {
            // this.toolbar[1].loading = true
            if (this.$refs.table.clone.length) {
              this.toolbar[1].loading = false
              // this.sendAll()
              this.$emit('confirm', this.$refs.table.clone)
            } else {
              this.$message({
                type: 'waring',
                message: '请最少添加一条其他数据'
              })
            }
          } else {
            this.toolbar[1].loading = false
            return false
          }
        })
      },
      handleIconClick () {
        this.isShow = !this.isShow
      },
      handleConfirm (selected) {
        this.dialogForm.employeeCode = selected[0].employeeCode
        this.dialogForm.employeeId = selected[0].employeeId
        this.resetTableData()
        this.accountIdOptions = []
        this.getBasicMsg()
      },
      // 多选框点击
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },
      sendAll () {
        this.$refs.table.saveData()
      },
      createData (vm) {
        if (!this.dialogForm.employeeCode) {
          this.$message({
            type: 'error',
            message: '请先选择工号'
          })
          return
        } else if (!this.dialogForm.payMonth) {
          this.$message({
            type: 'error',
            message: '请先选择补缴开始月份'
          })
          return
        } else if (!this.dialogForm.payEndMonth) {
          this.$message({
            type: 'error',
            message: '请先选择结束开始月份'
          })
          return
        } else if (!this.dialogForm.reason) {
          this.$message({
            type: 'error',
            message: '请先选择补缴原因'
          })
          return
        }
        vm.createData()
      },
      // 获取内部所有数据
      getTableClone (data) {
        this.table.data = data
      },
      /**
       * @param data 行元素
       * @param reason 险种
       * @param empFixedRule 公司缴纳个人结果固定金额进位规则
       * @param compFixedRule 公司缴纳固定金额进行规则
       * */
      countPayment (data, reason, col, empFixedRule, compFixedRule) {
        let empArr = ['empPayBase', 'empPayAmount']
        let compArr = ['compPayBase', 'comPayAmount']
        const handCol = empArr.includes(col) ? 'emp' : compArr.includes(col) ? 'comp' : ''
        data.payCount = this.MonthDifference(moment(this.dialogForm.payMonth).format('YYYY-MM-DD'), moment(this.dialogForm.payEndMonth).format('YYYY-MM-DD'))
        if (reason === '01' || reason === '05') {
          if (handCol === 'emp') {
            data.empPayAmount = carryRule(((data.empPayBase * data.empPayRatio + data.empPayFixedAmount) / 100 * data.payCount), empFixedRule)
          } else if (handCol === 'comp') {
            data.comPayAmount = carryRule(((data.compPayBase * data.compPayRatio + data.compPayFixedAmount) / 100 * data.payCount), compFixedRule)
            data.empBearAmount = data.comPayAmount
          } else {
            data.comPayAmount = carryRule(((data.compPayBase * data.compPayRatio + data.compPayFixedAmount) / 100 * data.payCount), compFixedRule)
            data.empBearAmount = data.comPayAmount
            data.empPayAmount = carryRule(((data.empPayBase * data.empPayRatio + data.empPayFixedAmount) / 100 * data.payCount), empFixedRule)
          }
          this.moneyIsChange = false
          data.compPenalty = 0
          data.selfPenalty = 0
          data.comBearAmount = 0
          data.comTotal = data.compPenalty
          data.empTotal = this.keepTwoDecimalFull(this.countIsNull(data.empPayAmount) + this.countIsNull(data.empBearAmount) + this.countIsNull(data.selfPenalty) + this.countIsNull(data.empPayFixedAmount))
          // }
        } else if (reason === '02' || reason === '04' || reason === '06') {
          if (handCol === 'emp') {
            data.empPayAmount = carryRule(((data.empPayBase * data.empPayRatio + data.empPayFixedAmount) / 100 * data.payCount), empFixedRule)
          } else if (handCol === 'comp') {
            data.comPayAmount = carryRule(((data.compPayBase * data.compPayRatio + data.compPayFixedAmount) / 100 * data.payCount), compFixedRule)
          } else {
            data.comPayAmount = carryRule(((data.compPayBase * data.compPayRatio + data.compPayFixedAmount) / 100 * data.payCount), compFixedRule)
            data.empPayAmount = carryRule(((data.empPayBase * data.empPayRatio + data.empPayFixedAmount) / 100 * data.payCount), empFixedRule)
          }
          data.compPenalty = 0
          data.selfPenalty = 0
          data.comBearAmount = 0
          data.empBearAmount = 0
          data.comTotal = this.keepTwoDecimalFull(this.countIsNull(data.compPenalty) + this.countIsNull(data.comPayAmount) + this.countIsNull(data.comBearAmount))
          data.empTotal = this.keepTwoDecimalFull(this.countIsNull(data.empPayAmount) + this.countIsNull(data.empBearAmount) + this.countIsNull(data.selfPenalty))
          // }
        } else if (reason === '03') {
          if (handCol === 'emp') {
            data.empPayAmount = carryRule(((data.empPayBase * data.empPayRatio + data.empPayFixedAmount) / 100 * data.payCount), empFixedRule)
          } else if (handCol === 'comp') {
            data.comPayAmount = carryRule(((data.compPayBase * data.compPayRatio + data.compPayFixedAmount) / 100 * data.payCount), compFixedRule)
          } else {
            data.comPayAmount = carryRule(((data.compPayBase * data.compPayRatio + data.compPayFixedAmount) / 100 * data.payCount), compFixedRule)
            data.empPayAmount = carryRule(((data.empPayBase * data.empPayRatio + data.empPayFixedAmount) / 100 * data.payCount), empFixedRule)
            data.comBearAmount = data.empPayAmount
          }
          data.comBearAmount = data.empPayAmount
          data.compPenalty = 0
          data.selfPenalty = 0
          data.empBearAmount = 0
          data.comTotal = this.keepTwoDecimalFull(this.countIsNull(data.comPayAmount) + this.countIsNull(data.comBearAmount) + this.countIsNull(data.compPenalty) + this.countIsNull(data.compPayFixedAmount))
          data.empTotal = data.selfPenalty
        }
      },
      countIsNull (data) {
        return Number(data) || 0
      },
      keepTwoDecimalFull (num) {
        var result = parseFloat(num)
        result = Math.round(num * 100) / 100
        var newResult = result.toString()
        var posDecimal = newResult.indexOf('.')
        if (posDecimal < 0) {
          posDecimal = newResult.length
          newResult += '.'
        }
        while (newResult.length <= posDecimal + 2) {
          newResult += '0'
        }
        return newResult
      },
      // 开始缴纳月份失去焦点重新计算缴纳月份差
      payEndMothBlur () {
        if (this.$refs.table.clone) {
          this.$refs.table.clone.forEach(row => {
            if (this.moneyIsChange) {
              this.changeDataMoney(row)
            } else {
              this.countPayment(row, this.dialogForm.reason, '', this.rowInsuranceType.empFixedCarryRule, this.rowInsuranceType.compFixedCarryRule)
            }
          })
        }
      },
      // 结束缴纳月份失去焦点重新计算缴纳月份差
      payMothBlur () {
        // let MonthDofference = this.MonthDifference(moment(this.dialogForm.payMonth).format('YYYY-MM-DD'), moment(this.dialogForm.payEndMonth).format('YYYY-MM-DD'))
        if (this.$refs.table.clone) {
          this.$refs.table.clone.forEach(row => {
            if (this.moneyIsChange) {
              this.changeDataMoney(row)
            } else {
              this.countPayment(row, this.dialogForm.reason, '', this.rowInsuranceType.empFixedCarryRule, this.rowInsuranceType.compFixedCarryRule)
            }
          })
        }
      },
      changeData (row, col) {
        if (this.rowInsuranceType.empFixedCarryRule) {
          this.countPayment(row, this.dialogForm.reason, col, this.rowInsuranceType.empFixedCarryRule, this.rowInsuranceType.compFixedCarryRule)
        } else {
          this.countPayment(row, this.dialogForm.reason, col, row.empFixedCarryRule, row.compFixedCarryRule)
        }
        this.table.data[row._id] = row
      },
      // 金额改变的时候 合计改变
      changeDataMoney (data) {
        this.moneyIsChange = true
        if (this.dialogForm.reason === '01') {
          data.comBearAmount = 0
          data.comTotal = data.compPenalty
          if (this.rowInsuranceType.empFixedCarryRule) {
            data.empPayAmount = carryRule(this.countIsNull(data.empPayAmount), this.rowInsuranceType.empFixedCarryRule)
            data.comPayAmount = carryRule(this.countIsNull(data.comPayAmount), this.rowInsuranceType.compFixedCarryRule)
            data.empBearAmount = data.comPayAmount
            data.empTotal = this.keepTwoDecimalFull(data.empPayAmount + this.countIsNull(data.empBearAmount) + this.countIsNull(data.selfPenalty))
          } else {
            data.empPayAmount = carryRule(this.countIsNull(data.empPayAmount), data.empFixedCarryRule)
            data.empTotal = this.keepTwoDecimalFull(data.empPayAmount + this.countIsNull(data.empBearAmount) + this.countIsNull(data.selfPenalty))
          }
        } else if (this.dialogForm.reason === '02') {
          data.comBearAmount = 0
          data.empBearAmount = 0
  
          if (this.rowInsuranceType.empFixedCarryRule) {
            console.log(data.compPenalty, 'data.compPenalty')
            data.comPayAmount = carryRule(this.countIsNull(data.comPayAmount), this.rowInsuranceType.compFixedCarryRule)
            data.empPayAmount = carryRule(this.countIsNull(data.empPayAmount), this.rowInsuranceType.empFixedCarryRule)
            console.log(data.compPenalty, 'data.compPenalty11111111111111')
            data.comTotal = this.keepTwoDecimalFull(data.compPenalty + this.countIsNull(data.comPayAmount) + this.countIsNull(data.comBearAmount))
            data.empTotal = this.keepTwoDecimalFull(data.empPayAmount + this.countIsNull(data.empBearAmount) + this.countIsNull(data.selfPenalty))
          } else {
            data.comPayAmount = carryRule(this.countIsNull(data.comPayAmount), data.compFixedCarryRule)
            data.empPayAmount = carryRule(this.countIsNull(data.empPayAmount), data.empFixedCarryRule)
            data.comTotal = this.keepTwoDecimalFull(data.compPenalty + this.countIsNull(data.comPayAmount) + this.countIsNull(data.comBearAmount))
            data.empTotal = this.keepTwoDecimalFull(data.empPayAmount + this.countIsNull(data.empBearAmount) + this.countIsNull(data.selfPenalty))
          }
        } else if (this.dialogForm.reason === '03') {
          data.selfPenalty = 0
          if (this.rowInsuranceType.empFixedCarryRule) {
            data.comPayAmount = carryRule(data.comPayAmount, this.rowInsuranceType.compFixedCarryRule)
            data.empPayAmount = carryRule(data.empPayAmount, this.rowInsuranceType.empFixedCarryRule)
            data.comBearAmount = data.empPayAmount
            data.comTotal = this.keepTwoDecimalFull(this.countIsNull(data.comPayAmount) + this.countIsNull(data.comBearAmount) + this.countIsNull(data.compPenalty))
          } else {
            data.empPayAmount = carryRule(data.empPayAmount, data.empFixedCarryRule)
            data.comPayAmount = carryRule(this.countIsNull(data.comPayAmount), data.compFixedCarryRule)
            data.comBearAmount = data.empPayAmount
            data.comTotal = this.keepTwoDecimalFull(data.comPayAmount + this.countIsNull(data.comBearAmount) + this.countIsNull(data.compPenalty))
            console.log(data.comTotal, 'data.comTotal')
          }
          data.empTotal = data.selfPenalty
        }
      },
      // 重新计算选的补缴原因的计算方式
      changeReason (reason) {
        this.$refs.table.clone.forEach(row => {
          if (this.moneyIsChange) {
            this.changeDataMoney(row)
          } else {
            this.countPayment(row, reason, '', this.rowInsuranceType.empFixedCarryRule, this.rowInsuranceType.compFixedCarryRule)
          }
        })
      },
      // 点击险种的时候自动带出当前行的基数
      InsuranceTypeOptionClick (value, insuranceType) {
        req('findPayBaseAndPayRatio', {employeeId: this.dialogForm.employeeId, insuranceType: value})
        .then(res => {
          insuranceType.compPayBase = res.compPayBase
          insuranceType.compPayRatio = res.compPayRatio
          insuranceType.empPayBase = res.empPayBase
          insuranceType.empPayRatio = res.empPayRatio
          insuranceType.compPayFixedAmount = res.compPayFixedAmount
          insuranceType.empPayFixedAmount = res.empPayFixedAmount
          this.rowInsuranceType = Object.assign({}, insuranceType, res)
          this.countPayment(insuranceType, this.dialogForm.reason, '', res.empFixedCarryRule, res.compFixedCarryRule)
        })
      },
      accountIdOptionClick (value) {
        this.insuranceTypeOptions = []
        req('findInsuranceType', {employeeId: this.dialogForm.employeeId, accountId: value.accountId}).then(res => {
          this.insuranceTypeOptions = res
        })
      },
      deleteData (vm) {
        vm.multipleSelection.map(item => {
          if (this.dialogForm.deleteComplementarityRecordId) {
            this.dialogForm.deleteComplementarityRecordId.push(item.complementarityRecordId)
          }
        })
        this.$refs.table.deleteData()
      },
      // 月份差
      MonthDifference (startTime, endTime) {
        startTime = startTime.split('-')
        startTime = parseInt(startTime[0] * 12 + parseInt(startTime[1]))
        endTime = endTime.split('-')
        endTime = parseInt(endTime[0] * 12 + parseInt(endTime[1]))
        let deifference = Math.abs(startTime - endTime) === 0 ? 1 : Math.abs(endTime - startTime + 1)
        return deifference
      }
    },
    watch: {
      tableData: {
        handler (newValue) {
          this.table.data = newValue
        },
        deep: true
      }
    },
    /**
       * 校验险种类型不能重复
       */
    validateInsuranceType (rule, value, callback) {
      const cloneData = this.$refs.table.clone
      if (!value) {
        callback(new Error('请选择险种'))
      } else if (cloneData.filter((item, index) => {
        if (cloneData.length > 2) {
          if (cloneData[index].accountId === cloneData[index + 1].accountId) {
            return item.insuranceType === value
          }
        }
      }).length > 1) {
        callback(new Error('险种不能重复'))
      } else {
        callback()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .box{
    padding-left:20px;
    padding-bottom:10px;
    border:1px solid #aaa;
    border-radius:5px;
    box-sizing:border-box;
  }
  .el-icon-circle-plus-outline{
    font-size:20px;
  }
  .el-icon-circle-close-outline{
    font-size:20px;
  }
  .table-title{
    text-align:center;
  }
  .delete-col{
    text-align:center;
  }
</style>
