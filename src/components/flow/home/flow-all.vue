<template>
  <div class="flow-all-container">
    <el-tabs  type="border-card" v-model="activeName" @tab-click="local">
      <el-tab-pane label="发起流程" name="first">
        <div class="header">
          <div class="all item"><span>所有流程</span></div>
          <el-input v-model="searchParam"   class="input item"   @keyup.native.enter="searchFlow">
              <i slot="suffix" class="el-icon-search" @click="searchFlow" ></i>
          </el-input>
          <!-- <el-button  type="primary" @click="searchFlow">搜索</el-button> -->
        </div>
        <section class="flowTree">
          <el-tree
          :data="flowData"
          :props="defaultTree"
          node-key="id"
          lazy
          :render-content="renderContent"
          :load="loadFlowList"
          :highlight-current="true"
          :filter-node-method="filterNode"
          ref="flowTree"
          :default-expanded-keys="keysArr"
          @node-click="toFlowId"></el-tree>
        </section>
        <div class="footer">
          <el-button type="default" style="width:60px" @click="resetSearch">重置</el-button>
          <el-button type="primary" @click="toFlowByTree">发起流程</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的流程" name="second">
        <div class="form">
          <i-form @reset="reset('myParams')" @search="search('myParams', 'getSelfProcess')" v-if="activeName === 'second'" labelWidth="mini">
              <el-form-item label="流程单号">
                <el-input v-model="myParams.processInstanceId"  />
              </el-form-item>
              <el-form-item label="流程主题">
                  <el-input v-model="myParams.pfInfoName"  />
              </el-form-item>
            </i-form>
          </div>
          <i-table :table="myTable" @pageSizeChange="myhandleSizeChange"  @pageIndexChange="myhandleCurrentChange" class="table">
              <template slot-scope="myTableScope" slot="table">
                <el-table :data="myTableScope.clone" border :max-height="height" :doLayout="doLayout">
                  <el-table-column label="流程单号" prop="processInstanceId" width="100"></el-table-column>
                  <!-- <el-table-column label="流程状态" prop="status" width="120" :formatter="myTableScope.formatter" /> -->
                  <el-table-column label="主题" prop="pfInfoName" :min-width="200" >
                    <template slot-scope="myScope">
                      <el-button type="text" @click="toflow(myScope.row)"> {{myScope.row.pfInfoName}} </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column v-for="(item,idx) in myTable.columns" :key="idx" :label="item.label" :prop="item.prop" :min-width="item.minWidth"  :formatter="myTableScope.formatter" :align="item.align" sortable/>
                </el-table>
              </template>
            </i-table>
            <div class="mt10"></div>
      </el-tab-pane>
      <el-tab-pane label="待我审批" name="third">
        <div class="form">
          <i-form
           @reset="reset('listParams')"
           @search="search('listParams', 'getWorkflowRunning')"
           v-if="activeName === 'third'"
           labelWidth="mini">
            <el-form-item label="流程单号">
              <el-input v-model="listParams.processInstanceId"  ></el-input>
            </el-form-item>
            <el-form-item label="流程主题">
                <el-input v-model="listParams.pfInfoName" ></el-input>
            </el-form-item>
          </i-form>
        </div>
        <i-table :table="table" @pageSizeChange="handleSizeChange"  @pageIndexChange="handleCurrentChange" class="table">
          <template slot-scope="tableScope" slot="table">
            <el-table :data="tableScope.clone" border :max-height="height">
                <el-table-column label="流程单号" prop="processInstanceId" width="100"></el-table-column>
              <el-table-column label="主题" prop="pfInfoName" :min-width="200" >
                <template slot-scope="scope">
                  <el-button type="text" @click="toflow(scope.row)"> {{scope.row.pfInfoName}} </el-button>
                </template>
              </el-table-column>
              <el-table-column
               v-for="(item,idx) in table.columns"
               :key="idx"
               :label="item.label"
               :prop="item.prop"
               :min-width="item.minWidth"
               :align="item.align"
               :formatter="tableScope.formatter"
               sortable/>
            </el-table>
          </template>
        </i-table>
        <div class="mt10"></div>
      </el-tab-pane>
      <el-tab-pane label="已审流程" name="fourth">
        <div class="form">
          <i-form
           @reset="reset('passParams')"
           @search="search('passParams', 'getPassProcess')"
           v-if="activeName === 'fourth'"
           labelWidth="mini">
            <el-form-item label="流程单号">
              <el-input v-model="passParams.processInstanceId"  />
            </el-form-item>
            <el-form-item label="流程主题">
              <el-input v-model="passParams.pfInfoName"  />
            </el-form-item>
          </i-form>
        </div>
        <i-table :table="passTable" @pageSizeChange="passhandleSizeChange"  @pageIndexChange="passhandleCurrentChange" class="table">
          <template slot-scope="passTableScope" slot="table">
            <el-table :data="passTableScope.clone" border   :max-height="height">
                <el-table-column label="流程单号" prop="processInstanceId" width="100"></el-table-column>
              <el-table-column label="主题" prop="pfInfoName" :min-width="200" >
                <template slot-scope="passScope">
                  <el-button type="text" @click="toflow(passScope.row)"> {{passScope.row.pfInfoName}} </el-button>
                </template>
              </el-table-column>
              <el-table-column
               v-for="(item,idx) in passTable.columns"
               :key="idx"
               :label="item.label"
               :prop="item.prop"
               :min-width="item.minWidth"
               :formatter="passTableScope.formatter"
               :align="item.align"
               sortable/>
            </el-table>
          </template>
        </i-table>
        <div class="mt10"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import ITable from 'components/common/i-table'
  import req from 'api/employee/flow'
  import IForm from 'components/common/i-form/i-form'
  import {jsonTree} from 'utils/index'
  export default {
    components: {
      ITable,
      IForm
    },
    data () {
      let that = this
      return {
        selectKey: '',
        listParams: {
          processInstanceId: '',
          pfInfoName: ''
        },
        myParams: {
          processInstanceId: '',
          pfInfoName: ''
        },
        passParams: {
          processInstanceId: '',
          pfInfoName: ''
        },
        activeName: localStorage.activeName || 'first',
        searchParam: '',
        showTreeNode: false,
        isSearch: false,
        table: {
          columns: [
            {label: '创建人', prop: 'createName', minWidth: 90, align: 'left'},
            {label: '创建时间', display: {date: 'long'}, prop: 'createDate', minWidth: 200, align: 'center'},
            {label: '当前节点', prop: 'taskName', minWidth: 180, align: 'left'}
          ],
          data: null,
          showPagebar: true,
          search: null,
          info: null,
          total: 0
        },
        passTable: {
          columns: [
            {label: '流程状态', prop: 'processStatus', minWidth: 100, display: {dict: 'WORKFLOW_STATUS'}, align: 'left'},
            {label: '创建人', prop: 'createName', minWidth: 90, align: 'left'},
            {label: '审批时间', prop: 'startDate', minWidth: 200, align: 'left', display: {date: 'long'}},
            {label: '已审节点', prop: 'taskName', minWidth: 180, align: 'left'}
          ],
          data: null,
          showPagebar: true,
          search: null,
          info: null,
          total: 0
        },
        myTable: {
          columns: [
            {label: '流程状态', prop: 'status', display: {dict: 'WORKFLOW_STATUS'}, minWidth: 100},
            {label: '创建人', prop: 'createBy', minWidth: 90, align: 'left'},
            {label: '创建时间', prop: 'createDate', minWidth: 200, align: 'left', display: {date: 'long'}},
            {label: '当前节点', prop: 'taskName', minWidth: 180, align: 'left'},
            {label: '节点审批人', prop: 'assignee', minWidth: 150, align: 'left'}
          ],
          data: null,
          showPagebar: true,
          search: null,
          info: null,
          total: 0
        },
        flowData: null,
        defaultTree: {
          children: 'children',
          label: 'name',
          isLeaf: (data) => {
            if (that.isSearch) {
              return !data.children
            } else {
              if (that.res && !that.res[data.id]) {
                return !data.children
              }
            }
          },
          expanded: true
        },
        expandArr: [],
        result: [],
        res: {},
        leaf: [],
        lea: {},
        keysArr: [],

        // HACK: 除员工异动流程外，其他流程需禁用
        // employeeTransfer: ['employeeHireProcess', 'employeeRegularProcess', 'employeeTransferProcess', 'employeeDimissionProcess', 'empChangeSuretyProcess', 'rctRequirementProcess4comp', 'rctRequirementProcess4platform', 'rctRequirementProcess4shop', 'hireAuditProcess', 'postSalaryAdjustmentWorkflow']
        employeeTransfer: []
      }
    },
    methods: {
      doLayout () {
        // console.log('dddddd', arguments)
      },
      handleSizeChange (options) {
        this.getWorkflowRunning(options)
      },
      handleCurrentChange (options) {
        this.getWorkflowRunning(options)
      },
      passhandleSizeChange (options) {
        this.getPassProcess(options)
      },
      passhandleCurrentChange (options) {
        this.getPassProcess(options)
      },
      myhandleSizeChange (options) {
        this.getSelfProcess(options)
      },
      myhandleCurrentChange (options) {
        this.getSelfProcess(options)
      },

      local ($event) {
        console.log($event)
        this.$refs[$event.name] && this.$refs[$event.name].initLayout()
        localStorage.activeName = $event.name
      },
      renderContent (h, { data, node, store }) {
        let notLeaf = <span> <span>{node.label}</span></span>
        if (this.isSearch) {
          if (this.result.find(obj => { return node.data === obj }) && (!this.leaf.find(obj => { return node.data === obj }))) {
            return (notLeaf)
          } else {
            if (data.hasCollection === 'Y') {
              return (<span class="node" on-dblclick={() => this.dbclick()}> <label class="node"> <input type="radio" name="check" />{node.label} <i on-click={() => this.clickIcon(data, node, store)} class="el-icon-star-on col col-on" > 收藏</i></label> </span>)
            } else {
              return (<span class="node" on-dblclick={() => this.dbclick()}> <label class="node"> <input type="radio" name="check" />{node.label} <i on-click={() => this.clickIcon(data, node, store)} class="el-icon-star-on col" > 收藏</i></label> </span>)
            }
          }
        } else {
          if (this.result.find(obj => { return node.data === obj })) {
            return (notLeaf)
          } else {
            if (data.hasCollection === 'Y') {
              return (<span class="node" on-dblclick={() => this.dbclick()}> <label class="node"><input type="radio" name="check" />{node.label}<i on-click={() => this.clickIcon(data, node, store)} class="el-icon-star-on col col-on"> 收藏</i></label> </span>)
            } else {
              return (<span class="node" on-dblclick={() => this.dbclick()}> <label class="node"><input type="radio" name="check" />{node.label} <i on-click={() => this.clickIcon(data, node, store)} class="el-icon-star-on col" > 收藏</i></label> </span>)
            }
          }
        }
      },

      clickIcon (data, node, store) {
        data.hasCollection === 'Y' ? this.deleteCollection(data) : this.postCollection(data)
      },

      dbclick () {
        this.toFlowByTree()
      },

      postCollection (data) {
        req('postCollection', data)
        .then(res => {
          data.hasCollection = 'Y'
          this.$emit('collection')
        })
      },

      deleteCollection (data) {
        let keys = []
        keys.push(data.processType)
        req('deleteCollection', {processDefinitionKeys: keys.join(',')})
        .then(res => {
          data.hasCollection = 'N'
          this.$emit('collection')
        })
      },

      updateCollection (deleteArr) {
        this.isSearch = false
        this.keysArr = []
        this.getWorkflowProcessCategory()
      },

      /* 加载子树 */
      loadFlowList (node, resolve) {
        if (node.data && this.res[node.data.id] && this.res[node.data.id].children) {
          resolve(this.res[node.data.id].children)
        } else if (node.data && this.res[node.data.id]) {
          req('getProcessCategory', {id: node.data.id}).then(data => {
            // HACK: 对需禁用流程做处理
            this.handleBanProcess(data)
            console.log('------')
            console.log(data)
            resolve(data)
          }).catch(() => {
            resolve([])
          })
        }

        (node.data && !this.res[node.data.id]) && resolve([])
      },

      // HACK: 对需禁用流程做处理
      handleBanProcess (data) {
        for (let process of data) {
          if (!this.employeeTransfer.includes(process.key)) {
            process.name += ` （暂未开放）`
          }
        }
      },

      mapArr (arr) {
        arr.map(obj => {
          if (obj.children) {
            this.result.push(obj)
            this.mapArr(obj.children)
          } else {
            this.result.push(obj)
            this.leaf.push(obj)
          }
        })
        this.result.map(obj => (this.res[obj.id] = obj))
        this.leaf.map(obj => (this.lea[obj.id] = obj))
      },

      searchFlow () {
        this.keysArr = []
        this.searchParam && req('getFindProcess', {ispc: 'pc', name: this.searchParam})
        .then(data => {
          this.flowData = jsonTree(data, {id: 'id', pid: 'parentId'})
          console.log(this.flowData)
          data.map(key => {
            !key.url && this.keysArr.push(key.id)
          })
          console.log(this.flowData)
          this.isSearch = false
          this.searchParam && (this.isSearch = true)
          this.res = {}
          this.result = []
          this.leaf = []
          this.mapArr(this.flowData)
        })
      },
      resetSearch () {
        this.initAll()
        this.getWorkflowProcessCategory()
      },

      initAll () {
        this.searchParam = ''
        this.isSearch = false
        this.keysArr = []
        this.res = {}
        this.result = []
        this.leaf = []
      },
      filterNode (value, data, node) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },

      reset (listParams) {
        Object.keys(this[listParams]).map(key => { this[listParams][key] = '' })
      },

      search (listParams, reqc) {
        listParams !== 'listParams' ? this[listParams.slice(0, -6) + 'Table'].search = {...this[listParams]} : this.table.search = {...this[listParams]}
        // this.table.search = { ...this.listParams }
        // req(reqc, this[listParams])
        // .then(data => {
        //   Object.keys(data).map(key => {
        //     listParams !== 'listParams' ? this[listParams.slice(0, -6) + 'Table'][key] = data[key] : this.table[key] = data[key]
        //   })
        // })
      },

      toFlowId (data, node, $event) {
        this.selectKey = ''
        node.isLeaf && (this.selectKey = data.key)
      },

      toFlowByTree () {
        this.selectKey && req('getFlowStart', {processType: this.selectKey, ispc: 'pc'})
        .then(data => {
          if (this.employeeTransfer.includes(data.processType)) {
            this.$store.commit('SET_FLOW_ACTION', {processType: data.processType, isFlowCenter: 'Y'})
            this.$store.commit('FLOW_WINDOW_OPEN', '/flow.html#' + data.url)
          } else {
            this.$message({
              type: 'warning',
              message: '此流程暂未开放'
            })
          }
        })
      },

      toflow (item) {
        let type = item.actionType ? item.actionType : item.processType
        console.log(item)
        this.submitFlow(type, item.processType, item.taskId, item.taskKey, item.processInstanceId)
      },

      getWorkflowRunning (listParams) {
        req('getWorkflowRunning', listParams)
        .then(data => {
          Object.keys(data).map(key => {
            // formatTableDate(data.data, ['createDate'], true)
            this.table[key] = data[key]
          })
        })
      },

      submitFlow (type, url, taskId, taskKey, processInstanceId) {
        this.$store.commit('SET_FLOW_ACTION', { processType: type, taskId: taskId, taskKey: taskKey, processInstanceId: processInstanceId })
        this.$store.commit('FLOW_WINDOW_OPEN', '/flow.html#/flow/' + url)
      },

      getWorkflowProcessCategory () {
        req('getWorkflowProcessCategory')
        .then(data => {
          this.flowData = jsonTree(data, {id: 'id', pid: 'parentId'})
          this.mapArr(this.flowData)
        })
      },

      getPassProcess (listParams) {
        req('getPassProcess', listParams)
        .then(data => {
          Object.keys(data).map(key => {
            // formatTableDate(data.data, ['createDate'], true)
            this.passTable[key] = data[key]
          })
        })
      },
      getSelfProcess (listParams) {
        req('getSelfProcess', listParams)
        .then(data => {
          Object.keys(data).map(key => {
            // formatTableDate(data.data, ['createDate'], true)
            this.myTable[key] = data[key]
          })
        })
      }
    },
    computed: {
      height () {
        // if (window.innerHeight > 1366) return 400
        // else return 328
        return window.innerHeight - 260
      }
    },
    created () {
      // this.getWorkflowRunning({})
      this.getWorkflowProcessCategory()
      // this.getPassProcess({})
      // this.getSelfProcess({})
    },

    mounted () {
      this.search('myParams', 'getSelfProcess')
      this.search('listParams', 'getWorkflowRunning')
      this.search('passParams', 'getPassProcess')
      req('getNewVersionFlow')
        .then(res => {
          this.employeeTransfer = res
        })
    }
  }
</script>

<style lang="scss" >
.flow-all-container {
  background-color: white;
  border: 1px solid #dfe6ec;
  height:100%;
  // .overflow {
  //   overflow-y: scroll;
  //   max-height: 550px;
  // };
  .form {
    height: 60px;
    line-height: 60px;
    padding: 10px 15px;
    form {
      height: 40px;
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    height: 60px;
    line-height: 60px;
    padding: 0 15px;
    border-bottom: 1px solid #dfe6ec;
    .all {
      text-align: left;
      font-size: 16px;
      padding: 5px 10px;
    };
    .item {
      flex-basis: 30%;
    };
  };
  .table {
    position: absolute;
    top: 60px;
    left: 15px;
    right: 15px;
  }
  .footer {
    height: 60px;
    text-align: right;
    bottom: 0;
    border-top: 1px solid #dfe6ec;
    line-height: 60px;
    padding: 0 15px;
    position: absolute;
    width: calc(100% - 30px);
    button {
      width:100px;
    };
  };
  .flowTree {
    padding:0 15px;
    height: calc(100% - 144px);
    overflow-y: scroll;
    margin: 12px 0;
  };
  .node {
    width: 100%;
    display: inline-block;
    position: relative;
    height: 100%;
    line-height: 36px;
    input {
      vertical-align: sub;
    }
    .col {
      position: absolute;
      right: 20px;
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      color: #bfc2c5;
    }
    .col-on {
      color: #449fff;
    }
    &:hover {
      cursor: pointer;
    };
  };
};

</style>
<style lang="scss" >
  .flow-all-container {
    box-sizing: border-box;
    .el-tree-node__content {
      height: 36px;
    }

    .el-tabs {
      height: 100%;
      background: #fff;
      border: 0;
      box-shadow: initial;
      .el-tabs__header {
        height: 40px;
        margin: 0;
        .el-tabs__nav-wrap {
          line-height: 40px;
          height: 40px;
          background: #fafafa;
          .el-tabs__nav {
            margin-left: 0;
          }
          .el-tabs__item {
            height: 40px;
            line-height: 40px;
            font-size: 14px;
          }
          .is-active {
            height: 41px !important;
            line-height: 41px !important;
          }
        }
      }
      #pane-first {
        position: relative;
        height: 100%;
      }
      .el-tabs__content {
        height: calc(100% - 40px);
        width: 100%;
        margin: 0;
        padding: 0;
        .el-tab-pane {
          position: relative;
        }
      }
    }
    .el-table__header {
      width: 100%;
      overflow-x: scroll;
    }
  }
 </style>
