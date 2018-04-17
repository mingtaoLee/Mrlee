<template>
  <div class="scheme-dialog">
    <el-form>
      <el-form :model="formData" :rules="rules" ref="form">
        <el-form-item label="方案名称" :label-width="'100px'" prop="name">
          <el-input disabled v-model="formData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="绩效等级" :label-width="'100px'" prop="levelId">
          <el-select disabled v-model="formData.levelId" placeholder="请选择绩效等级">
            <el-option v-for="item in levelList" :key="item.levelId" :label="item.name"
                       :value="item.levelId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="绩效模版" :label-width="'100px'" prop="templateId">
          <el-select disabled v-model="formData.templateId" placeholder="请选择绩效模版">
            <el-option v-for="item in templateList" :key="item.templateId" :label="item.name"
                       :value="item.templateId" @click.native="selecChange"></el-option>
          </el-select>
        </el-form-item>
        <yh-cl click-free mounted-type="all">
          <yh-cl-item v-if="contents.includes('1')" title="KPI指标" index=0>
            <span slot="title" class="font-size-mini margin20">比重不得超过{{kpiWeight}}</span>
            <el-form-item prop="kpis" :rules="kpisRule">
              <el-table :data="formData.kpis">
                <el-table-column label="指标名称" width="162">
                  <template slot-scope="scope">
                    <el-form-item labelWidth="100" :prop="`kpis[${scope.$index}].indicatorName`"
                                  :rules="indicatorNameRule">
                      <el-input 
                      disabled 
                      placeholder="评估指标名称类型" 
                      :value="scope.row.indicatorName"
                      @change="modifierWork(scope)"
                      >
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="评估类型" width="145">
                  <template slot-scope="scope">
                    <el-form-item labelWidth="100" :prop="`kpis[${scope.$index}].indicatorType`"
                                  :rules="indicatorTypeRule">
                      <el-input 
                      disabled 
                      placeholder="评估类型" 
                      :value="evaluationTyper(scope.row.indicatorType)"
                      @change="modifierWork(scope)">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="评估方法" width="150">
                  <template slot-scope="scope">
                    <el-form-item labelWidth="100" :prop="`kpis[${scope.$index}].evaluationMethod`"
                                  :rules="evaluationMethodRule">
                      <el-input 
                      disabled 
                      placeholder="评估方法" 
                      :value="evaluationMethoder(scope.row.evaluationMethod)"
                      @change="modifierWork(scope)">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="指标权重" width="190">
                  <template slot-scope="scope">
                    <el-form-item labelWidth="110" :prop="`kpis[${scope.$index}].weight`" :rules="percentRule">
                      <el-input disabled placeholder="指标权重" v-model="scope.row.weight" @change="modifierKpi(scope)">
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </yh-cl-item>
          <yh-cl-item v-if="contents.includes('2')" title="重点工作" index=1>
            <span slot="title" class="font-size-mini margin20">比重不得超过{{keyWorkWeight}}</span>
            <el-form-item prop="keyWorks" :rules="keyWorksRule">

              <el-table :data="formData.keyWorks">
                <el-table-column property="name" label="重点工作项目" width="230">
                  <template slot-scope="scope">
                    <el-form-item labelWidth="100" :prop="`keyWorks[${scope.$index}].keyWorkName`"
                                  :rules="keyWorkNameRule">
                      <el-input disabled type="textarea" placeholder="重点工作项目" v-model="scope.row.keyWorkName"
                                @change="modifierWork(scope)"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column property="name" label="达成目标" width="240">
                  <template slot-scope="scope">
                    <el-form-item labelWidth="100" :prop="`keyWorks[${scope.$index}].target`" :rules="targetRule">
                      <el-input disabled type="textarea" placeholder="达成目标" v-model="scope.row.target"
                                @change="modifierWork(scope)"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="指标权重" width="180">
                  <template slot-scope="scope">
                    <el-form-item 
                    labelWidth="110" 
                    :prop="`keyWorks[${scope.$index}].weight`"
                    :rules="validateKeyWorkPercent">
                      <el-input disabled placeholder="指标权重" v-model="scope.row.weight" @change="modifierWork(scope)">
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </yh-cl-item>
        </yh-cl>

        <el-form-item label="适用范围" :label-width="'100px'">
          <el-input disabled v-model="formData.orgName">
          </el-input>
        </el-form-item>
        <el-form-item label="方案年度" :label-width="'100px'" prop="year" :rules="date">
          <el-date-picker
            v-model="formData.year"
            disabled
            align="right"
            type="year"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="描述" :label-width="'100px'" prop="description">
          <el-input disabled type="textarea" v-model="formData.description" :rows="5"></el-input>
        </el-form-item>
      </el-form>
    </el-form>
  </div>

</template>

<script>
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
  import YhCl from 'components/common/collapse/yh-cl'
  import YhClItem from 'components/common/collapse/yh-cl-item'
  import structureDialog from './structure-dialog.vue'
  import chooseIndicatorDialog from './choose-indicator-dialog.vue'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'

  import {
    evaluationTypeDict,
    evaluationMethodDict
  } from '../../../../../config/dict'
  import req from 'api/performance/scheme'
  import { clone, findDictLabel } from 'utils/index'

  export default {
    name: 'scheme-dialog-check',
    props: ['form', 'value', 'type', 'schemeId'],
    data () {
      // 比例验证函数
      var validatePercent = (rule, value, callback) => {
        let totalPercent = 0
        this.formData.kpis.forEach((val, index) => {
          if (!Number(val.weight) && val.weight !== '0') {
            callback('数字格式错误')
          }
          totalPercent += Number(val.weight)
        })
        if (totalPercent > this.kpiWeight) {
          callback(new Error('比例总和必须小于约定值'))
        } else {
          callback()
        }
      }
      var validateKeyWorkPercent = (rule, value, callback) => {
        let totalPercent = 0
        this.formData.keyWorks.forEach((val, index) => {
          if (!Number(val.weight) && val.weight !== '0') {
            callback('数字格式错误')
          }
          totalPercent += Number(val.weight)
        })
        if (totalPercent > this.keyWorkWeight) {
          callback(new Error('比例总和必须小于约定值'))
        } else {
          callback()
        }
      }
      // 验证评估分的详情
      var validateRules4Kpi = (rule, value, callback) => {
        if (this.isMakePlan === 'N') {
          if (this.formData.kpis.length || this.formData.keyWorks.length) {
            callback()
          } else {
            callback(new Error('请添加至少一项数据'))
          }
        } else {
          callback()
        }
      }
      // 验证评估分的详情
      var validateRules4KeyWork = (rule, value, callback) => {
        if (this.isMakePlan === 'N') {
          if (this.formData.kpis.length || this.formData.keyWorks.length) {
            callback()
          } else {
            callback(new Error('请添加至少一项数据'))
          }
        } else {
          callback()
        }
      }
      return {
        contents: [],
        visible: false,
        structureVisible: false,
        indicatorVisible: false,
        templateList: [],
        levelList: [],
        formData: {},
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 1, max: 128, message: '长度最大为128个字符', trigger: 'blur'}
          ],
          description: [
            {min: 1, max: 255, message: '长度最大为255个字符', trigger: 'blur'}
          ],
          levelId: [
            {required: true, message: '请选择绩效等级', trigger: 'change'}
          ],
          templateId: [
            {required: true, message: '请选择绩效模版', trigger: 'change'}
          ]
        },
        date: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
        ],
        orgId: [{
          required: true, message: '请选择组织', trigger: 'change'
        }],
        indicatorNameRule: {
          required: true, message: '请输入指标名称', trigger: 'blur'
        },
        indicatorTypeRule: {
          required: true, message: '请输入评估类型', trigger: 'blur'
        },
        evaluationMethodRule: {
          required: true, message: '请输入评估方法', trigger: 'blur'
        },
        weightRule: {
          required: true, message: '请输入指标权重', trigger: 'blur', type: 'number'
        },
        keyWorkNameRule: {
          required: true, message: '请输入重点工作项目', trigger: 'blur'
        },
        targetRule: {
          required: true, message: '请输入达成目标', trigger: 'blur'
        },
        percentRule: {
          validator: validatePercent, trigger: 'blur'
        },
        validateKeyWorkPercent: {
          validator: validateKeyWorkPercent, trigger: 'blur'
        },
        kpisRule: {
          validator: validateRules4Kpi, trigger: 'blur'
        },
        keyWorksRule: {
          validator: validateRules4KeyWork, trigger: 'blur'
        },
        kpiCacheArr: [],
        keyWorkCacheArr: [],
        kpiCacheChangeArr: [],
        keyWorkCacheChangeArr: [],
        kpiWeight: 0,
        keyWorkWeight: 0,
        isMakePlan: 'N',
        node: {},
        dialogToolbar: [
          {
            text: '取消',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '选择',
            func: done => {
              this.handleSave(done)
            }
          }
        ]
      }
    },
    components: {
      YhCl,
      YhClItem,
      structureDialog,
      chooseIndicatorDialog,
      ISelectTree,
      IDialog
    },
    computed: {
      title () {
        return this.type ? '修改' : '新增'
      }
    },
    watch: {
      'formData.templateId': function () {
        this.templateList.forEach((val, index) => {
          if (val.templateId === this.formData.templateId) {
            this.isMakePlan = val.isMakePlan
            console.log(this.isMakePlan)
            this.contents = val.contents.map((val) => {
              if (val.checkContentType === '1') {
                this.kpiWeight = val.weight
              }
              if (val.checkContentType === '2') {
                this.keyWorkWeight = val.weight
              }
              return val.checkContentType
            })
          }
        })
      }
    },
    created () {
      this.formData = clone(this.form)
      this.openDialogAndGetList()
    },
    methods: {
      templatesOpenList () {
        req('templatesOpenList').then((data) => {
          if (Array.isArray(data)) {
            this.templateList = data
            this.templateList.forEach((val) => {
              if (val.templateId === this.formData.templateId) {
                this.isMakePlan = val.isMakePlan
                console.log(this.isMakePlan)

                this.contents = val.contents.map((val) => {
                  if (val.checkContentType === '1') {
                    this.kpiWeight = val.weight
                  }
                  if (val.checkContentType === '2') {
                    this.keyWorkWeight = val.weight
                  }
                  return val.checkContentType
                })
              }
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      levelsOpenList () {
        req('levelsOpenList').then((data) => {
          if (Array.isArray(data)) {
            this.levelList = data
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      openDialogAndGetList () {
        this.levelsOpenList()
        this.getOrgObj()
        this.templatesOpenList()
      },
      evaluationTyper (val) {
        return findDictLabel(evaluationTypeDict, val)
      },
      evaluationMethoder (val) {
        return findDictLabel(evaluationMethodDict, val)
      },
      renderKpiHeader (h, {column, $index}) {
        return h('i', {
          'class': {
            'icon': true,
            'iconfont': true,
            'icon-add': true
          },
          on: {
            click: this.showIndicator
          }
        })
      },
      renderWorkHeader (h, {column, $index}) {
        return h('i', {
          'class': {
            'icon': true,
            'iconfont': true,
            'icon-add': true
          },
          on: {
            click: this.addWorkRow
          }
        })
      },
      showStructure () {
        this.structureVisible = true
      },
      getOrgName (orgName) {
        console.log(orgName)
        this.formData.orgName = orgName
      },
      showIndicator () {
        this.indicatorVisible = true
//        console.log(this.indicatorVisible)
      },
      indicatorDialogVisible (val, indicatiorArr) {
        this.indicatorVisible = val
        console.log(4444444)
        indicatiorArr.forEach((val, index) => {
          this.addKpiRow({
            indicatorName: val.indicatorName,
            indicatorType: val.evaluationType,
            evaluationMethod: val.evaluationMethod,
            evaluationDirection: val.evaluationDirection,
            standard: val.evaluationStandard,
            evaluationType: val.evaluationType,
            indicatorId: val.indicatorId,
            standardId: val.standardId,
            unit: val.unit,
            description: val.description,
            isLocal: val.isLocal
          })
        })
      },
      // 操作行
      addKpiRow (data) {
        this.formData.kpis.push({sortNo: 1, updateType: 1, ...data})
        let hash = {}
        this.formData.kpis = this.formData.kpis.reduce(function (item, next) {
          hash[next.indicatorId] ? '' : hash[next.indicatorId] = true && item.push(next)
          return item
        }, [])
        this.$refs['form'].validate((valid) => {})
      },
      addWorkRow () {
        if (!this.formData.keyWorks) {
          this.formData.keyWorks = []
        }
        this.formData.keyWorks.push({sortNo: 1, updateType: 1})
        this.$refs['form'].validate((valid) => {})
      },
      removeKpiRow (index) {
        this.formData.kpis[index].updateType = 3
        let cache = this.formData.kpis.splice(index, 1)
        this.kpiCacheArr = this.kpiCacheArr.concat(cache)
      },
      modifierKpi (scope) {
        if (scope.row.updateType === 1) {
          return
        }
        this.formData.kpis[scope.$index].updateType = 2
      },
      modifierWork (scope) {
        if (scope.row.updateType === 1) {
          return
        }
        this.formData.keyWorks[scope.$index].updateType = 2
      },
      selecChange () {
        this.kpiCacheChangeArr = this.formData.kpis
        this.keyWorkCacheChangeArr = this.formData.keyWorks
        this.kpiCacheChangeArr.forEach((val, index) => {
          val.updateType = 3
        })
        this.keyWorkCacheChangeArr.forEach((val, index) => {
          val.updateType = 3
        })
        this.formData.kpis = []
        this.formData.keyWorks = []
      },

      removeWorkRow (index) {
        this.formData.keyWorks[index].updateType = 3
        let cache = this.formData.keyWorks.splice(index, 1)
        console.log(cache)
        this.keyWorkCacheArr = this.keyWorkCacheArr.concat(cache)
      },
      closeDialog () {
        this.contents = []
        this.$emit('input', false)
      },

      handleNodeClick (val) {
        if (this.node) {
          this.formData.orgName = this.node.orgPathName
        }
      },
      getOrgObj () {
        let id = this.formData.orgId
        if (id) {
          req('getOrgObj', {id: id}).then((data) => {
            this.node = data
            this.formData.orgId = id
          }).catch((err) => {
            console.log(err)
          })
        }
      },

      /* 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.formData)
            } else {
              resolve(false)
            }
          })
        })
      },
      // 确认按钮
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              res.year = res.year.getFullYear().toString()
              if (!res.orgId) {
                res.orgId = '123123123'
              }
              // 取出删掉的kpi缓存数据
              let postKpiArr = []
              postKpiArr = res.kpis.concat(this.kpiCacheArr).concat(this.kpiCacheChangeArr)
              this.kpiCacheArr = []
              this.kpiCacheChangeArr = []
              res.kpis = postKpiArr
              res.kpis.forEach((val, index) => {
                val.sortNo = index + 1
              })
              // 过滤本地kpis数组缓存
              for (let i = 0; i < res.kpis.length; i++) {
                if (res.kpis[i].isLocal && (res.kpis[i].updateType === 3)) {
                  res.kpis.splice(i, 1)
                  i--
                }
              }
              // 取出删掉的keywork缓存数据
              let postKwyWorkArr = []
              postKwyWorkArr = res.keyWorks.concat(this.keyWorkCacheArr).concat(this.keyWorkCacheChangeArr)
              this.keyWorkCacheArr = []
              this.keyWorkCacheChangeArr = []
              res.keyWorks = postKwyWorkArr
              res.keyWorks.forEach((val, index) => {
                val.sortNo = index + 1
              })
              res.kpiWeight = this.kpiWeight
              res.keyWorkWeight = this.keyWorkWeight
              // 过滤本地keyWorks数组缓存
              for (let i = 0; i < res.keyWorks.length; i++) {
                if ((!res.keyWorks[i].keyWorkId) && (res.keyWorks[i].updateType === 3)) {
                  res.keyWorks.splice(i, 1)
                  i--
                }
              }
              res.isMakePlan = this.isMakePlan
              if (this.type) {
                req('modifiedScheme', {schemeId: this.schemeId, ...res}).then((data) => {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                  })
                  resolve(res)
                })
              } else {
                req('addOneScheme', res).then((data) => {
                  this.$message({
                    message: '恭喜你，添加成功',
                    type: 'success'
                  })
                  resolve(res)
                })
              }
            } else {
              resolve(false)
            }
          })
        })
      },
      // 取消按钮
      handleCancel (done) {
        done()
      },
      handleSave (done) {
        this.$refs.indicatorDialog.save().then(res => {
          if (res) {
            this.indicatorDialogVisible(false, res)
            done()
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .scheme-dialog {
    .width-50 {
      width: 49%;
      display: inline-block;
      i {
        cursor: pointer;
      }
    }
  }
</style>

