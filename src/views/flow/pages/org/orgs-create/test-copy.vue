<template>
  <div>
    <i-process-flow
      :taskI="taskId"
      :taskKey="taskKey"
      processType="organizationsCreateFlow"
      @fillin="fillIn"
    >
      <!-- 需求描述 -->
      <demand-desc
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
            <div>
              <el-button v-show="titleCopyBtn" @click="showCopyBox">复制</el-button>
              <!-- <el-button @click="hideTreeCheckboxs">粘贴</el-button> -->
              <div v-show="pasteBtnShow" class="pasteBtn">
                <el-button type="primary" @click="nextPaste">下一步 粘贴</el-button>
                <!-- <el-button @click="colseBtnClick">取消</el-button> -->
              </div>
              <div v-show="copyAndPasteBtnShow" class="pasteBtn">
                <el-button type="primary" @click="pasteTreeItem">确定</el-button>
                <!-- <el-button @click="colseBtnClick">取消</el-button> -->
              </div>
            </div>
          </div>
          <div style="background: #ffffff;padding-left: 20px;">
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
      </div>
      </i-process-flow>
  </div>
</template>

<script>
import orgDialog from 'mixins/orgDialog'
import processMixin from 'mixins/process'
import IProcessFlow from 'components/common/i-process-flow'
import DemandDesc from 'components/flow/demand-desc'
import reqTree from 'api/org/tree'
import mixins from './mixins'
import SelectLib from 'components/org/lib/select-lib'
import orgCostCenter from 'components/org/public/org-cost-center'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'

export default {
  name: 'OrgAddlistDialog',
  mixins: [orgDialog, processMixin, mixins],
  components: {
    IProcessFlow,
    DemandDesc,
    SelectLib,
    orgCostCenter,
    iPersonnelSelect
  },
  data () {
    return {
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
      // 成本中心表格校验
      costCentralFormRules: {
        costCentralId: [
          { validator: this.validateCostCentral, trigger: 'change' }
        ]
      },
      // 是否已发公文
      isHasOfficialDocument: 'N',
      // 是否已发公文多选框
      OfficialDocumentChecked: false,
      // 成本中心多选框
      checkCostCentral: false
    }
  },
  methods: {
    postFlow () {

    },
    fillIn (data) {

    },

    // 点击组织树
    nodeClick (data, node) {
      console.log(node)
    },

    // 多选框改变
    treeCheckChange (data, checked) {
      let node = this.$refs.tree.store.getNode(data)
      // 如果是复制状态那么多选框选中就push到copyListShow里面
      if (this.copyListShow === true) {
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

    // 显示复制模块，点击复制按钮
    showCopyBox () {
      this.formBoxTitle = '复制组织'
      this.isShowCopyBox = true
      this.formBoxShow = true
      this.pasteBtnShow = true
      this.copyAndPasteBtnShow = false
      this.titleCopyBtn = false
      this.copyListShow = true
      this.copyPasteMessage = '请在左侧组织树选择节点进行复制'
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
      this.asyncPaste().then(() => {
        this.hideTreeCheckboxs()
        this.copyAndPasteBtnShow = false
        this.titleCopyBtn = true
        this.isShowCopyBox = false
        this.formBoxShow = false
        this.$refs.tree.setCheckedKeys([])
        this.copyList = []
        this.copyIdList = []
        this.pasteList = []
        this.pasteIdList = []
        this.$message({
          type: 'success',
          message: '已成功粘贴'
        })
      })
    },

    // 异步粘贴
    asyncPaste () {
      return new Promise((resolve, reject) => {
        if (this.pasteList.length) {
          this.pasteList.forEach((item, index) => {
            if (item.childNodes && item.childNodes.length) {
              this.pasteNode(item, this.copyList)
            } else {
              item.expand(() => {
                this.pasteNode(item, this.copyList)
              })
            }
          })
        } else {
          this.$message({
            type: 'info',
            message: '请先选择目标节点进行粘贴'
          })
          reject()
        }
      })
    },

    // 粘贴
    pasteNode (targetNode, copyNodeList) {
      return new Promise((resolve, reject) => {
        copyNodeList.forEach(item => {
          let newNode = {
            data: {
              ...item.data,
              parentId: targetNode.data.orgUnitId,
              isNew: true
            }
          }
          targetNode.insertChild(newNode)
          if (item.childNodes && item.childNodes.length) {
            let targetChildrenList = []
            targetChildrenList = this.filterCopyChildren(targetNode)
            console.log(targetChildrenList)
            let targetChildrenListIndex = targetChildrenList.findIndex(targetChildrenItem => {
              return item.data.orgUnitId === targetChildrenItem.data.orgUnitId
            })
            targetChildrenList[targetChildrenListIndex].expand(() => {
              this.pasteNode(targetChildrenList[targetChildrenListIndex], item.childNodes)
            })
          }
        })
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
        if (node.childNodes.length) {
          node.expand(() => {
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
      })
    },

    // 异步添加节点，添加节点以后隐藏多选框
    asyncAppendNode (data, node) {
      this.appendNode(data, node).then(() => {
        this.$nextTick(() => {
          this.hideTreeCheckboxs()
        })
      })
    },

    // 删除节点
    deleteNode (data, node) {
      let index = node.parent.childNodes.findIndex(item => { return item.id === node.id })
      node.parent.childNodes.splice(index, 1)
      this.closeFormBox = true
      this.formBoxShow = false
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
              node.expand()
            })
          })
        })
      } else {
        if (node.data.children && node.data.children.length > 0) {
          resolve(node.data.children)
        } else {
          let nodeKey = node.data.isNew ? 'orgCopyUnitId' : 'orgUnitId'
          reqTree(this.requestUrls.children.url, {id: node.data[nodeKey]}).then(data => {
            resolve(data)
            if (node.checked === true && this.copyListShow === true) {
              this.disabledChildrenStatus(node, node.checked)
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
  }
}
</script>

<style lang="scss" scoped>
@import "./style.scss"
</style>
