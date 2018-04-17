<template>
  <div class="wrap">
    <i-process-flow
      @err="err"
      processType="organizationCreateFlowNew"
      :model="formData"
      @fillin="fillIn">
      <demand-desc
        dateSelectType="month"
        action="组织新增"
        :model="descModel"
        slot="requirementsDescribe">
      </demand-desc>
      <!-- 组织树和表单 -->
      <div class="container" slot="maintainSubsidiary">
        <h3 class="info-title">创建组织</h3>
        <!-- 组织树 -->
        <div class="box">
          <div style="background: #F8F8F8;padding-left: 20px;">
            <el-checkbox v-model="showFreezeOrg">标识已冻结的组织</el-checkbox>
          </div>
          <el-tree
            ref="tree"
            node-key="orgUnitId"
            @node-click="nodeClick"
            :expand-on-click-node="false"
            :props="defaultProps"
            :render-content="renderContent"
            :default-expanded-keys="defaultExpandedkeys"
            auto-expand-parent
            :load="loadData"
            lazy>
          </el-tree>
        </div>
        <!-- 表单 -->
        <div class="box form-box" v-if="formBoxShow">
          <div class="box-title">
            <span>{{formBoxTitle}}</span>
            <span class="el-icon-close" @click="formboxClose"></span>
          </div>
          <el-form 
            :rules="formRules"
            :style="(confirmAndCancelBtnShow === true || editBtnShow === true) ? 'height:560px' : 'height:610px'"
            ref="form"
            :model="formData"
            label-width="136px">
            <el-form-item label="上级组织">
              <span>{{formData.parentUnitName}}</span>
            </el-form-item>
            <el-form-item label="上级组织类别">
              <span>{{formData.parentOrgTypeName}}</span>
            </el-form-item>
            <el-form-item v-show="canEditForm" style="height: 50px;" label="标准组织库">
              <el-input style="width:280px;" v-model="formData.orgStandardName" readonly>
                <el-button  slot="prepend" icon="el-icon-menu" @click="showSelectLib"></el-button>
                <i
                slot="suffix"
                class="el-icon-close el-input__icon"
                @click="clearStandardLib">
                </i>
              </el-input>
              <!-- 职位表格 -->
              <!--  -->
              <el-popover
                v-show="showStdTable"
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
                :disabled="disabledMap.shopCode"
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
              <el-input :maxlength="32" v-show="canEditForm" v-model="formData.orgUnitName"></el-input>
              <span v-show="!canEditForm">{{formData.orgUnitName}}</span>
            </el-form-item>
            <el-form-item label="组织简称" prop="orgShortName">
              <el-input :maxlength="32" v-show="canEditForm" v-model="formData.orgShortName"></el-input>
              <span v-show="!canEditForm">{{formData.orgShortName}}</span>
            </el-form-item>
            <el-form-item label="组织类别" prop="orgType">
              <i-select
                 v-show= 'canEditForm || !formData.orgType'   
                v-model="formData.orgType"
                parameter="ORG_TYPE"
               >
              </i-select>
              <span v-show="!canEditForm">{{formData.orgTypeName}}</span>
            </el-form-item>
            <el-form-item label="业态" prop="businessType">
              <i-select  
               v-show= 'canEditForm || !formData.businessType'           
                v-model="formData.businessType"
                parameter="ORG_BUSINESS_TYPE">
              </i-select>
              <span v-show="!canEditForm">{{formData.businessTypeName}}</span>
            </el-form-item>
            <el-form-item label="组织类型" prop="sapOrgType">
              <i-select
              v-show= 'canEditForm || !formData.sapOrgType'
                v-model="formData.sapOrgType"
                parameter="SAP_ORG_TYPE">
              </i-select>
              <span v-show="!canEditForm">{{formData.sapOrgTypeName}}</span>
            </el-form-item>
            <el-form-item label="部门属性" prop="sapDeptProp">
              <i-select
              v-show= 'canEditForm || !formData.sapDeptProp'
                v-model="formData.sapDeptProp"
                parameter="SAP_DEPT_PROP">
              </i-select>
              <span v-show="!canEditForm">{{formData.sapDeptPropName}}</span>
            </el-form-item>
            <el-form-item label="上级汇报部门" prop="superReportingDeptId">
              <i-select-tree
                v-show="canEditForm"
                dataKey="org"
                nodeKey="orgUnitId"
                v-model="formData.superReportingDeptId"
                :selectedNode.sync="selectedNode"
                @node-click="orgSelectTreeClick">
              </i-select-tree>
              <span v-show="!canEditForm">{{formData.superReportingDept}}</span>
            </el-form-item>
            <el-form-item ref="belongArea" v-show="showBelongArea" label="所在区域" prop="belongArea">
              <i-select-area
                v-show="canEditForm"
                type="yonghui"
                search
                returnNode
                v-model="formData.belongAreaId"
                @change="handleBelongAreaChange">
              </i-select-area>
              <span v-show="!canEditForm">{{formData.belongAreaName}}</span>
            </el-form-item>
            <el-form-item ref="manageArea" v-show="showManageArea" label="管理区域" prop="managedArea">
              <i-select-area
                v-show="canEditForm"
                type="yonghui"
                search
                multiple
                returnNode
                v-model="formData.managedAreaId"
                @change="handleManagedAreaChange">
              </i-select-area>
              <span v-show="!canEditForm">{{formData.managedAreaName}}</span>
            </el-form-item>
            <!-- <el-form-item label="分管门店">
              <manage-shop v-model="formData.manageShopDto"></manage-shop>
            </el-form-item> -->
            <el-form-item label="部门负责人">
              <el-input
                v-show="canEditForm"
                readonly
                v-model="formData.leaderName"
                suffix-icon="el-icon-menu"
                @click.native="handlerLeaderDialog">
              </el-input>
              <span v-show="!canEditForm">{{formData.orgLeader}}</span>
            </el-form-item>
            <el-form-item label="关键职责">
              <el-input :maxlength="256" v-show="canEditForm" v-model="formData.orgResponsibility" type="textarea"></el-input>
              <span v-show="!canEditForm">{{formData.orgResponsibility}}</span>
            </el-form-item>
            <el-form-item v-if="this.taskKey === 'finance' && checkCostCentral === true" label="成本中心" prop="costCentralId">
              <org-cost-center class="org-cost-center" v-model="formData.costCentralId"></org-cost-center>
            </el-form-item>
          </el-form>
          <div v-show="formBoxFooterShow" class="form-box-footer">
            <el-button v-show="confirmAndCancelBtnShow" type="primary" @click="formBoxConfirm">确定</el-button>
            <el-button v-show="confirmAndCancelBtnShow" @click="formboxClose">取消</el-button>
            <el-button v-show="editBtnShow" @click="editBtnClick" type="primary">编辑</el-button>
          </div>
        </div>
        <!-- 是否已发公文 -->
        <div v-if="showMap.isHasOfficialDocument" class="officialDocument">
          本次新增组织是否已发公文
          <el-checkbox v-model="isHasOfficialDocument"></el-checkbox>
        </div>
        <!-- 是否设置成本中心 -->
        <div v-if="showMap.isHasOfficialDocument" class="is-send-official">
          本次创建的所有组织是否需要设置成本中心
          <el-checkbox v-model="checkCostCentral" @change="setOrgCostCenterTable"></el-checkbox>
        </div>
      </div>
    </i-process-flow>
    <!-- 标准组织库弹出框 -->
    <i-dialog
      top="5%"
      title="选择标准组织"
      v-model="libDialogVisible"
      size="huge"
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
import DemandDesc from 'components/flow/demand-desc'
import orgDialog from 'mixins/orgDialog'
import processMixin from 'mixins/process'
import organization from 'mixins/organization'
import OrgTree from 'components/org/public/org-tree'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import SelectLib from 'components/org/lib/select-lib'
import OrgCostCenter from 'components/org/public/org-cost-center'
import ITable from 'components/common/i-table'
import reqTree from 'api/org/tree'
import moment from 'moment'
import reqOrgDetail from 'api/org/setting'
// import ManageShop from 'components/org/setting/manage-shop'
export default {
  name: 'OrgCreate',
  components: {
    DemandDesc,
    OrgTree,
    IDialog,
    SelectLib,
    OrgCostCenter,
    ITable
    // ManageShop
  },
  mixins: [orgDialog, processMixin, organization],
  data () {
    return {
      // 标识已被冻结的组织
      showFreezeOrg: true,
      // 表单标题
      formBoxTitle: '查看组织',
      // 是否已经有新建的组织
      hasNewOrgNode: false,
      // 表单显示隐藏
      formBoxShow: false,
      // 标准组织库
      libDialogVisible: false,
      // 标准组织库表格
      showStdTable: false,
      // 部门负责人弹出框显示隐藏
      leaderDialogShow: false,
      // 是否显示可编辑表单
      canEditForm: false,
      // 表单确定取消按钮显示隐藏
      confirmAndCancelBtnShow: false,
      // 编辑按钮显示隐藏
      editBtnShow: false,
      // 表单按钮footer显示隐藏
      formBoxFooterShow: false,
      // 是否显示所在地区
      showBelongArea: false,
      // 是否显示管理分区
      showManageArea: false,
      // 是否已发公文
      isHasOfficialDocument: false,
      // 是否设置成本中心
      checkCostCentral: false,
      // 门店编码显隐
      shopCodeShow: false,
      // 回显组织树数据
      echoTreeData: [],
      standardOrg: {},
      // 回显默认展开节点的数组
      defaultExpandedkeys: [],
      selected: {},
      parentNode: null,
      // 表单Data
      formData: {
        applicantCode: '',
        applicantName: '',
        attachmentIds: '',
        beginRunDate: '',
        belongArea: '',
        businessType: '',
        categories: '',
        city: '',
        cityCode: '',
        companyCode: '',
        costCentral: '',
        costCentralId: '',
        country: '',
        countryCode: '',
        createBy: '',
        createDate: '',
        createPosition: '',
        effectiveDate: '',
        empEmployeeIds: '',
        lastUpdateBy: '',
        lastUpdateDate: '',
        manageShops: '',
        managedArea: '',
        orgLeader: '',
        orgLeaderId: '',
        orgPathName: '',
        orgResponsibility: '',
        orgShortName: '',
        orgSize: '',
        orgStandardId: '',
        orgStandardName: '',
        orgTier: '',
        orgType: '',
        orgUnitCode: '',
        orgUnitId: '',
        orgUnitName: '',
        parentId: '',
        parentUnitName: '',
        reason: '',
        regionCode: '',
        sapDeptProp: '',
        sapOrgType: '',
        shopAddress: '',
        shopArea: '',
        shopCategory: '',
        shopClass: '',
        shopCode: '',
        shopStatus: '',
        shopType: '',
        state: '',
        stateCode: '',
        superReportingDept: '',
        superReportingDeptId: '',
        virtualUnit: '',
        checkCostCentral: false
      },
      // 职位数据
      orgStandardtableData: [],
      // 保存新增的节点node
      addNodeTreeData: {},
      // 保存节点小红点的数组
      nodeStyleIconList: [],
      // 需求描述表单
      descModel: {
        effectiveDate: '',
        desc: '',
        reason: '',
        attachmentIds: []
      },
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
      // 设置组织树显示名称，非叶子结点时不显示
      defaultProps: {
        label: 'orgUnitName',
        children: 'children',
        value: 'orgUnitName',
        isLeaf: (data) => {
          return !data.isParent
        }
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
      flowData: {
        isHasOfficialDocument: 'N',
        processDefinitionId: 'organizationCreateFlowNew',
        operateType: '1'
      },
      orgStandardTable: {
        columns: [
          {label: '标准职位名称', prop: 'name'},
          {label: '所属职群', prop: 'posJobFamilyName'},
          {label: '所属职种', prop: 'jobClassName'}
        ],
        data: null,
        total: 0,
        info: null,
        showPagebar: true
      }
    }
  },
  computed: {
    isAutoComplete () {
      return this.$route.query.orgUnitId && window.sessionStorage.getItem('ORGNODEDATA')
    }
  },
  created () {
    const selectedOrgDataStr = window.sessionStorage.getItem('ORGNODEDATA')
    if (this.$route.query.orgUnitId && selectedOrgDataStr) {
      const selectedOrgData = JSON.parse(selectedOrgDataStr)
      const defaultExpandKeys = JSON.parse(window.sessionStorage.getItem('ORGTREEEXPANDKEYS'))
      this.defaultExpandedkeys = defaultExpandKeys
      this.echoTreeData = JSON.parse(window.sessionStorage.getItem('ORGTREENODES'))

      this.selected.data = selectedOrgData
    }
  },
  watch: {
    isHasOfficialDocument () {
      if (this.isHasOfficialDocument === true) {
        this.flowData.isHasOfficialDocument = 'Y'
      } else {
        this.flowData.isHasOfficialDocument = 'N'
      }
    },
    'descModel.effectiveDate': {
      handler () {
        this.formData.effectiveDate = this.descModel.effectiveDate
      }
    },
    'formData.orgStandardId': {
      handler () {
        if (this.formData.orgStandardId) {
          this.showStdTable = true
        } else {
          this.showStdTable = false
        }
      }
    },
    'formData.orgType': {
      handler () {
        if (this.formData.orgType === '6') {
          this.showManageArea = true
          this.showBelongArea = false
        } else if (this.formData.orgType === '7' && parseInt(this.formData.businessType) <= 5) {
          this.showBelongArea = true
          this.showManageArea = false
          this.shopCodeShow = true
        } else if (this.formData.orgType === '8' && parseInt(this.formData.businessType) <= 5) {
          this.showBelongArea = true
          this.showManageArea = false
          this.shopCodeShow = false
          if (this.selected.data.isNew) {
            reqOrgDetail('echoDetail', {id: this.selected.data.parentId}).then(orgData => {
              if (orgData.orgType === '7' && parseInt(orgData.businessType) <= 5) {
                this.asyncGetAreaData(orgData).then(areaData => {
                  this.formData = Object.assign({}, this.formData, {
                    belongAreaName: areaData[0].areaPathName,
                    belongArea: areaData[0].areaCode,
                    belongAreaId: areaData[0].areaId
                  })
                })
              }
            })
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
          this.shopCodeShow = false
          if (this.selected.data.isNew) {
            reqOrgDetail('echoDetail', {id: this.selected.data.parentId}).then(orgData => {
              if (orgData.orgType === '7' && parseInt(orgData.businessType) <= 5) {
                this.asyncGetAreaData(orgData).then(areaData => {
                  this.formData = Object.assign({}, this.formData, {
                    belongAreaName: areaData[0].areaPathName,
                    belongArea: areaData[0].areaCode,
                    belongAreaId: areaData[0].areaId
                  })
                })
              }
            })
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
    }
  },
  methods: {
    postFlow () {
      if (this.canEditForm === true) {
        this.$message({
          type: 'error',
          message: '请先确定您的表单内容'
        })
      } else {
        this.echoTreeData = this.getNodeChldren(this.$refs.tree.root.childNodes)
        this.getAddNode(this.$refs.tree.root.childNodes)
        // 新增组织的node
        if (Object.keys(this.addNodeTreeData).length) {
          this.defaultExpandedkeys = []
          this.getDefaultExpandNodeKeys(this.addNodeTreeData, this.defaultExpandedkeys)
        }
        return {
          orgUnitMaintain: this.formData,
          echoTreeData: this.echoTreeData,
          descModel: this.descModel,
          orgStandardtableData: this.orgStandardtableData,
          defaultExpandedkeys: this.defaultExpandedkeys,
          addNodeId: this.addNodeTreeData.id,
          checkCostCentral: this.checkCostCentral,
          nodeStyleIconList: this.nodeStyleIconList,
          ...this.flowData
        }
      }
    },
    fillIn (data) {
      // 只有在起草节点或者是在人力服务团队时才能编辑表单内容
      if (this.taskKey === 'undefined' || this.taskKey === 'hrGroupComplementId' || this.taskKey === 'applyId') {
        this.formBoxFooterShow = true
        this.editBtnShow = true
      }
      if (data.orgUnitMaintain.orgStandardId) {
        this.standardOrg.orgStandardId = data.orgUnitMaintain.orgStandardId
        this.orgStandarFetch()
      }
      this.formBoxShow = true
      this.formData = data.orgUnitMaintain
      this.echoTreeData = data.echoTreeData
      this.descModel = data.descModel
      this.orgStandardtableData = data.orgStandardtableData
      this.defaultExpandedkeys = data.defaultExpandedkeys
      this.selected.id = data.addNodeId
      this.checkCostCentral = data.checkCostCentral
      this.nodeStyleIconList = data.nodeStyleIconList
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
    // 获取新增组织的node
    getAddNode (nodes) {
      nodes.forEach(item => {
        if (item.data.isNew) {
          this.addNodeTreeData = item
          return
        }
        this.getAddNode(item.childNodes)
      })
    },
    // 遍历最底层节点，拿到最底层节点的所有父级id，回显时就能默认展开新增的节点
    getDefaultExpandNodeKeys (node, list) {
      list.push(node.data.parentId)
      if (node.parent.level !== 1) {
        this.getDefaultExpandNodeKeys(node.parent, list)
      }
    },
    // 是否设置成本中心
    setOrgCostCenterTable (checked) {
      this.checkCostCentral = checked
      this.$set(this.formData, 'checkCostCentral', checked)
      console.log(this.formData.checkCostCentral)
    },
    // 改变是否设置职位
    setCreatePosition (value) {
      this.formData.createPosition = value
    },
    // 组织树点击事件
    nodeClick (data, node) {
      this.selected = node
      this.parentNode = node.parent ? node.parent : null
      this.formBoxShow = true
      // 如果当前节点的财务团队，并且当前节点是新增组织
      if (this.taskKey === 'financeGroupId' && data.isNew) {
        this.checkCostCentral = true
      } else {
        this.checkCostCentral = false
      }
      // 如果是新增节点
      if (data.isNew) {
        this.formData = Object.assign({}, data)
        Promise.all([
          this.$d('ORG_TYPE', node.parent.data.orgType),
          reqOrgDetail('echoDetail', {id: data.parentId})
        ]).then(allData => {
          this.$set(this.formData, 'parentOrgTypeName', allData[0])
        })
        this.formBoxFooterShow = true
        this.formBoxTitle = '新建组织'
        if (data.canEditNode === true) {
          this.canEditForm = true
          this.confirmAndCancelBtnShow = true
        } else if (this.taskKey === 'undefined' || this.taskKey === 'hrGroupComplementId' || this.taskKey === 'applyId') {
          this.editBtnShow = true
        }
      } else { // 否则不是新增节点
        if (node.level === 1) {
          reqOrgDetail('echoDetail', {id: data.orgUnitId}).then(rootNodeData => {
            Promise.all([
              this.$d('ORG_TYPE', rootNodeData.orgType),
              this.$d('ORG_BUSINESS_TYPE', rootNodeData.businessType),
              this.$d('SAP_ORG_TYPE', rootNodeData.sapOrgType),
              this.$d('SAP_DEPT_PROP', rootNodeData.sapDeptProp)
            ]).then(rootNodeTypeData => {
              this.formData = Object.assign({}, rootNodeData, {
                orgTypeName: rootNodeTypeData[0],
                businessTypeName: rootNodeTypeData[1],
                sapOrgTypeName: rootNodeTypeData[2],
                sapDeptPropName: rootNodeTypeData[3],
                effectiveDate: moment(rootNodeData.effectiveDate).format('YYYY-MM-DD'),
                superReportingDeptId: rootNodeData.superReportingDeptId ? rootNodeData.superReportingDeptId.trim() : ''
              })
              if (rootNodeData.superReportingDeptId === '') {
                this.$set(this.formData, 'superReportingDeptId', null)
              }
            })
          })
        } else {
          // 如果是原节点
          reqOrgDetail('echoDetail', {id: data.orgUnitId}).then(orgData => {
            orgData.parentOrgType = node.parent.data.orgType
            this.asyncGetTypeData(orgData).then(typeData => {
              this.asyncGetAreaData(orgData).then(areaData => {
                this.formData = Object.assign({}, orgData, {
                  parentOrgTypeName: typeData.parentOrgTypeName,
                  orgTypeName: typeData.orgTypeName,
                  businessTypeName: typeData.businessTypeName,
                  sapOrgTypeName: typeData.sapOrgTypeName,
                  sapDeptPropName: typeData.sapDeptPropName,
                  belongAreaName: areaData[0].areaPathName,
                  managedAreaName: areaData[1].names,
                  superReportingDeptId: orgData.superReportingDeptId ? orgData.superReportingDeptId.trim() : ''
                })
                if (orgData.superReportingDeptId === '') {
                  this.$set(this.formData, 'superReportingDeptId', null)
                }
                this.formBoxTitle = '查看组织'
                this.canEditForm = false
                this.confirmAndCancelBtnShow = false
                this.editBtnShow = false
                this.formBoxFooterShow = false
              }).catch(areaErr => {
                console.log(areaErr)
                console.log('地区接口报错')
              })
            }).catch(typeErr => {
              console.log(typeErr)
              console.log('类型接口报错')
            })
          })
        }
      }
    },
    // 表单确定按钮
    formBoxConfirm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          Promise.all([
            this.$d('ORG_TYPE', this.formData.orgType),
            this.$d('ORG_BUSINESS_TYPE', this.formData.businessType),
            this.$d('SAP_ORG_TYPE', this.formData.sapOrgType),
            this.$d('SAP_DEPT_PROP', this.formData.sapDeptProp)
          ]).then(data => {
            this.formData.orgTypeName = data[0]
            this.formData.businessTypeName = data[1]
            this.formData.sapOrgTypeName = data[2]
            this.formData.sapDeptPropName = data[3]
            this.formData.effectiveDate = this.descModel.effectiveDate
            this.formData.canEditNode = false
        // 当前树节点赋值
            this.selected.data = Object.assign({}, this.formData)
            this.canEditForm = false
            this.confirmAndCancelBtnShow = false
            this.editBtnShow = true
          })
        } else {
          return false
        }
      })
      // 在点击确定的时候转换组织类型，业态等名称，再次点击新增节点的时候就无需再次请求，直接从节点拿数据
    },
    // 表单×号点击事件
    formboxClose () {
      this.formBoxShow = false
      this.deleteNode(null, this.selected)
    },
    // 表单编辑按钮
    editBtnClick () {
      this.confirmAndCancelBtnShow = true
      this.editBtnShow = false
      this.canEditForm = true
    },
    // 标准组织库input左边图标点击
    showSelectLib () {
      this.libDialogVisible = true
    },
    // 标准组织库确定
    setLib () {
      this.formData = Object.assign({}, this.formData, {
        orgUnitName: this.standardOrg.orgStandardName,
        orgShortName: this.standardOrg.orgStandardName,
        orgType: this.standardOrg.orgType,
        businessType: this.standardOrg.businessType,
        orgStandardName: this.standardOrg.orgStandardName,
        orgStandardId: this.standardOrg.orgStandardId
      })
      this.orgStandarFetch()
      this.showStdTable = true
      this.closeSelectLibDialog()
    },
    // 标准组织库清空按钮
    clearStandardLib () {
      this.formData.orgStandardName = ''
      this.formData.orgStandardId = ''
      this.orgStandardTable.data = []
      this.showStdTable = false
    },
    // 标准组织库表格展示
    orgStandarFetch (options = {}) {
      reqOrgDetail('newGetStdPosition', {id: this.standardOrg.orgStandardId, ...options}).then(data => {
        Object.assign(this.orgStandardTable, data)
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
    // 下拉节点树点击事件
    orgSelectTreeClick (data, node) {
      this.formData.superReportingDept = data.orgUnitName
      this.formData.superReportingDeptId = data.orgUnitId
      this.formData.superReportingDeptName = data.orgUnitName
    },
    // 部门负责人图标点击打开dialog
    handlerLeaderDialog () {
      this.leaderDialogShow = !this.leaderDialogShow
      this.$refs.iPersonnelSelect.resetData()
    },
    // 部门负责人弹出框确定按钮
    leaderDialogConfirm (selected) {
      this.formData.leaderName = selected[0].employeeName
      this.formData.orgLeaderId = selected[0].employeeId
      this.formData.orgLeader = selected[0].employeeName
    },
    // 所在区域input改变时
    handleBelongAreaChange (data, value) {
      this.formData.belongArea = data.areaCode
      this.formData.belongAreaName = value
    },
    // 管理分区input改变时
    handleManagedAreaChange (data, value) {
      this.formData.managedArea = data.map(item => {
        return item.areaCode
      }).toString()
      this.formData.managedAreaName = value.join(',')
    },
    // 异步获取地区信息
    syncGetArea (orgData) {
      if (orgData.belongArea && !orgData.managedArea) {
        return reqOrgDetail('getAreaMsg', {code: orgData.belongArea}).then(data => {
          let managedArea = {
            areaCode: '',
            areaName: '',
            areaId: ''
          }
          return [data[0], managedArea]
        })
      } else if (orgData.managedArea && !orgData.belongArea) {
        return reqOrgDetail('getAreaMsg', {code: orgData.managedArea}).then(data => {
          let belongArea = {
            areaCode: '',
            areaName: '',
            areaId: ''
          }
          return [belongArea, data[0]]
        })
      } else if (!orgData.belongArea && !orgData.managedArea) {
        return new Promise((resolve, reject) => {
          let belongArea = {
            areaCode: '',
            areaName: '',
            areaId: ''
          }
          let managedArea = {
            areaCode: '',
            areaName: '',
            areaId: ''
          }
          resolve([belongArea, managedArea])
        })
      } else {
        return reqOrgDetail('getAreaMsg', {code: orgData.belongArea}).then(belongArea => {
          return reqOrgDetail('getAreaMsg', {code: orgData.managedArea}).then(managedArea => {
            return [belongArea[0], managedArea[0]]
          })
        })
      }
    },
    // 找到新增节点的路径，显示小红点
    getNodeStyleIcon (node, list) {
      list.push(node.parent.data.orgUnitId)
      if (node.parent.level !== 1) {
        this.getNodeStyleIcon(node.parent, list)
      }
      return list
    },
    // 增加一个节点
    addNode (data, node) {
      let id = Date.now()
      let addTreeNodeData = {
        orgUnitId: id,
        effectiveDate: this.descModel.effectiveDate,
        orgUnitName: '新增组织',
        parentUnitName: data.orgUnitName,
        parentId: data.orgUnitId,
        parentOrgType: data.orgType,
        canEditNode: true,
        isNew: true,
        isParent: 0,
        superReportingDept: data.orgUnitName,
        superReportingDeptId: data.orgUnitId,
        createPosition: false
      }
      if (this.hasNewOrgNode === false) {
        // 如果当前node有childNodes就node.insertChild 否则如果没有childNodes就在node.expand方法中添加节点
        if (node.childNodes.length) {
          let newChild = { data: addTreeNodeData }
          newChild.parent = node
          // 源代码添加节点方法
          node.insertChild(newChild)
          node.data.isParent = 1
          this.hasNewOrgNode = true
          this.nodeStyleIconList = this.getNodeStyleIcon(this.$refs.tree.store.getNode(newChild.data), this.nodeStyleIconList)
        } else {
          node.expand(() => {
            let newChild = { data: addTreeNodeData }
            newChild.parent = node
            node.insertChild(newChild)
            node.data.isParent = 1
            this.hasNewOrgNode = true
            this.nodeStyleIconList = this.getNodeStyleIcon(this.$refs.tree.store.getNode(newChild.data), this.nodeStyleIconList)
          })
        }
      } else {
        this.$message({
          type: 'info',
          message: '该节点或其他节点下已有新增组织'
        })
      }
    },
    deleteNode (data, node) {
      this.hasNewOrgNode = false
      let index = node.parent.childNodes.findIndex(item => { return item.id === node.id })
      node.parent.childNodes.splice(index, 1)
      this.nodeStyleIconList = []
      this.$nextTick(() => {
        this.formBoxShow = false
      })
    },
    renderContent (h, {node, data}) {
      let highlightFreeze = data.status === '2' && this.showFreezeOrg
      let nodeStyle = this.nodeStyleIconList.indexOf(data.orgUnitId)
      return (
        <div style="line-height:36px">
          <span style={'margin-right: 5px;'} class={(highlightFreeze ? 'iconfont icon-lock' : '')}></span>
          <span style={(data.isNew === true ? 'color: #EB6709;' : 'color: #333333;') + (highlightFreeze ? 'color:#d8d8d8;' : '')}>{data.orgUnitName}</span>
          <span v-show={ nodeStyle >= 0} style="position:relative;display:inline-block;width:8px;height:8px;border-radius:50%;left:10px;top:-2px;background:#FF6464;"></span>
          <span
            v-show={!data.isNew && (this.taskKey === 'undefined' || this.taskKey === 'applyId')}
            on-click={ () => { this.addNode(data, node) }}
            style="font-size:16px;color:#3DA5FE;margin-left:15px;"
            class={'el-icon-circle-plus-outline add-icon'}>
          </span>
          <span
            v-show={data.isNew && (this.taskKey === 'undefined' || this.taskKey === 'applyId')}
            on-click= {() => { this.deleteNode(data, node) }}
            style="font-size:16px;color:#3DA5FE;margin-left:15px;"
            class="el-icon-remove-outline delete-icon">
          </span>
          <span
            v-show={node.id === this.selected.id}
            class="el-icon-caret-right"
            style="color:#3DA5FE;font-size:16px;position:absolute;right:20px;top:10px;z-index:8;">
          </span>
        </div>
      )
    },
    // 请求组织树方法
    getTreeRoot () {
      if (this.echoTreeData.length) {
        return Promise.resolve(this.echoTreeData)
      } else {
        return reqTree(this.requestUrls.root.url, {}).then(data => {
          return data
        })
      }
    },
    loadData (node, resolve) {
      if (node.level === 0) {
        this.getTreeRoot().then(data => {
          resolve(data)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  margin-left: 20px;
  .info-title {
    font-size: 14px;
    font-weight: bold;
    width: 100%;
  }
  .box {
    width: 500px;
    height: 660px;
    border: 1px solid #E8E8E8;
    margin-top: 10px;
    overflow: auto;
    background: #F8F8F8;
    .box-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      height: 50px;
      border-bottom: 1px solid #E8E8E8;
      line-height: 50px;
      width: 100%;
      background: #F8F8F8;
      padding-left: 20px;
      box-sizing: border-box;
      .el-icon-close {
        font-size: 20px;
        margin-right: 20px;
        color: #3da5fe;
        cursor: pointer;
      }
    }
  }
  .form-box {
    border-left: 2px solid #3DA5FE;
    position: relative;
    background: #ffffff;
    /** 重写表单底部按钮样式 **/
    .form-box-footer {
      text-align: right;
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding-right: 30px;
      box-sizing: border-box;
    }
  }
}
/** 组织树鼠标进入显示增加，删除按钮 **/
.el-tree {
  font-size: 14px;
  /deep/ .el-tree-node {
    background: #F8F8F8;
  }
  /deep/ .el-tree-node__content {
    position: relative;
    &:hover {
      background: #ffffff;
    }
  }
  /deep/ .el-tree-node__content {
    .add-icon, .delete-icon {
      display: none;
    }
    &:hover {
      .add-icon, .delete-icon {
        display: inline-block;
      }
    }
  }
}
/** 重写表单样式 **/
.el-form {
  overflow: auto;
  height: 550px;
  span{
    color: #8D8D8D;
  }
  /** 重写item上下边距，字体，高度,input宽度 **/
  .lib-org-standar {
    height: 50px;
  }
  /deep/ .el-form-item {
    min-height: 28px;
    margin-top: 10px;
    margin-bottom: 0;

    .el-form-item__label {
      min-height: 28px;
      // line-height: 28px;
    }
    .el-form-item__content {
      min-height: 28px;
      // line-height: 28px;
      .el-input {
        width: 180px;
      }
      .el-textarea {
        width: 310px;
      }
      .el-form-item__error {
        padding-top: 0;
      }
    }
  }
}
.officialDocument {
  width: 100%;
  font-size: 14px;
  flex-basis: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}
.is-send-official {
  width: 100%;
  font-size: 14px;
  flex-basis: 100%;
  margin-bottom: 20px;
}
.org-standard-table {
  width: 600px;
}

</style>
