<template>
  <i-table
    ref="table"
    slot="section"
    v-if="loaded"
    v-clickoutside="saveItems"
    :table="table"
    @pageSizeChange="handleSizeChange"
    @pageIndexChange="handleCurrentChange">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column type="selection"/>

        <el-table-column
          v-for="(col, idx) of tableScope.columns"
          :key="idx"
          :prop="col.prop"
          :label="col.label"
          :width="col.width">
          <template slot-scope="scope">
            <i-table-cell
              :row="scope.row"
              :col="col.prop"
              :table="tableScope"
              @change="changeData"
              ref="cell">
            </i-table-cell>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </i-table>
</template>

<script>
import req from 'api/common/flow.js'
import Clickoutside from 'directives/clickoutside'

export default {
  name: 'ItemTable',

  directives: {
    Clickoutside
  },

  props: {
    items: {
      required: true,
      type: Array,
      default: null
    }
  },

  data () {
    return {
      valueInputType: 'select',
      table: {
        columns: [
          { label: '维度', prop: 'wfDimensionId', minWidth: 200 },
          { label: '比较符', prop: 'operator', minWidth: 200, display: { dict: 'WP_M_OPERATOR' } },
          { label: '取值', prop: 'dimensionValue', minWidth: 200 },
          { label: '作用场景', prop: 'itemType', minWidth: 200, display: { dict: 'WP_M_PITEMSCOPE' } },
          { label: '额外处理函数', prop: 'linkPaths', minWidth: 200 }
        ],
        data: null,
        showPagebar: false,
        search: null,
        info: null,
        total: 0,
        setting: {
          editor: {
            wfDimensionId: {
              type: 'select',
              rules: {
                required: true,
                message: '请选择维度',
                trigger: 'blur'
              },
              options: {
                option: {}
              }
            },
            operator: {
              type: 'select',
              rules: {
                required: true,
                message: '请选择比较符',
                trigger: 'blur'
              }
            },
            dimensionValue: {
              type: this.valueInputType,
              rules: {
                required: true,
                message: '请输入取值',
                trigger: 'blur'
              }
            },
            itemType: {
              type: 'select',
              rules: {
                required: true,
                message: '请选择作用场景',
                trigger: 'blur'
              }
            },
            linkPaths: {
              type: 'input'
            }
          },
          toolbar: [{
            text: '增加',
            func: vm => vm.createData()
          }, {
            text: '删除',
            type: 'danger',
            func: vm => vm.deleteData()
          }]
        },
        editable: true
      },

      // 维度下拉列表
      dimensionOpts: {},

      // 数据是否加载完成
      loaded: false
    }
  },

  mounted () {
    this.table.data = this.items
    this.fetchDimensions()
  },

  methods: {
    /** 获取维度下拉数据 */
    fetchDimensions () {
      req('getFlowPrincipalDimension').then(res => {
        for (let d of res) {
          this.dimensionOpts[d.wfDimensionId] = d.dimensionName
        }
        this.table.setting.editor.wfDimensionId.options.option = this.dimensionOpts
        this.loaded = true
      })
    },

    /** 点击表格外面区域保存数据 */
    saveItems () {
      if (this.$refs.cell) {
        this.$refs.cell.map(el => el && el.validate())
        const saved = this.$refs.table.saveData()
        if (saved) this.$emit('save', saved.clone)
      }
    }
  }
}
</script>
