<template>
  <div>
    <i-layout
      :borderWidth="0"
      :margin="0"
      :headerPadding="0"
      :sectionPadding="0"
      header-key="insInsuredCommercialChangingGet"
      v-loading="loading"
      :element-loading-text="$loadingText"
    >
      <management-search
        @search="search"
        @resetInputs="resetSearchData"
        @checckStatus= "checkStatusList"
        ref="form"
        access-key="insInsuredCommercialGet"
        slot="header"
        :additions="searchData"
      ></management-search>
      <div slot="section" class="mt15">
        <i-table
          @pageSizeChange="addHandleSizeChange"
          @pageIndexChange="addHandleCurrentChange"
          :table="table"
          ref="table"
        >
          <template slot="table" slot-scope="tableScope">
            <el-table
              @selection-change="selectionChange"
              :border="$$.table.border"
              :stripe="$$.table.stripe"
              :data="tableScope.clone"
              v-loading="tableLoading"
              :element-loading-text="$loadingText"
            >
              <el-table-column type="selection" :fixed="true"></el-table-column>
              <el-table-column
                v-for="(col, key) in tableScope.columns"
                :prop="col.prop"
                :min-width="col.width"
                align="center"
                :label="col.label"
                :width="col.width"
                :sortable="col.sortable"
                :formatter="tableScope.formatter"
                :key="key"
              >
                <el-table-column
                  v-for="(item, index) in col.children"
                  :prop="item.prop"
                  :min-width="item.width"
                  align="center"
                  :label="item.label"
                  :width="item.width"
                  :formatter="tableScope.formatter"
                  :key="index"
                ></el-table-column>
              </el-table-column>
            </el-table>
          </template>
        </i-table>
        <!-- <screen v-model="visible" :columns="table.columns" @receiveColumns="receiveColumns"></screen> -->
      </div>
    </i-layout>
  </div>
</template>

<script>
import orgDialog from '@/mixins/orgDialog'
import ManagementSearch from 'components/iaf/search/management-search'
// import screen from 'components/iaf/fund/screen'
import req, {config} from 'api/iaf/insurance-manage'
import access from 'mixins/access'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
export default {
  name: 'ChangeManagementSearch',
  mixins: [IafSearchMixin, access, orgDialog],
  data () {
    return {
      // visible: false,
      deleteArr: [],
      lastData: true,
      loading: true,
      cmlInsuredStatus: '', // 增员标识
      newSearchData: {},
      tableLoading: true,
      // increaseDate: '',
      searchData: {},
      // 增员申请列表
      table: {
        title: '',
        columns: [
          {prop: 'personnelGroupCode', label: '人事范围代码', show: true, width: '150'},
          {prop: 'personnelGroupName', label: '人事范围', show: true, width: '150'},
          {label: '需减去人员',
            prop: 'subtractive',
            children: [
            {prop: 'subtractiveFullName', label: '姓名', width: '150'},
            {prop: 'subtractiveIdNumber', label: '身份证号码', width: '150'},
            {prop: 'subtractivePolicyCode', label: '保单号', width: '150'}
            ]},
          {label: '变更后新增人员',
            prop: 'increased',
            children: [
            {prop: 'increasedFullName', label: '姓名', width: '150'},
            {prop: 'increasedIdNumber', label: '身份证号码', width: '150'},
            {prop: 'increasedPolicyCode', label: '保单号', width: '150'}
            ]}
        ],
        setting: {
          export: {
            config: {
              fileName: '商业险变更表'
            },
            req: config.insuredChangeSearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insInsuredCommercialChangingExportGet'
          }
          // import: {
          //   business: 'iaf-commercialRecordAddSuccessful',
          //   show: () => ({empty: false}),
          //   key: 'insInsuredCommercialChangingImportPost'
          // }
        },
        data: null,
        info: null,
        total: 0,
        multiple: true,
        search: null,
        showPagebar: true
      }
    }
  },
  created () {
    this.getMultipleColumns()
    this.lastData = true
    this.cmlInsuredStatus = '2'
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {lastData: this.searchData})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('insuredChangeSearch', Object.assign({}, options, this.newSearchData,
              {lastData: this.lastData, cmlInsuredStatus: this.cmlInsuredStatus}
            )
         )
        .then(res => {
          this.getMultipleData(res.data)
          Object.keys(res).map(key => (this.table[key] = res[key]))
          this.tableLoading = false
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.tableLoading = false
          this.loading = false
        })
    },
    selectionChange (row) {
      this.deleteArr = row.map(item => {
        return item.commercialRecordId
      })
    },
    // ****增员列表****
    addHandleSizeChange (options) {
      this.fetch(options)
    },
    addHandleCurrentChange (options) {
      this.fetch(options)
    },
    addSuccessMsg () {

    },
    addExportList () {

    },
    // tableDeleteBtn () {
    //   if (this.deleteArr.length === 0) {
    //     this.$message({
    //       type: 'warning',
    //       message: '请至少选择一条记录'
    //     })
    //   } else {
    //     this.$confirm('确认删除？').then(() => {
    //       req('addRequestDelete', this.deleteArr).then(data => {
    //         if (data === true) {
    //           this.$message({
    //             type: 'success',
    //             message: '删除成功'
    //           })
    //           this.search()
    //         } else {
    //           this.$message({
    //             type: 'error',
    //             message: '删除失败'
    //           })
    //         }
    //       })
    //     }).catch(() => {})
    //   }
    // },
    resetSearchData () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      // this.increaseDate = ''
      this.$refs.form.resetForm()
    },
    eachForm () {
      for (var key in this.newSearchData) {
        if (this.newSearchData[key]) {
          this.lastData = false
        }
      }
    },
    search (commonSearchData) {
      this.newSearchData = commonSearchData
      this.table.search = Object.assign({}, this.searchData, commonSearchData, {lastData: this.lastData, cmlInsuredStatus: this.cmlInsuredStatus})
      // this.table.search = Object.assign({}, this.searchData, {lastData: this.searchData})
      // this.fetch(this.table.info)
    },
    initLayout () {
      // console.log(this.$refs.form, 'ref')
      this.$refs.form.initLayout()
    },
    // receiveColumns (columns) {
    //   this.table.columns = columns
    // },
    // showNewMsg () {
    //   this.lastData = true
    //   this.fetch(this.table.info)
    //   // this.search()
    // },
    // showAllMsg () {
    //   this.lastData = false
    //   this.fetch(this.table.info)
    //   // this.search()
    // },
    // pick () {
    //   this.visible = true
    // },
    checkStatusList (val) {
      // if (val === 'checkNewStatus') {
      //   this.showNewMsg()
      // } else {
      //   this.showAllMsg()
      // }
    }
  },
  // watch: {
  //   increaseDate () {
      // this.searchData.increaseStratDate = this.increaseDate[0]
      // this.searchData.increaseEndDate = this.increaseDate[0]
  //   }
  // },
  components: {
    ManagementSearch
    // screen
  }
}
</script>
<style lang="scss" scoped>

</style>
