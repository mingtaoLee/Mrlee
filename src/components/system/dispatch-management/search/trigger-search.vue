<template>
	<i-form
		slot="header"
		@reset="reset"
		@search="search">
		<el-form-item label="触发器名称">
			<el-input v-model="searchBox.name" clearable maxlength="20"></el-input>
		</el-form-item>
    <el-form-item>
			<span slot="label">触发器类型</span>
			<i-select 
        v-model="searchBox.type"
        :options="typeOptions"
        clearable 
        placeholder="请选择"
        parameter="TRIGGER_TYPE">
      </i-select>
		</el-form-item>
    <el-form-item label="创建人">
      <el-input v-model="searchBox.createdBy" clearable maxlength="20"></el-input>
    </el-form-item>
	</i-form>
</template>

<script>
  import IForm from 'components/common/i-form/i-form.vue'
  export default {
    name: 'TriggerSearch',
    components: {
      IForm
    },
    data () {
      return {
        // 搜索组件的条件
        searchBox: {
          name: '',
          type: '',
          createdBy: ''
        },
        // 触发器类型选项
        typeOptions: [
          { value: 'run_once', label: '单次触发' },
          { value: 'simple_repeat', label: '简单重复触发' },
          { value: 'cron_expression', label: 'Cron表达式触发' }
        ],
        // 时间的限制
        pickerOptions: {
          disabledDate: time => {
            return time.getTime() <= Date.parse(this.searchBox.startEffectiveDate) - 8.64e7
          }
        }
      }
    },
    methods: {
      // 搜索功能，仅做过滤
      search () {
        let params = this.searchBox
        console.log('搜索内容为', params)
        this.$emit('search', params)
      },
      // 重置搜索框
      reset () {
        Object.keys(this.searchBox).map(key => {
          this.searchBox[key] = ''
        })
        // 修复时间控件用户填写填写错误字段，重置不了的问题
        this.$refs.startEffectiveDate.$children[0].currentValue = ''
        this.$refs.endEffectiveDate.$children[0].currentValue = ''
      }
    }
  }
</script>
