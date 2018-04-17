<template>
  <div class="wrap">
    <i-process-flow
    processType="organizationMergeFlowNew"
    :model="formData"
    @fillin="fillIn">
      <demand-desc
      dateSelectType="month"
      action="组织合并"
      slot="requirementsDescribe"
      :model="descModel"></demand-desc>
      <div slot="maintainSubsidiary" class="trees-container">
        <!-- 大标题 -->
        <div class="org-merge-edit-title">
          组织合并设置
        </div>
        <!-- 两颗组织树 -->
        <div class="trees">
          <!-- 左边组织树 -->
          <div class="trees-box">
            <div class="trees-box-title">
              选择被合并组织
            </div>
            <div>
              <org-tree
                ref="leftTree"
                class="org-tree"
                @handler-freeze="leftHandlerFreezeOrg"
                :defaultExpandedKeys="leftDefaultNodeKeys"
                :cstRenderContent="leftCstRenderContent"
                @node-click="leftNodeClick"
                :cstLoadData="leftLoadData"
              >
              </org-tree>
            </div>
          </div>
          <!-- 中间空白 -->
          <div class="trees-center-box">
            合并到》
          </div>
          <!-- 右边组织树 -->
          <div class="trees-box">
            <div class="trees-box-title">
              选择合并到组织
            </div>
            <div>
              <org-tree
                ref="rightTree"
                class="org-tree"
                @handler-freeze="rightHandlerFreezeOrg"
                :defaultExpandedKeys="rightDefaultNodeKeys"
                :cstRenderContent="rightCstRenderContent"
                @node-click="rightNodeClick"
                :cstLoadData="rightLoadData"
              >
              </org-tree>
            </div>
          </div>
        </div>
        <!-- 编辑表单标题 -->
        <div class="org-merge-edit-title edit-after-form">
          编辑合并后组织
        </div>
        <!-- 表单 -->
        <div class="edit-form">
          <el-form :model="formData" :rules="formRules" label-width="140px">
            <el-form-item label="合并后组织名称">
              <el-input :maxlength="32" @change="handlerOrgUnitName" :disabled="disabledMap.orgUnitName" v-model="formData.orgUnitName"></el-input>
            </el-form-item>
            <el-form-item label="合并后组织简称">
              <el-input :maxlength="32" :disabled="disabledMap.orgShortName" v-model="formData.orgShortName"></el-input>
            </el-form-item>
            <el-form-item v-if="taskKey === 'finance' && checkCostCentral" style="margin-bottom:15px;" label="成本中心" prop="costCentralId">
              <org-cost-center v-model="formData.costCentralId"></org-cost-center>
            </el-form-item>
          </el-form>
        </div>
        <!-- 是否已发公文 -->
        <div v-if="showMap.isHasOfficialDocument" class="official-document">
          本次合并组织是否已发公文
          <el-checkbox v-model="isHasOfficialDocument"></el-checkbox>
        </div>
        <!-- 是否设置成本中心 -->
        <div class="official-document" v-if = "taskKey === 'undefined'">
          本次合并组织是否配置成本中心
          <el-checkbox v-model="checkCostCentral" @change="setOrgCostCenterTable"></el-checkbox>
        </div>
      </div>
      <!-- 组织变更情况表格 -->
      <div slot="changeOrganizational">
        <div class="table-header">组织变更情况</div>
        <i-table
          class="table"
          :table="orgHandlerTable">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="tableScope.clone">
              <el-table-column prop="mergeType" label="变更类型" align="center"></el-table-column>
              <el-table-column prop="orgUnitName" label="组织名称" align="center">
                <template slot-scope="scope">
                  <el-popover style="min-width:50px;" trigger="hover" placement="top">
                    <div style="padding:5px;">{{scope.row.orgPathName}}</div>
                    <span slot="reference">{{scope.row.orgUnitName}}</span>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                v-for="(item, index) in tableScope.columns"
                :label="item.label"
                :prop="item.prop"
                :key="index"
                :formatter="tableScope.formatter">
              </el-table-column>
            </el-table>
          </template>
        </i-table>
      </div>
      <!-- 人员调动情况 -->
      <div class="emp-table" slot="personnelChanges">
        <div class="table-header">人员调动情况</div>
          <el-table
           :stripe="true"
           :border="false"
           :data="empTableInfo.data">
            <el-table-column
              align="center"
              v-for="(item, index) in empHandlerColumns"
              :label="item.label"
              :prop="item.prop"
              :key="index">
            </el-table-column>
          </el-table>
          <el-pagination
            background
            v-show="empTableInfo.data.length"
            class="emp-pagination"
            @size-change="empTableChangeSize"
            @current-change="empTableCurrentChange"
            :current-page="empTableInfo.pageIndex"
            :page-sizes="[10,20,30,50,100]"
            :page-size="empTableInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="empTableInfo.total">
          </el-pagination>
      </div>
    </i-process-flow>
  </div>
</template>
<script>
import IProcessFlow from 'components/common/i-process-flow'
import processMixin from 'mixins/process'
import orgDialog from 'mixins/orgDialog'
import DemandDesc from 'components/flow/demand-desc'
import req from 'api/org/setting.js'
import ITable from 'components/common/i-table'
import reqTree from 'api/org/tree'
import moment from 'moment'
import OrgTree from 'components/org/public/org-tree'
import OrgFlowTable from 'components/org/setting/org-flow-table'
import ISelectTree from 'components/common/i-select-tree/i-select-tree'
import OrgCostCenter from 'components/org/public/org-cost-center'

export default {
  components: {
    IProcessFlow,
    DemandDesc,
    OrgTree,
    OrgFlowTable,
    ISelectTree,
    OrgCostCenter,
    ITable
  },
  mixins: [orgDialog, processMixin],
  data () {
    return {
      // 是否配置成本中心
      checkCostCentral: false,
      // empTablePageIndex: 1,
      leftIsShowFreezeOrg: true,
      rightIsShowFreezeOrg: true,
      isHasOfficialDocument: false,
      // 左边组织树点击Data
      leftSelected: {},
      leftSelectNode: null,
      leftDefaultNodeKeys: [],
      // 右边组织树点击data
      rightSelected: {},
      rightSelectNode: null,
      rightDefaultNodeKeys: [],
      empEmployeeIds: [],
      // 左边保存小红点的数组
      leftNodeStyleIconList: [],
      // 右边保存小红点的数组
      rightNodeStyleIconList: [],
      // 左边保存组织树data数据
      leftTreeData: [],
      // 右边保存组织树data数据
      rightTreeData: [],
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
      // 被更新的组织数据
      updateForm: {},
      // 被撤销的组织数据
      depealForm: {},
      // 需求描述
      descModel: {
        effectiveDate: '',
        desc: '',
        reason: '',
        attachmentIds: []
      },
      flowData: {
        isHasOfficialDocument: 'N',
        processDefinitionId: 'organizationMergeFlowNew',
        operateType: '4'
      },
      orgHandlerTable: {
        columns: [
          {prop: 'orgShortName', label: '组织简称'},
          {prop: 'orgType', label: '组织类型', display: {dict: 'ORG_TYPE'}},
          {prop: 'businessType', label: '业态', display: {dict: 'ORG_BUSINESS_TYPE'}},
          {prop: 'orgLeader', label: '部门负责人'},
          {prop: 'orgResponsibility', label: '关键职责'},
          {prop: 'effectiveDate', label: '生效日期', display: { date: 'long' }}
        ],
        data: null
      },
      // 人员调动情况表格数据
      empTableInfo: {
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        data: []
      },
      empHandlerTable: [],
      empHandlerColumns: [
        {prop: 'employeeCode', label: '员工号'},
        {prop: 'employeeName', label: '人员名称'},
        {prop: 'unitName', label: '所在原组织'},
        {prop: 'newOrgName', label: '异动后组织'},
        {prop: 'positionName', label: '职位'},
        {prop: 'effectiveDate', label: '生效时间'}
      ],
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
      }
    }
  },
  watch: {
    'formData.orgUnitName': {
      handler () {
        this.updateForm.orgUnitName = this.formData.orgUnitName
        this.$nextTick(() => {
          let index = this.orgHandlerTable.data[0].orgPathName.lastIndexOf('_')
          if (index === -1) {
            this.orgHandlerTable.data[0].orgPathName = this.formData.orgUnitName
          } else {
            this.orgHandlerTable.data[0].orgPathName = this.orgHandlerTable.data[0].orgPathName.slice(0, index) + '_' + this.formData.orgUnitName
          }
        })
      }
    },
    'formData.orgShortName': {
      handler () {
        this.updateForm.orgShortName = this.formData.orgShortName
      }
    },
    'descModel.effectiveDate': {
      handler () {
        this.updateForm.effectiveDate = this.descModel.effectiveDate
        this.depealForm.effectiveDate = this.descModel.effectiveDate
      }
    },
    // 人员调动表格
    empTableInfo: {
      handler (newValue, oldValue) {
        this.handlerEmpTable(this.empTableInfo.pageSize, this.empTableInfo.pageIndex)
      },
      immediate: true
    },
    // 是否已发公文
    isHasOfficialDocument () {
      if (this.isHasOfficialDocument === true) {
        this.flowData.isHasOfficialDocument = 'Y'
      } else {
        this.flowData.isHasOfficialDocument = 'N'
      }
    },
    // 更新表单
    updateForm: {
      handler () {
        this.orgHandlerTable.data = [this.updateForm, this.depealForm]
      },
      deep: true
    },
    // 撤销表单
    depealForm: {
      handler () {
        this.orgHandlerTable.data = [this.updateForm, this.depealForm]
      },
      deep: true
    }
  },
  created () {
    this.updateForm.mergeType = '更新'
    this.depealForm.mergeType = '撤销'
    this.orgHandlerTable.data = [this.updateForm, this.depealForm]
  },
  computed: {
  },
  methods: {
    test () {

    },
    // 是否设置成本中心
    setOrgCostCenterTable (checked) {
      this.checkCostCentral = checked
      this.$set(this.formData, 'checkCostCentral', checked)
    },
    filterNode (treeNode, node) {
      node.data = treeNode.data
      node.parent = treeNode.parent
      if (treeNode.parent) {
        this.filterNode(treeNode.parent, node.parent)
      }
    },
    // 人员调动表格分页方法
    handlerEmpTable (pageSize, pageIndex) {
      let start = this.empTableInfo.pageSize * (this.empTableInfo.pageIndex - 1)
      let end = this.empTableInfo.pageSize * this.empTableInfo.pageIndex
      this.empTableInfo.data = this.empHandlerTable.slice(start, end)
    },
    // pageSize
    empTableChangeSize (value) {
      this.empTableInfo.pageSize = value
      this.handlerEmpTable(value, this.empTableInfo.pageIndex)
    },
    // pageIndex
    empTableCurrentChange (value) {
      this.empTableInfo.pageIndex = value
      this.handlerEmpTable(this.empTableInfo.pageSize, value)
    },
    // 左侧组织树点击
    leftNodeClick (data, node) {
      if (this.taskKey === 'undefined' || this.taskKey === 'hrGroupComplementId') {
        this.leftSelected = data
        this.leftSelectNode = node
        req('getWorkingEmp', { orgUnitId: data.orgUnitId, maxNum: 100000 }).then(empData => {
          let effectiveDate = moment(this.descModel.effectiveDate).format('YYYY-MM-DD')
          // 保存人员id数组
          this.empEmployeeIds = empData.map(item => {
            return item.employeeId
          })
          // 表格默认数据
          this.empHandlerTable = empData.map(item => {
            return Object.assign(item, {
              ...item,
              newOrgName: this.updateForm.orgUnitName,
              effectiveDate: effectiveDate
            })
          })
          this.empTableInfo = Object.assign({}, this.empTableInfo, {
            total: empData.length
          })
        })
        req('echoDetail', {id: data.orgUnitId}).then(data => {
          this.depealForm = Object.assign({}, this.depealForm, data)
        })
        this.leftNodeStyleIconList = []
        this.leftNodeStyleIconList = this.leftGetNodeStyleIcon(this.$refs.leftTree.$refs.tree.store.getNode(this.leftSelected), this.leftNodeStyleIconList)
      } else {
        this.$message({
          type: 'info',
          message: '该操作将不会修改流程参数'
        })
      }
    },
    // 右侧组织树点击
    rightNodeClick (data, node) {
      if (this.taskKey === 'undefined' || this.taskKey === 'hrGroupComplementId') {
        this.rightSelected = data
        this.rightSelectNode = node
        req('echoDetail', {id: data.orgUnitId}).then(data => {
          Object.assign(this.formData, data)
          this.updateForm = Object.assign({}, this.updateForm, data, {
            empEmployeeIds: this.empEmployeeIds,
            effectiveDate: this.descModel.effectiveDate
          })
          this.empTableInfo.data.forEach(item => {
            item.newOrgName = this.updateForm.orgUnitName
          })
        })
        this.rightNodeStyleIconList = []
        this.rightNodeStyleIconList = this.rightGetNodeStyleIcon(this.$refs.rightTree.$refs.tree.store.getNode(this.rightSelected), this.rightNodeStyleIconList)
      } else {
        this.$message({
          type: 'info',
          message: '该操作将不会修改流程参数'
        })
      }
    },
    // 找到更新节点的路径，显示小红点
    leftGetNodeStyleIcon (node, list) {
      list.push(node.parent.data.orgUnitId)
      if (node.parent.level !== 1) {
        this.leftGetNodeStyleIcon(node.parent, list)
      }
      return list
    },
    // 找到更新节点的路径，显示小红点
    rightGetNodeStyleIcon (node, list) {
      list.push(node.parent.data.orgUnitId)
      if (node.parent.level !== 1) {
        this.rightGetNodeStyleIcon(node.parent, list)
      }
      return list
    },
    postFlow () {
      let i = this.updateForm.orgPathName.lastIndexOf('_') + 1
      this.updateForm.orgPathName = this.updateForm.orgPathName.slice(0, i) + this.updateForm.orgUnitName
      this.updateForm.costCentralId = this.formData.costCentralId
      if (this.leftSelectNode !== null) {
        this.getDefaultExpandNodeKeys(this.leftSelectNode, this.leftDefaultNodeKeys)
      }
      if (this.rightSelectNode !== null) {
        this.getDefaultExpandNodeKeys(this.rightSelectNode, this.rightDefaultNodeKeys)
      }
      this.leftTreeData = this.getNodeChldren(this.$refs.leftTree.$refs.tree.root.childNodes)
      this.rightTreeData = this.getNodeChldren(this.$refs.rightTree.$refs.tree.root.childNodes)
      return {
        orgUnitMaintains: [this.updateForm, this.depealForm],
        formData: this.formData,
        empList: this.empTable,
        leftSelected: this.leftSelected,
        rightSelected: this.rightSelected,
        leftDefaultNodeKeys: this.leftDefaultNodeKeys,
        rightDefaultNodeKeys: this.rightDefaultNodeKeys,
        leftNodeStyleIconList: this.leftNodeStyleIconList,
        rightNodeStyleIconList: this.rightNodeStyleIconList,
        empHandlerTable: this.empHandlerTable,
        empTableInfo: this.empTableInfo,
        descModel: this.descModel,
        checkCostCentral: this.checkCostCentral,
        leftTreeData: this.leftTreeData,
        rightTreeData: this.rightTreeData,
        ...this.flowData
      }
    },
    fillIn (data) {
      this.formData = data.formData
      this.empTable = data.empList
      this.descModel = data.descModel
      this.leftSelected = data.leftSelected
      this.rightSelected = data.rightSelected
      this.leftDefaultNodeKeys = data.leftDefaultNodeKeys
      this.rightDefaultNodeKeys = data.rightDefaultNodeKeys
      this.updateForm = data.orgUnitMaintains[0]
      this.depealForm = data.orgUnitMaintains[1]
      this.empHandlerTable = data.empHandlerTable
      this.empTableInfo = data.empTableInfo
      this.checkCostCentral = data.checkCostCentral
      this.leftNodeStyleIconList = data.leftNodeStyleIconList
      this.rightNodeStyleIconList = data.rightNodeStyleIconList
      this.leftTreeData = data.leftTreeData
      this.rightTreeData = data.rightTreeData
    },
    leftCstRenderContent (h, {data, node}) {
      let highlightFreeze = data.status === '2' && this.leftIsShowFreezeOrg === true
      let nodeStyle = this.leftNodeStyleIconList.indexOf(data.orgUnitId)
      return (
        <div>
          <span class={highlightFreeze && this.taskKey === 'undefined' ? 'iconfont icon-lock' : ''} style="margin-right:5px;"></span>
          <span style={(data.orgUnitId === this.leftSelected.orgUnitId ? 'color: #3da5fe;' : '') + (highlightFreeze && this.taskKey === 'undefined' ? 'color:#d8d8d8' : '')}>{data.orgUnitName}</span>
          <span v-show={ nodeStyle >= 0} style="position:relative;display:inline-block;width:8px;height:8px;border-radius:50%;left:10px;top:-2px;background:#FF6464;"></span>
        </div>
      )
    },
    leftHandlerFreezeOrg (value) {
      this.leftIsShowFreezeOrg = value
    },
    rightCstRenderContent (h, {data, node}) {
      let highlightFreeze = data.status === '2' && this.rightIsShowFreezeOrg === true
      let nodeStyle = this.rightNodeStyleIconList.indexOf(data.orgUnitId)
      return (
        <div>
          <span class={highlightFreeze && this.taskKey === 'undefined' ? 'iconfont icon-lock' : ''} style="margin-right:5px;"></span>
          <span style={(data.orgUnitId === this.rightSelected.orgUnitId ? 'color: #3da5fe;' : '') + (highlightFreeze && this.taskKey === 'undefined' ? 'color:#d8d8d8' : '')}>{data.orgUnitName}</span>
          <span v-show={ nodeStyle >= 0} style="position:relative;display:inline-block;width:8px;height:8px;border-radius:50%;left:10px;top:-2px;background:#FF6464;"></span>
        </div>
      )
    },
    rightHandlerFreezeOrg (value) {
      this.rightIsShowFreezeOrg = value
    },
    getDefaultExpandNodeKeys (node, list) {
      let id = node.level === 1 ? node.data.orgUnitid : node.data.parentId
      list.push(id)
      if (node.level !== 1) {
        this.getDefaultExpandNodeKeys(node.parent, list)
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
    // 请求组织树方法
    getTreeRoot () {
      return reqTree(this.requestUrls.root.url, {}).then(data => {
        return data
      })
    },
    leftLoadData (node, resolve) {
      if (node.level === 0) {
        this.getTreeRoot().then(data => {
          if (this.taskKey === 'undefined') {
            resolve(data)
          } else {
            resolve(this.leftTreeData)
          }
        })
        .then(() => {
          this.$nextTick(() => {
            this.$refs.leftTree.$refs.tree.root.childNodes.forEach(node => {
              node.expand()
            })
          })
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
    rightLoadData (node, resolve) {
      if (node.level === 0) {
        this.getTreeRoot().then(data => {
          if (this.taskKey === 'undefined') {
            resolve(data)
          } else {
            resolve(this.rightTreeData)
          }
        })
        .then(() => {
          this.$nextTick(() => {
            this.$refs.rightTree.$refs.tree.root.childNodes.forEach(node => {
              node.expand()
            })
          })
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
    }
  }
}
</script>
<style lang="scss" scoped>
.trees-container {
  width: 900px;
  min-height: 780px;
  margin-left: 20px;
  margin-bottom: 20px;
  .org-merge-edit-title {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    font-weight: bold;
  }
  .trees {
    width: 900px;
    height: 500px;
    display: flex;
    .trees-center-box {
      width: 100px;
      height: 500px;
      line-height: 500px;
      text-align: center;
      color: #8D8D8D;
      font-size: 14px;
      border-top: 1px solid #E8E8E8;
      border-bottom: 1px solid #E8E8E8;
    }
    .trees-box {
      width: 400px;
      height: 500px;
      border: 1px solid #E8E8E8;
      background: #f8f8f8;
      .trees-box-title {
        width: 400px;
        height: 50px;
        padding-left: 20px;
        box-sizing: border-box;
        line-height: 50px;
        font-size: 14px;
        color: #4A4A4A;
        border: none;
        background: #ffffff;
        border-bottom: 1px solid #E8E8E8;
      }
    }
  }
  .edit-form {
    min-height: 130px;
    width: 900px;
    border: 1px solid #E8E8E8;
    box-sizing: border-box;
    .el-form-item {
      width: 350px;
      margin-top: 15px;
      margin-bottom: 0;
    }
  }
}
.org-tree {
  height: 450px;
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
.edit-after-form {
  border-left: 1px solid #E8E8E8;
  border-right: 1px solid #E8E8E8;
  padding-left: 20px;
}
.table {
  width: 95%;
  margin-left: 20px;
  margin-bottom: 20px;
}
.official-document {
  font-size: 14px;
  height: 50px;
  line-height: 50px;
}
.tree-node-color {
  background-color: #f1f3f6;
  // color: #3da5fe;
  color: red;
}
.table-header{
  font-size:14px;
  font-weight:bold;
  margin-left: 20px;
  margin-bottom: 10px;
}
.has-gutter {
  color: #000000;
  height: 36px;
  line-height: 36px;
  background-color: #c8c8c8;
}
.emp-table {
  width: 95%;
  margin-left: 20px;
  margin-bottom: 40px;
  position: relative;
  .table-header {
    margin-left: 0;
  }
  .emp-pagination {
    position: absolute;
    bottom: -40px;
    right: 0;
  }
}
.emp-table {
  .el-table {
    border: 1px solid #E8E8E8;
    /deep/ thead {
      background: #F2F2F2;
      tr {
        background: #F2F2F2;
      }
    }
    /deep/ tr {
      height: 36px;
      font-size: 12px;
      background: #ffffff;
      color: #3A3A53;
      th {
        height: 36px;
      }
      td {
        height: 36px;
        border: none;
      }
    }
  } 
}
.el-pagination {
  /deep/ .btn-prev, /deep/ .btn-next {
    background: #ffffff;
    border-radius: 0;
    border: 1px solid #E8E8E8;
  }
  /deep/ .el-pager{
    li {
      background: #ffffff;
      border-radius: 0;
      border: 1px solid #E8E8E8;
    }
  }
}
</style>
