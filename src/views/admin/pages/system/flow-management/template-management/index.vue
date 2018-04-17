<template>
  <div>
    <i-layout headerKey="workSystemFormResourceProcdefGet">
      <div slot="header">
        <i-form @reset="reset" @search="search" >
          <el-form-item v-for="(item, idx) in form.formList" :key="idx" :label="item.label">
            <el-input v-model.trim="form.data[item.model]" maxlength="100"></el-input>
          </el-form-item>
        </i-form>
      </div>
      <div slot="section">
        <i-table
          :table="table"
          v-loading="table.loading"
          :element-loading-text="$loadingText"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="table.data"
              v-loading="loading"
              :element-loading-text="$loadingText"
              @selection-change="handleSelectionChange">
              <el-table-column
                prop="id"
                label="序号"
                :width="80"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  {{(scope.$index + 1)}}
                </template>
              </el-table-column>
              <el-table-column
                v-for="(col, idx) of table.columns || []"
                :key="idx"
                :prop="col.prop"
                :label="col.label"
                :align="col.align"
                :width="col.width"
                :min-width="col.minWidth"
                :fixed="col.fixed"
                :formatter="tableScope.formatter"
                :sortable="col.sortable">
              </el-table-column>
              <!-- <el-table-column
                label="操作"
                align="center"
                fixed="right"
                width="200">
                <template slot-scope="scope">
                  <el-button type="text" @click="setTemplate(scope.row)">配置</el-button>
                </template>
              </el-table-column> -->
             <i-table-operator :table="tableScope"></i-table-operator>
            </el-table>
          </template>
        </i-table>

        <!-- 发布弹窗 -->
        <release-flow
          :isShow="releaseManDialogVisisble"
          @cancel="closeDialog"
          @confirm="closeDialog"
          ></release-flow>
      </div>
    </i-layout>
  </div>
</template>
<script>
import ReleaseFlow from './release-flow'
import req from 'api/system/flow-managent'
export default {
  components: {
    ReleaseFlow
  },
  data () {
    return {
      // 发布弹窗是否显示
      releaseManDialogVisisble: false,
      // 查询表单
      form: {
        data: {
          reProcdefKey: '',
          reProcdefId: '',
          reProcdefName: ''
        },
        formList: [
          {label: '模板Key', model: 'reProcdefKey'},
          {label: '模板ID', model: 'reProcdefId'},
          {label: '模板名称', model: 'reProcdefName'}
        ]
      },
      // 列表
      table: {
        data: [],
        columns: [
          { prop: 'reProcdefId', label: '模版ID', align: 'center' },
          { prop: 'reProcdefName', label: '模版名称', width: 160, align: 'center' },
          { prop: 'reProcdefKey', label: '模版KEY', align: 'center' },
          { prop: 'createBy', label: '发布人', align: 'center' },
          { prop: 'createDate', label: '创建时间', align: 'center', display: { date: '' }, sortable: true }
        ],
        setting: {
          toolbar: [
            {
              text: '发布',
              key: 'workSystemDeployPost',
              func: () => this.release()
            }
          ],
          operator: [
            {
              text: '配置',
              key: 'workSystemFormFieldJurisdictionPost',
              func: row => this.setTemplate(row)
            }
          ]
        },
        info: {
          pageIndex: 1,
          pageSize: 10
        },
        search: null,
        loading: false,
        total: 0, //  后台获取到的total个数
        showPagebar: true
      }
    }
  },
  mounted () {
    this.table.search = {...this.form.data}
    // this.getListData()
  },
  methods: {
    // 重置
    reset () {
      this.form.data = {
        reProcdefKey: '',
        reProcdefId: '',
        reProcdefName: ''
      }
    },
    // 查询
    search () {
      // this.getListData()
      this.table.search = {...this.form.data}
    },
    // 获取列表数据
    getListData (opts) {
      this.table.loading = true
      req('getProcdefList', {
        ...opts
      }).then(res => {
        this.table = Object.assign(this.table, res)
        this.table.loading = false
      }).catch(res => {
        console.log(res)
        this.table.loading = false
      })
    },
    // 页数改变
    handleSizeChange (opts) {
      this.getListData(opts)
    },
    // 页码改变
    handleCurrentChange (opts) {
      this.getListData(opts)
    },
    // 配置
    setTemplate (row) {
      this.$router.replace({
        path: '/system/flow_management/template_config',
        query: {
          reProcdefId: row.reProcdefId,
          reProcdefKey: row.reProcdefKey,
          reProcdefName: row.reProcdefName
        }
      })
    },
    // 发布
    release () {
      this.releaseManDialogVisisble = true
    },
    // 关闭弹窗
    closeDialog () {
      this.releaseManDialogVisisble = false
    }
  }
}
</script>
