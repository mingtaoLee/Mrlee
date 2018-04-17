<template>
  <el-dialog :title="`${title}评分标准
`" :visible.sync="visible" @close="closeDialog('formData')">
    <el-form>
      <el-form :model="formData" :rules="rules" ref="formData">
        <el-form-item label="名称" :label-width="'100px'" prop="name">
          <el-input v-model="formData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="'100px'" prop="description">
          <el-input type="textarea" v-model="formData.description" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="评估分" :label-width="'110px'" prop="detail" :rules="detailRule">

          <i-table :table="table">
            <template slot="table" slot-scope="tableScope">

              <el-table :data="table.data" style="width: 100%"
                        ref="multipleTable" @row-click="rowClickHandler(tableScope, $event)">
                <el-table-column property="name" label="名称" width="140">
                  <template slot-scope="scope">
                    <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].detailName`" :rules="detailNameRule">
                      <i-table-cell
                      :row="scope.row"
                      col="detailName"
                      :table="tableScope"
                      />
                      <!--<el-input placeholder="名称" v-model="scope.row.detailName" @change="modifier(scope)"></el-input>-->

                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column property="name" label="分值" width="120" :render-header="renderexclamation">
                  <template slot-scope="scope">
                    <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].score`" :rules="scoreRule">
                      <i-table-cell
                      :row="scope.row"
                      col="score"
                      :table="tableScope"
                      />
                      <!--<el-input placeholder="分值" v-model="scope.row.score" @change="modifier(scope)"></el-input>-->
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column property="name" label="描述" width='160'>
                  <template slot-scope="scope">
                    <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].detailDescription`"
                                  :rules="descriptionRule">
                      <i-table-cell
                      :row="scope.row"
                      col="detailDescription"
                      :table="tableScope"
                      @change="modifier(scope)"
                      />
                      <!--<el-input-->
                        <!--type="textarea"-->
                        <!--:autosize="{ minRows: 1, maxRows: 1}" v-model="scope.row.detailDescription"-->
                        <!--@change="modifier(scope)">-->
                      <!--</el-input>-->
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column property="name" :render-header="renderHeader" width="100">
                  <template slot-scope="scope">
                    <i class="icon iconfont icon-delete" @click="removeRow(scope.$index)"></i>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </i-table>

        </el-form-item>
      </el-form>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('formData')">取 消</el-button>
      <el-button type="primary" @click="ensure('formData')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  export default {
    name: 'standard-dialog',
    props: ['form', 'value', 'type'],
    data () {
      // 验证分值的自定义规则
      var validateNumber = (rule, value, callback) => {
        if (value.length > 128) {
          callback(new Error('长度最多128字符'))
        }
        if (value.indexOf('，') > 0) {
          callback(new Error('请用英文逗号分割'))
          return
        }
        let numArr = value.split(',')
        if (numArr.length < 3) {
          callback('格式错误')
        }
        if (numArr.length) {
          numArr.forEach((val, index) => {
            if (!Number(val) && val !== '0') {
              callback('格式错误')
            }
          })
          callback()
        } else {
          callback('格式错误')
        }
      }
      // 验证评估分的详情
      var validateRules = (rule, value, callback) => {
        console.log(999999999)
        if (this.formData.detail.length) {
          callback()
        } else {
          callback(new Error('请添加至少一项数据'))
        }
      }
      return {
        visible: false,
        table: {
          setting: {
            editor: {
              detailDescription: {
                type: 'textarea'
              }
            }
          },
          editable: true,
          data: []
        },
        formData: {},
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 1, max: 127, message: '长度在128个字符以内', trigger: 'blur'}
          ],
          description: [
            {min: 1, max: 255, message: '长度在256个字符以内', trigger: 'blur'}
          ],
          levelType: [
            {required: true, message: '请选择分等类型', trigger: 'change'}
          ]
        },
        detailRule: {
          validator: validateRules, trigger: 'change'
        },
        scoreRule: {
          validator: validateNumber, trigger: 'blur'
        },
        detailNameRule: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 1, max: 25, message: '25个字符以内', trigger: 'blur'}
        ],
        descriptionRule: [
          {required: true, message: '请输入描述', trigger: 'blur'},
          {min: 1, max: 50, message: '50个字符以内', trigger: 'blur'}
        ],
        cacheArr: []
      }
    },
    components: {
      ITable,
      ITableCell
    },
    computed: {
      title () {
        return this.type ? '修改' : '新增'
      }
    },
    watch: {
      // v-model默认事件
      value () {
        this.visible = this.value
      },
      // 深复制一下
      form (val) {
        this.formData = Object.assign({}, this.form)
        this.table.data = this.formData.detail
      }
    },
    methods: {
      rowClickHandler ({rowClickHandler}, row) {
        rowClickHandler(row)
      },
      // 修改每一行的评估分的时候触发
      modifier (scope) {
        console.log('修改')
        console.log(scope)
        if (scope.row.updateType === 1) {
          return
        }
        this.formData.detail[scope.$index].updateType = 2
      },
      // 自定义表头+号图标
      renderHeader (h, {column, $index}) {
        return h('i', {
          'class': {
            'icon': true,
            'iconfont': true,
            'icon-add': true
          },
          on: {
            click: this.addRow
          }
        })
      },
      // 自定义表头的感叹号图标提示,这里有bug饿了么的图标提示不生效
      renderexclamation (h, {column, $index}) {
        return h('div', {}, ['分值   ', h('el-tooltip', {
          'class': {
            'item': true
          },
          attrs: {
            effect: 'dark',
            content: '可以输入多个数字，用英文逗号,分开',
            placement: 'top-start'
          }
        }, [h('i', {
          'class': {
            'icon': true,
            'iconfont': true,
            'icon-tips': true
          }
        })])])
      },
      // 增加一行评估分
      addRow () {
        this.formData.detail.push({sortNo: 1, updateType: 1, score: ''})
        this.$refs['formData'].validate((valid) => {})
      },
      // 删除一行评估分
      removeRow (index) {
        this.formData.detail[index].updateType = 3
        let cache = this.formData.detail.splice(index, 1)
        this.cacheArr = this.cacheArr.concat(cache)
      },
      // 关闭dialog触发的函数
      closeDialog (formName) {
        this.$emit('input', false)
      },
      // 取消按钮
      cancel (formName) {
        this.$emit('standardDialogVisible', false)
      },
      // 确认按钮
      ensure (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let postArr = []
            this.formData.detail.forEach((val, index) => {
              val.sortNo = index + 1
            })
            postArr = this.formData.detail.concat(this.cacheArr)
            postArr.forEach((value, index) => {
              if (!value.updateType) {
                value.updateType = 2
              }
            })
            this.cacheArr = []
            this.formData.status = 1
            this.formData.detail = postArr
            // 过滤掉多余的数据
            for (let i = 0; i < this.formData.detail.length; i++) {
              if ((!this.formData.detail[i].detailId) && (this.formData.detail[i].updateType === 3)) {
                this.formData.detail.splice(i, 1)
                i--
              }
            }
            this.$emit('standardDialogVisible', false, this.formData, this.type)
          } else {
            return false
          }
        })
      }
    }
  }

</script>
