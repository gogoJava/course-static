<template>
  <div class="login-container">

    <div>
      <img class="logo-img" :src="logoUrl"/>
    </div>
    <div class="title-container">
      <img class="title-img" :src="logoTitleUrl"/>
    </div>
    <div class="login-info">
      <div><input v-model="loginForm.username" placeholder="请输入用户名" autocomplete="off"/></div>
      <div><input type="password" v-model="loginForm.password" placeholder="请输入密码" autocomplete="off"/></div>
      <div style="padding-top: 60px;"><span class="login-btn" @click="handleLogin">登录</span></div>
    </div>

  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
// import LangSelect from '@/components/LangSelect'
import IconFont from '../../components/icon-font/IconFont'
// api
// import * as accountApi from '../../apis/accountApi'
// store
import {mapActions,mapGetters} from 'vuex'
import * as $accountStore from '../../store/modules/account/types'

export default {
  name: 'Login',
  components: { IconFont },
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (value && value.length !== 11) {
      //   return callback(new Error('必须是11位手机号码'))
      // }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      // if (value.length < 6) {
      //   callback(new Error('The password can not be less than 6 digits'))
      // } else {
      //   callback()
      // }
      callback()
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      inputName: null,
      name: null,
      loginRules: {
        username: [{ required: true, trigger: 'change', validator: validateUsername }],
        password: [{ required: true, trigger: 'change', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      logoUrl: require('../../assets/logo.png'),
      logoTitleUrl: require('../../assets/login-title.png')
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    // 'loginForm.username'(value) {
    //   this.loginForm.password = ''
    // }
  },
  computed: {
      ...mapGetters($accountStore.namespace, {
        currentUser: $accountStore.getters.currentUser
      }),
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
  created() {
    document.onkeydown = async () =>{
      const key = window.event.keyCode
      if(key === 13){
        this.handleLogin()
      }
    }
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    ...mapActions($accountStore.namespace, {
      login: $accountStore.actions.login,
    }),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    async handleLogin() {
      if (!this.loginForm.username) return this.$message('请输入用户名')
      if (!this.loginForm.password) return this.$message('请输入密码')
      this.loading = true
      const params = {
        userName: this.loginForm.username,
        password: this.loginForm.password
      }
      const {code, msg, data} = await this.login(params).catch(e => e)
      this.loading = false
      if (code !== '200') return this.$message('登录失败，' + msg)
      let url = '/home'
      if (data.type === '2') {
        // 老师
        url = '/home/class/teacher/list'
      }
      if (data.type === '1') {
        // 学生
        url = 'home/student/class/my'
      }
      this.$router.push(url)
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url('../../assets/login-background.png') no-repeat;
  background-size:100% 100%;
  .title-container {
    text-align: center;
    padding-top: 120px;
    .title-img {
      width: 240px;
    }
  }
  .logo-img {
    width: 360px;
    padding-top: 30px;
    padding-left: 30px;
  }
  .login-info {
    text-align: center;
    padding: 60px 35px 15px 35px;
    input {
      border: 0;
      border-bottom: 1px solid #ffffff;
      width: 360px;
      height: 56px;
      background: none !important;
      color: #ffffff;
      outline: none;
      padding: 0 15px;
      font-size: 18px;
    }
    input::-webkit-input-placeholder {
      color: #ffffff;
      opacity: 0.8;
      font-size: 16px;
    }
    :-webkit-autofill {
      -webkit-text-fill-color: #fff !important;
      transition: background-color 5000s ease-in-out 0s;
    }
    .login-btn {
      padding: 8px 40px;
      color: #ffffff;
      border: 1px solid #ffffff;
      border-radius: 4px;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
    }
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    min-width: 300px;
    max-width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
}
</style>
