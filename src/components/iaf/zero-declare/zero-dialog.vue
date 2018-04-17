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
        label-width="70px" 
        :model="dialogForm" 
        :rules="rules" 
      >
        <el-form-item label="工号" prop="employeeCode">
          <el-input @click.native="handleIconClick" v-model="dialogForm.employeeCode" readonly :disabled="isEdit">
            <i slot="suffix" class="el-input__icon el-icon-menu"></i>
          </el-input>
          <i-personnel-select
            v-if="!isEdit"
            :isShow.sync="isShow"
            :multiple="false"
            @confirm="handleConfirm" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="dialogForm.fullName" disabled></el-input>
        </el-form-item>
        <el-form-item label="人事范围" required>
          <el-input v-model="dialogForm.personnelGroupName" disabled></el-input>
        </el-form-item>
        <el-form-item label="申报月份" prop="month">
          <el-date-picker 
            type="month" 
            v-model="dialogForm.month" 
            :picker-options="pickerOptions"
            :editable="false"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="申报险种" required>
          <i-table 
            @save="getTableData" 
            @clone="getTableClone"
            ref="table" 
            :table="table" 
          >
            <template slot="table" slot-scope="tableScope">
              <el-table :data="tableScope.clone">
                <el-table-column type="selection" :fixed="true" v-if="checkStatus"></el-table-column>
                <el-table-column prop="accountCode" label="户头代码">
                </el-table-column>
                <el-table-column
                  v-for="(col, idx) of table.columns"
                  v-if="col.prop !== 'accountCode'"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                >
                  <template slot-scope="scope">
                    <i-select 
                      v-if="!noEdit && col.prop === 'insuranceType'" 
                      parameter="INSURANCE_TYPE" 
                      v-model="scope.row[col.prop]"
                      :hideKeys="hideInsuranceType"
                      @change="changeInsuranceType"
                      :disabled="showStatus"
                    ></i-select>
                    <i-table-cell
                      v-else
                      @change="cruentSelectVal"
                      :row="scope.row"
                      :col="col.prop"
                      :table="tableScope"
                    >
                    </i-table-cell>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </i-table>
        </el-form-item>
        <el-form-item label="申请时间" prop="declareDate">
          <el-date-picker 
            type="datetime" 
            v-model="dialogForm.declareDate" 
            :picker-options="pickerOptions"
            :editable="false"
            disabled
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
  import req from 'api/iaf/insurance-manage'
  import ISelect from '@/components/common/i-select/i-select'

  export default {
    name: 'ZeroDialog',
    components: {
      ISelect
    },
    props: {
      showStatus: {
        type: Boolean
      },
      isEdit: {
        type: Boolean
      },
      isDialogShow: {
        type: Boolean
      },
      dialogForm: {
        type: Object
      },
      title: {
        type: String
      },
      noEdit: {
        type: Boolean
      }
    },
    data () {
      return {
        checkStatus: true,
        isShow: false,
        hideInsuranceType: ['03', '04', '05', '06', '07', '0A'],
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        // 表格数据
        table: {
          columns: [
            { prop: 'accountCode', label: '户头代码' },
            { prop: 'insuranceType', label: '险种', display: {dict: 'INSURANCE_TYPE'} },
            { prop: 'declareStatus', label: '是否申报' }
          ],
          setting: {
            editor: {
              // accountCode: {
              //   type: 'text'
              // },
              insuranceType: {
                type: 'select',
                disable: true,
                rules: [{
                  validator: this.validateInsuranceType
                }]
              },
              declareStatus: {
                type: 'select',
                disable: true,
                options: {
                  option: {
                    'Y': '是',
                    'N': '否'
                  }
                },
                rules: [{
                  required: true,
                  message: '请选择申报情况'
                }]
              }
            },
            toolbar: [
              // {
              //   text: '增加',
              //   func: this.createData,
              //   show: null
              // },
              {
                text: '删除',
                type: 'danger',
                func: this.deleteData,
                show: null
              }
            ]
          },
          editable: true,
          dev: true,
          data: null
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
          month: [
            {
              type: 'date', required: true, message: '请输入申报月份', trigger: 'change'
            }
          ],
          declareDate: [
            {
              type: 'date', required: true, message: '请输入申请时间', trigger: 'change'
            }
          ],
          employeeCode: [
            {
              required: true, message: '请输入员工工号', triger: 'change'
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
    watch: {
      isEdit (newValue) {
        this.checkStatus = !newValue
        newValue
        ? this.table.setting.toolbar.forEach((item) => { item.show = () => { return {empty: true} } })
        : this.table.setting.toolbar.forEach((item) => { item.show = () => { return {empty: false} } })
      },
      noEdit (newValue) {
        this.table.setting.editor.insuranceType.disable = newValue
      }
    },
    methods: {
      changeInsuranceType (val) {
        req('insuredInfo', {insuranceType: val, iafInsNodeclareRecordId: this.dialogForm.lists[0].iafInsNodeclareRecordId}).then(data => {
          this.table.data[0].insuranceType = val
          this.table.data[0].accountCode = data
          let newObj = Object.assign({}, this.table.data[0])
          this.table.data = []
          this.table.data.push(newObj)
        }).catch(() => {
          this.table.data[0].accountCode = ''
        })
      },
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
      // 调用i-table新增方法
      // createData () {
      //   this.$refs.table.createData()
      // },
      deleteData () {
        this.$refs.table.deleteData()
      },
      // 通过工号获得员工基本信息
      getBasicMsg () {
        this.table.data = []
        req('findFullNameAndpersonnelGroupCode1', {employeeCode: this.dialogForm.employeeCode}).then(data => {
          // data.list.forEach(val => {
          //   this.$set(val, 'declareStatus', 'N')
          // })
          // this.table.data = data.list
          Object.assign(data, {month: this.dialogForm.month, declareDate: this.dialogForm.declareDate})
          this.dialogForm = this.$emit('update:dialogForm', Object.assign({}, this.dialogForm, data))
        })
        req('findFullNameAndpersonnelGroupCode', {employeeCode: this.dialogForm.employeeCode}).then(data => {
          data.list.forEach(val => {
            this.$set(val, 'declareStatus', 'N')
          })
          this.table.data = data.list
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
            this.toolbar[1].loading = false
            return false
          }
        })
      },
      handleIconClick () {
        if (!this.isEdit) {
          this.isShow = !this.isShow
        }
      },
      handleConfirm (selected) {
        this.dialogForm.employeeCode = selected[0].employeeCode
        this.getBasicMsg()
      },
      sendAll () {
        this.$refs.table.saveData()
      },
      // 获取内部所有数据
      getTableClone (data) {
        this.table.data = data
      },
      cruentSelectVal ({row, col, val}) {
        if (col === 'insuranceType') {
          req('checkAccountCode', {insuranceType: val, personnelGroupCode: this.dialogForm.personnelGroupCode})
          .then(res => {
            row.accountCode = res
          })
          .catch(() => {
            row.accountCode = ''
            row.insuranceType = ''
          })
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
