<template>
    <div>
        <p class="title">
           <i class="el-icon-warning"></i>
           将会给选定人员发送出款异常通知消息 
        </p>
        <p>通知内容:</p>
        <textarea class="msg" v-model="msg"></textarea>
    </div>
</template>
<script>
import req from 'api/compensation/check-give/unusual-takeout'
import { showMessage } from 'utils/index'
export default {
  name: 'UnusualTakeoutInform',
  props: {
    informList: Array
  },
  data () {
    return {
      msg: '您好，因您的银行账户信息存在错误，现不能进行工资出款，请您及时登录掌上永辉维护正确的银行账户信息，或是联系您所在区域的HR人员进行处理，谢谢！'
    }
  },
  methods: {
    sendMsg () {
      return new Promise(resolve => {
        req('unusualInform', {abnormalRecordIdList: this.informList, exception: this.msg}).then(res => {
          if (res) {
            showMessage('success', '通知成功！')
          } else {
            showMessage('danger', '通知失败！')
          }
          resolve(!!res)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-icon-warning {
  color: red;
  font-size: 18px;
  margin-right:20px;
}
p{
  font-family: '微软雅黑';
  color: rgb(51, 51, 51);
  font-size:16px;
}
p.title{
    line-height:50px;
}
.msg{
  border:1px solid rgb(169, 169, 169);
  width:100%;
  min-height:100px;
  font-family: '微软雅黑';
  color:#000;
  resize: auto;
  font-size:13px;
}
</style>



