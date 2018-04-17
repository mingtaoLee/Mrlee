<template>
  <div>
    <i-process-flow 
      @fillin="fillIn" 
      processType="organizationSplitFlow">
      <demand-desc dateSelectType="month" :model="descModel" slot="requirementsDescribe" action="组织拆分"></demand-desc>
      <div slot="maintainSubsidiary" class="content-follow">
        <h3 class="info-title">组织拆分设置</h3>
        <div class="form-box flex">
          <div v-show="showTreeBox" class="tree-box flex">
            <org-tree 
              @node-click="getOrgTreeDataList"
              @handler-freeze="handlerFreezeOrg"
              :cstRenderContent="cstRenderContent"
              :treeStyle="[showBorderStyle ? treeStyles : treeStyle]"
              :cstLoadData="loadData"
              :defaultExpandedKeys="showLeaf"
              ref="tree">
            </org-tree>
          </div>
          <div 
            v-loading="loading"
            v-show="showSplitBox"
            class="split-box">
            <p class="title">
              <strong>{{title}}</strong>
            </p>
            <div class="chilren-split">
              <p class="add-split-ogr">
                <el-button @click="splitOrg" type="text" icon="el-icon-plus">拆分组织</el-button>
              </p>
              <ul class="split-content">
                <li 
                  v-for="(item,index) in splitOrgChildList"
                  @click="editCruentSplitOrg(index)"
                  :key="index"
                  :class="{'cruent-edit': index==cruent}"
                  class="cruent-data">
                  <span>{{item.orgUnitName}}</span>
                  <i @click="deleteCruentData($event,index)" :class="[index==cruent ? 'el-icon-arrow-right arrow' : 'el-icon-delete']"></i>
                </li>
              </ul>
            </div>
            <div class="button-action">
              <el-button @click="rebackChoose" size="mini">返回重选</el-button>
              <el-button @click="personnelMove" type="primary" size="mini">人员调动</el-button>
            </div>
          </div>
          <div v-if="hideEdite" class="org-edit">
            <div v-show="editBoxStatus">
              <p class="title">
                <strong>组织拆分编辑</strong>
                <i @click="closeEvent" class="el-icon-close close"></i>
              </p>
              <div class="content-box" v-if="editMoveStatus">
                <el-form 
                  :rules="formRules" 
                  :model="formData" 
                  class="el-form"
                  ref="form" 
                  label-width="136px">
                  <el-form-item label="上级组织">
                    <span>{{formData.parentUnitName}}</span>
                  </el-form-item>
                  <el-form-item label="上级组织类别">
                    <i-select
                      v-show="editStatus"
                      v-model="formData.parentOrgType"
                      :disabled="true"
                      :placeholder="' '"
                      parameter="ORG_TYPE">
                    </i-select>
                    <span v-show="!editStatus">{{formData.parentOrgTypeName}}</span>
                  </el-form-item>
                  <el-form-item label="门店编码" v-if="showBelongArea">
                    <el-autocomplete
                      v-show="editStatus"
                      style="width: 280px;"
                      :props="shopTypeProps"
                      v-model="formData.shopTypeName"
                      :fetch-suggestions="shopTypeSearch"
                      placeholder="请输入内容"
                      @select="shopTypeSelect">
                      <template slot-scope="props">
                        <span>{{ props.item.code + ':' }}</span>
                        <span>{{ props.item.name }}</span>
                      </template>  
                    </el-autocomplete>
                    <span v-show="!editStatus">{{formData.shopTypeName}}</span>
                  </el-form-item>
                  <el-form-item label="标准组织库">
                    <el-input 
                      v-model="formData.orgStandardName"
                      v-show="editStatus"
                      readonly
                      style="width:280px;">
                      <el-button @click="showSelectLib" slot="prepend" icon="el-icon-menu"></el-button>
                      <i @click="clearStandardLib" slot="suffix" class="el-icon-close el-input__icon"></i>
                    </el-input>
                    <span v-show="!editStatus">{{formData.orgStandardName}}</span>
                    <div v-show="setPositionStatus" style="display:inline-block">
                      <span v-show="positionStatus">
                        <span :class="{ 'set-position': !editStatus, 'set-positions': editStatus }">同时设置职位</span>
                        <el-checkbox v-model="setPosition"></el-checkbox>
                      </span>
                      <el-button
                        v-popover:popover2
                        @click="showSetPosition"
                        class="el-icon-view" 
                        size="large" 
                        type="text">
                      </el-button>
                    </div>
                  </el-form-item>
                  <template v-if="applyShowStatus">
                    <el-form-item label="组织名称" prop="orgUnitName">
                      <el-input 
                        v-show="editStatus"
                        :maxlength="32" 
                        v-model="formData.orgUnitName">
                      </el-input>
                      <span v-show="!editStatus">{{formData.orgUnitName}}</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item label="组织名称">
                      <span>{{formData.orgUnitName}}</span>
                    </el-form-item>
                  </template>
                  <el-form-item label="组织简称">
                    <el-input 
                      v-show="editStatus"
                      :maxlength="32" 
                      v-model="formData.orgShortName">
                    </el-input>
                    <span v-show="!editStatus">{{formData.orgShortName}}</span>
                  </el-form-item>
                  <template v-if="applyShowStatus">
                    <el-form-item label="组织类别" prop="orgType">
                      <i-select
                        v-show="editStatus"
                        v-model="formData.orgType"
                        parameter="ORG_TYPE"
                        :disabled="disabledMap.orgSubsidiaryTable"
                        @change="handleOrgTypeChange">
                      </i-select>
                      <span v-show="!editStatus">{{formData.orgTypeName}}</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item label="组织类别">
                      <span>{{formData.orgTypeName}}</span>
                    </el-form-item>
                  </template>
                  <template v-if="applyShowStatus">
                    <el-form-item label="组织类型" prop="sapOrgType">
                      <i-select
                        v-show="editStatus"
                        v-model="formData.sapOrgType"
                        @change="transformationOrgType"
                        parameter="SAP_ORG_TYPE">
                      </i-select>
                      <span v-show="!editStatus">{{formData.sapOrgTypeName}}</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item label="组织类型">
                      <span>{{formData.sapOrgTypeName}}</span>
                    </el-form-item>
                  </template>
                  <template v-if="applyShowStatus">
                    <el-form-item label="业态" prop="businessType">
                      <i-select
                        v-show="editStatus"
                        v-model="formData.businessType"
                        @change="transformationBusinessType"
                        parameter="ORG_BUSINESS_TYPE">
                      </i-select>
                      <span v-show="!editStatus">{{formData.businessTypeName}}</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item label="业态">
                      <span>{{formData.businessTypeName}}</span>
                    </el-form-item>
                  </template>
                  <template v-if="applyShowStatus">
                    <el-form-item v-if="showBelongArea" label="所在区域" prop="belongArea">
                      <i-select-area
                        v-show="editStatus"
                        v-model="formData.belongAreaId"
                        @change="handleBelongAreaChange"
                        type="yonghui"
                        search
                        returnNode>
                      </i-select-area>
                      <span v-show="!editStatus">{{formData.belongAreaName}}</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item label="所在区域" v-if="showBelongArea">
                      <span>{{formData.belongAreaName}}</span>
                    </el-form-item>
                  </template>
                  <template v-if="applyShowStatus">
                    <el-form-item v-if="showManageArea" label="管理分区" prop="managedArea">
                      <i-select-area
                        v-show="editStatus"
                        :disabled="disabledMap.managedAreaId"
                        type="yonghui"
                        search
                        multiple
                        returnNode
                        v-model="formData.managedAreaId"
                        @change="handleManagedAreaChange">
                      </i-select-area>
                      <span v-show="!editStatus">{{formData.managedAreaName}}</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item label="管理分区" v-if="showManageArea">
                      <span>{{formData.managedAreaName}}</span>
                    </el-form-item>
                  </template>
                  <template v-if="applyShowStatus">
                    <el-form-item label="部门属性" prop="sapDeptProp">
                      <i-select
                        v-show="editStatus"
                        v-model="formData.sapDeptProp"
                        @change="handleTranslateAreaChange"
                        parameter="SAP_DEPT_PROP"
                        :disabled="disabledMap.orgSubsidiaryTable">
                      </i-select>
                      <span v-show="!editStatus">{{formData.sapDeptPropName}}</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item label="部门属性">
                      <span>{{formData.sapDeptPropName}}</span>
                    </el-form-item>
                  </template>
                  <template v-if="applyShowStatus">
                    <el-form-item label="上级汇报部门" prop="superReportingDeptId">
                      <i-select-tree
                        v-show="editStatus"
                        dataKey="org"
                        nodeKey="orgUnitId"
                        style="width: 280px"
                        v-model="formData.superReportingDeptId"
                        :selectedNode.sync="selectedNode"
                        :disabled="disabledMap.orgSubsidiaryTable"
                        @node-click="orgSelectTree">
                      </i-select-tree>
                      <span v-show="!editStatus">{{formData.superReportingDept}}</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item label="上级汇报部门">
                      <span>{{formData.superReportingDept}}</span>
                    </el-form-item>
                  </template>
                  <el-form-item label="部门负责人">
                    <el-input
                      v-show="editStatus"
                      v-model="formData.orgLeader"
                      :readonly="true"
                      @click.native="handlerLeaderDialog"
                      suffix-icon="el-icon-menu">
                    </el-input>
                    <span v-show="!editStatus">{{formData.orgLeader}}</span>
                  </el-form-item>
                  <el-form-item label="关键职责">
                    <el-input 
                      v-show="editStatus"
                      :maxlength="256" 
                      v-model="formData.orgResponsibility" 
                      type="textarea">
                    </el-input>
                    <span v-show="!editStatus">{{formData.orgResponsibility}}</span>
                  </el-form-item>
                </el-form>
              </div>
              <div class="personel-move" v-show="!editMoveStatus">
                <i-table 
                  :table="perTable"
                  @pageSizeChange="pageChange"
                  @pageIndexChange="pageChange">
                  <template slot="table" slot-scope="tableScope">
                    <el-table 
                      :data="tableScope.clone" 
                      @selection-change="handleSelectionChange"
                      height="400"
                      style="width: 100%">
                      <el-table-column type="selection"></el-table-column>
                      <el-table-column 
                        v-for="(per, idx) in perTable.columns" 
                        :key="idx" 
                        :label="per.label" 
                        :prop="per.prop"
                        align="center">
                      </el-table-column>
                      <el-table-column 
                        :filters="filterCondition"
                        :filter-method="filterTag"
                        label="调动到拆分组织"
                        prop="moveTo"
                        filter-placement="bottom-end">
                        <template slot-scope="scope">
                          <el-select 
                            v-model="scope.row.label"
                            @change="cruentType(scope.row)" 
                            placeholder="请选择" 
                            class="table-select">
                            <el-option
                              v-for="item in selectType"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </i-table>
              </div>
              <div class="button-action" v-show="showButtonAction">
                <span v-show="showBottomBox" class="move-more">
                  <el-button @click="moveMore = false, showPopover =  true" v-popover:popover size="mini">批量调动</el-button>
                </span>
                <div v-show="!showBottomBox">
                  <span class="ok-btn" v-show="!showBottomAction">
                    <el-button size="mini" @click="cancel">取消</el-button>
                    <el-button @click="formConfirm" type="primary" size="mini">确定</el-button>
                  </span>
                  <span class="edit-btn" v-show="showBottomAction">
                    <el-button @click="formEditBtn" type="primary" size="mini">编辑</el-button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="set-otion">
          <div v-if="taskKey === 'undefined' || taskKey === 'applyId'" class="is-send">
            本次创建的所有组织已发公文
              <el-checkbox v-model="OfficialDocumentChecked" @change="getOfficialDocument"></el-checkbox>
          </div>
          <div v-if = "taskKey === 'undefined' || taskKey === 'applyId'" class="is-send-official">
            本次创建的所有组织是否需要设置成本中心
              <el-checkbox v-model="checkCostCentral" @change="setOrgCostCenterTable"></el-checkbox>
          </div>
        </div>
      </div>
      <split-form 
        :costUnitVisible="costUnitVisible"
        class="split-form" 
        title="组织拆分详情"
        slot="changeOrganizational" 
        :columns="orgColumns" 
        :data="orgSplitList">
      </split-form>
      <split-form
        class="split-form" 
        title="人员调动详情"
        slot="personnelChanges" 
        :columns="personColumns" 
        :data="moveList" 
        :tableHeight="400">
      </split-form>
    </i-process-flow>
    <!-- 标准组织库弹出框 -->
    <!-- 标准组织库弹出框 -->
    <i-dialog
      v-model="libDialogVisible"
      :toolbar="dialogToolbar"
      top="5%"
      title="选择标准组织">
      <select-lib v-model="standardOrg"></select-lib>
    </i-dialog>
    <!-- 人员选择器 -->
    <i-personnel-select
      :multiple="false" 
      :isShow.sync="leaderDialogShow" 
      @confirm="leaderDialogConfirm"
      ref="iPersonnelSelect">
      <i class=""></i>
    </i-personnel-select>
    <!-- 批量调动弹框 -->
    <el-popover
      v-model="showPopover"
      ref="popover"
      placement="top-start"
      width="176">
      <ul class="move-type">
        <li v-for="(item,index) in moveTo" :key="index" @click="chooseMoveType($event)">{{item.orgUnitName}}</li>
      </ul>
    </el-popover>
    <!-- 同时设置职位 -->
    <el-popover 
      v-model="showStdTable"
      ref="popover2"
      placement="top-start"
      width="620">
      <i-table
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
        class="org-standard-table" 
        :table="orgStandardTable">
        <template slot="table" slot-scope="tableScope">
          <el-table :data="tableScope.clone">
            <el-table-column
              align="center"
              v-for="(item, index) in orgStandardTable.columns"
              :label="item.label"
              :prop="item.prop"
              :key="index">
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </el-popover>
  </div>
</template>

<script>
  import IProcessFlow from 'components/common/i-process-flow'
  import orgTree from 'components/org/public/org-tree'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import ISelectArea from 'components/common/i-select-area'
  import SelectLib from 'components/org/lib/select-lib'
  import reqOrgDetail from 'api/org/setting'
  import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import orgDialog from 'mixins/orgDialog'
  import processMixin from 'mixins/process'
  import ITable from 'components/common/i-table'
  import DemandDesc from 'components/flow/demand-desc'
  import splitForm from './split-form'
  import reqTree from 'api/org/tree'
  export default {
    name: 'OrgsSplit',
    mixins: [orgDialog, processMixin],
    components: {
      IProcessFlow,
      orgTree,
      IDialog,
      ISelectArea,
      iPersonnelSelect,
      SelectLib,
      ITable,
      DemandDesc,
      splitForm
    },
    data () {
      return {
        managerIndex: 0,
        showLeaf: [],
        // 批量调动组织类型列表
        moveTo: [],
        selectType: [],
        moveList: [],
        personelList: [],
        orgSplitList: [],
        filterCondition: [],
        chooseMoreMoveData: [],
        isHasOfficialDocument: 'N',
        applyShowStatus: true,
        hideEdite: false,
        showArrow: null,
        showBorderStyle: true,
        showButtonAction: true,
        showFreezeOrg: true,
        // 是否已发公文多选框
        OfficialDocumentChecked: false,
        // 成本中心多选框
        checkCostCentral: false,
        loading: false,
        costUnitVisible: false,
        showStdTable: false,
        setPosition: false,
        setPositionStatus: true,
        showBelongArea: false,
        showManageArea: false,
        showPopover: false,
        editBoxStatus: false,
        showBottomAction: true,
        showBottomBox: false,
        cruent: null,
        editMoveStatus: true,
        editStatus: false,
        selectedNode: {},
        splitOrgChildList: [],
        splitNumber: 0,
        // 部门负责人弹出框显示隐藏
        leaderDialogShow: false,
        cruentClickOrgParentInfo: {},
        showMoveBox: false,
        showSplitBox: false,
        formData: {},
        checkOrgInfo: {
          checkNode: '',
          checkData: ''
        },
        // 标准组织库
        standardOrg: {},
        descModel: {
          effectiveDate: '', // 生效日期
          desc: '', // 描述
          reason: ''  // 原因
        },
        // 标准组织库确定取消按钮配置
        dialogToolbar: [
          {
            text: '取消',
            type: 'defalut',
            func: done => {
              this.cancelSetLib()
            }
          },
          {
            text: '确定',
            func: done => {
              this.setLib()
            }
          }
        ],
        empChange: [],
        orgColumns: [
          {
            prop: 'orgChangeType',
            label: '组织变更类型'
          }, {
            prop: 'orgUnitName',
            label: '组织名称'
          }, {
            prop: 'orgShortName',
            label: '组织简称'
          }, {
            prop: 'businessType',
            display: {dict: 'ORG_BUSINESS_TYPE'},
            label: '业态'
          }, {
            prop: 'orgLeader',
            label: '部门负责人'
          }, {
            prop: 'orgResponsibility',
            label: '关键职责'
          }
        ],
        personColumns: [
          {
            prop: 'employeeCode',
            label: '员工工号'
          },
          {
            prop: 'fullName',
            label: '人员名称'
          },
          {
            prop: 'moveOrgtName',
            label: '调动到目标组织'
          },
          {
            prop: 'posPositionName',
            label: '职位'
          }
        ],
        perTable: {
          columns: [
            {prop: 'employeeCode', label: '工号'},
            {prop: 'fullName', label: '原部门员工'}
          ],
          data: null,
          info: {
            pageSize: 10,
            pageIndex: 1
          },
          total: 0,
          search: '',
          showPagebar: true,
          editable: true
        },
        // 标准组织库弹出框显示隐藏
        libDialogVisible: false,
        showTreeBox: true,
        cruentNode: {},
        cruentClickOrgInfo: {},
        title: '',
        treeData: [],
        requestUrls: {
          root: {
            url: 'roots'
          },
          children: {
            url: 'children'
          },
          search: {
            url: 'searchData'
          }
        },
        orgStandardTable: {
          columns: [
            {label: '职位名称', prop: 'posTitleName'},
            {label: '所属职群', prop: 'posJobFamilyName'},
            {label: '所属职种', prop: 'jobClassName'}
          ],
          data: null,
          total: 0,
          info: null,
          showPagebar: true
        },
        treeStyles: {
          height: '696px',
          width: '498px',
          background: '#F8F8F8',
          border: '1px solid #ececec'
        },
        treeStyle: {
          height: '696px',
          width: '498px',
          background: '#F8F8F8',
          border: '1px solid #ececec',
          'border-right': '2px solid #3DA5FE'
        }
      }
    },
    mounted () {},
    created () {
      // this.init()
    },
    watch: {
    },
    methods: {
      handlerFreezeOrg (value) {
        this.showFreezeOrg = value
      },
      // 将选择的人员分配到对应的组织
      personMoveToOrg () {
        this.orgSplitList.forEach((data, index) => {
          Object.assign(data, {effectiveDate: this.descModel.effectiveDate})
          if (index > 0) {
            this.$set(data, 'empEmployeeIds', [])
          }
        })
        this.orgSplitList.forEach(data => {
          if (data.empEmployeeIds) {
            this.moveList.forEach(item => {
              if (data.orgUnitName === item.moveOrgtName) {
                data.empEmployeeIds.push(item.empEmployeeId)
              }
            })
          }
        })
      },
      postFlow () {
        this.personMoveToOrg()
        this.cruentTreeInfo = this.getNodeChldren(this.$refs.tree.$refs.tree.root.childNodes)
        debugger
        let movePersonelList = {
          orgUnitMaintains: this.orgSplitList,
          descModel: this.descModel,
          isHasOfficialDocument: this.isHasOfficialDocument,
          processDefinitionId: 'organizationSplitFlow',
          operateType: '5',
          moveList: this.moveList,
          cruentTreeInfo: this.cruentTreeInfo,
          showLeaf: this.showLeaf,
          // firstInfo: this.showFirstEditeInfo,
          checkCostCentral: this.checkCostCentral
        }
        return movePersonelList
      },
      // 提交流程时，递归已展开的组织树，将每个节点的childNodes变成data的children属性，审批人节点时就能回显组织树
      getNodeChldren (nodeList) {
        return nodeList.map(item => {
          let children = []
          if (item.childNodes && item.childNodes.length) {
            children = this.getNodeChldren(item.childNodes)
          }
          return {
            ...item.data,
            children
          }
        })
      },
      /**
       * 审批数据回写
       * @param {Object} data 审批数据回写信息
       */
      fillIn (data) {
        this.descModel = data.descModel
        // this.originOrg = data.orgUnitMaintains
        if (this.taskKey === 'applyId') {
          this.orgSplitList = []
          this.moveList = []
        } else {
          this.orgSplitList = data.orgUnitMaintains
          this.moveList = data.moveList
        }
        this.treeData = data.cruentTreeInfo
        // this.cuentOrgName = data.cuentOrgName
        this.showLeaf = data.showLeaf
        this.checkCostCentral = data.checkCostCentral
        if (this.$route.query.taskKey === 'financeGroupId') {
          this.costUnitVisible = data.checkCostCentral
        } else {
          this.costUnitVisible = false
        }
        // this.costUnitVisible = data.checkCostCentral
        // Object.assign(this.showFirstEditeInfo, data.firstInfo)
      },
      // 控制成本中心是否在财务团队显示
      setOrgCostCenterTable (checked) {
        if (this.$route.query.taskKey === 'financeGroupId') {
          this.checkCostCentral = checked
        }
      },
      // 是否已发公文
      getOfficialDocument () {
        if (this.OfficialDocumentChecked) {
          this.isHasOfficialDocument = 'Y'
        } else {
          this.isHasOfficialDocument = 'N'
        }
      },
      // 设置职位列表
      showSetPosition (options = {}) {
        this.orgStandardTable.data = []
        this.showStdTable = true
        // let orgStandard = this.splitOrgChildList[this.cruent].orgStandardId
        let orgStandard = ''
        if (this.taskKey !== 'applyId' && this.taskKey) {
          orgStandard = this.formData.orgStandardId
        } else {
          orgStandard = this.splitOrgChildList[this.cruent].orgStandardId
        }
        reqOrgDetail('newGetStdPosition', {id: orgStandard, ...options}).then(data => {
          Object.assign(this.orgStandardTable, data)
        })
      },
      // 标准组织库页码大小
      handleSizeChange (options) {
        this.showSetPosition(options)
      },
      // 标准组织库分页切换
      handleCurrentChange (options) {
        this.showSetPosition(options)
      },
      // 表单select 人员调动
      tablePersonelMove () {
        this.selectType = []
        this.filterCondition = []
        this.splitOrgChildList.forEach(item => {
          this.filterCondition.push(Object.assign({}, {text: item.orgUnitName, value: item.orgUnitName}))
          this.selectType.push(Object.assign({}, {label: item.orgUnitName, value: item.orgUnitName}))
        })
      },
      /**
      * 多选
      * @param {Object} data 当前所选的人员信息
      */
      handleSelectionChange (data) {
        this.chooseMoreMoveData = data
      },
      // 过滤人员调动去重
      filterMovePersonList (item) {
        this.moveList.forEach((data, index) => {
          if (data.empEmployeeId === item.empEmployeeId) {
            Object.assign(item, {moveOrgtName: item.label})
            this.moveList.splice(index, 1, Object.assign(data, item))
          }
        })
      },
      /**
       * 过滤人员调动信息
       * @param {Object} row 当前行人员信息
       * @param {String} value 过滤条件值
       */
      filterTag (value, row) {
        return row.label === value
      },
      // 批量调动人员
      chooseMoveType (event) {
        this.showPopover = false
        if (this.chooseMoreMoveData.length > 0) {
          // 选择的人员要调动到的组织
          this.chooseMoreMoveData.forEach(item => {
            Object.assign(item, {label: event.target.innerText})
            if (this.personelList.includes(item.empEmployeeId)) {
              this.filterMovePersonList(item)
            } else {
              Object.assign(item, {moveOrgtName: item.label})
              this.personelList.push(item.empEmployeeId)
              this.moveList.push(item)
            }
          })
        } else {
          this.$message.error('请选择调动人员!')
        }
      },
      /**
      * 批量调动人员
      * @param {Object} row 当前调动人员信息
      */
      cruentType (row) {
        if (this.personelList.includes(row.empEmployeeId)) {
          this.filterMovePersonList(row)
        } else {
          this.personelList.push(row.empEmployeeId)
          Object.assign(row, {moveOrgtName: row.label})
          this.moveList.push(row)
        }
      },
      cancel () {
        this.hideEdite = false
        this.cruent = null
        this.editStatus = false
        this.editBoxStatus = false
        this.showBottomAction = true
      },
      // 保存拆分编辑
      formConfirm () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.hideEdite = false
            this.editStatus = false
            this.showBottomAction = true
            this.editBoxStatus = false
            this.positionStatus = false
            // 添加职位字段
            // Object.assign(this.formData, {orgStandardId: this.standardOrg.orgStandardId})
            Object.assign(this.splitOrgChildList[this.cruent], this.formData, {createPosition: this.setPosition})
            this.orgSplitList.forEach(data => {
              if (this.splitOrgChildList[this.cruent].splitId === data.splitId) {
                Object.assign(data, this.splitOrgChildList[this.cruent])
              }
            })
            // this.moveList.splice(index, 1, Object.assign(data, item))
            this.cruent = null
            this.tablePersonelMove()
            this.appendNode()
          }
        })
      },
      // 门店编码选择
      shopTypeSelect (item) {
        this.formData.shopCode = item.code
        this.formData.shopTypeName = item.code + ':' + item.name
      },
      // 门店编码搜索
      shopTypeSearch (queryString, callback) {
        reqOrgDetail('getShopType', {code: queryString, name: queryString}).then(data => {
          callback(data)
        })
      },
      formEditBtn () {
        this.editStatus = true
        this.showBottomAction = false
        this.positionStatus = true
      },
      orgSelectTree () {},
      handleTranslateAreaChange (data) {
        this.$d('SAP_DEPT_PROP', data).then(label => {
          Object.assign(this.formData, {sapDeptProp: data, sapDeptPropName: label})
        })
      },
      // 管理分区input改变时
      handleManagedAreaChange (data, value) {
        this.formData.managedArea = data.map(area => {
          return area.areaCode
        }).toString()
        this.formData.managedAreaName = value.join(',')
        // let managedArea = data.map(item => {
        //   return item.areaCode
        // }).toString()
        // let managedAreaName = value.join(',')
        // this.$set(this.formData, 'managedArea', managedArea)
        // this.$set(this.formData, 'managedAreaName', managedAreaName)
      },
      handleBelongAreaChange (data, value) {
        Object.assign(this.formData, {belongArea: data.areaCode, belongAreaName: value, belongAreaId: data.areaId})
        // Object.assign(this.formData, {belongArea: data.areaId, belongAreaName: value})
      },
      transformationBusinessType (data) {
        this.$d('ORG_BUSINESS_TYPE', data).then(label => {
          Object.assign(this.formData, {businessType: data, businessTypeName: label})
        })
        this.areaStatus()
      },
      /**
       * 组织类型字典转换
       * @param {Object} data 当前组织字典信息
       */
      transformationOrgType (data) {
        this.$d('SAP_ORG_TYPE', data).then(label => {
          Object.assign(this.formData, {sapOrgType: data, sapOrgTypeName: label})
        })
      },
      handleOrgTypeChange (data) {
        this.$d('ORG_TYPE', data).then(label => {
          Object.assign(this.formData, {orgTypeName: label, orgType: data})
        })
        this.areaStatus(data)
        this.manageArea()
      },
      areaStatus (data) {
        if (this.formData.orgType === '7' && parseInt(this.formData.businessType) <= 5) {
          this.showBelongArea = true
        } else {
          this.showBelongArea = false
        }
      },
      manageArea () {
        if (this.formData.orgType === '6') {
          this.showManageArea = true
        } else {
          this.showManageArea = false
        }
      },
      // 清空标准组织库值
      clearStandardLib () {
        this.formData.orgStandardName = ''
        Object.assign(this.splitOrgChildList[this.cruent], {orgStandardId: ''})
        Object.assign(this.formData, {orgStandardId: ''})
      },
      // 显示标准组织库弹窗
      showSelectLib () {
        this.libDialogVisible = true
      },
      closeEvent () {
        if (!this.showBottomAction) {
          this.$message({
            type: 'error',
            message: '请先确定您的表单内容'
          })
          return
        }
        this.hideEdite = false
        this.showArrow = null
        this.cruent = null
        this.editBoxStatus = false
      },
      /**
       * 部门负责人弹出框确定按钮
       * @param {Object} selected 当前选择负责人信息
       */
      leaderDialogConfirm (selected) {
        this.$set(this.formData, 'orgLeader', selected[0].employeeName)
      },
      // 人员选择器
      handlerLeaderDialog () {
        this.leaderDialogShow = !this.leaderDialogShow
        this.$refs.iPersonnelSelect.resetData()
      },
      // 字典转换
      getDictData () {
        this.$d('ORG_BUSINESS_TYPE', this.formData.businessType).then(label => {
          this.$set(this.formData, 'businessTypeName', label)
          this.areaStatus()
        })
        // 上级组织类别转换
        this.$d('ORG_TYPE', this.formData.parentOrgType).then(label => {
          this.$set(this.formData, 'parentOrgTypeName', label)
        })
        this.$d('ORG_TYPE', this.formData.orgType).then(label => {
          this.$set(this.formData, 'orgTypeName', label)
          this.manageArea()
        })
        this.$d('SAP_ORG_TYPE', this.formData.sapOrgType).then(label => {
          this.$set(this.formData, 'sapOrgTypeName', label)
        })
        this.$d('SAP_DEPT_PROP', this.formData.sapDeptProp).then(label => {
          this.formData.sapDeptPropName = label
        })
      },
      // 标准组织库确定
      setLib () {
        this.$set(this.formData, 'orgStandardName', this.standardOrg.orgStandardName)
        Object.assign(this.splitOrgChildList[this.cruent], {orgStandardId: this.standardOrg.orgStandardId})
        Object.assign(this.formData, {orgStandardId: this.standardOrg.orgStandardId})
        this.libDialogVisible = false
      },
      getParentNodeId (data) {
        let node = this.$refs.tree.$refs.tree.store.getNode(data)
        this.showLeaf = []
        this.getSplitNodeTreeParentIdList(node, this.showLeaf)
      },
      getSplitNodeTreeParentIdList (node, list) {
        list.push(node.parent.data.orgUnitId)
        if (node.parent.level !== 1) {
          this.getSplitNodeTreeParentIdList(node.parent, list)
        }
      },
      /**
       * 获取当前点击组织父组织信息
       * @param {Object} data 节点信息
       */
      getCruentParentNodeInfo (parentData, cruentData) {
        this.loading = true
        reqOrgDetail('echoDetail', {id: parentData.orgUnitId}).then(datas => {
          this.cruentClickOrgParentInfo = datas
          this.getCruentNodeInfo(cruentData)
        })
      },
      /**
       * 获取当前点击组织信息
       * @param {Object} data 节点信息
       */
      getCruentNodeInfo (data) {
        reqOrgDetail('echoDetail', {id: data.orgUnitId}).then(datas => {
          let addOrgInfo = Object.assign({}, {parentUnitName: this.cruentNode.parent.data.orgUnitName, parentOrgType: this.cruentNode.parent.data.orgType, superReportingDept: this.cruentClickOrgParentInfo.orgUnitName, superReportingDeptId: this.cruentClickOrgParentInfo.orgUnitId})
          this.cruentClickOrgInfo = Object.assign(this.cruentClickOrgInfo, datas, addOrgInfo)
          if (this.cruentClickOrgInfo.managedArea) {
            this.$set(this.cruentClickOrgInfo, 'managedAreaId', [])
            this.$set(this.cruentClickOrgInfo, 'managedAreaName', '')
            this.getMenagerAreaInfo()
          }
          this.orgSplitList.push(Object.assign({}, this.cruentClickOrgInfo, {orgChangeType: '原组织（更新）'}))
          this.loading = false
        })
      },
      // 当前选择拆分源组织
      getOrgTreeDataList (data, node) {
        if (this.taskKey !== 'undefined' && this.taskKey !== 'applyId') {
          this.applyShowStatus = false
          this.editBoxStatus = true
          this.hideEdite = true
          // this.$refs['form'].resetFields()
          this.showArrow = node.id
          this.checkOrgInfo.checkNode = node
          this.checkCruentNodeInfo(data, node)
        } else {
          this.applyShowStatus = true
          this.flowInit(data, node)
        }
      },
      // 审批查看区域管信息
      checkAreaInfo () {
        let menagerAreaArray = this.checkOrgInfo.checkData.managedArea.split(',')
        if (this.managerIndex > (menagerAreaArray.length - 1)) {
          // 请求获取当前点击组织信息查看
          Object.assign(this.formData, this.checkOrgInfo.checkData, {parentOrgType: this.checkOrgInfo.checkNode.parent.data.orgType, superReportingDept: this.checkOrgInfo.checkNode.parent.data.orgUnitName})
          this.managerIndex = 0
          this.getDictData()
        } else {
          reqOrgDetail('getAreaMsg', {code: menagerAreaArray[this.managerIndex]}).then(data => {
            this.managerIndex++
            let cruentArea = ''
            if (data[0].parentAreaName) {
              cruentArea = data[0].parentAreaName + '/' + data[0].areaName
            } else {
              cruentArea = data[0].areaName
            }
            if (this.managerIndex === menagerAreaArray.length) {
              this.formData.managedAreaName = this.formData.managedAreaName + cruentArea
            } else {
              this.formData.managedAreaName = this.formData.managedAreaName + cruentArea + ','
            }
            this.checkAreaInfo()
          })
        }
      },
      // 流程审批时查看组织信息
      checkCruentNodeInfo (data, node) {
        this.showBorderStyle = false
        this.showButtonAction = false
        this.editBoxStatus = true
        reqOrgDetail('echoDetail', {id: data.orgUnitId}).then(datas => {
          for (let key in this.formData) {
            this.formData[key] = ''
          }
          if (datas.belongArea) {
            Object.assign(this.formData, {shopTypeName: datas.shopCode})
            this.getAreaInfo(datas.belongArea)
          }
          if (datas) {
            if (datas.managedArea) {
              this.checkOrgInfo.checkData = datas
              this.$set(this.formData, 'managedAreaName', '')
              this.checkAreaInfo()
            } else {
              // 请求获取当前点击组织信息查看
              Object.assign(this.formData, datas, {parentOrgType: node.parent.data.orgType, superReportingDept: node.parent.data.orgUnitName})
            }
          } else {
            // 查看当前拆分出来的组织信息
            this.orgSplitList.forEach((item, index) => {
              if (data.orgUnitId === item.splitId) {
                Object.assign(this.formData, this.orgSplitList[index])
              }
            })
          }
          this.getDictData()
        })
        // for (let key in this.formData) {
        //   this.formData[key] = ''
        // }
        // let idType = typeof data.orgUnitId
        // if (idType === 'number') {
        //   // 查看当前拆分出来的组织信息
        //   this.orgSplitList.forEach((item, index) => {
        //     if (data.orgUnitId === item.splitId) {
        //       Object.assign(this.formData, this.orgSplitList[index])
        //     }
        //   })
        // } else {
        //   reqOrgDetail('echoDetail', {id: data.orgUnitId}).then(datas => {
        //     // 请求获取当前点击组织信息查看
        //     Object.assign(this.formData, datas, {parentOrgType: node.parent.data.orgType, superReportingDept: node.parent.data.orgUnitName})
        //   })
        // }
        // this.getDictData()
      },
      // 流程起草
      flowInit (data, node) {
        this.showButtonAction = true
        this.title = data.orgUnitName
        this.cruentNode = node
        if (node.isLeaf) {
          this.showTreeBox = false
          this.showSplitBox = true
          // this.orgSplitList.push(Object.assign({}, node.parent.data, {orgChangeType: '原组织（更新）'}))
          this.getCruentParentNodeInfo(node.parent.data, data)
          this.getParentNodeId(data)
        } else {
          this.$message.error('非叶子节点不能拆分')
        }
      },
      // // 请求组织树方法
      getTreeRoot () {
        return reqTree(this.requestUrls.root.url, {}).then(data => {
          return data
        })
      },
      // // 懒加载组织树
      loadData (node, resolve) {
        if (node.level === 0) {
          this.getTreeRoot().then(data => {
            if (this.taskKey === 'undefined') {
              resolve(data)
            } else {
              if (this.taskKey === 'applyId') {
                resolve(data)
              } else {
                resolve(this.treeData)
              }
              // resolve(this.treeData)
            }
          })
          .then(() => {
            this.$nextTick(() => {
              this.$refs.tree.root.childNodes.forEach(node => {
                node.expand()
              })
            })
          })
        } else {
          if (node.data.children && node.data.children.length > 0) {
            resolve(node.data.children)
          } else {
            reqTree(this.requestUrls.children.url, {id: node.data.orgUnitId}).then(data => {
              resolve(data)
            }).catch(() => {
              resolve([])
            })
          }
        }
      },
      personnelMove () {
        if (!this.showBottomAction) {
          this.$message({
            type: 'error',
            message: '请先确定您的表单内容'
          })
          return
        }
        this.hideEdite = true
        this.editBoxStatus = true
        this.cruent = null
        this.showBottomBox = true
        this.editMoveStatus = false
        this.pageChange(this.perTable.info)
      },
      pageChange (options) {
        reqOrgDetail('emp', Object.assign(options, {orgUnitId: this.cruentNode.data.orgUnitId})).then(data => {
          Object.assign(this.perTable.info, data.info)
          this.perTable.data = data.data
          this.perTable.total = data.total
          this.perTable.data.forEach(item => {
            Object.assign(item, {label: ''})
            //  保存调动人员信息
            this.moveList.forEach(val => {
              if (item.empEmployeeId === val.empEmployeeId) {
                Object.assign(item, val)
              }
            })
          })
        })
      },
      // 编辑/查看当前组织
      editCruentSplitOrg (index) {
        if (!this.showBottomAction) {
          this.$message({
            type: 'error',
            message: '请先确定您的表单内容'
          })
          return
        }
        this.hideEdite = true
        this.showBottomBox = false
        this.editMoveStatus = true
        this.editBoxStatus = true
        this.cruent = index
        this.formData = {}
        // this.getAreaInfo(this.splitOrgChildList[index].belongArea, index)
        this.setPosition = this.splitOrgChildList[index].createPosition
        this.formData = Object.assign({}, this.splitOrgChildList[index])
        this.getDictData()
        this.areaStatus()
      },
      // 清空拆分组织
      clearSplitOrg () {
        this.cruentNode.parent.childNodes = this.cruentNode.parent.childNodes.filter(val => {
          if (!val.data.isNew) {
            return val
          }
        })
      },
      // 删除节点
      deletenode (key) {
        let node = this.cruentNode.parent
        let creuentDeleteOrg = this.splitOrgChildList[key].splitId
        node.childNodes.forEach((val, index) => {
          if (creuentDeleteOrg === val.data.orgUnitId) {
            node.childNodes.splice(index, 1)
          }
        })
      },
      // 增加节点
      appendNode () {
        this.clearSplitOrg()
        this.splitOrgChildList.forEach(item => {
          let parentInfo = this.cruentClickOrgInfo
          let node = this.cruentNode.parent
          let addTreeNodeData = {
            orgUnitId: item.splitId,
            orgUnitName: item.orgUnitName,
            parentUnitName: parentInfo.orgUnitName,
            parentId: parentInfo.orgUnitId,
            parentOrgType: node.data.orgType,
            canEditNode: true,
            isNew: true,
            isParent: 0
          }
          node.expand(() => {
            let newChild = { data: addTreeNodeData }
            newChild.parent = node
            node.insertChild(newChild)
            node.data.isParent = 1
          })
        })
      },
      // 删除当前点击的组织
      deleteCruentData (event, index) {
        if (!this.showBottomAction) {
          this.$message({
            type: 'error',
            message: '请先确定您的表单内容'
          })
          return
        }
        event.cancelBubble = true
        this.editBoxStatus = false
        this.orgSplitList.forEach((data, key) => {
          if (this.splitOrgChildList[index].splitId === data.splitId) {
            this.orgSplitList.splice(key, 1)
          }
        })
        this.deletenode(index)
        this.splitOrgChildList.splice(index, 1)
        this.cruent = null
        this.moveTo = this.splitOrgChildList
        this.tablePersonelMove()
      },
      // 添加拆分组织
      splitOrg () {
        if (this.splitOrgChildList.length < 6) {
          if (this.cruentClickOrgInfo.belongArea) {
            reqOrgDetail('getAreaMsg', {code: this.cruentClickOrgInfo.belongArea}).then(data => {
              let name = data[0].parentAreaName + '/' + data[0].areaName
              this.$set(this.cruentClickOrgInfo, 'belongArea', data[0].areaCode)
              this.$set(this.cruentClickOrgInfo, 'belongAreaId', data[0].areaId)
              this.$set(this.cruentClickOrgInfo, 'belongAreaName', name)
              // this.$set(this.cruentClickOrgInfo, 'shopTypeName', this.cruentClickOrgInfo.shopCode)
              this.addSplit()
            })
          } else {
            this.addSplit()
          }
        }
      },
      addSplit () {
        this.splitNumber++
        // 添加上级组织名称和上级组织类别
        let newOrgName = this.cruentClickOrgInfo.orgUnitName + this.splitNumber
        let splitId = Date.now()
        this.splitOrgChildList.push(Object.assign({}, this.cruentClickOrgInfo, {orgUnitName: newOrgName, splitId: splitId, createPosition: this.setPosition, orgStandardId: '', costCentralId: '', shopCode: ''}))
        let newSplit = Object.assign({}, this.splitOrgChildList[this.orgSplitList.length - 1], {orgChangeType: '拆分组织（新增）'})
        this.orgSplitList.push(newSplit)
        this.moveTo = this.splitOrgChildList
        this.tablePersonelMove()
        this.appendNode()
      },
      // 返回重选
      rebackChoose () {
        this.cruent = null
        this.splitNumber = 0
        this.hideEdite = false
        this.showTreeBox = true
        this.showSplitBox = false
        this.editBoxStatus = false
        this.showBottomAction = true
        this.editStatus = false
        this.splitOrgChildList = []
        this.personelList = []
        this.moveList = []
        this.orgSplitList = []
        this.clearSplitOrg()
      },
      // 清空默认值
      clearDefultVal () {
        this.splitNumber = 0
        this.splitOrgChildList = []
      },
      // 渲染树节点
      cstRenderContent (h, {data, node, store}) {
        let nodeStyle = false
        let highlightFreeze = data.status === '2' && this.showFreezeOrg
        if (this.orgSplitList.length > 0) {
          let parentNode = this.orgSplitList[0].orgPathName.split('_')
          // parentNode.includes(node.label) ? nodeStyle = true : nodeStyle = false
          if (this.taskKey === 'applyId') {
            nodeStyle = false
          } else {
            parentNode.includes(node.label) ? nodeStyle = true : nodeStyle = false
          }
        }
        return (
          <div style='line-height:36px; position:relative; width:100%'>
            <span style={'margin-right: 5px;'} class={(highlightFreeze ? 'iconfont icon-lock' : '')}></span>
            <span style={(nodeStyle ? 'color: #6CC60A;' : data.isNew ? 'color: #EB6709;' : '') + (highlightFreeze ? 'color:#d8d8d8;' : '')}>{data.orgUnitName}</span>
            <span v-show={this.showArrow === node.id} class="el-icon-arrow-right" style="position:absolute; right: 5px; color: #3DA5FE; font-size: 23px; line-height: 36px"></span>
          </div>
        )
      },
      getAreaInfo (areaVal) {
        reqOrgDetail('getAreaMsg', {code: areaVal}).then(data => {
          let name = data[0].parentAreaName + '/' + data[0].areaName
          this.$set(this.formData, 'belongArea', data[0].areaCode)
          this.$set(this.formData, 'belongAreaId', data[0].areaId)
          this.$set(this.formData, 'belongAreaName', name)
        })
      },
      // 区域管理获取区域信息
      getMenagerAreaInfo () {
        let menagerAreaArray = this.cruentClickOrgInfo.managedArea.split(',')
        if (this.managerIndex > (menagerAreaArray.length - 1)) {
          this.managerIndex = 0
        } else {
          reqOrgDetail('getAreaMsg', {code: menagerAreaArray[this.managerIndex]}).then(data => {
            this.managerIndex++
            this.cruentClickOrgInfo.managedAreaId.push(data[0].areaId)
            let cruentArea = ''
            if (data[0].parentAreaName) {
              cruentArea = data[0].parentAreaName + '/' + data[0].areaName
            } else {
              cruentArea = data[0].areaName
            }
            if (this.managerIndex === menagerAreaArray.length) {
              this.cruentClickOrgInfo.managedAreaName = this.cruentClickOrgInfo.managedAreaName + cruentArea
            } else {
              this.cruentClickOrgInfo.managedAreaName = this.cruentClickOrgInfo.managedAreaName + cruentArea + ','
            }
            this.getMenagerAreaInfo()
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .set-otion div {
    margin-top: 20px;
  }
  .tree-box {
    display: flex;
  }
  .split-box {
    width: 498px;
    height: 696px;
    background: #FFFFFF;
    border: 1px solid #E8E8E8;
    align-self: flex-end;
    position: relative;
    .title {
      display: flex;
      height: 52px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      background: #F8F8F8;
      border-bottom: 1px solid #E8E8E8;
      align-items: center;
      padding-left: 21px;
    }
    .button-box {
      display: flex;
      position: absolute;
      bottom: 0;
      border: 1px solid #E8E8E8;
      align-self: flex-end;
      justify-content: space-between;
      width: 100%;
      button {
        margin: 11px;
      }
    }
    .button-action {
      display: flex;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #E8E8E8;
      // border-bottom: 1px solid #E8E8E8;
      align-self: flex-end;
      justify-content: space-between;
      width: 100%;
      button {
        margin: 11px;
      }
    }
    .add-split-ogr {
      border: 1px dashed #D8D8D8;
      margin: 10px auto;
      width: 454px;
      height: 39px;
      text-align: center;
      line-height: 39px;
    }
    // .split-content {
    //   margin: auto;
    //   width: 454px;
    //   text-align: center;
    // }
    .split-content li {
      display: flex;
      height: 39px;
      margin-top: 20px;
      background: #F1F3F6;
      border: 1px solid #E8E8E8;
      align-items: center;
      // justify-content: center;
    }
    .cruent-data {
      position: relative;
      border: 1px solid #E8E8E8;
      margin: 10px auto;
      padding-left: 24px;
      height: 39px;
      background: #F1F3F6;
      line-height: 39px;
      cursor: pointer;
    }
    .split-content {
      margin: auto;
      width: 454px;
      .el-icon-delete, .el-icon-arrow-right {
        position: absolute;
        right: 12px;
        line-height: 40px;
      }
      .cruent-edit {
        width: 452px;
        border-right: 2px solid white;
        background: white;
      }
      .arrow {
        color: #3DA5FE;
        font-size: 23px;
        font-weight: bold;
      }
      .cruent-edit {
        width: 452px;
        border-right: 2px solid white;
        background: white;
      }
    }
  }
  .move-type {
    text-align: center;
    li {
      height: 29px;
      line-height: 29px;
      color: #4A4A4A;
      cursor: pointer;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    li:hover {
      background: #F1F3F6;
    }
  }
  .org-edit {
    width: 498px;
    height: 696px;
    background: #FFFFFF;
    border: 1px solid #E8E8E8;
    border-left: none;
    align-self: flex-end;
    position: relative;
    .title {
      display: flex;
      height: 52px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      background: #F8F8F8;
      border-bottom: 1px solid #E8E8E8;
      align-items: center;
      padding-left: 21px;
      i {
        flex: 1;
        text-align: right;
        margin-right: 19px;
        cursor: pointer;
      }
      strong {
        flex: 1;
      }
    }
    .table-select {
      width: auto;
    }
    .button-action {
      display: flex;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #E8E8E8;
      // border-bottom: 1px solid #E8E8E8;
      align-self: flex-end;
      justify-content: flex-end;
      width: 100%;
      button {
        margin: 11px;
      }
      .move-more{
        flex: 1;
      }
    }
    .content-box {
      height: 592px;
      overflow-y: scroll;
      // background: gray;
    }
    .el-input, .el-select, .i-select-area, .el-textarea, .i-select-tree {
      width: 280px;
    }
    .table-select {
      width: auto;
    }
    .set-position {
      margin-left: 45px;
    }
  }
</style>

