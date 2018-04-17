<template>
  <div class="content-follow zzf-pay-components">
    <header class="info-title">工资项分配</header>
    <div class="info-content">
      <i-control-layout :toolbar="toolbar" justifyContent="flex-start">
        <el-form ref="form" class="mt20" :model="form.payComponentListItemList" size="mini">
          <!--<draggable v-model="form.payComponentListItemList">-->
            <div v-for="(item, index) of form.payComponentListItemList" :key="index" class="pay-component-item">
              <el-row class="row" >
                <el-col :span="6">
                  <el-form-item labelWidth="100px" label="薪资项目" :prop="`${index}.componentName`" :rules="componentNameRules">
                    <el-input v-model="item.componentName" placeholder="请选择" readonly @click.native="openComponentOptionsDialog(item, index)">
                      <i slot="suffix" class="el-input__icon el-icon-news"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item labelWidth="100px" label="显示名称" :prop="`${index}.displayName`" :rules="displayRules">
                    <el-input v-model="item.displayName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :ref="`formula${index}`"  labelWidth="100px" label="计算公式" :prop="`${index}.formulaInfoDto.value.0`" :rules="formulaInfoDtoRules(index, item)">
                    <!--<span class="mr10">已设置</span>-->
                    <el-input v-show="false" v-model="item.formulaInfoDto.value[0]"></el-input>
                    <el-button type="text" icon="el-icon-arrow-down"  :class="{'icon-rotate': item.isShow}" @click="setFormula(item)">{{item.isShow ? '收起' : '设置'}}</el-button>
                    <!--<el-button type="text" @click.native.stop="setFormula(item)"><i class="el-icon-edit el-icon&#45;&#45;left"></i>设置</el-button>-->
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
              <template v-if="item.show">
                <el-collapse-transition>
                  <formula-calculator
                    :ref="`calculator${index}`"
                    class="formula-calculator"
                    v-show="item.isShow && item.show"
                    v-model="item.formulaInfoDto"
                    @handleBlur="validateFormula(index, item)"
                  ></formula-calculator>
                </el-collapse-transition>
              </template>
            </div>
          <!--</draggable>-->
        </el-form>
      </i-control-layout>
    </div>
    <i-dialog
      v-model="isShowItemList"
      title="薪资项目选择"
      :toolbar="dialogToolbar"
      :beforeClose="beforeClose"
    >
      <item-selection
        class="item-selection"
        :multiple="false"
        :props="itemProps"
        v-model="currentComponentId"
        ref="selection"
        :load="loadPayItem"
        selectedTitle="已选列表"
        listTitle="待选列表"
      ></item-selection>
    </i-dialog>
    <i-popup v-model="isShowPopup" appendTo=".pay-components-detail" title="薪资项目拖拽排序">
      <draggable v-model="form.payComponentListItemList" :options="dragOptions">
        <el-button
          class="mb10 ml10"
          v-for="(item, index) of form.payComponentListItemList"
          :key="item.componentName"
          size="small"
          type="plain"
        >
          {{index + 1 + '、' + item.componentName}}
        </el-button>
      </draggable>
    </i-popup>
  </div>
</template>
<script>
  import FormulaCalculator from 'components/compensation/formula-calculator/index.vue'
  import ItemSelection from 'components/compensation/item-selection'
  import req from 'api/compensation'
  import { showMessage, confirmPopover } from 'utils/index'
  import IControlLayout from 'components/common/i-control-layout/i-control-layout'
  import draggable from 'vuedraggable'
  import IPopup from 'components/common/i-dialog-popup/index.vue'
  export default {
    name: '',
    components: {
      ItemSelection,
      IControlLayout,
      FormulaCalculator,
      draggable,
      IPopup
    },
    props: {
      form: Object
    },
    data: function () {
      return {
        dragOptions: {
          ghostClass: 'pay-component-drop-btn',
          animation: 150
        },
        isShowPopup: false,
        currentComponentId: '',
        itemProps: {
          value: 'componentId',
          label: 'componentName'
        },
        displayRules: [
          { required: true, message: '请输入显示名称', trigger: 'change' },
          { min: 0, max: 30, message: '只能输入30个字', trigger: 'change' }
        ],
        componentNameRules: [
          { required: true, message: '请选择薪资项目', trigger: 'change' }
        ],
        currentIndex: 0,
        // 是否显示薪资项目选择框
        isShowItemList: false,
        toolbar: [
          {
            text: '添加工资项',
            type: 'primary',
            func: this.pushRow
          },
          {
            text: '排序',
            type: 'primary',
            func: this.order
          }
        ],
        dialogToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.resetCurComponentId()
              done()
            }
          },
          {
            text: '确认',
            func: done => {
              return this.handleConfirm(done)
            }
          }
        ],
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
    watch: {
      'form.payComponentListItemList': {
        handler (value) {
          if (value) this.transformPayComponentListItemList(value)
        }
      }
    },
    created () {
    },
    methods: {
      /** 排序 */
      order () {
        this.isShowPopup = true
        this.$nextTick(() => {
          document.querySelector('.el-main').scrollTop = 0
        })
      },
      /** 载入工资条薪资项数据 */
      loadPayItem (resolve) {
        req('getComponentNameList').then(res => {
          res && resolve(res)
        })
      },
      validateFormula (index) {
        this.$refs[`formula${index}`][0].isValid = false
        this.$refs[`formula${index}`][0].validate('blur')
      },
      formulaInfoDtoRules (index, item) {
        return [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('请设置计算规则'))
              }
              if (this.$refs[`formula${index}`][0].isValid === false) {
                this.$refs[`calculator${index}`][0].validateFormula().then(res => {
                  if (res) {
                    this.$refs[`formula${index}`][0].isValid = true
                    callback()
                  }
                }).catch(() => {
                  this.$refs[`formula${index}`][0].isValid = false
                  callback(new Error('公式校验不通过!'))
                })
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      openComponentOptionsDialog (item, index) {
        this.currentComponentId = item.componentId || ''
        this.currentIndex = index
        this.isShowItemList = true
      },
      handleConfirm (done) {
        const selected = this.$refs.selection.writeBack()
        if (this.judgeIsInclude(selected, this.form.payComponentListItemList)) {
          return showMessage('warning', '已包含该薪资项目，请重新选择！')
        } else {
          this.form.payComponentListItemList[this.currentIndex].componentName = selected.componentName
          this.form.payComponentListItemList[this.currentIndex].displayName = selected.componentName
          this.form.payComponentListItemList[this.currentIndex].componentId = selected.componentId
          // 重置已选列表
          this.$refs.selection.reset()
          this.resetCurComponentId()
          done()
        }
      },
      judgeIsInclude (selected, list) {
        const { value } = this.itemProps
        for (let item of list) {
          if (item[value] === selected[value] && item[value] !== this.currentComponentId) {
            return true
          }
        }
        return false
      },
      beforeClose (done) {
        this.resetCurComponentId()
        done()
      },
      // 重置当前选中选项
      resetCurComponentId () {
        this.currentComponentId = ''
      },
      setFormula (item) {
        item.show = true
        this.$nextTick(() => {
          item.isShow = !item.isShow
        })
      },
      deleteRow (index) {
        if (this.form.payComponentListItemList.length === 1) {
          showMessage('warning', '已剩最后一项！')
        } else {
          confirmPopover('warning', '确认删除该项吗？', () => {
            const id = this.form.payComponentListItemList[index].listItemId
            // 存在工资条id，则推入删除的工资条id
            id && this.form.deleteListItemId.push(id)
            // 删除工资项
            this.form.payComponentListItemList.splice(index, 1)

            showMessage('success', '删除成功！')
          })
        }
      },
      transformPayComponentListItemList (value) {
        value.map((item, index) => {
          this.$set(item, 'isShow', false)
          this.$set(item, 'show', false)
        })
      },
      pushRow () {
        this.form.payComponentListItemList.push({
          isShow: false,
          formulaInfoDto: {value: [], label: ''},
          componentName: null,
          displayName: null,
          sortNo: 1
        })
      },
      addRow (index) {
        this.form.payComponentListItemList.splice(index + 1, 0, {
          formulaInfoDto: {value: [], label: ''},
          show: false,
          isShow: false,
          componentName: null,
          displayName: null,
          sortNo: 1
        })
      },
      up (index) {
        if (index === 0) {
          showMessage('info', '已到最前！')
        } else {
          this.form.payComponentListItemList.splice(index - 1, 0, ...this.form.payComponentListItemList.splice(index, 1))
        }
      },

      down (index) {
        if (index === (this.form.payComponentListItemList.length - 1)) {
          showMessage('info', '已到最后一项！')
        } else {
          this.form.payComponentListItemList.splice(index + 1, 0, ...this.form.payComponentListItemList.splice(index, 1))
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  /*.pay-component-item {*/
    /*position: relative;*/
  /*}*/
  /*.formula-calculator {*/
    /*position: absolute;*/
    /*width: 100%;*/
    /*z-index: 200;*/
  /*}*/
  .row {
    border: 1px solid #e5e5e5;
    /*&:last-child {*/
      /*margin-bottom: 0;*/
    /*}*/
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
    .el-button {
      padding-top: 12px;
      padding-bottom: 12px;
    }
    .el-icon-arrow-down {
      transition: 0.3s;
    }
    .icon-rotate {
      .el-icon-arrow-down {
        transform: rotate(180deg);
      }
    }
    .pay-component-drop-btn {
      background: #00a2d4;
    }
  }
</style>
