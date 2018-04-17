<template>
  <div class="content-follow new-batch-position">
      <h2 class="info-title">维护明细</h2>
      <div class="info-content">
        <div class="create-base">

          <div class="tree-aside">
            <header>
              <span class="check-only-create">只看已创建的职群职种</span>
              <el-checkbox v-model="checkOnlyCreate"></el-checkbox>
              <el-button class="new-position-button" plain @click="newJobFamily" v-if="showMap.create">新建职群</el-button>
            </header>

            <section>
              <!-- 显示的职群职种树 -->
              <el-tree
                ref="tree"
                node-key="posJobFamilyId"
                :data="treeData"
                :expand-on-click-node="false"
                :render-content="renderContent"
                :filter-node-method="filterNode"
                :default-expanded-keys="expandedKeys"
                @node-click="handleNodeClick"
              >
              </el-tree>
            </section>

          </div>

          <transition name="el-zoom-in-left">
          <div class="form-beside" v-show="showFormBeside">
            <header>
              <span class="create-title">新建{{createTarget}}</span>
              <i class="el-icon-close create-shutdown-icon" @click="(showFormBeside=false)&&this.clearForm()"></i>
            </header>
            <section v-if="showFormBeside">
              <el-form ref="form" :model="model" :rules="rules" label-width="120px">
                <el-form-item v-show="node.level===2||node.level===3">
                  <span slot="label">所属职群名称</span>
                  <el-input v-model="model.jobFamilyName" disabled></el-input>
                </el-form-item>
                <el-form-item v-show="node.level===3">
                  <span slot="label">所属职种名称</span>
                  <el-input v-model="model.jobClassName" disabled></el-input>
                </el-form-item>
                <el-form-item  v-if="showMap.name" prop="name">
                  <span slot="label">{{createTarget}}名称</span>
                  <el-input v-model="model.name" :disabled="disabledMap.name"></el-input>
                </el-form-item>
                <el-form-item v-if="showMap.remark" label="备注" prop="remark">
                  <el-input v-model="model.remark" type="textarea" :disabled="disabledMap.remark"></el-input>
                </el-form-item>
              </el-form>
            </section>
            <footer v-if="showMap.create">
              <div class="confirm-button">
                <el-button @click="showFormBeside = false">取消</el-button>
                <el-button type="primary" @click="confirmNew">确认</el-button>
              </div>
            </footer>
          </div>
          </transition>

        </div>
      </div>
  </div>
</template>

<script>
import req from 'api/position/occupation'
import { jsonTree } from 'utils'

export default {
  name: 'NewBatchPosition',
  components: {

  },
  props: {
    inputData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    const checkName = (rule, value, callback) => {
      if (!value || value === this.node.data.name) return callback()
      if (!this.node) return checkList(null, value, callback)
      if (this.modify) {
        checkList(this.node.parent.childNodes, value, callback)
      } else {
        checkList(this.node.childNodes, value, callback)
      }
    }
    const checkList = (data, value, callback) => {
      let nameList = []
      let checkListData = data || this.treeData
      checkListData.forEach(ele => {
        nameList.push(data ? ele.data.name : ele.name)
      })
      if (nameList.includes(value)) {
        callback(new Error('同级已存在该名称，不可新建'))
      } else {
        let params = {
          parentId: this.node.data.parentId,
          name: value
        }
        if (typeof params.parentId === 'string') {
          return callback()
        }
        req('checkOcName', params).then(valid => {
          if (valid) {
            callback()
          } else {
            callback(new Error('同级已存在该名称，不可新建'))
          }
        })
      }
    }
    return {
      // 是否显示右侧表单栏
      showFormBeside: false,
      // 点击新增的父节点
      parentId: -1,
      // 点击新增的父节点层数
      jobFamilyType: 0,
      // 保存点击的node节点
      node: null,
      model: {
        // 所属职群
        jobFamilyName: '',
        // 所属职种
        jobClassName: '',
        // 右侧面板显示的名称
        name: '',
        // 右侧面板显示的备注
        remark: ''
      },
      // 验证规则
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        remark: [{ max: 512, message: '长度不能超过512个字符', trigger: 'blur' }]
      },
      // 保存展开的keys
      expandedKeys: [],
      // 是否修改数据
      modify: false,
      // 只显示新建的职群职种
      checkOnlyCreate: false,
      // 新建的目标
      createTarget: '职种',
      // 职群职种树数据
      treeData: [],
      // 显示新增删除的icon
      showIcon: false,
      // 配置
      targetConfig: {
        '0': '职群',
        '1': '职种',
        '2': '子职种'
      },
      // 自增的id字符串
      idControl: '0'
    }
  },

  watch: {
    checkOnlyCreate (value) {
      this.checkNewList(value)
    }
  },

  created () {
    this.inputData.length ? this.formatTree(this.inputData) : this.formatTree()
  },

  methods: {
    // 格式化职群职种树
    formatTree (data) {
      if (data) {
        return (this.treeData = data)
      }
      req('getTreeAvailable').then(data => {
        let config = {
          id: 'posJobFamilyId',
          pid: 'parentId'
        }
        this.treeData = jsonTree(data, config)
      })
    },
    // 控制显示已创建的节点
    checkNewList (value) {
      this.$refs.tree.filter(value)
    },
    // 过滤规则
    filterNode (value, data) {
      if (!value) return true
      return !!data.newData
    },
    // 清除form表单
    clearForm () {
      for (let key in this.model) {
        this.model[key] = ''
      }
    },
    // 控制打开表单面板
    openFormPanel () {
      this.clearForm()
      this.modify = false
      if (this.node) {
        switch (this.node.level) {
          case 1:
            this.model.jobFamilyName = this.node.data.name
            break
          case 2:
            this.model.jobFamilyName = this.node.parent.data.name
            this.model.jobClassName = this.node.data.name
            break
        }
      }
      this.showFormBeside = true
    },
    // 新建职群
    newJobFamily () {
      this.node = null
      // this.openFormPanel()
      this.showFormBeside = false
      this.parentId = -1
      this.jobFamilyType = 0
      this.createTarget = '职群'
      this.fakeNewClass()
    },
    // 新建职种或子职种
    newJobClass (e, node) {
      e.stopPropagation()
      if (!node.data.newData && node.level === 2 && node.isLeaf) {
        this.checkHasStandardJob(node.data.posJobFamilyId, valid => {
          if (valid) {
            this.actNewJobClass(node)
          } else {
            this.$message.warning('该职种包含标准职位，不允许新建')
          }
        })
      } else {
        this.actNewJobClass(node)
      }
    },
    // 执行操作
    actNewJobClass (node) {
      this.node = node
      // this.openFormPanel()
      this.showFormBeside = false
      this.parentId = node.data.posJobFamilyId
      this.jobFamilyType = node.level
      this.createTarget = this.targetConfig[this.jobFamilyType + '']
      this.fakeNewClass()
    },
    // 先模拟新增虚拟的
    fakeNewClass () {
      this.idControl = Number(this.idControl) + 1 + ''
      let data = {
        posJobFamilyId: this.idControl,
        parentId: this.node && this.node.data.posJobFamilyId || -1,
        jobFamilyType: this.node && this.node.level || 0,
        name: this.createTarget + this.idControl,
        remark: '',
        newData: true
      }
      if (this.node) {
        this.node.data.children && this.node.data.children.push(data) || this.$set(this.node.data, 'children', [data])
      } else {
        this.treeData.push(data)
      }
      this.$message.success('新建成功！')
      this.expandedKeys.push(data.posJobFamilyId)
      this.emitFormatedData()
      this.$nextTick(() => {
        this.checkNewList(this.checkOnlyCreate)
      })
    },
    // 检查作为叶子节点的职种是否挂有标准职位
    checkHasStandardJob (posJobFamilyId, callback) {
      let params = {
        posJobFamilyId
      }
      req('checkCanNewOrNot', params).then(valid => {
        if (valid) {
          callback(true)
        } else {
          callback(false)
        }
      })
    },
    // 删除新建的本节点
    delJob (e, node) {
      e.stopPropagation()
      // 判断是否有下级节点
      if (node.isLeaf) {
        this.realDeleteNode(node)
      } else {
        this.$confirm('即将删除本节点及其下属节点，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.realDeleteNode(node)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 执行删除操作
    realDeleteNode (node) {
      let index = node.parent.childNodes.findIndex(ele => ele.data.posJobFamilyId === node.data.posJobFamilyId)
      if (node.data.parentId === -1) {
        this.$delete(node.parent.data, index)
      } else {
        this.$delete(node.parent.data.children, index)
      }
      this.node = null
      this.showFormBeside = false
      this.clearForm()
      this.emitFormatedData()
      this.$nextTick(() => {
        this.checkNewList(this.checkOnlyCreate)
      })
    },
    // 确认新建
    confirmNew () {
      this.$refs.form.validate().then(res => {
        if (!res) return
        if (this.modify) {
          Object.assign(this.node.data, this.model)
          this.$message.success('修改成功！')
        } else {

        }
        this.node = null
        this.showFormBeside = false
        this.clearForm()
        this.emitFormatedData()
      }).catch(e => {
        this.$message.error('请检查填写是否正确！')
      })
    },
    // 树样式
    renderContent (h, { node, data, store }) {
      return data.newData
      ? (<span>
            <span class="new-data-control">{data.name}</span>
            <span v-show={this.showMap.create && node.level !== 3} class="el-icon-circle-plus-outline icon-control" onClick={(e) => this.newJobClass(e, node)}></span>
            <span v-show={this.showMap.create} class="el-icon-remove-outline icon-control" onClick={(e) => this.delJob(e, node)}></span>
            <span v-show={this.showFormBeside && this.node === node} class="el-icon-caret-right icon-right-control"></span>
          </span>)
          : (<span>
            <span>{data.name}</span>
            <span v-show={this.showMap.create && node.level !== 3} class="el-icon-circle-plus-outline icon-control" onClick={(e) => this.newJobClass(e, node)}></span>
            <span v-show={this.showFormBeside && this.node === node} class="el-icon-caret-right icon-right-control"></span>
          </span>)
    },
    // 点击职群职种树
    handleNodeClick (obj, node, self) {
      this.node = node
      this.createTarget = this.targetConfig[this.jobFamilyType + '']
      if (node.data.newData) {
        this.modify = true
        switch (node.level) {
          case 2:
            this.model.jobFamilyName = node.parent.data.name
            break
          case 3:
            this.model.jobFamilyName = node.parent.parent.data.name
            this.model.jobClassName = node.parent.data.name
            break
        }
        this.model.name = node.data.name
        this.model.remark = node.data.remark
        this.showFormBeside = true
      } else {
        this.showFormBeside = false
        this.clearForm()
      }
    },
    // 整理数据并按上传格式化
    formatConfirmData (data) {
      let formatData = []
      Array.isArray(data) && data.forEach(ele => {
        if (ele.newData) {
          formatData.push(ele)
        } else {
          if (ele.children) {
            formatData = formatData.concat(this.formatConfirmData(ele.children))
          }
        }
      })
      return formatData
    },
    // 传递数据
    emitFormatedData () {
      this.$emit('confirm', this.treeData, this.formatConfirmData(this.treeData))
    }
  }
}
</script>

<style lang="scss" scoped>
$border-color: #e8e8e8;
$theme-color: #f8f8f8;
$theme-border: 1px solid $border-color;
$hover-color: #dff1ff;

.create-base{
  display: flex;
  min-width: 1040px;

  .tree-aside{
    border: $theme-border;
    box-sizing: border-box;
    width: 50%;
    .el-tree{
      background: $theme-color;
    }
    header{
      border-bottom: $theme-border;
      // height: 50px;
      padding: 7px 15px;
    }
    .check-only-create{
      line-height: 36px;
    }
    .new-position-button{
      float: right;
      margin-top: 4px;
    }
    section{
      width: 100%;
      height: 450px;
      overflow: auto;
      background: $theme-color;
      /deep/ .el-tree-node__content {
        position: relative;
        .new-data-control{
          color:rgb(235, 103, 9);
        }
        .icon-right-control{
          position: absolute;
          right: 10px;
          top: 10px;
          color: #6fb1e7;
          font-size: 16px;
        }
        .icon-control {
          display: none;
        }
        &:hover {
          background: $hover-color;
          .icon-control {
            display: inline-block;
          }
        }
      }
    }
  }

  .form-beside{
    position: relative;
    border-top: $theme-border;
    border-right: $theme-border;
    border-bottom: $theme-border;
    width: 50%;
    header{
      border-bottom: $theme-border;
      padding: 15px;
      background: $theme-color;
    }
    .create-title{
      line-height: 20px;
      font-weight: bold;
      font-size: 14px;
    }
    .create-shutdown-icon{
      float: right;
      line-height: 20px;
      font-size: 15px;
      cursor: pointer;
    }
    section{
      width: 400px;
      padding: 20px;
    }
    footer{
      width: 100%;
      border-top: $theme-border;
      position: absolute;
      bottom: 0px;
      .confirm-button{
        float: right;
        padding: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
.new-batch-position{
  .el-icon-circle-plus-outline:before, .el-icon-remove-outline:before{
    position: absolute;
    top: 9px;
    font-size:18px;
    color:#6fb1e7;
  }
  .el-icon-circle-plus-outline:before{
    margin-left: 20px;
  }
  .el-icon-remove-outline:before{
    margin-left: 48px;
    color: red;
  }
  .new-position-button{
    &.el-button--medium{
      padding:5px 8px;
      line-height: 16px;
    }
    &.el-button.is-plain, &.el-button.is-plain{
      border-color: #3da5fe;
      color: #3da5fe;
    }
  }
  .confirm-button{
    .el-button--medium{
      padding:5px 15px;
      line-height: 16px;
    }
  }
}

</style>
