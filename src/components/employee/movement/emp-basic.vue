<template>
  <section class="emp-move-basic content-follow">
    <h2 class="info-title">基本信息</h2>

    <el-form :model="transferInfo" label-width="120px" class="form-main clearfix" :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item label="调动人员" prop="fullName" v-if="showMap.fullName" class="box">
            <el-input  class="input-box" v-model="transferInfo.fullName" :disabled="disabledMap.fullName || !isFlowCenter" readonly>
                <i v-if="!disabledMap.fullName" slot="suffix" class="el-icon-menu" @click="handleIconClick" ></i>                                                
            </el-input>
           <i-show-personnelInfo 
              :id="transferInfo.empEmployeeId || empEmployeeId" 
              class="btn" 
              v-show="transferInfo.fullName"
          ></i-show-personnelInfo> 
            <i-personnel-select
            :isShow.sync="isShow"
            @confirm="handleConfirm"
            :multiple="false"
            :hasGrant="false"
            ></i-personnel-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工号" prop="employeeCode" v-if="showMap.employeeCode">
            <el-input v-model="transferInfo.employeeCode" :disabled="disabledMap.employeeCode && true" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入职日期" prop="hireDate" v-if="showMap.hireDate">
            <el-date-picker
              type="date"
              v-model="transferInfo.hireDate"
              style="width: 100%;"
              :disabled="disabledMap.hireDate"
              @change="getHireDate"
              placeholder=""
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="调动类型" prop="transferType" class="col-135"  v-if="showMap.transferType">
            <i-select v-model="transferInfo.transferType" parameter='TRANSFER_TYPE' :disabled="disabledMap.transferType">
            </i-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="调动日期" prop="transferDate" v-if="showMap.transferDate">
            <el-date-picker
              type="month"
              :disabled="disabledMap.transferDate"
              v-model="transferInfo.transferDate"
              style="width: 100%;"
              @change="getSTime"
              :picker-options="endOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="调动原因" prop="transferReason" v-if="showMap.transferReason && transferInfo.transferType !== '3'">
             <el-select v-model="transferInfo.transferReason" :disabled="disabledMap.transferReason" clearable>
                <el-option
                  v-for="item in transferInfo.transferReasonList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button @click="recordPrint" type="primary" v-if="showMap.transferPrint">履历表打印</el-button>
        </el-col>
        
      </el-row>

      <!-- 表单头部 -->
      <el-row class="mb10 form-content">
        <el-col :span="11" :offset="2">
          <div class="moveTitle bold">调动前</div>
        </el-col>
        <el-col :span="11">
          <div class="moveTitle bold">调动后</div>
        </el-col>
      </el-row>

        <!--  表单内容 -->
      <el-row :gutter="12">
        <!-- 左边label部分 -->
        <el-col :span="2" >
          <div class="move-label" v-for="(item, index) in labelList" :key="index" v-if="showMap[item.key[0]] || showMap[item.key[1]]">{{item.label}}</div>
          <!-- <div class="move-label" v-if="showMap.newSuretyName1">联保人1</div> -->
          <!-- <div class="move-label" v-if="showMap.newSuretyName2">联保人2</div> -->
        </el-col>
        <!-- 中间显示部分 -->
        <el-col :span="11">
          <div class="card">
            <div class="before-box" v-if="showMap.oldCompanyName || showMap.newCompanyName">
              <!-- TODO:公司名称 -->
              <el-input v-model="transferInfo.oldCompanyName" disabled placeholder="" v-if="showMap.oldCompanyName"></el-input>
              <el-input disabled placeholder="" v-else></el-input>
            </div>
            <div class="before-box" v-if="showMap.oldPersonnelGroupCode || showMap.newPersonnelGroupCode">
              <el-input v-model="transferInfo.oldPersonnelGroupName" disabled placeholder="" v-if="showMap.oldPersonnelGroupCode"></el-input>
              <el-input disabled placeholder="" v-else></el-input>
              
            </el-select>
            </div>
            <div class="before-box" v-if="showMap.oldOrgUnitId || showMap.newOrgUnitId">
              <el-input v-model="transferInfo.oldOrgUnitName" disabled placeholder="" v-if="showMap.oldOrgUnitId"></el-input>
              <el-input disabled placeholder="" v-else></el-input>
              
            </div>
            <div class="before-box" v-if="showMap.oldPosPositionId || showMap.newPosPositionId">
              <el-input v-model="transferInfo.oldPosPositionName" disabled placeholder=""  v-if="showMap.oldPosPositionId"></el-input>
              <el-input disabled placeholder="" v-else></el-input>
                            
            </div>
            <!-- 职务-->
            <div class="before-box" v-if="showMap.oldPosTitleName || showMap.newPosTitleName">
                <el-input v-model="transferInfo.oldPosTitleName" disabled placeholder="" v-if="showMap.oldPosTitleName"/>
              <el-input disabled placeholder="" v-else></el-input>
                
            </div>
            <div class="before-box" v-if="showMap.oldEmployeeType || showMap.newEmployeeType">
                <i-select v-model="transferInfo.oldEmployeeType" parameter="EMPLOYEE_TYPE" disabled placeholder="" v-if="showMap.oldEmployeeType"/>
              <el-input disabled placeholder="" v-else></el-input>
            </div>
            <div class="before-box" v-if="showMap.oldPayGroupId || showMap.newPayGroupId">
               <el-input v-model="transferInfo.oldPayGroupName" dataKey="salaryGroup" :props="groupProps" disabled placeholder="" v-if="showMap.oldPayGroupId"></el-input>
              <el-input disabled placeholder="" v-else></el-input>
               
            </div>
            <div class="before-box" v-if="showMap.oldWorkSystem || showMap.newWorkSystem">
                <i-select v-model="transferInfo.oldWorkSystem" parameter='WORK_SYSTEM' disabled placeholder="" v-if="showMap.oldWorkSystem"/>
                <el-input disabled placeholder="" v-else></el-input>
                
            </div>
            <div class="before-box" v-if="showMap.oldSalary || showMap.newSalary">
                <el-input v-model="transferInfo.oldSalary" class="input-with-select selectedgroud" disabled size="mini" placeholder="" v-if="showMap.oldSalary"> 
                 <el-select v-model="transferInfo.oldSalaryType" slot="append" disabled>
                  <el-option label="元/时" value="2"></el-option>
                  <el-option label="元/月" value="1"></el-option>
                 </el-select>
               </el-input>
               <el-input disabled placeholder="" v-else></el-input>
               
            </div>

               <div class="before-box" v-if="showMap.oldIsAgingFloat || showMap.newIsAgingFloat">
                <i-select v-model="transferInfo.oldIsAgingFloat" parameter='WHETHER_TYPE' disabled placeholder="" v-if="showMap.oldIsAgingFloat"/>
                <el-input disabled placeholder="" v-else></el-input>
                
            </div>
            <div class="before-box box2" v-if="showMap.oldSuretyName1 || showMap.newSuretyName1">
              <el-input  class="input-box2" v-model="transferInfo.oldSuretyName1" disabled placeholder="" v-if="showMap.oldSuretyName1"></el-input>
              <el-input disabled placeholder="" v-else></el-input>
              
                <i-show-personnelInfo 
                  :id="transferInfo.oldSurety1" 
                  class="btn2" 
                  v-if="transferInfo.oldSuretyName1"
                ></i-show-personnelInfo> 
            </div>
            <div class="before-box box2" v-if="showMap.oldSuretyName2 || showMap.newSuretyName2">
              <el-input class="input-box2" v-model="transferInfo.oldSuretyName2" disabled placeholder="" v-if="showMap.oldSuretyName2"></el-input>
              <el-input disabled placeholder="" v-else></el-input>
              
              <i-show-personnelInfo 
                :id="transferInfo.oldSurety2" 
                class="btn2" 
                v-if="transferInfo.oldSuretyName2"
            ></i-show-personnelInfo> 
            </div>
          </div>
        </el-col>
        <!-- 右边填写调动信息部分 -->
        <el-col :span="11">
          <div class="card">
            <el-form :model="transferInfo" class="form-content" :rules="rules">
              <el-row v-if="showMap.newCompanyName || showMap.oldCompanyName">
                <el-col :span="10">
                  <el-form-item label="" :prop="showMap.newCompanyName ? 'newCompanyName' : ''">
                    <el-input v-model="transferInfo.newCompanyName" :disabled="disabledMap.newCompanyName" placeholder="" v-if="showMap.newCompanyName"></el-input>
                    <el-input disabled placeholder="" v-else></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="showMap.newPersonnelGroupCode || showMap.oldPersonnelGroupCode">
                <el-col :span="10">
                  <el-form-item :class="{showStart:showMap.newPersonnelGroupCode}" :prop="showMap.newPersonnelGroupCode?'newPersonnelGroupCode' : ''">
                    <remote-select
                      v-if="showMap.newPersonnelGroupCode"
                      v-model="transferInfo.newPersonnelGroupCode"
                      dataKey="personnelGroup"
                      :props="personnelProps"
                      :disabled="disabledMap.newPersonnelGroupCode"
                      :displayKeys="personnelGroupLabel"
                      @option-click="selectefPersonnelGroup"
                      @change="changePersonnelGrop"                      
                      :defaultOptions="defaultPersonnelGroupLabel"
                      :extraParams="params"
                      ></remote-select>
                    <el-input disabled placeholder="" v-else></el-input>
                      
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 组织选择 -->
              <el-row v-if="showMap.newOrgUnitId || showMap.oldOrgUnitId">
                <el-col :span="10">
                  <el-form-item :prop="showMap.newOrgUnitId ? 'newOrgUnitId' : ''" :class="{showStart: showMap.newOrgUnitId}" >
                    <!-- TODO:选择树重写 -->
                    <i-select-tree
                      v-if="showMap.newOrgUnitId"
                      v-model="transferInfo.newOrgUnitId"
                      dataKey="org"
                      nodeKey="orgUnitId"
                      :disabled="disabledMap.newOrgUnitId"
                      @node-click='nodeClick'
                      @delete="deleteOrgUnitId"
                    />
                      
                    <!-- :hasGrant="false" -->
                    <el-input disabled placeholder="" v-else></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 职位 -->
              <el-row v-if="showMap.newPosPositionId || showMap.oldPosPositionId">
                <el-col :span="10" class="posA">
                  <el-form-item :prop="showMap.newPosPositionId ? 'newPosPositionId' : ''" :class="{showStart: showMap.newPosPositionId}" >
                    <el-select v-model="transferInfo.newPosPositionId" clearable :disabled="disabledMap.newPosPositionId" v-if="showMap.newPosPositionId">
                      <el-option
                      v-for="item in transferInfo.posList"
                      :key="item.posPositionId"
                      :label="item.name"
                      :value="item.posPositionId"
                      >
                      </el-option>
                    </el-select>
                    <el-input disabled placeholder="" v-else></el-input>                    
                  </el-form-item>
                </el-col>
              </el-row>
                 <!-- 职务 -->
              <el-row v-if="showMap.newPosTitleName || showMap.oldPosTitleName">
                <el-col :span="10">
                  <el-form-item  >
                    <el-input v-model="transferInfo.newPosTitleName" :disabled="disabledMap.newPosTitleName" placeholder="" v-if="showMap.newPosTitleName"></el-input>
                    <el-input disabled placeholder="" v-else></el-input>                                      
                  </el-form-item>
                </el-col>
              </el-row>
                <!-- 用工类型 -->
              <el-row v-if="showMap.newEmployeeType || showMap.oldEmployeeType">
                <el-col :span="10">
                  <el-form-item :class="{showStart:showMap.newEmployeeType}" :prop="showMap.newEmployeeType?'newEmployeeType':''"  >
                    <i-select v-if="showMap.newEmployeeType" v-model="transferInfo.newEmployeeType" parameter='EMPLOYEE_TYPE' :disabled="disabledMap.newEmployeeType||transferInfo.transferType !== '3' "/>
                    <el-input disabled placeholder="" v-else></el-input>                                      
                  
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row  v-if="showMap.newPayGroupId || showMap.oldPayGroupId">
                <el-col :span="10">
                  <el-form-item :prop="showMap.newPayGroupId?'newPayGroupId':''" :class="{showStart:showMap.newPayGroupId}" >
                      <remote-select
                        v-if="showMap.newPayGroupId"
                        v-model="transferInfo.newPayGroupId"
                        dataKey="allSalaryGroup"
                        :props="groupProps"
                        :disabled="disabledMap.newPayGroupId || !transferInfo.newPersonnelGroupCode"
                        :displayKeys="payGroupLabel"                        
                        :defaultOptions="defaultPayGroup"
                        @option-click="selectefGroup"
                        :extraParams="{personnelGroupCode: transferInfo.newPersonnelGroupCode||''}"
                      ></remote-select>
                    <el-input disabled placeholder="" v-else></el-input>                                      
                 
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row  v-if="showMap.newWorkSystem || showMap.oldWorkSystem">
                <el-col :span="10" >
                  <el-form-item :prop="showMap.newWorkSystem?'newWorkSystem':''" :class="{showStart:showMap.newWorkSystem}" >
                     <i-select v-model="transferInfo.newWorkSystem" parameter='WORK_SYSTEM' :disabled="disabledMap.newWorkSystem" v-if="showMap.newWorkSystem"/>
                    <el-input disabled placeholder="" v-else></el-input>                                      
                     
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 薪资 -->
              <el-row v-if="showMap.newSalary || showMap.oldSalary">
                <el-col :span="10">
                  <el-form-item :prop="showMap.newSalary ? 'newSalary' : ''" :class="{showStart:showMap.newSalary}">
                     <el-input v-model="transferInfo.newSalary" class="input-with-select select" :disabled="disabledMap.newSalary" size="mini"  v-if="showMap.newSalary">
                       <el-select v-model="transferInfo.newSalaryType" slot="append" :disabled="disabledMap.newSalaryType">
                         <el-option label="元/时" value="2"></el-option>
                         <el-option label="元/月" value="1"></el-option>
                       </el-select>
                    </el-input>
                    <el-input disabled placeholder="" v-else></el-input>                                      
                    
                  </el-form-item>
                </el-col>
              </el-row>

                <!-- 是否随时效浮动 -->
              <el-row v-if="showMap.newIsAgingFloat || showMap.oldIsAgingFloat">
                <el-col :span="10"  >
                  <el-form-item :prop="showMap.newIsAgingFloat?'newIsAgingFloat':''" :class="{showStart:showMap.newIsAgingFloat}" >
                     <i-select v-model="transferInfo.newIsAgingFloat" parameter='WHETHER_TYPE' :disabled="disabledMap.newIsAgingFloat" v-if="showMap.newIsAgingFloat"/>
                    <el-input disabled placeholder="" v-else></el-input>                                      
                  
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="showMap.newSuretyName1 || showMap.oldSuretyName1">
                <el-col :span="10">
                            
                  <el-form-item prop="newSurety1" :class="[{showStart:transferInfo.isShowSalary&&showMap.newSuretyName1},'box1']" v-show="transferInfo.isShowSalary&&showMap.newSuretyName1">
                         <!-- <el-autocomplete
                         class="input-box1"
                          v-model="transferInfo.newSuretyName1"
                          :fetch-suggestions="querySearchNewCosurety1"
                          placeholder="请选择"
                          :isShow.sync="isShow1"
                          @select="handleSelect1"
                          @focus="getNewCosurety({ empEmployeeId: transferInfo.empEmployeeId, employeeUnitId: transferInfo.newOrgUnitId})"
                          :disabled="disabledMap.newSuretyName1 || this.EssentialList.length>=1" 
                        >
                         </el-autocomplete> -->
                          <i-select
                            class="input-box1"
                            v-model="transferInfo.newSurety1"
                            :isShow.sync="isShow1"
                            :options="Array.from(cosuretyList)"
                            :async="false"
                            :props="cosuretyProps"
                           :disabled="disabledMap.newSuretyName1 || this.EssentialList.length>=1" 
                            @option-click="handleOptionClick1"
                          ></i-select>                          
                         <i-show-personnelInfo 
                            :id="transferInfo.newSurety1" 
                            class="btn1" 
                            v-if="transferInfo.isShowSalary&&showMap.newSuretyName1"
                            v-show="transferInfo.newSuretyName1"
                          ></i-show-personnelInfo> 
                  </el-form-item>
                     <el-form-item v-if="(showMap.newSuretyName1 || showMap.oldSuretyName1) && !transferInfo.isShowSalary">
                       <el-input disabled placeholder=""></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="showMap.newSuretyName2 || showMap.oldSuretyName2">
                <el-col :span="10">
                  <el-form-item prop="newSurety2" :class="[{showStart:transferInfo.isShowSalary &&showMap.newSuretyName2},'box1']" v-show="transferInfo.isShowSalary && showMap.newSuretyName2">
                           <i-select
                            class="input-box1"
                            v-model="transferInfo.newSurety2"
                            :isShow.sync="isShow2"
                            :options="Array.from(cosuretyList)"
                            :async="false"
                            :props="cosuretyProps"
                           :disabled="disabledMap.newSuretyName2 || this.EssentialList.length>=2" 
                            @option-click="handleOptionClick2"
                          ></i-select>
                         <i-show-personnelInfo
                            v-if="transferInfo.isShowSalary && showMap.newSuretyName2"
                            :id="transferInfo.newSurety2" 
                            class="btn1" 
                            v-show="transferInfo.newSuretyName2"
                          ></i-show-personnelInfo> 
                  </el-form-item>
                  <el-form-item v-if="(showMap.newSuretyName2 || showMap.oldSuretyName2) && !transferInfo.isShowSalary">
                       <el-input disabled placeholder=""></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="附件" class="uploaderForm"  v-if="showMap.fileList||transferInfo.fileList !== []">
            <i-upload
               :previewMode="disabledMap.fileList"
              :fileList="transferInfo.fileList"
              @onRemove="onFileRemove"
              @onSuccess="onFileSuccess"
              @onError="onFileError">
            </i-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

        <!-- 打印 -->
       <div class="print-html" v-if="isShowPrint">
              <h1 class="h1">员工履历表</h1>
              <table width="100%" border="1" cellspacing="0" cellpadding="0"  style="border-collapse: collapse">
                  <tr>
                      <td colspan="7">
                            <h2 class="h2">一、个人基本资料</h2>
                      </td>
                      <td width="99" rowspan="4">
                          <img v-if="printObj.photoPath" :src="`http://${printObj.printWindowHost}${$$.BASE_URL}/system/attachments/image/${printObj.photoPath}`" width="99" height="120" alt="头像" title="">
                      </td>
                  </tr>
                  <tr>
                    <td width="90" class="td-center">
                          人事范围
                    </td>
                    <td colspan="2">
                        {{printObj.personnelGroupName}}
                    </td>
                    <td width="90">职位</td>
                    <td width="90">{{printObj.posPositionName}}</td>
                    <td width="90">职务</td>
                    <td width="90">{{printObj.posTitleName}}</td>
                  </tr>
                  <tr>
                      <td>姓名</td>
                      <td colspan="2">{{printObj.fullName}}</td>
                      <td>性别</td>
                      <td>{{printObj.gender | printFilter('gender')}}</td>
                      <td>年龄</td>
                      <td>{{printObj.birthDate | ageFilter}}</td>
                  </tr>
                  <tr>
                    <td>出生日期</td>
                    <td colspan="2">{{filterDate(printObj.birthDate)}}</td>
                    <td>民族</td>
                    <td>{{printObj.nation | printFilter('nation')}}</td>
                    <td>籍贯</td>
                    <td>{{printObj.domicilePlace}}</td>
                  </tr>
                  <tr>
                      <td colspan="8">
                            <table  width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;border-width:0px; border-style:hidden;">
                              <tr>
                                <td width="90">政治面貌</td>
                                <td>{{printObj.politicsStatus | printFilter('politicsStatus')}}</td>
                                <td width="90">婚姻状况</td>
                                <td width="90">{{printObj.maritalStatus | printFilter('maritalStatus')}}</td>
                                <td width="90">户口性质</td>
                                <td width="190">{{printObj.domicileType | printFilter('iafAccountType')}}</td>
                              </tr>
                            </table>
                      </td>
                  </tr>
                  <tr>
                    <td colspan="8">
                      <table  width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;border-width:0px; border-style:hidden;">
                          <tr>
                            <td width="90">
                              证件号码
                            </td>
                            <td>
                                  {{printObj.idNumber}}
                            </td>
                            <td width="90">联系电话</td>
                            <td width="372">{{printObj.mobile}}</td>
                          </tr>
                          <tr>
                            <td>
                              最高学历
                            </td>
                            <td>{{(printObj.empEducation.length ? (printObj.empEducation[0].educationType) : '') | printFilter('educationType')}}</td>
                            <td>专业</td>
                            <td>{{printObj.empEducation.length ? (printObj.empEducation[0].major) : '--'}}</td>
                          </tr>
                          <tr>
                            <td>
                              健康状况
                            </td>
                            <td>
                                {{printObj.healthyCondition | printFilter('whetherType')}}
                            </td>
                            <td>有无传染病史</td>
                            <td>{{printObj.hadSeriousDisease | printFilter('haveOrNot')}}</td>
                          </tr>
                        </table>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="8">
                        <table  width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;border-width:0px; border-style:hidden;">
                            <tr>
                              <td width="90">
                                证件地址
                              </td>
                              <td>
                                  {{printObj.idRegisteredAddress}}
                              </td>
                              <td width="90">家庭电话</td>
                              <td width="100">{{printObj.mobile}}</td>
                            </tr>
                            <tr>
                              <td>现通讯地址</td>
                              <td>{{printObj.homeAddress}}</td>
                              <td>联系电话</td>
                              <td>{{printObj.mobile}}</td>
                            </tr>
                        </table>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="8">
                      <table  width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;border-width:0px; border-style:hidden;">
                          <tr>
                            <td width="90">紧急联系人(直系亲属)</td>
                            <td>{{printObj.empFamilyMember.length ? printObj.empFamilyMember[0].name : '--'}}</td>
                            <td width="90">与本人关系</td>
                            <td width="90">{{(printObj.empFamilyMember.length ? (printObj.empFamilyMember[0].relationship): '') | printFilter('familyRelationship')}}</td>
                            <td width="90">联系电话</td>
                            <td width="191">{{printObj.empFamilyMember.length ? printObj.empFamilyMember[0].primaryPhone : '--'}}</td>
                          </tr>
                      </table>
                    </td>
                  </tr>
              </table>
              <table  width="100%" border="1" cellspacing="0" cellpadding="0"  style="border-collapse: collapse">
                <tr>
                  <td colspan="7"><h2 class="h2">二、教育经历(从最高学历写起)</h2></td>
                </tr>
                <tr>
                  <td width="90" rowspan="2">学校名称</td>
                  <td colspan="2">学习时间</td>
                  <td rowspan="2" width="210">学历</td>
                  <td rowspan="2">专业</td>
                  <td rowspan="2" width="100">就学形式</td>
                </tr>
                <tr>
                  <td width="100">起</td>
                  <td width="100">止</td>
                </tr>
                <tr 
                  v-for="(item, key) of printObj.empEducation"
                  :key="key">
                    <td>{{item.institution}}</td>
                    <td>{{filterDate(item.admissionDate)}}</td>
                    <td>{{filterDate(item.graduationDate)}}</td>
                    <td>{{item.educationType | printFilter('educationType')}}</td>
                    <td>{{item.major}}</td>
                    <td>{{item.learnType | printFilter('learnType')}}</td>
                </tr>
              </table>
              <table  width="100%" border="1" cellspacing="0" cellpadding="0"  style="border-collapse: collapse">
                <tr>
                  <td colspan="6"><h2 class="h2">三、工作经历</h2></td>
                </tr>
                <tr>
                  <td width="90" rowspan="2">单位名称</td>
                  <td colspan="2">工作时间</td>
                  <td rowspan="2">担任职务</td>
                  <td rowspan="2" width="90">证明人</td>
                  <td rowspan="2" width="100">联系方式</td>
                </tr>
                <tr>
                  <td width="100">起</td>
                  <td width="100">止</td>
                </tr>
                <tr 
                  v-for="(item, key) of printObj.empWorkExperience"
                  :key="key">
                    <td>{{item.company}}</td>
                    <td>{{filterDate(item.beginDate)}}</td>
                    <td>{{filterDate(item.endDate)}}</td>
                    <td>{{item.positionName}}</td>
                    <td>{{item.witness}}</td>
                    <td>{{item.witnessContact}}</td>
                </tr>
              </table>
              <table  width="100%" border="1" cellspacing="0" cellpadding="0"  style="border-collapse: collapse">
                <tr>
                  <td colspan="7"><h2 class="h2">四、调动经历(公司内)</h2></td>
                </tr>
                <tr>
                  <td width="90">异动时间</td>
                  <td width="100">异动前组织</td>
                  <td width="100">异动前职位</td>
                  <td>异动后组织</td>
                  <td width="90">异动后职位</td>
                  <td width="90">原因异动</td>
                  <td width="100">异动类型</td>
                </tr>
                <tr 
                  v-for="(item, key) of printObj.empStaffRecordById"
                  :key="key">
                    <td>{{filterDate(item.recordTime) }}</td>
                    <td width="100">{{item.oldUnitName | dataFilter}}</td>
                    <td>{{item.oldJobName | dataFilter}}</td>
                    <td>{{item.newUnitName | dataFilter}}</td>
                    <td>{{item.newJobName | dataFilter}}</td>
                    <td>{{item.reason}}</td>
                    <td>{{item.recordType | printFilter('recordType')}}</td>
                </tr>
              </table>
          </div>
  </section>
</template>
<script>
  import req from 'api/employee/personal'
  import ISelect from 'components/common/i-select/i-select'
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
  import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import moment from 'moment'
  import IUpload from 'components/common/upload/uploader'
  import Personnel from '../personnelCommon'
  import RemoteSelect from 'components/compensation/remote-select'
  import IShowPersonnelInfo from 'components/common/i-show-personnelInfo'
  import printCommon from './printCommon'
  let vm
  export default {
    components: {
      ISelect,
      ISelectTree,
      iPersonnelSelect,
      IUpload,
      Personnel,
      RemoteSelect,
      IShowPersonnelInfo
    },
    props: {
      transferInfo: Object
    },
    created () {
      this.getDicts(this.dictCodes)
      vm = this
      // 兼容移动端没有调动原因列表问题
      !this.transferInfo.transferReasonList.length && this.transferInfo.transferType && this.transferInfo.transferType !== '3' && this.getTransferReasonList(this.transferInfo.transferType)
    },
    mounted () {
      if (!this.disabledMap.newSalaryType) {
        this.$nextTick(function () {
          document.getElementsByClassName('select').length && (document.getElementsByClassName('select')[0].getElementsByClassName('el-input-group__append')[0].style.backgroundColor = '#fff')
        })
      }
      this.cosuretyList = []
      if (!(this.disabledMap.newSuretyName1 && this.disabledMap.newSuretyName2)) {
        let item = {
          empEmployeeId: this.transferInfo.empEmployeeId,
          employeeUnitId: this.transferInfo.newOrgUnitId || this.transferInfo.oldOrgUnitId
        }
        this.transferInfo.isShowSalary && this.getSurInfo(item)
      } else {
        let value1 = {'name': this.transferInfo.newSuretyName1, 'id': this.transferInfo.newSurety1}
        this.cosuretyList.push(value1)
        let value2 = {'name': this.transferInfo.newSuretyName2, 'id': this.transferInfo.newSurety2}
        this.cosuretyList.push(value2)
      }

      this.transferInfo && this.fetchAll(this.transferInfo.empEmployeeId)
    },
    computed: {
      defaultPayGroup: function () {
        let any = []
        let data = {}
        data.groupId = this.transferInfo.newPayGroupId
        data.groupName = this.transferInfo.newPayGroupName
        any.push(data)
        return this.transferInfo.newPayGroupId ? any : []
      },
      defaultPersonnelGroupLabel: function () {
        let any = []
        let data = {}
        data.personnelGroupCode = this.transferInfo.newPersonnelGroupCode
        data.personnelGroupName = this.transferInfo.newPersonnelGroupName
        any.push(data)
        return this.transferInfo.newPersonnelGroupCode ? any : []
      }
    },
    filters: {
      ageFilter (val) {
        return val ? moment(new Date()).format('YYYY') - moment(val).format('YYYY') : '--'
      },
      dataFilter (val) {
        return val || '--'
      },
      printFilter (val, url) {
        return val ? vm.dicts[url][val] : '--'
      }
    },
    watch: {
      // 监听新组织ID
      'transferInfo.newOrgUnitId': {
        handler: function (newVal, oldVal) {
          if (newVal === this.transferInfo.oldOrgUnitId) {
            this.transferInfo.newPersonnelGroupCode = this.transferInfo.oldPersonnelGroupCode
            this.transferInfo.newPersonnelGroupName = this.transferInfo.oldPersonnelGroupName
          } else {
            this.transferInfo.newPersonnelGroupCode = ''
            this.transferInfo.newPersonnelGroupName = ''
          }
          if (newVal) {
            if (oldVal) {
              this.transferInfo.newPosPositionId = ''
              this.transferInfo.newPosTitleId = ''
              this.transferInfo.newPosTitleName = ''
            }
            if (this.transferInfo.newOrgUnitId === '') { return }
            // req('getOrgUnitName', {orgUnitIds: this.transferInfo.newOrgUnitId})
            //   .then(res => {
            //     if (res) {
            //       this.transferInfo.selectedOrgNode = res
            //     }
            //   })
            // }
            req('getPosList', {orgUnitId: newVal, status: '1'})
              .then(res => {
                this.transferInfo.posList = res
              })
            req('getArea', {id: newVal})
              .then(res => {
                // this.transferInfo.orgs = res
                 // 公司名称
                // this.transferInfo.newCompanyName = res.orgCompanyName
             // 人事范围
                // this.transferInfo.newPersonnelArea = res.personnelArea
              })
          } else {
            this.transferInfo.newPosPositionId = ''
            this.transferInfo.newPosPositionName = ''
            this.transferInfo.newPosTitleId = ''
            this.transferInfo.newPosTitleName = ''
            this.transferInfo.posList.length = 0
            // Object.keys(this.transferInfo.orgs).map(key => {
            //   this.transferInfo.orgs[key] = ''
            // })
                // 公司名称
            // this.transferInfo.newCompanyName = ''
             // 人事范围
            // this.transferInfo.newPersonnelArea = ''
          }
        },
        deep: true
      },
      // 监听新职位ID
      'transferInfo.newPosPositionId': {
        handler: function (newVal, oldVal) {
          if (newVal) {
            this.transferInfo.posList.map(pos => {
              // pos.posPositionId === newVal && (this.transferInfo.selectedPos = pos)
              // 只需要带出职务
              if (pos.posPositionId === newVal) {
                this.transferInfo.newPosTitleName = pos.posTitleName
                this.transferInfo.newPosTitleId = pos.posTitleId
                this.transferInfo.newPosPositionName = pos.name
              }
            })
            let a = this.transferInfo.posList.findIndex(item => {
              return item.posPositionId === newVal
            })
            if (a === -1) {
              this.transferInfo.newPosPositionId = ''
              this.transferInfo.newPosTitleName = ''
            }
            // if (this.transferInfo.selectedPos.posTitleName.includes('合伙人')) {
            //   this.transferInfo.isShowSalary = true
            //   this.labelList.push('联保人1')
            //   this.labelList.push('联保人2')
            // }
            // 把职位id发送过去，判断是否显示联保人
            // this.transferInfo.newPosTitleId = this.transferInfo.selectedPos.posTitleId
            req('checkIsSurety', {posTitleId: this.transferInfo.newPosTitleId})
              .then(res => {
                if (res) {
                  this.transferInfo.newSurety1 = ''
                  this.transferInfo.newSuretyName1 = ''
                  this.transferInfo.newSurety2 = ''
                  this.transferInfo.newSuretyName2 = ''
                  let item = {
                    empEmployeeId: this.transferInfo.empEmployeeId,
                    employeeUnitId: this.transferInfo.newOrgUnitId || this.transferInfo.oldOrgUnitId
                  }
                  this.getSurInfo(item)
                  this.transferInfo.isShowSalary = true
                } else {
                  this.transferInfo.isShowSalary = false
                  this.transferInfo.newSurety1 = ''
                  this.transferInfo.newSurety2 = ''
                  this.transferInfo.newSuretyName1 = ''
                  this.transferInfo.newSuretyName2 = ''
                }
              })
          } else {
            this.transferInfo.newPosTitleId = ''
            this.transferInfo.isShowSalary = false
          }
        },
        deep: true
      },
      'transferInfo.isShowSalary': {
        handler: function (newVal, oldVal) {
          if (!newVal) {
            // 只要是新的职位不是和后人，就把新联保人清空
            this.transferInfo.newSurety1 = ''
            this.transferInfo.newSurety2 = ''
            this.transferInfo.newSuretyName1 = ''
            this.transferInfo.newSuretyName2 = ''
          }
        },
        deep: true
      },
      // 根据调动类型,截取对应的调动原因
      'transferInfo.transferType': {
        handler: function (newVal, oldVal) {
          newVal && (this.transferInfo.transferReason = '')
          if (newVal !== '3') {
            this.transferInfo.newEmployeeType = this.transferInfo.oldEmployeeType
            // 截取调动原因
            this.getTransferReasonList(newVal)
          }
        },
        deep: true
      },
      'transferInfo.empEmployeeId': {
        handler: function (newVal, oldVal) {
          newVal && this.fetchAll(newVal)
        },
        deep: true
      }
    },
    data () {
      let validateMoney = (rule, value, cb) => {
        let isNum = /^(([0]{1}\.[0-9]*[0-9]+)|([1-9]+\.[0-9]*[1-9][0-9]*)|([1-9]+[0-9]*\.[0-9]+)|([1-9]+[0-9]*)|([0]{1}))$/
        let IsOnlyTwo = /^(([0]{1}\.[0-9]{0,2})|([1-9]+\.[0-9]{1,2})|([1-9]+[0-9]*\.[0-9]{1,2})|([1-9]+[0-9]*)|([0]{1}))$/
        !value && cb(new Error('薪资不能为空'))

        if (isNum.exec(value)) {
          if (IsOnlyTwo.exec(value)) {
            cb()
          } else {
            cb(new Error('薪资最多保留两位小数'))
          }
        } else {
          cb(new Error('请输入正确的数字!'))
        }
      }
      let checkCosurety1 = (rule, value, cb) => {
        if (!this.transferInfo.isShowSalary) {
          return cb()
        }
        !value && cb(new Error('联保人不能为空'))
        value === this.transferInfo.newSurety2 ? cb(new Error('不能选择相同的联保人')) : cb()
      }
      let checkCosurety2 = (rule, value, cb) => {
        if (!this.transferInfo.isShowSalary) {
          return cb()
        }
        !value && cb(new Error('联保人不能为空'))
        this.transferInfo.newSurety1 === value ? cb(new Error('不能选择相同的联保人')) : cb()
      }
      return {
        cosuretyList: [],
        cosuretyProps: {
          label: 'name',
          value: 'id'
        },
        isShowPrint: false,
        content: {}, // 保存打印的内容
        printObj: {
          fullName: '',
          posPositionName: '',
          posTitleName: '',
          personnelGroupName: '',
          gender: '',
          birthDate: '',
          nation: '',
          domicilePlace: '',
          politicsStatus: '',
          maritalStatus: '',
          domicileType: '',
          idNumber: '',
          mobile: '',
          healthyCondition: '',
          idRegisteredAddress: '',
          homeAddress: '',
          hadSeriousDisease: '',
          empCredential: {},
          empEducation: {},
          empFamilyMember: {},
          empStaffRecordById: {},
          empWorkExperience: {},
          printWindowHost: window.location.host
        },
        apiList: [
         { name: 'employeebaseInfo' },
         { name: 'empPosition' },
         { name: 'healthyInfo' },
         { name: 'empFamilyMember' },
         { name: 'empEducation' },
         { name: 'empWorkExperience' },
         { name: 'empCredential' },
         { name: 'empStaffRecordById' }
        ],
        dictCodes: ['GENDER', 'NATION', 'HAVE_OR_NOT', 'RECORD_TYPE', 'TRANSFER_REASON', 'FAMILY_RELATIONSHIP', 'LEARN_TYPE', 'POLITICS_STATUS', 'MARITAL_STATUS', 'DOMICILE_TYPE', 'EDUCATION_TYPE', 'WHETHER_TYPE'],
        dicts: {},
        dictMap: {
          'GENDER': 'gender',
          'NATION': 'nation',
          'HAVE_OR_NOT': 'haveOrNot',
          'RECORD_TYPE': 'recordType',
          'DOMICILE_TYPE': 'iafAccountType',
          'TRANSFER_REASON': 'transferReason',
          'FAMILY_RELATIONSHIP': 'familyRelationship',
          'LEARN_TYPE': 'learnType',
          'EDUCATION_TYPE': 'educationType',
          'POLITICS_STATUS': 'politicsStatus',
          'MARITAL_STATUS': 'maritalStatus',
          'WHETHER_TYPE': 'whetherType'
        },
          // 薪资组选择器配置
        groupProps: {value: 'groupId', label: 'groupName'},
        payGroupLabel: ['groupName'],
          // 人事范围选择器配置
        personnelGroupLabel: ['personnelGroupCode', 'personnelGroupName'],
        personnelProps: {value: 'personnelGroupCode', label: 'personnelGroupName'},
        params: {'hasPower': 'Y', 'usable': 'Y'},

        isPreviewMode: false,
        pickerOptions: {},
        endOptions: {
          disabledDate: (time) => {
               // 不可以选择入职当月
            let val = new Date(this.transferInfo.hireDate)
            val.setMonth(val.getMonth() + 1)
            return time.getTime() < new Date(val)
          }
        },
        isShow1: false,
        isShow2: false,
        isShowTransferDate: false,
        labelList: [
          {key: ['newCompanyName', 'oldCompanyName'], label: '公司名称'},
          {key: ['newPersonnelGroupCode', 'oldPersonnelGroupCode'], label: '人事范围'},
          {key: ['newOrgUnitId', 'oldOrgUnitId'], label: '所属组织'},
          {key: ['newPosPositionId', 'oldPosPositionId'], label: '职位'},
          {key: ['newPosTitleName', 'oldPosTitleName'], label: '职务'},
          {key: ['newEmployeeType', 'oldEmployeeType'], label: '用工类型'},
          {key: ['newPayGroupId', 'oldPayGroupId'], label: '薪资组'},
          {key: ['newWorkSystem', 'oldWorkSystem'], label: '工作制'},
          {key: ['newSalary', 'oldSalary'], label: '薪资'},
          {key: ['newIsAgingFloat', 'oldIsAgingFloat'], label: '随时效浮动'},
           {key: ['newSuretyName1', 'oldSuretyName1'], label: '联保人1'},
          {key: ['newSuretyName2', 'oldSuretyName2'], label: '联保人2'}
          // {key: ['newSuretyName1', label: '联保人1'},
          // {key: 'newSuretyName2', label: '联保人2'}
        ],
        rules: {
          fullName: [
            { required: true, message: '请选择调动人员', trigger: 'change' }
          ],
          transferType: [
            { required: true, message: '调动类型不能为空', trigger: 'change' }
          ],
          transferDate: [
            { required: true, message: '请选择调动日期', trigger: 'change' }
          ],
          transferReason: [
            { required: true, message: '调动原因不能为空', trigger: 'change' }
          ],
          newCompanyName: [
            { required: true, message: '公司不能为空', trigger: 'change' }
          ],
          newPersonnelGroupCode: [
            { required: true, message: '人事范围不能为空', trigger: 'change' }
          ],
          newPosPositionId: [
            { required: true, message: '请选择职位', trigger: 'change' }
          ],
          newWorkSystem: [
            { required: true, message: '请选择工作制', trigger: 'change' }
          ],
          empTypeConversion: [
            { required: true, message: '请选择用工类型转换', trigger: 'change' }
          ],
          newOrgUnitId: [
            { required: true, message: '组织不能为空', trigger: 'change' }
          ],
          newIsAgingFloat: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          newPayGroupId: [
            { required: true, message: '薪资组不能为空', trigger: 'change' }
          ],
          newEmployeeType: [
            { required: true, message: '用工类型不能为空', trigger: 'change' }
          ],
          newSalary: [
            { required: true, validator: validateMoney, trigger: 'blur' }
          ],
          newSurety1: [
           { required: true, validator: checkCosurety1, trigger: 'change' }
          ],
          newSurety2: [
            { required: true, validator: checkCosurety2, trigger: 'change' }
          ]
        },
        empEmployeeId: '',
       // 存放联保人工号和姓名
        // value: {},
        // 可选联保人存放列表
        // optionalList: [],
        flag: false,
       // 必选联保人存放列表
        EssentialList: [],
        // 保存用工类型转换类型
        empTypeConversion: [],
        //  保存当前员工的类型
        oldEmployeeType: '',
        // 人员选择
        isShow: false,
        newPosPositionName: '',
           // 可用人事范围列表
        personnelGroupList: [],
        // 可用公司列表
        companyList: [],
        // 薪资组列表
        salaryList: [],
        isFlowCenter: this.$route.query.isFlowCenter
      }
    },
    methods: {
      _initialUpperCase (word) {
        return word.replace(/^\w/, s => s.toUpperCase())
      },

      formatApiName (method, { name = '' }) {
        return method + this._initialUpperCase(name)
      },

       // 获取打印全部信息
      fetchAll (empEmployeeId) {
        const fn = key => data => {
          if (data) {
            Array.isArray(data) ? this.$set(this.printObj, key, data) : Object.keys(data).map(item => {
              this.$set(this.printObj, item, data[item])
            })
          }
        }
        return Promise.all(
        this.apiList.map(
          api => (empEmployeeId && req(this.formatApiName('get', api), { empEmployeeId })
            .then(fn(api.name)))
        )
       )
      },
      // 获取需要的字典
      getDicts (dictCodes) {
        req('getDicts', {'dictCodes[]': dictCodes.join(',')})
        .then(res => {
          res.map(key => {
            if (this.dictMap[key.dictName]) {
              this.dicts[this.dictMap[key.dictName]] = {}
              key.dict.map(dic => { this.dicts[this.dictMap[key.dictName]][dic.value] = dic.label })
            }
          })
        })
      },
      // 打印
      recordPrint () {
        this.isShowPrint = true
        setTimeout(() => {
          // this.$nextTick(function () {
          const printHtml = `${printCommon()}${document.getElementsByClassName('print-html')[0].innerHTML}`
          const wind = window.open('', 'newwindow', 'height=500, width=900, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
          wind.document.body.innerHTML = printHtml
          setTimeout(() => { wind.print() }, 300)
          // })
        }, 100)
      },

      filterDate (val, rule = 'YYYY-MM-DD') {
        return val ? moment(val).format(rule) : '--'
      },
      getSurInfo (item) {
        this.cosuretyList = []
        this.EssentialList = []
        this.getEssentialCosurety(item)
        this.getNewCosurety(item)
        // }
      },

      // 获取必选联保人essentialCosuretyList
      getEssentialCosurety (item) {
        req('getEssentialCosurety', item)
      .then(data => {
        this.EssentialList = data
        if (data.length === 2) {
          this.transferInfo.newSurety1 = data[0].suretyEmployeeId
          this.transferInfo.newSuretyName1 = data[0].suretyName
          this.transferInfo.newSurety2 = data[1].suretyEmployeeId
          this.transferInfo.newSuretyName2 = data[1].suretyName
        } else if (data.length === 1) {
          this.transferInfo.newSurety1 = data[0].suretyEmployeeId
          this.transferInfo.newSuretyName1 = data[0].suretyName
        }
      })
      },
      // 获取可选联保人
      getNewCosurety (item) {
        req('getOptionalCosurety', item)
        .then(data => {
          data.map(item => {
            let value = {'name': item.suretyName, 'id': item.suretyEmployeeId}
            this.cosuretyList.push(value)
          })
          // 防止获取的联保人数量超过100个且必选联保人不在其中
          this.EssentialList.map(val => {
            this.cosuretyList.map(keyId => {
              if (keyId.id === val.suretyEmployeeId) {
                this.flag = true
              }
            })
            if (!this.flag) {
              let valueEss = {'name': val.suretyName, 'id': val.suretyEmployeeId}
              this.cosuretyList.push(valueEss)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
      },
      handleOptionClick1 (item) {
        this.$set(this.transferInfo, 'newSurety1', item.id)
        this.$set(this.transferInfo, 'newSuretyName1', item.name)
      },
      handleOptionClick2 (item) {
        this.$set(this.transferInfo, 'newSurety2', item.id)
        this.$set(this.transferInfo, 'newSuretyName2', item.name)
      },
      selectefGroup (sel) {
        this.transferInfo.newPayGroupName = sel.groupName
        // this.transferInfo.newPayGroupId = sel.groupId
      },
      selectefPersonnelGroup (sel) {
        sel.companyCode && (this.transferInfo.newCompanyCode = sel.companyCode)
        sel.companyName && (this.transferInfo.newCompanyName = sel.companyName)
        this.transferInfo.newPersonnelGroupName = sel.personnelGroupName
        this.transferInfo.newPersonnelGroupCode = sel.personnelGroupCode
      },
      changePersonnelGrop (val) {
        this.transferInfo.newPayGroupName = ''
        this.transferInfo.newPayGroupId = ''
      },
      // 调动日期选择器赋值
      getSTime (val) {
        if (!val) {
          return false
        }
        val = new Date(val)
        // let hireDate = new Date(this.transferInfo.hireDate)
        // if (val.getMonth() === hireDate.getMonth()) {
        //   // 相等把月加一
        //   val.setMonth(val.getMonth() + 1)
        // }
        // 把日全部置为01
        val.setDate(val.getDate() - val.getDate() + 1)
        this.transferInfo.transferDate = moment(val).format('YYYY-MM-DD')
        // 截取
      },
      // 入职日期选择器赋值
      getHireDate (val) {
        this.transferInfo.hireDate = val
      },
      //  调动人员选择器人员选择方法
      handleConfirm (selected) {
        this.empEmployeeId = selected[0].employeeId
        let _this = this
          //  选中的人员数组
        if (selected.length === 1) {
          this.transferInfo.fullName = selected[0].employeeName
          // 发送请求数据
          // req('getTransfer', { empEmployeeId: selected[0].employeeId }).then(res => {
          //   Object.assign(this.transferInfo, res)
          // })
                 // 选择人员进入时，先根据人员id获取基本信息
          new Promise(function (resolve, reject) {
            req('getTransfer', { empEmployeeId: selected[0].employeeId })
            .then(res => {
              Object.keys(res).map(key => {
                Object.assign(_this.transferInfo, res)
              })
              // 左边的信息---》右边
              _this.transferInfo.newOrgUnitId = _this.transferInfo.oldOrgUnitId
              _this.transferInfo.newOrgUnitName = _this.transferInfo.oldOrgUniName
              _this.transferInfo.newEmployeeType = _this.transferInfo.oldEmployeeType
              // _this.transferInfo.newPayGroupId = _this.transferInfo.oldPayGroupId
              // _this.transferInfo.newPayGroupName = _this.transferInfo.oldPayGroupName
              // _this.transferInfo.newSalary = _this.transferInfo.oldSalary
              // _this.transferInfo.newSalaryType = _this.transferInfo.oldSalaryType
              // _this.transferInfo.newSurety1 = _this.transferInfo.oldSurety1
              // _this.transferInfo.newSurety2 = _this.transferInfo.oldSurety2
              // _this.transferInfo.newSuretyName1 = _this.transferInfo.oldSuretyName1
              // _this.transferInfo.newSuretyName2 = _this.transferInfo.oldSuretyName2
              // _this.transferInfo.newWorkSystem = _this.transferInfo.oldWorkSystem
              _this.transferInfo.newCompanyCode = _this.transferInfo.oldCompanyCode
              _this.transferInfo.newCompanyName = _this.transferInfo.oldCompanyName
              _this.transferInfo.newPersonnelGroupCode = _this.transferInfo.oldPersonnelGroupCode
              _this.transferInfo.newPersonnelGroupName = _this.transferInfo.oldPersonnelGroupName
              // _this.transferInfo.oldPersonnelGroupName = _this.transferInfo.oldPersonnelGroupCode + '_' + _this.transferInfo.oldPersonnelGroupName
              resolve(_this.transferInfo)
            })
          })
        .then((res) => {
          // 根据组织id获取公司名称，人事范围
          if (res.oldOrgUnitId) {
            req('getArea', {id: res.oldOrgUnitId})
            .then(data => {
              // 公司名称
              // this.$set(this.transferInfo, 'oldCompanyName', data.orgCompanyName)
              // this.transferInfo.newCompanyName = data.orgCompanyName
              // 所属组织
              // this.$set(this.transferInfo, 'oldOrgUnitName', data.orgUnitName)
              // 人事范围
              // this.transferInfo.oldPersonnelArea = data.personnelArea
              // this.transferInfo.newPersonnelArea = data.personnelArea
            })
            // 组织
            // req('getOrgUnitName', {orgUnitIds: res.oldOrgUnitId})
            //   .then(res => {
            //     if (res) {
            //       console.log(res)
            //       this.transferInfo.selectedOrgNode = res[0]
            //     }
            //   })
          }
          // 根据组织id获取职群，标准职位
          if (res.oldPosPositionId) {
            // this.transferInfo.newPosPositionId = res.oldPosPositionId
            req('getPositions', {posPositionId: res.oldPosPositionId})
            .then(pos => {
              //  标准职位
              // this.transferInfo.posStandardJobName = pos.posStandardJobName
              // this.transferInfo.selectedPos.posStandardJobName = pos.posStandardJobName
              // this.posStandardJobName = pos.posStandardJobName
              // 职群
              // this.transferInfo.posJobFamilyName = pos.posJobFamilyName
              // this.$set(this.transferInfo.selectedPos, 'posJobFamilyName', pos.posJobFamilyName)
              // this.transferInfo.selectedPos.posJobFamilyName = pos.posJobFamilyName
              // 职位
              // this.transferInfo.oldPosPositionName = pos.name
              // this.transferInfo.newPosPositionName = pos.name
              // 根据职务是否显示联保人
              // this.oldPosTitleId = pos.posTitleId
            })
          }
          // req('checkIsSurety', {posTitleId: res.oldPosTitleId})
          //     .then(res => {
          //       if (res) {
          //         this.transferInfo.isOldShowSalary = true
          //         // this.labelList.push('联保人1')
          //         // this.labelList.push('联保人2')
          //       } else {
          //         this.transferInfo.isOldShowSalary = false
          //       }
          //     })
        })
        } else if (selected.length < 1) {
          this.$message.warning('请选择一名人员')
          return false
        } else {
          this.$message.warning('请注意，只能选择一名人员')
          return false
        }
      },
      // 控制调动人员选择器显示隐藏
      handleIconClick () {
        this.isFlowCenter ? this.isShow = !this.isShow : this.isShow = false
      },
      // 文件上传成功
      onFileSuccess (response, file, fileList) {
        this.$message.success('文件上传成功！')
        this.transferInfo.fileList.push(response)
      },
      // 文件上传失败
      onFileError (err, file, fileList) {
        console.log('err', err, file, fileList)
      },
      // 文件移除
      onFileRemove (file, fileList) {
        this.transferInfo.fileList.map(id => {
          id === file.response && this.transferInfo.fileList.splice(this.transferInfo.fileList.indexOf(id), 1)
        })
      },
      // 当组织变化时，需要将职位置空，因为不同的组织职位不同，需要重新选择
      nodeClick (node) {
        this.transferInfo.newOrgUnitName = node.orgUnitName
      },
      // 删除组织id，清空对应的内容
      deleteOrgUnitId () {
        this.transferInfo.newOrgUnitId = ''
        this.transferInfo.newOrgUnitName = ''
        this.transferInfo.newPosPositionId = ''
        this.transferInfo.newPosPositionName = ''
      },
      getTransferReasonList (val) {
          // 每一次转换进入之前把之前的数组清空
        this.transferInfo.transferReasonList = []
        val && req('getDistCode', {dictCode: 'TRANSFER_REASON'})
          .then(res => {
            // 如果没有选择就显示全部
            res.forEach((item, i) => {
              if (item.value.substring(0, 1) === val) {
                this.transferInfo.transferReasonList.push(item)
              }
            })
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
    .box{
        position: relative;
        .btn{
            position: absolute;
            left:5px;
            top:0px;
        }
    }
     .box2 {
        position: relative;
        .btn2 {
            position: absolute;
            left:24px;
            top:12px;
        }
    }
  .emp-move-basic {
    .form-main {
     .box1 {
      //  position: relative;
       .btn1 {
          position: absolute;
           left:5px;
          top:0px;
      }
    }
      .el-form-item {
        width: 280px;
      }
    }
    .moveTitle {
      text-align: center;
      font-size: 14px;
      line-height: 20px;
    }
    .move-label {
      font-size: 14px;
      text-align: right;
      padding: 11px 0 11px 0;
    }
    .card {
      border: 1px solid #d8d8d8;
      overflow: visible;
    }
    .before-box,
    .after-box {
      padding: 6px 0 6px 20px;
      &:nth-child(even) {
        background-color: #f2f2f2;
      }
    }
    .h28 {
      height: 28px;
    }
    .showStart:before{
        content: '*';
        color: #ff4949;
        margin-right: 4px;
        position:absolute;
        left: 11px;
        top: 12px;
    }
    .el-select .el-input {
      width: 130px;
    }
  }
</style>
<style lang="scss">
  .emp-move-basic {
     .input-box {
      .el-input__inner {
        text-indent: 10px;
      }
    }
      .input-box1 {
      .el-input__inner {
        text-indent: 10px;
      }
    }
    .input-box2 {
      .el-input__inner {
        text-indent: 10px;
      }
    }
    .uploaderForm {
      width: 800px !important;
    }
    .col-135 {
      .el-form-item__label {
        width: 135px !important;
      }
      .el-form-item__content {
        margin-left: 135px !important;
      }
    }
      .el-form-item__content {
        line-height: 39px !important;        
      } 
    .before-box {
      .el-input {
        width: 217px;
      }
    }
    .form-content {
      .el-form-item {
        margin-bottom: 0;
        width: 217px !important;
        .el-form-item__error {
          top: 28%;
          left: 102%;
          width: 300px;
        }
      }
      .el-row {
        padding-left: 20px;
        height: 40px !important;
        &:nth-child(even) {
          background-color: #f2f2f2;
        }
      }
    }
    .posA {
      position: absolute;
      left: 20px;
      .showStart:before{
        content: '*';
        color: #ff4949;
        margin-right: 4px;
        position:absolute;
        left: -11px;
        top: 12px;
    }
    }
    .selectedgroud {
      width:100px;
      el-select{
        width:80px;
      }
    }
   .input-with-select .el-input-group__append {
    padding: 0px;
   }
   .el-input-group__append {
     .el-input {
       width:80px;
       height: 26px;
     }
   }
   .el-input-group__append .el-select, .el-input-group__append .el-button, .el-input-group__prepend .el-select, .el-input-group__prepend .el-button{
     margin:0px;
   }
  .print-html {
     display: none;
   }
  @media print {
    .print-html {
      display: block;
     }
  }
  }
  // .popper__arrow {
  //    left: 100% !important;
  //  }
</style>



