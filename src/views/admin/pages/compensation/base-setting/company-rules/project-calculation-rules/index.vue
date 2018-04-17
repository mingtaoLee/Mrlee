<template>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="cpsPayCalculateRulesGet">
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="规则名称">
        <el-input v-model="searchParam.calculateRuleName"></el-input>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="searchParam.componentName"></el-input>
      </el-form-item>
      <el-form-item label="适用组织">
        <el-input v-model="searchParam.orgUnitName"></el-input>
      </el-form-item>
      <el-form-item label="适用职务">
        <el-input v-model="searchParam.posTitleName"></el-input>
      </el-form-item>
      <el-form-item label="适用人员">
        <el-input v-model="searchParam.fullName"></el-input>
      </el-form-item>
      <!--<el-form-item label="适用范围">-->
        <!--<el-input v-model="searchParam.employeeRangeList"></el-input>-->
        <!--<ISelect v-model="searchParam.employeeRangeList" parameter="dict"></ISelect>-->
      <!--</el-form-item>-->
      <el-form-item label="生效开始日期">
        <el-date-picker
          v-model="searchParam.effectiveDate"
          value-format="yyyy-MM-dd"
          type="date">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="失效结束日期">
        <el-date-picker
          v-model="searchParam.uneffectiveDate"
          value-format="yyyy-MM-dd"
          type="date"
          >
        </el-date-picker>
      </el-form-item>
    </i-form>
    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            border
          >
          <el-table-column type="selection" width="55" fixed="left">
          </el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :formatter="tableScope.formatter"
            >
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                >
                </i-table-cell>
              </template>
            </el-table-column>
            <el-table-column
              label="计算规则"
              width="160"
              align="right"
            >
              <template slot-scope="scope">
                {{scope.row.calculateRuleInfoDto ? scope.row.calculateRuleInfoDto.label : ''}}
              </template>
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <!--<i-dialog-->
        <!--v-model="isShowDialog"-->
        <!--:title="title"-->
        <!--mode="popup"-->
        <!--:toolbar="detailEditToolbar"-->
        <!--destroyedWhenClose-->
      <!--&gt;-->
        <!--<RulesSetting-->
          <!--:data="currentRowData"-->
          <!--ref="RulesSetting"-->
          <!--:previewMode="!!currentRowData.calculateRuleId"-->
          <!--@selectComponentName="selectComponentName"-->
          <!--@setRange="setRange"-->
          <!--@setRules="setRules"></RulesSetting>-->
      <!--</i-dialog>-->
      <i-dialog
        v-model="isShowRangeDialog"
        title="设置适用范围"
        :toolbar="rangeEditToolbar"
        destroyedWhenClose
        @close="handleAllOptionsClose"
      >
        <PopRange
          :formInfo.sync="currentRowData"
          @getRangeFilterData="getRangeFilterData">
        </PopRange>
      </i-dialog>
      <i-dialog
        v-model="isShowRulesDialog"
        title="设置计算规则"
        :toolbar="rulesEditToolbar"
        size="large"
        destroyedWhenClose
        @close="handleAllOptionsClose"
      >
        <PopRules
          :data="currentRowData"
          ref="PopRules"
          @getFormulaData="getFormulaData">
        </PopRules>
      </i-dialog>
      <i-dialog
        v-model="isShowRulesPublishDialog"
        title="规则下发到人"
        :toolbar="rulesPublishEditToolbar"
        destroyedWhenClose
      >
        <RulesPublish></RulesPublish>
      </i-dialog>
      <i-dialog
        v-model="isShowItemList"
        title="薪资项目选择"
        :toolbar="dialogToolbar"
        :before-close="handleClose"
        @close="handleAllOptionsClose"
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
      <i-dialog-popup
        v-model="isShowDialog"
        :title="title"
        :toolbar="detailEditToolbar"
        append-to=".i-layout"
      >
        <RulesSetting
          :data="currentRowData"
          ref="RulesSetting"
          :previewMode="!!currentRowData.calculateRuleId"
          @selectComponentName="selectComponentName"
          @setRange="setRange"
          @setRules="setRules"></RulesSetting>
      </i-dialog-popup>
    </template>
  </i-layout>
</template>

<script>
  import req from 'api/compensation/base-setting/company-rules'
  import reqCompensationIndex from 'api/compensation'
  import RulesSetting from './rules-setting'
  //  import IDialogPopup from 'components/common/i-dialog-popup'
  import RulesPublish from './rules-publish'
  import PopRules from './pop-set-rules'
  import PopRange from './pop-set-range'
  import ItemSelection from 'components/compensation/item-selection'
  import { showMessage, confirmPopover } from 'utils/index'
  import { formatDate } from 'utils/organization'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
      RulesSetting,
      PopRules,
      RulesPublish,
      PopRange,
//      IDialogPopup,
      ItemSelection
    },
    data () {
      return {
        searchParam: {
          orgUnitName: null,
          posTitleName: null,
          fullName: null,
          calculateRuleName: null,
          componentName: null,
          effectiveDate: null,
          uneffectiveDate: null
          // calculateRuleInfoDto: null
        },
        isShowItemList: false,
        dialogToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.isShowDialog = true
              this.$refs.selection.reset()
              this.$refs.selection.init()
              // var selected = this.$refs.selection.writeBack()
              // if (selected !== this.currentRowData.componentName) {
              //   this.$refs.selection.selected = this.currentRowData.componentName
              //   console.log(this.$refs.selection.selected)
              // }
              done()
            }
          },
          {
            text: '确认',
            func: done => {
              const selected = this.$refs.selection.writeBack()
              this.currentRowData.componentName = selected.componentName
              this.currentRowData.componentId = selected.componentId
              // 重置已选列表
              this.$refs.selection.reset()
              this.$refs.selection.init()
              this.isShowDialog = true
              done()
            }
          }
        ],
        loading: true,
        tplSettingLoading: true,
        detailEditToolbar: [
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
              this.$refs['RulesSetting'].$refs['bank-tpl-modify']
                .validate((res) => {
                  if (res) {
                    this.$refs['RulesSetting'].$refs['IFormula'].validateFormula()
                      .then(result => {
                        if (result.status === 1) {
                          if (this.currentRowData.calculateRuleId) {
//                            this.changeEffect()
//                            this.changeUneffect()
                            this.modifyProjRules(this.currentRowData).then(() => {
                              done()
                            })
                          } else {
                            this.addProjRules(this.currentRowData).then(() => {
                              done()
                            })
                          }
                        } else {
                          this.$message.error(result.message)
                        }
                      })
                  }
                })
            }
          }
        ],
        isShowDialog: false,
        isShowTplSettingDialog: false,
        tplSettingDetailEditToolbar: [
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
              this.$refs['BankTplFormatModify'].$refs['bank-tpl-modify'].validate((res) => {
                if (res) {
                  this.saveTplSettingDetail(done)
                }
              })
              // this.saveTplSettingDetail(done)
            }
          }
        ],

        isShowRangeDialog: false,
        rangeEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.isShowDialog = true
              this.isShowRangeDialog = false
              this.handleCancel(done)
            }
          },
          {
            text: '确认',
            func: done => {
              this.isShowDialog = true
              this.isShowRangeDialog = false
              this.currentRowData.employeeRangeList = this.rangeData.value.map(v => {
                let filterMap = {}
                if (v.posTitleId) {
                  filterMap['posTitleId'] = v.posTitleId
                  filterMap['positionName'] = v.positionName
                } else if (v.orgUnitId) {
                  filterMap['orgUnitId'] = v.orgUnitId
                  filterMap['orgUnitName'] = v.orgUnitName
                }
                return filterMap
              })
              this.currentRowData.employeeRange = this.rangeData.text
              console.log('saving', this.rangeData, this.currentRowData.employeeRangeList)
            }
          }
        ],
        isShowRulesDialog: false,
        rulesEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.isShowDialog = true
              this.isShowRulesDialog = false
              this.handleCancel(done)
            }
          },
          {
            text: '确认',
            func: done => {
              this.$refs['PopRules'].$refs['IFormula'].validateFormula().then(res => {
                if (res) {
                  this.isShowDialog = true
                  this.isShowRulesDialog = false
                  this.currentRowData.calculateRuleInfoDto = this.rulesData
                  console.log('currentRowData', this.currentRowData)
                }
              })
            }
          }
        ],
        isShowRulesPublishDialog: false,
        rulesPublishEditToolbar: [
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
              this.publishProjRules().then((res) => {
                if (res) {
                  done()
                }
              })
            }
          }
        ],
        // 表格
        table: {
          columns: [
            { prop: 'calculateRuleName', label: '规则名称', width: '180', align: 'left' },
            { prop: 'effectiveDate', label: '生效日期', align: 'center', width: '120', display: {date: ''} },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'center', width: '120', display: {date: ''} },
            { prop: 'componentName', label: '项目名称', width: '180', align: 'left' },
//            { prop: 'componentType', label: '适用类型', width: '160', align: 'center' },
            { prop: 'employeeRange', label: '适用范围', width: '200', align: 'left' },
//            { prop: 'calculateRuleInfoDto', label: '计算规则', width: '160', align: 'center' },
            { prop: 'ruleRemark', label: '规则描述', width: '200', align: 'left' }
          ],
          setting: {
            operator: [
//              {
//                text: '复制',
//                func: this.copyRow
//              },
              {
                key: 'cpsPayCalculateRulesUpdate',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsPayCalculateRulesDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              key: 'cpsPayCalculateRulesCreate',
              text: '增加计算规则',
              func: this.addList
            }, {
              key: 'cpsPayCalculateRulesPublish',
              text: '规则下发到人',
              func: this.publish
            }, {
              key: 'cpsPayCalculateRulesBtn',
              text: '员工计算规则查询',
              func: this.checkEmployeeRules
            }]
          },
          data: [],
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        },
        selectedList: [],

        form: {
          bankTemplateId: null,
          bankTemplateName: '',
          bankName: '',
          areaCode: '',
          effectiveDate: '',
          uneffectiveDate: '',
          columnSeperator: '',
          rowSeperator: '',
          userColumnSeperator: '',
          userRowSeperator: '',
          zeroInclude: '',
          remark: ''
        },
        currentRowData: {
          componentId: '',
          componentName: '',
          componentType: '',
          calculateRuleName: '',
          effectiveDate: '',
          uneffectiveDate: '',
          employeeRangeList: [],
          employeeRangeListInfo: {
            fullNameList: [],
            employeeIdList: [],
            orgUnitIdList: '',
            posTitleIdList: []
          },
          calculateRuleInfoDto: {
            label: '',
            value: []
          },
          ruleRemark: ''
        },
        rangeData: {
          label: '',
          value: []
        },
        rulesData: {
          label: [],
          value: []
        }
      }
    },
    methods: {
      handleAllOptionsClose () {
        !this.isShowDialog && (this.isShowDialog = true)
      },
      changeEffect () {
        this.currentRowData.effectiveDate = formatDate(this.currentRowData.effectiveDate).slice(0, 10)
      },
      changeUneffect () {
        this.currentRowData.uneffectiveDate = formatDate(this.currentRowData.uneffectiveDate).slice(0, 10)
      },
      selectComponentName () {
        if (this.$refs.selection) {
          this.$refs.selection.checkedItem(this.currentRowData)
        }
        this.isShowItemList = true
//        this.isShowDialog = false
      },
      handleClose (done) {
        this.isShowItemList = false
        this.isShowDialog = true
        this.$refs.selection.reset()
        this.$refs.selection.init()
        done()
      },
      /** 载入工资条薪资项数据 */
      loadPayItem (resolve) {
        reqCompensationIndex('getComponentNameList').then(res => {
          res && resolve(res)
        })
      },
      getFormulaData (data) {
        this.rulesData = data
      },
      getRangeFilterData (data) {
        this.rangeData = data
      },
      setRules () {
//        this.isShowDialog = false
        this.isShowRulesDialog = true
      },
      setRange () {
//        this.isShowDialog = false
        this.isShowRangeDialog = true
      },
      // 编辑表单列表信息
      modifyProjRules (params) {
        const { employeeRangeListInfo, calculateRuleInfoDto, calculateRuleId, calculateRuleName, componentId, componentType, employeeRangeList, ruleRemark, effectiveDate, uneffectiveDate } = params
        return req('modifyProjRules', {
          employeeRangeListInfo: Object.assign({}, employeeRangeListInfo, {
            orgUnitIdList: employeeRangeListInfo.orgUnitIdList.split(',')
          }),
          calculateRuleInfoDto,
          calculateRuleId,
          calculateRuleName,
          componentId,
          componentType,
          employeeRangeList,
          ruleRemark,
          effectiveDate: formatDate(effectiveDate).slice(0, 10),
          uneffectiveDate: formatDate(uneffectiveDate).slice(0, 10)
        }).then(res => {
          console.log('modifyProjRules?', res)
          if (res) {
            showMessage('success', '修改成功！')
            this.fetch(this.allParam)
          } else {
            showMessage('danger', '修改失败！')
          }
        })
      },
      // 创建表单列表信息
      addProjRules (params) {
        const { employeeRangeListInfo, calculateRuleInfoDto, calculateRuleName, componentId, componentType, employeeRangeList, ruleRemark, effectiveDate, uneffectiveDate } = params
        return req('addProjRules', {
          employeeRangeListInfo: Object.assign({}, employeeRangeListInfo, {
            orgUnitIdList: employeeRangeListInfo.orgUnitIdList.split(',')
          }),
          calculateRuleInfoDto,
          calculateRuleName,
          componentId,
          componentType,
          employeeRangeList,
          ruleRemark,
          effectiveDate: formatDate(effectiveDate).slice(0, 10),
          uneffectiveDate: formatDate(uneffectiveDate).slice(0, 10)
        }).then(res => {
          if (res) {
            showMessage('success', '添加成功！')
            this.reset()
            this.fetch({ pageSize: this.pageInfo.pageSize, pageIndex: 1 })
          } else {
            showMessage('danger', '添加失败！')
          }
        })
      },
      // 修改模板详情信息
      modifyBankTplContent (params) {
        return req('modifyBankTplContent', params).then(res => {
          if (res) {
            showMessage('success', '修改成功！')
            return res
          } else {
            showMessage('danger', '修改失败！')
          }
        })
      },
      // 获取模板表单信息
      fetch (params) {
        req('getProjRules', params).then(res => {
          if (res) {
            Object.assign(this.table, res)
            this.loaded()
          }
        })
      },
//      rowClickHandler ({ rowClickHandler }, row) {
//        rowClickHandler(row)
//      },
//      selectionChangeHandler ({ selectionChangeHandler }, selection) {
//        selectionChangeHandler(selection)
//        this.selectedList = selection
//      },
      // 添加行数据
      addList () {
        this.title = '项目计算规则新增'
        this.currentRowData = Object.assign(this.currentRowData, {
          calculateRuleId: null,
          componentId: '',
          componentName: '',
          componentType: '',
          effectiveDate: '',
          calculateRuleName: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00'),
          employeeRangeList: [],
          employeeRangeListInfo: {
            fullNameList: [],
            employeeIdList: [],
            orgUnitIdList: '',
            posTitleIdList: []
          },
          calculateRuleInfoDto: {
            label: '',
            value: []
          },
          ruleRemark: ''
        })
        this.isShowDialog = true
      },
      copyRow (scope) {
        console.log(scope)
      },
      // 修改行数据
      modifyRow (scope) {
        this.title = '项目计算规则修改'
//        this.currentRowData = Object.assign({}, scope.row)
        this.currentRowData = JSON.parse(JSON.stringify(scope.row))
        // orgUnitId 数组转换成字符串
        let orgUnitIdList = this.currentRowData.employeeRangeListInfo.orgUnitIdList
        if (orgUnitIdList && Array.isArray(orgUnitIdList)) {
          this.currentRowData.employeeRangeListInfo.orgUnitIdList = orgUnitIdList.join(',')
        }
        this.isShowDialog = true
      },
      // 删除行数据
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('deleteProjRules', {
            calculateRuleId: scope.row.calculateRuleId
          }).then(res => {
            if (res) {
              this.fetch(this.allParam)
              showMessage('success', '删除成功！')
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      publishProjRules (list) {
        let calculateRuleIdList = list.map(v => v.calculateRuleId)
        return req('publishProjRules', { calculateRuleIdList }).then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            showMessage('success', '操作成功！')
            return res
          } else {
            showMessage('danger', '操作失败！')
          }
        })
      },
      publish (vm) {
        let selectedList = vm.getMultipleSelection()
        if (selectedList.length === 0) {
          return showMessage('info', '请至少选择一个！')
        }
        this.$confirm('是否为适用范围内的人员设置新的计算规则(原有计算规则将会被更新)?', '规则下发到人', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
//          this.isShowRulesPublishDialog = true
          this.publishProjRules(selectedList)
        }).catch(() => {})
      },
      checkEmployeeRules () {
        this.$router.push({
          path: '/compensation/base-setting/company-rules/employees-calculation-rules'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
