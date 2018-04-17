<template>
  <div class="full-screen" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="clearFix mt20">
      <!-- <el-button
        class="fr"
        type="text"
        @click="backToPlanDetail">
        <i class="icon iconfont icon-return fs30"></i>
      </el-button> -->
      <div class="clearFix session">
        <div class="title">{{title}} <el-checkbox v-model="isCollection" v-if="showFalg" :disabled="isEditable">收藏</el-checkbox></div>
         <el-form
          class="form"
          ref="form"
          label-width="140px"
          :model="formData">
            <el-form-item label="标签">
              <div>
                <new-tags ref="tags" :totalTags="labels" :editable="isEditable && limit10"></new-tags>
              </div>
            </el-form-item>
            <!-- <el-form-item label="标签">
              <div>
                <tags ref="tags" :totalTags="labels" :editable="isEditable"></tags>
              </div>
            </el-form-item> -->
            <el-form-item label="接收人" v-if="showFalg">
              <el-input
                v-model="recommendMan"
                class="peopleList ml10"
                :disabled="isEditable"
                placeholder="选择接收人"
                readonly
                @click.native="handleIconClick">
                <i slot="suffix" class="el-icon-menu" @click="handleIconClick" ></i>
              </el-input>
              <i-personnel-select
                :isShow.sync="isShow"
                @confirm="handleConfirm"
                multiple
                :autoClose="false"
                :limit="3"
                filterType="newContract"></i-personnel-select>
            </el-form-item>
             <el-form-item label="">
                <el-button
                  type="primary"
                  class="ml10 mt10"
                  @click="onSaveHandler">保存</el-button>
             </el-form-item>
          </el-form>
          <el-tabs v-model="mainTabs" class="mt20">
            <el-tab-pane
              label="简历详情"
              name="detail"
              class="flow-tab">
              <resume-detail :detailTotalData="detailDate"></resume-detail>
            </el-tab-pane>
            <template>
              <el-tab-pane
                label="应聘记录"
                name="history"
                class="flow-tab">
               <resume-history :historyData="detailDate"></resume-history>
              </el-tab-pane>
            </template>
          </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import access from 'mixins/access'
import NewTags from 'views/admin/pages/recruit/components/resume-detail/template/newTags'
import Tags from 'views/admin/pages/recruit/components/resume-detail/template/tags'
import resumeDetail from './components/resume-detail'
import resumeHistory from './components/resume-history'
import { ResumePageSource } from 'views/admin/pages/recruit/config'
import req from 'api/recruit/index'
export default {
  components: {
    Tags,         // 旧标签
    NewTags,      // 新标签
    resumeDetail,
    resumeHistory
  },
  mixins: [access],
  data () {
    return {
      showFalg: false,
      // loading
      fullscreenLoading: false,
      // 标题
      title: '简历',
      // 是否已收藏
      isCollection: false,
      // 选择器是否显示
      isShow: false,

      // 简历状态
      resumeStatus: '',
      // 简历推荐人id
      recommendManId: [],
      // 简历推荐人
      recommendMan: '',
      // 所有标签
      labels: [],

      // 简历详情数据
      detailDate: {},

      // 是否可编辑
      isEditable: this.checkIsSelfEnter(),
      // tab的name
      mainTabs: 'detail'
    }
  },
  created () {
    this.fullscreenLoading = true
    this.getDetailData()
    this.handleshowFalg()
  },
  methods: {
    handleshowFalg () {
      if (this.$route.name === '简历') {
        this.showFalg = false
      } else {
        this.showFalg = true
      }
    },
    // 返回
    backToPlanDetail () {
      this.$router.go(-1)
    },
    // 是否收藏简历
    collectionResume () {
      if (this.isEditable) {
        return
      }
      this.isCollection = !this.isCollection
    },
    // 个人选择器显示
    handleIconClick () {
      this.isShow = !this.isShow
    },
    // 个人选择器确认
    handleConfirm (selected) {
      let nameList = []
      let idList = []
      selected.map(item => {
        idList.push(item.employeeId)
        nameList.push(item.employeeName)
      })
      // console.log(nameList.toString())
      this.recommendMan = nameList.toString()
      this.recommendManId = idList
      this.isShow = false
    },
    // 设置推荐人
    setRecommendMan (recommendMans) {
      this.recommendManId = []
      this.recommendMan = ''
      let len = recommendMans.length
      let idList = []
      let nameList = []
      let recommendMan

      if (len !== 0) {
        while (len--) {
          recommendMan = recommendMans[len]
          idList.push(recommendMan.recommendManId)
          nameList.push(recommendMan.recommendManName)
        }

        this.recommendManId = idList
        this.recommendMan = nameList.toString()
      }
    },
    // 改变收藏状态
    changeCollection (value) {
      if (value === 'Y') {
        return true
      } else {
        return false
      }
    },
    // 保存
    onSaveHandler () {
      // if (this.isEditable) {
      //   return
      // }
      let resumeId = this.$route.query.resumeId
      this.$confirm('确定保存修改该简历？').then(() => {
        req('modifyResumeDetail', {
          resumeId,
          isCollect: this.isCollection ? 'Y' : 'N',
          recommendManId: this.recommendManId,
          resumeStatus: this.resumeStatus,
          addLabels: this.$refs.tags.getAddLabels(),
          deleteLabels: this.$refs.tags.getDeleteLabels(),
          updateLabels: this.$refs.tags.getUpdateLabels()
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.getDetailData()
        }).catch(err => console.log(err))
      }).catch(() => {})
    },
    // 检查是否是自助端进入
    checkIsSelfEnter () {
      let source = parseInt(this.$route.query.source)
      if (source === ResumePageSource.TOTAL ||
         source === ResumePageSource.COLLECTION ||
         source === ResumePageSource.RECOMMEND ||
         source === ResumePageSource.CHANNEL ||
         source === ResumePageSource.DEMANDRELEASE ||
         source === ResumePageSource.INTERINTERVIEW ||
         source === ResumePageSource.DEMANDMANAGEER) {
        return false
      }
      return true
    },
    // 获取简历详情数据
    getDetailData () {
      let resumeId = this.$route.query.resumeId
      req('resumeDetail', {resumeId}).then((res) => {
        // console.log(res)
        this.setBasicInfo(res)
        this.detailDate = Object.assign({}, this.detailDate, res)
        this.fullscreenLoading = false
      }).catch(err => {
        console.log(err)
        this.fullscreenLoading = false
      })
    },
    // 设置基础信息
    setBasicInfo (data) {
      this.title = data.name + '的简历'
      this.isCollection = this.changeCollection(data.isCollect)
      this.setRecommendMan(data.recommendMans)
      this.resumeStatus = data.resumeStatus
      if (data.labels) {
        this.labels = data.labels
        // this.toFormDataTags(data.labels)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.fs30 {
  font-size: 30px;
}
.session {
  .title {
    font-size: 30px;
    text-align: center;
  }
  .collection {
    margin-top: 20px;
    cursor: pointer;
    text-align: center;
  }
  .form {
    display: flex;
    width: 1000px;
    flex-direction: column;
    margin-top: 30px;
    .peopleList {
      width: 300px;
    }
  }
}
.full-screen {
  padding-top: 80px;
  position: static;
}
</style>
