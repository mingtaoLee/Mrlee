<template>
  <div>
        <i-dialog title="选择标准职位" v-model="showDetails" size="large" :toolbar="toolbar">
          <div class="all-panel standardjob-chosen">
            <div class="left-tree">

              <job-family-tree slot="aside" @nodeClick="showingDetails" :treeHeight="320" ref="tree"
              @clearNode="clearNode" style="height:100%;" />

            </div>
            <div class="right-form" v-loading="standardOcLoading" :element-loading-text="$loadingText">
            <i-form @reset="reset" @search="search" class="flow__not-need-validate">
              <el-form-item label="名称">
                <el-input v-model="form.standardJobName"></el-input>
              </el-form-item>
              <el-form-item label="编码">
                <el-input v-model="form.code"></el-input>
              </el-form-item>
            </i-form>
            <i-table :table="standardOcTable" @pageIndexChange="handleOcChange" @pageSizeChange="handleOcChange">
              <template slot="table" slot-scope="tableScope">
              <el-table :data="tableScope.clone" border style="width: 100%" @row-click="tableRowClick">
                <el-table-column label="选择" width="80" align="center">
                    <template slot-scope="scope">
                        <el-radio :label="tableScope.clone[scope.$index].posStandardJobId" v-model="choosingId"
                        @change.native="choosing(tableScope.clone[scope.$index].posStandardJobId,tableScope.clone[scope.$index].name)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="code" label="编码" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="posTitleName" label="职务" align="center" show-overflow-tooltip>
                </el-table-column>
                <!-- <el-table-column prop="status" label="状态">
                </el-table-column> -->
              </el-table>
              </template>
            </i-table>

            </div>
          </div>

        </i-dialog>
  </div>
</template>

<script>
import reqOc from 'api/position/standard-oc'
import ITable from 'components/common/i-table'
import IDialog from 'components/common/i-dialog/i-dialog'
import JobFamilyTree from '@/views/admin/pages/position/job-family-tree'

export default {
  name: '',
  components: {
    ITable,
    IDialog,
    JobFamilyTree
  },
  props: {
  },
  data () {
    return {
      // 搜索
      form: {
        standardJobName: '',
        code: ''
      },
      // 选择的项
      choosingId: '',
      choosingName: '',
      showDetails: false,
      standardOcTable: {
        info: null,
        data: null,
        total: 0,
        showPagebar: true
      },
      toolbar: [{
        text: '取消',
        type: 'default',
        func: this.cancel
      }, {
        text: '确定',
        type: 'primary',
        func: this.confirm
      }],
      standardOcLoading: false
    }
  },
  methods: {
    showingDetails (node) {
      var that = this
      this.reset()
      // that.standardOcLoading = true
      // this.chosen = getTreeChosen(node)
      // var getByData = {
      //   posJobFamilyId: node.key,
      //   jobFamilyType: node.level - 1
      // }
      // reqOc('getStandardJobDetails', getByData).then(data => {
      //   that.standardOcLoading = false
      //   if (data.error) {
      //     // 如果服务器出错了
      //     that.$message.error('信息加载失败')
      //   }
        // 将选择的节点存进store中
      // that.$store.commit('SET_NODE', node)
        // 搜索详细标准职位数据
      that.search()
      // })
    },
    searchStandardJobDetails (options) {
      var that = this
      var getByData = {
        posJobFamilyId: this.$store.state.occupation.node.key,
        jobFamilyType: this.$store.state.occupation.node.level - 1,
        status: '1',
        ...options
      }
      var searchStandardJobsData = Object.assign(getByData, this.standardOcTable.info)
      reqOc('getStandardJobDetails', searchStandardJobsData).then(data => {
        // console.log('标准职位详细数据', data)
        that.standardOcTable.data = data.data || []
        // that.standardOcTable.data.forEach(ele => {
        //   // 将对象数组中的数据分开，id为id数据，name为name数组
        //   var temPosCategoryId = []
        //   var temPosCategoryName = []
        //   ele.categorys.forEach(el => {
        //     temPosCategoryId.push(el.posCategoryId)
        //     temPosCategoryName.push(el.posCategoryName)
        //   })
        //   ele.posCategoryId = temPosCategoryId
        //   ele.posCategoryName = temPosCategoryName.join('，')
        //   // 清空数据
        //   temPosCategoryId = null
        //   temPosCategoryName = null
        // })
        that.standardOcTable.total = Number(data.total) || 0
        that.standardOcTable.info = data.info
      })
    },
    clearNode (e) {
      this.chosen = ''
      this.panel = {}
    },
    handleOcChange (info) {
      this.standardOcTable.info = info
      this.search()
    },
    tableRowClick (row) {
      this.choosing(row.posStandardJobId, row.name)
    },
    choosing (id, name) {
      this.choosingId = id
      this.choosingName = name
    },
    reset () {
      this.form.standardJobName = ''
      this.form.code = ''
    },
    search () {
      this.searchStandardJobDetails(this.form)
    },
    cancel () {
      this.choosingId = ''
      this.chosingName = ''
      this.showDetails = false
    },
    confirm () {
      if (!this.choosingId || !this.choosingName) {
        return this.$message({
          type: 'warning',
          message: '请先选择标准职位'
        })
      }
      this.$emit('confirm', this.choosingId, this.choosingName)
      this.showDetails = false
    }
  }

  // watch: {
  //   showDetails () {
  //     this.$refs.tree.loadTree()
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.all-panel{
  height:450px;
  display: flex;
  .left-tree{
    margin-top: -15px;
    // width:270px;
    height:390px;
    .filter{
      margin-bottom:10px;
    }
    .filter-tree{
      height:400px;
      overflow-y: auto;
    }
  }
  .right-form{
    margin-left:10px;
    height:450px;
    overflow: auto;
    width: calc(100% - 290px);
  }
}
</style>
