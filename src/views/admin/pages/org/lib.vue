<template>
  <div class="wrap">
    <i-layout :aside-padding="0" headerKey="orgStandardTypeListGet">
      <div slot="aside">
          <div class="orgTree">
            <el-tree
            class="tree"
            highlight-current
            :expand-on-click-node="false"
            :data="treeData"
            :render-content="renderContent"
            @node-click="treeNodeClick"
            default-expand-all
            ></el-tree> 
          </div>
        </div>

        <div slot="header">
          <i-form @reset="resetInputs" @search="searchOrg">
            <el-form-item label="标准组织：">
              <el-input placeholder="请输入标准组织名称" v-model="search.orgStandardName"/>
            </el-form-item>
            <el-form-item label="业态：">
              <i-select v-model="search.businessType" parameter="ORG_BUSINESS_TYPE"></i-select>
            </el-form-item>
            <el-form-item label="职责：">
              <el-input  placeholder="请输入职责"  v-model="search.responsibility"/>
            </el-form-item>
            <el-form-item label="状态：">
              <i-select v-model="search.status" parameter="ORG_STD_STATUS"></i-select>
            </el-form-item>
            <el-form-item label="品类：" v-show="currentOrgType.orgTypeValue !== '7'">
              <el-input v-model="search.categoryName"></el-input>
            </el-form-item>
            <el-form-item label="小店类型：" v-show="currentOrgType.orgTypeValue !== '7'">
              <i-select v-model="search.shopType" parameter="ORG_SHOP_TYPE"></i-select>
            </el-form-item>
          </i-form>
        </div>
        <div slot="section">
          <i-table
            v-loading = "loading"
            :element-loading-text="$loadingText"
            :table="table"
            @pageSizeChange="pageChange"
            @pageIndexChange="pageChange"
            @save="getTableData">
              <template slot="table" slot-scope="tableScope">
                <el-table
                  ref="table"
                  stripe
                  border
                  @selection-change="batchHandle"
                  @row-click="rowClick"
                  :data="tableScope.clone"
                  v-loading = "tableScope.loading"
                  :element-loading-text="$loadingText"
                  >
                  <el-table-column type="selection" fixed="left">
                  </el-table-column>
                  <el-table-column
                    label="标准组织名称"
                    prop="orgStandardName"
                    fixed
                    :show-overflow-tooltip="true"
                    width="150px">
                    <template slot-scope="scope">
                      <span style="cursor:pointer;color:#3da5fe;" @click="lookOverOrgStandar(scope.row)">{{ scope.row.orgStandardName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="(col, idx) of table.columns || []"
                    v-if="col.prop !== 'shopType'"
                    :key="idx"
                    :prop="col.prop"
                    :align="col.align"
                    :formatter="tableScope.formatter"
                    :label="col.label"
                    :width="col.width"
                    :show-overflow-tooltip="col.showOverflowTooltip">
                  </el-table-column>
                  <el-table-column
                    v-if="!customerBodySelected"
                    prop="posCategoryList"
                    label="品类"
                    width="200px"
                    :showOverflowTooltip="true"
                    align="center">
                    <!-- <template slot-scope="scope">
                      <el-popover trigger="hover" placement="top">
                        <p style="font-size: 14px;padding: 2px 5px;">{{ scope.row.categorys}}</p>
                        <div slot="reference">
                          {{ scope.row.categorys }}
                        </div>
                      </el-popover>
                    </template> -->
                  </el-table-column>
                  <el-table-column
                    v-if="!customerBodySelected"
                    prop="shopType"
                    label="小店类型"
                    width="120"
                    :formatter="tableScope.formatter"
                    showOverflowTooltip
                  ></el-table-column>
                  <i-table-operator width="200px" :table="tableScope"/>
                </el-table>
              </template>
          </i-table>
          <dlog-check v-model="dialogCheckVisible" v-bind:detailData="detailData">
          </dlog-check>
          <dlog-containorg v-model="dialogContainOrg" :containOrgId="containOrgId">
          </dlog-containorg>
          <dlog-containjobs v-model="dialogContainJobs" :containJobsId="containJobsId">
          </dlog-containjobs>
          <dlog-addmodify
            ref="dlogAddmodify"
            v-model="dialogModifyVisible"
            @closeAddModify="getTableList"
            :modifyData="modifyData"
            :title="formTitle"
            :readonlyForm.sync="readonlyForm">
          </dlog-addmodify>
        </div>
    </i-layout>
  </div>
</template>

<script>
import ITable from 'components/common/i-table'
import dlogCheck from 'components/org/lib/dlog-check.vue'
import dlogContainorg from 'components/org/lib/dlog-containorg.vue'
import dlogContainjobs from 'components/org/lib/dlog-containjobs.vue'
import dlogAddmodify from 'components/org/lib/dlog-addmodify.vue'
import ILayout from 'components/common/i-layout'
import IForm from 'components/common/i-form/i-form.vue'
import ISelect from 'components/common/i-select/i-select'
import {clone} from 'utils/index.js'
import req, {config} from 'api/org/lib'

export default {
  name: 'lib',
  components: {
    dlogCheck,
    dlogContainorg,
    dlogContainjobs,
    dlogAddmodify,
    ITable,
    ILayout,
    IForm,
    ISelect
  },
  data () {
    return {
      formTitle: '修改标准组织',
      // 控制表单信息是否只读
      readonlyForm: false,
      // 保存所有勾选的行数据
      // allRowData: [],
      deleteArr: [],
      orgStandardIdList: [],
      depealList: [],
      table: {
        title: '',     // 标题【可选】
        columns: [         // 表头【必填】
          // {
          //   prop: 'orgStandardName',
          //   label: '标准组织名称',
          //   width: '150',
          //   showOverflowTooltip: true
          // },
          {
            prop: 'orgStandardCode',
            label: '标准组织编码',
            width: '150',
            showOverflowTooltip: true
          },
          {
            prop: 'orgType',
            label: '组织类别',
            align: 'center',
            width: '150',
            display: {dict: 'ORG_TYPE'}
          },
          {
            prop: 'businessType',
            label: '业态',
            align: 'center',
            width: '100',
            display: {dict: 'ORG_BUSINESS_TYPE'}
          },
          {
            prop: 'effectiveDate',
            label: '生效日期',
            align: 'center',
            display: {date: 'default'},
            width: '180'
          },
          {
            prop: 'responsibility',
            label: '职责',
            width: '150',
            showOverflowTooltip: true
          },
          {
            prop: 'lastUpdateEmployeeCode',
            label: '最后操作者工号',
            width: '150',
            align: 'center'
          },
          {
            prop: 'lastUpdateName',
            label: '最后操作者姓名',
            width: '150',
            align: 'center'
          },
          {
            prop: 'lastUpdateDate',
            label: '最后操作时间',
            width: '150',
            align: 'center',
            display: {date: 'default'}
          },
          {
            prop: 'status',
            label: '状态',
            width: '100',
            align: 'center',
            display: {dict: 'ORG_STD_STATUS'}
          },
          // {
          //   prop: 'categoryName',
          //   label: '品类',
          //   width: '100',
          //   showOverflowTooltip: true
          // },
          {
            prop: 'shopType',
            label: '小店类型',
            width: '120',
            display: {dict: 'ORG_SHOP_TYPE'},
            showOverflowTooltip: true
          }
        ],
        setting: {        // 可编辑表格的相关设置【可选】
          toolbar: [
            {
              text: '添加',
              func: this.addOrg,
              key: 'orgStandardCreationPost'
            },
            {
              text: '启用',
              func: this.enable,
              key: 'orgStandardEnablePut'
            },
            {
              text: '撤销',
              func: this.repealRequest,
              key: 'orgStandardRepealPut'
            },
            {
              text: '删除',
              type: 'danger',
              func: this.deleteOrg,
              key: 'orgStandardIdDeleteDelete'
            }
          ],     // 工具栏【可选】
          export: {
            req: config.search,
            key: 'orgLibExportPort',
            // param: () => ({...this.search}),
            config: {
              fileName: '标准组织',
              sync: {
                all: false,
                page: false,
                select: false
              }
            }
          },
          operator: [{
            text: '修改',
            key: 'orgStandardModificationPut',
            func: this.modify
          }, {
            text: '包含组织',
            key: 'orgStandardIdJobsGet',
            func: this.checkContainOrg
          }, {
            text: '包含标准职位',
            key: 'orgStandardIdOrgsGet',
            func: this.checkContainJobs
          }]
        },
        data: null,   // 占位符，用于挂载数据【必填】
        info: null,
        search: null,
        showPagebar: true
      },
      treeData: [{
        id: -1,
        label: '生态支撑',
        children: []
      }, {
        id: -1,
        label: '共享服务',
        children: []
      }, {
        id: -1,
        label: '专业服务',
        children: []
      }, {
        id: -1,
        label: '客户经营',
        children: []
      }],
      // 表头单选绑定值
      radio: null,
      // 当前组织类别
      currentOrgType: {
        orgTypeValue: '',
        orgTypeName: ''
      },
      search: {     // 表格条件查询表单
        orgStandardName: '',
        businessType: '',
        responsibility: '',
        status: '',
        categoryName: '',
        shopType: ''
      },
      detailData: [],
      containOrgId: '',
      containJobsId: '',
      // addmodify对话框绑定的值
      modifyData: {},
      multiSelection: null,
      dialogCheckVisible: false,
      dialogContainOrg: false,
      dialogContainJobs: false,
      dialogModifyVisible: false,
      orgTypeName: '',
      currentTypeId: '',
      loading: false
    }
  },
  computed: {
    customerBodySelected () {
      return this.currentOrgType.orgTypeValue === '7'
    }
  },
  created () {
    this.getTreeData().then(() => {
      this.table.search = {}
    })
  },
  methods: {
    // checkChange (selection, row) {
    //   this.deleteArr = selection.map(item => {
    //     return item.orgStandardId
    //   })
    //   this.orgStandardIdList = selection.map(item => {
    //     return item.orgStandardId
    //   })
    //   this.depealList = selection.map(item => {
    //     return item.orgStandardId
    //   })
    //   this.multiSelection = selection
    //   console.table(this.multiSelection)
    // },
    // rowClick (row, event, column) {
    //   if (column.label) {
    //     let index = this.allRowData.concat(this.multiSelection).findIndex(item => {
    //       return item.orgStandardId === row.orgStandardId
    //     })
    //     if (index >= 0) {
    //       this.allRowData.splice(index, 1)
    //     } else {
    //       this.allRowData.push(row)
    //     }
    //     this.deleteArr = this.allRowData.map(item => {
    //       return item.orgStandardId
    //     })
    //     this.orgStandardIdList = this.allRowData.map(item => {
    //       return item.orgStandardId
    //     })
    //     this.depealList = this.allRowData.map(item => {
    //       return item.orgStandardId
    //     })
    //     this.multiSelection = this.allRowData
    //     console.table(this.multiSelection)
    //   }
    // },
    // 批量操作
    batchHandle (row) {
      this.deleteArr = row.map(item => {
        return item.orgStandardId
      })
      this.orgStandardIdList = row.map(item => {
        return item.orgStandardId
      })
      this.depealList = row.map(item => {
        return item.orgStandardId
      })
      this.multiSelection = row
    },
    renderContent (h, {node, data}) {
      // console.log(h)
      // console.log(node)
      // console.log(data)
      return (
        <span>
          <span style={node.level < 2 ? 'fontSize:14px;' : 'fontSize:12px' }>{node.label}</span>
        </span>
      )
    },
    // 获取并挂载由 i-table 抛出的数据
    getTableData (data) {
      // data 为 i-table 返回的数据：{ create: [], update: [], delete: [] }
      // 以下为友好写法，可借鉴
      // 若某个集合数组的长度不为 0，则当前数据需要发送
      const shouldPost = !!Object.keys(data).find(
        method => data[method].length !== 0
      )

      this.postList = shouldPost ? data : {}
    },
    // 标准组织树点击事件
    treeNodeClick (data, node) {
      if (data.id >= 0) {
        this.loading = true
        this.orgTypeName = data.label
        this.currentOrgType.orgTypeValue = data.id
        this.currentOrgType.orgTypeName = data.label
        this.currentTypeId = data.id
        this.getTableList()
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      }
    },
    // 表格数据请求
    getTableList (option = {}) {
      let searchObj = Object.assign({}, {orgType: this.currentTypeId, ...option})
      return req('search', searchObj).then(data => {
        // data.data.forEach(item => {
        //   item.categorys = item.categorys.map(item => {
        //     return item.posCategoryName
        //   }).toString()
        // })
        Object.assign(this.table, data)
        this.multiSelection = null
      }).catch(err => {
        console.log(err)
        this.table = []
        this.multiSelection = null
      })
    },
    // 组织树数据请求
    getTreeData () {
      return req('orgType').then((orgType) => {
        this.currentTypeId = 'all'
        if (Array.isArray(orgType)) {
          for (let i = 0, len = orgType.length; i < len; i++) {
            let obj = {}
            obj.label = orgType[i].orgTypeName
            obj.id = orgType[i].orgTypeValue
            let parent = this.treeData[ Math.floor(i / 2) ] || this.treeData[this.treeData.length - 1]
            parent.children.push(obj)
          }
        } else {
          this.formatJson(orgType)
        }
      })
      // .catch(() => {
      //   this.treeData = []
      // })
    },
    // 查询标准组织明细
    check (row) {
      req('detail', {id: row.orgStandardId}).then(data => {
        this.detailData = data
        this.detailData.orgTypeName = row.orgTypeName
        this.dialogCheckVisible = true
      }).catch(() => {
        this.$message.warning('查询失败')
      })
    },
    // 查询包含标准组织
    checkContainOrg (row) {
      this.containOrgId = row.orgStandardId
      this.dialogContainOrg = true
    },
    // 查询包含标准职位
    checkContainJobs (row) {
      this.containJobsId = row.orgStandardId
      this.dialogContainJobs = true
    },
    pageChange (page) {
      this.getTableList(page)
    },
    // 新增标准组织
    addOrg () {
      let addData = {
        data: {
          orgType: '',
          orgStandardName: '',
          businessType: '',
          effectiveDate: '',
          responsibility: '',
          renameable: '1',
          categorys: [],
          posStandards: [],
          shopType: '',
          itgKzDtos: []
        },
        type: true
      }
      addData.data.orgType = this.currentTypeId
      this.modifyData = clone(addData)
      this.dialogModifyVisible = true
      this.$nextTick(() => {
        this.$refs.dlogAddmodify.setInputAndTextColor('.el-form .org-stander-name .el-input__inner', '#e8e8e8', 'input')
      })
      // this.$refs.dlogAddmodify.setInputAndTextColor('.el-form .org-stander-name .el-input__inner', '#ff6464', 'input')
      // for (let key in this.modifyData.data) {
      //   if (typeof this.modifyData.data[key] === Array) {
      //     this.modifyData[key] = []
      //   } else {
      //     this.modifyData.data[key] = ''
      //   }
      // }
      // console.log(this.modifyData)
    },
    // 查看标准组织
    lookOverOrgStandar (row) {
      this.formTitle = '查看标准组织'
      this.readonlyForm = true
      if (row.status === '0') {
        return this.$message.warning('此组织状态已为禁用，不可修改')
      }
      this.modifyData.type = false
      this.getModifyData(row.orgStandardId)
    },
    // 修改标准组织
    modify (row) {
      this.formTitle = '修改标准组织'
      if (row.status === '0') {
        return this.$message.warning('此组织状态已为禁用，不可修改')
      }
      this.modifyData.type = false
      this.getModifyData(row.orgStandardId)
    },
    getModifyData (modifyId) {
      req('modifyGet', {id: modifyId}).then(data => {
        this.modifyData.data = data
        this.dialogModifyVisible = true
      }).catch(() => {
        this.modifyData.data = {}
      })
    },
    // 将jsonObject格式转换为jsonArray格式
    formatJson (orgType) {
      let treedata = this.treeData
      for (let key in orgType) {
        let obj = {}
        obj.label = orgType[key]
        treedata.push(obj)
      }
    },
    // 查询标准组织
    searchOrg () {
      let searchObj = Object.assign({}, this.search, {orgType: this.currentTypeId})
      this.table.search = searchObj
      // req('search', searchObj).then(data => {
      //   data.data.forEach(item => {
      //     item.categorys = item.categorys.map(item => {
      //       return item.posCategoryName
      //     }).join(',')
      //   })
      //   Object.assign(this.table, data)
      // })
    },
    resetInputs () {
      for (let key in this.search) {
        this.search[key] = ''
      }
    },
    // 查询选择行状态
    // 参数value为要检查的状态
    // 如果选择行中至少有一条符合value则return true
    // 否则return false
    isAccord (value) {
      let len = this.multiSelection.length
      while (len--) {
        if (this.multiSelection[len].status === value) {
          return true
        }
      }
      return false
    },
    // 启用标准组织
    enable () {
      if (this.orgStandardIdList.length < 1) {
        return this.$message.warning('请至少选择一条记录')
      }

      if (this.isAccord('1')) {
        return this.$message.warning('组织状态已为启用')
      }

      req('enable', {orgStandardId: this.orgStandardIdList + ''}).then(data => {
        this.getTableList()
        this.$message.success('启用成功')
      })
    },
    // 撤销标准组织
    repealRequest () {
      if (this.depealList.length < 1) {
        return this.$message.warning('请至少选择一条撤销记录')
      }
      if (this.isAccord('0')) {
        return this.$message.warning('组织状态已为禁用，不可撤销')
      }

      req('repealRequest', {orgStandardId: this.depealList + ''}).then(data => {
        this.$confirm('此操作将撤销该组织, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          req('repeal', {orgStandardId: this.depealList + ''}).then(data => {
            this.getTableList()
            this.$message.success('撤销成功!')
          })
        })
      })
    },
    // 删除标准组织
    deleteOrg () {
      if (this.deleteArr.length < 1) {
        return this.$message.warning('请至少选择一条删除记录')
      }

      if (this.isAccord('1')) {
        return this.$message.warning('组织状态为启用，不能删除')
      }

      this.$confirm('此操作将永久删除该组织, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req('delete', {id: this.deleteArr + ''}).then(data => {
          this.$message.success('删除成功')
          this.getTableList()
        })
      }).catch(() => {
        this.$message('已取消删除')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .content-card {
    min-height:80px;
    padding: 10px;
  }
</style>
