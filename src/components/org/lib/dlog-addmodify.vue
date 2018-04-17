<template>
  <div>
    <i-dialog
      :title="title"
      v-model="visible"
      :toolbar="dialogToolbar"
      @close="closeDialog">
        <el-form
        :rules="rules"
        :model="newModifyData"
        ref="foo">

          <el-form-item
            class="org-stander-name"
            label="标准组织名称:"
            :label-width="formLabelWidth"
            prop="orgStandardName">
            <el-input
              width="10px"
              :maxlength="$$.input.normalMaxlength"
              v-model.trim="newModifyData.orgStandardName"
              auto-complete="off"
              :readonly="readonlyForm"
              ref="orgStandardName"/>
          </el-form-item>

          <el-form-item
            label="生效日期:"
            :label-width="formLabelWidth"
            prop="effectiveDate">
            <el-date-picker
              :readonly="readonlyForm"
              v-model="newModifyData.effectiveDate"
              placeholder="选择日期"
              style="float:left;">
            </el-date-picker>
          </el-form-item>

          <el-form-item
            label="下级组织名称:"
            :label-width="formLabelWidth"
            prop="renameable">
            <el-radio :disabled="readonlyForm" class="radio" v-model="newModifyData.renameable" label="1">可修改</el-radio>
            <el-radio :disabled="readonlyForm" class="radio" v-model="newModifyData.renameable" label="0">不可修改</el-radio>
          </el-form-item>

          <el-form-item
            label="组织类别:"
            :label-width="formLabelWidth"
            prop="orgType">
            <i-select 
            :disabled="readonlyForm" 
            v-model="newModifyData.orgType" 
            parameter="ORG_TYPE"
            @change="handleChangeOrgType"
            ></i-select>
          </el-form-item>

          <el-form-item
            label="业态:"
            :label-width="formLabelWidth"
            prop="businessType">
            <i-select
              v-model="newModifyData.businessType"
              parameter="ORG_BUSINESS_TYPE"
              :disabled="busTypeDisable || readonlyForm">
            </i-select>
          </el-form-item>

          <!-- <el-form-item
            label="小店类型:"
            :label-width="formLabelWidth">
            <i-select
              v-model="newModifyData.shopType"
              parameter="ORG_SHOP_TYPE"
              :disabled="busTypeDisable || readonlyForm">
            </i-select>
          </el-form-item> -->

          <el-form-item
            label="标准职位:"
            :label-width="formLabelWidth"
            prop="posStandards">
            <el-button :disabled="readonlyForm" @click="showAllJobs" size="small">标准职位列表</el-button>
            <div>
              <el-tag
                :key="tag.posStandardJobId"
                v-for="tag in newModifyData.posStandards"
                :closable="!readonlyForm"
                :close-transition="false"
                @close="handleCloseJobs(tag)"
              >
              {{tag.name}}
              </el-tag>
            </div>
          </el-form-item>

          <el-form-item
            label="课组:"
            :label-width="formLabelWidth"
            prop="orgKzDtos"
            v-if="showShopType"
            >
            <!-- v-if="showShopType" -->
            <el-button :disabled="readonlyForm" @click="showAllCourse" size="small">课组列表</el-button>
            <div>
              <el-tag
                :key="tag.kzCode"
                v-for="tag in newModifyData.orgKzDtos"
                :closable="!readonlyForm"
                :close-transition="false"
                @close="handleCloseCur(tag)"
              >
              {{tag.kzName}}
              </el-tag>
            </div>
          </el-form-item>

          <el-form-item
            v-if="showShopType"
            label="小店类型:"
            :label-width="formLabelWidth"
            prop="shopType">
            <i-select
              v-model="newModifyData.shopType"
              parameter="ORG_SHOP_TYPE"
              :disabled="shopTypeDisable || readonlyForm">
            </i-select>
          </el-form-item>

          <el-form-item
            v-if="newModifyData.orgType === '8'"
            label="品类:"
            :label-width="formLabelWidth">
            <!-- <el-select
              v-model="newModifyData.categorys"
              value-key="posCategoryId"
              multiple
              placeholder="选择添加品类 +">
              <el-option
              v-for="item in categorySelect"
              :key="item"
              :label="item.posCategoryName"
              :value="item"
              >
              </el-option>
            </el-select> -->
            <el-select
              :disabled="readonlyForm"
              v-model="newModifyData.categorys"
              value-key="posCategoryId"
              multiple
              filterable
              reserve-keyword
              placeholder="请输入关键词"
              >
              <el-option
                v-for="item in categorySelect"
                :key="item"
                :label="item.posCategoryName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>

           <el-form-item label="职责:" :label-width="formLabelWidth">
           <el-input
            :readonly="readonlyForm"
            type="textarea"
            :maxlength="$$.input.longMaxlength"
            v-model="newModifyData.responsibility"
            auto-complete="off"/>
          </el-form-item>
        </el-form>
      </i-dialog>
      <dlog-jobs
        v-model="jobsVisible"
        :jobArray="newModifyData.posStandards"
        @receiveCodes="receiveCodes">
      </dlog-jobs>
      <dlog-research
      v-model="CourseVisible"
      :jobArray="newModifyData.orgKzDtos"
      @researchCodes="researchCodes"
      >
      </dlog-research>
    </div>
</template>

<script>
import req from 'api/org/lib'
import dlogJobs from 'components/org/lib/dlog-jobs.vue'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import ISelect from 'components/common/i-select/i-select'
import dlogResearch from 'components/org/lib/dlog-research.vue'
export default{
  name: 'dlogModify',
  components: {
    dlogJobs,
    ISelect,
    IDialog,
    dlogResearch
  },
  props: {
    value: Boolean,
    modifyData: Object,
    readonlyForm: Boolean,
    title: String
  },
  data () {
    return {
      // 控制确定按钮，请求没有完成就阻止请求
      confirmOver: false,
      // 控制标准组织名称，如果是重名或者没有重名，就允许提交
      standerNameValidatePass: false,
      // title: '修改标准组织',
      newModifyData: {
        orgStandardName: '',
        effectiveDate: '',
        renameable: '',
        // BUGID 4613 业态默认为其他
        businessType: '99',
        orgType: '',
        posStandards: [],
        orgKzDtos: [],
        categorys: [],
        responsibility: '',
        shopType: ''
      },
      dialogToolbar: [
        {
          text: '取消',
          type: 'defalut',
          func: done => {
            this.cancel(done)
          }
        },
        {
          text: '确定',
          hide: this.readonlyForm,
          loading: false,
          func: done => {
            this.confirm(done)
          }
        }
      ],
      orgTypeOption: [],
      categorySelect: [],
      formLabelWidth: '120px',
      jobsVisible: false,
      CourseVisible: false,
      visible: false,
      busTypeDisable: false,
      shopTypeDisable: false,
      type: false,
      rules: {
        orgStandardName: [
          { required: true, validator: this.validateName, trigger: 'blur' }
        ],
        effectiveDate: [
          { required: true, message: '请选择日期' }
        ],
        renameable: [
          { required: true, message: '请选择是否可修改名称' }
        ],
        businessType: [
          { required: true, message: '请选择业态' }
        ],
        orgType: [
          { required: true, message: '请选择组织类别', trigger: 'change' }
        ],
        shopType: [
          { required: true, message: '请选择小店类型' }
        ]
      }
    }
  },
  computed: {
    showShopType () {
      return this.newModifyData.orgType === '8' && (this.newModifyData.businessType === '1' || this.newModifyData.businessType === '2' || this.newModifyData.businessType === '3' || this.newModifyData.businessType === '4' || this.newModifyData.businessType === '5')
    }
    // dialogToolbar () {
      // return [
      //   {
      //     text: '取消',
      //     type: 'defalut',
      //     func: done => {
      //       this.cancel(done)
      //     }
      //   },
      //   {
      //     text: '确定',
      //     hide: this.readonlyForm,
      //     loading: false,
      //     func: done => {
      //       this.confirm(done)
      //     }
      //   }
      // ]
    // }
  },
  watch: {
    value (val) {
      if (this.value) {
        this.init()
      }
      this.visible = this.value
    },
    readonlyForm (value) {
      this.dialogToolbar[1].hide = value
    }
  },
  methods: {
    // 品类tag标签关闭事件
    // 参数tag返回关闭的tag对象
    handleCloseCategory (tag) {
      this.newModifyData.categorys.splice(this.newModifyData.categorys.indexOf(tag), 1)
    },
    // 职位tag标签关闭事件
    // 参数tag返回关闭的tag对象
    handleCloseJobs (tag) {
      this.newModifyData.posStandards.splice(this.newModifyData.posStandards.indexOf(tag), 1)
    },
    // tag标签关闭事件
    // 参数tag返回关闭的tag对象
    handleCloseCur (tag) {
      this.newModifyData.orgKzDtos.splice(this.newModifyData.orgKzDtos.indexOf(tag), 1)
    },
    // 抽出输入框和错误文字改变颜色方法
    setInputAndTextColor (targetClassName, color, targetType) {
      let target = document.querySelector(targetClassName)
      if (targetType === 'input') {
        target.style.borderColor = color
      } else if (targetType === 'text') {
        target.style.color = color
      }
    },
    validateName (rule, value, callback) {
      if (!value) {
        let setErrorColor = async () => {
          await callback(new Error('请输入组织名称'))
          this.setInputAndTextColor('.el-form .org-stander-name .el-input__inner', '#ff6464', 'input')
          this.setInputAndTextColor('.el-form .org-stander-name .el-form-item__error', '#ff6464', 'text')
          this.standerNameValidatePass = false
        }
        setErrorColor()
      } else if (!(/^[\u4e00-\u9fa5\-#()（）/a-zA-Z0-9]+$/.test(value))) {
        let setErrorColor = async () => {
          await callback(new Error('组织名含有非法字符'))
          this.setInputAndTextColor('.el-form .org-stander-name .el-form-item__error', '#ff6464', 'text')
          this.setInputAndTextColor('.el-form .org-stander-name .el-input__inner', '#ff6464', 'input')
          this.standerNameValidatePass = false
        }
        setErrorColor()
      } else if (value) {
        req('valiLibName', {orgStandardName: value}).then(data => {
          if (!data) {
            let setErrorColor = async () => {
              await callback(new Error('该名称和其他标准组织名称重复'))
              this.setInputAndTextColor('.el-form .org-stander-name .el-form-item__error', '#e6a23c', 'text')
              this.setInputAndTextColor('.el-form .org-stander-name .el-input__inner', '#e6a23c', 'input')
              this.standerNameValidatePass = true
            }
            setErrorColor()
          } else {
            let setErrorColor = async () => {
              await callback(new Error('该名称没有重复'))
              this.setInputAndTextColor('.el-form .org-stander-name .el-form-item__error', '#13CE66', 'text')
              this.setInputAndTextColor('.el-form .org-stander-name .el-input__inner', '#e8e8e8', 'input')
              this.standerNameValidatePass = true
            }
            setErrorColor()
          }
        })
      }
    },
    // 客户经营主体&客户经营单元 对业态的限制
    // handleSelectChange (val) {
    //   if (val === '7' || val === '8') {
    //     this.busTypeDisable = true
    //     this.newModifyData.businessType = '1'
    //   } else {
    //     this.busTypeDisable = false
    //     this.newModifyData.businessType = ''
    //   }
    // },

    // dialog关闭事件
    closeDialog () {
      this.$emit('update:readonlyForm', false)
      this.$nextTick(() => {
        this.$refs.foo.resetFields()
      })
      this.value = false
      this.$emit('input', false)
    },
    // 数据初始化
    init () {
      this.categorySelect = []
      this.getOrgType()
      this.getCategory()
      this.type = this.modifyData.type
      if (this.type) {
        this.title = '新增标准组织'
        this.newModifyData = {
          orgType: '',
          orgStandardName: '',
          businessType: '99',
          effectiveDate: '',
          responsibility: '',
          renameable: '1',
          categorys: [],
          posStandards: [],
          shopType: '',
          orgKzDtos: []
        }
        return
      } else {
        this.newModifyData = this.modifyData.data
        // this.title = '修改标准组织'
      }
    },
    // 取消按钮点击事件
    cancel () {
      this.closeDialog()
    },
    // 确定按钮点击事件
    confirm () {
      this.dialogToolbar[1].loading = true
      this.$refs.foo.validate(valid => {
        if (!valid && this.standerNameValidatePass === false) {
          this.dialogToolbar[1].loading = false
          return false
        }

        if (this.type) {
          req('create', this.newModifyData).then(data => {
            this.dialogToolbar[1].loading = false
            this.$message.success('新增成功')
            this.closeDialog()
            this.$emit('closeAddModify')
          }, ({response}) => {
            return this.$message.warning(response.data.message)
          }).catch(() => {
            this.dialogToolbar[1].loading = false
          })
        } else {
          req('modifyPut', this.newModifyData).then(data => {
            this.dialogToolbar[1].loading = false
            this.$message.success('修改成功')
            this.closeDialog()
            this.$emit('closeAddModify')
          }, ({response}) => {
            this.$message.warning(response.data.message)
          }).catch(() => {
            this.dialogToolbar[1].loading = false
          })
        }
      })
    },
    // 获得类型
    getOrgType () {
      req('orgType').then(data => {
        this.orgTypeOption = data
      }).catch(() => {
        this.orgTypeOption = []
      })
    },
    // 获得品类
    getCategory () {
      req('category').then(data => {
        data.forEach(data => {
          this.categorySelect.push({posCategoryId: data.posCategoryId, posCategoryName: data.name})
        })
      }).catch(() => {
        this.categorySelect = []
      })
    },
    // 职位列表dialog展示
    showAllJobs () {
      this.jobsVisible = true
    },
    // 课组列表展示
    showAllCourse () {
      this.CourseVisible = true
    },
    // 接收职位列表模块返回的职位数组对象
    // 参数jobArray type为Array
    receiveCodes (jobArray) {
      this.newModifyData.posStandards = jobArray
      this.$refs.foo.validateField('posStandards')
    },
    // 接收课组的列表模块返回的职位数组
    researchCodes (jobArray) {
      // console.log(jobArray)
      // let kzArr = []
      // jobArray.forEach(data => {
      //   kzArr.push(data.kzCode)
      // })
      this.newModifyData.orgKzDtos = jobArray
      this.$refs.foo.validateField('orgKzDtos')
    },
    handleChangeOrgType (value) {
      if (value === '7' || value === '8') {
        this.newModifyData.businessType = ''
      } else {
        this.newModifyData.businessType = '99'
      }
    }
  }
}
</script>
