<template>
  <div class="user-acount">
    <!-- <section class="user-acount"> -->
    <i-layout>
    <!-- 用户查询 -->
    <div slot="header" v-if="accessMap.empSystemsBindingGet">
      <i-form  @reset="listParams.employeeName=''" @search="search" @submit.native.prevent>
        <el-form-item label="员工名称">
          <el-input v-model="listParams.employeeName" maxlength="100"></el-input>
        </el-form-item>
      </i-form>
    </div>
    <!-- 用户表格 -->
      <div slot="section">
        <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="tableScope.clone"
              border tooltip-effect="dark"
              style="width: 100%"
              stripe
              v-loading="loading"
              :element-loading-text="$loadingText">
                <el-table-column v-for="(item, idx) in table.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :formatter="tableScope.formatter"
                  align="center"
                />
                <!-- <el-table-column
                  fixed="right"
                  label="操作"
                  width="auto"
                  min-width="150">
                 <template slot-scope="scope"> -->
                   <i-table-operator :table="tableScope" />
                 <!-- </template>
                </el-table-column> -->
              </el-table>
            </template>
        </i-table>
      </div>
    </i-layout>

    <!-- 绑定用户模态框 -->
  <el-dialog title="绑定用户" :visible.sync="userDialogVisible">
    <i-form  @reset="acountList.loginId=''" @search="acountSearch" @submit.native.prevent>
      <el-form-item label="登录ID">
        <el-input v-model="acountList.loginId" maxlength="100"></el-input>
      </el-form-item>
    </i-form>
    <!-- 用户表格 -->
    <i-layout>
      <div slot="section">
        <i-table :table="acount" @pageSizeChange="handleSizeChange1" @pageIndexChange="handleCurrentChange1">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="tableScope.clone"
              border
              tooltip-effect="dark"
              style="width: 100%"
              stripe
              @selection-change="handleSelectionChange"
              v-loading="dialogLoading"
              :element-loading-text="$loadingText">
                <el-table-column type="selection" width="55" />
                <el-table-column v-for="(item, idx) in acount.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :formatter="tableScope.formatter"
                />
              </el-table>
            </template>
        </i-table>
      </div>
    </i-layout>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAcount()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- </section> -->
  </div>
</template>

<script>
import req from 'api/system/user-acount'
import ISelect from 'components/common/i-select/i-select'
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form'
import ILayout from 'components/common/i-layout'
import access from 'mixins/access'
export default {
  components: {
    ISelect,
    ITable,
    IForm,
    ILayout
  },
  mixins: [access],
  data () {
    return {
      loading: false,
      dialogLoading: false,
      listParams: {
        employeeName: ''
      },
      // 表格
      table: {
        columns: [
          { prop: 'employeeName', label: '员工名称', width: 120 },
          { prop: 'positionName', label: '职位', width: 170 },
          { prop: 'tel', label: '电话', width: 150 },
          { prop: 'longinId', label: '登录ID', width: 150 },
          { prop: 'userName', label: '用户名', width: 150 }
        ],
        setting: {
          operator: [{
            text: '绑定用户',
            key: 'empSystemsBindingPost',
            func: this.handleClick
          }, {
            text: '取消绑定',
            key: 'empSystemsDisBindingDelete',
            func: this.canleHandleClick
          }]
        },
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
    //   模态框的表格
      acount: {
        columns: [
          // TODO:字段未修改
          { prop: 'loginId', label: '登录ID', width: 100 },
          { prop: 'userName', label: '用户名', width: 100 },
          { prop: 'email', label: '邮箱', width: 150 },
          { prop: 'phone', label: '电话号码', width: 120 },
          { prop: 'isEnabled', label: '状态' }
        ],
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
      acountList: {
        loginId: ''
      },
    //   绑定模态框
      userDialogVisible: false,
      multipleSelection: [],
      empEmployeeId: ''
    }
  },

  methods: {
           // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (options) {
      this.loading = true
      this.getStaffList(options)
    },
    handleCurrentChange (options) {
      this.loading = true
      this.getStaffList(options)
    },
    handleSizeChange1 (options) {
      this.dialogLoading = true
      this.getUserList(options)
    },
    handleCurrentChange1 (options) {
      this.dialogLoading = true
      this.getUserList(options)
    },
    // ---------------------------------人员列表----------------------------------------
    // 获取员工列表
    getStaffList (options = {}) {
      req('getStaffList', options)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.table[key] = res[key])
        )
        this.loading = false
      })
      .catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    // 查询
    search () {
      this.table.search = { ...this.listParams }
    },
    acountSearch () {
      this.acount.search = { ...this.acountList }
    },
//  ----------------------------------操作的方法----------------------------------------
    // 选中某一项的时候
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 绑定按钮
   // 获取用户  列表
    getUserList (acountList) {
      req('getUserListNew', acountList)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.acount[key] = res[key])
        )
        // console.log(this.acount)
        this.dialogLoading = false
      })
      .catch(err => {
        console.log(err)
        this.dialogLoading = false
      })
    },
    handleClick (row, acountList) {
      // 请求全部的用户
      this.empEmployeeId = row.empEmployeeId
      this.dialogLoading = true
      this.getUserList(acountList)
      this.userDialogVisible = true
    },
    // 提交绑定对应的用户方法
    submitAcount () {
      if (this.multipleSelection.length < 1) {
        this.$message('请选择需要绑定的用户')
      } else if (this.multipleSelection.length > 1) {
        this.$message('绑定的用户只能选择一个')
      } else {
        // 发送请求绑定
        req('acountUser', {'empEmployeeId': this.empEmployeeId, 'userId': this.multipleSelection[0].userId})
          .then(res => {
            if (res) {
              this.$message({
                message: '绑定成功',
                type: 'success'
              })
              // this.search()
              this.loading = true
              this.getStaffList({...this.listParams})
            }
          })
          .catch(err => console.log(err))
        this.userDialogVisible = false
      }
    },
    // 取消绑定的操作
    canleHandleClick (row) {
         //  获取数据，发送请求删除
      this.$confirm('确认取消绑定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //   发送取消请求
        req('unbindUser', {employeeId: row.empEmployeeId})
          .then(res => {
            if (res) {
              this.$message({
                message: '解绑成功',
                type: 'success'
              })
              // this.search()
              this.loading = true
              this.getStaffList({...this.listParams})
            } else {
              this.$message.error('解绑失败')
            }
          })
          .catch(err => console.log(err))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  },
  mounted () {
    this.search()
  },
  created () {
    // this.getStaffList({
    //   ...this.listParams
    // })
  }
}
</script>

<style lang="scss">
.user-acount{
  .table-card .table {
    padding: 0;
  }
  .el-table td {
    text-align: center;
  }
}
</style>
