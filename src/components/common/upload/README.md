# uploader公共业务组件说明
- 基于elementUI的upload组件进行简单的业务封装，并开放部分Attributes。
## Attributes
参数 | 说明 | 类型 | 默认值
--- | --- | --- | --- |
mode | 附件展示模式，normal为普通模式，table为在表格行中展示 | String | normal
type | 上传按钮展示类型，normal为拖拉模式，text、button为按钮模式（配合mode配置使用） | String | normal
previewMode | 区分上传模式和预览模式，预览模式无法上传和删除附件 | Boolean | false
fileList | 附件id数据，组件内部会根据id查出附件具体信息并初始化 | Array | []
businessId | 当fileList为空(无附件id),可传此属性查数据 | String | ''
businessType | 当fileList为空(无附件id),可传此属性查数据,依赖businessId | String | ''
fileLimit | 上传的最大附件数 | Number | 5
fileLimitSize | 每个附件的容量大小 | Number | 10
onChange | 附件列表改变时触发函数，返回参数（file, fileList） | Function |
onError | 附件上传失败时触发函数，返回参数（err, file, fileList）  | Function |
onSuccess | 附件上传成功时触发函数，返回参数（response，file, fileList）  | Function |
onRemove | 附件列表删除操作时触发函数，返回参数（file, fileList）  | Function |
onExceed | 文件超出个数限制时触发函数，返回参数（file, fileList）  | Function |
## Demo
```
<template>
  <div>
    <Uploader
      :previewMode="previewMode"
      :fileList="fileList"
      @onRemove="onRemove"
      @onSuccess="onSuccess"
      @onError="onError"
      @onChange="onChange"></Uploader>
  </div>
</template>
<script>
  import Uploader from 'components/common/upload/uploader'
  export default {
    data () {
      return {
        previewMode: false,
        fileList: ['8ac9a79c5f95ee5b015f95f01eb40000', '8a8ea0745fc3c1f7015fc48bc81f0005']
      }
    },
    methods: {
      onError (err, file, fileList) {
        console.log('err', err, file, fileList)
      },
      onSuccess (response, file, fileList) {
        console.log('success', response, file, fileList)
      },
      onRemove (file, fileList) {
        console.log('remove', file, fileList)
      },
      onChange (file, fileList) {
        console.log('changes', file, fileList)
      },
      onExceed (file, fileList) {
        console.log('onexceed', file, fileList)
      }
    },
    components: {
      Uploader
    }
  }
</script>
```
##### issues ?
请联系 `pingyang1.li@partner.midea.com.cn`
