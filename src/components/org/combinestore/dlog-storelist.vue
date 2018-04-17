<template>
  <div class="storeDialog">
    <el-dialog
      title="小店列表"
      :visible.sync="visible"
      @close="closeDialog"
      :modal="modal"
      @open="open"
      modal="true">
      <div class="switch">
        <span>是否隐藏已合并的小店：</span>
        <el-switch
          v-model="flag"
          @change="switchChange">
        </el-switch>
      </div>
      <i-table
        ref="iTable"
        :table="table"
        @pageSizeChange="pageChange"
        @pageIndexChange="pageChange"
        @save="getTableData">
        <template slot="table" slot-scope="tableScope">
          <el-table
            border
            ref="multipleTable"
            :data="tableData"
            @select="selectChange"
            @select-all="selectAll"
            :row-class-name="tableRowClassName">
              <el-table-column
                type="selection"
                width="40"
                :selectable="selectable"/>
              <el-table-column
                v-for="(col, idx) of table.columns || []"
                :key="idx"
                :prop="col.prop"
                :align="col.align"
                :formatter="tableScope.formatter"
                :label="col.label"
                :width="col.width"
                show-overflow-tooltip="true"/>
          </el-table>
        </template>
      </i-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import req from 'api/org/combinestore'
import ITable from 'components/common/i-table'
export default {
  data () {
    return {
      tableData: [],
      table: {
        columns: [
          {
            prop: 'orgShortName',
            label: '小店名称',
            width: '150'
          },
          {
            prop: 'orgPathName',
            label: '小店全称',
            align: 'center',
            width: '250'
          },
          {
            prop: 'orgTier',
            label: '层级',
            align: 'center',
            width: '100'
          }
        ],
        data: null,   // 占位符，用于挂载数据【必填】
        info: {},
        showPagebar: true
      },
      visible: false,
      modal: false,
      codes: [],
      cacheCombineList: [],
      flag: false,
      selectable (row) {
        if (row.highlight === 'false') {
          return false
        } else {
          return true
        }
      }
    }
  },
  components: {
    ITable
  },
  props: {
    value: Boolean,
    combineList: Array
  },
  methods: {
    selectChange (selection, row) {
      for (let i = 0; i < this.combineList.length; i++) {
        if (this.combineList[i].unitId === row.orgUnitId) {
          this.combineList.splice(i, 1)
          return
        }
      }
      this.combineList.push({unitId: row.orgUnitId, unitName: row.orgShortName})
    },
    selectAll (selection) {
      if (selection.length) {
        selection.forEach(select => {
          let flag = true
          for (let i = 0; i < this.combineList.length; i++) {
            if (this.combineList[i].unitId === select.orgUnitId) {
              flag = false
              break
            }
          }
          if (flag === true) {
            this.combineList.push({unitId: select.orgUnitId, unitName: select.orgShortName})
          }
        })
      } else {
        this.tableData.forEach(data => {
          this.combineList.forEach((combine, index) => {
            if (combine.unitId === data.orgUnitId) {
              this.combineList.splice(index, 1)
            }
          })
        })
      }
    },
    closeDialog () {
      this.$emit('input', false)
    },
    deepClone (obj) {
      var newObj = obj.constructor === Array ? [] : {}
      if (typeof obj !== 'object') {
        return
      } else {
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            newObj[i] = typeof obj[i] === 'object' ? this.deepClone(obj[i]) : obj[i]
          }
        }
      }
      return newObj
    },
    confirm () {
      this.combineList.forEach(data => {
        this.codes.push(data.unitId)
      })
      this.$emit('receiveCodes', this.codes, this.combineList)
      this.closeDialog()
    },
    cancel () {
      this.combineList = this.cacheCombineList
      this.confirm()
    },
    isContained () {
      this.$nextTick(() => {
        this.combineList.forEach(val => {
          this.tableData.forEach(data => {
            if (val.unitId === data.orgUnitId) {
              this.$refs.multipleTable.toggleRowSelection(data)
            }
          })
        })
      })
    },
    open () {
      this.cacheCombineList = this.deepClone(this.combineList)
      this.codes = []
      this.getList(this.currentPage)
    },
    getList (option = {}) {
      req('allStore', Object.assign(option, {flag: this.flag})).then(data => {
        this.tableData = data.data
        Object.assign(this.table, data)
        this.isContained()
      }).catch(() => {
        this.$message.warning('查询失败')
      })
    },
    tableRowClassName (row, index) {
      if (row.highlight === 'false') {
        return 'highlight'
      }
    },
    switchChange (val) {
      this.getList(1)
    },
    pageChange (page) {
      this.getList(page)
      this.currentPage = page
    }
  },
  watch: {
    value () {
      this.visible = this.value
    }
  }
}
</script>
<style scoped lang="scss">
.el-table {
  .highlight {
  background-color: #E6E6E6;
  color: #ACACAC;
  }
}
.el-dialog--small{
  min-height: 500px;
}
.switch{
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.right{
  display: flex;
  justify-content: flex-end;
}
</style>
