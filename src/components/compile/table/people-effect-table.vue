<template>
  <div class="wrap">

    <!-- 流量表格 -->
    <i-table v-if="tableType==='flow'" :table="flowTable" ref="flowTable">
      <template slot="table" slot-scope="tableScope">
        <el-table
          @row-click="rowClickHandler(tableScope, $event)"
          :data="tableScope.clone">
          <el-table-column
            prop="orgUnitName"
            label="组织名称"
            min-width="150"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="preDailySales"
            label="预测日销售额"
            align="center"
            min-width="170"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <i-table-cell
                :row="scope.row"
                col="preDailySales"
                :table="tableScope"
                @change="preDailySalesData"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="preDailyPassFlow"
            label="预测日客流量"
            min-width="170"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <i-table-cell
                :row="scope.row"
                col="preDailyPassFlow"
                :table="tableScope"
                @change="preDailyPassFlowData"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="!newShop"
            prop="preYearAvgCapitaSales"
            label="上年度日均销售额"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="!newShop"
            prop="preYearAvgPassFlow"
            label="上年度日均客流量"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="area"
            label="门店面积"
            align="center"
            show-overflow-tooltip
          />
        </el-table>
      </template>
    </i-table>

    <!-- 人效表格 -->
    <i-table  v-if="tableType==='effect'" :table="effectTable" ref="effectTable">
    <template slot="table" slot-scope="tableScope">
      <el-table
        :data="tableScope.clone"

        >
        <el-table-column  v-if="!newShop" label="月度人力费用" align="center" show-overflow-tooltip>
          <el-table-column prop="monthManPowerCost" label="上月本团队人力费用" align="center" min-width="200" show-overflow-tooltip />
          <el-table-column prop="preMonthPowerCost" label="预测月度人力费用" align="center" min-width="200" show-overflow-tooltip />
        </el-table-column>
        <el-table-column v-if="newShop" prop="preMonthPowerCost" label="预测月度人力费用" align="center" min-width="200" show-overflow-tooltip />

        <el-table-column v-if="!newShop" label="年度人力费用" align="center" show-overflow-tooltip>
          <el-table-column prop="sumManPowerCost" label="已使用人力费用" align="center" min-width="200" show-overflow-tooltip />
          <el-table-column prop="preYearSumCost" label="预测全年使用费用" align="center" min-width="200" show-overflow-tooltip/>
        </el-table-column>
        <el-table-column v-if="newShop" prop="preYearSumCost" label="预测全年使用费用" align="center" min-width="200" show-overflow-tooltip/>

        <el-table-column v-if="!newShop" label="月度人效" align="center" show-overflow-tooltip>
          <el-table-column prop="monthPeopleEff" label="上月度实际人效" align="center" show-overflow-tooltip />
          <el-table-column prop="preMonthEffect" label="预测月度人效" align="center" min-width="200" show-overflow-tooltip />
        </el-table-column>
        <el-table-column v-if="newShop" prop="preMonthEffect" label="预测月度人效" align="center" min-width="200" show-overflow-tooltip />

        </el-table-column>
      </el-table>
    </template>
  </i-table>

  </div>
</template>

<script>
import reqPl from 'api/compile/plan'
import ITable from 'components/common/i-table'
import ITableCell from 'components/common/i-table-cell'

export default {
  name: 'PeopleEffectTable',
  components: {
    ITable,
    ITableCell
  },
  props: {
    tableModel: {
      tyep: Object,
      default: {}
    },
    orgUnitId: {
      type: String,
      required: true
    },
    // 表格类型，这里后端很坑爹的一个接口返回两个表格的数据，flow为流量表，effect为人效表
    tableType: {
      type: String,
      default: 'flow'
    },
    // 是否是新店
    newShop: {
      type: Boolean,
      default: false
    },
    // 是否可以直接编辑表格内容
    editeCell: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 流量表格
      flowTable: {
        data: null,
        editable: this.editeCell,
        setting: {
          editor: {
            preDailySales: {
              type: 'number',
              rules: [
                { required: true, message: '请填写日均销售额' }
              ]
            },
            preDailyPassFlow: {
              type: 'number',
              rules: [
                { required: true, message: '请填写日均客流量' }
              ]
            }
          }
        }
      },
      // 人效表格
      effectTable: {
        data: null,
        editable: this.editeCell
      }
    }
  },
  methods: {
    rowClickHandler ({ rowClickHandler }, row) {
      rowClickHandler(row)
    },
    // 插入基础的预测字段
    insertPredict () {
      // todo:这里需要先加入几个字段
      let assign = {
        preMonthPowerCost: '',
        preYearSumCost: '',
        preMonthEffect: ''
      }
      // todo：这里抽调路由传过来的组织名称
      this.tableModel.flowEffectData[0].orgUnitName = this.tableModel.planData[0].orgUnitName
      this.tableModel.flowEffectData[0].preDailySales = this.tableModel.planData[0].preDailySales
      this.tableModel.flowEffectData[0].preDailyPassFlow = this.tableModel.planData[0].preDailyPassFlow
      return assign
    },
    // 获取表格基础信息
    getBasicInfo () {
      // todo:这里为什么是2 ，因为之前传过来了两个数据：预测日均销售额，预测日均客流量
      if (Object.keys(this.tableModel.flowEffectData[0]).length <= 2) {
        reqPl('getPeopleEffDetails', {orgUnitId: this.orgUnitId}).then(data => {
          Object.assign(this.tableModel.flowEffectData[0], data, this.insertPredict())
          if (this.newShop) {
            this.showNewShopPredict(true).then(likeCost => {
              this.tableModel.flowEffectData[0].preMonthPowerCost = Number(likeCost) * Number(this.tableModel.planData[0].sumScaleNum) || ''
              this.tableModel.flowEffectData[0].preYearSumCost = this.tableModel.flowEffectData[0].preMonthPowerCost * 12
              this.tableModel.flowEffectData[0].preMonthEffect = Number(this.tableModel.flowEffectData[0].preDailySales) / Number(this.tableModel.planData[0].sumScaleNum) || ''
              this.flowTable.data = this.tableModel.flowEffectData
              this.effectTable.data = this.tableModel.flowEffectData
            })
          } else {
            this.tableModel.flowEffectData[0].preMonthPowerCost = Number(this.tableModel.flowEffectData[0].preYearAvgCapitaSales) * Number(this.tableModel.planData[0].sumScaleNum) || ''
            this.tableModel.flowEffectData[0].preYearSumCost = this.tableModel.flowEffectData[0].preMonthPowerCost * 12 || ''
            this.tableModel.flowEffectData[0].preMonthEffect = Number(this.tableModel.flowEffectData[0].preDailySales) / Number(this.tableModel.planData[0].sumScaleNum) || ''
            this.flowTable.data = this.tableModel.flowEffectData
            this.effectTable.data = this.tableModel.flowEffectData
          }
        })
      }
    },
    // 抛出预测日均销售额
    preDailySalesData (target) {
      this.$refs.flowTable.saveData()
      this.tableModel.flowEffectData[0].preDailySales = target.val
      // 如果是新店的话，需求请求新的数据
      if (this.newShop) {
        this.showNewShopPredict().then(likeCost => {
          this.$emit('likeCostChange', {label: 'likeCost', value: likeCost})
          this.$emit('change', {label: 'dailySales', value: target.val})
        })
      }
    },
    // 抛出预测日客流量
    preDailyPassFlowData (target) {
      this.$refs.flowTable.saveData()
      this.tableModel.flowEffectData[0].preDailyPassFlow = target.val
      this.preDailyPassFlow = target.val
      // 如果是新店的话，需求请求新的数据
      if (this.newShop) {
        this.showNewShopPredict().then(likeCost => {
          this.$emit('likeCostChange', {label: 'likeCost', value: likeCost})
        })
      }
    },
    // 如果是小店，则根据编制数、日销售额计算预测人效、和根据预测日均销售额计算月度人效
    predictEffect (sacNum = this.tableModel.planData[0].sumScaleNum, dailySales = this.tableModel.flowEffectData[0].preDailySales) {
      this.$refs.effectTable.clone[0].preMonthPowerCost = Number(this.$refs.effectTable.clone[0].preYearAvgCapitaSales) * Number(sacNum) || ''
      this.$refs.effectTable.clone[0].preYearSumCost = Number(this.$refs.effectTable.clone[0].preYearAvgCapitaSales) * Number(sacNum) * 12 || ''
      this.$refs.effectTable.clone[0].preMonthEffect = Number(dailySales) / Number(sacNum) || ''
    },
    // 如果是新店，则同省业态、根据编制数、日销售额计算预测人效、和根据预测日均销售额计算月度人效
    predictNewShopEffect (likeCost, sacNum = this.tableModel.planData[0].sumScaleNum, dailySales = this.tableModel.flowEffectData[0].preDailySales) {
      this.$refs.effectTable.clone[0].preMonthPowerCost = Number(likeCost) * Number(sacNum) || ''
      this.$refs.effectTable.clone[0].preYearSumCost = Number(likeCost) * Number(sacNum) * 12 || ''
      this.$refs.effectTable.clone[0].preMonthEffect = Number(dailySales) / Number(sacNum) || ''
    },
    // 如果是新店，则根据日均销售额和日和流量请求出对应的同省业态数据,抛出
    showNewShopPredict () {
      let preDailySales = this.tableModel.flowEffectData[0].preDailySales
      let preDailyPassFlow = this.preDailyPassFlow || this.tableModel.flowEffectData[0].preDailyPassFlow
      if (!preDailySales || !preDailyPassFlow) return
      let params = {
        orgUnitId: this.tableModel.planData[0].orgUnitId,
        preDailySales,
        preDailyPassFlow
      }
      return new Promise(resolve => {
        reqPl('getNewShopPeopleEffect', params).then(data => {
          return resolve(data.likeOrgAvgMonthPCost)
        })
      })
    }
  },
  mounted () {
    this.getBasicInfo()
  },
  created () {

  }
}
</script>

<style lang="scss" scoped>
</style>
