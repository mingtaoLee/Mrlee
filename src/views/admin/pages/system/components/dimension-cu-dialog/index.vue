<template>
  <i-dialog
    size="standard"
    :title="title"
    :toolbar="toolbar"
    v-model="show"
    @close="handleClose">
    <el-form
      ref="dimensionForm"
      label-width="100px"
      label-position="right"
      :model="dimensionModel"
      :rules="dimensionRules">
      <ul class="i-dialog-form">
        <li class="item">
          <el-form-item
            required
            label="维度Key"
            prop="dimensionKey">
            <el-input v-model="dimensionModel.dimensionKey" @keyup.native="checkKeyUnique"></el-input>
          </el-form-item>

          <el-form-item
            required
            label="表名"
            prop="objectName">
            <el-input v-model="dimensionModel.objectName"></el-input>
          </el-form-item>
        </li>

        <li class="item">
          <el-form-item
            required
            label="维度名称"
            prop="dimensionName">
            <el-input v-model="dimensionModel.dimensionName"></el-input>
          </el-form-item>

          <el-form-item
            required
            label="字段名"
            prop="fieldName">
            <el-input v-model="dimensionModel.fieldName"></el-input>
          </el-form-item>
        </li>
      </ul>
      <el-form-item
        required
        label="链接路径"
        prop="linkPaths">
        <el-input v-model="dimensionModel.linkPaths"></el-input>
      </el-form-item>
    </el-form>
  </i-dialog>
</template>

<script>
import req from 'api/common/flow.js'
import ILayout from 'components/common/i-layout'
import IDialog from 'components/common/i-dialog/i-dialog.vue'

export default {
  name: 'DimensionCuDialog',

  components: {
    IDialog,
    ILayout
  },

  props: {
    // 类型 c：新增, u: 修改
    type: {
      required: true,
      type: String,
      default: ''
    },

    // 对话框标志
    show: {
      required: true,
      type: Boolean,
      default: false
    },

    // 初始维度对象
    dimension: {
      required: true,
      type: Object,
      defualt: null
    }
  },

  data () {
    const namevalidator = (rule, val, cb) => {
      !val
        ? cb(new Error('请填写维度Key'))
        : !this.isKeyUnique && this.type.toLowerCase() === 'c'
          ? cb(new Error('维度Key重复'))
          : cb()
    }

    return {
      // 维度表单对象
      dimensionModel: {
        dimensionKey: '',
        dimensionName: '',
        objectName: '',
        fieldName: '',
        linkPaths: ''
      },

      // 维度校验规则
      dimensionRules: {
        dimensionKey: { validator: namevalidator, trigger: 'blur' },
        dimensionName: { required: true, message: '请填写维度名称', trigger: 'blur' },
        objectName: { required: true, message: '请填写表名', trigger: 'blur' },
        fieldName: { required: true, message: '请填写字段名', trigger: 'blur' },
        linkPaths: { required: true, message: '请填写链接路径', trigger: 'blur' }
      },

      // 对话框按钮
      toolbar: [{
        text: '取消',
        type: 'default',
        func: done => done()
      }, {
        text: '确定',
        type: 'primary',
        func: this.operateConfirm
      }],

      // 维度Key是否唯一标识
      isKeyUnique: true
    }
  },

  computed: {
    title () {
      return this.type.toLowerCase() === 'c'
        ? '新增维度'
        : '修改维度'
    }
  },

  mounted () {
    this.dimensionModel = Object.assign({}, this.dimensionModel, this.dimension)
  },

  methods: {
    /** 检测维度Key是否唯一 */
    checkKeyUnique (key) {
      req('getIsKeyDuplicate', {
        dimensionKey: this.dimensionModel.dimensionKey
      }).then(res => {
        this.isKeyUnique = !res
      })
    },

    /** 点击确定按钮 */
    operateConfirm (done) {
      this.$refs['dimensionForm'].validate(valid => {
        if (valid) {
          if (this.type.toLowerCase() === 'c') {
            req('postFlowDimension', this.dimensionModel).then(res => {
              if (res) {
                this.$emit('updated')
                done()
              }
            })
          } else if (this.type.toLowerCase() === 'u') {
            req('putFlowDimension', this.dimensionModel).then(res => {
              if (res) {
                this.$emit('updated')
                done()
              }
            })
          }
        } else {
          return false
        }
      })
    },

    /** 控制弹框标示 */
    handleClose () {
      this.show = false
      this.$emit('update:show', false)
    }
  }
}
</script>
