<template>
  <div class="class-release-page">
    <el-card class="box-card">
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
         <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="courseName" label="课程名称">
        </el-table-column>
        <el-table-column prop="user.name" label="任课教师">
        </el-table-column>
        <el-table-column prop="courseStartTime" label="上课时间">
          <template slot-scope="scope">
            <span>{{$moment(scope.row.courseStartTime).format('YYYY-MM-DD')}} 至 {{$moment(scope.row.courseEndTime).format('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="courseTotal" label="总课时">
        </el-table-column>
        <el-table-column prop="courseStatus" label="状态">
           <template slot-scope="scope">
            <span>{{scope.row.courseStatus | courseStatusMsg}}</span>
          </template>
        </el-table-column>
        <el-table-column label="">
          <template slot-scope="scope">
            <el-button v-if="scope.row.courseStatus === '0'" type="text" @click.native="publishCourseOnclick(scope.row)">发布</el-button>
            <el-button v-if="scope.row.courseStatus === '1'" type="text" @click.native="deleteCourseOnclick(scope.row)">删除</el-button>
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
  import * as courseApi from '../../../apis/courseApi'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
  export default {
    title: '发布课程',
    name: 'class-release-page',
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
    watch: {
      'searchForm.pageSize'() {
        this.queryClassList()
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
    },
    filters: {
      courseStatusMsg(status) {
        // 状态（-1取消0新建未发布1已发布2进行中3结束）
        let msg = ''
        switch (status) {
          case '-1':
            msg = '已取消'
            break
          case '0':
            msg = '未发布'
            break
          case '1':
            msg = '已发布'
            break
          case '2':
            msg = '进行中'
            break
          case '3':
            msg = '已结束'
            break
        }
        return msg
      },
    },
    methods: {
      onCurrentPageChange(page) {
        this.searchForm.pageNum = page
        this.queryClassList()
      },
      async queryClassList() {
        this.tableData.loading = true
        let params = null
        if (this.isSuperAdmin || this.isAdmin) {
          params = {...this.searchForm}
        } else if (this.isTeacher) {
          params = {...this.searchForm, accountId: this.currentUser.accountId}
        } else if (this.isStudent) {
          params = {...this.searchForm}
        }
        const {data} = await classApi.getClassList(params).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = list || []
        this.tableData.loading = false
      },
      // 发布课程
      async publishCourseOnclick(courseInfo) {
        this.$confirm('确定要发布课程【' + courseInfo.courseName + '】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code, msg} = await courseApi.publishCourse({courseId: courseInfo.courseId}).catch(e => e)
          if (code !== '200') return this.$message('发布课程失败，' + msg)
          this.$message({type: 'success', message: '发布课程成功！'})
          this.queryClassList()
        }).catch(() => {})
      },
      // 删除课程
      async deleteCourseOnclick(courseInfo) {
        this.$confirm('确定要删除【' + courseInfo.courseName + '】课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code, msg} = await courseApi.deleteCourse(courseInfo.courseId).catch(e => e)
          if (code !== '200') return this.$message('发布课程失败，' + msg)
          this.$message({type: 'success', message: '删除课程成功！'})
          this.queryClassList()
        }).catch(() => {})
      }
    },
    mounted() {
      this.queryClassList()
    }
  }
</script>
<style></style>