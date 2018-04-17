<template>
  <section class="gallery-card card" v-if="gallery">
    <el-carousel>
      <el-carousel-item
        v-for="(item, index) of gallery"
        :key="index"
        :style="{ background: `url(${item.url}) center center / cover no-repeat #fff` }"
        class="gallery-item"
      >
        <!-- <h3>{{ item.desc }}</h3> -->
      </el-carousel-item>
    </el-carousel>
  </section>
</template>

<script>
export default {
  props: ['gallery']
}
</script>

<style lang="scss" scoped>
$gallery-card-width: 826px;
$gallery-card-height: 389px;

.gallery-card {
  width: $gallery-card-width;
  height: $gallery-card-height;
}

.el-carousel__item {
  overflow: hidden;
  width: 100%;
  height: $gallery-card-height;
}

.gallery-item {
  background-size: cover;
  overflow: hidden;
  font-size: 24px;
  color: #FFFFFF;
  h3 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

// .el-carousel__item:nth-child(2n) {
//   background-color: #99a9bf;
// }

// .el-carousel__item:nth-child(2n+1) {
//   background-color: #d3dce6;
// }
.el-carousel {
  overflow: hidden;
}
</style>
