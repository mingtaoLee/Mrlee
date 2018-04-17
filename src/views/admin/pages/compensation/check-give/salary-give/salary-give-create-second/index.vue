<template>
  <div class="tab-content">
    <el-tabs
    v-model="num" 
    type="border-card">
      <el-tab-pane
        v-for="(col, idx) of data"
        :key="idx"
        :label="col.groupName"
        :name="idx"
      >
        <el-form label-width="100px" ref="form">
          <el-form-item label="工资月份:" prop="payMonth">
             <el-date-picker
              v-model="col.payMonth"
              value-format="yyyy-MM"
              type="month"
              placeholder="选择时间"
              @change="changeDate">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="工资套:" prop="componentListId">
            <!-- <i-select v-model="col.componentListId" parameter="COMPONENT_LIST_TYPE"></i-select> -->
            <el-select 
              v-model="col.componentListId" 
              placeholder="请选择" 
              @change="getSalaryType"
            >
              <el-option
                v-for="item in col.searchComponentListDtos"
                :key="item.componentListId"
                :label="item.componentListName"
                :value="item.componentListId"
                @click.native="slectOption(item)"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工资套类型:" prop="salaryUnitType">
            <el-input v-model="col.componentListTypeName" disabled></el-input>
          </el-form-item>
          <el-form-item label="工资发放过程:" prop="processName">
            <el-input v-model="col.processName"></el-input>
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
          <span>正在创建发放过程,请等待...</span>
        </div>     
      </i-dialog>  
  </div>
</template>
<script>
import req from 'api/compensation/check-give/salary-give'
// import { showMessage } from 'utils/index'

export default {
  name: 'SalaryGiveCreateSecond',
  props: {
    selectList: Array
  },
  data () {
    return {
      isShowAlert: false,
      data: [],
      num: '0' // 当前tab的索引值，通过这个值可以与对象数组进行数据对接
    }
  },
  created () {
    // this.data = this.selectList.filter(item => {
    //   return item.searchComponentListDtos[0]
    // })
    this.data = this.selectList
    // init the default data
    this.data.forEach((item, index) => {
      this.data[index].componentListId = item.searchComponentListDtos[0].componentListId
      this.data[index].componentListTypeName = item.searchComponentListDtos[0].componentListTypeName
      this.data[index].processName = item.payMonth + '+' + item.groupName + '+' + item.searchComponentListDtos[0].componentListTypeName
    })
    // const errData = this.selectList.filter(item => {
    //   return !item.searchComponentListDtos[0]
    // })
    // // 对于没有薪资套的薪资组提示无法创建发放过程
    // if (errData.length) {
    //   let warnMsg = ''
    //   errData.forEach(item => {
    //     warnMsg += item.groupName + ','
    //   })
    //   showMessage('warning', warnMsg.slice(0, -1) + '默认月份无确认计算数据,请核实月份,重新选择月份')
    // }
  },
  methods: {
    /** 新建发放函数 */
    buildProcess () {
      this.isShowAlert = true
      return new Promise(resolve => {
        req('postBuildProcess', this.data).then(res => {
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
    /** 下拉选择选取事件函数 */
    getSalaryType (val) {
      req('getSalaryTypeByGroup', {componentListId: val}).then(res => {
        this.data[this.num].componentListTypeName = res.componentListTypeName
        this.data[this.num].salaryGroup = this.data[this.num].groupName + '+' + res.componentListTypeName
        // 下拉选择，设置数据双向绑定
        this.$set(this.data, this.num, this.data[this.num])
      })
    },
    /** 选择选项事件 */
    slectOption (val) {
      this.data[this.num].componentListName = val.componentListName
    },
    /** 时间选择器改变，设置数据双向绑定 */
    changeDate (val) {
      this.$set(this.data, this.num, this.data[this.num])
      // this.data[this.num].componentListId = ''
      // this.data[this.num].componentListTypeName = ''
      // this.data[this.num].processName = ''
      // // 根据月份的改变和薪资组ID获取对应的工资套，过滤掉为空的工资套
      // req('getcomponentListName', { payMonth: this.data[this.num].payMonth, groupId: this.data[this.num].groupId }).then(res => {
      //   this.data[this.num].searchComponentListDtos = res
      //   if (!res.length) {
      //     showMessage('warning', '该月份无工资套，不能创建发放过程')
      //   }
      // })
    }
  },
  watch: {
    /** 监听data的改变，动态关联变化 */
    data (a, b) {
      if (a[this.num].payMonth && a[this.num].groupName && a[this.num].componentListTypeName) {
        a[this.num].processName = a[this.num].payMonth + '+' + a[this.num].groupName + '+' + a[this.num].componentListTypeName
      } else {
        a[this.num].processName = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-form{
    padding:10px;
  }
  .el-form-item{
    width:100%;
  }
  #mask{
    text-align:center;  
  }
</style>


