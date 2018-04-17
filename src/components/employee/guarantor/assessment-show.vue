<template>
  <div class="show">
      <!-- 这里是一个调查问卷 -->
      <el-form
       :model="cloneData" 
       :rules="rule" 
       ref="ruleForm" 
       class="body" 
       label-width="100px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="问卷标题" prop="empSuretyAssessmentName" required >
              <el-input :disabled="!editAble" v-model="cloneData.empSuretyAssessmentName" placeholder="请填写问卷标题(限30字以内)" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <div v-for="(item,idx) in cloneData.assessmentList" :key="idx">
              <el-row :gutter="20">
                <el-col :span="22">
                  <el-form-item
                      :label="`题目${idx+1}`"
                      :prop="'assessmentList.' + idx + '.quesion'"
                      :rules="{
                          required: true, message: '题目不能为空', trigger: 'blur'
                       }"
                   >
                    <el-input
                      :disabled="!editAble"
                      v-model="item.quesion"
                      placeholder="请填写问卷题目(限30字以内)"
                      maxlength="100"
                      ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="delete" v-if="editAble">
                  <el-button type="text" @click="delTest(idx)">删除</el-button>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="22">
                  <el-form-item label="描述">
                    <el-input
                      :ref="'description' + idx"  
                      @blur="tipShow($event, idx)" 
                      :disabled="!editAble" 
                      type="textarea" 
                      v-model="item.description"  
                      :autosize="{ minRows: 1, maxRows: 6}"
                        maxlength="255"
                        placeholder="请描述 (限255字以内)"
                      ></el-input>
                    <!-- <p :ref="'tip' + idx" style="font-size: 0; color:#ff4949">描述长度最多255个字</p> -->
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        
        <!-- 分数部分 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="合格分数" prop="grade">
              <el-input :disabled="!editAble" v-model="cloneData.passMark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" class="total">
              <span>总分： {{totalScore}}</span>
          </el-col>
        </el-row>

    </el-form>
  </div>
</template>
<script>
  export default {
    props: {
      editAble: {
        type: Boolean,
        default: true
      },
      assessment: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data () {
      let check = (rul, value, callback) => {
        value = this.cloneData.passMark
        let isNumReg = /[.]/
        if (!value) {
          return callback(new Error('分数不能为空'))
        }
        setTimeout(() => {
          if (!+value || +value < 0 || isNumReg.test(value)) {
            callback(new Error('请输入正整数'))
          } else {
            // this.cloneData.assessmentList = this.cloneData.assessmentList.filter((key, idx) => {
            //   return key.quesion
            // })
            // console.log(now)
            if (value > this.cloneData.assessmentList.length * 5) {
              callback(new Error('合格分数不能超过总分'))
            } else {
              callback()
            }
          }
        }, 0)
      }
      // let checkTitle = (rul, value, callback) => {
      //   console.log(rul, value)
      //   if (!this.value) {
      //     return callback(new Error('题目不能为空'))
      //   }
      //   callback()
      // }

      return {
        tip: [],
        value: '',
        rule: {
          empSuretyAssessmentName: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
          grade: [{ validator: check, trigger: 'blur' }]
          // assessmentList: [{required: true, validator: checkTitle, trigger: 'blur'}]
        },
        cloneData: null
      }
    },

    created () {
      this.init()
      // this.addTest()
    },
    computed: {
      totalScore () {
        return this.cloneData.assessmentList.length * 5
      }
    },
    methods: {
      init () {
        this.cloneData = JSON.parse(JSON.stringify(this.assessment)) || {}
      },
      tipShow ($event, ref) {
        if ($event.target.textLength > 255) {
          this.$refs['description' + ref][0].value.fontsize(2)
          this.tip.push(false)
        } else {
          this.$refs['description' + ref][0].value.fontsize(2)
          this.tip.shift()
        }
      },
      submit () {
        this.$refs.ruleForm.validate(valid => {
          if (valid && !this.tip.length) {
            // console.log(this.cloneData, this.editAble)
            this.$emit('confirmAss', this.cloneData, this.editAble)
          } else {
            console.log('error submit')
          }
        })
      },

      addTest () {
        this.cloneData.assessmentList.push({ orderNo: '', quesion: '', description: '1分-代表什么；2分-代表什么；3分-代表什么；4分-代表什么；5分-代表什么' })
      },
      delTest (idx) {
        if (this.cloneData.assessmentList.length > 1) {
          this.cloneData.assessmentList.splice(idx, 1)
        } else {
          this.$message.warning('问卷题目至少要有一题!')
        }
      },
      checkQuesion (index, val) {
        console.log(val)
        this.value = val
      }
    },
    watch: {
      assessment (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init()
        }
      }
    }
  }
</script>
<style lang="scss">
  .show {
    margin: 0 -20px -30px;
    .body {
      padding: 30px 20px;
      color: #48576a;
      font-size: 14px;
      .total {
        text-align: right;
        height: 30px;
        line-height: 30px;
      }
      .title {
        display: flex;
        position: relative;
        width: 80%;
      }
      .delete {
        text-align: right;
        // margin: 16px 0;
      }
    }
  }
</style>