<template>
  <i-table
    slot="section"
    ref="table"
    :table="table"
    @clone="getTableClone"
    @pageIndexChange="handleCurrentChange"
    @pageSizeChange="handleSizeChange"
    >
    <template slot="table" slot-scope="tableScope">
      <el-table
        :data="tableScope.clone"
        style="width: 100%"
        v-loading="loading"
        :element-loading-text="$loadingText"
        >
        <el-table-column
          type="selection"
          fixed="left"
          show-overflow-tooltip
        />
        <el-table-column
          prop="name"
          label="触发器名称"
          align="center"
          min-width="150"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <i-table-cell
            :row="scope.row"
            col="name"
            :table="tableScope"
            @change="handleChange"
          />
          </template>
        </el-table-column>
        <el-table-column
          v-for="col of table.columns"
          align="center"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :formatter="tableScope.formatter"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <i-table-cell
              :row="scope.row"
              :col="col.prop"
              :table="tableScope"
            />
          </template>
        </el-table-column>
      </el-table>
    </template>
  </i-table>
</template>

<script>
  import req from 'api/system/dispatch-management'
  export default {
    name: 'NewTaskTable',
    components: {
    },
    // 任务id，根据任务id获取已绑定和可绑定的触发器
    props: ['taskID'],
    data () {
      return {
        loading: true,
        // 表格的配置
        table: {
          columns: [
            // {prop: 'id', label: 'id', width: 0},
            { prop: 'type', label: '触发器类型' },
            { prop: 'startTime', label: '生效时间', display: { date: 'default' } },
            { prop: 'endTime', label: '失效时间', display: { date: 'default' } }
            // { prop: 'description', label: '描述' }
            // { prop: 'createdBy', label: '创建人' },
            // { prop: 'creationDate', label: '创建时间', display: { date: 'default' } }
          ],
          data: null,
          showPagebar: true,
          total: 0,
          info: null,
          search: null,
          editable: true,
          dev: true,
          setting: {
            toolbar: [
              {
                text: '新增',
                func: vm => vm.createData(),
                show: () => {
                  return {
                    disable: true
                  }
                }
              },
              {
                text: '删除',
                func: vm => {
                  vm.deleteData()
                  this.getAcessTriggersList()
                },
                show: () => {
                  return {
                    disable: true
                  }
                }
              }
            ]
          }
          // editor: {
          //   name: {
          //     type: 'select',
          //     // 向下兼容
          //     options: {
          //       option: this.accessTriggersOptions
          //     }
          //   }
          // }
        },
        // 所有触发器选项
        allTriggersOptions: {},
        // 可选择的触发器选项
        accessTriggersOptions: {},
        // 可绑定触发器详细信息
        triggersInfo: null,
        // 已选择的触发器
        selectedTriggers: []
      }
    },
    created () {
      this.getAllTriggers()
      this.addSetting()
    },
    mounted () {
      this.table.search = {}
    },
    methods: {
      // 每页展示多少条数据
      handleSizeChange (params) {
        this.loading = true
        this.handlerBut(true)
        this.fetch(params)
      },
      // 获取置顶页数数据
      handleCurrentChange (params) {
        this.loading = true
        this.handlerBut(true)
        this.fetch(params)
      },
      // 如果表格没有配置相应信息，则添加配置信息
      addSetting () {
        var options = {
          option: this.accessTriggersOptions
        }
        this.addEditorSetting('name', {
          type: 'select',
          options: options
        })
        this.table.columns.forEach(item => {
          this.addEditorSetting(item.prop, { disable: true })
        })
        // this.addEditorSetting('id', { disable: true })
      },
      // 配置可编辑单元格数据
      addEditorSetting (prop, obj) {
        if (this.table.setting) {
          if (this.table.setting.editor) {
            this.table.setting.editor[prop] = obj
          } else {
            this.table.setting.editor = {}
            this.table.setting.editor[prop] = obj
          }
        } else {
          this.table.setting = {
            editor: {
              [prop]: obj
            }
          }
        }
        if (!this.table.editable) {
          this.table.editable = true
        }
      },
      // 在请求完数据之前禁止按钮操作
      handlerBut (statu) {
        this.table.setting.toolbar.map(val => {
          val.show = () => {
            return {
              disable: statu ? !!true : !!false
            }
          }
        })
      },
      // 获取列表
      fetch (params = {}) {
        params.id = this.taskID
        if (this.taskID) {
          req('getBindedTrigger', params).then(res => {
            this.table = Object.assign(this.table, res)
            this.selectedTriggers = res.data.map((item) => { return item.id })
            this.getAcessTriggersList(true)
            this.loading = false
            this.handlerBut(false)
          })
          .catch(() => {
            this.loading = false
          })
        }
      },
      // 获取所有触发器
      getAllTriggers () {
        return req('getAllTriggers').then(res => {
          this.triggersInfo = res
          res.forEach((val) => {
            this.allTriggersOptions[val.id] = val.name
          })
        })
      },
      // 处理触发器名称一列的选择
      handleChange (sel) {
        // 切换的触发器id
        let id = sel.val
        // 取到该触发器的信息
        let info = this.triggersInfo.filter((item) => { return item.id === id })
        // 更新到表格
        for (let key in sel.row) {
          if (key !== '_id') {
            sel.row[key] = info[0][key]
          }
          sel.row['id'] = info[0]['id']
        }
        this.getAcessTriggersList()
      },
      // 过滤出可选的触发器列表
      getAcessTriggersList (isCreated) {
        // 调用i-table的savaData方法，使其触发clone事件，以调用getTableClone方法
        if (!isCreated) {
          this.$refs.table.saveData()
        }
        // ---------过滤可选触发器----------
        // 所有的触发器的id
        let allTriggersKey = Object.keys(this.allTriggersOptions)
        // 先复制一份
        let accessTriggersKey = [...allTriggersKey]
        // 遍历已选择的触发器id
        this.selectedTriggers.forEach((item) => {
          let index = accessTriggersKey.indexOf(item)
          if (index > -1) {
            // 若某项触发器id在可选列表中，则在可选列表中删除
            accessTriggersKey.splice(index, 1)
          }
        })
        // 先清空之前的可选触发器选项
        for (let key in this.accessTriggersOptions) {
          delete this.accessTriggersOptions[key]
        }
        // 根据可选触发器id构建新的可选触发器选项
        accessTriggersKey.forEach((key) => {
          this.$set(this.accessTriggersOptions, key, this.allTriggersOptions[key])
          // this.accessTriggersOptions[key] = this.allTriggersOptions[key]
        })
      },
      // 获取i-table内部的数据，并取出已选择的触发器id组成数组
      getTableClone (data) {
        this.selectedTriggers = data.map((item) => item.id)
        this.$emit('triggersChange', [...this.selectedTriggers])
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

