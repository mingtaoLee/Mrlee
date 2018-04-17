<template>
<div class="wrap">
    <i-process-flow
      processType="organizationRelevelFlowNew"
      @fillin="fillIn">
      <demand-desc
        dateSelectType="month"
        :read-only="disabledMap.orgSubsidiaryTable"
        slot="requirementsDescribe"
        action="组织调级"
        :model="descModel">
      </demand-desc>
      <!-- 组织树 -->
      <div slot="maintainSubsidiary" class="trees-container">
        <!-- 大标题 -->
        <div class="org-merge-edit-title">
          组织调级设置
        </div>
        <!-- 两颗组织树 -->
        <div class="trees">
          <!-- 左边组织树 -->
          <div class="trees-box">
            <div class="trees-box-title">
              选择调级组织
            </div>
            <div>
              <org-tree
                ref="leftTree"
                class="org-tree"
                nodeKey="orgUnitId"
                :showCheckbox="isShowCheckbox"
                @handler-freeze="handlerFreezeOrg"
                :checkStrictly="true"
                :defaultExpandedKeys="leftDefaultExpandIdList"
                @check-change="leftCheckChange"
                :cstRenderContent="renderContent"
                :defaultCheckedKeys="leftCheckedIdList"
                :cstLoadData = "leftLoadData"
                @node-click="leftNodeClick">
              </org-tree>
            </div>
          </div>
          <div class="trees-center-box">
            调级到》
          </div>
          <!-- 右边组织树 -->
          <div class="trees-box">
            <div class="trees-box-title">
              选择调级到该组织
            </div>
            <div>
              <org-tree
                ref="rightTree"
                class="org-tree"
                :defaultExpandedKeys="rightDefaultExpandIdList"
                :cstRenderContent="rightRenderContent"
                @handler-freeze="rightHandlerFreezeOrg"
                :cstLoadData = "rightLoadData"
                @node-click="rightNodeClick">
              </org-tree>
            </div>
          </div>
        </div>
        <!-- 是否已发公文 -->
        <div v-if="showMap.isHasOfficialDocument" class="official-document">
          本次调级组织是否已发公文
          <el-checkbox v-model="isHasOfficialDocument"></el-checkbox>
        </div>
        <!-- 是否设置成本中心 -->
        <!-- <div class="officialDocument" v-if = "taskKey === 'undefined'">
          是否配置成本中心
          <el-checkbox v-model="isSetCostCentral"></el-checkbox>
        </div> -->
      </div>
      <!-- 调级信息表格 -->
      <div class="move-table" slot="afterUpgrade">
        <div class="table-title">组织变更情况</div>
        <el-table :data="moveTableInfo.data">
          <el-table-column prop="moveType" label="组织变更类型"></el-table-column>
          <el-table-column prop="orgUnitName" label="组织名称">
            <template slot-scope="scope">
              <el-popover style="min-width:50px;" trigger="hover" placement="top">
                <div style="padding:5px;">{{scope.row.orgPathName}}</div>
                <span slot="reference">{{scope.row.orgUnitName}}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            v-for="(item, index) in moveTableColumns"
            :label="item.label"
            :prop="item.prop"
            :key="index">
          </el-table-column>
          <el-table-column v-if="taskKey === 'financeGroupId' && isSetCostCentral" label="成本中心">
            <template slot-scope="scope">
              <org-cost-center v-model="scope.row.costCentralId"></org-cost-center>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          class="emp-pagination"
          v-show="moveTableInfo.data.length"
          @size-change="empTableChangeSize"
          @current-change="empTableCurrentChange"
          :current-page="moveTableInfo.pageIndex"
          :page-sizes="[10,20,30,50,100]"
          :page-size="moveTableInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="moveTableInfo.total">
        </el-pagination>
      </div>
    </i-process-flow>
  </div>
</template>
<script>
import DemandDesc from 'components/flow/demand-desc'
import OrgTree from 'components/org/public/org-tree'
import OrgCostCenter from 'components/org/public/org-cost-center'
import processMixin from 'mixins/process'
import orgDialog from 'mixins/orgDialog'
import req from 'api/org/setting.js'
import reqTree from 'api/org/tree'

export default {
  components: {
    DemandDesc,
    OrgTree,
    OrgCostCenter
  },
  mixins: [orgDialog, processMixin],
  data () {
    return {
      formData: {
        orgUnitId: ''
      },
      // 是否配置成本中心
      isSetCostCentral: false,
      // 是否显示左边组织树多选框
      isShowCheckbox: true,
      // 递归该数组
      valiDataMoveNodesList: [],
      // 点击右边组织树时保存当前节点的data
      rightTreeSelectedData: {},
      // 保存左边组织树多选框node数组
      // leftNodeList: [],
      // 保存左边组织树多选框data数组
      leftDataList: [],
      // 保存左边节点树默认展开id数组
      leftDefaultExpandIdList: [],
      // 保存右边节点点击的node
      // rightTreeNode: {},
      // 保存右边节点点击的data
      rightTreeData: {},
      // 保存右边节点默认展开id数组
      rightDefaultExpandIdList: [],
      // 保存左边准备删除的id数组
      leftDeleteList: [],
      // 左边控制是否冻结标志
      isShowFreezeOrg: true,
      // 右边是否控制冻结标志
      rightIsShowFreezeOrg: true,
      // 左边过滤出data和childNode的组织树数据
      leftTreeData: [],
      // 右边过滤出data和childNode的组织树数据
      rightTreeNodeData: [],
      leftCheckedIdList: [],
      moveAllTableData: [],
      moveTableColumns: [
        {label: '组织简称', prop: 'orgShortName'},
        {label: '调级前父组织', prop: 'beforeParentUnitName'},
        {label: '调级后父组织', prop: 'afterParentUnitName'}
      ],
      moveTableInfo: {
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        data: []
      },
      isHasOfficialDocument: false,
      descModel: {
        effectiveDate: '',
        desc: '',
        reason: '',
        attachmentIds: []
      },
      flowData: {
        isHasOfficialDocument: 'N',
        processDefinitionId: 'organizationRelevelFlowNew',
        operateType: '3'
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
      }
    }
  },
  methods: {
    handlerFreezeOrg (value) {
      this.isShowFreezeOrg = value
    },
    rightHandlerFreezeOrg (value) {
      this.rightIsShowFreezeOrg = value
    },
    // 左边组织树多选框事件
    leftCheckChange (data, checked, indeterminate) {
      let node = this.$refs.leftTree.$refs.tree.store.getNode(data)
      // if (node.data.orgUnitName === '公司总部') {
      //   node.checked = false
      //   return false
      // }
      // console.log('继续执行')
      if (checked === true) {
        this.getLeftDefaultExpandIdList(node)
        this.valiDataMoveNodesList.push(node)
        this.leftDataList.push(data)
        this.leftCheckedIdList = this.leftDataList.map(item => {
          return item.orgUnitId
        })
        req('echoDetail', {id: data.orgUnitId}).then(orgData => {
          this.moveAllTableData.push(Object.assign({}, orgData,
            {
              moveType: '调级',
              beforeParentUnitName: orgData.parentUnitName,
              afterParentUnitName: this.rightTreeSelectedData.orgUnitName,
              effectiveDate: this.descModel.effectiveDate
            }
          ))
          this.moveTableInfo.total = this.moveAllTableData.length
        })
      } else {
        let index = this.moveAllTableData.findIndex(item => {
          return item.orgUnitId === data.orgUnitId
        })
        let nodeIndex = this.valiDataMoveNodesList.findIndex(item => {
          return item.data.orgUnitId === data.orgUnitId
        })
        this.moveAllTableData.splice(index, 1)
        this.valiDataMoveNodesList.splice(nodeIndex, 1)
        this.leftDataList.splice(index, 1)
        this.leftCheckedIdList = this.leftDataList.map(item => {
          return item.orgUnitId
        })
        this.handlerEmpTable(this.moveTableInfo.pageSize, this.moveTableInfo.pageIndex)
        this.leftDeleteList = []
        this.leftDeleteList = this.getNodeParentIdList(node, this.leftDeleteList)
        this.eachDeleteId(this.leftDefaultExpandIdList, this.leftDeleteList)
      }
    },
    // 循环触发递归左边组织树
    eachLeftNodeList (dataList) {
      dataList.forEach(item => {
        this.getLeftDefaultExpandIdList(this.$refs.leftTree.$refs.tree.store.getNode(item))
      })
    },
    // 递归左边组织树,保存父节点id，回显展开
    getLeftDefaultExpandIdList (node) {
      if (node.parent && node.parent.level !== 1) {
        this.getLeftDefaultExpandIdList(node.parent)
      }
      this.leftDefaultExpandIdList.push(node.parent.data.orgUnitId)
    },
    // 删除data数组中不勾选的id
    getNodeParentIdList (node, list) {
      list.push(node.parent.data.orgUnitId)
      if (node.parent.level !== 1) {
        this.getNodeParentIdList(node.parent, list)
      }
      return list
    },
    // 循环匹配数组中的id，在leftDefaultExpandIdList中删除这些id
    eachDeleteId (leftIdList, deleteList) {
      let index = null
      deleteList.forEach(deleteItem => {
        leftIdList.findIndex(leftIdListItem => {
          return deleteItem === leftIdListItem
        })
        leftIdList.splice(index, 1)
      })
    },
    // 左边组织树点击事件
    leftNodeClick (data, node) {
    },
    // 右边组织树点击事件
    rightNodeClick (data, node) {
      if (this.taskKey === 'undefined' || this.taskKey === 'hrGroupComplementId' || this.taskKey === 'applyId') {
        this.rightTreeSelectedData = data
        this.rightTreeData = data
        this.moveAllTableData.forEach(item => {
          item.afterParentUnitName = data.orgUnitName
          item.parentUnitName = data.orgUnitName
          item.parentId = data.orgUnitId
        })
        this.handlerEmpTable(this.moveTableInfo.pageSize, this.moveTableInfo.pageIndex)
        this.valiDateOrgsMove(this.$refs.rightTree.$refs.tree.store.getNode(data), this.leftDataList)
        this.rightDefaultExpandIdList = []
        this.getRightDefaultExpandIdList(node)
      } else {
        this.$message({
          type: 'info',
          message: '您没有权限修改目标组织'
        })
      }
    },
    // 递归右边组织树
    getRightDefaultExpandIdList (node) {
      if (node.parent && node.parent.level !== 1) {
        this.getRightDefaultExpandIdList(node.parent)
      }
      this.rightDefaultExpandIdList.push(node.parent.data.orgUnitId)
    },
    // 校验调级组织是否有调级到自身或者自身的下级组织,弹出信息提示
    valiDateOrgsMove (target, moveList) {
      moveList.forEach(item => {
        this.eachMoveNode(item, target)
      })
    },
    eachMoveNode (leftNode, target) {
      if (target.data.orgUnitId === leftNode.orgUnitId) {
        this.$message({
          type: 'error',
          message: '不能将上级组织调级到自身或自己的下级上'
        })
      }
      if (target.parent.data) {
        this.eachMoveNode(leftNode, target.parent)
      }
    },
    // 表格分页方法
    handlerEmpTable (pageSize, pageIndex) {
      let start = this.moveTableInfo.pageSize * (this.moveTableInfo.pageIndex - 1)
      let end = this.moveTableInfo.pageSize * this.moveTableInfo.pageIndex
      this.moveTableInfo.data = this.moveAllTableData.slice(start, end)
    },
    // 页码大小切换
    empTableChangeSize (value) {
      this.moveTableInfo.pageSize = value
      this.handlerEmpTable(value, this.moveTableInfo.pageIndex)
    },
    // index切换
    empTableCurrentChange (value) {
      this.moveTableInfo.pageIndex = value
      this.handlerEmpTable(this.moveTableInfo.pageSize, value)
    },
    postFlow () {
      this.leftDefaultExpandIdList = []
      this.eachLeftNodeList(this.leftDataList)
      this.leftTreeData = this.getNodeChldren(this.$refs.leftTree.$refs.tree.root.childNodes)
      this.rightTreeNodeData = this.getNodeChldren(this.$refs.rightTree.$refs.tree.root.childNodes)
      return {
        orgUnitMaintains: this.moveTableInfo.data,
        descModel: this.descModel,
        moveTableInfo: this.moveTableInfo,
        moveAllTableData: this.moveAllTableData,
        leftDefaultExpandIdList: this.leftDefaultExpandIdList,
        rightDefaultExpandIdList: this.rightDefaultExpandIdList,
        leftDataList: this.leftDataList,
        rightTreeData: this.rightTreeData,
        isSetCostCentral: this.isSetCostCentral,
        rightTreeSelectedData: this.rightTreeSelectedData,
        leftCheckedIdList: this.leftCheckedIdList,
        leftTreeData: this.leftTreeData,
        rightTreeNodeData: this.rightTreeNodeData,
        ...this.flowData
      }
    },
    fillIn (data) {
      this.moveTableInfo.data = data.orgUnitMaintains
      this.descModel = data.descModel
      this.moveTableInfo = data.moveTableInfo
      this.moveAllTableData = data.moveAllTableData
      this.leftDefaultExpandIdList = data.leftDefaultExpandIdList
      this.rightDefaultExpandIdList = data.rightDefaultExpandIdList
      this.leftDataList = data.leftDataList
      this.rightTreeData = data.rightTreeData
      this.rightTreeSelectedData = data.rightTreeSelectedData
      this.leftCheckedIdList = data.leftCheckedIdList
      this.leftTreeData = data.leftTreeData
      this.rightTreeNodeData = data.rightTreeNodeData
      if (this.taskKey === 'undefined' || this.taskKey === 'applyId' || this.taskKey === 'hrGroupComplementId') {
        this.isShowCheckbox = true
      } else {
        this.isShowCheckbox = false
      }
      this.isSetCostCentral = data.isSetCostCentral
    },
    // 左边组织树节点渲染
    renderContent (h, {data, node}) {
      let highlightFreeze = data.status === '2' && this.isShowFreezeOrg === true
      let nodeStyle = this.leftDefaultExpandIdList.indexOf(data.orgUnitId)
      let nodeColor = this.leftDataList.findIndex(item => { return item.orgUnitId === data.orgUnitId })
      return (
        <div>
          <span class={highlightFreeze && this.taskKey === 'undefined' ? 'iconfont icon-lock' : ''} style="margin-right:5px;"></span>
          <span style={(nodeColor >= 0 ? 'color: #3da5fe;' : '') + (highlightFreeze && this.taskKey === 'undefined' ? 'color:#d8d8d8' : '')}>{data.orgUnitName}</span>
          <span v-show={ nodeStyle >= 0} style="position:relative;display:inline-block;width:8px;height:8px;border-radius:50%;left:10px;top:-2px;background:#FF6464;"></span>
        </div>
      )
    },
    // 右边组织树节点渲染
    rightRenderContent (h, {data, node}) {
      let highlightFreeze = data.status === '2' && this.rightIsShowFreezeOrg === true
      let nodeStyle = this.rightDefaultExpandIdList.indexOf(data.orgUnitId)
      return (
        <div>
          <span class={highlightFreeze && this.taskKey === 'undefined' ? 'iconfont icon-lock' : ''} style="margin-right:5px;"></span>
          <span style={(this.rightTreeSelectedData.orgUnitId === data.orgUnitId ? 'color: #3da5fe;' : '') + (highlightFreeze && this.taskKey === 'undefined' ? 'color:#d8d8d8' : '')}>{data.orgUnitName}</span>
          <span v-show={ nodeStyle >= 0} style="position:relative;display:inline-block;width:8px;height:8px;border-radius:50%;left:10px;top:-2px;background:#FF6464;"></span>
        </div>
      )
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
            resolve(this.rightTreeNodeData)
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
  },
  watch: {
    'moveTableInfo.total': {
      handler () {
        this.handlerEmpTable(this.moveTableInfo.pageSize, this.moveTableInfo.pageIndex)
      }
    },
    'descModel.effectiveDate': {
      handler () {
        this.moveTableInfo.data.forEach(item => {
          item.effectiveDate = this.descModel.effectiveDate
        })
      }
    },
    isHasOfficialDocument (value) {
      if (this.isHasOfficialDocument === true) {
        this.flowData.isHasOfficialDocument = 'Y'
      } else {
        this.flowData.isHasOfficialDocument = 'N'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.org-tree {
  /deep/ .el-tree {
    height: 430px;
    overflow: auto;
  }
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
.trees-container {
  width: 900px;
  min-height: 600px;
  margin-left: 20px;
  margin-bottom: 20px;
  .org-merge-edit-title {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    font-weight: bold;
  }
  .official-document {
    font-size: 14px;
    height: 50px;
    line-height: 50px;
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
.table-title {
  font-size: 14px;
  color: #000000;
  font-weight: bold;
  margin-bottom: 20px;
}
// 表格样式调整
.el-table {
  width: 100%;
  margin-bottom: 40px;
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

.move-table {
  position: relative;
  width: 95%;
  margin-left: 20px;
  .emp-pagination {
    position: absolute;
    bottom: -40px;
    right: 0;
  }
  // 分页条样式调整
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
    li.active {
      background: #3da5fe;
    }
  }
}
}
</style>
