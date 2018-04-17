<template>
  <section class="emp-credential content-follow">
    <div class="mb20">
      <i-table :table="table" ref="table" @save="saveData" @clone="getTableClone" v-if="showMap.creTable">
        <template slot="table" slot-scope="tableScope">
          <el-table :data="tableScope.clone"
            style="width: 100%"
            @selection-change="selectionChangeHandler(tableScope, $event)"
            @row-click="rowClickHandler(tableScope, $event)">
            <el-table-column
              type="selection"
              width="55"
              v-if="!disabledMap.creTable">
            </el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns || []"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :formatter="tableScope.formatter"
              :align="col.align">
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                  ref="cell"
                  @change="changeData">
                </i-table-cell>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </div>
  </section>
</template>
<script>
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  export default {
    components: {
      ITable,
      ITableCell
    },
    props: {
      // tableCredentialData: Array,
      hireInfo: Object
    },
    data () {
      return {
        tableCredentialData: this.hireInfo.allEmpCredentialList,
        postList: {},
        table: {
          title: '证书信息', // 标题
          columns: [
          { prop: 'credentialType', label: '资格证书名称', display: { dict: 'JOB_CERTIFICATE' }, align: 'center' },
            // { prop: 'credentialUnit', label: '发证单位' },
            { prop: 'beginDate', label: '取得资格证书时间', display: { date: 'default' }, align: 'center' },
            { prop: 'endDate', label: '资格证书到期时间', display: { date: 'default' }, align: 'center' }
          ], // 表头
          setting: {
            toolbar: [{
              text: '添加',
              func: vm => vm.createData()
            }, {
              text: '删除',
              type: 'danger',
              func: vm => vm.deleteData()
            }],
            editor: {
              credentialType: {
                type: 'select',
                rules: [{ required: true, message: '请选择证书' }]
              },
              beginDate: {
                type: 'date',
                rules: [{ required: true,
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('取得资格证书时间'))
                    new Date(value).getTime() < new Date(this.hireInfo.empEmployeeEmpContacts.birthDate || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    if (this.row.credentialType === '3' && this.row.endDate) {
                      let end = new Date(this.row.endDate)
                      return time.getTime() >= end.getTime() || time.getTime() <= new Date(end.setFullYear(end.getFullYear() - 1)).getTime() + 8.64e7
                    }
                    return time.getTime() >= new Date(this.row.endDate).getTime()
                  }
                }
              },
              endDate: {
                type: 'date',
                rules: [{ required: true,
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('资格证书到期时间'))
                    new Date(value).getTime() <= new Date(this.hireInfo.empEmployeeEmpContacts.birthDate || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    if (this.row.credentialType === '3' && this.row.beginDate) {
                      let begin = new Date(this.row.beginDate)
                      // return time.getTime() <= begin.getTime() || time.getTime() > new Date(begin.setFullYear(begin.getFullYear() + 1)).getTime() - 8.64e7
                      return time.getTime() <= begin.getTime()
                    }
                    return time.getTime() <= new Date(this.row.beginDate).getTime()
                  }
                }
              }
            }
          },
          editable: true,
          data: null // 占位符，用于挂载数据
        }
      }
    },
    watch: {
      tableCredentialData: function (newVal, oldVal) {
        this.table.data = newVal
        this.getTableClone(newVal)
      }
    },
    created () {
      this.table.data = this.tableCredentialData
      this.table.disable = this.disabledMap.creTable
      this.disabledMap.creTable && (this.table.setting.toolbar = [])
      // console.log('sssssssssssss', this.showMap)
    },
    methods: {
       // 根据证件类型设置时间限制
      changeData (val) {
        // if (val.col === 'credentialType' && val.val === '3') {
        //   let begin = new Date(val.row.beginDate || 0)
        //   let end = new Date(val.row.endDate || 0)

        //   begin.setFullYear(begin.getFullYear() + 1) < end && (val.row.endDate = '')
        // }
      },

      // 获取表单的数据
      saveData (data) {
        const shouldPost = !!Object.keys(data).find(
          method => data[method].length !== 0
        )
        this.postList = shouldPost ? data : {}
        // console.log(this.postList)
        // shouldPost && this.$emit('sendCredentialData', this.postList, 'empCredentialList')
      },

      // 获取表格全部的最新的数据
      getTableClone (data) {
        this.$emit('sendCredentialData', data || [], 'EmpCredentialList')
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },

       // 监听行点击事件，并返回被点击对象的 _id
      rowClickHandler ({ rowClickHandler }, row) {
        // console.log(rowClickHandler)
        // 调用内部的方法
        rowClickHandler(row)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .emp-credential {
    .info-title {
      display: flex;
      justify-content: space-between;
    }
    .add-family-btn {
      border: 1px solid #D8D8D8;
      border-radius: 1px;
      width: 93px;
      height: 28px;
      color: #3DA5FE;
      background-color: #fff;
    }
  }
  .content-follow {
    margin-top: 0;
  }
</style>
<style lang="scss">
.emp-credential {
  .i-table header > h3{
    font-size: 14px !important;
    font-weight: bold;
  }
}
</style>



