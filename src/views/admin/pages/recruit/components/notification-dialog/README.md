<div align="center">
  <h1>Notification-Dialog</h1>
</div>

## `What???`
* * *
小小通知对话框

## `Why???`
* * *
@英俊帅气的绩效兼招聘组组长——``罗国立``

## `How???`
* * *
<div align="center">
  <h3>参数列表</h3>
</div>

<div align="center">

|Name|Required|Type|Default|Description|
|:--:|:--:|:--:|:-----:|:----------|
|**`notificationType`**|**`true`**|**`{String}`**|**`'1'`**|**`通知类型:`<br>`1、邀约通知`<br>`2、复试通知`<br>`3、录用通知`**|
|**`showMe`**|**`true`**|**`{Boolean}`**|**`false`**|**`对话框显示标志`**|
|**`notifyWho`**|**`true`**|**`{Object}`**|**`'/'`**|**`通知人信息`**|

</div>

<div align="center">
  <h3>代码示例</h3>
</div>

```html
<template>
  <notification-dialog
    notificationType="1"
    :showMe.sync="notificationDialogFlag"
    :notifyWho="notifyWho">
  </notification-dialog>

  <el-button
    @click="toggle">
    toggle
  </el-button>
</template>

<script>
import NotificationDialog from 'views/admin/pages/recruit/components/notification-dialog'

export default {
  components: {
    NotificationDialog
  },

  data () {
    return {
      notificationDialogFlag: false,
      notifyWho: {}
    }
  },

  methods: {
    toggle () {
      this.notificationDialogFlag = true
    }
  }
}
</script>
```
