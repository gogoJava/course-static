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
              <!-- <el-menu-item index="/home/class/edit">修改课程</el-menu-item> -->
              <el-menu-item index="/home/class/attendance">出勤签到</el-menu-item>
              <el-menu-item index="/home/class/release">发布课程</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-if="isTeacher || isStudent" index="/home/class/list">
            <icon-font icon="banjixinxi" class="icon" size="24px"></icon-font>
            <span slot="title">我的课程</span>
          </el-menu-item>
          <el-menu-item v-if="isStudent" index="/home/class/list/pay">
            <icon-font icon="banjixinxi" class="icon" size="24px"></icon-font>
            <span slot="title">课程支付管理</span>
          </el-menu-item>
          <el-menu-item v-if="isTeacher" index="/home/class/attendance">
            <icon-font icon="banjixinxi" class="icon" size="24px"></icon-font>
            <span slot="title">出勤签到</span>
          </el-menu-item>
          <el-menu-item v-if="isAdmin || isSuperAdmin" index="/home/student/list">
            <icon-font icon="xuesheng" class="icon" size="24px"></icon-font>
            <span slot="title">学员管理</span>
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
          <el-menu-item v-if="isTeacher" index="/home/income/detail">
            <icon-font icon="caiwu" class="icon" size="24px"></icon-font>
            <span slot="title">收入详情</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="nav-toggle" style="float: left;">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon-more"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="isAdmin" @click.native="$router.push('/home/class/create')">新建课程</el-dropdown-item>
                <!-- <el-dropdown-item @click.native="$router.push('/home/class/edit')">修改课程</el-dropdown-item> -->
                <el-dropdown-item v-if="isAdmin" @click.native="$router.push('/home/class/attendance')">出勤签到</el-dropdown-item>
                <el-dropdown-item v-if="isAdmin" @click.native="$router.push('/home/class/release')">发布课程</el-dropdown-item>
                <el-dropdown-item v-if="isAdmin" @click.native="$router.push('/home/student/list')">学员管理</el-dropdown-item>
                <el-dropdown-item v-if="isAdmin" @click.native="$router.push('/home/teacher/list')">教师管理</el-dropdown-item>
                <el-dropdown-item v-if="isAdmin" @click.native="$router.push('/home/administrators/list')">管理员</el-dropdown-item>
                <el-dropdown-item v-if="isAdmin" @click.native="$router.push('/home/course/order/refund/list')">退费订单</el-dropdown-item>
                <el-dropdown-item v-if="isAdmin" @click.native="$router.push('/home/course/order/unpaid/list')">未支付订单</el-dropdown-item>
                <el-dropdown-item v-if="isAdmin" @click.native="$router.push('/home/course/order/paid/list')">支付成功订单</el-dropdown-item>
                <el-dropdown-item v-if="isTeacher" @click.native="$router.push('/home/income/detail')">收入详情</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
          <div>
            <!--<span class="log-out" @click="logout">退出登录</span>-->
            <el-dropdown trigger="click" class="log-out">
              <span>{{currentUser ? currentUser.username : '用户名'}}</span>
              <i class="el-icon-caret-bottom"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logoutOnClick">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import IconFont from '../../../components/icon-font/IconFont'
  // store
  import {mapGetters,mapActions} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
  // import * as accountApi from '../../../apis/accountApi'
  export default {
    name: 'my-menu',
    components: {
      IconFont
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
        return this.currentUser.type === '-1'
      },
      // 管理员
      isAdmin() {
        return this.currentUser.type === '0'
      },
      // 教师
      isTeacher() {
        return this.currentUser.type === '2'
      },
      // 学生
      isStudent() {
        return this.currentUser.type === '1'
      },
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
    line-height: 60px;
  }
  .el-menu-item.is-active {
    background: #1f2d3d !important;
  }
</style>
