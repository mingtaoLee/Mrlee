<template>
  <i-dialog
    size="large"
    :title="title"
    :toolbar="toolbar"
    v-model="show"
    @close="handleClose">
    <el-form
      ref="principalForm"
      label-width="100px"
      label-position="right"
      :model="principalModel"
      :rules="principalRules">
      <ul class="i-dialog-form">
        <li class="item">
          <el-form-item
            required
            label="主体编码"
            prop="code">
            <el-input v-model="principalModel.code" @keyup="checkCodeUnique"></el-input>
          </el-form-item>
        </li>

        <li class="item">
          <el-form-item
            required
            label="主体名称"
            prop="name">
            <el-input v-model="principalModel.name"></el-input>
          </el-form-item>
        </li>

        <li class="item">
          <el-form-item
            required
            label="主体类型"
            prop="principalType">
            <!-- TODO: WP_M_PRINCIPAL 下拉选项字典 -->
            <i-select
              v-model="principalModel.principalType"
              parameter="WP_M_PRINCIPAL"
              @change="(value) => { principalModel.principalType = value }">
            </i-select>
          </el-form-item>
        </li>
      </ul>

      <el-form-item
        v-if="false"
        required
        label="主体返回字段"
        prop="entityPk">
        <el-input v-model="principalModel.entityPk"></el-input>
      </el-form-item>
    </el-form>
    <item-table
      v-if="principalModel.principalType==='01'"
      :items="principalModel.items"
      @save="saveItems">
    </item-table>
    <item-table1
      v-if="principalModel.principalType==='02'"
      :items="principalModel.settingLists"
      @saveSettingLists="saveSettingLists">
    </item-table1>
  </i-dialog>
</template>

<script>
import req from 'api/common/flow.js'
import ItemTable from './item-table'
import ItemTable1 from './item-table1'
import ILayout from 'components/common/i-layout'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
// import { getDict } from 'utils/index.js'

export default {
  name: 'PrincipalCuDialog',

  components: {
    IDialog,
    ILayout,
    ItemTable,
    ItemTable1
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

    // 修改主体对象
    principal: {
      required: true,
      type: Object,
      default: null
    }
  },

  data () {
    const codeValidator = (rule, val, cb) => {
      !val
        ? cb(new Error('请填写主体编码'))
        : !this.isCodeUnique && this.type.toLowerCase() === 'c'
          ? cb(new Error('主体编码重复'))
          : cb()
    }

    const nameValidator = (rule, val, cb) => {
      !val
        ? cb(new Error('请填写主体名称'))
        : !this.isNameUnique && this.type.toLowerCase() === 'c'
          ? cb(new Error('主体名称重复'))
          : cb()
    }

    return {
      principalModel: {
        code: '',
        name: '',
        principalType: '',
        entityPk: '',
        items: [],
        settingLists: []
      },
      // 维度校验规则
      principalRules: {
        code: { validator: codeValidator, trigger: 'blur' },
        name: { validator: nameValidator, trigger: 'blur' },
        principalType: {
          required: true,
          message: '请选择主体类型',
          trigger: 'blur'
        },
        entityPk: {
          required: true,
          message: '请填写主体返回字段',
          trigger: 'blur'
        }
      },

      // 对话框相关
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

      // 主体Code是否唯一
      isCodeUnique: true,

      // 主体Name是否唯一
      isNameUnique: true
    }
  },

  computed: {
    title () {
      return this.type.toLowerCase() === 'c'
        ? '新增主体'
        : '修改主体'
    }
  },

  mounted () {
    // this.getEntityTypes()
    // 适应新增和修改情况 是否将principalModel改为computed?
    this.principalModel = { ...this.principal }
    if (!this.principal) {
      this.principalModel = {
        code: '',
        name: '',
        principalType: '',
        entityPk: '',
        items: [],
        settingLists: []
      }
    }
  },

  methods: {
    /** 获取主体类型下拉列表 */
    // getEntityTypes () {
    //   console.log('--- entity-type ---')
    //   getDict('WP_M_PRINCIPAL').then(res => console.log(res))
    // },

    /** 检测主体Code是否唯一 */
    checkCodeUnique (code) {
      req('getIsCodeDuplicate', {
        code: code
      }).then(res => {
        this.isCodeUnique = !res
      })
    },

    /** 检测主体名称是否唯一 */
    checkNameUnique (name) {
      req('getIsNameDuplicate', {
        name: name
      }).then(res => {
        this.isNameUnique = !res
      })
    },

    /** 点击确定按钮 */
    operateConfirm (done) {
      this.$refs['principalForm'].validate(valid => {
        if (valid) {
          if (this.type.toLowerCase() === 'c') {
            req('postFlowPrincipal', this.principalModel).then(res => {
              if (res) {
                this.$emit('updated')
                done()
              }
            })
          } else if (this.type.toLowerCase() === 'u') {
            req('putFlowPrincipal', this.principalModel).then(res => {
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
    },

    /** 保存主体管理维度数据 */
    saveItems (items) {
      this.principalModel.items = items
    },
    saveSettingLists (items) {
      this.principalModel.settingLists = items
    }
  }
}
</script>

<style lang="scss" scoped>
.i-dialog-form {
  display: flex;
  justify-content: space-between;
  .item {
    width: 33%
  }
}
</style>
