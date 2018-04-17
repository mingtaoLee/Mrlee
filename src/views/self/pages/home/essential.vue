<template>
        <div>
            <div class="main">
                <h1>基本信息</h1>
                <div class="basic-msg">
                    <el-row>
                        <el-col :span="7">
                            姓名：{{center.fullName}}
                        </el-col>
                        <el-col :span="7">
                            证件类型：{{loopStopWatch('ID_TYPE', center.idType)}}
                        </el-col>
                        <el-col :span="7">
                           户籍地：{{center.domicilePlace}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                           员工编号：{{center.employeeCode}}
                        </el-col>
                        <el-col :span="7">
                            证件号码：{{center.idNumber}}
                        </el-col>
                        <el-col :span="7">
                           户籍性质：{{loopStopWatch('DOMICILE_TYPE', center.domicileType)}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            性别：{{loopStopWatch('GENDER', center.gender)}}
                        </el-col>
                        <el-col :span="7">
                            民族：{{loopStopWatch('NATION', center.nation)}}
                        </el-col>
                        <el-col :span="7">
                           <!-- 毕业院校： -->
                           政治面貌：{{loopStopWatch('POLITICS_STATUS', center.politicsStatus)}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            出生日期：{{center.birthDate | dateFilter}}
                        </el-col>
                        <el-col :span="7">
                            年龄：{{center.age}}
                        </el-col>
                        <el-col :span="7">
                           <!-- 最高学历： -->
                           国籍/地区：{{loopStopWatch('COUNTRY', center.areaCitizenship)}}
                        </el-col>
                    </el-row>
                    <!-- <el-row>
                        <el-col :span="7">
                            国籍：{{loopStopWatch('COUNTRY', center.areaCitizenship)}}
                        </el-col>
                        <el-col :span="7">
                            政治面貌：{{loopStopWatch('POLITICS_STATUS', center.politicsStatus)}}
                        </el-col>
                        <el-col :span="7">
                           专业名称：
                        </el-col>
                    </el-row> -->
                    <el-row>
                        <el-col :span="7">
                            员工类别：{{loopStopWatch('EMPLOYEE_TYPE', center.employeeType)}}
                        </el-col>
                        <el-col :span="7">
                            户口性质：{{loopStopWatch('DOMICILE_TYPE', center.domicileType)}}
                        </el-col>
                        <el-col :span="7">
                           <!-- 外语及程度： -->
                           身份证住址：{{center.idRegisteredAddress}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            入职日期：{{center.hireDate | dateFilter}}
                        </el-col>
                        <el-col :span="7">
                            职位：{{center.posPositionName}}
                        </el-col>
                        <el-col :span="7">
                           家庭电话：{{center.homePhone}}
                        </el-col>
                    </el-row>
                    <!-- <el-row>
                        <el-col :span="7">
                            健康状况：
                        </el-col>
                        <el-col :span="7">
                            有无传染病史：
                        </el-col>
                        <el-col :span="7">
                           身份证住址：{{center.idRegisteredAddress}}
                        </el-col>
                    </el-row> -->
                    <el-row>
                        <el-col :span="7">
                            <taget-text
                              :text="essential.phone"
                              :value.sync="center.mobile"
                              dot='mobile'
                              :rules="rules.phone"
                              :empEmployeeId="center.empEmployeeId"
                            ></taget-text>
                        </el-col>
                        <el-col :span="7">
                            <taget-text
                                :text="essential.email"
                                :value.sync="center.email"
                                dot='email'
                                :rules="rules.email"
                                :empEmployeeId="center.empEmployeeId"
                                ></taget-text>
                        </el-col>
                        <el-col :span="7">
                           <taget-text
                                :text="essential.officialAcademic"
                                :value.sync="center.homeAddress"
                                dot='homeAddress'
                                :rules="rules.homeAddress"
                                :empEmployeeId="center.empEmployeeId"
                                ></taget-text>
                        </el-col>
                    </el-row>
                    <!-- <el-row>
                        <el-col :span="7">
                            <taget-text
                                :text="essential.emergencyContact"
                                :center="center.emergencyContact"
                                dot="emergencyContact"
                                :empEmployeeId="center.empEmployeeId"
                                ></taget-text>
                        </el-col>
                        <el-col :span="7">
                            <taget-text
                            :text="essential.Relationship"
                            :center="center.emergencyRelationship"
                            dot="emergencyRelationship"
                            :empEmployeeId="center.empEmployeeId"
                            stauts="FAMILY_RELATIONSHIP"
                            ></taget-text>
                        </el-col>
                        <el-col :span="7">
                                <taget-text
                                :text="essential.emergencyContactPhone"
                                :center="center.emergencyContactPhone"
                                dot="emergencyContactPhone"
                                :empEmployeeId="center.empEmployeeId"
                                ></taget-text>
                        </el-col>
                    </el-row> -->
                    <el-row>
                        <el-col :span="7">
                                <taget-text
                                :text="essential.marriage"
                                :value.sync="center.maritalStatus"
                                dot="maritalStatus"
                                :empEmployeeId="center.empEmployeeId"
                                :rules="rules.empEmployeeId"
                                stauts="MARITAL_STATUS"
                                ></taget-text>
                        </el-col>
                    </el-row>
                    <div class="uploadPhoto">
                        <el-upload
                            :action="`${$$.BASE_URL}/system/attachments/image`"
                            list-type="picture-card"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :show-file-list="false"
                            class="uploadCase"
                            >
                            <img v-if="center.photoPath" width="100%" height="100%" :src="`${$$.BASE_URL}/system/attachments/image/${center.photoPath}`" alt="">
                            <div v-else >
                              <i class="iconfont icon-morentouxiang"></i>
                              <span class="photo-text">上传图片</span>
                            </div>
                        </el-upload>
                    </div>
                </div>
                <!-- 家庭成员 ！！！！！-->
                <div class="main-center">
                    <h1>家庭成员</h1>
                    <h2 @click="addMember" class="addMember">添加成员</h2>
                    <h2 @click="deleteMember" class="deleteMember">删除</h2>
                    <h2 @click="saveMember" class="saveMember">保存</h2>
                    <!-- <i-table :table="familyMember" ref="familyMember">
                        <template slot="table" slot-scope="tableScope">
                          <el-table :data="tableScope.clone">
                            <el-table-column
                              v-for="(col, idx) of familyMember.columns"
                              :key="idx"
                              :prop="col.prop"
                              align="center"
                              :label="col.label">
                              <template slot-scope="scope">
                                <i-table-cell
                                  :row="scope.row"
                                  :col="col.prop"
                                  :table="tableScope"
                                  @change="changeData"
                                />
                              </template>
                            </el-table-column>
                          </el-table>
                        </template>
                      </i-table> -->
                      <i-table :table="familyMember" ref="familyMember" @save="getTableData" @clone="getTableClone">
                            <template slot="table" slot-scope="tableScope">
                              <el-table
                              @selection-change="handleSelectionChange"
                              :data="tableScope.clone"
                              >
                                 <el-table-column type="selection"/>
                                 <el-table-column
                                   v-for="(col, idx) of familyMember.columns"
                                   :key="idx"
                                   :prop="col.prop"
                                   align="center"
                                   :label="col.label">
                                   <template slot-scope="scope">
                                     <i-table-cell
                                        ref="familyMemberCell"
                                       :row="scope.row"
                                       :col="col.prop"
                                       :table="tableScope"
                                       @change="changeData"
                                     />
                                   </template>
                                 </el-table-column>
                              </el-table>
                            </template>
                          </i-table>

                      <!-- <i-table :table="familyMember" ref="familyMember">
                            <template slot="table" slot-scope="tableScope">
                              <el-table>
                                <el-table-column
                                  v-for="(col, idx) of tableScope.columns"
                                  :key="idx"
                                  :prop="col.prop"
                                  :label="col.label"
                                  :formatter="tableScope.formatter"
                                />

                                <i-table-operator :table="tableScope"/>
                              </el-table>
                            </template>
                          </i-table> -->


                </div>
                <!-- 教育信息 -->
                <div class="main-center">
                    <h1>教育信息</h1>
                    <i-table :table="educationalInformation">
                    <template slot="table" slot-scope="tableScope">
                        <!-- :data="tableScope.clone" -->
                        <el-table :data="tableScope.clone">
                        <el-table-column
                            v-for="(col, idx) of educationalInformation.columns"
                            :key="idx"
                            :prop="col.prop"
                            :label="col.label"
                            align="center"
                            :formatter="tableScope.formatter"
                        />
                        </el-table>
                    </template>
                    </i-table>
                </div>
                <!-- 工作经验 -->
                <div class="main-center">
                    <h1>工作经验</h1>
                    <i-table :table="workExperience">
                    <template slot="table" slot-scope="tableScope">
                        <!-- :data="tableScope.clone" -->
                        <el-table :data="tableScope.clone">
                        <el-table-column
                            v-for="(col, idx) of workExperience.columns"
                            :key="idx"
                            :prop="col.prop"
                            :label="col.label"
                            align="center"
                            :formatter="tableScope.formatter"
                        />
                        </el-table>
                    </template>
                    </i-table>
                </div>
                <!-- 银行卡信息 -->
                <div class="main-center">
                    <h1>银行卡信息</h1>
                    <i-table :table="bankCardInformation">
                    <template slot="table" slot-scope="tableScope">
                        <!-- :data="tableScope.clone" -->
                        <el-table :data="tableScope.clone">
                        <el-table-column
                            v-for="(col, idx) of bankCardInformation.columns"
                            :key="idx"
                            :prop="col.prop"
                            :label="col.label"
                            align="center"
                            :formatter="tableScope.formatter"
                        />
                        </el-table>
                    </template>
                    </i-table>
                </div>
                <!-- 培训经历 *****-->
                <div class="main-center">
                    <h1>培训经历</h1>
                    <i-table :table="trainingRecord">
                    <template slot="table" slot-scope="tableScope">
                        <!-- :data="tableScope.clone" -->
                        <el-table :data="tableScope.clone">
                        <el-table-column
                            v-for="(col, idx) of trainingRecord.columns"
                            :key="idx"
                            :prop="col.prop"
                            :label="col.label"
                            align="center"
                            :formatter="tableScope.formatter"
                        />
                        </el-table>
                    </template>
                    </i-table>
                </div>
                <!-- 健康信息 -->
                <div class="main-center">
                    <h1>健康信息</h1>
                    <i-table :table="healthInformation">
                    <template slot="table" slot-scope="tableScope">
                        <!-- :data="tableScope.clone" -->
                        <el-table :data="tableScope.clone">
                        <el-table-column
                            v-for="(col, idx) of healthInformation.columns"
                            :key="idx"
                            :prop="col.prop"
                            :label="col.label"
                            align="center"
                            :formatter="tableScope.formatter"
                        />
                        </el-table>
                    </template>
                    </i-table>
                </div>
                <!-- 异动信息 -->
                <div class="main-center">
                    <h1>异动信息</h1>
                    <i-table :table="transactionInformation">
                    <template slot="table" slot-scope="tableScope">
                        <!-- :data="tableScope.clone" -->
                        <el-table :data="tableScope.clone">
                        <el-table-column
                            v-for="(col, idx) of transactionInformation.columns"
                            :key="idx"
                            :prop="col.prop"
                            :label="col.label"
                            align="center"
                            :formatter="tableScope.formatter"
                        />
                        </el-table>
                    </template>
                    </i-table>
                </div>
                <!-- 资格证书信息 -->
                <div class="main-center">
                    <h1>资格证书信息</h1>
                    <i-table :table="qualificationCertificate">
                    <template slot="table" slot-scope="tableScope">
                        <!-- :data="tableScope.clone" -->
                        <el-table :data="tableScope.clone">
                        <el-table-column
                            v-for="(col, idx) of qualificationCertificate.columns"
                            :key="idx"
                            :prop="col.prop"
                            :label="col.label"
                            align="center"
                            :formatter="tableScope.formatter"
                        />
                        </el-table>
                    </template>
                    </i-table>
                </div>
            </div>
        </div>
</template>
<script>
import req from 'api/self/essential.js'
import ITable from 'components/common/i-table'
import ITableCell from 'components/common/i-table-cell'
// import moment from 'moment'
import tagetText from '../common/taget-text'
import { globalComponentVariable } from 'config/globalComponentVariable'
import { getSelectData } from 'utils/index.js'
export default {
  name: 'Essential',
  components: {
    ITable,
    tagetText,
    ITableCell
  },
  data () {
    return {
      rules: {
        phone: [{
          validator: (rule, value, cb) => {
            let phoneTest = /^1[34578]\d{9}$/
                    // 电话号码
            let num = /^0\d{2,3}-?\d{7,8}$/

            !value && cb(new Error('电话号码不能为空'))
            // value === this.essential.phone && cb(new Error('电话号码不能和申请人号码一致'))
            !(phoneTest.test(value) || num.test(value)) ? cb(new Error('请输入正确的电话号码格式')) : cb()
          }
        }],
        email: [{validator: (rule, value, cb) => {
          let emailCheck = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
          !emailCheck.test(value) ? cb(new Error('请输入正确的邮箱地址')) : cb()
        }}],
        homeAddress: [{required: true, message: '地址不能为空'}],
        empEmployeeId: [{required: true, message: '请选择婚姻状况'}]
      },
      dataRow: [],
      dialogImageUrl: '',
      essential: {
        phone: '联系电话：',
        email: '邮箱：',
        officialAcademic: '现通讯地址：',
        emergencyContact: '紧急联系人：',
        Relationship: '与本人关系：',
        emergencyContactPhone: '紧急联系人电话：',
        marriage: '婚姻状况：'
      },
    // 基本信息
      center: {
        fullName: '', // 姓名
        idType: '', // 员工证件类型
        domicilePlace: '', // 户籍地
        employeeCode: '', // 员工编号
        idNumber: '', // 证件号码
        domicileType: '', // 户籍性质
        gender: '', // 性别
        nation: '', // 民族
        // 毕业院校
        birthDate: '', // 出生日期
        age: '', // 年龄
        // 最高学历
        areaCitizenship: '', // 国籍
        politicsStatus: '', // 政治面貌
        employeeType: '', // 员工类别
        // 外语及程度
        hireDate: '', // 员工类别
        posPositionName: '', // 职位名称
        homePhone: '', // 家庭电话
        // 健康状况
        // 有无传染病史
        idRegisteredAddress: '', // 身份证住址
        mobile: '', // 联系电话
        email: '', // 邮箱
        homeAddress: '', // 现通讯地址
        emergencyContact: '', // 紧急联系人
        emergencyRelationship: '', // 与本人关系
        emergencyContactPhone: '', // 紧急联系人电话
        maritalStatus: '', // 婚姻状况
        empEmployeeId: '',
        photoPath: '' // 图片id
      },
        // 家庭成员
      familyMember: {
        columns: [
        {label: '姓名', prop: 'name', minWidth: 150, align: 'center'},
        {label: '与本人关系', prop: 'relationship', minWidth: 200, align: 'center', display: {dict: 'FAMILY_RELATIONSHIP'}},
        {label: '联系电话', prop: 'primaryPhone', minWidth: 180, align: 'center'},
        {label: '工作单位', prop: 'familyCompany', minWidth: 180, align: 'center'},
        {label: '是否是紧急联系人', prop: 'isEmergency', minWidth: 180, align: 'center', display: { dict: 'WHETHER_TYPE' }}
        ],
        setting: {
          editor: {
            isEmergency: {
              type: 'select',
              rules: [{
                required: true,
                validator: (rule, value, cb) => {
                  let count = 0

                  !value && cb(new Error('请选择是否为紧急联系人'))

                  this.$refs.familyMember.clone && this.$refs.familyMember.clone.map(key => {
                    key.isEmergency === 'Y' && count++
                  })

                  count === 0 && cb(new Error('请至少填写一条信息且为紧急联系人'))
                  count > 1 && cb(new Error('必须有且只有一位紧急联系人'))
                  cb()
                }
              }]
            },
            name: {
              rules: [{
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请输入姓名'))
                  value.length > 30 && cb(new Error('姓名长度不能超过30个字符'))

                  let wordTest = /^[^\s]+$/
                  !wordTest.test(value) ? cb(new Error('首尾不能含空格')) : cb()
                }
              }]
            },
            familyCompany: {
              rules: [{
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请输入工作单位'))
                  value.length > 30 && cb(new Error('工作单位长度不能超过30个字符'))

                  let wordTest = /^[^\s]+$/
                  !wordTest.test(value) ? cb(new Error('首尾不能含空格')) : cb()
                }
              }]
            },
            primaryPhone: {
              rules: [{
                validator: (rule, value, cb) => {
                  let phoneTest = /^1[34578]\d{9}$/
                    // 电话号码
                  let num = /^0\d{2,3}-?\d{7,8}$/

                  !value && cb(new Error('电话号码不能为空'))
                  value === this.essential.phone && cb(new Error('电话号码不能和申请人号码一致'))
                  setTimeout(function () {
                    !(phoneTest.test(value) || num.test(value)) ? cb(new Error('请输入正确的电话号码格式')) : cb()
                  }, 0)
                }
              }]
            },
            relationship: {
              type: 'select',
              rules: [{required: true, message: '请选择与本人关系'}]
            }
          }
        // //   operator: [{
        // //     text: '编辑',
        // //     type: 'primary',
        // //     func: row => this.addMember(row)
        // //   },
        // //   {
        // //     text: '删除',
        // //     type: 'success',
        // //     func: row => this.deleteMember(row)
        // //   }]
        },
        editable: true,
        dev: true,
        data: null
      },
      // 教育信息
      educationalInformation: {
        columns: [
        {label: '学校名称', prop: 'institution', minWidth: 150, align: 'center'},
        {label: '学习开始时间', prop: 'admissionDate', minWidth: 200, align: 'center', display: {date: 'default'}},
        {label: '学习结束时间', prop: 'graduationDate', minWidth: 180, align: 'center', display: {date: 'default'}},
        {label: '学历', prop: 'educationType', minWidth: 180, align: 'center', display: {dict: 'EDUCATION_TYPE'}},
        {label: '学位', prop: 'degree', minWidth: 180, align: 'center', display: {dict: 'DEGREE'}},
        {label: '专业', prop: 'major', minWidth: 180, align: 'center'}
        // {label: '证明人', prop: 'taskName', minWidth: 180, align: 'center'},
        // {label: '联系电话', prop: 'taskName', minWidth: 180, align: 'center'}
        ],
        data: null
      },
      // 工作经验
      workExperience: {
        columns: [
        {label: '单位名称', prop: 'company', minWidth: 150, align: 'center'},
        {label: '工作起始时间', prop: 'beginDate', minWidth: 200, align: 'center', display: {date: 'default'}},
        {label: '工作结束时间', prop: 'endDate', minWidth: 180, align: 'center', display: {date: 'default'}},
        {label: '担任职位', prop: 'positionName', minWidth: 180, align: 'center'},
        // {label: '离职原因', prop: 'taskName', minWidth: 180, align: 'center'},
        {label: '证明人', prop: 'witness', minWidth: 180, align: 'center'},
        {label: '联系电话', prop: 'witnessContact', minWidth: 180, align: 'center'}
        ],
        data: null
      },
      // 银行卡信息
      bankCardInformation: {
        columns: [
        {label: '账户类型', prop: 'cardType', minWidth: 150, align: 'center', display: {dict: 'CARD_TYPE'}},
        {label: '银行卡号', prop: 'account', minWidth: 300, align: 'center'},
        {label: '银行卡类别', prop: 'bankCode', minWidth: 180, align: 'center', display: {dict: 'BANK_TYPE'}},
        {label: '开户行名称', prop: 'bankName', minWidth: 180, align: 'center'},
        {label: '开户行省份', prop: 'provinceName', minWidth: 180, align: 'center'},
        {label: '开户行城市', prop: 'cityName', minWidth: 180, align: 'center'}
        // {label: '生效时间', prop: 'taskName', minWidth: 180, align: 'center'},
        // {label: '失效时间', prop: 'taskName', minWidth: 180, align: 'center'}
        ],
        data: null
      },
      // 培训经历
      trainingRecord: {
        columns: [
        {label: '培训机构', prop: 'trainingInstitutions', minWidth: 150, align: 'center'},
        {label: '培训起始时间', prop: 'beginDate', minWidth: 200, align: 'center', display: {date: 'default'}},
        {label: '培训结束时间', prop: 'endDate', minWidth: 180, align: 'center', display: {date: 'default'}},
        {label: '培训内容', prop: 'trainingContent', minWidth: 180, align: 'center'},
        {label: '所获证书', prop: 'certificate', minWidth: 180, align: 'center'}
        ],
        data: null
      },
      // 健康信息
      healthInformation: {
        columns: [
        {label: '健康情况', prop: 'healthyCondition', minWidth: 150, align: 'center', display: {dict: 'WHETHER_TYPE'}},
        {label: '有无传染历史', prop: 'hadInfectious', minWidth: 200, align: 'center', display: {dict: 'WHETHER_TYPE'}},
        {label: '有无重大疾病史', prop: 'hadSeriousDisease', minWidth: 180, align: 'center', display: {dict: 'WHETHER_TYPE'}}
        ],
        data: null
      },
      // 异动信息
      transactionInformation: {
        columns: [
        {label: '异动时间', prop: 'recordTime', minWidth: 150, align: 'center', display: { date: 'default' }},
        {label: '异动前组织', prop: 'oldUnitName', minWidth: 200, align: 'center'},
        {label: '异动前职位', prop: 'oldJobName', minWidth: 180, align: 'center'},
        {label: '异动后组织', prop: 'newUnitName', minWidth: 180, align: 'center'},
        {label: '异动后职位', prop: 'newJobName', minWidth: 180, align: 'center'},
        {label: '异动原因', prop: 'reason', minWidth: 180, align: 'center', display: {dict: 'CHANGE_REASON'}},
        {label: '异动后类型', prop: 'recordType', minWidth: 180, align: 'center', display: {dict: 'RECORD_TYPE'}}
        ],
        data: null
      },
      // 资格证书信息
      qualificationCertificate: {
        columns: [
        {label: '资格证书名称', prop: 'credentialType', minWidth: 150, align: 'center', display: {dict: 'JOB_CERTIFICATE'}},
        // {label: '发证单位', prop: 'credentialUnit', minWidth: 200, align: 'center'},
        {label: '取消资格证书时间', prop: 'beginDate', minWidth: 180, align: 'center', display: {date: 'default'}},
        {label: '资格证书到期时间', prop: 'endDate', minWidth: 180, align: 'center', display: {date: 'default'}}
        ],
        data: null
      },
    //   码表的数据
      mabiao: {
        ID_TYPE: [],
        DOMICILE_TYPE: [],
        GENDER: [],
        NATION: [],
        COUNTRY: [],
        POLITICS_STATUS: [],
        EMPLOYEE_TYPE: [],
        FAMILY_RELATIONSHIP: [],
        MARITAL_STATUS: []
      }
    }
  },
  mounted () {
    this.init()
    this.stopWatch()
  },
  methods: {
    // 上传头像成功时的回调
    handleAvatarSuccess (response, file, fileList) {
      this.center.photoPath = file.response
      req('uploadEmpHeadImage', {attachmentId: file.response}).then(res => {
        console.log(res)
        if (res) {
          this.$message({
            type: 'sucess',
            message: '上传头像成功时回调'
          })
        }
      })
    },
     // 头像上传前校验
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 初始化的时候的调用
    init () {
      // 基本信息
      req('getHomeEmployeeInfo').then(res => {
        // console.log(res)
        this.center = Object.assign({}, res)
      })
      // 异动信息
      req('empStaffRecord').then(res => {
        // console.log(res)
        this.transactionInformation.data = res
      })
      // 银行卡信息
      req('empBankTax').then(res => {
        this.bankCardInformation.data = [res]
        // console.log(res)
        // for (let i = 0; i < res.length; i++) {
        //   req('empBankTaxCode', {code: res[i].cityName}).then(item => {
        //     // console.log(item)
        //     // if (item !== []) {
        //     res[i].cityName = item[i].areaName
        //     req('empBankTaxCode', {code: res[i].provinceName}).then(item => {
        //       res[i].provinceName = item[i].areaName
        //       this.bankCardInformation.data = res
        //       console.log(res)
        //     })
            // } else {
            //   this.bankCardInformation.data = res
            // }
        //   })
        // }
      })
      req('healthy').then(res => {
        // console.log(res)
        this.healthInformation.data = [res]
      })
      req('empFamilyMember').then(res => {
        // console.log(res)
        this.familyMember.data = res
      })
      req('empEducation').then(res => {
        this.educationalInformation.data = res
      })
      req('empWorkExperience').then(res => {
        this.workExperience.data = res
      })
      req('empTraining').then(res => {
        this.trainingRecord.data = res
      })
      req('empCredential').then(res => {
        this.qualificationCertificate.data = res
      })
    },
    // 家庭成员的删除
    deleteMember () {
      let isEmergencyNumb = this.rowData.filter(item => {
        if (item.isEmergency === 'Y') {
          return item.isEmergency
        }
      })
      if (!isEmergencyNumb.length) {
        let cloneRow = [ ]
        this.rowData.map(item => {
          cloneRow.push({'empEmployeeId': item.empEmployeeId, 'empFamilyMemberId': item.empFamilyMemberId})
        })
        return req('deleteEmpFamilyMember', cloneRow).then(res => {
          if (res) {
            this.$refs.familyMember.deleteData()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      }
      this.$message({
        type: 'warning',
        message: '先更改为非紧急联系人'
      })
    },
    // 家庭成员的添加
    addMember (row) {
      console.log(row)
      this.$refs.familyMember.createData()
    },
    // 家庭成员的保存
    saveMember () {
      this.$refs.familyMemberCell.map(item => {
        item.validate()
      })
      let saveData = this.$refs.familyMember.clone
      if (Object.keys(this.$refs.familyMember.error).length) return false
      req('saveEmpFamilyMember', saveData).then(res => {
        if (res) {
          req('empFamilyMember').then(res => {
            this.familyMember.data = res
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          })
        }
      })
    },
    // 码表的查询
    stopWatch () {
      this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('ID_TYPE'), 'ID_TYPE')
      this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('DOMICILE_TYPE'), 'DOMICILE_TYPE')
      this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('GENDER'), 'GENDER')
      this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('NATION'), 'NATION')
      this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('COUNTRY'), 'COUNTRY')
      this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('POLITICS_STATUS'), 'POLITICS_STATUS')
      this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('EMPLOYEE_TYPE'), 'EMPLOYEE_TYPE')
      this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('FAMILY_RELATIONSHIP'), 'FAMILY_RELATIONSHIP')
      this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('MARITAL_STATUS'), 'MARITAL_STATUS')
    },
    // 码表时赋值
    stopWatchInquiry (url, tableName) {
      getSelectData(url, true).then(res => {
        this.mabiao[tableName] = res
        // console.log(this.ID_TYPE)
        // console.log(res)
      })
    },
    // 码表时筛选
    loopStopWatch (tableName, value) {
      for (let i = 0; i < this.mabiao[tableName].length; i++) {
        if (value === this.mabiao[tableName][i].value) {
          return this.mabiao[tableName][i].label
        }
      }
    },
    // 修改时的监听
    // changeData (row) {
    //   this.dataRow = row.row
    //   console.log('1111111', this.dataRow)
    // },
    // 保存触发获取到的数据
    // getTableClone (data) {
    //   // console.log(data)
    //   let arr = JSON.stringify(data)
    //   req('saveEmpFamilyMember', arr).then(res => {
    //     if (res) {
    //       req('empFamilyMember').then(res => {
    //     // console.log(res)
    //         this.familyMember.data = res
    //       })
    //     }
    //   })
    // },
    // 家庭成员的勾选
    handleSelectionChange (row) {
      this.rowData = row
    }
  }
}
</script>
<style  lang="scss" scoped>
.crumb {
        padding-center: 10px
}
.main {
    border: 1px solid #efefef;
    box-sizeing: border-box;
    background: #fff;
    .i-table {
        padding: 20px;
    }
    h1 {
        font-size: 14px;
        font-weight: 800;
        height: 28px;
        line-height: 28px;
        padding: 20px 20px 0 20px;
    }
    .basic-msg {
        padding: 0 36px;
        position: relative;
        .uploadPhoto {
              position: absolute;
              top: 10px;
              right: 20px;
              width: 170px;
              height: 230px;
              padding: 10px;
              box-sizing: border-box;
              border: 1px solid #f3f3f3;
            i {
              font-size: 140px;
              color: #f8f8f8;
              position: absolute;
              top: 48px;
              left: 7px;
            }
        }

    }
}
.main-center {
    margin-top: 15px;
    background: #ffffff;
    position: relative;
    .i-table {
    padding: 10px 20px;
    }
    .addMember {
        position: absolute;
        top: 35px;
        right: 120px;
        cursor: pointer;
        color: #4cacff;
    }
    .deleteMember {
        position: absolute;
        top: 35px;
        right: 80px;
        cursor: pointer;
        color: #4cacff;
    }
    .saveMember {
        position: absolute;
        top: 35px;
        right: 41px;
        cursor: pointer;
        color: #4cacff;
    }
    h1 {
        font-size: 14px;
        font-weight: 800;
        height: 28px;
        line-height: 28px;
        padding: 20px 0px 10px 0;
        border-top: 2px solid #E8E8E8;
        margin: 0 20px;
    }
}
.el-col-7 {
    padding: 20px 0;
}
.text {
    padding: 0px 20px 20px;
    p {
        padding-top: 10px;
    }
}
.uploadCase {
  position: relative;
  .photo-text {
    transform: translate(-50%,-50%);
    position: absolute;
    color:#333333;
    font-size: 14px;
    display: none;
    left: 50%;
    top: 50%;

  }
  &:hover .photo-text {
    display: inline-block;
  }
}
</style>
<style lang="scss">
  .uploadPhoto {
    .el-upload--picture-card{
      background-color: #f3f3f3;
      border: none;
      width: 150px;
      height: 210px;
    }
  }
  .main-center th{
    color: #000000 !important;
    font-weight: normal;
  }
  
</style>
