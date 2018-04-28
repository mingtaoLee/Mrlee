<template>
  <div id="home">
    <h1>删除</h1>
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
  </div>
</template>

<script>
export default {
  name: 'home',
  data(){
    return {
      formLabelAlign: {
        name:'Limingtao',
        region:'广东',
        type: '自由活动'
      },
      changeValList: ['普陀','沙江','金沙'],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎3',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎3',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎3',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎3',
        address: '上海市普陀区金沙江路 1516 弄'
      }] 
    }
  },
  computed: {
    fullName: {
          // getter
      // return this.formLabelAlign.name + ' ' + this.formLabelAlign.type
      get: function () {
        return this.formLabelAlign.name + ' ' + this.formLabelAlign.type
      },
    }    
  },
  created(){
    console.log(666,'666')
  },
  methods:{
   changeVal () {
    let index = this.changeValList.length - 1
    // this.changeValList.splice(index, 1)
    // this.changeValList[0] = 'Lee'
    // this.$set(this.changeValList, index, 'limingtao');
    console.log(this.changeValList)
    this.formLabelAlign.age =  80
    delete this.formLabelAlign.name
    console.log(this.formLabelAlign)
   }
  }
}
</script>

<style>

</style>
