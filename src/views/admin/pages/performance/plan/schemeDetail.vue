<template>
  <main>
    <section class="performance-info">
      <div class="info-item">
        <span class="label">方案名称:</span> <span class="value">{{initData.name}}</span>
      </div>
      <div class="info-item">
        <span class="label">绩效等级:</span> <span class="value">{{initData.levelName}}</span>
      </div>
      <div class="info-item">
        <span class="label">绩效模板:</span> <span class="value">{{initData.templateName}}</span>
      </div>
    </section>

    <section class="content">
      <el-table :data="initData.kpis" border height="200">
        <el-table-column label="KPI指标" align="center" height="200">
          <el-table-column label="指标名称" prop="indicatorName"></el-table-column>
          <el-table-column label="评估类型" prop="indicatorType"></el-table-column>
          <el-table-column label="评估方法" prop="evaluationMethod"></el-table-column>
          <el-table-column label="指标权重" prop="weight"></el-table-column>
        </el-table-column>
      </el-table>

      <el-table :data="initData.keyWorks" class="key-work-table" border height="200">
        <el-table-column label="重点工作" align="center">
          <el-table-column label="重点工作项目" prop="keyWorkName"></el-table-column>
          <el-table-column label="达成目标" prop="target"></el-table-column>
          <el-table-column label="权重" prop="weight"></el-table-column>
        </el-table-column>
      </el-table>
    </section>

    <section class="description">
      <div class="description-item">
        <span class="label">试用范围:</span><span class="value">{{initData.orgName}}</span>
      </div>
      <div class="description-item">
        <span class="label">方案年度:</span><span class="value">{{initData.year}}</span>
      </div>
      <div class="description-item">
        <span class="description-label">描述:</span><p class="description-value">{{initData.description}}</p>
      </div>
    </section>
  </main>
</template>
<script>
export default {
  name: 'schemeDetail',
  props: {
    initData: {
      type: Object,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
  main {
    .info-item,.description-item {
      margin-bottom: 10px;
    }
    .content {
      margin-top: 10px;
    }
    .key-work-table {
      margin-top: 20px;
    }
    .description {
      margin-top: 20px;
      .value {
        margin-left: 5px;
      }
    }
    .description-label {
      width: 8%;
      vertical-align: top;
    }
    .description-value {
      display: inline-block;
      vertical-align: top;
      margin-left: 5px;
      width: 92%
    }
  }
</style>
