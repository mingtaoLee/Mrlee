<template>
  <div>
    <!-- <i-layout> -->
      <!-- <div slot="header"> -->
        <i-form @reset="reset" @search="search" @submit.native.prevent>
          <el-form-item label="用户名称">
            <el-input v-model="searchList.userName" placeholder="角色名称" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="登录账号">
            <el-input v-model="searchList.loginId" placeholder="角色名称" maxlength="100"></el-input>
          </el-form-item>
        </i-form>
      <!-- </div> -->
      <!-- <div slot="section"> -->
        <i-table :table="table" ref="iTable" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="tableData"
              ref="multipleTable"
              style="width: 100%"
              align="center"
              @select="handleSelect" 
              @select-all="handleSelectionAll"
              v-loading="loading"
              :element-loading-text="$loadingText">
              <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column v-for="(item, idx) in table.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :formatter="tableScope.formatter"
                  align="center"
                ></el-table-column>
              </el-table>
            </template>
        </i-table>
      <!-- </div> -->
    <!-- </i-layout> -->
  </div>
</template>

<script>
import req from 'api/system/role-management'
export default {
  name: 'DialogCreateUser',
  props: {
    roleId: String
  },
  data () {
    return {
      loading: true,
      searchList: {
        userName: '',
        loginId: ''
      },
      roleId: '',
      tableData: [],
      table: {
        columns: [
          { prop: 'userName', label: '用户名称' },
          { prop: 'loginId', label: '登录账号' },
        //   { prop: 'value', label: '工号' },
          { prop: 'phone', label: '电话' },
          { prop: 'email', label: '邮箱' }
        ],
        setting: {},
        data: null,
        showPagebar: true,
        search: null,
        info: null,
        total: 0
        // editRoleData: {}
      },
       // 记录选择的条数
      multipleSelection: [],
      selectionData: [],
      pageSelectionAll: []
    }
  },

  created () {
    this.getUnAuthorizedUser({roleId: this.roleId})
  },

  methods: {
    search () {
      this.table.search = {...this.searchList}
    },
    reset () {
      Object.keys(this.searchList).map(key => {
        this.searchList[key] = ''
      })
      this.table.search = { ...this.searchList }
    },
    getData () {
      this.getUnAuthorizedUser({roleId: this.roleId})
      this.selectionData = []
    },
    // 勾选
    isSelection () {
      this.pageSelectionAll = []
      this.$nextTick(() => {
        this.selectionData.forEach((val) => {
          this.tableData.forEach((val1) => {
            if (val.userId === val1.userId) {
              this.$refs.multipleTable.toggleRowSelection(val1)
              this.pageSelectionAll.push(val)
            }
          })
        })
      })
    },
    // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (options) {
      options.roleId = this.roleId
      this.table.info = options
      this.loading = true
      this.getUnAuthorizedUser(options)
    },
    handleCurrentChange (options) {
      options.roleId = this.roleId
      this.table.info = options
      this.loading = true
      this.getUnAuthorizedUser(options)
    },
    // 获取参数列表
    getUnAuthorizedUser (options) {
      req('getUnAuthorizedUser', options)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.table[key] = res[key])
        )
        this.loading = false
        this.tableData = res.data
        this.isSelection()
      })
      .catch(() => {
        this.loading = false
      })
    },
    // 选中某一项的时候
    handleSelect (selection, row) {
      selection.map((val) => {
        // 已经存在则不存入
        !(JSON.stringify(this.selectionData).indexOf(JSON.stringify(val)) !== -1) && this.selectionData.push(val)
      })
      // 取消选择
      if (!(JSON.stringify(selection).indexOf(JSON.stringify(row)) !== -1)) {
        this.deleteSelection(row)
      }
      this.$emit('unAuthorizedUser', this.selectionData)
    },
    // 选择全选
    handleSelectionAll (selection) {
      selection.map((val) => {
        // 已经存在则不存入
        !(JSON.stringify(this.selectionData).indexOf(JSON.stringify(val)) !== -1) && this.selectionData.push(val)
      })
      if (selection.length === 0) {
        this.pageSelectionAll.map((val) => {
          this.deleteSelection(val)
        })
        this.pageSelectionAll.length === 0 && this.selectionData.splice(-(this.table.info.pageSize), this.table.info.pageSize)
        this.pageSelectionAll.length > 0 && this.selectionData.splice(-(this.table.info.pageSize - this.pageSelectionAll.length), this.table.info.pageSize - this.pageSelectionAll.length)
      }
      this.$emit('unAuthorizedUser', this.selectionData)
    },
    // 删掉数据函数
    deleteSelection (val) {
      let len = this.selectionData.length
      while (len--) {
        if (this.selectionData[len].userId === val.userId) {
          this.selectionData.splice(len, 1)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

