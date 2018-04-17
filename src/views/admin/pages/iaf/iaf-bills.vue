<template>
 <i-layout>
   <template slot="section">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(col, index) of tabNames" :label="col.label" :name="col.name" :key="index">
          <keep-alive>
            <component :is="col.name" v-if="activeName === col.name" :ref="col.name"></component>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
   </template>
 </i-layout>
</template>

<script>
  import UnemploymentInsurancTable from 'components/iaf/iaf-bills/unemployment-insuranc-table'
  import JobInjuredInsurancTable from 'components/iaf/iaf-bills/job-injured-insuranc-table'
  import BreedInsurancTable from 'components/iaf/iaf-bills/breed-insuranc-table'
  import MedicalInsurancTable from 'components/iaf/iaf-bills/medical-insuranc-table'
  import RetireInsurancTable from 'components/iaf/iaf-bills/retire-insuranc-table'
  import DispatcherTable from 'components/iaf/iaf-bills/dispatcher-table'

  import ILayout from 'components/common/i-layout'

  export default {
    components: {
      UnemploymentInsurancTable,
      JobInjuredInsurancTable,
      BreedInsurancTable,
      MedicalInsurancTable,
      RetireInsurancTable,
      DispatcherTable,
      ILayout
    },
    data () {
      return {
        // 当前选择tab页名称 defaultVulue 第一个tab页名称
        activeName: 'UnemploymentInsurancTable',
        // 所有tab页中文标题和名称 如果添加新的tab页只需要增加一个新的数组对象
        tabNames: [
          {label: '失业保险台账', name: 'UnemploymentInsurancTable'},
          {label: '工伤保险台账', name: 'JobInjuredInsurancTable'},
          {label: '生育保险台账', name: 'BreedInsurancTable'},
          {label: '医疗保险台账', name: 'MedicalInsurancTable'},
          {label: '退休台账', name: 'RetireInsurancTable'}
          // {label: '调基台账', name: 'DispatcherTable'}
        ]
      }
    },
    methods: {
        /**
        * 保证查询表单样式保持三列显示
        *@param {String}当前tab页组件名称
        */
      handleClick ({name}) {
        this.$nextTick(() => this.$refs[name][0].initLayout())
      }
    }
  }
</script>
