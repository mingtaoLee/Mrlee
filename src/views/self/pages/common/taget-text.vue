<template>
<div>
        <p v-if="visible">
            <span>{{text}}{{loopStopWatch(stauts, formData.value)}}</span>
            <i class="iconfont icon-edit1" @click="editClick"></i>
        </p>
        <p v-else class="input-show">
          <el-form :rules="formRules" :model="formData" ref="formRuless">
            <el-row>
              <span style="padding-top: 10px;">{{text}}</span>
              <el-form-item prop="value" style="display: inline-block">
                <el-input v-model="formData.value" placeholder="请输入内容" v-if="!stauts"></el-input>
                <i-select :parameter="stauts" v-model="formData.value" v-else style="display: inline-block"></i-select>
                <span style="padding-top: 7px;margin-left: 10px;"><span class="save" @click="saveClick">保存</span></span>
              </el-form-item>
            </el-row>
          </el-form>
            <!-- {{text}}
            <input v-model="center" placeholder="请输入内容"></input> 
            <span class="save" @click="saveClick">保存</span> -->
          
        </p>
</div>

</template>
<script>
import req from 'api/self/essential.js'
import ISelect from 'components/common/i-select/i-select'
import { globalComponentVariable } from 'config/globalComponentVariable'
import { getSelectData } from 'utils/index.js'
export default {
  name: 'TagetText',
  components () {
    ISelect
  },
  data () {
    return {
      visible: true,
      label: 'null',
      mabiao: {
        ID_TYPE: [],
        DOMICILE_TYPE: [],
        GENDER: [],
        NATION: [],
        COUNTRY: [],
        POLITICS_STATUS: [],
        EMPLOYEE_TYPE: [],
        FAMILY_RELATIONSHIP: [],
        MARITAL_STATUS: []
      }
    }
  },
  props: {
    rules: {
      type: Array,
      default () {
        return []
      }
    },
    value: null,
    text: String,
    center: {
      type: String
    },
    dot: String,
    empEmployeeId: String,
    stauts: String
  },
  created () {
    this.stopWatch()
  },
  computed: {
    formData () {
      return {
        value: this.value
      }
    },
    formRules () {
      return {
        value: this.rules
      }
    }
  },
  methods: {
    editClick () {
      this.visible = false
    },
    saveClick () {
      this.$refs.formRuless.validate(item => {
        if (item) {
          this.$emit(`update:value`, this.formData.value)
          this.visible = true
          let params = {
            empEmployeeId: this.empEmployeeId
          }
          params[this.dot] = this.formData.value
          req('updateEmployeeBaseInfo', params).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            }
          })
        }
      })
    },
    stopWatch (stopWatch) {
      this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('MARITAL_STATUS'), 'MARITAL_STATUS')
      this.stopWatchInquiry(globalComponentVariable.iSelect['dict'].url('FAMILY_RELATIONSHIP'), 'FAMILY_RELATIONSHIP')
    },
    stopWatchInquiry (url, tableName) {
      getSelectData(url, true).then(res => {
        this.mabiao[tableName] = res
      })
    },
    loopStopWatch (tableName, value) {
      if (!this.mabiao[tableName]) {
        return value
      }
      if (!isNaN(value)) {
        for (let i = 0; i < this.mabiao[tableName].length; i++) {
          if (value === this.mabiao[tableName][i].value) {
            return this.mabiao[tableName][i].label
          }
        }
      } else {
        return value
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .save{
          color: #3DA5FE;
          cursor: pointer;
      }
  .iconfont {
      color: #3DA5FE;
      cursor: pointer;
      margin-left: 10px;
  }
  .overflow-head {
    width: 215px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
<style lang="scss">
.input-show {
  .el-input {
    width: 58%;
  }
  .el-select--mini {
    width: 146px;
  }
  .el-input--suffix {
    width: 150px;
  }
}
</style>