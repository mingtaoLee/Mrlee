<template>
  <div class="table">
          <el-row>
            <el-col :span="8">
              <el-input placeholder="请输入标准组织名称" v-model="search.orgStandardName"/>
            </el-col>
            <!-- </el-form-item> -->
            <!-- <el-form-item label="职责："> -->
              <el-col :span="8" :offset="2">
                <el-input  placeholder="请输入职责"  v-model="search.responsibility"/>

              </el-col>
            <!-- </el-form-item> -->
            <el-col :span="2" :offset="2">
              <el-button type="primary" @click="searchOrg" size="small">查询</el-button>

            </el-col>
          </el-row>

     <i-table class="org-lib-table" :table="table" @save="getTableData" @pageIndexChange="pageChange" @pageSizeChange="pageChange">
        <template slot="table" slot-scope="tableScope">
          <el-table
            ref="table"
            border
            :data="tableScope.clone"
            highlight-current-row
            @selection-change="selectionChangeHandler(tableScope, $event)">
            <el-table-column width="80" label="选择" align="center">
              <template slot-scope="scope">
                <el-radio class="radio position-map-radio" @change.native="changeText($event, scope)" v-model="radio" :label="scope.row.orgStandardId"></el-radio>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns || []"
              :key="idx"
              :prop="col.prop"
              :align="col.align"
              :label="col.label"
              :formatter="tableScope.formatter"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
  </div>
</template>

<script>
import ITable from 'components/common/i-table'
import req from 'api/org/lib'
export default {
  name: 'orgtype-table',
  components: {
    ITable
  },
  props: {
    orgType: Object
  },
  data () {
    return {
      table: {
        title: '',     // 标题【可选】
        columns: [         // 表头【必填】
          {
            prop: 'orgStandardName',
            label: '标准组织名称'
          },
          {
            prop: 'orgType',
            label: '组织类型',
            align: 'center',
            display: {dict: 'ORG_TYPE'}
          },
          {
            prop: 'effectiveDate',
            label: '生效时间',
            display: {date: 'yyyy-MM-dd'}
          },
          {
            prop: 'responsibility',
            label: '职责'
          }
        ],
        data: null,   // 占位符，用于挂载数据【必填】
        showPagebar: true
      },
      search: {
        orgStandardName: '',
        responsibility: '',
        status: '1'
      },
      // 表头单选绑定的值
      radio: null
    }
  },
  watch: {
    orgType () {
      this.getTableList()
    }
  },
  methods: {
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
    pageChange (page) {
      this.getTableList(page)
    },
    changeText (e, scope) {
      this.$emit('tableRowChange', scope.row)
    },
    getTableList (option) {
      req('tableList', Object.assign({type: this.orgType.id}, option)).then(data => {
        Object.assign(this.table, data)
      }).catch(() => {
        this.table.data = []
      })
    },
    searchOrg () {
      let searchObj = Object.assign({}, this.search, {orgType: this.orgType.id})
      req('search', searchObj).then(data => {
        Object.assign(this.table, data)
      })
    },
    resetInputs () {
      for (var key in this.search) {
        this.search[key] = ''
      }
    }
  }
}
</script>
<style scoped>
.center{
  display: flex;
  justify-content: center;
}
.org-lib-table{
  margin-top:20px;
}
</style>
