<template>
  <section class="pers-change table-card">
  <i-layout v-loading="loading" :element-loading-text="$loadingText">
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="内部订单号:">
          <el-input v-model="form.aufnCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="公司代码:">
          <el-input v-model="form.cropCode" placeholder="请输入"></el-input>
      </el-form-item>
       <el-form-item label="描述:">
          <el-input v-model="form.aufnDes" placeholder="请输入"></el-input>
      </el-form-item>
    </i-form>

    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            border>
            <el-table-column label="选择" width="80" align="center">
                <template slot-scope="scope">
                    <el-radio 
                    class="radio position-map-radio"   
                    v-model="radio" 
                    :label="scope.row"
                    @change.native="changeText($event, scope)"></el-radio>
                </template>
            </el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              :align="col.align"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>
  </section>
</template>

<script>
  import req from 'api/compensation/check-give/inner-order'

  export default {
    name: 'OrderTable',
    data () {
      return {
        form: {
          aufnCode: '',
          cropCode: '',
          aufnDes: ''
        },
        // 表格
        table: {
          columns: [
            { prop: 'aufnCode', label: '内部订单号', align: 'center' },
            { prop: 'aufnType', label: '订单类型', align: 'center', display: {dict: 'AUFN_TRANSFER_TYPE'} },
            { prop: 'cropCode', label: '订单公司代码', align: 'center' },
            { prop: 'ctrlScrop', label: '利润中心', align: 'center' },
            { prop: 'createTime', label: '创建的时间', align: 'center' },
            { prop: 'aufnDes', label: '描述', align: 'center' }
          ],
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          search: null
        },
        selectOrder: null,
        radio: null,
        loading: true
      }
    },
    created () {
      this.selectedList = []
    },
    mounted () {
      this.table.search = {}
    },
    methods: {
      handleSizeChange (options) {
        this.fetch(options)
      },
      handleCurrentChange (options) {
        this.fetch(options)
      },
      fetch (options = {}) {
        req('getOrderTable', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loading = false
        })
      },
      /** 重置搜索条件 */
      reset () {
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
      },
      /** 执行搜索方法 */
      search () {
        this.table.search = { ...this.form }
      },
      /** 单选时改变所选数据 */
      changeText (e, scope) {
        this.selectOrder = scope.row
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
