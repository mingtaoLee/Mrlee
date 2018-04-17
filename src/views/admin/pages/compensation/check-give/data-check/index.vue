<template>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="payDataCheckGet">
    <template slot="header">
      <i-form @reset="reset" @search="search">
        <el-form-item label="薪资月份" >
          <el-date-picker
            v-model="searchParms.payMonth"
            type="month"
            placeholder="请选择"
            :editable="false"
            >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="省区:">
          <i-select-tree
            :multiple="false"
            :lazy="false"
            dataKey="areaUnit"
            nodeKey="areaId"
            :props="setProps"
            v-model="searchParms.areaId"
            size="small"
          ></i-select-tree>
        </el-form-item>

        <el-form-item label="组织名称">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="searchParms.unitId"
            :lazy="true"
            size="small"
          >
          </i-select-tree>
        </el-form-item>

        <el-form-item label="薪资组">
           <remote-select
            v-model="searchParms.groupId"
            :props="groupProps"
            dataKey="salaryGroup"
            :multiple="false"
            :collapseTags="false"
            :displayKeys="displayKeys"
            filterable
           ></remote-select>
        </el-form-item>

        <el-form-item label="人事范围">
            <remote-select
              v-model="searchParms.empPersonnelGroupCode"
              :props="personalAreaProps"
              dataKey="personnelGroup"
              filterable
            ></remote-select>
        </el-form-item>

        <!-- <el-form-item label='人事范围代码'>
          <el-input v-model="searchParms.empPersonnelGroupCode" :maxlength="18" placeholder="请输入"></el-input>
        </el-form-item> -->

        <el-form-item label="工号">
          <el-input v-model="searchParms.employeeCode" :maxlength="18" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="searchParms.fullName" :maxlength="18" placeholder="请输入"></el-input>
        </el-form-item>

        <!-- <el-form-item label="是否异动">
          <el-select v-model="searchParms.isTransfer" placeholder="是">
            <el-option label="是" value="Y"></el-option>
            <el-option label="否" value="N"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="">
            <el-checkbox
              label="只显示异常"
              v-model="searchParms.flag"
              name="type"
              @change="selectUnusual"
              >
            </el-checkbox>
         </el-form-item>
       </i-form>
    </template>
    <template slot="section">
      <div class="tableExplain">
        <span class="h4">页面说明：</span>
        <span><i class="el-icon-circle-check" title="该信息正常" ></i>该信息正常</span>
        <span><i class="el-icon-warning" title="该信息已失效"></i>该信息已失效</span>   
        <span><i class="el-icon-circle-close" title="该信息缺失或不一致"></i>该信息缺失或不一致</span>
      </div>
      <i-table 
        :table="table" 
        v-loading="pageLoading"
        :element-loading-text="$loadingText"
        @pageSizeChange="handleSizeChange" 
        @pageIndexChange="handleCurrentChange" 
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            tooltip-effect="dark"
            style="width: 100%"
            >
              <el-table-column type="selection"/>
              <el-table-column
                 v-for="(item, idx) in table.columns"
                 :key="idx"
                 :prop="item.prop"
                 :label="item.label"
                 :min-width="item.width"
                 :formatter="tableScope.formatter"
                 v-if="item.label"
                 :align="item.align"
                 :fixed="item.fixed"
                 sortable
                >
                </el-table-column>
                <el-table-column
                  label="是否有异动"
                  prop="isTransfer"
                  min-width="120"
                  align="center"
                  v-else-if="item.transfer"
                  sortable
                  >
                  <template slot-scope="scope">
                    <span v-if="scope.row.isTransfer==='Y'">是</span>
                    <span v-else-if="scope.row.isTransfer==='N'">否</span>
                  </template>
                </el-table-column>

                <el-table-column
                  label="薪资组和人事范围是否对应"
                  prop="isUnitId_GroupId"
                  min-width="100"
                  align="center"
                  :formatter="tableScope.formatter"
                  >
                  <template slot-scope="scope" >
                    <i class="el-icon-circle-close" title="该信息缺失或不一致" v-if="scope.row.isUnitId_GroupId==='01'"></i>
                    <i class="el-icon-circle-check" title="该信息正常" v-else-if="scope.row.isUnitId_GroupId==='02'"></i>
                    <i class="el-icon-warning" title="该信息已失效" v-else-if="scope.row.isUnitId_GroupId==='03'"></i>
                  </template>
                </el-table-column>

                <el-table-column
                  label="银行卡类型是否正确"
                  prop="isbankNumberType"
                  min-width="120"
                  align="center"
                  :formatter="tableScope.formatter"
                  >
                  <template slot-scope="scope" >
                    <i class="el-icon-circle-close" title="该信息缺失或不一致" v-if="scope.row.isbankNumberType==='01'"></i>
                    <i class="el-icon-circle-check" title="该信息正常" v-else-if="scope.row.isbankNumberType==='02'"></i>
                    <i class="el-icon-warning" title="该信息已失效" v-else-if="scope.row.isbankNumberType==='03'"></i>
                  </template>
                </el-table-column>

                <el-table-column
                  label="身份证"
                  prop="isIdNumber"
                  min-width="70"
                  align="center"
                  :formatter="tableScope.formatter"
                 >
                 <template slot-scope="scope" >
                   <i class="el-icon-circle-close" title="该信息缺失或不一致" v-if="scope.row.isIdNumber==='01'"></i>
                   <i class="el-icon-circle-check" title="该信息正常" v-else-if="scope.row.isIdNumber==='02'"></i>
                   <i class="el-icon-warning" title="该信息已失效" v-else-if="scope.row.isIdNumber==='03'"></i>
                 </template>
                </el-table-column>

                <el-table-column
                 label="发薪主体"
                 prop="isPayCompany"
                 width="50"
                 align="center"
                 :formatter="tableScope.formatter"
                >
                  <template slot-scope="scope" >
                    <i class="el-icon-circle-close" title="该信息缺失或不一致" v-if="scope.row.isPayCompany==='01'"></i>
                    <i class="el-icon-circle-check" title="该信息正常" v-else-if="scope.row.isPayCompany==='02'"></i>
                    <i class="el-icon-warning" title="该信息已失效" v-else-if="scope.row.isPayCompany==='03'"></i>
                  </template>
               </el-table-column>

               <el-table-column
                  label="成本中心"
                  prop="isCostCenter"
                  width="50"
                  align="center"
                  :formatter="tableScope.formatter"
                >
                  <template slot-scope="scope" >
                    <i class="el-icon-circle-close" title="该信息缺失或不一致" v-if="scope.row.isCostCenter==='01'"></i>
                    <i class="el-icon-circle-check" title="该信息正常" v-else-if="scope.row.isCostCenter==='02'"></i>
                    <i class="el-icon-warning" title="该信息已失效" v-else-if="scope.row.isCostCenter==='03'"></i>
                  </template>
               </el-table-column>

               <el-table-column
                 label="银行卡号"
                 prop="isbankNumber"
                 width="50"
                 align="center"
                 :formatter="tableScope.formatter"
                >
                <template slot-scope="scope" >
                  <i class="el-icon-circle-close" title="该信息缺失或不一致" v-if="scope.row.isbankNumber==='01'"></i>
                  <i class="el-icon-circle-check" title="该信息正常" v-else-if="scope.row.isbankNumber==='02'"></i>
                  <i class="el-icon-warning" title="该信息已失效" v-else-if="scope.row.isbankNumber==='03'"></i>
                </template>
              </el-table-column>

              <el-table-column
                label="员工工作制"
                prop="isuneffectiveDate"
                width="50"
                align="center"
                :formatter="tableScope.formatter"
              >
               <template slot-scope="scope" >
                  <i class="el-icon-circle-close" title="该信息缺失或不一致" v-if="scope.row.isuneffectiveDate==='01'"></i>
                  <i class="el-icon-circle-check" title="该信息正常" v-else-if="scope.row.isuneffectiveDate==='02'"></i>
                  <i class="el-icon-warning" title="该信息已失效" v-else-if="scope.row.isuneffectiveDate==='03'"></i>
                </template>
              </el-table-column>

              <el-table-column
                label="税收信息"
                prop="iitTemplateId"
                width="50"
                align="center"
                :formatter="tableScope.formatter"
              >
               <template slot-scope="scope" >
                  <i class="el-icon-circle-close" title="该信息缺失或不一致" v-if="scope.row.iitTemplateId==='01'"></i>
                  <i class="el-icon-circle-check" title="该信息正常" v-else-if="scope.row.iitTemplateId==='02'"></i>
                  <i class="el-icon-warning" title="该信息已失效" v-else-if="scope.row.iitTemplateId==='03'"></i>
                </template>
             </el-table-column>

             <el-table-column
                label="工资标准"
                prop="status"
                width="50"
                align="center"
                :formatter="tableScope.formatter"
               >
               <template slot-scope="scope" >
                  <i class="el-icon-circle-close" title="该信息缺失或不一致" v-if="scope.row.status==='01'"></i>
                  <i class="el-icon-circle-check" title="该信息正常" v-else-if="scope.row.status==='02'"></i>
                  <i class="el-icon-warning" title="该信息已失效" v-else-if="scope.row.status==='03'"></i>
                </template>
              </el-table-column>

              <el-table-column
                label="参保管理"
                prop="insuranceStatus"
                width="50"
                align="center"
                :formatter="tableScope.formatter"
               >
               <template slot-scope="scope" >
                  <i class="el-icon-circle-close" title="该信息缺失或不一致" v-if="scope.row.insuranceStatus==='01'"></i>
                  <i class="el-icon-circle-check" title="该信息正常" v-else-if="scope.row.insuranceStatus==='02'"></i>
                  <i class="el-icon-warning" title="该信息已失效" v-else-if="scope.row.insuranceStatus==='03'"></i>
                </template>
              </el-table-column>

              </el-table>
            </template>
         </i-table>
        </template>
      </i-layout>
</template>

<script>
import req, { config } from 'api/compensation/check-give/data-check'
import initMonthMixin from '../mixins/initMonthMixin'
import searchMixin from '../mixins/searchMixin'
import { getDict } from 'utils/index'
import RemoteSelect from 'components/compensation/remote-select/index'

export default {
  components: {
    RemoteSelect
  },
  mixins: [initMonthMixin, searchMixin],
  data () {
    return {
      loading: true,
      isShowDialog: false,
      reqParams: null,
      searchParms: {
        unitId: '',
        areaId: '',
        groupId: '',
        employeeCode: '',
        fullName: '',
        payMonth: '',
        flag: '',
        empPersonnelGroupCode: '',
        empPersonnelGroupName: ''
        // isTransfer: 'Y'
      },
      // 工资组选择器配置
      groupProps: {
        value: 'groupId',
        label: 'groupName'
      },
      // 人事范围下拉配置
      personalAreaProps: {
        value: 'personnelGroupCode',
        label: 'personnelGroupName'
      },
      displayKeys: ['groupCode', 'groupName'],
      // 省区树配置
      setProps: {
        children: 'children',
        label: 'areaName'
      },
      // 表格
      table: {
        columns: [
          { prop: 'employeeCode', label: '工号', width: 100, align: 'center', fixed: true },
          { prop: 'fullName', label: '姓名', width: 100, align: 'left', fixed: true },
          { prop: 'unitName', label: '所属组织', width: 120, align: 'left' },
          { prop: 'positionName', label: '职位', width: 100, align: 'left' },
          {prop: 'groupCode', label: '薪资组代码', width: 120, align: 'center'},
          { prop: 'groupName', label: '薪资组', width: 120, align: 'left' },
          { prop: 'empPersonnelGroupCode', label: '人事范围代码', width: 120, align: 'center' },
          { prop: 'empPersonnelGroupName', label: '人事范围', width: 120, align: 'left' },
          { prop: 'isTransfer', transfer: true },
          { prop: 'isUnitId_GroupId', display: {dict: 'AUDITING_STATE'} },
          { prop: 'isbankNumberType', display: {dict: 'AUDITING_STATE'} },
          { prop: 'isIdNumber', display: {dict: 'AUDITING_STATE'} },
          { prop: 'isPayCompany', display: {dict: 'AUDITING_STATE'} },
          { prop: 'isCostCenter', display: {dict: 'AUDITING_STATE'} },
          { prop: 'isbankNumber', display: {dict: 'AUDITING_STATE'} },
          { prop: 'isuneffectiveDate', display: {dict: 'AUDITING_STATE'} },
          { prop: 'iitTemplateId', display: {dict: 'AUDITING_STATE'} },
          { prop: 'status', display: {dict: 'AUDITING_STATE'} },
          { prop: 'insuranceStatus', display: {dict: 'AUDITING_STATE'} }
        ],
        setting: {
          // 导出
          export: {
            text: '导出',
            config: {
              fileName: '异常数据表',
              sync: {
                all: false,
                page: true,
                select: true
              }
            },
            req: config.getDataCheck,
            key: 'payDataCheckExport'
            // param: { flag: true }
          }
        },
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: (done) => {
              done()
            }
          },
          {
            text: '确定'
          }
        ],
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      }
    }
  },
  created () {
    this.getThisMonth()
    this.searchParms.payMonth = this.thisMonth
    getDict('AUDITING_STATE').then(data => {
      console.log(123, data)
    })
  },
  mounted () {
    this.table.search = {payMonth: this.searchParms.payMonth}
  },
  methods: {
        // ---------------------------------数据稽查列表----------------------------------------
    // 获取数据稽查列表
    fetch (options = {}) {
      req('getDataCheck', options)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(key => {
          this.table[key] = res[key]
        })
        this.pageLoading = false
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-icon-circle-close{
    color:#F56C6C;
  }
  .el-icon-circle-check{
    color:#67C23A;
  }
  .el-icon-warning{
    color:#E6A23C;
  }
  .tableExplain{
    // display: inline-block;
    // position: relative;
    // right: -64%;
    // bottom: -35px;
      float: right;
      padding-top: 15px;
      margin-bottom: -33px;
    span{
      margin: 5px
    }
    i{
      margin: 2px
    }
    .h4{
      font-weight: 700
    }
  }
</style>


