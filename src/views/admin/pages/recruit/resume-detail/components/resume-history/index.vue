<template>
  <div>
    <section class="content-follow">
      <template v-if="historyList.length">
        <div
          class="history"
          v-for="(tab, index) in historyList"
          :key="tab">
          <div :class="getHistortTitle(tab.showContent)">
            <span class="ml20">
              {{tab.title}}
            </span>
            <span class="title-label">面试时间</span>
            <span class="ml10">{{tab.resumeData}}</span>
            <span class="title-label">面试职位</span>
            <span class="ml10">{{tab.applyPositionId}}</span>
            <span class="title-label">面试状态</span>
            <span class="ml10">{{tab.recruitStatus}}</span>
            <span
              class="title-fr fr"
              v-if="!tab.showContent"
              @click="changeContentShow(tab,index)"><i class="el-icon-arrow-up mr5"></i>展开</span>
            <span
              class="title-fr fr"
              v-else
              @click="changeContentShow(tab, index)"><i class="el-icon-arrow-down mr5"></i>收起</span>
          </div>
          <session class="content" v-if="tab.showContent">
            <!-- 基本信息 -->
              <info-template :title="'基本信息'" :data="tab.basicInfo"></info-template>

              <!-- 面试评估 -->
              <evaluation-template
                v-for="interview in tab.interviews"
                :key="interview"
                :evalutionData="interview"></evaluation-template>

              <!-- 面试结果 -->
              <section class="content-result">
                <h2 class="info-title">面试状态</h2>
                <span :class="getResultClassObject(tab.result)">{{tab.recruitStatus}}</span>
              </section>
          </session>
        </div>
      </template>
      <template v-else>
        <div class="no-data">暂无数据</div>
      </template>
    </section>
  </div>
</template>
<script>
import infoTemplate from 'views/admin/pages/recruit/components/resume-detail/template/info'
import evaluationTemplate from 'views/admin/pages/recruit/components/resume-detail/template/evaluation'
import moment from 'moment'
export default {
  name: 'ResumeHistory',
  components: {
    infoTemplate,
    evaluationTemplate
  },
  props: {
    historyData: Object
  },
  data () {
    return {
      // 历史数据
      historyList: [],
      // basicInfo: [],
      // 面试结果
      recruitStatus: ''
    }
  },
  methods: {
    // 展开面试记录标题
    getHistortTitle (val) {
      return {
        show: val ? 'show' : '',
        hide: !val ? 'hide' : '',
        title: 'title'
      }
    },
    // 获取面试结果
    getResultClassObject (val) {
      return {
        // pass: val === '1' ? 'pass' : '',
        // out: val === '0' ? 'out' : '',
        out: 'out',
        result: 'result'
      }
    },
    // 是否展开内容
    changeContentShow (item, index) {
      let tab = item
      tab.showContent = !item.showContent
      this.$set(this.historyList, index, tab)
    },
    // 获取面试状态
    getRecruitStatus (val, item) {
      this.$d('INTERVIEW_PROCESS_STATUS', val).then(rs => {
        // item.recruitStatus = rs
        this.$set(item, 'recruitStatus', rs)
      })
    }
  },
  watch: {
    // 简历记录数据
    historyData (val) {
      let length = this.historyData.interviewRecordrs.length
      let item
      this.historyList = []
      for (let i = 0; i < length; i++) {
        item = this.historyData.interviewRecordrs[i]
        item.title = '应聘记录' + (i + 1)
        item.basicInfo = [
          {label: '姓名', value: this.historyData.name, span: 8},
          {label: '性别', value: this.historyData.gender, span: 8, dict: 'GENDER'},
          {label: '年龄', value: this.historyData.age + '', span: 8},
          {label: '应聘地区/区域', value: item.workAddress, span: 8},
          {label: '应聘组织', value: item.applyOrgId, span: 8, dict: 'APPLYORG'},
          {label: '应聘岗位', value: item.applyPositionId, span: 8}
        ]
        if (item.interviews.length) {
          item.resumeData = moment(item.interviewBeginDate).format('YYYY-MM-DD')
          // (item.resumeData = moment(parseInt(item.interviews[0].interviewDate)).format('YYYY-MM-DD'))
        }
        if (item.result) {
          this.getRecruitStatus(item.result, item)
        }
        if (i === length - 1) {
          item.showContent = true
        } else {
          item.showContent = false
        }
        this.historyList.push(item)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content-result {
  min-width: 850px;
  margin: 20px;
  .result {
    margin-left: 60px;
    padding: 10px 40px;
    font-size: 16px;
    border-radius: 3px;
  }
  .pass {
    color: #67C23A;
    background-color: #b3df9d;
    border: 1px solid #67C23A;
  }
  .out {
    color: #fd9a2d;
    background-color: #fce4cc;
    border: 1px solid #fdaa6d;
  }
}

.history {
  display: block;
  margin-bottom: 10px;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  border: 1px solid #ccc;
  .title {
    width: 100%;
    line-height: 36px;
    vertical-align: middle;
    font-size: 14px;
    color: #000;
  }
  .show {
    background-color: #f2e6e6;
    border-bottom: 1px solid #ccc;
  }
  .hide {
    background-color: #EBEEF5;
    border-bottom: 0;
  }
  .title-label {
    margin-left: 40px;
    color: #5a5e66;
  }
  .title-fr {
    margin-right: 20px;
    font-size: 12px;
    color: #5a5e66;
    cursor: pointer;
  }
}

.no-data {
  display: block;
  margin: 20px auto;
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #5a5e66;
}
</style>
