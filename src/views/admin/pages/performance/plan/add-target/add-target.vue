<template>
  <i-dialog title="添加考核对象" v-model="show" @close="cancel" destroyedWhenClose :toolbar="toolbar">
      <!-- 选择树和入职员工 -->
    <div class="add-target-wrapper">
       <div class="left-wrapper padding5">
         <target-search class="target-search mb10" @searchPerson="handleSearched" :hasSelectedPeople="selectedPeople"></target-search>
          <el-collapse accordion>
            <el-collapse-item name="1" title="入职/调入员工">
              <target-list  
                :listData.sync="newPeople" 
                @selectedChange="newListChange"
                v-loading="isNewLoading"
                :element-loading-text="$loadingText"
                @scrollToBottom="handleNewLoad"
                domId="#performance-target-new"
              ></target-list>
            </el-collapse-item>
            <el-collapse-item name="2" title="全部员工">
              <el-collapse accordion>
                <el-collapse-item name="3" title="部门">
                  <i-tree
                  v-model="orgTreeSelected"
                  dataKey="org"
                  @check-change="handleOrgCheckChange"
                  nodeKey="orgUnitId" 
                  :isSearch="false"
                  multiple
                  :showCheckbox="true"
                  :props="props"
                  ></i-tree>
                </el-collapse-item>
                <el-collapse-item name="4" title="职种">
                  <!-- <i-tree
                  dataKey="jobFamily"
                  nodeKey="posJobFamilyId" 
                  :isSearch="false"
                  :multiple="true"
                  :props="props"
                  :showCheckbox="true"
                  ></i-tree> -->
                </el-collapse-item>
                <el-collapse-item name="5" title="职务">
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
        </div>

      <div class="right-wrapper padding5">
        <header>已选列表</header>
        <div class="move-btn mt10">
          <el-button type="text">移除离职/调出员工</el-button>        
        </div>
       <target-list 
        :listData.sync="selectedPeople" 
        @selectedChange="selectedListChange"
        v-loading="isSelectedLoading"
        :element-loading-text="$loadingText"
        @load="handleSelectedLoad"
        domId="performance-target-selected"
        :total="selectedTotal"
        selectAll
        ></target-list>
      </div>
    </div>
    </i-dialog>
</template>
<script>
import targetList from './target-list'
import targetSearch from './target-search'
import {clone} from 'utils/index'
import req from 'api/performance/plan-manage.js'
import iDialog from 'components/common/i-dialog/i-dialog'
export default {
  name: 'performance-add-target',
  props: ['show', 'schemeId', 'period'],
  data () {
    return {
      props: {
        children: 'children',
        label: 'orgShortName'
      },
      keyword: '',
      addList: [],
      deleteList: [],
      selectedPeople: [], // 当前在已选人员列表中的人员
      tableSelected: [], // 表格中勾选的人员
      newPeople: [],
      isSelectedLoading: false,
      isNewLoading: false,
      noSelectedData: false,
      paramsForSelected: {
        pageIndex: 0,
        pageSize: 10
      },
      // 选择树数据区域
      orgRootId: '',
      jobFamilyRootId: '',
      orgTreeSelected: '',
      jobFamilyTreeSelected: '',
      selectedTotal: null,
      toolbar: [   // 按钮配置
        {
          text: '确定',
          type: 'primary',
          func: (done) => {
            done()
          }
        }, {
          text: '重置',
          func: (done) => {
            done()
          }
        }, {
          text: '取消',
          type: 'text',
          func: (done) => {
            done()
          }
        }
      ]
    }
  },
  methods: {
    cancel () {
      this.$emit('update:show', false)
    },
    cloneData () {
      this.selectedPeople = clone(this.peopleList)
    },
    // 搜索数据处理
    handleSearched (searched) {
      if (searched.type === 'add') {
        this.selectedPeople = [searched.value].concat(this.selectedPeople)
        this.differ(searched.value, 'add')
      } else if (searched.type === 'del') {
        let index = null
        for (let i = 0; i < this.selectedPeople.length; i += 1) {
          if (this.selectedPeople[i].employeeId === searched.value.employeeId) {
            index = i
            break
          }
        }
        this.differ(this.selectedPeople[index], 'del')
      }
    },
    // 判断当前操作对象应提交的操作状态
    differ (obj, type) {
      if (type === 'add') {
        let isFind = this.findInArray(obj, this.deleteList)
        isFind ? this.deleteList.splice(isFind, 1) : this.addList.push(obj)
      } else if (type === 'del') {
        let isFind = this.findInArray(obj, this.addList)
        isFind ? this.addList.splice(isFind, 1) : this.deleteList.push(obj)
      }
    },
    findInArray (obj, arr) {
      for (let i = 0; i < arr.length; i += 1) {
        if (arr.employeeId === obj.employeeId) return i
      }
    },
    handleOrgCheckChange (node) {
      // node.checked ? this
    },
    selectedListChange (change) {
      // 已选列表的变化处理
      this.dealSelectChange(this.selectedPeople, this.selectedPeople, change)
    },
    newListChange (change) {
      // 已选列表的变化处理
      console.log(change)
    },
    // 处理搜索时两个列表中的数据变化
    // checked === true时表示此时为增加操作，反之为删减
    dealSelectChange (source, target, change) {
      if (change.checked) {
        target = [source[change.index]].concat(target)
      } else {
        this.differ(target.splice(change.index, 1), 'del')
        target[change.index].checked = true
      }
    },
    handleSelectedLoad (params) {
      this.isSelectedLoading = true
      if (!this.noSelectedData) this.getSelectedData(params)
    },
    handleNewLoad () {},
    getSelectedData (params) {
      this.paramsForSelected.pageIndex += 1
      let param = {
        schemeId: this.schemeId,
        period: this.period
      }
      Object.assign(param, params)
      req('getPlanList', param).then(res => {
        if (res.data && res.data.length > 0) {
          this.isSelectedLoading = false
          this.selectedTotal = res.total
          this.selectedPeople = res.data
        } else {
          this.noSelectedData = true
        }
      })
    }
  },
  created () {
    // this.cloneData()
    this.getSelectedData()
  },
  components: {
    targetList,
    targetSearch,
    iDialog,
    iTree: () => import('components/common/i-tree/i-tree.vue')
  }
}
</script>
<style lang="scss" scoped>
  .add-target-wrapper {
    display: flex;
    justify-content: space-between;
    .left-wrapper,.right-wrapper {
      width: 45%;
      border: 1px solid #ececec
    }
    .right-wrapper {
      header {
        background-color: #eef1f6;
        height: 35px;
        line-height: 35px;
        border-bottom: 1px solid #ececec;
        text-align: center;
      }
      .move-btn {
        text-align: right;
      }
    }
  }
  .target-search {
    width: 100%;
  }
</style>
