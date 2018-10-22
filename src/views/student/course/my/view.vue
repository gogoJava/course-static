<template>
  <div class="class-attendance-page">
    <el-card class="content">
      <div slot="header" class="clearfix">
        <span style="padding-right: 15px;">课程:</span>
        <el-select v-model="selectedCourseId" filterable placeholder="请选择">
          <el-option v-for="(item, index) in tableData.list" :key="index" :label="item.courseName" :value="item.courseId">
          </el-option>
        </el-select>
        <span style="padding-bottom: 15px;padding-left: 30px;">课程进度：{{courseCurrent}} / {{courseTotal}}</span>
      </div>
      <el-col :span="24">
        <el-row :gutter="20" v-for="(item, i) of seatRowsList" :key="i">
        <el-col :span="8">
          <el-checkbox-group v-model="checkboxGroup" size="small">
            <el-checkbox class="chenk-box" v-for="(item, a) of seatLeftList" :key="a" :label="i + ',' + a" border>座位座</el-checkbox>
          </el-checkbox-group>
          <el-col class="seat-icon" :gutter="0" :span="8" v-for="(item, a) of seatLeftList" :key="a">
            <icon-font icon="yizi" class="icon" :class="{'icon-selected': checkboxGroup.indexOf((i + ',' + a))}" size="32px"></icon-font>
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-checkbox-group v-model="checkboxGroup" size="small">
            <el-checkbox class="chenk-box" v-for="(item, b) of seatMidList" :key="b" :label="i + ',' + b + seatLayout.seatLeft" border>座位</el-checkbox>
          </el-checkbox-group>
          <el-col class="seat-icon" :gutter="0" :span="8" v-for="(item, b) of seatMidList" :key="b">
            <icon-font icon="yizi" class="icon" size="32px"></icon-font>
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-checkbox-group v-model="checkboxGroup" size="small">
            <el-checkbox class="chenk-box" v-for="(item, c) of seatRightList" :key="c" :label="i + ',' + c + seatLayout.seatLeft + seatLayout.seatMid" border>座位</el-checkbox>
          </el-checkbox-group>
          <el-col class="seat-icon" :gutter="0" :span="8" v-for="(item, c) of seatRightList" :key="c">
            <icon-font icon="yizi" class="icon" size="32px"></icon-font>
          </el-col>
        </el-col>
      </el-row>
      </el-col>
    </el-card>
  </div>
</template>
<script>
// API
  import * as classApi from '../../../../apis/classApi'
  // import * as userApi from '../../../../apis/userApi'
  // components
  import IconFont from '../../../../components/icon-font/IconFont'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../../store/modules/account/types'
  export default {
    title: '我的课程',
    name: 'class-my',
    components: {
      IconFont
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
        additionalStudent: null
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
      // 教师
      isTeacher() {
        return this.currentUser.type === '2'
      },
      // 学生
      isStudent() {
        return this.currentUser.type === '1'
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
      },
      checkboxGroup() {
        console.log('checkboxGroup', this.checkboxGroup)
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
      // 获取学生列表
      // async queryStudentList() {
      //   const {data} = await userApi.getUserList({
      //     pageNum: 1,
      //     pageSize: 10,
      //     type: 1, // 用户类型:1学生2教师
      //   }).catch(e => e)
      //   this.studentList = data.list || []
      // },
    },
    mounted() {
      this.queryClassList()
    }
  }
</script>
<style>
.class-attendance-page .content {
  min-width: 1100px;
  overflow-x: auto;
  min-height: 900px;
}
.class-attendance-page .content .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
}
.class-attendance-page .chenk-box {
  width: 100px;
}
.class-attendance-page .seat-icon {
  width: 110px;
  text-align: center;
  padding-top: 15px;
}
.class-attendance-page .seat-icon .icon {
  color: #606266;
}
.class-attendance-page .seat-icon .icon-selected {
   /*color: #409EFF;*/
}
</style>