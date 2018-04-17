<template>
  <section class="emp-preemployer content-follow mtb0">
    <div class="mb20"  >
      <i-table :table="table" ref="table" @save="saveData" @clone="getTableClone" v-if="showMap.preTable">
        <template slot="table" slot-scope="tableScope">
          <el-table :data="tableScope.clone"
            style="width: 100%"
            @selection-change="selectionChangeHandler(tableScope, $event)"
            @row-click="rowClickHandler(tableScope, $event)">
            <el-table-column type="selection" width="55" v-if="!disabledMap.preTable"></el-table-column>
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
                />
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
      tableEmployerData: Array,
      base: {type: Object, default: () => { return {} }}
    },
    data () {
      return {
        postList: {},
        table: {
          title: '先前雇主信息', // 标题
          columns: [
            { prop: 'beginDate', label: '起始日期', display: { date: 'default' }, align: 'center' },
            { prop: 'endDate', label: '结束日期', display: { date: 'default' }, align: 'center' },
            { prop: 'company', label: '工作单位名称', align: 'center' },
            { prop: 'positionName', label: '职位', align: 'center' },
            { prop: 'witness', label: '证明人', align: 'center' },
            { prop: 'witnessContact', label: '联系方式', align: 'center' }
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
              beginDate: {
                type: 'date',
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入起始时间'))
                    new Date(value).getTime() < new Date(this.base.birthDate || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    return time.getTime() >= new Date(this.row.endDate).getTime()
                  }
                }
              },
              endDate: {
                type: 'date',
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入结束时间'))
                    new Date(value).getTime() < new Date(this.base.birthDate || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    return time.getTime() <= new Date(this.row.beginDate).getTime()
                  }
                }
              },
              company: {
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入工作单位名称'))
                    value.length > 30 && cb(new Error('工作单位名称长度不能超过30个字符'))
  
                    let wordTest = /^[^\s]+$/
                    !wordTest.test(value) ? cb(new Error('首尾不能含空格')) : cb()
                  }
                }]
              },
              positionName: {
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入职位'))
                    value.length > 30 && cb(new Error('职位长度不能超过30个字符'))
  
                    let wordTest = /^[^\s]+$/
                    !wordTest.test(value) ? cb(new Error('首尾不能含空格')) : cb()
                  }
                }]
                // rules: ['prePositionName', { required: true, message: '请输入职位名称' }]
              },
              witness: {
                // rules: [{ required: true, message: '请输入证明人' }]
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入证明人'))
                    value.length > 30 && cb(new Error('证明人长度不能超过30个字符'))
  
                    let wordTest = /^[^\s]+$/
                    !wordTest.test(value) ? cb(new Error('首尾不能含空格')) : cb()
                  }
                }]
              },
              witnessContact: {
                rules: [{
                  validator: (rule, value, cb) => {
                    let phoneTest = /^1[34578]\d{9}$/

                    !value && cb(new Error('电话号码不能为空'))

                    setTimeout(function () {
                      !phoneTest.test(value) ? cb(new Error('请输入正确的电话号码格式')) : cb()
                    }, 0)
                  }
                }]
              }
            }
          },
          editable: () => !this.disabledMap.preTable,
          data: null // 占位符，用于挂载数据
        }
      }
    },
    watch: {
      tableEmployerData: function (newVal, oldVal) {
        this.table.data = newVal
        this.getTableClone(newVal)
      }
    },
    created () {
      this.table.data = this.tableEmployerData
      this.table.disable = this.disabledMap.preTable
      this.disabledMap.preTable && (this.table.setting.toolbar = [])
    },
    mounted () {
      this.disabledMap.preTable && (this.table.setting.toolbar = [])
    },
    methods: {
      // 保存数据
      saveData (data) {
        const shouldPost = !!Object.keys(data).find(
          method => data[method].length !== 0
        )
        this.postList = shouldPost ? data : {}
        // shouldPost && this.$emit('sendPreemployerData', this.postList, 'empWorkExperienceList')
      },
         // 获取表格全部的最新的数据
      getTableClone (data) {
        this.$emit('sendPreemployerData', data || [], 'empWorkExperienceList')
      },
      // 表格选中改变
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },

      // 监听行点击事件，并返回被点击对象的 _id
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mtb0 {
    margin-top: 0;
    margin-bottom: 0;
  }
  .emp-preemployer {
    .info-title {
      display: flex;
      justify-content: space-between;
    }
    .add-preemployer-btn {
      border: 1px solid #D8D8D8;
      border-radius: 1px;
      width: 93px;
      height: 28px;
      color: #3DA5FE;
      background-color: #fff;
    }
  }
  .i-table header {
    margin-top: 10px;
  }
</style>

<style lang="scss">
.emp-preemployer {
  .i-table header > h3{
    font-size: 14px !important;
    font-weight: bold;
  }
  .i-table header {
    margin-top: 10px;
  }
}
</style>



