<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      @submit="sendAll"
      :model="postParams"
      :processType="processType"
      @jurConfig="handleJurConfig"
    >
      <section class="content-follow" slot="costHourTransfer">
        <div>
          <h2 class="info-title">费用/工时划拨明细</h2>
          <div style="margin-bottom:20px;">
            <span style="margin-right:20px;font-size:14px;">选择费用划拨形式：</span>
            <template>
              <el-radio
                v-model="radio"
                label="1"
                :disabled="radioStatusOne"
                @change="getRadio"
              >
                内部订单费用划拨
              </el-radio>
              <el-radio
                v-model="radio"
                label="2"
                :disabled="radioStatusTwo"
                @change="getRadio"
              >
                费用/工时划拨
              </el-radio>
            </template>
          </div>
          <div>
            <inside-cost
              v-if="showInsideCost"
              ref="insideCost"
              :data = "submitData.costAufnRecordDto"
              :tableDisable = "tableDisable"
            ></inside-cost>
            <hour-cost
              v-if="showHourCost"
              ref="hourCost"
              :data = "submitData.costHoursDto"
              :tableDisable = "tableDisable"
            ></hour-cost>
          </div>
        </div>
      </section>
    </i-process-flow>
  </div>
</template>
<script>
import InsideCost from './inside-cost'
import HourCost from './hour-cost'
import IProcessFlow from 'components/common/i-process-flow'
import { formatDate } from 'utils/organization'
import { confirmPopover } from 'utils/index'
// import req from 'api/compensation/check-give/flow'

export default {
  name: 'CostAllocation',
  components: {
    IProcessFlow,
    InsideCost,
    HourCost
  },
  data () {
    return {
      // 提交的数据
      submitData: {
        radio: null,
        hrCheck: null,
        costHoursDto: [],
        costAufnRecordDto: []
      },
      // 审批页面加载进去的数据
      radio: '1',
      tableDisable: null,
      // 选择框状态
      radioStatusOne: false,
      radioStatusTwo: false,
      // 控制组件
      showInsideCost: true,
      showHourCost: false,
      empEmployeeId: this.$route.query.empEmployeeId,
      taskId: this.$route.query.taskId,
      taskKey: this.$route.query.taskKey,
      processType: this.$route.query.processType,
      postParams: {
        costHourTable: '',
        addButton: '',
        delButton: '',
        innerOrderTable: '',
        innerAddButton: '',
        innerDelButton: '',
        transferCode: ''
      }
    }
  },
  methods: {
    // 控制表格转换
    getRadio () {
      // 判断是否是起草页面
      if (this.$route.query.taskKey === undefined) {
        // console.log(66)
        // req('getNodeAgain', {})
        if (this.radio === '1') {
          // radio === '1'时如果表格里面有数据
          if (this.$refs.hourCost.isdata !== '') {
            confirmPopover('warning', '如果执行该操作，所填写的数据将会丢失，是否继续？', () => {
              this.postParams.transferCode = 0
              this.showInsideCost = true
              this.showHourCost = false
            }, () => {
              this.radio = '2'
            })
          } else {
            this.postParams.transferCode = 0
            this.showInsideCost = true
            this.showHourCost = false
          }
        } else {
          // radio === '2'如果表格里面有数据
          if (this.$refs.insideCost.isdata !== '') {
            confirmPopover('warning', '如果执行该操作，所填写的数据将会丢失，是否继续？', () => {
              this.postParams.transferCode = 1
              this.showInsideCost = false
              this.showHourCost = true
            }, () => {
              this.radio = '1'
            })
          } else {
            this.postParams.transferCode = 1
            this.showInsideCost = false
            this.showHourCost = true
          }
        }
      } else {
        if (this.radio === '1') {
          this.showInsideCost = true
          this.showHourCost = false
        } else {
          this.showInsideCost = false
          this.showHourCost = true
        }
      }
    },
    // 传值
    postFlow () {
      this.submitData.radio = this.radio
      if (this.radio === '1') {
        this.$refs.insideCost.$refs.table.saveData()
        let postInsideCostData = this.$refs.insideCost.insideCostData
        // 提交数据的时候转换划拨月份为字符串
        for (let key = 0; key < postInsideCostData.length; key++) {
          if (typeof postInsideCostData[key].transferMonth === 'number') {
            postInsideCostData[key].transferMonth = formatDate(postInsideCostData[key].transferMonth).slice(0, 7)
          }
        }
        this.submitData.costHoursDto = postInsideCostData
        this.submitData.costAufnRecordDto = postInsideCostData
      } else {
        this.$refs.hourCost.$refs.table.saveData()
        this.submitData.hrCheck = 'Y'
        let postHourCostData = this.$refs.hourCost.hourCostData
        // 提交数据的时候转换划拨月份为字符串
        for (let key = 0; key < postHourCostData.length; key++) {
          if (typeof postHourCostData[key].transferMonth === 'number') {
            postHourCostData[key].transferMonth = formatDate(postHourCostData[key].transferMonth).slice(0, 7)
          }
        }
        this.submitData.costHoursDto = postHourCostData
        this.submitData.costAufnRecordDto = postHourCostData
      }
      return this.submitData
    },
    // 赋值给审批人界面
    fillIn (data) {
      this.radio = data.radio
      // 进入审批页面的时候根据radio的值控制选择框
      if (this.radio === '1') {
        this.postParams.transferCode = 0
        this.radioStatusOne = false
        this.radioStatusTwo = true
      } else {
        this.postParams.transferCode = 1
        this.radioStatusOne = true
        this.radioStatusTwo = false
      }
      this.getRadio()
      this.submitData.costHoursDto = data.costHoursDto
      this.submitData.costAufnRecordDto = data.costAufnRecordDto
    },
    sendAll () {
      console.log('before', this.submitData)
      if (this.submitData.costAufnRecordDto[0].isProcessAllocationProportion) {
        this.submitData.costAufnRecordDto[0].allocationProportion = this.submitData.costAufnRecordDto[0].allocationProportion ? this.submitData.costAufnRecordDto[0].allocationProportion / 100 : 0
      }
      // 该判断用于 让分摊比例在进入审批节目才对比例才进行处理
      this.submitData.costAufnRecordDto[0].isProcessAllocationProportion = !this.submitData.costAufnRecordDto[0].isProcessAllocationProportion
      console.log('after', this.submitData)
    },
    /** 权限配置完成事件 */
    handleJurConfig (showMap, disabledMap) {
      this.setTableDisabled(disabledMap)
    },

    /** 设置表格是否可编辑 */
    setTableDisabled (disabledMap) {
      this.tableDisable = disabledMap
    }
  }
}
</script>
<style lang="scss">
</style>
