<template>
  <i-layout headerKey="cpsClothingLowestBonusGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchParam.employeeName"></el-input>
        </el-form-item>
        <el-form-item label="区域">
          <i-select-area
            v-model="searchParam.areaId"
            type="yonghui"
            search
          ></i-select-area>
        </el-form-item>
        <el-form-item label="人事范围">
          <remote-select
            v-model="searchParam.personnelGroupCode"
            dataKey="personnelGroup"
            placeholder="请输入代码或名称搜索"
            :extraParam="{ hasPower: 'Y' }"
            :displayKeys="['personnelGroupCode', 'personnelGroupName']"
            :props="personnelGroupProps"
          ></remote-select>
        </el-form-item>
        <el-form-item label="薪资组">
          <remote-select
            v-model="searchParam.groupId"
            dataKey="salaryGroup"
            placeholder="请输入代码或名称搜索"
            :displayKeys="['groupCode', 'groupName']"
            :props="groupProps"
          ></remote-select>
        </el-form-item>
        <el-form-item label="组织名称">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="searchParam.orgUnitId"
            lazy
            size="small"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="开业日期起">
          <el-date-picker
            v-model="searchParam.beginRunDateStart"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="runDateStartOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开业日期止">
          <el-date-picker
            v-model="searchParam.beginRunDateEnd"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="runDateEndOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="核算月份起">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="month"
            @change="handleEffectiveDateStartChange"
            :picker-options="effectStartOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="核算月份止">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="month"
            @change="handleEffectiveDateEndChange"
            :picker-options="effectEndOptions"
          >
          </el-date-picker>
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
            v-loading="loading"
            :element-loading-text="$loadingText"
            :data="tableScope.clone" :cell-class-name="cellClassName"
            border
            @selection-change="selectionChangeHandler(tableScope, $event)"
          >
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :formatter="tableScope.formatter"
              :fixed="col.fixed"
            >
            </el-table-column>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowIsolate"
        title="抽数"
        size="mini"
        :toolbar="isolateEditToolbar"
        destroyedWhenClose
      >
        <isolate-edit ref="isolateEdit" :id="id"></isolate-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/guaranteed-bonuses'
  import IsolateEdit from 'components/compensation/isolate-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import isolateMixin from 'mixins/compensation/isolate-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access, ConfirmDataMixin, isolateMixin],
    components: {
      IsolateEdit,
      RemoteSelect
    },
    data () {
      return {
        // id键值标识
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        reqConfig: { req: req, getName: 'getClothingLowests' },
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        isolateConfig: { req: req, name: 'getSyncClothBonusData' },
        // 人事范围选择器配置
        personnelGroupProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        runDateStartOptions: {
          disabledDate: (time) => {
            return Date.parse(time) > Date.parse(this.searchParam.beginRunDateEnd) - 3600 * 1000 * 24
          }
        },
        runDateEndOptions: {
          disabledDate: (time) => {
            return Date.parse(time) < Date.parse(this.searchParam.beginRunDateStart)
          }
        },

        /* table */
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', align: 'left', width: '120', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', align: 'left', width: '120', fixed: 'left' },
            { prop: 'areaName', label: '区域', width: '140', align: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', width: '120' },
            { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '120' },
            { prop: 'groupName', label: '薪资组名称', align: 'left', width: '120' },
            { prop: 'orgUnitName', label: '组织名称', align: 'left', width: '120' },
            { prop: 'positionName', label: '职位', align: 'left', width: '140' },
            { prop: 'jobTitle', label: '职位分类', align: 'left', width: '140' },
            { prop: 'beginRunDate', label: '开业日期', align: 'left', width: '120', display: { date: '' } },
            { prop: 'checkMonth', label: '核算月份', align: 'left', width: '120' },
            { prop: 'empSalary', label: '员工工资', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'isFloat', label: '是否随时效浮动', align: 'left', width: '120', display: {dict: 'WHETHER_TYPE'} },
            { prop: 'level', label: '保底分红档级', align: 'left', width: '120', display: {dict: 'BONUS_LOWEST_LEVEL'} },
            { prop: 'levelNorm', label: '保底分红档级-标准', align: 'left', width: '160', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'shouldBonus', label: '保底分红档级-应发', align: 'left', width: '160', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'confirmStatus', label: '确认状态', width: '120', align: 'left', display: { dict: 'CONFIRM_STATUS' } }
            // { prop: 'createBy', label: '操作者', align: 'left', width: '120' },
            // { prop: 'createDate', label: '操作时间', align: 'left', width: '140', display: { date: '' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '服装保底分红'
              },
              key: 'cpsClothingLowestBonusExport',
              req: config.getClothingLowests
            },
            import: {
              key: 'cpsClothingLowestBonusImportPost',
              business: 'cps-clothingLowestBonus',
              show: () => ({ empty: false })
            },
            toolbar: [{
              text: '抽数',
              key: 'cpsClothingLowestBonusOneGet',
              func: this.isolatePolicy
            }, {
              text: '确认无误',
              key: 'cpsClothingLowestBonusConfirm',
              func: (vm) => {
                return this.confirmAction(vm, 'Y')
              },
              show: () => ({ disable: this.confirmDataButtonIsDisabled() })
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          employeeCode: '',
          employeeName: '',
          orgUnitName: '',
          orgUnitId: '',
          groupId: '',
          areaId: '',
          effectiveDateStart: '',
          effectiveDateEnd: '',
          beginRunDateStart: '',
          beginRunDateEnd: ''
        }
      }
    },
    methods: {
      afterFetch (res) {
        res.data.map(item => {
          if (item.checkMonth) {
            item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
          }
        })
        return Promise.resolve(true)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
