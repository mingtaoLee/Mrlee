<template>
  <div class="hello">
    <el-button type="primary" @click="toAction">this.$emit()</el-button>
    <el-button type="primary" @click="propsFatherFunc">propsFunction</el-button>
    <p> this is p tag</p>
    <main>
      <slot
      :dataList="dataList">
        <h1>slot插槽</h1>
      </slot> 
      <slot name="demo2">
        
      </slot>
    </main>
    <p>插槽高级用法</p>
    <div class="child">
    <!-- // 具名插槽 -->
    <slot name="up"></slot>
    <h3>这里是子组件</h3>
    <!-- // 具名插槽 -->
    <slot name="down"></slot>
    <!-- // 匿名插槽 -->
    <slot></slot>
  </div>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
     	dataList: [
	      	{
	      		lable:'name',
	      		value: '张三'
	      	},
	      	{
	      		lable:'name',
	      		value: '李四'
	      	},
	      	{
	      		lable:'name',
	      		value: '王五'
	      	},
	      	{
	      		lable:'name',
	      		value: '小二'
	      	}
      	]
    }
  },
  props:{
    propsFatherFunc:{
      type:Function,
      default () {
        return () => {}
      }
    }
  },
  methods:{
   toAction(){
    //子组件this.$emit 触发
    this.$emit('pageActionz')
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
.hello{
  border: 1px solid red
}
</style>
