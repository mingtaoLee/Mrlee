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
            <el-table-column type="selection" width="55" v-if="!read"></el-table-column>
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
                >
                <div>
                   <remote-select
                     v-if="col.prop === 'categoryId'"
                     :disabled="read"
                     v-model="scope.row.categoryId"
                     dataKey="category"
                     :props="categoryProps"
                     :extraParams="params"
                     @option-click="changeCategoryGrop($event,scope.row)"
                   ></remote-select>
                  </div>
                <div>
                   <el-date-picker
                   :disabled="read"
                     v-if="col.prop === 'startDate'"                   
                     v-model="scope.row.startDate"
                      type="date"
                     :editable="false"
                     value-format="yyyy-MM-dd"
                     >
                   </el-date-picker>
                </div>
                <div>
                  <el-date-picker
                  :disabled="read"
                     v-if="col.prop === 'endDate'"                   
                     v-model="scope.row.endDate"
                      type="date"
                     :editable="false"
                     value-format="yyyy-MM-dd"
                     >
                   </el-date-picker>
                  </div>
                </i-table-cell>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </div>
</template>
<script>
  import RemoteSelect from 'components/compensation/remote-select'

  export default {
    name: 'DictDialogTable',
    props: {
      form: Object,
      read: Boolean
    },
    components: {
      RemoteSelect
    },
    data () {
      return {
        iTableVm: null,
        selection: 0,
        table: {
          columns: [
            { prop: 'categoryId', label: '品类', align: 'center' },
            { prop: 'startDate', label: '开始时间' },
            { prop: 'endDate', label: '结束时间' }
          ], // 表头
          setting: {
            toolbar: [{
              text: '添加',
              func: vm => vm.createData(),
              show: () => {
                return { empty: this.read }
              }
            }, {
              text: '删除',
              type: 'danger',
              func: vm => {
                this.iTableVm.clone.length > 1 && this.selection.length < this.iTableVm.clone.length ? vm.deleteData() : this.$message({ type: 'error', message: '请至少输入一条品类' })
              },
              show: () => {
                return { empty: this.read }
              }
            }],
            editor: {
              categoryId: {
                rules: [{
                  validator: (rule, value, callback) => {
                    if (!value) {
                      return callback(new Error('请选择品类'))
                    }
                    callback()
                  }
                }]
              },
              startDate: {
                type: 'date',
                rules: [{
                  validator: (rule, value, callback) => {
                    !value && callback(new Error('选择开始时间'))
                    callback()
                  },
                  options: {
                    disabledDate (time) {
                      console.log(this.row)
                      return new Date(time).getTime() <= new Date(this.row.endDate).getTime()
                    }
                  }
                }]
              },
              endDate: {
                type: 'date',
                rules: [{
                  validator: (rule, value, callback) => {
                    !value && callback(new Error('请选择结束时间'))
                    callback()
                  },
                  options: {
                    disabledDate (time) {
                      return new Date(time).getTime() <= new Date(this.row.startDate).getTime()
                    }
                  }
                }]
              }
            }
          },
          editable: true,
          data: null
        },
        categoryProps: {value: 'posCategoryId', label: 'posCategoryName'}
      }
    },

    watch: {
      'form.createDtoList': {
        handler (newVal, oldVal) {
          console.log('new', newVal)
          this.table.data = newVal
        },
        deep: true
      }
    },
    mounted () {
      this.$refs.table.createData()
    },

    methods: {
      // 获取itable实例
      handleLoaded (vm) {
        this.iTableVm = vm
        !this.iTableVm.clone.length && vm.createData()
      },
      // 选中改变
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        this.selection = selection
        selectionChangeHandler(selection)
      },
      /** 监听行点击事件，并返回被点击对象的 _id */
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      changeCategoryGrop (data, row) {
        console.log(data, row)
        this.$set(row, 'categoryName', data.posCategoryName)
      }
    }
  }
</script>
