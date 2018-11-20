<template>
  <div class="home-student-class-my">
    <el-card class="content">
      <div slot="header" class="clearfix" v-if="tableData.list.length">
        <div>
          <span style="padding-right: 15px;">课程:</span>
          <el-select v-model="selectedCourseId" filterable placeholder="请选择">
            <el-option v-for="(item, index) in tableData.list" :key="index" :label="item.courseName" :value="item.courseId">
            </el-option>
          </el-select>
          <span style="padding-left: 30px;">
            <el-button v-if="!rosterId && !loading" type="primary" @click.native="confirmSeat" size="small">确定座位</el-button>
          </span>
        </div>
        <div style="font-size: 24px;font-weight: bold;padding: 15px;">
          <div>
            <el-col :span="8"><div>任课教师：{{courseTeacher.name}}</div></el-col>
            <el-col :span="8"><div>课程进度：{{courseCurrent}} / {{courseTotal}}</div></el-col>
            <el-col :span="8"><div>我的未上课时：{{rosterCourseCountRest === null ? courseTotal : rosterCourseCountRest}}</div></el-col>
          </div>
          <div>上课日期：{{courseStartDateStr + ' 至 ' + courseEndDateStr}}</div>
          <div>上课时间：{{classStartTimeStr + ' 至 ' + classEndTimeStr}}</div>
        </div>
      </div>
      <div v-if="!tableData.list.length" style="text-align: center;">
        <div style="padding-top: 30px;">
          <icon-font icon="ico_meiyoushuju" class="icon" size="120px"></icon-font>
        </div>
        <div style="padding-top: 30px;color: #999999;">您暂时还没有购买课程，请去购买课程哦</div>
      </div>
      <el-col :span="14" v-if="tableData.list.length">
        <el-row :gutter="0" v-for="(item, i) of seatRowsList" :key="i" style="min-width: 700px;">
          <el-col :span="8" style="width: 220px;">
            <el-checkbox-group v-model="checkboxGroup" size="small" text-color="#F56C6C" fill="#F56C6C">
              <el-checkbox class="chenk-box" v-for="(item, a) of seatLeftList" :key="a" :label="(a + ',' + i)" border :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId) || !bought || (isChecked && !isMy(item ? item[i] : null))">{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, a) of seatLeftList" :key="a">
              <img :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl" class="chenk-box-img" />
            </el-col>
          </el-col>
          <el-col :span="8" style="width: 220px;">
            <el-checkbox-group v-model="checkboxGroup" size="small" text-color="#F56C6C" fill="#F56C6C">
              <el-checkbox class="chenk-box" v-for="(item, b) of seatMidList" :key="b" :label="(b + seatLayout.seatLeft) + ',' + i" border :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId) || !bought || (isChecked && !isMy(item ? item[i] : null))">{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, b) of seatMidList" :key="b">
              <img :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl" class="chenk-box-img" />
            </el-col>
          </el-col>
          <el-col :span="8" style="width: 220px;">
            <el-checkbox-group v-model="checkboxGroup" size="small" text-color="#F56C6C" fill="#F56C6C">
              <el-checkbox class="chenk-box" v-for="(item, c) of seatRightList" :key="c" :label="(c + seatLayout.seatLeft + seatLayout.seatMid) + ',' + i" border :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId) || !bought || (isChecked && !isMy(item ? item[i] : null))">{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, c) of seatRightList" :key="c">
              <img :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl" class="chenk-box-img" />
            </el-col>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="10" v-if="tableData.list.length">
        <div style="font-weight: bold;text-align: center;padding-bottom: 15px;border-bottom: 0.1px solid #ebeef5;">出勤表</div>
        <el-table :data="tableData2.list" v-loading="tableData2.loading" border>
          <el-table-column prop="" label="课程名称">
            <template slot-scope="scope">{{courseName}}</template>
          </el-table-column>
          <el-table-column prop="attendType" label="上课时间">
            <template slot-scope="scope">
              <div style="">{{$moment(scope.row.createTime).format('HH:mm') + ' - ' +  (scope.row.endTime ? $moment(scope.row.endTime).format('HH:mm') : '至今')}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="上课日期">
            <template slot-scope="scope">{{$moment(scope.row.createTime).format('YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column prop="attendType" label="出勤情况">
            <template slot-scope="scope">{{scope.row.attendType | attendTypeMsg}}</template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-card>
  </div>
</template>
<script>
// API
  import * as classApi from '../../../../apis/classApi'
  import * as seatApi from '../../../../apis/seatApi'
  import * as classRosterApi from '../../../../apis/classRosterApi'
  import * as rosterAttendanceApi from '../../../../apis/rosterAttendanceApi'
  import * as courseApi from '../../../../apis/courseApi'
  import * as courseOrderApi from '../../../../apis/courseOrderApi'
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
          pageSize: 9999,
        },
        selectedCourseId: null,
        seatLayout: null,
        checkboxGroup: [], // 选择的座位
        studentList: [], // 学生列表
        courseTotal: 0, // 总课时
        courseCurrent: 0,
        courseAttendanceList: [], // 考勤列表
        additionalStudent: null,
        rostersStudent: [], // 已选座位学生
        seatImgUrl: require('../../../../assets/seat/seat.png'),
        checkedSeatImgUrl: require('../../../../assets/seat/seat-checked.png'),
        mySeatImgUrl: require('../../../../assets/seat/seat-me.png'),
        rosterId: null, // 当前用户座位id
        courseTeacher: null, // 任课老师
        courseStartDateStr: null, // 上课日期
        courseEndDateStr: null, // 结束日期
        classStartTimeStr: null, // 上课时间
        classEndTimeStr: null, // 下课时间
        bought: true, // 是否已购买课程
        orderStatus: null, // 状态(0未支付1成功2申请退款3退款)(字符串)
        courseName: null,
        classStatus: null, // // 0上课1下课-1未开始(字符串)
        loading: false,
        rosterCourseCountRest: null, // 未上课时
        tableData2: { // 签到情况
          loading: true,
          list: [],
        },
      })
    },
    filters: {
      attendTypeMsg(status) {
        // 1学生签到2老师签到3学生串课签到4缺席
        let msg = ''
        switch (status) {
          case '1':
            msg = '已签到'
            break
          case '2':
            msg = '老师签到'
            break
          case '3':
            msg = '串课已签到'
            break
          case '4':
            msg = '缺席'
            break
        }
        return msg
      },
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
        // const list = new Array(this.seatLayout.seatLeft)
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
            // list[item.rosterSeatX] = new Array(this.seatLayout.seatRows)
            list[item.rosterSeatX][item.rosterSeatY] = {...item.user, accountId: item.accountId}
          }
        })
        return list
      },
      // 中间座位
      seatMidList() {
        if (!this.seatLayout) return []
        // const list = new Array(this.seatLayout.seatMid)
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
            const x = item.rosterSeatX - this.seatLayout.seatLeft
            if (list[x]) {
              list[x][item.rosterSeatY] = {...item.user, accountId: item.accountId}
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
            const x = item.rosterSeatX - this.seatLayout.seatMid - this.seatLayout.seatLeft
            if (list[x]) {
              list[x][item.rosterSeatY] = {...item.user, accountId: item.accountId}
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
      // 学生自己是否已选
      isChecked() {
        return this.rostersStudent.findIndex(value => value.accountId === this.currentUser.accountId) !== -1
      },
    },
    watch: {
      async selectedCourseId(value) {
        this.rosterCourseCountRest = null
        this.loading = true
        this.checkboxGroup = []
        this.rostersStudent = []
        this.rosterId = null
        this.tableData.list.forEach(element => {
          // console.log(element)
          if (element.courseId === value) {
            this.seatLayout = element.seatLayout
            this.courseTotal = element.courseTotal
            this.courseCurrent = element.courseCurrent
            this.courseTeacher = element.user
            this.courseStartDateStr = element.courseStartDateStr
            this.courseEndDateStr = element.courseEndDateStr
            this.classStartTimeStr = element.classStartTimeStr
            this.classEndTimeStr = element.classEndTimeStr
            this.courseName = element.courseName
            this.classStatus = element.classStatus
            this.bought = element.bought
            this.orderStatus = element.orderStatus
          }
        })
        await Promise.all([
          this.queryClassRosters(),
          this.rosterAttendance()
        ])
        this.loading = false
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
      isMy(info) {
        if (!info) return false
        return this.currentUser.accountId === info.accountId && this.orderStatus && this.orderStatus === '1' && !this.rosterId
      },
      async queryClassList() {
        this.tableData.loading = true
        // bought:我的课程
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
      // 获取课程名单
      async queryClassRosters() {
        const {data} = await classRosterApi.getClassRosterList({courseId: this.selectedCourseId}).catch(e => e)
        if (data && data.length) {
          data.forEach(value => {
            this.checkboxGroup.push((value.rosterSeatX + ',' + value.rosterSeatY))
            if (value.accountId === this.currentUser.accountId) {
              this.rosterId = value.rosterId
              this.rosterCourseCountRest = value.rosterCourseCountRest
            }
          })
          this.rostersStudent = data
        }
      },
      // 确定座位
      async confirmSeat() {
        const info = this.rostersStudent.find(indexItem => indexItem.accountId === this.currentUser.accountId)
        if (!info) return this.$message('请选择座位')
        if (this.rosterId) {
          // 修改
          const ids = []
          this.rostersStudent.forEach(item => {
            ids.push(((item.rosterId || this.rosterId) + ',' + item.rosterSeatX + ',' + item.rosterSeatY))
          })
          const params = {
            courseId: this.selectedCourseId,
            ids
          }
          const {code, msg} = await classRosterApi.updateClassRoster(params).catch(e => e)
          if (code !== '200') return this.$message('选座失败，', msg)
          this.$message({type: 'success', message: '选座成功！'})
        } else {
          // 新增选择座位
          const params = {
            courseId: this.selectedCourseId,
            seatX: info.rosterSeatX,
            seatY: info.rosterSeatY
          }
          const {code, msg, data} = await seatApi.choiceSeat(params).catch(e => e)
          if (code !== '200') return this.$message('选座失败，', msg)
          this.rosterId = data.rosterId
          this.$message({type: 'success', message: '选座成功！'})
        }
      },
      // 获取出勤情况
      async rosterAttendance() {
        const params = {
          accountId: this.currentUser.accountId,
          courseId: this.selectedCourseId
        }
        this.tableData2.loading = true
        const {data} = await rosterAttendanceApi.rosterAttendanceList(params).catch(e => e)
        const {list} = data
        this.tableData2.list = list || []
        this.tableData2.loading = false
      },
      // 签到
      async courseSignOnclick() {
        const {code, msg} = await courseApi.courseSign({courseId: this.selectedCourseId}).catch(e => e)
        if (code !== '200') return this.$message('签到失败，' + msg)
        this.rosterAttendance()
        this.$message({type: 'success', message: '签到成功！'})
      },
      // 获取支付订单列表
      async queryOrderList() {
        const params = {accountId: this.currentUser.accountId}
        const {data} = await courseOrderApi.courseOrderList(params).catch(e => e)
        const {list} = data
        if (list) {
          list.forEach(item => {
            const index = this.tableData.list.findIndex(value => value.courseId === item.courseId)
            if (index !== -1) {
              this.tableData.list[index] = {...this.tableData.list[index], orderId: item.orderId, orderStatus: item.orderStatus}
              if (this.selectedCourseId === item.courseId) {
                this.orderId = item.orderId
                this.orderStatus = item.orderStatus
                if (this.orderStatus !== '0') {
                  this.bought = true
                }
              }
            }
          })
        }
      },
    },
    async mounted() {
      await this.queryClassList()
      this.queryOrderList()
    }
  }
</script>
<style>
.home-student-class-my .content {
  min-width: 1100px;
  overflow-x: auto;
  min-height: 900px;
}
.home-student-class-my .content .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
}
.home-student-class-my .chenk-box-col {
  width: 60px;
  text-align: center;
}
.home-student-class-my .chenk-box {
  width: 60px;
  text-align: center;

}
.home-student-class-my .el-checkbox__label {
  padding: 0;
}
.home-student-class-my .chenk-box-img {
  width: 60px;
  padding: 8px;
}
.home-student-class-my .chenk-box .el-checkbox__input {
  display: none;
}
.home-student-class-my .seat-icon {
  width: 90px;
  text-align: center;
  padding-top: 15px;
}
.home-student-class-my .seat-icon .icon {
  color: #606266;
}
.home-student-class-my .seat-icon .icon-selected {
   /*color: #409EFF;*/
}
.home-student-class-my .el-checkbox__label {
  padding-left: 0;
}
</style>