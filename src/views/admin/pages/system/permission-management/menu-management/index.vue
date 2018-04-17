<template>
  <div class="menu-management">
    <!-- <i-layout> -->
    <i-layout fix-aside :aside-padding="0">

      <!-- 左边按钮和tree -->
      <div slot="aside" class="aside" v-loading="loading" :element-loading-text="$loadingText">
        <div class='btn-group'>
          <template>
            <i-control-layout :btnCol="4" :toolbar="buttonControl" justifyContent="flex-start"></i-control-layout>
          </template>
        </div>
        <div class="content">
          <div class="grid-content bg-purple treeLeft">
            <el-tree
              ref="menuTree"
              :data="menuData"  
              :props="defaultProps"
              node-key="menuId"
              highlight-current="true"
              :default-expanded-keys="[currentKey]"
              @node-click="fillinParam"></el-tree>
          </div>
        </div>
      </div>

      <!-- 右边form表单 -->
      <div slot="section">
        <div class="grid-content bg-purple-light lxMenuForm">
          <el-form
            ref="form"
            class="myForm"
            label-width="80px"
            :model="postParams"
            :rules="rules"
            >
            <el-form-item label="上传图标" :disabled="!edit" class="uploadImage">
              <el-upload
                :class="editStatu + ' avatar-uploader'"
                :action="`${$$.BASE_URL}${iconUploadApi}`"
                :disabled="!edit"
                :show-file-list="false"
                :before-upload="handlePictureCardBeforeUpload"
                :on-error="handlerError"
                :on-success="handlerSuccess">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" :title="titleInfo">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <!-- <i class="el-icon-plus"></i> -->
              </el-upload>
              <span class="warnWord">支持jpg、jpeg、png格式的图片</span>
            </el-form-item>
            <el-form-item label="菜单名称" prop='menuName'>
              <el-input v-model="postParams.menuName" :disabled="!edit" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="上级菜单">
              <el-input v-if="!edit" disabled v-model="defaultMenuNode.menuName" maxlength="100"></el-input>
              <i-select-tree 
                v-else
                dataKey="menus"
                nodeKey="menuId"
                v-model="postParams.parentMenuId"
                @input="handleChange"
                :lazy="false"
                :selectedNode.sync="defaultMenuNode"
                :props="defaultOptions"
                >
              </i-select-tree>
            </el-form-item>
            <el-form-item label="菜单类型" prop="menuType" >
              <!-- <el-input v-model="postParams.menuType" :disabled="!edit" ></el-input>    -->
              <i-select v-model="postParams.menuType" parameter="MENU_TYPE" :disabled="!edit" placeholder="请选择菜单类型"></i-select>
            </el-form-item>
            <!-- 当菜单类型为其他菜单的时候需要显示的下拉菜单 --> 
            <el-form-item label="访问地址" prop="menuAddress" v-if="showOtherMean">
              <el-input v-model="postParams.menuAddress" :disabled="!edit" maxlength="100"></el-input>                   
            </el-form-item>
            <!-- 当菜单类型为报表菜单的时候需要显示的下拉菜单 -->
            <el-form-item label="访问地址" prop="menuAddress" v-if="showBaoBiaoMean">
              <el-select v-model="postParams.menuAddress" filterable  placeholder="请选择访问地址" :disabled="!edit">
                <el-option
                  v-for="item in baoBiaoMenu"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
                <!-- <i-select v-model="postParams.menuAddress" :options="baoBiaoMenuShow" placeholder="请选择访问地址"></i-select>                  -->
            </el-form-item>
            <el-form-item label="顺序" prop="orderNo" required>
              <el-input v-model="postParams.orderNo" :disabled="!edit" maxlength="100"></el-input>   
            </el-form-item>                                
            <!-- <el-form-item label="展开方式" >
              <i-select parameter="MENU_OPEN_WAY" v-model="postParams.openWay" :disabled="!edit"/>
            </el-form-item> -->
            <!-- <el-form-item label="是否可见" prop="isVisible">
              <i-select parameter="WHETHER_TYPE" v-model="postParams.isVisible" :disabled="!edit" />
            </el-form-item> -->
            <el-form-item label="描述"  >
              <el-input type="textarea" v-model="postParams.description" :disabled="!edit" maxlength="100"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <!-- 提交按钮 -->
        <div class="btn-group2" v-if="edit">
          <!-- <el-button type="primary">返 回</el-button> -->
          <el-button type="primary" @click="submitMenuList" :disabled="btnable">提 交</el-button>
        </div>
      </div> 
    </i-layout>
  </div>
</template>

<script>
import req from 'api/system/menu-management'
import ISelect from 'components/common/i-select/i-select'
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form'
import IDialog from 'components/common/i-dialog/i-dialog'
import ISelectTree from 'components/common/i-select-tree/i-select-tree'
import ILayout from 'components/common/i-layout'
import {jsonTree} from 'utils/index'
import IControlLayout from 'components/common/i-control-layout/i-control-layout.vue'
import access from 'mixins/access'
export default {
  components: {
    ISelect,
    ITable,
    IForm,
    IDialog,
    ISelectTree,
    ILayout,
    IControlLayout
  },

  mixins: [access],

  data () {
    /* eslint-disable */
    // let checkUrl = (rule, value, cb) => {
    //     let myreg = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/;
    //     !value && cb()
    //     value && setTimeout(function() {
    //       !myreg.test(value) ? cb(new Error("请输入正确的URL格式")) : cb();
    //     }, 100);
    //   }
    return {
      // 是否显示除报表类型外其他报表类型对应访问地址填写输入框
      showOtherMean: false,
      // 是否显示报表类型对应访问地址选择菜单
      showBaoBiaoMean: false,
      // 记录请求到的报表菜单数据
      baoBiaoMenu: [],
      // 当报表菜单下拉菜单出现传递数据
      // baoBiaoMenuShow: null,
      // 提交按钮控制
      btnable: false,
      // 已选节点数据
      defaultMenuNode: {},
      // 暂时数据
      dataList: null,
      // 菜单tree数据
      menuData: null,
      // tree配置选项
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      // i-select-tree配置选项
      defaultOptions: {
        children: 'children',
        label: 'menuName'
      },
      // input禁用状态
      edit: false,
      // parentMenuName: [],
      // 表单数据
      postParams: {
        menuId: '',
        menuName: '',
        parentMenuId: '',
        menuAddress: '',
        orderNo: '',
        menuType: '',
        // openWay: '',
        // 这个字段是默认要这么传的
        isVisible: '',
        description: ''
      },
      // 图片上传接口
      iconUploadApi: '/system/attachments/image',
      // 上传的图片地址
      imageUrl: '',
      // 上传图片成功之后返回的ID
      iconId: '',
      // 获取图片的地址
      getImageApi: '/system/attachments/image/',
      // 图片提示信息
      titleInfo: '',
      // 新增标记
      isCreate: false,
      // form: {
      //   name: ''
      // },
      // 编辑标记
      isEdit: false,
      // openWayList: [
      //   {value: '_blank', label: '新页面'},
      //   {value: '_self', label: '当前页面'}
      // ],
      rules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        orderNo: [
          { validator: (rule, value, callback) => {
            if (!value && !/^0$/.test(value)) {
              return callback(new Error('请输入菜单顺序'));
            }
            if (/^\d+$/.test(value)) {
              callback()
            } else {
              callback(new Error('请输入数字'))
            }
          },
          trigger: 'blur' }
        ],
        menuAddress: [
          { required: true, message: '请输入访问地址', trigger: 'blur' }
        ],
        // iframeAddress: [
        //   { validator: checkUrl, trigger: "change" }
        // ],
        menuType: [
          { required: true, message: '请选择菜单类型', trigger: 'change' }
        ],
        // isVisible: [
        //   { required: true, message: '请选择是否可见', trigger: 'blur' }
        // ],
        des: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      },
      // toolbar: [{
      //   text: '确定',
      //   type: 'primary',
      //   func: (done) => {
      //     // this.selectNode()
      //     done()
      //   }
      // }],
    //   中文模态框
      // cdialogVisible: false,
    //   英文模态框
      // edialogVisible: false,
      // isAble: true,
      // isLanguage: true,
      // selectNodes: {},
      // 选择的节点id
      selectId: '',
      // myComponent: 'i-control-layout',
      // 按钮组
      buttonControl: [
        {
          text: '新增',
          type: 'primary',
          key: 'sysMenusMenuPost',
          func: this.createMenu
        },
        {
          text: '编辑',
          type: 'primary',
          key: 'sysMenusMenuPut',
          func: this.editorMenu
        },
        {
          text: '删除',
          type: 'danger',
          key: 'sysMenusMenuDelete',
          func: this.deleteMenu
        }
      ],
      // 当前选中的节点
      currentKey: '',
      loading: true
    }
  },

  watch: {
    'postParams.menuType' (val) {
      this.isCreate && (this.postParams.menuAddress = null)
      this.isEdit && (this.postParams.menuAddress = null)
      if (val === '3') {
        this.showBaoBiaoMean = true
        this.showOtherMean = false
      } else if (val !== '3' && val) {
        this.showBaoBiaoMean = false
        this.showOtherMean = true
      } else {
        this.showBaoBiaoMean = false
        this.showOtherMean = false
      }
    }
  },

  computed: {
    editStatu () {
      !this.edit && (this.titleInfo = '')
      this.edit && (this.titleInfo = '点击图片切换')
      return !this.edit ? 'noDrop' : 'pointer'
    }
  },

  methods: {
    // 获取菜单列表
    getMenusList () {
      return req('getMenusList')
      .then(data => {
        this.dataList = data
        this.menuData = jsonTree(data, {id: 'menuId', pid: 'parentMenuId'})
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
    },
    // 新建菜单
    postCreateMenu (postParams) {
      this.btnable = true
      // 默认为Y 写死
      postParams.isVisible = 'Y'
      // 默认为Y 写死
      req('postCreateMenu', postParams)
      .then(res => {
        this.$message({
          message: '新建菜单成功',
          type: 'success'
        })
        this.currentKey = res
        this.selectId = res
        this.imageUrl = ''
        this.iconId = ''
        this.isCreate = false
        this.toNull(this.postParams)
        this.defaultMenuNode.menuName = ''
        // this.parentMenuName = ''
        this.loading = true
        this.getMenusList()
        .then(() => {
          this.edit = false
          this.btnable = false
          this.$refs.menuTree.setCurrentKey(this.currentKey)
          this.getDefault(this.$refs.menuTree.getCurrentNode())
        })
        
      }).catch(() => { this.btnable = false })
    },
    // 更新菜单
    putMenu (postParams) {
      this.btnable = true
      // 默认为Y 写死
      postParams.isVisible = 'Y'
      // 默认为Y 写死
      req('putMenu', postParams)
      .then(res => {
        this.$message({
          message: '更新菜单成功',
          type: 'success'
        })
        this.isEdit = false
        this.loading = true
        this.getMenusList()
        .then(() => {
          this.edit = false
          this.btnable = false
          this.$nextTick(function () {
            this.$refs.menuTree.setCurrentKey(this.currentKey)
          })
        })
      }).catch(() => { this.btnable = false })
    },

    getDefault (data, node, event) {
      this.defaultMenuNode = {}
      this.imageUrl = ''
      this.iconId = ''
      this.iconId = data.icon
      this.iconId && (this.imageUrl = `${this.$$.BASE_URL}${this.getImageApi}${this.iconId}`)
      Object.keys(data).map(key => (this.postParams[key] = data[key]))
      this.dataList.map(key => {
        key.menuId === data.parentMenuId && (this.defaultMenuNode = JSON.parse(JSON.stringify(key)))
      })
    },
    // el-tree点击节点的回调
    fillinParam (data, node, event) {
      // 左侧点击切换树节点时候重置表单来结局节点切换规则验证提示任然存在问题
      this.$refs['form'].resetFields()
      this.selectId = data.menuId
      this.edit = false
      this.isEdit = false
      this.getDefault(data, node, event)
      this.currentKey = data.menuId
    },
    // showTree () {
    //   this.visible.showTree = true
    // },

    // selectNode (value) {
    //   this.postParams.parentMenuId = this.parentMenuName[value.length - 1]
    // },
    // 新增菜单
    createMenu () {
      this.toNull(this.postParams)
      // this.parentMenuName = []
      this.isCreate = true
      this.edit = true
      this.imageUrl = ''
      this.iconId = ''
    },
    // 清空数据
    toNull (obj) {
      Object.keys(obj).map(key => {
        obj[key] = ''
      })
    },
    // 编辑菜单
    editorMenu () {
      if (this.selectId) {
        this.isCreate = false
        this.edit = true
        this.isEdit = true
        this.btnable = false
      } else {
        this.$message('请先选择需要编辑的组织')
      }
    },
    // 删除菜单
    deleteMenu () {
      if (this.selectId) {
         //  获取数据，发送请求删除
        this.$confirm('此操作将永久删除该菜单，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let menuIds = this.selectId
          menuIds && req('deleteMenu', {menuIds})
          .then(res => {
            this.$message({
              message: '删除菜单成功',
              type: 'success'
            })
            this.loading = true
            this.getMenusList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message('请先选择需要删除的组织')
      }
    },
    // 提交
    submitMenuList () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$set(this.postParams, 'icon', this.iconId)
          this.isCreate && this.postCreateMenu(this.postParams)
          this.isEdit && this.putMenu(this.postParams)
        } else {
          this.$message.error('请将信息填写完整')
        }
      })
    },
    // 不能选择本身为上级菜单
    // handleChange (value) {
    //   if (!this.isCreate && this.selectId) {
    //     if (this.postParams.menuId === value) {
    //       this.$message.error('您不能选择本身为上级菜单')
    //       this.btnable = true
    //     } else {
    //       this.btnable = false
    //     }
    //   }
    // },
    // 请求别人服务器上的报表菜单数据
    getReportsMenu () {
      req('getReportsMenu')
      .then(res => {
        this.baoBiaoMenu = res
      })
    },
    // 上传之前
    handlePictureCardBeforeUpload (file) {
      const typeStatu = (file.type === 'image/jpeg' || file.type === 'image/png') ? true : false
      const sizeStatu = file.size / 1024 / 1024 < 2;
      if (!typeStatu) {
        this.$message.error('图片必须是jpeg或者png格式')
        return false
      }
      if (!sizeStatu) {
        this.$message.error('图片大小不能超过2MB')
        return false
      }
      return typeStatu && sizeStatu
    },
    // 文件上传成功
    handlerSuccess (res, file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.iconId = res
      this.$message.success('图片上传成功')
    },
    // 文件上传失败
    handlerError (err, file, fileList) {
      this.$message.error('图片上传失败，请重新选择上传')
    }
    // 获取上传的文件地址
    // getPic () {
    //   req('getPic',{imageId: this.iconId})
    //   .then(res => {
    //     this.imageUrl = 
    //   })
    // }
  },

  created () {
    this.getMenusList()
    this.getReportsMenu()
  }
}
</script>

<style lang="scss">
  .menu-management {
    .myForm {
      width: 50%;
      .noDrop {
        display: inline-block;
        .el-upload {
          cursor: no-drop;
          vertical-align: top;
        }
      }
      .pointer {
        display: inline-block;
        .el-upload {
          cursor: pointer;
        }
      }
      .uploadImage {
        overflow: hidden;
        .avatar-uploader {
          float: left;
        }
        .warnWord {
          float: left;
          margin-left: 20px;
          color: #C0C4CC;
          font-size: 13px;
        }
      }
    }
    .btn-group {
        margin:15px;
        height: 30px;
    }
    .el-button-group .el-button+.el-button {
        margin-left: 20px;
    }
    .content {
        // margin:10px;
      .treeLeft {
        // width:220px !important;
        height: 422px !important;
        // border:1px solid #d1dbe5;
        overflow: auto;
      }
      .editorName {
        width:60px;
        height: 28px;
        position: absolute;
        right: 0;
        top:5px;
        line-height:0;
        color:#97a9be
     }
    }
    .btn-group2 {
      // text-align: center
      width: 400px;
      text-align: left;
      padding-left: 80px;
    }
  }

</style>

<style>
  .lxMenuForm .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .lxMenuForm .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .lxMenuForm .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 56px;
    height: 56px;
    line-height: 56px;
    text-align: center;
  }
  .lxMenuForm .avatar {
    width: 56px;
    height: 56px;
    display: block;
  }
</style>

