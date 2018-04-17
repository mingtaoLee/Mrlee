<template>
  <div class="content-follow zzf-pay-components">
    <header class="info-title">工资条设置</header>
    <div class="info-content">
      <i-control-layout :toolbar="toolbar" justifyContent="flex-start">
        <el-form class="mt20" :model="form.payPayslipList" size="mini">
          <template v-for="(item,index) of form.payPayslipList">
            <el-row class="row">
              <el-col :span="6">
                <el-form-item labelWidth="100px" label="工资条名称" :prop="`${index}.payslipName`" :rules="payslipNameRules">
                  <el-input v-model="item.payslipName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item labelWidth="100px" label="是否默认">
                  <!--<i-select v-model="item.isDefault" parameter="WHETHER_TYPE"></i-select>-->
                  <el-switch
                    size="mini"
                    v-model="item.isDefalut"
                    active-text="是"
                    inactive-text="否"
                    active-value="Y"
                    inactive-value="N"
                    active-color="#13ce66"
                    inactive-color="#ff4949">>
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item labelWidth="100px" label="工资条项目" required>
                  <!--<span class="mr10">已设置</span>-->
                  <el-button type="text" icon="el-icon-arrow-down"  :class="{'icon-rotate': item.isShow}" @click="setSalarySheet(item)">{{item.isShow ? '收起' : '设置'}}</el-button>
                  <!--<el-button type="text" @click="setSalarySheet(item)"><i class="el-icon-edit el-icon&#45;&#45;left"></i>设置</el-button>-->
                </el-form-item>
              </el-col>
              <el-col :span="6" class="ar">
                <el-button
                  class="btn"
                  v-for="(btn, idx) of operator"
                  :key="idx"
                  type="text"
                  @click="btn.func(index)">
                  {{ btn.text }}
                </el-button>
              </el-col>
            </el-row>
            <el-collapse-transition>
              <item-setting v-show="item.isShow" :data="item"></item-setting>
            </el-collapse-transition>
          </template>
        </el-form>
      </i-control-layout>
    </div>
  </div>
</template>
<script>
  import { showMessage, confirmPopover } from 'utils/index'
  import IControlLayout from 'components/common/i-control-layout/i-control-layout'
  import ISelect from 'components/common/i-select/i-select'
  import ItemSetting from './item-setting'
  export default {
    name: '',
    components: {
      IControlLayout,
      ISelect,
      ItemSetting
    },
    props: {
      form: Object
    },
    data: function () {
      return {
        payslipNameRules: [
          { required: true, message: '请输入工资条名称', trigger: 'change' },
          { min: 0, max: 20, message: '只能输入20个字', trigger: 'change' }
        ],
        formulaInfoDtoRules: [
          { required: true, message: '请设置计算规则', trigger: 'change' }
        ],
        defaultOptions: [{
          value: 'Y',
          label: '是'
        }, {
          value: 'N',
          label: '否'
        }],
        toolbar: [{
          text: '添加工资条',
          type: 'primary',
          func: this.pushRow
        }],
        operator: [
          {
            text: '删除',
            func: this.deleteRow
          }
        ]
      }
    },
    watch: {
      'form.payPayslipList': {
        handler (value) {
          if (value) this.transformPayPayslipList(value)
        }
      }
    },
    created () {
    },
    methods: {
      setSalarySheet (item) {
        item.isShow = !item.isShow
      },
      deleteRow (index) {
        if (this.form.payPayslipList.length === 1) {
          showMessage('warning', '已剩最后一项！')
        } else {
          confirmPopover('warning', '确认删除该项吗？', () => {
            const id = this.form.payPayslipList[index].payslipId
            // 存在工资条id，则推入删除的工资条id
            id && this.form.deletePayslipId.push(id)

            // 删除工资条
            this.form.payPayslipList.splice(index, 1)
          })
        }
      },
      /** 数据处理，添加工资条isShow属性 */
      transformPayPayslipList (value) {
        value.map((item, index) => {
          this.$set(item, 'isShow', false)
//          if (index === 0) {
//            this.$set(item, 'isShow', true)
//          } else {
//            this.$set(item, 'isShow', false)
//          }
        })
      },
      /** 新增工资条 */
      pushRow (index) {
        this.form.payPayslipList.push({
          sortNo: 1,
          isShow: false,
          payslipName: null,
          isDefalut: 'Y',
          payslipItemInfoDtos: [
            {
              payslipItemType: '',
              itemTypeSortNo: 1,
              payPayslipItemCategoryInfoDtos: [],
              deleteComponentId: []
            }
          ],
          deletePayslipItemId: []
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .content-follow {
    border-bottom: 0;
  }
  .row {
    border: 1px solid #c8c8c8;
    &:last-child {
      margin-bottom: 0;
    }
    margin-bottom: 10px;
  }
  .btn {
    &:last-child {
      margin-right: 20px;
    }
  }
</style>
<style lang="scss">
  .zzf-pay-components {
    .el-switch {
      height: 26px;
    }
    .el-icon-arrow-down {
      transition: 0.3s;
    }
    .icon-rotate {
      .el-icon-arrow-down {
        transform: rotate(180deg);
      }
    }
  }
</style>
