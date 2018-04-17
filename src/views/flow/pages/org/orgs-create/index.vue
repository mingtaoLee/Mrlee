<template>
  <div>
    <i-process-flow
      :taskI="taskId"
      :taskKey="taskKey"
      processType="organizationsCreateFlowNew"
      :model="autoSelectEmpDto"
      @fillin="fillIn"
    >
      <!-- 需求描述 -->
      <demand-desc
        dateSelectType="month"
        action="组织批量新增"
        slot="requirementsDescribe"
        :model="descModel">
      </demand-desc>

      <!-- 创建组织操作 -->
      <div slot="addListForm" class="large-box">
        <h2 class="add-list-title">创建组织</h2>
        <!-- 左侧组织树 -->
        <div class="box">
          <!-- 左侧头部 -->
          <div class="tree-box-title">
            <span>
              只查看已创建组织
              <el-checkbox v-model="isFilter"></el-checkbox>
            </span>
            <div v-show="showMap.copyBtn">
              <el-button v-show="titleCopyBtn" @click="showCopyBox">复制</el-button>
              <div v-show="pasteBtnShow" class="pasteBtn">
                <el-button type="primary" @click="nextPaste">下一步 粘贴</el-button>
              </div>
              <div v-show="copyAndPasteBtnShow" class="pasteBtn">
                <el-button type="primary" @click="pasteTreeItem">确定</el-button>
              </div>
            </div>
          </div>
          <div style="background: #f8f8f8;padding-left: 20px;">
            <el-checkbox v-model="showFreezeOrg">标识已冻结的组织</el-checkbox>
          </div>
          <el-tree
            ref="tree"
            class="org-tree"
            show-checkbox
            :props="defaultProps"
            :render-content="renderContent"
            :expand-on-click-node="false"
            :check-strictly="true"
            @node-click="nodeClick"
            @check-change="treeCheckChange"
            :filter-node-method="filterNode"
            :default-expanded-keys="defaultExpandedkeys"
            :load="loadData"
            :node-key="nodeKey"
            lazy>
          </el-tree>
        </div>
        <!-- 右侧表单 -->
        <div v-if="formBoxShow" class="box form-box">
          <!-- 表单标题 -->
          <div class="form-box-title">
            <h2>{{formBoxTitle}}</h2>
            <el-button style="font-size:20px;margin-right:20px;" icon="el-icon-close" @click="colseBtnClick" type="text"></el-button>
          </div>
          <!-- 表单 -->
          <el-form
            :style="(canEditForm === true || editButtonShow === true) ? 'height:540px' : 'height:600px'"
            :rules="formRules"
            v-show="!isShowCopyBox"
            ref="form"
            :model="formData"
            class="el-form"
            label-width="136px">
            <el-form-item label="上级组织">
              <span v-show="canEditForm">{{formData.parentUnitName}}</span>
              <span v-show="!canEditForm">{{formData.parentUnitName}}</span>
            </el-form-item>
            <el-form-item label="上级组织类别">
              <span v-show="canEditForm">{{formData.parentOrgTypeName}}</span>
              <span v-show="!canEditForm">{{formData.parentOrgTypeName}}</span>
            </el-form-item>
            <el-form-item class="lib-org-standar" label="标准组织库">
              <el-input v-show="canEditForm" :disabled="disabledMap.orgStandardId" style="width:280px;" v-model="formData.orgStandardName" readonly>
                <el-button  slot="prepend" icon="el-icon-menu" @click="showSelectLib"></el-button>
                <i
                slot="suffix"
                class="el-icon-close el-input__icon"
                @click="clearStandardLib"
                ></i>
              </el-input>
              <span style="display:inline-block;width:100%;" v-show="!canEditForm">{{formData.orgStandardName}}</span>
              <el-popover
                v-show="showStdTable || (orgStandardTable.data && orgStandardTable.data.length)"
                ref="popover2"
                placement="top-start"
                style="position:relative;top:-10px;"
                trigger="click">
                <el-button slot="reference" style="font-size:12px;" type="text">
                  同时设置标准职位
                  <el-checkbox v-model="formData.createPosition" @change="setCreatePosition"></el-checkbox>
                  <span style="position:relative;top:2px;" class="iconfont icon-eye"></span>
                </el-button>
                <i-table
                  @pageSizeChange="handleSizeChange"
                  @pageIndexChange="handleCurrentChange"
                  class="org-standard-table"
                  :table="orgStandardTable">
                  <template slot="table" slot-scope="tableScope">
                    <el-table :data="tableScope.clone">
                      <el-table-column
                        align="center"
                        width="199px"
                        v-for="(item, index) in orgStandardTable.columns"
                        :label="item.label"
                        :prop="item.prop"
                        :key="index">
                      </el-table-column>
                    </el-table>
                  </template>
                </i-table>
              </el-popover>
            </el-form-item>
            <el-form-item v-show="shopCodeShow" label="门店编码">
              <el-autocomplete
                v-show="canEditForm"
                v-model="formData.shopTypeName"
                :fetch-suggestions="shopTypeSearch"
                placeholder="请输入内容"
                @select="shopTypeSelect">
                <template slot-scope="props">
                  <span>{{ props.item.code + ':' }}</span>
                  <span>{{ props.item.name }}</span>
                </template>  
              </el-autocomplete>
              <span v-show="!canEditForm">{{formData.shopTypeName}}</span>
            </el-form-item>
            <el-form-item label="组织名称" prop="orgUnitName">
              <el-input :maxlength="32" :disabled="disabledMap.orgUnitName" v-show="canEditForm" v-model="formData.orgUnitName"></el-input>
              <span v-show="!canEditForm">{{formData.orgUnitName}}</span>
            </el-form-item>
            <el-form-item label="组织简称">
              <el-input :maxlength="32" :disabled="disabledMap.orgShortName" v-show="canEditForm" v-model="formData.orgShortName"></el-input>
              <span v-show="!canEditForm">{{formData.orgShortName}}</span>
            </el-form-item>
            <el-form-item label="组织类别" prop="orgType">
              <i-select
                @change="setOrgTypeName"
                :disabled="disabledMap.orgType"
                v-if="canEditForm"
                v-model="formData.orgType"
                parameter="ORG_TYPE">
              </i-select>
              <span v-show="!canEditForm">{{formData.orgTypeName}}</span>
            </el-form-item>
            <el-form-item label="业态" prop="businessType">
              <i-select
                @change="setBusinessTypeName"
                :disabled="disabledMap.businessType"
                v-if="canEditForm"
                v-model="formData.businessType"
                parameter="ORG_BUSINESS_TYPE">
              </i-select>
              <span v-show="!canEditForm">{{formData.businessTypeName}}</span>
            </el-form-item>
            <el-form-item label="组织类型" prop="sapOrgType">
              <i-select
                @change="setSapOrgTypeName"
                :disabled="disabledMap.sapOrgType"
                v-if="canEditForm"
                v-model="formData.sapOrgType"
                parameter="SAP_ORG_TYPE">
              </i-select>
              <span v-show="!canEditForm">{{formData.sapOrgTypeName}}</span>
              </el-form-item>
              <el-form-item label="部门属性" prop="sapDeptProp">
                <i-select
                  @change="setSapDeptPropName"
                  :disabled="disabledMap.sapDeptProp"
                  v-show="canEditForm"
                  v-model="formData.sapDeptProp"
                  parameter="SAP_DEPT_PROP">
                </i-select>
              <span v-show="!canEditForm">{{formData.sapDeptPropName}}</span>
            </el-form-item>
            <el-form-item label="上级汇报部门" prop="superReportingDeptId">
              <i-select-tree
                v-if="canEditForm"
                dataKey="org"
                nodeKey="orgUnitId"
                v-model="formData.superReportingDeptId"
                :selectedNode.sync="selectedNode"
                :disabled="disabledMap.orgSubsidiaryTable"
                @node-click="orgSelectTreeClick">
              </i-select-tree>
              <span v-show="!canEditForm">{{formData.superReportingDept}}</span>
            </el-form-item>
            <el-form-item ref="belongArea"  v-show="showBelongArea" label="所在区域" prop="belongArea">
              <i-select-area
                :disabled="disabledMap.belongAreaId"
                v-if="canEditForm"
                type="yonghui"
                search
                returnNode
                v-model="formData.belongAreaId"
                @change="handleBelongAreaChange">
              </i-select-area>
              <span v-show="!canEditForm">{{formData.belongAreaName}}</span>
            </el-form-item>
            <el-form-item ref="manageArea" v-show="showManageArea" label="管理分区" prop="managedArea">
              <i-select-area
                :disabled="disabledMap.managedAreaId"
                v-if="canEditForm"
                type="yonghui"
                search
                multiple
                returnNode
                v-model="formData.managedAreaId"
                @change="handleManagedAreaChange">
              </i-select-area>
              <span v-show="!canEditForm">{{formData.managedAreaName}}</span>
            </el-form-item>
            <el-form-item label="部门负责人">
              <el-input
                ref="orgLeader"
                :disabled="disabledMap.leaderName"
                :readonly="true"
                v-show="canEditForm"
                v-model="formData.orgLeader"
                prefix-icon="el-icon-menu"
                @click.native="handlerLeaderDialog">
                <i slot="suffix" class="el-input__icon el-icon-close" @click.stop="clearLeader"></i>
              </el-input>
              <span v-show="!canEditForm">{{formData.orgLeader}}</span>
            </el-form-item>
            <el-form-item label="关键职责">
              <el-input :maxlength="256" :disabled="disabledMap.orgResponsibility" v-show="canEditForm" v-model="formData.orgResponsibility" type="textarea"></el-input>
              <span v-show="!canEditForm">{{formData.orgResponsibility}}</span>
            </el-form-item>
            <el-form-item v-show="confirmBtnsShow" class="form-footer-btn">
              <el-button @click="formBoxShow = false">取消</el-button>
              <el-button type="primary" @click="formConfirm">确定</el-button>
            </el-form-item>
            <el-form-item v-show="editButtonShow" class="form-footer-btn">
              <el-button type="primary" @click="formEditBtn">编辑</el-button>
            </el-form-item>
          </el-form>
          <!-- 复制粘贴板块 -->
          <div v-show="isShowCopyBox" class="copy-box">
            <!-- 复制粘贴列表为空时显示提示信息 -->
            <div class="copy-paste-message" v-show="(copyListShow === true && copyList.length === 0) || (copyListShow === false && pasteList.length === 0)">
              <i class="el-icon-info"></i>
              <span>{{copyPasteMessage}}</span>
            </div>
            <!-- 复制列表 -->
            <ul v-show="copyListShow">
              <li class="copy-item" v-for="(item,index) in copyList" :key="index">
                {{item.data.orgUnitName}}
                <span @click="deleteCopyItem(index)" class="el-icon-remove-outline copy-item-icon"></span>
              </li>
            </ul>
            <!-- 粘贴列表 -->
            <ul v-show="!copyListShow">
              <li class="copy-item" v-for="(item,index) in pasteList" :key="index">
                {{item.data.orgUnitName}}
                <span @click="deletePasteItem(index)" class="el-icon-remove-outline copy-item-icon"></span>
              </li>
            </ul>
          </div>

        <!-- 是否已发公文 -->
        </div>
        <div v-if="showMap.OfficialDocumentChecked" class="is-send-official">
          本次创建的所有组织已发公文
            <el-checkbox v-model="OfficialDocumentChecked" @change="getOfficialDocument"></el-checkbox>
        </div>
        <div v-if="showMap.checkCostCentral" class="is-send-official">
          本次创建的所有组织是否需要设置成本中心
            <el-checkbox v-model="checkCostCentral" @change="setOrgCostCenterTable"></el-checkbox>
        </div>
      </div>
      <!-- 成本中心表格 -->
      <div slot="addListOrgCostCenterTable" v-if="this.checkCostCentral === true"  class="large-box">
        <el-table :data="tableData">
          <el-table-column prop="orgUnitName" label="新建组织"></el-table-column>
          <el-table-column prop="parentUnitName" label="父级组织路径"></el-table-column>
          <el-table-column prop="costCentralId" label="成本中心">
            <template slot-scope="scope">
              <el-form class="cost-central-form" :model="costCentralForm">
                <el-form-item prop="costCentralId">
                  <org-cost-center class="org-cost-center" v-model="scope.row.costCentralId"></org-cost-center>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </div>
      </i-process-flow>
      <!-- 标准组织库弹出框 -->
      <i-dialog
        top="5%"
        title="选择标准组织"
        size="huge"
        v-model="libDialogVisible"
        :toolbar="dialogToolbar">
        <select-lib v-model="standardOrg"></select-lib>
      </i-dialog>
      <!-- 人员选择器 -->
      <i-personnel-select
        ref="iPersonnelSelect"
        :multiple="false"
        :isShow.sync="leaderDialogShow"
        @confirm="leaderDialogConfirm">
        <i class=""></i>
      </i-personnel-select>
  </div>
</template>

<script>
import orgDialog from 'mixins/orgDialog'
import processMixin from 'mixins/process'
import IProcessFlow from 'components/common/i-process-flow'
import DemandDesc from 'components/flow/demand-desc'
import reqTree from 'api/org/tree'
import mixins from './mixins'
import reqOrgDetail from 'api/org/setting'
import SelectLib from 'components/org/lib/select-lib'
import orgCostCenter from 'components/org/public/org-cost-center'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import organization from 'mixins/organization'

export default {
  name: 'OrgAddlistDialog',
  mixins: [orgDialog, processMixin, mixins, organization],
  components: {
    IProcessFlow,
    DemandDesc,
    SelectLib,
    orgCostCenter,
    iPersonnelSelect
  },
  data () {
    return {
      // 保存后台自动选人，储存所有新增节点第一个节点parentId和控制成本中心多选框
      autoSelectEmpDto: {
        parentId: '',
        checkCostCentral: false
      },
      // 保存所有新增节点的最开始状态的data数组
      newAddDataList: [],
      nodeKey: 'orgUnitId',
      // 组织树数据
      treeData: [],
      // 过滤新增节点
      isFilter: false,
      // 标识被冻结组织
      showFreezeOrg: true,
      // 保存当前点击节点的node
      selected: {},
      // 控制整个表单模块是否显示
      formBoxShow: false,
      // 表单标题
      formBoxTitle: '查看组织',
      // 复制粘贴提示信息
      copyPasteMessage: '请在左侧组织树选择节点进行复制',
      // 控制复制按钮是否显示
      titleCopyBtn: true,
      // 控制复制模块是否显示
      isShowCopyBox: false,
      // 控制复制数组是否显示
      copyListShow: true,
      // 控制粘贴下一步按钮显示
      pasteBtnShow: false,
      // 控制新组织或旧组织表单显示隐藏
      canEditForm: false,
      // 表单确定按钮
      confirmBtnsShow: false,
      // 表单编辑按钮
      editButtonShow: false,
      // 标准组织库弹出框显示隐藏
      libDialogVisible: false,
      // 显示标准组织库的职位列表按钮
      showStdTable: false,
      // 部门负责人弹出框显示隐藏
      leaderDialogShow: false,
      // 门店编码显隐
      shopCodeShow: false,
      // 控制所在区域显隐
      showBelongArea: false,
      // 控制管理分区显隐
      showManageArea: false,
      // 保存复制的node数组
      copyList: [],
      // 保存复制的id数组
      copyIdList: [],
      // 保存粘贴的node数组
      pasteList: [],
      // 默认展开节点的keys数组
      defaultExpandedkeys: [],
      // 保存粘贴的id数组
      pasteIdList: [],
      // 标准组织库数据
      standardOrg: {},
      // 组织树新建集合
      sendTreeData: [],
      // 保存整棵树的已展开节点，审批人节点时带出的root
      onlyHasNewNodeTreeData: [],
      // 已经展开的，含有node的组织树(为了拿到回显时默认展开的节点树id)
      hasExpandNodeTree: [],
      // 保存最底层的新增节点
      lastNodeList: [],
      // 流程中心表格数据
      tableData: [],
      // 成本中心list
      costCentralIds: [],
      // 成本中心表单
      costCentralForm: {
        costCentralId: ''
      },
      // 是否已发公文
      isHasOfficialDocument: 'N',
      // 是否已发公文多选框
      OfficialDocumentChecked: false,
      // 成本中心多选框
      checkCostCentral: false,
      // 右侧可输入表单数据
      formData: {
        // parentId: '', // 上级组织id
        // parentUnitName: '', // 上级组织
        // orgUnitName: '', // 组织名称
        // orgShortName: '', // 组织简称
        // orgType: '', // 组织类别
        // orgStandardName: '', // 标准组织库
        // businessType: '', // 业态
        // belongArea: '', // 所在地区
        // managedArea: '', // 管理分区
        // effectiveDate: '', // 生效时间
        // orgResponsibility: '', // 关键职责
        // leaderName: '', // 部门负责人名字
        // employeeId: '', // 部门负责人id
        // costCentralId: ''
      },
      orgStandardTable: {
        columns: [
          {label: '职位名称', prop: 'posTitleName'},
          {label: '所属职群', prop: 'jobClassName'},
          {label: '所属职种', prop: 'subJobClassName'}
        ],
        data: null,
        total: 0,
        info: null,
        showPagebar: true
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
      isCopyFinish: false
    }
  },
  methods: {
    postFlow () {
      this.sendTreeData = this.getSendTree()
      this.handlerNewTreeEffectiveDate(this.sendTreeData)
      this.eachOrgUnitMaintainListGetTreeNode(this.hasExpandNodeTree, this.lastNodeList)
      this.getDefaultExpandIdList(this.lastNodeList)
      this.onlyHasNewNodeTreeData = this.getNodeChldren(this.$refs.tree.root.childNodes)
      // 成本中心
      this.costCentralIds = this.tableData.map(item => {
        return item.costCentralId
      })
      return Object.assign({},
        {
          orgUnitMaintainList: this.sendTreeData,
          isHasOfficialDocument: this.isHasOfficialDocument,
          onlyHasNewNodeTreeData: this.onlyHasNewNodeTreeData,
          descModel: this.descModel,
          tableData: this.tableData,
          costCentralIds: this.costCentralIds,
          defaultExpandedkeys: this.defaultExpandedkeys,
          checkCostCentral: this.checkCostCentral,
          operateType: '8'
        }
      )
    },
    fillIn (data) {
      this.defaultExpandedkeys = data.defaultExpandedkeys
      this.isHasOfficialDocument = data.isHasOfficialDocument
      this.sendTreeData = data.orgUnitMaintainList
      this.tableData = data.tableData
      this.treeData = data.onlyHasNewNodeTreeData
      this.onlyHasNewNodeTreeData = data.onlyHasNewNodeTreeData
      this.descModel = data.descModel
      this.checkCostCentral = data.checkCostCentral
      // 财务团队显示成本中心表格
      if (this.taskKey === 'finance') {
        this.handlerTableData(this.sendTreeData)
      }
      // 审批人节点如果不做任何操作,form表z单会触发校验,让表单默认等于一个节点的数据,避免审批不了流程
      this.formData = data.orgUnitMaintainList[0].data
    },

    // 点击组织树
    nodeClick (data, node) {
      this.formBoxShow = true
      this.selected = node
      this.formData.createPosition = true
      if (this.isShowCopyBox === true) { // 如果当前状态是复制粘贴状态
        this.isShowCopyBox = true
      } else {
        if (data.isNew) {
          if (data.nodeType) {
            if (typeof data.orgCopyUnitId === 'number') { // 复制过来的新增节点
              data.parentOrgType = node.parent.data.orgType
              this.asyncGetTypeData(data).then(typeData => {
                this.canEditForm = false
                this.confirmBtnsShow = false
                this.editButtonShow = true
                this.formData = Object.assign({}, data, {
                  superReportingDeptId: node.parent.data.orgUnitId,
                  superReportingDept: node.parent.data.orgUnitName,
                  parentOrgTypeName: typeData.parentOrgTypeName
                })
              })
            } else if (typeof data.orgCopyUnitId === 'string') { // 复制过来的原节点
              this.canEditForm = false
              this.confirmBtnsShow = false
              this.editButtonShow = true
              if (data.nodeType === 'copyNodeEdited') { // 复制过来的节点已经被修改过
                data.parentOrgType = node.parent.data.orgType
                this.asyncGetTypeData(data).then(typeData => {
                  this.formData = Object.assign({}, data, {
                    parentOrgTypeName: typeData.parentOrgTypeName
                  })
                })
              } else if (data.nodeType === 'copyNodeNotEdit') { // 复制过来的节点没有被修改过
                reqOrgDetail('echoDetail', {id: data.orgCopyUnitId}).then(orgData => {
                  orgData.parentOrgType = node.parent.data.orgType
                  this.asyncGetTypeData(orgData).then(typeData => {
                    this.asyncGetAreaData(orgData).then(areaData => {
                      // 处理复制过来的节点上级不是复制节点，上级汇报部门会拿不到orgCopyUnitId
                      let parentId = typeof node.parent.data.orgUnitId === 'string' ? node.parent.data.orgUnitId : node.parent.data.orgCopyUnitId
                      this.formData = Object.assign({}, orgData, data, {
                        orgTypeName: typeData.orgTypeName,
                        businessTypeName: typeData.businessTypeName,
                        sapOrgTypeName: typeData.sapOrgTypeName,
                        sapDeptPropName: typeData.sapDeptPropName,
                        superReportingDept: node.parent.data.orgUnitName,
                        superReportingDeptId: parentId,
                        parentOrgTypeName: typeData.parentOrgTypeName,
                        shopTypeName: orgData.shopCode,
                        belongAreaName: areaData[0].areaPathName,
                        belongArea: areaData[0].areaCode,
                        belongAreaId: areaData[0].areaId,
                        managedAreaName: areaData[1].names,
                        managedArea: areaData[1].codes,
                        managedAreaId: areaData[1].ids
                      })
                      if (orgData.orgStandardId) {
                        this.standardOrg.orgStandardId = orgData.orgStandardId
                        this.orgStandarFetch()
                      }
                      // 折中办法，复制粘贴以后的节点没有请求，节点的data没有业态等数据
                      this.selected.data = this.formData
                    })
                  })
                })
              }
            }
          } else if (!data.nodeType) {
            if (data.canEditNode === true) { // 新增未修改
              data.parentOrgType = node.parent.data.orgType
              this.asyncGetTypeData(data).then(typeData => {
                this.canEditForm = true
                this.confirmBtnsShow = true
                this.editButtonShow = false
                this.formData = Object.assign({}, data, {
                  parentOrgTypeName: typeData.parentOrgTypeName
                })
                if (this.formData.orgStandardId) {
                  this.standardOrg.orgStandardId = this.formData.orgStandardId
                  this.orgStandarFetch()
                } else {
                  this.orgStandardTable.data = []
                  this.showStdTable = false
                }
              })
            } else if (data.canEditNode === false) { // 新增已修改
              data.parentOrgType = node.parent.data.orgType
              this.asyncGetTypeData(data).then(typeData => {
                this.canEditForm = false
                this.confirmBtnsShow = false
                this.editButtonShow = true
                this.formData = Object.assign({}, data, {
                  parentOrgTypeName: typeData.parentOrgTypeName
                })
                if (this.formData.orgStandardId) {
                  this.standardOrg.orgStandardId = this.formData.orgStandardId
                  this.orgStandarFetch()
                } else {
                  this.orgStandardTable.data = []
                  this.showStdTable = false
                }
              })
            }
          }
        } else { // 原节点
          this.canEditForm = false
          this.confirmBtnsShow = false
          this.editButtonShow = false
          reqOrgDetail('echoDetail', {id: data.orgUnitId}).then(orgData => {
            orgData.parentOrgType = node.parent.data ? node.parent.data.orgType : ''
            this.asyncGetTypeData(orgData).then(typeData => {
              this.asyncGetAreaData(orgData).then(areaData => {
                this.formData = Object.assign({}, orgData, {
                  orgTypeName: typeData.orgTypeName,
                  businessTypeName: typeData.businessTypeName,
                  sapOrgTypeName: typeData.sapOrgTypeName,
                  sapDeptPropName: typeData.sapDeptPropName,
                  parentOrgTypeName: typeData.parentOrgTypeName,
                  shopTypeName: orgData.shopCode,
                  belongAreaName: areaData[0].areaPathName,
                  managedAreaName: areaData[1].names
                })
              })
            })
          })
        }
      }
    },

    // 多选框改变
    treeCheckChange (data, checked) {
      let node = this.$refs.tree.store.getNode(data)
      // 如果是复制状态那么多选框选中就push到copyListShow里面
      if (this.copyListShow === true) {
        this.expandchildren(node)
        if (checked === true) {
          this.copyList.push(node)
          this.disabledChildrenStatus(node, checked)
        } else {
          let copyListIndex = this.copyList.findIndex(item => {
            return data.orgUnitId === item.data.orgUnitId
          })
          // 如果触发单个删除按钮以后copyList会删除那一条数据，
          // 导致这里的copyListIndex在copyList找不到当前数据，
          // 从而再次触发多选框改变事件，返回-1，
          // 删除copyList最后一条数据，页面显示不正常
          if (copyListIndex !== -1) {
            this.copyList.splice(copyListIndex, 1)
          }
          this.disabledChildrenStatus(node, checked)
        }
      } else {
        if (checked === true) {
          this.copyList.forEach(item => {
            if (item.data.orgUnitId === data.orgUnitId) {
              this.$message({
                type: 'info',
                message: data.orgUnitName + '不能粘贴到自身组织'
              })
              node.checked = false
              return false
            }
          })
          this.pasteList.push(node)
        } else {
          let pasteListIndex = this.pasteList.findIndex(item => {
            return data.orgUnitId === item.data.orgUnitId
          })
          if (pasteListIndex !== -1) {
            this.pasteList.splice(pasteListIndex, 1)
          }
        }
      }
    },

    // 勾选时展开子节点
    expandchildren (node) {
      node.expand(() => {
        node.childNodes.forEach(item => {
          if (item.isLeaf === false) {
            this.expandchildren(item)
          }
        })
      })
    },

    // 显示复制模块，点击复制按钮
    showCopyBox () {
      this.formBoxTitle = '复制组织'
      this.copyPasteMessage = '请在左侧组织树选择节点进行复制'
      this.isShowCopyBox = true
      this.formBoxShow = true
      this.pasteBtnShow = true
      this.copyAndPasteBtnShow = false
      this.titleCopyBtn = false
      this.copyListShow = true
      this.isCopyFinish = false
      this.copyList = []
      this.copyIdList = []
      this.pasteList = []
      this.pasteIdList = []
      this.showTreeCheckboxs()
    },

    // 复制模块 单个元素删除按钮
    deleteCopyItem (index) {
      this.copyList.splice(index, 1)
      this.copyIdList = this.copyList.map(item => {
        return item.data.orgUnitId
      })
      // tree实例方法，传入id数组，点击右边删除按钮时，同时控制左边多选框的状态
      this.$refs.tree.setCheckedKeys(this.copyIdList)
    },

    // 粘贴模块 单个元素删除按钮
    deletePasteItem (index) {
      this.pasteList.splice(index, 1)
      this.pasteIdList = this.pasteList.map(item => {
        return item.data.orgUnitId
      })
      // tree实例方法，传入id数组，点击右边删除按钮时，同时控制左边多选框的状态
      this.$refs.tree.setCheckedKeys(this.pasteIdList)
    },

    // 下一步，粘贴按钮
    nextPaste () {
      if (this.copyList.length) {
        this.formBoxTitle = '粘贴组织'
        this.copyPasteMessage = '请在左侧组织树选择节点进行粘贴'
        this.pasteBtnShow = false
        this.copyListShow = false
        this.copyAndPasteBtnShow = true
        this.$refs.tree.setCheckedKeys([])
        this.copyList.forEach(item => {
          this.disabledChildrenStatus(item, false)
        })
        this.$message({
          type: 'success',
          message: '已复制选中节点，请选择节点进行粘贴'
        })
      } else {
        this.$message({
          type: 'info',
          message: '请先选择目标节点进行复制'
        })
      }
    },

    // 关闭，取消按钮点击
    colseBtnClick () {
      // 关闭右边表单，将复制模块隐藏，避免再次点击节点时不能显示表单
      this.formBoxShow = false
      this.isShowCopyBox = false
      this.titleCopyBtn = true
      this.pasteBtnShow = false
      this.copyAndPasteBtnShow = false
      // 清空复制粘贴数组，重置多选框状态
      this.copyList = []
      this.pasteList = []
      this.copyIdList = []
      this.pasteIdList = []
      this.$refs.tree.setCheckedKeys(this.pasteIdList)
      this.hideTreeCheckboxs()
    },

    // 粘贴确定按钮
    pasteTreeItem () {
      this.isCopyFinish = false
      this.asyncPaste()
    },

    // 异步粘贴
    asyncPaste () {
      if (this.pasteList.length) {
        this.pasteList.forEach((item, index) => {
          item.expand(() => {
            this.pasteNode(item, this.copyList)
          })
        })
      } else {
        this.$message({
          type: 'info',
          message: '请先选择目标节点进行粘贴'
        })
      }
    },

    // 粘贴
    pasteNode (targetNode, copyNodeList, firstIndex = null, firstArr = null) {
      copyNodeList.forEach((item, index, arr) => {
        let theIndex = firstIndex || index
        let theArr = firstArr || arr
        let newNode = {
          data: {
            ...item.data,
            parentId: targetNode.data.orgUnitId,
            isNew: true,
            orgCopyUnitId: item.data.orgUnitId,
            orgUnitId: Date.now() + parseInt(Math.random() * 10000),
            parentUnitName: targetNode.data.orgUnitName,
            nodeType: 'copyNodeNotEdit',
            canEditNode: false,
            createPosition: true
          }
        }
        targetNode.insertChild(newNode)
        if (item.childNodes && item.childNodes.length) {
          let targetChildrenList = []
          targetChildrenList = this.filterCopyChildren(targetNode)
          let targetChildrenListIndex = targetChildrenList.findIndex(targetChildrenItem => {
            return item.data.orgUnitId === targetChildrenItem.data.orgCopyUnitId
          })
          targetChildrenList[targetChildrenListIndex].expand(() => {
            this.pasteNode(targetChildrenList[targetChildrenListIndex], item.childNodes, theIndex, theArr)
          })
        } else if (!item.childNodes.length && theArr.length - 1 === theIndex) {
          this.isCopyFinish = true
        }
      })
    },

    // 过滤出目标节点的含有idNew的节点(便于调用pasteNode方法传入taregt)
    filterCopyChildren (target) {
      return target.childNodes.filter(item => {
        if (item.data.isNew) {
          return item
        }
      })
    },

    // 表单确定按钮
    formConfirm () {
      if (this.formData.nodeType === 'copyNodeNotEdit') {
        this.formData.nodeType = 'copyNodeEdited'
      }
      this.selected.data = Object.assign({}, this.formData)
      this.selected.data.canEditNode = false
      this.canEditForm = false
      this.confirmBtnsShow = false
      this.editButtonShow = true
    },

    // 表单编辑按钮
    formEditBtn () {
      this.selected.data.canEditNode = true
      this.confirmBtnsShow = true
      this.editButtonShow = false
      this.canEditForm = true
    },

    // 增加节点
    appendNode (data, node) {
      return new Promise((resolve, reject) => {
        let id = Date.now()
        let addTreeNodeData = {
          orgUnitId: id,
          orgUnitName: '新增组织',
          parentUnitName: data.orgUnitName,
          parentId: data.orgUnitId,
          parentOrgType: data.orgType,
          canEditNode: true,
          isNew: true,
          effectiveDate: this.descModel.effectiveDate,
          superReportingDeptId: data.orgUnitId,
          superReportingDept: data.orgUnitName
        }
        this.newAddDataList.push(addTreeNodeData)
        this.autoSelectEmpDto.parentId = this.newAddDataList[0].parentId
        let newAddDataListIdList = this.newAddDataList.map(item => {
          return item.parentId
        }) + ''
        reqOrgDetail('validateCluster', {str: newAddDataListIdList}).then(clusterResult => {
          if (clusterResult) {
            // 如果当前node有childNodes就node.insertChild 否则如果没有childNodes就在node.expand方法中添加节点
            if (node.childNodes.length) {
              node.expand(() => {
                // 源代码添加节点方法
                let newChild = { data: addTreeNodeData }
                node.insertChild(newChild)
                resolve()
              })
            } else {
              node.expand(() => {
                let newChild = { data: addTreeNodeData }
                node.insertChild(newChild)
                resolve()
              })
            }
          } else {
            this.$message({
              type: 'info',
              message: '请在同一集群下添加组织'
            })
          }
        })
      })
    },

    // 异步添加节点，添加节点以后隐藏多选框
    asyncAppendNode (data, node) {
      this.appendNode(data, node).then(() => {
        this.$nextTick(() => {
          if (this.isShowCopyBox === false) {
            this.hideTreeCheckboxs()
          }
        })
      })
    },

    // 删除节点
    deleteNode (data, node) {
      this.$nextTick(() => {
        let index = node.parent.childNodes.findIndex(item => { return item.id === node.id })
        node.parent.childNodes.splice(index, 1)
        this.closeFormBox = true
        this.formBoxShow = false
        if (!node.parent.childNodes.length) {
          node.parent.isLeaf = true
        }
      })
    },

    // 标准组织库input左边图标点击
    showSelectLib () {
      this.libDialogVisible = true
    },

    // 标准组织库确定
    setLib () {
      Promise.all([
        this.$d('ORG_TYPE', this.standardOrg.orgType),
        this.$d('ORG_BUSINESS_TYPE', this.standardOrg.businessType)
      ]).then(typeData => {
        this.formData = Object.assign({}, this.formData, {
          orgUnitName: this.standardOrg.orgStandardName,
          orgShortName: this.standardOrg.orgStandardName,
          orgType: this.standardOrg.orgType,
          orgTypeName: typeData[0],
          businessType: this.standardOrg.businessType,
          businessTypeName: typeData[1],
          orgStandardName: this.standardOrg.orgStandardName,
          orgStandardId: this.standardOrg.orgStandardId,
          createPosition: true
        })
        this.orgStandarFetch()
        this.showStdTable = true
        this.closeSelectLibDialog()
      })
    },

    // 改变是否设置职位
    setCreatePosition (value) {
      this.formData.createPosition = value
    },

    // 标准组织库清空按钮
    clearStandardLib () {
      this.formData.orgStandardName = ''
      this.formData.orgStandardId = ''
      this.orgStandardTable.data = []
      this.showStdTable = false
    },

    // 标准组织库表格查询
    orgStandarFetch (options = {}) {
      reqOrgDetail('getStdPosition', {stdOrgId: this.standardOrg.orgStandardId, ...options}).then(data => {
        this.orgStandardTable = Object.assign({}, this.orgStandardTable, data)
      })
    },

    // 标准组织库页码大小
    handleSizeChange (options) {
      this.orgStandarFetch(options)
    },

    // 标准组织库分页切换
    handleCurrentChange (options) {
      this.orgStandarFetch(options)
    },

    // 所在区域input改变时
    handleBelongAreaChange (data, value) {
      this.formData.belongAreaId = data.areaId
      this.formData.belongArea = data.areaCode
      this.formData.belongAreaName = value
    },

    // 管理分区input改变时
    handleManagedAreaChange (data, value) {
      this.formData.managedArea = data.map(item => {
        return item.areaCode
      }).toString()
      this.formData.managedAreaId = data.map(item => {
        return item.areaId
      })
      this.formData.managedAreaName = value.join(',')
    },

    // 部门负责人弹出框确定按钮
    leaderDialogConfirm (selected) {
      this.formData.orgLeaderId = selected[0].employeeId
      this.formData.orgLeader = selected[0].employeeName
    },

    clearLeader () {
      this.$set(this.formData, 'orgLeaderId', '')
      this.$set(this.formData, 'orgLeader', '')
      this.$forceUpdate()
    },

    // 树节点内容内容渲染
    renderContent (h, {data, node}) {
      let highlightFreeze = data.status === '2' && this.showFreezeOrg
      return (
        <div style='line-height:36px'>
          <span style={'margin-right: 5px;'} class={(highlightFreeze ? 'iconfont icon-lock' : '')}></span>
          <span style={(data.isNew === true ? 'color: #EB6709;' : 'color: #333333;') + (highlightFreeze ? 'color:#d8d8d8;' : '')} >{data.orgUnitName}</span>
          <span
            v-show={this.taskKey === 'undefined' || this.taskKey === 'hrGroupComplementId' || this.taskKey === 'applyId'}
            on-click = {() => { this.asyncAppendNode(data, node) }}
            style="font-size:16px;color:#3DA5FE;margin-left:20px;"
            class="el-icon-circle-plus-outline tree-icon">
          </span>
          <span
            v-show={ data.isNew === true && (this.taskKey === 'applyId' || this.taskKey === 'undefined' || this.taskKey === 'hrGroupComplementId')}
            on-click= {() => { this.deleteNode(data, node) }}
            style="font-size:16px;color :#3DA5FE;margin-left:20px;"
            class="el-icon-remove-outline tree-icon">
          </span>
          <span v-show={node.id === this.selected.id} class="el-icon-caret-right" style="color:#3DA5FE;font-size:16px;position:absolute;right:20px;top:10px;z-index:8;">
          </span>
        </div>
      )
    },

    // 请求组织树方法
    getTreeRoot () {
      return reqTree(this.requestUrls.root.url, {}).then(data => {
        return data
      })
    },

    // 门店编码搜索
    shopTypeSearch (queryString, callback) {
      reqOrgDetail('getShopType', {codeOrName: queryString}).then(data => {
        callback(data)
      })
    },

    // 门店编码选择
    shopTypeSelect (item) {
      this.formData.shopCode = item.code
      this.formData.shopTypeName = item.code + ':' + item.name
    },

    // 部门负责人图标点击打开dialog
    handlerLeaderDialog () {
      this.leaderDialogShow = !this.leaderDialogShow
      this.$refs.iPersonnelSelect.resetData()
    },

    // 节点过滤
    filterNode (value, data) {
      return value ? data.isNew : true
    },

    // 懒加载组织树
    loadData (node, resolve) {
      if (node.level === 0) {
        this.getTreeRoot().then(data => {
          if (this.taskKey === 'undefined') {
            resolve(data)
          } else {
            resolve(this.treeData)
          }
        }).then(() => {
          this.$nextTick(() => {
            this.$refs.tree.root.childNodes.forEach(node => {
              node.expand(() => {
                // 在审批人节点加载完组织树以后，隐藏多选框
                this.$nextTick(() => {
                  if (this.isShowCopyBox === true) {
                    this.showTreeCheckboxs()
                  } else {
                    this.hideTreeCheckboxs()
                  }
                })
              })
            })
          })
        })
      } else {
        if (node.data.children && node.data.children.length > 0) {
          resolve(node.data.children)
        } else {
          if (node.data.isNew) {
            resolve([])
            return
          }
          let nodeKey = node.data.isNew ? 'orgCopyUnitId' : 'orgUnitId'
          reqTree(this.requestUrls.children.url, {id: node.data[nodeKey]}).then(data => {
            resolve(data)
            if ((node.checked === true || node.data.disabled === true) && this.copyListShow === true) {
              this.disabledChildrenStatus(node, node.checked || node.disabled)
            }

            // 加载完子节点后隐藏多选框
            this.$nextTick(() => {
              if (this.isShowCopyBox === true) {
                this.showTreeCheckboxs()
              } else {
                this.hideTreeCheckboxs()
              }
            })

            // 如果加载子节点时父级是被复制过来的,就处理所有子节点
            if (node.data.isNew) {
              node.childNodes.forEach(item => {
                item.data = Object.assign({}, item.data, {
                  parentId: node.data.orgUnitId,
                  isNew: true,
                  orgCopyUnitId: item.data.orgUnitId,
                  orgUnitId: Date.now() + parseInt(Math.random() * 10000),
                  parentUnitName: node.data.orgUnitName,
                  nodeType: 'copyNodeNotEdit',
                  canEditNode: false
                })
              })
            }
          }).catch(() => {
            resolve([])
          })
        }
      }
    },

    // 递归改变所有新增组织的生效时间
    handlerNewTreeEffectiveDate (newTreeData) {
      newTreeData.forEach(item => {
        item.data.effectiveDate = this.descModel.effectiveDate
        if (item.childNodes && item.childNodes.length) {
          this.handlerNewTreeEffectiveDate(item.childNodes)
        }
      })
    },

    // 获得所有发送到后台的新增节点数组
    getSendTree () {
      const root = this.$refs.tree.root
      const rootNode = Object.assign({}, root.childNodes[0]) // 获取根节点
      let result = []
      this.filterNewNode(Object.assign({}, rootNode), result)
      result = this.formatParams(result)
      return result
    },

    // 递归新增组织树, 过滤出所有新增节点(递归childNodes)
    filterNewNode (node, result) {
      node.childNodes.forEach(item => {
        if (item.data.isNew) {
          result.push(Object.assign({}, item))
          // 保存含有node的已经展开的组织树(回显时方便拿到新增节点的所有父级id，默认展开)
          this.hasExpandNodeTree.push(Object.assign({}, item))
        } else {
          if (item.childNodes && item.childNodes.length > 0) {
            this.filterNewNode(item, result)
          }
        }
      })
    },

    // 过滤所有新增节点，控制组织树子节点的childNodes只有data和childNodes(递归childNodes)
    formatParams (nodes) {
      // 过滤出节点只有data和childNodes属性，因为节点的parent会无限展开，json转化时会解析不了
      return nodes.map(childNode => {
        let childNodes = []
        if (childNode.childNodes.length) {
          childNodes = this.formatParams(childNode.childNodes)
        }
        return {
          data: Object.assign({}, childNode.data),
          childNodes
        }
      })
    },

    // 拿到所有新增组织的最底层节点
    eachOrgUnitMaintainListGetTreeNode (nodes, lastNodeList) {
      nodes.forEach(item => {
        if (item.childNodes && item.childNodes.length) {
          this.eachOrgUnitMaintainListGetTreeNode(item.childNodes, lastNodeList)
        }
        lastNodeList.push(item)
      })
    },

    // 遍历最底层节点
    getDefaultExpandIdList (nodeList) {
      nodeList.forEach(item => {
        this.eachOrgUnitMaintainListGetTreeIds(item)
      })
    },

    // 遍历最底层节点，拿到最底层节点的所有父级id，回显时就能默认展开新增的节点
    eachOrgUnitMaintainListGetTreeIds (node) {
      this.defaultExpandedkeys.push(node.data.parentId)
      if (node.parent && node.parent.level !== 1) {
        this.eachOrgUnitMaintainListGetTreeIds(node.parent)
      }
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

    // 是否已发公文
    getOfficialDocument () {
      if (this.OfficialDocumentChecked === true) {
        this.isHasOfficialDocument = 'Y'
      } else {
        this.isHasOfficialDocument = 'N'
      }
    },

    // 控制成本中心是否在财务团队显示
    setOrgCostCenterTable (checked) {
      this.checkCostCentral = checked
      this.autoSelectEmpDto.checkCostCentral = checked
    },

    // 改变成本中心table数据,递归每个新增节点,显示成本中心表格
    handlerTableData (nodes) {
      nodes.forEach(item => {
        this.tableData.push(item.data)
        if (nodes.length) {
          this.handlerTableData(item.childNodes)
        }
      })
    }
  },
  created () {
  },
  mounted () {

  },
  updated () {
  },
  computed: {

  },
  watch: {
    'formData.shopTypeName': {
      handler (value) {
        if (!this.formData.shopTypeName) {
          this.formData.shopCode = ''
        }
      }
    },
    copyList () {
      if (this.copyList.length > 0) {
        this.copyPasteMessageShow = false
      } else {
        this.copyPasteMessageShow = true
      }
    },
    // 改变新增节点的下级节点的parentUnitName
    'formData.orgUnitName': {
      handler () {
        let node = this.selected
        if (node.childNodes && node.childNodes.length) {
          node.childNodes.forEach(item => {
            item.data.parentUnitName = this.formData.orgUnitName
          })
        }
      }
    },
    'formData.orgType': {
      handler () {
        if (this.formData.orgType === '6') { // 管理分区显示
          this.showManageArea = true
          this.showBelongArea = false
          this.shopCodeShow = false
          if (!this.formData.managedAreaId) {
            this.formData.managedAreaId = []
          }
          this.formData.belongArea = ''
          this.formData.belongAreaId = ''
          this.formData.belongAreaName = ''
        } else if (this.formData.orgType === '7' && parseInt(this.formData.businessType) <= 5) { // 门店
          this.showBelongArea = true
          this.showManageArea = false
          this.shopCodeShow = true
          this.formData.managedArea = ''
          this.formData.managedAreaId = []
          this.formData.managedAreaName = ''
        } else if (this.formData.orgType === '8' && parseInt(this.formData.businessType) <= 5) { // 小店
          this.showBelongArea = true
          this.showManageArea = false
          this.shopCodeShow = false
          if (this.selected.data.isNew) {
            if (this.selected.parent.data.orgType === '7' && parseInt(this.selected.parent.data.businessType) <= 5) {
              if (this.selected.parent.data.isNew) {
                this.formData = Object.assign({}, this.formData, {
                  belongAreaName: this.selected.parent.data.belongAreaName,
                  belongArea: this.selected.parent.data.belongArea,
                  belongAreaId: this.selected.parent.data.belongAreaId
                })
              } else if (this.selected.data.isNew) {
                reqOrgDetail('echoDetail', {id: this.selected.data.parentId}).then(orgData => {
                  this.asyncGetAreaData(orgData).then(areaData => {
                    this.formData = Object.assign({}, this.formData, {
                      belongAreaName: areaData[0].areaPathName,
                      belongArea: areaData[0].areaCode,
                      belongAreaId: areaData[0].areaId
                    })
                  })
                })
              }
            }
          }
        } else {
          this.showBelongArea = false
          this.showManageArea = false
          this.shopCodeShow = false
          this.formData.belongArea = ''
          this.formData.belongAreaName = ''
          this.formData.belongAreaId = ''
        }
      }
    },
    'formData.businessType': {
      handler () {
        if (this.formData.orgType === '7' && parseInt(this.formData.businessType) <= 5) {
          this.showBelongArea = true
          this.shopCodeShow = true
        } else if (this.formData.orgType === '8' && parseInt(this.formData.businessType) <= 5) {
          this.showBelongArea = true
          this.showManageArea = false
          if (this.selected.data.isNew) {
            if (this.selected.parent.data.orgType === '7' && parseInt(this.selected.parent.data.businessType) <= 5) {
              if (this.selected.parent.data.isNew) {
                this.formData = Object.assign({}, this.formData, {
                  belongAreaName: this.selected.parent.data.belongAreaName,
                  belongArea: this.selected.parent.data.belongArea,
                  belongAreaId: this.selected.parent.data.belongAreaId
                })
              } else if (this.selected.data.isNew) {
                reqOrgDetail('echoDetail', {id: this.selected.data.parentId}).then(orgData => {
                  this.asyncGetAreaData(orgData).then(areaData => {
                    this.formData = Object.assign({}, this.formData, {
                      belongAreaName: areaData[0].areaPathName,
                      belongArea: areaData[0].areaCode,
                      belongAreaId: areaData[0].areaId
                    })
                  })
                })
              }
            }
          }
        } else {
          this.showBelongArea = false
          this.shopCodeShow = false
          this.formData.belongArea = ''
          this.formData.belongAreaName = ''
          this.formData.belongAreaId = ''
        }
      }
    },
    formData: {
      handler () {
        if (this.showBelongArea === false && this.showManageArea === false) {
          this.formRules.belongArea[0].required = false
          this.formRules.managedArea[0].required = false
        } else if (this.showBelongArea === true && this.showManageArea === false) {
          this.formRules.belongArea[0].required = true
          this.formRules.managedArea[0].required = false
        } else if (this.showBelongArea === false && this.showManageArea === true) {
          this.formRules.belongArea[0].required = false
          this.formRules.managedArea[0].required = true
        }
      },
      deep: true
    },
    isFilter (val) {
      this.$refs.tree.filter(val)
    },
    isCopyFinish (val) {
      if (val) {
        this.$nextTick(() => {
          this.hideTreeCheckboxs()
          this.copyAndPasteBtnShow = false
          this.titleCopyBtn = true
          this.isShowCopyBox = false
          this.formBoxShow = false
          this.$refs.tree.setCheckedKeys([])
          this.$message({
            type: 'success',
            message: '已成功粘贴'
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./style.scss"
</style>
