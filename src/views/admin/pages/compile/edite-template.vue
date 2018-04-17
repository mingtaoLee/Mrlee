<template>
  <div class="wrap">
    <compile-dialog ref="dialog" :title="title" @submit="submit" @handleClose="handleClose">

      <!-- 选择适用范围及维度、内容等 -->
      <compile-dialog-item>
        <new-template-1 ref="newTemplate1" :model="model" :ifMotify="isMotify"></new-template-1>
      </compile-dialog-item>      

      <!-- 查看模板表格内容 -->
      <compile-dialog-item>
        <template-ready-table
          :name="model.modName"
          :dimensions="model.dimensions | toDimensions(model) | havingProposal(model)"
          :range="model.orgNodes | toRange"
          :havingProposal="model.havingProposal"
          :dimensionCode="model.dimensionCode"
        ></template-ready-table>
      </compile-dialog-item>
    </compile-dialog>
  </div>
</template>

<script>
import { objReplaceAttr } from 'utils/compile'
import reqTp from 'api/compile/template'
import CompileDialog from 'components/compile/dialog/compile-dialog'
import CompileDialogItem from 'components/compile/dialog/compile-dialog-item'
import NewTemplate1 from 'components/compile/form/new-template-1'
import TemplateReadyTable from 'components/compile/table/template-ready-table'

export default {
  name: 'EditeTemplate',
  components: {
    CompileDialog,
    CompileDialogItem,
    NewTemplate1,
    TemplateReadyTable
  },
  data () {
    return {
      // 表单绑定的数据
      model: {
        modName: '',
        orgs: '',
        dimensionCode: '',
        dimensions: '',
        orgNodes: [],
        jobNodes: [],
        havingProposal: false
      },
      // 判断是否为修改操作
      isMotify: false,
      // 保存row
      row: null,
      // 弹框的标题
      title: '新建编制模板'
    }
  },
  watch: {
    isMotify: {
      handler (val, oldVal) {
        this.title = val ? '修改编制模板' : '新建编制模板'
      }
    }
  },
  filters: {
    // 获取可展示适用范围的名称数组
    toRange (val) {
      const getName = () => val.map(item => item.orgUnitName)
      let rangeNames = null
      rangeNames = val ? getName() : val
      return rangeNames
    },
    // 获取可展示编制维度下的选择节点
    toDimensions (dimensions, model) {
      // 职群职种模式
      const mode = model.dimensionCode === '02'
      // 从全部的数据中查找到选择的范围
      const filterSelectedData = () => model.jobNodes.filter(item => dimensions.indexOf(item.id) !== -1)
      // 格式化得到最后需要的数据
      const getNeedData = arr => arr.map(item => {
        let obj = {};
        ({id: obj.bussinessId, name: obj.bussinessName, havingProposal: obj.havingProposal} = item)
        return obj
      })
      // 空值，空数组，则退出
      if (!dimensions || dimensions.length === 0) return
      // 保存过滤后的数据
      var selectedData = mode ? model.jobNodes : filterSelectedData()
      return getNeedData(selectedData)
    },
    // 添加建议数判断参数
    havingProposal (dimensions, model) {
      const addHavingProposal = () => dimensions.map(item => {
        item.havingProposal = model.havingProposal
        return item
      })
      return dimensions ? addHavingProposal() : dimensions
    }
  },
  methods: {
    // 打开弹框
    openDialog (ifOpen, row) {
      // 初始化弹框
      this.initDialog()
      // 存在row，则为修改
      if (row) {
        this.isMotify = true
        this.row = row
        let params = {
          scaModMasterId: row.scaModMasterId
        }
        reqTp('getModsInfo', params).then(res => {
          this.initData(res)
        }).catch(() => {
          console.log('获取数据失败')
        })
      } else {
        this.isMotify = false
        this.row = null
      }
      // 显示弹框
      this.$refs.dialog.dialogVisible = ifOpen
    },
    // 提交模板
    submit (done) {
      // 修改模式下的提交
      const motifyMode = () => {
        let data = this.formatData(this.model)
        console.log('修改操作下的提交数据:', data)
        reqTp('motifyTemplate', data).then(res => {
          this.$refs.dialog.dialogVisible = false
          this.$parent.$refs.homeTable.showTempList()
          this.$message.info('提交成功')
          done()
        })
      }
      // 新建模式下的提交
      const newMode = () => {
        let data = this.formatData(this.model)
        console.log('新建操作下提交的数据', data)
        reqTp('newTemplate', data).then(res => {
          this.$refs.dialog.dialogVisible = false
          this.$parent.$refs.homeTable.showTempList()
          this.$message.info('提交成功')
          done()
        })
      }
      // 是否确认提交， callback是确认执行的操作
      const comfirm = (fn) => {
        this.$confirm('是否确认提交', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => fn())
        .catch(() => {
          this.$message.info('提交失败')
        })
      }
      // 流程判定
      let mode = this.isMotify ? motifyMode : newMode
      comfirm(mode)
    },
    // 格式化数据，格式化后的数据用于提交
    formatData (data) {
      var cloneData = objReplaceAttr(data, {
        orgs: 'orgUnitId',
        dimensions: 'bussinessId'
      })
      var params = {
        modName: cloneData.modName,
        orgs: cloneData.orgs,
        dimensionCode: cloneData.dimensionCode,
        dimensions: cloneData.dimensions
      }
      if (this.isMotify) {
        params.scaModMasterId = this.row.scaModMasterId
      }
      return params
    },
    // 初始化数据
    initData (data) {
      console.log('请求的数据为:', data)
      // 重置数据
      Object.keys(this.model).map(key => {
        this.model[key] = data[key]
      })
      // 处理带出来的组织树
      this.model.orgNodes = this.model.orgs.slice()
      this.model.jobNodes = this.model.dimensions.slice()
      // 职群职种的数据格式化
      this.model.dimensionCode === '02' && this.model.jobNodes.forEach(item => {
        item.posJobFamilyId = Number(item.bussinessId)
        item.name = item.bussinessName
      })
      // 其他维度的数据格式化
      if (this.model.dimensionCode !== '02') {
        this.model.dimensions = this.model.dimensions.map(item => {
          item.id = item.bussinessId
          item.name = item.bussinessName
          return item.id
        })
      }
      console.log('处理后的数据为:', this.model)
    },
    // 再关闭窗口的时候重置页面信息
    handleClose (done) {
      done()
    },
    // 初始化弹框的页面
    initDialog () {
      // 重置数据
      Object.keys(this.model).map(key => {
        this.model[key] = ''
      })
      var dialog = this.$refs.dialog
      // 重置按钮
      dialog.currentIndex = 0
      // 重置分页信息
      dialog.children = []
    }
  }
}
</script>

<style lang="scss" scoped>

</style>