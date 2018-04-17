import req from 'api/performance/plan-manage'
import { periodDict } from '@/config/dict'
import funcMixin from './mixin-methods'

export default {
  mixins: [funcMixin],

  data () {
    return {
      record: null,
      allDetail: null,
      submitData: null,
      deletedObj: []
    }
  },

  filters: {
    periodFormat (val) {
      for (let dict of periodDict) {
        if (dict['value'] === val) {
          return dict['label']
        }
      }
      return '未发现'
    }
  },

  methods: {
    // get 请求
    getData (url = 'getPlanCheckRecord', period) {
      switch (url) {
        case 'getPlanCheckRecord':
          req('getPlanCheckRecord', {
            'planId': this.$route.params.planId
          }).then((res) => {
            this.record = res
          })
          break
        case 'getPlanDetail':
          req(url, {
            'planId': this.$route.params.planId
          }).then((res) => {
            this.allDetail = res
          })
          break
        case 'getPerformanceLastPlan':
          req(url, {
            'planId': this.$route.params.planId
          }).then((res) => {
            this.allDetail = Object.assign({}, this.allDetail, res)
            this.formatEmptyArray(this.allDetail)
            this.$message.success('复制成功')
          })
          break
        default:
          break
      }
    },

    // post 请求
    postData (url) {
      this.generateSubmitData()
      switch (url) {
        case 'postPerformancePlanSubmit':
          req(url, this.submitData)
            .then((res) => {
              this.$message.success('提交成功')
              this.$confirm('是否关闭此页面？', '提示').then(() => {
                this.rechoicePage()
              })
            })
          break
        case 'postPerformancePlanSave':
          req(url, this.submitData)
            .then((res) => {
              this.$message.success('保存成功')
              this.$router.replace(`/performance/${this.$route.params.planId}/plan_detail`)
            })
          break
        case 'postPerformanceAuditPass':
          req(url, {
            'planId': this.$route.params.planId,
            'operatorDescription': this.ruleForm.operatorDescription
          }).then((res) => {
            this.$message.success('审核通过成功')
            this.rechoicePage()
          })
          break
        case 'postPerformanceAuditReject':
          req(url, {
            'planId': this.$route.params.planId,
            'operatorDescription': this.ruleForm.operatorDescription
          }).then((res) => {
            this.$message.success('驳回成功')
            this.rechoicePage()
          })
          break
        default:
          break
      }
    },

    // 格式化评估人
    formatEmptyArray (val, way) {
      for (let i of val.fixedIndicators) {
        if (!i.updateType) {
          i.updateType = '1'
        }
        if (i.evaluationLeaders.length < 1) {
          i.evaluationLeaders.push({
            'leaderName': '',
            'weight': 0
          })
        }
      }
      for (let i of val.supplementIndicators) {
        if (!i.updateType) {
          i.updateType = '1'
        }
        if (i.evaluationLeaders.length < 1) {
          i.evaluationLeaders.push({
            'leaderName': '',
            'weight': 0
          })
        }
      }
      for (let i of val.keyWork) {
        if (!i.updateType) {
          i.updateType = '1'
        }
        if (i.evaluationLeaders.length < 1) {
          i.evaluationLeaders.push({
            'leaderName': '',
            'weight': 0
          })
        }
      }
    },

    // 生成提交对象
    generateSubmitData () {
      if (this.allDetail) {
        let fixed = this.allDetail.fixedIndicators
        let supplement = this.allDetail.supplementIndicators
        let keywork = this.allDetail.keyWork
        if (this.deletedObj.length > 0) {
          for (let i of this.deletedObj) {
            fixed = fixed.concat(i.fixedIndicators)
            supplement = supplement.concat(i.supplementIndicators)
            keywork = keywork.concat(i.keyWork)
          }
        }
        this.submitData = Object.assign({}, {
          'planId': this.$route.params.planId,
          'leaderId': this.allDetail.leaderId,
          'fixedIndicators': fixed,
          'supplementIndicators': supplement,
          'keyWork': keywork
        })
      }
    },

    // 提交前校验
    handleSubmit (url) {
      let indicator = false
      let keywork = false
      if (!this.allDetail.leaderId) {
        this.$message.warning('直接上级 不能为空')
        return
      }
      if (this.isTargetEmpty(this.allDetail.fixedIndicators,
        this.allDetail.supplementIndicators)) {
        this.$message.warning('目标值 不能为空')
        return
      }
      // if (!this.allDetail.)
      if (this.isCollectorEmpty(this.allDetail.fixedIndicators,
        this.allDetail.supplementIndicators) ||
        this.isCollectorEmpty(this.allDetail.keyWork)) {
        this.$message.warning('数据收集员 不能为空')
        return
      }
      if (this.isNameEmpty('indicatorName',
        this.allDetail.fixedIndicators,
        this.allDetail.supplementIndicators)) {
        this.$message.warning('指标名称 不能为空')
        return
      }
      if (this.isWeightEmpty(
        this.allDetail.fixedIndicators,
        this.allDetail.supplementIndicators)) {
        this.$message.warning('指标权重不能为空')
        return
      }
      if (this.isWeightEmpty(this.allDetail.keyWork)) {
        this.$message.warning('重点工作 权重不能为空')
        return
      }
      if (this.isNameEmpty('keyWorkName', this.allDetail.keyWork)) {
        this.$message.warning('重点工作项目 不能为空')
        return
      }
      if (this.isNameEmpty('target', this.allDetail.keyWork)) {
        this.$message.warning('达成目标 不能为空')
        return
      }
      if (this.allDetail['indicatorWeight'] ===
        this.calculateInputed(this.allDetail.fixedIndicators,
          this.allDetail.supplementIndicators) ||
          !this.allDetail['indicatorWeight']) {
        indicator = true
      } else {
        this.$message.warning(`KPI绩效 -> 指标权重 总数需为：${this.allDetail['indicatorWeight']}%`)
        return
      }
      if (this.allDetail['keyworkWeight'] ===
        this.calculateInputed(this.allDetail.keyWork) ||
        !this.allDetail['keyworkWeight']) {
        keywork = true
      } else {
        this.$message.warning(`重点工作 -> 权重 总数需为：${this.allDetail['keyworkWeight']}%`)
        return
      }
      if (indicator && keywork) {
        let flag = this.calculateLeaderInputed(
          this.allDetail.fixedIndicators,
          this.allDetail.supplementIndicators,
          this.allDetail.keyWork)
        let type = ['固定绩效指标', '补充绩效指标', '重点工作']
        let nameType = ['indicatorName', 'indicatorName', 'keyWorkName']
        if (flag !== true) {
          if (!flag.leaderEmpty && !flag.weightEmpty) {
            this.$message.warning(
              `${type[flag.type]} ->
               ${flag.obj[nameType[flag.type]].length > 7
                ? flag.obj[nameType[flag.type]].slice(0, 7) + '...'
                : flag.obj[nameType[flag.type]]} 评估人权重相加需为100%`)
            return
          } else {
            if (flag.leaderEmpty) {
              this.$message.warning(
                `${type[flag.type]} ->
                 ${flag.obj[nameType[flag.type]].length > 7
                  ? flag.obj[nameType[flag.type]].slice(0, 7) + '...'
                  : flag.obj[nameType[flag.type]]} 评估人名字不能为空`)
              return
            }
            if (flag.weightEmpty) {
              this.$message.warning(
                `${type[flag.type]} ->
                 ${flag.obj[nameType[flag.type]].length > 7
                  ? flag.obj[nameType[flag.type]].slice(0, 7) + '...'
                  : flag.obj[nameType[flag.type]]} 评估人权重不能为空`)
              return
            }
          }
        } else {
          if (this.allDetail.isOverDeadline !== 'Y') {
            this.postData(url)
          } else {
            this.$message.warning('评估已结束，不能提交计划')
            return
          }
        }
      }
    },

    // 按钮提示
    postSubmitConfirm (url) {
      this.$confirm('确定要提交计划吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleSubmit(url)
      }).catch((err) => {
        console.log(err)
      })
    },

    // 按钮提示
    postSaveConfirm (url) {
      this.$confirm('确定要保存吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.postData(url)
      }).catch((err) => {
        console.log(err)
      })
    },

    // 按钮提示
    getPerformanceLastPlanConfirm (url) {
      this.$confirm('确定要复制上阶段计划吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i of this.allDetail.fixedIndicators) {
          this.$set(i, 'updateType', '3')
        }
        for (let i of this.allDetail.supplementIndicators) {
          this.$set(i, 'updateType', '3')
        }
        for (let i of this.allDetail.keyWork) {
          this.$set(i, 'updateType', '3')
        }
        this.deletedObj.push(this.allDetail)
        this.getData(url)
      }).catch((err) => {
        console.log(err)
      })
    },

    // 按钮提示
    postPassConfirm (url) {
      this.$confirm('确定要审核通过吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleSubmit(url)
      }).catch((err) => {
        console.log(err)
      })
    },

    // 按钮提示
    postRejectConfirm (url) {
      this.$confirm('确定要驳回吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleSubmit(url)
      }).catch((err) => {
        console.log(err)
      })
    },

    // 返回自助首页
    rechoicePage () {
      this.$router.replace(`/self_performance`)
    }
  }
}
