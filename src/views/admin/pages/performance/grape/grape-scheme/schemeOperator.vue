<template>
 
  <i-dialog 
  :toolbar="dialogToolbar"
  :title="`${dialogTitle}绩效方案`"
  destroyedWhenClose
  v-model="showOperator">

    <el-form :model="model" ref="form" id="grape-scheme-operator">
      <!-- <el-row> -->
        <!-- <el-col :span="12"> -->

          <el-form-item label="名称" prop="name" :rules="customRules.name">
            <el-input 
            v-model.trim="model.name" 
            :disabled="status === 0"
            clearable
            suffix-icon="el-icon-edit"
            ></el-input>
          </el-form-item>

          <el-form-item label="评分标准" prop="standardId" :rules="customRules.standard">
            <el-select v-model.trim="model.standardId" :disabled="status === 0">
              <el-option 
              v-for="standard in standardOptions" 
              :key="standard.standardId"
              :value="standard.standardId"
              clearable
              :label="standard.name"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="适用范围" prop="orgId" :rules="customRules.org">
            <i-select-tree 
            v-model.trim="model.orgId"  
            nodeKey="orgUnitId" 
            dataKey="org"
            :selectedNode="defaultOrg"
            :disabled="status === 0"
            ></i-select-tree>
          </el-form-item>

          <el-form-item label="方案管理员" prop="managerId" :rules="customRules.schemeManager">
            <el-input 
              v-model="model.managerName" 
              @focus="doPersonSelect"
              :disabled="status === 0"
              >
              <i 
                slot="suffix" 
                class="manager_icon el-icon-menu" 
                @click="doPersonSelect"
              ></i>
            </el-input>
          </el-form-item>
          
           <el-form-item label="可申诉次数" prop="appealTime" :rules="customRules.adjustTime">
            <el-input 
            v-model.number.trim="model.appealTime" 
            type="number"
            :min="0" 
            clearable 
            :disabled="status === 0"></el-input>
          </el-form-item>

          <el-form-item label="可延迟天数" prop="adjustDay" :rules="customRules.adjustDay">
            <el-input 
            v-model.number.trim="model.adjustDay" 
            type="number"
            clearable 
            :min="0" 
            :disabled="status === 0"></el-input>
          </el-form-item>

        <!-- </el-col> -->

        <!-- <el-col :span="12"> -->

          <el-form-item label="开始时间" prop="beginDate" :rules="customRules.beginDate">
            <el-date-picker 
              v-model="model.beginDate"
              clearable
              type="date"
              :picker-options="beginPickerOpts"
              :disabled="status === 0"></el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间" prop="endDate" :rules="customRules.endDate">
            <el-date-picker
            v-model="model.endDate"
            clearable
            type="date"
            :picker-options="endPickerOpts"
            :disabled="status === 0"></el-date-picker>
          </el-form-item>
      
          <el-form-item label="描述" prop="description">
            <el-input 
            v-model.trim="model.description" 
            type="textarea"
            :rows="3"
            suffix-icon="el-icon-edit"
            clearable 
            :disabled="status === 0"></el-input>
          </el-form-item>
         
         <!-- </el-col> -->
      <!-- </el-row> -->
         
  </el-form>
  <i-personnel-select :isShow.sync="showPersonSelect" @confirm="personSelectConfirm" :multiple="false"></i-personnel-select>

  </i-dialog>

</template>

<script>
import req from 'api/grape/scheme.js'
import iSelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import iDialog from 'components/common/i-dialog/i-dialog'
import {rules} from './operator-rules'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
export default {
  name: 'grape-scheme-operator',

  components: {
    iSelectTree,
    iDialog,
    iPersonnelSelect
  },

  props: {
    status: Number, // 编辑，查看，新增状态控制
    schemeData: Object, // 编辑和查看的数据来源
    showOperator: Boolean // dialog 的控制
  },

  data () {
    return {

      endPickerOpts: {
        disabledDate: (time) => {
          return this.model.beginDate && this.model.beginDate.getTime && (time.getTime() < this.model.beginDate.getTime())
        }
      },

      beginPickerOpts: {
        disabledDate: (time) => {
          return this.model.endDate && this.model.endDate.getTime && (time.getTime() > this.model.endDate.getTime())
        }
      },

      // 新建的数据对象
      schemeObj: {
        name: '',
        standardId: '',
        orgId: null,
        beginDate: '',
        endDate: '',
        adjustDay: null,
        appealTime: null,
        description: '',
        managerId: null,
        managerName: null
      },

      dayOptions: [
        {
          label: '今天',
          value: '1'
        },
        {
          label: '明天',
          value: '2'
        }
      ],

      dialogToolbar: [
        {
          text: '确定',
          type: 'primary',
          func: done => {
            this.status !== 0 ? this.postSchemedata(done) : done()
          }
        },
        {
          text: '取消',
          type: 'text',
          func: done => {
            done()
          }
        }
      ],

      standardOptions: [], // 评分标准数组
      showPersonSelect: false, // 人员选择器的控制
      defaultOrg: '',
      model: {} // 数据绑定的容器，用于新增编辑时绑定不同的数据源

    }
  },

  methods: {

    // 提交关闭当前窗口事件
    dialogClose () {
      this.$emit('update:showOperator', false)
    },

    // 方案管理员的点击事件
    doPersonSelect () {
      this.showPersonSelect = true
    },

    // 选人的确认回调
    personSelectConfirm (selected) {
      this.model.managerId = selected[0].employeeId
      this.model.managerName = selected[0].employeeName
    },

    setModel () {
      if (this.status === 0 || this.status === 2) {
        this.model = this.schemeData
      } else {
        this.model = this.schemeObj
      }
    },

    postSchemedata (done) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗', '提示').then(() => {
            let api = {
              1: { url: 'addGrapeScheme', text: '新增' },
              2: { url: 'editGrapeScheme', text: '编辑' }
            }
            Object.keys(this.model).forEach(element => {
              let value = this.model[element]
              typeof value === 'string' && value.replace(/(^\s+)|(\s+$)/g, '')
            })
            req(api[this.status].url, this.model).then(() => {
              this.$message({
                message: `${api[this.status].text}成功`,
                type: 'success'
              })
              this.$emit('loadSchemes')
              done()
            })
          })
        }
      })
    },

    getEvluateStandard () {
      req('getEvaluateStandard').then(res => (this.standardOptions = res))
    },

    getOrgObj (id) {
      req('getOrgObj', {id}).then(res => (this.defaultOrg = res))
    }

  },

  computed: {

    customRules () {
      let result
      this.status === 0 ? result = {} : result = rules
      return result
    },

    hours () {
      return Array.from(new Array(24), (val, index) => index)
    },

    dialogTitle () {
      let dict = {
        0: '查看',
        1: '新增',
        2: '修改'
      }
      return dict[this.status]
    }

  },

  watch: {

    showOperator (newValue, oldValue) {
      newValue === false && this.$emit('update:showOperator', false)
    },

    schemeData (newValue, oldValue) {
      newValue.beginDate = new Date(newValue.beginDate)
      newValue.endDate = new Date(newValue.endDate)
      newValue.orgId && this.getOrgObj(newValue.orgId)
      this.model = newValue
    }

  },

  created () {
    // if (this.status === 1) { this.model = {...this.schemeObj} }
    this.setModel()
    this.getEvluateStandard()
  }
}
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
#grape-scheme-operator {
  .el-form-item {
    display: flex;
    width: 100%;
    .el-form-item__label {
      width: 15%;
    }
    .el-form-item__content {
      width:85%;
    }
  }
  .manager_icon {
    cursor: pointer;
  }
}
</style>

