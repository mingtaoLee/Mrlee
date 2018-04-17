<template>
  <table border="1" class="table" v-if="allDetail">
    <tr>
      <th v-for="name in thName" :key="name">{{ name }}</th>
    </tr>
    <tr v-if="allDetail.events">
      <th :colspan="colNum" class="fix-bar" v-if="allDetail.isEventPermission === 'Y'">
        <el-button class="fr" size="mini" @click="newLine" >新建</el-button>
      </th>
    </tr>
    <tbody v-if="allDetail.events">
      <tr v-for="(obj, index) in allDetail.events" :key="index">
        <!-- <td style="width: 400px;">
          <div>{{ obj.evnet }}</div>
        </td> -->
        <td>
          <div>
            <!-- <div
              class="editable"
              v-if="obj.targetShow"
              @click="toggleShow(obj, 'target')">
              {{ obj.event }}
            </div> -->
            <div>
              <el-form-item
                :prop="`events[${index}].event`"
                :rules="allDetail.isEventPermission !== 'Y' ? null : rules.eventRule">
                  <el-input
                    v-model="obj.event"
                    :controls="false"
                    type="textarea"
                    @keyup.enter.native="toggleShow(obj, 'target')"
                    v-focus
                    :disabled="allDetail.isEventPermission !== 'Y'">
                  </el-input>
              </el-form-item>
            </div>
          </div>
        </td>
        <td  v-if="allDetail.processStatus !== '06'">
          <div>
            <div
              class="editable"
              @click="toggleShow(obj, 'evaluationMethod')"
              v-if="obj.evaluationMethodShow && obj.operationType !== null">
                {{obj.operationType | methodType}}{{ obj.score }}
            </div>
            <div v-else class="input-edit-table margin-auto">
              <el-form-item
                :prop="`events[${index}].operationType`"
                :rules="allDetail.isEventPermission !== 'Y' ? null : rules.evaluationMethodRule">
                <el-select
                  v-model="obj.operationType"
                  class="select"
                  :disabled="allDetail.isEventPermission !== 'Y'">
                  <el-option
                    v-for="item in evaluationMethodDict"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :prop="`events[${index}].score`"
                :rules="allDetail.isEventPermission !== 'Y' ? null : rules.scoreRule">
                  <el-input
                    :disabled="allDetail.isEventPermission !== 'Y'"
                    type="number"
                    class="inputWidth"
                    v-model.number="obj.score"
                    :controls="false"
                    @keyup.enter.native="toggleShow(obj, 'evaluationMethod')"
                    size="mini"
                    :max="1000"
                    :min="0">
                  </el-input>
              </el-form-item>
            </div>
          </div>
        </td>
        <td v-if="allDetail.processStatus !== '06'">
           <div
              class="editable"
              v-if="obj.weightShow && obj.description !== null"
              @click="toggleShow(obj, 'weight')">
              {{ obj.description | nullFormat }}
            </div>
            <div v-else>
              <el-form-item
                :prop="`events[${index}].description`"
                :rules="allDetail.isEventPermission !== 'Y' ? null : rules.descRule">
                  <el-input
                    :disabled="allDetail.isEventPermission !== 'Y'"
                    v-model="obj.description"
                    :controls="false"
                    type="textarea"
                    @keyup.enter.native="toggleShow(obj, 'weight')"
                    v-focus>
                  </el-input>
              </el-form-item>
            </div>
        </td>
        <td
          v-if="allDetail.processStatus === '06' ||
            allDetail.processStatus === '07'"
          style="width: 5%">
          <el-button
            type="text"
            @click="deleteEvent(index)"
            :disabled="allDetail.isEventPermission === 'N'">
            删除
          </el-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
// import { evaluationMethodDict } from '@/config/dict'
import {compare} from 'utils/performance'
import {clone} from 'utils/index'
export default {
  name: 'key-work-table',
  props: ['allDetail', 'lock'],
  data () {
    var nameValidater = (rule, val, cb) => {
      let index = Number(/\[(\w)\]/.exec(rule.field)[1]) // 获取rule中的Index信息
      let events = clone(this.allDetail.events) // 复制一个除了当前项的数组用来做检查
      events.splice(index, 1)
      compare(events, val, 'event') ? cb(new Error()) : cb()
    }

    return {
      evaluationMethodDict: [{
        label: '加',
        value: '1'
      },
      {
        label: '减',
        value: '2'
      }],
      workWeightTotal: 0,
      workWeightRemain: 0,
      rules: {
        weightRule: [
          {required: true, message: '请输入事件名称', trigger: 'blur'}
        ],
        evaluationMethodRule: {
          required: true, message: '请选择评估方法', trigger: 'blur'
        },
        scoreRule: {
          required: true, message: '请打分,小于1000', trigger: 'change', type: 'number', max: 1000
        },
        eventRule: [
          {required: true, message: '请填写描述', trigger: 'blur'},
          {max: 150, message: '长度不超过150', trigger: 'change'},
          {validator: nameValidater, message: '关键事件重复', trigger: 'change'}
        ],
        descRule: [
          {required: true, message: '请填写描述', trigger: 'blur'},
          {max: 150, message: '长度不超过150', trigger: 'change'}
        ]

      }
    }
  },
  methods: {
    getData () {
      if (this.allDetail) {
        this.allDetail.events = this.mapTableData(this.allDetail.events)
        this.workWeightTotal = this.allDetail.keyworkWeight
        this.workWeightRemain = this.workWeightTotal
      }
    },
    mapTableData (arr) {
      if (arr) {
        for (let item of arr) {
          let show
          item.operationType === null ? show = false : show = true
          let weight
          item.description === null ? weight = false : weight = true
          this.$set(item, 'weightShow', weight)
          this.$set(item, 'evaluationMethodShow', show)
          this.$set(item, 'targetShow', true)
          this.$set(item, 'scoreShow', true)
        }
        return arr
      }
      return []
    },
    deleteEvent (index) {
      this.$msgbox('确认删除此关键事件吗', '提示').then(() => {
        this.allDetail.events.splice(index, 1)
      }).catch(() => {})
    },
    newLine () {
      this.allDetail.events.push({
        eventId: null,
        event: null,
        operationType: null,
        score: null,
        description: null
      })
    },
    toggleShow (obj, type) {
      if (this.lock || this.allDetail.isEventPermission === 'N') return
      switch (type) {
        case 'weight':
          this.$set(obj, 'weightShow', !obj.weightShow)
          this.workWeightRemain =
            obj.weightShow
            ? this.workWeightTotal - this.workWeightInputed
            : this.workWeightRemain
          break
        case 'evaluationMethod':
          this.$set(obj, 'evaluationMethodShow', !obj.evaluationMethodShow)
          break
        case 'target':
          this.$set(obj, 'targetShow', !obj.targetShow)
          break
        default:
          break
      }
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
          return ''
      }
    },
    totalTip (val) {
      return `工作权重总数为：${val}`
    },
    remainTip (val) {
      return `剩余可输入权重：${val}`
    },
    methodType (val) {
      if (val === null) return '请设置'
      let dict = {
        1: '加',
        2: '减'
      }
      return dict[val]
    },
    nullFormat (val) {
      if (val === null) return '请输入'
      return val
    }
  },
  directives: {
    focus: {
      inserted (el) {
        if (el.classList.contains('el-input-number')) {
          el.getElementsByTagName('input')[0].focus()
        }
      }
    }
  },
  computed: {
    workWeightInputed () {
      if (this.allDetail.events) {
        let weightInputed = 0
        for (let obj of this.allDetail.events) {
          weightInputed += obj.weight
        }
        return weightInputed
      } else {
        return 0
      }
    },
    thName () {
      if (this.allDetail.processStatus === '06') {
        return ['事件', '操作']
      } else if (this.allDetail.processStatus === '07') {
        return ['事件', '决策', '决策说明', '操作']
      } else {
        return ['事件', '决策', '决策说明']
      }
    },
    colNum () {
      if (this.allDetail.processStatus === '06') {
        return 2
      } else if (this.allDetail.processStatus === '07') {
        return 4
      } else {
        return 3
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  border: 1px solid #DFE6EC;
  th {
    background: #EEF1F6;
  }

  td {
    box-sizing: border-box;
    text-align: center;
    .content-rowspan {
      div {
        padding-left: 13px;
        line-height: 46px;
        border-bottom: 1px solid #DFE6EC;
        &:last-child {
          border-bottom: 0;
        }
      }
    }
    .editable {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    .selectWidth {
      width: 120px;
      margin: 0 auto;
    }
    .labelWidth {
      width: 100px;
      margin: 0 auto;
    }
    .inputWidth {
      width: 150px;
      margin: 0 auto;
    }
    div {
      text-align: center;
    }
  }
  .fix-bar {
    background: #F2F2F2;
  }
  .tip {
    display: block;
    position: absolute;
    transform: translateY(-70px);
    left: 10%;
    font-size: 10px;
    color: #3da5fe;
    font-weight: normal;
  }
}
.input-edit-table {
  width: 350px;
  display: flex;
  justify-content: space-around;
}
.select {
  width: 150px;
  display: inline-block;
}
</style>
