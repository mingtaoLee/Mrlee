<template>
    <el-form :model="formData" :rules="rules" ref="formData">
      <el-form-item label="模版名称" :label-width="'100px'" prop="name">
        <el-input disabled v-model="formData.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="考核内容" :label-width="'100px'" required>
        <el-col :span="4">
          <el-form-item prop="kpi.isChecked" :rules="isCheckedRule">
            <el-checkbox disabled label="1" v-model="formData.kpi.isChecked" @change="kpiCheckChange">KPI指标</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="kpi.weight" :rules="percentRule"
                        v-if="formData.kpi.isChecked && formData.keyWork.isChecked">
            <el-input disabled width="30" class="input-small input-margin" v-model="formData.kpi.weight">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="keyWork.isChecked" :rules="isCheckedRule">
            <el-checkbox disabled label="2" v-model="formData.keyWork.isChecked" @change="keyWorkCheckChange">重点工作</el-checkbox>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="keyWork.weight" :rules="percentRule"
                        v-if="formData.keyWork.isChecked && formData.kpi.isChecked">
            <el-input disabled width="30" class="input-small input-margin" v-model="formData.keyWork.weight">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-checkbox disabled label="3" v-model="formData.keyEvent.isChecked">关键事件</el-checkbox>
      </el-form-item>

      <el-form-item label="评估方法" :label-width="'100px'" prop="evaluationMethod">
        <el-select disabled v-model="formData.evaluationMethod" placeholder="请选择评估方法">
          <el-option v-for="item in evaluationMethodDict" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.evaluationMethod == 1" label="评分标准" :label-width="'100px'" prop="standardId">
        <el-select disabled v-model="formData.standardId" placeholder="请选择">
          <el-option v-for="item in standardALlList" :key="item.value" :label="item.name"
                     :value="item.standardId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考核周期" :label-width="'100px'" prop="checkedPeriod">
        <el-checkbox-group v-model="formData.checkedPeriod" @change="periodChange">
          <el-checkbox disabled v-for="period in frequencyTypeDict" :label="period.value" :key="period.value">{{period.label}}
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
                <el-form-item prop="month.period" :rules="periodRule">
                  <el-checkbox-group v-model="formData.month.period">
                    <el-checkbox disabled v-for="period in monthdDict" :label="period.value" :key="period.value">{{period.label}}
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
                <el-form-item prop="month.isMakePlan" :rules="requireItem">
                  <el-radio-group disabled v-model="formData.month.isMakePlan">
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
                        <el-select disabled placeholder="请选择" v-model="formData.month.isCurrent4PlanStart" @change="monthChange">
                          <el-option label="上月" value="N"></el-option>
                          <el-option label="当月" value="Y"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item prop="month.planBeginDay" :rules="dayCurrent">
                        <el-select disabled placeholder="请选择" v-model="formData.month.planBeginDay">
                          <el-option v-for="n in totalDay" :key="n" :label="`${n}号`"
                                    :value="n"></el-option>
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
                <el-form-item prop="month.selfEvaluationWeight" :rules="monthPercentRule">
                  <el-col :span="22">
                    <el-input disabled v-model="formData.month.selfEvaluationWeight" placeholder="请输入内容">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </td>
              <td>复评权重</td>
              <td>
                <el-form-item prop="month.leaderEvaluationWeight" :rules="monthPercentRule">
                  <el-col :span="22">
                    <el-input disabled v-model="formData.month.leaderEvaluationWeight" placeholder="请输入内容">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
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
                          disabled
                          placeholder="请选择"
                          v-model="formData.month.isCurrent4EvaluationBegin"
                          @change="planStartChange">
                          <el-option label="上月" value="N"></el-option>
                          <el-option label="当月" value="Y"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="month.evaluationBeginDay" :rules="dayCurrent">
                        <el-select
                          disabled
                          placeholder="请选择"
                          v-model="formData.month.evaluationBeginDay">
                          <el-option v-for="n in totalPlanStart" :key="n" :label="`${n}号`"
                                    :value="n"></el-option>
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
                          disabled
                          placeholder="请选择"
                          v-model="formData.month.isCurrent4EvaluationEnd"
                          @change="planEndChange">
                          <el-option label="上月" value="N"></el-option>
                          <el-option label="当月" value="Y"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="month.evaluationEndDay" :rules="dayCurrent">
                        <el-select
                          disabled
                          placeholder="请选择"
                          v-model="formData.month.evaluationEndDay">
                          <el-option v-for="n in totalPlanEnd" :key="n" :label="`${n}号`"
                                    :value="n"></el-option>
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
                    <el-checkbox-group v-model="formData.quarter.period">
                      <el-checkbox disabled v-for="period in quarterDict" :label="period.value" :key="period.value">
                        {{period.label}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td v-if="isShowArr.includes('2')">是否合并子周期：</td>
              <td v-if="isShowArr.includes('2')">
                <el-form-item prop="quarter.isCalculateByChildren" :rules="ChildrenItem">
                  <el-radio-group disabled v-model="formData.quarter.isCalculateByChildren">
                    <el-radio class="radio" label="Y">是 </el-radio>
                    <el-radio class="radio" label="N">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
              <td v-if="!isShowArr.includes('2') || formData.quarter.isCalculateByChildren==='N'">是否制定计划：</td>
              <td v-if="!isShowArr.includes('2') || formData.quarter.isCalculateByChildren==='N'">
                <el-form-item prop="quarter.isMakePlan" :rules="requireItem">
                  <el-radio-group disabled v-model="formData.quarter.isMakePlan">
                    <el-radio class="radio" label="Y">是 </el-radio>
                    <el-radio class="radio" label="N">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th v-if="this.formData.quarter.period.includes('4')||this.formData.quarter.period.includes('8')"><span>计划设置</span>
              </th>
              <td v-if="this.formData.quarter.period.includes('4')">第一季度计划启动日期</td>
              <td v-if="this.formData.quarter.period.includes('4')">
                <el-form-item prop="quarter.firstPlanBeginDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      disabled
                      v-model="formData.quarter.firstPlanBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
              <td v-if="this.formData.quarter.period.includes('8')">第二季度计划启动日期</td>
              <td v-if="this.formData.quarter.period.includes('8')">
                <el-form-item prop="quarter.secondPlanBeginDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      disabled
                      v-model="formData.quarter.secondPlanBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                  </el-col>
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
                  <el-col :span="22">
                    <el-date-picker
                      disabled
                      v-model="formData.quarter.thirdPlanBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
              <td v-if="this.formData.quarter.period.includes('17')">第四季度计划启动日期</td>
              <td v-if="this.formData.quarter.period.includes('17')">
                <el-form-item prop="quarter.fourPlanBeginDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      disabled
                      v-model="formData.quarter.fourPlanBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="!isShowArr.includes('2') || formData.quarter.isCalculateByChildren==='N'">
              <th rowspan="5">评估设置</th>
              <td>自评权重</td>
              <td>
                <el-form-item prop="quarter.selfEvaluationWeight" :rules="quarterPercentRule">
                  <el-col :span="22">
                    <el-input disabled v-model="formData.quarter.selfEvaluationWeight" placeholder="请输入内容">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </td>
              <td>复评权重</td>
              <td>
                <el-form-item prop="quarter.leaderEvaluationWeight" :rules="quarterPercentRule">
                  <el-col :span="22">
                    <el-input disabled v-model="formData.quarter.leaderEvaluationWeight" placeholder="请输入内容">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="isShowQuarter1">
              <td>第一季度开始评估日期</td>
              <td>
                <el-form-item prop="quarter.firstEvaluationBeginDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.quarter.firstEvaluationBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
              <td>第一季度停止评估日期 </td>
              <td>
                <el-form-item prop="quarter.firstEvaluationEndDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.quarter.firstEvaluationEndDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="quarterPickerEndOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="isShowQuarter2">
              <td>第二季度开始评估日期</td>
              <td>
                <el-form-item prop="quarter.secondEvaluationBeginDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.quarter.secondEvaluationBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
              <td>第二季度停止评估日期 </td>
              <td>
                <el-form-item prop="quarter.secondEvaluationEndDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.quarter.secondEvaluationEndDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="quarterPickerEndOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="isShowQuarter3">
              <td>第三季度开始评估日期</td>
              <td>
                <el-form-item prop="quarter.thirdEvaluationBeginDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.quarter.thirdEvaluationBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
              <td>第三季度停止评估日期 </td>
              <td>
                <el-form-item prop="quarter.thirdEvaluationEndDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.quarter.thirdEvaluationEndDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="quarterPickerEndOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="isShowQuarter4">
              <td>第四季度开始评估日期</td>
              <td>
                <el-form-item prop="quarter.fourEvaluationBeginDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.quarter.fourEvaluationBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
              <td>第四季度停止评估日期 </td>
              <td>
                <el-form-item prop="quarter.fourEvaluationEndDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.quarter.fourEvaluationEndDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="quarterPickerEndOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
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
                    <el-checkbox-group v-model="formData.halfYear.period">
                      <el-checkbox disabled v-for="period in halfYearDict" :label="period.value" :key="period.value">
                        {{period.label}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td v-if="isShowArr.includes('3')">是否合并子周期：</td>
              <td v-if="isShowArr.includes('3')">
                <el-form-item prop="halfYear.isCalculateByChildren" :rules="ChildrenItem">
                  <el-radio-group disabled v-model="formData.halfYear.isCalculateByChildren">
                    <el-radio class="radio" label="Y">是 </el-radio>
                    <el-radio class="radio" label="N">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
              <td v-if="!isShowArr.includes('3') || formData.halfYear.isCalculateByChildren==='N'">是否制定计划：</td>
              <td v-if="!isShowArr.includes('3') || formData.halfYear.isCalculateByChildren==='N'">
                <el-form-item prop="halfYear.isMakePlan" :rules="requireItem">
                  <el-radio-group disabled v-model="formData.halfYear.isMakePlan">
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
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    disabled
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
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    disabled
                  >
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="!isShowArr.includes('3') || formData.halfYear.isCalculateByChildren==='N'">
              <th rowspan="3">评估设置</th>
              <td>自评权重</td>
              <td>
                <el-form-item prop="halfYear.selfEvaluationWeight" :rules="halfYearPercentRule">
                  <el-col :span="22">
                    <el-input disabled v-model="formData.halfYear.selfEvaluationWeight" placeholder="请输入内容">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </td>
              <td>复评权重</td>
              <td>
                <el-form-item prop="halfYear.leaderEvaluationWeight" :rules="halfYearPercentRule">
                  <el-col :span="22">
                    <el-input disabled v-model="formData.halfYear.leaderEvaluationWeight" placeholder="请输入内容">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="isShowLastHalfYear">
              <td>上半年开始评估日期</td>
              <td>
                <el-form-item prop="halfYear.lastEvaluationBeginDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.halfYear.lastEvaluationBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
              <td>上半年停止评估日期 </td>
              <td>
                <el-form-item prop="halfYear.lastEvaluationEndDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.halfYear.lastEvaluationEndDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="halfYearPickerEndOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="isShowNextHalfYear">
              <td>下半年开始评估日期</td>
              <td>
                <el-form-item prop="halfYear.nextEvaluationBeginDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.halfYear.nextEvaluationBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
              <td>下半年停止评估日期 </td>
              <td>
                <el-form-item prop="halfYear.nextEvaluationEndDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.halfYear.nextEvaluationEndDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="halfYearPickerEndOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
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
                  <el-radio-group disabled v-model="formData.year.isCalculateByChildren">
                    <el-radio class="radio" label="Y">是 </el-radio>
                    <el-radio class="radio" label="N">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>

              <td v-if="!isShowArr.includes('4') || formData.year.isCalculateByChildren==='N'">是否制定计划</td>
              <td v-if="!isShowArr.includes('4') || formData.year.isCalculateByChildren==='N'">
                <el-form-item prop="year.isMakePlan" :rules="requireItem">
                  <el-radio-group disabled v-model="formData.year.isMakePlan">
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
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.year.planBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="!isShowArr.includes('4') || formData.year.isCalculateByChildren==='N'">
              <th rowspan="2">评估设置</th>
              <td>自评权重</td>
              <td>
                <el-form-item prop="year.selfEvaluationWeight" :rules="yearPercentRule">
                  <el-col :span="22">
                    <el-input disabled v-model="formData.year.selfEvaluationWeight" placeholder="请输入内容">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </td>
              <td>复评权重</td>
              <td>
                <el-form-item prop="year.leaderEvaluationWeight" :rules="yearPercentRule">
                  <el-col :span="22">
                    <el-input disabled v-model="formData.year.leaderEvaluationWeight" placeholder="请输入内容">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="isShowYear">
              <td>开始评估日期</td>
              <td>
                <el-form-item prop="year.evaluationBeginDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.year.evaluationBeginDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
              <td>停止评估日期 </td>
              <td>
                <el-form-item prop="year.evaluationEndDate" :rules="date">
                  <el-col :span="22">
                    <el-date-picker
                      v-model="formData.year.evaluationEndDate"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="yearPickerEndOptions"
                      disabled
                    >
                    </el-date-picker>
                  </el-col>
                </el-form-item>
              </td>
            </tr>
          </table>
        </yh-cl-item>
      </yh-cl>
      <el-form-item
        label="描述"
        :label-width="'100px'"
        prop="description">
        <el-input
          disabled
          type="textarea"
          v-model="formData.description"
          :rows="5">
        </el-input>
      </el-form-item>
    </el-form>
</template>

<script>
  import YhCl from 'components/common/collapse/yh-cl'
  import YhClItem from 'components/common/collapse/yh-cl-item'
  import req from 'api/performance/template'

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
    name: 'template-dialog-check',
    props: ['form', 'value', 'type'],
    data () {
      // 比例验证函数
      var validatePercent = (rule, value, callback) => {
        let totalPercent = 0
//        if (!this.formData.kpi.weight) {
//          this.formData.kpi.weight = 0
//        }
//        if (!this.formData.keyWork.weight) {
//          this.formData.keyWork.weight = 0
//        }
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
          callback(new Error('必须选择一项'))
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
        cacheContentsDict: [],
        visible: false,
        standardALlList: [],
        formData: {},
        rules: {
          name: [
            {required: true, message: '等级名不能为空', trigger: 'blur'},
            {min: 1, max: 127, message: '长度在128个字符以内', trigger: 'blur'}
          ],
          description: [
            {min: 1, max: 255, message: '长度在256个字符以内', trigger: 'blur'}
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
        percentRule: {
          validator: validatePercent, trigger: 'blur'
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
          validator: validateIsChecked, rigger: 'change'
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
        totalDay: 0,
        totalPlanStart: 0,
        totalPlanEnd: 0,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
//        springDateOptions: {
//          disabledDate (time) {
//            let dStart = new Date()
//            let dEnd = new Date()
//            dStart.setMonth(0)
//            dStart.setDate(1)
//            dEnd.setMonth(2)
//            dEnd.setDate(31)
//            return time.getTime() < dEnd && time.getTime() > dEnd
//          }
//        },
        quarterPickerEndOptions: {
          disabledDate: (time) => {
            return time.getTime() < this.formData.quarter.evaluationBeginDate
          }
        },
        halfYearPickerEndOptions: {
          disabledDate: (time) => {
            return time.getTime() < this.formData.halfYear.evaluationBeginDate
          }
        },
        yearPickerEndOptions: {
          disabledDate: (time) => {
            return time.getTime() < this.formData.year.evaluationBeginDate
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
    },
    computed: {
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
      }
    },
    methods: {
      getCountDays (val) {
        let d = new Date()
        // d.getMonth()+1代表下个月，月份索引从0开始，即当前月为6月时，getMonth()返回值为5，创建日期时同理
        // 此处构造的日期为下个月的第0天，天数索引从1开始，第0天即代表上个月的最后一天
        let curMonthDays = new Date(d.getFullYear(), (d.getMonth() + val), 0).getDate()
        return curMonthDays
      },
      monthChange (val) {
        if (val === 'N') {
          this.totalDay = this.getCountDays(0)
        } else {
          this.totalDay = this.getCountDays(1)
        }
      },
      planStartChange (val) {
        if (val === 'N') {
          this.totalPlanStart = this.getCountDays(0)
        } else {
          this.totalPlanStart = this.getCountDays(1)
        }
      },
      planEndChange (val) {
        if (val === 'N') {
          this.totalPlanEnd = this.getCountDays(0)
        } else {
          this.totalPlanEnd = this.getCountDays(1)
        }
      },
      getStandard () {
        req('standardsOpenList').then((data) => {
          this.standardALlList = data
        }).catch((err) => {
          console.log(err)
        })
      },
      closeDialog () {
        this.$emit('input', false)
      },
      cancel () {
        this.$emit('templateDialogGetVisible', false)
      },
      // kpi 默认勾选一项是百分百
      kpiCheckChange () {
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
            if (this.formData.month.period) {
              this.formData.month.period.forEach((val, index) => {
                monthArr.push({...this.formData.month, period: val})
              })
            }
            // 处理季度后台所要的数据格式
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
            if (this.formData.quarter.period) {
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
            let halfYearArr = []
            let lastHalfYear = {
              evaluationBeginDate: this.formData.halfYear.lastEvaluationBeginDate,
              evaluationEndDate: this.formData.halfYear.lastEvaluationEndDate,
              planBeginDate: this.formData.quarter.lastPlanBeginDate

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
            if (this.formData.halfYear.period) {
              this.formData.halfYear.period.forEach((val, index) => {
                if (val === '9') {
                  halfYearArr.push({...this.formData.halfYear, period: val, ...lastHalfYear})
                } else if (val === '18') {
                  halfYearArr.push({...this.formData.halfYear, period: val, ...nextHalfYear})
                }
              })
            }
            let yearArr = []
            console.log(this.formData.year.period)
            console.log(this.formData)
            if (this.formData.year.period) {
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
            console.log('error submit!!')
            return false
          }
        })
      },
      periodChange (value) {
        if (value.includes('1')) {
          if (!this.formData.month.isChecked) {
            this.formData.month.period = ['1', '2', '3', '5', '6', '7', '10', '11', '12', '14', '15', '16']
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
            this.formData.quarter.period = ['4', '8', '13', '17']
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
            this.formData.halfYear.period = ['9', '18']
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
      }
    }
  }
</script>

<style scoped lang="scss">
  .input-small {
    width: 80px;
  }

  .input-margin {
    width: 80%;
  }

  table {
    border: 0;

    .el-checkbox {
      margin: 0;
      padding: 3px;
    }

    td {
      min-width: 100px;
    }

    .el-input {
      width: 130px;
    }
    .el-input-group__append {
      position: relative;
      left: -2px;
    }

    .el-radio-group {
      padding: 3px;
      padding-left: 11px;
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

  .el-col-22 {
    padding-left: 8px;
  }

  .el-checkbox-group {
    padding-left: 8px;
  }
</style>

