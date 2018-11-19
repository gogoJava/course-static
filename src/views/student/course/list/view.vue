<template>
  <div class="class-list-page">
    <el-card class="box-card">
      <div v-if="isSuperAdmin" style="float: right">
        <el-button type="primary" size="small" @click="$router.push('/home/class/create')">新建课程</el-button>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
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
        <el-table-column v-if="isStudent" prop="bought" label="购买状态">
          <template slot-scope="scope">
            <span v-if="!scope.row.orderStatus">{{scope.row.bought ? '已购买' : '未购买'}}</span>
            <span v-if="scope.row.orderStatus">{{scope.row.orderStatus | orderStatusMsg}}</span>
          </template>
        </el-table-column>
        <el-table-column label="">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.orderStatus === '0'" @click.native="goPay(scope.row)">去支付</el-button>
            <el-button v-if="!scope.row.orderStatus && !scope.row.bought && (scope.row.courseStatus === '1' || scope.row.courseStatus === '2')" type="text" @click.native="goPay(scope.row)">去下单购买</el-button>
            <!--<el-button type="text" @click.native="courseSignOnclick(scope.row)">签到</el-button>-->
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
  import MyPagination from '../../../../components/pagination/MyPagination.vue'
  // API
  import * as classApi from '../../../../apis/classApi'
  import * as courseApi from '../../../../apis/courseApi'
  // import * as courseOrderApi from '../../../../apis/courseOrderApi'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../../store/modules/account/types'
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
        dialogVisible: false
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
      orderStatusMsg(status) {
        // 状态(0未支付1成功2申请退款3退款)
        let msg = ''
        switch (status) {
          case '0':
            msg = '未支付'
            break
          case '1':
            msg = '支付成功'
            break
          case '2':
            msg = '申请退款'
            break
          case '3':
            msg = '已退款'
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
      // 去购买
      async goPay(courseInfo) {
        this.$router.push({path: '/home/class/order/pay', query: {courseId: courseInfo.courseId}})
        // this.$confirm('是否确定购买该课程【' + courseInfo.courseName + '】?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(async () => {
        //   // const {code, msg} = await courseOrderApi.createCourseOrder({courseId: courseInfo.courseId}).catch(e => e)
        //   // if (code !== '200') return this.$message('下单失败，' + msg)
        //   // this.$message({type: 'success', message: '下单成功！请去完成支付！'})
        //   this.$router.push({path: '/home/class/order/pay', query: {courseId: courseInfo.courseId}})
        //   // this.queryClassList()
        // }).catch(() => {})
      },
      // 签到
      async courseSignOnclick(courseInfo) {
        const {code, msg} = await courseApi.courseSign({courseId: courseInfo.courseId}).catch(e => e)
        if (code !== '200') return this.$message('签到失败，' + msg)
        this.$message({type: 'success', message: '签到成功！'})
      },
    },
    mounted() {
      this.queryClassList()
    }
  }
</script>
<style></style>