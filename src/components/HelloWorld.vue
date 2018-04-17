<template>
  <div class="hello">
    <h3 ref="getDom">vue钩子函数el</h3>
    <el-table
      :data="tableData"
      :stripe="true"
      :border="true"
      header-align="center"
      align="center"
      style="width: 100%">
      <el-table-column type="selection"></el-table-column>
      <!-- <el-table-column
        prop="date"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column> -->
      <el-table-column
        v-for="(col,index) in tableColums"
        :key="index"
        :prop="col.prop"
        :label="col.label">
      </el-table-column>
      <el-table-column  label="操作" fixed="right" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="endStore(scope.row)">结束</el-button>
          <el-button type="text" size="small" @click="deleteStore(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 父组件绑定子组件触发的事件 -->
    <page @pageActionz="action" :propsFatherFunc="propsFatherFunc">
      <template slot="demo2">
        <h3>这是插槽标题</h3>
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
    </page>
    <ul>
      <li>{{formData.name}}</li>
      <li>{{formData.age}}</li>
      <li @click="addVal">sfsf</li>
    </ul>
    <el-button @click="goToPage">跳到admin页面</el-button>
    <div class="tmpl" slot="up">
        <span>菜单1</span>
        <span>菜单2</span>
        <span>菜单3</span>
        <span>菜单4</span>
        <span>菜单5</span>
        <span>菜单6</span>
      </div>
      <div class="tmpl" slot="down">
        <span>菜单-1</span>
        <span>菜单-2</span>
        <span>菜单-3</span>
        <span>菜单-4</span>
        <span>菜单-5</span>
        <span>菜单-6</span>
      </div>
      <div class="tmpl">
        <span>菜单->1</span>
        <span>菜单->2</span>
        <span>菜单->3</span>
        <span>菜单->4</span>
        <span>菜单->5</span>
        <span>菜单->6</span>
      </div>
  </div>
</template>

<script>
import tableColumsList from '@/tableColums/colums.js'
import page from './demo'

export default {
  name: 'HelloWorld',
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        age:98
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        age:65
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        age:54
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        age:34
      }],
      tableColums:[
        // {
        //   prop:"date",
        //   label:"日期"
        // },
        // {
        //   prop:"name",
        //   label:"姓名"
        // },
        // {
        //   prop:"address",
        //   label:"地址"
        // },
        // {
        //   prop:"age",
        //   label:"年龄"
        // }
      ],
      formData:{
        name:'张三'
      }
    }
  },
  components:{
    page
  },
  created () {
    debugger
    
    let getElement = document.getElementById('getDom')
  },
  mounted(){
    this.init()
  },
  created(){
      console.log(this.scope)
  },
  methods:{
    goToPage(){
      this.$router.push('/admin')
    },
    endStore(val){
      console.log(val)
    },
    deleteStore(val){
      console.log(val)
    },
    init(){
      localStorage.dataList=this.tableData
      // console.log(localStorage.lastname)
      this.tableColums = tableColumsList.colums.filter(item =>{
        if(item.isRead){
          return item
        }
      })
    },
    action(){
      debugger
      console.log(localStorage.dataList)
      this.$message.error("this.$emit()执行父组件函数成功！")
    },
    propsFatherFunc(){
      this.$message.warning("prop执行父组件函数成功！")
    },
    addVal(){
      Object.assign(this.formData, {name: '李四'})
      // this.formData.age = 45
      // this.formData.name = '李四'
      console.log(this.formData)
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
