<!--
  01 普通输入框  input
  02 字典下拉框  dict
  03 普通下拉框  select
  04 时间选择器  date
  05 组织选择器  org
  06 人员选择器  per
  07 职位选择器  job
-->

<template>
  <div class="i-search-editor">
    <el-form :model="form" :rules="rules">
      <el-form-item prop="val">
        <i-select
          v-if="editor.type === 'dict' || display.dict"
          v-model="form.val"
          :placeholder="placeholder"
          @change="handleChange"
          :parameter="display.dict"
          :multiple="multiple"
          :disabled="disabled">
        </i-select>

        <i-select
          v-else-if="editor.type === 'select'"
          v-model="form.val"
          :placeholder="placeholder"
          @change="handleChange"
          :options="editor.options"
          :multiple="multiple"
          :disabled="disabled">
        </i-select>

        <el-date-picker
          v-else-if="editor.type === 'date' || display.hasOwnProperty('date')"
          v-model="form.val"
          :placeholder="placeholder"
          @change="handleChange"
          :disabled="disabled">
        </el-date-picker>

        <i-select-tree
          v-else-if="editor.type === 'org'"
          v-model="form.val"
          :placeholder="placeholder"
          :lazy="true"
          :multiple="multiple"
          dataKey="org"
          nodeKey="orgUnitId"
          @change="handleChange"
          :hasGrant="false"
          :props="{
            children: 'children',
            label: 'orgUnitName'
          }"
          :disabled="disabled">
        </i-select-tree>

        <el-input
          v-else-if="editor.type ==='per'"
          v-model="perVal"
          :placeholder="placeholder"
          @focus="perVisiable = true">
        </el-input>

        <el-input
          v-else-if="editor.type ==='job'"
          v-model="jobVal"
          :placeholder="placeholder"
          @focus="jobVisiable = true">
        </el-input>

        <el-input
          v-else
          v-model="form.val"
          :placeholder="placeholder"
          @change="handleChange"
          :disabled="disabled">
        </el-input>
      </el-form-item>
    </el-form>

    <i-personnel-select
      v-if="editor.type ==='per'"
      ref="perRef"
      :isShow.sync="perVisiable"
      :multiple="multiple"
      treeDataKey="org"
      :defaultSelectedPersonnel="[{ empolyeeId: form.val }]"
      @confirm="handlePerConfirm">
    </i-personnel-select>

    <position-selection
      ref="jobRef"
      v-model="jobVisiable"
      type="mini"
    ></position-selection>

  </div>
</template>

<script>
import PositionSelection from 'components/position/position-selection'

export default {
  components: {
    PositionSelection
  },
  props: {
    editor: {
      type: Object,
      required: true
    },
    display: {
      type: Object,
      default: {}
    },
    value: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      perVal: '', // 用于显示人员姓名的中间值
      jobVal: '', // 用于显示职位名称的中间值
      jobId: '', // 用于保存职位id
      perVisiable: false, // 控制人员选择器是否显示
      jobVisiable: false, // 控制职位选择器是否显示
      form: {
        val: this.value // 存储值
      },
      rules: {
        val: [
          { required: true, message: '不得为空', trigger: 'change' },
          { required: true, message: '不得为空', trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    // 监听类型的变化，从而手动初始化人员选择器
    'editor.type' () {
      this.initPer()
    },

    value (val) {
      this.form.val = val
    }
  },

  mounted () {
    this.initPer()
    this.initJob()
  },

  methods: {
    initPer () {
      // 若类型为 per 则执行
      if (this.$refs.perRef && this.editor.type === 'per') {
        this._assignPerVal(this.$refs.perRef.rightItems)
      }
    },

    initJob () {
      // 若类型为 job 则执行

    },

    handleChange (val) {
      // 通过判断是否为 org/job/per 来返回不同的数据给父级
      this.$emit('input',
        ['org', 'job', 'per'].includes(this.editor.type)
          ? this.form.val
          : val
      )
    },

    // 执行人员选择器的时候触发
    handlePerConfirm (selected) {
      this._assignPerVal(selected)
      this.handleChange()
    },

    _assignPerVal (selected) {
      this.perVal = selected.map(item => item.employeeName).join(',')
      this.form.val = selected.map(item => item.employeeId).join(',')
    }
  }
}
</script>

<style lang="scss" scoped>
.i-search-editor {
  font-size: 13px;
  display: inline-block;
  margin-right: 10px;
  > * {
    width: 100px;
  }
}
</style>
