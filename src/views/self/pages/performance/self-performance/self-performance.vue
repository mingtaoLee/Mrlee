<template>
  <div>
    <!-- <self-header></self-header> -->
    <div class="my-performance">
      <div class="crumb">
        <p>我的位置:</p>
        <crumbs @showSidebar="toggleSidebar" :isShow="isHidden"></crumbs>
      </div>
      <div class="main">
        <div class="content">
          <h2>
            <span class="ml20">我的绩效记录</span>
          </h2>
          <div class="select">
            <div class="head">
              年度：
            </div>
            <choose :selections="yearDict" @onChange="changeYear">
            </choose>
            <div class="dash"></div>
            <div class="head">
              绩效跨度：
            </div>
            <choose :selections="typeDict" @onChange="changeType">
            </choose>
          </div>
          <hr>
          <div class="card-list">
            <card v-for="item in plansList" :itemData="item" :key="item.planId"
                  @click.native="goPlanDetail(item,item.employeePlanStatus,item.planId)"></card>
          </div>
          <div class="pagination">
            <el-pagination
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :page-size="9"
              :total="plansListLength">
            </el-pagination>
          </div>
        </div>
        <aside v-loading="loading" :element-loading-text="$loadingText">
          <pending :pendingList="pendingList" :loading="loading"></pending>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
  import card from './card.vue'
  import choose from './choose.vue'
  import Crumbs from 'components/common/layout/crumbs'
  import pending from './pending'
  import req from 'api/performance/self'
  import SelfHeader from 'components/common/i-header/i-header'

  export default {
    name: 'my-performance',
    components: {
      SelfHeader,
      card,
      choose,
      Crumbs,
      pending
    },
    data () {
      return {
        yearDict: [
          {
            label: (new Date()).getFullYear() + '年度',
            value: (new Date()).getFullYear()
          },
          {
            label: (new Date()).getFullYear() - 1 + '年度',
            value: (new Date()).getFullYear() - 1
          },
          {
            label: (new Date()).getFullYear() - 2 + '年度',
            value: (new Date()).getFullYear() - 2
          },
          {
            label: (new Date()).getFullYear() - 3 + '年度',
            value: (new Date()).getFullYear() - 3
          },
          {
            label: (new Date()).getFullYear() - 4 + '年度',
            value: (new Date()).getFullYear() - 4
          },
          {
            label: (new Date()).getFullYear() - 5 + '年度',
            value: (new Date()).getFullYear() - 5
          },
          {
            label: (new Date()).getFullYear() - 6 + '年度',
            value: (new Date()).getFullYear() - 6
          },
          {
            label: (new Date()).getFullYear() - 7 + '年度',
            value: (new Date()).getFullYear() - 7
          },
          {
            label: (new Date()).getFullYear() - 8 + '年度',
            value: (new Date()).getFullYear() - 8
          },
          {
            label: (new Date()).getFullYear() - 9 + '年度',
            value: (new Date()).getFullYear() - 9
          }
        ],
        typeDict: [
          {
            label: '全部',
            value: '1'
          },
          {
            label: '按月度',
            value: '2'
          },
          {
            label: '按季度',
            value: '3'
          },
          {
            label: '按半年度',
            value: '4'
          }
        ],
        isHidden: false,
        pendingList: [],
        plansList: [],
        plansListLength: 0,
        currentPage: 1, //
        pageIndex: 1,
        pageSize: 9, // 分页器每页显示个数
        year: (new Date()).getFullYear(),
        period: 1,
        loading: true
      }
    },
    created () {
      this.getPlan()
      this.getToTask()
    },
    methods: {
      toggleSidebar () {
        this.isHidden = !this.isHidden
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageIndex = this.currentPage
        req('planSelf', {
          year: this.year,
          period: this.period,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          employeeId: '121'
        }).then(({data, total}) => {
          if (Array.isArray(data)) {
            this.plansList = data
            this.plansListLength = total
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      changeYear (value) {
        this.year = value.value
        req('planSelf', {
          year: this.year,
          period: this.period,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          employeeId: '121'
        }).then(({data, total}) => {
          console.log(data)
          if (Array.isArray(data)) {
            this.plansList = data
            this.plansListLength = total
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      changeType (value) {
        this.period = value.value
        req('planSelf', {
          year: this.year,
          period: this.period,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          employeeId: '121'

        }).then(({data, total}) => {
          if (Array.isArray(data)) {
            this.plansList = data
            this.plansListLength = total
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getPlan () {
        req('planSelf', {
          year: this.year,
          period: this.period,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          employeeId: '121'
        }).then(({data, total}) => {
          if (Array.isArray(data)) {
            this.plansList = data
            this.plansListLength = total
            console.log(this.plansList)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getToTask () {
        req('myTask').then((data) => {
          console.log(data)
          this.loading = true
          if (Array.isArray(data)) {
            this.pendingList = data
            this.loading = false
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      goPlanDetail (item, status, id) {
        if (item.isCalculateByChidren === 'Y') {
          return
        }
        window.open(this.$router.resolve(`performance/${id}/plan_detail`).href, '_blank')
      }
    }
  }

</script>


<style scoped lang="scss">
  .my-performance {
    width: 1366px;
    margin: 0 auto;
    background-color: white;
    .crumb {
      margin-left: 30px;
      display: flex;
      p {
        padding: 10px;
      }
    }
    .head {
      display: inline-block;
      vertical-align: top;
      text-align: center;
      line-height: 50px;
      width: 100px;
      height: 50px;
    }
    .main {
      display: flex;
      padding-bottom: 66px;
    }
    .content {
      margin-left: 82px;
      width: 936px;
      .card-list {
        display: flex;
        flex-wrap: wrap;
        padding-top: 20px;

      }
      .select {
        width: auto;
        height: auto;
        margin-top: 16px;
        margin-bottom: 21px;
        border: 1px solid black;
      }
      .dash {
        width: 900px;
        margin: 0 auto;
        border: 1px dashed black;
      }
      .pagination {
        display: flex;
        justify-content: center;
        margin-top: 8px;
      }
      h2 {
        height: 33px;
        background-color: #F2F2F2;
        font-size: 16px;
        line-height: 33px;
      }
    }
    aside {
      margin-left: 38px;
      width: 238px;
      height: 382px;
      background-color: #F2F2F2;
    }
  }


</style>
<style lang="scss">
  .my-performance {
    aside {
      .el-loading-mask {
        z-index: 100;
      }
    }
  }
</style>
