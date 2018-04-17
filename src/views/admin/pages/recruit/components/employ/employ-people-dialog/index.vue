<template>
  <div>
    <i-dialog
      title="选择录用者信息"
      size="large"
      v-model="visible"
      :toolbar="toolbar"
      :close-on-click-modal="false"
      :before-close="onCancelHandler"
      :destroyedWhenClose="true">
      <div class="content">
        <div class="table">
          <i-table
            :table="table"
            @pageSizeChange="handleSizeChange"
            @pageIndexChange="handleCurrentChange">
            <template slot="table" slot-scope="tableScope">
              <el-table
                ref="elTable"
                :data="table.data"
                v-loading="tableLoading"
                :element-loading-text="$loadingText"
                @selection-change="handleSelectionChange">
                <el-table-column
                  label="选择"
                  width="80"
                  align="center">
                  <template slot-scope="scope">
                    <el-radio
                      class="radio position-map-radio"
                      :label="scope.row"
                      v-model="selectRadio"
                      @change.native="choose(scope.row)"
                      ></el-radio>
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
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-dialog>
  </div>
</template>
<script>
import req from 'api/recruit/matriclated'
export default {
  name: 'EmployPeopleDialog',
  props: {
    // 是否显示
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 是否显示
      visible: false,
      // 选择项
      selectRadio: null,
      // 选择数据
      selectItem: {
        name: '',
        applyOrgId: '',
        applyOrgName: '',
        applyPositionId: '',
        applyPosition: '',
        entryDate: '',
        empType: ''
      },
      // 底部两个按钮
      toolbar: [
        {
          text: '取消',
          type: 'defalut',
          func: (done) => {
            this.onCancelHandler()
            done()
          }
        }, {
          text: '确定',
          type: 'primary',
          func: (done) => {
            this.onConfirmHandler()
            done()
          }
        }
      ],
      // table
      table: {
        data: [],
        columns: [
           { prop: 'name', label: '姓名', align: 'center' },
           { prop: 'applyOrgName', label: '部门', align: 'center' },
           { prop: 'applyPosition', label: '职位', align: 'center' },
           { prop: 'entryDate', label: '拟入职日期', align: 'center', display: { date: '' }, sortable: true },
           { prop: 'empType', label: '用工类型', align: 'center', display: { dict: 'EMPLOYEE_TYPE' }, sortable: true }
        ],
        setting: {
          toolbar: []
        },
        info: {
          pageIndex: 1,
          pageSize: 10
        },
        search: null,
        total: 0, //  后台获取到的total个数
        showPagebar: true
      }
    }
  },
  watch: {
    show (val) {
      this.visible = val
      if (this.visible) {
        this.reset()
        this.getTemplateList(this.table.info)
        // this.table.search = {}
      }
    }
  },
  methods: {
    // 取消
    onCancelHandler () {
      this.$emit('cancel')
    },
    // 确定
    onConfirmHandler () {
      // console.log(this.selectItem)
      this.$emit('confirm', this.selectItem)
    },
    // 重置
    reset () {
      this.selectItem = {
        name: '',
        applyOrgId: '',
        applyOrgName: '',
        applyPositionId: '',
        applyPosition: '',
        entryDate: '',
        empType: ''
      }
    },
    // 获取列表数据
    getTemplateList (opt) {
      this.tableLoading = true
      req('waitHireEmp', {
        ...opt
      }).then((res) => {
        this.table = Object.assign(this.table, res)
        this.tableLoading = false
      }).catch((err) => {
        console.log(err)
        this.tableLoading = false
      })
    },
    // 页数改变
    handleSizeChange (opt) {
      this.getTemplateList(opt)
    },
    // 页码改变
    handleCurrentChange (opt) {
      this.getTemplateList(opt)
    },
    // 选择录用人
    choose (row) {
      this.selectItem = Object.assign({}, this.selectItem, row)
    }
  }
}
</script>
