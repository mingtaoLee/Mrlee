<template>
  <i-layout>

    <i-form
      slot="header"
      @reset="reset"
      @search="search">
      <el-form-item label="关键字">
        <el-input v-model="keyword"></el-input>
      </el-form-item>
    </i-form>

    <i-table
      slot="section"
      :table="table"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange">
      <template
        slot-scope="tableScope"
        slot="table">
        <el-table
          ref="quote-table"
          :data="tableScope.clone"
          :border="$$.table.border"
          :stripe="$$.table.stripe"
          @selection-change="handleSelectionChange">
          <el-table-column
            width="50"
            type="selection"
            class-name="ac">
          </el-table-column>
          <el-table-column
            prop="name"
            label="指标名称"
            header-align="center"
            :show-overflow-tooltip="true"
            tooltip-effect="dark">
          </el-table-column>
          <el-table-column
            prop="evaluationType"
            label="评估类型"
            header-align="center"
            width="150"
            :formatter="tableScope.formatter">
          </el-table-column>
          <el-table-column
            prop="evaluationMethod"
            label="评估方法"
            header-align="center"
            width="150"
            :formatter="tableScope.formatter">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            class-name="ac"
            width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="select(scope.row)">
                选择
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </i-table>

  </i-layout>
</template>

<script>
import req from 'api/performance/plan-manage'
import ITable from 'components/common/i-table'
import ILayout from 'components/common/i-layout'
import IForm from 'components/common/i-form/i-form.vue'
export default {

  components: {
    IForm,
    ITable,
    ILayout
  },

  data () {
    return {
      table: {
        data: null,
        total: 0,
        info: {
          pageIndex: 1,
          pageSize: 10
        },
        showPagebar: true,
        columns: [
          { prop: 'evaluationType', display: { dict: 'EVALUATION_TYPE' } },
          { prop: 'evaluationMethod', display: { dict: 'EVALUATION_METHOD' } }
        ],
        setting: {
          export: {
            elTable: null
          }
        }
      },
      keyword: '',
      selection: []
    }
  },

  created () {
    this.getData()
  },

  mounted () {
    this.table.setting.export.elTable = this.$refs['quote-table']
  },

  methods: {
    handleSizeChange (opts) {
      this.getData()
    },

    handleCurrentChange (opts) {
      this.getData()
    },

    getData () {
      req('getQuoteList', {
        ...this.table.info,
        keyword: this.keyword,
        status: 1
      }).then((res) => {
        this.table = Object.assign({}, this.table, res)
      })
    },

    search () {
      this.getData()
    },

    reset () {
      this.keyword = ''
    },

    handleSelectionChange (selection) {
      this.$emit('check', selection)
    },

    select (val) {
      this.$emit('select', val)
    }
  }
}
</script>
