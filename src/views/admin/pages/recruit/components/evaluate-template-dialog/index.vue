<template>
<!-- HACK: 为了不报removeChild错误先添加appendToBody="false" -->
  <i-dialog
    size="standard"
    :title="myTitle"
    :toolbar="toolbar"
    v-model="showMe"
    @close="handleClose"
    :appendToBody="false">
    <i-layout>
      <el-form
        ref="templateForm"
        slot="header"
        :model="templateModel"
        :rules="templateRules"
        label-width="78px"
        label-position="right"
        class="evaluate-list__el-form">
        <el-form-item
          label="模板名称"
          prop="name"
          :required="notCheckFlag">
          <el-input
            v-if="notCheckFlag"
            v-model.trim="templateModel.name">
          </el-input>

          <span v-else>
            {{ templateModel.name }}
          </span>
        </el-form-item>

        <el-form-item
          label="描述"
          prop="description">
          <el-input
            v-if="notCheckFlag"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model.trim="templateModel.description">
          </el-input>

          <span v-else>
            {{ templateModel.description }}
          </span>
        </el-form-item>
      </el-form>

      <i-table
        ref="table"
        slot="section"
        :table="table"
        @save="getCRUDData"
        @clone="getTableClone"
        destroyedWhenClose>
        <template
          slot="table"
          slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            @row-click="rowClickHandler(tableScope, $event)"
           >
            <el-table-column
              v-if="notCheckFlag"
              type="selection">
            </el-table-column>

            <el-table-column
              v-for="(col, idx) in table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label">
              <template slot-scope="scope">
                <i-table-cell
                  ref="cell"
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                  :formatter="tableScope.formatter">
                </i-table-cell>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </i-table>

      <!-- 新增评估项 -->
      <evaluate-list-template-inner
        slot="section"
        v-if="innerDialogFlag"
        :showMe.sync="innerDialogFlag"
        :hasSelectedId="hasSelectedId"
        @selection-confirm="selectionConfirm">
      </evaluate-list-template-inner>

    </i-layout>
  </i-dialog>
</template>

<script>
import req from 'api/recruit'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import ILayout from 'components/common/i-layout'
import EvaluateListTemplateInner from './inner.vue'

export default {
  name: 'EvaluateListTemplateDialog',
  components: {
    IDialog,
    ILayout,
    EvaluateListTemplateInner
  },

  props: {
    showMe: {
      type: Boolean,
      default: false,
      required: true
    },
    templateItem: {
      type: Object,
      default: {}
    },
    myType: {
      type: String,
      default: 'add',
      required: true
    }
  },

  data () {
    // 评估分值校验
    // const scoreValidator = (rule, val, cb) => {
    //   !val
    //     ? cb(new Error('评估分值不能为空'))
    //     : !Number.isInteger(val)
    //       ? cb(new Error('请输入整数'))
    //       : val <= 0
    //         ? cb(new Error('评估分值需大于0'))
    //         : cb()
    // }

    // 模板名称校验
    const nameValidator = (rule, val, cb) => {
      !this.notCheckFlag
        ? cb()
        : !val
          ? cb(new Error('请填写模板名称'))
        : val.length > 128
          ? cb(new Error('长度最大为128个字符'))
          : cb()
    }

    // 描述校验
    const descriptionValidator = (rule, val, cb) => {
      !this.notCheckFlag
        ? cb()
        : val.length > 255
          ? cb(new Error('长度最大为255个字符'))
          : cb()
    }

    return {
      // el-form
      templateModel: {
        name: '',
        description: ''
      },
      templateRules: {
        name: [{
          validator: nameValidator, trigger: 'blur, change'
        }],
        description: [
          {validator: descriptionValidator, trigger: 'change'}
        ]
      },
      // i-dialog
      toolbar: [{
        text: '取消',
        type: 'default',
        func: (done) => {
          done()
        }
      }, {
        text: '保存',
        loading: false,
        type: 'primary',
        func: (done) => {
          if (this.notCheckFlag) {
            this.$refs.templateForm.validate(res => {
              if (res) {
                this.handleConfirm(done)
              }
            })
          } else {
            done()
          }
        }
      }],
      // i-table
      table: {
        data: [],
        columns: [
          {
            prop: 'optionType',
            label: '评估类型',
            display: { dict: 'EVALUATION_OPTION_TYPE' }
          },
          { prop: 'description', label: '评估项' }
          // { prop: 'score', label: '评估分值' }
        ],
        setting: {
          toolbar: [],
          editor: {
            optionType: {
              type: 'string',
              disable: true
            },
            description: {
              type: 'string',
              disable: true
            }
            // score: {
            //   type: 'number',
            //   rules: [{
            //     validator: scoreValidator
            //   }]
            // }
          }
        },
        editable: true
      },
      // this
      innerDialogFlag: false,
      crudTableData: [],
      tableCloneData: [],

      // 因为i-table组件的idx有bug，所以自己接管数据处理
      totalList: [],  // 从后端返回来的数据

      // 新增时获取不到table数据,自行接管判断
      newTableList: [],
      // 已选evluateId
      hasSelectedId: []
    }
  },

  computed: {
    myTitle () {
      return (this.myType === 'add'
        ? '新建'
        : this.myType === 'modify'
          ? '修改'
          : '查看') + '评估表模板'
    },
    notCheckFlag () {
      return this.myType === 'add' || this.myType === 'modify'
    }
  },

  created () {
    if (this.notCheckFlag) {
      this.table.setting.toolbar = [{
        text: '增加',
        func: () => {
          this.innerDialogFlag = true
        }
      }, {
        text: '删除',
        type: 'default',
        func: vm => this.deleteData(vm)
      }]
    } else {
      this.table.editable = false
    }
    if (!this.notCheckFlag || this.myType === 'modify') {
      req('getEvaluationTemplates', {
        evaluationTemplateId: this.templateItem.evaluationTemplateId
      }).then(res => {
        this.templateModel.name = res.name
        this.templateModel.description = res.description
        this.table.data = res.evaluationOptions
        this.hasSelectedId = res.evaluationOptions.map((val) => {
          return val.evaluationOptionId
        })
        this.totalList = res.evaluationOptions
      })
    }
    if (this.myType === '') {
      this.toolbar = [{
        text: '返回',
        func: (done) => {
          done()
        }
      }]
    }
  },

  methods: {
    getCRUDData (data) {
      this.crudTableData = data
    },

    getTableClone (data) {
      this.$emit('getMyData', data)
      this.tableCloneData = data
    },

    deleteData (vm) {
      vm.deleteData()
      this.newTableList = JSON.parse(JSON.stringify(this.$refs.table.clone))
      let len = this.hasSelectedId.length
      let newIds = []
      this.newTableList.map((val) => {
        newIds.push(val.evaluationOptionId)
      })
      this.hasSelectedId.splice(0, len, ...newIds)
    },

    rowClickHandler ({ rowClickHandler }, row) {
      rowClickHandler(row)
    },

    selectionConfirm (selected) {
      // console.log(selected)
      let list
      let len
      let tableItem
      let flag = false
      // if (this.myType === 'add') {
      //   list = this.newTableList
      // } else if (this.myType === 'modify') {
      //   list = this.table.data
      // }
      list = this.newTableList.concat(this.$refs.table.clone)
      for (let i of selected) {
        len = list.length
        if (len > 0) {
          flag = false
          while (len--) {
            tableItem = list[len]
            if (tableItem.evaluationOptionId === i.evaluationOptionId) {
              // this.$message.warning('表格内已存在选择条目')
              flag = true
            }
          }
        }
        if (!flag) {
          this.$refs.table.createData(i)
          // if (this.myType === 'add') {
          this.newTableList.push(i)
          // }
          // 将新增的项目加入到 已选项目id 数组中
          this.hasSelectedId.splice(0, 0, i.evaluationOptionId)
        }
        // if (this.tableCloneData.includes(i)) {
        //   this.$message.warning('表格内已存在选择条目')
        //   return
        // }
      }
    },

    // 确定
    handleConfirm (done) {
      let flag = this.$refs.table.saveData()
      if (this.tableCloneData.length) {
        this.$refs.cell.map(el => el.validate())
        if (!flag) {
          return
        }
        console.log(this.$refs.table.clone, this.crudTableData)
        if (this.myType === 'add') {
          this.toolbar[1].loading = true
          this.addConfirm(done)
        } else if (this.myType === 'modify') {
          this.modifyConfirm(done)
        } else {
          return
        }
      } else {
        this.$message.warning('至少需要有一个评估项')
        return
      }
    },

    // 新建
    addConfirm (done) {
      req('postCreatedEvaluationTemplate', {
        ...this.templateModel,
        evaluationOptions: this.tableCloneData.map((val, idx, arr) => {
          if (arr.length && val) {
            return {
              evaluationOptionId: val.evaluationOptionId
                // score: val.score
            }
          }
        })
      }).then(res => {
        this.$message.success('新增成功')
        this.toolbar[1].loading = false
        this.$emit('getMyData')
        done()
      })
    },

    // 修改
    modifyConfirm (done) {
      req('putModifiedEvaluationTemplate', {
        ...this.templateModel,
        evaluationTemplateId: this.templateItem.evaluationTemplateId,
        evaluationOptions: this.crudTableData.create.map(item => {
          return {
            evaluationOptionId: item.evaluationOptionId,
            updateType: '1'
          }
        })
          .concat(this.crudTableData.update.map(item => {
            return {
              evaluationOptionId: item.evaluationOptionId,
              updateType: '2'
            }
          })).concat(this.crudTableData.delete.map(item => {
            return {
              evaluationOptionId: item.evaluationOptionId,
              updateType: '3'
            }
          }))
      }).then(res => {
        this.$message.success('修改成功')
        this.$emit('getMyData')
        done()
      })
    },
    // 控制弹框标识
    handleClose () {
      this.showMe = false
      this.$emit('update:showMe', false)
    }
  }
}
</script>

<<style lang="scss" scoped>
.evaluate-list__el-form {
  margin-right: 10px;

  .el-form-item {
    margin-bottom: 20px;

    &:nth-child(1) {
      margin-top: 10px;
    }

    &:last-child {
      margin-bottom: 10px;
    }
  }
}
</style>
