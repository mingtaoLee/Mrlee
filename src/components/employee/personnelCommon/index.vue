<template>
  <div class="LXComponent">
    <i-dialog v-model="weatherShow.val" :toolbar="bottomButton" :title="title" destroyedWhenClose size="large">
      <!-- 查询表单 -->
      <i-form  @reset="reset" @search="search">
        <el-form-item label="人事范围编号">
          <el-input v-model="searchCondition.personnelGroupCode"></el-input>
        </el-form-item>
        <el-form-item label="人事范围名称">
          <el-input v-model="searchCondition.personnelGroupName"></el-input>
        </el-form-item>
        <el-form-item label="所属公司编号">
          <el-input v-model="searchCondition.companyCode"></el-input>
        </el-form-item>
      </i-form>
      <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange" @Mounted="componentMounted">
        <template slot="table" slot-scope="tableScope">
          <el-table
            class="testFather"
            ref="multipleTable"
            :data="tableScope.clone"
            style="width: 100%"
            highlight-current-row
            @current-change="currentRow"
          >
            <!-- <el-table-column type="selection" width="55" class="test" /> -->
            <el-table-column v-for="(item, idx) in table.columns"
              :key="idx"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :formatter="tableScope.formatter"
              :align="item.align"
            ></el-table-column>
            <!-- <i-table-operator :table="tableScope"/> -->
          </el-table>
        </template>
      </i-table>
    </i-dialog>
  </div>
</template>

<script>
import req from 'api/employee/personal'
export default {
  props: {
    // 控制弹框是否显示
    weatherShow: {
      default: {}
    }
  },
  data () {
    return {
      // 弹框标题
      title: '人事选择框',
      selectedData: null,
      // 弹出框取消确认按钮
      bottomButton: [
        {
          text: '取消',
          type: 'text',
          func: () => {
            // this.searchCondition = null
            Object.keys(this.searchCondition).map(item => {
              this.searchCondition[item] = ''
            })
            this.weatherShow.val = false
          }
        },
        {
          text: '确定',
          type: 'primary',
          func: () => {
            this.$emit('selectedData', this.selectedData)
            // this.searchCondition = null
            Object.keys(this.searchCondition).map(item => {
              this.searchCondition[item] = ''
            })
            this.weatherShow.val = false
          }
        }
      ],
      // 顶部查询条件
      searchCondition: {
        personnelGroupCode: '',
        personnelGroupName: '',
        companyCode: ''
      },
      // i-table表格列表配置项
      table: {
        columns: [
          { prop: 'personnelGroupCode', label: '人事范围编号', width: 200, align: 'center' },
          { prop: 'personnelGroupName', label: '人事范围名称', width: 200, align: 'center' },
          { prop: 'companyCode', label: '所属公司编号', width: 200, align: 'center' },
          { prop: 'companyName', label: '所属公司名称', width: 200, align: 'center' },
          { prop: 'startDate', label: '生效时间', width: 150, display: {date: ''}, align: 'center' },
          { prop: 'endDate', label: '失效时间', width: 150, display: {date: ''}, align: 'center' }
        ],
        // i-table中监听search变化来触发请求
        search: null,
        data: null,
        // 注册 page 相关信息
        // ---是否显示底部分页
        showPagebar: true,
        info: null,
        total: 0
      }
    }
  },
  // watch: {
  //   'weatherShow.val' (val) {
  //     console.log(val)
  //     console.log(this.table.search)
  //     val && (this.table.search = {...this.searchCondition})
  //     console.log(this.table.search)
  //   }
  // },

  methods: {
    // 监听每页显示条数变化
    handleSizeChange (val) {
      this.table.info = val
      // console.log(val)
    },
    // 监听页数变化
    handleCurrentChange (val) {
      // console.log(val)
      this.table.info = val
      this.getData(val)
    },
    // 获取表格数据
    getData (val) {
      req('getPersonnelData', val)
      .then(res => {
        // console.log(res)
        Object.keys(res).map(key => (this.table[key] = res[key]))
      })
    },
    // i-table组件加载好了之后再去触发table.search的变化
    componentMounted () {
      this.table.search = {...this.searchCondition}
    },
    // 切换选中行时出触发的事件
    currentRow (currentRow, oldRow) {
      this.selectedData = currentRow
    },
    // 点击查询
    search () {
      this.table.search = { ...this.searchCondition }
    },
    // 重置表单
    reset () {
      Object.keys(this.searchCondition).map(item => {
        this.searchCondition[item] = ''
      })
      this.table.search = { ...this.searchCondition }
    }
    // 用户点击时触发
    // handleSelectionChange222 (allSeletion, nowClickRow) {
    //   console.log(allSeletion)
    //   console.log(nowClickRow)
    //   // personnelGroupCode
    //   let checkedRow = []
    //   allSeletion.map((val, idx) => {
    //     console.log(val)
    //     val.personnelGroupCode === nowClickRow.personnelGroupCode && checkedRow.push(val)
    //   })
    //   console.log(checkedRow)
    //   this.$refs.multipleTable.toggleRowSelection(checkedRow[0])
    // }
  }
}
</script>

<style lang="scss">
// .LXComponent {
//   .el-table{
//     .el-table__header-wrapper {
//       .has-gutter {
//         .el-checkbox {
//           display: none;
//         }
//       }
//     }
//   }
// }
.LXComponent {
  .testFather {
    background: black;
    table {
      thead {
        tr {
          th:nth-child(1) {
            display: none !important;
          }
        }
      }
    }
  }
  // .test:nth-child(1) {

  //   display: none;
  // }
}
</style>

