<template>
<div class="wrap">
  <i-process-flow
    processType="organizationRepealFlow"
    @err="err"
    @fillin="fillIn">
      <demand-desc
      dateSelectType="month"
      action="组织撤销"
      slot="requirementsDescribe"
      :read-only = "disabledMap.orgSubsidiaryTable"
      :model="descModel"></demand-desc>
      <div slot="maintainSubsidiary">
        <h3 class="info-title">需撤销组织</h3>
        <div class="container">
          <!-- 左边组织树 -->
          <div class="box">
            <org-tree
            ref="tree"
            class="org-tree"
            @handler-freeze="handlerFreezeOrg"
            :defaultExpandedKeys="defaultExpandKeys"
            :cstRenderContent="renderContent"
            @node-click="nodeClick">
            </org-tree>
          </div>
          <!-- 右边表单 -->
          <div class="box form-box">
            <div class="box-title">
              查看组织
            </div>
            <el-form :model="formData" label-width="140px">
              <el-form-item label="组织名称">
                <span>{{formData.orgUnitName}}</span>
              </el-form-item>
              <el-form-item label="组织简称">
                <span>{{formData.orgShortName}}</span>
              </el-form-item>
              <el-form-item label="组织类别">
                <span>{{formData.orgTypeName}}</span>
              </el-form-item>
              <el-form-item label="业态">
                <span>{{formData.businessTypeName}}</span>
              </el-form-item>
              <el-form-item label="部门负责人">
                <span>{{formData.orgLeader}}</span>
              </el-form-item>
              <el-form-item label="关键职责">
                <span>{{formData.orgResponsibility}}</span>
              </el-form-item>
              <el-form-item label="成本中心">
                <span>{{formData.costCentralId}}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div v-if="showMap.isHasOfficialDocument" class="official">
          <span>本次撤销的组织已发公文</span>
          <el-checkbox v-model="isOfficial"></el-checkbox>
        </div>
        <p v-show="empIds.length > 0">
          所选组织仍包含员工，请前往 
          <span class="batchCrew" @click="jumpToEmpmovement">批量调动人员
            <span v-show="empIds.length>=25">(组织下人员较多，请手动选择被调动人员)</span>
          </span>
            &nbsp;&nbsp;&nbsp;
        </p>
        <i-dialog
          v-model="isDialogShow"
          size="small"
          :toolbar="toolbar">
          <div>
            组织下存在人员，不能撤销该组织，是否跳转人员调动流程？
          </div>
        </i-dialog>
      </div>
  </i-process-flow>
</div>
</template>
<script>
import IProcessFlow from 'components/common/i-process-flow'
import DemandDesc from 'components/flow/demand-desc'
import OrgTree from 'components/org/public/org-tree'
import { windowOpen } from 'utils'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import req from 'api/org/setting.js'
import orgDialog from 'mixins/orgDialog'
import processMixin from 'mixins/process'
export default {
  components: {
    IProcessFlow,
    DemandDesc,
    OrgTree,
    IDialog
  },
  data () {
    return {
      isOfficial: false,
      isDialogShow: false,
      isShowFreezeOrg: true,
      selected: null,
      defaultExpandKeys: [],
      toolbar: [{
        text: '确定',
        type: 'primary',
        func: this.dialogConfirm
      }, {
        text: '取消',
        type: 'text',
        func: this.dialogCancel
      }],
      // 需求描述表单
      descModel: {
        effectiveDate: '', // 生效日期
        desc: '', // 描述
        reason: '',  // 原因
        attachmentIds: []
      },
      // 表单内容
      formData: {},
      flowData: {
        isHasOfficialDocument: 'N',
        processDefinitionId: 'organizationRepealFlow',
        operateType: '7'
      },
      empIds: []
    }
  },
  mixins: [orgDialog, processMixin],
  mounted () {
    if (this.$route.query.orgUnitId && window.sessionStorage.getItem('ORGNODEDATA')) {
      this.nodeClick(JSON.parse(window.sessionStorage.getItem('ORGNODEDATA')))
    }
  },
  watch: {
    isOfficial () {
      if (this.isOfficial === true) {
        this.flowData.isHasOfficialDocument = 'Y'
      } else {
        this.flowData.isHasOfficialDocument = 'N'
      }
    },
    'descModel.effectiveDate': {
      handler () {
        this.formData = Object.assign({}, this.formData, {effectiveDate: this.descModel.effectiveDate})
      }
    }
  },
  methods: {
    getDefaultExpandList (node, list) {
      list.push(node.parent.data.orgUnitId)
      if (node.parent.level !== 1) {
        this.getDefaultExpandList(node.parent, list)
      }
    },
    // 组织树点击方法
    nodeClick (data, node) {
      this.selected = data
      req('echoDetail', {id: data.orgUnitId}).then(orgData => {
        Promise.all([
          this.$d('ORG_TYPE', orgData.orgType),
          this.$d('ORG_BUSINESS_TYPE', orgData.businessType)
        ]).then(data => {
          this.formData = Object.assign({}, this.formData, orgData, {
            orgTypeName: data[0],
            businessTypeName: data[1],
            effectiveDate: this.descModel.effectiveDate
          })
          this.defaultExpandKeys = []
          this.getDefaultExpandList(node, this.defaultExpandKeys)
        })
      })

      // 获取组织下人员
      req('emp', Object.assign({}, {orgUnitId: data.orgUnitId, isFindChildren: true, pageSize: -1})).then(emps => {
        this.saveEmps(emps.data)
      })
    },
    // 存放当前撤销组织下人员
    saveEmps (data) {
      if (Array.isArray(data)) {
        this.empIds = data.map(emp => {
          return emp.empEmployeeId
        })
      }
    },
    // 跳转到批量调动
    jumpToEmpmovement () {
      windowOpen(`/flow.html#/flow/new_employee_multi_movement`, {
        processType: 4,
        empEmployeeId: this.empIds.length >= 25 ? '' : JSON.stringify(this.empIds)
      })
    },
    err (err) {
      if (err && err.message.indexOf('请先调离人员') !== -1) {
        this.isDialogShow = true
      }
    },
    dialogConfirm () {
      this.jumpToEmpmovement()
      this.isDialogShow = false
    },
    dialogCancel () {
      this.isDialogShow = false
    },
    postFlow () {
      let node = this.$refs.tree.$refs.tree.store.getNode(this.selected)
      this.defaultExpandKeys = []
      this.getDefaultExpandList(node, this.defaultExpandKeys)
      return {
        orgUnitMaintain: this.formData,
        descModel: this.descModel,
        selected: this.selected,
        defaultExpandKeys: this.defaultExpandKeys,
        ...this.flowData
      }
    },
    fillIn (data) {
      this.formData = data.orgUnitMaintain
      this.descModel = data.descModel
      this.selected = data.selected
      this.defaultExpandKeys = data.defaultExpandKeys
    },
    renderContent (h, {data, node}) {
      let highlightFreeze = data.status === '2' && this.isShowFreezeOrg === true
      let nodeStyle = this.defaultExpandKeys.indexOf(data.orgUnitId)
      return (
        <div>
          <span class={highlightFreeze && this.taskKey === 'undefined' ? 'iconfont icon-lock' : ''} style="margin-right:5px;"></span>
          <span style={(this.selected && this.selected.orgUnitId === data.orgUnitId ? 'color: #3da5fe' : '') + (highlightFreeze && this.taskKey === 'undefined' ? 'color:#d8d8d8;' : '')}>{data.orgUnitName}</span>
          <span v-show={ nodeStyle >= 0} style="position:relative;display:inline-block;width:8px;height:8px;border-radius:50%;left:10px;top:-2px;background:#FF6464;"></span>
        </div>
      )
    },
    handlerFreezeOrg (value) {
      this.isShowFreezeOrg = value
    }
  }
}
</script>

<style lang="scss" scoped>

  p {
    padding-left: 20px;
    color: #FF6464;
  }
  .batchCrew {
    color: #5bb3ff;
    cursor: pointer;
  }
  .info-title {
    font-size: 14px;
    font-weight: bold;
    color: #000000;
    margin-left: 20px;
  }
  .container {
    display: flex;
    margin-left: 20px;
    margin-top: 20px;
    .box {
      .box-title {
        height: 50px;
        width: 100%;
        line-height: 50px;
        box-sizing: border-box;
        background: #f8f8f8;
        padding-left: 20px;
        font-size: 14px;
      }
      width: 500px;
      height: 600px;
      overflow: auto;
      border: 1px solid #E8E8E8;
      background: #f8f8f8;
      box-sizing: border-box;
      .org-tree {
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
    .form-box {
      background: #ffffff;
    }
  }
  .official {
    margin-left: 20px;
    margin-top: 15px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form {
    margin-top: 15px;
  }
</style>
