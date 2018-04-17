<template>
  <el-form :model="formData" ref="form">
    <el-form-item label="等级名称" :label-width="'80px'" prop="name">
      <el-input disabled v-model="formData.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="描述" :label-width="'80px'" prop="description">
      <el-input disabled type="textarea" v-model="formData.description" :rows="5"></el-input>
    </el-form-item>
    <el-form-item label="分等类型" :label-width="'80px'" prop="levelType">
      <el-select disabled v-model="formData.levelType" placeholder="请选择分等类型">
        <el-option label="区间" value="1" @click.native="selecChange"></el-option>
        <el-option label="比例" value="2" @click.native="selecChange"></el-option>
        <el-option label="区间加比例" value="3" @click.native="selecChange"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-if="formData.levelType == 1" key="1" label="级别" :label-width="'80px'" prop="detail"
                  :rules="detailRule">
      <el-table :data="formData.detail" :row-key="getRowKey">
        <el-table-column label="最小分数" width="150">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :ref="`minScore${scope.$index}`" :prop="`detail[${scope.$index}].minScore`"
                          :rules="minScoreRule">
              <el-input v-if="scope.$index !== formData.detail.length-1"
                        disabled placeholder="最小分数"
                        v-model.number="scope.row.minScore"
                        @change="modifier(scope)" @blur="handleMinChange($event, scope,formData)"></el-input>
              <el-input v-if="scope.$index === formData.detail.length-1"
                        :disabled="scope.$index === formData.detail.length-1"
                        placeholder="负无穷"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="最大分数" width="150">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :ref="`maxScore${scope.$index}`" :prop="`detail[${scope.$index}].maxScore`"
                          :rules="maxScoreRule">
              <el-input v-if="scope.$index !== 0" disabled placeholder="最大分数"
                        v-model.number="scope.row.maxScore"
                        @change="modifier(scope)" @blur="handleMaxChange($event, scope,formData)"></el-input>
              <el-input v-if="scope.$index === 0" :disabled="scope.$index === 0"
                        placeholder="正无穷"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="名称" width="150">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].detailName`" :rules="detailNameRule">
              <el-input disabled placeholder="名称" v-model="scope.row.detailName" @change="modifier(scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" :render-header="renderexclamation" width="150">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].coefficient`" :rules="coefficientRule">
              <el-input disabled placeholder="计算系数" v-model="scope.row.coefficient" @change="modifier(scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="描述">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].description`" :rules="descriptionRule">
              <el-input
                disabled
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 1}" v-model="scope.row.description" @change="modifier(scope)">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item v-if="formData.levelType == 2" key="2" label="级别" :label-width="'80px'" prop="detail"
                  :rules="detailRule">
      <el-table :data="formData.detail">
        <el-table-column label="比例" width="160">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].percent`" :rules="percentRule">
              <el-input disabled placeholder="比例" v-model="scope.row.percent" @change="modifier(scope)">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="名称" width="150">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].detailName`" :rules="detailNameRule">
              <el-input disabled placeholder="名称" v-model="scope.row.detailName" @change="modifier(scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" :render-header="renderexclamation" width="150">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].coefficient`" :rules="coefficientRule">
              <el-input disabled placeholder="计算系数" v-model="scope.row.coefficient" @change="modifier(scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="描述">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].description`" :rules="descriptionRule">
              <el-input
                type="textarea"
                disabled
                :autosize="{ minRows: 1, maxRows: 1}" v-model="scope.row.description" @change="modifier(scope)">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item v-if="formData.levelType == 3" key="3" label="级别" :label-width="'80px'"  prop="detail"
                  :rules="detailRule">
      <el-table :data="formData.detail">
        <el-table-column label="最小分数" width="150">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :ref="`minScore${scope.$index}`" :prop="`detail[${scope.$index}].minScore`"
                          :rules="minScoreRule">
              <el-input disabled v-if="scope.$index !== formData.detail.length-1"
                        disabled placeholder="最小分数"
                        v-model.number="scope.row.minScore"
                        @change="modifier(scope)" @blur="handleMinChange($event, scope,formData)"></el-input>
              <el-input v-if="scope.$index === formData.detail.length-1"
                        :disabled="scope.$index === formData.detail.length-1"
                        placeholder="负无穷"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="最大分数" width="150">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :ref="`maxScore${scope.$index}`" :prop="`detail[${scope.$index}].maxScore`"
                          :rules="maxScoreRule">
              <el-input disabled v-if="scope.$index !== 0" disabled placeholder="最大分数"
                        v-model.number="scope.row.maxScore"
                        @change="modifier(scope)" @blur="handleMaxChange($event, scope,formData)"></el-input>
              <el-input v-if="scope.$index === 0" :disabled="scope.$index === 0"
                        placeholder="正无穷"></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="比例" width="160">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].percent`" :rules="percentRule">
              <el-input disabled placeholder="比例" v-model="scope.row.percent" @change="modifier(scope)">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="名称" width="150">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].detailName`" :rules="detailNameRule">
              <el-input disabled placeholder="名称" v-model="scope.row.detailName" @change="modifier(scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" width="150" :render-header="renderexclamation">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].coefficient`" :rules="coefficientRule">
              <el-input disabled placeholder="计算系数" v-model="scope.row.coefficient" @change="modifier(scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column property="name" label="描述">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].description`" :rules="descriptionRule">
              <el-input
                disabled type="textarea"
                disabled
                :autosize="{ minRows: 1, maxRows: 1}" v-model="scope.row.description" @change="modifier(scope)">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>

<script>
  import { ScoreAddRule } from './score-add-rule'
  import req from 'api/performance/level'

  export default {
    name: 'level-dialog-check',
    props: ['form', 'value', 'type'],
    data () {
      // 比例验证函数
      var validatePercent = (rule, value, callback) => {
        let totalPercent = 0
        this.formData.detail.forEach((val, index) => {
          totalPercent += Number(val.percent)
        })
        if (totalPercent !== 100) {
          callback(new Error('比例总和必须等于100'))
        } else {
          callback()
        }
      }
      // 验证是否是数字
      var validateMaxNumber = (rule, value, callback) => {
        if (!Number(value)) {
          callback(new Error('请输入数字值'))
        } else if (Number(value) && Number(value) > 1000) {
          callback(new Error('输入请小于1000'))
        } else if (Number(value) && Number(value) < -1000) {
          callback(new Error('输入请大于-1000'))
        } else {
          callback()
        }
      }
      var validateMinNumber = (rule, value, callback) => {
        if (!Number(value)) {
          callback(new Error('请输入数字值'))
        } else if (Number(value) && Number(value) < -1000) {
          callback(new Error('输入请大于-1000'))
        } else if (Number(value) && Number(value) > 1000) {
          callback(new Error('输入请小于1000'))
        } else {
          callback()
        }
      }
      // 三位整数，两位小数捕获
      var doubleNumber = (rule, value, callback) => {
        if (!/^\d{1,3}(\.\d{1,2})?$/.test(value)) {
          callback(new Error('格式不正确'))
        } else {
          callback()
        }
      }
      // 验证评估分的详情
      var validateRules = (rule, value, callback) => {
        if (this.formData.detail.length) {
          callback()
        } else {
          callback(new Error('请添加至少一项数据'))
        }
      }
      return {
        instance: null,
        visible: false,
        test: 1,
        formData: {},
        rules: {
          name: [
            {required: true, message: '等级名不能为空', trigger: 'change'},
            {min: 1, max: 128, message: '长度最大为128个字符', trigger: 'change'}
          ],
          description: [
            {min: 1, max: 255, message: '长度最大为255个字符', trigger: 'change'}
          ],
          levelType: [
            {required: true, message: '请选择分等类型', trigger: 'change'}
          ]
        },
        detailRule: {
          validator: validateRules, trigger: 'change'
        },
        minScoreRule: [{
          validator: validateMinNumber, trigger: 'change'
        }],
        maxScoreRule: [{
          validator: validateMaxNumber, trigger: 'change'
        }],
        detailNameRule: [
          {required: true, message: '请输入名称', trigger: 'change'},
          {min: 1, max: 25, message: '长度最大为25个字符', trigger: 'change'}
        ],
        coefficientRule: {
          validator: doubleNumber, trigger: 'change'
        },
        descriptionRule: [
          {required: true, message: '请输入描述', trigger: 'change'},
          {min: 1, max: 50, message: '长度最大为50个字符', trigger: 'change'}
        ],
        percentRule: {
          validator: validatePercent, trigger: 'change'
        },
        cacheArr: [],
        oldFormData: [],
        flag: []
      }
    },
    watch: {
//      'formData.detail': {
//        handler: function (val, oldVal) {
//          for (let i = 0; i < val.length; i++) {
//            if (i === 0) {
//              continue
//            }
//            val[i].maxScore = val[i - 1].minScore - 1
//          }
//        },
//        deep: true
//      }
    },
    created () {
      this.init()
    },
    methods: {
      /* 初始化 */
      init () {
        this.formData = JSON.parse(JSON.stringify(this.form))
        this.initInstance()
      },
      /* 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = new ScoreAddRule(opts)
      },

      /* 处理最小分数下限变动 */
      handleMinChange (value, scope, formData) {
        this.instance.handleMinChange(value, scope, formData, (valid) => {
          this.flag.push(valid)
        })
        console.log(this.flag)
      },

      /* 最大分数上限变动 */
      handleMaxChange (value, scope, formData) {
        this.instance.handleMaxChange(value, scope, formData, (valid) => {
          this.flag.push(valid)
        })
      },
      // 自定义表头的感叹号图标提示,这里有bug饿了么的图标提示不生效
      renderexclamation (h, {column, $index}) {
        return h('div', {}, ['计算系数', h('el-tooltip', {
          'class': {
            'item': true
          },
          attrs: {
            effect: 'dark',
            content: '最多输入三位整数，两位小数',
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
      // 修改每一行的评估分的时候触发
      modifier (scope) {
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
      // 增加一行评分等类型
      addRow () {
        if (this.formData.levelType === '1' || this.formData.levelType === '3') {
          if (this.formData.detail.length === 0) {
            this.formData.detail.push({
              sortNo: 1, updateType: 1, minScore: '正无穷', maxScore: 1000, id: Math.random()
            })
            this.$refs.form.validate((valid) => {})
            return
          }
          if (this.formData.detail.length > 0) {
            if (this.formData.detail[this.formData.detail.length - 1].minScore === -1000) {
              this.formData.detail[this.formData.detail.length - 1].minScore = '正无穷'
            }
            this.formData.detail.push({
              sortNo: 1,
              updateType: 1,
              minScore: '正无穷',
              maxScore: this.formData.detail[this.formData.detail.length - 1].minScore,
              id: Math.random()
            })
            this.$refs.form.validate((valid) => {})
          }
        } else {
          this.formData.detail.push({sortNo: 1, updateType: 1})
//          this.$refs['formData'].validate((valid) => {})
          this.$refs.form.validate((valid) => {})
        }
      },
      getRowKey (row) {
        return row.id
      },
      // 删除一行评分等类型
      removeRow (index, data) {
        this.formData.detail[index].updateType = 3
        let cache = this.formData.detail.splice(index, 1)
        this.cacheArr = this.cacheArr.concat(cache)
      },
      // 关闭dialog触发的函数
      closeDialog (formName) {
        this.$emit('input', false)
      },
      // 选择分等类型触发
      selecChange () {
        this.formData.detail.forEach((val, index) => {
          val.updateType = 3
        })
        if (!this.oldFormData.length) {
          this.oldFormData = this.formData.detail
        } else {
          this.oldFormData = this.oldFormData.concat(this.formData.detail)
        }
        this.formData.detail = []
      },
      // 确认按钮
      ensure (formName) {
        if (this.formData.detail.length) {
          this.formData.detail[this.formData.detail.length - 1].minScore = -1000
          this.formData.detail[0].maxScore = 1000
        }
        this.flag = []
        for (let name in this.$refs) {
          if (name !== 'formData' && this.$refs[name] !== undefined) {
            if (name !== 'maxScore0' && name !== 'minScore' + (this.formData.detail.length - 1)) {
              this.maxScoreRule.forEach((val, index) => {
                if (val.trigger === 'change') {
                  this.maxScoreRule.splice(index, 1)
                }
              })
              this.minScoreRule.forEach((val, index) => {
                if (val.trigger === 'change') {
                  this.minScoreRule.splice(index, 1)
                }
              })
              this.$refs[name].$el.children[0].children[0].children[0].focus()
              this.$refs[name].$el.children[0].children[0].children[0].blur()
            }
          }
        }
//        console.log(this.maxScoreRule)
//        console.log(this.minScoreRule)
        this.$refs.form.validate((valid) => {
          if (valid && !this.flag.includes(false)) {
            // 此处先concat 再splicexing性能可能不太好。后期需要优化
            let postArr = []
            this.formData.detail.forEach((val, index) => {
              val.sortNo = index + 1
            })
            postArr = this.formData.detail.concat(this.cacheArr).concat(this.oldFormData)
            this.cacheArr = []
            this.oldFormData = []
            this.formData.detail = postArr
            for (let i = 0; i < this.formData.detail.length; i++) {
              if ((!this.formData.detail[i].detailId) && (this.formData.detail[i].updateType === 3)) {
                this.formData.detail.splice(i, 1)
                i--
              }
            }
            for (let i = 0; i < this.formData.detail.length; i++) {
              if (this.formData.detail[i].detailId && (!this.formData.detail[i].updateType)) {
                this.formData.detail[i].updateType = 2
              }
              if (this.formData.detail[i].minScore === '正无穷') {
                this.formData.detail[i].minScore = -1000
              }
            }
            this.$emit('levelDialogVisible', false, this.formData, this.type)
          } else {
            return false
          }
        })
      },

      /* 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.formData)
            } else {
              resolve(false)
            }
          })
        })
      },
      // 确认按钮
      save () {
        if (this.formData.detail.length) {
          this.formData.detail[this.formData.detail.length - 1].minScore = -1000
          this.formData.detail[0].maxScore = 1000
        }
        this.flag = []
        console.log(this.$refs)
        for (let name in this.$refs) {
          if (name !== 'form' && this.$refs[name] !== undefined) {
            if (name !== 'maxScore0' && name !== 'minScore' + (this.formData.detail.length - 1)) {
              this.maxScoreRule.forEach((val, index) => {
                if (val.trigger === 'change') {
                  this.maxScoreRule.splice(index, 1)
                }
              })
              this.minScoreRule.forEach((val, index) => {
                if (val.trigger === 'change') {
                  this.minScoreRule.splice(index, 1)
                }
              })
              this.$refs[name].$el.children[0].children[0].children[0].focus()
              this.$refs[name].$el.children[0].children[0].children[0].blur()
            }
          }
        }
//        console.log(this.maxScoreRule)
//        console.log(this.minScoreRule)
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              if (this.type) {
                req('modifiedLevel', {levelId: this.levelId, ...res}).then((data) => {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                  })
                  resolve(res)
                })
              } else {
                req('addOneLevel', res).then((data) => {
                  this.$message({
                    message: '恭喜你，添加成功',
                    type: 'success'
                  })
                  resolve(res)
                })
              }
            } else {
              resolve(false)
            }
          })
        })
      }
    }
  }
</script>

