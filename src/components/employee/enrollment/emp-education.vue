<template>
  <section class="emp-education content-follow mtb0">
    <div class="mb20">
      <i-table :table="table" ref="table" @save="saveData" @clone="getTableClone" @loaded="handleLoaded" v-if="showMap.eduTable">
        <template slot="table" slot-scope="tableScope">
          <el-table :data="tableScope.clone"
            style="width: 100%"
            @selection-change="selectionChangeHandler(tableScope, $event)"
            @row-click="rowClickHandler(tableScope, $event)"
            >
            <el-table-column type="selection" width="55" v-if="!disabledMap.eduTable"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns || []"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :formatter="tableScope.formatter"
              :width="col.width"
              :align="col.align"
              >
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                  @change="changeData"
                  ref="cell">
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
  let vm
export default {
    components: {
      ITable,
      ITableCell
    },
    props: {
      tableEducationData: Array,
      base: {type: Object, default: () => { return {} }}
    },
    data () {
      return {
        postList: {},
        iTableVm: null,
        table: {
          title: '教育信息情况(至少填写一条信息)', // 标题
          columns: [
            { prop: 'admissionDate', label: '入学时间', display: { date: 'default' }, width: 160, align: 'center' },
            { prop: 'graduationDate', label: '毕业时间', display: { date: 'default' }, width: 160, align: 'center' },
            { prop: 'institution', label: '学校名称', align: 'center' },
            { prop: 'educationType', label: '学历', display: { dict: 'EDUCATION_TYPE' }, align: 'center' },
            { prop: 'major', label: '专业', align: 'center' },
            { prop: 'degree', label: '学位', display: { dict: 'DEGREE' }, align: 'center' },
            { prop: 'learnType', label: ' 教育类型', display: { dict: 'LEARN_TYPE' }, align: 'center' },
            { prop: 'certificateNumber', label: ' 证书编号', align: 'center' },
            { prop: 'isTopGrade', label: ' 是否最高学历', display: { dict: 'WHETHER_TYPE' }, align: 'center' }
          ],
          setting: {
            toolbar: [{
              text: '添加',
              func: vm => vm.createData()
            }, {
              text: '删除',
              type: 'danger',
              func: vm => {
                this.iTableVm.clone.length > 1 && this.selection.length < this.iTableVm.clone.length ? vm.deleteData() : this.$message({ type: 'warning', message: '请至少填写一条教育信息' })
              }
            }],
            editor: {
              admissionDate: {
                type: 'date',
                rules: [{ required: true,
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入入学时间'))
                    // new Date(value).getTime() < new Date(this.base.birthDate || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    if (this.row.graduationDate) {
                      return new Date(time).getTime() >= new Date(this.row.graduationDate).getTime() || new Date(time).getTime() < new Date(vm.base.birthDate || 0).getTime()
                    } else {
                      return time >= new Date() || new Date(time).getTime() < new Date(vm.base.birthDate || 0).getTime()
                    }
                  }
                }
              },
              graduationDate: {
                type: 'date',
                rules: [{ required: true,
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入毕业时间'))
                    // new Date(value).getTime() < new Date(this.base.birthDate || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    return new Date(time).getTime() <= new Date(this.row.admissionDate).getTime() || new Date(time).getTime() < new Date(vm.base.birthDate || 0).getTime()
                  }
                }
              },
              institution: {
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入学校名称'))
                    value.length > 30 && cb(new Error('学校名称长度不能超过30个字符'))
  
                    let wordTest = /^[^\s]+$/
                    !wordTest.test(value) ? cb(new Error('首尾不能含空格')) : cb()
                  }
                }]
              },
              major: {
                rules: [{
                  validator: (rule, value, cb) => {
                    !!value && value.length > 30 ? cb(new Error('专业长度不能超过30个字符')) : cb()
                  }
                }]
              },
              certificateNumber: {
                rules: [{
                  validator: (rule, value, cb) => {
                    !!value && value.length > 30 ? cb(new Error('证书编号长度不能超过30个字符')) : cb()
                  }
                }]
              },
              educationType: {
                type: 'select',
                rules: [{ required: true, message: '请输入教育类型' }]
              },
              degree: {
                type: 'select',
                rules: [{ required: true, message: '请输入学位' }]
              },
              learnType: {
                type: 'select',
                rules: [{ required: true, message: '请输入学习方式' }]
              },
              // certificateNumber: {},
              isTopGrade: {
                type: 'select',
                rules: [{ required: true,
                  validator: (rule, value, cb) => {
                    let count = 0

                    !value && cb(new Error('请选择是否为最高学历'))

                    this.iTableVm.clone && this.iTableVm.clone.map(key => {
                      key.isTopGrade === 'Y' && count++
                    })
                    count === 0 && cb(new Error('请至少填写一条信息为最高学历'))
                    count > 1 && cb(new Error('只能选择一条信息为最高学历'))
                    cb()
                  }
                }]
              }
            }
          },
          editable: true,
          data: null // 占位符，用于挂载数据
        }
      }
    },
    watch: {
      tableEducationData: function (newVal, oldVal) {
        this.table.data = newVal
        this.getTableClone(newVal)
      }
    },
    created () {
      vm = this
      this.table.data = this.tableEducationData
      this.table.disable = this.disabledMap.eduTable
      this.disabledMap.eduTable && (this.table.setting.toolbar = [])
    },
    methods: {
      //  保存数据信息
      saveData (data) {
        const shouldPost = !!Object.keys(data).find(
          method => data[method].length !== 0
        )
        this.postList = shouldPost ? data : {}
        // shouldPost && this.$emit('sendEducationData', this.postList, 'empEducationList')
      },
      changeData (val) {
        this.$refs.cell.map(el => el.validate())
      },
      // 获取itable实例
      handleLoaded (vm) {
        this.iTableVm = vm
        !this.iTableVm.clone.length && vm.createData()
      },
       // 获取表格全部的最新的数据
      getTableClone (data) {
        this.$emit('sendEducationData', data || [], 'empEducationList')
      },
      // 选中改变
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        this.selection = selection
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
  .emp-education {
    .add-education-btn {
      border: 1px solid #d8d8d8;
      border-radius: 1px;
      width: 93px;
      height: 28px;
      color: #3da5fe;
      background-color: #fff;
    }
  }

</style>
<style lang="scss">
.emp-education {
  .i-table header > h3{
    font-size: 14px !important;
    font-weight: bold;
  }
    .i-table header {
    margin-top: 10px;
    > h3 {
          &::before {
          content: '*';
          font-size:14px;
          color: #ff4949;
          display: inline;
      }
    }
  }
}
</style>



