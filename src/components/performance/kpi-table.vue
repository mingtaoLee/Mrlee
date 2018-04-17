<template>
  <div>
    <span
      class="blue mt-10"
      style="display: block"
      v-if="canOperate">
      <span>{{ allDetail.indicatorWeight | totalTip}}% &nbsp;&nbsp;&nbsp;</span>
      <span
        :class="{'red': this.indicatorWeightRemain < 0}">
        {{ indicatorWeightRemain | remainTip }}%
      </span>
    </span>
    <table border="1" class="table__original">
      <tr>
        <th v-for="name in thName" :key="name">{{ name }}</th>
      </tr>
      <tr>
        <th colspan="8" class="fix-bar">
          <span class="fl">固定绩效指标</span>
        </th>
      </tr>

<!-- 固定绩效指标 -->

      <tbody>
        <tr
          v-for="(obj, index) in allDetail.fixedIndicators"
          :key="index"
          v-if="obj['updateType'] !== '3'">

  <!-- 指标名称 -->

          <td class="width__350">
            <div>{{ obj.indicatorName }}</div>
          </td>

  <!-- 指标权重 -->

          <td class="width__100">
            <span
              v-if="!obj.weightShow"
              :class="[{'editable':canOperate}]"
              @click.stop="toggleShow(obj, 'weightShow', true)">
                {{ obj.weight | emptyFormat }}%
            </span>
            <el-form-item
              v-else
              :prop="`fixedIndicators[${index}].weight`"
              :rules="indicatorWeightRule">
              <el-input
                v-focus
                v-model.number="obj.weight"
                type="number"
                @focusout.native="toggleShow(obj, 'weightShow', false)"
                @keyup.native.enter="toggleShow(obj, 'weightShow', false)"
                size="mini">
              </el-input>
            </el-form-item>
          </td>

  <!-- 评估类型 -->

          <td
            class="width__150"
            @click.self="toggleShow(obj, 'evaluationTypeShow', false)">
            <span
              v-if="!obj.evaluationTypeShow"
              :class="[{'editable':canOperate}]"
              @click.stop="toggleShow(obj, 'evaluationTypeShow', true)">
              {{ obj.evaluationType | evaluationTypeFormat }}
            </span>
            <el-select
              v-else
              v-model="obj.evaluationType"
              @change="toggleShow(obj, 'evaluationTypeShow', false)"
              size="mini">
              <el-option
                v-for="dict in dicts[0]"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value">
              </el-option>
            </el-select>
          </td>

  <!-- 评估方法 -->

          <td class="width__150">
            <span>
              {{ obj.evaluationMethod | evaluationMethodFormat }}
            </span>
          </td>

  <!-- 目标值  -->

          <td
            class="width__100"
            @click.self="toggleShow(obj, 'unitShow', false)">
            <div v-if="obj.evaluationType === '2'">
              <span
                v-if="!obj.targetShow">
                <span
                  :class="[{'editable':canOperate}]"
                  @click.stop="toggleShow(obj, 'targetShow', true)">
                  {{ obj.target | emptyFormat }}
                </span>
                <span
                  v-if="!obj.unitShow"
                  :class="[{'editable':canOperate}]"
                  @click.stop="toggleShow(obj, 'unitShow', true)">
                  {{ obj.unit | unitFormat }}
                </span>
                <el-select
                  v-else
                  v-model="obj.unit"
                  @change="toggleShow(obj, 'unitShow', false)"
                  size="mini">
                  <el-option
                    v-for="dict in dicts[2]"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value">
                  </el-option>
                </el-select>
              </span>
              <el-form-item
                v-else
                :prop="`fixedIndicators[${index}].target`"
                :rules="indicatorTargetRule">
                <el-input
                  v-focus
                  v-model.number="obj.target"
                  :min="0"
                  type="number"
                  @focusout.native="toggleShow(obj, 'targetShow', false)"
                  @keyup.native.enter="toggleShow(obj, 'targetShow', false)"
                  size="mini">
                </el-input>
              </el-form-item>
            </div>
          </td>

  <!-- 数据收集员 -->

          <td class="width__200">
            <div v-if="obj.evaluationType === '2'">
              <div>
                收集员：
                <span
                  :class="[{'editable':canOperate}]"
                  @click.stop="toggleSelectShow(obj, 'collect')">
                  {{ obj.collectorName | emptyFormat }}
                </span>
              </div>
              <div>
                收集负责人:
                <span
                  :class="[{'editable':canOperate}]"
                  @click.stop="toggleSelectShow(obj, 'collectManage')">
                  {{ obj.collectManagerName | emptyFormat }}
                </span>
              </div>
            </div>
          </td>

  <!-- 评估人 -->

          <td class="width__150">
            <div
              :key="index"
              v-for="(leaderInfo, index) in obj.evaluationLeaders">
              <span
                :class="[{'editable':canOperate}]"
                @click.stop="toggleSelectShow(obj.evaluationLeaders, 'evaluation')">
                {{ leaderInfo.leaderName | emptyFormat }}
              </span>
              <span
                v-if="!leaderInfo.leaderWeightShow"
                :class="[{'editable':canOperate}]"
                @click.stop="toggleShow(leaderInfo, 'leaderWeightShow', true)">
                ({{ leaderInfo.weight | emptyFormat }}%)
              </span>
              <span v-else>
                <el-input
                  v-focus
                  v-model.number="leaderInfo.weight"
                  :min="0"
                  type="number"
                  size="mini"
                  @focusout.native="toggleShow(leaderInfo, 'leaderWeightShow', false)"
                  @keyup.native.enter="toggleShow(leaderInfo, 'leaderWeightShow', false)">
                </el-input>
              </span>
            </div>
          </td>

  <!-- 操作 -->

          <td class="width__50">
            <el-button
              type="text"
              v-if="allDetail.isOperatePermission !== 'N' &&
                (allDetail.processStatus === '011' ||
                allDetail.processStatus === '01')"
              @click="deleteLine(allDetail.fixedIndicators, index)">
              删除
            </el-button>
          </td>
        </tr>
      </tbody>
      <tr>
        <th colspan="8" class="fix-bar">
          <span class="fl">补充绩效</span>
          <span
            class="fr"
            v-if="allDetail.processStatus === '01' || (allDetail.processStatus === '011' &&
                allDetail.isOperatePermission !== 'N')">
            <el-button
              size="mini"
              @click="addIndicator(allDetail.supplementIndicators)"
              v-if="allDetail.isOperatePermission !== 'N'">
              新建指标
            </el-button>
            <el-button
              size="mini"
              @click="quoteTableVisible = true"
              v-if="allDetail.isOperatePermission !== 'N'">
              引用指标
            </el-button>
          </span>
        </th>
      </tr>

<!-- 补充绩效 -->

      <tbody>
        <tr
          v-for="(obj, index) in allDetail.supplementIndicators"
          :key="index"
          v-if="obj['updateType'] !== '3'">

<!-- 指标名称 -->

          <td class="width__350">
            <span
              v-if="!obj.indicatorNameShow"
              :class="[{'editable':canOperate}]"
              @click.stop="toggleShow(obj, 'indicatorNameShow', true)">
              {{ obj.indicatorName | emptyFormat }}
            </span>
            <el-form-item
              v-else
              :prop="`supplementIndicators[${index}].indicatorName`"
              :rules="indicatorNameRule">
              <el-input
                v-focus
                v-model="obj.indicatorName"
                :autosize="{ minRows: 2}"
                type="textarea"
                @focusout.native="toggleShow(obj, 'indicatorNameShow', false)">
              </el-input>
            </el-form-item>
          </td>

<!-- 指标权重 -->

          <td class="width__100">
            <span
              v-if="!obj.weightShow"
              :class="[{'editable':canOperate}]"
              @click.stop="toggleShow(obj, 'weightShow', true)">
                {{ obj.weight | emptyFormat }}%
            </span>
            <el-form-item
              v-else
              :prop="`supplementIndicators[${index}].weight`"
              :rules="indicatorWeightRule">
              <el-input
                v-focus
                v-model.number="obj.weight"
                type="number"
                @focusout.native="toggleShow(obj, 'weightShow', false)"
                @keyup.native.enter="toggleShow(obj, 'weightShow', false)"
                size="mini">
              </el-input>
            </el-form-item>
          </td>

<!-- 评估类型 -->

          <td
            class="width__150"
            @click.self="toggleShow(obj, 'evaluationTypeShow', false)">
            <span
              v-if="!obj.evaluationTypeShow"
              :class="[{'editable':canOperate}]"
              @click.stop="toggleShow(obj, 'evaluationTypeShow', true)">
              {{ obj.evaluationType | evaluationTypeFormat }}
            </span>
            <el-select
              v-else
              v-model="obj.evaluationType"
              @change="toggleShow(obj, 'evaluationTypeShow', false)"
              size="mini">
              <el-option
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
                v-for="dict in dicts[0]">
              </el-option>
            </el-select>
          </td>

<!-- 评估方法 -->

          <td class="width__150">
            <span>
              {{ obj.evaluationMethod | evaluationMethodFormat }}
            </span>
          </td>

<!-- 	目标值 -->

          <td
            class="width__100"
            @click.self="toggleShow(obj, 'unitShow', false)">
            <div v-if="obj.evaluationType === '2'">
              <span v-if="!obj.targetShow">
                <span
                  @click.stop="toggleShow(obj, 'targetShow', true)"
                  :class="[{'editable':canOperate}]">
                  {{ obj.target | emptyFormat }}
                </span>
                <span
                  v-if="!obj.unitShow"
                  @click.stop="toggleShow(obj, 'unitShow', true)"
                  :class="[{'editable':canOperate}]">
                  {{ obj.unit | unitFormat }}
                </span>
                <el-select
                  v-else
                  v-model="obj.unit"
                  @change="toggleShow(obj, 'unitShow', false)"
                  size="mini">
                  <el-option
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                    v-for="dict in dicts[2]">
                  </el-option>
                </el-select>
              </span>
              <el-form-item
                v-else
                :prop="`supplementIndicators[${index}].target`"
                :rules="indicatorTargetRule">
                <el-input
                  v-focus
                  v-model.number="obj.target"
                  :min="0"
                  type="number"
                  @focusout.native="toggleShow(obj, 'targetShow', false)"
                  @keyup.native.enter="toggleShow(obj, 'targetShow', false)"
                  size="mini">
                </el-input>
              </el-form-item>
            </div>
          </td>

<!-- 数据收集员 -->

          <td class="width__200">
            <div v-if="obj.evaluationType === '2'">
              <div>
                收集员：
                <span
                  :class="[{'editable':canOperate}]"
                  @click.stop="toggleSelectShow(obj, 'collect')">
                  {{ obj.collectorName | emptyFormat }}
                </span>
              </div>
              <div>
                收集负责人:
                <span
                  :class="[{'editable': canOperate}]"
                  @click.stop="toggleSelectShow(obj, 'collectManage')">
                  {{ obj.collectManagerName | emptyFormat }}
                </span>
              </div>
            </div>
          </td>

<!-- 评估人 -->

          <td class="width__150">
            <div
              v-for="(leaderInfo, _index) in obj.evaluationLeaders"
              :key="_index">
              <span
                :class="[{'editable':canOperate}]"
                @click.stop="toggleSelectShow(obj.evaluationLeaders, 'evaluation')">
                {{ leaderInfo.leaderName | emptyFormat }}
              </span>
              <span
                v-if="!leaderInfo.leaderWeightShow"
                :class="[{'editable':canOperate}]"
                @click.stop="toggleShow(leaderInfo, 'leaderWeightShow', true)">
                ({{ leaderInfo.weight | emptyFormat }}%)
              </span>
              <span v-else>
                <el-form-item :prop="`supplementIndicators[${index}].evaluationLeaders[${_index}].weight`" :rules="weightRules">
                  <el-input
                    v-focus
                    v-model.number="leaderInfo.weight"
                    :min="0"
                    size="mini"
                    type="number"
                    @focusout.native="toggleShow(leaderInfo, 'leaderWeightShow', false)"
                    @keyup.native.enter="toggleShow(leaderInfo, 'leaderWeightShow', false)"
                  >
                </el-input>
                </el-form-item>

              </span>
            </div>
          </td>

<!-- 操作 -->

          <td class="width__50">
            <el-button
              type="text"
              v-if="allDetail.isOperatePermission !== 'N' &&
                (allDetail.processStatus === '011' ||
                allDetail.processStatus === '01')"
              @click="deleteLine(allDetail.supplementIndicators, index)">
              删除
            </el-button>
          </td>

        </tr>
      </tbody>
    </table>
    <el-dialog
      :visible.sync="quoteTableVisible"
      :show-close="false"
      @close="clearSelectBeforeClose">

      <quote-table
        ref="quote"
        @select="updateSelectedOnce"
        @check="updateSelected">
      </quote-table>

      <span slot="footer" class="dialog-footer">

        <el-button @click="quoteTableVisible = false">取 消</el-button>

        <el-button
          type="primary"
          @click="addIndicator(allDetail.supplementIndicators, quoteSelected)">
          确 定
        </el-button>

      </span>

    </el-dialog>

    <i-personnel-select
      v-if="personSelectShow"
      :isShow.sync="personSelectShow"
      :multiple="multipleFlag"
      @confirm="handleConfirm">
    </i-personnel-select>
  </div>
</template>

<script>
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import QuoteTable from 'components/performance/quote-table'
import { evaluationTypeDict, evaluationMethodDict, unitDict } from '@/config/dict'
import Focus from '@/directives/focus'
export default {
  name: 'KpiTable',

  components: {
    iPersonnelSelect,
    QuoteTable
  },

  directives: { Focus },

  filters: {
    unitFormat (val) {
      if (!val) {
        return '元'
      }
      let flag = -1
      for (let i of unitDict) {
        if (i.value === val) {
          flag = i
          break
        }
      }
      if (flag === -1) {
        return '元'
      } else {
        return flag.label
      }
    },

    evaluationTypeFormat (val) {
      switch (val) {
        case '1':
          return '评估打分'
        case '2':
          return '收集数据'
        default:
          return '请设置'
      }
    },

    evaluationMethodFormat (val) {
      switch (val) {
        case '1':
          return '选择评估方法'
        case '2':
          return '输入评估方法'
        default:
          return '请设置'
      }
    },

    totalTip (val) {
      return `指标权重总数为：${val}`
    },

    remainTip (val) {
      return `剩余可输入权重：${val}`
    },

    emptyFormat (val) {
      if (!val) {
        return '请设置'
      }
      return val
    }
  },

  props: {
    allDetail: {
      type: Object,
      required: true
    },

    canOperate: {
      type: Boolean,
      default: true
    }
  },

  data () {
    const checkWeight = (rule, val, cb) => {
      !val
        ? cb(new Error('请填写权重'))
        : !Number.isInteger(val)
          ? cb(new Error('权重需为整数'))
          : val <= 0
            ? cb(new Error('权重需大于0'))
            : this.indicatorWeightRemain < 0
              ? cb(new Error('超过剩余权重'))
              : cb()
    }
    const checkTarget = (rule, val, cb) => {
      !val
        ? cb(new Error('请填写该值'))
        : !Number.isInteger(val)
          ? cb(new Error('该值需为整数'))
          : val <= 0
            ? cb(new Error('该值需大于0'))
            : cb()
    }
    const checkText = (rule, val, cb) => {
      !val
        ? cb(new Error('请填写该文本框'))
        : /^\s+$/.test(val)
          ? cb(new Error('不能为纯空格'))
          : val.length < 1 || val.length > 255
           ? cb(new Error('字符长度为 1 ~ 255'))
           : this.duplicateNameFlag
            ? cb(new Error('名称不能重复'))
            : cb()
    }
    const weightValidator = (rule, val, cb) => {
      if (!Number.isInteger(val)) cb(new Error('请输入整数数字'))
      let indexReg = /\d(?=\]){1}/
      let strReg = /\D+(?=\[){1}/
      let currentStr = strReg.exec(rule.field)[0]
      let index = Number(indexReg.exec(rule.field)[0])
      let weight = 0
      for (let i of this.allDetail[currentStr][index].evaluationLeaders) {
        weight += i.weight
      }
      if (weight > 100) cb(new Error('评估总权重不能大于100'))
      // let weight
      // for (let i of this.allDetail[current])
    }
    return {
      thName: ['指标名称', '指标权重', '评估类型', '评估方法', '目标值', '数据收集员', '评估人', '操作'],
      dicts: [
        evaluationTypeDict,
        evaluationMethodDict,
        unitDict
      ],
      tipShow: false,
      quoteTableVisible: false,
      quoteSelected: [],
      personSelectShow: false,
      multipleFlag: false,
      wannaChangeObj: null,
      indicatorNameRule: [{
        validator: checkText,
        trigger: ['blur', 'change']
      }],
      indicatorWeightRule: [{
        validator: checkWeight,
        trigger: ['blur', 'change']
      }],
      indicatorTargetRule: [{
        validator: checkTarget,
        trigger: ['blur', 'change']
      }],
      weightRules: {validator: weightValidator, trigger: 'change'},
      indicatorNames: []
    }
  },

  computed: {
    indicatorWeightRemain () {
      return this.allDetail.indicatorWeight -
        this.calculateInputed(
          this.allDetail.fixedIndicators,
          this.allDetail.supplementIndicators)
    },

    duplicateNameFlag () {
      let fixedArr = []
      let supplyArr = []
      for (let i of this.allDetail.fixedIndicators) {
        if (i.updateType !== '3') {
          fixedArr.push(i.indicatorName)
        }
      }
      for (let s of this.allDetail.supplementIndicators) {
        if (s.updateType !== '3') {
          supplyArr.push(s.indicatorName)
        }
      }
      let allIndicators = fixedArr.concat(supplyArr)
      let fixedDuplicateIndex = allIndicators.findIndex((val, idx, arr) => {
        arr.splice(idx, 1)
        return arr.includes(val) && val !== ''// && val !== '' 是解决多次新增值都为空的情况
      })
      if (fixedDuplicateIndex !== -1) {
        return true
      }
      return false
    }
  },

  methods: {
    toggleShow (obj, type, flag) {
      if (this.canOperate) {
        if (type === 'weightShow') {
          if (obj[type] && (!obj.weight ||
            !(Number.isInteger(obj.weight) &&
            obj.weight > 0) ||
            this.indicatorWeightRemain < 0)) {
            return
          }
        } else if (type === 'targetShow') {
          if (obj[type] && (!obj.target ||
            !(Number.isInteger(obj.target) &&
            obj.target > 0))) {
            return
          }
        } else if (type === 'indicatorNameShow') {
          console.log('sss', obj, type, flag)
          if (obj[type] &&
            (!obj.indicatorName ||
            obj.indicatorName.length <= 0 ||
            obj.indicatorName.length > 255) ||
            this.duplicateNameFlag) {
            return
          }
        }
        this.$set(obj, type, flag)
      }
    },

    toggleSelectShow (obj, type) {
      if (this.canOperate) {
        this.personSelectShow = true
        switch (type) {
          case 'collect':
            this.multipleFlag = false
            this.wannaChangeObj = {
              'obj': obj,
              'id': 'collectorId',
              'name': 'collectorName',
              'multi': false
            }
            break
          case 'collectManage':
            this.multipleFlag = false
            this.wannaChangeObj = {
              'obj': obj,
              'id': 'collectManagerId',
              'name': 'collectManagerName',
              'multi': false
            }
            break
          case 'evaluation':
            this.multipleFlag = true
            this.wannaChangeObj = {
              'obj': obj,
              'id': 'leaderId',
              'name': 'leaderName',
              'multi': true
            }
            break
          default:
            return null
        }
      }
    },

    calculateInputed (...objArr) {
      let inputed = 0
      for (let i = 0; i < objArr.length; i++) {
        if (objArr[i]) {
          for (let x of objArr[i]) {
            if (x.updateType !== '3' &&
              Number.isInteger(x.weight) &&
              x.weight > 0) {
              inputed += parseInt(x.weight)
            }
          }
        }
      }
      return inputed
    },

    deleteLine (arr, index) {
      this.$confirm('确定删除指标吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        arr[index]['updateType'] = '3'
      }).catch((err) => {
        console.log(err)
      })
    },

    addIndicator (arr, selected) {
      let nameArr = []
      for (let i of this.allDetail.supplementIndicators) {
        if (i.updateType !== '3') {
          nameArr.push(i.indicatorName)
        }
      }
      for (let f of this.allDetail.fixedIndicators) {
        if (f.updateType !== '3') {
          nameArr.push(f.indicatorName)
        }
      }
      if (selected) {
        if (selected instanceof Array) {
          for (let s of selected) {
            if (nameArr.includes(s.name)) {
              this.$message.warning('已经有该绩效指标名称')
              return
            }
          }
        } else {
          if (nameArr.includes(selected.name)) {
            this.$message.warning('已经有该绩效指标名称')
            return
          }
        }
        if (selected instanceof Array) {
          for (let i of selected) {
            arr.push({
              'updateType': '1',
              'indicatorId': '',
              'indicatorName': i.name,
              'weight': 0,
              'evaluationType': i.evaluationType,
              'evaluationMethod': i.evaluationMethod,
              'target': 0,
              'unit': '1',
              'collectorId': '',
              'collectManagerId': '',
              'evaluationStandardId': '',
              'evaluationLeaders': [
                {
                  'leaderName': '',
                  'leaderId': '',
                  'weight': 0
                }
              ]
            })
          }
        } else {
          arr.push({
            'updateType': '1',
            'indicatorId': '',
            'indicatorName': selected.name,
            'weight': 0,
            'evaluationType': selected.evaluationType,
            'evaluationMethod': selected.evaluationMethod,
            'target': 0,
            'unit': '1',
            'collectorId': '',
            'collectManagerId': '',
            'evaluationStandardId': '',
            'evaluationLeaders': [
              {
                'leaderName': '',
                'leaderId': '',
                'weight': 0
              }
            ]
          })
        }
      } else {
        arr.push({
          'updateType': '1',
          'indicatorId': '',
          'indicatorName': '',
          'weight': 0,
          'evaluationType': '1',
          'evaluationMethod': this.allDetail.evaluationMethod,
          'target': 0,
          'unit': '1',
          'collectorId': '',
          'collectManagerId': '',
          'evaluationStandardId': '',
          'evaluationLeaders': [
            {
              'leaderName': '',
              'leaderId': '',
              'weight': 0
            }
          ]
        })
      }
      this.quoteTableVisible = false
    },

    handleConfirm (selected) {
      if (!this.wannaChangeObj['multi']) {
        if (selected.length === 1) {
          this.wannaChangeObj['obj'][this.wannaChangeObj['id']] = selected[0]['employeeId']
          this.wannaChangeObj['obj'][this.wannaChangeObj['name']] = selected[0]['employeeName']
        } else {
          this.$message.warning('该项人员选择只能单选且不能为空')
          return
        }
      } else {
        if (selected.length >= 1) {
          this.wannaChangeObj['obj'].splice(0)
          for (let i of selected) {
            this.wannaChangeObj['obj'].push({
              'leaderId': i.employeeId,
              'leaderName': i.employeeName,
              'weight': 0
            })
          }
        } else {
          this.$message.warning('人员选择不能为空')
        }
      }
    },

    updateSelected (val) {
      this.quoteSelected = val
    },

    updateSelectedOnce (val) {
      this.addIndicator(this.allDetail.supplementIndicators, val)
    },

    clearSelectBeforeClose () {
      this.$refs.quote.$refs['quote-table'].clearSelection()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./style-table.scss";
</style>
