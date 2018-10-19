<template>
  <div class="class-attendance-page">
    <el-card class="content">
      <div slot="header" class="clearfix">
        <span style="padding-right: 15px;">课程:</span>
        <el-select v-model="selectedCourseId" filterable placeholder="请选择">
          <el-option v-for="(item, index) in tableData.list" :key="index" :label="item.courseName" :value="item.courseId">
          </el-option>
        </el-select>
      </div>
      <el-col :span="18">
        <el-row :gutter="20" v-for="(item, i) of seatRowsList" :key="i">
        <el-col :span="8">
          <el-checkbox-group v-model="checkboxGroup" size="small">
            <el-checkbox v-for="(item, a) of seatLeftList" :key="a" :label="i + ',' + a" border>座位</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="8">
          <el-checkbox-group v-model="checkboxGroup" size="small">
            <el-checkbox v-for="(item, b) of seatMidList" :key="b" :label="i + ',' + b + seatLayout.seatLeft" border>座位</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="8">
          <el-checkbox-group v-model="checkboxGroup" size="small">
            <el-checkbox v-for="(item, c) of seatRightList" :key="c" :label="i + ',' + c + seatLayout.seatLeft + seatLayout.seatMid" border>座位</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      </el-col>
      <el-col :span="6">
        <div style="padding-bottom: 15px;">课程进度：{{courseCurrent}} / {{courseTotal}}</div>
        <el-card>
          <div slot="header">
            <span>串课名单</span>
            <el-button style="float: right; padding: 3px 0" type="text">添加串课学生</el-button>
          </div>
          <div v-for="(item, index) in courseAttendanceList" :key="index">
            {{item.name}}
          </div>
        </el-card>
      </el-col>
    </el-card>
  </div>
</template>
<script>
// API
  import * as classApi from '../../../apis/classApi'
  import * as courseApi from '../../../apis/courseApi'
  import * as userApi from '../../../apis/userApi'
  // components
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
  export default {
    title: '出勤签到',
    name: 'class-attendance-pagee',
    components: {
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
        selectedCourseId: null,
        seatLayout: null,
        checkboxGroup: [], // 选择的座位
        studentList: [], // 学生列表
        courseTotal: 0, // 总课时
        courseCurrent: 0,
        courseAttendanceList: [], // 考勤列表
      })
    },
    computed: {
      ...mapGetters($account.namespace, {
        currentUser: $account.getters.currentUser
      }),
       // 超级管理员
      isSuperAdmin() {
        return this.currentUser.type === '-1'
      },
      // 管理员
      isAdmin() {
        return this.currentUser.type === '0'
      },
      // 左边座位
      seatLeftList() {
        if (!this.seatLayout) return []
        const list = new Array(this.seatLayout.seatLeft) 
        return list
      },
      // 中间座位
      seatMidList() {
        if (!this.seatLayout) return []
        const list = new Array(this.seatLayout.seatMid) 
        return list
      },
      // 右边座位
      seatRightList() {
        if (!this.seatLayout) return []
        const list = new Array(this.seatLayout.seatRight) 
        return list
      },
      // 座位行数
      seatRowsList() {
        if (!this.seatLayout) return []
        const list = new Array(this.seatLayout.seatRows) 
        return list
      },
    },
    watch: {
      selectedCourseId(value) {
        this.checkboxGroup = []
        this.tableData.list.forEach(element => {
          if (element.courseId === value) {
            this.seatLayout = element.seatLayout
            this.courseTotal = element.courseTotal
            this.courseCurrent = element.courseCurrent
          }
        })
        this.queryCourseAttendance()
      }
    },
    methods: {
      async queryClassList() {
        this.tableData.loading = true
        const params = {...this.searchForm, accountId: this.currentUser.accountId}
        const {data} = await classApi.getClassList(params).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = list || []
        if (list && list.length) {
          this.selectedCourseId = list[0].courseId
        }
        this.tableData.loading = false
      },
      // 获取考勤列表
      async queryCourseAttendance() {
        const {data} = await courseApi.getCourseAttendance({
          courseCurrent: this.courseCurrent,
          courseId: this.selectedCourseId, // 用户类型:1学生2教师
        }).catch(e => e)
        this.courseAttendanceList = data.list || []
      },
      // 获取学生列表
      async queryStudentList() {
        const {data} = await userApi.getUserList({
          pageNum: 1,
          pageSize: 10,
          type: 1, // 用户类型:1学生2教师
        }).catch(e => e)
        this.studentList = data.list || []
      },
    },
    mounted() {
      this.queryClassList()
      this.queryStudentList()
    }
  }
</script>
<style>
.class-attendance-page .content {
  min-width: 1150px;
  overflow-x: auto;
  min-height: 560px;
}
.class-attendance-page .content .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>