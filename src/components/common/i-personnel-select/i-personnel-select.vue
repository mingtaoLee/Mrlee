<template>
  <i-dialog
  ref="dialog"
  id="personnelSelect"
  v-model="isDialogShow"
  destroyed-when-close
  :title="title"
  size="large"
  :modal="modal"
  :before-close="beforeClose"
  :toolbar="toolbar"
  >
    <div class="personnel-container clearFix">
      <div class="department">
        <div class="department-header">
          <i class="sortfont icon-sort-mulu"></i>
          <span class="department-header-title">选择部门</span>
        </div>
        <div class="department-content">
          <i-tree
            ref="departmentTree"
            dataKey="org"
            :hasGrant="hasGrant"
            :nodeKey="nodeKey"
            :props="defaultProps"
            :defaultExpandedKeys="defaultExpandedKeys"
            @node-click="handleNodeClick"
            @loaded="handleTreeLoaded"
          ></i-tree>
        </div>
      </div>
      <div class="personnel">
        <div class="personnel-search clearFix">
          <el-input
            placeholder="请输入员工姓名或工号"
            prefix-icon="el-icon-search"
            v-model="searchName"
            @keyup.native.enter="handleSearchClick"
            :autofocus="true"
          >
          </el-input>
          <el-button type="primary" @click="handleSearchClick">搜索</el-button>
        </div>

        <div class="personnel-content clearFix">
          <div class="personnel-content__left">
            <header class="personnel-content-title">待选列表</header>
            <ul class="personnel-content__left-list">
              <!-- <el-tooltip class="item" effect="dark" :content="fullName" placement="top-start"> -->
                <li class="personnel-content_left-list-item"
                    v-for="(item) of leftItems" :key="item.employeeId"
                    :class="{'clickActive': item.isActive === 'Y'}"
                    @click.stop.prevent="handleItemClick($event, item, 'left')">
                    <span>{{item.employeeName}}</span>
                    <span  v-if="showStatus" :style="{float:'right',paddingRight:'10px'}">{{findDictLabel(employeeDict,item.employeeStatus)}}</span>
                    <span :style="{float:'right',paddingRight:'10px'}">{{item.employeeCode}}</span>
                </li>
              <!-- </el-tooltip> -->
            </ul>
          </div>
          <div class="personnel-content__center">
            <ul class="personnel-content__center-wrap">
              <li class="personnel-content__button-wrap">
                <el-button type="primary" class="personnel-content__center-button" @click="handleItems('add')">添加</el-button>
              </li>
              <li class="personnel-content__button-wrap">
                <el-button type="danger" class="personnel-content__center-button" @click="handleItems('delete')">删除</el-button>
              </li>
              <template v-if="multiple">
                <li class="personnel-content__button-wrap">
                  <el-button type="primary" class="personnel-content__center-button" @click="handleAllItems('add')">全部添加</el-button>
                </li>
                <li class="personnel-content__button-wrap">
                  <el-button type="danger" class="personnel-content__center-button" @click="handleAllItems('delete')">全部删除</el-button>
                </li>
              </template>
              <!--<li class="personnel-content__button-wrap">-->
              <!--<el-button :plain="true" class="personnel-content__center-button"-->
              <!--@click="handleItemMove('up')">上移-->
              <!--</el-button>-->
              <!--</li>-->
              <!--<li class="personnel-content__button-wrap">-->
              <!--<el-button :plain="true" class="personnel-content__center-button"-->
              <!--@click="handleItemMove('down')">下移-->
              <!--</el-button>-->
              <!--</li>-->
            </ul>
          </div>
          <div class="personnel-content__right">
            <header class="personnel-content-title">已选列表</header>
            <ul class="personnel-content__right-list">
              <!-- <el-tooltip class="item" effect="dark" :content="fullName" placement="top-start" > -->
                <li
                    v-for="(item,index) of rightItems" :key="index"
                    class="personnel-content_right-list-item"
                    :class="{'clickActive': item.isActive === 'Y'}"
                    @click.stop.prevent="handleItemClick($event, item, 'right')"
                >
                    <span>{{item.employeeName}}</span>
                    <span v-if="showStatus" :style="{float:'right',paddingRight:'10px'}">{{findDictLabel(employeeDict,item.employeeStatus)}}</span>
                    <span :style="{float:'right',paddingRight:'10px'}">{{item.employeeCode}}</span>
                </li>
              <!-- </el-tooltip> -->
            </ul>
          </div>
        </div>
        <div class="personnel-detail">人员详情：
          <el-tooltip   effect="dark" :content="fullName" placement="top-start">
            <span>{{fullName}}</span>
          </el-tooltip>
        </div>
        <div  class="personnel-usual">常选人员：
          <!-- <el-tooltip   effect="dark" :content="fullName" placement="top-start"> -->
            <span
            v-for="item in usualNameList" :key="item.employeeId" class="personnel-usual-name"
            @click.stop.prevent="handleItemClick($event, item, 'left', true)"
            >{{item.employeeName}}</span>
          <!-- </el-tooltip> -->
        </div>

        <!-- <div class="personnel-detail">{{fullName}}</div> -->
      </div>
    </div>
  </i-dialog>
  <!-- </el-dialog> -->
</template>
<script src="./i-personnel-select.js"></script>
<style lang="sass">@import "./i-personnel-select.scss"</style>
