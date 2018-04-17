<template>
  <el-form class="sort-item" :model="data" :rules="rules">
    <div class="title">
      <h3>分类</h3>
      <el-button class="sort-btn" type="text" icon="plus" @click="addSort">新增分类</el-button>
    </div>
    <template v-for="(sort, sortIndex) of data.payslipItemInfoDtos">
      <div class="content">
        <el-row class="mb10" :gutter="20">
          <el-col :span="7">
            <el-form-item :prop="`payslipItemInfoDtos[${sortIndex}].payslipItemType`" :rules="payslipItemTypeRules">
              <el-input v-model="sort.payslipItemType" placeholder="请输入分类名称" :rules="itemTypeRules"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="al" :span="7">
            <el-button type="text" @click="deleteSort(sortIndex)">删除</el-button>
          </el-col>
          <el-col class="ar" :span="10">
            <el-button type="text" icon="plus" @click="addPayItem(sortIndex, sort)">新增项目</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="7">
            <p class="item-title">薪资项目名称</p>
          </el-col>
          <el-col :span="7">
            <p class="item-title">薪资项目显示名称</p>
          </el-col>
          <el-col :span="5">
            <p class="item-title">是否显示</p>
          </el-col>
        </el-row>
        <draggable v-model="sort.payPayslipItemCategoryInfoDtos">
          <div v-for="(item, index) of sort.payPayslipItemCategoryInfoDtos" :key="index" class="salary-item">
            <el-row :gutter="20">
              <el-col :span="7">
                <el-form-item>
                  <p>{{item.componentName}}</p>
                </el-form-item>
              </el-col>
              <el-col :span="7" class="flex-space-between">
                <el-form-item :prop="`payslipItemInfoDtos[${sortIndex}].payPayslipItemCategoryInfoDtos[${index}].displayName`" :rules="displayNameRules">
                  <el-input placeholder="请输入显示名称" v-model="item.displayName"></el-input>
                </el-form-item>
                <el-button type="text" @click="resetDisplayName(item)">清空</el-button>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-switch
                    size="mini"
                    v-model="item.isDisplay"
                    active-text="是"
                    inactive-text="否"
                    active-value="Y"
                    inactive-value="N"
                    active-color="#13ce66"
                    inactive-color="#ff4949">>
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col class="ar" :span="6">
                <el-form-item>
                  <el-button
                    v-for="(btn, idx) in itemBtns"
                    :key="idx"
                    @click="btn.func(sortIndex, index)"
                    :type="btn.type || 'text'"
                    :disabled="btn.disabled"
                  >{{btn.text}}</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </draggable>
      </div>
    </template>
    <i-dialog
      v-model="isShowItemList"
      title="薪资项目选择"
      :toolbar="dialogToolbar"
    >
      <item-selection
        class="item-selection"
        :multiple="true"
        ref="selection"
        :props="itemProps"
        :load="loadPayItem"
        :filterIds="componentOptionsFilterIds"
        selectedTitle="已选列表"
        listTitle="待选列表"
      ></item-selection>
    </i-dialog>
  </el-form>
</template>
<script>
  import ItemSelection from 'components/compensation/item-selection'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import req from 'api/compensation'
  import { showMessage, confirmPopover } from 'utils/index'
  import ISelect from 'components/common/i-select/i-select'
  import draggable from 'vuedraggable'
  // import { getRule } from 'utils/index'

  export default {
    name: '',
    components: {
      ISelect,
      IDialog,
      ItemSelection,
      draggable
    },
    props: {
      data: Object
    },
    filters: {
      sortFilter (value) {
        return '你好'
      }
    },
    data: function () {
      return {
        payslipItemTypeRules: [
          { required: true, message: '请输入分类名称', trigger: 'change' },
          { min: 0, max: 20, message: '只能输入20个字', trigger: 'change' }
        ],
        displayNameRules: [
          { required: true, message: '请输入显示名称', trigger: 'change' },
          { min: 0, max: 20, message: '只能输入20个字', trigger: 'change' }
        ],
        itemProps: {
          value: 'componentId',
          label: 'componentName'
        },
        componentOptionsFilterIds: [],
        currentSortIndex: 0,
        isShowItemList: false,
        dialogToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确认',
            func: done => {
              this.handleConfirm(done)
            }
          }
        ],
        itemBtns: [
          {
            func: this.itemUp,
            text: '上移'
          },
          {
            func: this.itemDown,
            text: '下移'
          },
          {
            func: this.deleteItem,
            text: '删除'
          }
        ]
      }
    },
    created () {
    },
    methods: {
      /** 载入工资条薪资项数据 */
      loadPayItem (resolve) {
        req('getComponentNameList').then(res => {
          res && resolve(res)
        })
      },

      /** 添加类 */
      addSort () {
        this.data.payslipItemInfoDtos.push({
          payslipItemType: '',
          isNew: true,
          itemTypeSortNo: 1,
          isShow: true,
          payPayslipItemCategoryInfoDtos: [],
          deletePayslipItemId: []
        })
      },

      /** 删除类 */
      deleteSort (sortIndex) {
        if (this.data.payslipItemInfoDtos.length === 1) {
          showMessage('warning', '请至少保留一个明细类！')
          return
        }
        confirmPopover('warning', '确认删除该明细类吗？', () => {
          const payslipItemType = this.data.payslipItemInfoDtos[sortIndex].payslipItemType
          // 如果存在，推入删除的类id
          this.data.payslipItemInfoDtos[sortIndex].isNew || this.data.deletePayslipItemTypeDto.push({
            payslipItemType: payslipItemType,
            payslipId: this.data.payslipId
          })

          // 删除分类
          this.data.payslipItemInfoDtos.splice(sortIndex, 1)
          showMessage('info', '删除成功！')
        })
      },

      /** 删除工资项 */
      deleteItem (sortIndex, index) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          const id = this.data.payslipItemInfoDtos[sortIndex].payPayslipItemCategoryInfoDtos[index].payslipItemId
          // 如果项id存在，则推入删除项id
          id && this.data.payslipItemInfoDtos[sortIndex].deletePayslipItemId.push(id)

          // 删除项
          this.data.payslipItemInfoDtos[sortIndex].payPayslipItemCategoryInfoDtos.splice(index, 1)
          showMessage('info', '删除成功！')
        })
      },

      /** 上移工资项 */
      itemUp (sortIndex, index) {
        if (index === 0) {
          showMessage('info', '已到最前！')
        } else {
          this.data.payslipItemInfoDtos[sortIndex].payPayslipItemCategoryInfoDtos.splice(index - 1, 0, ...this.data.payslipItemInfoDtos[sortIndex].payPayslipItemCategoryInfoDtos.splice(index, 1))
        }
      },

      /** 下移工资项 */
      itemDown (sortIndex, index) {
        if (index === (this.data.payslipItemInfoDtos[sortIndex].payPayslipItemCategoryInfoDtos.length - 1)) {
          showMessage('info', '已到最后一项！')
        } else {
          this.data.payslipItemInfoDtos[sortIndex].payPayslipItemCategoryInfoDtos.splice(index + 1, 0, ...this.data.payslipItemInfoDtos[sortIndex].payPayslipItemCategoryInfoDtos.splice(index, 1))
        }
      },

      /** 添加工资项 */
      addPayItem (sortIndex, sort) {
        this.componentOptionsFilterIds = sort.payPayslipItemCategoryInfoDtos.map(item => {
          return item.componentName
        })
        this.currentSortIndex = sortIndex
        this.isShowItemList = true
      },

      handleCancel (done) {
        done()
      },

      /** 重置薪资项显示名称 */
      resetDisplayName (item) {
        item.displayName = ''
      },

      handleConfirm (done) {
        // 获取已选薪资项
        const selected = this.$refs.selection.writeBack().map(item => {
          this.$set(item, 'isDisplay', 'Y')
          item.itemSortNo = 1
          return item
        })

        // 合并薪资项
        this.data.payslipItemInfoDtos[this.currentSortIndex].payPayslipItemCategoryInfoDtos.splice(
          this.data.payslipItemInfoDtos[this.currentSortIndex].payPayslipItemCategoryInfoDtos.length,
          0,
          ...selected
        )
        // this.data.payslipItemInfoDtos[this.currentSortIndex].payPayslipItemCategoryInfoDtos = payPayslipItemCategoryInfoDtos
        // 重置已选列表
        this.$refs.selection.reset()
        done()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .salary-item {
    cursor: move;
  }
  .title {
    line-height: 50px;
    display: flex;
    justify-content: space-between;

    h3 {
      font-size: 14px;
      font-weight: 600;
    }
  }
  .item-title {
    line-height: 30px;
    font-size: 14px;
    font-weight: 600;
  }
  .content {
    padding: 20px 20px 10px;
    background: white;
  }
  .item-selection {
  }
  .sort-title {
  }
  .sort-item {
  }
</style>
