<template>
  <div class="wrap">
      <i-layout :aside-padding="0">
        <div slot="aside">
          <el-date-picker
            class="date-picker"
            v-model="historyDate"
            :clearable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            @change="dateChange">
          </el-date-picker>
          <div class="orgTree">
            <org-tree
              ref="orgTree"
              :treeStyle="treeStyle"
              :showFilter="isOrgTreeShow"
              @node-click="curNodeClicked"
              @getRoot="setCurrentData"
              :requestUrls="requestUrls"
              :isFreezeOrg="false"
              :paramDate="historyDateTo">
            </org-tree>
          </div>
        </div>
        <div ref="main" slot="section">
          <setting-tab
            hideTabs="shopDetail"
            :hideEmployeeTableItem="hideEmployeeTable"
            ref="settingTab"
            :requestUrls="requestUrls"
            :paramDate="historyDateTo"
            :tabData="currentNode"
            @heightChange="calculateAsideTreeHeight">
          </setting-tab>
        </div>
      </i-layout>
  </div>
</template>
<script>
import req from 'api/org/history'
import OrgTree from 'components/org/public/org-tree'
import SettingTab from 'components/org/setting/setting-tab'
import ILayout from 'components/common/i-layout'
import asideMixin from 'mixins/aside'
import {formatDate} from 'utils/organization'
export default {
  name: 'History',
  components: {
    SettingTab,
    OrgTree,
    ILayout
  },
  mixins: [asideMixin],
  data () {
    return {
      isOrgTreeShow: true, // 控制组织树的搜索框显隐
      historyDate: '2017-08-09',
      historyDateTo: '',
      treeData: [],
      nodeKey: 'orgUnitId',
      keyword: '',
      tabData: {},
      showFilter: true,
      pos: null,
      currentNode: {},
      hideEmployeeTable: {
        employeeStatus: false
      },
      requestUrls: {
        root: {
          url: 'hisRoots'
        },
        children: {
          url: 'hisChildren'
        },
        search: {
          url: 'hisSearch'
        },
        detail: {
          url: 'historyDetail'
        },
        pos: {
          url: 'historyPos'
        },
        emp: {
          url: 'historyEmp',
          total: 'getEmpHisCount'
        },
        history: {
          url: 'history'
        }
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {
    treeStyle () {
      return `height:${this.elHeight}px;`
    }
  },
  created () {
    this.today()
  },
  mounted () {
    this.calculateAsideTreeHeight()
  },
  methods: {
    calculateAsideTreeHeight () {
      this.controlHeightWithoutHeader(134)
    },
    dateChange () {
      this.historyDateTo = formatDate(new Date(this.historyDate.getTime() + 86400000 - 1))
    },
    today () {
      this.historyDate = new Date()
      this.historyDate = formatDate(this.historyDate)
      this.historyDateTo = this.historyDate
    },
    curNodeClicked (data, node) {
      this.currentNode = data
      this.$refs.settingTab.setActiveTab('details')
    },
    setCurrentData ({orgUnitId}) {
      this.getDetail(orgUnitId)
    },
    getDetail (orgUnitId) {
      return req('detail', {id: orgUnitId, paramDate: this.historyDateTo}).then(data => {
        this.currentNode = data
        this.currentNode.effectiveDate = formatDate(this.currentNode.effectiveDate)
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '获取失败'
        })
      })
    },
    handleSelect (data) {
      this.treeData = [data]
    }
  }
}
</script>
<style lang="scss" scoped>
  .wrap{
    .date-picker {
      width: 89%;
      margin: 15px;
    }
    .org-tree{
      padding-top:10px;
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
  header{
    display:flex;
    justify-content:center;
  }
  .hearder-font{
    font-size: 16px;
    line-height:28px;
  }
  .main{
    display: flex;
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
  .content-card{
    min-height:530px;
  }
  .orgTree {
    /deep/ .org-tree-wrap .contorler .el-button--mini {
      margin-left: 155px;
    }
  } 
</style>

