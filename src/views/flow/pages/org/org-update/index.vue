<template>
  <div class="wrap">
    <i-process-flow
    processType="organizationUpdateFlowNew"
    :model="formData"
    @fillin="fillIn">
      <demand-desc 
        dateSelectType="month"
        action="组织更新"
        slot="requirementsDescribe"
        :model="descModel">
      </demand-desc>
      <div class="large-box" slot="orgUpdateForm">
      <h2 class="module-title">选择组织</h2>
        <!-- 组织树 -->
        <div class="box">
          <org-tree
            class="org-tree"
            ref="tree"
            :cstLoadData = "loadData"
            :cstRenderContent="renderContent"
            @handler-freeze="handlerFreezeOrg"
            @node-click="nodeClick"
            :defaultExpandedKeys="nodeStyleIconList"
          ></org-tree>
        </div>
        <!-- 更新前 -->
        <div v-show="updateBox" class="form-box">
          <div class="box-title">更新前</div>
          <el-form class="form" :model="beforeFormData" label-width="150PX">
            <el-form-item class="el-form-item--mini" label="上级组织">
              {{beforeFormData.parentUnitName}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="上级组织类型">
              {{beforeFormData.parentOrgTypeName}}
            </el-form-item>
            <el-form-item v-show="formData.orgType === '7' && formData.businessType <= 5" class="el-form-item--mini" label="门店编码">
              {{beforeFormData.shopCode}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="组织名称">
              {{beforeFormData.orgUnitName}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="组织简称">
              {{beforeFormData.orgShortName}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="组织类别">
              {{beforeFormData.orgTypeName}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="业态">
              {{beforeFormData.businessTypeName}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="组织类型">
              {{beforeFormData.sapOrgTypeName}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="部门属性">
              {{beforeFormData.sapDeptPropName}}
            </el-form-item>
            <el-form-item v-show="isShowBelongArea" class="el-form-item--mini" label="所在区域">
              {{beforeFormData.belongAreaName}}
            </el-form-item>
            <el-form-item v-show="isShowManagedArea" class="el-form-item--mini" label="管理分区">
              {{beforeFormData.managedAreaName}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="生效时间">
              {{beforeFormData.effectiveDate}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="上级汇报部门">
              {{beforeFormData.superReportingDept}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="部门负责人">
              {{beforeFormData.orgLeader}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="关键职责">
              {{beforeFormData.orgResponsibility}}
            </el-form-item>
            <el-form-item  class="el-form-item--mini" v-if="taskKey === 'financeGroupId'" label="成本中心">
              {{beforeFormData.costCentralId}}
            </el-form-item>
          </el-form>
        </div>
        <!-- 更新后 -->
        <div v-show="updateBox" class="form-box">
          <div class="box-title">更新后</div>
          <el-form class="form" :rules="formRules" size="mini" :model="formData" label-width="150px">
            <el-form-item class="el-form-item--mini" label="上级组织">
              {{formData.parentUnitName}}
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="上级组织类型">
              {{formData.parentOrgTypeName}}
            </el-form-item>
            <el-form-item v-show="formData.orgType === '7' && formData.businessType <= 5" class="el-form-item--mini" label="门店编码">
              <el-autocomplete
                :disabled="disabledMap.shopCode"
                v-model="formData.shopTypeName"
                :fetch-suggestions="shopTypeSearch" 
                :placeholder="disabledMap.shopCode ? '' : '请输入内容'"
                @select="shopTypeSelect">
                <template slot-scope="props">
                  <span>{{ props.item.code + ':' }}</span>
                  <span>{{ props.item.name }}</span>
                </template>  
              </el-autocomplete>
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="组织名称" prop="orgUnitName">
              <el-input :maxlength="32" class="el-input-width" :disabled="disabledMap.orgUnitName" @change="formItemChange" v-model="formData.orgUnitName"></el-input>
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="组织简称" prop="orgShortName">
              <el-input :maxlength="32" class="el-input-width" :disabled="disabledMap.orgShortName" @change="formItemChange" v-model="formData.orgShortName"></el-input>
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="组织类别" prop="orgType">
              <i-select :disabled="disabledOrgType || disabledMap.orgType" @change="formItemChange" class="el-input-width" v-model="formData.orgType" parameter="ORG_TYPE"></i-select>
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="业态" prop="businessType">
              <i-select :disabled="disabledMap.businessType" @change="formItemChange" class="el-input-width" v-model="formData.businessType" parameter="ORG_BUSINESS_TYPE"></i-select>
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="组织类型" prop="sapOrgType">
              <i-select
                :disabled="disabledMap.sapOrgType"
                class="el-input-width"
                v-model="formData.sapOrgType"
                parameter="SAP_ORG_TYPE">
              </i-select>
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="部门属性" prop="sapDeptProp">
              <i-select
                :disabled="disabledMap.sapDeptProp"
                class="el-input-width"
                v-model="formData.sapDeptProp"
                parameter="SAP_DEPT_PROP">
              </i-select>
            </el-form-item>
            <el-form-item v-if="isShowBelongArea" class="el-form-item--mini" label="所在区域" prop="belongArea">
              <i-select-area
                :disabled="disabledMap.belongAreaId"
                class="el-input-width"
                type="yonghui"
                search
                returnNode
                v-model="formData.belongAreaId"
                @change="handleBelongAreaChange">
              </i-select-area>
            </el-form-item>
            <el-form-item v-if="isShowManagedArea" class="el-form-item--mini" label="管理分区" prop="managedArea">
              <i-select-area
                :disabled="disabledMap.managedAreaId"
                class="el-input-width"
                type="yonghui"
                search
                multiple
                returnNode
                v-model="formData.managedAreaId"
                @change="handleManagedAreaChange">
              </i-select-area>
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="生效日期">
              <el-date-picker
                class="el-input-width"
                :readonly="true"
                :disabled="disabledMap.effectiveDate"
                type="date"
                v-model="formData.effectiveDate"
                @change="effectiveDateHandler || formItemChange"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="上级汇报部门" prop="superReportingDeptId">
              <i-select-tree
                class="el-input-width"
                :disabled="disabledMap.superReportingDept"
                dataKey="org"
                nodeKey="orgUnitId"
                v-model="formData.superReportingDeptId"
                :selectedNode.sync="selectedNode"
                @node-click="orgSelectTreeClick">
              </i-select-tree>
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="部门负责人">
              <el-input
                :disabled="disabledMap.orgLeader"
                :placeholder="disabledMap.orgLeader ? '' : '请选择部门负责人'"
                class="el-input-width"
                :readonly="true"
                v-model="formData.orgLeader"
                suffix-icon="el-icon-menu"
                @click.native="handlerLeaderDialog"
                >
              </el-input>
            </el-form-item>
            <el-form-item class="el-form-item--mini" label="关键职责">
              <el-input
                :maxlength="256"
                :disabled="disabledMap.orgResponsibility"
                :placeholder="disabledMap.orgResponsibility ? '' : '请输入关键职责'"
                @change="formItemChange" style="width: 230px;"
                v-model="formData.orgResponsibility"
                type="textarea">
              </el-input>
            </el-form-item>
            <el-form-item class="el-form-item--mini" v-if="taskKey === 'finance' && checkCostCentral" label="成本中心" prop="costCentralId">
              <org-cost-center class="el-input-width" v-model="formData.costCentralId"></org-cost-center>
            </el-form-item> 
          </el-form>
        </div>
        <!-- 人员选择器 -->
        <i-personnel-select
          ref="iPersonnelSelect"
          :multiple="false"
          :isShow.sync="leaderDialogShow"
          @confirm="leaderDialogConfirm">
        </i-personnel-select>
        <div v-if="showMap.isHasOfficialDocument" class="officialDocument">
          本次更新组织是否已发公文
          <el-checkbox v-model="isHasOfficialDocument"></el-checkbox>
        </div>
        <!-- 是否设置成本中心 -->
        <div class="officialDocument" v-if="this.taskKey === 'undefined'">
          本次更新组织是否配置成本中心
          <el-checkbox v-model="checkCostCentral" @change="setOrgCostCenterTable"></el-checkbox>
        </div>
      </div>
    </i-process-flow>
  </div>
</template>
<script>
import IProcessFlow from 'components/common/i-process-flow'
import processMixin from 'mixins/process'
import organization from 'mixins/organization'
import DemandDesc from 'components/flow/demand-desc'
import orgDialog from 'mixins/orgDialog'
import req from 'api/org/setting.js'
import reqTree from 'api/org/tree'
import OrgTree from 'components/org/public/org-tree'
import OrgFlowTable from 'components/org/setting/org-flow-table'
import OrgCostCenter from 'components/org/public/org-cost-center'
import moment from 'moment'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
export default {
  name: 'OrgUpdate',
  components: {
    IProcessFlow,
    DemandDesc,
    OrgTree,
    OrgFlowTable,
    OrgCostCenter,
    iPersonnelSelect
  },
  mixins: [orgDialog, processMixin, organization],
  data () {
    return {
      // 是否配置成本中心
      checkCostCentral: false,
      updateBox: false,
      leaderDialogShow: false,
      isHasOfficialDocument: false,
      isShowBelongArea: false,
      isShowManagedArea: false,
      disabledOrgType: false,
      // 显示组织树红色小圆点对象
      showIconNode: null,
      // 是否修改过表单内容
      isEditForm: false,
      // selectedNode: {},
      // 更新前表单
      beforeFormData: {},
      // 组织树保存小红点数组
      nodeStyleIconList: [],
      isShowFreezeOrg: true,
      // 更新后表单
      // 表单数据
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
      descModel: {
        effectiveDate: '', // 生效日期
        desc: '', // 描述
        reason: '',  // 原因
        attachmentIds: []
      },
      flowData: {
        isHasOfficialDocument: 'N',
        processDefinitionId: 'organizationCreateFlow',
        operateType: '2'
      },
      selected: {},
      // 页面进来时默认选中的节点Data数据
      openPageSelected: {},
      // 组织树点击保存data
      clickNodeSelected: {},
      parentNode: null,
      echoTreeData: [],
      defaultExpandedkeys: []
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
        if (this.taskKey === 'undefined') {
          this.formData.effectiveDate = this.descModel.effectiveDate
        }
      }
    },
    formData: {
      handler () {
        if (this.formData.orgType === '6') {
          this.isShowManagedArea = true
          this.isShowBelongArea = false
        } else if (this.formData.orgType === '7' && parseInt(this.formData.businessType) <= 5) {
          this.isShowManagedArea = false
          this.isShowBelongArea = true
        } else if (this.formData.orgType === '8' && parseInt(this.formData.businessType) <= 5) {
          this.isShowManagedArea = false
          this.isShowBelongArea = true
        } else {
          this.isShowManagedArea = false
          this.isShowBelongArea = false
        }
      },
      deep: true
    },
    'beforeFormData.orgType': {
      handler () {
        if (this.beforeFormData.orgType === '客户经营主体') {
          this.disabledOrgType = true
        } else {
          this.disabledOrgType = false
        }
      }
    }
  },
  created () {
    const selectedOrgDataStr = window.sessionStorage.getItem('ORGNODEDATA')
    if (this.$route.query.orgUnitId && selectedOrgDataStr) {
      const selectedOrgData = JSON.parse(selectedOrgDataStr)
      const defaultExpandKeys = JSON.parse(window.sessionStorage.getItem('ORGTREEEXPANDKEYS'))
      this.nodeStyleIconList = defaultExpandKeys
      this.echoTreeData = JSON.parse(window.sessionStorage.getItem('ORGTREENODES'))

      this.openPageSelected = selectedOrgData
    }
  },
  updated () {

  },
  computed: {

  },
  methods: {
    validateBusinessType (rule, value, callback) {
      if (this.formData.orgType === '7' && parseInt(this.formData.businessType) > 5) {
        callback(new Error('当前业态不是客户经营主体的类型'))
      }
      callback()
    },
    formItemChange () {
      this.isEditForm = true
    },
    effectiveDateHandler (value) {
      this.isEditForm = true
      this.formData.effectiveDate = this.descModel.effectiveDate
    },
    // 门店编码选择
    shopTypeSelect (item) {
      this.formData.shopCode = item.code
      this.formData.shopTypeName = item.code + ':' + item.name
    },
    // 门店编码搜索
    shopTypeSearch (queryString, callback) {
      req('getShopType', {codeOrName: queryString}).then(data => {
        callback(data)
      })
    },
    // 是否设置成本中心
    setOrgCostCenterTable (checked) {
      this.checkCostCentral = checked
      this.$set(this.formData, 'checkCostCentral', checked)
    },
    // 组织树节点点击
    nodeClick (data, node) {
      this.selected = node
      this.clickNodeSelected = data
      this.updateBox = true
      this.parentNode = node.parent ? node.parent : null
      // 如果没有修改过表单内容，那么不会有弹出框提示，否则会有弹出框提示
      if (this.isEditForm === false) {
        // 特殊处理，如果当前节点是根节点，就执行当前处理
        if (node.level === 1) {
          req('echoDetail', {id: data.orgUnitId}).then(rootNodeData => {
            this.asyncGetTypeData(rootNodeData).then(typeData => {
              let time = moment(rootNodeData.effectiveDate).format('YYYY-MM-DD')
              this.beforeFormData = Object.assign({}, rootNodeData, {
                effectiveDate: time,
                orgTypeName: typeData.orgTypeName,
                businessTypeName: typeData.businessTypeName,
                sapOrgTypeName: typeData.sapOrgTypeName,
                sapDeptPropName: typeData.sapDeptPropName
              })

              this.formData = Object.assign({}, rootNodeData, {
                effectiveDate: this.descModel.effectiveDate,
                superReportingDeptId: rootNodeData.superReportingDeptId.trim()
              })
            })
            Promise.all([
              this.$d('ORG_TYPE', rootNodeData.orgType),
              this.$d('ORG_BUSINESS_TYPE', rootNodeData.businessType),
              this.$d('SAP_ORG_TYPE', rootNodeData.sapOrgType),
              this.$d('SAP_DEPT_PROP', rootNodeData.sapDeptProp)
            ]).then(rootNodeTypeData => {
              this.beforeFormData = Object.assign({}, rootNodeData, {
                orgType: rootNodeTypeData[0],
                businessType: rootNodeTypeData[1],
                sapOrgType: rootNodeTypeData[2],
                sapDeptProp: rootNodeTypeData[3],
                effectiveDate: moment(rootNodeData.effectiveDate).format('YYYY-MM-DD')
              })
              this.formData = Object.assign({}, rootNodeData, {
                shopTypeName: rootNodeData.shopCode
              })
            })
          })
        } else {
          req('echoDetail', {id: data.orgUnitId}).then(orgData => {
            let time = moment(orgData.effectiveDate).format('YYYY-MM-DD')
            orgData.parentOrgType = node.parent.data.orgType
            this.asyncGetTypeData(orgData).then(typeData => {
              this.asyncGetAreaData(orgData).then(areaData => {
                this.beforeFormData = Object.assign({}, orgData, {
                  effectiveDate: time,
                  orgTypeName: typeData.orgTypeName,
                  businessTypeName: typeData.businessTypeName,
                  sapOrgTypeName: typeData.sapOrgTypeName,
                  sapDeptPropName: typeData.sapDeptPropName,
                  parentOrgTypeName: typeData.parentOrgTypeName,
                  belongAreaName: areaData[0].areaPathName,
                  managedAreaName: areaData[1].names,
                  costCentralId: orgData.costCentralId
                })

                this.formData = Object.assign({}, orgData, {
                  shopTypeName: orgData.shopCode,
                  belongArea: areaData[0].areaCode,
                  belongAreaId: areaData[0].areaId,
                  managedAreaId: areaData[1].ids,
                  managedArea: areaData[1].codes,
                  parentOrgTypeName: typeData.parentOrgTypeName,
                  effectiveDate: this.descModel.effectiveDate,
                  superReportingDeptId: orgData.superReportingDeptId ? orgData.superReportingDeptId.trim() : null,
                  costCentralId: orgData.costCentralId ? orgData.costCentralId.trim() : ''
                })
                // 这里处理是为了数据为空格，trim()以后会变为空字符串，手动赋值为null，避免空字符串传入组件不能改变input显示的内容
                if (!this.formData.superReportingDeptId) {
                  this.$set(this.formData, 'superReportingDeptId', null)
                }
              }).catch(areaDataErr => {
                console.log(areaDataErr)
                console.log('地区信息接口报错')
              })
            }).catch(typeDataErr => {
              console.log(typeDataErr)
              console.log('类型信息接口报错')
            })
            // 获取点击节点的node，开始递归
            this.nodeStyleIconList = []
            this.nodeStyleIconList = this.getNodeStyleIcon(this.$refs.tree.$refs.tree.store.getNode(this.clickNodeSelected), this.nodeStyleIconList)
          })
        }
      } else {
        this.$confirm('该操作将不保存表单内容').then(() => {
          this.isEditForm = false
          req('echoDetail', {id: data.orgUnitId}).then(orgData => {
            let time = moment(orgData.effectiveDate).format('YYYY-MM-DD')
            orgData.parentOrgType = node.parent.data.orgType
            this.asyncGetTypeData(orgData).then(typeData => {
              this.asyncGetAreaData(orgData).then(areaData => {
                this.beforeFormData = Object.assign({}, orgData, {
                  effectiveDate: time,
                  orgTypeName: typeData.orgTypeName,
                  businessTypeName: typeData.businessTypeName,
                  sapOrgTypeName: typeData.sapOrgTypeName,
                  sapDeptPropName: typeData.sapDeptPropName,
                  parentOrgTypeName: typeData.parentOrgTypeName,
                  belongAreaName: areaData[0].areaPathName,
                  managedAreaName: areaData[1].names,
                  costCentralId: orgData.costCentralId.trim()
                })

                this.formData = Object.assign({}, orgData, {
                  shopTypeName: orgData.shopCode,
                  belongArea: areaData[0].areaCode,
                  belongAreaId: areaData[0].areaId,
                  managedAreaId: areaData[1].ids,
                  managedArea: areaData[1].codes,
                  parentOrgTypeName: typeData.parentOrgTypeName,
                  effectiveDate: this.descModel.effectiveDate,
                  superReportingDeptId: orgData.superReportingDeptId ? orgData.superReportingDeptId.trim() : null,
                  costCentralId: orgData.costCentralId.trim()
                })
                // 这里处理是为了数据为空格，trim()以后会变为空字符串，手动赋值为null，避免空字符串传入组件不能改变input显示的内容
                if (!this.formData.superReportingDeptId) {
                  this.$set(this.formData, 'superReportingDeptId', null)
                }
              }).catch(areaDataErr => {
                console.log(areaDataErr)
                console.log('地区信息接口报错')
              })
            }).catch(typeDataErr => {
              console.log(typeDataErr)
              console.log('类型信息接口报错')
            })
            // 获取点击节点的node，开始递归
            this.nodeStyleIconList = []
            this.nodeStyleIconList = this.getNodeStyleIcon(this.$refs.tree.$refs.tree.store.getNode(this.clickNodeSelected), this.nodeStyleIconList)
          })
        })
      }
    },
    // 找到更新节点的路径，显示小红点
    getNodeStyleIcon (node, list) {
      list.push(node.parent.data.orgUnitId)
      if (node.parent.level !== 1) {
        this.getNodeStyleIcon(node.parent, list)
      }
      return list
    },
    // 上级汇报部门下拉节点树点击事件
    orgSelectTreeClick (data, node) {
      this.formData.superReportingDept = data.orgUnitName
      this.formData.superReportingDeptId = data.orgUnitId
    },
    // 异步获取地区
    syncGetArea (orgData) {
      if (orgData.belongArea && !orgData.managedArea) {
        return req('getAreaMsg', {code: orgData.belongArea}).then(data => {
          let managedArea = {
            areaCode: '',
            areaName: '',
            areaId: ''
          }
          return [data[0] || managedArea, managedArea]
        })
      } else if (orgData.managedArea && !orgData.belongArea) {
        return req('getAreaMsg', {code: orgData.managedArea}).then(data => {
          let belongArea = {
            areaCode: '',
            areaName: '',
            areaId: ''
          }
          return [belongArea, data[0] || belongArea]
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
        return req('getAreaMsg', {code: orgData.belongArea}).then(belongArea => {
          return req('getAreaMsg', {code: orgData.managedArea}).then(managedArea => {
            return [belongArea[0], managedArea[0]]
          })
        })
      }
    },
    // 所在区域改变
    handleBelongAreaChange (data, value) {
      this.formData.belongAreaId = data.areaId
      this.formData.belongArea = data.areaCode
      this.formData.belongAreaName = value
      this.formItemChange()
    },
    // 管理分区改变
    handleManagedAreaChange (data, value) {
      this.formData.managedAreaId = []
      this.formData.managedAreaId = data.map(area => {
        return area.areaId
      })
      this.formData.managedArea = data.map(area => {
        return area.areaCode
      }) + ''
      this.formData.managedAreaName = value
      this.formItemChange()
    },
    postFlow () {
      return {
        orgUnitMaintain: this.formData,
        beforeFormData: this.beforeFormData,
        descModel: this.descModel,
        checkCostCentral: this.checkCostCentral,
        nodeStyleIconList: this.nodeStyleIconList,
        clickNodeSelected: this.clickNodeSelected,
        ...this.flowData
      }
    },
    fillIn (data) {
      if (this.taskKey === 'hrGroupComplementId') {
        this.isEditForm = true
      }
      this.updateBox = true
      this.formData = data.orgUnitMaintain
      this.beforeFormData = data.beforeFormData
      this.descModel = data.descModel
      this.checkCostCentral = data.checkCostCentral
      this.nodeStyleIconList = data.nodeStyleIconList
      this.clickNodeSelected = data.clickNodeSelected
    },
    // 显示人员选择器
    handlerLeaderDialog () {
      this.leaderDialogShow = !this.leaderDialogShow
      this.$refs.iPersonnelSelect.resetData()
    },
    // 人员选择器确定按钮
    leaderDialogConfirm (selected) {
      if (selected.length) {
        this.formData.orgLeader = selected.map(item => {
          return item.employeeName
        }).toString()
        this.formData.orgLeaderId = selected.map(item => {
          return item.employeeId
        }).toString()
      } else {
        this.formData.orgLeader = ''
        this.formData.orgLeaderId = ''
      }
      this.formItemChange()
    },
    getTreeRoot () {
      if (this.echoTreeData.length) {
        return Promise.resolve(this.echoTreeData)
      } else {
        return reqTree('roots', {}).then(data => {
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
            this.$refs.tree.$refs.tree.root.childNodes.forEach(node => {
              node.expand()
            })
          })
        })
        .then(() => {
          if (this.taskKey === 'undefined' && this.$route.query.orgUnitId) {
            this.$nextTick(() => {
              const node = this.$refs.tree.$refs.tree.store.getNode(this.openPageSelected)
              if (node) this.nodeClick(this.openPageSelected, node)
            })
          }
        })
      } else {
        if (node.data.children && node.data.children.length > 0) {
          resolve(node.data.children)
        } else {
          reqTree('children', {id: node.data.orgUnitId}).then(data => {
            resolve(data)
          }).catch(() => {
            resolve([])
          })
        }
      }
    },
    handlerFreezeOrg (value) {
      this.isShowFreezeOrg = value
    },
    renderContent (h, {data, node}) {
      let highlightFreeze = data.status === '2' && this.isShowFreezeOrg === true
      let nodeStyle = this.nodeStyleIconList.indexOf(data.orgUnitId)
      return (
        <div>
          <span class={highlightFreeze && this.taskKey === 'undefined' ? 'iconfont icon-lock' : ''} style="margin-right:5px;"></span>
          <span style={(data.orgUnitId === this.clickNodeSelected.orgUnitId ? 'color: #3da5fe;' : '') + (highlightFreeze && this.taskKey === 'undefined' ? 'color:#d8d8d8' : '')}>{data.orgUnitName}</span>
          <span v-show={ nodeStyle >= 0} style="position:relative;display:inline-block;width:8px;height:8px;border-radius:50%;left:10px;top:-2px;background:#FF6464;"></span>
        </div>
      )
    }
  }
}
</script>
<style lang="scss" scoped>
  .module-title {
    font-size: 14px;
    font-weight: bold;
    flex-basis: 100%;
    margin-bottom: 20px;
  }
  .large-box {
    display: flex;
    padding-left: 20px;
    flex-wrap: wrap;
    .box {
      position: relative;
      border: 1px solid #e5e5e5;
      background: #F8F8F8;
      width: 400px;
      height: 550px;
      overflow: auto;
    }
    .form-box {
      background: #ffffff;
      padding-top: 0;
      position: relative;
      border: 1px solid #e5e5e5;
      background: #F8F8F8;
      width: 400px;
      height: 550px;
      .box-title {
        font-size: 14px;
        color: #3da5fe;
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        box-sizing: border-box;
        width: 100%;
        background: #f8f8f8;
      }
    }
    .form {
      height: 500px;
      background: #ffffff;
      overflow: auto;
    }
    .org-tree {
      height: 550px;
      overflow: auto;
      /deep/ .el-tree {
        /deep/ .el-tree-node {
          background: #F8F8F8;
        }
        /deep/ .el-tree-node__content {
          &:hover {
            background: #ffffff;
          }
        }
      }
    }
  }
  .el-input-width {
    width: 180px;
  }
  .officialDocument {
    font-size: 14px;
    flex-basis: 100%;
    margin-top: 20px;
  }
</style>
