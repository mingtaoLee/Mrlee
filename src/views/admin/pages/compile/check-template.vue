<template>
  <div class="yyq-compile-dialog">
    <i-dialog
      ref="dialog"
      title="查看编制模板"
      v-model="dialogVisible"
      size="large"
      >
      <div class="content" v-loading="tableLoading" :element-loading-text="$loadingText">
        <template-ready-table
          ref="readyTable"
          :dimensions="getDimensions | toDimensions"
          :name="getName"
          :range="getRange | toRange"
          :dimensionCode="dimensionCode">
        </template-ready-table>
      </div>
    </i-dialog>
  </div>
</template>

<script>
import reqTp from 'api/compile/template'
import TemplateReadyTable from 'components/compile/table/template-ready-table'
import IDialog from 'components/common/i-dialog/i-dialog.vue'

export default {
  name: 'CheckTemplate',
  components: {
    TemplateReadyTable,
    IDialog
  },
  props: {

  },
  data () {
    return {
      // 是否显示窗口
      dialogVisible: false,
      // 传给模板预览的业务数据
      getDimensions: [],
      // 模板预览的模板名称
      getName: '',
      // 模板预览的适用范围
      getRange: [],
      // 面板loading
      tableLoading: false
    }
  },
  filters: {
    toDimensions (dimensions) {
      // 格式化得到最后需要的数据
      const getNeedData = arr => arr.map(item => {
        let obj = {};
        ({bussinessId: obj.bussinessId, bussinessName: obj.bussinessName, havingProposal: obj.havingProposal} = item)
        obj.havingProposal = Boolean(Number(obj.havingProposal))
        return obj
      })
      // 空值，空数组，则退出
      if (!dimensions || dimensions.length === 0) return
      // 保存过滤后的数据
      return getNeedData(dimensions)
    },
    toRange (val) {
      if (val) {
        return val.map(item => {
          return item.orgUnitName
        })
      } else {
        return val
      }
    }
  },
  methods: {
    // 打开查看面板，ifOpen为是否打开，id为传入的i模板id
    openDialog (ifOpen, row) {
      console.log('row', row)
      if (row) {
        this.tableLoading = true
        let params = {
          scaModMasterId: row.scaModMasterId
        }
        reqTp('getModsInfo', params).then(res => {
          this.tableLoading = false
          this.getDimensions = res.dimensions
          this.getName = res.modName
          this.getRange = res.orgs
          this.dimensionCode = res.dimensionCode
        })
      }
      this.dialogVisible = ifOpen
    }

  },

  created () {

  }
}
</script>

<style lang="scss" scoped>

</style>