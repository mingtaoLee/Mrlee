<template>
  <div>
    <h1>1、按钮面板：</h1>
    <i-control-layout :btnCol="4" :toolbar="buttonControl"></i-control-layout>
    <h1>2、查询表单：</h1>
    <i-form @reset="reset" @search="search">
      <el-form-item label="下拉字典">
        <i-select v-model="dict" parameter="HAVE_OR_NOT" clearable></i-select>
      </el-form-item>
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </i-form>
    <h1>3、下拉树</h1>
    <el-button type="primary" @click="resetSelectData">重置</el-button>
    <el-form labelWidth="100px">
      <el-form-item label="下拉树：">
        <i-select-tree
          :multiple="true"
          @delete="handleDelete"
          dataKey="org"
          nodeKey="orgUnitId"
          :selectedNode.sync="defaultNode"
          :rootId="rootId"
          v-model="nodeValue"
          :lazy="true"
          @input="handleChange"
          :readonly="true"
          size="small"
          sizeAuto
          treeMaxHeight="180"
          :accordion="true"
        ></i-select-tree>
      </el-form-item>
      <el-form-item label="下拉树：">
        <i-select-tree
          :multiple="false"
          dataKey="org"
          nodeKey="orgUnitId"
          :rootId="rootId"
          v-model="nodeValue1"
          :lazy="true"
          :props="singleProps"
          @input="handleChange"
          :readonly="true"
          size="small"
          sizeAuto
          treeMaxHeight="180"
          :selectedNode.sync="singleNode"
        ></i-select-tree>
      </el-form-item>
    </el-form>
    <h1>人员选择</h1>
    <el-input size="mini" v-model="personnel">
      <!--<i-->
        <!--class="el-icon-edit el-input__icon"-->
        <!--slot="suffix"-->
        <!--@click="handleIconClick">-->
      <!--</i>-->
      <i slot="suffix" class="el-input__icon iconfont icon-hr" @click="handleIconClick"></i>
    </el-input>
    <i-personnel-select :isShow.sync="isShowPersonnel" @confirm="handlePersonnelDialogConfirm"></i-personnel-select>
    <h1>4、弹框树</h1>
    <!--<i-input-dialog v-model="inputDialogValue" :props="props">-->
      <!--<i-tree-->
        <!--ref="iTree"-->
        <!--:rootId="rootId"-->
        <!--dataKey="org"-->
        <!--@select="handleSelect"-->
        <!--:show-checkbox="true"-->
        <!--:lazy="true"-->
        <!--:props="props"-->
      <!--&gt;</i-tree>-->
    <!--</i-input-dialog>-->
    <h1>5、表单校验</h1>
    <el-form ref="form" labelWidth="100px" :model="ruleForm" :rules="rules">
      <div class="base">
        <el-form-item label="身份证异步校验" prop="base.id">
          <el-input v-model="ruleForm.base.id" placeholder="请输入身份证"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="base.region">
          <el-select v-model="ruleForm.base.region" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="content">
        <el-table
          :data="ruleForm.tableData"
          style="width: 100%"
        >
          <el-table-column label="国籍">
            <template slot-scope="scope">
              <el-form-item labelWidth="0" :prop="`tableData[${scope.$index}].country`" :rules="countryRule">
                <el-input v-model="scope.row.country"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <el-form-item labelWidth="0" :prop="`tableData[${scope.$index}].name`" :rules="nameRule">
                <el-input v-model="scope.row.name"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
</template>
<script>
  /* eslint-disable */
  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import ITree from 'components/common/i-tree/i-tree.vue'
//  import IInputDialog from 'components/common/i-input-dialog/i-input-dialog.vue'
  import component from '../indicator/indicator.vue'
  import IControlLayout from 'components/common/i-control-layout/i-control-layout.vue'
  import ISelect from 'components/common/i-select/i-select.vue'
  import IForm from 'components/common/i-form/i-form.vue'
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
  export default {
    name: 'demo',
    data: function () {
      const checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('身份证不能为空'))
        }
        if (value.match(/[^\w]/g)) {
          return callback(new Error('字符格式不合法'))
        }
        if (value.length !== 18) {
          return callback(new Error('请输入18位证件号码'))
        }
        setTimeout(() => {
          if ((value.indexOf(1) === -1 )) {
            callback(new Error('必须包括1'))
          }
          if (value.length === 18) {
            callback({
              successMessage: '验证通过'
            })
          }
        }, 1000)
      }
      return {
        singleProps: {
          children: 'children',
          label: 'orgShortName',
          disabled: (data, node) => {
            if (node.level === 2) {
              return true
            }
          }
        },
        isShowPersonnel: false,
        inputDialogValue: '',
        isShowInputDialog: '',
        isShowDialog: false,
        component: () => import('../indicator/indicator.vue'),
        myComponent: 'myComponent',
        buttonControl: [
          {
            text: '查询',
            disabled: false,
            func: () => {
              console.log(this.myComponent)
            }
          },
          {
            text: '搜索',
            func () {
              this.isShowDialog = true
            }
          },
          {
            text: '查看',
            func () {
              this.$msgbox({
                title: '消息',
                customClass: 'i-dialog',
                message: this.$createElement(component)
              })
            }
          },
          {
            text: '删除',
            disabled: true,
            func () {
              console.log('1')
            }
          },
          {
            text: '删除',
            func () {
              console.log('1')
            }
          }
        ],
        ruleForm: {
          id: '',
          base: {
            id: '',
            region: ''
          },
          tableData: [{
            country: 'China',
            name: 'Mike'
          }, {
            country: 'China',
            name: 'Mike'
          }, {
            country: 'China',
            name: 'Mike'
          }]
        },
        rules: {
          base: {
            id: [
              { required: true, validator: checkAge, trigger: 'blur' }
            ],
            region: [
              { required: true, message: '请选择活动区域', trigger: 'change' }
            ]
          }
        },
        countryRule: {
          required: true, message: '请输入国籍', trigger: 'blur'
        },
        nameRule: {
          required: true, message: '请输入名字', trigger: 'blur'
        },
        dict: '',
        formInline: {
          user: '',
          region: ''
        },
        defaultNode: [
          {
            "orgUnitId": "0cfc8921d8e84b6d8e9cc3e6c3fc7efd",
            "orgShortName": "组织简称",
            "orgTier": "组织层级",
            "parentOrgId": "父级组织id",
            "isParent": "是否为父节点"
          }
        ],
        singleNode: {
          "orgUnitId": "8a08940274aa4af3987601e3d7184492",
          "orgShortName": "组织简称",
          "orgTier": "组织层级",
          "parentOrgId": "父级组织id",
          "isParent": "是否为父节点"
        },
        rootId: '',
        value: '',
        nodeValue: '',
        nodeValue1: '',
        props: {
          children: 'children',
          label: 'orgShortName'
        }
      }
    },
    created () {
    },
    components: {
      ITree,
      ISelectTree,
      IForm,
      ISelect,
      IControlLayout,
      IPersonnelSelect
//      IInputDialog
    },
    methods: {
      handleChange (value) {
        console.log(value)
      },
      resetSelectData () {
        this.nodeValue = ''
        this.nodeValue1 = ''
      },
      reset () {},
      search () {},
      handleSubmit () {
        this.$refs['form'].validate(res => {
          if (res) {
            console.log('对了')
          } else {
            console.log('错了')
          }
        })
      },
      handleSelect (selected) {
        this.inputDialogValue = selected.map(item => {
          return selected['orgUnitId']
        })
      },
      handleIconClick () {
        this.isShowPersonnel = !this.isShowPersonnel
      },
      handlePersonnelDialogConfirm (selected) {
        this.personnel = selected[0].employeeName
      },
      handleDelete () {
        console.log(this.defaultNode)
      }
    }
  }
</script>
<style lang="scss" scoped>
  h1 {
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0;
  }
  .i-dialog {
    width: auto;
    height: auto;
    /*.el-message-box__content {*/
      /*width: 600px;*/
      /*height: 300px;*/
      /*overflow: auto;*/
    /*}*/
  }
</style>
