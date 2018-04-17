<template>
  <div class="wrap" v-loading="loading" :element-loading-text="$loadingText">
    <i-table :table="table"
    @pageSizeChange="handleChange"
    @pageIndexChange="handleChange">>
      <template slot="table" slot-scope="tableScope">
        <el-table :data="tableScope.clone" border
        @selection-change="selectionChangeHandler">
          <el-table-column type="selection" fixed="left"/>
          <el-table-column
            prop="modName"
            label="编制模板名称"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <a class="checkTemp" @click="check(scope.row)">{{scope.row.modName}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="dimensionCode"
            label="所属维度"
            :formatter="tableScope.formatter"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="range"
            label="适用范围"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{getRange(scope.row.orgs)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="modStatus"
            label="模板状态"
            :formatter="tableScope.formatter"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="tableScope.operator"
            label="操作"
            align="center"
            fixed="right"
            width="180">
            <template slot-scope="scope">
              <i-table-operator
                :table="tableScope"
                :row="scope.row"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </div>
</template>

<script>
import reqTp from 'api/compile/template'
import ITable from 'components/common/i-table'
import ITableOperator from 'components/common/i-table-operator'
import {TempStatusDict} from 'config/dict'

export default {
  name: 'TemplateManageHomeTable',
  components: {
    ITable,
    ITableOperator
  },
  data () {
    return {
      // 模板管理主页的表格内容配置项
      table: {
        columns: [
            { prop: 'dimensionCode', display: { dict: 'DIMENSION' } },
            { prop: 'modStatus', display: { dict: 'SCALE_MOD_STATUS' } }
        ],
        setting: {
          operator: [
            {
              text: '修改',
              func: this.modify,
              show: row => {
                let USING = row.modStatus === TempStatusDict['USING']
                let STOP = row.modStatus === TempStatusDict['STOP']
                let status = USING || STOP
                let banMode = {
                  disable: status,
                  message: USING ? '已使用不能修改' : '已停用不能修改'
                }
                let commonMode = {
                  disable: status
                }
                return USING || STOP ? banMode : commonMode
              }
            },
            {
              text: '启用',
              func: this.start,
              type: 'success',
              show (row) {
                let status = row.modStatus === TempStatusDict['NOT_START'] || row.modStatus === TempStatusDict['STOP']
                return { empty: !status }
              }
            },
            {
              text: '停用',
              func: this.stop,
              type: 'danger',
              show (row) {
                let status = row.modStatus === TempStatusDict['STARTED'] || row.modStatus === TempStatusDict['USING']
                return { empty: !status }
              }
            }
          ],
          toolbar: [{
            text: '新建',
            func: this.newTemp
          }, {
            text: '删除',
            type: 'danger',
            func: this.deleteTemp
          }]
        },
        data: null,
        info: {
          pageSize: 10,
          pageIndex: 1
        },
        total: 0,
        search: '',
        showPagebar: true
      },
      // 保存列表被选择的项
      selection: [],
      // loading
      loading: false
    }
  },

  methods: {
    // 展示模板列表，searcher为搜索内容
    showTempList (params) {
      this.loading = true
      this.table.search = { ...params }
    },
    // 请求数据
    fetch (params = {}) {
      reqTp('getTempList', params).then(res => {
        this.loading = false;
        ({ data: this.table.data, info: this.table.info, total: this.table.total } = { ...res })
      }).catch(e => {
        this.loading = false
      })
    },
    // 列表被选择的行
    selectionChangeHandler (selection) {
      this.selection = selection
    },
    // 转化适用范围的格式
    getRange (orgs) {
      let range = []
      orgs && orgs.map(ele => {
        if (!range.includes(ele.orgUnitName)) {
          range.push(ele.orgUnitName)
        }
      })
      return range.join('，')
    },
    // 新建按钮触发
    newTemp () {
      this.$emit('new')
    },
    // 删除按钮触发
    deleteTemp () {
      // 执行删除操作
      const execDelete = arr => {
        return () => {
          let params = {
            scaModMasterIds: arr.join(',')
          }
          reqTp('deleteTemp', params).then(res => {
            if (res) {
              this.$message.success('删除成功')
              this.showTempList()
            }
          })
        }
      }
      // 从删除数据中，返回删除id数组
      const getDeleteIdArr = () => {
        return this.selection.map(ele => ele.scaModMasterId)
      }
      // 是否确认删除， callback是确认删除执行的操作
      const comfirmDelete = (fn) => {
        this.$confirm('是否确认删除该模板', '模板删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => fn())
        .catch(() => this.$message.info('取消删除'))
      }
      // 流程判定
      if (Array.isArray(this.selection) && this.selection.length === 0) {
        return this.$message.warning('请先选择模板')
      } else {
        let arr = getDeleteIdArr()
        arr && comfirmDelete(execDelete(arr))
      }
    },
    // 查看某个模板触发
    check (row) {
      this.$emit('check', row)
    },
    // 修改列表触发
    modify (row) {
      this.$emit('modify', row)
    },
    // 启用模板
    start (row) {
      let params = {
        scaModMasterId: row.scaModMasterId
      }
      reqTp('startTemp', params).then(data => {
        if (data) {
          this.$message({
            message: '启用成功',
            type: 'success'
          })
          return this.showTempList()
        }
      })
    },
    // 停用模板
    stop (row) {
      let params = {
        scaModMasterId: row.scaModMasterId
      }
      reqTp('stopTemp', params).then(data => {
        if (data) {
          this.$message({
            message: '停用成功',
            type: 'success'
          })
          return this.showTempList()
        }
      })
    },
    // 页量改变/页码改变
    handleChange (params) {
      this.fetch(params)
    }
  },

  computed: {

  },

  created () {

  }
}
</script>

<style lang="scss" scoped>
.checkTemp{
  color:#3da5fe;
  cursor: pointer;
}
.start{
  color:#00ff00;
}
.stop{
  color:#ff0000;
}
</style>
