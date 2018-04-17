<template>
  <div>
    <i-dialog
      @close="dialogCancel"
      v-model="isDialogShow"
      size="standard"
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
            :disabled="isEdit"
          >
            <i slot="suffix" class="el-input__icon el-icon-menu"></i>
          </el-input>
          <i-personnel-select :isShow.sync="isShow" :multiple="false" @confirm="handleConfirm" />
        </el-form-item>
        <el-form-item label="姓名" required prop="fullName">
          <el-input v-model="dialogForm.fullName" disabled></el-input>
        </el-form-item>
        <el-form-item label="组织" required prop="orgUnitName">
          <el-input v-model="dialogForm.orgUnitName" disabled></el-input>
        </el-form-item>
        <el-form-item label="人事范围名称" required prop="personnelGroupName">
          <el-input v-model="dialogForm.personnelGroupName" disabled></el-input>
        </el-form-item>
        <el-form-item label="补退月份" prop="payMonth">
          <el-date-picker 
            type="month" 
            v-model="dialogForm.payMonth" 
            :picker-options="pickerOptions"
            :editable="false"
            :disabled="isEdit"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="其他数据" required>
          <i-table 
            @save="getTableData" 
            @clone="getTableClone"
            ref="table" 
            :table="table" 
          >
            <template slot="table" slot-scope="tableScope">
              <el-table :data="tableScope.clone">
                <el-table-column v-if="!isEdit" type="selection"></el-table-column>
                <el-table-column
                  v-for="(col, idx) of table.columns"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                >
                  <template slot-scope="scope">
                    <i-table-cell
                      :row="scope.row"
                      :col="col.prop"
                      :table="tableScope"
                    ></i-table-cell>
                  </template>
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
  import req from 'api/iaf/insurance-manage'

  export default {
    components: {
    },
    props: {
      isDialogShow: {
        type: Boolean
      },
      isEdit: {
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
      }
    },
    data () {
      let checkNumber = (rule, value, cb) => {
        if (Number.isNaN(Number(value))) return cb('请输入数字')
        if (Number(value) < 0) return cb('请输入正数')
        return cb()
      }
      return {
        isShow: false,
        isEqualType: false,
        // 时间选择范围
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        // 表格数据
        table: {
          columns: [
            { prop: 'typeCode', label: '险种' },
            { prop: 'accountCode', label: '户头代码' },
            { prop: 'policyMoney', label: '金额' }
          ],
          setting: {
            editor: {
              accountCode: {
                type: 'text',
                disable: true,
                func: this.cruentSelectVal
              },
              typeCode: {
                type: 'select',
                options: {
                  option: {
                    '01,06': '养老个人补退',
                    '03,06': '医疗个人补退',
                    '04,06': '工伤个人补退',
                    '05,06': '生育个人补退',
                    '02,06': '失业个人补退',
                    '0A,06': '公积金个人补退',
                    '07,06': '大病补医保个人补退',
                    '06,06': '补充工伤个人补退',
                    '01,07': '养老公司补退',
                    '03,07': '医疗公司补退',
                    '04,07': '工伤公司补退',
                    '05,07': '生育公司补退',
                    '02,07': '失业公司补退',
                    '0A,07': '公积金公司补退',
                    '07,07': '大病补医保公司补退',
                    '06,07': '补充工伤公司补退'
                  },
                  change: (row, col) => this.cruentSelectVal(row, col)
                },
                rules: [
                  { validator: (rule, value, cb) => {
                    if (!value) {
                      cb(new Error('请输入险种'))
                    } else if (this.isEqualType) {
                      cb(new Error('不能选择相同的险种'))
                    }
                  }
                  }
                ]
              },
              policyMoney: {
                type: 'text',
                rules: [
                  {
                    required: true, message: '请输入补退金额'
                  },
                  {
                    validator: checkNumber, trigger: 'change'
                  }
                ]
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
          data: []
        },
        toolbar: [
          {
            text: '取消',
            type: 'plane',
            func: (done) => {
              this.dialogCancel()
            }
          },
          {
            text: '确定',
            type: 'primary',
            loading: false,
            func: (done) => {
              this.toolbar[1].loading = true
              this.confirm()
            }
          }
        ],
        rules: {
          payMonth: [
            {
              type: 'date', required: true, message: '请输入补退月份', trigger: 'change'
            }
          ],
          employeeCode: [
            {
              required: true, message: '请输入员工工号', triger: 'change'
            }
          ],
          fullName: [
            {
              required: true, message: '请输入员工姓名', trigger: 'change'
            }
          ],
          orgUnitName: [
            {
              required: true, message: '请输入组织', trigger: 'change'
            }
          ],
          personnelGroupName: [
            {
              required: true, message: '请输入人事范围名称', trigger: 'change'
            }
          ]
        }
      }
    },
    watch: {
      isEdit (newValue) {
        if (newValue) {
          this.table.setting.toolbar.forEach((item) => {
            item.show = () => { return {empty: true} }
          })
          this.setEditConfig(newValue)
        } else {
          this.table.setting.toolbar.forEach((item) => {
            item.show = () => { return {empty: false} }
          })
          this.setEditConfig(newValue)
        }
      },
      'tableData.otherInsuranceList' (newVal) {
        this.table.data = newVal
      }
    },
    methods: {
      // i-table的createData方法
      createData () {
        this.$refs.table.createData()
      },
      // i-table的deleteData方法
      deleteData () {
        this.$refs.table.deleteData()
      },
      // 通过工号获得员工基本信息
      getBasicMsg () {
        req('getEmployeeInfoById', {employeeCode: this.dialogForm.employeeCode}).then(data => {
          this.$emit('update:dialogForm', Object.assign({}, this.dialogForm, data))
        })
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
          if (valid && !document.querySelector('.el-form-item__error')) {
            this.sendAll()
            this.$emit('confirm', this.table.data)
          } else {
            this.$message({
              type: 'error',
              message: '请按提示正确填写表格！'
            })
            this.toolbar[1].loading = false
          }
        })
      },
      handleIconClick () {
        if (!this.isEdit) {
          this.isShow = !this.isShow
        }
      },
      handleConfirm (selected) {
        this.resetTableData()
        this.dialogForm.employeeCode = selected[0].employeeCode
        this.getBasicMsg()
      },
      sendAll () {
        this.table.data = this.$refs.table.clone
      },
      // 获取内部所有数据
      getTableClone (data) {
        this.table.data = data
      },
      // 编辑内容改变触发的方法
      cruentSelectVal (row) {
        let isTrue = false
        this.$refs.table.clone.forEach(item => {
          item._id !== row._id && row.typeCode === item.typeCode && (isTrue = true)
        })
        this.isEqualType = isTrue
        req('getAccountCode', {employeeCode: this.dialogForm.employeeCode, insuranceT: row.typeCode}).then(data => {
          row.accountCode = data
        }).catch(() => {
          row.accountCode = ''
        })
      },
      // 当操作为修改时的dialog配置
      setEditConfig (isEdit) {
        if (isEdit) {
          // i-table除金额外各列不可操作
          for (let key in this.table.setting.editor) {
            this.table.setting.editor[key].disable = true
          }
          this.table.setting.editor.policyMoney.disable = false
        } else {
          for (let key in this.table.setting.editor) {
            this.table.setting.editor[key].disable = null
          }
          this.table.data = null
        }
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
