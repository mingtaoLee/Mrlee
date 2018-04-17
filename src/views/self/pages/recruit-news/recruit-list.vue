<template>
  <div
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loadMoreBusy"
    infinite-scroll-distance="0"
    class="recuit-page"
  >
    <i-form
      @reset="reset"
      @search="search"
      class="header-table">
      <el-form-item label="用人部门">
        <el-input v-model="query.applyOrgName"></el-input>
      </el-form-item>
      <el-form-item label="招聘岗位">
        <el-input v-model="query.applyPositionName"></el-input>
      </el-form-item>
      <el-form-item label="工作地点">
        <el-input v-model="query.workAddress"></el-input>
      </el-form-item>
    </i-form>
    <div class="list-wrap">
      <template v-for="item in recruitList">
        <router-link :to="'/recruit/recruitDetail/'+item.rctRequirementId">
          <recruit-item :data="item"></recruit-item>
        </router-link>
      </template>
    </div>
    <div class="loading" v-show="loadMoreBusy">
      <loading v-show="loadMoreBusy"></loading>
    </div>
  </div>
</template>
<script>
import RecruitItem from 'views/self/pages/common/recruit-item'
import Loading from 'views/self/pages/common/loading'
import { clone } from 'utils'
import req from 'api/self/home'
export default {
  name: 'RecruitList',
  components: {
    RecruitItem,
    Loading
  },
  data () {
    return {
      recruitList: [],
      pageInfo: {
        next: 1,
        pageIndex: 1,
        pageSize: 10
      },
      query: {
        applyOrgName: null,
        applyPositionName: null,
        workAddress: null
      },
      confirmQuery: {},
      fetchAll: false,
      loadMoreBusy: false,
      isIndex: false
    }
  },
  methods: {
    // 加载更多
    loadMore () {
      if (this.fetchAll || this.loadMoreBusy) {
        return false
      }
      this.loadMoreBusy = true
      this.getRecruitList().then(res => {
        this.recruitList = this.recruitList.concat(res.data)
        this.loadMoreBusy = false
        if (res.data.length < this.pageInfo.pageSize) {
          this.fetchAll = true
        }
      })
    },
    // 获取招聘列表
    getRecruitList () {
      let info = this.pageInfo
      let query = this.confirmQuery
      let params = {
        pageIndex: info.next,
        pageSize: info.pageSize,
        applyOrgName: query.applyOrgName,
        applyPositionName: query.applyPositionName,
        workAddress: query.workAddress
      }
      if (this.isIndex) {
        params.pageIndex = 1
        this.isIndex = false
      }
      return req('getRecruitList', params).then(res => {
        this.pageInfo = res.info
        return res
      })
    },
    reset () {
      this.query = {
        applyOrgName: null,
        applyPositionName: null,
        workAddress: null
      }
      this.confirmQuery = {}
    },
    // 招聘查询
    search () {
      this.confirmQuery = clone(this.query)
      this.isIndex = true
      this.getRecruitList().then(res => {
        console.log(res)
        this.recruitList = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .header-table {
    height: 58px;
    line-height: 58px;
    margin-bottom: 15px;
    background: #f8f8f8;
    border: 1px solid #e6ebf5;
  }
  .recuit-page {
    font-family: PingFangSC-Regular;
    .list-wrap {
      padding: 0 18px;
      background-color: #ffffff;
      border: 1px solid #e6ebf5;
      a:last-child .recuit-item{
        border-bottom: none !important;
      }
    }
    .loading {
      height: 40px;
      padding: 10px 0;
    }
  }
</style>
<style lang="scss">
  .el-main {
    background: #f8f8f8 !important;
  }
</style>
