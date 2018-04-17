<template>
  <i-form
    slot="header"
    @reset="reset"
    @search="search">
    <el-form-item label="任务名称">
      <el-input v-model="searchBox.name" clearable maxlength="20"></el-input>
    </el-form-item>
    <el-form-item>
      <span slot="label">任务状态</span>
      <i-select 
        v-model="searchBox.status" 
        :options="typeOptions"
        clearable 
        placeholder="请选择"
        parameter="JOB_TYPE">
      </i-select>
    </el-form-item>
    <el-form-item label="创建人">
      <el-input v-model="searchBox.createdBy" clearable maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="创建时间 从">
      <el-date-picker
        v-model="searchBox.createTimeFrom"
        type="date"
        placeholder=""
        ref="startEffectiveDate"
        :picker-options="createTimeFromPickerOptions">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="至">
      <el-date-picker
        v-model="searchBox.createTimeTo"
        type="date"
        placeholder=""
        ref="endEffectiveDate"
        :picker-options="createTimeToPickerOptions">
      </el-date-picker>
    </el-form-item>
  </i-form>
</template>

<script>
  import IForm from 'components/common/i-form/i-form.vue'
  export default {
    name: 'TaskSearch',
    components: {
      IForm
    },
    data () {
      return {
        // 搜索组件的条件
        searchBox: {
          name: null,
          status: null,
          createdBy: null,
          createTimeFrom: null,
          createTimeTo: null
        },
        // 任务状态选项
        typeOptions: [
          {value: 'normal', label: '正常'},
          {value: 'pause', label: '暂停'}
        ],
        // 开始日期必须小于结束日期
        createTimeFromPickerOptions: {
          disabledDate: (time) => {
            if (this.searchBox.createTimeTo) {
              return time.getTime() >= this.searchBox.createTimeTo
            } else {
              return false
            }
          }
        },
        // 结束日期必须大于开始日期
        createTimeToPickerOptions: {
          disabledDate: (time) => {
            if (this.searchBox.createTimeFrom) {
              return time.getTime() <= this.searchBox.createTimeFrom
            } else {
              return false
            }
          }
        }
      }
    },
    watch: {
      'searchBox.createTimeFrom' (val) {
        this.createTimeToPickerOptions = {
          disabledDate: (time) => {
            if (val) {
              return time.getTime() <= val
            } else {
              return false
            }
          }
        }
      },
      'searchBox.createTimeTo' (val) {
        this.createTimeFromPickerOptions = {
          disabledDate: (time) => {
            if (val) {
              return time.getTime() >= val
            } else {
              return false
            }
          }
        }
      }
    },
    methods: {
      // 搜索功能，仅做过滤
      search () {
        let params = this.searchBox
        // console.log('搜索内容为', params)
        this.$emit('search', params)
      },
      // 重置搜索框
      reset () {
        Object.keys(this.searchBox).map(key => {
          this.searchBox[key] = null
        })
        // 修复时间控件用户填写填写错误字段，重置不了的问题
        this.$refs.startEffectiveDate.$children[0].currentValue = ''
        this.$refs.endEffectiveDate.$children[0].currentValue = ''
      }
      // 选择的开始时间变化进行比较
      // createTimeFromChange (val, val2) {
      //   // && 后条件：防止第一次选择报错
      //   if (this.searchBox.createTimeTo - val <= 0 && this.searchBox.createTimeTo !== null) {
      //     this.$message.error('查询开始日期必须小于查询结束日期')
      //     this.searchBox.createTimeFrom = null
      //   }
      // },
      // 选择的结束时间变化进行的比较
      // createTimeToChange (val) {
      //   //  && 后条件：防止第一选择报错
      //   if (val - this.searchBox.createTimeFrom <= 0 && this.searchBox.createTimeFrom !== null) {
      //     this.$message.error('查询结束日期必须大于查询开始日期')
      //     this.searchBox.createTimeTo = null
      //   }
      // }
    }
  }
</script>
