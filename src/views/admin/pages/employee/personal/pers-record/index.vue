<template>
  <section class="pers-record">
    <i-layout class="layout">
      <main slot="section">
        <h2 v-if="employeebaseInfo.fullName.value">{{ employeebaseInfo.fullName.value }}</h2>
        <!-- <h2>测试名称</h2> -->
               
            <div class="print-html" v-if="isShowPrint">
              <h1 class="h1">员工履历表</h1>
              <table width="100%" border="1" cellspacing="0" cellpadding="0"  style="border-collapse: collapse">
                  <tr>
                      <td colspan="7">
                            <h2 class="h2">一、个人基本资料</h2>
                      </td>
                      <td width="99" rowspan="4">
                          <img v-if="printObj.photoPath.value" :src="`http://${printObj.printWindowHost}${$$.BASE_URL}/system/attachments/image/${printObj.photoPath.value}`" width="99" height="120" alt="头像" title="">
                      </td>
                  </tr>
                  <tr>
                    <td width="90" class="td-center">
                          人事范围
                    </td>
                    <td colspan="2">
                        {{printObj.personnelGroupName.value}}
                    </td>
                    <td width="90">职位</td>
                    <td width="90">{{printObj.posPositionName.value}}</td>
                    <td width="90">职务</td>
                    <td width="90">{{printObj.posTitleName.value}}</td>
                  </tr>
                  <tr>
                      <td>姓名</td>
                      <td colspan="2">{{printObj.fullName.value}}</td>
                      <td>性别</td>
                      <td>{{printObj.gender.value | printFilter('GENDER')}}</td>
                      <td>年龄</td>
                      <td>{{printObj.birthDate.value | ageFilter}}</td>
                  </tr>
                  <tr>
                    <td>出生日期</td>
                    <td colspan="2">{{filterDate(printObj.birthDate.value)}}</td>
                    <td>民族</td>
                    <td>{{printObj.nation.value | printFilter('NATION')}}</td>
                    <td>籍贯</td>
                    <td>{{printObj.domicilePlace.value}}</td>
                  </tr>
                  <tr>
                      <td colspan="8">
                            <table  width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;border-width:0px; border-style:hidden;">
                              <tr>
                                <td width="90">政治面貌</td>
                                <td>{{printObj.politicsStatus.value | printFilter('POLITICS_STATUS')}}</td>
                                <td width="90">婚姻状况</td>
                                <td width="90">{{printObj.maritalStatus.value | printFilter('MARITAL_STATUS')}}</td>
                                <td width="90">户口性质</td>
                                <td width="190">{{printObj.domicileType.value | printFilter('DOMICILE_TYPE')}}</td>
                              </tr>
                            </table>
                      </td>
                  </tr>
                  <tr>
                    <td colspan="8">
                      <table  width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;border-width:0px; border-style:hidden;">
                          <tr>
                            <td width="90">
                              证件号码
                            </td>
                            <td>
                                  {{printObj.idNumber.value}}
                            </td>
                            <td width="90">联系电话</td>
                            <td width="372">{{printObj.mobile.value}}</td>
                          </tr>
                          <tr>
                            <td>
                              最高学历
                            </td>
                            <td>{{printObj.empEducation.data.length ? printObj.empEducation.data[0].educationType : '--' | printFilter('EDUCATION_TYPE')}}</td>
                            <td>专业</td>
                            <td>{{printObj.empEducation.data.length ? printObj.empEducation.data[0].major : '--'}}</td>
                          </tr>
                          <tr>
                            <td>
                              健康状况
                            </td>
                            <td>
                                {{printObj.healthyCondition.value | printFilter('WHETHER_TYPE')}}
                            </td>
                            <td>有无传染病史</td>
                            <td>{{printObj.hadSeriousDisease.value | printFilter('HAVE_OR_NOT')}}</td>
                          </tr>
                        </table>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="8">
                        <table  width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;border-width:0px; border-style:hidden;">
                            <tr>
                              <td width="90">
                                证件地址
                              </td>
                              <td>
                                  {{printObj.idRegisteredAddress.value}}
                              </td>
                              <td width="90">家庭电话</td>
                              <td width="100">{{printObj.mobile.value}}</td>
                            </tr>
                            <tr>
                              <td>现通讯地址</td>
                              <td>{{printObj.homeAddress.value}}</td>
                              <td>联系电话</td>
                              <td>{{printObj.mobile.value}}</td>
                            </tr>
                        </table>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="8">
                      <table  width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;border-width:0px; border-style:hidden;">
                          <tr>
                            <td width="90">紧急联系人(直系亲属)</td>
                            <td>{{printObj.empFamilyMember.data.length ? printObj.empFamilyMember.data[0].name : '--'}}</td>
                            <td width="90">与本人关系</td>
                            <td width="90">{{printObj.empFamilyMember.data.length ? printObj.empFamilyMember.data[0].relationship : '--'  | printFilter('FAMILY_RELATIONSHIP')}}</td>
                            <td width="90">联系电话</td>
                            <td width="191">{{printObj.empFamilyMember.data.length ? printObj.empFamilyMember.data[0].primaryPhone : '--'}}</td>
                          </tr>
                      </table>
                    </td>
                  </tr>
              </table>
              <table  width="100%" border="1" cellspacing="0" cellpadding="0"  style="border-collapse: collapse">
                <tr>
                  <td colspan="7"><h2 class="h2">二、教育经历(从最高学历写起)</h2></td>
                </tr>
                <tr>
                  <td width="90" rowspan="2">学校名称</td>
                  <td colspan="2">学习时间</td>
                  <td rowspan="2" width="210">学历</td>
                  <td rowspan="2">专业</td>
                  <td rowspan="2" width="100">就学形式</td>
                </tr>
                <tr>
                  <td width="100">起</td>
                  <td width="100">止</td>
                </tr>
                <tr 
                  v-for="(item, key) of printObj.empEducation.data"
                  :key="key">
                    <td>{{item.institution}}</td>
                    <td>{{filterDate(item.admissionDate)}}</td>
                    <td>{{filterDate(item.graduationDate)}}</td>
                    <td>{{item.educationType | printFilter('EDUCATION_TYPE')}}</td>
                    <td>{{item.major}}</td>
                    <td>{{item.learnType | printFilter('LEARN_TYPE')}}</td>
                </tr>
              </table>
              <table  width="100%" border="1" cellspacing="0" cellpadding="0"  style="border-collapse: collapse">
                <tr>
                  <td colspan="6"><h2 class="h2">三、工作经历</h2></td>
                </tr>
                <tr>
                  <td width="90" rowspan="2">单位名称</td>
                  <td colspan="2">工作时间</td>
                  <td rowspan="2">担任职务</td>
                  <td rowspan="2" width="90">证明人</td>
                  <td rowspan="2" width="100">联系方式</td>
                </tr>
                <tr>
                  <td width="100">起</td>
                  <td width="100">止</td>
                </tr>
                <tr 
                  v-for="(item, key) of printObj.empWorkExperience.data"
                  :key="key">
                    <td>{{item.company}}</td>
                    <td>{{filterDate(item.beginDate)}}</td>
                    <td>{{filterDate(item.endDate)}}</td>
                    <td>{{item.positionName}}</td>
                    <td>{{item.witness}}</td>
                    <td>{{item.witnessContact}}</td>
                </tr>
              </table>
              <table  width="100%" border="1" cellspacing="0" cellpadding="0"  style="border-collapse: collapse">
                <tr>
                  <td colspan="7"><h2 class="h2">四、调动经历(公司内)</h2></td>
                </tr>
                <tr>
                  <td width="90">异动时间</td>
                  <td width="100">异动前组织</td>
                  <td width="100">异动前职位</td>
                  <td>异动后组织</td>
                  <td width="90">异动后职位</td>
                  <td width="90">原因异动</td>
                  <td width="100">异动类型</td>
                </tr>
                <tr 
                  v-for="(item, key) of printObj.empStaffRecordById.data"
                  :key="key">
                    <td>{{filterDate(item.recordTime) }}</td>
                    <td width="100">{{item.oldUnitName | dataFilter}}</td>
                    <td>{{item.oldJobName | dataFilter}}</td>
                    <td>{{item.newUnitName | dataFilter}}</td>
                    <td>{{item.newJobName | dataFilter}}</td>
                    <td>{{item.reason}}</td>
                    <td>{{item.recordType | printFilter('RECORD_TYPE')}}</td>
                </tr>
              </table>
          </div>

        <div class="base-info form-card" ref="employeebaseInfo">

          <h3>基本信息</h3>
          <el-row>
            <el-col :span="18">
              <el-form
                :model="employeebaseInfo"
                label-position="right"
                label-width="100px"
                class="form"
                :rules="rules"
                ref="ruleForm">
                <el-row style="width: 100%">
                 <el-col :span="item.size || 8" v-for="(item, idx) of employeebaseInfo" :key="idx">
                  <el-form-item :label="item.label" :prop="item.prop">

                    <el-input
                      v-if="!item.select&&!item.option&&!item.display"
                      v-model="item.value"
                      :disabled="item.disabled || false"
                      class="input"
                      :type="item.type">
                    </el-input>

                    <!-- 下拉邮箱列表 -->
                     <el-card class="box-card" v-if="item.showEmail && isShowEmailList" >
                      <div v-for="(item,id) in showList" :key="id" @click="chooseName(item)" >
                        <div class="txt">{{item}}</div>
                      </div>
                    </el-card> 

                    <i-select
                      v-if='item.select&&!item.option'
                      v-model="item.value"
                      :disabled="item.disabled || isGenderAbled || false"
                      :parameter="item.par"
                      filterable
                      >
                    </i-select>

                    <div v-if="item.option&&!item.select">
                      <el-date-picker
                        v-model='item.value'
                        type="date"
                        :editable="false"
                        :picker-options="item.index === 1 ? pickerOptions1: pickerOptions2"
                        :disabled="item.disabled || false">
                      </el-date-picker>
                    </div>

                  </el-form-item>
               </el-col>
                </el-row>
              </el-form>
            </el-col>
            <el-col :span="6" class="col my-photo">
              <el-upload
                class="avatar-uploader"
                :action="`${$$.BASE_URL}/system/attachments/image`"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                ref="deletePhoto">
                <img 
                  v-if="employeebaseInfo.photoPath.value"
                  :src="`${$$.BASE_URL}/system/attachments/image/${employeebaseInfo.photoPath.value}`"
                  class="avatar" >
                <i v-if="employeebaseInfo.photoPath.value" 
                 @click.stop="employeebaseInfo.photoPath.value = ''"
                 class="el-icon-close" > </i>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
          </el-row>
        </div>
        <!-- 岗位信息 -->
        <div class="base-info form-card" ref="empPosition">
          <h3>岗位信息</h3>
          <el-row>
            <el-col :span="24">
              <el-form
                :model="empPosition"
                label-position="right"
                label-width="100px"
                class="form"
                >
                <el-row style="width: 100%">
                 <el-col :span="6" v-for="(item, idx) of empPosition" :key="idx">
                  <el-form-item :label="item.label" :prop="item.prop">

                    <el-input
                      v-if="!item.select&&!item.option&&!item.type"
                      v-model="item.value"
                      :disabled="item.disabled || false"
                      class="input"
                      >
                    </el-input>

                    <i-select
                      v-if='item.select&&!item.option'
                      v-model="item.value"
                      :disabled="item.disabled || false"
                      :parameter="item.par"
                      filterable
                      >
                    </i-select>

                    <div v-if="item.option&&!item.select">
                      <el-date-picker
                        v-model='item.value'
                        type="date"
                        :editable="false"
                        :disabled="item.disabled || false">
                      </el-date-picker>
                    </div>

                    <div v-if="item.type&&!item.select&&!item.option">
                      <i-select-area
                         search
                         v-model="item.value"
                          type="yonghui"
                          :disabled="item.disabled || false">
                      ></i-select-area>
                    </div>
                  </el-form-item>
               </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <!-- 其他信息 -->
        <div class="base-info form-card" ref="healthyInfo">
          <h3>其他信息</h3>
          <el-row>
            <el-col :span="24">
              <el-form
                :model="healthyInfo"
                label-position="right"
                label-width="110px"
                class="form"
                :rules="healthRule"
                ref="healthRuleForm"
                >
                <el-row style="width: 100%">
                 <el-col :span="6" v-for="(item, idx) of healthyInfo" :key="idx">
                  <el-form-item :label="item.label" :prop="item.prop" v-if="item.show">
                    <i-select
                      v-model="item.value"
                      :parameter="item.par"
                      filterable
                      >
                    </i-select>
                  </el-form-item>
               </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
        </div>

        <div
          v-for="(table, key) of tables"
          :key="key"
          :name="key"
          :title="table.title"
          class="table">
          <!-- @save="getTableData(key, $event)" -->
          <i-table :table="table" :ref="key"  @loaded="loadTable($event, table.__name)">
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                @selection-change="selectionChangeHandler(tableScope, $event, table.__name)"
                @row-click="rowClickHandler(tableScope, $event)"
                v-loading="contractLoading"
               :element-loading-text="$loadingText">
                <el-table-column v-if="table.select && !isShow" type="selection"/>
                <el-table-column
                  v-for="(col, idx) of table.columns || []"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                  :align="col.align"
                  :width="col.width"
                  :min-width="col.minWidth"
                  :formatter="tableScope.formatter">
                  <template slot-scope="scope">
                    <table-cell
                      :table="tableScope"
                      :row="scope.row"
                      :col="col.prop"
                      :ref="table.__ref"
                    />
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="tableScope.operator"
                  fixed="right"
                  label="操作"
                  width="250">
                  <template slot-scope="scope">
                    <el-button
                      v-for="(btn, idx) of tableScope.operator"
                      :key="idx"
                      type="text"
                      size="small"
                      @click="btn.func(scope.row)"
                      >
                      {{ btn.text }}
                    </el-button>
                  </template>
                </el-table-column>

              </el-table>
            </template>
          </i-table>
        </div>

      <div class="base-info form-card historyForm" ref="empHistoryForm">

          <h3>历史记录</h3>
          <el-row>
              <ol>
                <li v-for="(item,idx) in empHistoryForm" :key="idx">
                  <span>{{idx + 1}}. {{filterAllDate(item.createDate)}}, 操作人：{{item.userName}}。</span>
                  <div class="history">
                    <div class="article-content" v-html="item.content"></div>
                  </div>
                </li>
              </ol>
          </el-row>
        </div>


        <el-button @click.native="sendAll('ruleForm')" class="save-button" v-if="accessMap.empEmployeesPut && !isShow" type="primary">保 存</el-button>
        <el-button @click="recordPrint" type="success">打 印</el-button>
      </main>
    </i-layout>

    <nav class="card">
      <ul>
        <li
          class="single-text-overflow"
          @click="handleClickToScoll('employeebaseInfo')">
          基本信息
        </li>
        <li
          class="single-text-overflow"
          @click="handleClickToScoll('empPosition')">
          岗位信息
        </li>
        <li
          class="single-text-overflow"
          @click="handleClickToScoll('healthyInfo')">
          其他信息
        </li>
        <li
          v-for="(table, key) of tables"
          :key="key"
          class="single-text-overflow"
          @click="handleClickToScoll(key)">
          {{ table.title }}
        </li>
        <li
          class="single-text-overflow"
          @click="handleClickToScoll('empHistoryForm')">
          历史记录
         </li>
      </ul>
    </nav>
  </section>
</template>

<script>
import req from 'api/employee/personal'
import access from 'mixins/access'
import config from './config'
import printCommon from './printCommon'
import moment from 'moment'
import TableCell from './table-cell.vue'

export default {
  components: {
    TableCell
  },
  mixins: [access],
  data () {
     /* eslint-disable */    
    let check = (rule, value, cb) => {
      !value.value && cb(new Error(value.label + '不能为空'))
      setTimeout(() => {
        cb()
      }, 0)
    }
    // 姓名
    let checkName = (rule, value, cb) => {
      !value.value && cb(new Error('姓名不能为空'))
        value.value.length > 30 && cb(new Error('姓名长度不能超过30个字符'))
       let wordTest = /^[^\s]+$/
        !wordTest.test(value.value) ? cb(new Error('名字首尾不能含空格')) : cb()
    }
    let checkEmail = (rule, value, cb) => {
      let data = value.value
      let myreg = /^[a-zA-Z0-9_-]+[\.]*[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

      let wordTest = /^[^\s]+$/
      data && setTimeout(function () {
        !wordTest.test(data) && cb(new Error('首尾不能含空格'))
        !myreg.test(data) && cb(new Error('请输入正确的邮箱格式'))
        cb()
      }, 100)
      !data && cb()
    }

    let checkPhone = (rule, value, cb) => {
      let phoneTest = /^1[34578]\d{9}$/
      let arr = []
      value = value.value

      !value && cb(new Error('电话号码不能为空'))

      this.familyTableVm.clone && this.familyTableVm.clone.map(key => {
        arr.push(key.primaryPhone)
      })

      arr.filter(mo => { return mo === value }).length && cb(new Error('电话号码不能和联系人号码一致'))

      setTimeout(function () {
        !phoneTest.test(value) ? cb(new Error('请输入正确的电话号码格式')) : cb()
      }, 0)
    }
    return {
      empEmployeeId: this.$route.params.userId,                 // 当前员工的 id
      ...config,                                                // 表单信息
      familyTableVm: null,
      educationTableVm: null,
      workTableVm: null,
      trainingTableVm: null,
      recordTableVm: null,
      credentialTableVm: null,
      rewardsTableVm: null,
      determineTableVm: null,
      freshSellingTableVm: null,
      selection: '',
      educationSelection: '',
       // 邮箱列表是否显示
      isShowEmailList: false,
        // 选择的邮箱后缀
      lastName: true,
        // 显示的列表
      showList: [],
      startTim: false,
      a: '',
        // 邮箱列表后缀
      emailsorce: ['@sina.com', '@163.com', '@qq.com', '@126.com', '@vip.sina.com', '@sina.cn', '@hotmail.com', '@gmail.com', '@sohu.com', '@yahoo.cn', '@139.com', '@wo.com.cn', '@189.cn'],
      text: [{time: '2000-12-12 00:00:00',author: 'cjy',con:'<p>wwdewverv</p><p>wwdewverv</p>'},{time: '2000-12-12 00:00:00',author: 'cjy',con:'<p>wwdewverv</p><p>wwdewverv</p>'}],
      refs: ['family', 'edu', 'work', 'tran', 'record', 'cre', 'rewards', 'deter', 'fresh'],
      empHistoryForm: null,
      tables: {
        empFamilyMember: {
          title: '家庭成员信息',
          __name: 'familyTableVm',
          __ref: 'family',
          select: true,
          index: true,
          columns: [
            { prop: 'name', label: '姓名', minWidth: 150 },
            { prop: 'relationship', label: '与本人关系', minWidth: 180, display: {dict: 'FAMILY_RELATIONSHIP'} },
            { prop: 'familyCompany', label: '工作单位', minWidth: 180 },
            // { prop: 'position', label: '职位' },
            { prop: 'primaryPhone', label: '联系电话', minWidth: 200, align: 'center' },
            { prop: 'isEmergency', label: '是否紧急联系人', minWidth: 150, display: { dict: 'WHETHER_TYPE' } }
          ],
          setting: {
            toolbar: [{
              text: '添加',
              key: 'empEmployeesPut',
              func: vm => {
                vm.createData()
              },
              show: () => {
                return {empty: this.isShow}
              }
            }, {
              text: '删除',
              key: 'empEmployeesPut',
              func: vm => {
                this.familyTableVm.clone.length > 1 && this.selection.length < this.familyTableVm.clone.length ? vm.deleteData() : this.$message({ type: 'warning', message: '请至少填写一位联系人且为紧急联系人' })
              },
              show: () => {
                return {empty: this.isShow}
              }
            }],
            editor: {
              name: {
                rules: [{ required: true, message: '请输入姓名' }]
              },
              familyCompany: {
                rules: [{ required: true, message: '请输入工作单位' }]
              },
              primaryPhone: {
                rules: [{
                  validator: (rule, value, cb) => {
                    let phoneTest = /^1[34578]\d{9}$/
                    let num = /^0\d{2,3}-?\d{7,8}$/

                    !value && cb(new Error('电话号码不能为空'))
                    value === this.employeebaseInfo.mobile && cb(new Error('电话号码不能和员工本人号码一致'))
                    setTimeout(function () {
                      // !phoneTest.test(value) ? cb(new Error('请输入正确的电话号码格式')) : cb()
                      !(phoneTest.test(value) || num.test(value)) ? cb(new Error('请输入正确的电话号码格式')) : cb()
                    }, 0)
                  }
                }]
              },
              relationship: {
                type: 'select',
                rules: [{required: true, message: '请选择与本人关系'}]
              },
              isEmergency: {
                type: 'select',
                rules: [{ required: true,
                  validator: (rule, value, cb) => {
                    let count = 0

                    !value && cb(new Error('请选择是否为紧急联系人'))

                    this.familyTableVm.clone && this.familyTableVm.clone.map(key => {
                      key.isEmergency === 'Y' && count++
                    })

                    count === 0 && cb(new Error('请至少填写一条信息且为紧急联系人'))
                    count > 1 && cb(new Error('只能选择一名家庭成员为紧急联系人'))
                    cb()
                  }
                }]
              }
            }
          },
          dev: true,
          editable: this.$route.query.from === 'pers_change',
          data: null,
          info: null
        },

        empEducation: {
          title: '教育信息情况',
          __name: 'educationTableVm',
          __ref: 'edu',
          select: true,
          index: true,
          columns: [
            { prop: 'admissionDate', label: '入学时间', width: 180, align: 'center', display: { date: '' } },
            { prop: 'graduationDate', label: '毕业时间', width: 180, align: 'center', display: { date: '' } },
            { prop: 'institution', label: '学校名称', minWidth: 200 },
            { prop: 'educationType', label: '学历', display: { dict: 'EDUCATION_TYPE' }, width: 150 },
            { prop: 'major', label: '专业', width: 200 },
            { prop: 'degree', label: '学位', display: { dict: 'DEGREE' }, width: 200 },
            { prop: 'learnType', label: '教育类型', display: { dict: 'LEARN_TYPE' }, minWidth: 200 },
            { prop: 'certificateNumber', label: '证书编号', width: 180, align: 'center' },
            // { prop: '', label: '证明人' },
            // { prop: '', label: '联系方式' },
            { prop: 'isTopGrade', label: '是否最高学历', display: { dict: 'WHETHER_TYPE' }, width: 200, align: 'center' }
          ],
          setting: {
            toolbar: [{
              text: '添加',
              key: 'empEmployeesPut',
              func: vm => {
                vm.createData()
              },
              show: () => {
                return {empty: this.isShow}
              }
            }, {
              text: '删除',
              key: 'empEmployeesPut',
              func: vm => {
                this.educationTableVm.clone.length > 1 && this.educationSelection.length < this.educationTableVm.clone.length ? vm.deleteData() : this.$message({ type: 'warning', message: '请至少填写一条教育信息' })
              },
              show: () => {
                return {empty: this.isShow}
              }
            }],
            editor: {
              admissionDate: {
                type: 'date',
                rules: [{ required: true,
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入入学时间'))
                    new Date(value).getTime() < new Date(this.employeebaseInfo.birthDate.value || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    return time.getTime() >= new Date(this.row.graduationDate).getTime()
                  }
                }
              },
              graduationDate: {
                type: 'date',
                rules: [{ required: true,
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入毕业时间'))
                    new Date(value).getTime() < new Date(this.employeebaseInfo.birthDate.value || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    return time.getTime() <= new Date(this.row.admissionDate).getTime()
                  }
                }
              },
              institution: {
                rules: [{ required: true, message: '请输入学校名称' }]
              },
              educationType: {
                type: 'select',
                rules: [{ required: true, message: '请输入教育类型' }]
              },
              major: {},
              degree: {
                type: 'select',
                rules: [{ required: true, message: '请输入学位' }]
              },
              learnType: {
                type: 'select',
                rules: [{ required: true, message: '请输入学习方式' }]
              },
              certificateNumber: {},
              isTopGrade: {
                type: 'select',
                rules: [{ required: true,
                  validator: (rule, value, cb) => {
                    let count = 0

                    !value && cb(new Error('请选择是否为最高学历'))

                    this.educationTableVm.clone && this.educationTableVm.clone.map(key => {
                      key.isTopGrade === 'Y' && count++
                    })

                    count > 1 && cb(new Error('只能选择一条信息为最高学历'))
                    cb()
                  }
                }]
              }
            }
          },
          dev: true,
          editable: this.$route.query.from === 'pers_change',
          data: null
        },

        empWorkExperience: {
          title: '先前雇主信息',
          __name: 'workTableVm',
          __ref: 'work',
          select: true,
          index: true,
          columns: [
            { prop: 'beginDate', label: '起始日期', width: 180, align: 'center', display: { date: '' } },
            { prop: 'endDate', label: '结束时间', width: 180, align: 'center', display: { date: '' } },
            { prop: 'company', label: '工作单位名称', minWidth: 200 },
            { prop: 'positionName', label: '职位', width: 220 },
            { prop: 'witness', label: '证明人', width: 160 },
            { prop: 'witnessContact', label: '联系方式', width: 180, align: 'center' }
          ],
          setting: {
            toolbar: [{
              text: '添加',
              key: 'empEmployeesPut',
              func: vm => {
                vm.createData()
              },
              show: () => {
                return {empty: this.isShow}
              }
            }, {
              text: '删除',
              key: 'empEmployeesPut',
              func: vm => {
                vm.deleteData()
              },
              show: () => {
                return {empty: this.isShow}
              }
            }],
            editor: {
              beginDate: {
                type: 'date',
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入起始时间'))
                    new Date(value).getTime() < new Date(this.employeebaseInfo.birthDate.value || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    return time.getTime() >= new Date(this.row.endDate).getTime()
                  }
                }
              },
              endDate: {
                type: 'date',
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入结束时间'))
                    new Date(value).getTime() < new Date(this.employeebaseInfo.birthDate.value || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    return time.getTime() <= new Date(this.row.beginDate).getTime()
                  }
                }
              },
              company: {
                rules: [{ required: true, message: '请输入工作单位名称' }]
              },
              positionName: {
                rules: [{ required: true, message: '请输入职位名称' }]
              },
              witness: {
                rules: [{ required: true, message: '请输入证明人' }]
              },
              witnessContact: {
                rules: [{
                  validator: (rule, value, cb) => {
                    let phoneTest = /^1[34578]\d{9}$/

                    !value && cb(new Error('电话号码不能为空'))

                    setTimeout(function () {
                      !phoneTest.test(value) ? cb(new Error('请输入正确的电话号码格式')) : cb()
                    }, 0)
                  }
                }]
              }
            }
          },
          dev: true,
          editable: this.$route.query.from === 'pers_change',
          data: null
        },

        empCredential: {
          title: '证书信息',
          __name: 'credentialTableVm',
          __ref: 'cre',
          select: true,
          index: true,
          columns: [
            { prop: 'credentialType', label: '资格证书名称', display: { dict: 'JOB_CERTIFICATE' } },
            // { prop: 'credentialUnit', label: '发证单位', minWidth: 200 },
            { prop: 'beginDate', label: '取得资格证书时间', align: 'center', display: { date: '' } },
            { prop: 'endDate', label: '资格证书到期时间', align: 'center', display: { date: '' } }
          ],
          setting: {
            toolbar: [{
              text: '添加',
              key: 'empEmployeesPut',
              func: vm => {
                vm.createData()
              },
              show: () => {
                return {empty: this.isShow}
              }
            }, {
              text: '删除',
              key: 'empEmployeesPut',
              func: vm => {
                vm.deleteData()
              },
              show: () => {
                return {empty: this.isShow}
              }
            }],
            editor: {
              beginDate: {
                type: 'date',
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入取得证书时间'))
                    new Date(value).getTime() <= new Date(this.employeebaseInfo.birthDate.value || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    return time.getTime() >= new Date(this.row.endDate).getTime()
                  }
                }
              },
              endDate: {
                type: 'date',
                rules: [{
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请输入证书到期时间'))
                    new Date(value).getTime() <= new Date(this.employeebaseInfo.birthDate.value || 0).getTime() && cb(new Error('时间不得早于出生日期'))
                    cb()
                  }
                }],
                options: {
                  disabledDate (time) {
                    return time.getTime() <= new Date(this.row.beginDate).getTime()
                  }
                }
              },
              credentialType: {
                type: 'select',
                rules: [{ required: true, message: '请输入证书名称' }]
              }
            }
          },
          dev: true,
          editable: this.$route.query.from === 'pers_change',
          data: null
        },

        empStaffRecordById: {
          title: '异动信息',
          __name: 'recordTableVm',
          __ref: 'record',
          select: true,
          index: true,
          columns: [
            { prop: 'recordTime', label: '异动时间', width: 180, align: 'center', display: { date: '' } },
            { prop: 'recordType', label: '异动类型', display: {dict: 'RECORD_TYPE'}, width: 140, align: 'center' },
            { prop: 'reason', label: '异动原因', minWidth: 200 },
            { prop: 'oldUnitName', label: '异动前组织', width: 220 },
            { prop: 'oldJobName', label: '异动前职位', width: 220 },
            { prop: 'newEmployeeType', label: '异动前用工类型', display: {dict: 'EMPLOYEE_TYPE'}, width: 220 },
            { prop: 'newUnitName', label: '异动后组织', width: 220 },
            { prop: 'newJobName', label: '异动后职位', width: 220 },
            { prop: 'oldEmployeeType', label: '异动后用工类型', display: {dict: 'EMPLOYEE_TYPE'}, width: 220 }
          ],
          setting: {
            editor: {
              recordTime: { type: 'date' },
              endDate: {
                type: 'date'
              },
              recordType: {
                type: 'select'
              }
            }
          },
          data: null
        },

        empRewards: {
          title: '奖惩信息',
          __name: 'rewardsTableVm',
          __ref: 'rewards',
          select: true,
          index: true,
          columns: [
            { prop: 'type', label: '奖惩类型', width: 150, align: 'center', display: { dict: 'REWARDS_PENALTIES_TYPE' } },
            { prop: 'reason', label: '奖惩原因', minWidth: 180 },
            { prop: 'mode', label: '奖惩方式', minWidth: 100 },
            { prop: 'approvalUnit', label: '奖惩批准单位', minWidth: 100 },
            { prop: 'documentNumber', label: '文件编号', minWidth: 100 }
          ],
          setting: {
            toolbar: [{
              text: '添加',
              key: 'empEmployeesPut',
              func: vm => {
                vm.createData()
              },
              show: () => {
                return {empty: this.isShow}
              }
            }, {
              text: '删除',
              key: 'empEmployeesPut',
              func: vm => {
                const _this = this
                _this.$confirm('确定要删除奖惩信息吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  vm.deleteData()
                })
              },
              show: () => {
                return {empty: this.isShow}
              }
            }],
            editor: {
              type: {
                type: 'select',
                rules: [{ required: true, message: '请选择奖惩类型' }]
              },
              reason: {
                rules: [{ max: 200, message: '不能超过200字符'}, { validator: this.spaceValidator}]
              },
              mode: {
                rules: [{ max: 100, message: '不能超过100字符'}, { validator: this.spaceValidator}]
              },
              approvalUnit: {
                rules: [{ max: 100, message: '不能超过100字符'}, { validator: this.spaceValidator}]
              },
              documentNumber: {
                rules: [{ max: 50, message: '不能超过50字符'}, { validator: this.spaceValidator}]
              },
            }
          },
          dev: true,
          editable: this.$route.query.from === 'pers_change',
          data: null,
          info: null
        },

        empDetermine: {
          title: '定岗信息',
          __name: 'determineTableVm',
          __ref: 'deter',
          select: true,
          index: true,
          columns: [
            { prop: 'startDate', label: '开始日期', minWidth: 100, align: 'center', display: { date: 'MM-dd' } },
            { prop: 'endDate', label: '结束日期', minWidth: 100, align: 'center', display: { date: 'MM-dd' } },
            { prop: 'retailEliteArea', label: '零售精英地区', minWidth: 150, align: 'center'},
            { prop: 'year', label: '年份', minWidth: 100, align: 'center'},
            { prop: 'trainingPeriodsNumber', label: '集训期数', minWidth: 100, align: 'center'}
          ],
          setting: {
            toolbar: [{
              text: '添加',
              key: 'empEmployeesPut',
              func: vm => {
                vm.createData()
              },
              show: () => {
                return {empty: this.isShow}
              }
            }, {
              text: '删除',
              key: 'empEmployeesPut',
              func: vm => {
                const _this = this
                _this.$confirm('确定要删除定岗信息吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  vm.deleteData()
                })
              },
              show: () => {
                return {empty: this.isShow}
              }
            }],
            editor: {
              startDate: {
                type: 'date',
                rules: [{ required: true, message: '请选择开始日期' }],
                options: {
                  disabledDate (time) {
                    return time.getTime() >= new Date(this.row.endDate).getTime()
                  }
                }
              },
              endDate: {
                type: 'date',
                rules: [{ required: true, message: '请选择结束日期' }],
                options: {
                  disabledDate (time) {
                    return time.getTime() <= new Date(this.row.startDate).getTime()
                  }
                }
              },
              retailEliteArea: {
                type: 'area',
                rules: [{ required: true, message: '请选择地区' }]
              },
              year: {
                rules: [{ required: true, validator: this.yearValidator}]
              },
              trainingPeriodsNumber: {
                type: 'number',
                rules: [{ required: true, validator: this.numberPeriodsValidator }]
              }
            }
          },
          dev: true,
          editable: this.$route.query.from === 'pers_change',
          data: null
        },

        empFreshSelling: {
          title: '生鲜卖手标识信息',
          __name: 'freshSellingTableVm',
          __ref: 'fresh',
          select: true,
          index: true,
          columns: [
            { prop: 'freshSellingHandLogo', label: '生鲜卖手标识', minWidth: 180, align: 'center', display: { date: '' } },
            { prop: 'trainingYear', label: '集训年份', minWidth: 180, align: 'center' },
            { prop: 'totalNumberPeriods', label: '总期数', minWidth: 180, align: 'center' },
            { prop: 'optionalArea', label: '送选地区下拉', minWidth: 180, align: 'center'},
            { prop: 'startDate', label: '开始时间', minWidth: 180, align: 'center', display: { date: '' } },
            { prop: 'endDate', label: '结束时间', minWidth: 180, align: 'center', display: { date: '' } },
            { prop: 'isEliminate', label: '是否淘汰', minWidth: 180, align: 'center', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'eliminationDate', label: '淘汰时间', minWidth: 180, align: 'center', display: { date: '' } },
          ],
          setting: {
            toolbar: [{
              text: '添加',
              key: 'empEmployeesPut',
              func: vm => {
                vm.createData()
              },
              show: () => {
                return {empty: this.isShow}
              }
            }, {
              text: '删除',
              key: 'empEmployeesPut',
              func: vm => {
                const _this = this
                _this.$confirm('确定要删除生鲜卖手标识信息吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  vm.deleteData()
                })
              },
              show: () => {
                return {empty: this.isShow}
              }
            }],
            editor: {
              freshSellingHandLogo: {
                rules: [{ required: true, message: '请输入生鲜标识' }, { validator: this.spaceValidator}]
              },
              trainingYear: {
                rules: [{ required: true, validator: this.yearValidator}]
              },
              totalNumberPeriods: {
                type: 'number',
                rules: [{ required: true, validator: this.numberPeriodsValidator }]
              },
              optionalArea: {
                type: 'area',
                rules: [{ required: true, message: '请选择地区' }]
              },
              startDate: {
                type: 'date',
                rules: [{ required: true, message: '请选择开始日期' }],
                options: {
                  disabledDate (time) {
                    return time.getTime() >= new Date(this.row.endDate).getTime()
                  }
                }
              },
              endDate: {
                type: 'date',
                rules: [{ required: true, message: '请选择结束日期' }],
                options: {
                  disabledDate (time) {
                    return time.getTime() <= new Date(this.row.startDate).getTime()
                  }
                }
              },
              isEliminate: {
                type: 'select',
                rules: [{ required: true, message: '请选择是否淘汰' }]
              },
              eliminationDate: {
                type: 'date',
                rules: [{ required: true, message: '请选择淘汰日期' }],
                options: {
                  disabledDate (time) {
                    // return time.getTime() <= new Date(this.row.startDate).getTime()
                  }
                }
              }
            }
          },
          dev: true,
          editable: this.$route.query.from === 'pers_change',
          data: null
        }
      },
      apiList: [
        {
          name: 'employeebaseInfo',
          fn: (data) => {
            Object.keys(this.employeebaseInfo).map(key => {
              this.$route.query.from !== 'pers_change' ? (this.employeebaseInfo[key].disabled = true) : (!this.employeebaseInfo[key].forbid && (this.employeebaseInfo[key].disabled = false))
              this.$route.query.from !== 'pers_change' ? (this.isShow = true) : ''
              this.employeebaseInfo[key].value = data[key]
            })
            return this.employeebaseInfo
          }
        },
        {
          name: 'empPosition',
          fn: (data) => {
            // 岗位信息赋值
            Object.keys(this.empPosition).map(key => {
              this.empPosition[key].value = data[key]
            })
            return this.empPosition
          }
        },
        {
          name: 'healthyInfo',
          fn: (data) => {
            Object.keys(this.healthyInfo).map(key => {
              this.healthyInfo[key].value = data[key]
            })
            return this.healthyInfo
          }
        },
        { name: 'empFamilyMember' },
        { name: 'empEducation' },
        { name: 'empWorkExperience' },
        { name: 'empCredential' },
        { name: 'empStaffRecordById' },
        { name: 'empRewards' },
        { name: 'empDetermine' },
        { name: 'empFreshSelling' },
        { 
          name: 'historyInfo',
           fn: (data) => {
           this.empHistoryForm = data
            return this.empHistoryForm
          }
        },
      ],
      collapseVisibility: [],
      postList: {},
      pickerOptions1: {},
      pickerOptions2: {},
      isShow: false,
      rules: {
        fullName: [{ required: true, validator: checkName, trigger: 'blur' }],
        mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'change' }],
        gender: [{ required: true, validator: check, trigger: 'change' }],
        nation: [{ required: true, validator: check, trigger: 'change' }],
        maritalStatus: [{ required: true, validator: check, trigger: 'change' }],
        politicsStatus: [{ required: true, validator: check, trigger: 'change' }],
        areaCitizenship: [{ required: true, validator: check, trigger: 'change' }],
        domicileType: [{ required: true, validator: check, trigger: 'change' }],
        martalStatus: [{ required: true, validator: check, trigger: 'change' }],
        domicilePlace: [{ required: true, validator: check, trigger: 'blur' }],
        issuingAuthority: [{ required: true, validator: check, trigger: 'blur' }],
        idBeginDate: [{ required: true, validator: check, trigger: 'change' }],
        idEndDate: [{ required: true, validator: check, trigger: 'change' }],
        idRegisteredAddress: [{ required: true, validator: check, trigger: 'blur' }],
        homeAddress: [{ required: true, validator: check, trigger: 'blur' }]
      },
      healthRule: {
        isHandicapped: [{ required: true, validator: check, trigger: 'change' }],
        handicappedGroup: [{ required: true, validator: check, trigger: 'change' }],
        handicappedType: [{ required: true, validator: check, trigger: 'change' }],
        isVeteran: [{ required: true, validator: check, trigger: 'change' }],
        healthyCondition: [{ required: true, validator: check, trigger: 'change' }],
        hadInfectious: [{ required: true, validator: check, trigger: 'change' }],
        hadSeriousDisease: [{ required: true, validator: check, trigger: 'change' }]
      },
      isShowPrint: false,
      printObj: {
        fullName: {},
        posPositionName: {},
        posTitleName: {},
        personnelGroupName: {},
        gender: {},
        birthDate: {},
        nation: {},
        domicilePlace: {},
        politicsStatus: {},
        maritalStatus: {},
        domicileType: {},
        idNumber: {},
        mobile: {},
        healthyCondition: {},
        idRegisteredAddress: {},
        homeAddress: {},
        hadSeriousDisease: {},
        empCredential: {},
        empEducation: {},
        empFamilyMember: {},
        empStaffRecordById: {},
        empWorkExperience: {}
      }
    }
  },
  watch: {
    // employeebaseInfo: {
    //   handler (val) { this.postList.baseInfo = val },
    //   deep: true
    // }
      // 邮箱后缀自动显示
    'employeebaseInfo.email.value': {
      handler: function (newVal, oldVal) {
        oldVal = oldVal && oldVal.trim()
        newVal = newVal && newVal.trim()
        if (newVal !== oldVal && this.lastName && this.startTim) {
            // 选择符合条件的显示
            // 有@匹配符合的
          if (newVal.indexOf('@') != -1) {
              // 截取@后面的内容和邮箱列表的进行对比
            this.a = newVal.slice(newVal.indexOf('@'))
            this.showList = []
            this.emailsorce.forEach(item => {
              if (item.includes(this.a)) {
                let b = newVal.split('@')
                this.$set(this.showList, this.showList.length, b[0] + item)
              }
            })
          } else {
              // 没有@显示全部
            this.showList = []
            this.emailsorce.forEach(item => {
              this.$set(this.showList, this.showList.length, newVal + item)
            })
          }
            // 如果输完了就隐藏列表或者没有匹配的也隐藏
          if (this.a.includes('.com') || this.showList.length === 0 || newVal.length === 0) {
            this.isShowEmailList = false
          } else {
            this.isShowEmailList = true
          }
        } else {
          this.isShowEmailList = false
          this.lastName = true
          this.startTim = true
        }
      }
    },
    'employeebaseInfo': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.pickerOptions1 = {
            disabledDate (time) {
              return time.getTime() > new Date() || time.getTime() < new Date(newVal.birthDate.value)
            }
          }
        }
      },
      deep: true
    },
    'employeebaseInfo.idBeginDate': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.pickerOptions2 = {
            disabledDate (time) {
              return time.getTime() <= new Date(newVal.value)
            }
          }
        }
      },
      deep: true
    },
    'healthyInfo.isHandicapped': {
      handler: function (newVal, oldVal) {
        if (newVal.value === 'Y') {
          this.healthyInfo.handicappedGroup.show = true
          this.healthyInfo.handicappedType.show = true
        } else {
          this.healthyInfo.handicappedGroup.show = false
          this.healthyInfo.handicappedGroup.value = ''
          this.healthyInfo.handicappedType.show = false
          this.healthyInfo.handicappedType.value = ''
        }
      },
      deep: true
    }
  },
  mounted () {
    this.fetchAll()
  },
  computed: {
    isGenderAbled () {
      return this.employeebaseInfo.idType.value === '1'
    }
  },

  beforeRouteEnter (to, from, next) {
    // to.meta.from = from.path.replace(/.*\/(.*)$/, (s, $1) => $1)
    to.query.from === undefined
      ? next(`${to.fullPath}?from=${from.path.replace(/.*\/(.*)$/, (s, $1) => $1)}`)
      : next()
  },

  filters: {
    ageFilter (val) {
      return val ? moment(new Date()).format('YYYY') - moment(val).format('YYYY') : '--'
    },

    printFilter (val, url) {
      let newVal = '--'
      try {
        let a = JSON.parse(sessionStorage.getItem(`/public-access/dicts/${url}/items`))
        JSON.parse(sessionStorage.getItem(`/public-access/dicts/${url}/items`)).map((item) => {
          if (item.value === val) {
            newVal = item.label
          }
        })
      } catch (res) {
      }
      return newVal
    },

    dataFilter (val) {
      return val || '--'
    }
  },

  methods: {
      // 选择邮箱后缀，拼接
    chooseName (name) {
      if (name) {
        let cc = name.split('@')
        if (this.employeebaseInfo.email.value.indexOf('@') !== -1) {
          // 如果有@把后面的内容代替为选择的
          this.employeebaseInfo.email.value = this.employeebaseInfo.email.value.substring(0, this.employeebaseInfo.email.value.indexOf('@'))
          this.employeebaseInfo.email.value += '@' + cc[1]
        } else {
          this.employeebaseInfo.email.value += '@' + cc[1]
        }
        this.isShowEmailList = false
        this.showList = []
        this.lastName = false
      } else {
        this.isShowEmailList = false
      }
    },
    loadTable (vm, tableName) {
      this[tableName] = vm
    },
    handleAvatarSuccess (res, file) {
      this.$message.success('图片上传成功！')
      this.employeebaseInfo.photoPath.value = file.response
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2
      !isJPG && this.$message.error('上传头像图片只能是 JPG/JPEG 格式!')
      // !isLt2M && this.$message.error('上传头像图片大小不能超过 2MB!')
      // return isJPG && isLt2M
      return isJPG
    },
    /** ---------------- Component ---------------- */
    /** 监听选择的变动 */
    selectionChangeHandler ({ selectionChangeHandler }, selection, name) {
      name === 'familyTableVm' && (this.selection = selection)
      name === 'educationTableVm' && (this.educationSelection = selection)
      name === 'rewardsTableVm' && (this.rewardsSelection = selection)
      selectionChangeHandler(selection)
    },
    /** 监听行点击事件，并返回被点击对象的 _id */
    rowClickHandler ({ rowClickHandler }, row) {
      rowClickHandler(row)
    },
    /** ---------------- Format ---------------- */

    /**
     *首字母大写
     */
    _initialUpperCase (word) {
      return word.replace(/^\w/, s => s.toUpperCase())
    },

    /**
     *规范 api 请求名称
     */
    formatApiName (method, { name = '' }) {
      return method + this._initialUpperCase(name)
    },

       /** ---------------- Request ---------------- */
     // 获取tables全部信息
    fetchAll (empEmployeeId = this.empEmployeeId) {
      const fn = key => data => {
        if (data) {
          data = Array.isArray(data) ? data : [data]
          this.tables[key].data = data
        }
      }
      return Promise.all(
        this.apiList.map(
          api => (req(this.formatApiName('get', api), { empEmployeeId })
            .then(api.fn ? api.fn : fn(api.name)))
        )
      )
    },

    /** ---------------- Sidebar Scroll ---------------- */
    handleClickToScoll (type) {
      const ref = this.$refs[type]
      const dom = Array.isArray(ref) ? ref[0].$el : ref
      const parent = document.querySelector('.el-main')
      const bread = document.querySelector('.crumbs-wrapper')

      if (dom) {
        parent.scrollTop = dom.offsetTop + bread.clientHeight // -webkit
        window.scrollTo(0, dom.offsetTop + bread.clientHeight) // -moz
      }
    },

      // 根据返回的create列表，对id参数进行拼接
    changeId (data) {
      if (!data) {
        return
      }
      let dataCreate = data.create
      dataCreate.forEach(item => {
        item['empEmployeeId'] = this.empEmployeeId
      })
      let dataUpdate = data.update
      dataUpdate.forEach(item => {
        item['empEmployeeId'] = this.empEmployeeId
      })
      let dataDelete = data.delete
      dataDelete.forEach(item => {
        item['empEmployeeId'] = this.empEmployeeId
      })
      return data
    },

    /**
     *保存履历表的信息
     */
    sendAll (formName) {
      /** -------------------- Plan B -------------------- */
      // 若想在外层拿到数据，需要使用 ref
      // 且只能拿到 disable 不为 true 的表格组件
      let pass = []
      let checkform = ''
      this.postList = []
      this.refs.map(key => {
        this.$refs[key] && this.$refs[key].map(el => { pass.push(el.validate()) })
      })

      let isOk = pass.filter(key => { return !key }).length
      this.$refs.healthRuleForm.validate(validate => { validate ? (checkform = true) : (checkform = false) })
      this.$refs[formName].validate(validate => {
        console.log(isOk,checkform,validate)
        if (validate && !isOk && checkform) {
          this.apiList.map((item,idx) => {
            if (idx > 2 && this.$refs[item.name]) {
              let data = this.$refs[item.name][0].saveData()
              // 若某个集合数组的长度不为 0，则当前数据需要发送
             const shouldPost = !!Object.keys(data.request).find(
             method => data.request[method].length !== 0
            )
            shouldPost
              ? (this.postList[item.name] = data.request)
              : (this.postList[item.name] && delete this.postList[item.name])
          }})
          console.log(this.postList)
          let fromInfoAll = {}
          // 获取基础信息，并且给基础信息添加员工id
          for (let key in this.employeebaseInfo) {
            fromInfoAll[key] = this.employeebaseInfo[key].value
          }
          // 保存其他信息
          let otherInfo = {}
          for (let key in this.healthyInfo) {
            otherInfo[key] = this.healthyInfo[key].value
          } // 每一项添加员工id
          for (let ikey in this.postList) {
            this.postList[ikey] = this.changeId(this.postList[ikey])
          }
          // 拼接完整的参数
          for (let ckey in this.postList) {
            let formatName = this._initialUpperCase(ckey)
            fromInfoAll['create' + formatName + 'List'] = this.postList[ckey] ? this.postList[ckey].create : null
            fromInfoAll['update' + formatName + 'List'] = this.postList[ckey] ? this.postList[ckey].update : null
            fromInfoAll['delete' + formatName + 'List'] = this.postList[ckey] ? this.postList[ckey].delete : null
          }

          fromInfoAll['empOthers'] = otherInfo
          fromInfoAll['empOthers']['empEmployeeId'] = this.empEmployeeId
          fromInfoAll['empEmployeeId'] = this.empEmployeeId
          // 拼接表格的数据
          fromInfoAll['allEmpFamilyMemberList'] = this.familyTableVm.clone
          fromInfoAll['allEmpEducationList'] = this.educationTableVm.clone
          fromInfoAll['allEmpWorkExperienceList'] = this.workTableVm.clone
          fromInfoAll['allEmpCredentialList'] = this.credentialTableVm.clone
          fromInfoAll['allEmpRewardsList'] = this.rewardsTableVm.clone
          fromInfoAll['allEmpDetermineList'] = this.determineTableVm.clone
          fromInfoAll['allEmpFreshSellingList'] = this.freshSellingTableVm.clone
          console.log(fromInfoAll)          
            // 保存全部信息
          req('putAllInfo', fromInfoAll)
            .then(res => {
              if (res) {
                this.$message('保存成功')
                // this.fetchAll()
                 window.location.reload()
              }
            })
        } else {
          this.$message({ message: '请先按要求将信息填写完整!', type: 'warning'})
          return false
        }
      })
    },

    sidebarHandler (e) {
      if (e.target === e.currentTarget) { return }
      // window.scrollTo(0, +e.target.dataset.top)
      document.querySelector('.el-main').scrollTop = +e.target.dataset.top
    },

    recordPrint () {
      this.printObj = {
        ...this.employeebaseInfo,
        ...this.empPosition,
        ...this.healthyInfo,
        ...this.tables,
        ...this.empWorkExperience,
        printWindowHost: window.location.host
      }
      this.isShowPrint = true
      setTimeout(() => {
        const printHtml = `${printCommon()}${document.getElementsByClassName('print-html')[0].innerHTML}`
        const wind = window.open('', 'newwindow', 'height=500, width=900, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
        try {
          wind.document.body.innerHTML = printHtml
        } catch (err) {
          console.log(err)
        }
        let imgs = wind.document.getElementsByTagName('img')
        if (imgs.length > 0) {
          imgs[0].onload = () => {
            wind.print()
          }
          imgs[0].onerror = () => {
            wind.print()
          }
        } else {
          wind.print()
        }
      }, 200)
    },

    filterDate (val, rule = 'YYYY-MM-DD') {
      return val ? moment(val).format(rule) : '--'
    },

    filterAllDate (val, rule = 'YYYY-MM-DD HH:mm:ss') {
      return val ? moment(val).format(rule) : '--'
    },

    yearValidator (rule, value, cb) {
      let yearTest = /^[1-9][0-9]\d{2}$/
      !value && cb(new Error('年份不能为空'))
      setTimeout(() => {
        !(yearTest.test(value)) ? cb(new Error('输入正确年份')) : cb()
      }, 0)
    },

    numberPeriodsValidator (rule, value, cb) {
      let Test = /^\+?[1-9][0-9]{0,3}$/
      !value && cb(new Error('期数不能为空'))
      setTimeout(() => {
        !(Test.test(value)) ? cb(new Error('输入正确期数')) : cb()
      }, 0)
    },

    spaceValidator (rule, value, cb) {
      let wordTest = /^[\s　]|[ ]$/gi
      wordTest.test(value) ? cb(new Error('首尾不能含空格')) : cb()
    }
  }
}
</script>

<style lang="scss" scoped>
$sidebar-width: 100px;
.historyForm {
  margin-top:30px;
  font-size: 14px;  
  .history {
    background: #fbfbfb;
    padding: 4px 0 6px 20px;
    min-height: 20px;
    border: 1px solid #f5f5f5;
    .article-content {
      font-size: 14px;
      padding: 0;
      word-break: break-all;
      p {
      margin-top:10px;
      }
    }
  }
}
.pers-record {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding-right: $sidebar-width + 20px;
  overflow: hidden;
  box-sizing: border-box;

  .layout {
    .base-info {
      > h3 {
        margin: -20px 0 0 -20px;
      }
    }

    main {
      flex: 1;
      overflow: hidden;
      h2 {
        font-size: 24px;
        margin: 10px 0 20px;
      }
      h3 {
        font-size: 18px;
      }

      .form-card {
        // margin-top: 30px;
        > h3 {
          margin-bottom: 10px;
        }
      // .input {
      //   // position: relative;
      // }
        .col {
          padding: 25px;
        }
        .avatar-uploader {
          position: absolute;
          top: 40px;
          right: 0;
          font-size: 0;
          &:hover {
            font-size: 16px
          }
        }
        .my-avatar {
          width: 168px;
          height: 235px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }

    }
  }

  .table + .table {
    margin-top: 20px;
  }

  nav {
    width: $sidebar-width;
    position: fixed;
    right: 20px;
    top: 100px;
    padding: 10px 0;
    background: #fff;
    z-index: 88;
    li {
      cursor: pointer;
      line-height: 30px;
      font-size: 13px;
      text-align: center;
      &:hover {
        color: #4688f1;
      }
    }
  }

  .save-button {
    margin-top: 20px;
  }
}
.el-date-editor.el-input{
  width: 100%;
}
</style>

<style lang="scss">
   .input:hover + .box-card {
        display: block;
        // position: relative;
      }
      .box-card:hover {
        display: block;
      }
      .box-card {
        display:none;
        position: absolute;
        top: 30px;
        width: 100%;
        z-index: 999;
        max-height: 274px;
        overflow: scroll;
        padding: 0px;
        .el-card__body{
          // padding:5px,0,0,5px !important;
          padding:0;
         div {
          width: 100%;
          cursor: pointer;
          .txt {
             font-size: 14px;
             width:100%;
            height: 30px;
            line-height: 30px;
            // margin: 0px,10px,20px !important;
           padding: 5px 0 0 5px !important;
          }
          &:hover {
            width: 100%;
            background-color: #e4e8f1
          }
        }
        }
    }


.pers-record {
  .my-photo {
    .avatar-uploader .el-upload {
      border: 1px solid #d9d9d9;
      border-radius: 3px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #20a0ff;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 168px;
      height: 235px;
      line-height: 235px;
      text-align: center;
    }

    .avatar {
      width: 168px;
      height: 235px;
      display: block;
    }

    .el-icon-close {
      position: absolute;
      top: 10px;
      right: 10px;
      /* z-index:888 */
    }
  }
}
.print-html {
  display: none;
}
@media print {
  .print-html {
    display: block;
  }
}
</style>
