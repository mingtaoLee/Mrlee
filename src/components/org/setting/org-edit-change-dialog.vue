<template>
  <div >
    <el-dialog size="small" :visible.sync="visible" @open="openDialog" title="设置-更改负责人" @close="closeDialog">
      <label class="labelStyle">请选择部门负责人</label>
      <el-input :readonly="true" v-model="personnels" suffix-icon="el-icon-menu" @click.native="handleIconClick">
      </el-input>
      <div slot="footer" class="footer-btn">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </el-dialog>
    <i-personnel-select 
    ref="iPersonnelSelect" 
    :isShow.sync="isShow" 
    @confirm="handleConfirm"
    :multiple="false">
    </i-personnel-select>
  </div>
</template>
<script>
import req from 'api/org/setting.js'
import orgDialog from '@/mixins/orgDialog'
// import OrgDialogStep from './org-dialog-step'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
export default {
  props: ['origin'],
  data () {
    return {
      isShow: false,
      personnels: '', // 输入框显示
      inputEmployeeName: '', // 用于
      leaderId: '' // 自身ID
    }
  },
  components: {
    iPersonnelSelect
    // OrgDialogStep
  },
  methods: {
    openDialog () {
      this.personnels = ''
      this.$refs.iPersonnelSelect.resetData()
    },
    handleConfirm (selected) {
      if (selected.length <= 1) {
        for (let i = 0; i < selected.length; i++) {
          this.inputEmployeeName = this.inputEmployeeName + selected[i].employeeName + ' '
        }
        this.isShow = false
        this.personnels = this.inputEmployeeName
        this.inputEmployeeName = ''
        this.leaderId = selected[0].employeeId
      } else {
        this.$message({
          type: 'warning',
          message: '负责人只能选择一个'
        })
        this.isShow = true
      }
    },
    handleIconClick () {
      this.isShow = !this.isShow
    },
    submit () {
      if (this.leaderId === '') {
        this.$message({
          type: 'info',
          message: '请选择部门负责人'
        })
      } else {
        req('edit', {oId: this.origin.orgUnitId, leaderId: this.leaderId}).then((data) => {
          if (data === true) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$emit('updateOrgLeader')
            this.leaderId = ''
            this.visible = false
          }
        })
      }
    },
    dialogCancel () {
      this.visible = false
      this.leaderId = ''
    }
  },
  mixins: [orgDialog],
  updated () {

  }
}
</script>
<style lang="scss" scoped>
.footer-btn{
  display:flex;
  justify-content:flex-end;
  margin-top:20px;
}
.labelStyle{
  font-size:16px;
  line-height:30px;
}
</style>
