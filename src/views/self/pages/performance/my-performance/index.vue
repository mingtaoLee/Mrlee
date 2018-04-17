<template>
  <i-layout>
    <my-component-one slot="aside">
      <!-- <div>
        <el-tree
        highlight-current
        :data="treeData"
        @node-click="treeNodeClick"
        ></el-tree>
      </div> -->
      <aside v-loading="loading" :element-loading-text="$loadingText">
        <pending :pendingList="pendingList" :loading="loading"></pending>
      </aside>
    </my-component-one>
    <my-component-two slot="header">
      <i-form @reset="resetInputs" @search="searchOrg">
        <el-form-item label="年度：">
            <el-date-picker
              v-model="search.year"
              type="year"
            >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="绩效跨度：">
          <!-- <i-select v-model="search.status"></i-select> -->
           <el-select v-model="search.quarterly" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </i-form>
    </my-component-two>
    <my-component-three  slot="section">
      <div v-if="showIcon">
        <i-svg-icon iconName="jixiaokong" :styleName="iconStyle"></i-svg-icon>
        <span class="noData">暂无数据</span>
      </div>
      <card v-for="item in plansList" :itemData="item" :key="item.planId"
        @click.native="goPlanDetail(item,item.employeePlanStatus,item.planId)">
      </card>
      <br clear="all" />
      <div class="pagination" v-if="!showIcon">
        <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="9"
          :total="plansListLength">
        </el-pagination>
      </div>
    </my-component-three>
  </i-layout>
</template>

<script>
  import moment from 'moment'
  import req from 'api/performance/self'
  import card from './card.vue'
  import pending from './pending'
  import ISvgIcon from 'components/common/i-svg-icon'

  export default {
    name: 'choose',
    components: {
      card,
      pending,
      ISvgIcon
    },
    data () {
      return {
        search: {     // 表格条件查询表单
          year: new Date(),
          quarterly: ''
        },
        options: [{
          value: '1',
          label: '全部'
        }, {
          value: '2',
          label: '按月度'
        }, {
          value: '3',
          label: '按季度'
        }, {
          value: '4',
          label: '按半年度'
        }],
        iconStyle: `width: 1000px; position: absolute;top: 250px; left:50%;margin-left: -400px;`,
        isHidden: false,
        pendingList: [],
        plansList: [],
        plansListLength: 0,
        currentPage: 1, //
        pageIndex: 1,
        pageSize: 9, // 分页器每页显示个数
        period: 1,
        loading: true,
        showIcon: false,
        mabiao: {
          processStatus: []
        }
      }
    },
    created () {
      this.getPlan()
      this.getToTask()
    },
    methods: {
      // 查询
      searchOrg () {
        this.search.year = moment(this.search.year).format('YYYY')
        if (this.search.year === 'Invalid date') {
          this.search.year = ''
        }
        this.period = this.search.quarterly
        console.log(this.search.year)
        req('planSelf', {
          year: this.search.year,
          period: this.period,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          employeeId: '121'
        }).then(({data, total}) => {
          if (data.length) {
            this.showIcon = false
          } else {
            this.showIcon = true
          }
          if (Array.isArray(data)) {
            this.plansList = data
            this.plansListLength = total
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      resetInputs () {
        for (let key in this.search) {
          this.search[key] = ''
        }
      },
      // 获取我的列表
      getPlan () {
        this.search.year = moment(this.search.year).format('YYYY')
        this.period = this.search.quarterly
        req('planSelf', {
          year: this.search.year,
          period: this.period,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          employeeId: '121'
        }).then(({data, total}) => {
          if (data.length) {
            this.showIcon = false
          } else {
            this.showIcon = true
          }
          if (Array.isArray(data)) {
            this.plansList = data
            this.plansListLength = total
            // console.log(this.plansList)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取代办列表
      getToTask () {
        req('myTask').then((data) => {
          // console.log(data)
          this.loading = true
          if (Array.isArray(data)) {
            this.pendingList = data
            // console.log(this.pendingList)
            this.loading = false
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      goPlanDetail (item, status, id) {
        if (status === '00') {
          return
        }
        if (item.isCalculateByChidren === 'Y') {
          return
        }
        window.open(this.$router.resolve(`performance/${id}/plan_detail`).href, '_blank')
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageIndex = this.currentPage
        req('planSelf', {
          year: this.search.year,
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
      }
    }
  }
</script>

<style>
  .aside p {
    font-size: 14px
  }
  .aside ul {
    margin-left: 17px;
    font-size: 14px
  }
  .noData {
     position: absolute;
     top: 400px;
     left:50%;
     margin-left: 80px
  }
  /* .boxs {
    position: relative;
    background-color: #F8F8F8;
    overflow: hidden;
    float: left;
    margin-bottom: 15px;
    width: 399px;
    height: 112px;
    margin: 8px;
  } */
  .status {
    position: absolute;
    text-align: center;
    color: #FFFFFF;
    line-height: 38.8px;
    top: 10px;
    right: -25px;
    width: 190px;
    height: 38.8px;
    background-color: #FF8787;
    transform:rotate(30deg);
  }
  .title {
    font-size: 18px;
    /* font-weight: bold; */
  }
  /* .boxs li {
    padding: 19px 21px 19px 21px
  } */
  .content {
    font-size: 14px
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
</style>
