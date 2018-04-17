<template>
  <el-form :model="formData" :rules="rules" ref="form">
    <el-form-item label="模版名称" :label-width="'100px'" prop="name" required>
      <el-input v-model.trim="formData.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item
      label="考核内容"
      prop="checked"
      :rules="isCheckedRule"
      :label-width="'100px'"
      required>
      <el-form-item class="inline-block">
        <el-checkbox label="1" v-model="formData.kpi.isChecked" @change="kpiCheckChange">KPI指标</el-checkbox>
      </el-form-item>
      <el-form-item
        prop="kpi.weight"
        :rules="kpiPercentRule"
        v-if="formData.kpi.isChecked && formData.keyWork.isChecked"
        class="inline-block">
        <el-input width="30" class="input-small" v-model.number="formData.kpi.weight">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <!-- prop="keyWork.isChecked" :rules="isCheckedRule" -->
      <el-form-item class="inline-block">
        <el-checkbox label="2" v-model="formData.keyWork.isChecked" @change="keyWorkCheckChange">重点工作</el-checkbox>
      </el-form-item>
      <el-form-item
        class="inline-block"
        prop="keyWork.weight"
        :rules="keyWorkPercentRule"
        v-if="formData.keyWork.isChecked && formData.kpi.isChecked">
        <el-input
          width="30"
          class="input-small"
          v-model.number="formData.keyWork.weight">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-checkbox label="3" v-model="formData.keyEvent.isChecked">关键事件</el-checkbox>
    </el-form-item>
    <el-form-item label="评估方法" :label-width="'100px'" prop="evaluationMethod">
      <el-select v-model="formData.evaluationMethod" clearable placeholder="">
        <el-option v-for="item in evaluationMethodDict" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="formData.evaluationMethod == 1" label="评分标准" :label-width="'100px'" prop="standardId">
      <el-select v-model="formData.standardId" clearable>
        <el-option v-for="item in standardALlList" :key="item.value" :label="item.name"
                   :value="item.standardId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="考核周期" :label-width="'100px'" prop="checkedPeriod">
      <el-checkbox-group
        class="left-padding__10"
        v-model="formData.checkedPeriod"
        @change="periodChange">
        <el-checkbox v-for="period in frequencyTypeDict" :label="period.value" :key="period.value">{{period.label}}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <yh-cl click-free mounted-type="target">
      <yh-cl-item v-if="formData.checkedPeriod.includes('1')" title="月度考核设置" index=0>
        <table border="1" class="el-table">
          <tr>
            <th rowspan="3">基本设置</th>
            <td rowspan="2">考核月份</td>
            <td colspan="3" rowspan="2">
              <el-form-item
                class="item-content-left-padding__10"
                prop="month.period"
                :rules="periodRule">
                <el-checkbox
                  v-model="allYearSelected"
                  :indeterminate="isIndeterminate"
                  @change="handleAllYearSelected"
                >全年</el-checkbox>
                <el-checkbox-group v-model="formData.month.period">
                  <el-checkbox
                    v-for="period in monthdDict"
                    :label="period.value"
                    :key="period.value">
                    {{ period.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </td>
          </tr>
          <tr>
          </tr>
          <tr>
            <td>是否制定计划</td>
            <td colspan="3">
              <el-form-item
                class="item-content-left-padding__10"
                prop="month.isMakePlan"
                :rules="requireItem">
                <el-radio-group v-model="formData.month.isMakePlan">
                  <el-radio class="radio" label="Y">是 </el-radio>
                  <el-radio class="radio" label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>计划设置</th>
            <td>计划启动日期</td>
            <td colspan="1">
              <el-form-item required>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item prop="month.isCurrent4PlanStart" :rules="monthCurrent">
                      <el-select
                        placeholder=""
                        v-model="formData.month.isCurrent4PlanStart"
                        @change="monthChange"
                        clearable>
                        <el-option label="上月" value="N"></el-option>
                        <el-option label="当月" value="Y"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="month.planBeginDay" :rules="dayCurrent">
                      <el-select
                      placeholder=""
                      v-model="formData.month.planBeginDay"
                      @change="dayPlanChange"
                      filterable
                      clearable>
                        <el-option
                          v-for="item in totalDay"
                          :key="item.value"
                          :label="`${item.value}号`"
                          :value="item.value"
                          :disabled="item.disabled">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th rowspan="2">评估设置</th>
            <td>自评权重</td>
            <td>
              <el-form-item
                prop="month.selfEvaluationWeight"
                :rules="monthPercentRule"
                class="needs-padding__8">
                <el-input v-model.trim="formData.month.selfEvaluationWeight" placeholder="请输入内容" @change="autoMonthleaderEvaluationWeight">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </td>
            <td>复评权重</td>
            <td>
              <el-form-item
                prop="month.leaderEvaluationWeight"
                :rules="monthPercentRule"
                class="needs-padding__8">
                <el-input v-model.trim="formData.month.leaderEvaluationWeight" placeholder="请输入内容" @change="autoMonthSelfEvaluationWeight">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>开始评估日期</td>
            <td>
              <el-form-item required>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item prop="month.isCurrent4EvaluationBegin" :rules="monthCurrent">
                      <el-select
                        placeholder=""
                        v-model="formData.month.isCurrent4EvaluationBegin"
                        @change="planStartChange"
                        clearable>
                        <el-option label="上月" value="N"></el-option>
                        <el-option label="当月" value="Y"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="month.evaluationBeginDay" :rules="dayCurrent">
                      <el-select
                        placeholder=""
                        v-model="formData.month.evaluationBeginDay"
                        @change="daystartChange"
                        filterable
                        clearable>
                        <el-option
                          v-for="item in totalPlanStart"
                          :key="item.value"
                          :label="`${item.value}号`"
                          :value="item.value"
                          :disabled="item.disabled">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </td>
            <td>停止评估日期 </td>
            <td>
              <el-form-item required>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item prop="month.isCurrent4EvaluationEnd" :rules="monthCurrent">
                      <el-select
                        placeholder=""
                        v-model="formData.month.isCurrent4EvaluationEnd"
                        @change="planEndChange"
                        clearable>
                        <el-option label="上月" value="N"></el-option>
                        <el-option label="当月" value="Y"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="month.evaluationEndDay" :rules="dayCurrent">
                      <el-select
                        placeholder=""
                        filterable
                        v-model="formData.month.evaluationEndDay"
                        clearable>
                        <el-option
                          v-for="item in totalPlanEnd"
                          :key="item.value"
                          :label="`${item.value}号`"
                          :value="item.value"
                          :disabled="item.disabled">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </td>
          </tr>
        </table>
      </yh-cl-item>
      <yh-cl-item v-if="formData.checkedPeriod.includes('2')" title="季度考核设置" index=1>
        <table border="1" class="el-table">
          <tr>
            <th class="width-20" rowspan="2">基本设置</th>
            <td>考核季度</td>
            <td colspan="3">
              <div>
                <el-form-item prop="quarter.period" :rules="periodRule">
                  <el-checkbox-group v-model="formData.quarter.period" @change="quarterChange">
                    <el-checkbox v-for="period in quarterDict" :label="period.value" :key="period.value">
                      {{period.label}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td v-if="isShowArr.includes('2')">是否合并子周期</td>
            <td v-if="isShowArr.includes('2')">
              <el-form-item prop="quarter.isCalculateByChildren" :rules="ChildrenItem">
                <el-radio-group v-model="formData.quarter.isCalculateByChildren">
                  <el-radio class="radio" label="Y">是 </el-radio>
                  <el-radio class="radio" label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
            <td v-if="!isShowArr.includes('2') || formData.quarter.isCalculateByChildren==='N'">是否制定计划</td>
            <td v-if="!isShowArr.includes('2') || formData.quarter.isCalculateByChildren==='N'">
              <el-form-item prop="quarter.isMakePlan" :rules="requireItem">
                <el-radio-group v-model="formData.quarter.isMakePlan">
                  <el-radio class="radio" label="Y">是 </el-radio>
                  <el-radio class="radio" label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th v-if="this.formData.quarter.period.includes('4')||this.formData.quarter.period.includes('8')">
              计划设置
            </th>
            <td v-if="this.formData.quarter.period.includes('4')">第一季度计划启动日期</td>
            <td v-if="this.formData.quarter.period.includes('4')">
              <el-form-item prop="quarter.firstPlanBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.firstPlanBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="firstPlanPickerOptions"
                  @change="plan4First"
                >
                </el-date-picker>
              </el-form-item>
            </td>
            <td v-if="this.formData.quarter.period.includes('8')">第二季度计划启动日期</td>
            <td v-if="this.formData.quarter.period.includes('8')">
              <el-form-item prop="quarter.secondPlanBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.secondPlanBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="secondPlanPickerOptions"
                  @change="plan4Second"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="this.formData.quarter.period.includes('13')||this.formData.quarter.period.includes('17')">
            <th>
                <span
                  v-if="(this.formData.quarter.period.includes('13')||this.formData.quarter.period.includes('17')) && (!this.formData.quarter.period.includes('4')&&!this.formData.quarter.period.includes('8'))">计划设置</span>
            </th>
            <td v-if="this.formData.quarter.period.includes('13')">第三季度计划启动日期</td>
            <td v-if="this.formData.quarter.period.includes('13')">
              <el-form-item prop="quarter.thirdPlanBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.thirdPlanBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="thirdPlanPickerOptions"
                  @change="plan4Third"
                >
                </el-date-picker>
              </el-form-item>
            </td>
            <td v-if="this.formData.quarter.period.includes('17')">第四季度计划启动日期</td>
            <td v-if="this.formData.quarter.period.includes('17')">
              <el-form-item prop="quarter.fourPlanBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.fourPlanBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="fourPlanPickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="!isShowArr.includes('2') || formData.quarter.isCalculateByChildren==='N'">
            <th rowspan="5">评估设置</th>
            <td>自评权重</td>
            <td>
              <el-form-item
                prop="quarter.selfEvaluationWeight"
                :rules="quarterPercentRule">
                <el-input v-model.trim="formData.quarter.selfEvaluationWeight" placeholder="" @change="autoQuarterleaderEvaluationWeight">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </td>
            <td>复评权重</td>
            <td>
              <el-form-item
                prop="quarter.leaderEvaluationWeight"
                :rules="quarterPercentRule">
                <el-input v-model.trim="formData.quarter.leaderEvaluationWeight" placeholder="" @change="autoQuarterSelfEvaluationWeight">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="isShowQuarter1">
            <td>第一季度开始评估日期</td>
            <td>
              <el-form-item prop="quarter.firstEvaluationBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.firstEvaluationBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="firstStartpickerOptions"
                  @change="start4First"
                >
                </el-date-picker>
              </el-form-item>
            </td>
            <td>第一季度停止评估日期 </td>
            <td>
              <el-form-item prop="quarter.firstEvaluationEndDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.firstEvaluationEndDate"
                  type="date"
                  placeholder=""
                  :picker-options="firstEndpickerOptions"
                  @change="end4First"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="isShowQuarter2">
            <td>第二季度开始评估日期</td>
            <td>
              <el-form-item prop="quarter.secondEvaluationBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.secondEvaluationBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="secondStartpickerOptions"
                  @change="start4Second"
                >
                </el-date-picker>
              </el-form-item>
            </td>
            <td>第二季度停止评估日期 </td>
            <td>
              <el-form-item prop="quarter.secondEvaluationEndDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.secondEvaluationEndDate"
                  type="date"
                  placeholder=""
                  :picker-options="secondEndpickerOptions"
                  @change="end4Second"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="isShowQuarter3">
            <td>第三季度开始评估日期</td>
            <td>
              <el-form-item prop="quarter.thirdEvaluationBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.thirdEvaluationBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="thirdStartpickerOptions"
                  @change="start4Third"
                >
                </el-date-picker>
              </el-form-item>
            </td>
            <td>第三季度停止评估日期 </td>
            <td>
              <el-form-item prop="quarter.thirdEvaluationEndDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.thirdEvaluationEndDate"
                  type="date"
                  placeholder=""
                  :picker-options="thirdEndpickerOptions"
                  @change="end4Third"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="isShowQuarter4">
            <td>第四季度开始评估日期</td>
            <td>
              <el-form-item prop="quarter.fourEvaluationBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.fourEvaluationBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="fourStartpickerOptions"
                  @change="start4All"
                >
                </el-date-picker>
              </el-form-item>
            </td>
            <td>第四季度停止评估日期 </td>
            <td>
              <el-form-item prop="quarter.fourEvaluationEndDate" :rules="date">
                <el-date-picker
                  v-model="formData.quarter.fourEvaluationEndDate"
                  type="date"
                  placeholder=""
                  :picker-options="fourEndpickerOptions"
                  @change="end4All"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
        </table>
      </yh-cl-item>
      <yh-cl-item v-if="formData.checkedPeriod.includes('3')" title="半年考核设置" index=2>
        <table border="1" class="el-table">
          <tr>
            <th class="width-20" rowspan="2">基本设置</th>
            <td>考核年度</td>
            <td colspan="3">
              <div>
                <el-form-item prop="halfYear.period" :rules="periodRule">
                  <el-checkbox-group v-model="formData.halfYear.period" @change="halfYearChange">
                    <el-checkbox v-for="period in halfYearDict" :label="period.value" :key="period.value">
                      {{period.label}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td v-if="isShowArr.includes('3')">是否合并子周期</td>
            <td v-if="isShowArr.includes('3')">
              <el-form-item prop="halfYear.isCalculateByChildren" :rules="ChildrenItem">
                <el-radio-group v-model="formData.halfYear.isCalculateByChildren">
                  <el-radio class="radio" label="Y">是 </el-radio>
                  <el-radio class="radio" label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
            <td v-if="!isShowArr.includes('3') || formData.halfYear.isCalculateByChildren==='N'">是否制定计划</td>
            <td v-if="!isShowArr.includes('3') || formData.halfYear.isCalculateByChildren==='N'">
              <el-form-item prop="halfYear.isMakePlan" :rules="requireItem">
                <el-radio-group v-model="formData.halfYear.isMakePlan">
                  <el-radio class="radio" label="Y">是 </el-radio>
                  <el-radio class="radio" label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>计划设置</th>
            <td v-if="this.formData.halfYear.period.includes('9')">上半年计划启动日期</td>
            <td v-if="this.formData.halfYear.period.includes('9')">
              <el-form-item prop="halfYear.lastPlanBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.halfYear.lastPlanBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="lastPlanPickerOptions"
                  @change="lastPlan4nextPlan"
                >
                </el-date-picker>
              </el-form-item>
            </td>
            <td v-if="this.formData.halfYear.period.includes('18')">下半年计划启动日期</td>
            <td v-if="this.formData.halfYear.period.includes('18')">
              <el-form-item prop="halfYear.nextPlanBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.halfYear.nextPlanBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="nextPlanPickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="!isShowArr.includes('3') || formData.halfYear.isCalculateByChildren==='N'">
            <th rowspan="3">评估设置</th>
            <td>自评权重</td>
            <td>
              <el-form-item
                prop="halfYear.selfEvaluationWeight"
                :rules="halfYearPercentRule">
                <el-input v-model.trim="formData.halfYear.selfEvaluationWeight" placeholder="请输入内容" @change="autoHalfYearleaderEvaluationWeight">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </td>
            <td>复评权重</td>
            <td>
              <el-form-item
                prop="halfYear.leaderEvaluationWeight"
                :rules="halfYearPercentRule">
                <el-input v-model.trim="formData.halfYear.leaderEvaluationWeight" placeholder="请输入内容" @change="autoHalfYearSelfEvaluationWeight">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="isShowLastHalfYear">
            <td>上半年开始评估日期</td>
            <td>
              <el-form-item prop="halfYear.lastEvaluationBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.halfYear.lastEvaluationBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="lastStartPickerOptions"
                  @change="lastLalfYearBeginEvaluation"
                >
                </el-date-picker>
              </el-form-item>
            </td>
            <td>上半年停止评估日期 </td>
            <td>
              <el-form-item prop="halfYear.lastEvaluationEndDate" :rules="date">
                <el-date-picker
                  v-model="formData.halfYear.lastEvaluationEndDate"
                  type="date"
                  placeholder=""
                  :picker-options="lastEndPickerOptions"
                  @change="lastHalfYearEndEvaluation"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="isShowNextHalfYear">
            <td>下半年开始评估日期</td>
            <td>
              <el-form-item prop="halfYear.nextEvaluationBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.halfYear.nextEvaluationBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="nextStartPickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </td>
            <td>下半年停止评估日期 </td>
            <td>
              <el-form-item prop="halfYear.nextEvaluationEndDate" :rules="date">
                <el-date-picker
                  v-model="formData.halfYear.nextEvaluationEndDate"
                  type="date"
                  placeholder=""
                  :picker-options="nextEndPickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
        </table>
      </yh-cl-item>
      <yh-cl-item v-if="formData.checkedPeriod.includes('4')" title="年度考核设置" index=3>
        <table border="1" class="el-table">
          <tr>
            <th class="width-20">基本设置</th>
            <td v-if="isShowArr.includes('4')">是否合并子周期</td>
            <td v-if="isShowArr.includes('4')">
              <el-form-item prop="year.isCalculateByChildren" :rules="ChildrenItem">
                <el-radio-group v-model="formData.year.isCalculateByChildren">
                  <el-radio class="radio" label="Y">是 </el-radio>
                  <el-radio class="radio" label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>

            <td v-if="!isShowArr.includes('4') || formData.year.isCalculateByChildren==='N'">是否制定计划</td>
            <td v-if="!isShowArr.includes('4') || formData.year.isCalculateByChildren==='N'">
              <el-form-item prop="year.isMakePlan" :rules="requireItem">
                <el-radio-group v-model="formData.year.isMakePlan">
                  <el-radio class="radio" label="Y">是 </el-radio>
                  <el-radio class="radio" label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>

          <tr>
            <th>计划设置</th>
            <td>计划启动日期</td>
            <td>
              <el-form-item prop="year.planBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.year.planBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="yearPlanPickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="!isShowArr.includes('4') || formData.year.isCalculateByChildren==='N'">
            <th rowspan="2">评估设置</th>
            <td>自评权重</td>
            <td>
              <el-form-item
                prop="year.selfEvaluationWeight"
                :rules="yearPercentRule">
                <el-input v-model.trim="formData.year.selfEvaluationWeight" placeholder="请输入内容" @change="autoYearleaderEvaluationWeight">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </td>
            <td>复评权重</td>
            <td>
              <el-form-item
                prop="year.leaderEvaluationWeight"
                :rules="yearPercentRule">
                <el-input v-model.trim="formData.year.leaderEvaluationWeight" placeholder="请输入内容" @change="autoYearSelfEvaluationWeight">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="isShowYear">
            <td>开始评估日期</td>
            <td>
              <el-form-item prop="year.evaluationBeginDate" :rules="date">
                <el-date-picker
                  v-model="formData.year.evaluationBeginDate"
                  type="date"
                  placeholder=""
                  :picker-options="yearStartPickerOptions"
                  @change="yearEvaluation"
                >
                </el-date-picker>
              </el-form-item>
            </td>
            <td>停止评估日期 </td>
            <td>
              <el-form-item prop="year.evaluationEndDate" :rules="date">
                <el-date-picker
                  v-model="formData.year.evaluationEndDate"
                  type="date"
                  placeholder=""
                  :picker-options="yearEndPickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
        </table>
      </yh-cl-item>
    </yh-cl>
    <el-form-item label="描述" :label-width="'100px'" prop="description">
      <el-input type="textarea" v-model.trim="formData.description" :rows="5"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  import YhCl from 'components/common/collapse/yh-cl'
  import YhClItem from 'components/common/collapse/yh-cl-item'
  import req from 'api/performance/template'
  import { dateAutoSelect } from 'utils/performance'

  import {
    evaluationDirectionDict,
    indicatorTypedDict,
    evaluationTypeDict,
    evaluationMethodDict,
    frequencyTypeDict,
    monthdDict,
    quarterDict,
    halfYearDict
  } from '../../../../../config/dict'
  import { clone } from 'utils/index'

  export default {
    name: 'template-dialog',
    props: ['form', 'value', 'type', 'templateId'],
    data () {
      // 比例验证函数
      var validateKpiPercent = (rule, value, callback) => {
        let totalPercent = 0
        if (Number(value) <= 0) {
          callback(new Error('请输入大于0的数'))
        }
        totalPercent = Number(this.formData.kpi.weight) + Number(this.formData.keyWork.weight)
        if (totalPercent !== 100) {
//          callback(new Error('比例总和必须等于100'))
          callback()
        } else {
          this.$refs.form.validateField('keyWork.weight')
          callback()
        }
      }
      var validateKeyWorkPercent = (rule, value, callback) => {
        let totalPercent = 0
        if (Number(value) <= 0) {
          callback(new Error('请输入大于0的数'))
        }
        totalPercent = Number(this.formData.kpi.weight) + Number(this.formData.keyWork.weight)
        if (totalPercent !== 100) {
          callback(new Error('比例总和必须等于100'))
        } else {
          callback()
        }
      }
      var validateMonthPercent = (rule, value, callback) => {
        let totalPercent = 0
        if (!this.formData.month.selfEvaluationWeight) {
          this.formData.month.selfEvaluationWeight = 0
        }
        if (!this.formData.month.leaderEvaluationWeight) {
          this.formData.month.leaderEvaluationWeight = 0
        }
        if (Number(value) < 0) {
          callback(new Error('请输入大于0的数'))
        }
        totalPercent = Number(this.formData.month.selfEvaluationWeight) + Number(this.formData.month.leaderEvaluationWeight)
        if (totalPercent !== 100) {
          callback(new Error('比例总和必须等于100'))
        } else {
          callback()
        }
      }
      var validateQuarterPercent = (rule, value, callback) => {
        let totalPercent = 0
        if (!this.formData.quarter.selfEvaluationWeight) {
          this.formData.quarter.selfEvaluationWeight = 0
        }
        if (!this.formData.quarter.leaderEvaluationWeight) {
          this.formData.quarter.leaderEvaluationWeight = 0
        }
        if (Number(value) < 0) {
          callback(new Error('请输入大于0的数'))
        }
        totalPercent = Number(this.formData.quarter.selfEvaluationWeight) + Number(this.formData.quarter.leaderEvaluationWeight)
        if (totalPercent !== 100) {
          callback(new Error('比例总和必须等于100'))
        } else {
          callback()
        }
      }
      var validateHalfYearPercent = (rule, value, callback) => {
        let totalPercent = 0
        if (!this.formData.halfYear.selfEvaluationWeight) {
          this.formData.halfYear.selfEvaluationWeight = 0
        }
        if (!this.formData.halfYear.leaderEvaluationWeight) {
          this.formData.halfYear.leaderEvaluationWeight = 0
        }
        if (Number(value) < 0) {
          callback(new Error('请输入大于0的数'))
        }
        totalPercent = Number(this.formData.halfYear.selfEvaluationWeight) + Number(this.formData.halfYear.leaderEvaluationWeight)
        if (totalPercent !== 100) {
          callback(new Error('比例总和必须等于100'))
        } else {
          callback()
        }
      }
      var validateYearPercent = (rule, value, callback) => {
        let totalPercent = 0
        if (!this.formData.year.selfEvaluationWeight) {
          this.formData.year.selfEvaluationWeight = 0
        }
        if (!this.formData.year.leaderEvaluationWeight) {
          this.formData.year.leaderEvaluationWeight = 0
        }
        if (Number(value) < 0) {
          callback(new Error('请输入大于0的数'))
        }
        totalPercent = Number(this.formData.year.selfEvaluationWeight) + Number(this.formData.year.leaderEvaluationWeight)
        if (totalPercent !== 100) {
          callback(new Error('比例总和必须等于100'))
        } else {
          callback()
        }
      }
      var validateIsChecked = (rule, value, callback) => {
        if (this.formData.kpi.isChecked === true || this.formData.keyWork.isChecked === true) {
          callback()
        } else {
          callback(new Error('请至少选择一项指标'))
        }
      }
      // 验证不能为所有空格
      var spaceValidate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入绩效模版名称'))
        } else if (value.replace(/\s+/g, '').length === 0) {
          callback(new Error('所有的字符不能都为空格'))
        } else if (value.length > 128) {
          callback(new Error('长度最大为128个字符'))
        } else {
          callback()
        }
      }
      return {
        evaluationDirectionDict: evaluationDirectionDict,
        indicatorTypedDict: indicatorTypedDict,
        evaluationTypeDict: evaluationTypeDict,
        evaluationMethodDict: evaluationMethodDict,
        frequencyTypeDict: frequencyTypeDict,
        monthdDict: monthdDict,
        quarterDict: quarterDict,
        halfYearDict: halfYearDict,
        allYearSelected: null, // 控制按月设置时是否全年选择
        isIndeterminate: false, // eleme全选控制值
        cacheContentsDict: [],
        visible: false,
        standardALlList: [],
        formData: {},
        rules: {
          name: [
            {validator: spaceValidate, trigger: 'change'}
          ],
          description: [
            {min: 1, max: 255, message: '长度最大为255个字符', trigger: 'blur'}
          ],
          evaluationMethod: [
            {required: true, message: '请选择评估方法', trigger: 'change'}
          ],
          standardId: [
            {required: true, message: '请选择评估方法', trigger: 'change'}
          ],
          checkedPeriod: [
            {type: 'array', required: true, message: '请至少选择一个考核周期', trigger: 'change'}
          ],
          weight: {
            required: true, message: '请输入指标权重', trigger: 'blur'
          }
        },
        kpiPercentRule: {
          validator: validateKpiPercent, trigger: 'blur'
        },
        keyWorkPercentRule: {
          validator: validateKeyWorkPercent, trigger: 'blur'
        },
        monthPercentRule: {
          validator: validateMonthPercent, trigger: 'blur'
        },
        quarterPercentRule: {
          validator: validateQuarterPercent, trigger: 'blur'
        },
        halfYearPercentRule: {
          validator: validateHalfYearPercent, trigger: 'blur'
        },
        yearPercentRule: {
          validator: validateYearPercent, trigger: 'blur'
        },
        isCheckedRule: {
          validator: validateIsChecked, trigger: 'change'
        },
        periodRule: [
          {type: 'array', required: true, message: '请至少选择一项', trigger: 'change'}
        ],
        requireItem: [
          {required: true, message: '请选择制定计划', trigger: 'change'}
        ],
        ChildrenItem: [
          {required: true, message: '请选择是否合并', trigger: 'change'}
        ],
        // 月份选择当前日期
        monthCurrent: [
          {required: true, message: '请选择月份', trigger: 'change'}
        ],
        // 月份处
        dayCurrent: [
          {type: 'number', required: true, message: '请选择日期', trigger: 'change'}
        ],
        date: [
          {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
        ],
        beginTime: 0,
        totalDay: [],
        totalPlanStart: [],
        totalPlanEnd: [],
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        // 第一季度计划启动时间控件限制输入时间范围
        firstPlanPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.firstEvaluationBeginDate && this.formData.quarter.firstEvaluationBeginDate.getTime && (time.getTime() > this.formData.quarter.firstEvaluationBeginDate.getTime()))
          }
        },
        // 第一季度开始启动时间控件限制输入时间范围
        firstStartpickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.firstEvaluationEndDate && this.formData.quarter.firstEvaluationEndDate.getTime && (time.getTime() > this.formData.quarter.firstEvaluationEndDate.getTime())) || (this.formData.quarter.firstPlanBeginDate && this.formData.quarter.firstPlanBeginDate.getTime && (time.getTime() < this.formData.quarter.firstPlanBeginDate.getTime()))
          }
        },
        // 第一季结束时间控件限制输入时间范围

        firstEndpickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.firstEvaluationBeginDate && this.formData.quarter.firstEvaluationBeginDate.getTime && (time.getTime() < this.formData.quarter.firstEvaluationBeginDate.getTime())) || (this.formData.quarter.firstPlanBeginDate && this.formData.quarter.firstPlanBeginDate.getTime && (time.getTime() < this.formData.quarter.firstPlanBeginDate.getTime()))
          }
        },
        // 第二季度计划启动时间控件限制输入时间范围
        secondPlanPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.secondEvaluationBeginDate && this.formData.quarter.secondEvaluationBeginDate.getTime && (time.getTime() > this.formData.quarter.secondEvaluationBeginDate.getTime()))
          }
        },
        // 第二季度开始启动时间控件限制输入时间范围
        secondStartpickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.secondEvaluationEndDate && this.formData.quarter.secondEvaluationEndDate.getTime && (time.getTime() > this.formData.quarter.secondEvaluationEndDate.getTime())) || (this.formData.quarter.secondPlanBeginDate && this.formData.quarter.secondPlanBeginDate.getTime && (time.getTime() < this.formData.quarter.secondPlanBeginDate.getTime()))
          }
        },
        // 第二季度结束时间控件限制输入时间范围
        secondEndpickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.secondEvaluationBeginDate && this.formData.quarter.secondEvaluationBeginDate.getTime && (time.getTime() < this.formData.quarter.secondEvaluationBeginDate.getTime())) || (this.formData.quarter.secondPlanBeginDate && this.formData.quarter.secondPlanBeginDate.getTime && (time.getTime() < this.formData.quarter.secondPlanBeginDate.getTime()))
          }
        },
        // 第三季度计划启动时间控件限制输入时间范围
        thirdPlanPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.thirdEvaluationBeginDate && this.formData.quarter.thirdEvaluationBeginDate.getTime && (time.getTime() > this.formData.quarter.thirdEvaluationBeginDate.getTime()))
          }
        },
        // 第三季度计划启动时间控件限制输入时间范围
        thirdStartpickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.thirdEvaluationEndDate && this.formData.quarter.thirdEvaluationEndDate.getTime && (time.getTime() > this.formData.quarter.thirdEvaluationEndDate.getTime())) || (this.formData.quarter.thirdPlanBeginDate && this.formData.quarter.thirdPlanBeginDate.getTime && (time.getTime() < this.formData.quarter.thirdPlanBeginDate.getTime()))
          }
        },
        // 第三季度结束时间控件限制输入时间范围
        thirdEndpickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.thirdEvaluationBeginDate && this.formData.quarter.thirdEvaluationBeginDate.getTime && (time.getTime() < this.formData.quarter.thirdEvaluationBeginDate.getTime())) || (this.formData.quarter.thirdPlanBeginDate && this.formData.quarter.thirdPlanBeginDate.getTime && (time.getTime() < this.formData.quarter.thirdPlanBeginDate.getTime()))
          }
        },
        // 第四季度开始启动时间控件限制输入时间范围
        fourPlanPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.fourEvaluationBeginDate && this.formData.quarter.fourEvaluationBeginDate.getTime && (time.getTime() > this.formData.quarter.fourEvaluationBeginDate.getTime()))
          }
        },
        // 第四季度结束时间空间限制输入时间范围
        fourStartpickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.fourEvaluationEndDate && this.formData.quarter.fourEvaluationEndDate.getTime && (time.getTime() > this.formData.quarter.fourEvaluationEndDate.getTime())) || (this.formData.quarter.fourPlanBeginDate && this.formData.quarter.fourPlanBeginDate.getTime && (time.getTime() < this.formData.quarter.fourPlanBeginDate.getTime()))
          }
        },

        fourEndpickerOptions: {
          disabledDate: (time) => {
            return (this.formData.quarter.fourEvaluationBeginDate && this.formData.quarter.fourEvaluationBeginDate.getTime && (time.getTime() < this.formData.quarter.fourEvaluationBeginDate.getTime())) || (this.formData.quarter.fourPlanBeginDate && this.formData.quarter.fourPlanBeginDate.getTime && (time.getTime() < this.formData.quarter.fourPlanBeginDate.getTime()))
          }
        },
        // 上半年计划启动时间控件限制输入时间范围
        lastPlanPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.halfYear.lastEvaluationBeginDate && this.formData.halfYear.lastEvaluationBeginDate.getTime && (time.getTime() > this.formData.halfYear.lastEvaluationBeginDate.getTime()))
          }
        },
        // 上半年开始评估时间控件限制输入时间范围
        lastStartPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.halfYear.lastPlanBeginDate && this.formData.halfYear.lastPlanBeginDate.getTime && (time.getTime() < this.formData.halfYear.lastPlanBeginDate.getTime())) || (this.formData.halfYear.lastEvaluationEndDate && this.formData.halfYear.lastEvaluationEndDate.getTime && (time.getTime() > this.formData.halfYear.lastEvaluationEndDate.getTime()))
          }
        },
        // 上半年结束评估时间控件限制输入时间范围
        lastEndPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.halfYear.lastEvaluationBeginDate && this.formData.halfYear.lastEvaluationBeginDate.getTime && (time.getTime() < this.formData.halfYear.lastEvaluationBeginDate.getTime())) || (this.formData.halfYear.lastPlanBeginDate && this.formData.halfYear.lastPlanBeginDate.getTime && (time.getTime() < this.formData.halfYear.lastPlanBeginDate.getTime()))
          }
        },
        // 下半年计划启动时间控件限制输入时间范围
        nextPlanPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.halfYear.nextEvaluationBeginDate && this.formData.halfYear.nextEvaluationBeginDate.getTime && (time.getTime() > this.formData.halfYear.nextEvaluationBeginDate.getTime()))
          }
        },
        // 下半年开始评估时间控件限制输入时间范围
        nextStartPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.halfYear.nextPlanBeginDate && this.formData.halfYear.nextPlanBeginDate.getTime && (time.getTime() < this.formData.halfYear.nextPlanBeginDate.getTime())) || (this.formData.halfYear.nextEvaluationEndDate && this.formData.halfYear.nextEvaluationEndDate.getTime && (time.getTime() > this.formData.halfYear.nextEvaluationEndDate.getTime()))
          }
        },
        //  下半年结束评估时间控件限制输入时间范围
        nextEndPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.halfYear.nextEvaluationBeginDate && this.formData.halfYear.nextEvaluationBeginDate.getTime && (time.getTime() < this.formData.halfYear.nextEvaluationBeginDate.getTime())) || (this.formData.halfYear.nextPlanBeginDate && this.formData.halfYear.nextPlanBeginDate.getTime && (time.getTime() < this.formData.halfYear.nextPlanBeginDate.getTime()))
          }
        },
        // 年度计划时间控件限制输入时间范围
        yearPlanPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.year.evaluationBeginDate && this.formData.year.evaluationBeginDate.getTime && (time.getTime() > this.formData.year.evaluationBeginDate.getTime()))
          }
        },
        // 年度开始评估时间控件限制输入时间范围
        yearStartPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.year.planBeginDate && this.formData.year.planBeginDate.getTime && (time.getTime() < this.formData.year.planBeginDate.getTime())) || (this.formData.year.evaluationEndDate && this.formData.year.evaluationEndDate.getTime && (time.getTime() > this.formData.year.evaluationEndDate.getTime()))
          }
        },
        // 年度结束评估时间控件限制输入时间范围
        yearEndPickerOptions: {
          disabledDate: (time) => {
            return (this.formData.year.evaluationBeginDate && this.formData.year.evaluationBeginDate.getTime && (time.getTime() < this.formData.year.evaluationBeginDate.getTime())) || (this.formData.year.planBeginDate && this.formData.year.planBeginDate.getTime && (time.getTime() < this.formData.year.planBeginDate.getTime()))
          }
        }
      }
    },
    components: {
      YhCl,
      YhClItem
    },
    created () {
      this.formData = clone(this.form)
      this.getStandard()
      this.monthChange(this.formData.month.isCurrent4PlanStart)
    },
    computed: {
      title () {
        return this.type ? '修改' : '新增'
      },
      isShowArr () {
        if (this.formData.checkedPeriod.length <= 1) {
          return []
        } else {
          let arr = []
          this.formData.checkedPeriod.sort()
          for (let i = 1; i < this.formData.checkedPeriod.length; i++) {
            arr.push(this.formData.checkedPeriod[i])
          }
          return arr
        }
      },
      isShowQuarter1 () {
        if (!this.isShowArr.includes('2')) {
//          if (this.formData.quarter.period.includes('4')) {
          return this.formData.quarter.period.includes('4')
//          }
//          return true
//          }
        } else {
          return this.formData.quarter.isCalculateByChildren === 'N' && this.formData.quarter.period.includes('4')
        }
      },
      isShowQuarter2 () {
        if (!this.isShowArr.includes('2')) {
//          if (this.formData.quarter.isCalculateByChildren === 'N' && this.formData.quarter.period.includes('8')) {
          return this.formData.quarter.period.includes('8')
//          }
        } else {
          return this.formData.quarter.isCalculateByChildren === 'N' && this.formData.quarter.period.includes('8')
        }
      },
      isShowQuarter3 () {
        if (!this.isShowArr.includes('2')) {
//          if (this.formData.quarter.isCalculateByChildren === 'N' && this.formData.quarter.period.includes('13')) {
          return this.formData.quarter.period.includes('13')
//          }
        } else {
          return this.formData.quarter.isCalculateByChildren === 'N' && this.formData.quarter.period.includes('13')
        }
      },
      isShowQuarter4 () {
        if (!this.isShowArr.includes('2')) {
//          if (this.formData.quarter.isCalculateByChildren === 'N' && this.formData.quarter.period.includes('17')) {
          return this.formData.quarter.period.includes('17')
//          }
        } else {
          return this.formData.quarter.isCalculateByChildren === 'N' && this.formData.quarter.period.includes('17')
        }
      },

      isShowLastHalfYear () {
        if (!this.isShowArr.includes('3')) {
          return this.formData.halfYear.period.includes('9')
        } else {
          return this.formData.halfYear.isCalculateByChildren === 'N' && this.formData.halfYear.period.includes('9')
        }
      },
      isShowNextHalfYear () {
        if (!this.isShowArr.includes('3')) {
          return this.formData.halfYear.period.includes('18')
        } else {
          return this.formData.halfYear.isCalculateByChildren === 'N' && this.formData.halfYear.period.includes('18')
        }
      },
      isShowYear () {
        if (!this.isShowArr.includes('4')) {
          return this.formData.year.period.includes('19')
        } else {
          return this.formData.year.isCalculateByChildren === 'N' && this.formData.year.period.includes('19')
        }
      }
    },
    watch: {
      value () {
        this.visible = this.value
      },
      form (val) {
        this.formData = clone(this.form)
        this.monthChange(this.formData.month.isCurrent4PlanStart)
//        this.planStartChange(this.formData.month.isCurrent4EvaluationBegin)
//        this.planEndChange(this.formData.month.isCurrent4EvaluationEnd)
      },
      'formData.month.period': {
        handler: function (newVal, oldVal) {
          console.log(newVal.length)
          let len = newVal.length
          this.allYearSelected = len === monthdDict.length
        },
        deep: true
      }
    },
    methods: {
      // 按月评分的全选回调
      handleAllYearSelected (event) {
        this.formData.month.period = event ? monthdDict.map(ele => ele.value) : []
        this.isIndeterminate = !this.isIndeterminate
      },

      // 月度自评复评比例
      autoMonthleaderEvaluationWeight () {
        this.formData.month.leaderEvaluationWeight =
          100 - this.formData.month.selfEvaluationWeight >= 0
            ? this.perceiseCalculate(100, this.formData.month.selfEvaluationWeight)
            : 0
      },
      autoMonthSelfEvaluationWeight () {
        this.formData.month.selfEvaluationWeight =
          100 - this.formData.month.leaderEvaluationWeight >= 0
            ? this.perceiseCalculate(100, this.formData.month.leaderEvaluationWeight)
            : 0
      },
      // 精确计算
      perceiseCalculate (num1, num2) {
        const num1Digits = (num1.toString().split('.')[1] || '').length
        const num2Digits = (num2.toString().split('.')[1] || '').length
        const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits))
        return (num1 * baseNum - num2 * baseNum) / baseNum
      },
      // 季度自评复评比例
      autoQuarterleaderEvaluationWeight () {
        this.formData.quarter.leaderEvaluationWeight =
          100 - this.formData.quarter.selfEvaluationWeight >= 0
            ? 100 - this.formData.quarter.selfEvaluationWeight
            : 0
      },
      autoQuarterSelfEvaluationWeight () {
        this.formData.quarter.selfEvaluationWeight =
          100 - this.formData.quarter.leaderEvaluationWeight >= 0
            ? 100 - this.formData.quarter.leaderEvaluationWeight
            : 0
      },
      // 半年度自评复评比例
      autoHalfYearleaderEvaluationWeight () {
        this.formData.halfYear.leaderEvaluationWeight =
          100 - this.formData.halfYear.selfEvaluationWeight >= 0
            ? 100 - this.formData.halfYear.selfEvaluationWeight
            : 0
      },
      autoHalfYearSelfEvaluationWeight () {
        this.formData.halfYear.selfEvaluationWeight =
          100 - this.formData.halfYear.leaderEvaluationWeight >= 0
            ? 100 - this.formData.halfYear.leaderEvaluationWeight
            : 0
      },
      // 年度自评复评比例
      autoYearleaderEvaluationWeight () {
        this.formData.year.leaderEvaluationWeight =
          100 - this.formData.year.selfEvaluationWeight >= 0
            ? 100 - this.formData.year.selfEvaluationWeight
            : 0
      },
      autoYearSelfEvaluationWeight () {
        this.formData.year.selfEvaluationWeight =
          100 - this.formData.year.leaderEvaluationWeight >= 0
            ? 100 - this.formData.year.leaderEvaluationWeight
            : 0
      },
      getCountDays (val) {
        let d = new Date()
        // d.getMonth()+1代表下个月，月份索引从0开始，即当前月为6月时，getMonth()返回值为5，创建日期时同理
        // 此处构造的日期为下个月的第0天，天数索引从1开始，第0天即代表上个月的最后一天
        let curMonthDays = new Date(d.getFullYear(), (d.getMonth() + val), 0).getDate()
        return curMonthDays
      },
      // 月度计划日期
      monthChange (val) {
        this.totalDay = []
        if (val === 'N') {
          let total = this.getCountDays(0)
          for (let i = 1; i <= total; i++) {
            this.totalDay.push({value: i})
          }
        } else {
          let total = this.getCountDays(1)
          for (let i = 1; i <= total; i++) {
            this.totalDay.push({value: i})
          }
        }
        // zhengwq5 2017/12/9 rechoice format
        // this.formData.month.isCurrent4EvaluationBegin = ''
        // this.formData.month.evaluationBeginDay = ''
        // this.formData.month.isCurrent4EvaluationEnd = ''
        // this.formData.month.evaluationEndDay = ''
        this.planStartChange(this.formData.month.isCurrent4EvaluationBegin)
      },
      // 月度计划日改变
      dayPlanChange () {
        // zhengwq5 2017/12/9 rechoice format
        this.formData.month.evaluationBeginDay = ''
        this.planStartChange(this.formData.month.isCurrent4EvaluationBegin)
      },
      // 月度开始启动月改变
      planStartChange (val) {
        let planBeginDay = this.formData.month.planBeginDay
        let isCurrent4PlanStart = this.formData.month.isCurrent4PlanStart
        let total
        if (val === 'N') {
          total = this.getCountDays(0)
          this.totalPlanStart = []
          if (isCurrent4PlanStart === val) {
            for (let i = 1; i <= total; i++) {
              // zhengwq5 2017/12/9 < => <=
              if (i <= planBeginDay) {
                this.totalPlanStart.push({value: i, disabled: true})
              } else {
                this.totalPlanStart.push({value: i})
              }
            }
            this.planEndChange(this.formData.month.isCurrent4EvaluationEnd)
            return
          } else {
            for (let i = 1; i <= total; i++) {
              this.totalPlanStart.push({value: i, disabled: true})
            }
            this.planEndChange(this.formData.month.isCurrent4EvaluationEnd)
          }
        } else {
          total = this.getCountDays(1)
          this.totalPlanStart = []
          if (isCurrent4PlanStart === val) {
            for (let i = 1; i <= total; i++) {
              // zhengwq5 2017/12/9 < => <=
              if (i <= planBeginDay) {
                this.totalPlanStart.push({value: i, disabled: true})
              } else {
                this.totalPlanStart.push({value: i})
              }
            }
            this.planEndChange(this.formData.month.isCurrent4EvaluationEnd)
            return
          } else {
            for (let i = 1; i <= total; i++) {
              this.totalPlanStart.push({value: i})
            }
            this.planEndChange(this.formData.month.isCurrent4EvaluationEnd)
          }
        }
        // zhengwq5 2017/12/9 rechoice format
        this.formData.month.isCurrent4EvaluationEnd = ''
        this.formData.month.evaluationEndDay = ''
      },
      // 月度开始日改变
      daystartChange () {
        // zhengwq5 2017/12/9 rechoice format
        this.formData.month.evaluationEndDay = ''
        this.planEndChange(this.formData.month.isCurrent4EvaluationEnd)
      },
      // 月度结束月改变
      planEndChange (val) {
        let evaluationBeginDay = this.formData.month.evaluationBeginDay
        let isCurrent4EvaluationBegin = this.formData.month.isCurrent4EvaluationBegin
        let total
        if (val === 'N') {
          total = this.getCountDays(0)
          this.totalPlanEnd = []
          if (isCurrent4EvaluationBegin === val) {
            for (let i = 1; i <= total; i++) {
              // zhengwq5 2017/12/9 < => <=
              if (i <= evaluationBeginDay) {
                this.totalPlanEnd.push({value: i, disabled: true})
              } else {
                this.totalPlanEnd.push({value: i})
              }
            }
            return
          } else {
            for (let i = 1; i <= total; i++) {
              this.totalPlanEnd.push({value: i, disabled: true})
            }
          }
        } else {
          total = this.getCountDays(1)
          this.totalPlanEnd = []
          if (isCurrent4EvaluationBegin === val) {
            for (let i = 1; i <= total; i++) {
              // zhengwq5 2017/12/9 < => <=
              if (i <= evaluationBeginDay) {
                this.totalPlanEnd.push({value: i, disabled: true})
              } else {
                this.totalPlanEnd.push({value: i})
              }
            }
            return
          } else {
            for (let i = 1; i <= total; i++) {
              this.totalPlanEnd.push({value: i})
            }
          }
        }
      },
      // 获取绩效标准列表
      getStandard () {
        req('standardsOpenList').then((data) => {
          this.standardALlList = data
        })
      },
      // kpi 默认勾选一项是百分百
      kpiCheckChange () {
        this.$refs.form.validateField('checked')
        if (!this.formData.kpi.isChecked) {
          this.formData.kpi.weight = 0
          if (this.formData.keyWork.isChecked) {
            this.formData.keyWork.weight = 100
          } else {
            this.formData.keyWork.weight = 0
          }
        }
        if (this.formData.kpi.isChecked && (!this.formData.keyWork.isChecked)) {
          this.formData.kpi.weight = 100
          this.formData.keyWork.weight = 0
        }
        if (this.formData.kpi.isChecked && this.formData.keyWork.isChecked) {
          this.formData.kpi.weight = 0
          this.formData.keyWork.weight = 0
        }
      },
      // 重点工作 默认勾选一项是百分百
      keyWorkCheckChange () {
        this.$refs.form.validateField('checked')
        if (!this.formData.keyWork.isChecked) {
          this.formData.keyWork.weight = 0
          if (this.formData.kpi.isChecked) {
            this.formData.kpi.weight = 100
          } else {
            this.formData.kpi.weight = 0
          }
        }
        if (this.formData.keyWork.isChecked && (!this.formData.kpi.isChecked)) {
          this.formData.kpi.weight = 0
          this.formData.keyWork.weight = 100
        }
        if (this.formData.kpi.isChecked && this.formData.keyWork.isChecked) {
          this.formData.kpi.weight = 0
          this.formData.keyWork.weight = 0
        }
      },
      // 季度修改的事件
      quarterChange () {
//        if (!this.formData.quarter.period.includes('8')) {
//          this.formData.quarter.secondEvaluationBeginDate = ''
//          this.formData.quarter.secondEvaluationEndDate = ''
//          this.formData.quarter.secondPlanBeginDate = ''
//        }
//        if (!this.formData.quarter.period.includes('13')) {
//          this.formData.quarter.thirdEvaluationBeginDate = ''
//          this.formData.quarter.thirdEvaluationEndDate = ''
//          this.formData.quarter.thirdPlanBeginDate = ''
//        }
      },
      halfYearChange () {
//        if (!this.formData.halfYear.period.includes('9')) {
//          this.formData.halfYear.lastEvaluationBeginDate = ''
//          this.formData.halfYear.nextEvaluationBeginDate = ''
//          this.formData.halfYear.lastPlanBeginDate = ''
//        }
      },
      // 选择年开始评估日期，自动选择结束日期
      yearEvaluation () {
        if (this.formData.year.evaluationBeginDate) {
          this.formData.year.evaluationEndDate = dateAutoSelect(this.formData.year.evaluationBeginDate, 12)
        }
      },
      // 选择上半年计划评估日期，自动选择下半年计划评估日期
      lastPlan4nextPlan () {
        if (this.formData.halfYear.lastPlanBeginDate) {
          this.formData.halfYear.nextPlanBeginDate = dateAutoSelect(this.formData.halfYear.lastPlanBeginDate, 6)
        }
      },
      // 选择上半年开始评估日期，自动选择下半年开始日期
      lastLalfYearBeginEvaluation () {
        if (this.formData.halfYear.lastEvaluationBeginDate) {
          this.formData.halfYear.nextEvaluationBeginDate = dateAutoSelect(this.formData.halfYear.lastEvaluationBeginDate, 6)
        }
      },
      // 选择上半年结束评估日期，自动选择下半年结束日期
      lastHalfYearEndEvaluation () {
        if (this.formData.halfYear.lastEvaluationEndDate) {
          this.formData.halfYear.nextEvaluationEndDate = dateAutoSelect(this.formData.halfYear.lastEvaluationEndDate, 6)
        }
      },
      plan4First () {
        if (this.formData.quarter.firstPlanBeginDate) {
          this.formData.quarter.secondPlanBeginDate = dateAutoSelect(this.formData.quarter.firstPlanBeginDate, 3)
          this.formData.quarter.thirdPlanBeginDate = dateAutoSelect(this.formData.quarter.secondPlanBeginDate, 3)
          this.formData.quarter.fourPlanBeginDate = dateAutoSelect(this.formData.quarter.thirdPlanBeginDate, 3)
        }
      },
      plan4Second () {
        if (this.formData.quarter.secondPlanBeginDate) {
          this.formData.quarter.thirdPlanBeginDate = dateAutoSelect(this.formData.quarter.secondPlanBeginDate, 3)
          this.formData.quarter.fourPlanBeginDate = dateAutoSelect(this.formData.quarter.thirdPlanBeginDate, 3)
        }
      },
      plan4Third () {
        if (this.formData.quarter.thirdPlanBeginDate) {
          this.formData.quarter.fourPlanBeginDate = dateAutoSelect(this.formData.quarter.thirdPlanBeginDate, 3)
        }
      },
      start4First () {
        if (this.formData.quarter.firstEvaluationBeginDate) {
          this.formData.quarter.secondEvaluationBeginDate = dateAutoSelect(this.formData.quarter.firstEvaluationBeginDate, 3)
          this.formData.quarter.thirdEvaluationBeginDate = dateAutoSelect(this.formData.quarter.secondEvaluationBeginDate, 3)
          this.formData.quarter.fourEvaluationBeginDate = dateAutoSelect(this.formData.quarter.thirdEvaluationBeginDate, 3)
        }
      },
      start4Second () {
        if (this.formData.quarter.secondEvaluationBeginDate) {
          this.formData.quarter.thirdEvaluationBeginDate = dateAutoSelect(this.formData.quarter.secondEvaluationBeginDate, 3)
          this.formData.quarter.fourEvaluationBeginDate = dateAutoSelect(this.formData.quarter.thirdEvaluationBeginDate, 3)
        }
      },
      start4Third () {
        if (this.formData.quarter.thirdEvaluationBeginDate) {
          this.formData.quarter.fourEvaluationBeginDate = dateAutoSelect(this.formData.quarter.thirdEvaluationBeginDate, 3)
        }
      },
      end4First () {
        if (this.formData.quarter.firstEvaluationEndDate) {
          this.formData.quarter.secondEvaluationEndDate = dateAutoSelect(this.formData.quarter.firstEvaluationEndDate, 3)
          this.formData.quarter.thirdEvaluationEndDate = dateAutoSelect(this.formData.quarter.secondEvaluationEndDate, 3)
          this.formData.quarter.fourEvaluationEndDate = dateAutoSelect(this.formData.quarter.thirdEvaluationEndDate, 3)
        }
      },
      end4Second () {
        if (this.formData.quarter.secondEvaluationEndDate) {
          this.formData.quarter.thirdEvaluationEndDate = dateAutoSelect(this.formData.quarter.secondEvaluationEndDate, 3)
          this.formData.quarter.fourEvaluationEndDate = dateAutoSelect(this.formData.quarter.thirdEvaluationEndDate, 3)
        }
      },
      end4Third () {
        if (this.formData.quarter.thirdEvaluationEndDate) {
          this.formData.quarter.fourEvaluationEndDate = dateAutoSelect(this.formData.quarter.thirdEvaluationEndDate, 3)
        }
      },
      ensure (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.formData.contents = []
            if (this.formData.kpi.isChecked === true) {
              this.formData.contents.push({
                checkContentType: '1',
                weight: this.formData.kpi.weight,
                isChecked: true
              })
            }
            if (this.formData.keyWork.isChecked === true) {
              this.formData.contents.push({
                checkContentType: '2',
                weight: this.formData.keyWork.weight,
                isChecked: true
              })
            }
            if (this.formData.keyEvent.isChecked === true) {
              this.formData.contents.push({
                checkContentType: '3',
                isChecked: true
              })
            }
            if (this.formData.evaluationMethod === '2') {
              this.formData.standardId = null
            }
            // 处理月份后台所要的数据格式
            let monthArr = []
            if (this.formData.month.period.length) {
              this.formData.month.period.forEach((val, index) => {
                monthArr.push({...this.formData.month, period: val})
              })
            }
            // 处理季度后台所要的数据格式
            if (this.formData.quarter.isCalculateByChildren === 'Y') {
              this.formData.quarter = {
                evaluationBeginDate: '',
                evaluationEndDate: '',
                isMakePlan: '',
                leaderEvaluationWeight: 0,
                period: this.formData.quarter.period,
                firstPlanBeginDate: this.formData.quarter.firstPlanBeginDate,
                secondPlanBeginDate: this.formData.quarter.secondPlanBeginDate,
                thirdPlanBeginDate: this.formData.quarter.thirdPlanBeginDate,
                fourPlanBeginDate: this.formData.quarter.fourPlanBeginDate,
                selfEvaluationWeight: 0,
                isCalculateByChildren: this.formData.quarter.isCalculateByChildren,
                firstEvaluationBeginDate: '',
                firstEvaluationEndDate: '',
                fourEvaluationBeginDate: '',
                fourEvaluationEndDate: '',
                secondEvaluationBeginDate: '',
                secondEvaluationEndDate: '',
                thirdEvaluationBeginDate: '',
                thirdEvaluationEndDate: '',
                isChecked: false
              }
            }
            let quarterArr = []
            let firstQuarter = {
              evaluationBeginDate: this.formData.quarter.firstEvaluationBeginDate,
              evaluationEndDate: this.formData.quarter.firstEvaluationEndDate,
              planBeginDate: this.formData.quarter.firstPlanBeginDate
            }
            let secondQuarter = {
              evaluationBeginDate: this.formData.quarter.secondEvaluationBeginDate,
              evaluationEndDate: this.formData.quarter.secondEvaluationEndDate,
              planBeginDate: this.formData.quarter.secondPlanBeginDate
            }
            let thirdQuarter = {
              evaluationBeginDate: this.formData.quarter.thirdEvaluationBeginDate,
              evaluationEndDate: this.formData.quarter.thirdEvaluationEndDate,
              planBeginDate: this.formData.quarter.thirdPlanBeginDate
            }
            let fourQuarter = {
              evaluationBeginDate: this.formData.quarter.fourEvaluationBeginDate,
              evaluationEndDate: this.formData.quarter.fourEvaluationEndDate,
              planBeginDate: this.formData.quarter.fourPlanBeginDate
            }
            delete this.formData.quarter.firstEvaluationBeginDate
            delete this.formData.quarter.firstEvaluationEndDate
            delete this.formData.quarter.secondEvaluationBeginDate
            delete this.formData.quarter.secondEvaluationEndDate
            delete this.formData.quarter.thirdEvaluationBeginDate
            delete this.formData.quarter.thirdEvaluationEndDate
            delete this.formData.quarter.fourEvaluationBeginDate
            delete this.formData.quarter.fourEvaluationEndDate
            delete this.formData.quarter.firstPlanBeginDate
            delete this.formData.quarter.secondPlanBeginDate
            delete this.formData.quarter.thirdPlanBeginDate
            delete this.formData.quarter.fourPlanBeginDate
            if (this.formData.quarter.period.length) {
              this.formData.quarter.period.forEach((val, index) => {
                if (val === '4') {
                  quarterArr.push({...this.formData.quarter, period: val, ...firstQuarter})
                } else if (val === '8') {
                  quarterArr.push({...this.formData.quarter, period: val, ...secondQuarter})
                } else if (val === '13') {
                  quarterArr.push({...this.formData.quarter, period: val, ...thirdQuarter})
                } else if (val === '17') {
                  quarterArr.push({...this.formData.quarter, period: val, ...fourQuarter})
                }
              })
            }

            // 处理半年度后台所要的数据格式
            if (this.formData.halfYear.isCalculateByChildren === 'Y') {
              this.formData.halfYear = {
                evaluationBeginDate: '',
                evaluationEndDate: '',
                isCalculateByChildren: this.formData.halfYear.isCalculateByChildren,
                isMakePlan: '',
                leaderEvaluationWeight: 0,
                period: this.formData.halfYear.period,
                lastPlanBeginDate: this.formData.halfYear.lastPlanBeginDate,
                nextPlanBeginDate: this.formData.halfYear.nextPlanBeginDate,
                selfEvaluationWeight: 0,
                lastEvaluationBeginDate: '',
                lastEvaluationEndDate: '',
                nextEvaluationBeginDate: '',
                nextEvaluationEndDate: '',
                isChecked: false
              }
            }
            let halfYearArr = []
            let lastHalfYear = {
              evaluationBeginDate: this.formData.halfYear.lastEvaluationBeginDate,
              evaluationEndDate: this.formData.halfYear.lastEvaluationEndDate,
              planBeginDate: this.formData.halfYear.lastPlanBeginDate

            }
            let nextHalfYear = {
              evaluationBeginDate: this.formData.halfYear.nextEvaluationBeginDate,
              evaluationEndDate: this.formData.halfYear.nextEvaluationEndDate,
              planBeginDate: this.formData.halfYear.nextPlanBeginDate
            }
            delete this.formData.halfYear.lastEvaluationBeginDate
            delete this.formData.halfYear.lastEvaluationEndDate
            delete this.formData.halfYear.nextEvaluationBeginDate
            delete this.formData.halfYear.nextEvaluationEndDate
            delete this.formData.halfYear.lastPlanBeginDate
            delete this.formData.halfYear.nextPlanBeginDate
            if (this.formData.halfYear.period.length) {
              this.formData.halfYear.period.forEach((val, index) => {
                if (val === '9') {
                  halfYearArr.push({...this.formData.halfYear, period: val, ...lastHalfYear})
                } else if (val === '18') {
                  halfYearArr.push({...this.formData.halfYear, period: val, ...nextHalfYear})
                }
              })
            }
            // 年度后台需要的值
            if (this.formData.year.isCalculateByChildren === 'Y') {
              this.formData.year = {
                evaluationBeginDate: '',
                evaluationEndDate: '',
                isCalculateByChildren: this.formData.year.isCalculateByChildren,
                isMakePlan: '',
                leaderEvaluationWeight: 0,
                period: this.formData.year.period,
                planBeginDate: this.formData.year.planBeginDate,
                selfEvaluationWeight: 0,
                isChecked: false
              }
            }
            let yearArr = []
            if (this.formData.year.period.length) {
              this.formData.year.period.forEach((val, index) => {
                yearArr.push({...this.formData.year, period: val})
              })
            }
            let templateData = {
              name: this.formData.name,
              contents: this.formData.contents,
              evaluationMethod: this.formData.evaluationMethod,
              standardId: this.formData.standardId,
              description: this.formData.description,
              month: monthArr,
              quarter: quarterArr,
              halfYear: halfYearArr,
              year: yearArr,
              status: this.formData.status
            }
            this.$emit('templateDialogVisible', false, templateData, this.type)
          } else {
            return false
          }
        })
      },
      periodChange (value) {
        if (value.includes('1')) {
          if (!this.formData.month.isChecked) {
            // this.formData.month.period = ['1', '2', '3', '5', '6', '7', '10', '11', '12', '14', '15', '16']
            this.formData.month.isChecked = true
          }
        } else {
          this.formData.month = {
            isCurrent4PlanStart: '',
            planBeginDay: '',
            isMakePlan: '',
            leaderEvaluationWeight: 0,
            period: [],
            selfEvaluationWeight: 0,
            isCurrent4EvaluationBegin: '',
            evaluationBeginDay: '',
            isCurrent4EvaluationEnd: '',
            evaluationEndDay: ''
          }
          this.formData.month.isChecked = false
        }
        if (value.includes('2')) {
          if (!this.formData.quarter.isChecked) {
            // this.formData.quarter.period = ['4', '8', '13', '17']
            this.formData.quarter.isChecked = true
          }
        } else {
          this.formData.quarter = {
            evaluationBeginDate: '',
            evaluationEndDate: '',
            isMakePlan: '',
            leaderEvaluationWeight: 0,
            period: [],
            firstPlanBeginDate: '',
            secondPlanBeginDate: '',
            thirdPlanBeginDate: '',
            fourPlanBeginDate: '',
            selfEvaluationWeight: 0,
            isCalculateByChildren: '',
            firstEvaluationBeginDate: '',
            firstEvaluationEndDate: '',
            fourEvaluationBeginDate: '',
            fourEvaluationEndDate: '',
            secondEvaluationBeginDate: '',
            secondEvaluationEndDate: '',
            thirdEvaluationBeginDate: '',
            thirdEvaluationEndDate: ''
          }
          this.formData.quarter.isChecked = false
        }
        if (value.includes('3')) {
          if (!this.formData.halfYear.isChecked) {
            // this.formData.halfYear.period = ['9', '18']
            this.formData.halfYear.isChecked = true
          }
        } else {
          this.formData.halfYear = {
            evaluationBeginDate: '',
            evaluationEndDate: '',
            isCalculateByChildren: '',
            isMakePlan: '',
            leaderEvaluationWeight: 0,
            period: [],
            lastPlanBeginDate: '',
            nextPlanBeginDate: '',
            selfEvaluationWeight: 0,
            lastEvaluationBeginDate: '',
            lastEvaluationEndDate: '',
            nextEvaluationBeginDate: '',
            nextEvaluationEndDate: ''
          }
          this.formData.halfYear.isChecked = false
        }
        if (value.includes('4')) {
          if (!this.formData.year.isChecked) {
            this.formData.year.period = ['19']
            this.formData.year.isChecked = true
          }
        } else {
          this.formData.year = {
            evaluationBeginDate: '',
            evaluationEndDate: '',
            isCalculateByChildren: '',
            isMakePlan: '',
            leaderEvaluationWeight: 0,
            period: [],
            planBeginDate: '',
            selfEvaluationWeight: 0
          }
          this.formData.year.isChecked = false
        }
      },

      /* 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.formData)
            } else {
              resolve(false)
            }
          })
        })
      },
      // 确认按钮
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              res.contents = []
              if (res.kpi.isChecked === true) {
                res.contents.push({
                  checkContentType: '1',
                  weight: res.kpi.weight,
                  isChecked: true
                })
              }
              if (res.keyWork.isChecked === true) {
                res.contents.push({
                  checkContentType: '2',
                  weight: res.keyWork.weight,
                  isChecked: true
                })
              }
              if (res.keyEvent.isChecked === true) {
                res.contents.push({
                  checkContentType: '3',
                  isChecked: true
                })
              }
              if (res.evaluationMethod === '2') {
                res.standardId = null
              }
              // 处理月份后台所要的数据格式
              let monthArr = []
              if (res.month.period.length) {
                res.month.period.forEach((val, index) => {
                  monthArr.push({...res.month, period: val})
                })
              }
              // 处理季度后台所要的数据格式
              if (res.quarter.isCalculateByChildren === 'Y') {
                res.quarter = {
                  evaluationBeginDate: '',
                  evaluationEndDate: '',
                  isMakePlan: '',
                  leaderEvaluationWeight: 0,
                  period: res.quarter.period,
                  firstPlanBeginDate: res.quarter.firstPlanBeginDate,
                  secondPlanBeginDate: res.quarter.secondPlanBeginDate,
                  thirdPlanBeginDate: res.quarter.thirdPlanBeginDate,
                  fourPlanBeginDate: res.quarter.fourPlanBeginDate,
                  selfEvaluationWeight: 0,
                  isCalculateByChildren: res.quarter.isCalculateByChildren,
                  firstEvaluationBeginDate: '',
                  firstEvaluationEndDate: '',
                  fourEvaluationBeginDate: '',
                  fourEvaluationEndDate: '',
                  secondEvaluationBeginDate: '',
                  secondEvaluationEndDate: '',
                  thirdEvaluationBeginDate: '',
                  thirdEvaluationEndDate: '',
                  isChecked: false
                }
              }
              let quarterArr = []
              let firstQuarter = {
                evaluationBeginDate: res.quarter.firstEvaluationBeginDate,
                evaluationEndDate: res.quarter.firstEvaluationEndDate,
                planBeginDate: res.quarter.firstPlanBeginDate
              }
              let secondQuarter = {
                evaluationBeginDate: res.quarter.secondEvaluationBeginDate,
                evaluationEndDate: res.quarter.secondEvaluationEndDate,
                planBeginDate: res.quarter.secondPlanBeginDate
              }
              let thirdQuarter = {
                evaluationBeginDate: res.quarter.thirdEvaluationBeginDate,
                evaluationEndDate: res.quarter.thirdEvaluationEndDate,
                planBeginDate: res.quarter.thirdPlanBeginDate
              }
              let fourQuarter = {
                evaluationBeginDate: res.quarter.fourEvaluationBeginDate,
                evaluationEndDate: res.quarter.fourEvaluationEndDate,
                planBeginDate: res.quarter.fourPlanBeginDate
              }
              // delete res.quarter.firstEvaluationBeginDate
              // delete res.quarter.firstEvaluationEndDate
              // delete res.quarter.secondEvaluationBeginDate
              // delete res.quarter.secondEvaluationEndDate
              // delete res.quarter.thirdEvaluationBeginDate
              // delete res.quarter.thirdEvaluationEndDate
              // delete res.quarter.fourEvaluationBeginDate
              // delete res.quarter.fourEvaluationEndDate
              // delete res.quarter.firstPlanBeginDate
              // delete res.quarter.secondPlanBeginDate
              // delete res.quarter.thirdPlanBeginDate
              // delete res.quarter.fourPlanBeginDate
              if (res.quarter.period.length) {
                res.quarter.period.forEach((val, index) => {
                  if (val === '4') {
                    quarterArr.push({...res.quarter, period: val, ...firstQuarter})
                  } else if (val === '8') {
                    quarterArr.push({...res.quarter, period: val, ...secondQuarter})
                  } else if (val === '13') {
                    quarterArr.push({...res.quarter, period: val, ...thirdQuarter})
                  } else if (val === '17') {
                    quarterArr.push({...res.quarter, period: val, ...fourQuarter})
                  }
                })
              }

              // 处理半年度后台所要的数据格式
              if (res.halfYear.isCalculateByChildren === 'Y') {
                res.halfYear = {
                  evaluationBeginDate: '',
                  evaluationEndDate: '',
                  isCalculateByChildren: res.halfYear.isCalculateByChildren,
                  isMakePlan: '',
                  leaderEvaluationWeight: 0,
                  period: res.halfYear.period,
                  lastPlanBeginDate: res.halfYear.lastPlanBeginDate,
                  nextPlanBeginDate: res.halfYear.nextPlanBeginDate,
                  selfEvaluationWeight: 0,
                  lastEvaluationBeginDate: '',
                  lastEvaluationEndDate: '',
                  nextEvaluationBeginDate: '',
                  nextEvaluationEndDate: '',
                  isChecked: false
                }
              }
              let halfYearArr = []
              let lastHalfYear = {
                evaluationBeginDate: res.halfYear.lastEvaluationBeginDate,
                evaluationEndDate: res.halfYear.lastEvaluationEndDate,
                planBeginDate: res.halfYear.lastPlanBeginDate

              }
              let nextHalfYear = {
                evaluationBeginDate: res.halfYear.nextEvaluationBeginDate,
                evaluationEndDate: res.halfYear.nextEvaluationEndDate,
                planBeginDate: res.halfYear.nextPlanBeginDate
              }
              // delete res.halfYear.lastEvaluationBeginDate
              // delete res.halfYear.lastEvaluationEndDate
              // delete res.halfYear.nextEvaluationBeginDate
              // delete res.halfYear.nextEvaluationEndDate
              // delete res.halfYear.lastPlanBeginDate
              // delete res.halfYear.nextPlanBeginDate
              if (res.halfYear.period.length) {
                res.halfYear.period.forEach((val, index) => {
                  if (val === '9') {
                    halfYearArr.push({...res.halfYear, period: val, ...lastHalfYear})
                  } else if (val === '18') {
                    halfYearArr.push({...res.halfYear, period: val, ...nextHalfYear})
                  }
                })
              }
              // 年度后台需要的值
              if (res.year.isCalculateByChildren === 'Y') {
                res.year = {
                  evaluationBeginDate: '',
                  evaluationEndDate: '',
                  isCalculateByChildren: res.year.isCalculateByChildren,
                  isMakePlan: '',
                  leaderEvaluationWeight: 0,
                  period: res.year.period,
                  planBeginDate: res.year.planBeginDate,
                  selfEvaluationWeight: 0,
                  isChecked: false
                }
              }
              let yearArr = []
              if (res.year.period.length) {
                res.year.period.forEach((val, index) => {
                  yearArr.push({...res.year, period: val})
                })
              }
              let templateData = {
                name: res.name,
                contents: res.contents,
                evaluationMethod: res.evaluationMethod,
                standardId: res.standardId,
                description: res.description,
                month: monthArr,
                quarter: quarterArr,
                halfYear: halfYearArr,
                year: yearArr,
                status: res.status
              }
              if (this.type) {
                req('modifiedTemplate', {templateId: this.templateId, ...templateData}).then((data) => {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                  })
                  resolve(templateData)
                })
              } else {
                req('addOneTemplate', templateData).then((data) => {
                  this.$message({
                    message: '恭喜你，添加成功',
                    type: 'success'
                  })
                  resolve(templateData)
                })
              }
            } else {
              resolve(false)
            }
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .input-small {
    width: 120px;
  }

  .el-table {
    border: 0;

    td {
      min-width: 100px;
      padding: 0 3px;
    }

    .el-checkbox {
      margin: 0;
      padding-right: 10px;
    }

    .el-input {
      width: 130px;
    }

    .el-input-group__append {
      position: relative;
      left: -2px;
    }
  }

  .el-input-group__append {
    position: relative;
    left: -2px;
  }

  .el-select {
    /*width: 25%;*/
  }

  span {
    display: inline-block;
    width: 12%;
    margin: 10px 10px 10px 10px;
  }

  .width-20 {
    width: 20px;
  }

  .el-form-item {
    padding: 0 10px;
  }
</style>

<style lang="scss">
.needs-padding__8 {
  .el-form-item__content {
    padding-left: 8px;
  }
}

.item-content-left-padding__10 {
  .el-form-item__content {
    padding-left: 10px;
  }
}

.left-padding__10 {
  padding-left: 10px;
}
.el-input--suffix .el-input__inner {
  padding-right: 20px;
}
</style>
