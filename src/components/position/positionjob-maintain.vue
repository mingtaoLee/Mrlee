<template>
  <div class="content-follow">
    <h2 class="info-title">维护明细</h2>
    <div class="info-content">
      <el-form :model="model" ref="maintain" :rules="model.operationType==='0'?newRules:rules" label-width="150px" label-position="right" @submit.native.prevent>
        <el-form-item
          v-if="showMap.name"
          :label="model.operationType==='0'?action + '名称':model.operationType==='1'?'选择修改的'+action:'选择'+action"
          :prop="model.operationType==='0'?'name':action==='品类'?'posCategoryId':'posTitleId'"
        >
          <el-col :span="8">
            <el-input
             ref="hook"
             v-if="model.operationType==='0'"
             v-model.trim="model.name"
             :disabled="disabledMap.name"
            ></el-input>
            <el-select
              v-else-if="action==='品类'"
              v-model="model.posCategoryId"
              :disabled="disabledMap.name"
              @change="changeCatogoryOrTitle"
              filterable
            >
              <el-option
                v-for="item in enableCategorys"
                :key="item.posCategoryId"
                :label="item.name"
                :value="item.posCategoryId"
              >
              </el-option>
            </el-select>
            <el-select
              v-else-if="action==='职务'"
              v-model="model.posTitleId"
              :disabled="disabledMap.name"
              @change="changeCatogoryOrTitle"
              filterable
            >
              <el-option
                v-for="item in enableTitles"
                :key="item.posTitleId"
                :label="item.name"
                :value="item.posTitleId"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-button type="success" size="mini"
            v-if="showMap.repealExport&&(posStandardJobNum||positionNum||employeeNum)"
            :disabled="disabledMap.repealExport"
            @click="exportDetails">导出详情</el-button>
        </el-form-item>
        <el-form-item v-if="showMap.updateName && model.operationType==='1'" prop="name">
          <span slot="label">{{model.operationType==='1'?'修改后的'+action:action}}名称</span>
          <el-col :span="8">
            <el-input
              v-model.trim="model.name"
              :disabled="disabledMap.updateName"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-if="showMap.titleType && action === '职务'" :label="model.operationType==='1'?'修改后职务类别':'职务类别'" prop="titleType">
          <el-col :span="8">
            <i-select v-model="model.titleType" parameter="TITLE_TYPE" :disabled="disabledMap.titleType"></i-select>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" v-if="showMap.remark && model.operationType !== '2'" prop="remark">
          <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.remark" :disabled="disabledMap.remark"></el-input>
          </el-col>
        </el-form-item>
          <el-form-item label="包含标准职位" v-if="showMap.includingStandardJob && model.operationType === '2'">
            <span>{{posStandardJobNum||0}}</span>
          </el-form-item>
        <el-form-item label="包含职位" v-if="showMap.includingJob && model.operationType === '2'">
          <span>{{positionNum||0}}</span>
        </el-form-item>
        <el-form-item label="包含员工" v-if="showMap.includingStaff && model.operationType === '2'">
          <span :class="{'red':employeeNum>0}">{{employeeNum||0}}</span>
          <el-button v-if="showMap.repealEmps&&employeeNum"
              :disabled="disabledMap.repealEmps"
              type="primary" size="mini" class="ml20" @click="massTransfer">批量调动</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import ISelect from 'components/common/i-select/i-select'
  import req from 'api/position/position-job'
  import reqCa from 'api/position/position-category'
  import {exportTable} from 'utils'

  export default {
    name: 'PositionMaintain',
    props: ['model', 'action'],
    components: {
      ISelect
    },
    data () {
      var check = (rule, value, callback) => {
        const modeCheck = (modeName) => {
          if (!this.model.name) return callback()
          this.checkName()
            .then(res => {
              res ? callback({ successMessage: `该${this.action}名称可用` }) : callback(new Error(`该${this.action}名称已被使用`))
            })
            .catch(() => {
              callback()
            })
        }
        const checkCancel = () => {
          if (!this.model.posTitleId) return callback()
          req('getPositionAndStaff', {posTitleId: this.model.posTitleId}).then(data => {
            this.posStandardJobNum = data.posStandardJobNum
            this.positionNum = data.positionNum
            this.employeeNum = data.employeeNum
            this.employeeIds = data.employeeIds
            if (this.posStandardJobNum || this.positionNum || this.employeeNum) {
              callback(new Error('该职务存在被引用情况，不允许撤销'))
            } else {
              callback()
            }
          })
        }
        const checkCategoryCancel = () => {
          if (!this.model.posCategoryId) return callback()
          reqCa('checkPosition', {posCategoryId: this.model.posCategoryId}).then(data => {
            this.positionNum = data.positionNum
            if (this.positionNum) {
              callback(new Error('该品类存在被引用情况，不允许撤销'))
            } else {
              callback()
            }
          })
        }
        // 执行流程
        if (this.model.operationType === '2') {
          this.action === '品类' ? checkCategoryCancel() : checkCancel()
        } else {
          modeCheck(this.action)
        }
      }
      return {
        newRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 20, message: '长度不能超过20个字符', trigger: 'blur' },
            { validator: check, trigger: 'blur' }
          ],
          posCategoryId: [
            { required: true, message: '请选择品类', trigger: 'blur' },
            { required: true, validator: check, trigger: 'blur' }
          ],
          posTitleId: [
            { required: true, message: '请选择职务', trigger: 'blur' },
            { required: true, validator: check, trigger: 'change' }
          ],
          titleType: [
            { required: true, message: '请选择职务类别', trigger: 'change' }
          ],
          remark: [{ max: 512, message: '长度不能超过512个字符', trigger: 'blur' }]
        },
        rules: {
          name: [
            // { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 20, message: '长度不能超过20个字符', trigger: 'blur' },
            { validator: check, trigger: 'blur' }
          ],
          posCategoryId: [
            { required: true, message: '请选择品类', trigger: 'blur' },
            { required: true, validator: check, trigger: 'blur' }
          ],
          posTitleId: [
            { required: true, message: '请选择职务', trigger: 'blur' },
            { required: true, validator: check, trigger: 'change' }
          ],
          titleType: [
            { required: true, message: '请选择职务类别', trigger: 'change' }
          ],
          remark: [{ max: 512, message: '长度不能超过512个字符', trigger: 'blur' }]
        },
        enableCategorys: [],
        enableTitles: [],
        posStandardJobNum: 0,
        positionNum: 0,
        employeeNum: 0,
        employeeIds: []
      }
    },
    watch: {
      'model.name' (val) {
        // 如果是撤销操作，则检查是否挂人
        val && this.model.operationType === '2' && this.dispatchBlur()
      }
    },
    methods: {
      checkName () {
        var submitParams = key => {
          return {
            name: this.model.name,
            [key]: this.model[key]
          }
        }
        var params = null
        this.action === '品类' ? (params = submitParams('posCategoryId')) : (params = submitParams('posTitleId'))
        return this.req('checkName', params)
      },
      checkhasPeople (urlName) {
        var params = null
        this.action === '职务' ? (params = {posTitleId: this.model.posTitleId}) : (params = {posCategoryId: this.model.posCategoryId})
        return this.req(urlName, params)
      },
      getEnableCategory () {
        let type = this.$route.query.hasOwnProperty('processInstanceId') ? '1' : '2'
        reqCa('getEnableCategory', {type}).then(data => {
          this.enableCategorys = data
        })
      },
      getEnableTitle () {
        let type = this.$route.query.hasOwnProperty('processInstanceId') ? '1' : '2'
        req('getEnableTitle', {type}).then(data => {
          this.enableTitles = data
        })
      },
      changeCatogoryOrTitle (id) {
        if (!id) return
        // this.model.name = this.getName(id)
        // if (this.model.operationType === '1') {
        //   this.$refs.maintain.validateField('name')
        // }
        if (this.action === '品类') {
          this.$emit('changeCategory')
        } else {
          this.$emit('changeTitle')
        }
      },
      getName (id) {
        let name = ''
        switch (this.action) {
          case '品类':
            this.enableCategorys.map(ele => {
              if (ele.posCategoryId === id) {
                name = ele.name
              }
            })
            break
          case '职务':
            this.enableTitles.map(ele => {
              if (ele.posTitleId === id) {
                name = ele.name
              }
            })
            break
        }
        return name
      },
      // 判断是职务还是品类，按需加载
      loadReq () {
        this.action === '品类' ? (this.req = require('api/position/position-category').default) : (this.req = require('api/position/position-job').default)
      },
      dispatchBlur () {
        let validateField = this.model.operationType === '0' ? 'name' : this.action === '品类' ? 'posCategoryId' : 'posTitleId'
        this.$refs.maintain.validateField(validateField)
      },
      // 初始化
      init () {
        this.loadReq()
      },
    // 批量调动
      massTransfer () {
        if (this.employeeNum > 20) {
          return this.$message('调动人数过多，请到人事管理模块进行操作！')
        }
        let statusStr = JSON.stringify(this.employeeIds)
        window.open(`/flow.html#/flow/new_employee_multi_movement?processType=4&empEmployeeId=${statusStr}`)
      },
      // 导出表格
      exportDetails () {
        let id
        let type
        switch (this.action) {
          case '品类':
            id = this.model.posCategoryId
            type = 4
            break
          case '职务':
            id = this.model.posTitleId
            type = 3
            break
          default:
            return
        }
        let params = {id}
        exportTable('/pos/repeal/excel/' + type, params)
      }
    },
    mounted () {
      this.init()
      if (this.model.operationType !== '0') {
        if (this.action === '品类') {
          this.getEnableCategory()
        } else {
          this.getEnableTitle()
        }
      }
      if (this.model.operationType === '2') {
        let validateField = this.action === '品类' ? 'posCategoryId' : 'posTitleId'
        if (!this.model[validateField]) return
        this.$refs.maintain.validateField(validateField)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
