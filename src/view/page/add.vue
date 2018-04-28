<template>
  <div id="home">
    <h1 @click="checkVal">新增</h1>
    <template>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </template>
    <template>
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="日期"
          width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection(1)">切换第二、第三行的选中状态</el-button>
        <el-button @click="toggleSelection(0)">取消选择</el-button>
        <el-button @click="setCurrentRow">状态</el-button>
      </div>
    </template>
    <el-button type="primary" @click="deleteDom">删除节点</el-button>
    <p v-if="showStatus">{{totalMoney}}</p>
    <h1>{{totalMoney}}</h1>
  </div>
</template>

<script>
import { Personel } from '../utils/base.js'
export default {
  name: 'home',
  data(){
    return {
      basePrice: 100,
      showStatus:false,
      arr:[2,3,1,4,6,8,9,7],
      formLabelAlign: {
        name:'Limingtao',
        region:'广东',
        type: '自由活动'
      },
      changeValList: ['普陀','沙江','金沙'],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎1',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎1',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎1',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎1',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection:[]
    }
  },
  computed: {
    totalMoney: {
      get: function () {
        console.log('go fn')
        return this.basePrice * 2 + 1
      },
      set: function (newVal) {
        console.log(newVal)
        return ''
      }
    },
    copyArr () {
      return [...this.arr]
    },
    fullName: {
          // getter
      // return this.formLabelAlign.name + ' ' + this.formLabelAlign.type
      get: function () {
        return this.formLabelAlign.name + ' ' + this.formLabelAlign.type
      },
    }    
  },
  methods:{
    setCurrentRow () {
      debugger
      let rows = [this.tableData3[1], this.tableData3[2]]
      this.$refs.multipleTable.setCurrentRow(rows);
    },
    toggleSelection(val) {
      let rows = [this.tableData3[1], this.tableData3[2]]
      let status = false
      if (val) {
        status = true
      } else {
        status = false
      }
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row,status);
      });
      console.log(this.$refs.multipleTable)
    },
    // toggleSelections() {
    //   this.$refs.multipleTable.clearSelection();
    // },
    deleteDom () {
      this.showStatus = !this.showStatus
    },
    changeVal () {
      let index = this.changeValList.length - 1
      // this.changeValList.splice(index, 1)
      // this.changeValList[0] = 'Lee'
      // this.$set(this.changeValList, index, 'limingtao');
      console.log(this.changeValList)
      this.formLabelAlign.age =  80
      delete this.formLabelAlign.name
      console.log(this.formLabelAlign)
    },
    checkVal () {
      debugger
      let curentIndex = new Personel()
      let arr = [2,3,1,4,6,8,9,7]
      let newVal = curentIndex.deleteRepeatNumber(arr)
      console.log(this.copyArr)
    }
  }
}
</script>

<style>

</style>
