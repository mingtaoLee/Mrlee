<template>
  <div class="wrap" v-if="show">
    <div class="head" v-if="!hideTitle">
      <div class="title">名称：{{name}}</div>
      <div class="title">适用范围：{{scope}}</div>
      <div class="title">维度：{{ toDimensionCode[dimensionCode]||''}}</div>
    </div>
    <i-table :table="table">
      <template slot="table" slot-scope="tableScope">
        <el-table :data="tableScope.data">
          <el-table-column
            prop="orgUnitName"
            label="组织名称"
            fixed="left"
            min-width="150"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            v-for="(col, idx) of getColumns"
            :key="idx"
            :label="col.label">
            <el-table-column
              prop="proposal"
              label="建议数"
              v-if="col.havingProposal"
              show-overflow-tooltip
            />
            <el-table-column prop="compile" label="编制数" show-overflow-tooltip />
            <el-table-column prop="actual" label="实际数" show-overflow-tooltip />
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </div>
</template>

<script>
import ITable from 'components/common/i-table'

export default {
  name: 'TemplateManageHomeTable',
  components: {
    ITable
  },
  props: {
    // 是否隐藏标题
    hideTitle: {
      type: Boolean,
      default: false
    },
    // 传入的业务
    dimensions: {
      type: Array,
      default: []
    },
    // 名称内容
    name: {
      type: String,
      default: ''
    },
    // 适用范围的数组
    range: {
      type: Array,
      default: []
    },
    // 维度范围
    dimensionCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 组件的显示隐藏
      show: true,
      // 模板管理主页的表格内容配置项
      table: {
        columns: [],
        data: [{
          team: '组织名称',
          proposal: '',
          compile: '',
          actual: '',
          storeManager: ''
        }]
      },
      toDimensionCode: {
        '01': '职务',
        '02': '职群职种',
        '03': '标准职位',
        '04': '职位'
      }
    }
  },

  methods: {

  },

  computed: {
    // 将传入的适用范围数组转为逗号连接字符串
    scope () {
      return Array.isArray(this.range) ? this.range.join(',') : ''
    },
    // 将外部传入的业务名称带进表格展示
    getColumns () {
      let convertData = this.dimensions
      console.log('convertData', convertData)
      if (convertData.length === 0) return
      convertData.forEach(ele => {
        ele.label = ele.bussinessName
      })
      return convertData
    }
  },

  created () {

  }
}
</script>

<style lang="scss" scoped>
.checkTemp{
  color:#3da5fe;
  cursor: pointer;
}
.title{
  margin-bottom:15px;
}
</style>
