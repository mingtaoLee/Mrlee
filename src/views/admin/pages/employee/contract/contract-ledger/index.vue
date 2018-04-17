<template>
  <!-- 合同台账 -->
  <section class="pers-dimission">
    <!-- <div class="card form-card"> -->
    <i-layout>      
      <i-form @reset="reset" @search="search" slot="header" v-if="accessMap.empContContentSearch">
        <el-form-item label="姓名">
          <el-input v-model="listParams.employeeName" :maxlength="20"/>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="listParams.employeeCode" :maxlength="20"/>
        </el-form-item>
        <el-form-item label="合同状态">
          <i-select parameter="CONTRACT_STATUS" v-model="listParams.status" />
        </el-form-item>
        <el-form-item label="合同类型">
          <i-select parameter="CONTRACT_TYPE" v-model="listParams.contractType" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="listParams.startDate"
            type="date"
            :editable="false"
            @change="dataChange($event, 'startDate')"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>

         <el-form-item label="至">
          <el-date-picker
            v-model="listParams.endDate"
            type="date"
            :editable="false"
            @change="dataChange($event, 'endDate')"
            :picker-options="pickerOptions3"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用工类型">
          <i-select parameter="EMPLOYEE_TYPE" v-model="listParams.employeeType" />
        </el-form-item>
        <el-form-item label="合同主体文本">
          <el-input v-model="listParams.companyName" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="合同期限类型">
          <i-select parameter="CONTRACT_PERIOD_TYPE" v-model="listParams.contractPeriodType" />
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input v-model="listParams.employeeIdNumber" :maxlength="18"/>
        </el-form-item>
        <el-form-item label="所属组织">
          <i-select-tree :hasGrant="false" filterable :readonly='false' v-model="listParams.orgUnitId" dataKey="org" nodeKey="orgUnitId" :rootId="root" :lazy="true" size="small" />
        </el-form-item>
        <el-form-item label="合同期限" v-if="listParams.contractPeriodType==1">
          <el-input v-model="listParams.contractPeriod"/>
        </el-form-item>
        <el-form-item label="人事范围名称">
          <remote-select 
              v-model="listParams.personnelGroupCode" 
              clearable 
              dataKey="personnelGroup"
              :extraParams="extraParams"
              :props="personnelProps"
              :hasPower="Y"
            >
            </remote-select>
        </el-form-item>
      </i-form>
    <!-- </div> -->
    

      <div slot="section">
        <i-table
          :table="table"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange"
          >
          <template slot="table" slot-scope="tableScope">
            <el-table
            ref="multipleTable"
            v-loading="contractLoading"
           :element-loading-text="$loadingText"
            :data="tableScope.clone"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelection"
            >
              <el-table-column type="selection" width="55" />

              <el-table-column
                prop="employeeCode"
                label="工号"
                fixed="left"
                width="80" >
                <template slot-scope="scope">
                  <el-button type="text" @click="getPerContracts(scope.row)" size="mini">{{scope.row.employeeCode}}</el-button>
                </template>
              </el-table-column>

              <el-table-column
                prop="employeeName"
                label="姓名"
                fixed="left"
                width="100" >
                <template slot-scope="scope">
                  {{scope.row.employeeName}}
                </template>
              </el-table-column>

              <el-table-column
                v-for="(item, idx) in table.columns"
                :key="idx"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :formatter="tableScope.formatter"
                :fixed="item.fixed"
                :align="item.align"
                sortable
                ></el-table-column>
                <i-table-operator :width="200" :table="tableScope"></i-table-operator>
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>

    <section>
         <i-dialog title="合同签订记录" v-model="visible.res" size="large" :close-on-press-escape="closeOnPressEscape">
          <!-- <i-table :table="resTable" @pageSizeChange="handleSizeChangeRes" @pageIndexChange="handleCurrentChangeRes"> -->
          <i-table :table="resTable">
            <template slot="table" slot-scope="resTableScope">
              <el-table
                :data="resTableScope.clone"
                tooltip-effect="dark"
                style="width: 100%"
                v-loading="contractLoading"
               :element-loading-text="$loadingText"
               >
                <!-- @selection-change="handleChangeRes"> -->
                <!-- <el-table-column type="selection" width="55" /> -->
                <el-table-column
                  v-for="(item, idx) in resTable.columns"
                  :label="item.label"
                  :prop="item.prop"
                  :key="idx"
                  :formatter="resTableScope.formatter"
                  :width="item.width"
                  :min-width="item.minWidth"
                  :align="item.align"
                >
                </el-table-column>
              </el-table>
            </template>
          </i-table>
      </i-dialog>
      <i-dialog title="查看合同" v-model="showContentDetail" >
        <editor
         :defaultMsg="defaultMsg" 
         :fill="false" 
         :config="print" 
         editorId="printLedger" 
         :btn="false"></editor>
      </i-dialog>

      <i-dialog title="查看附件" v-model="isShowFilePreview" destroyedWhenClose>
        <file-preview :businessId="currentBusinessId" :businessType="currentBusinessType"></file-preview>
      </i-dialog>

      <i-dialog :title=title v-model="isShowEndContractDetail" destroyedWhenClose>
       <el-form ref="form" v-model="endContractDetail" label-width="180px" size="medium" rules="rules">
        <el-form-item label="姓名" prop="employeeName" >
          <el-input v-model="endContractDetail.employeeName" :disabled="true"  style="width: 300px" />
        </el-form-item>

        <el-form-item label="结束类型" required>
          
          <el-select v-model="endContractDetail.endType" placeholder="请选择" clearable style="width: 300px">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item,idx) in templateList"
              :key="idx">
            </el-option>
        </el-select>
        </el-form-item>

        <el-form-item label="结束日期" required>
          <el-col :span="11">
            <el-date-picker 
            type="date"
            clearable
            :editable="false"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            v-model="endContractDetail.endDate"
            style="width: 300px"
             :picker-options="pickerOptions"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="填写说明" prop="explanation">
          <el-input
          autofocus
          type="textarea"
          maxlength="100"
          style="width: 300px"
          :autosize="{ minRows: 2, maxRows: 8}"
          v-model="endContractDetail.explanation"
          >
          </el-input>
          </el-form-item>
        <el-form-item size="large">
           <el-button type="default" @click="cancle()">取消</el-button>
          <el-button type="primary" @click="title==='解除/终止合同' ? endContract():submitMulti()">确定</el-button>
        </el-form-item>
      </el-form>
      </i-dialog>

    </section>
  </section>
</template>
<script>
  import req, {config} from 'api/employee/contract'
  import FilePreview from 'components/employee/file-preview'
  import Editor from 'components/employee/editor'
  import access from 'mixins/access'
  import moment from 'moment'
  import ISelect from 'components/common/i-select/i-select'
  import RemoteSelect from 'components/compensation/remote-select'

  export default {
    components: {
      Editor,
      FilePreview,
      ISelect,
      RemoteSelect
    },
    mixins: [access],
    data () {
      return {
        visible: {res: false},
        contractLoading: false,
        resTable: {
          columns: [
            { prop: 'employeeCode', label: '工号', width: 100, align: 'center', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', width: 100, align: 'center', fixed: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围编码', width: 140, align: 'center' },
            { prop: 'personnelGroupName', label: '人事范围名称', width: 240 },
            { prop: 'orgUnitName', label: '所属组织', width: 160, align: 'center' },
            { prop: 'orgPathName', label: '组织全称', width: 300 },
            { prop: 'employeeIdNumber', label: '证件号码', width: 200, align: 'center' },
            { prop: 'employeeType', label: '用工类型', width: 120, display: {dict: 'EMPLOYEE_TYPE'}, align: 'center' },
             { prop: 'employeeStatus', label: '员工状态', width: 100, display: {dict: 'EMPLOYEE_STATUS'}, align: 'center' },
            { prop: 'contractNo', label: '合同/协议编号', width: 150, align: 'center' },
            { prop: 'contractType', label: '合同/协议类型', width: 180, display: {dict: 'CONTRACT_TYPE'}, align: 'center' },
            { prop: 'contractSubject', label: '合同主体编码', width: 100 },
            { prop: 'companyName', label: '合同主体文本', width: 300 },
            { prop: 'startDate', label: '生效时间', width: 150, align: 'center', display: {date: ''} },
            { prop: 'endDate', label: '结束时间', width: 150, align: 'center', display: {date: ''} },
            { prop: 'contractPeriod', label: '合同有效期(年)', width: 160, align: 'center' },
            { prop: 'trainingPeriod', label: '试用期(月)', width: 160, align: 'center' },
            { prop: 'signNumber', label: '连续签订次数', width: 150, align: 'center' },
            { prop: 'status', label: '合同状态', width: 150, display: {dict: 'CONTRACT_STATUS'}, align: 'center' },
            { prop: 'isSignContract', label: '是否已签订纸质合同', width: 200, display: {dict: 'WHETHER_TYPE'}, align: 'center' }
          ],
          // showPagebar: true,
          // info: null,
          // total: 0,
          data: null
        },
        templateList: [
          {
            label: '终止',
            value: '2'
          },
          {
            label: '解除',
            value: '3'
          }
        ],
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < this.startDate || time.getTime() > this.endDate
          }
        },
        // rules: {
        //   endType: [{required: true, message: '请选择结束类型', trigger: 'blur'}],
        //   endDate: [{required: true, message: '请选择结束时间', trigger: 'blur'}]
        // },
        endContractDetail: {
          employeeName: '',
          empContractId: [],
          endType: '',
          endDate: '',
          explanation: ''
        },
        title: '',
        endContractIdList: [],
        endEployeeNameList: [],
        startDate: '',
        endDate: '',
        isShowEndContractDetail: false,
        listParams: {
          employeeName: '',
          employeeType: '',
          status: '1',
          contractType: '',
          employeeCode: '',
          orgUnitId: '',
          employeeIdNumber: '',
          companyName: '',
          contractPeriodType: '',
          contractPeriod: '',
          personnelGroupCode: '',
          personnelGroupName: '',
          endDate: '',
          startDate: ''
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let endDateVal = this.listParams.endDate
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal)
            }
          }
        },
        pickerOptions3: {
          disabledDate: (time) => {
            let beginDateVal = this.listParams.startDate
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal)
            }
          }
        },
        table: {
          columns: [
            // { prop: 'employeeCode', label: '工号', width: 100, align: 'center', fixed: 'left' },
            // { prop: 'employeeName', label: '姓名', width: 100, align: 'center', fixed: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围编码', width: 140, align: 'center' },
            { prop: 'personnelGroupName', label: '人事范围名称', width: 240 },
            { prop: 'orgUnitName', label: '所属组织', width: 160, align: 'center' },
            { prop: 'orgPathName', label: '组织全称', width: 300 },
            { prop: 'employeeIdNumber', label: '证件号码', width: 200, align: 'center' },
            { prop: 'employeeType', label: '用工类型', width: 100, display: {dict: 'EMPLOYEE_TYPE'}, align: 'center' },
            { prop: 'employeeStatus', label: '员工状态', width: 100, display: {dict: 'EMPLOYEE_STATUS'}, align: 'center' },
            { prop: 'contractNo', label: '合同/协议编号', width: 150, align: 'center' },
            { prop: 'contractType', label: '合同/协议类型', width: 180, display: {dict: 'CONTRACT_TYPE'}, align: 'center' },
            { prop: 'contractSubject', label: '合同主体编码', width: 120, align: 'center' },
            { prop: 'companyName', label: '合同主体文本', width: 150, align: 'center' },
            { prop: 'startDate', label: '生效时间', width: 150, align: 'center', display: {date: ''} },
            { prop: 'endDate', label: '结束时间', width: 150, align: 'center', display: {date: ''} },
            { prop: 'contractPeriod', label: '合同有效期(年)', width: 160, align: 'center' },
            { prop: 'trainingPeriod', label: '试用期(月)', width: 160, align: 'center' },
            { prop: 'signNumber', label: '连续签订次数', width: 150, align: 'center' },
            { prop: 'status', label: '合同状态', width: 150, display: {dict: 'CONTRACT_STATUS'}, align: 'center' },
            { prop: 'isSignContract', label: '是否已签订纸质合同', width: 200, display: {dict: 'WHETHER_TYPE'}, align: 'center' }
          ],
          showPagebar: true,
          data: null,
          search: null,
          info: null,
          total: 0,
          setting: {
            export: {
              config: {
                fileName: '合同台账',
                sync: {
                  page: true,
                  select: true,
                  all: false
                }
              },
              req: config.getContracts,
              key: 'empContContentExport'
            },
              // 导入按钮
            import: {
              key: 'empContractImport',
              business: 'emp-contract'
            },
            toolbar: [
              {
                text: '批量终止/解除',
                type: 'primary',
                key: 'empContContentTermination',
                func: () => this.postTerminationMutil()
              },
              {
                text: '确定已签纸质合同',
                type: 'primary',
                key: 'empIsSignContract',
                func: () => this.setSignContracts()
              }
            ],
            operator: [{
              text: '查看',
              key: 'empContContentDetail',
              func: this.showContract
            }, {
              text: '查看附件',
              key: 'empContContentFiles',
              func: this.showFilePreview
            }, {
              text: '终止/解除',
              key: 'empContContentTermination',
              func: (row) => this.postTermination(row),
              show (row) {
                if (row.status !== '1') return { empty: true }
              }
            }, {
              text: '续签',
              key: 'empContContentRenew',
              func: (row) => this.toContract('empRenewContractProcess', 'empRenewContractProcess', row.empEmployeeId),
              show (row) {
                if (row.status !== '1') return { empty: true }
              }
            }]
          }
        },
        print: {
          initialFrameWidth: null,
          initialFrameHeight: 500,
          toolbars: [['print']]
        },
        defaultMsg: {
          templateContent: ''
        },
        contentDetail: '',
        showContentDetail: false,
        isShowFilePreview: false,
        currentBusinessId: '',
        currentBusinessType: '',
        extraParams: {
          hasPower: 'Y'
        },
        personnelProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        }
      }
    },

    watch: {
      'isShowEndContractDetail': {
        handler: function (newVal, oldVal) {
          // console.log(newVal, '和', oldVal)
          if (!newVal) {
            Object.keys(this.endContractDetail).map(key => {
              Array.isArray(this.endContractDetail[key]) ? this.endContractDetail[key] = [] : this.endContractDetail[key] = ''
            })
          }
        }
      }
    },

    mounted () {
      this.table.setting.export.elTable = this.$refs.multipleTable  // 挂载
      this.search()
    },

    methods: {
      // 多选
      handleSelection (val) {
        this.endContractIdList = []
        this.endEployeeNameList = []
        val.map(item => {
          this.endContractIdList.push(item.empContractId)
          this.endEployeeNameList.push(item.employeeName)
        })
      },
        // 打开批量操作的对话框
      postTerminationMutil () {
        this.title = '批量解除/终止合同'
        this.startDate = 0
        this.endDate = 253402214400000
        this.endContractDetail.empContractId = this.endContractIdList
        this.endContractDetail.employeeName = this.endEployeeNameList.toString()
        if (!this.endContractIdList.length) {
          this.$message.error('请选择数据再进行操作!')
        } else {
          this.isShowEndContractDetail = true
        }
      },
      // 批量终止/解除合同
      submitMulti () {
        if (!!this.endContractDetail.endDate && !!this.endContractDetail.endType) {
          req('postTermination', this.endContractDetail)
        .then(data => {
          this.$message.success('批量解除/终止成功!')
          this.search()
          Object.keys(this.endContractDetail).map(key => {
            Array.isArray(this.endContractDetail[key]) ? this.endContractDetail[key] = [] : this.endContractDetail[key] = ''
          })
          this.isShowEndContractDetail = false
        })
        .catch(err => {
          this.$message.error('批量解除/终止失败,请重新操作!')
          console.log(err)
        })
        } else {
          this.$message.warning('信息填写不完整,请重新填写!')
        }
      },
      // 批量设置是否已签订纸质合同
      setSignContracts () {
        if (!this.endContractIdList.length) {
          this.$message.warning('请选择需要操作的数据!')
          return
        }
        req('setSignContracts', this.endContractIdList).then(res => {
          this.$message.success('操作成功！')
          this.search()
        })
      },
       // 获取个人合同签订记录
      getPerContracts (item) {
        req('getPerContracts', {employeeCode: item.employeeCode})
        .then(data => {
          this.resTable.data = data
          this.visible.res = true
        })
      .catch(err => {
        console.log(err)
        this.$message({type: 'error', message: '数据请求失败'})
      })
      },
      handleSizeChange (options) {
        options['status'] = this.listParams.status
        this.getContractList(options)
      },

      handleCurrentChange (options) {
        options['status'] = this.listParams.status
        this.getContractList(options)
      },

      reset () {
        Object.keys(this.listParams).map(item => {
          (item !== 'pageIndex' && item !== 'pageSize') && (this.listParams[item] = '')
        })
      },

      search () {
        this.table.search = { ...this.listParams }
      },

      getContractList (listParams) {
        this.contractLoading = true
        req('getContracts', listParams, false)
        .then(data => {
          Object.keys(data).map(key => (this.table[key] = data[key]))
          this.contractLoading = false
          // console.log(this.table.data)
        })
      },

      // 跳转到续签流程
      toContract (type, urlStr, id) {
        this.$store.commit('SET_FLOW_ACTION', { processType: type, employeeId: id })
        this.$store.commit('FLOW_WINDOW_OPEN', '/flow.html#/flow/' + urlStr)
      },

      // 打开对话框
      postTermination (row) {
        this.title = '解除/终止合同'
        this.startDate = row.startDate
        this.endDate = row.endDate
        this.endContractDetail.empContractId.push(row.empContractId)
        this.endContractDetail.employeeName = row.employeeName
        this.isShowEndContractDetail = true
      },
      // 关闭对话框
      cancle () {
        this.isShowEndContractDetail = false
      },
      // 解除/终止合同
      endContract () {
        // console.log(222, this.endContractDetail)
        if (this.endContractDetail.endDate && this.endContractDetail.endType && this.endContractDetail.empContractId.length === 1) {
          // console.log(111, this.endContractDetail)
          req('postTermination', this.endContractDetail)
        .then(data => {
          // console.log('data', data)
          this.$message.success('合同解除/终止成功!')
          this.search()
          Object.keys(this.endContractDetail).map(key => {
            Array.isArray(this.endContractDetail[key]) ? this.endContractDetail[key] = [] : this.endContractDetail[key] = ''
          })
          this.isShowEndContractDetail = false
        })
        .catch(err => {
          this.$message.error('合同解除/终止失败,请重新操作!')
          console.log(err)
        })
        } else {
          this.$message.warning('信息填写不完整,请重新填写!')
        }
      },

      // 预览合同
      showContract (item) {
        let contractId = item.empContractId
        this.defaultMsg.templateContent = ''
        req('getContentDetail', {contractId}).then(data => {
          this.defaultMsg.templateContent = data
          this.showContentDetail = true
        }).catch(err => console.log(err))
        // this.contentDetail = '<p>aa</p><p>bb</p>'
        // this.showContentDetail = true
      },
       // 日期选择器赋值
      dataChange ($event, param) {
        $event ? this.listParams[param] = moment($event).format('YYYY-MM-DD') : this.listParams[param] = ''
      },
      // 预览附件
      showFilePreview (row) {
        // console.log(row)
        this.isShowFilePreview = true
        this.currentBusinessId = row.empContractId
        this.currentBusinessType = row.businessType || null
      }
    }
  }

</script>

<style lang="scss" scoped>
  .endContractDetailForm{
    display: flex;
  }
  .footer{
    float: right;
  }
</style>
