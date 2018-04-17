<template>
  <div>
      <!-- 挂靠 -->
      <i-process-flow
        processType="organizationRelevelFlow"
        @fillin="fillIn"
        :taskI="taskId"
        :taskKey="taskKey"
      >
        <div slot="allFlow">
          <div class="module">
            <h2>个人信息</h2>
            <el-form :inline="true" label-width="100px" :model="basicData">
              <el-form-item label="工号">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="岗位">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="人事范围">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="年龄">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="户口所在地">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="现合同主体">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="挂靠城市">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="挂靠户头">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="户口性质">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="身份证号">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="是否怀孕">
                <el-input></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="module">
            <h2>挂靠基数</h2>
            <el-form :inline="true" label-width="170px">
              <el-form-item label="养老保险基数">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="失业保险基数">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="工伤保险基数">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="生育保险基数">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="医疗保险基数">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="住房公积金">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="原养老保险个人号码">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="原医疗保险个人号码">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="原住房公积金个人号码">
                <el-input></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </i-process-flow>
  </div>
</template>

<script>

import IProcessFlow from 'components/common/i-process-flow'

export default {
  components: {
    IProcessFlow
  },
  data () {
    return {
      flowData: {
        creator: '12345',
        isHasOfficialDocument: 'N',
        processDefinitionId: '',
        partnerId: '8a8ea06a5faf744d015faf7dc1f90010',
        financeId: '8a8ea06a5faf744d015faf7dc1f90010',
        hrEmpId: '8a8ea06a5faf744d015faf7dc1f90010',
        operateType: '4'
      }
    }
  },
  methods: {
    postFlow () {
      return Object.assign({}, {orgUnitMaintains: this.basicData}, this.flowData)
    },
    fillIn (data) {

    }
  }
}
</script>
<style lang="scss" scoped>
.module{
  min-width: 850px;
  border-bottom: 1px solid #e5e5e5;
  margin: 20px;
  h2{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: bold;
    color: #000000;
    letter-spacing: 0;
    margin-bottom: 20px;
  }
}
</style>
