<template>
  <section class="flow-tempcolect  ">
    <header class="header">
      <h3 >收藏模板</h3>
      <span v-if="isEditing" @click="edit(1)" class="edit">
        <span>编辑</span>
      </span>
      <span v-else  @click="edit(2)" class="edit">
        <span @click="cancelDelect">取消</span>
        <span @click="finishDelect">完成</span>
      </span>
    </header>
    <nav class="nav">
      <ul class="collection">
        <li
         v-if="collections && collections.length"
         v-for="(item,idx) in collections"
         :key="idx"
         class="cell"
         @click="toFlow(item)">
          <span>{{ employeeTransfer.includes(item.processType) ? item.name : `${item.name} （暂未开放）`}}</span>
          <span><i
             :class="{'el-icon-minus':!item.icon}"
             v-show="!isEditing"
             @click.stop.prevent="deleteTemplate(item, idx)"></i></span>
        </li>
        <li class="no" v-if="!collections || collections && !collections.length">
          <span>暂无收藏的模板</span>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script>
  import req from 'api/employee/flow'

  export default {
    data () {
      return {
        isEditing: true,
        collections: null,
        deleteArr: [],

        // HACK: 除员工异动流程外，其他流程需禁用
        employeeTransfer: ['employeeHireProcess', 'employeeRegularProcess', 'employeeTransferProcess', 'employeeDimissionProcess', 'empChangeSuretyProcess', 'rctRequirementProcess4comp', 'rctRequirementProcess4platform', 'rctRequirementProcess4shop', 'hireAuditProcess', 'postSalaryAdjustmentWorkflow']
      }
    },

    methods: {
      getCollection () {
        req('getCollection')
        .then(data => {
          this.collections = data
          this.collections.map(key => (this.$set(key, 'icon', false)))
        })
      },
      toFlow (row) {
        // HACK: 除异动流程外，其他流程需做特殊处理
        if (this.employeeTransfer.includes(row.processType)) {
          this.isEditing && this.submitFlow(row.processType, row.url, row.taskId)
        } else {
          this.$message({
            type: 'warning',
            message: '此流程暂未开放'
          })
        }
      },
      submitFlow (type, url, taskId) {
        this.$store.commit('SET_FLOW_ACTION', { processType: type, taskId: taskId, isFlowCenter: 'Y' })
        this.$store.commit('FLOW_WINDOW_OPEN', '/flow.html#' + url)
      },
      edit (type) {
        this.isEditing = !this.isEditing
      },

      finishDelect () {
        this.deleteCollection(this.deleteArr)
      },

      cancelDelect () {
        this.deleteArr = []
        this.collections.map(key => (this.$set(key, 'icon', false)))
      },

      deleteTemplate (item, idx) {
        this.$set(this.collections[idx], 'icon', !item.icon)
        // item.icon = !item.icon
        item.icon ? this.deleteArr.push(item.processType) : this.deleteArr.splice(Array.indexOf(this.deleteArr, item.processType), 1)
      },

      deleteCollection (deleteArr) {
        req('deleteCollection', {processDefinitionKeys: deleteArr.join(',')})
        .then(res => {
          this.$emit('deleteCollection', this.deleteArr)
          this.getCollection()
        })
      }
    },

    created () {
      this.getCollection()
    }
  }
</script>

<style lang="scss" scoped>
  .flow-tempcolect {
    background: white;
    position: relative;
    /* margin-bottom: 30px; */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      border-top: 1px solid #e5e5e5;
      border-right: 1px solid #e5e5e5;
      border-left: 1px solid #e5e5e5;
      background: #FAFAFA;
      h3 {
        color: #000000;
        font-size: 14px;
        font-weight: 800;
        font-family: 'PingFangSC Medium';
      }
    }
    .nav {
      overflow-y: scroll;
      height: calc(100% - 40px);
      border: 1px solid #e5e5e5;;
    }
    .collection {
      .no {
        padding: 10px 20px;
        font-size: 14px;
      }
    }
    .edit {
      // position: absolute;
      z-index: 8;
      right: 15px;
      color: #449fff;
      cursor: pointer;
    }
    .cell {
      display: flex;
      width: 100%;
      justify-content: space-between;
      line-height: 36px;
      height: 36px;
      padding: 0 15px;
      box-sizing: border-box;
      cursor: pointer;
      &:nth-child(even) {
        background: #FAFAFA;
      }
      &:hover {
        background: #eef1f6;
      };
      span {
        display: inline-block;
      };
      i {
        color: red;
      }
    }
    .icon-delete {
      color: red;
      font-size: 20px;
    }
  }
</style>
