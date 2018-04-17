<template>
  <div class="tab-content">
    <el-tabs
      v-model="num" 
      type="border-card"
    >
      <el-tab-pane
        v-for="(col, idx) of data"
        :key="idx"
        :label="col.groupName"
        :name="idx"
       >
        <el-form :model="col" label-width="100px" :rules="rules">
          <el-form-item label="工资月份:" prop="payMonth">
             <el-date-picker
              v-model="col.payMonth"
              value-format="yyyy-MM"
              type="month"
              @change="changeDate"
              placeholder="选择时间"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="工资套:" prop="componentListId">
            <!-- <i-select v-model="col.componentListId" parameter="COMPONENT_LIST_TYPE"></i-select> -->
            <el-select v-model="col.componentListId" placeholder="请选择" @change="getSalaryType">
              <el-option
                v-for="item in col.searchComponentListDtos"
                :key="item.componentListId"
                :label="item.componentListName"
                :value="item.componentListId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工资套类型:" prop="salaryUnitType" required >
            <i-select v-model="col.componentListTypeName" disabled></i-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <i-dialog
      v-model="isShowAlert"
      title="提示"
      size="small"
      ref="mask"
      :showClose="false"
    >
      <div id="mask">
        <i class="el-icon-loading"></i>
        <span>正在计算,请等待...</span>
      </div>     
    </i-dialog>  
  </div>
</template>
<script>
import req from 'api/compensation/check-give/salary-count'
import { getRule, showMessage } from 'utils/index'

const RULES = {
  payMonth: getRule('请选择工资月份', 'change', 'date'),
  componentListId: getRule('请选择工资套', 'change')
}

export default {
  name: 'SalaryCountCreateSecond',
  props: {
    selectList: Array
  },
  data () {
    return {
      isShowAlert: false,
      data: [],
      num: '0',
      rules: RULES
    }
  },
  created () {
    this.data = this.selectList.filter(item => {
      return item.searchComponentListDtos[0]
    })
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].componentListId = this.data[i].searchComponentListDtos[0].componentListId
      this.data[i].componentListTypeName = this.data[i].searchComponentListDtos[0].componentListTypeName
    }
    const errData = this.selectList.filter(item => {
      return !item.searchComponentListDtos[0]
    })
    // 对于没有薪资套的薪资组提示无法创建发放过程
    if (errData.length) {
      let warnMsg = ''
      errData.forEach(item => {
        warnMsg += item.groupName + ','
      })
      showMessage('warning', warnMsg.slice(0, -1) + '无薪资套,无法创建发放过程')
    }
  },
  methods: {
    /** 新建計算函数 */
    buildProcess () {
      this.isShowAlert = true
      return new Promise(resolve => {
        req('createCount', this.data).then(res => {
          if (res) {
            this.isShowAlert = false
            resolve(true)
          } else {
            resolve(false)
          }
        }).catch(err => {
          if (err) {
            this.isShowAlert = false
          }
        })
      })
    },
    getSalaryType (val) {
      req('getSalaryTypeByGroup', {componentListId: val}).then(res => {
        this.data[this.num].componentListTypeName = res.componentListTypeName
        // 下拉选择，设置数据双向绑定
        this.$set(this.data, this.num, this.data[this.num])
      })
    },
    // 时间选择器改变，设置数据双向绑定
    changeDate () {
      this.$set(this.data, this.num, this.data[this.num])
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-form {
    padding:10px;
  }
  .el-form-item {
    width:100%;
  }
  #mask{
    text-align:center;
  }
</style>
