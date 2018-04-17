<template>
  <div class="wrap">
    <h1 class="heard-text">批量撤销组织</h1>
    <div class="content-follow">
      <h3 class="info-title">选择组织</h3>
      <div class="tree-form flex">
        <div class="box tree">
          <org-tree
            ref="orgTree"
            :props="treeProps"
            :check-strictly="checkStrictly"
            treeStyle=""
            nodeKey="orgUnitId"
            :showCheckbox="true"
            @node-click="handleTreeNodeClick"
            @check-change="checkChangeOrg"
            :cstRenderContent="renderContent"
            :default-expand-all	= "true"
            :checkStrictly="true"
            :cstLoadData="loadData"
          >
          </org-tree>
        </div>
        <div class="box" ref="formBox">
        <div class="box-title">
        查看组织
        </div>
        <div class="form-box">
          <el-form class="form" ref="form" :rules="formRules" :model="moveForm" label-width="100px">
            <el-form-item label="组织名称">
              <el-input
              v-model.trim="moveForm.orgUnitName"
              disabled
              />
            </el-form-item>
            <el-form-item label="组织简称">
              <el-input
              v-model.trim="moveForm.orgShortName"
              disabled
              />
            </el-form-item>
            <el-form-item label="组织类别">
              <i-select
              v-model="moveForm.orgType"
              parameter="ORG_TYPE"
              disabled
              ></i-select>
            </el-form-item>
            <el-form-item label="业态">
              <i-select
              v-model="moveForm.businessType"
              parameter="ORG_BUSINESS_TYPE"
              disabled
              >
              </i-select>
            </el-form-item>
            <el-form-item label="所在区城">
              <!-- <el-input
              v-model.trim="moveForm.belongArea"
              disabled
              /> -->
              <i-select-area
                :disabled="true"
                type="yonghui"
                search
                returnNode
                v-model="moveForm.belongAreaId">
              </i-select-area>
            </el-form-item>
            <el-form-item label="管理区城">
              <!-- <el-input
              v-model.trim="moveForm.managedArea"
              disabled
              /> -->
              <i-select-area
              :disabled="true"
              type="yonghui"
              search
              multiple
              returnNode
              v-model="moveForm.managedAreaId">
              </i-select-area>
            </el-form-item>
            <el-form-item label="部门负责人">
              <el-input
              v-model.trim="moveForm.orgLeader"
              disabled
              />
            </el-form-item>
            <el-form-item label="关键职责">
              <el-input
                type="textarea"
                v-model.trim="moveForm.orgResponsibility"
                disabled
                >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        </div>
      </div>
      <div class="batchExport" v-if="exportMsgList.length > 0">
        <!-- <i-table>
        <el-table></el-table>
        </i-table> -->
        <p>
        所选组织仍包含员工，请前往 
        <span class="batchCrew" @click="jumpToEmpmovement">批量调动人员
          <span v-show="empIds.length>=25">(组织下人员较多，请手动选择被调动人员)</span>
          </span>
          &nbsp;&nbsp;&nbsp;
          <i class="iconfont icon-daochu"></i> 
        <span class="exportCrew" @click="exportEmps"> 导出人员名单</span>
        </p>
      </div>
      <div class="orangization-box">
        <div class="org-title">已选组织</div>
        <el-table :stripe="true" :border="false" :data="orgHandlerInfo.data">
        <el-table-column
          align="center"
          v-for="(item, index) in orgTableColumns"
          :prop="item.prop"
          :label="item.label"
          :key="index">
        </el-table-column>
        </el-table>
        <el-pagination
        background
        class="emp-pagination"
        @size-change="orgTableChangeSize"
        @current-change="orgTableCurrentChange"
        :current-page="orgHandlerInfo.pageIndex"
        :page-sizes="[10,20,30,50,100]"
        :page-size="orgHandlerInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orgHandlerInfo.total">
        </el-pagination>
      </div>
      <div class="btn-group">
        <el-button @click="$router.push('/org/org/setting')">返回</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </div>
    <el-dialog title="流程跳转" width="50%" :visible.sync="errDialog">
      组织下存在人员，不能撤销该组织，是否跳转人员调动流程？
      <span slot="footer" class="dialog-footer">
      <el-button @click="errDialog = false">取 消</el-button>
      <el-button type="primary" @click="errConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示信息" width="40%" text-align="center" :visible.sync="hintDialog">
      <p style="text-align: center;"><i class="iconfont icon-shuoming"></i>是否完成人员的调动</p>
      <span slot="footer" class="dialog-footer">
      <el-button @click="hintDialog = false">取 消</el-button>
      <el-button type="primary" @click="hintConfirm">确 定</el-button>
      </span>
    </el-dialog>
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
        }"/>
    </i-dialog>
  </div>
</template>

<script>
import OrgTree from 'components/org/public/org-tree'
import ITableExportExcel from 'components/common/i-table/export-excel'
import req, {config} from 'api/org/setting'
import { windowOpen } from 'utils'
import ISelectArea from 'components/common/i-select-area'
import reqTree from 'api/org/tree'

export default {
  name: 'OrgDepealList',
  components: {
    OrgTree,
    ITableExportExcel,
    ISelectArea
  },
  data () {
    return {
      // 已选组织表格数据
      orgHandlerTable: [],
      orgHandlerInfo: {
        pageSize: 10,
        pageIndex: 1,
        data: null,
        total: 0
      },
      treeProps: {
        label: 'orgUnitName',
        children: 'children',
        disabled: (data, node) => {
          return node.level === 1 || node.parent.checked || node.parent.data.disabled
        },
        isLeaf: (data) => {
          return typeof data.isParent === 'undefined'
          ? false
          : !data.isParent
        }
      },
      // 勾选时有人员的是时候显示导出的文字
      showText: false,
      // 控制导出文字提示div数组
      exportMsgList: [],
      // 导出的提示，判断他所选的组织下有没有完成人员的调离
      hintDialog: false,
      // 字符节点的取消
      checkStrictly: true,
      // 人员调动的弹框
      errDialog: false,
      recallDialog: false,
      employeesIdArr: [],
      origin: [],
      orgDepealList: [],
      moveForm: {
        orgUnitName: '',
        orgShortName: '',
        orgType: '',
        businessType: '',
        belongAreaId: '',
        managedAreaId: [],
        orgLeader: '',
        orgResponsibility: ''
      },
      orgTableColumns: [
        {
          prop: 'orgUnitCode',
          label: '编码'
        },
        {
          prop: 'orgUnitName',
          label: '组织名称'
        },
        {
          prop: 'orgPathName',
          label: '组织全称'
        },
        {
          prop: 'orgLeader',
          label: '负责人'
        },
        {
          prop: 'orgResponsibility',
          label: '关键责任'
        }
      ],
      empIds: [],
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
        req: config.findEmployeesByOrgIds,
        config: {
          range: 'all'
        }
      },
      elTable: {
        columns: [
          {
            property: 'fullName',
            label: '员工姓名',
            align: 'center'
          },
          {
            property: 'employeeCode',
            label: '工号',
            align: 'center'
          },
          {
            property: 'gender',
            label: '性别',
            align: 'center'
          },
          {
            property: 'posPositionName',
            label: '职位',
            align: 'center'
          },
          {
            property: 'mobile',
            label: '电话',
            align: 'center'
          },
          {
            property: 'hireDate',
            label: '入职时间',
            align: 'center',
            display: {date: 'yyyy-MM-dd'}
          },
          {
            property: 'orgName',
            label: '部门',
            align: 'center'
          },
          {
            property: 'employeeStatus',
            label: '用工类型',
            align: 'center'
          }
        ],
        store: {
          states: {}
        }
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
      display: {
        dateList: {
          hireDate: 'yyyy-MM-dd'
        },
        dictList: {
          employeeStatus: {
            '0': '待入职',
            '1': '试用期',
            '2': '在职',
            '3': '离职',
            '5': '离职返聘',
            '6': '退休返聘'
          }
        }
      }
    }
  },
  computed: {
    table () {
      return {
        search: {
          ids: this.employeesIdArr.join(',')
        }
      }
    }
  },
  watch: {
    orgHandlerTable () {
      let start = this.orgHandlerInfo.pageSize * (this.orgHandlerInfo.pageIndex - 1)
      let end = this.orgHandlerInfo.pageSize * this.orgHandlerInfo.pageIndex
      this.orgHandlerInfo.data = this.orgHandlerTable.slice(start, end)
      this.orgHandlerInfo.total = this.orgHandlerTable.length
    }
  },
  methods: {
    // 已选组织表格分页方法
    handlerEmpTable (pageSize, pageIndex) {
      let start = this.orgHandlerInfo.pageSize * (this.orgHandlerInfo.pageIndex - 1)
      let end = this.orgHandlerInfo.pageSize * this.orgHandlerInfo.pageIndex
      this.orgHandlerInfo.data = this.orgHandlerTable.slice(start, end)
    },
    // 页码大小
    orgTableChangeSize (value) {
      this.orgHandlerInfo.pageSize = value
      this.handlerEmpTable(value, this.orgHandlerInfo.pageIndex)
    },
    // 页数位置
    orgTableCurrentChange (value) {
      this.orgHandlerInfo.pageIndex = value
      this.handlerEmpTable(this.orgHandlerInfo.pageSize, value)
    },
    // 跳转到批量调动
    jumpToEmpmovement () {
      windowOpen(`/flow.html#/flow/new_employee_multi_movement`, {
        processType: 4,
        empEmployeeId: this.empIds.length >= 25 ? '' : JSON.stringify(this.empIds)
      })
    },
    // 存放当前撤销组织下人员
    saveEmps (data) {
      if (data.length > 0) {
        this.empIds = data.map(emp => {
          return emp.empEmployeeId
        })
      }
    },
    /**
    * 导出
    */
    exportEmps () {
      this.exportVisible = true
    },
    // 点击树节点
    handleTreeNodeClick (data, node) {
      req('echoDetail', {id: data.orgUnitId}).then(orgData => {
        this.syncGetArea(orgData).then(areaData => {
          this.moveForm = Object.assign({}, orgData, {
            belongAreaId: areaData[0].areaId,
            managedAreaId: [areaData[1].areaId]
          })
        })
      })
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
          return [data[0], managedArea]
        })
      } else if (orgData.managedArea && !orgData.belongArea) {
        return req('getAreaMsg', {code: orgData.managedArea}).then(data => {
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
        return req('getAreaMsg', {code: orgData.belongArea}).then(belongArea => {
          return req('getAreaMsg', {code: orgData.managedArea}).then(managedArea => {
            return [belongArea[0], managedArea[0]]
          })
        })
      }
    },
    // 有人员时点击确定时的跳转
    errConfirm () {
      this.errDialog = false
      this.jumpToEmpmovement()
    },
    disabledDataStatus (node, status) {
      node.childNodes.forEach(item => {
        this.$set(item.data, 'disabled', status)
        if (item.childNodes && item.childNodes.length) {
          this.disabledDataStatus(item, status)
        }
      })
    },
    // 勾选
    checkChangeOrg (data, checked, indeterminate) {
      let treeData = data
      let node = this.$refs.orgTree.$refs.tree.store.getNode(data)
      if (checked) {
        this.disabledDataStatus(node, checked)
        // 组织全内容
        req('echoDetail', {id: data.orgUnitId}).then(data => {
          // this.origin.push(data)
          this.orgHandlerTable.push(data)
          Object.assign(this.moveForm, data)
          req('emp', {orgUnitId: data.orgUnitId, isFindChildren: true}).then(nodeEmpData => {
            if (nodeEmpData.data.length > 0) {
              this.exportMsgList.push(treeData)
            }
          })
        })
        this.employeesIdArr.push(data.orgUnitId)
        this.orgDepealList.push(data)
        // 人员数据请求
        req('findEmployeesByOrgIds', Object.assign({}, {ids: this.employeesIdArr.join(','), pageSize: -1})).then(data => {
          // console.log(data)
          if (data.data.length > 0) {
            // this.showText = true
            this.saveEmps(data.data)
          } else {
            // this.showText = false
          }
        })
      } else {
        let originIndex = (elem) => {
          return data.orgUnitId === elem.orgUnitId
        }
        let index = this.origin.findIndex(originIndex)
        let orgHandlerIndex = this.orgHandlerTable.findIndex(item => {
          return item.orgUnitId === data.orgUnitId
        })
        this.employeesIdArr.findIndex(originIndex)
        this.orgHandlerTable.splice(orgHandlerIndex, 1)
        this.employeesIdArr.splice(index, 1)
        this.orgDepealList.splice(index, 1)
        this.showText = false
        let i = this.exportMsgList.findIndex(item => {
          return item.orgUnitId === data.orgUnitId
        })
        if (i !== -1) {
          this.exportMsgList.splice(i, 1)
        }
      }
    },
    // 最后点击确定的时候
    confirm () {
      // 先进行人员的查询是否存在
      if (this.employeesIdArr.length) {
        req('findEmployeesByOrgIds', Object.assign({}, {ids: this.employeesIdArr.join(',')})).then(data => {
          if (data.data.length > 0) {
            this.saveEmps(data.data)
            this.errDialog = true
          } else {
            // console.log(this.orgDepealList)
            // 不存在进行撤销
            for (let i = 0; this.orgDepealList.length > i; i++) {
              this.orgDepealList[i].effectiveDate = new Date()
            }
            req('batch', this.orgDepealList).then(data => {
              if (data) {
                this.$message({
                  type: 'success',
                  message: '撤销成功'
                })
                this.$router.go(-1)
              }
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请先选择要撤销的组织'
        })
      }
    },
    // 请求组织树方法
    getTreeRoot () {
      return reqTree(this.requestUrls.root.url, {}).then(data => {
        return data
      })
    },
    loadData (node, resolve) {
      if (node.level === 0) {
        this.getTreeRoot().then(data => {
          resolve(data)
        })
        .then(() => {
          this.$nextTick(() => {
            this.$refs.orgTree.$refs.tree.root.childNodes.forEach(node => {
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
            if (node.checked || node.data.disabled) {
              this.disabledDataStatus(node, true)
            } else {
              this.disabledDataStatus(node, false)
            }
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
.wrap {
  box-shadow: 0 0 2px 0 rgba(0,0,0,0.10);
  background: #fff;
}
.box {
  border:1px solid #F2F2F2;
  margin-bottom:15px;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  width:550px;
  height: 580px;
  background-color: #ffffff;
  &.tree {
    overflow: auto;
    background: #f8f8f8;
  }
}
.heard-text {
  height: 60px;
  padding-left: 20px;
  line-height: 60px;
  font-size: 18px;
  font-weight: bold;
  border: 1px solid #f6f6f6;
  background: #f6f6f6;
}
.box-title {
  height:50px;
  background: #f8f8f8;
  font-size:14px;
  text-align:left;
  line-height:50px;
  padding-left: 20px;
}
.org-tree-wrap .contorler[data-v-265a0f42] {
  background-color: #f8f8f8 !important;
}
.org-tree-wrap {
  /deep/ .el-tree {
    background: #f8f8f8;
  }
}
.content-follow {
  border: none;
  .info-title {
    font-weight: normal;
  }
}
.org-tree {
  padding-right:3px;
}
.form {
  width: 500px;
  margin-top: 20px;
}
.icon-shuoming {
  color: #3da5fe;
  margin-right: 5px;
  font-size: 17px;
}
.orangization-box{
  .emp-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
  .org-title {
    font-size: 14px;
  }
  .el-table {
    margin-top: 20px;
  }
}
.batchExport{
  margin-bottom: 20px;  
  p {
    color: #FF6464;
  }
  .batchCrew {
    color: #5bb3ff;
    cursor: pointer;
  }
  .exportCrew {
    color: #616161;
    cursor: pointer;
  }
  .icon-daochu {
    color: #616161;
  }
}
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
.form-box {
  height: 530px;
  overflow: auto;
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
.btn-group {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}
</style>
