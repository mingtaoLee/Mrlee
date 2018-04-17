<template>
  <div>
    <i-layout>
      <div
        slot="section"
        class="tempalte-config-container">
        <div class="flex">
          <div>{{reProcdefName}}配置</div>
          <el-button
            class="fr"
            type="text"
            @click="onBack">
            <i class="icon iconfont icon-return fs30"></i>
          </el-button>
        </div>
        <section class="all mt15">
          <div class="draw">
            <bpmn
              ref="bpmn"
              type="def"
              :defId="processId"
              :isActive="isBpmnActive"
              @elm-click="getConfigure">
            </bpmn>
          </div>
          <transition name="toggle">
            <!-- v-clickoutside="onCloseHandler" -->
            <div
              v-show="isShowSession"
              v-loading="sessionLoading"
              :element-loading-text="$loadingText"
              class="tree">
              <el-tabs
                v-model="activeName"
                class="tab"
                @tab-click="handleClick">
                <el-tab-pane label="表单配置" name="second">
                  <el-select
                    v-model="formConfigName"
                    class="over-width"
                    filterable
                    @change="onSelectList"
                    size="mini">
                    <el-option
                      v-for="item in formNameList"
                      :key="item"
                      :label="item.formMenuName"
                      :value="item.formMenuName"
                      @click.native.stop>
                    </el-option>
                  </el-select>

                  <config-list :list="dataList"></config-list>
                </el-tab-pane>

                <el-tab-pane label="规则配置" name="third" v-if="ruleConfigurable">
                  <el-select
                    class="over-width mb20"
                    v-if="ruleTypeLoaded"
                    v-model="ruleConfig.type">
                    <el-option
                      v-for="(type, idx) in ruleTypes"
                      :key="idx"
                      :label="type.label"
                      :value="type.value">
                    </el-option>
                  </el-select>

                  <el-input
                    v-if="ruleConfig.type === '05'"
                    v-model="personnels"
                    readonly>
                      <i
                        slot="suffix"
                        class="el-icon-menu"
                        @click="()=>this.isPersonSelectShow = true"
                      ></i>
                  </el-input>
                  <i-personnel-select
                    :isShow.sync="isPersonSelectShow"
                    :multiple="false"
                    @confirm="handlePersonSelectConfirm"
                  ></i-personnel-select>

                  <el-input
                    v-if="ruleConfig.type === '04'"
                    class="over-width"
                    type="text"
                    placeholder="请输入表单中的控制变量"
                    v-model="ruleConfig.employeeKey">
                  </el-input>

                  <el-input
                    v-if="ruleConfig.type === '03'"
                    class="tab-textarea__rule"
                    type="textarea"
                    placeholder="请输入规则"
                    v-model="ruleConfig.drl">
                  </el-input>

                  <el-select
                    class="over-width"
                    v-else-if="ruleConfig.type === '01'"
                    v-model="ruleConfig.principalId"
                    filterable
                    clearable>
                    <el-option
                      v-for="(p, idx) in principals"
                      :key="idx"
                      :label="p.name"
                      :value="p.wfPrincipalId">
                    </el-option>
                  </el-select>

                  <decision-table
                    ref="decision"
                    class="over-width"
                    v-if="ruleConfig.type === '02' && ruleConfigurable"
                    :decisions="ruleConfig.decisions"
                    :opts="ruleConfigOpts">
                  </decision-table>
                </el-tab-pane>
              </el-tabs>

              <div class="action">
                <el-button type="plain" @click="onCloseHandler">关闭</el-button>
                <el-button type="primary" @click="onConfirmHandler">保存</el-button>
              </div>
            </div>
          </transition>
        </section>
      </div>
    </i-layout>
  </div>
</template>
<script>
import FlowDraw from 'components/common/i-process-flow/flow-draw'
import ConfigList from './config-list'
import req from 'api/system/flow-managent'
import access from 'mixins/access'
import bpmn from 'components/common/i-process-bpmn'
import Clickoutside from 'directives/clickoutside'
import { getDict } from 'utils/index.js'
import DecisionTable from '../../components/decision-table'

const RULECONFIG_DEFAULT = {
  type: '01',
  principalId: '',
  decisions: [],
  drl: ''
}

export default {
  directives: {
    Clickoutside
  },

  mixins: [access],

  components: {
    FlowDraw,
    ConfigList,
    bpmn,
    DecisionTable
  },

  data () {
    return {
      // 模版id
      processId: decodeURI(this.$route.query.reProcdefId),
      // 模版名字
      reProcdefName: decodeURI(this.$route.query.reProcdefName) + '的' || '',
      // 节点key
      taskKey: '',
      // 所选表单id
      pfFormMenuId: '',
      // tab的name
      activeName: 'second',
      // 基础配置
      baseConfig: {
        rule: '',
        isStep: ''
      },
      // 是否显示右侧
      isShowSession: false,
      // 右侧加载
      sessionLoading: false,

      // 所选列表名
      formConfigName: '',
      // 表单列表
      formNameList: [],
      // 树的数据
      dataList: [],
      // 流程图点击状态
      isBpmnActive: false,
      // 规则类型渲染标识
      ruleTypeLoaded: false,
      // 规则类型字典
      ruleTypes: [],
      // 规则类型暂存字段
      ruleTypesStorage: [],
      // 角色列表
      principals: [],
      // 规则配置
      ruleConfig: {
        type: '',
        principalId: '',
        decisions: [],
        drl: '',
        employeeKey: '',
        employeeId: ''
      },
      // 规则配置是否可用
      ruleConfigurable: true,
      // 决策表规则
      ruleConfigOpts: null,
      // 人员选择器
      isPersonSelectShow: false,
      personnels: ''
    }
  },

  created () {
    this.getJurisdiction()
  },

  // 生成流程图
  mounted () {
    this.$refs.bpmn.init()
    this.getRuleTypes()
  },

  methods: {
    // 深度克隆
    _clone (obj) {
      return JSON.parse(JSON.stringify(obj))
    },

    // 选择不同规则配置类型
    getPrincipalList () {
      req('getPrincipalList', {
        entityType: '01'
      }).then(res => {
        this.principals = res
      })
    },

    // 获取下拉字典
    getRuleTypes () {
      getDict('RULE_TYPE').then(res => {
        this.ruleTypesStorage = res
        this.ruleTypeLoaded = true
      })
    },

    // 获取配置
    getConfigure (value) {
      this.isShowSession = true
      if (value.type === 'startEvent' || value.type === 'endEvent') {
        this.onCloseHandler()
      } else {
        this.isBpmnActive = true
        this.taskKey = value.id

        if (value.startNode === '1') {
          this.activeName = 'second'
          this.ruleConfigurable = false
        } else {
          this.ruleConfigurable = true
          this.filterRuleTypes(value)
          this.getRuleConfig(value)
        }
        this.getDataWithNode()
      }
    },

    filterRuleTypes (value) {
      if (/\w+Gateway/.test(value.type)) {
        this.ruleConfig.type = '02'
        RULECONFIG_DEFAULT.type = '02'
        this.ruleTypes = this.ruleTypesStorage.filter(rule => rule.value !== '01')
      } else {
        this.ruleConfig.type = '01'
        RULECONFIG_DEFAULT.type = '01'
        this.ruleTypes = this._clone(this.ruleTypesStorage)
      }
    },

    // 获取反显数据
    getRuleConfig (value) {
      req('getRuleConfig', {
        procDefId: this.$route.query.reProcdefId,
        taskKey: value.id
      }).then(res => {
        if (res) {
          Object.keys(res).map(key => {
            res[key] = res[key] || this.ruleConfig[key]
          })
          // Hack: 决策表分组Select 获取反显数据
          res.decisions.forEach((item, index) => {
            if (item.conditions) {
              item.conditions.forEach((conItem, index) => {
                if (conItem.left) {
                  conItem.left = conItem.group + '-' + conItem.left
                }
              })
            }
          })
          this.ruleConfig = res
        } else {
          this.ruleConfig = this._clone(RULECONFIG_DEFAULT)
        }
        this.getPrincipalList()
        this.getDecisionAttrs(value)
      })
    },

    // 获取下拉列表
    getDecisionAttrs (value, elmType = '') {
      elmType = /\w+Gateway/.test(value.type)
        ? 'gateway'
        : 'node'
      req('getDecisionAttrs', {
        procDefId: this.$route.query.reProcdefId,
        taskKey: value.id,
        elementType: elmType
      }).then(res => {
        // Hack: 决策表分组Select 下拉列表
        res.left.forEach((item, index) => {
          if (item.options) {
            item.options.forEach((opItem, index) => {
              if (opItem.value) {
                opItem.value = item.group + '-' + opItem.value
              }
            })
          }
        })
        this.ruleConfigOpts = res
      })
    },

    // 回到上一层
    onBack () {
      this.$router.push({
        path: '/system/flow_management/template_management'
      })
    },
    // 关闭
    onCloseHandler () {
      this.isBpmnActive = false
      this.isShowSession = false
    },
    // 保存
    onConfirmHandler () {
      if (this.activeName === 'second') this.modityDataList()
      else if (this.activeName === 'third') {
        if (this.ruleConfig.type === '02') {
          this.$refs['decision'].validateTable().then(res => {
            if (res) this.putRuleConfig()
          })
        } else {
          this.putRuleConfig()
        }
      }
    },

    // 保存规则配置
    putRuleConfig () {
      // ruleConfig.decisions[].conditions[].left   split('-')[1]
      // Hack: 决策表分组Select 提交表单前处理
      let newRuleConfig = JSON.parse(JSON.stringify(this.ruleConfig))
      newRuleConfig.decisions.forEach((item, index) => {
        if (item.conditions) {
          item.conditions.forEach((conItem, index) => {
            if (conItem.left) {
              conItem.left = conItem.left.split('-')[1]
            }
          })
        }
      })
      req('putRuleConfig', {
        procDefId: this.$route.query.reProcdefId,
        taskKey: this.taskKey,
        ruleParameters: newRuleConfig
      }).then(res => {
        if (res) {
          this.$refs.bpmn.init()
          this.$message.success('保存成功')
        } else {
          this.$message.error('保存失败')
        }
      })
    },

    // 获取表单列表
    getJurisdiction () {
      req('getMenuNameList').then(res => {
        this.formNameList = res
      })
    },
    // 选择表单列表
    onSelectList (val) {
      let len = this.formNameList.length
      let item
      let vo
      if (len !== 0) {
        while (len--) {
          item = this.formNameList[len]
          if (val === item.formMenuName) {
            vo = item
          }
        }
      }
      this.formConfigName = vo.formMenuName
      this.pfFormMenuId = vo.pfFormMenuId
      this.getDataList(vo.pfFormMenuId)
    },
    // 根据id获取名字
    getFormMenuNameWithId (id) {
      let len = this.formNameList.length
      let item
      let name = ''
      if (len !== 0) {
        while (len--) {
          item = this.formNameList[len]
          if (item.pfFormMenuId === id) {
            name = item.formMenuName
            break
          }
        }
      }
      return name
    },
    // 点击节点获取树的具体信息
    getDataWithNode () {
      this.sessionLoading = true
      req('getFormjurisdiction', {
        processDefinitionId: decodeURI(this.$route.query.reProcdefId),
        taskKey: this.taskKey
      }).then(res => {
        this.formConfigName = this.getFormMenuNameWithId(res.pfFormMenuId)
        this.pfFormMenuId = res.pfFormMenuId
        this.dataList = res.formFieldList || []
        this.setIsShow()
        this.sessionLoading = false
      }).catch(res => {
        this.onCloseHandler()
        this.sessionLoading = false
      })
    },
    // 根据下拉列表获取树的具体信息
    getDataList (pfFormMenuId) {
      this.sessionLoading = true
      req('getFormjurisdiction', {
        processDefinitionId: decodeURI(this.$route.query.reProcdefId),
        taskKey: this.taskKey,
        menuId: pfFormMenuId
      }).then(res => {
        this.dataList = res.formFieldList || []
        this.setIsShow()
        this.sessionLoading = false
      }).catch(res => {
        this.sessionLoading = false
      })
    },
    // 设置隐藏或显示
    setIsShow () {
      let len = this.dataList.length
      let item
      if (len !== 0) {
        while (len--) {
          item = this.dataList[len]
          item.isShow = false
        }
      }
    },
    // 修改树的信息
    modityDataList () {
      this.sessionLoading = true
      req('modifyFormJurisdiction', {
        processDefinitionId: decodeURI(this.$route.query.reProcdefId),
        taskKey: this.taskKey,
        pfFormMenuId: this.pfFormMenuId,
        formFieldList: this.dataList
      }).then(res => {
        if (res) {
          this.$refs.bpmn.init()
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }
        this.sessionLoading = false
      }).catch(res => {
        this.sessionLoading = false
      })
    },
    handlePersonSelectConfirm (selected) {
      this.personnels = selected.map(item => item.employeeName).toString()
      this.ruleConfig.employeeId = selected.length > 0 ? selected[0].employeeId : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
}
.fs30 {
  font-size: 30px;
}
.all {
  width: 100%;

  .draw {
    width: 100%;
    overflow: auto;
    transition: all .3s ease;
  }

  .tree {
    box-sizing: border-box;

    position: absolute;
    z-index: 6;

    border-left: 1px solid #ccc;
    padding: 15px;
    padding-right: 0;

    width: 500px;

    height: calc(100% - 70px);

    top: 69px;
    right: 15px;

    background: white;
    box-shadow: -2px 0 3px 0 rgba(40, 40, 60, .2);
  }
}
.tab {
  height: 100%;
}
.action {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;

  text-align: right;

  padding: 10px;
  border-top: 1px solid #ccc;
}
.item {
  flex: 1;
  display: flex;
  padding-right: 8px;
  align-items: center;
  justify-content: space-between;
}

.toggle-enter-active, .toggle-leave-active {
  transition: all .3s ease;
}

.toggle-enter, .toggle-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
<style lang="scss">
.el-tabs__nav-wrap::after {
  width: 0;
}
.el-form-item__content {
  .el-select--small {
    display: inline-block;
  }
}
.tab-textarea__rule.el-textarea {
  .el-textarea__inner {
    white-space: pre;
    overflow: scroll;
    min-height: 400px!important;
  }
}

.tab {
  .el-tabs__content {
    overflow-y: scroll;

    height: 100%;
    max-height: calc(100% - 100px);

    padding-right: 10px;
  }
}
</style>
