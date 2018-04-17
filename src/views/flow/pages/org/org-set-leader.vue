<template>
  <div class="wrap content-follow">
    <i-process-flow :taskI="taskId" :taskKey="taskKey" processType="organizationPrincipleFlow" @fillin="fillIn">
      <div slot="allFlow" class="content-follow">
        <h3 class="info-title">维护明细</h3>
        <div class="main flex">
          <div class="box">
            <div class="box-title">
              组织树
            </div>
            <org-tree
            class="org-tree"
            :height="orgTreeHeight"
            :treeStyle="{'width':'520px'}"
            @node-click="handleTreeNodeClick">
            </org-tree>
          </div>
          <div class="box">
            <div class="box-title">
              组织详情
            </div>
            <div class="content">
              <div class="key-value">
                <div class="item">
                  <span class="key">组织类别：</span>
                  <span class="value">{{detailData.orgType || '无'}}</span>
                </div>
                <div class="item">
                  <span class="key">业态：</span>
                  <span class="value">{{detailData.businessType || '无'}}</span>
                  <!-- <span>{{detailData.businessType}}</span> -->
                </div>
                <div class="item emp-edit-input">
                  <span class="key">部门负责人：</span>
                  <span class="value">
                    <el-input icon="menu" v-model="leaderName" :on-icon-click="handlePersonSelectClick"></el-input>
                  </span>
                  <!-- <span class="value">{{detailData.orgLeader}}</span> -->
                </div>
                <div class="item">
                  <span class="key">管理分区：</span>
                  <span class="value">{{detailData.managedArea}}</span>
                </div>
                <div class="item">
                  <span class="key">所在地区：</span>
                  <span class="value">{{detailData.belongArea}}</span>
                </div>
                <div class="item">
                  <span class="key">成本中心：</span>
                  <span class="value">{{detailData.costCentralId}}</span>
                </div>
                <div class="item">
                  <span class="key">上级组织：</span>
                  <span class="value">{{detailData.parentUnitName}}</span>
                </div>
                <div class="item">
                  <span class="key">组织全程：</span>
                  <span class="value">{{detailData.orgUnitName}}</span>
                </div>
                <div class="item">
                  <span class="key">组织简称：</span>
                  <span class="value">{{detailData.orgShortName}}</span>
                </div>
                <div class="item">
                  <span class="key">生效日期：</span>
                  <span class="value">{{detailData.effectiveDate | dateFormat('YYYY-MM-DD hh:mm:ss')}}</span>
                </div>
                <div class="item">
                  <span class="key">关键职责：</span>
                  <span class="value">{{detailData.orgResponsibility}}</span>
                </div>
              </div>
              <i-person-select :isShow.sync="personSelectVisible" :multiple="false" @confirm="handlePersonSelectConfirm"></i-person-select>
            </div>
          </div>


        </div>
      </div>
    </i-process-flow>
  </div>
</template>
<script>
import req from 'api/org/setting'
import DemandDesc from 'components/flow/demand-desc'
import IPersonSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import IProcessFlow from 'components/common/i-process-flow'
import OrgTree from 'components/org/public/org-tree'
import {dateFormat} from 'filters'
import processMixin from 'mixins/process'
export default {
  components: {
    DemandDesc,
    IProcessFlow,
    IPersonSelect,
    OrgTree
  },
  data () {
    return {
      orgTreeHeight: 490,
      flowData: {
        creator: '12345',
        isHasOfficialDocument: 'N',
        processDefinitionId: 'organizationCreateFlow',
        partnerId: '8a8ea06a5faf744d015faf7dc1f90010',
        financeId: '8a8ea06a5faf744d015faf7dc1f90010',
        hrEmpId: '8a8ea06a5faf744d015faf7dc1f90010',
        operateType: ''
      },
      leader: {},
      personSelectVisible: false,
      detailData: {}
    }
  },
  filters: {dateFormat},
  computed: {
    leaderName () {
      return this.leader.employeeName
    },
    leaderId () {
      return this.leader.employeeId
    }
  },
  mixins: [processMixin],
  methods: {
    getEchoDetail (id) {
      req('echoDetail', {id}).then(data => {
        this.detailData = data
        this.getDictData()
      })
    },
    getDictData () {
      this.$d('ORG_BUSINESS_TYPE', this.detailData.businessType).then(label => {
        this.detailData.businessType = label
      })
      this.$d('ORG_TYPE', this.detailData.orgType).then(label => {
        this.detailData.orgType = label
      })
    },
    handleTreeNodeClick (data) {
      this.getEchoDetail(data.orgUnitId)
    },
    handlePersonSelectConfirm (person) {
      this.leader = person[0]
    },
    handlePersonSelectClick () {
      this.personSelectVisible = true
    },
    postFlow () {
      return Object.assign({orgLeaderId: this.leaderId, orgUnitId: this.detailData.orgUnitId},
      this.flowData,
      {detailData: this.detailData},
        {leader: {
          employeeId: this.leader.employeeId,
          employeeName: this.leader.employeeName
        }})
    },
    fillIn (data) {
      this.detailData = data.detailData
      this.leader = data.leader
    }
  }
}
</script>
<style lang="scss" scoped>
.key-value {
  font-size:14px;
}

.content {
  margin-left:20px;
}

.emp-edit-input {
  display:flex;
}

.item {
  line-height:28px;
}

.box {
  border:1px solid #F2F2F2;
  margin-bottom:15px;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin-right:50px;
  width:550px;
}

.box-title {
  width:100%;
  height:40px;
  background: #dddddd;
  font-size:14px;
  text-align:center;
  line-height:40px;
}

.form {
  margin-right:15px;
}

</style>
