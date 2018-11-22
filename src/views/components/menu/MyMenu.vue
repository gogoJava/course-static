<template>
  <div class="navbar">
    <el-container>
      <el-aside width="200px" class="nav-list">
        <el-menu
                :default-active="defaultActive"
                class="el-menu-vertical-demo left-menu"
                background-color="#304156"
                :router="true"
                text-color="#fff"
                active-text-color="#ffd04b">
          <el-submenu v-if="isAdmin || isSuperAdmin" index="/home/class">
            <template slot="title">
              <icon-font icon="banjixinxi" class="icon" size="24px"></icon-font>
              <span>课程管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/home/class/list">课程信息</el-menu-item>
              <el-menu-item index="/home/class/update">修改课程</el-menu-item>
              <el-menu-item index="/home/class/attendance">出勤签到</el-menu-item>
              <el-menu-item index="/home/class/release">发布课程</el-menu-item>
              <el-menu-item v-if="isSuperAdmin" index="/home/course/type/list">课程类型</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-if="isTeacher" index="/home/class/teacher/list">
            <icon-font icon="banjixinxi" class="icon" size="24px"></icon-font>
            <span slot="title">我的课程</span>
          </el-menu-item>
          <el-menu-item v-if="isStudent" index="/home/student/class/my">
            <icon-font icon="caiwu" class="icon" size="24px"></icon-font>
            <span slot="title">我的课程</span>
          </el-menu-item>
          <el-menu-item v-if="isStudent" index="/home/student/class/all">
            <icon-font icon="banjixinxi" class="icon" size="24px"></icon-font>
            <span slot="title">全部课程</span>
          </el-menu-item>
          <el-menu-item v-if="isStudent" index="/home/class/order/pay">
            <icon-font icon="banjixinxi" class="icon" size="24px"></icon-font>
            <span slot="title">课程支付管理</span>
          </el-menu-item>
          <el-menu-item v-if="isTeacher" index="/home/teacher/class/attendance">
            <icon-font icon="banjixinxi" class="icon" size="24px"></icon-font>
            <span slot="title">出勤签到</span>
          </el-menu-item>
          <el-menu-item v-if="isAdmin || isSuperAdmin" index="/home/student/list">
            <icon-font icon="xuesheng" class="icon" size="24px"></icon-font>
            <span slot="title">学生管理</span>
          </el-menu-item>
          <el-menu-item v-if="isSuperAdmin" index="/home/teacher/list">
            <icon-font icon="jiaolian1" class="icon" size="24px"></icon-font>
            <span slot="title">教师管理</span>
          </el-menu-item>
          <el-menu-item v-if="isSuperAdmin" index="/home/administrators/list">
            <icon-font icon="yonghu" class="icon" size="24px"></icon-font>
            <span slot="title">管理员</span>
          </el-menu-item>
          <el-submenu v-if="isSuperAdmin" index="/home/course/order">
            <template slot="title">
              <icon-font icon="kecheng-" class="icon" size="24px"></icon-font>
              <span slot="title">课程订单</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/home/course/order/refund/list">退费订单</el-menu-item>
              <el-menu-item index="/home/course/order/unpaid/list">未支付订单</el-menu-item>
              <el-menu-item index="/home/course/order/paid/list">支付成功订单</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-if="isSuperAdmin" index="/home/income/detail">
            <icon-font icon="caiwu" class="icon" size="24px"></icon-font>
            <span slot="title">收入详情</span>
          </el-menu-item>
          <el-menu-item v-if="isTeacher" index="/home/income/teacher/detail">
            <icon-font icon="caiwu" class="icon" size="24px"></icon-font>
            <span slot="title">个人信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="line-height: 50px;height: 50px;">
          <span class="nav-toggle" style="float: left;">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon-more"></i></span>
              <el-dropdown-menu slot="dropdown">
                <!--超级管理员-->
                <el-dropdown-item v-if="isSuperAdmin" @click.native="$router.push('/home/teacher/list')">教师管理</el-dropdown-item>
                <el-dropdown-item v-if="isSuperAdmin" @click.native="$router.push('/home/administrators/list')">管理员</el-dropdown-item>
                <el-dropdown-item v-if="isSuperAdmin" @click.native="$router.push('/home/course/order/refund/list')">退费订单</el-dropdown-item>
                <el-dropdown-item v-if="isSuperAdmin" @click.native="$router.push('/home/course/order/unpaid/list')">未支付订单</el-dropdown-item>
                <el-dropdown-item v-if="isSuperAdmin" @click.native="$router.push('/home/course/order/paid/list')">支付成功订单</el-dropdown-item>
                <el-dropdown-item v-if="isSuperAdmin" @click.native="$router.push('/home/income/detail')">收入详情</el-dropdown-item>
                <!--超级管理员或者管理员-->
                <el-dropdown-item v-if="isAdmin || isSuperAdmin" @click.native="$router.push('/home/class/list')">课程信息</el-dropdown-item>
                <el-dropdown-item v-if="isAdmin || isSuperAdmin" @click.native="$router.push('/home/class/update')">修改课程</el-dropdown-item>
                <el-dropdown-item v-if="isAdmin || isSuperAdmin" @click.native="$router.push('/home/class/attendance')">出勤签到</el-dropdown-item>
                <el-dropdown-item v-if="isAdmin || isSuperAdmin" @click.native="$router.push('/home/class/release')">发布课程</el-dropdown-item>
                <el-dropdown-item v-if="isAdmin || isSuperAdmin" @click.native="$router.push('/home/student/list')">学生管理</el-dropdown-item>
                <!--教师-->
                <el-dropdown-item v-if="isTeacher" @click.native="$router.push('/home/teacher/class/list')">我的课程</el-dropdown-item>
                <el-dropdown-item v-if="isTeacher" @click.native="$router.push('/home/teacher/class/attendance')">出勤签到</el-dropdown-item>
                <el-dropdown-item v-if="isTeacher" @click.native="$router.push('/home/income/teacher/detail')">个人信息</el-dropdown-item>
                <!--学生-->
                <el-dropdown-item v-if="isStudent" @click.native="$router.push('/home/student/class/my')">我的课程</el-dropdown-item>
                <el-dropdown-item v-if="isStudent" @click.native="$router.push('/home/student/class/all')">全部课程</el-dropdown-item>
                <el-dropdown-item v-if="isStudent" @click.native="$router.push('/home/class/order/pay')">课程支付管理</el-dropdown-item>
                <!--<el-dropdown-item v-if="isStudent" @click.native="$router.push('/home/student/class/my')">座位表</el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
          </span>
          <div>
            <!--<span class="log-out" @click="logout">退出登录</span>-->
            <el-dropdown trigger="click" class="log-out">
              <span>{{currentUser ? currentUser.name || currentUser.username : '用户名'}}</span>
              <i class="el-icon-caret-bottom"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logoutOnClick">退出登录</el-dropdown-item>
                <el-dropdown-item @click.native="dialogVisible = true">修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main v-if="isMobile" style="padding: 0">
          <router-view></router-view>
        </el-main>
        <el-main v-if="!isMobile">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!--修改密码-->
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="50%">
      <el-form :model="password" label-width="120px">
        <el-form-item label="旧密码：">
          <el-input v-model="password.old" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码：">
          <el-input v-model="password.new" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePassword">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import IconFont from '../../../components/icon-font/IconFont'
  import * as userApi from '../../../apis/userApi'
  // store
  import {mapGetters,mapActions} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
  // import * as accountApi from '../../../apis/accountApi'
  export default {
    name: 'my-menu',
    components: {
      IconFont
    },
    data() {
      return {
        dialogVisible: false,
        password: {
          old: null, // 旧密码
          new: null // 新密码
        }
      }
    },
    computed: {
      ...mapGetters($account.namespace, {
        currentUser: $account.getters.currentUser
      }),
      defaultActive() {
        return this.$route.path
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
      isMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
      }
    },
    methods: {
      ...mapActions($account.namespace, {
        logout: $account.actions.logout,
      }),
      logoutOnClick() {
        this.$confirm('是否退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code} = await this.logout().catch(e => e)
          if (code === '200') {
            this.$router.push('/login')
          }
        }).catch(() => {})
      },
      // 修改密码
      async updatePassword() {
        if (!this.password.old) return this.$message('请填入旧密码')
        if (!this.password.new) return this.$message('请填入新密码')
        const params = {
          accountId: this.currentUser.accountId,
          newPassword: this.password.new,
          oldPassword: this.password.old
        }
        const {code, msg} = await userApi.updatePasswor(params).catch(e => e)
        if (code !== '200') return this.$message('修改密码失败,' + msg)
        this.$alert('修改密码成功，请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.$router.push('/login')
          }
        })
      }
    }
  }
</script>

<style>
  .navbar{
    /*background-color: #34495E;*/
    height: 100%;
    display: block;
  }
  .el-container {
    height: 100%;
  }
  .el-container .log-out {
    float: right;
    cursor: pointer;
  }
  .navbar .nav-list{
    z-index: 0;
    display: block;
    height: 100%;

  }
  .navbar .icon {
    padding-right: 10px;
  }
  .left-menu {
    height: 100%;
  }
  .navbar .nav-toggle{
    display: none;
  }
  @media screen and (max-width: 600px) {
    .navbar .nav-toggle{
      display: block;
    }
    .navbar .nav-list{
      display: none;
      margin-left: 0px;
    }
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 50px;
  }
  .el-menu-item.is-active {
    background: #1f2d3d !important;
  }
</style>
