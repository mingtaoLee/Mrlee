<template>
  <section class="emp-financial-handover content-follow">
    <h2 class="info-title">资产账款交接清单</h2>

    <div class="mb20">
      <i-table
        :table="table"
         v-if="showMap.assetList"
          @loaded="handleLoaded"
         >
        <template slot="table" slot-scope="tableScope">
        <!-- 此处的 tableScope.clone 为克隆后的 table.date 数据 -->
        <el-table :data="tableScope.clone">
            <el-table-column
              v-for="(col, idx) of tableScope.columns || []"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              >
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                  ref="cell"
                >
                <div>
                   <el-select
                     v-model="scope.row.isAccord"
                     v-if="col.prop === 'isAccord'"
                     @change="handlerIsAccord($event,scope.row)"
                     :disabled = 'disabledMap.isAccord'
                  >
                     <el-option value="Y" label="符合"></el-option>
                     <el-option value="N" label="不符合"></el-option>
                   </el-select>
                  </div> 
                  <div>
                     <el-input
                     v-if="col.prop === 'receptEmpolyeeName'"
                     v-model="scope.row.receptEmpolyeeName"
                     readonly
                     :disabled="disabledMap.assetList"
                     :placeholder="disabledMap.assetList && ''"
                     >
                     <i
                       slot="suffix"
                       class="el-icon-menu"
                       @click="handleIconClick(scope.row)"
                       v-if="!disabledMap.assetList"></i>                
                   </el-input> 
                  </div>
                    
                </i-table-cell>
              </template>
            </el-table-column>
      </el-table>
        </template>
  </i-table>

     <!-- 人员表格 -->
   <i-dialog
      v-model="isShow"
      title="选择人员"
      size="large"
      :toolbar="toolbar"
      v-if="isShow"
    >
    <i-form  @reset="acountList.employee = ''" @search="acountSearch">
      <el-form-item label="姓名或者工号">
        <el-input v-model="acountList.employee"></el-input>
      </el-form-item>
    </i-form>
      <!-- 用户表格 -->
        <i-table :table="acount" @pageSizeChange="handleSizeChange1" @pageIndexChange="handleCurrentChange1">
          <template slot="table" slot-scope="tableScope">
            <el-table :data="tableScope.clone" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column
                  v-for="(item, idx) in acount.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :formatter="tableScope.formatter"
                />
              </el-table>
            </template>
        </i-table>
    </i-dialog>


      <!-- <el-table :data="tableEducationData" style="width: 100%" max-height="250">
        <el-table-column prop="num" label="类别">
          <template slot-scope="scope">
            <div>{{++scope.$index}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="admissionDate" label="费用大类">
          <template slot-scope="scope">
            <div>{{++scope.$index}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="graduationDate" label="费用项目">
          <template slot-scope="scope">
            <div>{{++scope.$index}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="institution" label="欠款金额">
          <template slot-scope="scope">
            <div>{{++scope.$index}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="educationType" label="承接人">
          <template slot-scope="scope">
            <div>{{++scope.$index}}</div>
          </template>
        </el-table-column>
      </el-table> -->
    </div>
  </section>
</template>
<script>
import req from 'api/employee/personal'
import ITable from 'components/common/i-table'
import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import ITableCell from 'components/common/i-table-cell'
import IDialog from 'components/common/i-dialog/i-dialog.vue'

export default {
  props: {
    transferInfo: Object
  },
  components: {
    ITable,
    IPersonnelSelect,
    ITableCell,
    IDialog
  },
  data () {
    return {
      basicInfo: {
        test: null
      },
      tablevm: null,
      table: {
        columns: [
            { prop: 'assetSysCode', label: '资产系统编码' },
            { prop: 'assetEntCode', label: '资产实物编码' },
            { prop: 'assetName', label: '资产名称' },
            { prop: 'menge', label: '数量' },
            { prop: 'meins', label: '计量单位' },
            { prop: 'isAccord', label: '资产是否符合', align: 'center' },
            // todo:字段修改
            { prop: 'receptEmpolyeeName', label: '资产承接人' }
        ],
        setting: {
          editor: {
            assetSysCode: {disable: true},
            assetEntCode: {disable: true},
            assetName: {disable: true},
            menge: {disable: true},
            meins: {disable: true},
            receptEmpolyeeName: {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (this.disabledMap.assetList) {
                      return callback()
                    }
                    if (value) {
                      return callback()
                    }
                    callback(new Error('请选择人员'))
                  }
                }
              ]
            },
            isAccord: {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (this.disabledMap.isAccord) {
                      return callback()
                    }
                    if (value) {
                      return callback()
                    }
                    callback(new Error('请选择是否符合'))
                  }
                }
              ]
            }
          }
        },
        editable: true,
        data: null
      },
      //   模态框的表格
      acount: {
        columns: [
          { prop: 'employeeName', label: '姓名', width: 100 },
          { prop: 'employeeCode', label: '工号', width: 100 },
          { prop: 'unitPathName', label: '组织全称', width: 300 },
          { prop: 'positionName', label: '职务', width: 150 },
          { prop: 'idNumber', label: '身份证号' }
        ],
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
      acountList: {
        employee: '',
        orgUnitId: '',
        maxNum: 100
      },
      toolbar: [{
        text: '取消',
        type: 'text',
        func: (done) => {
          this.isShow = false
          done()
        }
      }, {
        text: '确定',
        type: 'primary',
        func: (done) => {
          this.submitAcount()
        }
      }],
      multipleSelection: [],
      isShow: false
    }
  },
  mounted () {
    this.$set(this.table, 'data', this.transferInfo.assetList)
  },
  watch: {
    'transferInfo.assetList': {
      handler: function (newVal, oldVal) {
        this.$set(this.table, 'data', newVal)
      },
      deep: true
    }
  },
  methods: {
    handleSizeChange1 (options) {
      this.getUserList(options)
    },
    handleCurrentChange1 (options) {
      this.getUserList(options)
    },
    acountSearch () {
      this.acount.search = { ...this.acountList }
    },
      // 获取人员列表
    getUserList (acountList) {
      acountList.employeeId = this.transferInfo.empEmployeeId

      req('getFinancilPersonList', acountList)
        .then(res => {
          Object.keys(res).map(key => (this.acount[key] = res[key]))
        })
        .catch(err => console.log(err))
    },
          // 选中某一项的时候
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
        // 控制人员选择器的显示隐藏
    handleIconClick (row) {
      if (this.disabledMap.assetList) {
        return
      }
      this.row = row._id
      this.getUserList(this.acountList)
      this.isShow = true
    },
      // 选择资产承接人同时改transferInfo.assetList的人员id和名字
    submitAcount (sel, row) {
      if (this.multipleSelection.length < 1) {
        this.$message('请选择人员')
      } else if (this.multipleSelection.length > 1) {
        this.$message('只能选择一个')
      } else {
        if (this.transferInfo.firstSelectefPersonal) {
          this.tablevm.clone.map((item, idx) => {
            this.$set(this.tablevm.clone[idx], 'receptEmpolyeeName', this.multipleSelection[0].employeeName)
            this.$set(this.tablevm.clone[idx], 'receptEmpolyeeId', this.multipleSelection[0].employeeId)
            this.$set(this.transferInfo.assetList[idx], 'receptEmpolyeeName', this.multipleSelection[0].employeeName)
            this.$set(this.transferInfo.assetList[idx], 'receptEmpolyeeId', this.multipleSelection[0].employeeId)
          })
          this.transferInfo.firstSelectefPersonal = false
        } else {
          this.$set(this.tablevm.clone[this.row], 'receptEmpolyeeName', this.multipleSelection[0].employeeName)
          this.$set(this.tablevm.clone[this.row], 'receptEmpolyeeId', this.multipleSelection[0].employeeId)
          this.$set(this.transferInfo.assetList[this.row], 'receptEmpolyeeName', this.multipleSelection[0].employeeName)
          this.$set(this.transferInfo.assetList[this.row], 'receptEmpolyeeId', this.multipleSelection[0].employeeId)
        }
        this.isShow = false
      }
    },
     // 是否符合
    handlerIsAccord (val, row) {
      this.$set(this.tablevm.clone[row._id], 'isAccord', val)
      this.$set(this.transferInfo.assetList[row._id], 'isAccord', val)
      let flag
      flag = this.transferInfo.assetList.find(item => { return item.isAccord === 'N' })
      // console.log(flag)
      flag ? (this.transferInfo.isAccord = 'N') : (this.transferInfo.isAccord = 'Y')
    },
         // 获取itable实例
    handleLoaded (vm) {
      this.tablevm = vm
    },
    changeData (val) {
    }
  }
}
</script>
<style lang="scss" scoped>
  .emp-financial-handover {
    .form-main {
      .el-form-item {
        width: 280px;
      }
    }
    .el-radio + .el-radio {
      margin-left:20px;
    }
  }

  .col-wider {
    width: 690px !important;
  }
</style>



