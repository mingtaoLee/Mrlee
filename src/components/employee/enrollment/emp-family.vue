<template>
  <section class="emp-family content-follow mt0" required>
    <!-- <el-button type="primary" @click="test">333</el-button> -->
    <div class="mb20" >
      <i-table :table="table" ref="table" @save="saveData" @clone="getTableClone" @loaded="handleLoaded" v-if="showMap.famTable">
        <template slot="table" slot-scope="tableScope">
          <el-table :data="tableScope.clone"
            style="width: 100%"
            @selection-change="selectionChangeHandler(tableScope, $event)"
            @row-click="rowClickHandler(tableScope, $event)">
            <el-table-column type="selection" width="55" v-if="!disabledMap.famTable"></el-table-column>
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
                  @change="changeData"
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
      hireInfo: Object
      // tableFamilyData: Array,
      // phone: '',
      // empEmployeeEmpContacts: { type: Object, default: () => { return {} } }
    },
    data () {
      return {
        postList: {},
        iTableVm: null,
        selection: 0,
        empEmployeeEmpContacts: this.hireInfo.empEmployeeEmpContacts,
        table: {
          title: '家庭成员及紧急联系人信息(至少填写一条信息且为紧急联系人)', // 标题
          columns: [
            { prop: 'name', label: '姓名', align: 'center' },
            { prop: 'relationship', label: '与本人关系', display: {dict: 'FAMILY_RELATIONSHIP'}, align: 'center' },
            { prop: 'familyCompany', label: '工作单位', align: 'center' },
            { prop: 'primaryPhone', label: '联系电话', align: 'center' },
            { prop: 'isEmergency', label: '是否紧急联系人', display: { dict: 'WHETHER_TYPE' }, align: 'center' }
          ], // 表头
          setting: {
            toolbar: [{
              text: '添加',
              func: vm => vm.createData()
            }, {
              text: '删除',
              type: 'danger',
              func: vm => {
                this.iTableVm.clone.length > 1 && this.selection.length < this.iTableVm.clone.length ? vm.deleteData() : this.$message({ type: 'warning', message: '请至少填写一位联系人且为紧急联系人' })
              }
            }],
            editor: {
              name: {
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入姓名'))
                    value.length > 30 && cb(new Error('姓名长度不能超过30个字符'))
  
                    let wordTest = /^[^\s]+$/
                    !wordTest.test(value) ? cb(new Error('首尾不能含空格')) : cb()
                  }
                }]
              },
              familyCompany: {
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入工作单位'))
                    value.length > 30 && cb(new Error('工作单位长度不能超过30个字符'))
  
                    let wordTest = /^[^\s]+$/
                    !wordTest.test(value) ? cb(new Error('首尾不能含空格')) : cb()
                  }
                }]
              },
              primaryPhone: {
                rules: [{
                  validator: (rule, value, cb) => {
                    let phoneTest = /^1[34578]\d{9}$/
                    // 电话号码
                    let num = /^0\d{2,3}-?\d{7,8}$/

                    !value && cb(new Error('电话号码不能为空'))
                    value === this.empEmployeeEmpContacts.mobile && cb(new Error('电话号码不能和申请人号码一致'))
                    setTimeout(function () {
                      !(phoneTest.test(value) || num.test(value)) ? cb(new Error('请输入正确的电话号码格式')) : cb()
                    }, 0)
                  }
                }]
              },
              relationship: {
                type: 'select',
                rules: [{required: true, message: '请选择与本人关系'}]
              },
              isEmergency: {
                type: 'select',
                rules: [{ required: true,
                  validator: (rule, value, cb) => {
                    let count = 0

                    !value && cb(new Error('请选择是否为紧急联系人'))

                    this.iTableVm.clone && this.iTableVm.clone.map(key => {
                      key.isEmergency === 'Y' && count++
                    })

                    count === 0 && cb(new Error('请至少填写一条信息且为紧急联系人'))
                    count > 1 && cb(new Error('只能选择一名家庭成员为紧急联系人'))
                    cb()
                  }
                }]
              }
            }
          },
          editable: true,
          data: null
        }
      }
    },
    computed: {
      tableFamilyData () {
        return this.hireInfo.allEmpFamilyMemberList
      }
    },
    watch: {
      tableFamilyData: function (newVal, oldVal) {
        this.table.data = newVal
        this.getTableClone(newVal)
      }
    },
    created () {
      this.table.data = this.hireInfo.allEmpFamilyMemberList
      this.table.disable = this.disabledMap.famTable
      this.disabledMap.famTable && (this.table.setting.toolbar = [])
    },
    mounted () {
      this.$refs.table.createData()
    },
    methods: {
      // 日期选择器赋值
      changeData (val) {
        this.$refs.cell.map(el => el.validate())
      },

      // 获取itable实例
      handleLoaded (vm) {
        this.iTableVm = vm

        this.hireInfo.familyData = this.iTableVm.clone
        !this.iTableVm.clone.length && vm.createData()
        // this.count++
      },
      // 增删改集合
      saveData (data) {
        const shouldPost = !!Object.keys(data).find(
          method => data[method].length !== 0
        )
        this.postList = shouldPost ? data : {}
        // shouldPost && this.$emit('sendFamilyData', this.postList, 'empFamilyMemberList')
      },
      // 获取表格全部的最新的数据
      getTableClone (data) {
        this.$emit('sendFamilyData', data || [], 'empFamilyMemberList')
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
<style lang="scss" scoped>
  .mt0 {
    margin-top: 0;
  }
  .content-follow {
    margin-bottom: 0;
  }
  .emp-family {
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
</style>

<style lang="scss">
.emp-family {
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
