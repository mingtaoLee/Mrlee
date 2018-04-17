<template>
  <i-layout>
    <!-- <el-button type="primary" @click="openDialog" >打开弹窗</el-button> -->
      <div slot="section" class="tion">
        <div id="header">
          <i-form @search="search">
            <el-form-item label="姓名：">
              <el-input v-model="searchParam.empName"></el-input>
            </el-form-item>
            <el-form-item label="工号：">
              <el-input v-model="searchParam.employeeCode"></el-input>
            </el-form-item>
          </i-form>
          <el-button @click="exportEmps" id="exportCrew">导出</el-button>
          <!-- <div class="exportHight">
            <span class="exportCrew" @click="exportEmps"> 导出</span>
          </div> -->
        </div>
        <ul>
          <li
            v-for="(item,index)  in personnel"
            :key="index"
            class="li"
            >
            <div class="number">
              <span v-text="index + 1"></span>
            </div>
            <div class="avatarIcon">
              <avatar v-if="item.photoPath" :gender="item.gender" :url="`${$$.BASE_URL}/system/attachments/image/${item.photoPath}`"></avatar>
              <avatar v-else :gender="item.gender"></avatar>
              <!-- <avatar :gender="item.gender"></avatar> -->
            </div>
            <div class="right">
              <p>{{item.posPositionName}}<span>（{{getEmp(item.employeeStatus)}}）</span></p>
              <p class="second">
                <span v-if="item.fullName" v-text="item.fullName"></span>
                <span v-else>&nbsp;</span>
                <span v-if="item.employeeAge" v-text="item.employeeAge + '岁'"></span>
                <span v-else>&nbsp;</span>
                <span v-if="item.employeeCode" v-text="'工号'+item.employeeCode"></span>
                <span v-else>&nbsp;</span>
                <span v-if="item.hireDate !== 'Invalid date'" v-text="'入职'+item.hireDate"></span>
                <span v-else>&nbsp;</span>
                <span><i class="iconfont icon-phonenumber"></i> {{item.mobile}}</span>
                <span><i class="iconfont icon-email"></i> {{item.email}}</span>
              </p>
            </div>
            </li>
        </ul>
        <i-dialog
          v-model="exportVisible"
          :toolbar="exportToolbar"
          :title="'导出'"
          size="small">
          <i-table-export-excel
            ref="export"
            :range="false"
            :setting="exportSetting"
            :tables="{
              elTable,
              iTable: {
                display,
                table
              }
            }"
          />
        </i-dialog>
      </div>
  </i-layout>
</template>
<script>
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import req, { config } from 'api/self/my-team'
  import Avatar from 'views/self/pages/my-team/components/avatar'
  import { globalComponentVariable } from 'config/globalComponentVariable'
  import { getSelectData } from 'utils/index.js'
  import ITableExportExcel from 'components/common/i-table/export-excel'
  import moment from 'moment'

  export default {
    name: 'talent-detail',
    components: {
      IDialog,
      ITableExportExcel,
      Avatar
    },

    // 接收的数据
    props: {
      transmission: Object,
      personnel: Object,
      headParameters: Boolean
    },
    data () {
      return {
        searchParam: {
          empName: '',
          employeeCode: ''
        },
        ReceiveParam: {},
        fullName: '',
        iconStyle: `width: 15px; position: absolute; top: -36px;right: -4px;`,
        // isShowDialog: false,
        // personnel: [],
        employeesIdArr: [],
        exportVisible: false,
        isExport: false,
        exportToolbar: [{
          text: '取消',
          type: 'default',
          func: done => done()
        }, {
          text: '确定',
          func: done => {
            this.$refs.export && this.$refs.export.submit()
            done()
          }
        }],
        exportSetting: {
          req: config.getMyTeamLists,
          config: {
            range: 'all'
          }
        },
        elTable: {
          columns: [
            {
              property: 'fullName',
              label: '员工姓名',
              align: 'center'
            },
            {
              property: 'employeeAge',
              label: '员工年龄',
              align: 'center'
            },
            {
              property: 'gender',
              label: '性别',
              align: 'center',
              formatter: true
            },
            {
              property: 'employeeCode',
              label: '工号',
              align: 'center'
            },
            {
              property: 'hireDate',
              label: '入职时间',
              align: 'center',
              display: {date: 'yyyy-MM-dd'},
              formatter: true
            },
            {
              property: 'mobile',
              label: '电话',
              align: 'center'
            },
            {
              property: 'email',
              label: '员工邮箱',
              align: 'center'
            }
          ],
          store: {
            states: {}
          }
        },
        display: {
          dateList: {
            hireDate: 'yyyy-MM-dd'
          },
          dictList: {
            gender: {
              'M': '男',
              'F': '女'
            }
          }
        }
      }
    },
    watch: {
      transmission: (newv, old) => {
        this.transmission = newv
        // console.log(2222, newv)
        // this.fetch()
      },
      headParameters: function (newv) {
        if (newv) {
          this.searchParam.empName = ''
          this.searchParam.employeeCode = ''
        }
      }
      // personnel: (newVlue) => {
        // this.personnel = newVlue
        // console.log('personnel', this.personnel)
      // },
      // showPop: (newVlue) => {
      //   this.personnel = newVlue
      //   console.log(this.personnel)
      // }
    },
    created () {
      // 用工类型字典
      let empUrl = globalComponentVariable.iSelect['dict'].url('EMPLOYEE_STATUS')
      let empIsCache = globalComponentVariable.iSelect['dict'].isCache
      // 获取用工类型字典
      getSelectData(empUrl, empIsCache).then(res => {
        this.empList = res
      })
    },
    computed: {
      avatarUrl () {
        return `background-image: url(${this.url})`
      },
      table () {
        if (this.isExport) {
          return {
            search: {
              ...this.transmission,
              ...this.searchParam
            }
          }
        } else {
          return {
            search: {
              ...this.transmission
            }
          }
        }
      }
    },
    methods: {
      fetch (options = {}) {
        req('getMyTeamList', options = { ...this.transmission, ...this.searchParam }).then(res => {
          // this.personnel = res
          this.$emit('update:personnel', res)
          res.map(item => {
            item.hireDate = moment(item.hireDate).format('LL')
          })
        })
      },
    //  导出
      exportEmps () {
        this.exportVisible = true
      },
      // 查询
      search () {
        this.isExport = true
        this.fetch()
      },
      reset () {
        for (let key in this.searchParam) {
          this.searchParam[key] = ''
        }
      },
      isShow: () => {
        console.log(666)
        this.$emit('show-pop', false)
      },
      /**
       * @param {String} value: 用工类型value
       * @return {String} 对应用工类型的value的label值
       */
      getEmp (value) {
        var list = this.empList
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].value === value) {
            return list[i].label
          }
        }
        return null
      }
    }
  }
</script>
<style>
  .li {
    position: relative;
    height: 74px;
    padding: 15px 15px 0 15px
  }
  .li:nth-of-type(2n){
    background-color: #F8F8F8 
  }
  .second>span {
    display: inline-block;
    margin-right: 10px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .second>span:nth-of-type(1){
    width: 42px
  }
  .second>span:nth-of-type(2){
    width: 30px
  }
  .second>span:nth-of-type(3){
    width: 92px
  }
  .second>span:nth-of-type(4){
    width: 133px
  }
  .second>span:nth-of-type(5){
    width: 140px
  }
  .second>span:nth-of-type(6) {
    margin-right: -10px;
    width: 216px
  }
  #exportCrew {
    /* margin-left: 48px;
    margin-top: 7px; */
    position: absolute;
    right: 77px;
    top: 6px;
    width: 18;
    height: 28px;
    line-height: 9px
  }
  .exportHight {
    height: 10px;
    padding: 12px;
  }
  .avatarIcon {
    width: 42px;
    height: 42px;
    margin-left: 40px;
  }
  .right {
    position: absolute;
    left: 105px;
    top: 15px
  }
  #header {
    position: fixed;
    z-index: 256;
    width: 878px;
    margin-top: -47px;
    margin-left: -23px;
  }
  .tion {
    padding-top:20px
  }
  ul {
    margin-top: -5px;
  }
  .number {
    position: absolute;
    top: 20px;
  }
</style>
