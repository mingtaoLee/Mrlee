<template>
  <section class="content-follow positionInfo">
    <h2 class="info-title">职位信息</h2>
    <el-form
      :model="positionInfo"
      label-width="120px"
      class="form-main clearfix"
      :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="需求名"
            prop="name"
            class="employItem">
           <el-input v-model.trim="positionInfo.name" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请部门" prop="applyOrgName" class="employItem">
            <el-input v-model.trim="positionInfo.applyOrgName" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请职位" prop="applyPositionName" class="employItem">
            <el-input v-model.trim="positionInfo.applyPositionName" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="汇报对象" prop="reportManName" class="employItem">
            <el-input v-model.trim="positionInfo.reportManName" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="部门对接人" prop="relationManName" class="employItem">
            <el-input v-model.trim="positionInfo.relationManName" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="接收简历邮箱"
            prop="receiveEmail"
            class="employItem">
             <el-input v-model.trim="positionInfo.receiveEmail" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="固定编制"
            prop="fixationNum"
            class="employItem">
           <el-input v-model.trim="positionInfo.fixationNum" :disabled="editable">
             <template slot="append">人</template>
           </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="现有人数"
            prop="existingNum"
            class="employItem">
           <el-input v-model.trim="positionInfo.existingNum" :disabled="editable">
             <template slot="append">人</template>
           </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="拟招人数"
            prop="recruitNum"
            class="employItem">
           <el-input v-model.trim="positionInfo.recruitNum" :disabled="editable">
             <template slot="append">人</template>
           </el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item
            label="最小薪资"
            prop="floorSalary"
            class="employItem">
           <el-input v-model.trim="positionInfo.floorSalary" :disabled="editable">
             <template slot="append">元/月</template>
           </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="最大薪资"
            prop="ceilSalary"
            class="employItem">
           <el-input v-model.trim="positionInfo.ceilSalary" :disabled="editable">
             <template slot="append">元/月</template>
           </el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="薪资范围(元)" prop="salaryScope" class="employItem">
            <i-select
              v-model="positionInfo.salaryScope"
              parameter='SALARY_SCOPE'
              placeholder='请选择'
              :disabled="editable"
            >
            </i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="工作地点"
            prop="workAddress"
            class="employItem">
           <el-input v-model.trim="positionInfo.workAddress" :disabled="editable"></el-input>
           <!-- <i-select-area
            search
            v-model="positionInfo.workAddress"
            type="administrativeRegion"
            :disabled="editable"
            ></i-select-area> -->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="拟到岗日期"
            prop="planInDate"
            class="employItem">
            <el-date-picker
              v-model="positionInfo.planInDate"
              value-format="yyyy-MM-dd"
              :disabled="editable"
              :picker-options="planInDatePickerOpts">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="用工类型"
            prop="empType"
            class="employItem">
            <i-select
            :filterable="true"
            :disabled="editable"
            v-model="positionInfo.empType"
            parameter="EMPLOYEE_TYPE"
            placeholder="请选择"></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="需要平台支持"
            class="employItem"
            v-show="positionInfo.isPlatform === '' ? false : true"
            prop="isPlatform">
            <i-select
              parameter="WHETHER_TYPE"
              v-model="positionInfo.isPlatform"
              :disabled="editable" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="办公用品"
            class="employItem"
            prop="officeSupplies">
            <el-input v-model.trim="positionInfo.officeSuppliesStr" collapse-tags :disabled="editable">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
export default {
  name: 'DemandInfo',
  props: {
    // 职位信息数据
    positionInfo: Object,
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 规则
      rules: {},
      planInDatePickerOpts: {                              // 拟到岗时间选择限制
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  mounted () {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.employItem {
  margin-bottom: 20px !important;
}
</style>
<style lang="scss">
  .positionInfo {
    .el-select__tags {
      height: 20px;
    }
    .el-select__tags {
      position: absolute;
      height: 22px;
      white-space: nowrap;
      overflow: hidden;
      line-height: normal;
      white-space: nowrap;
      z-index: 1;
      top: 18px;
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
    }
    .el-select {
      .el-tag {
        height: 20px;
        line-height: 20px;
        margin: 1px;
      }
    }
    .el-input__inner {
      height: 28px;
    }
    .el-input--mini {
      font-size: 14px;
    }
  }
</style>
