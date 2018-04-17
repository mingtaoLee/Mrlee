<template>
  <div class="wrap">
    <i-dialog
      :title="title"
      v-model="dialogVisible"
      destroyedWhenClose
      :toolbar="toolbar"
      size="huge">
      <div class="mt10 mb10">
        <plan-detail-home-table :header="tableHeader" :data="tableData" :standardable="false"/>
      </div>
    </i-dialog>
  </div>
</template>

<script>
import IDialog from 'components/common/i-dialog/i-dialog'
import PlanDetailHomeTable from 'components/compile/table/plan-detail-home-table'

export default {
  name: 'NormalPlanDetails',
  components: {
    IDialog,
    PlanDetailHomeTable
  },
  props: {
    table: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // 弹框的显示隐藏
      dialogVisible: false,
      // 弹框标题
      title: '查看编制计划',
      // 保存表头
      tableHeader: [],
      // 保存数据
      tableData: [],
      // 弹框按钮配置
      toolbar: [{
        text: '关闭',
        type: 'plain',
        func: (done) => {
          done()
        }
      }]
    }
  },

  methods: {
    // 显示弹框
    openDialog (header, data) {
      this.tableHeader = header
      this.tableData = data
      this.dialogVisible = true
    }
  },

  created () {

  }
}
</script>

<style lang="scss" scoped>

</style>
