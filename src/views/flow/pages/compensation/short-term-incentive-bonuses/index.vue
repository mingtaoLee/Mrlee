<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      :postFlow="postFlow"
      :processType="processType"
      @jurConfig="jurConfigHandler"
    >
      <section class="content-follow" slot="bestirPlanAllocationList">
        <h2 class="info-title">短期激励方案</h2>
        <div class="info-content">
          <el-form labelWidth="180px" :model="documents">
            <el-form-item label="选择已通过方案关联单据">
              <el-row>
                <el-col :span="8">
                  <template v-if="!documents.selected">
                    <div class="radio-panel" v-if="documents.list.length > 0">
                      <p class="radio-panel-item" v-for="(item, index) of documents.list">
                        <el-radio v-model="documents.selected" :label="item.id">{{item.planName}}</el-radio>
                        <el-button class="radio-panel-btn" type="text" @click="previewDocs(item, index)">查看</el-button>
                      </p>
                    </div>
                  </template>
                  <div v-else>
                    <p class="radio-panel-item">
                      <el-button type="text" @click="previewDocs(getSelectedItems)">
                        {{getSelectedItems.planName}}
                      </el-button>
                      <el-button
                        v-if="showMap['planList']"
                        class="radio-panel-btn"
                        type="text"
                        @click="selectDocs"
                      >
                        重新选择
                      </el-button>
                    </p>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <template v-if="documents.selected || (documents.orgUnitList.length > 0)">
          <h2 class="info-title">选择分配单位</h2>
          <i-table
            class="info-content"
            :table="table"
            ref="tableOrgUnitId"
            @loaded="handleLoaded"
          >
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                style="width: 100%"
                @selection-change="selectionChangeHandler(tableScope, $event)"
                @row-click="rowClickHandler(tableScope, $event)">
                <el-table-column
                  v-if="!disabledMap['orgUnitListTable']"
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  v-for="(col, idx) of table.columns || []"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                  :formatter="tableScope.formatter">
                  <template slot-scope="scope">
                    <i-table-cell
                      :row="scope.row"
                      :col="col.prop"
                      :table="tableScope"
                      @change="handleTableCellChange"
                    >
                      <i-select-tree
                        v-if="col.prop === 'orgUnitName'"
                        v-model="scope.row.orgUnitId"
                        :multiple="false"
                        dataKey="org"
                        nodeKey="orgUnitId"
                        size="small"
                        lazy
                        @node-click="handleNodeClick($event, scope)"
                      ></i-select-tree>
                    </i-table-cell>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </i-table>
          <h2 class="info-title">短期激励明细（分配至小店）</h2>
          <div class="info-content">
            <el-collapse v-model="activeCollapse" accordion>
              <template v-for="(item, index) of documents.orgUnitList">
                <el-collapse-item
                  v-if="item.orgUnitId"
                  :title="item.orgUnitName"
                  :name="index"
                >
                  <i-table
                    :table="returnTableStore(item.orgUnitId)"
                    :ref="item.orgUnitId"
                  >
                    <template slot="table" slot-scope="tableScope">
                      <el-table
                        :data="tableScope.clone"
                        style="width: 100%"
                        @selection-change="selectionChangeHandler(tableScope, $event)"
                        @row-click="rowClickHandler(tableScope, $event)">
                        <el-table-column
                          type="index"
                          label="序号"
                          width="55">
                        </el-table-column>
                        <el-table-column
                          v-for="(col, idx) of tableStore.columns || []"
                          :key="idx"
                          :prop="col.prop"
                          :label="col.label"
                          :formatter="tableScope.formatter">
                          <template slot-scope="scope">
                            <i-table-cell
                              :row="scope.row"
                              :col="col.prop"
                              :table="tableScope"
                            >
                            </i-table-cell>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </i-table>
                </el-collapse-item>
              </template>
            </el-collapse>
          </div>
          <h2 class="info-title">短期激励明细（分配至个人）</h2>
          <div class="info-content">
            <template v-for="(item, index) of documents.orgUnitList">
              <h3 class="info-content-title">单位:{{item.orgUnitName}}</h3>
              <el-collapse v-model="activeCollapsePersonal" accordion>
                <template v-if="returnTableStore(item.orgUnitId)">
                  <el-collapse-item
                    :title="col.orgUnitName"
                    :name="idx"
                    :key="idx"
                    v-for="(col, idx) of returnTableStore(item.orgUnitId).data">
                    <i-table
                      :table="returnTablePersonal(col.orgId, item.orgUnitId)"
                      :ref="col.orgId"
                    >
                      <template slot="table" slot-scope="tableScope">
                        <el-table
                          :data="tableScope.clone"
                          style="width: 100%"
                          @selection-change="selectionChangeHandler(tableScope, $event)"
                          @row-click="rowClickHandler(tableScope, $event)">
                          <el-table-column
                            type="index"
                            label="序号"
                            width="55">
                          </el-table-column>
                          <el-table-column
                            v-for="(col, idx) of tablePersonal.columns || []"
                            :key="idx"
                            :prop="col.prop"
                            :label="col.label"
                            :formatter="tableScope.formatter">
                            <template slot-scope="scope">
                              <i-table-cell
                                :row="scope.row"
                                :col="col.prop"
                                :table="tableScope">
                              </i-table-cell>
                            </template>
                          </el-table-column>
                        </el-table>
                      </template>
                    </i-table>
                  </el-collapse-item>
                </template>
              </el-collapse>
            </template>
          </div>
        </template>
        <!--<h2 class="info-title">额外支付明细</h2>-->
        <!--<i-table class="info-content" :table="table" ref="iTable">-->
          <!--<template slot="table" slot-scope="tableScope">-->
            <!--<el-table-->
              <!--:row-key="getRowKey"-->
              <!--:data="tableScope.clone"-->
              <!--style="width: 100%"-->
              <!--@selection-change="selectionChangeHandler(tableScope, $event)"-->
              <!--@row-click="rowClickHandler(tableScope, $event)">-->
              <!--<el-table-column-->
                <!--type="selection"-->
                <!--width="55">-->
              <!--</el-table-column>-->
              <!--<el-table-column prop="employeeName" label="员工姓名">-->
                <!--<template slot-scope="scope">-->
                  <!--<i-table-cell-->
                    <!--:table="tableScope"-->
                    <!--:row="scope.row"-->
                    <!--col="employeeName"-->
                    <!--:formatter="tableScope.formatter">-->
                    <!--<div>-->
                      <!--<el-input v-model="scope.row.employeeName" readonly @click.native="handlePersonnelClick(scope)">-->
                        <!--<i slot="suffix" class="el-input__icon iconfont icon-hr" @click="handlePersonnelClick(scope)"></i>-->
                      <!--</el-input>-->
                      <!--<i-personnel-select :isShow.sync="scope.row.isShowPersonnel" @confirm="handlePersonnelDialogConfirm($event, scope)"></i-personnel-select>-->
                    <!--</div>-->
                  <!--</i-table-cell>-->
                <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
                <!--v-for="(col, idx) of table.columns || []"-->
                <!--:key="idx"-->
                <!--:prop="col.prop"-->
                <!--:label="col.label"-->
                <!--:formatter="tableScope.formatter">-->
                <!--<template slot-scope="scope">-->
                  <!--<i-table-cell-->
                    <!--ref="cell"-->
                    <!--:row="scope.row"-->
                    <!--:col="col.prop"-->
                    <!--:table="tableScope">-->
                    <!--<i-select-->
                      <!--v-if="col.prop === 'itemName'"-->
                      <!--v-model="scope.row.itemName"-->
                      <!--:props="itemProps"-->
                      <!--dataKey="salaryItem"-->
                      <!--@option-click="handleItemClick($event, scope.row)"-->
                      <!--filterable>-->
                    <!--</i-select>-->
                  <!--</i-table-cell>-->
                <!--</template>-->
              <!--</el-table-column>-->
            <!--</el-table>-->
          <!--</template>-->
        <!--</i-table>-->
      </section>
    </i-process-flow>
  </div>
</template>
<script>
  import IProcessFlow from 'components/common/i-process-flow'
  import req from 'api/compensation/flow'
  import { getRule } from 'utils/index'

  export default {
    components: {
      IProcessFlow
    },
    data () {
      return {
        documents: {
          list: [],
          orgUnitList: [],
          orgUnitStoreList: {},
          orgUnitPersonalList: {},
          selected: ''
        },
        activeCollapse: '',
        activeCollapsePersonal: '',
        itemProps: {
          value: 'componentName',
          label: 'componentName'
        },
        // 提交时所需要转换的日期字段
        datesKey: ['checkMonth'],
        empEmployeeId: this.$route.query.empEmployeeId,
        taskId: this.$route.query.taskId,
        taskKey: this.$route.query.taskKey,
        processType: this.$route.query.processType,
        processInstanceId: this.$route.query.processInstanceId || '',
        table: {
          columns: [
            { prop: 'orgUnitName', label: '单位' },
            { prop: 'checkMonth', label: '核算月份', display: { date: 'short' } }
          ],
          setting: {
            // import: {
            //   business: '',
            //   show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            // },
            toolbar: [{
              text: '添加',
              show: () => {
                return { empty: !this.showMap['orgUnitListTableAdd'] }
              },
              func: vm => {
                vm.createData({
                  orgUnitId: '',
                  orgUnitName: '',
                  checkMonth: ''
                })
                this.documents.orgUnitList = vm.clone
              }
            }, {
              text: '删除',
              type: 'danger',
              show: () => {
                return { empty: !this.showMap['orgUnitListTableDel'] }
              },
              func: vm => {
                vm.deleteData()
              }
            }],
            editor: {
              employeeName: {
                rules: getRule('请选择员工', 'change')
              },
              employeeCode: {
                disable: true
              },
              orgName: {
                disable: true
              },
              itemName: {
                type: 'select',
                rules: getRule('请选择支付项目', 'change')
              },
              checkMonth: {
                rules: getRule('请选择核算月份', 'change', 'number'),
                type: 'date',
                options: {
                  type: 'month'
                }
              }
            }
          },
          disable: false,
          editable: true,
          data: [
          ]
        },
        tableStore: {
          columns: [
            { prop: 'orgUnitName', label: '小店' },
            { prop: 'reward', label: '奖金分配金额', type: 'number' }
          ],
          setting: {
            // import: {
            //   business: '',
            //   show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            // },
            toolbar: [],
            editor: {
              reward: {
                type: 'number'
              },
              orgUnitName: {
                disable: true
              }
            }
          },
          disable: false,
          editable: true,
          data: [
          ]
        },
        tablePersonal: {
          columns: [
            { prop: 'fullName', label: '员工' },
            { prop: 'employeeCode', label: '工号' },
            { prop: 'reward', label: '奖金分配金额', type: 'number' }
          ],
          setting: {
            toolbar: [],
            editor: {
              employeeCode: {
                disable: true
              },
              reward: {
                type: 'number'
              },
              fullName: {
                disable: true
              }
            }
          },
          disable: false,
          editable: true,
          data: [
          ]
        },
        mainForm: {
          orgUnitList: [],
          bestirPlanAllocationList: []
        }
      }
    },
    computed: {
      getSelectedItems () {
        let selected = this.documents.list.filter(v => v.id === this.documents.selected)
        return selected[0]
      }
    },
    watch: {
    },
    created () {
      this.getBestirPlansAssignee()
    },
    methods: {
      jurConfigHandler (showMap, disabledMap) {
        console.log('wwwwwW', disabledMap)
        this.table.disable = !!disabledMap['orgUnitListTable']
//        this.tableStore.disable = !!disabledMap['tableStore']
        this.tablePersonal.disable = !!disabledMap['tablePersonal']
        this.documents.orgUnitList.forEach(v => {
          this.documents.orgUnitStoreList[v.orgUnitId].disable = !!disabledMap['tableStore']
        })
      },
      returnTableStore (orgUnitId) {
        return this.documents.orgUnitStoreList[orgUnitId]
      },
      returnTablePersonal (orgId, orgUnitId) {
        let orgUnitStoreDataList = this.returnTableStore(orgUnitId).data
        let targetList = orgUnitStoreDataList.filter(v => v.orgId === orgId)
//        console.log('returnTablePersonal', targetList)
        let bestirWorkList = targetList[0] ? targetList[0].bestirWorkList : []
        const DATA = Object.assign({}, this.tablePersonal, {
          data: bestirWorkList
        })
        return DATA
      },
      handleNodeClick (node, scope) {
        scope.row.orgUnitName = node.orgUnitName
        this.getShortTermDetailData(scope.row.orgUnitId)
          .then(res => {
            console.log('getShortTermDetailData', res)
            if (res) {
              const DATA = Object.assign({}, this.tableStore, {
                data: res
              })
              this.documents.orgUnitStoreList[scope.row.orgUnitId] = DATA
            }
          })
      },
      getBestirPlansAssignee () {
        return req('getBestirPlansAssignee')
          .then(res => {
            if (res) {
              this.documents.list = res
            }
          })
      },
      getShortTermDetailData (orgUnitId) {
        return req('getBestirPlansStoreData', { orgUnitId })
      },
      handleTableCellChange (scope) {
        console.log('handleTableCellChange', scope.row.orgUnitId)
      },
      selectDocs () {
        this.$confirm('重新选择激励方案则不保存已填写数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.documents.selected = ''
        }).catch(() => {})
      },
      previewDocs (item) {
        console.log(item)
        console.log(this.$refs['tableOrgUnitId'].clone)
//        this.$refs['tableOrgUnitId'].clone
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },

      fillIn (data) {
        let { orgUnitList, bestirPlanAllocationList, planList, planSelected } = data
        this.documents.list = planList
        this.documents.selected = planSelected
        this.documents.orgUnitList = orgUnitList
        this.table.data = orgUnitList
        this.mainForm.orgUnitList = orgUnitList
        this.mainForm.bestirPlanAllocationList = bestirPlanAllocationList
        let list = {}
        bestirPlanAllocationList.forEach(v => {
          if (list[v.parentId]) {
            list[v.parentId].data.push(v)
          } else {
            list[v.parentId] = Object.assign({}, this.tableStore, {
              data: [v]
            })
          }
        })
        this.documents.orgUnitStoreList = list
        console.log(bestirPlanAllocationList, orgUnitList, list)
      },
      /** 提供给流程组件所需提交数据的方法 */
      postFlow () {
        let arr = this.documents.orgUnitList.map(v => v.orgUnitId)
        let bestirPlanAllocationList = []
        arr.forEach(v => {
          let clone = this.$refs[v][0].clone
          clone.map(item => {
            item.bestirWorkList = this.$refs[item.orgId][0].clone
            bestirPlanAllocationList.push(item)
          })
        })
        console.log(arr, this.$refs, bestirPlanAllocationList)
        return {
          planList: this.documents.list,
          planSelected: this.documents.selected,
          orgUnitList: this.documents.orgUnitList,
          bestirPlanAllocationList
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .radio-panel{
    overflow: auto;
    height: 100px;
    padding: 10px;
    border: 1px solid #e5e5e5;
  }
  .radio-panel-item{
    .radio-panel-btn{
      float: right;
    }
  }
  .info-content-title{
    font-size: 14px;
    padding: 0 0 15px;
  }
</style>
