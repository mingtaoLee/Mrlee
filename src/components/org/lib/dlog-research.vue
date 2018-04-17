<template>
    <i-dialog
       title="课组列表"
       v-model="visible"
       :toolbar="dialogToolbar"
       class="i-dialog-width-900"
       @close="closeDialog">
       <i-form
         @reset="resetSearcher" 
         @search="submitSearcher()" 
         ref="iForm">
         <el-form-item>
           <span slot="label">课组名称</span>
           <el-input v-model="search.kzName" maxlength="20"></el-input>
         </el-form-item>
       </i-form>
       <i-table
         ref="iTable"
         :table="table"
         @pageSizeChange="pageChange"
         @pageIndexChange="pageChange"
         @save="getTableData">
           <template slot="table" slot-scope="tableScope">
             <el-table
               :data="tableData"
               highlight-current-row
               ref="multipleTable"
               max-height="250"
               @select="select"
               @select-all="selectAll">
                <el-table-column
                  type="selection"
                  v-model="multipleSelection"
                  fixed="left">
                </el-table-column>
               <el-table-column
                 v-for="(col, idx) of table.columns || []"
                 :key="idx"
                 :prop="col.prop"
                 :align="col.align"
                 :formatter="tableScope.formatter"
                 :label="col.label"
                 :width="col.width"
                 show-overflow-tooltip>

                  <template slot-scope="scope">
                    <i-table-cell
                      :row="scope.row"
                      :col="col.prop"
                      :table="tableScope"
                      @change="clusterChange"
                      ref="cell">
                    </i-table-cell>
                  </template>

               </el-table-column>
              <i-table-operator :table="tableScope"></i-table-operator>
             </el-table>
           </template>
       </i-table>
   
       <el-tag
         class="tags"
         :key="tag.kzCode"
         type="info"
         v-for="tag in jobArray"
         :closable="true"
         :close-transition="false"
         @close="handleCloseJobs(tag)"
       >
       {{tag.kzName}}
       </el-tag>
     </i-dialog>
   </template>
   
   <script>
   import req from 'api/org/lib'
   import ITable from 'components/common/i-table'
   import ITableOperator from 'components/common/i-table-operator'
   import ITableCell from 'components/common/i-table-cell'
   import IDialog from 'components/common/i-dialog/i-dialog.vue'
   import IForm from 'components/common/i-form/i-form'
   import ISelect from 'components/common/i-select/i-select'
   import {clone} from 'utils/index'
//    import { windowOpen } from 'utils'
   export default {
     name: 'DlogJobs',
     props: {
       value: Boolean,
       jobArray: Array
     },
     components: {
       ITable,
       IDialog,
       IForm,
       ISelect,
       ITableOperator,
       ITableCell
     },
     data () {
       return {
         tableData: [],
         table: {
           columns: [
             {
               prop: 'kzCode',
               label: '课组编码'
             },
             {
               prop: 'clusterFlag',
               label: '集群标识',
               align: 'center'
             },
             {
               prop: 'kzName',
               label: '课组名称',
               align: 'center'
             },
             {
               prop: 'kzRange',
               label: '段',
               align: 'center'
             }
           ],
           data: null,   // 占位符，用于挂载数据【必填】
           info: {},
           editable: true,
           showPagebar: true,
           setting: {
             editor: {
               kzCode: {
                 disable: true
               },
               clusterFlag: {
                 type: 'select',
                 disable: false,
                 options: {
                   option: {
                     '1': '一集群',
                     '2': '二集群',
                     '3': '三集群'
                   }
                 }
               },
               kzName: {
                 disable: true
               },
               kzRange: {
                 disable: true
               }
             }
           }
         },
         dialogToolbar: [
           {
             text: '取消',
             type: 'defalut',
             func: done => {
               this.cancel(done)
             }
           },
           {
             text: '确定',
             func: done => {
               this.confirm(done)
             }
           }
         ],
         multipleSelection: [],
         search: {
           kzName: '',
           kzCode: ''
         },
         visible: false
       }
     },
     watch: {
       value () {
         if (this.value) {
           this.init()
         }
         this.visible = this.value
       }
     },
     methods: {
       clusterChange ({row, col, val}) {
         let index = this.jobArray.findIndex(item => {
           return item.kzCode === row.kzCode
         })
         if (index !== -1) {
           this.jobArray[index].clusterFlag = val
         } else {
           row.clusterFlag = val
         }
       },
       isContained () {
         this.$nextTick(() => {
           console.log(this.jobArray)
           this.jobArray.forEach(job => {
             this.tableData.forEach(data => {
               if (job.kzCode === data.kzCode) {
                 this.$refs.multipleTable.toggleRowSelection(data)
               }
             })
           })
         })
       },
       closeDialog () {
         this.$emit('input', false)
       },
       confirm () {
         this.$emit('researchCodes', this.jobArray)
         this.closeDialog()
       },
       cancel () {
         this.jobArray = this.cacheJobArray
         this.confirm()
       },
       init () {
         this.cacheJobArray = clone(this.jobArray)
         this.$nextTick(() => {
           this.$refs.iTable.pageIndexChangeHandler(1)
           this.$refs.iForm.initLayout()
         })
       },
       submitSearcher () {
         this.getJobsList({kzName: this.search.kzName})
       },
       resetSearcher () {
         this.search = {kzName: '', kzCode: ''}
       },
       handleCloseJobs (tag) {
         this.jobArray.splice(this.jobArray.indexOf(tag), 1)
         this.getJobsList(this.currentPage)
       },
       getJobsList (option = {}) {
         req('kz', Object.assign(option, {kzName: this.search.kzName, kzCode: this.search.kzCode})).then(data => {
           let flagIndex = null
           this.jobArray.forEach(jobArrayItem => {
             flagIndex = data.data.findIndex(dataItem => {
               return dataItem.kzCode === jobArrayItem.kzCode
             })
             if (flagIndex !== -1) {
               data.data[flagIndex].clusterFlag = jobArrayItem.clusterFlag
             }
           })
           this.tableData = data.data
           Object.assign(this.table, data)
           this.isContained()
         }).catch(() => {
           this.$message.warning('获取失败')
         })
       },
       select (selection, row) {
         let len = this.jobArray.length
         while (len--) {
           if (this.jobArray[len].kzCode === row.kzCode) {
             this.jobArray.splice(len, 1)
             return
           }
         }
         this.jobArray.push({kzCode: row.kzCode, kzName: row.kzName, clusterFlag: row.clusterFlag})
       },
       selectAll (selection) {
         if (selection.length) {
           selection.forEach(select => {
             let flag = true
             let len = this.jobArray.length
             while (len--) {
               if (this.jobArray[len].kzCode === select.kzCode) {
                 flag = false
                 break
               }
             }
             if (flag === true) {
               this.jobArray.push({kzCode: select.kzCode, kzName: select.kzName, clusterFlag: select.clusterFlag})
             }
           })
           return
         }
         this.tableData.forEach(data => {
           this.jobArray.forEach((job, index) => {
             if (job.kzCode === data.kzCode) {
               this.jobArray.splice(index, 1)
             }
           })
         })
       },
       pageChange (page) {
         this.getJobsList(page)
       }
     }
   }
   </script>
   <style lang="scss" scoped>
     .tags {
       margin-top: 10px;
     }
   </style>
   