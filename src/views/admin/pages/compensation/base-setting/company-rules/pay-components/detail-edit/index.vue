<template>
  <i-layout class="pay-components-detail" v-loading="loading" :element-loading-text="$loadingText" padding="0">
    <section padding="0" slot="section">
      <header class="header">{{title}}</header>
      <base-info :form="form" :isDateDisabled="isDateDisabled"></base-info>
      <pay-item :form="form"></pay-item>
      <salary-sheet :form="form"></salary-sheet>
      <footer class="footer">
        <el-button type="primary" @click="submit" :loading="submitLoading">提交</el-button>
        <el-button class="mr20" type="plain" @click="back">返回</el-button>
      </footer>
    </section>
  </i-layout>
</template>
<script>
  import { NewEditor } from './new-editor'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  import BaseInfo from '../base-info'
  import PayItem from '../pay-item'
  import SalarySheet from '../salary-sheet'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const noop = () => {}
  export default {
    mixins: [EditorMixin],
    name: 'PayComponentDetail',
    components: {
      BaseInfo,
      PayItem,
      SalarySheet
    },
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      title: String,
      componentListId: String
    },
    data: function () {
      return {
        submitLoading: false,
        loading: true,
        // form表单实例集合
        validates: [],
        instance: null,
        form: {
          componentListName: '',
          componentListType: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00'),
          payComponentListItemList: [{
            isShow: false,
            componentName: '',
            displayName: '',
            sortNo: 1,
            formulaInfoDto: {value: [], label: []}
          }],
          deleteListItemId: [],
          payPayslipList: [{
            sortNo: 1,
            isShow: false,
            payslipName: '',
            isDefalut: 'Y',
            effectiveDate: '',
            uneffectiveDate: '',
            payslipItemInfoDtos: [
              {
                payslipItemType: '',
                itemTypeSortNo: 1,
                payPayslipItemCategoryInfoDtos: [],
                deletePayslipItemId: []
              }
            ],
            deletePayslipItemTypeDto: []
          }],
          deletePayslipId: []
        },
        componentNameRules: getRule('请输入薪资项目名称', 'change'),
        displayNameRules: getRule('请输入显示名称')
      }
    },
    methods: {
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

      // 获取全部校验的form表单实例
      getValidates (node) {
        let childSub = true

        node.map(ele => {
          ele.$options._componentTag === 'el-form' && this.validates.push(ele)
          ;(ele.$children.length !== 0) && (childSub = this.getValidates(ele.$children) && childSub)
        })

        return this.validates
      },

      /* 校验通过检查 */
      handleValidate (callback = noop) {
        const validates = this.getValidates(this.$children)

        if (validates.length === 0 && callback) {
          return callback(true)
        }

        let count = 0
        let pass = true

        validates.map((ele, index) => {
          ele.validate(res => {
            if (!res) {
              pass = false
            }

            if (++count === validates.length) {
              callback(pass)
            }
          })
        })
      },

      /** 提交 */
      submit () {
        this.handleValidate(res => {
          this.validates = []

          if (res) {
            this.submitLoading = true
            this.instance.save().then(res => {
              if (res) {
                this.back()
              }
              this.submitLoading = false
            }).catch(() => {
              this.submitLoading = false
            })
          } else {
            this.$message({message: '输入信息有误或未填写完整，请检查', type: 'warning'})
          }
        })
      },

      /** 返回 */
      back () {
        this.$router.back()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../../../../../styles/vars";
  .pay-components-detail {
    background: white;
    position: relative;
  }
  .header {
    padding-left: 20px;
    line-height: 40px;
    background: #fafafa;
    font-size: 18px;
    font-weight: bold;
  }

  .footer {
    position: fixed;
    right: 20px;
    bottom: 20px;
    line-height: 50px;
    text-align: right;
  }
</style>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
  .pay-components-detail {
    .el-form-item {
      margin: 0;
    }
    .el-form-item__content {
      position: static;
    }
    .el-form-item__error {
      position: static;
      padding: 0;
      font-size: 12px;
      margin-bottom: 2px;
    }
    .el-select {
      width: 100%;
    }
    .el-form {
      margin-bottom: 0;
    }
  }
</style>
