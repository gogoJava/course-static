<template>
  <div class="class-teacher-page">
    <el-card class="content">
      <div slot="header" class="clearfix">
        <div>
          <span style="padding-right: 15px;">课程:</span>
          <el-select v-model="selectedCourseId" filterable placeholder="请选择">
            <el-option v-for="(item, index) in tableData.list" :key="index" :label="item.courseName" :value="item.courseId">
            </el-option>
          </el-select>
          <span style="padding-bottom: 15px; padding-left: 15px;">课程进度：{{courseCurrent}} / {{courseTotal}}</span>
          <span>
            <span v-if="courseStatus === '3'" style="font-weight: bold;">课程已结束</span>
            <!--<el-button v-if="courseStatus === '1' || courseStatus === '2'" style="position: relative;left: 30px;" type="danger" @click.native="endCourseOnclick">结束课程</el-button>-->
          </span>
        </div>
        <div style="font-size: 24px;font-weight: bold;padding: 15px;">
          <div>上课日期：{{courseStartDateStr + ' 至 ' + courseEndDateStr}}</div>
          <div>上课时间：{{classStartTimeStr + ' 至 ' + classEndTimeStr}}</div>
        </div>
      </div>
      <el-col :span="24">
        <el-row :gutter="20" v-for="(item, i) of seatRowsList" :key="i">
        <el-col :span="8">
          <el-checkbox-group v-model="checkboxGroup" :disabled="isTeacher || isStudent">
            <el-checkbox class="chenk-box" v-for="(item, a) of seatLeftList" :key="a" :label="(a + ',' + i)" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, a) of seatLeftList" :key="a">
            <img :src="(item && item[i]) ? checkedSeatImgUrl : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-checkbox-group v-model="checkboxGroup" :disabled="isTeacher || isStudent">
            <el-checkbox class="chenk-box" v-for="(item, b) of seatMidList" :key="b" :label="(b + seatLayout.seatLeft) + ',' + i" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, b) of seatMidList" :key="b">
            <img :src="(item && item[i]) ? checkedSeatImgUrl : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-checkbox-group v-model="checkboxGroup" :disabled="isTeacher || isStudent">
            <el-checkbox class="chenk-box" v-for="(item, c) of seatRightList" :key="c" :label="(c + seatLayout.seatLeft + seatLayout.seatMid) + ',' + i" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, c) of seatRightList" :key="c">
            <img :src="(item && item[i]) ? checkedSeatImgUrl : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
          </el-col>
        </el-col>
      </el-row>
      </el-col>
    </el-card>
  </div>
</template>
<script>
// API
  import * as classApi from '../../../apis/classApi'
  import * as courseApi from '../../../apis/courseApi'
  // import * as userApi from '../../../apis/userApi'
  import * as classRosterApi from '../../../apis/classRosterApi'
  // components
  import IconFont from '../../../components/icon-font/IconFont'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
  export default {
    title: '课程管理',
    name: 'class-teacher-pagee',
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
          pageSize: 9999,
        },
        selectedCourseId: null,
        seatLayout: null,
        checkboxGroup: [], // 选择的座位
        studentList: [], // 学生列表
        courseTotal: 0, // 总课时
        courseCurrent: 0,
        courseEndTime: '',
        courseStartTime: '',
        classStatus: '1', // 0上课1下课-1未开始
        courseStatus: null, // 课程状态
        courseAttendanceList: [], // 考勤列表
        additionalStudent: null,
        rostersStudent: [], // 已选座位学生
        seatImgUrl: require('../../../assets/seat/seat.png'),
        checkedSeatImgUrl: require('../../../assets/seat/seat-checked.png'),
        courseStartDateStr: null, // 上课日期
        courseEndDateStr: null, // 结束日期
        classStartTimeStr: null, // 上课时间
        classEndTimeStr: null, // 下课时间
      })
    },
    computed: {
      ...mapGetters($account.namespace, {
        currentUser: $account.getters.currentUser
      }),
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
      // 左边座位
      seatLeftList() {
        if (!this.seatLayout) return []
        const list = new Array() //先声明一维
        for ( let i = 0; i < this.seatLayout.seatLeft; i++) { //一维长度
          list[i] = new Array() //再声明二维
          for ( let j = 0; j < this.seatLayout.seatRows; j++) { //二维长度
            list[i][j] = null
          }
        }
        // 学生匹配座位
        this.rostersStudent.forEach(item => {
          if (item.rosterSeatX < this.seatLayout.seatLeft) {
            const info = this.courseAttendanceList.find(value => value.accountId === item.accountId)
            list[item.rosterSeatX][item.rosterSeatY] = {...item.user, attendType: info ? info.attendType : null}
          }
        })
        return list
      },
      // 中间座位
      seatMidList() {
        if (!this.seatLayout) return []
        const list = new Array() //先声明一维
        for ( let i = 0; i < this.seatLayout.seatMid; i++) { //一维长度
          list[i] = new Array() //再声明二维
          for ( let j = 0; j < this.seatLayout.seatRows; j++) { //二维长度
            list[i][j] = null
          }
        }
        // 学生匹配座位
        this.rostersStudent.forEach(item => {
          if (item.rosterSeatX < (this.seatLayout.seatMid + this.seatLayout.seatLeft) && item.rosterSeatX >= this.seatLayout.seatLeft) {
            const info = this.courseAttendanceList.find(value => value.accountId === item.accountId)
            const x = item.rosterSeatX - this.seatLayout.seatLeft
            if (list[x]) {
              list[x][item.rosterSeatY] = {...item.user, attendType: info ? info.attendType : null}
            }
          }
        })
        return list
      },
      // 右边座位
      seatRightList() {
        if (!this.seatLayout) return []
        const list = new Array() //先声明一维
        for ( let i = 0; i < this.seatLayout.seatRight; i++) { //一维长度
          list[i] = new Array() //再声明二维
          for ( let j = 0; j < this.seatLayout.seatRows; j++) { //二维长度
            list[i][j] = null
          }
        }
        // 学生匹配座位
        this.rostersStudent.forEach(item => {
          if (item.rosterSeatX >= (this.seatLayout.seatMid + this.seatLayout.seatLeft)) {
            const info = this.courseAttendanceList.find(value => value.accountId === item.accountId)
            const x = item.rosterSeatX - this.seatLayout.seatMid - this.seatLayout.seatLeft
            if (list[x]) {
              list[x][item.rosterSeatY] = {...item.user, attendType: info ? info.attendType : null}
            }
          }
        })
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
        this.rostersStudent = []
        this.tableData.list.forEach(element => {
          if (element.courseId === value) {
            this.seatLayout = element.seatLayout
            this.courseTotal = element.courseTotal
            this.courseCurrent = element.courseCurrent
            this.classStatus = element.classStatus
            this.courseStatus = element.courseStatus
            this.courseStartDateStr = element.courseStartDateStr
            this.courseEndDateStr = element.courseEndDateStr
            this.classStartTimeStr = element.classStartTimeStr
            this.classEndTimeStr = element.classEndTimeStr
          }
        })
        Promise.all([
          this.queryCourseAttendance(),
          this.queryClassRosters()
        ])
      },
    },
    methods: {
      async queryClassList() {
        this.tableData.loading = true
        // const params = {...this.searchForm, accountId: this.currentUser.accountId}
        let params = null
        if (this.isSuperAdmin || this.isAdmin) {
          params = {...this.searchForm}
        } else if (this.isTeacher) {
          params = {...this.searchForm, accountId: this.currentUser.accountId}
        } else if (this.isStudent) {
          params = {...this.searchForm, bought: true}
        }
        const {data} = await classApi.getClassList(params).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = list || []
        if (list && list.length && !this.selectedCourseId) {
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
        this.courseAttendanceList = data || []
        // console.log('courseAttendanceList', this.courseAttendanceList)
      },
      // 获取课程名单
      async queryClassRosters() {
        const {data} = await classRosterApi.getClassRosterList({courseId: this.selectedCourseId}).catch(e => e)
        if (data && data.length) {
          data.forEach(value => {
            this.checkboxGroup.push((value.rosterSeatX + ',' + value.rosterSeatY))
          })
          this.rostersStudent = data
        }
      },
      // 结束课程
      async endCourseOnclick() {
        this.$confirm('确定要结束该课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code, msg} = await courseApi.cancelCourse(this.selectedCourseId).catch(e => e)
          if (code !== '200') {
            return this.$message('结束课程失败，' + msg)
          }
          this.$message({
            type: 'success',
            message: '结束课程成功！'
          })
          this.queryClassList()
        }).catch(() => {})
      },
    },
    mounted() {
      this.queryClassList()
      // this.queryStudentList()
    }
  }
</script>
<style>
.class-teacher-page .content {
  min-width: 1100px;
  overflow-x: auto;
  min-height: 900px;
}
.class-teacher-page .content .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
}
.class-teacher-page .chenk-box-col {
  width: 100px;
  text-align: center;
}
.class-teacher-page .chenk-box {
  width: 100px;
  text-align: center;

}
.class-teacher-page .chenk-box-img {
  width: 105px;
  padding: 12px;
}
.class-teacher-page .chenk-box .el-checkbox__input {
  display: none;
}
.class-teacher-page .seat-icon {
  width: 110px;
  text-align: center;
  padding-top: 15px;
}
.class-teacher-page .seat-icon .icon {
  color: #606266;
}
.class-teacher-page .seat-icon .icon-selected {
   /*color: #409EFF;*/
}
</style>