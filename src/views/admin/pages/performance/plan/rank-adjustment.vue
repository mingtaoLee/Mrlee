<template>
  <div class="main">
    <div class="msg">
      <span class="label">姓名:</span><span class="value">{{initData.employeeName}}</span>
    </div>
    <div class="msg">
      <span class="label">工号:</span><span class="value">{{initData.employeeCode}}</span>
    </div>
    <div class="msg">
      <span class="label">部门:</span><span class="value">{{initData.orgName}}</span>
    </div>
    <div class="msg">
      <span class="label">调整前等级:</span><span class="value">{{initData.level}}</span>
    </div>
    <div class="msg">
      <el-form ref="form" :model="model" :rules="rules">
        <el-form-item prop="currentLevel" label="等级调整" class="form-item">
          <el-select v-model="model.currentLevel" placeholder="等级调整">
            <el-option 
              v-for="item in rankOptions" 
              :key="item.level" 
              :label="item.level" 
              :value="item.level"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

    </div>
    <div class="msg-detail">
      <span class="label">调整说明:</span><el-input v-model="description" placeholder="请输入调整说明" type="textarea" class="msg-detail-input"></el-input>
    </div>
    <section class="approval-area" v-if="adjustRecords.length > 0">
      <span>调整记录:</span>
      <approval-table :record="adjustRecords"></approval-table>
    </section>
    <section class="btn-area">
      <el-button type="primary" @click="handleConfirmClick">确认</el-button>
      <el-button @click="hideSelf">取消</el-button>
    </section>
  </div>
</template>
<script>
import request from 'api/performance/plan-manage'
import approvalTable from 'components/performance/approval-table'
export default {
  props: {
    showSelf: Boolean,
    row: Object
  },
  data () {
    return {
      rankObj: {
        rankDetail: '',
        rank: ''
      },
      rankOptions: [],
      model: {
        currentLevel: null
      },
      description: '',
      initData: {},
      adjustRecords: [],
      rules: {
        currentLevel: {required: true, trigger: 'blur', message: '选择修改等级的数据'}
      }

    }
  },
  methods: {
    _fetchData () {
      request('getRankAdjust', {planId: this.row.planId}).then((res) => {
        this.initData = res
      })
    },
    _adjustRank (params, fn) {
      request('adjustRank', params).then((res) => {
        fn && fn()
      })
    },
    _getRanks () {
      request('getRankLevels', {planId: this.row.planId}).then(res => {
        this.rankOptions = res
      })
    },
    getAdjustRecords () {
      request('getRankAdjustRecords', {planId: this.row.planId}).then(res => {
        this.adjustRecords = res.adjustHistory
      })
    },
    hideSelf () {
      this.$emit('reload')
      this.$emit('update:showSelf', false)
    },
    handleConfirmClick () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          debugger
          let params = {
            currentLevel: this.model.currentLevel,
            description: this.description,
            planId: this.row.planId
          }
          this._adjustRank(params, this.hideSelf)
        }
      })
    }
  },
  components: {
    approvalTable
  },
  created () {
    this.initData = this.row
    this.getAdjustRecords()
    this._getRanks()
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
   .form-item {
     display: flex;
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
