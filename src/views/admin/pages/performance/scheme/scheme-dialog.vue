<template>
  <div class="scheme-dialog">
    <el-form>
      <el-form :model="formData" :rules="rules" ref="form">
        <el-form-item label="方案名称" :label-width="'100px'" prop="name" required>
          <el-input v-model.trim="formData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="绩效等级" :label-width="'100px'" prop="levelId">
          <el-select v-model="formData.levelId" clearable filterable >
            <el-option 
            v-for="item in levelList" 
            :key="item.levelId" 
            :label="item.name"
            :value="item.levelId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="绩效模版" :label-width="'100px'" prop="templateId">
          <el-select v-model="formData.templateId" clearable filterable >
            <el-option 
            v-for="item in templateList" 
            :key="item.templateId" 
            :label="item.name"
            :value="item.templateId" @click.native="selecChange"></el-option>
          </el-select>
        </el-form-item>
        <yh-cl click-free mounted-type="all">
          <yh-cl-item v-if="contents.includes('1')" title="KPI指标" index="0">
            <span slot="title" class="font-size-mini margin20">
              比重不得超过{{kpiWeight}}
            </span>
            <el-form-item prop="kpis" :rules="kpisRule">
              <el-table :data="formData.kpis" v-loading="kpiIndicatorsLoading">
                <el-table-column label="指标名称">
                  <template slot-scope="scope">
                    <el-form-item 
                    labelWidth="100" 
                    :prop="`kpis[${scope.$index}].indicatorName`"
                    :rules="indicatorNameRule">
                      <el-input 
                      placeholder="评估指标名称类型" :value="scope.row.indicatorName" 
                      @change="modifierWork(scope)"
                      :disabled="true"
                      >
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="评估类型" >
                  <template slot-scope="scope">
                    <el-form-item 
                    labelWidth="100" 
                    :prop="`kpis[${scope.$index}].indicatorType`"
                    :rules="indicatorTypeRule"
                    >
                      <el-input 
                      placeholder="评估类型" 
                      :value="evaluationTyper(scope.row.indicatorType)"
                      @change="modifierWork(scope)" 
                      :disabled="true"
                      >
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="评估方法">
                  <template slot-scope="scope">
                    <el-form-item 
                    labelWidth="100" 
                    :prop="`kpis[${scope.$index}].evaluationMethod`"
                    :rules="evaluationMethodRule"
                    >
                      <el-input 
                      placeholder="评估方法" 
                      :value="evaluationMethoder(scope.row.evaluationMethod)"
                      @change="modifierWork(scope)" 
                      :disabled="true"
                      >
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="指标权重" width="150">
                  <template slot-scope="scope">
                    <el-form-item 
                    labelWidth="110"
                    width="20"
                    :prop="`kpis[${scope.$index}].weight`" :rules="percentRule"
                    >
                      <el-input 
                      placeholder="指标权重" 
                      v-model.trim="scope.row.weight" 
                      @change="modifierKpi(scope)">
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column 
                property="name" 
                :render-header="renderKpiHeader" 
                align="center"
                >
                  <template slot-scope="scope">
                    <i class="icon iconfont icon-delete" @click="removeKpiRow(scope.$index)"></i>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </yh-cl-item>
          <yh-cl-item v-if="contents.includes('2')" title="重点工作" index=1>
            <span slot="title" class="font-size-mini margin20">比重不得超过{{keyWorkWeight}}</span>
            <el-form-item prop="keyWorks" :rules="keyWorksRule">

              <el-table :data="formData.keyWorks" class="gengtp-performance-scheme">
                <el-table-column property="name" label="重点工作项目">
                  <template slot-scope="scope">
                    <el-form-item 
                    labelWidth="100" 
                    :prop="`keyWorks[${scope.$index}].keyWorkName`"
                    :rules="keyWorkNameRule">
                      <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="重点工作项目"
                      v-model.trim="scope.row.keyWorkName"
                      @change="modifierWork(scope)"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column property="name" label="达成目标" width="210">
                  <template slot-scope="scope">
                    <el-form-item labelWidth="100" :prop="`keyWorks[${scope.$index}].target`" :rules="targetRule">
                      <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="达成目标"
                      v-model.trim="scope.row.target"
                      @change="modifierWork(scope)"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="指标权重" width="150">
                  <template slot-scope="scope">
                    <el-form-item 
                    labelWidth="110" 
                    :prop="`keyWorks[${scope.$index}].weight`"
                    :rules="validateKeyWorkPercent">
                      <el-input 
                      placeholder="指标权重" 
                      v-model.trim="scope.row.weight"
                      @change="modifierWork(scope)">
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column 
                  property="name" 
                  :render-header="renderWorkHeader" 
                  width="55" 
                  align="center"
                >
                  <template slot-scope="scope">
                    <i class="icon iconfont icon-delete" @click="removeWorkRow(scope.$index)"></i>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </yh-cl-item>
        </yh-cl>

        <el-form-item label="适用范围" :label-width="'100px'" prop="orgId" :rules="orgId">
        
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            :rootId="rootId"
            v-model="formData.orgId"
            :lazy="true"
            @input="handleNodeClick"
            :readonly="true"
            treeMaxHeight="180"
            :accordion="true"
            sizeAuto
            clearable
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="方案年度" :label-width="'100px'" prop="year" :rules="date">
          <el-date-picker
            v-model="formData.year"
            type="year"
            :picker-options="dateStartPickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="描述" :label-width="'100px'" prop="description">
          <el-input type="textarea" v-model.trim="formData.description" :rows="5"></el-input>
        </el-form-item>

      </el-form>
    </el-form>

    <structure-dialog v-model="structureVisible" @orgName="getOrgName">

    </structure-dialog>

    <i-dialog
      v-model="indicatorVisible"
      title="选择绩效指标"
      width="800px"
      :toolbar="dialogToolbar"
      :modal="false"
      destroyedWhenClose
    >
      <choose-indicator-dialog
        @indicatorDialogVisible="indicatorDialogVisible"
        ref="indicatorDialog"
        :storageIndicators="storageIndicators"
      ></choose-indicator-dialog>
    </i-dialog>
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
    name: 'scheme-dialog',
    props: ['form', 'value', 'type', 'schemeId'],
    data () {
      // 比例验证函数
      // 添加 isMakePlan 判断 zhengwq5 2017/11/28 refactor
      var validatePercent = (rule, value, callback) => {
        let totalPercent = 0
        if (/\./.test(value)) callback(new Error('请输入整数'))
        if (Number(value) <= 0) {
          callback(new Error('请输入大于0的数'))
        }
        if (value === '') {
          callback('请输入数字')
        }
        if (!Number(value)) {
          callback('数字格式错误')
        }
        this.formData.kpis.forEach((val, index) => {
          totalPercent += Number(val.weight)
        })
        if (this.isMakePlan === 'Y') {
          if (totalPercent > this.kpiWeight) {
            callback(new Error('比例总和必须小于约定值'))
          } else {
            callback()
          }
        } else {
          if (totalPercent !== this.kpiWeight) {
            callback(new Error('比例总和必须等于约定值'))
          } else {
            callback()
          }
        }
      }
      var validateKeyWorkPercent = (rule, value, callback) => {
        let totalPercent = 0
        if (/\./.test(value)) callback(new Error('请输入整数'))
        if (Number(value) <= 0) {
          callback(new Error('请输入大于0的数'))
        }
        if (value === '') {
          callback('请输入数字')
        }
        if (!Number(value)) {
          callback('数字格式错误')
        }
        this.formData.keyWorks.forEach((val, index) => {
          totalPercent += Number(val.weight)
        })
        if (this.isMakePlan === 'Y') {
          if (totalPercent > this.keyWorkWeight) {
            callback(new Error('比例总和必须小于约定值'))
          } else {
            callback()
          }
        } else {
          if (totalPercent !== this.keyWorkWeight) {
            callback(new Error('比例总和必须等于约定值'))
          } else {
            callback()
          }
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
      // 验证不能为所有空格
      var spaceValidate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入绩效方案名称'))
        } else if (value.replace(/\s+/g, '').length === 0) {
          callback(new Error('所有的字符不能都为空格'))
        } else if (value.length > 128) {
          callback(new Error('长度最大为128个字符'))
        } else {
          callback()
        }
      }
      var duplicateNameValidate = (rule, val, cb) => {
        let currentNames = this.formData.keyWorks.map(obj => obj.keyWorkName)
        let matched = currentNames.filter(name => name === val)
        !val
          ? cb(new Error('请输入重点工作项目'))
          : val.length > 255
            ? cb(new Error('字符长度为 1 ~ 255'))
            : matched.length > 1
              ? cb(new Error('工作事项重复'))
              : cb()
      }
      // 达成目标校验
      const targetValidate = (rule, val, cb) => {
        !val
          ? cb(new Error('请输入达成目标'))
          : val.length > 255
            ? cb(new Error('字符长度为 1 ~ 255'))
            : cb()
      }

      return {
        contents: [],
        visible: false,
        structureVisible: false,
        indicatorVisible: false,
        storageIndicators: null, // Kpi指标数组
        kpiIndicatorsLoading: false, // kpi数组
        templateList: [],
        levelList: [],
        formData: {},
        rules: {
          name: [
            {validator: spaceValidate, trigger: 'change'}
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
          {type: 'date', required: true, message: '请选择年度', trigger: 'change'}
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
          required: true, message: '请输入指标权重', trigger: 'blur'
        },
        keyWorkNameRule: [
          {validator: duplicateNameValidate, trigger: 'change'}
        ],
        targetRule: [{
          validator: targetValidate, trigger: 'change'
        }],
        // 添加 trigger:'change' zhengwq5 2017/11/28 add
        percentRule: [{
          validator: validatePercent, trigger: 'blur'
        }, {
          validator: validatePercent, trigger: 'change'
        }],
        // 添加 trigger:'change' zhengwq5 2017/11/28 add
        validateKeyWorkPercent: [{
          validator: validateKeyWorkPercent, trigger: 'blur'
        }, {
          validator: validateKeyWorkPercent, trigger: 'change'
        }],
        kpisRule: {
          validator: validateRules4Kpi, trigger: 'blur'
        },
        keyWorksRule: {
          validator: validateRules4KeyWork, trigger: 'blur'
        },
        // 开始年份
        dateStartPickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse(new Date())
          }
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
        if (!this.formData.templateId) {
          this.contents = []
          return
        }
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
      let data = clone(this.form)
      data.levelId = null
      data.templateId = null
      this.formData = data
      this.openDialogAndGetList()
    },
    methods: {
      templatesOpenList () {
        req('templatesOpenList').then((data) => {
          if (Array.isArray(data)) {
            this.templateList = data
            this.formData.templateId = this.form.templateId
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
            this.formData.levelId = this.form.levelId
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
      getIndiatiors () {
        req('indicatorslList', {...this.params, pageIndex: this.pageIndex, pageSize: this.pageSize}).then(({data, total}) => {
          console.log(data)
          this.kpiIndicatorsLoading = false
          if (Array.isArray(data)) {
            this.storageIndicators = this.indicatorsFilter(data)
            // this.storageIndicators = data
            this.indicatorVisible = true
            // this.indicatorsLength = total
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      indicatorsFilter (data) {
        let result = []
        for (let i of data) {
          let tmp = this.formData.kpis.filter(ele => ele.indicatorId === i.indicatorId)
          !tmp.length && result.push(i)
        }
        return result
      },
      showIndicator () {
        this.kpiIndicatorsLoading = true
        this.getIndiatiors()
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
        this.formData.kpis.push({sortNo: 1, updateType: 1, weight: '', ...data})
        let hash = {}
        this.formData.kpis = this.formData.kpis.reduce((item, next) => {
          if (hash[next.indicatorName]) {
            this.$message({
              message: '选择了已存在的kpi指标(自动过滤掉名称相同的选项)',
              type: 'warning',
              duration: 3000
            })
          } else {
            hash[next.indicatorName] = true && item.push(next)
          }
          return item
        }, [])
        this.$refs['form'].validate((valid) => {})
      },
      addWorkRow () {
        if (!this.formData.keyWorks) {
          this.formData.keyWorks = []
        }
        this.formData.keyWorks.push({sortNo: 1, updateType: 1, weight: ''})
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
              if (!res.orgId) {
                res.orgId = '123123123'
              }
              // 取出删掉的kpi缓存数据
              let postKpiArr = []
              postKpiArr = res.kpis.concat(this.kpiCacheArr).concat(this.kpiCacheChangeArr)
              postKpiArr.forEach((value, index) => {
                if (!value.updateType) {
                  value.updateType = 2
                }
              })
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
              postKwyWorkArr.forEach((value, index) => {
                if (!value.updateType) {
                  value.updateType = 2
                }
              })
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
              let sechmeData = {
                description: res.description,
                isMakePlan: res.isMakePlan,
                keyWorkWeight: res.keyWorkWeight,
                kpiWeight: res.kpiWeight,
                keyWorks: res.keyWorks,
                kpis: res.kpis,
                levelId: res.levelId,
                levelName: res.levelName,
                name: res.name,
                orgId: res.orgId,
                orgName: res.orgName,
                status: res.status,
                templateId: res.templateId,
                templateName: res.templateName,
                year: res.year.getFullYear().toString()
              }
              if (this.type) {
                req('modifiedScheme', {schemeId: this.schemeId, ...sechmeData}).then((data) => {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                  })
                  resolve(res)
                })
              } else {
                req('addOneScheme', sechmeData).then((data) => {
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
<style lang="scss">
// .gengtp-performance-scheme {
//   .el-table__body-wrapper {
//     overflow: hidden;
//   }
//   .el-form-item__content {
//     position: relative;
//     .el-form-item__error{
//       top: 40px;
//     }
//   }
// }
</style>

