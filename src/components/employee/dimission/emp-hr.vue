<template>
  <section class="emp-hr content-follow">
    <h2 class="info-title">人力服务团队填写信息</h2>
    <el-form :model="listParam"  :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="是否加入黑名单" prop="inBlackList" v-if="showMap.inBlackList">
            <i-select
              :disabled="disabledMap.inBlackList"
              v-model="listParam.inBlackList"
              parameter='WHETHER_TYPE' >
            </i-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="加入黑名单原因" v-if="listParam.inBlackList === 'Y' && showMap.dimssionReason"  prop="dimssionReason" class="text">
          <el-input
            v-model="listParam.dimssionReason"
            type="textarea"
            resize="both"
            :disabled="disabledMap.dimssionReason"
            :placeholder="disabledMap.dimssionReason && ''"
            >
          </el-input>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="是否发放工资" prop="ischeckSalary" v-if="showMap.ischeckSalary">
            <i-select v-model="listParam.ischeckSalary" :disabled="disabledMap.ischeckSalary" parameter="WHETHER_TYPE" />
          </el-form-item>
        </el-col>
      </el-row>

       <el-form-item label="不发放工资原因" v-if="listParam.ischeckSalary === 'N' && showMap.unCheckSalaryReason" prop="unCheckSalaryReason" class="text">
        <el-input
          v-model="listParam.unCheckSalaryReason"
          type="textarea"
          resize="both"
          :disabled="disabledMap.unCheckSalaryReason">
        </el-input>
      </el-form-item>

      <el-row>
        <el-col :span="6">
          <el-form-item label="是否申领失业金" prop="isUnempBenefits" v-if="showMap.isUnempBenefits">
            <i-select v-model="listParam.isUnempBenefits" :disabled="disabledMap.isUnempBenefits" parameter="WHETHER_TYPE" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-row>
        <el-col :span="6">
          <el-form-item label="是否注销薪资组"  prop="deletePayGroup" v-if="showMap.deletePayGroup">
            <i-select v-model="listParam.deletePayGroup" :disabled="disabledMap.deletePayGroup && editable" parameter="WHETHER_TYPE"></i-select>
          </el-form-item>
        </el-col>
      </el-row> -->

    </el-form>
  </section>
</template>
<script>
import ISelect from 'components/common/i-select/i-select'
// import flow from 'mixins/flow'
import { getDict } from 'utils/index'
export default {
  components: {
    ISelect
  },
  props: {
    listParam: Object,
    editable: {default: false}
  },
  // mixins: [flow],
  data () {
    return {
      rules: {
        unCheckSalaryReason: [
          { required: true, message: '请输入不核算工资原因', trigger: 'blur' }
        ],
        dimssionReason: [
          { required: true, message: '请输入加入黑名单原因', trigger: 'blur' }
        ],
        inBlackList: [
          { required: true, message: '请选择是否加入黑名单', trigger: 'change' }
        ],
        ischeckSalary: [
          { required: true, message: '请选择是否发放工资', trigger: 'change' }
        ],
        isUnempBenefits: [
          { required: true, message: '请选择是否申领失业金', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    if (this.listParam.terminationType === '3') {
      this.listParam.ischeckSalary = 'N'
      getDict('TERMINATION_REASON').then(data => {
        data.map((item) => {
          if (item.value === '31') {
            this.listParam.dimssionReason = item.label
          }
        })
      })
      // this.listParam.dimssionReason =
    }
  }
}
</script>
<style lang="scss" scoped>
   .text {
      width: 500px
    }
</style>


