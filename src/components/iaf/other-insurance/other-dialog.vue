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
        <el-form-item label="组织" required>
          <el-input v-model="dialogForm.orgUnitName" disabled></el-input>
        </el-form-item>
        <el-form-item label="人事范围" required>
          <el-input v-model="dialogForm.personnelGroupName" disabled></el-input>
        </el-form-item>
        <el-form-item label="缴纳月份" prop="payMonth">
          <el-date-picker 
            type="month" 
            v-model="dialogForm.payMonth" 
            :picker-options="pickerOptions"
            :editable="false"
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
              <el-table
                @row-click="rowClickHandler(tableScope, $event)"
                @selection-change="selectionChangeHandler(tableScope, $event)"
                :data="tableScope.clone"
              >
                <el-table-column type="selection" :fixed="true"></el-table-column>
                <el-table-column
                  v-for="(col, idx) of table.columns"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                >
                  <template slot-scope="scope">
                    <i-table-cell
                      v-if="true"
                      @change="cruentSelectVal"
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
  import IDialog from 'components/common/i-dialog/i-dialog'
  import req from 'api/iaf/insurance-manage'

  export default {
    components: {
      IDialog
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
      }
    },
    data () {
      return {
        toArray: '',
        isShow: false,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        // 表格数据
        table: {
          columns: [
            { prop: 'typeCode', label: '数据项', display: {dict: 'IAF_OTHER_SELECT'} },
            { prop: 'accountCode', label: '户头代码' },
            { prop: 'policyMoney', label: '金额' }
          ],
          setting: {
            editor: {
              typeCode: {
                type: 'select'
              }
            },
            toolbar: [{
              text: '增加',
              func: vm => vm.createData()
            }, {
              text: '删除',
              type: 'danger',
              func: vm => vm.deleteData()
            }]
          },
          editable: true,
          dev: true,
          data: null
        },
        toolbar: [
          {text: '取消', type: 'text', func: this.dialogCancel},
          {text: '确定', type: 'primary', func: this.confirm}
        ],
        rules: {
          payMonth: [
            {
              type: 'date', required: true, message: '请输入缴纳月份', trigger: 'change'
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
    methods: {
      // 通过工号获得员工基本信息
      getBasicMsg () {
        req('iafGetEmpBasicMsg', {code: this.dialogForm.employeeCode}).then(data => {
          this.dialogForm = this.$emit('update:dialogForm', Object.assign({}, this.dialogForm, data))
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
          if (valid) {
            this.sendAll()
            this.$emit('confirm', this.table.data)
          } else {
            return false
          }
        })
      },
      handleIconClick () {
        this.isShow = !this.isShow
      },
      handleConfirm (selected) {
        this.dialogForm.employeeCode = selected[0].employeeCode
        this.getBasicMsg()
      },
      // 行点击
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      // 多选框点击
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },
      sendAll () {
        this.$refs.table.saveData()
      },
      // 获取 request 数据（增删改集合）
      getTableData (data) {
        this.$message({
          message: data
        })
      },
      // 获取内部所有数据
      getTableClone (data) {
        this.table.data = data
      },
      cruentSelectVal (row) {
        if (row.col === 'typeCode') {
          this.toArray = row.val.split(',')
        } else if (row.col === 'accountCode') {
          let codeVal = row.val.substr(0, 2)
          if (this.toArray[0] !== codeVal) {
            this.$message.error('户头代码类型不匹配！')
          }
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
