<template>
  <div>
    <i-layout>
      <div slot="section" class="main-salary">
        <div v-if="bgFont" class="bgFont">
          <!-- <i class="iconfont icon-ziyuan iconfont1"></i> -->
          <img src="../../../../../assets/images/bg-salary.png" alt="">
          <p v-if="payYear != 'Invalid date'" v-text="'没有查到' + payYear + '-' +payMonth +'的工资记录'"></p>
          <p v-else v-text="'请选择查询的月份'" id="showFont"></p>
        </div>
        <el-popover
            ref="popHeader"
            placement="bottom"
            width="220"
            :visible-arrow="false"
            trigger="hover"
            >
            <span class="my-title" slot="reference">
              <i class="iconfont icon-ziyuan1"></i>
              查看薪资标准
            </span>
            <div class="Standard">
              <p>
                &nbsp;&nbsp;&nbsp;职&nbsp;&nbsp;&nbsp;&nbsp;位:
                <span v-text="Param.posPositionName"></span>
              </p> 
              <p>
                &nbsp;&nbsp;&nbsp;部&nbsp;&nbsp;&nbsp;&nbsp;门:
                <span v-text="Param.orgName"></span>
              </p> 
              <p v-if="Param.isMonthStandard && Param.monthStandard">
                月薪标准: 
                <span v-text="Param.monthStandard + '元/月'"></span>
              </p> 
              <p v-else-if="Param.hourStandard">
                时薪标准: 
                <span v-text="Param.hourStandard + '元/时'"></span>
              </p> 
            </div>
        </el-popover>
        <el-date-picker
          class="my-month"
          v-model="month"
          type="month"
          placeholder="选择月"
          @blur="monthBlur">
        </el-date-picker>
        <!-- <div v-if="showArrow">
          <el-button
            @click="pev()"
            size="mini"
            class="pev"
            :disabled="disabledPev">
            <span class="el-icon-arrow-left"></span>
          </el-button>
          <el-button
            @click="next()"
            size="mini"
            class="next"
            :disabled="disabledNext">
            <span class="el-icon-arrow-right"></span>
          </el-button>
        </div> -->
        <el-tabs v-model="activeName" @tab-click="handleClick" class="my-tab">
          <el-tab-pane
            v-for="(item,index) in tabs"
            v-model="activeName"
            :key="index"
            :label="item.payYear + '-' + item.payMonth"
            :name="index + 1"
            @tab-click="handleClick"
            >
            <div class="box">
              <ul 
                v-for="(col,index) in table.columns"
                :key="index" 
                class="content">
                <p class="title" v-text="loopStopWatch('COMPONENT_TYPE', index)"></p>
                <li v-for="(item,idx) in col" :key="idx">
                  <span v-text="item.componentName" :key="idx"></span>
                  <span v-text="item.calculatedValue" class="my-salary-right" :key="idx"></span>
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </i-layout>
  </div>
</template>

<script>
  import req from 'api/self/my-salary'
  import moment from 'moment'
  import { globalComponentVariable } from 'config/globalComponentVariable'
  import { getSelectData } from 'utils/index.js'

  export default {
    name: 'MySalary',
    data () {
      return {
        // 导航栏
        month: '',
        payYear: '',
        payMonth: '',
        pageIndex: 1,
        activeName: 1,
        tabs: [],
        blue: null,
        isReq: true,
        bgFont: false,
        showArrow: false,
        disabledPev: false,
        disabledNext: false,
        mabiao: {
          COMPONENT_TYPE: []
        },
        // 薪资标准
        Param: {
          posPositionName: '',
          orgName: '',
          hourStandard: '',
          monthStandard: '',
          isMonthStandard: true,
          showFont: true
        },
        table: {
          columns: [
            // { prop: 'componentName', label: '固定项目', align: 'left', width: '120' },
            // { prop: 'areaName', label: '绩效奖金', align: 'right', width: '120' },
            // { prop: 'areaName', label: '应发合计', align: 'right', width: '120' },
            // { prop: 'areaName', label: '代扣代缴', align: 'right', width: '120' },
            // { prop: 'areaName', label: '代税合计', align: 'right', width: '120' },
            // { prop: 'areaName', label: '实发工资', align: 'right', width: '120' }
          ],
          arr: []
        }
  
      }
    },
    created () {
      this.fetch()
      this.stopWatch()
    },
    methods: {
      stopWatch (stopWatch) {
        this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('COMPONENT_TYPE'), 'COMPONENT_TYPE')
      },
      stopWatchInquiry (url, tableName) {
        getSelectData(url, true).then(res => {
          this.mabiao[tableName] = res
        })
      },
      loopStopWatch (tableName, value) {
        if (!this.mabiao[tableName]) {
          return value
        }
        if (!isNaN(value)) {
          for (let i = 0; i < this.mabiao[tableName].length; i++) {
            if (value === this.mabiao[tableName][i].value) {
              return this.mabiao[tableName][i].label
            }
          }
        } else {
          return value
        }
      },
      fetch (options = {}) {
        req('getPayTime', options = {
          payYear: this.payYear, payMonth: this.payMonth
        }).then(res => {
          if (res) {
            this.tabs = res.data
            if (res.data.length) {
              this.bgFont = false
              this.showFont = true
            } else {
              this.bgFont = true
              this.showFont = false
            }
            if (this.isReq) {
              this.payYear = res.data[0].payYear
              this.payMonth = res.data[0].payMonth
              this.fetchbur(options = {payYear: this.payYear, payMonth: this.payMonth})
              this.isReq = false
            }
          }
        })
        req('getSalaryStandard', options = {}).then(res => {
          this.Param = res
        })
      },
      fetchbur (options = {}) {
        req('getSelfIncome', options = {payYear: this.payYear, payMonth: this.payMonth}).then(res => {
          this.table.columns = res
          if (JSON.stringify(res) === '{}') {
            this.bgFont = true
          } else {
            this.bgFont = false
          }
        })
      },
      // pev () {
      //   this.pageIndex --
      //   if (!this.pageIndex) {
      //     this.disabledPev = true
      //   }
      //   if (this.pageIndex) {
      //     this.fetch(this.pageIndex)
      //   }
      //   this.disabledNext = false
      // },
      // next () {
      //   this.pageIndex ++
      //   this.disabledPev = false
      //   if (this.pageSize < 12) {
      //     this.disabledNext = true
      //   }
      //   this.fetch(this.pageIndex)
      // },
      handleClick (tab, event) {
        this.payYear = tab.label.slice(0, 4)
        this.payMonth = tab.label.slice(5)
        this.fetchbur({payYear: this.payYear, payMonth: this.payMonth})
      },
      monthBlur () {
        this.activeName = 1
        this.payYear = moment(this.month).format('YYYY')
        this.payMonth = moment(this.month).format('MM')
        this.fetch({payYear: this.payYear, payMonth: this.payMonth})
        this.fetchbur({payYear: this.payYear, payMonth: this.payMonth})
      }

    }
  }
</script>

<style scoped>
  li {
    /* width: 190px; */
    padding: 10px
  }
  .bgFont {
    position: absolute;
    width: 400px;
    height: 400px;
    left:50%;
    top:250px;
    margin-left: -100px;
    /* margin-top: -50px; */
  }
  .bgFont>p {
    margin-top: 25px;
    margin-left: -5px
  }
  .box {
    overflow: auto;
    width: 100%;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    /* -webkit-box-pack: center;  居中*/
  }
  #showFont {
    margin-left: 18px
  }
  .content {
    position: relative;
    /* float: left; */
    width: 190px;
    border: 1px solid #E8E8E8
  }
  .Standard {
    margin: 15px;
  }
  .Standard>p {
    margin-bottom: 10px
  }
  .title {
    height: 36px;
    text-align: center;
    line-height: 36px;
    background: #e5e9f2;
  }
  .my-salary-right {
    position: absolute;
    right: 5px
  }
  .pev {
    position: absolute;
    top: 80px;
    left: 0;
  }
  .next {
    position: absolute;
    top: 80px;
    right: 0;
  }
  .my-pag {
    position: absolute;
    top: 40px;
  }
  .main-salary {
    position: relative;
  }
  .my-month {
    position: absolute;
    width: 120px;
    top: 10px;
    right: 20px;
  }
  .my-tab {
    margin-top: 55px;
    margin-left: 23px;
    margin-right: 23px
  }
  .my-title {
    margin-top: 26px;
    margin-left: 20px;
    font-size: 14px;
    color: #4AACFF
  }
  .blue {
    font-size: 16px; 
    color: #4AACFF
  }
  #iconfont {
    margin-top: 20px;
    margin-left: 24px;
  }
</style>