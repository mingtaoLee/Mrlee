<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <!-- 若使用带有 v-for 的向下兼容，且还需要 v-if 屏蔽掉无 label 的表头 -->
        <el-table-column
          v-for="(col, idx) of tableScope.columns"
          :key="idx"
          :prop="col.prop"
          :label="col.label">
          <template slot-scope="scope">
            <i-table-cell
              :row="scope.row"
              :col="col.prop"
              :table="tableScope"
              :formatter="tableScope.formatter">
              <el-switch v-if="col.prop === 'whether'" v-model="scope.row['whether']" active-value="Y" inactive-value="N"/>
            </i-table-cell>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </i-table>
</template>

<script>
import data from '../mock-data'

export default {
  data () {
    return {
      table: {
        title: '6-4 向下兼容',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'comment', label: '标注' },
          { prop: 'degree', label: '学位', display: { dict: 'DEGREE' } },
          { prop: 'whether', label: '是否加薪', display: { dict: 'WHETHER_TYPE' } }
        ],
        setting: {
          editor: {
            degree: {
              type: 'select'
              // options: [
              //   { label: 'A', value: 1 },
              //   { label: 'B', value: 2 }
              // ]
            }
          }
        },
        editable: true,
        data
      }
    }
  }
}
</script>
