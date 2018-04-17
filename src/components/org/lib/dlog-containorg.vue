<template>
  <i-dialog
  title="包含组织"
  v-model="visible"
  :toolbar="dialogToolbar"
  @close="closeDialog"
  size="large"
  >
      <i-table :table="table" @save="getTableData"  @pageIndexChange="getContainOrg" @pageSizeChange="getContainOrg">
        <template slot="table" slot-scope="tableScope">
          <el-table
            border
            :data="tableScope.clone"
            v-loading="tableScope.loading"
            highlight-current-row
            @row-click="rowClickHandler(tableScope, $event)">
            <el-table-column
              label="组织名称">
              <template slot-scope="scope">
                <el-tooltip effect="dark" :content="scope.row.orgPathName" placement="top-start">
                  <span>{{ scope.row.orgUnitName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns || []"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              show-overflow-tooltip
              :formatter="tableScope.formatter"
              :width="col.width"
              :align="col.align">
            </el-table-column>
          </el-table>
        </template>
      </i-table>
      <!-- <el-pagination
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="5"
        class="center"
        @current-change="pageChange">
      </el-pagination> -->
    </i-dialog>
</template>

<script>
import req from 'api/org/lib'
import ITable from 'components/common/i-table'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
export default{
  name: 'DlogContainOrg',
  props: {
    value: Boolean,
    containOrgId: String
  },
  components: {
    ITable,
    IDialog
  },
  data () {
    return {
      formLabelWidth: '120px',
      visible: false,
      table: {
        title: '',     // 标题【可选】
        columns: [         // 表头【必填】
          // {
          //   prop: 'orgUnitName',
          //   label: '组织名称'
          // },
          {
            prop: 'orgType',
            label: '组织类别',
            align: 'center',
            display: {dict: 'ORG_TYPE'}
          },
          {
            prop: 'effectiveDate',
            label: '生效日期',
            align: 'center',
            display: { date: 'default' }
          },
          {
            prop: 'orgResponsibility',
            label: '职责'
          }
        ],
        info: {},
        showPagebar: true,
        data: null   // 占位符，用于挂载数据【必填】
      },
      dialogToolbar: [
        {
          text: '返回',
          type: 'defalut',
          func: done => {
            this.cancel(done)
          }
        }
      ]
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.getContainOrg()
      }
      this.visible = this.value
    }
  },
  methods: {
    /** 监听行点击事件，并返回被点击的行对象 */
    rowClickHandler ({ rowClickHandler }, row) {
      rowClickHandler(row)
    },
    /** 获取并挂载由 i-table 抛出的数据 */
    getTableData (data) {
      // data 为 i-table 返回的数据：{ create: [], update: [], delete: [] }
      // 以下为友好写法，可借鉴
      // 若某个集合数组的长度不为 0，则当前数据需要发送
      const shouldPost = !!Object.keys(data).find(
        method => data[method].length !== 0
      )

      this.postList = shouldPost ? data : {}
    },
    closeDialog () {
      this.$emit('input', false)
    },
    cancel () {
      this.closeDialog()
    },
    getContainOrg (option) {
      req('containOrg', Object.assign({id: this.containOrgId}, option)).then(data => {
        console.table(data.data)
        Object.assign(this.table, data)
      })
    }
  }
}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-content: center;
}

.right {
  display: flex;
  justify-content: flex-end;
}
</style>
