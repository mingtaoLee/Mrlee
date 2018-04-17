<template>
  <div class="main">
    <div class="msg">
      <span class="label">姓名:</span><span class="value">{{row.staffName}}</span>
    </div>
    <div class="msg">
      <span class="label">工号:</span><span class="value">{{row.staffCode}}</span>
    </div>
     <div class="msg">
      <span class="label">职位:</span><span class="value">{{row.staffPosition}}</span>
    </div>
    <div class="msg">
      <span class="label">部门:</span><span class="value">{{row.staffOrgName}}</span>
    </div>
    <div class="msg">
      <span class="label">直接上级:</span>
      <span class="leader-name">{{realLeader}}</span><i 
      class="iconfont icon-username" 
      style="cursor: pointer"
      @click="selectPerson"></i>
    </div>
    <div class="msg-detail">
      <span class="label">调整说明:</span>
      <el-input 
      v-model="description" 
      placeholder="请输入调整说明" 
      type="textarea" 
      clearable 
      class="msg-detail-input"></el-input>
    </div>
    <section class="approval-area" v-if="adjustRecords.length > 0">
      <span>调整记录:</span>
      <approval-table :record="adjustRecords"></approval-table>
    </section>
  </div>
</template>
<script>
import request from 'api/grape/scheme.js'
import approvalTable from 'components/performance/approval-table'
export default {
  name: 'table-leader-adjust',

  props: {
    row: Object,
    leader: Object
  },

  data () {
    return {
      rankObj: {
        rankDetail: '',
        rank: ''
      },

      rankOptions: [],
      currentLevel: '',
      description: '',
      initData: {},
      adjustRecords: []
    }
  },

  methods: {

    getAdjustRecords () {
      request('leaderAdjustRecords', {employeeId: this.row.staffId}).then(res => {
        this.adjustRecords = res
      })
    },

    selectPerson () {
      this.$emit('selectPerson')
    }

  },

  computed: {

    realLeader () {
      let result
      this.leader ? result = this.leader.employeeName : result = this.row.leaderName
      return result
    }

  },

  components: {
    approvalTable
  },

  created () {
    // this.initData = this.row
    this.getAdjustRecords()
    // this._getRanks()
  }
}
</script>
<style lang="scss" scoped>
 .main {
   .label {
     margin-right: 5px;
   }
   .msg {
     margin-bottom: 10px;
   }
   .msg-detail {
     .label {
       display: inline-block;
       vertical-align: top;
     }
     .msg-detail-input {
       display: inline-block;
       width: 90%;
       vertical-align: top;
     }
   }
   .btn-area {
     text-align: right;
     margin-top: 20px;
   }
}
.approval-area {
  height: 100px;
  overflow-y: auto;
  span {
    width: 12%;
    margin-right: 5px;
  }
  margin-top: 15px;
  display: flex;
  width: 88%;
}
</style>
