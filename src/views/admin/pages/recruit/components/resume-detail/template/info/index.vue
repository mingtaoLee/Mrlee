<template>
  <div>
    <section class="content-follow">
      <h2 class="info-title">{{title}}</h2>

      <template v-if="data && data.length">
        <!-- 基本信息 -->
        <el-form class="form-main clearfix">
          <el-row>
            <el-col
              span="6"
              v-for="item in data"
              :key="item">
              <el-form-item :label="item.label + ':'">
                <info-item :item="item"></info-item>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

       <template v-else>
         <div class="no-data">暂无数据</div>
       </template>
    </section>
  </div>
</template>
<script>
/**
 * @prop title 标题
 * @prop data 数据
 */
import InfoItem from '../item'
export default {
  name: 'InfoTemplate',
  components: {
    InfoItem
  },
  props: {
    data: Array,
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.no-data {
  display: block;
  margin: 20px auto;
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #5a5e66;
}
</style>
