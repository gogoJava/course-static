<template>
  <div class="teacher-list-page">
    <el-card class="box-card">
      <div style="float: right">
        <el-button type="primary" size="small" @click="dialogFormVisible = true">新建教师</el-button>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
        <el-table-column prop="date" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="name" label="教师姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="注册时间">
        </el-table-column>
        <el-table-column prop="address" label="状态">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="dialogFormVisible = true">详情</el-button>
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
    <el-dialog title="新建教师" :visible.sync="dialogFormVisible">
      <el-form :model="studentInfo" label-width="120px">
        <el-form-item label="用户名：">
          <el-input v-model="studentInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="studentInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：">
          <el-input v-model="studentInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="教师姓名：">
          <el-input v-model="studentInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码：">
          <el-input v-model="studentInfo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="studentInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="验证码：">
          <el-input v-model="studentInfo.verification"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="getVerificationCode">获取验证码</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createUser">确 定</el-button>
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
        studentInfo: {
          name: '',
          username: '',
          type: 2, // 用户类型:1学生2教师
          password: '',
          phone: null,
          verification: '', // 验证码
          age: 18,
          cardNum: null, // 身份证号码
        }
      })
    },
    methods: {
      onCurrentPageChange(page) {
        this.searchForm.pageNum = page
        this.queryUserList()
      },
      async queryUserList() {
        this.tableData.loading = true
        const {total, list} = await userApi.getUserList({
          ...this.searchForm,
          type: 2, // 用户类型:1学生2教师
        }).catch(e => e)

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
      async createUser() {
        let loadingInstance = Loading.service()
        const {code, msg, data} = await userApi.addUser(this.studentInfo).catch(e=>e)
        console.log('data', data)
        if (code !== '200') return this.$message(msg)
        loadingInstance.close()
        this.dialogFormVisible = false
      }
    },
    mounted() {
      this.queryUserList()
    }
  }
</script>
<style></style>