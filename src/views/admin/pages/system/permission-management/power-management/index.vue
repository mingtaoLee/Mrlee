<template>
  <div class="power-management">
    <h1 class="base">
      <i class="el-icon-back goBackIcon" @click="goBack"></i>
      <span> {{userName}} ({{loginId}})</span>
    </h1>
    <i-layout>
      <section slot="section" >
        <el-tabs v-model="activeName" @tab-click="getPower">
          <!-- 角色 -->
          <el-tab-pane label="用户角色" name="getUserRole">
            <i-table
              :table="roleListTable"
              @pageSizeChange="handleSizeChange($event, dataGetName.roleList, AllTableName.roleListTable)"
              @pageIndexChange="handleCurrentChange($event, dataGetName.roleList, AllTableName.roleListTable)">

              <template slot="table" slot-scope="tableScope">
                <el-table
                  :data="tableScope.data"
                  style="width: 100%"
                  @selection-change="handlerSelectionChange"
                  v-loading="loading"
                  :element-loading-text="$loadingText">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    v-for="(role, idx) of tableScope.columns"
                    :key="idx"
                    :prop="role.prop"
                    :label="role.label"
                    align="center"
                    :min-width="role.minWidth">
                  </el-table-column>
                  <i-table-operator :table="tableScope" width="150"></i-table-operator>
                </el-table>
              </template>
            </i-table>
          </el-tab-pane>
          <!-- 组织 -->
          <el-tab-pane label="组织权限" name="getUnit">
            <div class="unit">
              <el-radio v-model="unit" border @change="selectionOrgPermission(1)" v-show="inOrgUnitShow" label="1">所在组织权限</el-radio>
              <el-radio v-model="unit" border @change="selectionOrgPermission(2)" label="2">全部组织权限</el-radio>
              <el-radio v-model="unit" border @change="selectionOrgPermission(3)" label="3">自定义选择</el-radio>
            </div>
            <!-- <h2 v-if="unit === '1'">所在组织：{{unitTheUserBelongTo}}</h2> -->
            <el-tag v-if="unit === '1' && inOrgUnitShow" class="unit-user-belong">所在组织：{{unitTheUserBelongTo}}</el-tag>
            <i-table
              v-if="unit === '3'"
              :table="unitListTable"
              @pageSizeChange="handleSizeChange($event, dataGetName.unitLIst, AllTableName.unitListTable)"
              @pageIndexChange="handleCurrentChange($event, dataGetName.unitLIst, AllTableName.unitListTable)">

              <template slot="table" slot-scope="tableScope">
                <el-table
                  :data="tableScope.data"
                  @selection-change="handlerSelectionChange"
                  v-loading="loading"
                  :element-loading-text="$loadingText"
                  style="width: 100%">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    v-for="(role, idx) of tableScope.columns"
                    :key="idx"
                    :prop="role.prop"
                    :label="role.label"
                    align="center"
                    :min-width="role.minWidth">
                  </el-table-column>
                  <i-table-operator :table="tableScope" width="150"></i-table-operator>
                </el-table>
              </template>
            </i-table>
          </el-tab-pane>
          <!-- 人事 -->
          <el-tab-pane label="人事范围权限" name="getPersonnelGroup">
            <div>
              <el-radio-group v-model="personnel" @change="handleChange($event, 'personnel', 'personnelHasAll')">
                <el-radio border :label="false">全选人事范围</el-radio>
                <el-radio border :label="true">自定义选择</el-radio>
              </el-radio-group>
            </div>
            <i-form
              v-if="activeName === 'getPersonnelGroup' && personnel"
              @reset="reset('personnelForm', 'personnelListTable')"
              @search="search('personnelForm', 'personnelListTable')">

              <el-form-item label="人事范围名称">
                <el-input  v-model="personnelForm.personnelGroupName" maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="人事范围编号">
                  <el-input  v-model="personnelForm.personnelGroupCode" maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="所属公司名称">
                  <el-input  v-model="personnelForm.companyName" maxlength="100"></el-input>
              </el-form-item>
            </i-form>
            <i-table
              v-if="personnel"
              :table="personnelListTable"
              @pageSizeChange="handleSizeChange($event, dataGetName.personnelList, AllTableName.personnelListTable)"
              @pageIndexChange="handleCurrentChange($event, dataGetName.personnelList, AllTableName.personnelListTable)">
              
              <template slot="table" slot-scope="tableScope">
                <el-table
                  :data="tableScope.data"
                  style="width: 100%"
                  @selection-change="handlerSelectionChange"
                  v-loading="loading"
                  :element-loading-text="$loadingText">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    v-for="(role, idx) of tableScope.columns"
                    :key="idx"
                    :prop="role.prop"
                    :label="role.label"
                    align="center"
                    :min-width="role.minWidth"
                    :formatter="tableScope.formatter">
                  </el-table-column>
                  <i-table-operator :table="tableScope" width="150"></i-table-operator>
                </el-table>
              </template>
            </i-table>
          </el-tab-pane>
          <!-- 薪资 -->
          <el-tab-pane label="薪资组权限" name="getPaygroup">
            <div>
              <el-radio-group v-model="pay" @change="handleChange($event, 'pay', 'payGroupHasAll')">
                <el-radio border :label="false">全选薪资组</el-radio>
                <el-radio border :label="true">自定义选择</el-radio>
              </el-radio-group>
            </div>
            <i-form 
              v-if="activeName === 'getPaygroup' && pay"
              @reset="reset('payForm', 'payListTable')"
              @search="search('payForm', 'payListTable')">

              <el-form-item label="薪资组名称">
                <el-input  v-model="payForm.groupName" maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="薪资组代码">
                  <el-input  v-model="payForm.groupCode" maxlength="100"></el-input>
              </el-form-item>
              <!-- <el-form-item label="省/区/县范围">
                  <el-input  v-model="payForm.areaId"></el-input>
              </el-form-item> -->
            </i-form>
            <i-table
              v-if="pay"
              :table="payListTable"
              @pageSizeChange="handleSizeChange($event, dataGetName.payList, AllTableName.payListTable)"
              @pageIndexChange="handleCurrentChange($event, dataGetName.payList, AllTableName.payListTable)">

              <template slot="table" slot-scope="tableScope">
                <el-table
                  :data="tableScope.data"
                  @selection-change="handlerSelectionChange"
                  v-loading="loading"
                  :element-loading-text="$loadingText"
                  style="width: 100%">>
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    v-for="(role, idx) of tableScope.columns"
                    :key="idx"
                    :prop="role.prop"
                    :label="role.label"
                    align="center"
                    :min-width="role.minWidth"
                    :formatter="tableScope.formatter"
                  ></el-table-column>
                  <i-table-operator :table="tableScope" width="150"></i-table-operator>
                </el-table>
              </template>
            </i-table>
          </el-tab-pane>
          <!-- 户头 -->
          <el-tab-pane label="户头" name="getAccount">
            <div>
              <el-radio-group v-model="account" @change="handleChange($event, 'account', 'accountHasAll')">
                <el-radio border :label="false">全选户头</el-radio>
                <el-radio border :label="true">自定义选择</el-radio>
              </el-radio-group>
            </div>
            <i-form
              v-if="activeName === 'getAccount' && account"
              @reset="reset('accountForm', 'accountListTable')"
              @search="search('accountForm', 'accountListTable')"
              labelWidth="standard">

              <el-form-item label="户头代码">
                <el-input v-model="accountForm.accountCode" maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="户头名称">
                  <el-input v-model="accountForm.accountName" maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="户头类型">
                  <!-- <el-input v-model="accountForm.accountType"></el-input> -->
                  <i-select v-model="accountForm.accountType" parameter="ACCOUNT_TYPE" placeholder="请选择户头类型"></i-select>
              </el-form-item>

            </i-form>
            <i-table
              v-if="account"
              :table="accountListTable"
              @pageSizeChange="handleSizeChange($event, dataGetName.accountList, AllTableName.accountListTable)"
              @pageIndexChange="handleCurrentChange($event, dataGetName.accountList, AllTableName.accountListTable)">

              <template slot="table" slot-scope="tableScope">
                <el-table
                  :data="tableScope.data"
                  @selection-change="handlerSelectionChange"
                  v-loading="loading"
                  :element-loading-text="$loadingText"
                  style="width: 100%">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    v-for="(role, idx) of tableScope.columns"
                    :key="idx"
                    :prop="role.prop"
                    :label="role.label"
                    align="center"
                    :formatter="tableScope.formatter"
                    :min-width="role.minWidth">
                  </el-table-column>
                  <i-table-operator :table="tableScope" width="150"></i-table-operator>
                </el-table>
              </template>
            </i-table>
          </el-tab-pane>
        </el-tabs>
        <!-- 授权公共弹框 -->
        <section>
          <i-dialog
            v-model="weatherShowDialog"
            :title="dialogTItle"
            size="large"
            :toolbar="commonToolbar"
            @close="handlerDialogClose">
            <i-form
              v-if="dialogIsShow"
              ref="commonFrom"
              @reset="reset(dialogActiveFormName, dialogActiveTableName)"
              @search="search(dialogActiveFormName, dialogActiveTableName)"
              @submit.native.prevent>

              <el-form-item v-for="(item, idx) in dialogActiveFormKeys" :key="item" :label="dialogActiveFormLabel[idx] + ':'">
                <el-input :placeholder="dialogActiveFormPlaceHolder[idx]" v-model="dialogActiveForm[dialogActiveFormKeys[idx]]" maxlength="100"></el-input>
              </el-form-item>
            </i-form>
            <i-table
              v-if="dialogIsShow"
              :table="dialogActiveTableData"
              @pageSizeChange="dialogHandleSizeChange($event, dialogActiveReq, dialogActiveTableName)"
              @pageIndexChange="dialogHhandleCurrentChange($event, dialogActiveReq, dialogActiveTableName)">

              <template slot="table" slot-scope="tableScope">
                <el-table
                  ref="dialogTable"
                  :data="tableScope.data"
                  style="width: 100%"
                  @select="clickSelect"
                  @select-all="selectAll"
                  v-loading="dialogLoading"
                  :element-loading-text="$loadingText">

                  <el-table-column type="selection"></el-table-column>
                  <el-table-column
                    v-for="(item, idx) of tableScope.columns"
                    :key="idx"
                    :prop="item.prop"
                    align="center"
                    :label="item.label">
                  </el-table-column>
                </el-table>
              </template>
            </i-table>
          </i-dialog>
        </section>
        <!-- 组织授权弹框 -->
        <section>
          <i-dialog
            @close="handlerDialogCloseUnit"
            v-model="orgShowDialog"
            title="选择组织"
            size="small"
            :toolbar="orgToolbar">
            <org-template v-if="orgShowDialog" ref="orgTemplate" :orgUnit="orgUnit"></org-template>
          </i-dialog>
        </section>
      </section>
    </i-layout>
  </div>
</template>
<script>
  import req from 'api/system/user-power-management'
  import OrgTemplate from './orgTemplate.vue'
  import access from 'mixins/access'
  export default {
    mixins: [access],

    components: {
      OrgTemplate
    },
    data () {
      return {
        loading: true,
        dialogLoading: false,
        userId: '',
        userName: '',
        loginId: '',
        activeName: '',
        weatherShowDialog: false,
        orgShowDialog: false,
        account: true,
        pay: true,
        personnel: true,
        unit: '2',
        lastUnit: '2',
        inOrgUnitShow: false,
        customUnitFlag: false,
        orgUnitRequestFlag: false,
        roleSelect: [],
        // 用户所在组织
        unitTheUserBelongTo: '',
        orgUnit: {
          orgs: ''
        },
        orgUnitSelection: [],
        // tabs标签页的唯一标识符name就是当前表格数据的请求名
        avtiveTab: {
          getUserRole: 'roleListTable',
          getUnit: 'unitListTable',
          getPersonnelGroup: 'personnelListTable',
          getPaygroup: 'payListTable',
          getAccount: 'accountListTable'
        },
        // 接口名
        dataGetName: {
          // 角色
          roleList: 'getUserRole',
          DialogRoleList: 'getUnAuthorized',
          // 组织
          unitLIst: 'getUnit',
          // 人事
          personnelList: 'getPersonnelGroup',
          // 薪资
          payList: 'getPaygroup',
          // 户头
          accountList: 'getAccount'
        },
        // dialogTableName
        // 记录表格名和表格title
        AllTableName: {
          // 角色
          roleListTable: 'roleListTable',
          dialogRoleListTable: {
            tableName: 'DialogRoleListTable',
            tabTitle: '添加角色'
          },
          // 组织
          unitListTable: 'unitListTable',
          dialogUnitListTable: {
            tableName: 'dialogUnitListTable',
            tabTitle: '添加组织权限组'
          },
          // 人事
          personnelListTable: 'personnelListTable',
          dialogPersonnelListTable: {
            tableName: 'dialogPersonnelListTable',
            tabTitle: '添加人事范围组'
          },
          // 薪资
          payListTable: 'payListTable',
          dialogPayListTable: {
            tableName: 'dialogPayListTable',
            tabTitle: '添加薪资范围组'
          },
          // 户头
          accountListTable: 'accountListTable',
          dialogAccountListTable: {
            tableName: 'dialogAccountListTable',
            tabTitle: '添加户头'
          }
        },
        // 各个模块主页面搜索表单配置
        payForm: {
          groupCode: '',
          groupName: ''
          // areaId: ''
        },
        accountForm: {
          accountType: '',
          accountName: '',
          accountCode: ''
        },
        personnelForm: {
          personnelGroupName: '',
          personnelGroupCode: '',
          companyName: ''
        },
        // 当前弹窗中激活form表单
        dialogActiveForm: {},
        dialogActiveFormName: '',
        dialogActiveFormKeys: [],
        dialogActiveFormPlaceHolder: [],
        dialogActiveFormLabel: [],
        // dialog中form表单配置
        dialogRoleForm: {
          roleName: ''
        },
        dialogPersonnelForm: {
          personnelGroupName: '',
          personnelGroupCode: '',
          companyName: ''
        },
        dialogPayForm: {
          groupName: '',
          groupCode: ''
        },
        dialogAccountForm: {
          accountName: '',
          companyName: '',
          accountCode: ''
        },
        // 弹窗表单文字配置
        dialogFormText: {
          dialogRoleForm: {
            labelText: ['角色名称'],
            placeHolderText: ['请输入角色名称']
          },
          dialogPersonnelForm: {
            labelText: ['人事范围名称', '人事范围编号', '所属公司名称'],
            placeHolderText: ['请输入人事范围名称', '请输入人事范围编号', '请输入所属公司名称']
          },
          dialogPayForm: {
            labelText: ['薪资组名称', '薪资组代码'],
            placeHolderText: ['请输入薪资组名称', '请输入薪资组代码']
          },
          dialogAccountForm: {
            labelText: ['户头名称', '公司名称', '户头代码'],
            placeHolderText: ['请输入户头名称', '请输入公司名称', '请输入户头代码']
          }
        },
        // 当前主页表格请求名
        activeTableReq: '',
        // 记录当前主页面表格名
        activeTableName: '',
        // 各个模块主页面表格配置
        roleListTable: {
          columns: [
            { prop: 'roleName', label: '角色', minWidth: 200 },
            { prop: 'description', label: '描述', minWidth: 400 }
          ],
          data: null,
          showPagebar: true,
          info: null,
          total: 0,
          search: null,
          setting: {
            toolbar: [{
              text: '添加角色',
              // key: 'systemRolesUpdateUserRolePut',
              key: 'sysDataGrantPost',
              type: 'primary',
              func: () => {
                this.showDialog('添加角色', 'getUnAuthorized', 'DialogRoleListTable', 'updateUserRole', 'userRoleList', 'dialogRoleForm', 'DialogRoleListTable', 'roleId')
              }
            }, {
              text: '批量删除',
              key: 'sysRolesRoleDelete',
              type: 'primary',
              func: () => {
                this.doBatchDelete('roleIds', 'deleteRole', 'getUserRole', 'roleListTable', 'roleId')
              }
            }],
            operator: [{
              key: 'sysRolesRoleDelete',
              text: '删除',
              func: (row) => {
                this.deleteLine({roleIds: row.roleId}, 'deleteRole', 'getUserRole', 'roleListTable')
              }
            }]
          }
        },
        unitListTable: {
          columns: [
            { prop: 'orgUnitName', label: '组织名称', minWidth: 200 },
            { prop: 'orgUnitCode', label: '组织编码', minWidth: 200 }
            // { prop: 'description', label: '组织全称', minWidth: 200 }
          ],
          data: null,
          search: null,
          showPagebar: true,
          info: null,
          total: 0,
          setting: {
            toolbar: [{
              text: '添加组织',
              type: 'primary',
              func: () => {
                this.createOrgUnit()
              }
            }, {
              text: '批量删除',
              key: 'sysDataGrantUnitDelete',
              type: 'primary',
              func: () => {
                this.doBatchDelete('unitGrantIds', 'deleteUnit', 'getUnit', 'unitListTable', 'unitGrantId')
              }
            }],
            operator: [{
              key: 'sysDataGrantUnitDelete',
              text: '删除',
              func: (row) => {
                this.deleteLine({unitGrantIds: row.unitGrantId}, 'deleteUnit', 'getUnit', 'unitListTable')
              }
            }]
          }
        },
        personnelListTable: {
          columns: [
            { prop: 'personnelGroupName', label: '人事范围名称', minWidth: 200 },
            { prop: 'personnelGroupCode', label: '人事范围编号', minWidth: 200 },
            { prop: 'companyName', label: '所属公司名称', minWidth: 200 },
            // { prop: 'belongArea', label: '所属地区', minWidth: 200 },
            { prop: 'startDate', label: '生效日期', minWidth: 200, display: { date: '' } },
            { prop: 'endDate', label: '结束日期', minWidth: 200, display: { date: '' } }
          ],
          data: null,
          showPagebar: true,
          info: null,
          total: 0,
          search: null,
          setting: {
            toolbar: [
              {
                text: '添加人事范围组',
                key: 'sysDataGrantPost',
                type: 'primary',
                func: () => {
                  this.showDialog('添加人事范围组', 'getPersonnelGroupNo', 'dialogPersonnelListTable', 'saveData', 'personnelGroup', 'dialogPersonnelForm', 'dialogPersonnelListTable', 'personnelGroupCode', 'personnelHasAll')
                }
              },
              {
                text: '批量删除',
                key: 'sysDataGrantPersonnelGroupDelete',
                type: 'primary',
                func: () => {
                  this.doBatchDelete('personnelgroupGrantIds', 'deletePersonnelGroup', 'getPersonnelGroup', 'personnelListTable', 'personnelgroupGrantId')
                }
              }
              // {
              //   text: '删除',
              //   type: 'default',
              //   func: () => { }
              // }
            ],
            operator: [{
              key: 'sysDataGrantPersonnelGroupDelete',
              text: '删除',
              func: (row) => {
                this.deleteLine({personnelgroupGrantIds: row.personnelgroupGrantId}, 'deletePersonnelGroup', 'getPersonnelGroup', 'personnelListTable')
              }
            }]
          }
        },
        payListTable: {
          columns: [
            { prop: 'groupName', label: '薪资组名称', minWidth: 200 },
            { prop: 'groupCode', label: '薪资组代码', minWidth: 200 },
            // { prop: 'areaId', label: '省/区/范围', minWidth: 200 },
            // { prop: 'groupName', label: '发薪主体', minWidth: 200 },
            { prop: 'effectiveDate', label: '生效日期', minWidth: 200, display: { date: '' } },
            { prop: 'uneffectiveDate', label: '结束日期', minWidth: 200, display: { date: '' } }
          ],
          data: null,
          showPagebar: true,
          info: null,
          total: 0,
          search: null,
          setting: {
            toolbar: [
              {
                text: '添加薪资组',
                key: 'sysDataGrantPost',
                type: 'primary',
                func: () => {
                  this.showDialog('添加薪资组', 'getPaygroupNo', 'dialogPayListTable', 'saveData', 'payGroup', 'dialogPayForm', 'dialogPayListTable', 'groupCode', 'payGroupHasAll')
                }
              },
              {
                text: '批量删除',
                key: 'sysDataGrantPaygroupDelete',
                type: 'primary',
                func: () => {
                  this.doBatchDelete('paygroupGrantIds', 'deletePaygroup', 'getPaygroup', 'payListTable', 'paygroupGrantId')
                }
              }
              // {
              //   text: '删除',
              //   type: 'default',
              //   func: () => { }
              // }
            ],
            operator: [{
              key: 'sysDataGrantPaygroupDelete',
              text: '删除',
              func: (row) => {
                this.deleteLine({paygroupGrantIds: row.paygroupGrantId}, 'deletePaygroup', 'getPaygroup', 'payListTable')
              }
            }]
          }
        },
        accountListTable: {
          columns: [
            { prop: 'accountCode', label: '户头代码', minWidth: 200 },
            { prop: 'accountName', label: '户头名称', minWidth: 200 },
            { prop: 'companyName', label: '公司名称', minWidth: 200 },
            { prop: 'companyCode', label: '公司代码', minWidth: 200 },
            { prop: 'accountType', label: '户头类型', minWidth: 200, display: { dict: 'ACCOUNT_TYPE' } }
          ],
          data: null,
          showPagebar: true,
          info: null,
          total: 0,
          search: null,
          setting: {
            toolbar: [
              {
                text: '添加户头',
                key: 'sysDataGrantPost',
                type: 'primary',
                func: () => {
                  this.showDialog('添加户头', 'getAccountNo', 'dialogAccountListTable', 'saveData', 'account', 'dialogAccountForm', 'dialogAccountListTable', 'accountCode', 'accountHasAll')
                }
              },
              {
                text: '批量删除',
                key: 'sysDataGrantAccountDelete',
                type: 'primary',
                func: () => {
                  this.doBatchDelete('accountGrantIds', 'deleteAccount', 'getAccount', 'accountListTable', 'accountGrantId')
                }
              }
              // {
              //   text: '删除',
              //   type: 'default',
              //   func: () => { }
              // }
            ],
            operator: [{
              key: 'sysDataGrantAccountDelete',
              text: '删除',
              func: (row) => {
                this.deleteLine({accountGrantIds: row.accountGrantId}, 'deleteAccount', 'getAccount', 'accountListTable')
              }
            }]
          }
        },
        // 记录当前弹窗中激活的表格的名字
        dialogActiveTableName: '',
        // 当前弹窗激活的表格数据
        dialogActiveTableData: [],
        // 记录当前弹窗确定按钮保存数据的接口
        reqWay: '',
        // 当前弹窗表格请求数据接口
        dialogActiveReq: '',
        // 弹窗保存的数据对象中数组key名
        keyName: '',
        // 弹窗保存的数据对象中是否全选key名
        isHasAllkeyName: '',
        // 各个模块弹框中的表格配置
        DialogRoleListTable: {
          columns: [
            { prop: 'roleName', label: '角色', minWidth: 200 },
            { prop: 'description', label: '描述', minWidth: 400 }
          ],
          data: null,
          search: null,
          showPagebar: true,
          info: null,
          total: 0,
          editable: true
        },
        dialogUnitListTable: {
          columns: [
            { prop: 'roleName', label: '角色', minWidth: 200 },
            { prop: 'description', label: '描述', minWidth: 400 }
          ],
          data: null,
          search: null,
          showPagebar: true,
          info: null,
          total: 0,
          editable: true
        },
        dialogPersonnelListTable: {
          columns: [
            { prop: 'personnelGroupName', label: '人事范围名称', minWidth: 200 },
            { prop: 'personnelGroupCode', label: '人事范围编号', minWidth: 400 },
            { prop: 'companyName', label: '所属公司名称', minWidth: 400 }
            // { prop: 'belongArea', label: '所属地区', minWidth: 400 }
          ],
          data: null,
          search: null,
          showPagebar: true,
          info: null,
          total: 0,
          editable: true
        },
        dialogPayListTable: {
          columns: [
            { prop: 'groupName', label: '薪资组名称', minWidth: 200 },
            { prop: 'groupCode', label: '薪资组代码', minWidth: 400 }
            // { prop: 'areaId', label: '省/区', minWidth: 400 }
            // { prop: '', label: '发薪主体', minWidth: 400 }
          ],
          data: null,
          search: null,
          showPagebar: true,
          info: null,
          total: 0,
          editable: true
        },
        dialogAccountListTable: {
          columns: [
            {prop: 'accountName', label: '户头名称'},
            {prop: 'companyName', label: '公司名称'},
            {prop: 'accountCode', label: '户头代码'}
            // {prop: '', label: '公司类型'}
          ],
          data: null,
          search: null,
          showPagebar: true,
          info: null,
          total: 0,
          editable: true
        },
        // 公共弹窗标题
        dialogTItle: '',
        // 只有当弹框弹出之后的表格分页请求数据的时候才需要每次回显已经勾选的数据项
        dialogIsShow: false,
        // 记录当前弹窗中表格所有页面勾选的数据
        selected: [],
        // 当前弹窗回显比较的行数据id
        activeId: '',
        // 公共弹窗按钮
        commonToolbar: [
          {
            text: '取消',
            type: 'default',
            func: (done) => {
              this.dialogIsShow = false
              this.selected = []
              done()
            }
          }, {
            text: '确定',
            key: 'sysDataGrantPost',
            type: 'primary',
            func: () => {
              this.postUpdateUserRoled()
            }
          }
        ],
        orgToolbar: [
          {
            text: '取消',
            type: 'default',
            func: (done) => {
              done()
            }
          }, {
            text: '确定',
            key: 'sysDataGrantPost',
            type: 'primary',
            func: (done) => {
              this.postOrgPermission({}, 'getUnit', 'unitListTable')
            }
          }
        ],
        // 批量删除数组
        batchDeleteSelections: []
      }
    },

    methods: {
      // 人事，薪资，户头全选
      chooseAll (key) {
        let options = {}
        options[key] = 'Y'
        options.userId = this.userId
        req('saveData', options)
        .then(res => {
          this.$message.success('全选成功')
        })
      },
      goBack () {
        // this.$router.go(-1)
        this.$router.push({path: 'user_management', query: {conditions: this.$route.query.conditions}})
      },
      handleSizeChange (options, reqc, tableName) {
        this.loading = true
        this.getTable(options, reqc, tableName)
      },
      dialogHandleSizeChange (options, reqc, tableName) {
        this.dialogLoading = true
        this.getTable(options, reqc, tableName)
      },
      handleCurrentChange (options, reqc, tableName) {
        this.loading = true
        this.getTable(options, reqc, tableName)
      },
      dialogHhandleCurrentChange (options, reqc, tableName) {
        this.dialogLoading = true
        this.getTable(options, reqc, tableName)
      },
      reset (formName, table) {
        Object.keys(this[formName]).map(key => { this[formName][key] = '' })
        this[table].search = {...this[formName]}
      },
      search (formName, tableName) {
        this[tableName].search = {...this[formName]}
      },
      // 弹出弹窗
      // 1弹窗标题，2弹窗表格请求求接口名,7当前弹窗中激活的表格的名字, 4保存按钮接口,5弹窗保存的数据对象中数组key名
      // 6当前弹窗查询表单名字,7当前弹窗中激活的表格的名字,8行数据id,9是否全选对应的key
      showDialog (title, reqc, tableName, reqw, keyn, activef, activet, rowId, isHasAll) {
        this.reqWay = reqw
        this.keyName = keyn
        this.isHasAllkeyName = isHasAll
        this.dialogTItle = title
        this.dialogActiveForm = this[activef]
        this.dialogActiveFormName = activef
        this.dialogActiveTableName = activet
        this.dialogActiveReq = reqc
        this.dialogActiveFormKeys = Object.keys(this.dialogActiveForm)
        this.dialogActiveFormPlaceHolder = this.dialogFormText[this.dialogActiveFormName].placeHolderText
        this.dialogActiveFormLabel = this.dialogFormText[this.dialogActiveFormName].labelText
        this.activeId = rowId
        this.dialogIsShow = true
        this.dialogActiveTableData = this[tableName]
        this.dialogLoading = true
        this.getTable({}, reqc, tableName)
        this.weatherShowDialog = true
      },
      // 各模块数据请求
      getTable (options, reqc, tableName) {
        this.batchDeleteSelections = []
        // 处理小屏幕仍然每页展示8页bug
        if (!options.pageSize) {
          options.pageSize = window.innerHeight >= 660 ? 10 : 8
        }
        // 处理小屏幕仍然每页展示8页bug
        // userId:必填参数
        options.userId = this.userId
        req(reqc, options)
        .then(data => {
          Object.keys(data).map(key => {
            this[tableName][key] = data[key]
          })
          // 只有弹出组织自定义选择的时候需要赋值
          if (this.orgShowDialog) {
            this.orgUnitSelection = data.data
            this.handlerOrgUnit()
          }
          // this.orgShowDialog && (this.orgUnitSelection = data.data)
          // 只有当弹框弹出时tbale请求数据才需要做勾选功能
          if (this.dialogIsShow) {
            // this.dialogActiveTableData = this[tableName]
            this.checkCheckedData(data.data)
          }
          this.loading = false
          this.dialogLoading = false
        })
        .catch(() => {
          this.loading = false
        })
      },
      // 每次分页请求数据成功之后回显曾经勾选过的数据
      checkCheckedData (data) {
        data.map(val => {
          this.selected.map(val2 => {
            if (val2[this.activeId] === val[this.activeId]) {
              this.$nextTick(() => {
                this.$refs.dialogTable.toggleRowSelection(val)
              })
            }
          })
        })
      },
      // 删除
      deleteLine (id, reqd, reqc, table) {
        this.$confirm('您确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let options = { userId: this.userId, ...id }
          req(reqd, options).then(res => {
            this.$message.success('删除成功')
            let isEnd = this[table].info.pageSize * (this[table].info.pageIndex - 1) === this[table].total - 1
            let pageIndex = isEnd ? this[table].info.pageIndex - 1 : this[table].info.pageIndex
            let pageSize = this[table].info.pageSize
            this.loading = true
            this.getTable({...{pageSize, pageIndex}}, reqc, table)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handlerSelectionChange (selections) {
        this.batchDeleteSelections = selections
      },
      // 批量删除
      doBatchDelete (idKey, reqd, reqc, table, id) {
        if (!this.batchDeleteSelections.length) {
          this.$message.error('请先选择需要删除的数据')
          return
        }
        this.$confirm('您确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = []
          this.batchDeleteSelections.map(val => {
            arr.push(val[id])
          })
          let obj = {}
          obj[idKey] = arr.join(',')
          let options = {userId: this.userId, ...obj}
          req(reqd, options)
          .then(res => {
            this.$message.success('删除成功')
            let isEnd = this[table].info.pageSize * (this[table].info.pageIndex - 1) + this.batchDeleteSelections.length === this[table].total
            let pageIndex = isEnd ? 1 || this[table].info.pageIndex - 1 : this[table].info.pageIndex
            let pageSize = this[table].info.pageSize
            this.loading = true
            this.getTable({...{pageIndex, pageSize}}, reqc, table)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 切换tab页面
      getPower (tab) {
        // tab.index === '1' ? (this.orgUnitRequestFlag = true) : (this.orgUnitRequestFlag = false)
        this.activeTableReq = tab.name
        this.activeTableName = this.avtiveTab[tab.name]
        this.loading = true
        this.getTable({}, tab.name, this.avtiveTab[tab.name])
        this.dialogActiveTableData = []
      },
      // 保存权限
      postUpdateUserRoled () {
        if (this.selected.length) {
          let options = {}
          options.userId = this.userId
          options[this.keyName] = this.selected
          this.isHasAllkeyName && (options[this.isHasAllkeyName] = 'N')
          req(this.reqWay, options)
          .then(res => {
            this.$message.success('添加成功')
            this.weatherShowDialog = false
            this.selected = []
            // this.dialogActiveTableData = []
            // this.resetTableData()
            this.dialogIsShow = false
            this.loading = true
            this.getTable({}, this.activeTableReq, this.activeTableName)
          })
        } else {
          this.$message({
            message: '您尚未选择数据',
            type: 'warning'
          })
        }
      },
      // 每次保存完弹框中选择的权限项需要将this[this.dialogActiveTableName]中个配置项复原
      resetTableData () {
        this[this.dialogActiveTableName].data = null
        this[this.dialogActiveTableName].info = null
        this[this.dialogActiveTableName].total = null
        this[this.dialogActiveTableName].search = null
      },
      // 手动点击复选框
      clickSelect (selection, row) {
        // 勾选赋值
        let newSelection = []
        selection.map(val => {
          let count = 0
          this.selected.map(val2 => {
            val[this.activeId] === val2[this.activeId] && count++
          })
          !count && newSelection.push(val)
        })
        this.selected = [...this.selected, ...newSelection]
        // 取消勾选的时候取消记录的值
        let deleteRow = 0
        selection.map(val => {
          val[this.activeId] === row[this.activeId] && deleteRow++
        })
        !deleteRow && this.selected.map((val, idx) => {
          val[this.activeId] === row[this.activeId] && this.selected.splice(idx, 1)
        })
      },
      // 手动点击全选框
      selectAll (selection) {
        // 勾选赋值
        let newSelection = []
        selection.length && selection.map(val => {
          let count = 0
          this.selected.map(val2 => {
            val[this.activeId] === val2[this.activeId] && count++
          })
          !count && newSelection.push(val)
        })
        this.selected = [...this.selected, ...newSelection]
        // 取消勾选删除记录的值
        !selection.length && this[this.dialogActiveTableName].data.map(val => {
          this.selected.map((val2, idx) => {
            val[this.activeId] === val2[this.activeId] && this.selected.splice(idx, 1)
          })
        })
      },
      // 公共弹窗关闭时
      handlerDialogClose () {
        this.dialogIsShow = false
        this.resetTableData()
      },
      // 组织tab事件
      selectionOrgPermission (id) {
        if (id === 1) {
          this.$confirm('确定选择所在组织权限?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            req('postDataGrant', {userId: this.userId, unitHasAll: 'N', hasBelongUnit: 'Y'})
            .then(res => {
              this.lastUnit = '1'
              this.getUnitTheUserBelongTo()
            })
          })
          .catch(() => {
            this.unit = this.lastUnit
          })
        } else if (id === 2) {
          this.$confirm('确定选择全部组织权限?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            req('postDataGrant', {userId: this.userId, unitHasAll: 'Y', hasBelongUnit: 'N'})
            .then(res => {
              this.lastUnit = '2'
            })
          })
          .catch(() => {
            this.unit = this.lastUnit
          })
        } else if (id === 3) {
          this.lastUnit = '3'
          this.loading = true
          this.getTable({}, 'getUnit', 'unitListTable')
        }
      },
      // 打开新增组织弹框新增组织
      createOrgUnit () {
        this.orgShowDialog = true
        // this.orgUnitRequestFlag = true
        // 每次打开弹窗重新请求已经选择的数据
        this.getTable({}, 'getUnit', 'unitListTable')
      },
      // 处理回显的已选择组织
      handlerOrgUnit () {
        // 给组织树组件赋值
        this.orgUnitSelection.map((val) => {
          this.orgUnit.orgs += val.orgUnitId + ','
        })
        this.orgUnit.orgs = this.orgUnit.orgs.substring(0, this.orgUnit.orgs.length - 1)
      },
      // 自定义组织弹窗关闭的时候
      handlerDialogCloseUnit () {
        this.orgUnitSelection = []
        this.orgUnit.orgs = ''
        this.orgShowDialog = false
      },
      // 提交组织权限
      postOrgPermission (options, reqc, table) {
        let orgUnit = []
        this.orgUnit.orgs && this.orgUnit.orgs.split(',').map((val) => {
          !(JSON.stringify(orgUnit).indexOf(JSON.stringify({ orgUnitId: val })) !== -1) && orgUnit.push({ orgUnitId: val })
          // orgUnit.push({ orgUnitId: val })
        })
        req('postDataGrant', {userId: this.userId, unitHasAll: 'N', hasBelongUnit: 'N', orgUnit: orgUnit})
        .then(res => {
          this.orgShowDialog = false
          this.loading = true
          this.getTable(options, reqc, table)
        })
      },
      // 获得用户各种授权资源是否全选信息
      getCheck () {
        req('getCheck', {userId: this.userId})
        .then(res => {
          if (res.hasBelongUnit) {
            this.inOrgUnitShow = true
          }
          if (res.unitHasAll === 'Y') {
            this.unit = '2'
          } else if (res.hasBelongUnit === 'Y') {
            this.unit = '1'
            // this.inOrgUnitShow = true
            this.getUnitTheUserBelongTo()
          } else {
            this.unit = '3'
          }
          this.lastUnit = this.unit
          // 判断人事，薪资，户头是否全选
          res.personnelHasAll === 'Y' && (this.personnel = !!false)
          res.personnelHasAll !== 'Y' && (this.personnel = !!true)
          res.accountHasAll === 'Y' && (this.account = !!false)
          res.accountHasAll !== 'Y' && (this.account = !!true)
          res.payGroupHasAll === 'Y' && (this.pay = !!false)
          res.payGroupHasAll !== 'Y' && (this.pay = !!true)
        })
      },
      // 请求用户所在组织
      getUnitTheUserBelongTo () {
        req('getUnitTheUserBelongTo', {userId: this.userId})
        .then(res => {
          this.unitTheUserBelongTo = res.data[0].orgUnitName
        })
      },
      // 自定义和全选按钮切换
      handleChange (nowValueLabel, nowValue, isHasAllKey) {
        if (!nowValueLabel) {
          this.$confirm(`您确定要全选吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.chooseAll(isHasAllKey)
          }).catch(() => {
            this[nowValue] = true
          })
        } else {
          this.loading = true
          this.getTable({}, this.activeTableReq, this.activeTableName)
        }
      }
    },

    created () {
      this.userId = this.$route.query.userId
      this.userName = this.$route.query.userNmae
      this.loginId = this.$route.query.loginId
      this.activeName = 'getUserRole'
      this.activeTableName = 'roleListTable'
      this.activeTableReq = 'getUserRole'
      // this.getTable({}, this.dataGetName.roleList, this.AllTableName.roleListTable)
      this.getTable({}, 'getUserRole', 'roleListTable')
      this.getCheck()
    }
  }
</script>
<style lang="scss" scoped>
.base {
  width: 100%;
  height: 50px;
  background: #FFFFFF;
  font-size: 18px;
  line-height: 50px;
  i {
    display: inline-block;
    padding: 0 20px;
    cursor: pointer;
  }
  i:hover{
    color: #409EFF;
  }
  span {
    display: inline-block;
    border-left: 1px solid #ccc;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
  }
}
.unit {
  margin-bottom: 10px;
}
.unit-user-belong {
  margin-top: 10px;
}
.el-dropdown-menu {
  z-index: 9999 !important;
}
</style>
