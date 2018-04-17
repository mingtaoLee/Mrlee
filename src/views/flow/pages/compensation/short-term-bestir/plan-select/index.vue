<template>
  <i-table
    v-loading="loading"
    :element-loading-text="$loadingText"
    ref="iTable"
    class="table mb20"
    :table="table"
    @pageSizeChange="handleSizeChange"
    @pageIndexChange="handleCurrentChange"
  >
    <template slot="table" slot-scope="tableScope">
      <el-table
        ref="elTable"
        :data="tableScope.clone"
        border
        @selection-change="selectionChangeHandler(tableScope, $event)">
        <el-table-column
          :formatter="selectionFormatter"
          type="selection">
        </el-table-column>
        <el-table-column label="方案名称" prop="planName"></el-table-column>
        <el-table-column
          v-for="(col, idx) of table.columns"
          :key="idx"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :align="col.align"
          :sortable="col.sortable"
          :formatter="tableScope.formatter"
        >
        </el-table-column>
        <el-table-column label="方案说明" prop="fileList" minWidth="200">
          <template slot-scope="scope">
            <template v-for="(file, index) in scope.row.fileList">
              <div class="file-preview">
                <div class="flex-space-between file-item">
                  <div>
                    {{index + 1 + '、'}}
                    <el-button type="text" icon="el-icon-document" @click="openFilePreviewPage(file)">{{file.fileName}}</el-button>
                  </div>
                  <el-tooltip class="item" effect="light" content="下载" placement="top">
                    <a class="icon" :href="getDownload(file)" download><i class="iconfont icon-download"></i></a>
                    <a class="icon" @click="download(file)"><i class="iconfont icon-download"></i></a>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </i-table>
</template>
<script>
  import { uploaderLinks } from 'api/common/upload'
  import { windowOpen, showMessage } from 'utils/index'
  import req from 'api/compensation/flow'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  export default {
    mixins: [PaginationMixin, SearchDateMixin],
    components: {
    },
    data: function () {
      return {
        instance: null,
        // table
        table: {
          columns: [
            { prop: 'allocation', label: '方案分配形式', align: 'center', display: { dict: 'ALLOCATION' } },
            { prop: 'orgUnitName', label: '方案归属' }
          ],
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: false
        },
        searchParam: {}
      }
    },
    methods: {
      /** 初始化默认选择项 */
      initSelected (iTable) {
        this.$nextTick(() => {
          iTable.clone.forEach(item => {
            this.$refs.elTable.toggleRowSelection(item)
          })
        })
      },
      fetch (options = {}) {
        req('getBestirPlans', options).then(res => {
          // Object.keys(res).map(key => {
          //   this.table[key] = res[key]
          // })
          this.table.data = res
          this.loaded()
        })
      },

      getDownload (file) {
        return `${uploaderLinks.download}?attachmentId=${file.fileId}`
      },

      getPreviewUrl (file) {
        return `${uploaderLinks.filePreview}/${file.fileId}`
      },
      openFilePreviewPage (file) {
        if (this.isPdf(file.fileName)) {
          windowOpen(this.getPreviewUrl(file))
        } else {
          showMessage('info', '当前只支持pdf文件预览！其他格式请先下载！')
        }
      },
      isPdf (url) {
        return url.match(/pdf/g)
      },
      download (file) {
        const form = document.createElement('form')

        const formConfig = {
          action: this.getDownload(file),
          method: 'get',
          type: 'hidden'
        }

        Object.entries(formConfig).map(
          ([key, val]) => form.setAttribute(key, val)
        )
        form.submit()
      },

      /** 调入已选选项 */
      confirm () {
        this.selected = this.$refs['iTable'].getMultipleSelection()
        if (this.selected.length === 0) {
          showMessage('info', '请选择激励方案！')
          return Promise.resolve(false)
        } else {
          showMessage('success', '激励方案选择成功！')
          return Promise.resolve(this.selected)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .file-preview {
    line-height: 34px;
  }
  .file-item {
    padding: 0 20px;
  }
  .icon {
    transition: 0.3s;
    &:hover {
      color: #3da5fe;
    }
  }
</style>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
