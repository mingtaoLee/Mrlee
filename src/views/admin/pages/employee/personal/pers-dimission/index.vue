<template>
  <section class="pers-dimission">
    <!-- <div class="form-card card"> -->
    <i-layout>
      <i-form
       @reset="reset"
       @search="search"
       slot="header"
       v-if="accessMap.empDimissionsGet">
        <el-form-item label="姓名">
          <el-input v-model=" listParams.employeeName" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="工号">
          <el-input v-model="listParams.employeeCode" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="证件号码">
          <el-input v-model="listParams.employeeIdNumber" :maxlength="18"></el-input>
        </el-form-item>

        <el-form-item label="入职时间">
          <el-date-picker
            v-model="listParams.hireDateMin"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
           :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="到">
            <el-date-picker
              v-model="listParams.hireDateMax"
              type="date"
              :editable="false"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="是否进黑名单">
          <i-select parameter="WHETHER_TYPE" v-model="listParams.inBlackList" ></i-select>
        </el-form-item>

        <el-form-item label="离职时间">
          <el-date-picker
            v-model="listParams.effectiveDateMin"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="到">
            <el-date-picker
              v-model="listParams.effectiveDateMax"
              type="date"
              :editable="false"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions3">
            </el-date-picker>
          </el-form-item>

        <el-form-item label="人事范围名称">
          <remote-select 
              v-model="listParams.personnelGroupCode" 
              clearable 
              dataKey="personnelGroup"
              :extraParams="extraParams"
              :props="personnelProps"
              :hasPower="Y"
            >
            </remote-select>
        </el-form-item>

        <el-form-item label="离职前职位">
          <el-input v-model=" listParams.posPositionName"></el-input>
        </el-form-item>

        <el-form-item label="离职类型">
          <i-select parameter="TERMINATION_TYPE" v-model="listParams.terminationType" ></i-select>
        </el-form-item>

        <el-form-item label="离职原因">
          <i-select parameter="TERMINATION_REASON" v-model="listParams.terminationReason" ></i-select>
        </el-form-item>

      </i-form>

      <div slot="section" v-if="table">
        <i-table
          :table="table"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange"
          >
          <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            style="width: 100%"
            @selection-change="handleChange"
            v-loading="dimissionsLoading"
            :element-loading-text="$loadingText"
            >
            <el-table-column type="selection"/>
            <el-table-column v-for="(item, idx) of table.columns"
              :key="idx"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :formatter="tableScope.formatter"
              :align="item.align"
              :fixed='item.fixed'
              sortable
            />
            <i-table-operator :table="tableScope" width="150"></i-table-operator>
          </el-table>
        </template>
        </i-table>
      </div>
    </i-layout>

    <i-dialog :title="title" v-model="dialogFormVisible" :toolbar="toolbarBlackList" :destroyedWhenClose="true">
      <el-form :model="form" :rules="rules" class="elForm">
          <el-row>
            
            <el-form-item label="上传文件" class="uploaderForm">
              <el-col :span="24" :offset="3">
                <i-upload
                  :previewMode="previewMode"
                  :fileList="signForm.fileList"
                  @onRemove="onFileRemove"
                  @onSuccess="onFileSuccess"
                  @onError="onFileError">
                </i-upload>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="label" required class="elTextarea">
              <el-col :span="20" :offset="3">
                <el-input
                  class="textarea"
                  autofocus
                  type="textarea"
                  maxlength="100"
                  :placeholder="placeholder"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  v-model="signForm.reason"
                  >
                  </el-input>
                </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </i-dialog>
    <i-dialog
      v-model="isShow"
      title="查询记录"
      size="large"
      modal=true
      :close-on-press-escape="closeOnPressEscape"
    >
      <i-table :table="table1">
        <template slot="table" slot-scope="tableScope">
          <el-table :data="checkList" v-loading="dimissionsDialogLoading" :element-loading-text="$loadingText">
            <el-table-column
              v-for="(col, idx) of table1.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              :align="col.align"
            >
            <template slot-scope="scope">
              <i-table-cell
              :row="scope.row"
              :col="col.prop"
              :table="tableScope"
              :formatter="tableScope.formatter"
              />
              </template>
            </el-table-column>
        <el-table-column
        label="相关附件"
        prop="fileList"
        min-width="240"
        align="center"
        >
          <template slot-scope="scope">
            <template v-for="(file, id) in scope.row.fileList" >
                <div class="flex-space-between file-item" :key="id">
                  <div>
                    <i class="el-icon-document"></i>
                    <a class="icon" :href="getDownload(file)" @click="download(file);" >{{file.attachmentName}}</a>
                  </div>
                </div>
            </template>
          </template>
        </el-table-column>

          </el-table>
        </template>
      </i-table>
    </i-dialog>
  </section>
</template>

<script>
import { uploaderLinks } from 'api/common/upload'
import { showMessage } from '../../../../../../utils/index.js'
import req, {config} from 'api/employee/personal_dis'
import ITable from 'components/common/i-table/index.vue'
import IDialog from 'components/common/i-dialog/i-dialog'
import IForm from 'components/common/i-form/i-form'
import ISelect from 'components/common/i-select/i-select'
import IUpload from 'components/common/upload/uploader'
import access from 'mixins/access'
import { getToken } from 'utils/auth'
import RemoteSelect from 'components/compensation/remote-select'

export default {
  components: {
    IUpload,
    ITable,
    IDialog,
    IForm,
    ISelect,
    RemoteSelect
  },
  mixins: [access],
  data () {
    return {
      dimissionsLoading: false,
      dimissionsDialogLoading: false,
      isShow: false,
      title: '',
      placeholder: '',
      label: '',
      flag: '',
      signForm: {
        empEmployeeId: '',
        fileList: [],
        reason: ''
      },
      rules: {
        reason: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      previewMode: false,
      reasonTiltle: '',

      dialogFormVisible: false,
      toolbarBlackList: [{
        text: '取消',
        type: 'text',
        func: (done) => {
          Object.keys(this.signForm).map(key => {
            this.signForm[key] = key === 'fileList' ? [] : ''
          })
          this.dialogFormVisible = false
          done()
        }
      }, {
        text: '确定',
        type: 'primary',
        func: (done) => {
          if (this.signForm.reason !== '') {
            this.flag === 'N' ? this.addBlackList() : this.deleteList()
            done()
          } else {
            this.$message.warning('信息填写不完整,请重新填写!')
          }
        }
      }],
      listParams: {
        // pageSize: 10,
        // pageIndex: 1,
        employeeCode: '',
        employeeIdNumber: '',
        employeeName: '',
        inBlackList: '',
        hireDateMax: '',
        hireDateMin: '',
        effectiveDateMax: '',
        effectiveDateMin: '',
        personnelGroupCode: '',
        posPositionName: '',
        terminationType: '',
        terminationReason: ''
      },
      checkList: [],
      pickerOptions0: {
        disabledDate: (time) => {
          let endDateVal = this.listParams.hireDateMax
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal)
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          let beginDateVal = this.listParams.hireDateMin
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal)
          }
        }
      },
      pickerOptions2: {
        disabledDate: (time) => {
          let beginDateVal = this.listParams.effectiveDateMax
          if (beginDateVal) {
            return time.getTime() > new Date(beginDateVal)
          }
        }
      },
      pickerOptions3: {
        disabledDate: (time) => {
          let beginDateVal = this.listParams.effectiveDateMin
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal)
          }
        }
      },
      table: {
        columns: [
          { prop: 'employeeCode', label: '工号', width: 100, fixed: 'left' },
          { prop: 'employeeName', label: '姓名', width: 100, fixed: 'left' },
          { prop: 'personnelGroupCode', label: '人事范围编码', width: 140, align: 'center' },
          { prop: 'personnelGroupName', label: '人事范围名称', width: 180 },
          { prop: 'orgPathName', label: '组织全称', width: 300, align: 'center' },
          { prop: 'employeeIdNumber', label: '证件号码', width: 200, align: 'center' },
          { prop: 'hireDate', label: '入职时间', width: 150, align: 'center', display: { date: '' } },
          { prop: 'effectiveDate', label: '离职时间', width: 150, align: 'center', display: { date: '' } },
          { prop: 'orgUnitName', label: '离职前组织', width: 200, align: 'left' },
          { prop: 'posPositionName', label: '离职前职位', width: 200, align: 'left' },
          { prop: 'terminationType', label: '离职类型', display: {dict: 'TERMINATION_TYPE'}, width: 150, align: 'left' },
          { prop: 'terminationReason', label: '离职原因', display: {dict: 'TERMINATION_REASON'}, width: 250, align: 'left' },
          { prop: 'inBlackList', label: '是否已在黑名单', display: {dict: 'WHETHER_TYPE'}, width: 150, align: 'center' }
        ],
        data: null,
        search: null,
        info: null,
        total: 0,
        showPagebar: true,
        setting: {
          editor: {
            terminationReason: {
              type: 'select'
            }
          },
          export: {
            config: {
              fileName: '离职信息',
              sync: {
                page: true,
                select: true,
                all: false
              }
            },
            key: 'empDimissionsExport',
            req: config.getDimissionsList
          },
          operator: [ {
            text: '加入黑名单',
            key: 'empDimissionsInBlackPut',
            func: (row) => {
              this.open(row)
            },
            show (row) {
              if (row.inBlackList === 'Y' || row.inBlackList === null) {
                return {
                  empty: true
                }
              }
            }
          }, {
            text: '撤销黑名单',
            key: 'empDimissionsOutBlackPut',
            func: (row) => {
              this.open(row)
            },
            show (row) {
              if (row.inBlackList === 'N') {
                return {
                  empty: true
                }
              }
            }
          }, {
            text: '查看',
            key: 'empDimissionsBlackListGet',
            func: (row) => {
              this.check(row)
            }
          }]
        }
      },
      table1: {
        columns: [
          { prop: 'creator', label: '操作人', width: 80, align: 'center' },
          { prop: 'oprationType', label: '操作类型', display: {dict: 'TERMINATION_OPERATION_TYPE'}, width: 100, align: 'center' },
          { prop: 'reason', label: '原因', width: 280 },
          { prop: 'createDate', label: '操作时间', width: 150, align: 'center', display: { date: '' } }
        ],
        setting: {
        },
        data: null,
        search: null,
        info: null,
        total: 0
      },
      options: [
        { value: false, label: '否' },
        { value: true, label: '是' }
      ],
      inBlackList: false,
      effectiveTime: '',
      entryTime: '',
      blackList: '',
      dimissionsList: null,
      // thisSelectVal: '',
      thisSelect: [],
      extraParams: {
        hasPower: 'Y'
      },
      personnelProps: {
        value: 'personnelGroupCode',
        label: 'personnelGroupName'
      }
    }
  },
  // created () {
  //   this.getDimissionsList(this.listParams)
  // },
  mounted () {
    this.search()
  },
  methods: {
    check (row) {
      this.dimissionsDialogLoading = true
      req('checkBlackRecord', {empEmployeeId: row.empEmployeeId})
      .then(data => {
        this.checkList = data
        this.isShow = true
        this.dimissionsDialogLoading = false
      })
      .catch(err => console.log(err))
    },
    getDownload (file) {
      return `${uploaderLinks.download}?attachmentId=${file.attachmentId}&ihrAdminAuthorization=${getToken()}`
    },

    getPreviewUrl (file) {
      return `${uploaderLinks.filePreview}/${file.attachmentId}`
    },
    openFilePreviewPage (file) {
      // if (this.isPdf(file.fileName)) {
      //   windowOpen(this.getPreviewUrl(file))
      // } else {
      showMessage('info', '当前不文件预览！请先下载查看！')
      // }
    },
    // isPdf (url) {
    //   return url.match(/pdf/g)
    // },
    download (file) {
      const form = document.createElement('form')

      const formConfig = {
        action: this.getDownload(file),
        method: 'get',
        type: 'hidden'
      }
      Object.entries(formConfig).map(
          ([key, val]) => form.setAttribute(key, val)
        )
      form.submit()
    },

    onFileSuccess (response, file, fileList) {
      this.$message.success('文件上传成功！')
      // console.log('success', response, file, fileList)
      this.signForm.fileList.push(response)
    },
    onFileError (err, file, fileList) {
      console.log('err', err, file, fileList)
    },
    onFileRemove (file, fileList) {
      this.signForm.fileList.map(id => {
        id === file.response && this.signForm.fileList.splice(this.signForm.fileList.indexOf(id), 1)
      })
    },
     // 改变页数页码，获取对应的列表
    handleSizeChange (options) {
      this.getDimissionsList(options)
    },

     // 改变页数页码，获取对应的列表
    handleCurrentChange (options) {
      this.getDimissionsList(options)
    },

    // 表格选中改变
    handleChange (val) {
      this.thisSelect = val
    },

     // 日期选择器改变赋值
    dataChange ($event, param) {
      this.listParams[param] = $event
    },

    // cutDate (val, idx) {
    //   return val.split('').splice(idx, 10).join('')
    // },

     // 获取离职人员列表
    getDimissionsList (listParams) {
      this.dimissionsLoading = true
      req('getDimissionsList', listParams)
      .then(data => {
        Object.keys(data).map(key => (this.table[key] = data[key]))
        this.dimissionsLoading = false
      })
      .catch(err => console.log(err))
    },
    // 操作之前的弹框
    open (row) {
      Object.keys(this.signForm).map(key => {
        this.signForm[key] = key === 'fileList' ? [] : ''
      })
      this.dialogFormVisible = true
      this.title = row.inBlackList === 'N' ? '加入黑名单' : '撤销黑名单'
      this.label = row.inBlackList === 'N' ? '加入黑名单原因' : '撤销黑名单原因'
      this.placeholder = row.inBlackList === 'N' ? '请填写加入黑名单原因(限100字以内)' : '请填写撤销黑名单原因(限100字以内)'
      this.flag = row.inBlackList
      this.signForm.empEmployeeId = row.empEmployeeId + ''
    },

     // 搜索
    search () {
      this.table.search = { ...this.listParams }
    },

     // 重置
    reset () {
      let arr = ['pageIndex', 'pageSize']
      this.props(this.listParams, arr)
    },

    // 重置搜索条件
    props (obj, arr) {
      let props = Object.keys(obj)
      props.forEach((item) => {
        if (!arr || (arr && arr.indexOf(item) === -1)) {
          obj[item] = ''
        }
      })
    },

     // 加入黑名单
    addBlackList () {
      req('addBlackList', this.signForm)
      .then(data => {
        this.$message('加入黑名单成功')
        this.reset()
        let info = {
          pageIndex: this.table.info.pageIndex,
          pageSize: this.table.info.pageSize
        }
        this.getDimissionsList({...info, ...this.listParams})
        this.inBlackList = false
      })
      .catch(err => console.log(err))
      setTimeout(() => {
        this.dialogFormVisible = false
      }, 300)
    },

     // 移除黑名单
    deleteList () {
      req('deleteBlackList', this.signForm)
      .then(data => {
        this.$message('删除黑名单成功')
        this.reset()
        let info = {
          pageIndex: this.table.info.pageIndex,
          pageSize: this.table.info.pageSize
        }
        this.getDimissionsList({...info, ...this.listParams})
        this.inBlackList = false
      })
      .catch(err => console.log(err))
      this.dialogFormVisible = false
    }
  }
}
</script>
<style lang="scss">
  .pers-dimission {
    .uploader .el-upload-list .el-upload-list__item {
      width: 40% !important;
    }
  }
</style>

<style lang="scss" scoped>
  .pers-dimission {
    .header {
      margin-bottom: -60px;
    }
  }
  .elTextarea{
      display: flex;
      width: 800px;
  }
  .el-upload{
      display: block !important;
      height: 180px !important;
  }
  .el-textarea{
     display: block !important;
  }
  .el-form-item__content{
    position: relative;
    .textarea{
      position: absolute;
      top: 0;
      left: 0;
      width: 500px;
    }
  }

   .uploaderForm {
      display: flex;
      width: 800px;
    }
    .el-upload-dragger{
      margin-right: 50px !important;
    }
   .file-preview {
    line-height: 34px;
  }
  .file-item {
    padding: 0 20px;
  }
  .icon {
    transition: 0.3s;
    color: #3da5fe;
  }
  // .uploader .el-upload-list .el-upload-list__item {
  //   width: 40% !important;
  // }
</style>
