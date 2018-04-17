<template>
  <div class="wrap">
    <div class="list">
      <el-batch-select
        :stripe="true"
        :model="model"
        label="name"
        :data-options="model[0]"
        @select="handleChange"
        @change="change"
      />
    </div>
    <div class="form-panel">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <position-post-maintain :model="currentData" :showTitle="false" :ifShowBelongOrg="model.operationType==='0'"></position-post-maintain>
        </el-tab-pane>
        <el-tab-pane label="知识技能要求" name="second">
          <standardjob-skill-demand :model="currentData" :showTitle="false"></standardjob-skill-demand>
        </el-tab-pane>
        <el-tab-pane label="经验要求" name="third">
          <standardjob-experience-demand :model="currentData" :showTitle="false"></standardjob-experience-demand>
        </el-tab-pane>
        <el-tab-pane label="关键职责" name="fourth">
          <standardjob-key-responsilities :model="currentData" :showTitle="false"></standardjob-key-responsilities>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import ElBatchSelect from 'components/position/el-batch-select/el-batch-select'
  import PositionPostMaintain from 'components/position/position-post-maintain'
  import StandardjobSkillDemand from 'components/position/standardjob-skill-demand'
  import StandardjobExperienceDemand from 'components/position/standardjob-experience-demand'
  import StandardjobKeyResponsilities from 'components/position/standardjob-key-responsibilities'
  export default {
    name: 'PositionPostBatchMaintain',
    components: {
      PositionPostMaintain,
      StandardjobSkillDemand,
      StandardjobExperienceDemand,
      StandardjobKeyResponsilities,
      ElBatchSelect
    },
    props: ['model'],
    data () {
      return {
        // 当前tab名称
        activeName: 'first',
        currentData: {}
      }
    },

    methods: {
      handleClick (name) {
      },
      handleChange (arr) {
        // console.log('arr', arr)
        this.currentData = arr[0]
        // console.log(this.currentData)
      },
      change (vaue, model) {
        // console.log('model', model)
      }
    },
    created () {
      this.currentData = this.model[0]
    }
  }
</script>

<style lang="scss" scoped>
  .wrap{
    display: inline-block;
    margin: 0 auto;
    .list{
      float: left;
      margin-right: 20px;
    }
    .form-panel{
      margin-left: 260px;
      height: 435px;
      padding: 10px 20px;
      border: 1px solid #d1d1d1;
      background-color: #fcfcfc;
    }
  }
</style>
