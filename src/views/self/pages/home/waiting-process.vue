<template>
    <div class="myForm">
      <i-form 
        @reset="reset" 
        @search="search" 
        class="header-table"
        :inline="true"
        > 
            <el-form-item label="标题" porp="todoTitle">
                <el-input v-model="headerTextCenter.todoTitle"></el-input>
            </el-form-item>
            <el-form-item label="时间" porp="todoDate">
                <el-date-picker
                   v-model="headerTextCenter.todoDate"
                   type="date"
                   placeholder="选择日期">
                </el-date-picker>  
            </el-form-item>
      </i-form>
      <div slot="section" class="section-main">
            <i-table
             :table="table"
             @pageSizeChange="myhandleSizeChange"
             @pageIndexChange="myhandleCurrentChange">
                    <template slot="table" slot-scope="tableScope">
                        <!-- :data="tableScope.clone" -->
                        <el-table :data="tableScope.clone" @row-click="rowSkip" class="rowStyle">
                        <el-table-column
                            v-for="(col, idx) of table.columns"
                            :key="idx"
                            :prop="col.prop"
                            :label="col.label"
                            header-align="left"
                            :formatter="tableScope.formatter"
                            :align="col.align"
                        />
                        </el-table>
                    </template>
            </i-table>
      </div>
    </div>
</template>
<script>
import IForm from 'components/common/i-form/i-form.vue'
import ILayout from 'components/common/i-layout'
import ITable from 'components/common/i-table'
import req from 'api/self/home.js'
import moment from 'moment'
import PaginationMixin from 'mixins/compensation/pagination-mixin'
export default {
  components: {
    IForm,
    ILayout,
    ITable
  },
  mixins: [PaginationMixin],
  data () {
    return {
      table: {
        columns: [
            {prop: 'todoTitle', label: '我的待办'},
            {prop: 'todoDate', label: '', align: 'right'}
        ],
        data: null,
        info: null,
        total: null,
        search: null,
        showPagebar: true
      },
      linkPcList: [], // 路径的是否展示高亮
      headerTextCenter: {
        todoTitle: '',
        todoDate: ''
      },
      target: '_blank'
    }
  },
  // computed: {
  //   execute () {
  //     console.log(this.$store.state.self.status, '222')
  //     return this.$store.state.self.status
  //   }
  // },
  methods: {
    fetchPage (pageSize, pageIndex) {
      req('todo', {pageSize: pageSize, pageIndex: pageIndex}).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].todoDate = moment(res.data[i].todoDate).format('YYYY-MM-DD HH:mm')
          if (res.data[i].linkPc) {
            if (res.data[i].linkPc.indexOf('/flow.html#/flow')) {
              res.data[i].linkPc = '/self.html#' + res.data[i].linkPc
            } else {
              res.data[i].linkPc = res.data[i].linkPc
            }
          }
        }
        this.table.data = res.data
        this.table.info = res.info
        this.table.total = res.total
        this.$store.commit('self/SET_STATUS', 1)
      })
    },
    rowSkip (row) {
      // console.log(window.location.origin + row.linkPc)
      if (row.linkPc) {
        if (row.linkPc.indexOf('/self.html#/employee/guarantor') > -1) {
          this.target = '_self'
        }
        window.open(window.location.origin + row.linkPc, this.target)
      }
    },
    myhandleSizeChange (value) {
      this.fetchPage(value.pageSize, value.pageIndex)
    },
    myhandleCurrentChange (value) {
      this.fetchPage(value.pageSize, value.pageIndex)
    },
    search () {
      let info = this.table.info
      this.headerTextCenter.todoDate = moment(this.headerTextCenter.todoDate).format('YYYY-MM-DD')
      if (this.headerTextCenter.todoDate === 'Invalid date') {
        this.headerTextCenter.todoDate = ''
      }
      req('pageTodo', {
        todoTitle: this.headerTextCenter.todoTitle,
        todoDate: this.headerTextCenter.todoDate,
        pageIndex: info.pageIndex,
        pageSize: info.pageSize
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].todoDate = moment(res.data[i].todoDate).format('YYYY-MM-DD HH:mm')
          if (res.data[i].linkPc) {
            if (res.data[i].todoTitle.slice(0, 6) === '【问卷发布】') {
              res.data[i].linkPc = '/self.html#' + res.data[i].linkPc
            }
            this.linkPcList[i] = res.data[i].linkPc
          }
        }
        this.table.data = res.data
        this.table.info = res.info
        this.table.total = res.total
      })
    },
    reset () {
      this.headerTextCenter.todoTitle = ''
      this.headerTextCenter.todoDate = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.header-i-table + .cell{
    text-align: left;
    font-size: 16px;
}
.header-table {
    height: 58px;
    line-height: 58px;
    margin-bottom: 15px;
    background: #f8f8f8;
    border: 1px solid #e6ebf5;
}
.header-i-table {
    text-align: left;
    font-size: 16px;
}
.section-main {
    padding: 20px;
    background: #fff;
}
.i-layout-style {
    background: #f8f8f8;
}


</style>
<style lang="scss">
.el-main {
    background: #f8f8f8 !important;
}
 .el-table--border th{
    border: none;
}
.myForm .rowStyle {
    cursor: pointer;
}
</style>