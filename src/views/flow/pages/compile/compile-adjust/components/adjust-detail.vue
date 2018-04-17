<template>
  <div class="adjust-detail content-follow">
    <h2 class="info-title">调整明细</h2>
    <div class="info-content">
      <i-table :table="table">
        <template slot="table">
          <el-table :data="tableData" :cell-style="statusColor" v-loading="loading" :element-loading-text="$loadingText">
            <el-table-column
              v-if="showMap[col.prop]"
              v-for="(col, idx) of table.columns"
              :key="idx"
              :align="col.align"
              :prop="col.prop"
              :label="col.label"
            ></el-table-column>

            <el-table-column label="状态" prop="scaStatus">
              <template slot-scope="scope">{{getState(scope.row.scaStatus)}}</template>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'AdjustDetail',
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
            { prop: 'dutyBraid', label: '职务编制' },
            { prop: 'effectiveDate', label: '生效日期' },
            { prop: 'uneffectiveDate', label: '失效日期' },
            { prop: 'scaLowerLimit', label: '编制下限', align: 'right' },
            { prop: 'scaUpperLimit', label: '编制上限', align: 'right' },
            { prop: 'actualScaleNum', label: '实际数', align: 'right' }
          ],
          data: []
        }
      }
    },
    computed: {
      tableData () {
        return this.formatterData(this.model)
      }
    },
    watch: {
      'model': {
        handler (val) {},
        deep: true
      }
    },
    methods: {
      // 状态颜色
      statusColor ({row, column, rowIndex, columnIndex}) {
        if (column.property === 'scaStatus') {
          // 缺编为蓝色，超编为红色
          if (row.scaStatus === '01') {
            return 'color: #409eff'
          } else if (row.scaStatus === '03') {
            return 'color: #f56c6c'
          }
        }
      },
      // 编制字典
      getState (state) {
        let stateObj = {
          '01': '缺编',
          '02': '正常',
          '03': '超编',
          '/': '/'
        }
        return stateObj[state]
      },
      // 计算调整后的编制状态
      countState (scaLowerLimit, scaUpperLimit, actualScaleNum) {
        if (parseInt(scaLowerLimit) > parseInt(actualScaleNum)) {
          return '01'
        } else if (parseInt(scaLowerLimit) <= parseInt(actualScaleNum) && parseInt(scaUpperLimit) >= parseInt(actualScaleNum)) {
          return '02'
        } else if (parseInt(scaUpperLimit) < parseInt(actualScaleNum)) {
          return '03'
        }
      },
      // 把model转换成表格需要的数据
      formatterData (model) {
        if (!model.orgUnitId || !model.posTitleId) {
          return null
        }
        let adjustBefore = model.adjustBefore
        let adjustAfter = model
        adjustAfter.dutyBraid = '调整后'
        adjustAfter.scaStatus = this.countState(adjustAfter.scaLowerLimit, adjustAfter.scaUpperLimit, adjustAfter.actualScaleNum)
        if (adjustBefore) {
          adjustBefore.dutyBraid = '调整前'
          adjustAfter.actualScaleNum = adjustBefore.actualScaleNum === '/' ? 0 : adjustBefore.actualScaleNum
          // adjustBefore无上下限，为新建，设adjustBefore各项为'/'
          if (!adjustBefore.scaLowerLimit && !adjustBefore.scaUpperLimit) {
            adjustBefore.effectiveDate = '/'
            adjustBefore.uneffectiveDate = '/'
            adjustBefore.scaLowerLimit = '/'
            adjustBefore.scaUpperLimit = '/'
            adjustBefore.actualScaleNum = '/'
            adjustBefore.scaStatus = '/'
            return [adjustBefore, adjustAfter]
          } else if (adjustBefore.scaLowerLimit !== '/' && adjustBefore.scaUpperLimit !== '/') {
            // adjustBefore有上下限且不为'/'，则带出adjustBefore的上下限
            return [adjustBefore, adjustAfter]
          } else {
            // adjustBefore上下限为'/'，为新建
            return [adjustBefore, adjustAfter]
          }
        }
        return null
      }
    }
  }
</script>
