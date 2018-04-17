<template>
  <i-layout header-key="cpsPersonnelNoAccountSelectGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="人事范围代码">
          <el-input v-model="searchParam.personnelGroupCode"></el-input>
        </el-form-item>
        <el-form-item label="人事范围名称">
          <el-input v-model="searchParam.personnelGroupName"></el-input>
        </el-form-item>
      </i-form>
    </template>
    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            border
            @selection-change="selectionChangeHandler(tableScope, $event)"
            v-loading="loading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
            >
              <!-- <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                />
              </template> -->
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        title="人事范围户头设置"
        width="800px"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :personnelGroupCode="personnelGroupCode"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req, {config} from 'api/iaf/company-rules'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import DetailEdit from './detail-edit'
  import PaginationMixin from 'mixins/compensation/iaf-pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
      ITable,
      ITableCell,
      IDialog,
      DetailEdit,
      ILayout
    },
    data () {
      return {

        /* detail-edit */
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确认',
            throttle: true,
            func: done => {
              return this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,
        /* table */
        table: {
          columns: [
            {prop: 'personnelGroupCode', label: '人事范围代码', sortable: true, align: 'left'},
            {prop: 'personnelGroupName', label: '人事范围名称', align: 'left'}
          ],
          setting: {
            export: {
              config: {
                fileName: '无户头人事'
              },
              key: 'iafExportNoAccountPersonnelDto',
              req: config.getNoneAccountOrgs
            },
            operator: [
              {
                key: 'iafExportNoAccountPersonnelAccount',
                text: '设置户头',
                func: this.setAccount
              }
            ],
            toolbar: [{
              text: '返回',
              type: 'plain',
              func: this.back
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          personnelGroupCode: '',
          personnelGroupName: ''
        }
      }
    },
    methods: {
      fetch (options = {}) {
        this.load()
        req('getNoneAccountOrgs', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
        .catch(err => {
          console.log(err)
          this.loaded()
        })
      },
      setAccount (scope) {
        this.personnelGroupCode = scope.row.personnelGroupCode
        this.openDetailDialog()
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleSave (done) {
        return this.$refs.detailEdit.save().then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            done()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
