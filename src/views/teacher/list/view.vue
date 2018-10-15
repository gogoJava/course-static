<template>
  <div class="teacher-list-page">
    <el-card class="box-card">
      <div style="float: right">
        <el-button type="primary" size="small" @click="editUser()">新建教师</el-button>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
        <el-table-column prop="name" label="教师姓名" width="180">
        </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <span>{{scope.row.sex | sexMsg}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="180">
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间">
          <template slot-scope="scope">
            <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deleted" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.deleted ? '禁用' : '启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editUser(scope.row)">详情</el-button>
            <el-button v-if="!scope.row.deleted" @click="deleteUser(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <my-pagination
              :total="tableData.total"
              :currentPage.sync="searchForm.page"
              :page-size.sync="searchForm.pageSize"
              @current-change="onCurrentPageChange">
      </my-pagination>
    </el-card>
    <el-dialog :title="isCreate ? '新建教师' : '教师详情'" :visible.sync="dialogFormVisible" width="70%">
      <el-form :model="userInfo" label-width="120px">
        <el-form-item label="用户名：">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="教师姓名：">
          <el-input v-model="userInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="userInfo.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期：">
          <el-date-picker v-model="userInfo.birthday" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="身份证号码：">
          <el-input v-model="userInfo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="userInfo.phone" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item v-if="isCreate" label="验证码：">
          <el-input v-model="userInfo.verification"></el-input>
        </el-form-item>
        <el-form-item label="教师工资">
          <el-radio-group v-model="userInfo.teacherChargeType">
            <el-radio label="1">人头</el-radio>
            <el-radio label="2">分成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-row>
            <el-col :span="6">半小时</el-col>
            <el-col v-if="userInfo.teacherChargeType === '1'" :span="6">超出（人）</el-col>
            <el-col :span="6">提成（元）</el-col>
            <el-col v-if="userInfo.teacherChargeType === '2'" :span="6">出勤课时费</el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><el-input v-model="userInfo.averageHour" style="width: 80%"></el-input></el-col>
            <el-col v-if="userInfo.teacherChargeType === '1'" :span="6"><el-input v-model="userInfo.exceedNum" style="width: 80%"></el-input></el-col>
            <el-col :span="6"><el-input v-model="userInfo.averageHourCost" style="width: 80%"></el-input></el-col>
            <el-col v-if="userInfo.teacherChargeType === '2'" :span="6"><el-input v-model="userInfo.percentage" style="width: 80%"></el-input><span> %</span></el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="isCreate" label="密码：">
          <el-input v-model="userInfo.password"></el-input>
        </el-form-item>
        <el-form-item v-if="isCreate" label="确认密码：">
          <el-input v-model="userInfo.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isCreate" @click="getVerificationCode">获取验证码</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createUser">{{isCreate ? '确定' : '修改'}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // components
  import MyPagination from '../../../components/pagination/MyPagination.vue'
  import { Loading } from 'element-ui'
  // API
  import * as userApi from '../../../apis/userApi'
  export default {
    title: '教师管理',
    name: 'teacher-list-page',
    components: {
      MyPagination
    },
    data() {
      return ({
        tableData: {
          loading: true,
          list: [],
          total: 0
        },
        searchForm: {
          keyword: '',
          pageNum: 1,
          pageSize: 10,
        },
        dialogFormVisible: false,
        userInfo: {
          name: '',
          username: '',
          sex: '0', // 性别：0、1
          birthday: '', // 出生日期
          type: 2, // 用户类型:1学生2教师
          password: '',
          phone: null,
          verification: '', // 验证码
          cardNum: null, // 身份证号码
          teacherChargeType: '1', // 教师收费类型:1按时(按课时出席人数)2按提成(分成)
          averageHour: null, // 按【averageHour】小时收费
          averageHourCost: null, // 按【averageHour】小时收费【averageHourCost】
          percentage: null, //
        },
        isCreate: true, // 是否是创建
      })
    },
    filters: {
      sexMsg(sex) {
        let text = '--'
        switch (sex) {
          case '0':
            text = '男'
            break;
          case '1':
            text = '女'
            break;
        }
        return text
      }
    },
    methods: {
      onCurrentPageChange(page) {
        this.searchForm.pageNum = page
        this.queryUserList()
      },
      async queryUserList() {
        this.tableData.loading = true
        const {data} = await userApi.getUserList({
          ...this.searchForm,
          type: 2, // 用户类型:1学生2教师
        }).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = list || []
        this.tableData.loading = false
      },
      // 获取验证码
      async getVerificationCode() {
        const phone = '15919161013'
        const res = await userApi.getCode({phone}).catch(e => e)
        console.log('res', res)
      },
      // 创建/编辑教师
      editUser(info) {
        if (info) {
          this.isCreate = false
          this.userInfo = {...info}
        } else {
          this.isCreate = true
          this.userInfo = {
            name: '',
            username: '',
            sex: '0', // 性别：0、1
            birthday: '',
            type: 2, // 用户类型:1学生2教师
            password: '',
            phone: null,
            verification: '', // 验证码
            cardNum: null, // 身份证号码
            teacherChargeType: '1', // 教师收费类型:1按时(按课时出席人数)2按提成(分成)
            averageHour: null, // 按【averageHour】小时收费
            averageHourCost: null, // 按【averageHour】小时收费【averageHourCost】
            percentage: null, //
          }
        }
        this.dialogFormVisible = true
      },
      async createUser() {
        let loadingInstance = Loading.service()
        if (this.isCreate) {
          const {code, msg, data} = await userApi.addUser(this.userInfo).catch(e=>e)
          console.log('data', data)
          loadingInstance.close()
          if (code !== '200') return this.$message(msg)
          this.$message({type: 'success', message: '创建成功！'})
        } else {
          delete this.userInfo.createTime
          delete this.userInfo.updateTime
          const {code, msg, data} = await userApi.updateUser(this.userInfo).catch(e=>e)
          console.log('data', data)
          loadingInstance.close()
          if (code !== '200') return this.$message(msg)
          this.$message({type: 'success', message: '修改教师资料成功！'})
        }
        this.dialogFormVisible = false
        this.queryUserList()
      },
      // 删除用户
      async deleteUser(user) {
        this.$confirm('是否删除教师【' + user.username + '】?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await userApi.deleteUser({accountId: user.accountId}).catch(e=>e)
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.queryUserList()
        }).catch(() => {})
      }
    },
    mounted() {
      this.queryUserList()
    }
  }
</script>
<style></style>