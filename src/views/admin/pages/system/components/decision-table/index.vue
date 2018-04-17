<template>
  <main class="decision-table">
    <header class="header">
      <el-button
        type="text"
        @click="createGroup">
        <i class="el-icon-plus"></i>
        新增规则
      </el-button>
    </header>

    <section class="section">
      <div
        class="decision"
        v-for="(decision, dIdx) in decisions"
        :key="decision">
        <ul class="conditions" v-if="opts !== null">
          <li
            v-for="(condition, cIdx) in decision.conditions"
            :key="condition"
            class="condition">
            <el-form :model="condition" ref="conditionForm">
              <el-form-item
                class="left"
                prop="left"
                :rules="{required: true, trigger: 'blur'}">
                <el-select
                  clearable
                  placeholder="左等式"
                  v-model="condition.left"
                  @change="storageLeftGroup(condition)">
                  <el-option-group
                    v-for="group in opts.left"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>

              <el-form-item
                class="middle"
                prop="operate"
                :rules="{required: true, trigger: 'blur'}">
                <i-select
                  placeholder="比较符"
                  parameter="WP_M_OPERATOR"
                  :clearable="true"
                  v-model="condition.operate">
                </i-select>
              </el-form-item>

              <el-form-item
                class="right"
                prop="right"
                :rules="{required: true, trigger: 'blur'}">
                <el-select
                  v-if="~opts.right.findIndex(val => val.value === condition.left)"
                  clearable
                  placeholder="右等式"
                  v-model="condition.right">
                  <el-option
                    v-for="item in getRightOpts(condition.left, opts)"
                    :key="item"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

                <el-input
                  v-else
                  clearable
                  placeholder="右等式"
                  v-model="condition.right">
                </el-input>
              </el-form-item>

              <el-button type="text"
                :class="[
                  { disable: judgeDeleteDisable(decision.conditions) }
                ]"
               @click="judgeDeleteDisable(decision.conditions) || deleteCondition(dIdx, cIdx)"
              >删除</el-button>
            </el-form>
          </li>
          <li class="condition">
            <el-button
              @click="createCondition(dIdx, cIdx)"
              class="decision-create-button"
            >添加条件</el-button>
          </li>
          <li class="ac result">
            <el-form
              class="flex"
              ref="decisionForm"
              :model="decision">
              <el-form-item
                style="flex:1"
                prop="result"
                :rules="{required: true, trigger: 'blur'}">
                <el-select
                  clearable
                  placeholder="请选择"
                  v-model="decision.result">
                  <el-option
                    v-for="result of opts.result"
                    :key="result.label"
                    :label="result.label"
                    :value="result.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="ar">
                <el-button
                  type="danger"
                  class="decision-delete-button"
                  @click="deleteDecision(dIdx)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-form-item>
            </el-form>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script>
import { confirmPopover } from 'utils/index'

const decisionContent = {
  conditions: []
}

const conditionContent = {
  left: '',
  operate: '',
  right: ''
}

export default {
  name: 'DecisionTable',

  props: {
    // 反显规则数组
    decisions: {
      required: true,
      type: Array
    },
    // 待选规则列表
    opts: {
      required: true,
      type: Object
    }
  },

  created () {
    this.initGroup()
  },

  methods: {
    /** 初始规则 */
    initGroup () {
      if (!this.decisions || !this.decisions.length) {
        this.createGroup()
      }
    },

    /** 新增规则 */
    createGroup () {
      if (!this.decisions) this.decisions = []
      this.decisions.push(this._clone(decisionContent))
      this.decisions[this.decisions.length - 1].conditions.push(this._clone(conditionContent))
    },

    /** 删除规则 */
    deleteDecision (idx) {
      confirmPopover('warning', '确认删除该项吗？', () => {
        this.decisions.splice(idx, 1)
      })
    },

    /** 是否禁用「删除」按钮 */
    judgeDeleteDisable (conditions) {
      return conditions.length === 1
    },

    /** 删除规则中的条件 */
    deleteCondition (dIdx, cIdx) {
      confirmPopover('warning', '确认删除该项吗？', () => {
        this.decisions[dIdx].conditions.splice(cIdx, 1)
      })
    },

    /** 添加规则中的条件 */
    createCondition (dIdx, cIdx) {
      this.decisions[dIdx].conditions.push(this._clone(conditionContent))
    },

    /** 深度克隆 */
    _clone (obj) {
      return JSON.parse(JSON.stringify(obj))
    },

    /** 获取右等式下拉列表 */
    getRightOpts (left, opts) {
      let rightObj = opts.right.find(val => val.value === left)
      return rightObj
        ? rightObj.options
        : []
    },

    /** 保存左等式的Group */
    storageLeftGroup (condition, group = {}) {
      // if (this.opts.left) {
      //   this.opts.left.map(obj => {
      //     group[`${obj.group}`] = obj.options
      //   })
      //   // 分三部分的原 opts.left
      //   let key = Object.keys(group).find(key => group[key].find(opts => opts.value === condition.left))
      //   condition.group = key
      // }

       // Hack: 决策表分组Select 取出group
      try {
        condition.group = condition.left.split('-')[0]
      } catch (error) {
        console.log(error)
      }
    },

    /** 校验表单内容 */
    validateTable (isConditionValid = true, isDecisionValid = true) {
      this.$refs['conditionForm'].map(form => {
        return form.validate(res => {
          isConditionValid &= res
        })
      })

      this.$refs['decisionForm'].map(form => {
        return form.validate(res => {
          isDecisionValid &= res
        })
      })

      return Promise.resolve(isConditionValid && isDecisionValid)
    }
  }
}
</script>

<style lang="scss" scoped>
.decision-table {
  box-sizing: border-box;

  & > header.header > .el-button {
    font-size: 12px;
  }

  .disable {
    color: #c0c4cc !important;
    cursor: not-allowed !important;
  }

  .section {

    .decision {
      margin-bottom: 10px;
      padding: 10px;
      background-color: #FBFBFB;
      &:last-child {
        margin-bottom: 10px;
        //background-color: #F1F3F6 ;
      }
    }

    &:nth-child(1) {
      padding-top: 0 !important;
    }

    li {
      //padding-bottom: -2px; //图标height40px,比表单行高12px
      font-size: 0;
      &.condition .el-form {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .el-form {
        .el-form-item {
          margin-bottom: 0;
        }

        > .left, > .middle {
          display: inline-block;
          flex-basis: 25%;
        }

        > .right {
          flex-basis: 40%;
        }

        .condition-operator {
          flex-basis: 2.5%;

          font-size: 14px;
          display: inline-block;
          cursor: pointer;

          text-align: center;

          &.create {
            color: #3da5fe;
          }

          &.delete {
            color: #ff6464;
          }
        }
      }


      &.result {
        > .el-select {
          max-width: 120px;
        }
      }
    }
  }

  .decision-create-button {
    padding: 6px;
    display: block;
    width: 100%;
    background: #FFFFFF;
    font-size: 12px;
    color: #BDBDBD !important;
    border-style: dashed !important;
  }
  .decision-delete-button {
    margin-left: 7px;
    padding: 6px;
    font-size: 14px;
    color: #FFFFFF;
    background: #FF6464;
  }
}
</style>

<style lang="scss">
li.condition .el-form .el-form-item__error, li.result .el-form .el-form-item__error {
  position: absolute;
  top: 18%;
  left: 0;
  width: 0;

  color: transparent;

  border-right: 8px solid transparent;
  border-top: 8px solid red;
}
</style>
