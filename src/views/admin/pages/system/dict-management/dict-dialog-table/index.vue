<template>
    <div class="mb20" >
      <i-table :table="table" ref="table" @loaded="handleLoaded">
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            style="width: 100%"
            @selection-change="selectionChangeHandler(tableScope, $event)"
            @row-click="rowClickHandler(tableScope, $event)"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns || []"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :formatter="tableScope.formatter"
            >
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                  ref="cell"
                  align='center'
                  @change="changeData"
                ></i-table-cell>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </div>
</template>
<script>
  export default {
    name: 'DictDialogTable',
    props: {
      form: Object
    },
    data () {
      return {
        iTableVm: null,
        selection: 0,
        table: {
          columns: [
            { prop: 'orderNo', label: '顺序号', align: 'center' },
            { prop: 'dictItemName', label: '字典名称' },
            { prop: 'dictItemValue', label: '字段值' },
            { prop: 'remark', label: '描述' }
          ], // 表头
          setting: {
            toolbar: [{
              text: '添加',
              func: vm => vm.createData()
            }, {
              text: '删除',
              type: 'danger',
              func: vm => {
                this.iTableVm.clone.length > 1 && this.selection.length < this.iTableVm.clone.length ? vm.deleteData() : this.$message({ type: 'error', message: '请至少输入一条字典值' })
                this.$emit('dialogTable', this.dictItemList)
              }
            }],
            editor: {
              dictItemName: {
                rules: [{
                  validator: (rule, value, callback) => {
                    if (!value) {
                      return callback(new Error('请输入字典名称'))
                    }
                    callback()
                  }
                }]
              },
              dictItemValue: {
                rules: [{
                  validator: (rule, value, callback) => {
                    if (!value) {
                      return callback(new Error('请输入字段值'))
                    }
                    callback()
                  }
                }]
              },
              orderNo: {
                rules: [{
                  validator: (rule, value, callback) => {
                    if (!value && !/^0$/.test(value)) {
                      return callback(new Error('请输入顺序号'))
                    }
                    if (/^[1-9]\d*$/.test(value)) {
                      callback()
                    } else {
                      callback(new Error('请输入大于0的数字'))
                    }
                  }
                }]
              }
            //   orderNo: {
            //     rules: [{ required: true,
            //       validator: (rule, value, cb) => {
            //         let myReg = /^\d+$/
            //         for (let i = 0; i < value.length; i++) {
            //           !value[i].orderNo && cb(new Error('顺序号不能为空'))
            //         }
            //         value.map((item, i) => {
            //           !myReg.test(Number(value[i].orderNo)) ? cb(this.$message('检测到有顺序号不为整数')) : cb()
            //         })
            //       }
            //     }]
            //   }
            }
          },
          editable: true,
          data: null
        }
      }
    },

    watch: {
      'form.dictItemList' (val) {
        this.table.data = val
      }
    },

    mounted () {
      this.$refs.table.createData()
    },

    methods: {
      // 数据改变
      changeData (val) {
        // this.$refs.cell.map(el => el.validate())
        this.$emit('dialogTable', this.dictItemList)
      },
      // 获取itable实例
      handleLoaded (vm) {
        this.iTableVm = vm

        this.dictItemList = this.iTableVm.clone
        !this.iTableVm.clone.length && vm.createData()
        // this.count++
      },
      // 选中改变
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        this.selection = selection
        selectionChangeHandler(selection)
      },
      /** 监听行点击事件，并返回被点击对象的 _id */
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      }
    }
  }
</script>
