<template>
  <section class="emp-financial content-follow">
    <h2 class="info-title">资产账款对接清单</h2>
   <i-table :table="table" v-if="showMap.assetList" @loaded="handleLoaded">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone" v-if="showMap.assetList">
        <!-- 若无特殊需求，推荐使用 -->
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
                        v-if="!disabledMap.assetList"
                       >
                     </i>
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
            <el-table :data="tableScope.clone" @selection-change="handleSelectionChange" v-loading="insuranceLoading" :element-loading-text="$loadingText">
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


    <!-- <el-form
      :model="dimissionInfo"
      label-width="140px"
      class="form-main clearfix mt20"
      style="display:none"
      >
      
      <div class="flex">

        <el-form-item label="未清借款（线上）" prop="lineLoan" v-if="showMap.lineLoan">
          <el-input v-model="dimissionInfo.lineLoan" :disabled="disabledMap.lineLoan"></el-input>
        </el-form-item>

        <el-form-item label="未清借款（现金）" prop="orgUnitId" v-if="showMap.actualLoan">
          <el-input v-model="dimissionInfo.actualLoan" :disabled="disabledMap.actualLoan"></el-input>
        </el-form-item>

        <el-form-item label="未清预付款" prop="jobFamily" v-if="showMap.unPaidPayment">
          <el-input v-model="dimissionInfo.unPaidPayment" :disabled="disabledMap.unPaidPayment"></el-input>            
         <el-date-picker
            type="date"
            v-model="dimissionInfo.probationEndDate"
            style="width: 100%;"
            :disabled="editable">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="未清报销金额" prop="posTitleId" v-if="showMap.unPaidAmount">
          <el-input v-model="dimissionInfo.unPaidAmount" :disabled="disabledMap.unPaidAmount"></el-input>
        </el-form-item>

        <el-form-item label="未使用机票" prop="posTitleId" v-if="showMap.unUseTicker">
          <el-input v-model="dimissionInfo.unUseTicker" :disabled="disabledMap.unUseTicker"></el-input>
        </el-form-item>

      </div>
    </el-form> -->


  </section>
</template>
<script>
  import req from 'api/employee/personal'
  import ITable from 'components/common/i-table'
  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import ITableCell from 'components/common/i-table-cell'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'

  // import flow from 'mixins/flow'

  export default {
    props: {
      dimissionInfo: Object,
      editable: {
        type: Boolean,
        default: false
      }
    },
    components: {
      ITable,
      IPersonnelSelect,
      ITableCell,
      IDialog
    },
    // mixins: [flow],
    data () {
      return {
        insuranceLoading: false,
        tablevm: null,
        row: '',
  
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
          employeeId: '',
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
      // 每一次加载都把保存在dimission的数据给table的data
      this.$set(this.table, 'data', this.dimissionInfo.assetList)
    },
    watch: {
      'dimissionInfo.assetList': {
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
        this.insuranceLoading = true
        acountList.employeeId = this.dimissionInfo.empEmployeeId
        req('getFinancilPersonList', acountList)
        .then(res => {
          Object.keys(res).map(key => (this.acount[key] = res[key]))
          this.insuranceLoading = false
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
      // 选择资产承接人同时改dimissionInfo.assetList的人员id和名字
      submitAcount () {
        if (this.multipleSelection.length < 1) {
          this.$message('请选择人员')
        } else if (this.multipleSelection.length > 1) {
          this.$message('只能选择一个')
        } else {
          if (this.dimissionInfo.firstSelectefPersonal) {
            this.tablevm.clone.map((item, idx) => {
              this.$set(this.tablevm.clone[idx], 'receptEmpolyeeName', this.multipleSelection[0].employeeName)
              this.$set(this.tablevm.clone[idx], 'receptEmpolyeeId', this.multipleSelection[0].employeeId)
              this.$set(this.dimissionInfo.assetList[idx], 'receptEmpolyeeName', this.multipleSelection[0].employeeName)
              this.$set(this.dimissionInfo.assetList[idx], 'receptEmpolyeeId', this.multipleSelection[0].employeeId)
            })
            this.dimissionInfo.firstSelectefPersonal = false
          } else {
            this.$set(this.tablevm.clone[this.row], 'receptEmpolyeeName', this.multipleSelection[0].employeeName)
            this.$set(this.tablevm.clone[this.row], 'receptEmpolyeeId', this.multipleSelection[0].employeeId)
            this.$set(this.dimissionInfo.assetList[this.row], 'receptEmpolyeeName', this.multipleSelection[0].employeeName)
            this.$set(this.dimissionInfo.assetList[this.row], 'receptEmpolyeeId', this.multipleSelection[0].employeeId)
          }
          this.isShow = false
        }
      },
      // 是否符合
      handlerIsAccord (val, row) {
        this.$set(this.tablevm.clone[row._id], 'isAccord', val)
        this.$set(this.dimissionInfo.assetList[row._id], 'isAccord', val)
        let flag
        flag = this.dimissionInfo.assetList.find(item => { return item.isAccord === 'N' })
        // console.log(flag)
        flag ? (this.dimissionInfo.isAccord = 'N') : (this.dimissionInfo.isAccord = 'Y')
      },
      // 获取itable实例
      handleLoaded (vm) {
        this.tablevm = vm
      },
      changeData () {

      }
    }
  }
</script>
<style lang="scss" scoped>
  .emp-financial {
    .flex {
      display: flex;
      flex-wrap: wrap;
      & > * {
        flex-basis: 25%;
      }
    }
    .form-main {
      .el-form-item {
        width: 280px;
      }
    }
    .el-radio + .el-radio {
      margin-left:15px;
    }
  }
  .mt20 {
    margin-top: 20px;
  }
</style>


