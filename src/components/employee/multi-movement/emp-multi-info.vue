<template>
  <section class="emp-multimove-basic content-follow" >
    <h2 class="info-title">调动信息</h2>
    <header>
      <el-button type="primary" @click="addPerson">添加</el-button>
      <el-button type="primary" @click="deleteRows">删除</el-button>
      <el-button type="success" @click="importInfo">导入</el-button>
    </header>
    <i-personnel-select
      :isShow.sync="isShow"
      @confirm="handleConfirm"
      ref="newPerson"
      :hasGrant="false"
       filterType="personnelGroup"
      ></i-personnel-select>
    <el-table
      fit
      ref="multipleTable"
      :data="multiInfo.transFerList"
      @selection-change="handleSelectionChange"
       v-loading="multiLoading"
       :element-loading-text="$loadingText"
      >
      <el-table-column
        type="selection"
        fixed
        width="55">
      </el-table-column>
      <el-table-column
        label="姓名"
        fixed
        width="120">
        <template slot-scope="scope">{{ scope.row.fullName }}</template>
      </el-table-column>
      <el-table-column
        label="工号"
        width="120">
        <template slot-scope="scope">{{ scope.row.employeeCode }}</template>
      </el-table-column>
      <!--  -->
       <el-table-column
        label="入职日期"
        width="120">
        <template slot-scope="scope">{{ scope.row.hireDate | dateFormat }}</template>
      </el-table-column>
      <!--  -->
      <el-table-column
        label="调动类型"
        width="120">
        <template slot-scope="scope">
          <i-select
            class="showStart"
            v-model="scope.row.transferType"
            parameter='TRANSFER_TYPE'
            :disabled="editable"
            @change="getTransferReason(scope.row, $event)"
            ></i-select>
        </template>
      </el-table-column>
      <!--  -->
      <el-table-column
        label="调动生效日期"
        width="120"
        :show-overflow-tooltip="false"
        >
        <template slot-scope="scope">
            <el-date-picker
              type="month"
              v-model="scope.row.transferDate"
              style="width: 100%;"
              :picker-options="scope.row.pickerOptions"
              :disabled="editAble"
              class="showStart"
              @change="getSTime(scope.row)"
              >
            </el-date-picker>
        </template>
      </el-table-column>
      <!--  -->
      <el-table-column
        label="调动原因"
        width="120">
        <template slot-scope="scope">
           <el-select
             class="showStart"
             v-model="scope.row.transferReason"
             :disabled="editable"
             v-if="scope.row.transferType !== '3'"
             >
                <el-option
                  v-for="item in scope.row.transferReasonList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          <!-- <i-select class="showStart" v-model="scope.row.transferReason" parameter='TRANSFER_REASON' :disabled="editable"></i-select> -->
        </template>
      </el-table-column>

      <el-table-column
        width="120">
        <template slot-scope="scope">
          <div class="bold">调动前</div>
          <div class="bold">调动后</div>
          </template>
      </el-table-column>
      <el-table-column
        label="公司"
        width="200">
        <template slot-scope="scope">
          <div class="before">
             <el-input v-model="scope.row.oldCompanyName" :disabled="true"></el-input>
          </div>
          <div class="after">
             <el-input v-model="scope.row.newCompanyName" :disabled="true"></el-input>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="人事范围" width="150">
        <template slot-scope="scope">
          <div class="before">
            <el-input v-model="scope.row.oldPersonnelGroupName" :disabled="true"></el-input>
          </div>
          <!-- 人事范围是一个下拉框 -->
          <div class="after">
             <remote-select
               v-model="scope.row.newPersonnelGroupName"
               dataKey="personnelGroup"
               :props="personnelProps"
               :displayKeys="personnelGroupLabel"
               @option-click="selectefPersonnelGroup(scope.row,$event)"
               :extraParams="params"
                :defaultOptions="scope.row.defaultPersonnelGroupLabel"
               ></remote-select>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="组织" width="180">
        <template slot-scope="scope">
          <div class="before">
             <el-input v-model="scope.row.oldOrgUnitName" :disabled="true"></el-input>
          </div>
          <div class="after">
        <!-- 第一次填写的时候可以选择-->
            <i-select-tree
              v-model="scope.row.newOrgUnitId"
              dataKey="org"
              nodeKey="orgUnitId"
              @input="getAreaAndPosList(scope.row)"
              @node-click='nodeClick(scope.row)'
              @delete="deleteOrgUnitId(scope.row)"
              class="showStart"
              >
              <!-- :hasGrant="false" -->
            </i-select-tree>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="职位"
        width="160">
        <template slot-scope="scope">
          <div class="before">
            <el-input v-model="scope.row.oldPosPositionName"  :disabled="true"></el-input>
          </div>
          <div class="after">
            <!--<el-input v-model="scope.row.newPosPositionId" ></el-input>-->
             <el-select
               class="showStart"
               v-model="scope.row.newPosPositionId"
               :placeholder="scope.row.newPosPositionName"
                @change="changePos($event, scope.row)"
               :disabled="editAble">
               <el-option
                 v-for="item in scope.row.posList"
                 :key="item.posPositionId"
                 :label="item.name"
                 :value="item.posPositionId">
               </el-option>
             </el-select>
          </div>
        </template>
      </el-table-column>

      <!-- TODO:职务字段 -->
      <el-table-column label="职务" width="160">
        <template slot-scope="scope">
          <div class="before">
            <el-input v-model="scope.row.oldPosTitleName" :disabled="true"></el-input>
          </div>
          <div class="after">
            <el-input v-model="scope.row.newPosTitleName" :disabled="true"></el-input>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="用工类型" width="180">
        <template slot-scope="scope">
          <div class="before">
            <i-select v-model="scope.row.oldEmployeeType" parameter='EMPLOYEE_TYPE' :disabled="true"/>
          </div>
          <!-- </div> -->
          <div class="after">
            <i-select v-model="scope.row.newEmployeeType" parameter='EMPLOYEE_TYPE' :disabled="scope.row.transferType !== '3'" class="showStart"/>
          </div>
        </template>
      </el-table-column>
      <!-- 工作制 -->
       <el-table-column
        label="工作制"
        width="180">
        <template slot-scope="scope">
          <div class="before">
            <i-select v-model="scope.row.oldWorkSystem" parameter='WORK_SYSTEM' :disabled="true"/>
          <!-- </div> -->
          </div>
          <div class="after">
            <i-select v-model="scope.row.newWorkSystem"  parameter='WORK_SYSTEM' :disabled="editable" class="showStart"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="薪资组"
        width="160">
        <template slot-scope="scope">
          <div class="before">
            <el-input v-model="scope.row.oldPayGroupName" :disabled="true"></el-input>
          </div>
          <div class="after">
             <remote-select
               class="showStart"
               v-model="scope.row.newPayGroupName"
               dataKey="allSalaryGroup"
               :props="groupProps"
               @option-click="selectefGroup(scope.row, $event)"
               :extraParams="{personnelGroupCode: scope.row.newPersonnelGroupCode || ''}"
             ></remote-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="薪资"
        width="200">
        <template slot-scope="scope">
          <div class="before">
             <el-input v-model="scope.row.oldSalary" disabled style="display:inline-block;width:80px"></el-input>
             <span style="font-size:12px;">{{scope.row.oldSalaryType === '2' ? '元/时':'元/月'}}</span>
          </div>
          <div class="after">
            <el-input v-model="scope.row.newSalary" class="input-with-select select" size="mini" @blur="mustNumber(scope.row)">
               <el-select v-model="scope.row.newSalaryType" slot="append">
                 <el-option label="元/时" value="2"></el-option>
                 <el-option label="元/月" value="1"></el-option>
               </el-select>
              </el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="是否随时效浮动"
        width="200">
        <template slot-scope="scope">
        <div class="before">
        <i-select v-model="scope.row.oldIsAgingFloat" disabled parameter='WHETHER_TYPE' />
        </div>
        <div class="after">
        <i-select v-model="scope.row.newIsAgingFloat" parameter='WHETHER_TYPE' class="showStart"/>
        </div>
        </template>
        </el-table-column>
      <el-table-column
        label="联保人"
        width="300">
        <template slot-scope="scope">
          <div class="before surety">
            <el-input v-model="scope.row.oldSuretyName1" :disabled="true" v-show="scope.row.isOldShowSalary"></el-input>
            <el-input v-model="scope.row.oldSuretyName2" :disabled="true" v-show="scope.row.isOldShowSalary"></el-input>
          </div>
          <div class="after surety">
              <i-select
               id="newSuretyName1"
                class="showStart"
                v-if="scope.row.isShowSalary"
                v-model="scope.row.newSuretyName1"
                placeholder="请选择"
                @option-click="handleOptionClick1($event,scope.row)"
                @change="handleChange1"
                :disabled="scope.row.rowEssentialList.length>=1"
                :options="Array.from(scope.row.cosuretyList)"
                :async="false"
                :props="cosuretyProps"
                readOnly
              ></i-select>
             <i-select
               id="newSuretyName2"
                class="showStart"
                v-if="scope.row.isShowSalary"
                v-model="scope.row.newSuretyName2"
                placeholder="请选择"
                @option-click="handleOptionClick2($event,scope.row)"
                @change="handleChange2"
                :disabled="scope.row.rowEssentialList.length>=2"
                :options="Array.from(scope.row.cosuretyList)"
                :async="false"
                :props="cosuretyProps"
                readOnly
              ></i-select>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <i-dialog
      v-model="importVisible"
      :title="导入"
      :toolbar="importToolbar"
      size="small">   
      <i-table-import-excel
        v-if="importVisible"
        :setting="setting"
        ref="import"
        @success="importSubmitedHandler"
        @fail="importFailed"
      />
    </i-dialog>
  </section>
</template>
<script>
  import req from 'api/employee/personal'
  import ITable from 'components/common/i-table'
  import ISelect from 'components/common/i-select/i-select'
  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  // import {formatTableDate} from 'utils/employee.js'
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
  import moment from 'moment'
  import {dateFormat} from 'filters'
  import IDialog from '../../common/i-dialog/i-dialog'
  import ITableImportExcel from '../../common/i-table/import-excel/index.vue'
  import Personnel from '../personnelCommon'
  import RemoteSelect from 'components/compensation/remote-select'

  export default {
    components: {
      ITable,
      ISelect,
      IPersonnelSelect,
      ISelectTree,
      IDialog,
      ITableImportExcel,
      Personnel,
      RemoteSelect
    },
    filters: {dateFormat},
    props: {
      multiInfo: Object
    },
    data () {
      return {
        cosuretyList: [],
        cosuretyProps: {
          label: 'name',
          value: 'id'
        },
        multiLoading: false,
        // 存放联保人工号和姓名
        // importOptionalList: [],
      // 必选联保人存放列表
        groupProps: {value: 'groupId', label: 'groupName'}, // 薪资组的配置
          // 人事范围选择器配置
        personnelGroupLabel: ['personnelGroupCode', 'personnelGroupName'],
        personnelProps: {value: 'personnelGroupCode', label: 'personnelGroupName'},
        params: {'hasPower': 'Y', 'usable': 'Y'},
        importVisible: false,
        isShow: false,
        personnels: '',
        importsDataKey: '',
        setting: {
          business: 'employee-transfer',
          params: {
            'importsDataKey': ''
          }
        },
        importToolbar: [{
          text: '取消',
          type: 'default',
          func: done => done()
        }, {
          text: '确定',
          func: done => {
            // console.log(this.$refs.import)
            this.$refs.import && this.$refs.import.submit(done)
            // done()
          }
        }],
        pickerOptions: {
          disabledDate (time) {
            let val = new Date()
            val.setMonth(val.getMonth() + 1)
            return time.getTime() < new Date(val)
          }
        },
        multipleSelection: []
      }
    },
    created () {
      // 发起的时候才需要
      this.$route.query.empEmployeeId !== '[]' && this.getMultiEmployee().then((flag) => {
        this.setProp(flag)
      })
      this.importsDataKey = this.generateUUID()
      this.$set(this.setting.params, 'importsDataKey', this.importsDataKey)
    },
    mounted () {
    },
    watch: {
      'multiInfo.transFerList': {
        handler: function (newVal, oldVal) {
          newVal.map(person => {
            // person.transferType === '1' && (person.newOrgUnitId = person.oldOrgUnitId)
            // person.transferType === '1' && (person.newOrgUnitName = person.oldOrgUnitName)
          })
        },
        deep: true
      }
    },
    methods: {
      generateUUID () {
        var d = new Date().getTime()
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0
          d = Math.floor(d / 16)
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
        return uuid
      },
    // 获取必选联保人essentialCosuretyList
      getEssentialCosurety (item, row) {
        // this.EssentialList = []
        this.$set(row, 'rowEssentialList', [])
        item = {
          empEmployeeId: row.empEmployeeId,
          employeeUnitId: row.newOrgUnitId
        }
        req('getEssentialCosurety', item, true, false)
      .then(data => {
        data.map(item => {
          let val = {
            suretyName: item.suretyName,
            suretyEmployeeId: item.suretyEmployeeId
          }
          row.rowEssentialList.push(val)
          if (row.rowEssentialList.length === 1) {
            row.newSurety1 = row.rowEssentialList[0].suretyEmployeeId
            row.newSuretyName1 = row.rowEssentialList[0].suretyName
            // document.getElementById('newSuretyName1').disabled = true
          } else if (row.rowEssentialList.length === 2) {
            row.newSurety1 = row.rowEssentialList[0].suretyEmployeeId
            row.newSuretyName1 = row.rowEssentialList[0].suretyName
            row.newSurety2 = row.rowEssentialList[1].suretyEmployeeId
            row.newSuretyName2 = row.rowEssentialList[1].suretyName
            // document.getElementById('newSuretyName1').disabled = true
            // document.getElementById('newSuretyName1').disabled = 'disabled'
            // document.getElementById('newSuretyName2').disabled = 'disabled'
          }
        })
        // console.log('EssentialList', this.EssentialList)
      })
      },
    // 获取可选联保人
      getNewCosurety (item, row) {
        // console.log(1213131312, item, row)
        // this.cosuretyList = []
        this.$set(row, 'cosuretyList', [])
        // this.$set(row, 'importOptionalList', [])
        item = {
          empEmployeeId: row.empEmployeeId,
          employeeUnitId: row.newOrgUnitId
        }
        return req('getOptionalCosurety', item, true, false)
        .then(data => {
          data.map(item => {
            let name = item.suretyEmployeeCode + '-' + item.suretyName
            let id = item.suretyEmployeeId
            let value = {'name': name, 'id': id}
            row.cosuretyList.push(value)
            // this.cosuretyList.push(value)
          })
            // 防止获取的联保人数量超过100个且必选联保人不在其中
          row.rowEssentialList.map(val => {
            row.cosuretyList.map(keyId => {
              if (keyId.id === val.suretyEmployeeId) {
                row.flagTag = true
              }
            })
            if (!row.flagTag) {
              let valueEss = {'name': val.suretyName, 'id': val.suretyEmployeeId}
              row.cosuretyList.push(valueEss)
            }
          })
          // console.log(111, row, row.cosuretyList)
        })
        .catch(err => {
          console.log(err)
        })
      },
      handleOptionClick1 (item, row) {
        let code = item.name.split('-')
        row.newSurety1 = item.id
        row.newSuretyCode1 = code[0]
        row.newSuretyName1 = code[1]
        // console.log(1212, item, row)
      },
      handleOptionClick2 (item, row) {
        let code = item.name.split('-')
        row.newSurety2 = item.id
        row.newSuretyCode2 = code[0]
        row.newSuretyName2 = code[1]
        // console.log(1212, item, row)
      },
      selectefGroup (row, sel) {
        row.newPayGroupName = sel.groupName
        row.newPayGroupId = sel.groupId
      },
      selectefPersonnelGroup (row, sel) {
        sel.companyCode && (row.newCompanyCode = sel.companyCode)
        sel.companyName && (row.newCompanyName = sel.companyName)
        row.newPersonnelGroupName = sel.personnelGroupName
        row.newPersonnelGroupCode = sel.personnelGroupCode
        row.newPayGroupName = ''
        row.newPayGroupId = ''
      },
      // 导入
      importInfo () {
        this.importVisible = true
      },
      checkSur (sel) {
        let count1 = 0
        let count2 = 0
        if (!sel.rowEssentialList.length) {
          Array.from(sel.cosuretyList).map(val => {
            // console.log('val1', val)
            val.suretyEmployeeId === sel.newSurety1 && count1++
            val.suretyEmployeeId === sel.newSurety2 && count2++
          })
        } else if (sel.rowEssentialList.length === 1) {
          Array.from(sel.cosuretyList).map(val => {
            // console.log('val2', val)
            val.suretyEmployeeId === sel.newSurety1 && count1++
            val.suretyEmployeeId === sel.newSurety2 && count2++
          })
        }
        if (!count1) {
          sel.newSuretyName1 = ''
          sel.newSurety1 = ''
          sel.newSuretyCode1 = ''
        }
        if (!count2) {
          sel.newSuretyName2 = ''
          sel.newSurety2 = ''
          sel.newSuretyCode2 = ''
        }
        // console.log(count1, count2, sel)
      },

      // 导入成功回调
      importSubmitedHandler (num, pro) {
        if (num !== 100 || !pro) {
          this.$message({type: 'warning', message: '导入数据未完成!'})
          return
        }
        let that = this
        let flag
        this.multiLoading = true
        console.log(that.importsDataKey)
        new Promise(resolve => {
          req('getImportsData', {importsDataKey: that.importsDataKey})
          .then(res => {
            res.map(sel => {
              this.getEssentialCosurety({empEmployeeId: sel.empEmployeeId, employeeUnitId: sel.newOrgUnitId}, sel)
              this.getNewCosurety({empEmployeeId: sel.empEmployeeId, employeeUnitId: sel.newOrgUnitId}, sel)
              .then(() => {
                this.checkSur(sel)
              }).then(() => {
                flag = that.multiInfo.transFerList.some(person => {
                  if (person.empEmployeeId === sel.empEmployeeId) {
                    Object.assign(person, sel)
                    this.importData(sel)
                    this.getEmployeeCompany(sel)
                    this.getImportTransferReason(sel, sel.transferType)
                    sel.newSalaryType = sel.oldSalaryType
                  }
                  return (person.empEmployeeId === sel.empEmployeeId)
                })
                if (!flag) {
                  that.multiInfo.transFerList.push(sel)
                // 获取职位的列表
                  this.importData(sel)
                  this.getEmployeeCompany(sel)
                  this.getImportTransferReason(sel, sel.transferType)
                  sel.newSalaryType = sel.oldSalaryType
                }
              })
            })
            this.multiLoading = false
            resolve(res)
            return false
          })
        })
        .then((flag) => {
          // this.setProp(flag)
        })
      },
      // 导入失败回调
      importFailed () {
        this.$message({type: 'warning', message: '导入数据失败!'})
      },
      // 获取导入数据的职位列表和职务
      importData (sel) {
        new Promise(resolve => {
          req('getPosList', {orgUnitId: sel.newOrgUnitId, status: '1'})
           .then(res => {
             this.$set(sel, 'posList', res)
             resolve(sel)
           })
        })
        .then(res => {
          this.changePos(res.newPosPositionId, res)
        })
      },
      // 根据人事范围获取公司
      getEmployeeCompany (sel) {
        req('getEmployeeCompany', {personnelGroupCode: sel.newPersonnelGroupCode})
        .then(res => {
          sel.newCompanyName = res.companyName
          sel.newCompanyCode = res.companyCode
        })
      },
      // 薪资必须为数字
      mustNumber (val) {
        let isNum = /^(([0]{1}\.[0-9]*[0-9]+)|([1-9]+\.[0-9]*[1-9][0-9]*)|([1-9]+[0-9]*\.[0-9]+)|([1-9]+[0-9]*)|([0]{1}))$/
        let IsOnlyTwo = /^(([0]{1}\.[0-9]{0,2})|([1-9]+\.[0-9]{1,2})|([1-9]+[0-9]*\.[0-9]{1,2})|([1-9]+[0-9]*)|([0]{1}))$/
  
        if (isNum.test(val.newSalary)) {
          if (IsOnlyTwo.test(val.newSalary)) {
            return
          } else {
            this.$set(val, 'newSalary', '')
            this.$message.warning('薪资最多保留两位小数!')
          }
        } else {
          this.$set(val, 'newSalary', '')
          this.$message.warning('请输入正确的数字!')
        }
      },
      // 添加人员
      addPerson () {
        this.$refs.newPerson.resetData()

        this.isShow = !this.isShow
      },
      // 根据组织id获取公司名称，人事范围和职位列表
      getAreaAndPosList (row) {
        if (row.newOrgUnitId) {
          this.$set(row, 'newSurety1', '')
          this.$set(row, 'newSuretyName1', '')
          this.$set(row, 'newSurety2', '')
          this.$set(row, 'newSuretyName2', '')
          row.rowEssentialList = []
          req('getPosList', {orgUnitId: row.newOrgUnitId, status: '1'})
           .then(res => {
             this.$set(row, 'posList', res)
           })
          // req('getArea', {id: row.newOrgUnitId})
          //  .then(area => {
          //    // 公司名称
          //   //  row.newCompanyName = area.orgCompanyName
          //    // 人事范围
          //   //  row.newPersonnelArea = area.personnelArea
          //    // 组织名称
          //   //  row.newOrgUnitName = area.orgUnitName
          //  })
        }
      },
      // 根据职位id获取职群，标准职位
      changePos (item, row) {
        let that = this
        if (row && row.newPosPositionId) {
          row.posList.map(pos => {
            if (pos.posPositionId === row.newPosPositionId) {
            //  标准职位
              // that.$set(row, 'newPosStandardJob', pos.posStandardJobName)
             // 职群
              // that.$set(row, 'newPosJobFamily', pos.posJobFamilyName)
              // 职务
              that.$set(row, 'newPosTitleName', pos.posTitleName)
              that.$set(row, 'newPosTitleId', pos.posTitleId)
              req('checkIsSurety', {posTitleId: pos.posTitleId}, true, false)
               .then(res => {
                 if (res) {
                   row.newSurety1 = ''
                   row.newSuretyName1 = ''
                   row.newSurety2 = ''
                   row.newSuretyName2 = ''
                   this.$set(row, 'isShowSalary', true)
                   this.$set(row, 'isOldShowSalary', true)
                   this.getNewCosurety(item, row)
                   this.getEssentialCosurety(item, row)
                 } else {
                   this.$set(row, 'isShowSalary', false)
                 }
               })
              // if (pos.posTitleName.includes('合伙人')) {
              //   row.isShowSalary = true
              // }
            }
          })
        }
      },
      // 当点击弹出框的确定按钮时，根据拿到的员工号Array去重新获取数据，保存在table.data中
      handleConfirm (selected) {
        let empEmployeeIds = []
        let that = this
        let flag
        // 如果没有选中人
        if (selected.length <= 0) {
          this.$message.warning('请至少选择一名员工')
          return false
        } else {
          selected.map(item => {
            // 如果不重复，才push
            flag = that.multiInfo.transFerList.some(person => {
              return (person.empEmployeeId === item.employeeId)
            })
            if (flag) {
              this.$message.warning('该人员已在列表中，不能重复选择')
              return false
            } else {
              empEmployeeIds.push(item.employeeId)
            }
          })
          this.multiLoading = true
          new Promise(function (resolve, reject) {
            req('postTransferIds', empEmployeeIds)
            .then(res => {
              if (res.transFerList) {
                res.transFerList.map(item => {
                  that.multiInfo.transFerList.push(item)
                })
                resolve(res.transFerList)
              }
            })
          })
          .then((flag) => {
            this.setProp(flag)
            this.multiLoading = false
          })
        }
      },
      // 表格选中
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      chunk (array, size) {
            // 获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
        const length = array.length
            // 判断不是数组，或者size没有设置，size小于1，就返回空数组
        if (!length || !size || size < 1) {
          return []
        }
            // 核心部分
        let index = 0 // 用来表示切割元素的范围start
        let resIndex = 0 // 用来递增表示输出数组的下标
  
            // 根据length和size算出输出数组的长度，并且创建它。
        let result = new Array(Math.ceil(length / size))
            // 进行循环
        while (index < length) {
              // 循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
          result[resIndex++] = array.slice(index, (index += size))
        }
            // 输出新数组
        return result
      },
      // 根据路由中传过来的empEmployeeId数组，去获取数据
      getMultiEmployee () {
        let that = this
        let idArr = JSON.parse(this.$route.query.empEmployeeId)
        return new Promise(resolve => {
          that.multiLoading = true
          req('postTransferIds', idArr)
          .then(res => {
            // this.importsDataKey = res.importsDataKey
            // this.$set(this.setting.params, 'importsDataKey', res.importsDataKey)
            if (res.transFerList) {
              res.transFerList.map(item => {
                that.multiInfo.transFerList.push(item)
              })
              // that.multiInfo.transFerList = res.transFerList
  
              that.multiLoading = false
              resolve(res.transFerList)
            } else {
              return false
            }
          })
        })
      },
      // getMultiEmployee () {
      //   let that = this
      //   let idArr = JSON.parse(this.$route.query.empEmployeeId)
      //   let sendArr = this.chunk(idArr, 3)
      //   sendArr.map(item => {
      //     that.multiLoading = true
      //     new Promise(resolve => {
      //       req('postTransferIds', item, true, false)
      //       .then(res => {
      //         that.importsDataKey = !that.importsDataKey ? res.importsDataKey : that.importsDataKey
      //         that.$set(that.setting.params, 'importsDataKey', that.importsDataKey)
      //         if (res.transFerList) {
      //           res.transFerList.map(item => {
      //             that.multiInfo.transFerList.push(item)
      //           })
      //           resolve(res.transFerList)
      //         } else {
      //           return false
      //         }
      //       })
      //     })
      //     .then((flag) => {
      //       this.setProp(flag)
      //     })
      //   })
      //   that.multiLoading = false
      // },
      // 删除选择行
      deleteRows () {
        if (!this.multipleSelection.length) {
          this.$message.warning('请选择需要删除的数据')
          return false
        }
        // transFerList是后台定的字段名字，就是我们熟悉的data
        for (let i = 0; i < this.multipleSelection.length; i++) {
          for (let j = this.multiInfo.transFerList.length - 1; j >= 0; j--) {
            (this.multipleSelection[i].employeeCode === this.multiInfo.transFerList[j].employeeCode) && this.multiInfo.transFerList.splice(j, 1)
          }
        }
      },
      // 清除选中
      clearSelection () {
        this.$refs.multipleTable.clearSelection()
        this.multiInfo.transFerList.length = 0
      },
      // 动态设置属性
      setProp (flag) {
        if (!flag) {
          return false
        }
        for (let val of flag) {
          // console.log(val)
          // 调动后设置默认值
          this.$set(val, 'newOrgUnitId', val.oldOrgUnitId)
          this.$set(val, 'newIsAgingFloat', val.oldIsAgingFloat)
          // this.$set(val, 'newSurety1', val.oldSurety1)
          // this.$set(val, 'newSuretyName2', val.oldSuretyName2)
          // this.$set(val, 'newSurety2', val.oldSurety2)
          this.$set(val, 'isShow1', false)
          this.$set(val, 'isShow2', false)
          this.$set(val, 'newEmployeeType', val.oldEmployeeType)
          this.$set(val, 'newPayGroupId', val.oldPayGroupId)
          this.$set(val, 'newPayGroupName', val.oldPayGroupName)
          this.$set(val, 'newSalary', val.oldSalary)
          this.$set(val, 'newSalaryType', val.oldSalaryType)
          this.$set(val, 'newWorkSystem', val.oldWorkSystem)
           // 公司和人事范围赋默认值
          this.$set(val, 'newCompanyCode', val.oldCompanyCode)
          this.$set(val, 'newCompanyName', val.oldCompanyName)
          this.$set(val, 'newPersonnelGroupCode', val.oldPersonnelGroupCode)
          this.$set(val, 'newPersonnelGroupName', val.oldPersonnelGroupName)
          // 职务
          // this.$set(val, 'newPosTitleName', val.oldPosTitleName)
          // 设置每一行的调动日期禁用
          val.pickerOptions = {
            disabledDate (time) {
              let d = new Date(val.hireDate)
              d.setMonth(d.getMonth() + 1)
              return time.getTime() < new Date(d)
            }
          }
            // 获取职位下拉列表
          req('getPosList', {orgUnitId: val.oldOrgUnitId, status: '1'})
           .then(res => {
             this.$set(val, 'posList', res)
           })
        //  根据职位id获取职位和职群
          if (val.oldPosPositionId) {
            req('getPositions', {posPositionId: val.oldPosPositionId})
            .then(pos => {
              //  标准职位
              // console.log(pos)
              // this.$set(val, 'oldPosStandardJob', pos.posStandardJobName)
              // this.$set(val, 'newPosStandardJob', pos.posStandardJobName)
              // 职群
              // this.$set(val, 'oldPosJobFamily', pos.posJobFamilyName)
              // this.$set(val, 'newPosJobFamily', pos.posJobFamilyName)
              // 职位
              // this.$set(val, 'oldPosPositionName', pos.name)
              // this.$set(val, 'newPosPositionName', pos.name)
              // 职务
              // this.$set(val, 'oldPosTitleName', pos.posTitleName)
              // this.$set(val, 'newPosTitleName', pos.posTitleName)
              // 根据职务是否显示联保人
              // if (pos.posTitleName && pos.posTitleName.includes('合伙人')) {
              //   this.$set(val, 'isShowSalary', true)
              // }
            })
          }
          req('checkIsSurety', {posTitleId: val.oldPosTitleId})
            .then(res => {
              if (res) {
                this.$set(val, 'isOldShowSalary', true)
              } else {
                this.$set(val, 'isOldShowSalary', false)
              }
            })
        }
      },
       // 当组织变化时，需要将职位置空，因为不同的组织职位不同，需要重新选择
      nodeClick (row) {
        row.newPosPositionId = ''
        //  标准职位
        // this.$set(row, 'newPosStandardJob', '')
        // 职群
        // this.$set(row, 'newPosJobFamily', '')
        // this.$set(row, 'newPosPositionName', '')
        this.$set(row, 'isShowSalary', false)
        this.$set(row, 'newPosTitleName', '')
      },
      // 删除组织时，六个全部置空
      deleteOrgUnitId (row) {
        row.newPosPositionId = ''
        //  标准职位
        // this.$set(row, 'newPosStandardJob', '')
        // 职群
        // // this.$set(row, 'newPosJobFamily', '')
        // this.$set(row, 'newPosPositionName', '')
        this.$set(row, 'newPosTitleName', '')
        this.$set(row, 'posList', [])

        // 公司名称
        // row.newCompanyName = ''
        // 人事范围
        // row.newPersonnelArea = ''
        // 组织名称
        row.newOrgUnitName = ''
        this.$set(row, 'isShowSalary', false)
      },
      // 调动生效日期，只能选1号
      getSTime (val) {
        if (!val.transferDate) {
          return false
        }
        val.transferDate = new Date(val.transferDate)
        // let hireDate = new Date(val.hireDate)
        // if (val.transferDate.getMonth() === hireDate.getMonth()) {
        //   // 相等把月加一
        //   val.transferDate.setMonth(val.transferDate.getMonth() + 1)
        // }
        // 把日全部置为01
        val.transferDate.setDate(val.transferDate.getDate() - val.transferDate.getDate() + 1)
        val.transferDate = moment(val.transferDate).format('YYYY-MM-DD')
        // 截取
      },
      getTransferReason (row, val) {
        val && (row.transferReason = '')
        val !== '3' && (row.newEmployeeType = row.oldEmployeeType)
            // 每一次转换进入之前把之前的数组清空
        this.$set(row, 'transferReasonList', [])
        val && req('getDistCode', {dictCode: 'TRANSFER_REASON'})
          .then(res => {
            // 如果没有选择就显示全部
            res.forEach((item, i) => {
              if (item.value.substring(0, 1) === val) {
                row.transferReasonList.push(item)
              }
            })
          })
      },
      getImportTransferReason (row, val) {
        console.log(row, val)
        val !== '3' && (row.newEmployeeType = row.oldEmployeeType)
            // 每一次转换进入之前把之前的数组清空
        this.$set(row, 'transferReasonList', [])
        val && req('getDistCode', {dictCode: 'TRANSFER_REASON'})
          .then(res => {
            // 如果没有选择就显示全部
            res.forEach((item, i) => {
              if (item.value.substring(0, 1) === val) {
                row.transferReasonList.push(item)
              }
            })
            console.log(row.transferReasonList, row.transferReason)
            let flag = row.transferReasonList.find(item => {
              return item.value === row.transferReason
            })
            console.log(!flag)
            !flag && (this.$set(row, 'transferReason', ''))
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .emp-multimove-basic {
    header {
      height: 60px;
      display: flex;
      align-items: center;
    }
    .surety {
      display: flex;
      flex-wrap: nowrap;
    }
    .after, .before {
      height: 28px;
    }
    .after {
      margin-top: 5px;
    }
    .box {
      position: relative;
      margin-bottom:20px !important;
    }
    .showStart:before{
        content: '*';
        color: #ff4949;
        // margin-right: 4px;
        position:absolute;
        left: -6px;
        top: 5px;
    }
  }
</style>
<style lang="scss">
.emp-multimove-basic .el-table .cell {
  text-align: left;
  text-align: left;
  padding: 10px 5px;

}
.emp-multimove-basic {
  .el-input.is-disabled .el-input__inner {
    border-color: transparent;
    background-color: transparent;
  }
  .el-input {
    margin-right:5px;
  }
  .input-with-select .el-input-group__append {
    padding: 0px;
   }
   .el-input-group__append {
     .el-input {
       width:80px;
       height: 26px;
     }
   }
   .el-input-group__append .el-select, .el-input-group__append .el-button, .el-input-group__prepend .el-select, .el-input-group__prepend .el-button{
     margin:0px;
   }
  // .select {
    .el-input-group__append {
      background-color: #fff
    }
  // }
}
 .popper__arrow {
     left: 100% !important;
   }
</style>

