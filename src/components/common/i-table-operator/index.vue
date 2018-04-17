<template>
  <el-table-column
    v-if="controlButton.length"
    :fixed="fixed"
    :label="label"
    :align="align"
    :width="width"
    :min-width="minWidth || 100">
    <template slot-scope="scope">
      <aside class="i-table-operator">
        <el-tooltip
          v-for="(btn, idx) of controlButton"
          :key="idx"
          effect="dark"
          placement="top"
          :content="messageMap(btn, scope.row)"
          :disabled="!messageMap(btn, scope.row)">
          <el-button
            type="text"
            size="small"
            @click.stop.native="operatorClickHandler(btn, scope)"
            :class="typeMap(btn)"
            v-state="{ btn, row: scope.row }">
            <i :class="btn.icon"/>
            {{ btn.text }}
          </el-button>
        </el-tooltip>

        <slot name="operator"/>
      </aside>
    </template>
  </el-table-column>
</template>

<script>
const method = {}

import access from 'mixins/access'
export default {
  mixins: [access],
  props: {
    table: {
      type: Object,
      default: {},
      require: true
    },
    width: {
      default: 'auto'
    },
    minWidth: {
      default: 100
    },
    label: {
      default: '操作',
      type: String
    },
    fixed: {
      default: 'right',
      type: String
    },
    align: {
      default: 'center',
      type: String
    },
    scope: {
      type: Boolean
    }
  },

  data () {
    return {
      popover1: 'popover1',
      states: ['disable', 'hidden', 'empty'],
      prefix: 'i-table--'
    }
  },

  created () {
    method.updateClassName = this.updateClassName
  },

  directives: {
    state: {
      inserted (el, binding) {
        method.updateClassName(el, binding)
      },

      update (el, binding) {
        method.updateClassName(el, binding)
      }
    }
  },

  computed: {
    controlButton () {
      let buttons = this.table.operator.filter(ele => {
        if (ele.hasOwnProperty('key')) {
          return this.accessMap[ele.key]
        }
        return true
      })

      return buttons
    }
  },

  methods: {
    /** ---------------- Map ---------------- */

    stateMap ({ show }, row) {
      return show && show(row)
    },

    disableMap ({ show }, row) {
      const state = this.stateMap({ show }, row)

      // return state && this.states.find(s => state.display === s)
      return state && this.states.find(s => state[s])
    },

    messageMap ({ show }, row) {
      const state = this.stateMap({ show }, row)

      return state && state.message
    },

    typeMap ({ type = '' }) {
      return ['primary', 'danger', 'success'].includes(type) ? type : ''
    },

    /** ---------------- ClassName ---------------- */

    findClassName (className) {
      return this.states.find(s => className.indexOf(this.prefix + s) > -1)
    },

    updateClassName (el, binding) {
      const { btn, row } = binding.value

      const state = this.disableMap(btn, row)
      const oldState = this.findClassName(el.className)

      if (state) {
        el.className = oldState
          ? el.className.replace(this.prefix + oldState, this.prefix + state)
          : el.className + ' ' + this.prefix + state
      } else {
        oldState && (el.className = el.className.replace(this.prefix + oldState, ''))
      }
    },

    /** ---------------- Handler ---------------- */

    operatorClickHandler (btn, scope) {
      if (btn.func && !this.disableMap(btn, scope.row)) {
        btn.func(this.scope ? scope : scope.row)
      }
    }
  }
}
</script>

<style lang="scss">
.i-table-operator {
  margin: 0 -5px;
  padding: 0;
  .el-button--text {
    padding: 0;
    margin: 0 5px;
    &.primary {
      color: #409eff;
    }
    &.success {
      color: #67c23a;
    }
    &.danger {
      color: #f56c6c;
    }

    &.i-table--disable {
      color: #c0c4cc !important;
      cursor: not-allowed;
    }
    &.i-table--hidden {
      visibility: hidden;
      cursor: auto;
    }
    &.i-table--empty {
      display: none;
    }
  }
}
</style>
