<template>
  <div class="admin-list-page">
    <el-card class="box-card">
      <div style="float: right">
        <el-button type="primary" size="small" @click="editUser()">新建管理员</el-button>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
        <el-table-column prop="username" label="管理员账号">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话">
          <template slot-scope="scope">
            <span>{{scope.row.phone || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cardNum" label="身份证号码">
          <template slot-scope="scope">
            <span>{{scope.row.cardNum || '--'}}</span>
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
              :currentPage.sync="searchForm.page"
              :page-size.sync="searchForm.pageSize"
              @current-change="onCurrentPageChange">
      </my-pagination>
    </el-card>
    <el-dialog :title="isCreate ? '新建管理员' : '管理员详情'" :visible.sync="dialogFormVisible" width="70%">
      <el-form :model="userInfo" label-width="120px" :disabled="userInfo.deleted">
        <el-form-item label="管理员账号：">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="userInfo.phone" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码：">
          <el-input v-model="userInfo.cardNum"></el-input>
        </el-form-item>
        <el-form-item v-if="isCreate" label="验证码：">
          <el-input v-model="userInfo.verification">
            <template slot="append">
              <div style="cursor: pointer;" :class="{'can-send': countDown === null || countDown <= 0}" @click="getVerificationCode">{{codeMsg}}</div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="isCreate" label="密码：">
          <el-input v-model="userInfo.password" type="password"></el-input>
        </el-form-item>
        <el-form-item v-if="isCreate" label="确认密码：">
          <el-input v-model="userInfo.confirmPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!userInfo.deleted">
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
  export default {
    title: '管理员管理',
    name: 'admin-list-page',
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
        passwordDialogVisible: false,
        newPassword: null,
        passwordName: null, // 修改用户名
        userInfo: {
          name: '',
          username: '',
          password: '',
          confirmPassword: '',
          phone: null,
          verification: '', // 验证码
          cardNum: null, // 身份证号码
        },
        isCreate: true, // 是否是创建
        countDown: null, // 倒计时
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
    computed: {
      codeMsg() {
        if (this.countDown === null) return '获取验证码'
        if (this.countDown > 0) return '在' + this.countDown + '秒后可重发验证码'
        if (this.countDown <= 0) return '重新获取验证码'
        return '获取验证码'
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
          type: 0, // 用户类型:1学生2教师0管理员
        }).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = list || []
        this.tableData.loading = false
      },
      // 获取验证码
      async getVerificationCode() {
        if (this.countDown !== null && this.countDown > 0) return
        if (!this.userInfo.phone) return this.$message({type: 'info', message: '请输入正确的电话号码！'})
        const {code, msg} = await userApi.getCode({phone: this.userInfo.phone}).catch(e => e)
        if (code !== '200') return this.$message({type: 'info', message: msg})
        this.$message({type: 'success', message: '验证码已发送！'})
        this.countDown = 60
        this.startCountDown()
      },
      // 创建/编辑学生
      editUser(info) {
        if (info) {
          this.isCreate = false
          this.userInfo = {...info}
        } else {
          this.isCreate = true
          this.userInfo = {
            name: '',
            username: '',
            password: '',
            phone: null,
            verification: '', // 验证码
            cardNum: null, // 身份证号码
          }
        }
        this.dialogFormVisible = true
      },
      async createUser() {
        if (this.userInfo.password !== this.userInfo.confirmPassword) return this.$message({type: 'info', message: '两次输入密码不一致！'})
        let loadingInstance = Loading.service()
        if (this.isCreate) {
          const {code, msg} = await userApi.addAdmin(this.userInfo).catch(e=>e)
          loadingInstance.close()
          if (code !== '200') return this.$message(msg)
          this.$message({type: 'success', message: '创建成功！'})
        } else {
          const params = {
            accountId: this.userInfo.accountId,
            cardNum: this.userInfo.cardNum,
            name: this.userInfo.name,
            phone: this.userInfo.phone,
            username: this.userInfo.username,
            type: '0'
          }
          const {code, msg} = await userApi.updateUser(params).catch(e=>e)
          loadingInstance.close()
          if (code !== '200') return this.$message(msg)
          this.$message({type: 'success', message: '修改管理员资料成功！'})
        }
        this.dialogFormVisible = false
        this.queryUserList()
      },
      // 删除用户
      async deleteUser(user) {
        this.$confirm('是否删除管理员【' + user.username + '】?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
      // 修改密码
      async updatePassword (info) {
        this.passwordName = info.username
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
  .admin-list-page .can-send {
    color: #409EFF;
  }
</style>