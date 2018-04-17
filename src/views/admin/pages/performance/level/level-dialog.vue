<template>
  <el-form :model="formData" :rules="rules" ref="form">
    <el-form-item label="等级名称" :label-width="'80px'" prop="name" required>
      <el-input v-model.trim="formData.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="描述" :label-width="'80px'" prop="description">
      <el-input type="textarea" v-model.trim="formData.description" :rows="5"></el-input>
    </el-form-item>
    <el-form-item label="分等类型" :label-width="'80px'" prop="levelType">
      <el-select
        v-model="formData.levelType"
        clearable
        placeholder=""
        @change="clearStoredNames">
        <!-- change清空已存名称 zhengwq5 2017/11/25 add -->
        <el-option label="区间" value="1" @click.native="selecChange"></el-option>
        <el-option label="比例" value="2" @click.native="selecChange"></el-option>
        <el-option label="区间加比例" value="3" @click.native="selecChange"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item 
      v-if="formData.levelType == 1" 
      key="1" 
      label="级别" 
      :label-width="'80px'" 
      required 
      prop="detail" 
      :rules="detailRule"
    >
      <el-table
        class="table__original"
        :data="formData.detail"
        :row-key="getRowKey"
        :row-style="hideDeletedRow">
        <el-table-column label="最小分数" width="140" label-class-name="required__header">
          <template slot-scope="scope">
            <el-form-item 
              labelWidth="100" 
              :ref="`minScore${scope.$index}`" 
              :prop="`detail[${scope.$index}].minScore`" 
              :rules="minScoreRule"
            >
              <el-input
                v-if="scope.$index !== formData.detail.length-1"
                :disabled="scope.$index === disabledIndex"
                placeholder="负无穷"
                v-model.trim="scope.row.minScore"
                @change="modifierMin(scope)"
                @blur="handleMinChange($event, scope,formData)"
              ></el-input>
              <el-input 
                v-if="scope.$index === formData.detail.length-1"
                :disabled="scope.$index === formData.detail.length-1"
                placeholder="负无穷"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="最大分数" width="140">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :ref="`maxScore${scope.$index}`">
              <el-input
                v-if="scope.$index !== 0"
                disabled
                v-model.number.trim="scope.row.maxScore"
                @change="modifier(scope)"
                @blur="handleMaxChange($event, scope,formData)"
                placeholder="正无穷">
              </el-input>
              <el-input
                v-if="scope.$index === 0"
                :disabled="scope.$index === 0"
                placeholder="正无穷">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          property="name"
          label="名称"
          width="135"
          label-class-name="required__header"
        >
          <template slot-scope="scope">
            <el-form-item 
              labelWidth="100" 
              :prop="`detail[${scope.$index}].detailName`" 
              :rules="detailNameRule"
            >
              <el-input
                placeholder="名称"
                v-model.trim="scope.row.detailName"
                @change="modifier(scope)"
                @blur="storeName(scope.row.detailName, scope.$index)">
                <!-- blur保存名称 zhengwq5 2017/11/25 add -->
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          property="name"
          :render-header="renderexclamation">
          <template slot-scope="scope">
            <el-form-item 
              labelWidth="100" 
              :prop="`detail[${scope.$index}].coefficient`" 
              :rules="coefficientRule"
            >
              <el-input 
                placeholder="计算系数" 
                v-model.trim="scope.row.coefficient" 
                @change="modifier(scope)"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          property="name"
          label-class-name="required__header">
          <template slot-scope="scope">
            <el-form-item 
              labelWidth="100" 
              :prop="`detail[${scope.$index}].description`" 
              :rules="descriptionRule"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 1}" v-model.trim="scope.row.description" @change="modifier(scope)">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column 
          property="name" 
          :render-header="renderHeader" 
          width="90" 
          class-name="ac"
          header-align="center"
        >
          <template slot-scope="scope">
            <i class="el-icon-delete" @click="removeRow(scope.$index,scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item
      v-if="formData.levelType == 2"
      key="2" label="级别"
      :label-width="'80px'"
      required
      prop="detail"
      :rules="detailRule"
    >
      <el-table
        class="table__original"
        :data="formData.detail"
        :row-style="hideDeletedRow">
        <el-table-column label="比例" width="130" label-class-name="required__header">
          <template slot-scope="scope">
            <el-form-item
              labelWidth="100"
              :prop="`detail[${scope.$index}].percent`"
              :rules="percentRule"
              :ref="`percent${scope.$index}`"
            >
              <el-input
                placeholder="比例"
                v-model.number.trim="scope.row.percent"
                @change="modifier(scope)"
                @blur="handlePercentChange($event, scope,formData)"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="名称" width="180" label-class-name="required__header">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].detailName`" :rules="detailNameRule">
              <el-input
                placeholder="名称"
                v-model.trim="scope.row.detailName"
                @change="modifier(scope)"
                @blur="storeName(scope.row.detailName, scope.$index)">
                <!-- blur保存名称 zhengwq5 2017/11/25 add -->
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column 
          property="name" 
          :render-header="renderexclamation" 
          width="150"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-form-item 
              labelWidth="90" 
              :prop="`detail[${scope.$index}].coefficient`" 
              :rules="coefficientRule"
            >
              <el-input placeholder="计算系数" v-model.trim="scope.row.coefficient" @change="modifier(scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="描述" label-class-name="required__header">
          <template slot-scope="scope">
            <el-form-item 
              labelWidth="90" 
              :prop="`detail[${scope.$index}].description`" 
              :rules="descriptionRule"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 1}" v-model.trim="scope.row.description" @change="modifier(scope)">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column 
          property="name" 
          :render-header="renderHeader" 
          width="90" 
          class-name="ac"
          header-align="center"
        >
          <template slot-scope="scope">
            <i class="el-icon-delete" @click="removeRow(scope.$index,scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item 
      v-if="formData.levelType == 3" 
      key="3" 
      label="级别" 
      :label-width="'80px'" 
      required 
      prop="detail"
      :rules="detailRule"
    >
      <el-table
        class="table__original"
        :data="formData.detail"
        :row-style="hideDeletedRow">
        <el-table-column label="最小分数" width="120" label-class-name="required__header">
          <template slot-scope="scope">
            <el-form-item
              labelWidth="100"
              :ref="`minScore${scope.$index}`"
              :prop="`detail[${scope.$index}].minScore`"
              :rules="minScoreRule"
            >
              <el-input
                v-if="scope.$index !== formData.detail.length-1"
                :disabled="scope.$index === formData.detail.length-1"
                placeholder="负无穷"
                v-model.trim="scope.row.minScore"
                @change="modifierMin(scope)"
                @blur="handleMinChange($event, scope,formData)"
              ></el-input>
              <el-input
                v-if="scope.$index === formData.detail.length-1"
                :disabled="scope.$index === formData.detail.length-1"
                placeholder="负无穷"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="最大分数" width="120">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :ref="`maxScore${scope.$index}`">
              <!-- zhengwq5 2017/11/27 refactor -->
              <el-input
                disabled
                placeholder="正无穷"
                v-if="scope.$index !== 0"
                v-model.number.trim="scope.row.maxScore">
                <!--
                :disabled="scope.$index === 0"
                @change="modifier(scope)"
                @blur="handleMaxChange($event, scope,formData)" -->
              </el-input>
              <el-input
                v-if="scope.$index === 0"
                :disabled="scope.$index === 0"
                placeholder="正无穷">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="比例" width="130" label-class-name="required__header">
          <template slot-scope="scope">
            <el-form-item
              labelWidth="100"
              :prop="`detail[${scope.$index}].percent`"
              :rules="percentRule"
              :ref="`percent${scope.$index}`"
            >
              <el-input
                placeholder="比例"
                v-model.number.trim="scope.row.percent"
                @change="modifier(scope)"
                @blur="handlePercentChange($event, scope,formData)"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="名称" width="120" label-class-name="required__header">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].detailName`" :rules="detailNameRule">
              <el-input
                placeholder="名称"
                v-model.trim="scope.row.detailName"
                @change="modifier(scope)"
                @blur="storeName(scope.row.detailName, scope.$index)">
                <!-- blur保存名称 zhengwq5 2017/11/25 add -->
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" width="130" :render-header="renderexclamation">
          <template slot-scope="scope">
            <el-form-item
              labelWidth="100"
              :prop="`detail[${scope.$index}].coefficient`"
              :rules="coefficientRule"
            >
              <el-input placeholder="计算系数" v-model.trim="scope.row.coefficient" @change="modifier(scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column
          property="name"
          label="描述"
          label-class-name="required__header"
          width="110"
        >
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].description`" :rules="descriptionRule">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 1}" v-model.trim="scope.row.description" @change="modifier(scope)">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" :render-header="renderHeader" width="90" @click="addRow" class-name="ac">
          <template slot-scope="scope">
            <i class="el-icon-delete" @click="removeRow(scope.$index,scope.row)"></i>
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
    name: 'level-dialog',
    props: ['form', 'value', 'type', 'levelId'],
    data () {
      // 比例验证函数
      var validatePercent = (rule, value, callback) => {
        let totalPercent = 0
        if (value === '') {
          callback(new Error('请输入比例值'))
        }
        if (Number(value) <= 0) {
          callback(new Error('请输入大于0的数'))
        }
        this.formData.detail.forEach((val, index) => {
          if (val.updateType !== 3) {
            if (!Number.isNaN(parseInt(val.percent))) {
              totalPercent += val.percent
            }
          }
        })
        if (totalPercent !== 100) {
          callback(new Error('比例总和必须等于100'))
        } else {
          callback()
        }
      }

      // 验证是否是数字
      var validateMaxNumber = (rule, value, callback) => {
        if (!Number(value) || parseFloat(value) === 'NaN') {
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
        let index = rule.fullField[7]
        let maxNumber = this.formData.detail[index].maxScore
        let result = /^-?[0-9]\d*$/.test(value)
        if (value === '') {
          callback(new Error('请输入分值'))
        }
        // TODO校验最小值不能为0
        // if (value === 0) {
        //   callback(new Error('最小值应大于0'))
        // }
        if (Number(value) === 0) {
          callback()
        }
        if (!Number(value) || parseFloat(value) === 'NaN') {
          callback(new Error('请输入数字值'))
        } else if (Number(value) && Number(value) < 0) {
          callback(new Error('请输入正数'))
        } else if (Number(value) && !result) {
          callback(new Error('请输入整数'))
        } else if (Number(value) && Number(value) > 1000) {
          callback(new Error('输入请小于1000'))
        } else if (Number(value) >= maxNumber) {
          callback(new Error('不能大于等于最大值'))
        } else {
          callback()
        }
      }
      // 三位整数，两位小数捕获
      // /^\d{1,3}(\.\d{1,2})?$/ ==> /^[0]*\d{1,3}(\.\d{1,2})?$/
      // zhengwq5 2017/11/27 refactor
      var doubleNumber = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入计算系数'))
        } else if (/^[0]+$/.test(value)) {
          callback(new Error('计算系数不能为0'))
        } else if (!/^[0]*\d{1,3}(\.\d{1,2})?$/.test(value)) {
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
      // 验证不能为所有空格
      var spaceValidate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入绩效等级名称'))
        } else if (value.replace(/\s+/g, '').length === 0) {
          callback(new Error('所有的字符不能都为空格'))
        } else if (value.length > 128) {
          callback(new Error('长度最大为128个字符'))
        } else {
          callback()
        }
      }

      // 校验名称重复 zhengwq5 2017/11/25 add
      const duplicateNameValidate = (rule, val, cb) => {
        if (!val) {
          cb(new Error('请输入名称'))
        } else if (val.length > 25) {
          cb(new Error('长度最大为25个字符'))
        } else if (this.isNameDuplicate(val)) {
          cb(new Error('名称不能重复'))
        } else {
          cb()
        }
      }

      return {
        instance: null,
        visible: false,
        test: 1,
        formData: {},
        rules: {
          name: [
            {validator: spaceValidate, trigger: 'change'}
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
          validator: validateMinNumber, trigger: 'change, blur'
        }],
        maxScoreRule: [{
          validator: validateMaxNumber, trigger: 'change, blur'
        }],
        detailNameRule: [
          // 增加重复名称校验 zhengwq5 2017/11/25 modify
          {validator: duplicateNameValidate, trigger: 'change'},
          {validator: duplicateNameValidate, trigger: 'blur'}
        ],
        coefficientRule: {
          validator: doubleNumber, trigger: 'change'
        },
        descriptionRule: [
          {required: true, message: '请输入描述', trigger: 'change'},
          {min: 1, max: 50, message: '长度最大为50个字符', trigger: 'change'}
        ],
        percentRule: [{
          validator: validatePercent, trigger: 'blur'
        }],
        cacheArr: [],
        oldFormData: [],
        flag: [],
        // 存储已输入名称 zhengwq5 2017/11/25 add
        isolateNames: [],
        // 最小分数disabled索引 zhengwq5 2017/11/25
        disabledIndex: -1
      }
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
      },

      /* 最大分数上限变动 */
      handleMaxChange (value, scope, formData) {
        this.instance.handleMaxChange(value, scope, formData, (valid) => {
          this.flag.push(valid)
        })
      },

      handlePercentChange (value, scope, formData) {
        this.instance.handlePercentChange(value, scope, formData, (valid) => {
          this.flag.push(valid)
        })
        this.modifier(scope)
      },
      // 自定义表头的感叹号图标提示,这里有bug饿了么的图标提示不生效
      renderexclamation (h, {column, $index}) {
        return h('div', {}, ['计算系数', h('el-tooltip', {
          'class': {
            'item': true,
            'required__header': true
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
      modifierMin (scope) {
        if (this.formData.detail[scope.$index + 1]) {
          this.formData.detail[scope.$index + 1].maxScore = this.formData.detail[scope.$index].minScore - 1
          if (this.formData.detail[scope.$index + 1].maxScore <= 0 || Number.isNaN(this.formData.detail[scope.$index + 1].maxScore)) {
            this.formData.detail[scope.$index + 1].maxScore = 0
          }
        }
        this.modifier(scope)
      },
      // 自定义表头+号图标
      renderHeader (h, {column, $index}) {
        return h('i', {
          'class': {
            'el-icon-plus': true
          },
          on: {
            click: this.addRow
          }
        })
      },
      // 增加一行评分等类型
      addRow () {
        // zhengwq5 2017/12/6 增加判断 修改 '正无穷' 对应字段
        if (this.formData.levelType === '1' || this.formData.levelType === '3') {
          let leftPercent = this.minusByHundred(this.formData.detail)
          if (this.formData.detail.length === 0) {
            let emptyDetail = {
              sortNo: 1,
              updateType: 1,
              minScore: '',
              maxScore: 1000,
              id: Math.random()
            }
            if (this.formData.levelType === '1') {
              this.formData.detail.push({ ...emptyDetail })
              this.$refs.form.validate((valid) => {})
              return
            } else {
              this.formData.detail.push({
                ...emptyDetail,
                percent: leftPercent
              })
              this.$refs.form.validate((valid) => {})
              return
            }
          }
          if (this.formData.detail.length > 0) {
            // 如果已经添加了最小值为0的区间，就不应再让它增加一行，目前只能限制不增加为0区间之后第二行
            if (this.formData.levelType === '1') {
              if (this.formData.detail.length >= 2) {
                let lastTwoMinScore = this.formData.detail[this.formData.detail.length - 2].minScore
                if (lastTwoMinScore <= 0) {
                  this.$message.warning('不能添加小于0的区间')
                  return
                }
              }
              this.formData.detail.push({
                sortNo: 1,
                updateType: 1,
                minScore: '',
                maxScore: this.formData.detail[this.formData.detail.length - 1].minScore,
                id: Math.random()
              })
              this.$refs.form.validate((valid) => {})
            } else {
              this.formData.detail.push({
                sortNo: 1,
                updateType: 1,
                minScore: '',
                maxScore: this.formData.detail[this.formData.detail.length - 1].minScore,
                id: Math.random(),
                percent: leftPercent
              })
              this.$refs.form.validate((valid) => {})
            }
          }
        } else {
          // 新增一条会附带比例 zhengwq5 2017/12/6
          let leftPercent = this.minusByHundred(this.formData.detail)
          this.formData.detail.push({sortNo: 1, updateType: 1, percent: leftPercent})
          this.$refs.form.validate((valid) => {})
        }
      },
      getRowKey (row) {
        return row.id
      },
      // 删除一行评分等类型
      removeRow (index, data) {
        this.formData.detail[index].updateType = 3
        let prev = -1
        let next = -1
        for (let i = index; i >= 0; i--) {
          if (this.formData.detail[i].updateType !== 3) {
            prev = i
            break
          }
        }
        for (let j = index; j < this.formData.detail.length; j++) {
          if (this.formData.detail[j].updateType !== 3) {
            next = j
            break
          }
        }
        if (prev !== -1 && next !== -1) {
          if (this.formData.detail[prev].minScore !== '' && this.formData.detail[prev].minScore > 0) {
            this.formData.detail[next].maxScore = this.formData.detail[prev].minScore - 1
          }
        }
        let cache = this.formData.detail.splice(index, 1)
        this.cacheArr = this.cacheArr.concat(cache)
        if (this.formData.detail.length) {
          this.formData.detail[this.formData.detail.length - 1].minScore = '0'
        }
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
          this.formData.detail[this.formData.detail.length - 1].minScore = 0
          this.formData.detail[0].maxScore = 1000
        } else {
          this.$message.error('无法保存空的绩效等级')
          return false
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
        this.$refs.form.validate((valid) => {
          console.log(valid, this.flag)
          if (valid && !this.flag.includes(false)) {
            // 此处先concat 再splicexing性能可能不太好。后期需要优化
            let postArr = []
            this.formData.detail.forEach((val, index) => {
              val.sortNo = index + 1
            })
            postArr = this.formData.detail
            postArr = postArr.concat(this.cacheArr).concat(this.oldFormData)
            // this.cacheArr = []
            // postArr = this.formData.detail.concat(this.oldFormData)
            // this.oldFormData = []
            // this.formData.detail = postArr
            // 本地新增再删除的无需发给后端
            // for (let i = 0; i < this.formData.detail.length; i++) {
            //   if ((!this.formData.detail[i].detailId) && (this.formData.detail[i].updateType === 3)) {
            //     this.formData.detail.splice(i, 1)
            //     i--
            //   }
            // }
            // for (let i = 0; i < this.formData.detail.length; i++) {
            //   if (this.formData.detail[i].detailId && (!this.formData.detail[i].updateType)) {
            //     this.formData.detail[i].updateType = 2
            //   }
            //   if (this.formData.detail[i].minScore === '正无穷') {
            //     this.formData.detail[i].minScore = 0
            //   }
            // }
            for (let i = 0; i < postArr.length; i++) {
              if ((!postArr[i].detailId) && (postArr[i].updateType === 3)) {
                postArr.splice(i, 1)
                i--
              }
            }
            for (let i = 0; i < postArr.length; i++) {
              if (postArr[i].detailId && (!postArr[i].updateType)) {
                postArr[i].updateType = 2
              }
              if (postArr[i].minScore === '正无穷') {
                postArr[i].minScore = 0
              }
            }
            let obj = this.formData
            obj.detail = postArr
            this.$emit('levelDialogVisible', false, obj, this.type)
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
      // 保存按钮
      save () {
        if (this.formData.detail.length) {
          this.formData.detail[this.formData.detail.length - 1].minScore = '0'
          this.formData.detail[0].maxScore = 1000
        } else {
          this.$message.error('无法保存空的绩效等级')
          return false
        }
        this.flag = []
        let scorerule = {} // 声明时赋值为空对象，否则将会将undefined推入this.minScoreRule数组，校验时会报错为required找不到
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
                  scorerule = this.minScoreRule.splice(index, 1)
                }
              })
              this.$refs[name].$el.children[0].children[0].children[0].focus()
              this.$refs[name].$el.children[0].children[0].children[0].blur()
            }
          }
        }
        return new Promise(resolve => {
          this.validate().then(res => {
            this.minScoreRule = this.minScoreRule.concat(scorerule)
            if (res && !this.flag.includes(false)) {
              // 此处先concat 再splicexing性能可能不太好。后期需要优化
              let postArr = []
              res.detail.forEach((val, index) => {
                val.sortNo = index + 1
              })
              postArr = Array.from(res.detail)
              postArr = postArr.concat(this.cacheArr).concat(this.oldFormData)
              // this.cacheArr = []
              // this.oldFormData = []
              // postArr = res.detail.concat(this.oldFormData)
              // res.detail = postArr
              // 本地新增的无需发给后端
              // for (let i = 0; i < res.detail.length; i++) {
                // if ((!res.detail[i].detailId) && (res.detail[i].updateType === 3)) {
                  // res.detail.splice(i, 1)
              for (let i = 0; i < postArr.length; i++) {
                if ((!postArr[i].detailId) && (postArr[i].updateType === 3)) {
                  postArr.splice(i, 1)
                  i--
                }
              }
              // for (let i = 0; i < res.detail.length; i++) {
              //   if (res.detail[i].detailId && (!res.detail[i].updateType)) {
              //     res.detail[i].updateType = 2
              //   }
              //   if (res.detail[i].minScore === '') {
              //     res.detail[i].minScore = 0
              //   }
              // }
              for (let i = 0; i < postArr.length; i++) {
                if (postArr[i].detailId && (!postArr[i].updateType)) {
                  postArr[i].updateType = 2
                }
                if (postArr[i].minScore === '') {
                  postArr[i].minScore = 0
                }
              }
              let obj = Object.assign({}, res)
              obj.detail = postArr
              if (this.type) {
                req('modifiedLevel', {levelId: this.levelId, ...obj}).then((data) => {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                  })
                  this.cacheArr = []
                  this.oldFormData = []
                  resolve(obj)
                })
              } else {
                req('addOneLevel', obj).then((data) => {
                  this.$message({
                    message: '恭喜你，添加成功',
                    type: 'success'
                  })
                  this.cacheArr = []
                  this.oldFormData = []
                  resolve(obj)
                })
              }
            } else {
              resolve(false)
            }
          })
        })
      },

      // 清空已存储名称 zhengwq5 2017/11/25 add
      clearStoredNames () {
        this.isolateNames.splice(0)
      },

      // 保存已输入名称 zhengwq5 2017/11/25 add
      storeName (name, index) {
        // this.isolateNames[index] = name
        this.isolateNames = this.formData.detail.map(ele => ele.detailName)
      },

      // 检查名称是否重复 zhengwq5 2017/11/25 add
      isNameDuplicate (name) {
        this.isolateNames = []
        this.storeName()
        if (this.isolateNames.length <= 1) return false
        let matchedNames =
          this.isolateNames.filter(i => i === name)
        if (matchedNames.length > 1) return true
        return false
      },

      // 剩余比例
      minusByHundred (detail) {
        let total = detail.reduce((sum, val) => {
          if (val.updateType !== 3) {
            let percent = Number.isNaN(parseInt(val.percent))
              ? 0
              : parseInt(val.percent)
            return sum + percent
          } else {
            return sum
          }
        }, 0)
        return total > 100
          ? 0
          : 100 - total
      }
    }
  }
</script>

<style lang="scss">
.required__header::after {
  content: '*';
  color: #ff4949;
  margin-left: 4px;
}
.gengtp-level-dialog-form {
  .el-table__body-wrapper {
    overflow: hidden;
  }
  .el-form-item__content {
    position: relative;
    .el-form-item__error{
      top: 35px;
    }
  }
}
.el-icon-plus, .el-icon-delete {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: #8D8D8D;
}
</style>
