<template>
  <div class="search">
    <aside>
      <h3 class="title">已有查询条件</h3>
    </aside>

    <section>
      <h3 class="title">条件查询</h3>

      <el-form
        :model="config"
        class="search-pane"
        @submit.native.prevent>
        <ul class="form">
          <li
            v-for="(paramTeam, idx) of params"
            :key="idx"
            class="param-team">
            <header v-if="idx !== 0">
              <i-select
                v-model="paramTeam.groupAndOr"
                :parameter="config.logicSymbol.dict"
                placeholder="逻辑符"
                :clearable="false"
                class="select"
              />

              <i class="delete el-icon-close" @click="deleteTeam(idx)"></i>
            </header>
            <!-- <el-form-item>
              <el-checkbox v-model="paramItem.checked"/>
            </el-form-item> -->

            <main class="param-item-list">
              <div
                v-for="(paramItem, jdx) of paramTeam.empRosterConditionDtoList"
                :key="jdx"
                class="param-item">
                <el-form-item>
                  <i-select
                    v-model="paramItem.logicSymbol"
                    :parameter="config.logicSymbol.dict"
                    :disabled="jdx === 0"
                    placeholder="逻辑符"
                  />
                </el-form-item>

                <el-form-item>
                  <el-select
                    v-model="paramItem.property"
                    @change="propertyChange(idx, jdx, $event)"
                    placeholder="查询字段"
                    size="mini"
                    clearable>
                    <el-option
                      v-for="(col, tdx) of columns"
                      :key="tdx"
                      :label="col.label"
                      :value="col.prop"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-select
                    v-model="paramItem.operateSymbol"
                    placeholder="关系符"
                    :disabled="!paramItem.property"
                    size="mini"
                    clearable>
                    <el-option
                      v-for="opt of getOperateSymbol(paramItem.property)"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <i-select
                    v-if="getConfig(paramItem.property).type === 'select' || getConfig(paramItem.property).dict"
                    v-model="paramItem.value"
                    :parameter="getConfig(paramItem.property).dict"
                    :disabled="!paramItem.property"
                    placeholder="查询值"
                    size="mini"/>

                  <el-date-picker
                    v-else-if="getConfig(paramItem.property).type === 'date'"
                    v-model="paramItem.value"
                    align="right"
                    type="date"
                    @change="dateChange(par, $event)"
                    :picker-options="editorOptions"
                    :format="$$.format.date.default"
                    :disabled="!paramItem.property"
                    placeholder="选择日期"
                    size="mini"
                  />

                  <el-input
                    v-else-if="getConfig(paramItem.property).type === 'number'"
                    v-model.number="paramItem.value"
                    type="number"
                    :disabled="!paramItem.property"
                    placeholder="查询值"
                    size="mini"
                  />

                  <el-input
                    v-else
                    v-model.trim="paramItem.value"
                    :disabled="!paramItem.property"
                    placeholder="查询值"
                    size="mini"
                  />
                </el-form-item>

                <div class="tool">
                  <el-button @click="deleteData(idx, jdx)" :disabled="params[idx].empRosterConditionDtoList.length === 1" icon="el-icon-delete" style="padding: 7px 9px " type="danger" size="mini"/>
                </div>
              </div>

              <!--  icon="plus" -->
              <el-button @click="createData(idx)" type="success" size="mini" class="create">新增条件</el-button>
            </main>
          </li>

          <li class="add-team" @click="createTeam">
            <i class="el-icon-plus"></i> 新增一组
          </li>
        </ul>
      </el-form>
    </section>

  </div>
</template>

<script>
import ISelect from 'components/common/i-select/i-select'

export default {
  props: {
    columns: {
      type: Array,
      default: []
    },
    editor: {
      type: Object,
      default: {}
    }
  },

  data () {
    return {
      changing: false,
      params: [],

      config: {
        logicSymbol: {
          dict: 'SYS_LOGIC_SYMBOL'
        },
        operateSymbol: {
          list: {
            '=': '=',
            '!=': '!=',
            '>': '>',
            '>=': '>=',
            '<': '<',
            '<=': '<=',
            'in': '包含',
            'not in': '不包含'
            // 'between': '介于'
          },

          rules: {
            date: ['=', '!=', '>', '>=', '<', '<='],
            number: ['=', '!=', '>', '>=', '<', '<='],
            select: ['=', '!='],
            input: ['=', '!=', '>', '>=', '<', '<=', 'in', 'not in']
          }
        },
        property: {
          // col: {
          //   dict: '',
          //   type: ''
          // }
        }
      }
    }
  },

  created () {
    this.initConfig()
    // this.createTeam()
  },

  methods: {
    initConfig () {
      console.log(this.config)
      const { property, operateSymbol } = this.config

      this.columns.map(col => {
        property[col.prop] || (property[col.prop] = {})

        property[col.prop].type = this.editorMap(col.prop, 'type')
        property[col.prop].dict = col.display
          ? col.display.dict
          : undefined
      })
      console.log(operateSymbol.rules)
      console.log(Object.entries(operateSymbol.rules))
      Object.entries(operateSymbol.rules).map(([type, rule]) => {
        operateSymbol.rules[type] = rule.map(o => ({
          value: o,
          label: operateSymbol.list[o]
        }))
      })
    },

    getConfig (prop) {
      return this.config.property[prop] || {}
    },

    createTeam () {
      this.createData(this.params.length)
    },

    deleteTeam (idx) {
      this.deleteData(idx)
    },

    createData (idx) {
      const ret = {
        logicSymbol: '',
        property: '',
        operateSymbol: '',
        value: ''
      }

      this.changing = true
      if (idx === this.params.length) {
        this.params.push({
          groupAndOr: 'and',
          empRosterConditionDtoList: [ret]
        })
      } else {
        ret.logicSymbol = 'and'
        this.params[idx].empRosterConditionDtoList.push(ret)
      }
    },

    deleteData (idx, jdx) {
      this.changing = true
      if (jdx === undefined) {
        // this.deleteTeamLogic(idx)
        this.params.splice(idx, 1)
      } else {
        this.params[idx].empRosterConditionDtoList.splice(jdx, 1)
      }
    },
    // 保存功能
    saveData () {
      console.log('点击了保存功能')
    },
    // 查询功能
    doSearch (data) {
      console.log(this.params)
    },
    propertyChange (idx, jdx, val) {
      const param = this.params[idx].empRosterConditionDtoList[jdx]

      if (!this.changing) {
        param.operateSymbol = ''
        param.value = ''
      } else {
        this.$nextTick(() => (this.changing = false))
      }
    },

    dateChange (paramsItem, val) {
      val && (
        paramsItem.value = paramsItem.value
          ? new Date(paramsItem.value).getTime()
          : ''
      )
    },

    editorMap (prop, attr) {
      const editor = this.editor[prop] || {}

      return editor[attr]
    },

    getOperateSymbol (prop) {
      const attr = this.getConfig(prop)
      const type = attr.type || (attr.dict ? 'select' : 'input')

      return this.config.operateSymbol.rules[type]
    },

    // 清空查询条件
    clearParams () {
      this.params = []
    }
  },

  components: {
    ISelect
  }
}
</script>


<style lang="scss" scoped>
$border-color: #dadbdc;
$logic-width: 90px;
$margin: 3px;
// $height: 450px;

.search {
  display: flex;
  justify-content: space-between;
  height: 450px;
  overflow: hidden;
  section {
    flex: 1;
    box-sizing: border-box;
    height: calc(100% - 40px);
    .el-form {
      height: 100%;
    }
    ul.form {
      height: 100%;
      overflow-y: auto;
      // border: $border-color 1px solid;
      li.param-team {
        box-sizing: border-box;
        background: #f9fafb;
        header {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          // font-size: 15px;
          color: #b7bbbe;
          // background: #ecedee;
          background: #fff;
          .select {
            width: $logic-width;
          }
          .delete {
            cursor: pointer;
          }
        }
        .param-item-list {
          padding: 10px;
        }
        .param-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: $margin;
          // & + & {
          //   margin-top: 10px;
          // }
          .el-form-item {
            display: inline-block;
            margin: 0;
            &:nth-child(1) {
              width: $logic-width;
            }
            &:nth-child(2) {
              width: 150px;
            }
            &:nth-child(3) {
              width: 110px;
            }
            &:nth-child(4) {
              width: 180px;
            }
          }
          .tool {
            font-size: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            // width: 42px;
            > * {
              margin: 0;
              // font-size: 8px;
            }
          }
        }
        .create {
          width: $logic-width;
          margin-top: $margin;
          font: {
            weight: 400;
            size: 14px;
          }
        }
      }

      li.add-team {
        text-align: center;
        padding: 10px 0;
        margin-top: 10px;
        border: $border-color 1px dashed;
        color: #b2b3b4;
        cursor: pointer;
      }
    }
    // footer {
    //   display: flex;
    //   justify-content: flex-end;
    // }
  }
  aside {
    width: 220px;
    margin-right: 20px;
  }
  .title {
    background: #f2f2f2;
    padding: 0 20px;
    line-height: 40px;
    height: 40px;
    // font-size: 14px;
  }
}
</style>
