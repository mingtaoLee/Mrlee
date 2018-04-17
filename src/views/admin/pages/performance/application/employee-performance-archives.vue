<template>
  <i-layout headerKey="pfmDocumentListGet">
    <i-form
      slot="header"
      @reset="reset"
      @search="search">
      <el-form-item label="员工姓名">
        <el-input
          v-model="keyword"
          placeholder="请填写关键字">
        </el-input>
      </el-form-item>
      <el-form-item label="部门ID">
        <i-select-tree
          dataKey="org"
          nodeKey="orgUnitId"
          rootId=""
          v-model="orgId"
          :readonly="true">
        </i-select-tree>
      </el-form-item>
      <el-form-item label="绩效等级">
        <el-select
          v-model="level"
          clearable>
          <el-option
            v-for="item in levels"
            :key="item.level"
            :label="item.level"
            :value="item.level">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始年份">
        <el-date-picker
          v-model="beginDate"
          clearable
          type="year"
          placeholder="选择年份">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束年份">
        <el-date-picker
          v-model="endDate"
          clearable
          type="year"
          placeholder="选择年份"
          :picker-options="pickEndYear">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="工号查询">
        <el-input
          v-model="employeeCode"
          placeholder="请填写员工号">
        </el-input>
      </el-form-item>
    </i-form>

    <i-table
      slot="section"
      :table="table"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange">
      <template slot-scope="tableScope" slot="table">
        <el-table :data="tableScope.clone">
          <el-table-column
            prop="employeeName"
            label="员工姓名"
            header-align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="employeeCode"
            label="工号"
            sortable
            header-align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="orgName"
            label="组织"
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="position"
            label="职位名称"
            header-align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="year"
            label="归档年份"
            header-align="center"
            width="100"
            class-name="ac">
          </el-table-column>
          <el-table-column
            prop="level"
            label="绩效等级"
            header-align="center"
            width="100"
            class-name="ac">
          </el-table-column>
          <i-table-operator :table="tableScope"></i-table-operator>
        </el-table>
      </template>
    </i-table>

    <el-dialog
      slot="section"
      :visible.sync="detailDialog">
      <i-table
        :table="documentDetail">
        <template
          slot-scope="tableScope"
          slot="table">
          <el-table
            ref="elDialogTable"
            :data="tableScope.clone"

            >
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              prop="period"
              label="阶段"
              :formatter="tableScope.formatter"
              header-align="center"
              class-name="ac"
              width="100">
            </el-table-column>
            <el-table-column
              prop="score"
              label="分数"
              header-align="center"
              class-name="ac">
            </el-table-column>
            <el-table-column
              prop="level"
              label="等级"
              header-align="center"
              class-name="ac">
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </el-dialog>
  </i-layout>
</template>

<script>
import req, { config } from 'api/performance/plan-manage'
import { periodDict } from '@/config/dict'
import IForm from 'components/common/i-form/i-form.vue'
import ILayout from 'components/common/i-layout'
import ISelectTree from 'components/common/i-select-tree/i-select-tree'
import ITable from 'components/common/i-table'

export default {

  components: {
    IForm,
    ILayout,
    ITable,
    ISelectTree
  },

  data () {
    return {
      exportDialog: false,
      detailDialog: false,
      keyword: '',
      orgId: '',
      level: '',
      levels: [],
      beginDate: '',
      endDate: '',
      employeeCode: '',
      documentDetail: {
        data: null,
        total: 0,
        search: null,
        columns: [
          {
            prop: 'period',
            display: { dict: 'PERIOD' }
          }
        ],
        setting: {
          export: {
            text: '导出',
            key: 'pfmDocumentExportPost',
            req: config.getDocumentDetail
          }
        }
      },
      table: {
        data: null,
        total: 0,
        info: null,
        search: null,
        showPagebar: true,
        columns: [
          {
            prop: 'period',
            display: { dict: 'PERIOD' }
          }
        ],
        setting: {
          export: {
            text: '导出',
            key: 'pfmDocumentExportPost',
            req: config.getDocuments
          },
          operator: [
            {
              text: '结果明细',
              key: 'pfmDocumentDetailGet',
              func: row => this.detailDialogShow(row)
            }
          ]
        }
      },
      pickEndYear: {
        disabledDate: (time) => {
          return time.getTime() < this.beginDate
        }
      }
    }
  },

  mounted () {
    this.search()
  },

  created () {
    req('getDocumentLevels')
      .then((res) => {
        this.levels = res
      })
  },

  methods: {
    handleSizeChange (opts) {
      this.getData(opts)
    },

    handleCurrentChange (opts) {
      this.getData(opts)
    },

    getData (opts) {
      req('getDocuments', {
        ...opts
      }).then((res) => {
        Object.assign(this.table, res)
      })
    },

    search () {
      const opts = {
        keyword: this.keyword,
        orgId: this.orgId,
        level: this.level,
        beginDate: !this.beginDate
          ? ''
          : parseInt(this.beginDate.toLocaleDateString()).toString(),
        endDate: !this.endDate
          ? ''
          : parseInt(this.endDate.toLocaleDateString()).toString(),
        employeeCode: this.employeeCode
      }
      this.table.search = opts
    },

    detailDialogShow (row) {
      this.detailDialog = true
      req('getDocumentDetail', {
        'documentId': row.documentId
      }).then((res) => {
        this.documentDetail.data = res.data
        this.documentDetail.setting.export.param =
          () => {
            return {
              'documentId': row.documentId
            }
          }
      })
    },

    periodFormat (row, column) {
      for (let dict of periodDict) {
        if (dict['value'] === row.period) {
          return dict['label']
        }
      }
    },

    reset () {
      this.keyword = ''
      this.orgId = ''
      this.level = ''
      this.beginDate = ''
      this.endDate = ''
      this.employeeCode = ''
    }
  }
}
</script>
