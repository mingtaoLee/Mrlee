<template>
  <div class="grape-dialog">
    <el-form :model="formData" :rules="rules" ref="form">

      <el-form-item
        label="名称"
        :label-width="'70px'"
        prop="name"
        required
      >
        <el-input v-model="formData.name" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item
        label="描述"
        :label-width="'70px'"
        prop="description"
      >
        <el-input
          type="textarea"
          v-model="formData.description"
          :rows="5"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="评估分"
        :label-width="'70px'"
        prop="detail"
        :rules="detailRule"
        required
      >
        <el-table :data="formData.detail">
          <div class="real">
            <el-table-column label="颜色" width="120" align="center">
              <template slot-scope="scope">
                <el-form-item
                  labelWidth="100"
                  :prop="`detail[${scope.$index}].color`"
                  :rules="colorRule"
                >
                  <span
                    style="position:absolute;right: 90px; top: 0;width: 10px; height: 10px;"
                    :style="{backgroundColor:scope.row.color}"
                  ></span>
                  <el-select
                    v-model="scope.row.color"
                    placeholder="请选择"
                    @change="modifier(scope,scope.row.color, scope.$index)"
                  >
                    <el-option
                      v-for="item in colors"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      <span
                        style="float: left ;width: 40px; height: 20px;"
                        :style="{backgroundColor:item.value}"
                      ></span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
          </div>

          <el-table-column property="name" label="分值" width="120">
            <template slot-scope="scope">
              <el-form-item
                labelWidth="100"
                :prop="`detail[${scope.$index}].score`"
                :rules="scoreRule"
              >
                <el-input
                  :disabled="scope.row.isWork === 'N'"
                  placeholder="分值"
                  type="number"
                  v-model.number="scope.row.score"
                  @change="modifier(scope)"
                  @blur="scoreChange(scope.row.score, scope.$index)"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column property="name" label="描述" width="120">
            <template slot-scope="scope">
              <el-form-item
                labelWidth="100"
                :prop="`detail[${scope.$index}].detailDescription`"
                :rules="scope.row.isWork === 'N' ? {} : descriptionRule"
              >
                <el-input
                  :disabled="scope.row.isWork === 'N'"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 1}" v-model="scope.row.detailDescription"
                  @change="modifier(scope)">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            property="name"
            label="是否默认值"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <el-form-item
                labelWidth="100"
                :prop="`detail[${scope.$index}].isDefault`"
                :rules="scope.row.isWork === 'N' ? {} : defaultRule"
                :ref="`isDefault${scope.$index}`"
              >
                <!-- <el-checkbox-group
                  :disabled="scope.row.isWork === 'Y'"
                  v-model="scope.row.isDefault"
                  @change="handlePercentChange($event, scope,formData)"
                >
                  <el-checkbox></el-checkbox>
                </el-checkbox-group> -->
                <el-select v-model="scope.row.isDefault"                   :disabled="scope.row.isWork === 'N'"
>
                  <el-option 
                  v-for="(item,index) in booleanOpts"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="是否出勤" align="center" width="120" >
            <template slot-scope="scope">
              <el-form-item
                :prop="`detail[${scope.$index}].isWork`"
                :rules="isWorkRule"
              >
                <!-- <el-checkbox-group v-model="scope.row.isWork">
                  <el-checkbox label="是" true-label="Y"></el-checkbox>
                </el-checkbox-group> -->
                <el-select v-model="scope.row.isWork" placeholder="">
                  <el-option 
                  v-for="(item,index) in booleanOpts"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="是否点赞" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="`detail[${scope.$index}].isPraise`" :rules = "{}">
                 <!-- <el-checkbox-group v-model="scope.row.isPraise" :disabled="scope.row.isWork === 'Y'">
                  <el-checkbox label="是" true-label="Y"></el-checkbox>
                </el-checkbox-group> -->
                <el-select v-model="scope.row.isPraise"                   :disabled="scope.row.isWork === 'N'"
>
                  <el-option 
                  v-for="(item,index) in booleanOpts"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="是否填事件卡" width='120' >
            <template slot-scope="scope">
              <el-form-item :prop="`detail[${scope.$index}].isWriteEvent`" :rules="{}">
                <!-- <el-checkbox-group v-model="scope.row.isWriteEvent" :disabled="scope.row.isWork === 'Y'">
                  <el-checkbox label="是" true-label="Y"></el-checkbox>
                </el-checkbox-group> -->
                 <el-select 
                  v-model="scope.row.isWriteEvent"                   :disabled="scope.row.isWork === 'N'"
                  >
                  <el-option 
                  v-for="(item,index) in booleanOpts"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            property="name"
            :render-header="renderHeader"
            align="center"
          >
            <template slot-scope="scope">
              <i class="icon iconfont icon-delete" @click="removeRow(scope.$index)"></i>
            </template>
          </el-table-column>

        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import req from 'api/performance/grape-standard'
  import { DynamicRules } from './dynamic-rules'
  import { clone } from 'utils/index'

  export default {

    name: 'standard-dialog',

    props: {
      standardId: String
    },

    components: {},

    data () {
      // 验证分值的自定义规则
      var validateNumber = (rule, value, callback) => {
        let reg = /\d(?=])/
        let index = reg.exec(rule.field)[0]
        let currentIsWork = this.formData.detail[Number(index)].isWork
        if (currentIsWork === 'N') callback()
        if (value === '') {
          callback(new Error('请输入分值'))
        }
        if (value.length > 128) {
          callback(new Error('长度最多128字符'))
        }
        if (!Number.isInteger(value)) {
          callback(new Error('请输入整数数字'))
        }
        if (this.isScoreDuplicate(value)) {
          callback(new Error('分数不能重复'))
        }
        callback()
      }
      // 验证评估分的详情
      var validateRules = (rule, value, callback) => {
        if (this.formData.detail.length) {
          callback()
        } else {
          callback(new Error('请添加至少一项数据'))
        }
      }
      // 验证不能为所有空格
      var spaceValidate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入评分标准名称'))
        } else if (value.replace(/\s+/g, '').length === 0) {
          callback(new Error('所有的字符不能都为空格'))
        } else if (value.length > 128) {
          callback(new Error('长度最大为128个字符'))
        } else {
          callback()
        }
      }
      var validateDefault = (rule, value, callback) => {
        let totalIndex = 0
        this.formData.detail.forEach((val, index) => {
          if (val.isDefault === 'Y') {
            totalIndex += 1
            if (totalIndex > 1) {
              callback(new Error('只能选择一个'))
            }
          }
        })
        console.log(totalIndex)
        if (totalIndex === 0) {
          callback(new Error('请选择一个'))
        }
        callback()
      }
      var validateColor = (rule, val, cb) => {
        if (!val) {
          cb(new Error('请选择颜色'))
        } else if (this.isColorDuplicate(val)) {
          cb(new Error('颜色不能重复'))
        } else {
          cb()
        }
      }
      var isWorkValidate = (rule, val, cb) => {
        if (val === 'N') {
          let ss = this.formData.detail.filter(ele => ele.isWork === 'N')
          ss.length > 1 && cb(new Error('只能选择一项未出勤'))
        }
        cb()
      }
      return {
        visible: false,
        formData: {},
        colors: [{
          value: '#FF0000',
          label: '红'
        }, {
          value: '#FF7D00',
          label: '橙'
        }, {
          value: '#FFFF00',
          label: '黄'
        }, {
          value: '#00FF00',
          label: '绿'
        }, {
          value: '#0000FF',
          label: '蓝'
        }, {
          value: '#00FFFF',
          label: '靛'
        }, {
          value: '#FF00FF',
          label: '紫'
        }, {
          value: '#808080',
          label: '灰'
        }],
        rules: {
          name: [
           {required: true, message: '请输入评分标准名称', trigger: 'change'},
           {min: 1, max: 128, message: '长度最大为128个字符', trigger: 'change'},
            {validator: spaceValidate, trigger: 'change'}
          ],
          description: [
            {min: 1, max: 255, message: '长度最大为255个字符', trigger: 'change'}
          ],
          standardType: [
            {required: true, message: '请选择分等类型', trigger: 'change'}
          ]
        },
        isWorkRule: {validator: isWorkValidate, trigger: 'change'},
        detailRule: {
          validator: validateRules, trigger: 'change'
        },
        colorRule: [{
          validator: validateColor, trigger: 'change'
        }],
        scoreRule: [
          {validator: validateNumber, trigger: 'change'},
          {validator: validateNumber, trigger: 'blur'}],
        defaultRule: [{
          validator: validateDefault, trigger: 'change'
        }],
        detailNameRule: [
          {required: true, message: '请输入名称', trigger: 'change'},
          {min: 1, max: 25, message: '长度最大为25个字符', trigger: 'change'}
        ],
        descriptionRule: [
          {required: true, message: '请输入描述', trigger: 'change'},
          {min: 1, max: 50, message: '长度最大为50个字符', trigger: 'change'}
        ],
        cacheArr: [],
        selectColorArr: [],
        scoreArr: [],
        booleanOpts: [
          {value: 'Y', label: '是'},
          {value: 'N', label: '否'}
        ]
      }
    },

    watch: {
      'formData': {
        handler: function (val) {
          // if (val.isWork === 'N') {
          //   val.updateType = 1
          //   val.score = ''
          //   val.color = ''
          //   val.isDefault = false
          //   val.isPraise = 'N'
          //   val.isWriteEvent = 'N'
          // }
        },
        deep: true
      }
    },

    created () {
      this.initData()
      this.initInstance()
    },

    methods: {

      initData () {
        if (this.standardId) {
          req('oneStandardDetail', {standardId: this.standardId}).then((data) => {
            let {name, status, description, detail} = data
            this.formData = {
              name: name,
              status: status,
              description: description,
              detail: detail
            }
            // this.formData.detail.forEach((val, index) => {
            //   val.isDefault === 'Y' ? val.isDefault = true : val.isDefault = false
            // })
            this.formData.detail.detailId = detail.detailId
            this.type = 1
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.formData = {
            name: '',
            detail: [],
            status: 1,
            description: ''
          }
          this.type = 0
        }
      },

      // 修改每一行的评估分的时候触发
      /* 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = new DynamicRules(opts)
      },

      modifier (scope, color, index) {
        if (color) {
          // color === '#808080' && this.changeGrey(scope.row)
          this.colorChange(color, index)
        }
        if (scope.row.updateType === 1) {
          return
        }
        this.formData.detail[scope.$index].updateType = 2
      },

      // 当前行选择了灰色，改变为不出勤的状态
      // changeGrey (row) {
      //   row.isWork = 'Y'
      // },

      handlePercentChange (value, scope, formData) {
        this.instance.handlePercentChange(value, scope, formData, (valid) => {
//          this.flag.push(valid)
        })
        this.modifier(scope)
      },

      // 自定义表头+号图标
      renderHeader (h, {column, $index}) {
        return h('i', {
          'class': {
            'icon': true,
            'iconfont': true,
            'icon-add': true
          },
          on: {
            click: this.addRow
          }
        })
      },

      // 增加一行评估分
      addRow () {
        this.formData.detail.push({
          sortNo: 1,
          updateType: 1,
          score: '',
          color: '',
          isDefault: 'N',
          isWork: 'Y',
          isPraise: 'N',
          isWriteEvent: 'N'
        })
        this.$refs['form'].validate((valid) => {})
      },

      // 删除一行评估分
      removeRow (index) {
        this.formData.detail[index].updateType = 3
        let cache = this.formData.detail.splice(index, 1)
        this.cacheArr = this.cacheArr.concat(cache)
        this.selectColorArr = []
        this.colorChange()
        this.scoreArr = []
        this.scoreChange()
      },

      colorChange (color, index) {
        this.formData.detail.forEach((val, index) => {
          this.selectColorArr[index] = val.color
        })
      },

      isColorDuplicate (name) {
        if (this.selectColorArr.length <= 1) return false
        let matchedNames =
          this.selectColorArr.filter(i => i === name)
        if (matchedNames.length > 1) return true
        return false
      },

      scoreChange (score, index) {
        // this.scoreArr[index] = score
        this.formData.detail.forEach((val, index) => {
          this.scoreArr[index] = val.score
        })
      },

      isScoreDuplicate (name) {
        if (this.scoreArr.length <= 1) return false
        console.log(this.scoreArr)
        let matchedNames =
          this.scoreArr.filter(i => i === name)
        if (matchedNames.length > 1) return true
        return false
      },

      /* 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              console.log(res)
              resolve(this.formData)
            } else {
              resolve(false)
            }
          })
        })
      },

      // 确认按钮
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              let postArr = []
              res.detail.forEach((val, index) => {
                val.sortNo = index + 1
              })
              postArr = res.detail.concat(this.cacheArr)
              postArr.forEach((value, index) => {
                if (!value.updateType) {
                  value.updateType = 2
                }
              })
              this.cacheArr = []
              res.status = 1
              res.detail = postArr
              for (let i = 0; i < res.detail.length; i++) {
                // 过滤掉多余的数据
                if ((!res.detail[i].detailId) && (res.detail[i].updateType === 3)) {
                  res.detail.splice(i, 1)
                  i--
                }
              }
              let reqData = clone(res)
              // for (let i = 0; i < reqData.detail.length; i++) {
              //   if (reqData.detail[i].isDefault) {
              //     reqData.detail[i].isDefault = 'Y'
              //   } else {
              //     reqData.detail[i].isDefault = 'N'
              //   }
              // }
              if (this.type) {
                req('modifiedStandard', {...reqData, standardId: this.standardId}).then((data) => {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                  })
                  resolve(reqData)
                })
              } else {
                req('addOneStandard', reqData).then((data) => {
                  this.$message({
                    message: '恭喜你，添加成功',
                    type: 'success'
                  })
                  resolve(reqData)
                })
              }
            } else {
              resolve(false)
            }
          })
        })
      }
    }
  }

</script>
<style lang="scss">
  .grape-dialog {
    /*.el-table .cell, .el-table__footer-wrapper, .el-table__header-wrapper {*/
    /*overflow: auto;*/
    /*}*/
  }
</style>
