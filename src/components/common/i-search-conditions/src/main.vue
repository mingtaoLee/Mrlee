<template>
  <div class="i-search-main">
    <div class="title">
      <h3>条件查询</h3>
      <el-button type="text" @click="createGroup" :disabled="disabled">
        <i class="el-icon-plus"></i>
        新增一组
      </el-button>
    </div>

    <div class="groups section-body">
      <div
        class="group"
        v-for="(group, gIdx) of groups"
        :key="group">
        <div class="group-logic" v-if="gIdx">
          <i-select
            v-model="group.groupAndOr"
            placeholder="逻辑符"
            parameter="MSG_LOGIC"
            :clearable="false"
            :disabled="disabled"
          />
        </div>

        <ul class="conditions">
          <el-button
            v-if="gIdx"
            class="group-delete"
            size="mini"
            :disabled="disabled"
            @click="deleteGroup(gIdx)">删除
          </el-button>
          <li
            v-for="(condition, cIdx) of group.conditions"
            :key="condition">
            <i-select
              v-model="condition.conditionLogic"
              placeholder="逻辑符"
              parameter="MSG_LOGIC"
              :clearable="false"
              :disabled="!cIdx || disabled">
            </i-select>

            <el-form :model="condition" :rules="rules">
              <el-form-item prop="infColumnId">
                <i-select
                  v-model="condition.infColumnId"
                  placeholder="已选字段"
                  @change="handleChange('infColumnId', condition)"
                  :async="false"
                  :options="columnIdOptions"
                  :disabled="disabled">
                </i-select>
              </el-form-item>
            </el-form>

            <i-select
              v-model="condition.operator"
              placeholder="关系符"
              parameter="MSG_OPERATE"
              :clearable="false"
              :disabled="disabled">
            </i-select>
            <i-search-editor
              v-model="condition.columnValue"
              placeholder="查询值"
              :display="_columnMap(condition, 'display') || {}"
              :editor="_editorMap(condition) || {}"
              :disabled="disabled">
            </i-search-editor>
            <!-- :multiple="checkMultiple(condition)" -->

            <i
              :class="[
                'condition-operator', 'create', 'el-icon-circle-plus-outline',
                { disable: disabled }
              ]"
              @click="disabled || createCondition(gIdx, cIdx)"></i>
            <i
              :class="[
                'condition-operator', 'delete', 'el-icon-remove-outline',
                { disable: disabled || judgeDeleteDisable(group.conditions) }
              ]"
              @click="disabled || judgeDeleteDisable(group.conditions) || deleteCondition(gIdx, cIdx)">
            </i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ISearchEditor from './editor'

const groupContent = {
  msgGroupId: '',
  groupAndOr: 'AND',
  conditions: []
}
const conditionContent = {
  msgConditionId: null,
  conditionLogic: 'AND',
  infColumnId: null,
  operator: '=',
  componentType: null,
  urlAddress: null,
  dictCode: null,
  columnValue: ''
}

export default {
  props: {
    columns: {
      type: Array,
      default: []
    },
    editor: {
      type: Object,
      default: {}
    },
    groups: {
      type: Array,
      default: [],
      required: true
    },
    async: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      columnIdOptions: this._initColumns(this.columns),
      rules: {
        infColumnId: [
          { required: true, message: '不得为空', trigger: 'blur' },
          { required: true, message: '不得为空', trigger: 'change' }
        ]
      }
    }
  },

  created () {
    this._initGroups()
  },

  watch: {
    columns (list) {
      this.columnIdOptions = this._initColumns(list)
    }
  },

  methods: {
    _initGroups () {
      this.groups.length || this.createGroup({ groupAndOr: null })
    },

    handleChange (type, condition, data) {
      if (type === 'infColumnId') {
        condition.columnValue = ''
      }
    },

    // BUG: 多选 > 单选样式不变
    // 判断关系符是否为“包含”/“不包含”，以此决定该选项是否多选
    checkMultiple (condition) {
      const isM = ['not like', 'like'].includes(condition.operator)
      const isA = Array.isArray(condition.columnValue)

      if (isM && !isA) {
        condition.columnValue =
          typeof condition.columnValue === 'string'
            ? condition.columnValue.split(',')
            : []
      } else if (!isM && isA) {
        condition.columnValue = condition.columnValue.length
          ? condition.columnValue[0]
          : ''
      }
      return isM
    },

    // 判断是否需要屏蔽“删除”按钮
    judgeDeleteDisable (conditions) {
      return conditions.length === 1
    },

    // 初始化 columns 配置
    _initColumns (list) {
      return list.map(col => ({
        label: col.label,
        value: this.async ? col.id : col.prop
      }))
    },

    // 默认使用 id 判断
    _editorMap (condition) {
      const column = this._columnMap(condition)

      return column ? this.editor[column.prop] : {}
    },

    // 根据 infColumnId 索引 column
    _columnMap (condition, property) {
      const target = condition.infColumnId
      const _ = this.async ? 'id' : 'prop'

      const column = this.columns.find(col => col[_] === target)

      return column && property ? column[property] : column
    },

    // 创建条件
    createCondition (gIdx, cIdx) {
      this.groups[gIdx].conditions.splice(
        cIdx + 1,
        0,
        this._clone(conditionContent)
      )
    },

    // 删除条件
    deleteCondition (gIdx, cIdx) {
      this.groups[gIdx].conditions.splice(cIdx, 1)
    },

    // 创建分组
    createGroup (opts = {}) {
      this.groups.push(this._clone({ ...groupContent, ...opts }))
      const { conditions = [] } = this.groups[this.groups.length - 1]

      conditions.push(
        this._clone(
          conditions.length
            ? conditionContent
            : {
              ...conditionContent,
              conditionLogic: null
            }
        )
      )
    },

    // 删除分组
    deleteGroup (idx) {
      this.groups.splice(idx, 1)
    },

    // 克隆数据
    _clone (obj) {
      return JSON.parse(JSON.stringify(obj))
    }
  },

  components: {
    ISearchEditor
  }
}
</script>

<style lang="scss" scoped>
.i-search-main {
  box-sizing: border-box;
  .title {
    .el-button {
      font-size: 12px;
      position: absolute;
      right: 10px;
      top: 25px;
      transform: translateY(-50%);
    }
  }

  .group-logic {
    padding: 10px;
    border-bottom: 1px solid #f2f2f2;
    background: #ffffff;
    > .el-select {
      width: 100px;
    }
  }

  .conditions {
    padding: 10px;
    &:nth-child(1) {
      padding-top: 0 !important;
    }
    border-bottom: 1px solid #f2f2f2;
    background: #fafafa;
    li {
      padding-top: 10px;
      font-size: 0;
      vertical-align: middle;
      > .el-select, > .el-form {
        display: inline-block;
        width: 100px;
        margin-right: 10px;
      }
    }
    .condition-operator {
      font-size: 14px;
      display: inline-block;
      // line-height: 28px;
      cursor: pointer;
      &.create {
        color: #3da5fe;
        margin-right: 8px;
      }
      &.delete {
        color: #ff6464;
      }
    }
  }
  .disable {
    color: #c0c4cc !important;
    cursor: not-allowed !important;
  }
}
</style>
