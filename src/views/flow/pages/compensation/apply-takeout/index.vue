<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      @submit="sendAll"
      :postFlow="postFlow"
      :processType="paySalaryApprovalProcess">

      <section 
        class="content-follow" 
        slot="applyTakeout" 
        v-loading="loading"
        :element-loading-text="$loadingText"
      >
        <h2 class="info-title">申请出款</h2>
        <div>
          <p class="head">
            <span class="reason">申请原因 : {{allData.auditReason}}</span>
            <span class="amount">总金额 : <b>{{allData.finalPayingAmount}} 元</b></span>
            <span class="headPeopel">总人数 : <b>{{allData.totalNumber}} 人</b></span>
          </p>
        </div>
        <div class="table" v-if="showMap.DirectSummaryTable && allData.DirectSummary.length ? true : false">
          <div>
            <p>
              <span class="title">出款方式 : 拜特-转账</span>
              <span class="totalMoney">总金额 : <b>{{allData.DirectSummaryTotal.betiPeopleNumber}} 元</b></span>
              <span class="totalPeople">总人数 : <b>{{allData.DirectSummaryTotal.beitTotalNumber}} 人</b></span>
            </p>
            <div class="tab">
              <el-table
                :data="allData.DirectSummary"
                border
                :summary-method="getSummaries"
                show-summary
                style="width: 1472px"
              >
                <el-table-column
                  v-for="(col, idx) of columns"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                  :width="col.width"
                  :align="col.align"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="table" v-if="showMap.OfferSummaryTable && allData.OfferSummary.length ? true : false">
          <div>
            <p>
              <span class="title">出款方式 : 报盘</span>
              <span class="totalMoney">总金额 : <b>{{allData.OfferSummaryTotal.betiPeopleNumber}} 元</b></span>
              <span class="totalPeople">总人数 : <b>{{allData.OfferSummaryTotal.beitTotalNumber}} 人</b></span>
            </p>
            <div class="tab">
              <el-table
                :data="allData.OfferSummary"
                border
                :summary-method="getSummaries"
                show-summary
                style="width: 1472px"
              >
                <el-table-column
                  v-for="(col, idx) of columns"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                  :width="col.width"
                  :align="col.align"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="table" v-if="showMap.CashSummaryTable && allData.CashSummary.length ? true : false">
          <div>
            <p>
              <span class="title">出款方式 : 现金</span>
              <span class="totalMoney">总金额 : <b>{{allData.CashSummaryTotal.betiPeopleNumber}} 元</b></span>
              <span class="totalPeople">总人数 : <b>{{allData.CashSummaryTotal.beitTotalNumber}} 人</b></span>
            </p>
            <div class="tab">
              <el-table
                :data="allData.CashSummary"
                border
                :summary-method="getSummaries"
                show-summary
                style="width: 1472px"
              >
                <el-table-column
                  v-for="(col, idx) of columns"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                  :width="col.width"
                  :align="col.align"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="attach table" v-if="showMap.attachRemark">
            <p>
              <span class="title">补充信息</span>
            </p>
          <div class="m20">
            <span class="attachTitle">备注说明:</span>
            <el-input
            type="textarea"
            style="width: 60%"
            v-model="allData.remark"
            :disabled="disabledMap.attachRemark">
            </el-input>
          </div>
          <div class="m20">
            <span class="attachTitle">附件:</span>
            <i-upload
              :disabled="disabledMap.attachRemark"
              :previewMode="previewMode && disabledMap.attachRemark"
              :fileList="allData.fileList"
              @onRemove="handleFileRemove($event)"
              @onSuccess="handleUploadSuccess($event)"
              @onError="onError"
              @onChange="onChange">
            </i-upload>
          </div>
        </div>
      </section>
    </i-process-flow>
  </div>
</template>
<script>
// import req from '../../../../../api/compensation/check-give/flow'
// import req from 'api/compensation/check-give/salary-give'
import reqs from 'api/compensation/check-give/salary-apply'
import IProcessFlow from 'components/common/i-process-flow'
import IUpload from 'components/common/upload/uploader'
import { showMessage } from 'utils/index'
export default {
  components: {
    IProcessFlow,
    IUpload
  },
  data () {
    return {
      allData: {
        finalPayingAmount: '',
        totalNumber: '',
        DirectSummary: [],
        OfferSummary: [],
        CashSummary: [],
        remark: '',
        fileList: [],
        DirectSummaryTotal: {
          beitTotalNumber: '',
          betiPeopleNumber: ''
        },
        OfferSummaryTotal: {
          beitTotalNumber: '',
          betiPeopleNumber: ''
        },
        CashSummaryTotal: {
          beitTotalNumber: '',
          betiPeopleNumber: ''
        }
      },
      applyCheckList: null,
      // 表格
      columns: [
        { prop: 'companyName', label: '发薪主体', width: '370', align: 'center' },
        { prop: 'groupName', label: '薪资组', width: '370', align: 'center' },
        { prop: 'totalNumber', label: '人数', width: '370', align: 'center' },
        { prop: 'amount', label: '金额(元)', width: '360', align: 'center' }
      ],
      previewMode: false,
      loading: true
    }
  },
  created () {
    // 从页面跳转过来，根据id获取申请出款的信息
    let params = window.location.href.split('?')[1].split('&')
    params.forEach(item => {
      let arr = item.split('=')
      if (arr[0] === 'arr') {
        this.applyCheckList = JSON.parse(decodeURIComponent(arr[1]))
      }
    })
    if (this.applyCheckList) {
      this.allData = Object.assign(this.allData, this.applyCheckList)
      reqs('postTotalData', this.applyCheckList.processIdList).then(res => {
        this.allData.finalPayingAmount = res.ipeopleNumber
        this.allData.totalNumber = res.totalNumber
        this.allData.DirectSummary = res.DirectSummary

        this.allData.OfferSummary = res.OfferSummary
        this.allData.CashSummary = res.CashSummary
        res.statement.forEach(item => {
          if (item.deliverType === '1') {
            this.allData.CashSummaryTotal = item
          } else if (item.deliverType === '2') {
            this.allData.DirectSummaryTotal = item
          } else if (item.deliverType === '3') {
            this.allData.OfferSummaryTotal = item
          }
        })
        this.loading = false
        if (res.ipeopleNumber <= 0) {
          return showMessage('warning', '申请总金额为0,请重新选择再发起流程')
        }
      })
    } else {
      this.previewMode = true
    }
  },
  methods: {
    /** 流程提交前保存的数据 */
    postFlow () {
      if (this.allData.finalPayingAmount <= 0) {
        return showMessage('warning', '申请总金额为0，不能提交用款申请')
      } else {
        return this.allData
      }
    },
    /** 加入审批流程时给页面的数据 */
    fillIn (data) {
      this.allData = data
      this.loading = false
    },
    /** 删除已上传数据 */
    handleFileRemove (file) {
      const fileList = this.allData.fileList
      this.allData.fileList = fileList.filter(fileId => {
        return fileId !== file.attachmentId
      })
    },

    /** 上传成功事件监听 */
    handleUploadSuccess (responseId) {
      this.allData.fileList.push(responseId)
    },

    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '小计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = '-------'
        }
      })
      return sums
    }
  }
}
</script>
<style lang="scss" scoped>
  .head{
    padding-bottom:20px;
    font-family: '微软雅黑';
    font-weight: 410;
    color:#f00;
      .reason{
        font-size:14px;
      }
      .amount{
        margin-left:160px;
        font-size:14px;
      }
    .headPeopel{
      font-size:14px;
      margin-left:160px;
    }
  }
  .table{
    border:1px solid #eee;
    margin-bottom:10px;
    p{
      padding:0 15px;
      height: 40px;
      line-height: 40px;
      background:#eee;
      .title{
        font-family: "微软雅黑 Bold", "微软雅黑 Regular", 微软雅黑;
        font-weight: 700;
        font-style: normal;
        font-size: 16px;
        color: rgb(102, 102, 102);
      }
      .totalMoney{
        font-size:14px;
        float:right;
        margin-left:300px;
        margin-right:100px;
      }
      .totalPeople{
        font-size:14px;
        float:right;
        margin-left:140px;
      }
    }
  }
  .tab{
    padding:10px 15px;
  }
  .attach{
    margin-bottom:20px;
    padding-bottom:20px;
    .m20{
      margin-left:20px;
    }
    .attachTitle{
      display:block;
      margin: 15px 0;
      font-family:'微软雅黑';
      font-weight:410;
    }
  }
</style>
