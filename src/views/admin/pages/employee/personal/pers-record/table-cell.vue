<template>
  <span class="i-table-cell" :class="{ error: isError }">
    <!-- !editingList[row._id] ||  -->
    <span v-show="!table.editable || table.disable || editorDisable || editorType === 'button'">
      <el-button
        v-if="editorType === 'button'"
        @click="editorFunc(row, col)"
        type="text">
        {{ formatter(row[col]) }}
      </el-button>

      <p v-else>{{ formatter(row[col]) }}</p>
    </span>

    <!-- editingList[row._id] && -->
    <span v-show="table.editable && !table.disable && !editorDisable && editorType !== 'button'">
      <el-form
        :model="row"
        :rules="editorRules"
        ref="form"
        @submit.native.prevent>
        <el-form-item :prop="col">
          <slot>
            <el-select
              v-if="editorType === 'select'"
              v-model="row[col]"
              :disabled="editorDisable"
              @change="change"
              @blur="blur"
              filterable
              clearable>
              <el-option
                v-for="(opt, idx) of initSelectOptionsFromDict() || selectOptions"
                :key="idx"
                :label="opt.label"
                :value="opt.value">
              </el-option>
            </el-select>

            <el-date-picker
              v-else-if="editorType === 'date'"
              v-model="row[col]"
              align="right"
              :type="editorOptions.type || 'date'"
              placeholder="选择日期"
              @change="dateHandler(row, col, $event, change)"
              @blur="dateHandler(row, col, $event, blur)"
              :picker-options="editorOptions"
              :disabled="editorDisable">
            </el-date-picker>

            <el-input
              v-else-if="editorType === 'number'"
              v-model.number="row[col]"
              type="number"
              :disabled="editorDisable"
              @change="change"
              @blur="blur">
            </el-input>


            <i-select-area
              v-else-if="editorType === 'area'"
              search
              v-model="row[col]"
               type="yonghui"
              :disabled="editorDisable"
              ></i-select-area>

            <el-input
              v-else
              :type="editorType === 'textarea' ? 'textarea' : ''"
              v-model="row[col]"
              :disabled="editorDisable"
              @change="change"
              @blur="blur">
            </el-input>
          </slot>
        </el-form-item>
      </el-form>
    </span>
  </span>
</template>

<script>
import access from 'mixins/access'
export default {
  name: 'ITableCell',
  mixins: [access],
  props: {
    row: {
      type: Object,
      required: true
    },
    col: {
      type: String,
      required: true
    },
    table: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      editingList: this.table.editingList,
      heartbeat: this.table.heartbeat,
      isEditing: false,
      isError: false,
      leafProp: this.table.leafMap(this.col),
      editor: {},
      editorType: '',
      editorFunc: null,
      editorRules: null,
      editorOptions: {},
      editorDisable: false,
      selectOptions: null
    }
  },

  watch: {
    editingList (list) {
      this.isEditing = list[this.row._id]
    },

    'table.error': {
      handler (val) {
        const error = val[this.row._id]

        this.isError = error ? !!error[this.col] : false
      },
      immediate: true
    },

    isEditing (val, old) {
      old === true && setTimeout(() => this.validate(), 0)
    }
  },

  created () {
    this.editor = this.table.editor && (
      this.table.editor[this.col] ||
      this.table.editor[this.leafProp] ||
      {}
    )

    this.initEditorRules()
    this.initEditorAttribute()
    this.initSelectOptions()

    this.accessEditor()
  },

  methods: {
    editorMap (editor, prop) {
      return editor ? editor[prop] : null
    },

    change (e) {
      this._handle('change')
    },

    blur (e) {
      this._handle('blur')
    },

    _handle (eventType) {
      if (this.editorOptions[eventType]) {
        this.editorOptions[eventType](this.row, this.col)
      }

      this.$emit(eventType, {
        row: this.row,
        col: this.col,
        val: this.row[this.col],
        // 抛出可更新rules的方法
        updateRules: this.initEditorRules.bind(this),
        // 抛出可更新disabled的方法
        updateDisabled: this.updateDisabled.bind(this)
      })
    },

    validate () {
      if (!this.editorRules[this.col]) {
        return true
      }

      this.$refs.form && this.$refs.form.validate(success => {
        this.table.toggleError(this.row, this.col, !success)
        this.isError = !success

        return success
      })

      return !this.isError
    },

    formatter (val) {
      const { dictList = {}, dateList = {}, mixinList = {} } = this.table

      if (dictList[this.leafProp]) {
        return dictList[this.leafProp][val] || val
      }

      if (dateList[this.leafProp] !== undefined) {
        return this.table.getDate({
          format: dateList[this.leafProp],
          val
        })
      }

      if (mixinList[this.leafProp]) {
        return typeof mixinList[this.leafProp] === 'function'
          ? mixinList[this.leafProp](this.row, this.col)
          : val
      }

      if (this.selectOptions) {
        return this.editorOptions.option[val] || val
      }

      return val
    },

    dateHandler (row, col, val, cb) {
      if (val) {
        row[col] = row[col]
          ? new Date(row[col]).getTime()
          : ''
      }

      cb()
    },

    initEditorAttribute () {
      this.editorType = this.editorMap(this.editor, 'type') || ''
      this.editorFunc = this.editorMap(this.editor, 'func') || (() => {})
      this.editorDisable = this.editorMap(this.editor, 'disable') || false
      this.editorOptions = this.editorMap(this.editor, 'options') || {}
      this.editorOptions = {
        ...this.editorOptions,
        ...this.bindOptions()
      }
    },

    accessEditor () {
      if (this.disableMap && this.col.hasOwnProperty('key')) {
        this.editorDisable = !this.disableMap[this.col.key]
      }
    },

    bindOptions () {
      const bindOpts = {}

      Object.entries(this.editorOptions).map(
        ([key, val]) => typeof val === 'function' && (bindOpts[key] = val.bind(this))
      )
      return bindOpts
    },

    /**
     * 触发改变rules的函数
     * @param {Array} rules 需要更改的rules的数组，如果不传，则默认从table的配置中重新获取
     * @param {Array} elList i-table-cell实例数组
     * @param {String} property 需要改变的column的property,不传的话，默认修改本身
     * @param {String} type type可取row、column字符串,默认row为本行数据的rules，否则则为整个column的rules
     */
    initEditorRules (rules, elList, property, type = 'row') {
      if (rules && rules instanceof Array && elList && elList instanceof Array && property) {
        if (type === 'row') {
          elList.map(ele => {
            if (ele.row === this.row && ele.col === property) {
              ele.initEditorRules(rules)
            }
          })
        } else {
          // 这里默认不是row就是column
          elList.map(ele => {
            if (ele.col === property) {
              ele.initEditorRules(rules)
            }
          })
        }
      } else {
        if (rules && rules instanceof Array) {
          this.editorRules = {
            [this.col]: rules
          }
          return
        }
        this.editorRules = {
          [this.col]: this.editorMap(this.editor, 'rules') ||
          // this.rules[this.col] ||
          null
        }
      }
    },

    /**
     * 触发改变disabled的函数
     * @param {Boolean} ifDisabled 需要更改的disabled的bool值
     * @param {Array} elList i-table-cell实例数组
     * @param {String/Array} property 需要改变的column的property
     * @param {String} type type可取row、column字符串,默认row为本行数据的disabled，否则则为整个column的disabled
     */
    updateDisabled (ifDisabled, elList, property, type = 'row') {
      if (!elList || !(elList instanceof Array)) return
      if (type === 'row') {
        elList.map(ele => {
          if (ele.row === this.row) {
            if (typeof property === 'string' && ele.col === property) { ele.editorDisable = ifDisabled }
            if (Array.isArray(property) && property.includes(ele.col)) { ele.editorDisable = ifDisabled }
          }
        })
      } else {
          // 这里默认不是row就是column
        elList.map(ele => {
          if (ele.col === property) {
            if (typeof property === 'string' && ele.col === property) { ele.editorDisable = ifDisabled }
            if (Array.isArray(property) && property.includes(ele.col)) { ele.editorDisable = ifDisabled }
          }
        })
      }
    },

    initSelectOptions () {
      const { option } = this.editorOptions

      this.selectOptions = option
        ? Object.keys(option).map(key => ({
          value: key,
          label: option[key]
        }))
        : null
    },

    initSelectOptionsFromDict () {
      const { dictList = {} } = this.table
      const options = dictList[this.leafProp] || null

      return options && Object.entries(options).map(
        ([k, v]) => ({ label: v, value: k })
      )
    }
  }
}
</script>

<style lang="scss">
.i-table-cell {
  $error: #ff4949;
  $size: 6px;
  &.error {
    p {
      color: $error;
      &::after {
        display: block;
        position: absolute;
        top: -$size;
        right: -$size;
        width: 0;
        height: 0;
        border: $size solid transparent;
        border-bottom-color: $error;
        transform: rotate(45deg);
        content: '';
      }
    }
  }
}
</style>
