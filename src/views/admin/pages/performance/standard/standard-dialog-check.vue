<template>
  <el-form :model="formData" ref="form">
    <el-form-item label="名称" :label-width="'55px'" prop="name">
      <el-input disabled v-model="formData.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="描述" :label-width="'55px'" prop="description">
      <el-input disabled type="textarea" v-model="formData.description" :rows="5"></el-input>
    </el-form-item>
    <el-form-item label="评估分" :label-width="'55px'" prop="detail" :rules="detailRule">
      <el-table :data="formData.detail">
        <el-table-column property="name" label="名称" width="180">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].detailName`" :rules="detailNameRule">
              <el-input disabled placeholder="名称" v-model="scope.row.detailName" @change="modifier(scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="分值" width="180" :render-header="renderexclamation">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].score`" :rules="scoreRule">
              <el-input disabled placeholder="分值" v-model="scope.row.score" @change="modifier(scope)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="name" label="描述">
          <template slot-scope="scope">
            <el-form-item labelWidth="100" :prop="`detail[${scope.$index}].detailDescription`"
                          :rules="descriptionRule">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 1}" v-model="scope.row.detailDescription"
                disabled @change="modifier(scope)">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>

      </el-table>
    </el-form-item>
  </el-form>
</template>

<script>
  import req from 'api/performance/standard'

  export default {
    name: 'standard-dialog-check',
    props: {
      standardId: String
    },
    data () {
      // 验证分值的自定义规则
      var validateNumber = (rule, value, callback) => {
        if (value.length > 128) {
          callback(new Error('长度最多128字符'))
        }
        if (value.indexOf('，') > 0) {
          callback(new Error('请用英文逗号分割'))
          return
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
      return {
        visible: false,
        formData: {},
        rules: {
          name: [
            {required: true, message: '请输入评分标准名称', trigger: 'change'},
            {min: 1, max: 128, message: '长度最大为128个字符', trigger: 'change'}
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
        scoreRule: {
          validator: validateNumber, trigger: 'change'
        },
        detailNameRule: [
          {required: true, message: '请输入名称', trigger: 'change'},
          {min: 1, max: 25, message: '长度最大为25个字符', trigger: 'change'}
        ],
        descriptionRule: [
          {required: true, message: '请输入描述', trigger: 'change'},
          {min: 1, max: 50, message: '长度最大为50个字符', trigger: 'change'}
        ],
        cacheArr: []
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
      },

      /* 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
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
                req('modifiedStandard', {standardId: this.standardId, ...res}).then((res) => {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                  })
                  console.log(res)
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
      }
    }
  }

</script>
