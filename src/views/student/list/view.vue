<template>
  <div class="student-list-page">
    <el-card class="box-card">
      <el-input v-model="searchForm.keyword" style="width: 300px;" placeholder="学生姓名、学号、用户名、联系电话">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div style="float: right">
        <el-button type="primary" size="small" @click="editUser()">新建学生</el-button>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
        <el-table-column prop="name" label="学生姓名">
        </el-table-column>
         <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column prop="schoolNumber" label="学号">
          <template slot-scope="scope">
            <span>{{scope.row.schoolNumber || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <span>{{scope.row.sex | sexMsg}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="家长联系电话">
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
            <el-button type="text" @click="updatePassword(scope.row)">修改密码</el-button>
            <el-button v-if="!scope.row.deleted" type="text" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <my-pagination
              :total="tableData.total"
              :currentPage.sync="searchForm.pageNum"
              :page-size.sync="searchForm.pageSize"
              @current-change="onCurrentPageChange">
      </my-pagination>
    </el-card>
    <el-dialog :title="isCreate ? '新建学生' : '学生详情'" :visible.sync="dialogFormVisible" width="70%">
      <el-form :model="studentUserInfo" label-width="150px" ref="ruleForm" :disabled="studentUserInfo.deleted" :rules="rules">
        <el-col :span="12">
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="studentUserInfo.username" :disabled="!isCreate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学生姓名：" prop="name">
            <el-input v-model="studentUserInfo.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号：" prop="schoolNumber">
            <el-input v-model="studentUserInfo.schoolNumber" type="text"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别：">
            <el-radio-group v-model="studentUserInfo.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="家长联系电话：" prop="phone">
            <el-input v-model="studentUserInfo.phone" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
          <!--<el-form-item v-if="isCreate" label="验证码：" prop="verification">-->
            <!--<el-input v-model="studentUserInfo.verification">-->
              <!--<template slot="append">-->
                <!--<div style="cursor: pointer;" :class="{'can-send': countDown === null || countDown <= 0}" @click="getVerificationCode">{{codeMsg}}</div>-->
              <!--</template>-->
            <!--</el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="12">
          <el-form-item label="所在年级：">
            <el-input v-model="studentUserInfo.gradeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所在学校：">
            <el-input v-model="studentUserInfo.schoolName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-if="isCreate" label="密码：" prop="password">
            <el-input v-model="studentUserInfo.password" type="password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-if="isCreate" label="确认密码：" prop="confirmPassword">
            <el-input v-model="studentUserInfo.confirmPassword" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-card v-if="!isCreate" header="课程列表">
        <el-table :data="courseData.list" v-loading="courseData.loading">
          <el-table-column prop="courseName" label="课程名称">
          </el-table-column>
          <el-table-column prop="user.name" label="任课老师">
          </el-table-column>
          <el-table-column prop="" label="上课日期" min-width="180px;">
            <template slot-scope="scope">
              <div>{{scope.row.courseStartDateStr}} 至 {{scope.row.courseEndDateStr}}</div>
            </template>
          </el-table-column>
          <el-table-column label="">
            <template slot-scope="scope">
              <el-button type="text" @click.native="goCourseDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer" v-if="!studentUserInfo.deleted">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createUser">{{isCreate ? '确定' : '修改'}}</el-button>
      </div>
    </el-dialog>
    <!--修改密码-->
    <el-dialog :title="'修改【' + passwordName + '】的密码'" :visible.sync="passwordDialogVisible" width="50%">
      <el-form label-width="120px">
        <el-form-item label="新密码：">
          <el-input v-model="newPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePasswordConfirm">确定</el-button>
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
  import * as classApi from '../../../apis/classApi'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
  export default {
    title: '学生管理',
    name: 'student-list-page',
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
        courseData: {
          loading: true,
          list: [],
          total: 0
        },
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          keyword: ''
        },
        dialogFormVisible: false,
        passwordDialogVisible: false,
        newPassword: null,
        passwordName: null, // 修改用户名
        studentUserInfo: {
          name: '',
          username: '',
          sex: '0', // 性别：0、1
          type: 1, // 用户类型:1学生2教师
          password: '',
          confirmPassword: '',
          phone: null,
          // verification: '', // 验证码
          gradeName: '', // 年级
          schoolName: '', // 学校
          schoolNumber: '' , // 学号
        },
        isCreate: true, // 是否是创建
        countDown: null, // 倒计时
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入学生姓名', trigger: 'blur' }
          ],
          schoolNumber: [
            { required: true, message: '请输入学号', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入家长联系电话', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请输入确认密码', trigger: 'blur' }
          ],
          // verification: [
          //   { required: true, message: '请输入验证码', trigger: 'blur' }
          // ]
        }
      })
    },
    watch: {
      dialogFormVisible(value) {
        if (!value) {
          this.$refs.ruleForm.clearValidate()
        }
      },
      'searchForm.keyword'() {
        this.queryUserList()
      }
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
    computed: {
      ...mapGetters($account.namespace, {
        currentUser: $account.getters.currentUser
      }),
      codeMsg() {
        if (this.countDown === null) return '获取验证码'
        if (this.countDown > 0) return '在' + this.countDown + '秒后可重发验证码'
        if (this.countDown <= 0) return '重新获取验证码'
        return '获取验证码'
      },
      // 超级管理员
      isSuperAdmin() {
        return this.currentUser && this.currentUser.type === '-1'
      },
      // 管理员
      isAdmin() {
        return this.currentUser && this.currentUser.type === '0'
      },
      // 教师
      isTeacher() {
        return this.currentUser && this.currentUser.type === '2'
      },
      // 学生
      isStudent() {
        return this.currentUser && this.currentUser.type === '1'
      },
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
          type: 1, // 用户类型:1学生2教师
        }).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = [...list] || []
        this.tableData.loading = false
      },
      // 获取验证码
      async getVerificationCode() {
        if (this.countDown !== null && this.countDown > 0) return
        if (!this.studentUserInfo.phone) return this.$message({type: 'info', message: '请输入正确的电话号码！'})
        const {code, msg} = await userApi.getCode({phone: this.studentUserInfo.phone}).catch(e => e)
        if (code !== '200') return this.$message({type: 'info', message: msg})
        this.$message({type: 'success', message: '验证码已发送！'})
        this.countDown = 60
        this.startCountDown()
      },
      // 创建/编辑学生
      editUser(info) {
        if (info) {
          this.isCreate = false
          this.studentUserInfo = {...info}
          this.queryClassList(info.accountId)
        } else {
          this.isCreate = true
          this.studentUserInfo = {
            name: '',
            username: '',
            sex: '0', // 性别：0、1
            type: 1, // 用户类型:1学生2教师
            password: '',
            phone: null,
            // verification: '', // 验证码
            gradeName: '', // 年级
            schoolName: '', // 学校
            schoolNumber: '', // 学号
          }
        }
        this.dialogFormVisible = true
      },
      async queryClassList(accountId) {
        // bought:我的课程
        this.courseData.loading = true
        const params = {...this.searchForm, bought: true, studentId: accountId}
        const {data} = await classApi.getClassList(params).catch(e => e)
        const {list, total} = data
        this.courseData.list = list || []
        this.courseData.total = total
        this.courseData.loading = false
      },
      async createUser() {
        this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            if (this.studentUserInfo.password !== this.studentUserInfo.confirmPassword) return this.$message({type: 'info', message: '两次输入密码不一致！'})
            let loadingInstance = Loading.service()
            if (this.isCreate) {
              const {code, msg} = await userApi.addUser(this.studentUserInfo).catch(e=>e)
              loadingInstance.close()
              if (code !== '200') return this.$message(msg)
              this.$message({type: 'success', message: '创建成功！'})
            } else {
              delete this.studentUserInfo.teacherChargeType
              delete this.studentUserInfo.createTime
              delete this.studentUserInfo.updateTime
              const {code, msg} = await userApi.updateUser(this.studentUserInfo).catch(e=>e)
              loadingInstance.close()
              if (code !== '200') return this.$message(msg)
              this.$message({type: 'success', message: '修改学生资料成功！'})
            }
            this.dialogFormVisible = false
            this.queryUserList()
          } else {
            this.$message('请填写必要信息！')
            return false
          }
        })
      },
      // 删除用户
      async deleteUser(user) {
        this.$confirm('是否删除学生【' + user.username + '】?', '提示', {
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
      },
      // 倒计时
      startCountDown() {
        setTimeout(() => {
          if (this.countDown > 0) {
            this.countDown--
            this.startCountDown()
          }
        }, 1000)
      },
      // 跳转到课程详情
      goCourseDetail(info) {
        this.$router.push({path: '/home/class/list', query: {courseId: info.courseId}})
      },
      // 修改密码
      async updatePassword (info) {
        this.passwordName = info.name
        this.updateAccountId = info.accountId
        this.passwordDialogVisible = true
      },
      async updatePasswordConfirm() {
        if (!this.newPassword) return this.$message('请填入新密码')
        const params = {
          accountId: this.updateAccountId,
          newPassword: this.newPassword
        }
        const {code, msg} = await userApi.updatePasswor(params).catch(e => e)
        if (code !== '200') return this.$message('修改密码失败,' + msg)
        this.$message({
          type: 'success',
          message: '修改密码成功!'
        })
        this.passwordDialogVisible = false
        this.newPassword = null
        this.passwordName = null
      }
    },
    mounted() {
      this.queryUserList()
    }
  }
</script>
<style>
  .student-list-page .can-send {
    color: #409EFF;
  }
</style>