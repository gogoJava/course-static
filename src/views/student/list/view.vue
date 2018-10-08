<template>
  <div class="student-list-page">
    <el-card class="box-card">
      <div style="float: right">
        <el-button type="primary" size="small" @click="dialogFormVisible = true">新建学员</el-button>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
        <el-table-column prop="date" label="学号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="所在班级">
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
    <el-dialog title="新建学员" :visible.sync="dialogFormVisible">
      <el-form :model="studentInfo" label-width="80px">
        <el-form-item label="用户名：">
          <el-input v-model="studentInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="studentInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：">
          <el-input v-model="studentInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="教师姓名：">
          <el-input v-model="studentInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="studentInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="验证码：">
          <el-input v-model="studentInfo.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // components
  import MyPagination from '../../../components/pagination/MyPagination.vue'
  // API
  import * as userApi from '../../../apis/userApi'
  export default {
    title: '学员管理',
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
        searchForm: {
          pageNum: 1,
          pageSize: 10,
        },
        dialogFormVisible: false,
        studentInfo: {
          name: ''
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
          type: 1, // 用户类型:1学生2教师
        }).catch(e => e)

        this.tableData.total = total || 0
        this.tableData.list = list || []
        this.tableData.loading = false
      },
    },
    mounted() {
      this.queryUserList()
    }
  }
</script>
<style></style>