<template>
  <div class="full-screen" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="clearFix">
      <el-button
        class="fr"
        type="text"
        @click="backToPlanDetail">
        <i class="icon iconfont icon-return fs30"></i>
      </el-button>
    </div>
    <!-- 职位信息 -->
    <demand-info :positionInfo="demandForm.requirementInfo"></demand-info>

    <!-- 招聘原因 -->
    <demand-reason :reasonInfo="demandForm.reasons"></demand-reason>

    <!-- 岗位详情 -->
    <demand-detail :detailInfo="demandForm.jobDetail"></demand-detail>

    <!-- 任职要求 -->
    <demand-require :requireInfo="demandForm.jobDetail"></demand-require>
  </div>
</template>
<script>
import DemandInfo from 'views/admin/pages/recruit/components/demand/info'
import DemandReason from 'views/admin/pages/recruit/components/demand/reason'
import DemandRequire from 'views/admin/pages/recruit/components/demand/require'
import DemandDetail from 'views/admin/pages/recruit/components/demand/detail'
import req from 'api/recruit'
import { getDict } from 'utils'
import moment from 'moment'
export default {
  components: {
    DemandInfo,
    DemandReason,
    DemandRequire,
    DemandDetail
  },
  data () {
    return {
      // loading
      fullscreenLoading: false,
      // 办公用品数据
      officeSuppliesList: [],
      demandForm: {
        //  ------- 职位信息 ----------
        requirementInfo: {
          name: '',
          applyOrgId: '',
          applyOrgNode: '',
          applyPositionId: '',
          applyPositionName: '',
          reportManId: '',
          reportManName: '',
          relationManId: '',
          relationManName: '',
          receiveEmail: '',
          fixationNum: '',
          existingNum: '',
          recruitNum: '',
          // floorSalary: '',
          // ceilSalary: '',
          salaryScope: '',
          // workAddress: '',
          // areaId: '',
          workAddress: '',
          planInDate: '',
          posList: [],
          empType: '',
          isPlatform: '',
          officeSupplies: ''
        },

        //  ------- 招聘原因 ----------
        reasons: {
          reasonType: '',
          reason: ''
        },

        jobDetail: {
          //  ------- 任职要求 ----------
          educationBackground: '',
          major: '',
          // floorWorkYear: '',
          // floorAge: '',
          // ceilAge: '',
          experienceType: '',
          workRequirement: '',
          specialSkill: '',
          gender: '',
          otherRequirement: '',

          // ------- 岗位详情 ----------
          positionStatement: '',
          targetProfession: '',
          targetEnterprise: '',
          targetPosition: '',
          targetPositionName: ''
        }
      }
    }
  },
  created () {
    this.getOfficeList()
    this.getDetail()
  },
  methods: {
    // 返回
    backToPlanDetail () {
      this.$router.go(-1)
    },
    // 获取办公用品数据
    getOfficeList () {
      getDict('OFFICE_SUPPLIES').then(res => {
        console.log(res)
        this.officeSuppliesList = res
      })
    },
    // 获取详情
    getDetail () {
      let officeSupplyName = []
      let requirementId = this.$route.query.requirementId
      this.fullscreenLoading = true
      req('requirementDetail', {requirementId}).then((res) => {
        this.demandForm = Object.assign({}, this.demandForm, res)
        this.demandForm.requirementInfo.planInDate = this.dateFormat(res.requirementInfo.planInDate)
        for (let i = 0; i < res.requirementInfo.officeSupplies.length; i++) {
          this.officeSuppliesList.forEach(item => {
            if (res.requirementInfo.officeSupplies[i] === item.value) {
              officeSupplyName.push(item.label)
            }
          })
        }
        res.requirementInfo.officeSuppliesStr = officeSupplyName.join(',')
        this.fullscreenLoading = false
      }).catch(err => {
        console.log(err)
        this.fullscreenLoading = false
      })
    },
    // 格式化时间
    dateFormat (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.fs30 {
  font-size: 30px;
}
.full-screen {
  padding-top: 5px;
  position: static;
}
</style>
