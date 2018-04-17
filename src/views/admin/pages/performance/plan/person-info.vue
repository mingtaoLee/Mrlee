<template>
  <section>
    <div class="person-info-item">
      <span class="label">姓名:</span><span class="value">{{initData.employeeName}}</span>
    </div>
    <div class="person-info-item">
      <span class="label">工号:</span><span class="value">{{initData.employeeCode}}</span>
    </div>
    <div class="person-info-item">
      <span class="label">部门:</span><span class="value">{{initData.orgName}}</span>
    </div>
    <div class="person-info-item">
      <span class="label">职位:</span><span class="value">{{initData.position}}</span>
    </div>
    <div class="person-info-item">
      <span class="label">手机:</span><span class="value">{{initData.phone}}</span>
    </div>
    <div class="person-info-item">
      <span class="label">邮箱:</span><span class="value">{{initData.email}}</span>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    name: 'person-info',
    initData: {}
  }
}
</script>
<style lang="scss" scoped>
.person-info-item {
  text-align: left;
  margin-bottom: 10px;
  .label {
    margin-right: 5px;
    font-size: 12px;
  }
  .value {
    font-size: 14px;
  }
}
</style>
