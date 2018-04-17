<template>
  <el-form :modal="salaryItem">
    <div class="content-follow">
      <div class="info-content">
        <header class="info-title">项目设置</header>
        <el-form-item prop="componentListName">
          <i-select v-model="salaryItem.payslipItemType" parameter="dict"></i-select>
        </el-form-item>
      </div>
    </div>
    <div class="content-follow">
      <div class="info-content">
        <header class="info-title">明细条目</header>
        <i-control-layout :toolbar="toolbar" justifyContent="flex-start">
          <template v-for="(item,index) of salaryItem.payPayslipItemCategoryInfoDtos">
            <el-form-item class="mt10" >
              <i-select class="mr20" v-model="item.componentName" parameter="dict"></i-select>
              <el-button
                v-for="(btn, idx) of operator"
                :key="idx"
                type="text"
                @click="btn.func(index)">
                {{ btn.text }}
              </el-button>
            </el-form-item>
          </template>
        </i-control-layout>
      </div>
    </div>
  </el-form>
</template>
<script>
  import { showMessage, confirmPopover } from 'utils/index'
  import ISelect from 'components/common/i-select/i-select'
  import IControlLayout from 'components/common/i-control-layout/i-control-layout'
  export default {
    name: '',
    components: {
      ISelect,
      IControlLayout
    },
    props: {
      salaryItem: {
        type: Object,
        default () {
          return {
            payslipItemType: '',
            itemTypeSortNo: null,
            payPayslipItemCategoryInfoDtos: [
              {
                componentName: '',
                isDisplay: 'Y',
                itemSortNo: null
              }
            ]
          }
        }
      }
    },
    data: function () {
      return {
        salaryItem: this.salaryItem,
        toolbar: [{
          text: '添加明细条目',
          type: 'primary',
          func: this.pushRow
        }],
        operator: [
          {
            text: '上移',
            func: this.up
          },
          {
            text: '下移',
            func: this.down
          },
          {
            text: '添加',
            func: this.addRow
          },
          {
            text: '删除',
            func: this.deleteRow
          }
        ]
      }
    },
    created () {
    },
    methods: {
      pushRow () {
        this.salaryItem.payPayslipItemCategoryInfoDtos.push({
          componentName: null,
          isDisplay: 'Y',
          sortNo: 0
        })
      },
      deleteRow (index) {
        if (this.salaryItem.payPayslipItemCategoryInfoDtos.length === 1) {
          showMessage('warning', '已剩最后一项！')
        } else {
          confirmPopover('warning', '确认删除该项吗？', () => {
            this.salaryItem.payPayslipItemCategoryInfoDtos.splice(index, 1)
          })
        }
      },
      addRow (index) {
        this.salaryItem.payPayslipItemCategoryInfoDtos.splice(index + 1, 0, {
          componentName: null,
          isDisplay: 'Y',
          sortNo: 0
        })
      },
      up (index) {
        if (index === 0) {
          showMessage('info', '已到最前！')
        } else {
          this.salaryItem.payPayslipItemCategoryInfoDtos.splice(index - 1, 0, ...this.salaryItem.payPayslipItemCategoryInfoDtos.splice(index, 1))
        }
      },
      down (index) {
        if (index === (this.salaryItem.payPayslipItemCategoryInfoDtos.length - 1)) {
          showMessage('info', '已到最后一项！')
        } else {
          this.salaryItem.payPayslipItemCategoryInfoDtos.splice(index + 1, 0, ...this.salaryItem.payPayslipItemCategoryInfoDtos.splice(index, 1))
        }
      }
    }
  }
</script>
<style lang="sass"></style>
