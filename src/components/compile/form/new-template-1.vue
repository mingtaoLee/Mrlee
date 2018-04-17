<template>
  <div class="wrap p20">
    <el-form ref="form" :model="model" :rules="rules" label-width="140px" label-position="right">
      <el-form-item label="模板名称：" prop="modName">
        <el-col :span="12">
          <el-input v-model.trim="model.modName" :disabled="ifMotify"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="适用范围：" prop="orgs">
        <el-col :span="12">
          <i-select-tree
            placeholder=""
            :lazy="true"
            sizeAuto
            :multiple="true"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="model.orgs"
            :selectedNode.sync="model.orgNodes"
            :props="orgProps"
          ></i-select-tree>
        </el-col>
      </el-form-item>
      <el-form-item prop="dimensionCode" label="编制维度：">
        <el-col :span="12">
          <i-select
            placeholder=""
            clearable
            v-model="model.dimensionCode"
            @change="handleCodeChange"
            parameter="DIMENSION">
          </i-select>
        </el-col>
      </el-form-item>
      <el-form-item prop="dimensions" v-if="model.dimensionCode === '02'">
        <el-col :span="12">
          <i-select-tree
            placeholder=""
            :lazy="false"
            sizeAuto
            :multiple="true"
            :check-same-level="true"
            :check-strictly="true"
            dataKey="jobFamilys"
            nodeKey="posJobFamilyId"
            v-model="model.dimensions"
            :selectedNode.sync="model.jobNodes"
            :props="jobProps"
          ></i-select-tree>
        </el-col>
      </el-form-item>
      <el-form-item prop="dimensions" v-else>
        <el-col :span="12">
          <el-select
            placeholder=""
            v-model="model.dimensions"
            :multiple="true"
            @change="handleDimensionsChange"
            clearable>
            <el-option
              v-for="item in model.jobNodes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/**
 * @prop {Object} model 传进来的数据
 * @prop {Boolean} ifMotify 确认是否为修改操作
 */
import reqTp from 'api/compile/template'
import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import ISelect from 'components/common/i-select/i-select.vue'
export default {
  name: 'NewTemplate1',
  components: {
    ISelectTree,
    ISelect
  },
  props: {
    model: {
      type: Object,
      default () {
        return {}
      }
    },
    ifMotify: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var check = (rule, value, callback) => {
      // 修改操作下,返回，不进行校验
      this.ifMotify && callback()
      // 新建操作下, 检查名称唯一性
      !this.ifMotify && this.checkName()
      .then(res => {
        res ? callback({ successMessage: '该名称可以使用' }) : callback(new Error('该名称不可用'))
      })
      .catch(() => {
        console.log('获取数据失败')
      })
    }
    return {
      // 表单的验证规则
      rules: {
        modName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { validator: check, trigger: 'blur' }
        ],
        orgs: [
          { required: true, message: '请选择适用范围', trigger: 'blur' }
        ],
        dimensionCode: [
          { required: true, message: '请选择编制维度', trigger: 'change' }
        ],
        dimensions: [
          { required: true, type: this.model.dimensionCode === '02' ? 'string' : 'array', message: '请选择节点', trigger: 'blur' }
        ]
      },
      orgProps: {                                        // 组织下拉树的配置
        children: 'children',
        label: 'orgUnitName'
      },
      jobProps: {                                        // 维度下拉树的配置
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      data: null,                                        // 下拉列表的数据
      once: false,                                       // 维度, 阻塞数据第一次带入引起的变化
      banOnceChange: true                                // 监听编制维度下面的选择, 阻塞空值引起的变化
    }
  },
  watch: {
    'model.orgs' (val) {
      this.once && this.handleOrgsChange()
      this.validateOrgs()
    },
    'model.dimensions' () {
      this.handleDimensionsChange()
    }
  },
  methods: {
    // 检查模板名称唯一性
    checkName () {
      return reqTp('checkName', {modName: this.model.modName})
    },
    // 根据不同维度，展示不同下拉树/表
    handleCodeChange (index) {
      // 切换不同的校验规则
      this.rules.dimensions = [
        { required: true, type: this.model.dimensionCode === '02' ? 'string' : 'array', message: '请选择节点', trigger: 'blur' }
      ]
      // 阻塞第一次代入数据的时候触发这函数
      if (!this.once && this.ifMotify) {
        this.once = true
        return
      } else {
        this.once = true
      }
      // 重置
      this.model.dimensions = []
      this.model.jobNodes = []
      // 去除检验字段
      this.$refs.form.validateField('dimensionCode', valid => {})
      // 若为空和职群职种，则推出，则退出
      if (!index || index === '02') return
      // 在不是职群职种下，判断是否存在适用范围，如果没有，则返回
      if (!this.model.orgs && index !== '02' && index !== null) {
        this.$message.warning('请先选择适用范围')
        return
      }
      var urlName = {
        '01': 'getTitles',
        '03': 'getStdJobs',
        '04': 'getPositions'
      }
      this.fetch(urlName[index])
    },
    // 重新选择适用范围，重置下面选择
    handleOrgsChange () {
      this.model.dimensionCode = null
    },
    validateOrgs () {
      // 去除检验字段
      this.$refs.form.validateField('orgs', valid => {})
    },
    // // 监听编制维度下面的选择，去除检验规则字段
    handleDimensionsChange (val) {
      // 阻塞空数据变化
      if (!val) {
        return
      }
      // 阻塞第一次空数组
      if (this.banOnceChange && val.length === 0) {
        this.banOnceChange = false
        return
      }
      this.$refs.form.validateField('dimensions', valid => {})
    },
    // 获取维度数据
    fetch (url) {
      // 转换数据,新添统一属性id
      const unifyId = (res) => {
        Array.from(res).forEach(item => {
          // 获取相对应的id值的key
          var key = Object.keys(item).filter(key => /\w*[I,i]{1}d$/g.test(key))
          item['id'] = item[key]
        })
        this.model.jobNodes = res
      }
      let params = {
        orgs: this.model.orgs
      }
      reqTp(url, params).then(res => unifyId(res))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>