<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="140px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="薪资项目" prop="componentId">
          <el-input v-model="form.componentName" placeholder="请选择" :disabled="isDisabled" @click.native="openComponentOptions">
            <i slot="suffix" class="el-input__icon el-icon-news"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="凭证类型" prop="voucherType">
          <i-select v-model="form.voucherType" parameter="VOUCHER_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="借方记账编码" prop="debitPostingKey">
          <i-select v-model="form.debitPostingKey" parameter="POSTING_KEY" :hideKeys="['50']"></i-select>
        </el-form-item>
        <el-form-item label="借方科目编码" prop="debitAccountCode">
          <i-select v-model="form.debitAccountCode" :props="debitProps" parameter="ACCOUNT_TITLE"></i-select>
        </el-form-item>
        <el-form-item label="借方科目名称">
          <i-select v-model="form.debitAccountCode" disabled parameter="ACCOUNT_TITLE"></i-select>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="项目属性" prop="componentAttribute">
          <i-select v-model="form.componentAttribute" disabled parameter="COMPONENT_ATTRIBUTE"></i-select>
        </el-form-item>
        <el-form-item label="是否反记账" prop="isNegativePosting">
          <el-switch
            v-model="form.isNegativePosting"
            active-text="是"
            inactive-text="否"
            active-value="Y"
            inactive-value="N"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="贷方记账编码" prop="creditPostingKey">
          <i-select v-model="form.creditPostingKey" parameter="POSTING_KEY" :hideKeys="['40']"></i-select>
        </el-form-item>
        <el-form-item label="贷方科目编码" prop="creditAccountCode">
          <i-select v-model="form.creditAccountCode" :props="creditProps" parameter="ACCOUNT_TITLE"></i-select>
        </el-form-item>
        <el-form-item label="贷方科目名称">
          <i-select v-model="form.creditAccountCode" disabled parameter="ACCOUNT_TITLE"></i-select>
        </el-form-item>
      </li>
    </ul>
    <el-form-item label="备注" prop="remark">
      <el-input type="textarea" v-model="form.remark"></el-input>
    </el-form-item>
    <i-dialog
      v-model="isShowItemList"
      title="薪资项目选择"
      :toolbar="dialogToolbar"
    >
      <item-selection
        class="item-selection"
        ref="selection"
        :multiple="false"
        :load="loadPayItem"
        selectedTitle="已选列表"
        listTitle="待选列表"
      >
      </item-selection>
    </i-dialog>
  </el-form>
</template>
<script>
  import ItemSelection from 'components/compensation/item-selection'
  import req from 'api/compensation'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { NewEditor } from './new-editor'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    componentId: getRule('请选择薪资项目', 'change'),
    voucherType: getRule('请选择凭证类型', 'change'),
    debitPostingKey: getRule('请选择借方借记编码', 'change'),
    debitAccountCode: getRule('请选择借方科目编码', 'change'),
    creditPostingKey: getRule('请选择贷方记账编码', 'change'),
    creditAccountCode: getRule('请选择贷方科目编码', 'change'),
    isNegativePosting: getRule('是否记反张', 'change'),
    remark: { min: 0, max: 200, message: '只能输入200个字', trigger: 'change' }
  }
  export default {
    mixins: [EditorMixin],
    components: {
      ItemSelection
    },
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      areaId: String,
      componentFinanceId: String
    },
    computed: {
    },
    data: function () {
      return {
        isShowItemList: false,
        componentName: '',
        debitProps: {
          value: 'value',
          label: 'value'
        },
        creditProps: {
          value: 'value',
          label: 'value'
        },
        instance: null,
        form: {
          componentId: '',
          voucherType: '',
          debitPostingKey: '40',
          debitAccountCode: '',
          componentAttribute: '',
          isNegativePosting: 'Y',
          creditPostingKey: '50',
          compPayBaseLower: '',
          compPayRatio: '',
          remark: ''
        },
        dialogToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              done()
            }
          },
          {
            text: '确认',
            func: done => {
              this.handleConfirm(done)
            }
          }
        ],
        areaProps: {
        },
        rules: RULES
      }
    },
    mounted () {
    },
    methods: {
      /** 载入工资条薪资项数据 */
      loadPayItem (resolve) {
        req('getComponentNameList').then(res => {
          res && resolve(res)
        })
      },

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.getInstance(this.editorStatus, opts)
      },

      /** 获取对应实例 */
      getInstance (editorStatus, opts) {
        switch (editorStatus) {
          case '1':
            return new BaseEditor(opts)
          case '2':
            return new NewEditor(opts)
          default:
            return new Modifier(opts)
        }
      },

      /** 打开薪资项目选择器 */
      openComponentOptions () {
        if (this.isDisabled) return
        this.isShowItemList = true
      },

      handleConfirm (done) {
        // 获取已选薪资项
        const selected = this.$refs.selection.writeBack()
        this.form.componentName = selected.componentName
        this.form.componentId = selected.componentId
        this.form.componentAttribute = selected.componentAttribute
        // 重置已选列表
//        this.$refs.selection.reset()
        done()
      }
    }
  }
</script>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
    .el-switch {
      height: 23px;
    }
  }
</style>
