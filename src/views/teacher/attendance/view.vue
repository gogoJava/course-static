<template>
  <div class="teacher-class-attendance-page">
    <el-card class="content">
      <div slot="header" class="clearfix">
        <span style="padding-right: 15px;">课程:</span>
        <el-select v-model="selectedCourseId" filterable placeholder="请选择">
          <el-option v-for="(item, index) in tableData.list" :key="index" :label="item.courseName" :value="item.courseId">
          </el-option>
        </el-select>
        <span style="padding-left: 15px;font-weight: bold;">
          <span>历史考勤：</span>
          <el-select v-model="courseRecord" placeholder="请选择" @change="queryCourseAttendance">
          <el-option
                  v-for="item in courseClassList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </el-option>
        </el-select>
        </span>
        <span style="padding-bottom: 15px; padding-left: 15px;font-weight: bold;">课程进度：{{courseCurrent}} / {{courseTotal}}</span>
        <span v-if="courseStatus !== '3' && (courseRecord === courseCurrent)" style="padding-left: 15px;">
          <el-button v-if="classStatus === '1' || classStatus === '-1'" style="position: relative;left: 30px;" type="primary" @click.native="startCourseOnclick">开始上课</el-button>
          <el-button v-if="classStatus === '0'" style="position: relative;left: 30px;" type="primary" @click.native="endCourseOnclick">下课</el-button>
        </span>
        <span v-if="courseStatus === '3'" style="font-weight: bold;">课程已结束</span>
      </div>
      <el-col :span="16">
        <el-row :gutter="0" v-for="(item, i) of seatRowsList" :key="i" style="width: 780px;">
        <el-col style="width: 250px;">
          <el-checkbox-group v-model="checkboxGroup" disabled>
            <el-checkbox size="small" class="chenk-box" v-for="(item, a) of seatLeftList" :key="a" :label="(a + ',' + i)" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, a) of seatLeftList" :key="a" @click.native="attendanceCourse(item && item[i])">
            <el-tooltip class="item" effect="dark" :content="item && item[i] && item[i].attendType === '1' ? (item[i].name + '已签到') : (courseCurrent === courseRecord ? '' : '缺席')" placement="top" :disabled="!(item && item[i] && item[i].attendType && courseCurrent !== courseRecord)">
              <img :src="(item && item[i] && item[i].attendType && item[i].attendType === '1') ? checkedSeatImgUrl : seatImgUrl" class="chenk-box-img" />
            </el-tooltip>
          </el-col>
        </el-col>
        <el-col style="width: 250px;">
          <el-checkbox-group v-model="checkboxGroup" disabled>
            <el-checkbox size="small" class="chenk-box" v-for="(item, b) of seatMidList" :key="b" :label="(b + seatLayout.seatLeft) + ',' + i" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, b) of seatMidList" :key="b" @click.native="attendanceCourse(item && item[i])">
            <el-tooltip class="item" effect="dark" :content="item && item[i] && item[i].attendType === '1' ? (item[i].name + '已签到') : (courseCurrent === courseRecord ? '' : '缺席')" placement="top" :disabled="!(item && item[i] && item[i].attendType && courseCurrent !== courseRecord)">
              <img :src="(item && item[i] && item[i].attendType && item[i].attendType === '1') ? checkedSeatImgUrl : seatImgUrl" class="chenk-box-img" />
            </el-tooltip>
          </el-col>
        </el-col>
        <el-col style="width: 250px;">
          <el-checkbox-group v-model="checkboxGroup" disabled>
            <el-checkbox size="small" class="chenk-box" v-for="(item, c) of seatRightList" :key="c" :label="(c + seatLayout.seatLeft + seatLayout.seatMid) + ',' + i" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, c) of seatRightList" :key="c" @click.native="attendanceCourse(item && item[i])">
            <el-tooltip class="item" effect="dark" :content="item && item[i] && item[i].attendType === '1' ? (item[i].name + '已签到') : (courseCurrent === courseRecord ? '' : '缺席')" placement="top" :disabled="!(item && item[i] && item[i].attendType && courseCurrent !== courseRecord)">
              <img :src="(item && item[i] && item[i].attendType && item[i].attendType === '1') ? checkedSeatImgUrl : seatImgUrl" class="chenk-box-img" />
            </el-tooltip>
          </el-col>
        </el-col>
      </el-row>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>串课名单</span>
            <el-select v-if="isTeacher" style="float: right;position: relative;top: -6px;width: 160px;" @change="additionalStudents" no-data-text="无可窜课学生" clearable v-model="additionalStudent" filterable placeholder="添加串课学生">
              <el-option
                      v-for="item in studentList"
                      :key="item.accountId"
                      :label="item.name"
                      :value="item.accountId">
              </el-option>
            </el-select>
          </div>
          <div style="height: 360px;overflow-y: auto;">
            <div v-for="(item, index) in additionalStudentList" :key="index">
              {{item.name}}
            </div>
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
  // import * as userApi from '../../../apis/userApi'
  import * as classRosterApi from '../../../apis/classRosterApi'
  // components
  import IconFont from '../../../components/icon-font/IconFont'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
  export default {
    title: '出勤签到',
    name: 'teacher-class-attendance-pagee',
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
        courseClassList: [], // 历史考勤
        checkboxGroup: [], // 选择的座位
        studentList: [], // 学生列表
        courseTotal: 0, // 总课时
        courseCurrent: 0,
        courseRecord: 0,
        courseAttendanceList: [], // 考勤列表
        additionalStudentList: [], // 考勤列表
        additionalStudent: null,
        rostersStudent: [], // 已选座位学生
        classStatus: '1', // 0上课1下课-1未开始
        courseStatus: null, // 课程状态
        seatImgUrl: require('../../../assets/seat/seat.png'),
        checkedSeatImgUrl: require('../../../assets/seat/seat-checked.png')
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
            list[item.rosterSeatX][item.rosterSeatY] = {...item.user, accountId: item.accountId, attendType: info && (info.attendType === '1' || info.attendType === '4') ? info.attendType : null}
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
              list[x][item.rosterSeatY] = {...item.user, accountId: item.accountId, attendType: info && (info.attendType === '1' || info.attendType === '4') ? info.attendType : null}
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
              list[x][item.rosterSeatY] = {...item.user, accountId: item.accountId, attendType: info && (info.attendType === '1' || info.attendType === '4') ? info.attendType : null}
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
        this.courseClassList = []
        this.tableData.list.forEach(element => {
          if (element.courseId === value) {
            this.seatLayout = element.seatLayout
            this.courseTotal = element.courseTotal
            this.courseCurrent = element.courseCurrent
            this.classStatus = element.classStatus
            this.courseStatus = element.courseStatus
            this.courseRecord = element.courseCurrent
            this.courseClassList.push({value: this.courseCurrent, label: '当前'})
            const courseCurrent = this.courseCurrent
            for (let i = 1; i < courseCurrent; i++) {
              this.courseClassList.push({value: courseCurrent - i, label: courseCurrent - i})
            }
          }
        })
        Promise.all([
          this.queryCourseAttendance(),
          this.queryClassRosters(),
          this.queryStudentList()
        ])
      },
      checkboxGroup() {
        const rostersStudent = []
        this.checkboxGroup.forEach(item => {
          const array = item.split(',')
          const info = this.rostersStudent.find(indexItem => indexItem.rosterSeatX === (array[0] - 0) && indexItem.rosterSeatY === (array[1] - 0))
          if (info) {
            rostersStudent.push(info)
          } else {
            const index = this.rostersStudent.findIndex(value => value.accountId === this.currentUser.accountId)
            if (index === -1) {
              rostersStudent.push({
                rosterSeatX: array[0] - 0,
                rosterSeatY: array[1] - 0,
                accountId: this.currentUser.accountId,
                user: this.currentUser
              })
            }
          }

        })
        this.rostersStudent = [...rostersStudent]
      }
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
        if (this.selectedCourseId) {
          this.checkboxGroup = []
          this.rostersStudent = []
          this.courseClassList = []
          this.tableData.list.forEach(element => {
            if (element.courseId === this.selectedCourseId) {
              this.seatLayout = element.seatLayout
              this.courseTotal = element.courseTotal
              this.courseCurrent = element.courseCurrent
              this.classStatus = element.classStatus
              this.courseStatus = element.courseStatus
              this.courseRecord = element.courseCurrent
              this.courseClassList.push({value: this.courseCurrent, label: '当前'})
              const courseCurrent = this.courseCurrent
              for (let i = 1; i < courseCurrent; i++) {
                this.courseClassList.push({value: courseCurrent - i, label: courseCurrent - i})
              }
            }
          })
          // Promise.all([
          //   // this.queryCourseAttendance(),
          //   this.queryClassRosters(),
          //   this.queryStudentList()
          // ])
        }
        if (list && list.length && !this.selectedCourseId) {
          this.selectedCourseId = list[0].courseId
        }
        this.tableData.loading = false
      },
      // 获取考勤列表
      async queryCourseAttendance() {
        const {data} = await courseApi.getCourseAttendance({
          courseCurrent: this.courseRecord,
          courseId: this.selectedCourseId, // 用户类型:1学生2教师
        }).catch(e => e)
        this.courseAttendanceList = []
        this.additionalStudentList = []
        if (data) {
          data.forEach(item => {
            // 签到名单（1已签到 4缺席）
            if (item.attendType === '1') {
              this.courseAttendanceList.push(item)
            }
            // 窜课名单
            if (item.attendType === '3') {
              this.additionalStudentList.push(item)
            }
            // 缺席名单
            if (item.attendType === '4') {
              this.courseAttendanceList.push(item)
            }
          })
        }
      },
      // 获取课程名单
      async queryClassRosters() {
        this.rostersStudent = []
        this.checkboxGroup = []
        const {data} = await classRosterApi.getClassRosterList({courseId: this.selectedCourseId}).catch(e => e)
        if (data && data.length) {
          data.forEach(value => {
            this.checkboxGroup.push((value.rosterSeatX + ',' + value.rosterSeatY))
          })
          this.rostersStudent = data
        }
      },
      // 获取学生列表
      async queryStudentList() {
        this.studentList = []
        const {data} = await courseApi.getAdditionalUserList({
          pageNum: 1,
          pageSize: 9999,
          courseId: this.selectedCourseId
        }).catch(e => e)
        this.studentList = data.list || []
      },
      // 添加串课学生
      async additionalStudents() {
        const params = {
          accountId: this.additionalStudent,
          courseId: this.selectedCourseId,
          rosterSeatX: -1,
          rosterSeatY: -1
        }
        this.$confirm('确定要添加该学生?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code, msg} = await courseApi.courseAdditional(params).catch(e => e)
          if (code !== '200') {
            this.additionalStudent = null
            return this.$message('添加失败，' + msg)
          }
          this.queryCourseAttendance()
          this.$message({
            type: 'success',
            message: '添加成功！'
          })
          this.additionalStudent = null
        }).catch(() => {})
      },
      // 结束课程
      async endCourseOnclick() {
        this.$confirm('确定要结束该节课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code, msg} = await courseApi.endCourse(this.selectedCourseId).catch(e => e)
          if (code !== '200') {
            return this.$message('结束课程失败，' + msg)
          }
          this.classStatus = '-1'
          this.$message({
            type: 'success',
            message: '结束课程成功！'
          })
          await this.queryClassList()
          Promise.all([
            this.queryClassRosters(),
            this.queryStudentList()
          ])
        }).catch(() => {})
      },
      async startCourseOnclick() {
        this.$confirm('确定要开始该节课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code, msg} = await courseApi.startCourse(this.selectedCourseId).catch(e => e)
          if (code !== '200') {
            return this.$message('课程开始失败，' + msg)
          }
          this.classStatus = '0'
          this.$message({
            type: 'success',
            message: '课程开始！'
          })
          await this.queryClassList()
          Promise.all([
            this.queryClassRosters(),
            this.queryStudentList()
          ])
        }).catch(() => {})
      },
      // 签到
      async attendanceCourse(info) {
        if (info && info.attendType !== '1' && this.courseCurrent === this.courseRecord) {
          this.$confirm('确定【' + info.name + '】签到?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            const params = {
              courseId: this.selectedCourseId,
              studentId: info.accountId
            }
            const {code, msg} = await courseApi.courseSign(params).catch(e => e)
            if (code !== '200') {
              return this.$message('签到失败，' + msg)
            }
            this.$message({
              type: 'success',
              message: '签到成功！'
            })
            this.queryCourseAttendance()
          }).catch(() => {})
        }
      }
    },
    mounted() {
      this.queryClassList()
      // this.queryStudentList()
      // this.queryCourseAdditional()
    }
  }
</script>
<style>
.teacher-class-attendance-page .content {
  min-width: 1100px;
  overflow-x: auto;
  min-height: 900px;
}
.teacher-class-attendance-page .content .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
}
.teacher-class-attendance-page .chenk-box-col {
  width: 70px;
  text-align: center;
}
.teacher-class-attendance-page .chenk-box {
  width: 65px;
  text-align: center;

}
.teacher-class-attendance-page .chenk-box-img {
  width: 65px;
  padding: 10px;
  cursor: pointer;
}
.teacher-class-attendance-page .chenk-box .el-checkbox__input {
  display: none;
}
.teacher-class-attendance-page .seat-icon {
  width: 70px;
  text-align: center;
  padding-top: 15px;
}
.teacher-class-attendance-page .seat-icon .icon {
  color: #606266;
}
.teacher-class-attendance-page .seat-icon .icon-selected {
   /*color: #409EFF;*/
}
.teacher-class-attendance-page .el-checkbox__label {
  padding: 0;
}
</style>