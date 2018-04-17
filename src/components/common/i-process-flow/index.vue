<template>
  <div>
    <div
      class="tmm-i-process-table"
      v-loading.fullscreen.lock="fullLoading"
      :element-loading-text="$loadingText">

      <base-info
        v-loading="flowBasicInfo === null && flowType === ''"
        element-loading-text="流程信息加载中..."
        :flowBaseInfo="flowBasicInfo"
        :flowType="flowType"
        ref="base">
      </base-info>

      <main
        style="min-height:150px;"
        v-loading="mainLoading"
        element-loading-text="基本信息加载中...">
        <slot
          v-for="item in showList"
          :name="item.fieldValue">
        </slot>
      </main>

      <div
        v-show="showHistory"
        v-loading="historyLoading"
        element-loading-text="节点信息加载中..."
        :class="[{'info-content':showHistory},'bottom']">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="设置流程节点审批人" name="first" class="flow-tab">
            <i-table :table="perTable">
              <template slot="table" slot-scope="tableScope">
                <el-table  :data="perTable.data" style="width: 100%">
                  <el-table-column
                    v-for="(per, idx) in perTable.columns"
                    :key="idx"
                    :label="per.label"
                    :prop="per.prop"
                  ></el-table-column>
                  <el-table-column label="节点类型"  prop="isMulti" align="center">
                    <template slot-scope="nodeType">
                      <span> {{nodeType.row.isMulti === 'Y' ? '多人审批节点' : '单人审批节点'}} </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="节点处理人"  >
                    <template slot-scope="scope">
                      <div v-if="scope.row.isNeed !== 'N' && startNode" @click="clickPeople(scope.row)">
                        <el-input v-model="scope.row.assigneeName" readonly >
                          <i slot="suffix">
                              <i class="el-input__icon iconfont icon-hr"></i>
                              <i
                                v-if="scope.row.tipsMessage"
                                class="el-icon-info"
                                style="color:#3da5fe;font-size:16px;"
                                @mouseenter="handleTipsMessageEnter($event, scope.row.tipsMessage)"
                                @mouseleave="handleTipsMessageLeave"
                              ></i>
                          </i>
                        </el-input>
                      </div>
                      <span v-else>
                        <span v-for="(assigneeItem, index) in scope.row.assigneeArr" :key="index" style="display:relative;">
                          <el-button
                            v-if="scope.row.assigneeArr[index]"
                            type="text"
                            style="margin-left:2px;"
                            @mouseenter.native="handlePersonnelEnter($event, scope.row.assigneeArr[index])"
                            @mouseleave.native="handlePersonnelLeave"
                          >{{scope.row.assigneeNameArr[index]}}</el-button>
                          <span v-else style="margin-left:2px;">{{scope.row.assigneeNameArr[index]}}</span>
                        </span>
                        <i
                          v-if="scope.row.tipsMessage"
                          class="el-icon-info"
                          style="color:#3da5fe;font-size:16px;"
                          @mouseenter="handleTipsMessageEnter($event, scope.row.tipsMessage)"
                          @mouseleave="handleTipsMessageLeave"
                        ></i>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </i-table>
            <el-tooltip
              ref="tipsMessageToolTip"
              :content="tipsMessage"
              placement="top"
            ></el-tooltip>
            <el-popover
              ref="personnelToolTip"
              effect="light"
              placement="left"
            >
              <CacheIShowPersonnelInfo :id="personnelId"></CacheIShowPersonnelInfo>
            </el-popover>
            <i-personnel-select
              :isShow.sync="peopleShow.show"
              :multiple="isMulti"
              :defaultSelectedPersonnel="defaultPeoPle"
              :hasGrant="false"
              @confirm="handleConfirm"
              ref="per"
            ></i-personnel-select>
          </el-tab-pane>

          <el-tab-pane label="流程审批历史" name="second" class="flow-tab">
            <i-table :table="historyTable">
              <template slot-scope="tableScope" slot="table">
                <el-table :data="historyTable.data"   style="width: 100%">
                  <el-table-column
                    v-for="(item, idx) in historyTable.columns"
                    :key="idx"
                    :label="item.label"
                    :prop="item.prop"
                    :align="item.align"
                  ></el-table-column>
                </el-table>
              </template>
            </i-table>
          </el-tab-pane>

          <el-tab-pane label="流程图" name="third" class="flow-image flow-tab">
            <!-- <img ref="img" /> -->
            <bpmn
              ref="bpmn"
              type="ins"
              :defId="processDefinitionKey"
              :insId="processInstanceId"
              :processedTask="this.perTable.data"
              :processedFlow="this.chooseFlowList">
            </bpmn>
          </el-tab-pane>

        </el-tabs>
      </div>

      <div
        v-if="errShowFlag && !historyLoading"
        class="margin20 mt10"
        style="border-top: 1px solid #e5e5e5;">

        <h2 class="info-title">流程计算过程</h2>

        <el-input
          type="textarea"
          :autosize="{ minRows: 7 }"
          v-model="debugInfo">
        </el-input>

      </div>

      <div>
        <i-dialog
          title="提交流程"
          v-model="show.submit"
          :toolbar="submitTool"
          class="tmm-dialog-process">
          <el-form
            class="flow__not-need-validate"
            ref='listParamsNext'
            v-clickoutside="exitMessage"
            label-width="120px"
            :model="listParamsNext"
            :rules="listParamsNextRules">

            <el-form-item
              v-if="multi"
              label="决议意见"
              prop="approved">
              <el-radio v-model="listParamsNext.approved" label="01">同意</el-radio>
              <el-radio v-model="listParamsNext.approved" label="02">不同意</el-radio>
            </el-form-item>

            <el-form-item label="流程审批意见" class="cancel">
              <el-input type="textarea" v-model="listParamsNext.description" :rows="5"></el-input>

              <section class="relative"  v-clickoutside="exitMessage">
                <div class="border btn">
                  <el-button
                    @click.stop.native="agree=!agree"
                    class="iconfont icon-yijian"
                    type="text"
                    style="color: #222"
                    >常用意见</el-button>
                </div>
                <div class="content" v-if="agree">
                  <ul class="message-list">
                    <li
                      class="border"
                      v-for="(mes, idx) in messageSList"
                      :key="idx">
                      <el-button type="text" class="el-icon-check" v-if="isMesS === mes.pfSwiftMessageId" />
                      <el-button type="text" v-else/>
                      <span class="span font-size-mini" @click="fillMesS(mes)">{{mes.swiftMessage}}</span>
                        <el-button
                          @click.native="deleteMessage(mes.pfSwiftMessageId, 'deleteMessageS')"
                          type="text"
                          class="el-icon-delete delete"
                        ></el-button>
                    </li>
                  </ul>
                  <div class="input border-0">
                    <input
                      v-model="swiftMessageS"
                      maxlength="100"
                      placeholder="输入并添加常用意见"
                      type="text"
                      class="el-input__inner border-0 font-size-mini">
                    <button
                      @click="postMessage('postMessageS')"
                      type="button"
                      class="el-button add add-btn el-button--primary">
                      <span>增加</span>
                    </button>
                  </div>
                </div>
              </section>
            </el-form-item>
          </el-form>
        </i-dialog>

        <i-dialog
          v-model="show.reject"
          destroyedWhenClose
          title="驳回流程"
          :toolbar="rejectTool"
          class="tmm-dialog-process">
          <el-form ref="rejectForm" label-width="100px" :model="overParams" :rules="rejectRules">
            <el-form-item label="驳回至" style="width:50%">
              <el-select v-model="overParams.toTaskKey" class="item" size="small">
                <el-option
                  v-for="(item,idx) in overruleNode"
                  :key="idx"
                  :label="item.toTaskName"
                  :value="item.toTaskKey"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="处理意见" class="cancel" prop="description">
              <el-input type="textarea" v-model="overParams.description" :rows="5"></el-input>

              <section class="relative" v-clickoutside="exitMessageR">
                <div class="border btn">
                  <el-button
                    class="iconfont icon-yijian"
                    type="text"
                    style="color: #222;"
                    @click.native.stop="reject=!reject"
                    >常用意见</el-button>
                </div>
                <div v-if="reject" class="content">
                  <ul class="message-list">
                    <li
                      class="border"
                      v-for="(mes, idx) in messageList"
                      :key="idx">
                      <el-button v-if="isMes === mes.pfSwiftMessageId" type="text" class="el-icon-check"></el-button>
                      <el-button v-else type="text"></el-button>
                      <span class="font-size-mini" @click="fillMes(mes)">{{mes.swiftMessage}}</span>
                      <el-button
                        @click.native="deleteMessage(mes.pfSwiftMessageId, 'deleteMessage')"
                        type="text"
                        class="el-icon-delete delete"
                      ></el-button>
                    </li>
                  </ul>
                  <div class="input">
                    <input
                      v-model="swiftMessage"
                      maxlength="100"
                      placeholder="输入并添加常用意见"
                      type="text"
                      class="el-input__inner font-size-mini border-0">
                    <!-- <div class="el-input-group__append  border-0"> -->
                      <button  type="button" class="el-button add add-btn el-button--primary" @click="postMessage('postMessage')">
                        <span>增加</span>
                      </button>
                    <!-- </div> -->
                  </div>

                </div>
              </section>
            </el-form-item>
          </el-form>
        </i-dialog>

        <i-dialog
          v-model="show.transmit"
          title="转办流程"
          :toolbar="transmitTool"
          class="tmm-dialog-process">
          <el-form label-width="100px" :model="overParams">

            <el-form-item label="转办人" style="width:50%">
              <div  slot-scope="scope" @click="clickTransmitPeople">
              <el-input v-model="toUserName" readonly >
                <i slot="suffix" class="el-icon-menu" ></i>
              </el-input>
              <i-personnel-select
                :isShow.sync="peopleShow.transmitShow"
                :multiple="false"
                :defaultSelectedPersonnel="defaultTransmitPeople"
                :hasGrant="false"
                @confirm="transmitPeopleConfirm" ref="transPer"
                ></i-personnel-select>
              </div>
            </el-form-item>

            <el-form-item label="转办意见" class="cancel">
              <el-input type="textarea" v-model="transmitDesc" :rows="5" ></el-input>
            </el-form-item>
          </el-form>
        </i-dialog>

      </div>

    </div>

    <footer class="footer" v-show="showFooter">
      <div class="footer-btn" v-if="footerShow">

        <el-button type="default" @click="getPrintInfo">打印</el-button>

        <el-button type="default" @click="close">关闭</el-button>

        <el-button
          v-if="buttonTypeMap.hasOwnProperty('temporary')"
          @click.native="postData('postWorkflowSave')"
          :disabled="btnable"
        >暂存</el-button>

        <el-button
          v-if="buttonTypeMap.hasOwnProperty('discard')"
          @click.native="deleteFlowConfirm"
          :disabled="btnable"
        >废弃</el-button>

        <el-button
          v-if="buttonTypeMap.hasOwnProperty('transmit')"
          @click.native="transmit"
          :disabled="btnable"
        >转办</el-button>

        <el-button
          v-if="buttonTypeMap.hasOwnProperty('reject') && !multi"
          :disabled="btnable"
          @click.native="overrule"
        >驳回</el-button>

        <el-button
          v-if="buttonTypeMap.hasOwnProperty('recall')"
          @click.native="withdrawFlowConfirm"
        >撤回</el-button>

        <el-button
          v-if="buttonTypeMap.hasOwnProperty('submit')"
          type="primary"
          :disabled="btnable"
          @click.native="submit"
        >提交</el-button>

        <el-button
          v-if="buttonTypeMap.hasOwnProperty('examine')&&startNode"
          type="primary"
          @click.native="submit"
          :disabled="btnable"
        >提交</el-button>

        <el-button
          v-else-if="buttonTypeMap.hasOwnProperty('examine')"
          type="primary"
          @click.native="submit"
          :disabled="btnable"
        >审批</el-button>
      </div>

      <!-- <flow-footer class="footer-info"></flow-footer> -->
    </footer>

    <print-info ref="print" :listOptions="showList" @confirm="print"></print-info>

  </div>
</template>

<script>
// import FlowFooter from 'components/common/i-footer/i-footer'
import req from 'api/employee/flow.js'
import BaseInfo from './base-info.vue'
import PrintInfo from './print-info'
import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import IShowPersonnelInfo from 'components/common/i-show-personnelInfo'
import CacheIShowPersonnelInfo from 'components/common/i-show-personnelInfo/cache-identity-card.vue'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import {formatTableDate} from 'utils/employee.js'
import { getActionType } from 'utils/flow'
import Clickoutside from 'directives/clickoutside'
import bpmn from 'components/common/i-process-bpmn'
import { showMessage } from 'utils/index'
import debounce from 'throttle-debounce/debounce'

const noop = () => {}

// 涉及的请求
const request = {
  // 审批流程
  PUT_TASK: 'putWorkflowSubmit',
  // 申请流程
  POST_TASK: 'postWorkflowSubmit',
  // 暂存流程
  SAVE_TASK: 'postWorkflowSave',
  // 驳回常用意见
  OVER_MASSAGE: 'getMessageList',
  // 审批常用意见
  PASS_MASSAGE: 'getMessageListS'
}

export default {
  name: 'IProcessFlow',

  components: {
    BaseInfo,
    IPersonnelSelect,
    IDialog,
    bpmn,
    PrintInfo,
    IShowPersonnelInfo,
    CacheIShowPersonnelInfo
    // FlowFooter
  },

  props: {
    processType: String,  // 流程类型
    model: {type: Object, default () { return {} }},  // 表单对象
    createName: String,  // 双向绑定的用户名
    reloadOpener: {
      type: Boolean,
      default: false
    }
  },

  directives: {
    Clickoutside
  },

  data () {
    return {
      showList: [],
      agree: false,
      reject: false,
      isMes: '',
      isMesS: '',
      messageList: [],
      messageSList: [],
      swiftMessage: '',
      swiftMessageS: '',
      defaultPeoPle: [],
      defaultTransmitPeople: [],

      per: {}, // 权限控制的存储数组
      isMulti: '',
      validates: [],
      processTypeProp: '',
      historyLoading: true,
      mainLoading: true,
      fullLoading: false,
      footerShow: false,
      taskId: this.$route.query.taskId,
      processInstanceId: this.$route.query.processInstanceId,
      processDefinitionKey: this.processType || this.$route.query.processType,
      isFlowCenter: this.$route.query.isFlowCenter || '',
      flowBasicInfo: null,
      allDetail: {},

      // 流程提交的参数
      listParams: {
        processType: '',
        processData: '',
        orgUnitName: ''
      },

      // 流程审批的参数
      listParamsNext: {
        description: '',
        taskId: '',
        processData: '',
        approved: ''
      },

      // 流程审批参数校验规则
      listParamsNextRules: {
        approved: [{ required: true, message: '请选择决议意见', trigger: 'change' }]
      },

      // 决议意见标识
      isApprovedSelected: false,

      // 审批按钮组
      submitTool: [{
        text: '取消',
        type: 'plain',
        func: (done) => {
          this.show.submit = false
          Object.keys(this.listParamsNext).forEach(param => {
            this.listParamsNext[param] = ''
          })
          done()
        }
      }, {
        text: '确定',
        type: 'primary',
        disabled: false,
        func: (done) => {
          this.$refs.listParamsNext.validate(valid => {
            if (valid) {
              this.postData(request.PUT_TASK)
              done()
            }
          })
        }
      }],

      // 驳回按钮组
      rejectTool: [{
        text: '取消',
        type: 'default',
        func: (done) => {
          this.show.reject = false
        }
      }, {
        text: '确定',
        type: 'primary',
        disabled: false,
        func: (done) => {
          if (!this.overParams.toTaskKey) {
            this.$message('请选择需要驳回到的节点')
            return false
          }
          this.$refs.rejectForm.validateField('description', errMsg => {
            if (!errMsg) {
              this.putWorkflowOverrule()
            }
          })
        }
      }],
      rejectRules: {
        description: [
            { required: true, message: '请输入处理意见', trigger: 'blur' }
        ]
      },

      transmitTool: [{
        text: '取消',
        type: 'text',
        func: (done) => {
          this.show.transmit = false
        }
      }, {
        text: '确定',
        type: 'primary',
        disabled: false,
        func: (done) => {
          if (!this.toUserId) {
            this.$message('请选择需要转办到的人员')
            return false
          }
          this.putWorkFlowTransfer()
        }
      }],

      perTable: {
        columns: [
          {prop: 'taskKey', label: '节点ID'},
          {prop: 'taskName', label: '节点名称'}
        ],
        data: null
      },

      historyTable: {
        columns: [
          {prop: 'dealDate', label: '接受时间', align: 'center'},
          {prop: 'endDate', label: '处理时间', align: 'center'},
          {prop: 'nodeName', label: '节点名称', align: 'left'},
          {prop: 'access', label: '处理人', align: 'left'},
          {prop: 'description', label: '描述', align: 'left'}
        ],
        data: null
      },
      // assigneeData: null,
      flowType: '',
      disable: [false],

      show: {
        submit: false,
        reject: false,
        transmit: false
      },

      peopleShow: {
        show: false,
        transmitShow: false
      },

      // 转办人
      toUserId: '',
      toUserName: '',
      transmitDesc: '',

      btnable: false,
      buttonType: '',
      buttonTypeMap: {},
      // 判断是否起草节点 true: 进入checkIsValueModified的判断
      startNode: true,
      initVal: false,
      activeName: 'first',
      rejectBtn: false,

      // 驳回参数
      overParams: {
        taskId: '',
        toTaskKey: '',
        description: '',
        processData: ''
      },

      imageSrc: '',
      overruleNode: [],
      row: '',

      // 保存权限控制的数据
      jurisdictionData: [],
      // 权限相关配置数据
      jurisdictionConfig: {
        // 不显示
        HIDE: '1',
        // 显示不可编辑
        DISABLED: '2',
        // 显示可编辑
        EDITABLE: '3'
      },

      // 测试数据
      people: '',
      tes: [],

      // 打印需要控制的数据
      showHistory: true,
      showFooter: true,
      saveList: [],

      // gatewayFlows
      gatewayFlows: null,

      // 需监听字段
      needWatchKeys: {},
      // 从需监听字段中提取的流程中心人Key (field.wfRelevance===01), 用于 handleCommit方法中从this.model取值
      flowCenterKey: '',
      flowCenterFieldName: '',
      // taskKey
      taskKey: '',

      // processDefinitionId
      processDefinitionId: '',

      // 保存旧的model
      oldModel: null,

      // 是否是三分之二决议
      multi: false,

      // 流程计算过程
      debugInfo: '',

      // bpmn渲染标志
      bpmnRendered: false,

      // 新版流程图标识
      isNewVersion: false,

      // 所有流程信息
      workflowAllInfo: null,

      // 已经经过的流程节点
      flowPassedElms: null,

      // node接口请求计数器
      counter: 0,

      // nodes接口请求锁
      lock: 0,

      // 已走和将走的分支列表
      chooseFlowList: null,

      // tooltip有关参数
      tipsMessage: '',
      personnelId: ''
    }
  },

  computed: {
    errShowFlag () {
      return this.$route.query['debug']
        ? this.$route.query['debug'].toLowerCase() === 'y'
        : false
    }
  },

  watch: {
    // 实现申请人双向绑定
    createName (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fillCreateName(newVal)
      }
    },

    // 监听 model
    model: {
      handler (newVal) {
        if (this.startNode) {
          if (Object.keys(this.needWatchKeys).length > 0) {
            for (let key of Object.keys(this.needWatchKeys)) {
              this.checkIsValueModified(key, newVal, this.oldModel)
            }
          }
          this.oldModel = JSON.parse(JSON.stringify(newVal))
        }
      },
      deep: true
    }
  },

  async created () {
    this.oldModel = JSON.parse(JSON.stringify(this.model))
    this.processTypeProp = this.$route.query.processType ? this.$route.query.processType : this.processType
    this.initVal = true
    try {
      await this.init()
      this.footerShow = true
    } catch (err) {
      this.footerShow = false
      this.initVal = false
    }
    this.initVal = false

    this.flowType = getActionType(this.$route.query.processType)

    this.getMessageList(request.OVER_MASSAGE)
    this.getMessageList(request.PASS_MASSAGE)
  },

  mounted () {
    this.getWorkflowImage(this.taskId)
    // this.getHeight()
  },

  methods: {
    // 检测对象值是否变化
    checkIsValueModified (key, newObj, oldObj) {
      if (newObj.hasOwnProperty(key)) {
        if (JSON.stringify(newObj[key]) !== JSON.stringify(oldObj[key])) {
          this.needWatchKeys[key] = Object.prototype.toString.call(newObj[key]) === '[object Object]' || Object.prototype.toString.call(newObj[key]) === '[object Array]'
            ? JSON.stringify(newObj[key])
            : newObj[key]
          this.postFlowAssigneeByKey(this.needWatchKeys)
        }
      } else {
        for (let oKey of Object.keys(newObj)) {
          if (Object.prototype.toString.call(newObj[oKey]) === '[object Object]') {
            this.checkIsValueModified(key, newObj[oKey], oldObj[oKey])
          }
        }
      }
    },

    // 点击常用意见外区域时关闭常用意见弹窗
    exitMessage (param) {
      this.agree = false
    },
    exitMessageR (param) {
      this.reject = false
    },

    // 选择驳回常用意见
    fillMes (item) {
      this.overParams.description = item.swiftMessage
      this.isMes = item.pfSwiftMessageId
      this.reject = false
    },

    // 选择审批常用意见
    fillMesS (item) {
      this.listParamsNext.description = item.swiftMessage
      this.isMesS = item.pfSwiftMessageId
      this.agree = false
    },

    // 获取驳回&审批常用意见表
    getMessageList (reqc) {
      req(reqc).then(res => {
        reqc === request.OVER_MASSAGE && (this.messageList = res)
        reqc === request.PASS_MASSAGE && (this.messageSList = res)
      })
    },

    // 新增审批&驳回常用意见
    postMessage (reqc) {
      // let list = reqc === 'postMessage' ? this.messageList : this.messageSList

      let swiftMessage = reqc === 'postMessage' ? this.swiftMessage : this.swiftMessageS
      // if (list.length > 2) {
      //   this.$message('常用意见最多为三条')
      //   return
      // }
      swiftMessage && req(reqc, {swiftMessage: reqc === 'postMessage' ? this.swiftMessage : this.swiftMessageS})
      .then(res => {
        reqc === 'postMessage' ? this.getMessageList(request.OVER_MASSAGE) : this.getMessageList(request.PASS_MASSAGE)
        reqc === 'postMessage' ? this.swiftMessage = '' : this.swiftMessageS = ''
      })
    },

    // 删除驳回&审批常用意见
    deleteMessage (pfSwiftMessageId, reqc) {
      req(reqc, {pfSwiftMessageId})
      .then(res => {
        reqc === 'deleteMessage' ? this.getMessageList(request.OVER_MASSAGE) : this.getMessageList(request.PASS_MASSAGE)
      })
    },

    // 初始化审批历史及表单数据
    async init () {
      try {
        this.workflowAllInfo = await this.getWorkflowAllInfo().then(res => res)
        this.getFlowData(this.workflowAllInfo.historyList)
        this.getWorkflowBase(this.workflowAllInfo)
        this.getWorkflowAssiginee(this.workflowAllInfo)
      } catch (err) {
        console.log(err)
        this.mainLoading = false
        this.historyLoading = false
      }

      // tooltip去抖节流处理
      this.activePopover = debounce(200, tooltip => tooltip.doShow())
      this.activateTooltip = debounce(200, tooltip => tooltip.handleShowPopper())
    },

    // 审批人选择人员选择器清空及填充默认值
    handleConfirm (selected) {
      let arr = []
      let ids = []

      // 1 直接从needWatchKeys中取值 （已选做法）
      // 2 使用 this.flowCenterKey从this.model中递归取值  取值结果与selected比对
      let flowCenterValue = this.needWatchKeys[this.flowCenterKey]
      if (selected.find(selectedItem => {
        return selectedItem.employeeId === flowCenterValue
      })) {
        showMessage('warning', `不能选择被${this.flowCenterFieldName}作为节点处理人`)
        this.peopleShow.show = true
        return
      }
      this.tes = selected
      selected.map(obj => {
        arr.push(obj.employeeName)
        ids.push(obj.employeeId)
      })

      this.row.assigneeName = arr.join(',')
      this.row.assignee = ids.join(',')
    },

    // 转办人员选择确认
    transmitPeopleConfirm (selected) {
      this.toUserId = selected[0].employeeId
      this.toUserName = selected[0].employeeName
    },

    // 审批人选择
    clickPeople (item) {
      this.isMulti = item.isMulti === 'Y'
      this.row = item

      this.$refs.per.resetData()

      this.defaultPeoPle = []

      let employeeName = item.assigneeName ? item.assigneeName.split(',') : []
      let employeeId = item.assignee ? item.assignee.split(',') : []

      employeeName.map((key, idx) => {
        this.defaultPeoPle.push({employeeName: key, employeeId: employeeId[idx]})
      })

      this.peopleShow.show = !this.peopleShow.show
    },

    // 转办时候点击人员选择
    clickTransmitPeople () {
      this.peopleShow.transmitShow = true
    },

    // createName的时候绑定申请人
    fillCreateName (text) {
      this.$refs.base.inner(text)
    },

    // 初始化表单数据并抛出fillin事件
    getWorkflowBase (data, init = true) {
      if (data) {
        this.buttonType = data.buttonType
        this.buttonTypeMap = data.buttonTypeMap
        this.startNode = data.startNode
        this.taskKey = data.taskKey
        this.multi = data.multi
        this.processDefinitionId = data.processDefinitionId
        this.taskId = data.taskId
        // 初始化流程标题
        this.initVal && data.pfInfoName && !data.buttonTypeMap.hasOwnProperty('submit') && this.$refs.base.titleInner(data.pfInfoName)

        if (data.processData) {
          let json = JSON.parse(data.processData)

          Object.keys(json).map(key => (this.model[key] = json[key]))

          formatTableDate([data], ['createDate'], true)

          this.flowBasicInfo = data

          // 按钮禁用
          // if (data.hasPower === 'N') {
          //   this.btnable = true
          // }

          init && this.$emit('fillin', json, data.isFlowCenter)
        }
        this.$emit('sponsor', this.$refs.base.sponsor())
        this.$emit('baseInfo', this.$refs.base.base())
        // 保存权限控制数据
        this.jurisdictionData = data.hasPower === 'N'
        ? this.formatJurisdictionData(JSON.parse(data.jurisdictionData))
        : (JSON.parse(data.jurisdictionData) || [])

        this.storageNeedWatchKeys(this.jurisdictionData)

        this.controlJurisdiction()
      }
      this.mainLoading = false
    },

    // 存储需监听的keys
    storageNeedWatchKeys (jurisdictionData) {
      for (let obj of jurisdictionData) {
        for (let field of obj.formFieldList) {
          if (field.hasOwnProperty('wfRelevance') && field.wfRelevance) {
            this.needWatchKeys[field.fieldValue] = ''
            // HACK: 通过判断缓存流程中心人的Key
            if (field.wfRelevance === '01') {
              this.flowCenterKey = field.fieldValue
              this.flowCenterFieldName = field.fieldName.replace(/id/i, '')
            }
          }
        }
      }
      this.initNeedWatchKeyValue()
    },

    // 初始化监听Key的初值
    initNeedWatchKeyValue (model = this.model) {
      for (let key of Object.keys(this.needWatchKeys)) {
        if (Object.keys(model).includes(key)) {
          this.needWatchKeys[key] = Object.prototype.toString.call(model[key]) === '[object Object]' || Object.prototype.toString.call(model[key]) === '[object Array]'
            ? JSON.stringify(model[key])
            : model[key]
        } else if (Object.prototype.toString.call(model[key]) === '[object Object]') {
          this.initNeedWatchKeyValue(model[key])
        }
      }
    },

    // 控制权限,将权限放入store的flow中
    controlJurisdiction () {
      this.$nextTick(() => {
        this.controlSectionJurisdiction(this.jurisdictionData)
        this.setJurisdictionData(this.jurisdictionData)
      })
    },

    // 如果haspower为n时候，格式化一下
    formatJurisdictionData (data) {
      data.forEach(ele => {
        ele.formFieldList.forEach(el => {
          if (el.jurisdiction === this.jurisdictionConfig['EDITABLE']) {
            el.jurisdiction = this.jurisdictionConfig['DISABLED']
          }
        })
      })
      return data
    },

    // 控制流程区域的显隐,返回剩下需要显示的区域数据
    controlSectionJurisdiction (data) {
      this.showList.splice(0)
      data.map(key => {
        if (key.jurisdiction === this.jurisdictionConfig['DISABLED'] || key.jurisdiction === this.jurisdictionConfig['EDITABLE']) {
          this.showList.push({fieldValue: key.fieldValue, jurisdiction: key.jurisdiction, name: key.fieldName})
        }
      })
    },

    // 传入对应slot中的输入框控制配置
    setJurisdictionData (data) {
      let showMap = {}
      let disabledMap = {}
      data.map(ele => {
        ele.formFieldList.map(el => {
          if (el.jurisdiction !== this.jurisdictionConfig['HIDE']) {
            showMap[el.fieldValue] = true
          }
          if (el.jurisdiction === this.jurisdictionConfig['DISABLED']) {
            disabledMap[el.fieldValue] = true
          }
        })
      })
      this.$store.commit('SET_FLOW_SHOW_MAP', showMap)
      this.$store.commit('SET_FLOW_DISABLED_MAP', disabledMap)
      this.$emit('jurConfig', showMap, disabledMap)
    },

    // 初始化流程图
    getWorkflowImage (taskId) {
      // this.$refs.img.src = `${this.$$.BASE_URL}/workflow/base/history/image?taskId=` + ((!taskId || taskId === 'undefined') ? '' : taskId) + '&processType=' + this.processDefinitionKey + '&random=' + Math.random()
    },

    // 初始化审批历史
    getFlowData (data) {
      if (data) {
        formatTableDate(data, ['dealDate', 'endDate'], true)
        this.historyTable.data = data
      }
    },

    // 初始化流程基础信息
    fillBase (data) {
      this.listParams.orgUnitName = data.orgUnitName
    },

    // 获取所有的表单
    getValidates (node, clear = true) {
      let childSub = true
      clear && this.validates.splice(0)
      node.map(ele => {
        ele.$options._componentTag === 'el-form' &&
        !ele.$el.classList.contains('flow__not-need-validate') &&
        this.validates.push(ele)
        ;(ele.$children.length !== 0) &&
        (childSub = this.getValidates(ele.$children, false) && childSub)
      })

      return this.validates
    },

    // 获取系统权限里需要校验的表单项
    getValidateMap () {
      let validateMap = {}
      Object.keys(this.showMap).map(key => { !this.disabledMap[key] && (validateMap[key] = true) })
      return validateMap
    },

    // 获取表单项的别名
    getAlias (rule, prop) {
      let alias = []

      rule.map((key, idx) => {
        typeof key === 'string' && alias.push(key)
      })
      return alias
    },

    // 获取真正需要校验的表单项
    getRules (form) {
      const validateMap = this.getValidateMap()
      const needValidator = form.rules && form.rules.VALIDATE_REQUIRED
      let needVal = {}

      console.log('validateMap', validateMap, form)

      form.rules && Object.keys(form.rules).map((rule) => {
        if (form.fields.find(item => item.prop === rule)) {
          let need = needValidator && needValidator.find(item => item === rule)
          let alias = Array.isArray(form.rules[rule]) && this.getAlias(form.rules[rule], rule) || []
          let isVal = alias && alias.find(ali => validateMap[ali]) || false

          if (!alias.length && validateMap[rule] || alias.length && isVal || need) {
            needVal[rule] = true
          }
        }
      })
      return needVal
    },

    // 校验每一个表单项
    // handleValidate (callback = noop) {
    //   const validates = this.getValidates(this.$parent.$children)

    //   let count = 0
    //   let pass = true

    //   let len = validates.reduce((init, ele) => {
    //     let val = this.getRules(ele)
    //     return init + Object.keys(val).length
    //   }, 0)
    //   if (validates.length === 0 && callback || !len) return callback(true)

    //   validates.map((ele, index) => {
    //     let val = this.getRules(ele)

    //     ele.rules && Object.keys(ele.rules).map(key => {
    //       if (ele.fields.find(item => item.prop === key)) {
    //         val[key] && ele.validateField(key, res => {
    //           if (res) pass = false
    //           console.log(key, count, len)
    //           if (++count === len) {
    //             console.log('end', key, count, len)
    //             callback(pass)
    //           }
    //         })
    //       }
    //     })
    //   })
    // },
    handleValidate (callback = noop) {
      const validates = this.getValidates(this.$parent.$children)

      if (validates.length === 0 && callback) return callback(true)

      let count = 0
      let pass = true

      validates.map((ele, index) => {
        if (!ele.$el.classList.contains('flow__not-need-validate')) {
          ele.validate(res => {
            if (!res) {
              pass = false
            }

            if (++count === validates.length) {
              callback(pass)
            }
          })
        }
      })
    },

    // 提交的操作函数
    submit () {
      if (this.$parent.postFlow) console.log(this.$parent.postFlow)
      if (typeof this.$parent.postFlow === 'function' && !this.$parent.postFlow()) return
      this.$emit('beforeSubmit')
      this.handleValidate(res => {
        this.validates = []
        console.log('结果', res)
        if (res) {
          let msg = false

          this.perTable.data && this.perTable.data.map(obj => {
            (obj.isNeed !== 'N' && !obj.assigneeName) && (msg = true)
          })

          if (msg === true) {
            this.$message({message: '请选择流程节点审批人后再进行操作', type: 'warning'})
            return
          }
          if (this.taskId && this.taskId !== 'undefined') {
            if (this.startNode) {
              // 驳回后提交 属于起草节点
              this.submitAfterOverrule()
            } else {
              // 审批 增加beforeApprove审批前监听事件
              if (typeof this.$parent.beforeApprove === 'function') {
                this.$emit('beforeApprove', () => { this.show.submit = true })
              } else {
                this.show.submit = true
              }
            }
          } else {
            // 提交
            this.openConfirm()
          }
        } else {
          this.$message({message: '输入信息有误或未填写完整，请检查', type: 'warning'})
        }
      })
    },

    // 申请流程提示窗
    openConfirm () {
      this.$confirm('确定要申请流程吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => this.postData(request.POST_TASK))
      // .catch(() => this.$message('您已取消操作'`))
    },
    // 驳回后的重新提交
    submitAfterOverrule () {
      this.$confirm('确定要继续申请流程吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.postData(request.PUT_TASK)
      })
    },
    // 驳回流程
    overrule () {
      this.getWorkflowOverrule(this.taskId)

      this.show.reject = true
    },

    // 获取驳回节点
    getWorkflowOverrule (taskId) {
      return req('getWorkflowOverrule', {taskId}).then(data => (this.overruleNode = data))
    },

    // 获取节点审批人
    getWorkflowAssiginee (data) {
      // HACK: 兼容旧流程图
      this.historyLoading = true
      req('getNewVersion', {
        procDefKey: this.processDefinitionKey
      }).then(res => {
        if (res) {
          this.isNewVersion = true
          if (this.processInstanceId) {
            Array.isArray(data.assgineeList) && (this.perTable.data = data.assgineeList)
            // HACK: 额外处理添加 assignessArr和assignessNameArr属性
            this.perTable.data.map(obj => {
              obj['assigneeArr'] = obj.assignee ? obj.assignee.split(',') : ['']
              obj['assigneeNameArr'] = obj.assigneeName ? obj.assigneeName.split(',') : ['']
            })
            this.gatewayFlows = data.gatewayFlows
            this.historyLoading = false
          } else {
            return this.postFlowAssigneeByKey()
          }
        } else {
          Array.isArray(data.assgineeList) && (this.perTable.data = data.assgineeList)
          this.perTable.data.map(obj => {
            obj['assigneeArr'] = obj.assignee ? obj.assignee.split(',') : ['']
            obj['assigneeNameArr'] = obj.assigneeName ? obj.assigneeName.split(',') : ['']
          })
          this.gatewayFlows = data.gatewayFlows
          this.historyLoading = false
        }

        console.log(this.perTable.data)
      })
    },

    // 根据 key 获取节点审批人
    postFlowAssigneeByKey (formData = this.needWatchKeys) {
      // HACK: 兼容旧流程图
      if (this.isNewVersion) {
        this.historyLoading = true
        this.btnable = true
        try {
          req('postFlowAssigneeByKey', {
            key: this.processDefinitionKey,
            processDefinitionId: this.processDefinitionId,
            taskKey: this.taskKey,
            formData: formData,
            lockCounter: ++this.counter
          }).then(res => {
            if (JSON.stringify(res) !== '{}') {
              if (res.lockCounter >= this.lock) {
                this.debugInfo = res.debugInfo || ''
                this.gatewayFlows = res.gatewayFlows || null
                this.perTable.data = res.processNodes || null
                if (this.perTable.data) {
                  // HACK: 额外处理添加 assignessArr和assignessNameArr属性
                  this.perTable.data.map(obj => {
                    obj['assigneeArr'] = obj.assignee ? obj.assignee.split(',') : ['']
                    obj['assigneeNameArr'] = obj.assigneeName ? obj.assigneeName.split(',') : ['']
                  })
                }
                this.chooseFlowList = res.chooseFlowList || null
              }
            } else {
              this.debugInfo = ''
              this.gatewayFlows = null
              this.perTable.data = null
              this.chooseFlowList = null
            }
            this.historyLoading = false
            this.btnable = false
          }).catch(err => {
            this.historyLoading = false
            throw err
          })
        } catch (err) {
          console.error(err)
        } finally {
          this.lock = this.counter
        }
      }
    },

    // 驳回
    putWorkflowOverrule () {
      this.overParams.taskId = this.taskId
      this.rejectTool[1].disabled = true
      req('putWorkflowOverrule', this.overParams)
      .then(data => {
        this.init()
        this.getWorkflowImage(this.taskId)
        this.$message('驳回成功')
        this.flash()
        Object.keys(this.show).map(key => (this.show[key] = false))
        this.comfirm()
      }).catch(() => {
        this.rejectTool[1].disabled = false
      })
    },

    // 转办流程
    transmit () {
      this.show.transmit = true
    },

    // 转办
    putWorkFlowTransfer () {
      let params = {
        taskId: this.taskId,
        toUserId: this.toUserId,
        description: this.transmitDesc
      }
      this.transmitTool[1].disabled = true
      req('putWorkFlowTransfer', params)
      .then(data => {
        this.init()
        this.getWorkflowImage(this.taskId)
        this.$message('转办成功')
        this.flash()
        Object.keys(this.show).map(key => (this.show[key] = false))
        this.comfirm()
      }).catch(() => {
        this.transmitTool[1].disabled = false
      })
    },

    // 废弃流程确认
    deleteFlowConfirm () {
      this.$confirm('该操作不可逆，确定要废弃该流程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => this.deleteFlow(this.taskId))
      .catch(() => this.$message('您已取消操作'))
    },

    // 废弃流程
    deleteFlow (taskId) {
      req('deleteTask', {taskId})
      .then(res => {
        this.init()
        this.getWorkflowImage(this.taskId)
        this.$message('废弃成功')
        this.comfirm()
      })
    },

    // 撤回流程确认
    withdrawFlowConfirm () {
      this.$confirm('该操作不可逆，确定要撤回该流程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => this.withdrawFlow(this.taskId))
      .catch(() => this.$message('您已取消操作'))
    },

    // 撤回流程
    withdrawFlow (taskId) {
      req('putWorkFlowRecall', {taskId})
      .then(res => {
        this.init()
        this.getWorkflowImage(this.taskId)
        this.$message('撤回成功')
        this.comfirm()
      })
    },

    // 发送请求
    postData (reqc) {
      this.$emit('submit')

      let hasTask = this.taskId && this.taskId !== 'undefined' && this.taskId !== 'null'
      let data

      // 获取表单数据
      data = typeof this.$parent.postFlow === 'function' ? this.$parent.postFlow() : this.model

      let listParams = hasTask && (reqc === request.POST_TASK || reqc === request.PUT_TASK) ? this.listParamsNext : this.listParams

      listParams.processData = JSON.stringify(data)
      console.log('data', data)
      listParams.processType = this.flowBasicInfo ? this.flowBasicInfo.processType : this.processTypeProp
      listParams.taskId = hasTask ? this.taskId : ''

      // 获取流程标题
      listParams.pfInfoName = this.$refs.base.console()
      listParams.isFlowCenter = this.isFlowCenter

      listParams.assgineeList = this.perTable.data

      // 添加gatewayFlows
      listParams.gatewayFlows = this.gatewayFlows
      listParams.taskKey = this.taskKey

      let fillBase = async () => {
        let baseData = await this.$refs.base.base()

        // 获取流程头部信息
        this.fillBase(baseData)
        this.btnable = true
        this.submitTool[1].disabled = true
        this.fullLoading = true
        req(reqc, listParams)
        .then(async data => {
          this.taskId = data

          // this.getWorkflowImage(data)
          // this.getFlowData(data)
          // this.getWorkflowBase(data, this.processType, false)

          reqc === 'postWorkflowSave' ? this.$message('暂存成功') : this.comfirm()

          this.workflowAllInfo = await this.getWorkflowAllInfo().then(res => res)
          this.getFlowData(this.workflowAllInfo.historyList)
          this.getWorkflowBase(this.workflowAllInfo, false)

          this.flash()
          Object.keys(this.show).map(key => (this.show[key] = false))
          this.fullLoading = false
        })
        .catch(err => {
          this.$emit('err', err)
          this.btnable = false
          this.submitTool[1].disabled = false
          this.fullLoading = false
        })
      }

      fillBase()
    },

    // 刷新流程中心页面
    flash () {
      if (this.reloadOpener || (/flow/).test(window.opener.location.href)) {
        window.opener.location.reload()
      }
    },

    comfirm () {
      this.$confirm('操作已成功，是否要关闭窗口', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => window.close())
      .catch(() => this.$message('您已取消操作'))
    },

    // 获取打印信息
    getPrintInfo () {
      this.$refs.print.openDialog()
    },

    // 打印流程
    print (value) {
      this.saveList = this.showList
      this.showList = value
      this.showHistory = false
      this.showFooter = false
      var flowHeader = document.getElementById('flow-header')
      flowHeader.style.display = 'none'
      this.$nextTick(() => {
        window.print()
        this.showList = this.saveList
        this.showHistory = true
        this.showFooter = true
        flowHeader.style.display = 'inline'
      })
    },

    // 关闭窗口
    close () {
      window.close()
    },

    // 获取底部tabs栏最大高度
    getHeight () {
      let tabs = document.getElementsByClassName('flow-tab')
      let maxHeight = this.$refs.img.height
      Array.prototype.slice.call(tabs).map(ele => {
        if (maxHeight < ele.getBoundingClientRect().height) {
          maxHeight = ele.getBoundingClientRect().height
        }
      })

      Array.prototype.slice.call(tabs).map(ele => {
        ele.style.minHeight = maxHeight + 50 + 'px'
      })
    },

    // tab点击
    handleTabClick (el) {
      // XXX: 多次重复点击tab可能会很卡，需防抖
      if (el.name === 'third') {
        this.$refs.bpmn.init()
      }
    },

    // 获取所有流程信息
    getWorkflowAllInfo (
      procDefKey = this.processDefinitionKey,
      procInstId = this.processInstanceId,
      taskId = this.taskId
    ) {
      return req('getWorkflowAllInfo', { procDefKey, procInstId, taskId })
    },

         /** tipsMessage鼠标移入监听 */
    handleTipsMessageEnter (ev, content) {
      const cell = ev.target

      if (this.$refs.tipsMessageToolTip) {
        const tooltip = this.$refs.tipsMessageToolTip
        this.tipsMessage = content
        tooltip.referenceElm = cell
        tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
        tooltip.doDestroy()
        tooltip.setExpectedState(true)
        this.activateTooltip(tooltip)
      }
    },

      /** tipsMessage鼠标移出监听 */
    handleTipsMessageLeave (ev) {
      this.closeTipsMessageToolTip()
    },

      /** 关闭搜索项移入显示的tooltip */
    closeTipsMessageToolTip () {
      const tooltip = this.$refs.tipsMessageToolTip
      if (tooltip) {
        tooltip.setExpectedState(false)
        tooltip.handleClosePopper()
        // TODO: 控制内层元素 popper?
        tooltip.$refs.popper.style.display = 'none'
      }
    },

     /** popover鼠标移入监听 */
    handlePersonnelEnter (ev, content) {
      const cell = ev.target
      if (this.$refs.personnelToolTip) {
        const tooltip = this.$refs.personnelToolTip
        this.personnelId = content
        tooltip.referenceElm = cell
        tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
        tooltip.doDestroy()
        // tooltip.setExpectedState(true)
        this.activePopover(tooltip)
       //  this.activateTooltip(tooltip)
      }
    },

      /** 鼠标移出监听 */
    handlePersonnelLeave (ev) {
      this.closePersonnelToolTip()
    },

      /** 关闭搜索项移入显示的tooltip */
    closePersonnelToolTip () {
      const tooltip = this.$refs.personnelToolTip
      if (tooltip) {
        // tooltip.setExpectedState(false)
        tooltip.doClose()
        // tooltip.handleClosePopper()
        tooltip.$refs.popper.style.display = 'none'
      }
    }

  }
}
</script>
<style lang="scss" scoped>
@page { margin: 1cm; }
.border-b {
  border-bottom: 1px solid #E8E8E8;
};
.border-0 {
  border: 0;
};
.relative {
  position: relative;
};

.content {
  border: 1px solid #E8E8E8;
  border-top: 0;
  position: absolute;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  .input {
    border-top: 1px solid #E8E8E8;
    display: flex;
    height: 30px;
    .add-btn {
      flex-basis: 10%;
      padding: 0;
    };
  };
  .add {
    background: #20a0ff;
    border-radius: 0;
    border: 0;
    color: #fff;
    width: 100%;
    height: 32px;
    margin-top: -1px;
    margin-right: -1px;
  }
}

.btn, button {
  font-size:12px;
};
.btn{
  border-bottom: 1px solid #E8E8E8;
  border-right: 1px solid #E8E8E8;
  border-left: 1px solid #E8E8E8;
  button {
    width: 100%;
    text-align: left;
    span {
      padding-left: 10px;
    }
  }
};
.border {
  height: 28px;
  line-height: 28px;
  padding: 0 5px;
};
.tip {
  display: flex;
  cursor: pointer;
  font-size: 0;
  .el-icon-close {
    position: inherit;
  }
  .delete {
    visibility: hidden;
  }
  &:hover {
    background: #FAFAFA;
  };
  &:hover .delete {
    visibility: visible;
  }
  span {
    flex-basis: 94%;
    padding-left: 10px;
  }
  button {
    flex-basis: 3%;
    color: #222;
    font-size: 2px;
  }
}
// .flow-image {
//   text-align: center;
//   .tip {
//     color: #5e7382;
//     padding: 10px 0;
//   }
//   .bottom {
//     margin: 20px;
//   }
// }
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
  .footer-btn {
    text-align: right;
    padding: 12px 25px 13px;
    background: #FFFFFF !important;
    border-top: 1px solid #E5E5E5;
    overflow: hidden;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    height: 60px;
    margin-left: -20px;
    & > button{
      width: 60px;
      height: 36px;
    }
  }
  .footer-info {
    margin-left: -20px;
  }
}

.bottom {
  padding: 20px;
}
</style>

<style lang="scss">
.tmm-i-process-table {
  padding-bottom: 140px;
  position: relative;
  margin-bottom: 0;
  .el-tabs__nav .is-active　{
    color: #000 !important;
  }

}
.tmm-dialog-process  {
    .el-dialog {
      overflow: initial !important;
      .el-dialog__body {
        overflow: initial !important;
        .cancel {
          .message-list {
            max-height: 112px;
            overflow-y: scroll;
          }
          textarea {
            border: 1px solid #dfe6ec;
            border-radius: 0;
            resize: none;
          };
        }
      }
    }

  }
  h2.info-title {
    font-size: 14px;
    color: #000;
    letter-spacing: 0;
    line-height: 14px;
    font-weight: bold;
    margin: 20px 0;
  }
</style>
