<template>
  <div class="content-card">
    <el-tabs v-model="startTabPage" @tab-click="handleClick">
      <el-tab-pane name="unemploymentTally" label="失业保险台账">
        <unemployment-insuranc-table :tabsNames.sync="tabsNames" ref="unemployment"></unemployment-insuranc-table>
      </el-tab-pane>
      <el-tab-pane name="injuryTally" label="工伤保险台账">
        <job-injured-insuranc-table :tabsNames.sync="tabsNames" ref="job" v-if="injuryTally"></job-injured-insuranc-table>
      </el-tab-pane>
      <el-tab-pane name="procreationTally" label="生育保险台账">
        <breed-insuranc-table :tabsNames.sync="tabsNames" ref="breed" v-if="procreationTally"></breed-insuranc-table>
      </el-tab-pane>
      <el-tab-pane name="maternityTally" label="医疗保险台账">
        <medical-insuranc-table :tabsNames.sync="tabsNames" ref="medical" v-if="maternityTally"></medical-insuranc-table>
      </el-tab-pane>
      <el-tab-pane name="retiredTally" label="退休台账">
        <retire-insuranc-table :tabsNames.sync="tabsNames" ref="retire" v-if="retiredTally"></retire-insuranc-table>
      </el-tab-pane>
      <el-tab-pane name="dispatcherTally" label="调基台账">
        <dispatcher-table  ref="dispatcher" v-if="dispatcherTally"></dispatcher-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ITable from 'components/common/i-table'
import UnemploymentInsurancTable from './unemployment-insuranc-table'
import JobInjuredInsurancTable from './job-injured-insuranc-table'
import BreedInsurancTable from './breed-insuranc-table'
import MedicalInsurancTable from './medical-insuranc-table'
import RetireInsurancTable from './retire-insuranc-table'
import DispatcherTable from './dispatcher-table'
export default {
  data () {
    return {
      startTabPage: 'unemploymentTally',
      injuryTally: false,
      procreationTally: false,
      maternityTally: false,
      retiredTally: false,
      tabsNames: {
        unemploymentTally: true,
        injuryTally: false,
        procreationTally: false,
        maternityTally: false,
        retiredTally: false,
        dispatcherTally: false
      }
    }
  },
  methods: {
    // 标签页页头点击
    handleClick (tab, event) {
      for (let key in this.tabsNames) {
        this.tabsNames[key] = false
      }
      this.tabsNames[tab.name] = true
      tab.name === 'injuryTally' && (this.injuryTally = true)
      tab.name === 'procreationTally' && (this.procreationTally = true)
      tab.name === 'maternityTally' && (this.maternityTally = true)
      tab.name === 'retiredTally' && (this.retiredTally = true)
      tab.name === 'dispatcherTally' && (this.dispatcherTally = true)
      this.$nextTick(() => {
        this.$refs.unemployment.initLayout()
        this.$refs.job.initLayout()
        this.$refs.breed.initLayout()
        this.$refs.medical.initLayout()
        this.$refs.retire.initLayout()
        this.$refs.dispatcher.initLayout()
      })
    }
  },
  components: {
    ITable,
    UnemploymentInsurancTable,
    JobInjuredInsurancTable,
    BreedInsurancTable,
    MedicalInsurancTable,
    RetireInsurancTable,
    DispatcherTable
  }
}
</script>
<style lang="scss" scoped>
.content-card{
  padding:15px;
}
</style>
