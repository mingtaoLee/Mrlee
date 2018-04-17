<template>
  <div :class="{'content-follow': showTitle}">
    <h2 class="info-title" v-if="showTitle">维护明细</h2>
    <div class="info-content">
      <el-form :model="model" :rules="rules" label-width="140px" label-position="right" @submit.native.prevent>
        <el-form-item label="所属组织" prop="orgUnitId" v-if="showMap.orgUnitName">
          <el-col :span="8">
            <i-select-tree
              :lazy="true"
              dataKey="org"
              nodeKey="orgUnitId"
              v-model="model.orgUnitId"
              @change="changeOrg"
              :props="orgUnitProps"
              placeholder=""
              :disabled="disabledMap.orgUnitName || belongOrgDisabled"
            ></i-select-tree>
          </el-col>
        </el-form-item>
        <el-form-item label="所属标准职位" prop="posStandardJobName" v-if="showMap.posStandardJobName">
          <el-row>
            <el-col :span="8">
              <el-input v-model.trim="model.posStandardJobName" icon="close" @click="clearPosStandardJob" :disabled="disabledMap.posStandardJobName" placeholder="请选择" readonly></el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" size="mini" @click="chooseStandardJob" v-if="!disabledMap.posStandardJobName">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form v-if="model.operationType==='0'" :model="model" :rules="rules" label-width="140px" label-position="right" ref='position'>
          <el-form-item label="职位名称" prop="name" v-if="showMap.name && model.operationType==='0'">
            <el-col :span="8">
              <el-input v-model.trim="model.name" :disabled="disabledMap.name||true"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <el-form-item label="选择修改的职位" v-if="showMap.name && model.operationType==='1'" prop="name">
          <el-col :span="8">
            <el-input v-model="model.name" :disabled="disabledMap.name" placeholder="请选择" readonly></el-input>
          </el-col>
          <el-button type="primary" size="mini" @click="(active='name')&&(isShow=true)" v-if="!disabledMap.name">选择</el-button>
        </el-form-item>
        <el-form-item label="汇报职位" v-if="showMap.parentPositionName">
          <el-col :span="8">
            <!-- <el-select filterable v-model="model.parentPositionId"  clearable :disabled="disabledMap.parentPositionName">
              <el-option v-for="item in parentPosition" :key="item.parentPositionId" :label="item.parentPositionName" :value="item.parentPositionId">
              </el-option>
            </el-select> -->
            <el-input v-model="model.parentPositionName" :disabled="disabledMap.parentPositionName" placeholder="请选择" readonly></el-input>
          </el-col>
          <el-button type="primary" size="mini" @click="(active='parentName')&&(isShow=true)" v-if="!disabledMap.parentPositionName">选择</el-button>
        </el-form-item>
        <el-form-item label="品类" v-if="showMap.posCategoryName">
          <el-col :span="8">
            <el-select filterable v-model="model.posCategoryIds" multiple placeholder="" :disabled="disabledMap.posCategoryName">
              <el-option v-for="item in categoryList" :disabled="item.status === '2'" :key="item.posCategoryId" :label="item.name" :value="item.posCategoryId">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark" v-if="showMap.remark">
          <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.remark" :disabled="disabledMap.remark"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </div>

    <standardjob-chosen ref="showStandardJob" @confirm="choosePosStandardJob"></standardjob-chosen>
    <position-selection v-model="isShow" @change="choosePosition" loaded></position-selection>
  </div>
</template>

<script>
import req from 'api/position/position-post'
import reqStandardOc from 'api/position/standard-oc'
import StandardjobChosen from './standardjob-chosen'
import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import PositionSelection from 'components/position/position-selection'

export default {
  name: 'PositionPostMaintain',
  components: {
    StandardjobChosen,
    ISelectTree,
    PositionSelection
  },
  props: {
    model: {
      type: Object,
      default: {}
    },
    ifShowBelongOrg: {
      type: Boolean,
      default: false
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    belongOrgDisabled: {
      type: Boolean,
      default: false
    },
    categoryList: {
      type: Array,
      default: []
    }
  },
  data () {
    const checkName = (rule, value, callback) => {
      var params = {
        posPositionId: this.model.posPositionId,
        // posStandardJobId: this.model.posStandardJobId,
        orgUnitId: this.model.orgUnitId,
        name: this.model.name
      }
      req('checkJobName', params).then(res => {
        if (res) {
            // 通过验证，可使用名称
          callback(
          //   {
          //   successMessage: '该职位名称可以新建'
          // }
          )
        } else {
          callback(new Error('该职位已存在，不可新建'))
        }
      })
    }
    return {
      // posStandardJobName: '',
      // 保存前一个orgUnitId
      preOrgUnitId: '',
      // 保存是否第一次更改orgUnitId
      firstChange: true,
      isShow: false,
      // parentPosition: [],
      rules: {
        name: [
          { required: true, message: '请选择职位', trigger: 'blur' },
          // { max: 20, message: '长度不能超过20个字符', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        posStandardJobName: [{ required: true, message: '请选择标准职位', trigger: 'change' }],
        orgUnitId: [{ required: true, message: '请选择组织', trigger: 'change' }],
        remark: [{ max: 512, message: '长度不能超过512个字符', trigger: 'blur' }]
      },
      orgUnitProps: {
        children: 'children',
        label: 'orgUnitName',
        disabled: (data, node) => {
          return data.status === '2'
        }
      },
      // 用于判断选择的职位是放到选择职位还是汇报职位的位置
      active: 'name'
    }
  },
  methods: {
    chooseStandardJob () {
      this.$refs.showStandardJob.showDetails = true
    },
    choosePosStandardJob (id, name) {
      var that = this
      this.model.posStandardJobName = name
      this.model.posStandardJobId = id
      this.controlLimitTime()
      if (this.$route.query.processType === 'positionCreateProcess' || this.$route.query.processType === 'positionUpdateProcess') {
        reqStandardOc('getJobDetailsById', {posStandardJobId: id}).then(data => {
          // 删除可能被覆盖的有效时间
          delete data.effectiveDate
          // todo:覆盖名称
          // delete data.name
          Object.assign(that.model, data)
          this.$refs.position && this.$refs.position.validate()
        })
      }
    },
    clearPosStandardJob () {
      this.model.posStandardJobName = ''
      this.model.posStandardJobId = ''
    },
    // getParentPositionGroup (id) {
    //   // let orgUnitId = id || this.model.orgUnitId
    //   req('getReportJob').then(data => {
    //     this.parentPosition = data
    //   })
    // },
    choosePosition (item) {
      if (item) {
        if (this.active === 'name') {
          req('getPostDetailsById', {
            posPositionId: item.posPositionId
          }).then(data => {
            // 修改不带出时间
            this.$emit('limitTime', data.effectiveDate)
            delete data.effectiveDate
            if (this.model.operationType === '1') {
              Object.assign(this.model, data)
              // 将对象数组中的数据分开，id为id数据数组
              var temPosCategoryIds = []
              this.model.categorys.forEach(ele => {
                temPosCategoryIds.push(ele.posCategoryId)
              })
              this.model.posCategoryIds = temPosCategoryIds
              // 清空数据
              temPosCategoryIds = null
            }
          })
        }
        if (this.active === 'parentName') {
          this.model.parentPositionId = item.posPositionId
          this.model.parentPositionName = item.name
        }
      }
    },
    changeOrg () {
      // console.log(this.model.orgUnitId)
      // 如果前一个id不是空的话（不是初始加载的话）
      if (this.preOrgUnitId !== '') {
        // 如果改变的id不是前一个的话且不为空的话
        if (this.model.orgUnitId !== this.preOrgUnitId && this.model.orgUnitId !== '') {
          if (this.model.name !== '') {
            this.$refs.position && this.$refs.position.validate()
          }
          // this.getParentPositionGroup(this.model.orgUnitId)
          // this.getParentPositionGroup()
        }
      }
      // 如果改变的orgUnit不为空，则添加为前一个preOrgUnitId记录
      if (this.model.orgUnitId !== '') {
        this.preOrgUnitId = this.model.orgUnitId
      }
      if (!this.firstChange) {
      // 如果不是第一次替换的，则需要清空
        this.model.parentPositionId = ''
      }
      this.firstChange = false
    },
    orgUnitProps (data, node) {
      return node.status === '2'
    },
    // 获取并向上发出限制时间
    controlLimitTime () {
      if (!this.model.posStandardJobId) return this.$emit('limitTime', 0)
      let params = {
        operationType: this.model.operationType,
        // 所属的标准职位id
        parentId: this.model.posStandardJobId,
        posPositionId: this.model.posPositionId
      }
      req('getLimitTime', params).then(data => {
        this.$emit('limitTime', data)
      })
    }
  },
  created () {
    // if (this.model.orgNode) {
    //   // this.getParentPositionGroup(this.model.orgNode.orgUnitId)
    //   this.getParentPositionGroup()
    // }
    this.preOrgUnitId = this.model.orgNode.orgUnitId
  }
}
</script>

<style lang="scss" scoped>

</style>
