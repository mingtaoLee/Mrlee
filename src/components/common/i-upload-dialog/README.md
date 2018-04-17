<div align="center">
  <h1>Upload-Dialog</h1>
</div>

## `What???`
* * *
用于导入的单身对话框(目前仅限用于导入Excel表)

## `Why???`
* * *
[@玉树临风,潇洒倜傥的濠哥](http://http://10.16.85.142/cenjh2)

## `How???`
* * *
<div align="center">
  <h3>参数列表</h3>
</div>

<div align="center">

|Name|Required|Type|Default|Description|
|:--:|:--:|:--:|:-----:|:----------|
|**`title`**|**`false`**|**`{String}`**|**`'导入'`**|**`对话框标题`**|
|**`canVisit`**|**`false`**|**`{Boolean}`**|**`false`**|**`对话框是否可见标志`**|
|**`size`**|**`false`**|**`{String}`**|**`'small'`**|**`对话框尺寸`**|
|**`uploadApi`**|**`true`**|**`{String}`**|**`/`**|**`上传文件API`**|
|**`sampleUrl`**|**`true`**|**`{String}`**|**`/`**|**`模板文件URL`**|
|**`multipleFlag`**|**`false`**|**`{Boolean}`**|**`false`**|**`多选文件标志`**|
|**`acceptType`**|**`false`**|**`{String}`**|**`'.xlsx, .xls'`**|**`文件后缀名 | MIME类型`**|
|**`autoUploadFlag`**|**`false`**|**`{Boolean}`**|**`false`**|**`自动上传标志`**|

</div>

<div align="center">
  <h3>代码示例</h3>
</div>

```html
<el-button @click="importFunc">导入</button>

<i-upload-dialog
  :upload-api="`/api/performance/schemes/${this.params.schemeId}/periods/${this.params.period}/plans/import`"
  sample-url="/api/templates/pfmPlanTemplate/download"
  :can-visit.sync="uploadDialogFlag">
</i-upload-dialog>
```

```js
import IUploadDialog from 'components/common/i-upload-dialog'

export default {
  components: {
    IUploadDialog
  },

  data () {
    return {
      uploadDialogFlag: false
    }
  },

  methods: {
    importFunc () {
      this.uploadDialogFlag = true
    }
  }
}
```
