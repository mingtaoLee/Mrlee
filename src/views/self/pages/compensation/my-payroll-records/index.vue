<template>
  <i-layout>
    <template slot="section">
      <div v-if="bgFont" class="bgFont">
        <img src="../../../../../assets/images/bg-salary.png" alt="">
        <p v-text="'没有查到' + searchParam.searchDate +'年的调薪记录'"></p>
      </div>
      <div class="block checkYear">
        <el-date-picker
          v-model="searchParam.searchDate"
          type="year"
          @blur="yrarBlur">
        </el-date-picker>
      </div>
      <el-row
        v-if="isShowDialog"
        :gutter="20">
        <el-col :span="6"
          v-for="(item,index) of data"
          :key="index">
          <div class="grid-content">
            <ul>
              <li>
                现职位
                <span v-text="item.newJobName"></span>
              </li>
              <li>
                <strong>
                  调薪后
                  <span>
                    <strong v-if="item.isIncreaseSalary && item.salaryRate != '-1.0'" class="red">↑ </strong>
                    <strong v-else-if="item.salaryRate && item.salaryRate != '-1.0'" class="green">↓ </strong>
                    <strong v-text="searchParam.standard[index]"></strong>
                  </span>
                </strong>
              </li>
              <li>
                薪资标准
                <span v-text="item.salaryStandard"></span>
              </li>
              <li>
                调薪类别
                <span v-text="loopStopWatch('PAY_ADJUST_TYPE', item.adjustType)"></span>
              </li>
              <li>
                时间
                <span v-text="item.effectiveDate"></span>
              </li>
              <li>
                <div v-if="item.salaryRate && item.salaryRate != '-1.0'" class="progres">
                  <div :style="'width:'+ item.bgWidth +'%;'">
                    <div :class="ProgressBarColor[index]"></div>
                  </div>
                </div>
              </li>
              <li>
                <strong v-if="item.isIncreaseSalary && item.salaryRate != '-1.0'" class="red">↑ 
                  <strong v-text="searchParam.salaryRate[index]"></strong>
                </strong>
                <strong v-else-if="item.salaryRate && item.salaryRate != '-1.0'" class="green">↓
                  <strong v-text="searchParam.salaryRate[index]"></strong>
                </strong>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </template>
  </i-layout>
</template>

<script>
  import req from 'api/self/my-payroll-records'
  import moment from 'moment'
  import { globalComponentVariable } from 'config/globalComponentVariable'
  import { getSelectData } from 'utils/index.js'

  export default {
    // name: 'MyPayrollRecords',
    data () {
      return {
        // 查询参数
        searchParam: {
          searchDate: moment(new Date()).format('YYYY'),
          newJobName: '',
          salaryRate: [],
          salaryStandard: '',
          adjustType: '',
          effectiveDate: null,
          // monthStandard: [],
          // hourStandard: [],
          standard: []
        },
        mabiao: {
          PAY_ADJUST_TYPE: []
        },
        bgFont: false,
        isShowDialog: false,
        ProgressBarColor: [],
        isIncreaseSalary: false,
        data: null
      }
    },
    created () {
      this.fetch()
      this.stopWatch()
    },
    methods: {
      stopWatch (stopWatch) {
        this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('PAY_ADJUST_TYPE'), 'PAY_ADJUST_TYPE')
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
        req('getMyPayrollRecords', options = {searchDate: this.searchParam.searchDate}).then(res => {
          if (!res.length) {
            this.bgFont = true
          } else {
            this.bgFont = false
          }
          if (res) {
            res.map(item => {
              if (item.salaryRate >= 100) {
                item.bgWidth = 100
              } else {
                item.bgWidth = item.salaryRate
              }
              if (item.monthStandard) {
                this.searchParam.standard.push(item.monthStandard)
              } else if (item.hourStandard) {
                this.searchParam.standard.push(item.hourStandard)
              }
              if (item.salaryRate) {
                let value = item.salaryRate + '%'
                this.searchParam.salaryRate.push(value)
              }
              if (item.isIncreaseSalary) {
                this.ProgressBarColor.push('bg-red')
              } else {
                this.ProgressBarColor.push('bg-green')
              }
              if (item.effectiveDate) {
                item.effectiveDate = item.effectiveDate.slice(0, 4) + '年' + item.effectiveDate.slice(5, 7) + '月'
              }
            })
            this.data = res
            this.isShowDialog = true
          }
        })
      },
      yrarBlur () {
        this.searchParam.searchDate = moment(this.searchParam.searchDate).format('YYYY')
        this.fetch(this.searchParam.searchDate)
      }
    }
  }
</script>

<!--[if IE]> 	
    <style scoped>
    el-col .grid-content {
      padding-bottom: 50px;      
    }
    </script>
<![endif]-->

<style scoped>
  span {
    position: absolute;
    right: 10.8px
  }
  strong {
    font-size: 20px
  }
  li {
    margin: 10px
  }
  .iconfont {
    font-size: 170px;
    color: #BDBDBD
  }
  .bgFont {
    position: absolute;
    width: 600px;
    height: 600px;
    left:50%;
    top:50%;
    margin-left:-100px;
    margin-top:-100px;
  }
  .bgFont>p {
    margin-top: 25px;
    /* margin-left: 15px; */
    font-size: 12px;
    color: #959595
  }
  .progres {
    width: 100%;
    height: 8px;
    background-color: #D8D8D8
  }
  .bg-green {
    height: 8px;
    background-color: #52E69D
  }
  .bg-red {
    height: 8px;    
    background-color: #FF7675
  }
  .checkYear { 
    position: absolute;
    right: 20px;
    top: 15px;
    width: 120px;
  }
  .el-row {
    margin-top: 45px;
  }
  .grid-content {
    position: relative;
    border: 1px solid #D1D1D1;    
    padding-left: 1.1%;
    padding-top: 2.4%;
    margin-bottom: 15px;
    height: 200px;
  }
  .green {
    color:#52E69D;
    font-size: 27px;
    width: 5px;
    height: 2px;
    overflow: hidden;
    font-weight: bold
  }
  .red {
    color: #FF7675;
    font-size: 27px
  }
  .arrow {
    width: 10px;
    height: 10px;
    overflow: hidden;
  }
</style>
