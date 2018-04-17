<template>
  <div class="item-setting">
    <el-row class="mb10" :gutter="40">
      <div class="item-setting-content">
        <el-col :span="16">
          <sort-item class="ml20" :data="data"></sort-item>
        </el-col>
        <el-col :span="8">
          <preview class="mr20" :data="data"></preview>
        </el-col>
      </div>
    </el-row>
    <i-dialog
      v-model="isShowDialog"
      title="添加薪资项目"
      width="800px"
      :toolbar="detailEditToolbar"
      destroyedWhenClose
    >
      <salary-edit ref="detailEdit" :salaryItem="salaryItem"></salary-edit>
    </i-dialog>
  </div>
</template>
<script>
  import Preview from './preview'
  import SortItem from './sort-item'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import IControlLayout from 'components/common/i-control-layout/i-control-layout'
  import SalaryEdit from './salary-detail'
  export default {
    name: '',
    components: {
      IControlLayout,
      IDialog,
      SalaryEdit,
      SortItem,
      Preview
    },
    props: {
      isShow: Boolean,
      data: Array,
      label: {
        type: String,
        default: '薪资项目'
      },
      prop: String,
      rules: [Array, Object]
    },
    data: function () {
      return {
        status: 'edit',
        isShowDialog: false,
        detailEditToolbar: [
          {
            text: '取消',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确认',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        toolbar: [{
          text: '修改',
          func: this.modify
        }, {
          text: '删除',
          func: this.delete
        }]
      }
    },
    created () {
    },
    methods: {
      modify (item) {
        this.status = 'edit'
        this.editItem(item)
      },
      delete () {},
      editItem (item) {
        this.status = 'add'
        this.salaryItem = item || {
          payslipItemType: '分红',
          itemTypeSortNo: 1,
          payPayslipItemCategoryInfoDtos: [
            {
              componentName: '',
              isDisplay: 'Y',
              itemSortNo: 1
            }
          ]
        }
        this.isShowDialog = true
      },
      handleCancel (done) {
        done()
      },
      handleSave (done) {}
    }
  }
</script>
<style lang="scss" scoped>
  .item {
    height: 40px;
    margin-right: 20px;
    line-height: 40px;
    border: 1px solid #e5e5e5;
  }
  .item-setting {
    padding-bottom: 20px;
    background: #F8F8F8;
  }
</style>
