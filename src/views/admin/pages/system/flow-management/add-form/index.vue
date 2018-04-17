<template>
<div v-loading="loading" :element-loading-text="$loadingText">
  <i-layout>
    <!-- <div slot="header">

    </div> -->

    <div slot="section">
        <div height="75px" class="header pb20">
          <div class="title">新增表单</div>
          <el-form :model="detailData" class="header-form margin-auto" :rules="rules" ref="form">
            <el-row>
              <el-col :span="12">
                <el-form-item label="表单名称" class="header-item margin-auto" prop="formMenuName">
                  <el-input v-model="detailData.formMenuName" maxlength="100"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="表单Url" class="header-item margin-auto" prop="formMenuUrl">
                  <el-input v-model="detailData.formMenuUrl" maxlength="100"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

      </div>
      <div class="content">
        <div width="280px" class="aside">
          <div class="btn">
              <el-button type="primary" @click="showNewFormDialog">添加</el-button>
            </div>
            <ul class="form-item-list margin-auto pt10" >
              <draggable v-model="detailData.fieldList"  @change="dragUpdate">
                <li
                  class="form-item"
                  :class="{chosen: statusList[index]}"
                  v-for="(item, index) in detailData.fieldList"
                  :key="item.orderNo"
                  @click="changeFormItem(item, index)"
                  @dblclick="changeForm(index)"
                >
                  <div class="form-text">
                    <el-tooltip :content="item.fieldName" placement="top">
                      <div>名称:{{item.fieldName}}</div>
                    </el-tooltip>
                    <div>key: {{item.fieldValue}}</div>
                 </div>
                  <i class="icon el-icon-delete" @click="handleIconClick(index)"></i>
                </li>
              </draggable>
            </ul>
        </div>
        <div class="main-area mt10 pl5">
            <i-table
            :table="table"
            ref="table"
            v-show="currentForm"
            >
              <template slot="table" slot-scope="tableScope">
                <el-table
                  :data="tableScope.clone"
                  :height="380"
                  @row-click="rowClickHandler(tableScope, $event)"
                  @selection-change="selectionChangeHandler(tableScope, $event)">

                    <el-table-column type="selection"></el-table-column>

                    <el-table-column
                      v-for="(col, idx) of table.columns"
                      :key="idx"
                      :prop="col.prop"
                      :label="col.label">
                      <template slot-scope="scope">
                        <i-table-cell
                          :row="scope.row"
                          :col="col.prop"
                          :table="tableScope"
                          ref="cell"
                        ></i-table-cell>
                      </template>
                    </el-table-column>

                    <!-- <el-table-column
                      fixed="right"
                      align="center"
                      label="操作">
                      <template slot-scope="scope">
                        <i-table-operator
                          :table="tableScope"
                          :row="scope.row"
                          :index="scope.$index"
                        />
                      </template>
                    </el-table-column> -->
                  <i-table-operator :table="tableScope" scope></i-table-operator>
                </el-table>
              </template>
            </i-table>
            <div class="main-toolbar mt10 pt10 pb10">
              <el-button @click="cancel">取消</el-button>
              <el-button
              type="primary"
              @click="save"
              >
              保存</el-button>
            </div>

        </div>
      </div>
    </div>
  </i-layout>

  <i-dialog
  v-model="showAddDialog"
  :toolbar="addToolbar"
  :title="formEditStatus === 0 ? '新增表单' : '编辑表单'"
  destroyedWhenClose>
    <add-form-dilog
    ref="addForm"
    :detailData="detailData"
    :status="formEditStatus"
    :index="currentFormIndex"
    ></add-form-dilog>
  </i-dialog>
</div>

</template>

<script>
import draggable from 'vuedraggable'
import iForm from 'components/common/i-form/i-form'
import req from 'api/system/flow-managent'
import addFormDilog from '../add-form-dialog'
import access from 'mixins/access'

export default {
  name: 'add-form',

  mixins: [access],

  components: {
    iForm,
    addFormDilog,
    draggable
  },

  created () {
    this.init()
    // this.table.search = null
  },

  data () {
    let keyValidate = (rule, val, cb) => {
      !val && cb(new Error('请输入字段key'))
      let {clone} = this.$refs.table
      let res = clone.filter(ele => ele.fieldValue === val)
      res.length > 1 ? cb(new Error('字段key不能重复')) : cb()
    }

    return {
      showAddDialog: false,
      formEditStatus: 0, // 新增0， 编辑1
      currentFormIndex: null,
      loading: false,
      statusList: [], // 表单每一项的class控制数组
      rules: {
        formMenuName: {required: true, message: '请输入表单名', trigger: 'blur'},
        formMenuUrl: {required: true, message: '请输入表单url', trigger: 'change'}
      },

      currentForm: null, // 当前选中的表单项
      formId: null,
      detailData: { // 整体数据
        fieldList: [],
        formMenuName: '',
        formMenuUrl: ''
      },

      table: {
        data: null,
        editable: true,
        columns: [
          { prop: 'fieldValue', label: '字段Key' },
          { prop: 'fieldName', label: '字段名称' },
          { prop: 'valueType', label: '字段类型' },
          { prop: 'dictName', label: '对应码表' }
        ],
        setting: {
          editor: {
            fieldValue: {
              rules: {validator: keyValidate, trigger: 'blur'}
            },
            fieldName: {
              rules: [
                {required: true, message: '请输入字段名字', trigger: 'blur'}
              ]
            },
            valueType: {
              type: 'select',
              options: {
                option: {
                  1: '文本',
                  2: '时间',
                  3: '码表'
                }
              }
            },
            fieldType: {
              rules: {required: true, message: '请输入字段类型', trigger: 'blur'}
            }
          },
          toolbar: [
            {
              text: '新增一行',
              func: vm => {
                vm.createData()
              }
            },
            // {
            //   text: '保存',
            //   func: () => this.save()
            // },
            {
              text: '删除',
              type: 'danger',
              func: vm => vm.deleteData() // i-table 提供的删操作
            }

          ],
          operator: [
            // {
            //   text: '编辑',
            //   func: row => {
            //     this.$refs.table.toggleEditable()
            //     console.log(row)
            //   }
            // },
            {
              text: '删除',
              type: 'danger',
              func: scope => this.$refs.table.deleteData([scope.row])
            }
          ]
        }
      },

      addToolbar: [
        {
          text: '取消',
          func: done => done()
        },
        {
          text: '确定',
          func: done => this.addNewFrom(done)
        }
      ]
    }
  },

  watch: {
    currentForm (val) {
      this.table.data = val.fieldList
    }
  },

  methods: {

    init () {
      this.formId = this.$route.query.id
      this.formId && req('getFormDetail', {pfFormMenuId: this.formId}).then(res => {
        this.detailData = res
        this.statusList = res.fieldList.map(ele => false)
        this.statusList[0] = true
        this.currentForm = res.fieldList[0]
      })
    },

    // 弹出新增表单对话框
    showNewFormDialog () {
      this.formEditStatus = 0
      this.showAddDialog = true
    },

    changeForm (idx) {
      this.formEditStatus = 1
      this.currentFormIndex = idx
      this.showAddDialog = true
    },

    handleIconClick (index) {
      this.$confirm('确认删除吗', '提示').then(() => this.detailData.fieldList.splice(index, 1))
    },

    addNewFrom (done) {
      this.currentForm && (this.currentForm.fieldList = this.$refs.table.clone)
      this.$refs.addForm.save().then(() => {
        if (this.formEditStatus === 0) {
          let item = {...this.$refs.addForm.addData, parentId: this.detailData.pfFormMenuId, fieldList: [], orderNo: this.detailData.fieldList.length + 1}
          this.statusList = this.detailData.fieldList.map(ele => false)
          this.detailData.fieldList.push(item)
          this.currentForm = this.detailData.fieldList[this.detailData.fieldList.length - 1]
          this.table.data = this.currentForm.fieldList
          this.statusList.push(true)
        }
        done()
      })
    },

    // 保存数据
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.cell && this.$refs.cell.map(el => el.validate())
          if (!this.detailData.fieldList.length) {
            this.$message({
              message: '请至少建立一个表单',
              type: 'warning'
            })
            return
          }
          this.currentForm.fieldList = this.$refs.table.clone
          if (this.$refs.table.saveData()) {
            this.loading = true
            this.formId ? this.editFormData() : this.postFormData()
          }
        }
      })
    },

    cancel () {
      this.$router.go(-1)
    },

    // 查看表单详情
    changeFormItem (item, index) {
      this.currentForm.fieldList = this.$refs.table.clone
      this.currentForm = item
      this.statusList = this.statusList.map(ele => false)
      this.statusList[index] = true
    },

    rowClickHandler ({ rowClickHandler }, row) {
      rowClickHandler(row)
    },

    successTip (msg) {
      this.loading = false
      this.$message({
        message: `${msg}成功`,
        type: 'success'
      })
      this.$router.go(-1)
    },

    errorHandle () {
      this.loading = false
    },

    // 处理forms排序问题
    handleOrder () {
      this.detailData.fieldList.forEach((ele, index) => {
        ele.orderNo = index + 1
      })
    },
    // 新增表单请求
    postFormData () {
      req('postFormData', this.detailData).then(res => {
        this.successTip('新建')
      }).catch(() => this.errorHandle())
    },
    // 修改表单请求
    editFormData () {
      req('putFormData', this.detailData).then(res => {
        this.successTip('修改')
      }).catch(() => this.errorHandle())
    },

    selectionChangeHandler ({ selectionChangeHandler }, selection) {
      selectionChangeHandler(selection)
    },

    dragUpdate () {
      this.handleOrder()
    }

  }

}
</script>

<style lang="scss" scoped>
  .header {
    border-bottom: 1px solid #ececec;
    .title {
      font-size: 16px;
      color: #333333;
    }
  }
  .header-form {
    width: 70%;
  }
  .content{
    display: flex
  }
  .main-area{
    width: 100%;
  }
  .aside {
    border-right: 1px solid #ececec;
    height: 667px;
    position: relative;
    cursor: pointer;
    .btn {
      border-bottom: 1px solid #ececec;
      height: 48px;
      line-height: 48px;
      width: 100%;
    }
  }
  .header-item {
    display: flex;
    width: 80%
  }
  .form-item-list {
    width: 260px;
    .form-item {
      height: 100px;
      letter-spacing: 0;
      line-height: 36px;
      font-size: 14px;
      padding-left: 5px;
      position: relative;
      border-bottom: 1px solid #ececec;
      .form-text{
        width: 230px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .icon {
        position: absolute;
        cursor: pointer;
        right: 10px;
        top: 35%;
      }
    }
    .form-item:hover,.chosen {
      background: #F1F3F6;
      color: #3DA5FE;
    }
  }
  .main-toolbar {
    border-top: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
    text-align: right;
  }
</style>
