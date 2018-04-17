<template>
  <section class="inforemind-edit-layout">
        <i-layout>
          <div slot="section">
            <h2 class="inforemind-edit-title"><i class="el-icon-back goBackIcon" @click="goBack"></i><span>{{title}}</span></h2>
            <div class="pers-inforemind-form"  v-loading="loading" :element-loading-text="$loadingText">
                <el-form :model="reminderObj" :rules="rules" label-width="115px" ref="reminderObj">
                        <el-form-item label="任务编号" v-if="!isNew">
                            {{reminderObj.reminderCode}}
                        </el-form-item>
                        <el-form-item label="提醒任务名称"  prop="reminderName" required>
                          <el-input v-model="reminderObj.reminderName" maxlength="15" class="form-item-width"></el-input>
                        </el-form-item>
                        <el-form-item label="执行周期"  prop="reminderCycleType" required>
                          <i-select v-model="reminderObj.reminderCycleType" :clearable="false" parameter="REMINDERCYCLETYPE" class="form-item-width"></i-select>
                        </el-form-item>
                        <el-form-item label="间隔" prop="reminderCycle2" required v-if="reminderObj.reminderCycleType == '02' && reminderObj.reminderCycleType != ''">
                            <div class="item-flex">
                                <el-input placeholder="请输入大于0的数字" v-model.number="reminderObj.reminderCycle2"  class="form-item-width"></el-input>&nbsp;&nbsp;天
                            </div>
                        </el-form-item>
                        <el-form-item label="每周周" prop="reminderCycle3" required v-if="reminderObj.reminderCycleType == '03' && reminderObj.reminderCycleType != ''">
                            <div class="item-flex">
                                <el-input placeholder="请输入1到7之间的数字" v-model.number="reminderObj.reminderCycle3"  class="form-item-width"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="每月" prop="reminderCycle4" required v-if="reminderObj.reminderCycleType == '04' && reminderObj.reminderCycleType != ''">
                            <div class="item-flex">
                                <el-input  placeholder="请输入1到31之间的数字" v-model.number="reminderObj.reminderCycle4"  class="form-item-width"></el-input>&nbsp;&nbsp;号
                            </div>
                        </el-form-item>
                        <el-form-item label="首次执行日期" prop="reminderDate">
                            <el-date-picker
                              v-model="reminderObj.reminderDate"
                              type="date"
                              class="form-item-width"
                              placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="执行时间点" prop="reminderTime">
                              <el-time-picker v-model="reminderObj.reminderTime" class="form-item-width"></el-time-picker>
                        </el-form-item>
                        <el-form-item label="提醒范围" prop="reminderType" required>
                            <el-checkbox-group v-model="reminderObj.reminderType">
                              <el-checkbox v-for="item in reminderTypeList"
                                                  :key="item.value"
                                                  :label="item.value"
                              >{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                            <!-- <div>
                              <el-radio-group v-model="reminderObj.reminderType">
                                    <el-radio v-for="item in reminderTypeList"
                                                  :key="item.value"
                                                  :label="item.value"
                                                  class="inforemind-label"
                                    >{{item.label}}</el-radio>
                              </el-radio-group>
                            </div> -->
                        </el-form-item>
                        <el-form-item label="提醒员工" prop="employeeName" required v-if="reminderObj.reminderTypeString.indexOf('04') > -1">
                          <el-input
                              v-model="reminderObj.employeeName"
                              icon="menu"
                              :on-icon-click="handleIconClick"
                               class="form-item-width form-item-width2"
                              readonly>
                            <i slot="suffix" class="el-icon-menu" @click="handleIconClick"></i>
                          </el-input>
                          <i-personnel-select
                            :isShow.sync="isShow"
                            @confirm="handleConfirm"
                            :hasGrant="false"
                             filterType="personnelGroup"
                          >
                          </i-personnel-select>
                        </el-form-item>
                        <el-form-item label="提醒条件" prop="reminderCondition" required>
                              <el-button @click="addRules(false)" type="text" class="add-btn"><i class="el-icon-plus"></i> 新增条件</el-button>
                                <div>
                                    <div v-for="(item, index) in reminderObj.reminderCondition"
                                            :key="index"
                                             class="item-flex"
                                    >
                                          <span v-if="index === 0" style="opacity:0">并且&nbsp;&nbsp;</span>
                                          <span v-if="index !== 0">并且&nbsp;&nbsp;</span>
                                          <el-select v-model="item.type" class="inforemind-select">
                                              <el-option v-for="item2 in typeList"
                                                             :key="item2.value"
                                                             :label="item2.label"
                                                             :value="item2.value"
                                              >
                                              </el-option>
                                          </el-select>
                                          <el-select v-if="item.type == '01'" v-model="item.flowRule" class="inforemind-select">
                                              <el-option v-for="item2 in flowRuleList"
                                                              :key="item2.value"
                                                              :label="item2.label"
                                                              :value="item2.value"
                                              ></el-option>
                                          </el-select>
                                          <el-select v-if="item.type == '01'" v-model="item.flowType" class="inforemind-select">
                                              <el-option v-for="item2 in flowTypeList"
                                                              :key="item2.value"
                                                              :label="item2.label"
                                                              :value="item2.value"
                                              ></el-option>
                                          </el-select>
                                          <el-select v-if="item.type == '02'" v-model="item.dateType" class="inforemind-select">
                                              <el-option v-for="item2 in dateTypeList"
                                                              :key="item2.value"
                                                              :label="item2.label"
                                                              :value="item2.value"
                                              ></el-option>
                                          </el-select>
                                          <el-select v-if="item.type == '02'" v-model="item.dateRule" class="inforemind-select">
                                              <el-option v-for="item2 in dateRuleList"
                                                              :key="item2.value"
                                                              :label="item2.label"
                                                              :value="item2.value"
                                              ></el-option>
                                          </el-select>
                                          <el-input class="inforemind-input inforemind-input2" type="number" min="0" v-model="item.dateVal" v-if="item.type === '02' && item.dateRule === '03'"></el-input>
                                          <span style="margin-right:10px;"  v-if="item.type === '02' && item.dateRule === '03'">&nbsp;&nbsp;天</span>
                                          <el-select v-if="item.type == '03'" v-model="item.statusType" class="inforemind-select">
                                              <el-option v-for="item2 in statusTypeList"
                                                              :key="item2.value"
                                                              :label="item2.label"
                                                              :value="item2.value"
                                              ></el-option>
                                          </el-select>
                                          <el-button @click="deleteRules(index)" icon="el-icon-delete" type="text" class="delete-btn">删除</el-button>
                                    </div>
                                </div>
                      </el-form-item>
                      <el-form-item label="提醒方式" prop="reminderMode" required>
                            <el-checkbox-group v-model="reminderObj.reminderMode">
                              <el-checkbox v-for="item in reminderModeList"
                                                  :key="item.value"
                                                  :label="item.value"
                              >{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                      </el-form-item>
                      <el-form-item label="信息内容" required>
                          <script
                            :id="editorId"
                            type="text/plain"
                            >
                          </script>
                      </el-form-item>
                      <el-form-item label="备注信息" prop="remark">
                        <el-input type="textarea" v-model="reminderObj.remark"  maxlength="100"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button @click="goBack">返 回</el-button>
                        <el-button type="primary" @click="submitForm('reminderObj')">保 存</el-button>
                      </el-form-item>
                </el-form>

            </div>
          </div>
        </i-layout>


  </section>
</template>

<script>
  // import req, { config } from 'api/employee/personal_dis'
  import req from 'api/employee/personal_dis'
  import access from 'mixins/access'
  import 'static/ueditor/ueditor.config.js'
  import 'static/ueditor/ueditor.all.js'
  import 'static/ueditor/lang/zh-cn/zh-cn.js'
  import 'static/ueditor/ueditor.parse.js'
  import moment from 'moment'
  import { getDict } from 'utils/index'

  export default {
    mixins: [access],
    data () {
      const reminderCycleCheck = (min, max, val, callback) => {
        let rule = /^\+?[1-9][0-9]*$/
        let re = new RegExp(rule)
        if (!re.test(val)) {
          callback(new Error(`请输入${min}-${max}的数字`))
        }
        if (val < min) {
          callback(new Error(`请输入${min}-${max}的数字`))
        } else if (val > max) {
          callback(new Error(`请输入${min}-${max}的数字`))
        } else {
          callback()
        }
      }
      const reminderCycleVali2 = (rule, value, callback) => {
        reminderCycleCheck(1, 99, value, callback)
      }
      const reminderCycleVali3 = (rule, value, callback) => {
        reminderCycleCheck(1, 7, value, callback)
      }
      const reminderCycleVali4 = (rule, value, callback) => {
        reminderCycleCheck(1, 31, value, callback)
      }
      return {
        empReminderId: this.$route.query.empReminderId,
        isNew: true,
        title: '新增到期提醒',
        rules: {
          reminderName: [{required: true, message: '请输入提醒名称', trigger: 'blur'}],
          reminderCycleType: [{required: true, message: '请选择提醒周期类型', trigger: 'change'}],
          reminderCycle: [{type: 'number', message: '请输入正确的数字'}],
          reminderCycle2: [{type: 'number', message: '请输入正确的数字'},
                                  {validator: reminderCycleVali2, trigger: 'blur'}],
          reminderCycle3: [{type: 'number', message: '请输入正确的数字'},
                                  {validator: reminderCycleVali3, trigger: 'blur'}],
          reminderCycle4: [{type: 'number', message: '请输入正确的数字'},
                                  {validator: reminderCycleVali4, trigger: 'blur'}],
          reminderTime: [{type: 'date', required: true, message: '请选择执行时间点', trigger: 'blur'}],
          reminderCondition: [{type: 'array', required: true, message: '请添加到期提醒条件', trigger: 'change'}],
          reminderType: [{type: 'array', required: true, message: '请选择提醒类型', trigger: 'change'}],
          reminderMode: [{type: 'array', required: true, message: '请选择提醒方式', trigger: 'change'}],
          employeeName: [{required: true, message: '请选择提醒员工', trigger: 'change'}]
        },
        reminderObj: {
          empReminderId: '',
          reminderName: '',
          reminderCycleType: '',
          reminderCycle: '',
          reminderCycle2: '',
          reminderCycle3: '',
          reminderCycle4: '',
          reminderDate: '',
          reminderTime: '',
          reminderType: [],
          reminderEmployeeId: '',
          reminderMode: [],
          reminderCondition: [],
          systemMessage: '',
          emailMessage: '',
          noteMessage: '',
          remark: '',
          employeeName: '',
          reminderTypeString: ''
        },
        newReminderCondition: [],
        loading: false,
        canSubmit: false,
        isShow: false,
        editor: null,
        editorId: 'messageContent',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 200,
          zIndex: 10
        },
        reminderTypeList: [],
        reminderModeList: [
          {
            label: '系统消息',
            value: '01'
          },
          {
            label: '邮件消息',
            value: '02'
          },
          {
            label: '短信消息',
            value: '03'
          }
        ],
        typeList: [
          {
            label: '流程',
            value: '01'
          },
          {
            label: '日期',
            value: '02'
          },
          {
            label: '员工状态',
            value: '03'
          }
        ],
        flowRuleList: [
          {
            label: '处于',
            value: '01'
          },
          {
            label: '不处于',
            value: '02'
          }
        ],
        flowTypeList: [],
        dateTypeList: [],
        dateRuleList: [
          {
            label: '等于当前日期',
            value: '01'
          },
          {
            label: '本月',
            value: '02'
          },
          {
            label: '离当前日期',
            value: '03'
          }
        ],
        statusTypeList: [
          {
            label: '在职',
            value: '01'
          },
          {
            label: '试用期',
            value: '02'
          }
        ]
      }
    },
    created () {
      const _this = this
      setTimeout(() => {
        _this.editor = window.UE.getEditor(_this.editorId, _this.config)
      })
      _this.loadDict()
      if (_this.empReminderId !== 'edit') {
        _this.loadDetail()
      } else {
        _this.addRules(true)
      }
      _this.title = _this.isNew ? '新增到期提醒' : '修改到期提醒'
    },
    mounted () {
    },
    watch: {
      'reminderObj.reminderCycle2' (val) {
        if (val) {
          this.reminderObj.reminderCycle = val
        }
      },
      'reminderObj.reminderCycle3' (val) {
        if (val) {
          this.reminderObj.reminderCycle = val
        }
      },
      'reminderObj.reminderCycle4' (val) {
        if (val) {
          this.reminderObj.reminderCycle = val
        }
      },
      'reminderObj.reminderType' (val) {
        const _this = this
        _this.reminderObj.reminderTypeString = _this.reminderObj.reminderType.join(',')
      }
    },
    methods: {
      loadDetail () {
        const _this = this
        _this.isNew = false
        _this.loading = true
        req('loadReminder', {empReminderId: _this.empReminderId})
        .then(data => {
          let cycle = parseInt(data.reminderCycle)
          _this.reminderObj = {
            ...data,
            reminderCondition: JSON.parse(data.reminderCondition),
            reminderMode: data.reminderMode.split(','),
            reminderTime: new Date(`2018-01-01 ${data.reminderTime}`),
            reminderDate: !data.reminderDate ? '' : new Date(`${data.reminderDate} 00:00:00`),
            reminderCycle2: data.reminderCycleType === '02' ? cycle : undefined,
            reminderCycle3: data.reminderCycleType === '03' ? cycle : undefined,
            reminderCycle4: data.reminderCycleType === '04' ? cycle : undefined,
            reminderCycle: cycle,
            reminderType: data.reminderType.split(',')
          }
          setTimeout(() => {
            _this.editor.ready(function () {
              if (data.emailMessage) {
                _this.editor.setContent(data.emailMessage)
              }
              if (data.noteMessage) {
                _this.editor.setContent(data.noteMessage)
              }
              if (data.systemMessage) {
                _this.editor.setContent(data.systemMessage)
              }
            })
          }, 1000)
          _this.loading = false
        })
        .catch(err => {
          _this.$message({type: 'error', message: err.message})
          _this.loading = false
        })
      },
      // 获取字典
      loadDict () {
        const _this = this
        getDict('REMINDERTYPE').then(data => {
          _this.reminderTypeList = data
        })
        getDict('REMINDERFLOWTYPE').then(data => {
          _this.flowTypeList = data
          _this.flowTypeList.push({label: '合同签订流程', value: 'empNewContractProcess'})
          _this.flowTypeList = _this.flowTypeList.filter((item) => {
            return item.label !== '合同新签流程' && item.label !== '合同续签流程'
          })
        })
        getDict('REMINDERDATETYPE').then(data => {
          _this.dateTypeList = data
        })
      },
      // 获取内容方法
      getUEContent () {
        return this.editor.getContent()
      },
      submitForm (formName) {
        const _this = this
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.canSubmit = true
            _this.loading = true
            _this.reminderModeFilter()
            _this.reminderConditioFilter()
            let content = _this.getUEContent()
            let mode = _this.reminderObj.reminderMode.join(',')
            if (content === '') {
              _this.loading = false
              _this.errortips('请填写信息内容！')
              return false
            }
            setTimeout(() => {
              if (_this.canSubmit) {
                _this.loading = true
                _this.reminderObj.reminderDate.toString()
                let pers = {
                  empReminderId: _this.isNew ? undefined : _this.reminderObj.empReminderId,
                  reminderName: _this.reminderObj.reminderName,
                  reminderCycleType: _this.reminderObj.reminderCycleType,
                  reminderCycle: _this.reminderObj.reminderCycleType !== '01' ? _this.reminderObj.reminderCycle : '0',
                  reminderDate: _this.reminderObj.reminderDate !== '' && _this.reminderObj.reminderDate !== null ? moment(_this.reminderObj.reminderDate).format('YYYY-MM-DD') : undefined,
                  reminderTime: moment(_this.reminderObj.reminderTime).format('HH:mm:ss'),
                  reminderCondition: _this.newReminderCondition,
                  reminderType: _this.reminderObj.reminderTypeString,
                  reminderEmployeeId: _this.reminderObj.reminderTypeString.indexOf('04') > -1 ? _this.reminderObj.reminderEmployeeId : undefined,
                  reminderMode: mode,
                  systemMessage: mode.indexOf('01') > -1 ? content : undefined,
                  emailMessage: mode.indexOf('02') > -1 ? content : undefined,
                  noteMessage: mode.indexOf('03') > -1 ? content : undefined,
                  remark: _this.reminderObj.remark
                }
                let url = _this.isNew ? 'addReminder' : 'editReminder'
                req(url, pers)
                .then(data => {
                  _this.loading = false
                  if (data) {
                    _this.$message({type: 'success', message: _this.isNew ? '添加成功！' : '修改成功！'})
                    setTimeout(() => {
                      _this.goBack()
                    }, 1000)
                  } else {
                    _this.$message({type: 'error', message: _this.isNew ? '添加失败！' : '修改失败！'})
                  }
                })
                .catch(err => {
                  _this.$message({type: 'error', message: `${_this.isNew ? '添加失败,' : '修改失败,'}${err.message}`})
                  _this.loading = false
                })
              }
            }, 1000)
          } else {
            _this.errortips('请把参数填写完整！')
            return false
          }
        })
      },
      resetForm (formName) {
        const _this = this
        _this.$refs[formName].resetFields()
        _this.editor.reset()
        _this.editor.setContent('')
        _this.reminderObj.reminderCondition = []
        _this.addRules(true)
      },
      handleIconClick () {
        this.isShow = !this.isShow
      },
      handleConfirm (selected) {
        const _this = this
        if (selected.length > 10) {
          _this.$message.error('特定人员个数不能超过10个！')
          return false
        }
        let names = []
        let ids = []
        selected.map(({employeeName, employeeId}) => {
          names.push(employeeName)
          ids.push(employeeId)
        })
        _this.reminderObj.employeeName = names.join(',')
        _this.reminderObj.reminderEmployeeId = ids.join(',')
      },
      addRules (isDate) {
        const _this = this
        _this.reminderObj.reminderCondition.push({
          type: isDate ? '02' : '',
          flowRule: '',
          flowType: '',
          dateRule: '',
          dateType: '',
          dateVal: '',
          statusType: '',
          andOr: 'and'
        })
      },
      deleteRules (index) {
        this.reminderObj.reminderCondition.splice(index, 1)
      },
      reminderModeFilter () {
        const _this = this
        const content = _this.getUEContent()
        if (_this.reminderObj.reminderMode.length > 0) {
          _this.reminderObj.reminderMode.map((item) => {
            if (item.value === '01') {
              _this.reminderObj.systemMessage = content
            } else if (item.value === '02') {
              _this.reminderObj.emailMessage = content
            } else if (item.value === '03') {
              _this.reminderObj.noteMessage = content
            }
          })
        }
      },
      reminderConditioFilter () {
        const _this = this
        let newArray = []
        let typeArray = []
        _this.reminderObj.reminderCondition.map((item) => {
          typeArray.push(item.type)
        })
        if (typeArray.join(',').indexOf('02') === -1) {
          _this.errortips('提醒条件必须包含日期类型！')
          return false
        }

        _this.reminderObj.reminderCondition.map((item) => {
          if (item.type === '') {
            _this.errortips()
            return false
          } else if (item.type === '01') {
            if (item.flowRule === '' || item.flowType === '') {
              _this.errortips()
              return false
            }
  
            newArray.push({
              type: '01',
              flowRule: item.flowRule,
              flowType: item.flowType,
              andOr: item.andOr
            })
          } else if (item.type === '02') {
            if ((item.dateType === '' || item.dateRule === '') || (item.dateRule === '03' && item.dateVal === '')) {
              _this.errortips()
              return false
            }

            newArray.push({
              type: '02',
              dateRule: item.dateRule,
              dateType: item.dateType,
              dateVal: item.dateRule === '03' ? item.dateVal : undefined,
              andOr: item.andOr
            })
          } else if (item.type === '03') {
            if (item.statusType === '') {
              _this.errortips('请把提醒条件填写完整！')
              return false
            }

            newArray.push({
              type: '03',
              statusType: item.statusType,
              andOr: item.andOr
            })
          }

          _this.newReminderCondition = newArray
        })
      },
      goBack () {
        this.$router.go(-1)
      },
      errortips (msg = '请把提醒条件填写完整！') {
        const _this = this
        _this.loading = false
        _this.canSubmit = false
        _this.$message.error(msg)
      }
    },
    destroyed () {
      this.editor.destroy()
    }
  }
</script>
<style lang="scss">
.inforemind-edit-layout {
  .inforemind-edit-title{
    font-size: 16px;
    margin-bottom: 30px;
    i {
      display: inline-block;
      padding: 0 20px;
      cursor: pointer;
    }
    i:hover{
      color: #409EFF;
    }
    span {
      display: inline-block;
      border-left: 1px solid #ccc;
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
    }
  }
  .item-flex{
    display: flex;
    align-items: center;
  }
  .inforemind-button{
    height: 25px;
    padding: 5px 15px;
    font-size: 12px;
    margin-left: 15px;
  }
  .inforemind-select, .inforemind-input{
    margin-left: 10px;
    width: 130px;
  }
  .inforemind-select2, .inforemind-input2{
    width: 80px;
  }
  .inforemind-label .el-radio__label{
    font-size: 12px;
  }
  .add-btn{
    font-size: 12px;
  }
  .delete-btn{
    margin-left: 10px;
    color: #ff6464;
    font-size: 12px;
  }
  .form-item-width{
    width: 200px;
  }
  .form-item-width2{
    width: 600px;
  }
}
</style>
