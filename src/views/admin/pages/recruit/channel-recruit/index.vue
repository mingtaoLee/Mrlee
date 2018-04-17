<template>
  <div class="channel">
    <i-layout headerKey="rctResourcesListGet">
      <div slot="section">
        <div class="table">
          <i-table :table="table"
            @pageSizeChange="handleSizeChange"
            @pageIndexChange="handleCurrentChange">
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="table.data"
                v-loading="loading"
                :element-loading-text="$loadingText">
                <el-table-column
                  type="selection"
                  width="40">
                </el-table-column>
                <el-table-column
                v-for="(col, index) in table.columns || []"
                :key="index"
                :prop="col.prop"
                :width="col.width"
                :align="col.align"
                :formatter="tableScope.formatter"
                :label="col.label"
               >
               </el-table-column>

                <i-table-operator :table="tableScope"/>
                <!-- <el-table-column label="操作" align="center" v-if="operatorColumn">
                  <template slot-scope="scope">
                    <i-table-operator @accessControl="accessControl" :table="tableScope" :row="scope.row"></i-table-operator>
                    <el-button type="text" @click="goResumeList(scope.row.resumeSource)">查看详情</el-button>
                  </template>
                </el-table-column> -->
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-layout>
  </div>
</template>
<script type="text/javascript">
  // 公共组件
  import access from 'mixins/access'
  import req, { config } from 'api/recruit/index.js'
  import { ResumePageSource } from 'views/admin/pages/recruit/config'
  export default {
    name: 'Channel',
    mixins: [access],
    data () {
      return {
        loading: false,
        param: {
          resumeSource: '',
          resumeNum: '',
          interviewNum: '',
          entryNum: ''
        },
        exportDialog: false,
        table: {
          data: [],
          columns: [
            { prop: 'resumeSource', label: '渠道名称', width: '140', display: {dict: 'RESUME_SOURCE'} },
            { prop: 'resumeNum', label: '简历数', align: 'right' },
            { prop: 'interviewNum', label: '面试数', align: 'right' },
            { prop: 'entryNum', label: '录用数', align: 'right' }
          ],
          setting: {
            export: {
              text: '导出',
              key: 'rctResourcesExport',
              config: {
                fileName: '渠道信息'
              },
              req: config.channelList
            },
            operator: [{
              text: '查看',
              key: 'rctResourceResumesListGet',
              func: this.goResumeList
            }]
          },
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        }
      }
    },
    // created () {
    //   this.getChannelList()
    // },
    mounted () {
      this.table.search = {}
    },
    methods: {
       // 分页器显示的当前页
      handleCurrentChange (opts) {
        this.loading = true
        this.getChannelList(opts)
      },

      // 分页器每页显示几个
      handleSizeChange (opts) {
        this.loading = true
        this.getChannelList(opts)
      },
      getChannelList (opts) {
        this.loading = true
        req('channelList', opts).then((res) => {
          Object.assign(this.table, res)
          this.loading = false
          // console.log(this.table.data)
        }).catch((err) => {
          this.loading = false
          console.log(err)
        })
      },
      // 跳转简历列表
      goResumeList (row) {
        this.$router.push({
          path: '/recruit/resume/resumeView',
          query: {
            resumeSource: row.resumeSource,
            source: ResumePageSource.CHANNEL
          }
        })
      }
    }
  }
</script>
