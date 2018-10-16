<template>
  <div class="class-list-page">
    <el-card class="box-card">
      <div v-if="isSuperAdmin" style="float: right">
        <el-button type="primary" size="small" @click="$router.push('/home/class/create')">新建课程</el-button>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
        <el-table-column prop="courseName" label="课程名称" width="180">
        </el-table-column>
        <el-table-column prop="user.name" label="任课教师" width="180">
        </el-table-column>
        <el-table-column prop="courseStartTime" label="上课时间">
          <template slot-scope="scope">
            <span>{{$moment(scope.row.courseStartTime).format('YYYY-MM-DD')}} 至 {{$moment(scope.row.courseEndTime).format('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="courseTotal" label="总课时" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click.native="$router.push('/home/class/edit/' + scope.row.courseId)">详情</el-button>
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
  </div>
</template>
<script>
  // components
  import MyPagination from '../../../components/pagination/MyPagination.vue'
  // API
  import * as classApi from '../../../apis/classApi'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
  export default {
    title: '课程列表',
    name: 'class-list-page',
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
      })
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
    },
    methods: {
      onCurrentPageChange(page) {
        this.searchForm.pageNum = page
        this.queryClassList()
      },
      async queryClassList() {
        this.tableData.loading = true
        const params = {...this.searchForm, accountId: this.currentUser.accountId}
        const {data} = await classApi.getClassList(params).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = list || []
        this.tableData.loading = false
      },
    },
    mounted() {
      this.queryClassList()
    }
  }
</script>
<style></style>