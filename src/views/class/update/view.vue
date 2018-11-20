<template>
  <div class="class-update-page">
    <el-card class="content">
      <div slot="header" class="clearfix">
        <span style="padding-right: 15px;">课程:</span>
        <el-select v-model="selectedCourseId" filterable placeholder="请选择">
          <el-option v-for="(item, index) in tableData.list" :key="index" :label="item.courseName" :value="item.courseId">
          </el-option>
        </el-select>
        <div style="padding-top: 15px;font-size: 32px;font-weight: bold;">
          <span>任课老师：{{courseTeacher ? courseTeacher.name : '无'}}</span>
          <span style="padding-bottom: 15px; padding-left: 100px;">课程进度：{{courseCurrent}} / {{courseTotal}}</span>
        </div>
        <!--<div style="padding: 15px;">-->
          <!--<el-input v-model="addName" placeholder="输入学号或姓名" style="width: 300px;"></el-input>-->
          <!--<el-button type="primary" style="margin-left: 30px;" size="small">新增</el-button>-->
          <!--<el-button style="margin-left: 15px;" type="danger" size="small" @click="deleteStudent">删除</el-button>-->
        <!--</div>-->
      </div>
      <el-col :span="18" style="min-width: 1080px;">
        <el-row :gutter="0" v-for="(item, i) of seatRowsList" :key="i">
        <el-col style="width: 360px;">
          <el-checkbox-group v-model="checkboxGroup" disabled>
            <el-checkbox size="small" class="chenk-box" v-for="(item, a) of seatLeftList" :key="a" :label="(a + ',' + i)" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, a) of seatLeftList" :key="a" @click.native="onClickSeat((item && item[i]), a, i)">
            <el-tooltip class="item" effect="dark" :content="item && item[i] ? '' : '点击座位添加学生'" placement="top" :disabled="!!(item && item[i])">
              <img :src="(item && item[i]) ? checkedSeatImgUrl : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-tooltip>
          </el-col>
        </el-col>
        <el-col style="width: 360px;">
          <el-checkbox-group v-model="checkboxGroup" disabled>
            <el-checkbox size="small" class="chenk-box" v-for="(item, b) of seatMidList" :key="b" :label="(b + seatLayout.seatLeft) + ',' + i" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, b) of seatMidList" :key="b" @click.native="onClickSeat((item && item[i]), (b + seatLayout.seatLeft), i)">
            <el-tooltip class="item" effect="dark" :content="item && item[i] ? '' : '点击座位添加学生'" placement="top" :disabled="!!(item && item[i])">
              <img :src="(item && item[i]) ? checkedSeatImgUrl : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-tooltip>
          </el-col>
        </el-col>
        <el-col style="width: 360px;">
          <el-checkbox-group v-model="checkboxGroup" disabled>
            <el-checkbox size="small" class="chenk-box" v-for="(item, c) of seatRightList" :key="c" :label="(c + seatLayout.seatLeft + seatLayout.seatMid) + ',' + i" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
          </el-checkbox-group>
          <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, c) of seatRightList" :key="c" @click.native="onClickSeat((item && item[i]), (c + seatLayout.seatLeft + seatLayout.seatMid), i)">
            <el-tooltip class="item" effect="dark" :content="item && item[i] ? '' : '点击座位添加学生'" placement="top" :disabled="!!(item && item[i])">
              <img :src="(item && item[i]) ? checkedSeatImgUrl : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-tooltip>
          </el-col>
        </el-col>
      </el-row>
      </el-col>
      <!--<el-col>-->
        <!--<div style="text-align: center;padding: 15px 0 60px 0">-->
          <!--<el-button type="primary" style="width: 200px;line-height: 30px;">完成</el-button>-->
        <!--</div>-->
      <!--</el-col>-->
    </el-card>
    <el-dialog title="添加学生" :visible.sync="dialogVisible" width="50%" v-loading="dialogLoading">
      <el-form label-width="160px">
        <el-form-item label="已购买该课程学生：">
          <el-select v-model="selectedAccountId" placeholder="请选择">
            <el-option
                    v-for="item in chooseList"
                    :key="item.accountId"
                    :label="item.name"
                    :value="item.accountId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// API
  import * as classApi from '../../../apis/classApi'
  import * as courseApi from '../../../apis/courseApi'
  import * as userApi from '../../../apis/userApi'
  import * as classRosterApi from '../../../apis/classRosterApi'
  import * as seatApi from '../../../apis/seatApi'
  // components
  import IconFont from '../../../components/icon-font/IconFont'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
  export default {
    title: '修改课程',
    name: 'class-update-pagee',
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
        chooseList: [], // 可选学生列表
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
        courseTeacher: null, // 老师
        addName: null,
        selectedAccountId: null,
        dialogVisible: false,
        dialogLoading: false,
        rosterSeatX: 0,
        rosterSeatY: 0
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
            this.courseTeacher = element.user
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
        this.rostersStudent = []
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
      // 获取可选学生列表
      async queryChooseList() {
        const {data} = await userApi.getChooseList({
          courseId: this.selectedCourseId
        }).catch(e => e)
        this.chooseList = data || []
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
      },
      // 删除某个座位
      deleteStudent() {
        this.$confirm('确定要删除该学生座位?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // console.log('addName', this.addName)
          // console.log('rostersStudent', this.rostersStudent)
          this.rostersStudent.filter(item => {
            return item.user.name !== this.addName
          })
        }).catch(() => {})
      },
      // 点击某个座位
      async onClickSeat(info, x, y) {
        if (info) return
        this.chooseList = []
        this.selectedAccountId = null
        this.rosterSeatX = x
        this.rosterSeatY = y
        this.dialogVisible = true
        this.dialogLoading = true
        await this.queryChooseList()
        this.dialogLoading = false
      },
      async confirmAdd() {
        // 新增选择座位
        const params = {
          accountId: this.selectedAccountId,
          courseId: this.selectedCourseId,
          seatX: this.rosterSeatX,
          seatY: this.rosterSeatY
        }
        const {code, msg} = await seatApi.choiceSeat(params).catch(e => e)
        if (code !== '200') return this.$message('添加失败，', msg)
        this.dialogVisible = false
        this.queryClassRosters()
        this.$message({type: 'success', message: '添加成功！'})
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
.class-update-page .content {
  min-width: 1100px;
  overflow-x: auto;
  min-height: 900px;
}
.class-update-page .content .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
}
.class-update-page .chenk-box-col {
  width: 100px;
  text-align: center;
}
.class-update-page .chenk-box {
  width: 100px;
  text-align: center;

}
.class-update-page .chenk-box-img {
  width: 95px;
  padding: 12px;
  cursor: pointer;
}
.class-update-page .chenk-box .el-checkbox__input {
  display: none;
}
.class-update-page .seat-icon {
  width: 110px;
  text-align: center;
  padding-top: 15px;
}
.class-update-page .seat-icon .icon {
  color: #606266;
}
.class-update-page .seat-icon .icon-selected {
   /*color: #409EFF;*/
}
.class-update-page .el-checkbox__label {
  padding-left: 0;
}
</style>