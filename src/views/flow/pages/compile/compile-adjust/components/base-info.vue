<template>
  <div class="maintain-detail content-follow">
    <h2 class="info-title">维护明细</h2>
    <div class="info-content">
      <el-form ref="maintainForm" :model="model" :rules="rules" label-width="100px">
        <el-form-item v-if="showMap.orgUnitId" label="选择组织：" prop="orgUnitId">
          <el-col :span="8">
            <i-select-tree
              v-model="model.orgUnitId"
              :lazy="true"
              :props="orgUnitProps"
              :selectedNode.sync="model.selectedOrgUnit"
              :disabled="disabledMap.orgUnitId"
              dataKey="org"
              nodeKey="orgUnitId"
              placeholder="请选择组织"
            ></i-select-tree>
          </el-col>
        </el-form-item>

        <el-row v-show="orgType === '03'">
          <el-col :span="8" class="store-hint-wrapper">
            <p class="store-hint">调整合并小店编制</p>
          </el-col>
        </el-row>

        <el-form-item v-if="showMap.posTitleId" label="选择职务：" prop="posTitleId">
          <el-col :span="8">
            <el-select
              v-model="model.posTitleId"
              :disabled="disabledMap.posTitleId"
              placeholder="请选择职务"
              clearable
              filterable
            >
              <el-option
                v-for="item in options"
                :key="item.posTitleId"
                :label="item.name"
                :value="item.posTitleId"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item v-if="showMap.effectiveDate" label="生效月份：" prop="effectiveDate">
          <el-col :span="8">
            <el-date-picker
              v-model="model.effectiveDate"
              :picker-options="effectiveDateOptions"
              :disabled="disabledMap.effectiveDate"
              type="month"
              value-format="yyyy-MM-dd"
              placeholder="请选择生效月份"
              ></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item v-if="showMap.uneffectiveDate" label="失效月份：">
          <el-col :span="8">
            <el-date-picker
              v-model="model.uneffectiveDate"
              :picker-options="uneffectiveDateOptions"
              :disabled="true"
              type="month"
              value-format="yyyy-MM-dd"
              placeholder="请选择失效月份"
              ></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item v-if="showMap.scaLowerLimit" label="编制下限：" prop="scaLowerLimit">
          <el-col :span="8">
            <el-input v-model="model.scaLowerLimit" :disabled="disabledMap.scaLowerLimit" type="number" min="0"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item v-if="showMap.scaUpperLimit" label="编制上限：" prop="scaUpperLimit">
          <el-col :span="8">
            <el-input v-model="model.scaUpperLimit" :disabled="disabledMap.scaUpperLimit" type="number" min="0"></el-input>
          </el-col>
        </el-form-item>

        <el-row v-if="showMap.orgUnitId && showMap.posTitleId">
          <el-col :span="8" class="hint-wrapper">
            <div class="location">
              <el-popover
                ref="popover1"
                placement="right"
                width="480"
                trigger="click"
                @show="getDutyRule"
              >
                <template v-if="dutyRule.data.length && !dutyRule.notData">
                  <i-table v-loading="dutyLoading" :element-loading-text="$loadingText" :table="dutyRule">
                    <template slot="table" slot-scope="tableScope">
                      <el-table :data="tableScope.clone">
                        <el-table-column
                          v-for="(col, idx) of dutyRule.columns"
                          :key="idx"
                          align="right"
                          :prop="col.prop"
                          :label="col.label"
                        ></el-table-column>
                      </el-table>
                    </template>
                  </i-table>
                </template>
                <div v-else-if="!model.orgUnitId && dutyRule.data.length <= 0 && !dutyRule.notData" class="hint-wrapper-duty-tip">
                  请选择组织
                </div>
                <div v-else-if="!model.posTitleId && model.orgUnitId && dutyRule.data.length <= 0 && !dutyRule.notData" class="hint-wrapper-duty-tip" >
                  请选择职务
                </div>
                <div v-else class="hint-wrapper-duty-tip">
                  无数据
                </div>
                <p class="hint" slot="reference"> 查看职务编制规则 </p>
              </el-popover>
            </div>
          </el-col>
        </el-row>

        <el-form-item v-if="showMap.remark" label="原因：">
          <el-col :span="9">
            <el-input
              v-model="model.remark"
              :disabled="disabledMap.remark"
              :rows="5"
              type="textarea"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  import req from 'api/compile/maintain/index'
  import moment from 'moment'
  import { clone } from 'utils'

  export default{
    name: 'BaseInfo',
    components: {
    },
    props: {
      model: {
        type: Object,
        default () {
          return {}
        }
      },
      orgType: {
        type: String
      },
      taskId: {
        type: String
      },
      loading: {
        type: Boolean
      }
    },
    data () {
      let validateScaLowerLimit = (rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error('请输入编制下限'))
        } else if (value.toString().indexOf('.') > -1) {
          callback(new Error('编制下限不允许输入小数'))
        } else if (value < 0) {
          callback(new Error('编制下限必须大于等于零'))
        } else {
          callback()
        }
      }
      let validateScaUpperLimit = (rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error('请输入编制上限'))
        } else if (value.toString().indexOf('.') > -1) {
          callback(new Error('编制上限不允许输入小数'))
        } else if (value < 0) {
          callback(new Error('编制上限必须大于等于零'))
        } else if (parseInt(value) < parseInt(this.model.scaLowerLimit)) {
          callback(new Error('编制上限不能小于编制下限'))
        } else {
          callback()
        }
      }
      return {
        rules: {
          orgUnitId: [
            {required: true, message: '请选择组织', trigger: 'change'}
          ],
          posTitleId: [
            {required: true, message: '请选择职务', trigger: 'change'}
          ],
          effectiveDate: [
            {required: true, message: '请选择生效月份', trigger: 'blur'}
          ],
          scaLowerLimit: [
            {required: true, validator: validateScaLowerLimit, trigger: 'blur'}
          ],
          scaUpperLimit: [
            {required: true, validator: validateScaUpperLimit, trigger: 'blur'}
          ]
        },
        // 可选职务
        options: [],
        // 配置组织数字段名字
        orgUnitProps: {
          children: 'children',
          label: 'orgUnitName',
          disabled: (data, node) => {
            return data.status === '2'
          }
        },
        // 职务编制规则数据
        dutyRule: {
          columns: [
            {prop: 'saleLowerLimit', label: '日均销售额下限'},
            {prop: 'saleUpperLimit', label: '日均销售额上限'},
            {prop: 'scaLowerLimit', label: '编制下限'},
            {prop: 'scaUpperLimit', label: '编制上限'}
          ],
          data: [],
          notData: false
        },
        dutyLoading: false,
        // 保存接口带回的生效日期
        saveEffectiveDate: '',
        // 是否第一次选择组织职务
        selectedOnce: false
      }
    },
    computed: {
      // 生效日期可选值控制
      effectiveDateOptions () {
        let self = this
        if (self.saveEffectiveDate) {
          return {
            disabledDate (time) {
              let getYearMonth = new Date(self.saveEffectiveDate)
              return time < new Date(getYearMonth.getFullYear(), getYearMonth.getMonth() + 1)
            }
          }
        }
        return {
          disabledDate (time) {
            return false
          }
        }
      },
      // 失效日期可以值控制
      uneffectiveDateOptions () {
        let self = this
        let disableDate = Date.now()
        if (self.model.effectiveDate) {
          disableDate = Math.max(Date.now(), new Date(self.model.effectiveDate).getTime())
        }
        return {
          disabledDate (time) {
            if (time.getFullYear() < new Date(disableDate).getFullYear()) {
              return true
            } else {
              if (time.getFullYear() > new Date(disableDate).getFullYear()) {
                return false
              } else {
                return time.getMonth() < new Date(disableDate).getMonth() + 1
              }
            }
          }
        }
      }
    },
    watch: {
      // 失效日期存在时，选择生效日期大于失效日期时把失效日期置空
      'model.effectiveDate' (val) {
        if (this.model.uneffectiveDate && new Date(val).getTime() >= new Date(this.model.uneffectiveDate).getTime()) {
          this.model.uneffectiveDate = ''
        }
      },
      // 组织发生变化时
      'model.orgUnitId' (newVal, oldValue) {
        if (newVal) {
          this.$emit('orgChange', newVal)
        }
        this.getJobList()
      },
      // 职务发生变化时
      'model.posTitleId' (newVal, oldValue) {
        this.getJobList()
      },
      // 编制上限变化时校验编制下限
      'model.scaUpperLimit' (val) {
        this.validateForm('scaUpperLimit')
        if (this.model.scaLowerLimit) this.validateForm('scaLowerLimit')
      },
      // 编制下限变化时校验编制上限
      'model.scaLowerLimit' (val) {
        this.validateForm('scaLowerLimit')
        if (this.model.scaUpperLimit) this.validateForm('scaUpperLimit')
      }
    },
    created () {
      // 请求职务数据
      req('getTitleList', {}).then(res => {
        if (res) {
          this.options = res
        }
      })
    },
    methods: {
      // 新建流程时组织跟职务都选择时带出历史数据
      getJobList () {
        if (this.taskId) {
          return
        }
        // 配置model需要获取的数据
        let maintainObj = {
          effectiveDate: 'string',
          uneffectiveDate: 'string',
          scaUpperLimit: 'number',
          scaLowerLimit: 'number',
          remark: 'string',
          adjustBefore: 'object',
          actualScaleNum: 'string'
        }
        // 组织或职务某一项为空时，model数据重置
        if (!this.model.orgUnitId || !this.model.posTitleId) {
          for (let key in maintainObj) {
            // 如果已选择过组织职务至少一次，则编制上下限也重置
            if (this.selectedOnce) {
              if (key !== 'uneffectiveDate') {
                this.model[key] = ''
              }
            } else {
              if (key !== 'uneffectiveDate' && key !== 'scaUpperLimit' && key !== 'scaLowerLimit') {
                this.model[key] = ''
              }
            }
          }
          // 若组织清空则重置组织类型
          this.orgType = this.model.orgUnitId ? this.orgType : '01'
          // 重置职务规则数据
          this.dutyRule.data = []
          this.dutyRule.notData = false
          this.saveEffectiveDate = ''
          this.$emit('update:orgType', this.orgType)
          return false
        }
        this.loading = true
        this.$emit('loadingChange', this.loading)
        // 根据组织，职务获取编制数据
        req('getViewReport', {
          orgUnitId: this.model.orgUnitId,
          posTitleId: this.model.posTitleId
        }).then(res => {
          // 时间转换
          if (res.effectiveDate) {
            res.effectiveDate = moment(res.effectiveDate).format('YYYY-MM-DD')
          }
          if (res.uneffectiveDate) {
            res.uneffectiveDate = moment(res.uneffectiveDate).format('YYYY-MM-DD')
          }
          // 把需要的数据挂断this.model上
          for (let key in maintainObj) {
            if (maintainObj[key] === 'number') {
              // 第一次选择组织职务，若无可带出的编制上下限，编制上下限不会清空
              if (!this.selectedOnce) {
                this.model[key] = (res[key] ? parseInt(res[key]) : this.model[key])
              } else {
                // 如果上下限已经有值，保留
                if (this.model.scaUpperLimit) {
                  if (res[key]) {
                    // 如果带出有上下限，覆盖
                    this.model[key] = parseInt(res[key])
                  }
                } else {
                  // 否则编制上下限清空
                  this.model[key] = (res[key] ? parseInt(res[key]) : '')
                }
                // 否则编制上下限清空
                // this.model[key] = (res[key] ? parseInt(res[key]) : '')
              }
            } else {
              if (key === 'uneffectiveDate') {
                res[key] = '9999-12-31'
              }
              this.model[key] = res[key]
            }
          }
          // 第一次选择了组织及职务
          this.selectedOnce = true
          // 保存条调整前的数据
          let adjustBefore = clone(res)
        //  if (res.uneffectiveDate && res.uneffectiveDate.indexOf('9999') > -1) {
        //    this.model.uneffectiveDate = ''
        //  }
          // 日均销售额
          adjustBefore.dailySales = this.toDecima((adjustBefore.dailySales ? parseFloat(adjustBefore.dailySales) : 0))
          // 销售额幅度
          adjustBefore.salesRange = this.toDecima(adjustBefore.dailySales * 0.9)
          adjustBefore.salesRange += '～'
          adjustBefore.salesRange += this.toDecima(adjustBefore.dailySales * 1.1)
          // 把调整前的数据保存到this.model供其他组件展示
          delete this.model.adjustBefore
          this.$set(this.model, 'adjustBefore', adjustBefore)
          this.saveEffectiveDate = res.effectiveDate
          this.loading = false
          this.$emit('loadingChange', this.loading)
        })
      },
      // 获取初始化的职务规则（供编制调整）
      getDutyRule () {
        let orgUnitId = this.model.orgUnitId
        let posTitleId = this.model.posTitleId
        let dailySales = (this.model.adjustBefore ? this.model.adjustBefore.dailySales : '0')
        // 获取职务编制规则
        if (!orgUnitId || !posTitleId) {
          return
        }
        // 没有实际数赋值为0
        if (!dailySales) {
          dailySales = '0'
        }
        this.dutyLoading = true
        req('getDutyRule', {
          orgUnitId: orgUnitId,
          posTitleId: posTitleId,
          dailySales: dailySales
        }).then(res => {
          this.dutyLoading = false
          // 编制规则表格key值
          let keyArr = ['saleUpperLimit', 'saleLowerLimit', 'scaUpperLimit', 'scaLowerLimit']
          let keyNotDataLength = 0
          for (let i = 0, len = keyArr.length; i < len; i++) {
            if (!res[keyArr[i]]) {
              keyNotDataLength++
            }
          }
          this.dutyRule.notData = (keyNotDataLength === keyArr.length)
          this.dutyRule.data = [res]
        }).catch(() => {
          this.dutyLoading = false
        })
      },
      // 数字转换
      // @params{string,number} number 需要转换的数字
      // @params{string,number} digit 需要保留几位小数（默认两位）
      // @return {string} decimaNumber
      toDecima (number, digit = 2) {
        let toNumber = Number(parseFloat(number))
        digit = parseInt(digit)
        if (isNaN(number)) return number
        let decimaNumber = Math.floor(toNumber * 100) / 100
        let digIndex = parseInt(decimaNumber.toString().indexOf('.'))
        if (digIndex < 0) {
          decimaNumber += '.'
        }
        let numberArr = decimaNumber.toString().split('.')
        if (numberArr[1].length < digit) {
          for (let i = 0; i < digit - numberArr[1].length; i++) {
            decimaNumber += '0'
          }
        }
        return decimaNumber
      },
      // 表单校验
      validateForm (prop) {
        this.$refs.maintainForm.validateField(prop)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maintain-detail {
    .store-hint-wrapper {
      text-align: right;
      margin-left: 68px;
      margin-top: -15px;
      position: relative;
    }
    .hint-wrapper {
      text-align: right;
      margin-left: 68px;
      margin-top: -10px;
    }
    .location {
      display: inline-block;
    }
    .store-hint {
      padding-bottom: 10px;
      font-size: 12px;
      color: #3DA5FE;
    }
    .hint {
      text-decoration: underline;
      text-align: right;
      padding-bottom: 10px;
      font-size: 12px;
      color: #3DA5FE;
      cursor: pointer;
    }
  }
</style>
<style>
  .hint-wrapper-duty-tip {
    text-align: center;
    font-size: 13px;
  }
</style>
