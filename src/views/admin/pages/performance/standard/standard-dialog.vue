<template>
  <el-form :model="formData" :rules="rules" ref="form" >
    <el-form-item label="名称" :label-width="'70px'" prop="name" required>
      <el-input v-model.trim="formData.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="描述" :label-width="'70px'" prop="description">
      <el-input type="textarea" v-model.trim="formData.description" :rows="5"></el-input>
    </el-form-item>
    <el-form-item label="评估分" :label-width="'70px'" prop="detail" :rules="detailRule" required>
      <el-table :data="formData.detail" class="gengtp-standard-dialog-form">
        <el-table-column property="name" label="名称" width="180">
          <template slot-scope="scope">
            <el-form-item
              labelWidth="100"
              :prop="`detail[${scope.$index}].detailName`"
              :rules="detailNameRule">
              <el-input
                placeholder="名称"
                v-model.trim="scope.row.detailName"
                @change="modifier(scope)"
                @blur="storeName(scope.row.detailName, scope.$index)">
                <!-- blur保存名称 zhengwq5 2017/11/25 add -->
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="分值" width="180" :render-header="renderexclamation">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].score`" :rules="scoreRule">
              <el-input placeholder="分值" v-model.trim="scope.row.score" @change="modifier(scope)" @blur="scoreChange(scope.row.score, scope.$index)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="描述">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].detailDescription`"
                          :rules="descriptionRule">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 1}" v-model.trim="scope.row.detailDescription"
                @change="modifier(scope)">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" :render-header="renderHeader" width="67" align="center">
          <template slot-scope="scope">
            <i class="icon iconfont icon-delete" @click="removeRow(scope.$index)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>

<script>
  import req from 'api/performance/standard'

  export default {
    name: 'standard-dialog',
    props: {
      standardId: String
    },
    data () {
      // 验证分值的自定义规则
      var validateNumber = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入分值'))
        }
        if (value.length > 128) {
          callback(new Error('长度最多128字符'))
        }
        if (value.indexOf('，') > 0) {
          callback(new Error('请用英文逗号分割'))
          return
        }
        if (this.isScoreDuplicate(value)) {
          callback(new Error('分数不能重复'))
        }
        let numArr = value.split(',')
        if (numArr.length) {
          numArr.forEach((val, index) => {
            if (!Number(val) && val !== '0') {
              callback('格式错误')
            }
          })
          callback()
        } else {
          callback('格式错误')
        }
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

      // 校验名称重复 zhengwq5 2017/11/25 add
      const duplicateNameValidate = (rule, val, cb) => {
        if (!val) {
          cb(new Error('请输入名称'))
        } else if (val.length > 25) {
          cb(new Error('长度最大为25个字符'))
        } else if (this.isNameDuplicate(val)) {
          cb(new Error('名称不能重复'))
        } else {
          cb()
        }
      }

      return {
        visible: false,
        formData: {},
        rules: {
          name: [
            {validator: spaceValidate, trigger: 'change'}
          ],
          description: [
            {min: 1, max: 255, message: '长度最大为255个字符', trigger: 'change'}
          ],
          standardType: [
            {required: true, message: '请选择分等类型', trigger: 'change'}
          ]
        },
        detailRule: {
          validator: validateRules, trigger: 'change'
        },
        scoreRule: [
          {validator: validateNumber, trigger: 'change'},
          {validator: validateNumber, trigger: 'blur'}
        ],
        detailNameRule: [
          // 增加重复名称校验 zhengwq5 2017/11/25 modify
          {validator: duplicateNameValidate, trigger: 'change'},
          {validator: duplicateNameValidate, trigger: 'blur'}
        ],
        descriptionRule: [
          {required: true, message: '请输入描述', trigger: 'change'},
          {min: 1, max: 50, message: '长度最大为50个字符', trigger: 'change'}
        ],
        cacheArr: [],
        // 存储已输入名称 zhengwq5 2017/11/25 add
        isolateNames: [],
        scoreArr: []
      }
    },
    created () {
      this.initData()
    },
    methods: {
      initData () {
        if (this.standardId) {
          req('oneStandardDetail', {standardId: this.standardId}).then((data) => {
            let {name, status, description, standardType, detail} = data
            this.formData = {
              name: name,
              status: status,
              description: description,
              standardType: standardType,
              detail: detail
            }
            this.formData.detail.detailId = detail.detailId
            this.type = 1
            if (this.formData.detail.length) {
              for (let [idx, obj] of this.formData.detail.entries()) {
                this.storeName(obj.detailName, idx)
              }
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.formData = {
            name: '',
            detail: [],
            status: 1,
            standardType: '',
            description: ''
          }
          this.type = 0
        }
      },
      // 修改每一行的评估分的时候触发
      modifier (scope) {
        if (scope.row.updateType === 1) {
          return
        }
        this.formData.detail[scope.$index].updateType = 2
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
      // 自定义表头的感叹号图标提示,这里有bug饿了么的图标提示不生效
      renderexclamation (h, {column, $index}) {
        return h('div', {}, ['分值   ', h('el-tooltip', {
          'class': {
            'item': true
          },
          attrs: {
            effect: 'dark',
            content: '可以输入多个数字，用英文逗号,分开',
            placement: 'top-start'
          }
        }, [h('i', {
          'class': {
            'icon': true,
            'iconfont': true,
            'icon-tips': true
          }
        })])])
      },
      // 增加一行评估分
      addRow () {
        this.formData.detail.push({sortNo: 1, updateType: 1, score: ''})
        this.$refs['form'].validate((valid) => {})
      },
      // 删除一行评估分
      removeRow (index) {
        this.formData.detail[index].updateType = 3
        let cache = this.formData.detail.splice(index, 1)
        this.cacheArr = this.cacheArr.concat(cache)
        // console.log(this.cacheArr)
        this.isolateNames.splice(index, 1)
        this.scoreArr.splice(index, 1)
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
              // 过滤掉多余的数据
              for (let i = 0; i < res.detail.length; i++) {
                if ((!res.detail[i].detailId) && (res.detail[i].updateType === 3)) {
                  res.detail.splice(i, 1)
                  i--
                }
              }
              if (this.type) {
                req('modifiedStandard', {standardId: this.standardId, ...res}).then((data) => {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                  })
                  resolve(res)
                })
              } else {
                req('addOneStandard', res).then((data) => {
                  this.$message({
                    message: '恭喜你，添加成功',
                    type: 'success'
                  })
                  resolve(res)
                })
              }
            } else {
              resolve(false)
            }
          })
        })
      },

      // 保存已输入名称 zhengwq5 2017/11/25 add
      storeName (name, index) {
        this.isolateNames[index] = name
      },

      // 检查名称是否重复 zhengwq5 2017/11/25 add
      isNameDuplicate (name) {
        if (this.isolateNames.length <= 1) return false
        let matchedNames = this.isolateNames.filter(i => i === name)
        if (matchedNames.length > 1) return true
        return false
      }
    }
  }

</script>

<style lang="scss">
.gengtp-standard-dialog-form {
  .el-table__body-wrapper {
    overflow: hidden;
  }
}
</style>
