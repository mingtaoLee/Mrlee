<!-- 这是一个业务场景 -->

<template>
  <div>
    <i-table :table="table">
      <template slot="table" slot-scope="tableScope">
        <el-table :data="tableScope.clone">
          <el-table-column type="selection"/>
          <el-table-column
            v-for="(col, idx) of tableScope.columns"
            :key="idx"
            :prop="col.prop"
            :label="col.label">
            <template slot-scope="scope">
              <i-table-cell
                :row="scope.row"
                :col="col.prop"
                :table="tableScope"
                :formatter="tableScope.formatter"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </i-table>

    <i-dialog
      v-model="formVisible"
      :toolbar="formToolbar"
      :title="curRow.name"
      class="dialog">
      <el-form
        :model="formParam"
        :inline="true">
        <el-form-item>
          <el-input
            v-model.trim="formParam.name"
            placeholder="姓名"/>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="formParam.birth"
            placeholder="生日">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <i-select
            v-model="formParam.degree"
            parameter="DEGREE"
            placeholder="学位"/>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="formParam.comment"
            placeholder="标注"/>
        </el-form-item>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
// import data from '../mock-data'
import IDialog from 'components/common/i-dialog/i-dialog'
import ISelect from 'components/common/i-select/i-select'

export default {
  data () {
    return {
      table: {
        title: '6-12 挂载数据（业务场景）',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'birth', label: '生日', display: { date: 'default' } },
          { prop: 'degree', label: '学位', display: { dict: 'DEGREE' } },
          { prop: 'comment', label: '标注' }
        ],
        setting: {
          editor: {
            name: {
              type: 'button',
              func: row => {
                this.curRow = row // 记录当前点击的行对象
                this.formParam = Object.assign(this.formParam, row) // 填充表单
                this.formVisible = true // 展示对话框
              }
            },
            birth: {
              type: 'date',
              disable: true
            },
            degree: {
              type: 'select',
              disable: true
            }
          },
          toolbar: [{
            text: '增',
            func: vm => vm.createData({ name: 'test' })
          }, {
            text: '删',
            type: 'danger',
            func: vm => vm.deleteData()
          }]
        },
        editable: true,
        data: null
      },

      curRow: {},
      formParam: {
        name: '',
        birth: '',
        degree: '',
        comment: ''
      },
      formVisible: false,
      formToolbar: [{
        text: '取消',
        type: 'default',
        func: done => done()
      }, {
        text: '确定',
        func: done => {
          this.formParam.name || (this.formParam.name = this.curRow.name) // 防止 name 为空
          this.curRow = Object.assign(this.curRow, this.formParam) // 将表单数据载入行对象

          done()
        }
      }]
    }
  },

  components: [
    IDialog,
    ISelect
  ]
}
</script>

<style lang="scss">
.dialog {
  .el-form {
    display: flex;
    justify-content: space-between;
    font-size: 0;
    .el-form-item {
      width: 24%;
    }
    .el-form-item__content {
      width: 100%;
    }
    .el-form-item {
      margin: 0;
    }
  }
}
</style>
