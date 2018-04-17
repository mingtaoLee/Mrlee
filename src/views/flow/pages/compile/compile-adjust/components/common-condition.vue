<template>
  <div class="common-condition content-follow">
    <h2 class="info-title">同省区/片区同业务态同类型编制情况</h2>
    <div class="info-content">
      <i-table :table="tableData">
        <template slot="table" slot-scope="tableScope">
          <el-table :data="[model.adjustBefore]" v-loading="loading" :element-loading-text="$loadingText">
            <el-table-column
              v-for="(col, idx) of table.columns"
              v-if="showMap[col.prop]"
              :key="idx"
              :align="col.align"
              :prop="col.prop"
              :label="col.label"
            ></el-table-column>
          </el-table>
        </template>
      </i-table>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'CommonCondition',
    components: {
    },
    props: {
      model: {
        type: Object,
        default () {
          return {}
        }
      },
      loading: {
        type: Boolean
      }
    },
    data () {
      return {
        table: {
          columns: [
            { prop: 'belongArea', label: '所在区域' },
            { prop: 'dailySales', label: '日均销售额（万）', align: 'right' },
            { prop: 'salesRange', label: '销售额幅度（±10%）', align: 'right' },
            { prop: 'posTitleName', label: '当前职务' },
            { prop: 'avgLikeOrgStateNum', label: '同省区平均编制数', align: 'right' },
            { prop: 'avgLikeOrgAreaNum', label: '同区域平均编制数', align: 'right' }
          ]
        }
      }
    },
    methods: {}
  }
</script>
