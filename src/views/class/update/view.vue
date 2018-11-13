<template>
  <div class="class-attendance-page">
    <el-card class="content">
      <div slot="header" class="clearfix">
        <span style="padding-right: 15px;">课程:</span>
        <el-select v-model="selectedCourseId" filterable placeholder="请选择">
          <el-option v-for="(item, index) in tableData.list" :key="index" :label="item.courseName" :value="item.courseId">
          </el-option>
        </el-select>
        <div style="padding-top: 15px;font-size: 32px;font-weight: bold;">
          <span>任课老师：</span>
          <span style="padding-bottom: 15px; padding-left: 15px;">课程进度：{{courseCurrent}} / {{courseTotal}}</span>
        </div>
        <div style="padding: 15px;">
          <el-input v-model="newValue" placeholder="输入学号或姓名" style="width: 300px;"></el-input>
          <el-button type="primary" style="margin-left: 30px;" size="small">新增</el-button>
          <el-button style="margin-left: 15px;" type="danger" size="small">删除</el-button>
        </div>
      </div>
      <el-col :span="18" style="min-width: 1080px;">
        <el-row :gutter="0" v-for="(item, i) of seatRowsList" :key="i">
        <el-col style="width: 360px;">
          <el-checkbox-group v-model="checkboxGroup" disabled>
            <el-checkbox size="small" class="chenk-box" v-for="(item, a) of seatLeftList" :key="a" :label="(a + ',' + i)" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, a) of seatLeftList" :key="a">
            <el-tooltip class="item" effect="dark" :content="item && item[i] ? (item[i].name + '已签到') : ''" placement="top" :disabled="!(item && item[i] && item[i].attendType)">
              <img :src="(item && item[i] && item[i].attendType) ? checkedSeatImgUrl : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-tooltip>
          </el-col>
        </el-col>
        <el-col style="width: 360px;">
          <el-checkbox-group v-model="checkboxGroup" disabled>
            <el-checkbox size="small" class="chenk-box" v-for="(item, b) of seatMidList" :key="b" :label="(b + seatLayout.seatLeft) + ',' + i" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, b) of seatMidList" :key="b">
            <el-tooltip class="item" effect="dark" :content="item && item[i] ? (item[i].name + '已签到') : ''" placement="top" :disabled="!(item && item[i] && item[i].attendType)">
              <img :src="(item && item[i] && item[i].attendType) ? checkedSeatImgUrl : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-tooltip>
          </el-col>
        </el-col>
        <el-col style="width: 360px;">
          <el-checkbox-group v-model="checkboxGroup" disabled>
            <el-checkbox size="small" class="chenk-box" v-for="(item, c) of seatRightList" :key="c" :label="(c + seatLayout.seatLeft + seatLayout.seatMid) + ',' + i" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, c) of seatRightList" :key="c">
            <el-tooltip class="item" effect="dark" :content="item && item[i] ? (item[i].name + '已签到') : ''" placement="top" :disabled="!(item && item[i] && item[i].attendType)">
              <img :src="(item && item[i] && item[i].attendType) ? checkedSeatImgUrl : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-tooltip>
          </el-col>
        </el-col>
      </el-row>
      </el-col>
      <el-col>
        <div style="text-align: center;padding: 15px 0 60px 0">
          <el-button type="primary" style="width: 200px;line-height: 30px;">完成</el-button>
        </div>
      </el-col>
    </el-card>
  </div>
</template>
<script>
// API
  import * as classApi from '../../../apis/classApi'
  import * as courseApi from '../../../apis/courseApi'
  import * as userApi from '../../../apis/userApi'
  import * as classRosterApi from '../../../apis/classRosterApi'
  // components
  import IconFont from '../../../components/icon-font/IconFont'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
  export default {
    title: '修改课程',
    name: 'class-attendance-pagee',
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
        additionalStudentList: [], // 考勤列表
        additionalStudent: null,
        rostersStudent: [], // 已选座位学生
        classStatus: '1', // 0上课1下课-1未开始
        courseStatus: null, // 课程状态
        seatImgUrl: require('../../../assets/seat/seat.png'),
        checkedSeatImgUrl: require('../../../assets/seat/seat-checked.png'),
        newValue: null,
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
          if (item.rosterSeatX < this.seatLayout.seatMid && item.rosterSeatX >= this.seatLayout.seatLeft) {
            const info = this.courseAttendanceList.find(value => value.accountId === item.accountId)
            const x = item.rosterSeatX - this.seatLayout.seatLeft
            list[x][item.rosterSeatY] = {...item.user, attendType: info ? info.attendType : null}
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
            list[x][item.rosterSeatY] = {...item.user, attendType: info ? info.attendType : null}
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
          }
        })
        Promise.all([
          this.queryCourseAttendance(),
          this.queryClassRosters()
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
        if (data) {
          this.courseAttendanceList = []
          data.forEach(item => {
            // 签到名单
            if (item.attendType === '1') {
              this.courseAttendanceList.push(item)
            }
          })
        }
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
      // 获取学生列表
      async queryStudentList() {
        const {data} = await userApi.getUserList({
          pageNum: 1,
          pageSize: 10,
          type: 1, // 用户类型:1学生2教师
        }).catch(e => e)
        this.studentList = data.list || []
      },
      // 结束课程
      async endCourseOnclick() {
        this.$confirm('确定要结束该课程?', '提示', {
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
          this.queryClassList()
        }).catch(() => {})
      },
      async startCourseOnclick() {
        this.$confirm('确定要开始该课程?', '提示', {
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
          this.queryClassList()
        }).catch(() => {})
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
.class-attendance-page .chenk-box-col {
  width: 100px;
  text-align: center;
}
.class-attendance-page .chenk-box {
  width: 100px;
  text-align: center;

}
.class-attendance-page .chenk-box-img {
  width: 95px;
  padding: 12px;
}
.class-attendance-page .chenk-box .el-checkbox__input {
  display: none;
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