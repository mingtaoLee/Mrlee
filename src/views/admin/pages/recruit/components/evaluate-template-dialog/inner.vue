<template>
<!-- HACK: 为了不报removeChild错误先添加appendToBody="false" -->
  <i-dialog
    size="standard"
    title="新增评估项"
    :toolbar="toolbar"
    :modal="false"
    v-model="showMe"
    @close="handleClose"
    :appendToBody="false">
    <i-layout>

      <i-form
        slot="header"
        @reset="reset"
        @search="search">
        <el-form-item label="评估类型">
          <el-select
            v-model="type"
            placeholder="请选择评估类型">
            <el-option
              v-for="typeItem in types"
              :key="typeItem.value"
              :value="typeItem.value"
              :label="typeItem.label">
            </el-option>
          </el-select>
        </el-form-item>
      </i-form>

      <i-table
        ref="table"
        slot="section"
        :table="table">
        <template
          slot="table"
          slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            :stripe="$$.table.stripe"
            :border="$$.table.border"
            @selection-change="selectionChangeHandler"
            v-loading="loading"
            :element-loading-text="$loadingText">
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              label="评估类型"
              prop="optionType"
              :formatter="optionTypeFormat">
            </el-table-column>
            <el-table-column
              label="评估项"
              prop="description">
            </el-table-column>
          </el-table>
        </template>
      </i-table>

    </i-layout>
  </i-dialog>
</template>

<script>
import req from 'api/recruit/evaluate-list'
import IForm from 'components/common/i-form/i-form.vue'
import ILayout from 'components/common/i-layout'
import { getDict } from 'utils'

export default {
  name: 'EvaluateListTemplateInnerDialog',

  components: {
    IForm,
    ILayout
  },

  props: {
    // 显示标志位
    showMe: {
      type: Boolean,
      default: false,
      required: true
    },
    hasSelectedId: {
      type: Array,
      default: [],
      required: true
    }
  },

  data () {
    return {
      loading: false,
      // i-dialog
      toolbar: [{
        text: '取消',
        type: 'default',
        func: (done) => {
          done()
        }
      }, {
        text: '确定',
        type: 'primary',
        func: (done) => {
          this.handleConfirm()
          done()
        }
      }],
      // i-table
      table: {
        data: null
      },
      // this
      type: '',
      types: [],
      selected: []
    }
  },

  created () {
    getDict('EVALUATION_OPTION_TYPE').then(res => {
      this.types = res
    })
    this.getData()
  },

  methods: {
    // 多选选中值
    selectionChangeHandler (row) {
      this.selected = row
    },

    // 评估项字典的重置
    reset () {
      this.type = ''
    },

    // 查询评估项
    search (val) {
      this.getData()
    },

    // 获取所有启用的评估项的列表信息
    getData () {
      this.loading = true
      req('getEvaluationOptionsEnabled', {optionType: this.type})
        .then(res => {
          let realres = res.filter((val) => {
            if (this.hasSelectedId.length) {
              return !(this.hasSelectedId.includes(val.evaluationOptionId))
            } else {
              return true
            }
          })
          this.table.data = realres
          this.loading = false
        })
    },

    // 列表字典后台传回来显示处理
    optionTypeFormat (row) {
      for (let i of this.types) {
        if (i.value === row.optionType) {
          return i.label
        }
      }
      return ''
    },

    handleConfirm () {
      this.$emit('selection-confirm', this.selected)
    },

    // 控制弹窗标识
    handleClose () {
      this.showMe = false
      this.$emit('update:showMe', false)
    }
  }
}
</script>
