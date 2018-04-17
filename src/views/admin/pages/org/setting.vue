<template>
  <div class="wrap">
      <i-layout :aside-padding="0">
        <div slot="aside" class="aside">
          <header class="header-flex">
            <div>
              <i-control-layout 
              moreBtnType = "default"
              trigger="click" 
              :btnCol="3" 
              justifyContent="right" 
              :toolbar="buttonControl"></i-control-layout>
            </div>
          </header>

          <div class="org-tree">
            <org-tree
             ref="orgTree"
             :treeStyle="treeStyle"
             :showFilter="isOrgTreeShow"
             @node-click="curNodeClicked"
             @getRoot="setCurrentData">
            </org-tree>
          </div>
        </div>
        <!-- <div slot="header">
          <span class="header-title" style="font-weight:bold;padding-left:34px;" >{{currentNodeData.orgUnitName}}</span>
        </div> -->
        <div class="content" slot="section" ref="main">
          <setting-tab 
          ref="settingTab" 
          :tabData="currentNodeData"
          @heightChange="calculateAsideTreeHeight"
          ></setting-tab>
        </div>
      </i-layout>
      <i-dialog
        v-model="exportVisible"
        :toolbar="exportToolbar"
        :title="'导出'"
        size="small">
        <i-table-export-excel
          ref="export"
          :range="false"
          :setting="exportSetting"
          :tables="{
            elTable,
            iTable: {
              display,
              table
            }
          }"
          @exportFileId="controlExportFileId"
        />
      </i-dialog>
<!-- 对话框 -->
    <!-- <org-add-dialog v-model="dialogMap.add" :parent="currentNodeData" @confirm="refreshTree"></org-add-dialog>
    <org-update-dialog v-model="dialogMap.update" :origin="currentNodeData" @confirm="refreshTree"></org-update-dialog>
    <org-depeal-dialog v-model="dialogMap.organizationRepealFlow" :orgDepealName="currentNodeData" @confirm="refreshTree"></org-depeal-dialog>
    <org-move-dialog v-model="dialogMap.move" :origin="currentNodeData" @confirm="refreshTree"></org-move-dialog>
    <org-merge-dialog v-model="dialogMap.merge" :origin="currentNodeData" @confirm="refreshTree"></org-merge-dialog>
    <org-addlist-dialog v-model="dialogMap.organizationsCreateFlow" :parent="currentNodeData" @confirm="refreshTree"></org-addlist-dialog>
    <org-split-dialog v-model="dialogMap.split" :origin="currentNodeData" @confirm="refreshTree"></org-split-dialog> -->
    <org-edit-change-dialog v-model="dialogMap.edit" @updateOrgLeader="updateOrgLeader" :origin="currentNodeData"></org-edit-change-dialog>
    <el-dialog title="组织删除" width="30%" :visible.sync="orgDeleteDialog">
      <span>确定删除该组织及其以下所有组织？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteOrgCancel">取 消</el-button>
        <el-button type="primary" @click="deleteOrgConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <i-task ref="itask"></i-task>
  </div>
</template>
<script>
import req, {config} from 'api/org/setting'
import SettingTab from 'components/org/setting/setting-tab'
import OrgTree from 'components/org/public/org-tree'
import access from 'mixins/access'
import asideMixin from 'mixins/aside'
// import OrgUpdateDialog from 'components/org/setting/org-update-dialog'
// import OrgAddDialog from 'components/org/setting/org-add-dialog'
// import OrgAddlistDialog from 'components/org/setting/org-addlist-dialog'
// import OrgDepealDialog from 'components/org/setting/org-depeal-dialog'
// import OrgMoveDialog from 'components/org/setting/org-move-dialog'
// import OrgMergeDialog from 'components/org/setting/org-merge-dialog'
// import OrgSplitDialog from 'components/org/setting/org-split-dialog'
import OrgEditChangeDialog from 'components/org/setting/org-edit-change-dialog'
import ILayout from 'components/common/i-layout'
import IControlLayout from 'components/common/i-control-layout/i-control-layout'
import ITableExportExcel from 'components/common/i-table/export-excel'
import ITask from 'components/common/i-task'
import calculateAsideHeight from 'mixins/layout/calculate-aside-height'
import { windowOpen } from 'utils'
export default {
  name: 'Setting',
  components: {
    SettingTab,
    OrgTree,
    // OrgAddDialog,
    // OrgAddlistDialog,
    // OrgDepealDialog,
    // OrgMoveDialog,
    // OrgMergeDialog,
    // OrgUpdateDialog,
    // OrgSplitDialog,
    OrgEditChangeDialog,
    ILayout,
    IControlLayout,
    ITask,
    ITableExportExcel
  },
  mixins: [calculateAsideHeight, access, asideMixin],
  data () {
    return {
      // 导出功能弹出框控制变量
      exportBtn: false,
      // 删除功能dialog控制变量
      orgDeleteDialog: false,
      // 组织删除功能状态
      deleteOrgStatus: '',
      // 组织删除节点id
      deleteOrgId: '',
      buttonControl: [
        {text: '新增', func: this.addOrg, key: 'orgOrgsCreationPost', type: 'primary'},
        {text: '导出', func: this.showExportDialog, key: 'orgExportPost'},
        {text: '更新', func: this.updateOrg, key: 'orgOrgsUpdatePut'},
        {text: '合并', func: this.mergerOrg, key: 'orgOrgsMergencePut'},
        {text: '拆分', func: this.splitOrg, key: 'orgOrgsSplitPost'},
        {text: '调级', func: this.moveOrg, key: 'orgOrgsRelevelPut'},
        {text: '撤销', func: this.depealOrg, key: 'orgOrgsRepealPut'},
        {text: '删除', func: this.deleteOrg, key: 'orgDrgsDeleteIdOrgDelete'},
        {text: '批量新增', func: this.AddListOrg, key: 'orgOrgsCreationBatchPost'},
        {text: '批量撤销', func: this.depealListOrg, key: 'orgOrgsRepealBatchPut'},
        {text: '设置/更改负责人', func: this.setEmp, key: 'orgOrgsOIdLeaderLeaderIdPut'}
      ],
      isOrgTreeShow: true, // 控制组织树的搜索框显隐
      nodeKey: 'orgUnitId',
      orgInfo: {
        orgType: '', // 组织类别
        orgLeader: '', // 组织负责人
        belongArea: '', // 所属区域
        businessTypeKey: '', // 业态key
        managedArea: '',
        costCentralId: '', // 成本中心
        orgUnitName: '', // 组织名称
        orgUnitId: '' // 组织ID
      },
      currentNodeData: {},
      currentNode: null,
      defaultExpandKeys: [],
      dialogMap: {
        add: false,
        update: false,
        merge: false,
        split: false,
        move: false,
        copy: false,
        organizationRepealFlow: false,
        organizationsCreateFlow: false,
        organizationsDepealFlow: false,
        edit: false
      },
      // 导出相关
      exportVisible: false,
      exportToolbar: [{
        text: '取消',
        type: 'default',
        func: done => done()
      }, {
        text: '确定',
        func: done => {
          this.$refs.export && this.$refs.export.submit()
          done()
        }
      }],
      exportSetting: {
        req: config.orgExport,
        param: () => ({orgUnitId: this.currentNodeData.orgUnitId}),
        config: {
          fileName: '组织列表',
          range: 'all',
          sync: false
        }
      },
      elTable: {
        columns: [
          {property: 'orgUnitCode', label: '组织编码'},
          {property: 'orgUnitName', label: '组织名称'},
          {property: 'orgPathName', label: '组织全称'},
          {property: 'orgType', label: '组织类别', display: {dict: 'ORG_TYPE'}, formatter: true},
          {property: 'orgStandardName', label: '所属标准库'},
          {property: 'orgStandardCode', label: '标准库代码'},
          {property: 'orgResponsibility', label: '关键职责'},
          {property: 'parentOrgUnitCode', label: '上级组织代码'},
          {property: 'parentOrgUnitName', label: '上级组织名称'},
          {property: 'businessType', label: '业态', display: {dict: 'ORG_BUSINESS_TYPE'}, formatter: true},
          {property: 'belongArea', label: '所属分区'},
          {property: 'managedArea', label: '管理分区'},
          {property: 'costCentralCode', label: '成本中心代码'},
          {property: 'costCentralName', label: '成本中心名称'},
          {property: 'shopArea', label: '门店面积(㎡)'},
          {property: 'shopStatus', label: '门店状态', display: {dict: 'ORG_SHOP_STATUS'}, formatter: true},
          {property: 'shopCategory', label: '门店类型', display: {dict: 'ORG_SHOP_CATEGORY'}, formatter: true},
          {property: 'beginRunDate', label: '实际运营时间/开店时间'}
        ],
        store: { states: {} }
      },
      display: {
        dateList: {
          // beginRunDate: {
          //   default: 'yyyy-MM-dd'
          // }
        },
        dictList: {
          orgType: {
            '1': '生态支撑平台',
            '2': '生态支撑单元',
            '3': '共享服务平台',
            '4': '共享服务单元',
            '5': '专业服务平台',
            '6': '专业服务单元',
            '7': '客户经营主体',
            '8': '客户经营单元',
            '9': '虚拟组织'
          },
          businessType: {
            '1': 'Bravo+',
            '2': 'Bravo',
            '3': '精标',
            '4': '永辉生活',
            '5': '超级物种',
            '6': '常温物流',
            '7': '定温物流',
            '8': '加工物流',
            '9': '电商物流',
            '10': '彩食鲜',
            '11': '物流',
            '99': '其他'
          },
          shopStatus: {
            '0': '正常',
            '1': '闭店',
            '3': '待闭店'
          },
          shopCategory: {
            '11': 'A大卖场',
            '12': 'B卖场',
            '13': 'C社区店',
            '14': 'D社区店加强型',
            '15': 'E高级超市',
            '16': 'F超级旗舰店',
            '17': '工程虚拟店',
            '18': 'O2O会员店',
            '19': '中百托管店',
            '20': '联华托管店',
            '21': '配送中心'
          }
        }
      }
    }
  },
  computed: {
    table () {
      return {
        search: {
          orgUnitId: this.currentNodeData.orgUnitId
        }
      }
    },
    treeStyle () {
      return `height:${this.elHeight}px;`
    }
  },
  created () {

  },
  mounted () {
    this.calculateAsideTreeHeight()
    this.clearStorage()
  },
  methods: {
    // 打开异步导出详情弹窗
    controlExportFileId (id) {
      this.$refs.itask.openDialog(id)
    },
    calculateAsideTreeHeight () {
      this.controlHeightWithoutHeader(134)
    },
    showExportDialog () {
      this.exportVisible = true
    },
    // 删除按钮
    deleteOrg () {
      if (this.deleteOrgId === '') {
        this.$message({
          type: 'info',
          message: '请先选择要删除的组织节点'
        })
      } else if (this.deleteOrgStatus === '2') {
        this.$message({
          type: 'error',
          message: '该节点已被冻结，禁止对该节点进行其他操作'
        })
      } else {
        this.orgDeleteDialog = true
      }
    },
    // 删除对话框取消按钮
    deleteOrgCancel () {
      this.orgDeleteDialog = false
    },
    // 删除功能确定按钮
    deleteOrgConfirm () {
      req('deleteOrg', {id: this.deleteOrgId}).then(data => {
        if (data === true) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.orgDeleteDialog = false
          this.$refs.orgTree.getTreeRoot().then(data => {
            // this.$refs.orgTree.$refs.tree.root.childNodes
            this.$refs.orgTree.$refs.tree.store.setData(data)
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    },
    updateOrgLeader () {
      this.$refs.settingTab.getDetailData()
    },
    refreshTree () {
      this.$refs.orgTree.getTreeRoot()
    },
    // 新增组织
    addOrg () {
      this.storageTreeNodes()
      windowOpen(`/flow.html#/flow/organizationCreateFlowNew`, {processType: 'organizationCreateFlowNew', orgUnitId: this.currentNodeData.orgUnitId})
    },
    // 导出
    exportMsg () {

    },
    // 更新组织
    updateOrg () {
      this.storageTreeNodes()
      windowOpen(`/flow.html#/flow/organizationUpdateFlowNew`, {processType: 'organizationUpdateFlowNew', orgUnitId: this.currentNodeData.orgUnitId})
    },
    // 合并组织
    mergerOrg () {
      windowOpen(`/flow.html#/flow/organizationMergeFlowNew`, {processType: 'organizationMergeFlowNew'})
    },
    // 拆分组织
    splitOrg () {
      windowOpen(`/flow.html#/flow/organizationSplitFlow`, {processType: 'organizationSplitFlow', orgUnitId: this.currentNodeData.orgUnitId})
    },
    // 调级组织
    moveOrg () {
      windowOpen(`/flow.html#/flow/organizationRelevelFlowNew`, {processType: 'organizationRelevelFlowNew'})
    },
    // 撤销组织
    depealOrg () {
      windowOpen(`/flow.html#/flow/organizationRepealFlow`, {processType: 'organizationRepealFlow', orgUnitId: this.currentNodeData.orgUnitId})
    },
    // 批量新增
    AddListOrg () {
      windowOpen(`/flow.html#/flow/organizationsCreateFlowNew`, {processType: 'organizationsCreateFlowNew'})
    },
    // 批量撤销
    depealListOrg () {
      // windowOpen(`/flow.html#/flow/organizationsDepealFlow`, {processType: 'organizationsDepealFlow'})
      this.$router.push({path: '/org/org/depeal_list'})
    },
    // 设置更改负责人
    setEmp () {
      this.dialogMap.edit = true
    },
    curNodeClicked (data, node) {
      this.deleteOrgStatus = data.status
      // 控制导出真假按钮的显示
      this.exportBtn = true
      // 删除功能组织id
      this.deleteOrgId = data.orgUnitId
      this.currentNodeData = data
      this.currentNode = node
      window.sessionStorage.setItem('ORGNODEDATA', JSON.stringify(data))
      this.$refs.settingTab.setActiveTab('details')
    },
    setCurrentData ({orgUnitId}) {
      this.getDetailsData(orgUnitId)
    },
    getDetailsData (id) {
      req('echoDetail', { id: id }).then(data => {
        this.currentNodeData = data
      }).catch(() => {
        this.currentNodeData = {}
      })
    },
    /**
     * 递归整棵树,返回组织流程初始化时需要展开的节点数据
     * @param {Array} nodeList
     */
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
     * 将数据存放在sessionStorage里
     */
    storageTreeNodes () {
      if (this.currentNode) {
        this.handleExpandKeys(this.currentNode)
      }
      let treeNodes = this.getNodeChldren(this.$refs.orgTree.$refs.tree.root.childNodes)
      window.sessionStorage.setItem('ORGTREENODES', JSON.stringify(treeNodes))
      window.sessionStorage.setItem('ORGTREEEXPANDKEYS', JSON.stringify(this.defaultExpandKeys))
    },
    handleExpandKeys (node) {
      this.defaultExpandKeys.push(node.data.orgUnitId)
      if (node.parent && node.parent.level !== 1) {
        this.handleExpandKeys(node.parent)
      }
    },
    clearStorage () {
      window.sessionStorage.removeItem('ORGTREENODES')
      window.sessionStorage.removeItem('ORGTREEEXPANDKEYS')
      window.sessionStorage.removeItem('ORGNODEDATA')
    }
  }
}
</script>
<style lang="scss" scoped>
  .wrap{
    .org-tree{
      padding-top:15px;
      text-align:center;
      .search{
        margin-bottom:10px;
      }
      .tree{
        text-align:left;
        border:none;
      }
    }
  }
  .main{
    display: flex;
  }
  .aside{
    padding-top: 15px;
    .i-table {
      /deep/ header {
        margin-bottom: 0;
      }
    }
  }
  .info{
    display: flex;
    justify-content: space-around;
    padding: 20px;
    font-size:12px;
    color:#000;
    .label{
      display:inline-block;
      min-width:80px;
      color: #4d4d4d;
      text-align:right;
    }
    .item{
      &+.item{
        margin-top:20px;
      }
    }
  }
  .header-title{
    font-size:16px;
    line-height:28px;
  }
  .header-flex{
    display:flex;
    justify-content: flex-end;
    padding: 0 15px;
  }
</style>
