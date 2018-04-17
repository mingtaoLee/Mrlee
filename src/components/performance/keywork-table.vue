<template>
  <div>
    <span
      class="blue mt-10"
      style="display: block"
      v-if="canOperate">
      <span>{{ allDetail.keyworkWeight | totalTip}}% &nbsp;&nbsp;&nbsp;</span>
      <span
        :class="{'red': this.workWeightRemain < 0}">
        {{ workWeightRemain | remainTip }}%
      </span>
    </span>
    <table border="1" class="table__original">
      <tr>
        <th v-for="name in thName" :key="name">{{ name }}</th>
      </tr>
      <tr v-if="canOperate">
        <th colspan="6" class="fix-bar">
          <el-button
            class="fr"
            size="mini"
            @click="addIndicator(allDetail.keyWork)">
            新建
          </el-button>
        </th>
      </tr>
      <tbody>
        <tr
          v-for="(obj, index) in allDetail.keyWork"
          :key="index"
          v-if="obj['updateType'] !== '3'">

  <!-- 重点工作项目 -->

          <td class="width__350">
            <span
              :class="[{'editable':canOperate}]"
              v-if="!obj.nameShow"
              @click.stop="toggleShow(obj, 'nameShow', true)">
              {{ obj.keyWorkName | emptyFormat }}
            </span>
            <el-form-item
              v-else
              :prop="`keyWork[${index}].keyWorkName`"
              :rules="keyWorkNameRule">
              <el-input
                v-focus
                v-model="obj.keyWorkName"
                :autosize="{ minRows: 2}"
                type="textarea"
                @focusout.native="toggleShow(obj, 'nameShow', false)">
              </el-input>
            </el-form-item>
          </td>

  <!-- 达成目标 -->

          <td class="width__350">
            <span
              :class="[{'editable':canOperate}]"
              v-if="!obj.targetShow"
              @click.stop="toggleShow(obj, 'targetShow', true)">
                {{ obj.target | emptyFormat }}
            </span>
            <el-form-item
              v-else
              :prop="`keyWork[${index}].target`"
              :rules="keyWorkNameRule">
              <el-input
                v-focus
                v-model="obj.target"
                type="textarea"
                :autosize="{ minRows: 2}"
                @focusout.native="toggleShow(obj, 'targetShow', false)">
              </el-input>
            </el-form-item>
          </td>

  <!-- 权重 -->

          <td class="width__100">
            <span
              :class="[{'editable':canOperate}]"
              @click.stop="toggleShow(obj, 'weightShow', true)"
              v-if="!obj.weightShow">
                {{ obj.weight | emptyFormat }}%
            </span>
            <el-form-item
              v-else
              :prop="`keyWork[${index}].weight`"
              :rules="keyWorkWeightRule">
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

  <!-- 评估方法 -->

          <td class="width__150">
            <span>
              {{ obj.evaluationMethod | evaluationMethodFormat }}
            </span>
          </td>

  <!-- 评估人 -->

          <td class="width__150">
            <div
              v-for="(leaderInfo, index) in obj.evaluationLeaders"
              :key="index">
              <span
                :class="[{'editable':canOperate}]"
                @click.stop="toggleSelectShow(obj.evaluationLeaders, 'evaluation')">
                {{ leaderInfo.leaderName | emptyFormat }}
              </span>
              <span
                :class="[{'editable':canOperate}]"
                @click.stop="toggleShow(leaderInfo, 'leaderWeightShow', true)"
                v-if="!leaderInfo.leaderWeightShow">
                ({{ leaderInfo.weight | emptyFormat }}%)
              </span>
              <span v-else>
                <el-input
                  v-focus
                  v-model.number="leaderInfo.weight"
                  :min="0"
                  type="number"
                  @focusout.native="toggleShow(leaderInfo, 'leaderWeightShow', false)"
                  @keyup.native.enter="toggleShow(leaderInfo, 'leaderWeightShow', false)"
                  size="mini">
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
              @click="deleteLine(allDetail.keyWork, index)">
              删除
            </el-button>
          </td>
        </tr>
      </tbody>
    </table>
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
import Focus from '@/directives/focus'
export default {
  name: 'KeyworkTable',

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

  directives: { Focus },

  components: { iPersonnelSelect },

  data () {
    const checkWorkWeight = (rule, val, cb) => {
      !val
        ? cb(new Error('请填写权重'))
        : !Number.isInteger(val)
          ? cb(new Error('权重需为整数'))
          : val <= 0
            ? cb(new Error('权重需大于0'))
            : this.workWeightRemain < 0
              ? cb(new Error('超过剩余权重'))
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
    return {
      thName: ['重点工作项目', '达成目标', '权重', '评估方法', '评估人', '操作'],
      personSelectShow: false,
      multipleFlag: false,
      wannaChangeObj: null,
      keyWorkNameRule: [{
        validator: checkText,
        trigger: ['blur', 'change']
      }],
      keyWorkWeightRule: [{
        required: true,
        validator: checkWorkWeight,
        trigger: ['blur', 'change']
      }]
    }
  },

  computed: {
    workWeightRemain () {
      return this.allDetail.keyworkWeight -
        this.calculateInputed(this.allDetail.keyWork)
    },

    duplicateNameFlag () {
      let keyworkArr = []
      for (let i of this.allDetail.keyWork) {
        if (i.updateType !== '3') {
          keyworkArr.push(i.keyWorkName)
        }
      }
      let keyworkDuplicateIndex = keyworkArr.findIndex((val, idx, arr) => {
        arr.splice(idx, 1)
        return arr.includes(val) && val !== ''
      })
      if (keyworkDuplicateIndex !== -1) {
        return true
      }
      return false
    }
  },

  filters: {
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
      return `工作权重总数为：${val}`
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

  methods: {
    toggleShow (obj, type, flag) {
      if (this.canOperate) {
        switch (type) {
          case 'weightShow':
            if (obj[type] && (!obj.weight ||
              !(Number.isInteger(obj.weight) && obj.weight > 0) ||
              this.workWeightRemain < 0)) {
              return
            }
            this.$set(obj, type, flag)
            break
          case 'nameShow':
            if (obj[type] &&
              (!obj.keyWorkName ||
              obj.keyWorkName.length <= 0 ||
              obj.keyWorkName.length > 255) ||
              this.duplicateNameFlag) {
              return
            }
            this.$set(obj, type, flag)
            break
          case 'targetShow':
            if (obj[type] &&
              (!obj.target ||
              obj.target.length <= 0 ||
              obj.target.length > 255)) {
              return
            }
            this.$set(obj, type, flag)
            break
          default:
            this.$set(obj, type, flag)
            break
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
      this.$confirm('确定删除该重点工作项目吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        arr[index]['updateType'] = '3'
      }).catch((err) => {
        console.log(err)
      })
    },

    addIndicator (arr) {
      arr.push({
        'keyWorkId': '',
        'keyWorkName': '',
        'updateType': '1',
        'target': '',
        'weight': 0,
        'evaluationMethod': this.allDetail.evaluationMethod,
        'evaluationStandardId': '',
        'evaluationLeaders': [
          {
            'leaderName': '',
            'leaderId': '',
            'weight': 0
          }
        ]
      })
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

    handleConfirm (selected) {
      console.log(selected)
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./style-table.scss";
</style>
