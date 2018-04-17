<template>
    <i-dialog
        title="选择职位"
        v-model="isShow"
        :toolbar="toolbar"
        :size="type==='normal'?'huge':'large'">
        <i-layout :height="450" :besideWidth="type==='normal'?0:700" :toggleAside="false">
          <div slot="aside">
            <org-tree :treeStyle="treeStyle" :showFreezeCheckbox="false" showFilter @node-click="chooseNode"></org-tree>
          </div>
          <div slot="section">
              <div class="tableContainer">
                <i-table
                  :table="table"
                  @pageIndexChange="handleCurrentChange"
                  @pageSizeChange="handleSizeChange"
                >
                  <template slot="table" slot-scope="tableScope">
                  <el-table
                    ref="multipleTable"
                    :data="tableScope.clone"
                    style="width: 100%"
                    v-loading="potisionLoading"
                    :element-loading-text="$loadingText"
                    @row-click="handleRowClick"
                  >
                    <el-table-column width="80" label="选择" align="center">
                      <template slot-scope="scope">
                        <el-radio class="radio position-map-radio" @change.native="changeText($event, scope)" v-model="radio" :label="scope.row"></el-radio>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="职位名称"
                      align="left"
                      show-overflow-tooltip
                    />
                    <el-table-column
                      v-if="type==='normal'"
                      prop="posJobFamilyName"
                      label="所属职群"
                      align="left"
                      width="120"
                      show-overflow-tooltip
                    />
                    <el-table-column
                      v-if="type==='normal'"
                      prop="jobClassName"
                      label="所属职种"
                      align="left"
                      width="120"
                      show-overflow-tooltip
                    />
                    <el-table-column
                      v-if="type==='normal'"
                      prop="subJobClassName"
                      label="所属子职种"
                      align="left"
                      width="120"
                      show-overflow-tooltip
                    />
                    <el-table-column
                      v-if="type==='normal'"
                      prop="posTitleName"
                      label="职务"
                      align="left"
                      width="120"
                      show-overflow-tooltip
                    />
                    <el-table-column
                      v-if="type==='normal'"
                      prop="status"
                      label="状态"
                      :formatter="tableScope.formatter"
                      align="left"
                      width="120"
                      show-overflow-tooltip
                    />
                  </el-table>
                  </template>
                </i-table>
              </div>
          </div>
        </i-layout>
      </i-dialog>
</template>

<script>
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import ITable from 'components/common/i-table'
  import req from 'api/position/position-map'
  import OrgTree from 'components/org/public/org-tree'

  export default {
    name: 'PositionSelection',
    components: {
      OrgTree,
      ITable,
      IDialog
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'normal'// 可选择mini
      },
      status: {
        type: String,
        default: 'available'
      },
      loaded: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        // 职位表格的loading
        potisionLoading: false,
        isShow: false,
        // 选择的职位名字
        chosenText: '请选择职位',
        // 单选项的绑定值
        radio: null,
        // 树形图的绑定值
        atlasData: {},
        // 左侧下拉数选中的节点
        chosenNode: null,
        // 表格的配置
        table: {
          columns: [
            { prop: 'status', display: { dict: 'POSITION_STATUS' } }
          ],
          data: null,
          total: 0,
          search: '',
          info: null,
          showPagebar: true
        },
        // 弹框按钮配置
        toolbar: [{
          text: '取消',
          type: 'plain',
          func: (done) => {
            this.isShow = false
            done()
          }
        }, {
          text: '确定',
          type: 'primary',
          func: (done) => {
            this.save()
          }
        }],
        treeStyle: {
          height: '300px',
          overflow: 'auto'
        },
        statusConfig: {
          'all': '',
          'cancel': '0',
          'available': '1',
          'frozen': '2'
        }
      }
    },
    methods: {
      // 每页展示多少条数据
      handleSizeChange (params) {
        this.fetch(params)
      },
      // 获取置顶页数数据
      handleCurrentChange (params) {
        this.fetch(params)
      },
      // 改变选中职位框的文字
      changeText (e, scope) {
        this.chosenText = scope.row.name
      },
      // 确认图谱展示的模块，同时关闭面板
      save () {
        if (!this.radio) {
          return this.$message.warning('请先选择职位')
        }
        this.$emit('change', this.radio)
        this.isShow = false
      },
      // 通过组织id获取职位信息
      search () {
        let params = {}
        if (this.chosenNode) {
          params.orgUnitId = this.chosenNode.orgUnitId
        }
        if (this.statusConfig[this.status]) {
          params.status = this.statusConfig[this.status]
        }
        this.table.search = {...params}
      },
      fetch (params = {}) {
        this.potisionLoading = true
        req('getPositionInfo', params)
        .then(res => {
          ({ info: this.table.info, data: this.table.data, total: this.table.total } = { ...res })
          this.potisionLoading = false
        })
      },
      // 显示职位面板
      showPositionList () {
        this.isShow = true
      },
      // 选择节点，同时获取数据
      chooseNode (node) {
        this.chosenNode = node
        this.search()
      },
      handleRowClick (row, event, column) {
        this.radio = row
      }
    },

    watch: {
      value (v) {
        this.isShow = v
      },
      isShow (v) {
        this.$emit('input', v)
      }
    },

    mounted () {
      if (this.loaded) {
        this.search()
      }
    },

    created () {

    }
  }
</script>



<style lang="scss" scoped>
.tableContainer{
  height: 400px;
  overflow: auto;
}
</style>
