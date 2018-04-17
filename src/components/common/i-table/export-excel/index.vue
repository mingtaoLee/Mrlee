<template>
  <div class="i-table-export-excel">
    <el-form
      :model="config"
      :inline="true">
      <div class="form">
        <el-form-item
          v-if="fileName"
          label="文件名:">
          <el-input v-model.trim="config.fileName" :maxlength="100" />
        </el-form-item>

        <el-form-item
          v-for="(sel, key) of select"
          :key="key"
          :label="sel.label">
          <el-select
            v-model="config[key]"
            v-if="$props[key]">
            <el-option
              v-for="(lab, opt) of sel.option"
              :key="opt"
              :label="lab"
              :value="opt"/>
          </el-select>
        </el-form-item>
      </div>
    </el-form>

  </div>
</template>


<script>
import ee from './main'
import req from 'api/common/home'

export default {
  name: 'ITableExportExcel',
  props: {
    tables: {
      type: Object,
      default: {},
      require: true
    },
    setting: {
      type: Object,
      default: {},
      require: true
    },
    fileName: {
      type: Boolean,
      default: true
    },
    version: {
      type: Boolean,
      default: true
    },
    range: {
      type: Boolean,
      default: true
    }
  },

  mounted () {
    const hasSelection = this.tables.elTable && this.tables.elTable.columns.some(
      col => col.type === 'selection'
    )

    hasSelection || this.$delete(this.select.range.option, 'select')
  },

  data () {
    return {
      config: {
        fileName: this.configMap('fileName') || '',
        version: this.configMap('version') || 'xlsx',
        range: this.configMap('range') || 'page',
        sync: true
      },

      select: {
        version: {
          label: '',
          option: {
            xlsx: 'xlsx',
            xls: 'xls'
          }
        },
        range: {
          label: '',
          option: {
            page: '此页数据',
            select: '选中数据',
            all: '所有数据'
          }
        }
      }
    }
  },

  methods: {
    submit (done) {
      this.config.sync = this.syncMap()
      const config = ee.editConfig(this.config) // 检测是否为“选中导出”，需要先执行
      const reqInfo = ee.parseReq(this.setting)
      const tableInfo = ee.parseTable(this.tables)
      const ret = {
        config,
        tableInfo,
        ...reqInfo
      }
      const { handleBeforeSend } = this.setting

      // 若 handleBeforeSend 返回 false，则拦截请求
      if (typeof handleBeforeSend === 'function' && !handleBeforeSend(ret)) {
        return
      }
      // 判断是否异步
      if (config.sync === false) {
        this._getExportTaskId().then(id => {
          ret.config.sahara_table_export_file_id = id
          const isSuccess = ee.sendTable(ret)
          if (!isSuccess) {
            this.$message({
              type: 'warning',
              message: '请选择数据再导出'
            })
          } else {
            this.$emit('exportFileId', id)
            done()
          }
        })
      } else {
        const isSuccess = ee.sendTable(ret)
        if (!isSuccess) {
          this.$message({
            type: 'warning',
            message: '请选择数据再导出'
          })
        } else {
          done()
        }
      }
    },

  /**
   * 异步发起导出请求,获取任务id
   */
    _getExportTaskId () {
      return new Promise(resolve => {
        req('getExportTaskId').then(id => {
          resolve(id)
        })
      })
    },

    configMap (prop) {
      return this.setting.config
        ? this.setting.config[prop]
        : null
    },

    syncMap () {
      let range = this.config.range
      if (!this.setting.config) return true
      if (this.setting.config.hasOwnProperty('sync')) {
        if (typeof this.setting.config.sync === 'object') {
          if (range === 'select') return true
          return this.setting.config.sync[range] === undefined ? true : !!this.setting.config.sync[range]
        } else {
          if (range === 'select') return true
          return !!this.setting.config.sync
        }
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$padding: 10px;
.i-table-export-excel {
  .form {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    font-size: 0;
    .el-form-item {
      display: inline-block;
      margin: 0;
      &:nth-child(2) {
        width: 90px;
      }
      &:nth-child(3) {
        width: 140px;
        margin: 0;
      }
    }
  }
}
</style>
