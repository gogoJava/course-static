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
              <el-checkbox class="chenk-box" v-for="(item, a) of seatLeftList" :key="a" :label="(a + ',' + i)" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, a) of seatLeftList" :key="a">
              <img :src="seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-col>
          </el-col>
          <el-col :span="8">
            <el-checkbox-group v-model="checkboxGroup" size="small">
              <el-checkbox class="chenk-box" v-for="(item, b) of seatMidList" :key="b" :label="(b + seatLayout.seatLeft) + ',' + i" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, b) of seatMidList" :key="b">
              <img :src="seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-col>
          </el-col>
          <el-col :span="8">
            <el-checkbox-group v-model="checkboxGroup" size="small">
              <el-checkbox class="chenk-box" v-for="(item, c) of seatRightList" :key="c" :label="(c + seatLayout.seatLeft + seatLayout.seatMid) + ',' + i" border>{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, c) of seatRightList" :key="c">
              <img :src="seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-col>
          </el-col>
        </el-row>
      </el-col>
      <div style="">
        <el-button type="primary" @click.native="confirmSeat">确定座位</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
// API
  import * as classApi from '../../../../apis/classApi'
  import * as seatApi from '../../../../apis/seatApi'
  import * as classRosterApi from '../../../../apis/classRosterApi'
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
        additionalStudent: null,
        rostersStudent: [], // 已选座位学生
        seatImgUrl: require('../../../../assets/seat/seat.png')
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
        const list = new Array(this.seatLayout.seatLeft)
        // 学生匹配座位
        this.rostersStudent.forEach(item => {
          if (item.rosterSeatX < this.seatLayout.seatLeft) {
            list[item.rosterSeatX] = new Array(this.seatLayout.seatRows)
            list[item.rosterSeatX][item.rosterSeatY] = item.user
          }
        })
        return list
      },
      // 中间座位
      seatMidList() {
        if (!this.seatLayout) return []
        const list = new Array(this.seatLayout.seatMid)
        // 学生匹配座位
        this.rostersStudent.forEach(item => {
          if (item.rosterSeatX < this.seatLayout.seatMid && item.rosterSeatX >= this.seatLayout.seatLeft) {
            const x = item.rosterSeatX - this.seatLayout.seatLeft
            list[x] = new Array(this.seatLayout.seatRows)
            list[x][item.rosterSeatY] = item.user
          }
        })
        return list
      },
      // 右边座位
      seatRightList() {
        if (!this.seatLayout) return []
        const list = new Array(this.seatLayout.seatRight)
        // 学生匹配座位
        this.rostersStudent.forEach(item => {
          if (item.rosterSeatX >= (this.seatLayout.seatMid + this.seatLayout.seatLeft)) {
            const x = item.rosterSeatX - this.seatLayout.seatMid - this.seatLayout.seatLeft
            list[x] = new Array(this.seatLayout.seatRows)
            list[x][item.rosterSeatY] = item.user
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
          }
        })
        this.queryClassRosters()
      },
      // checkboxGroup() {
      //   console.log('watch checkboxGroup', this.checkboxGroup)
      // }
    },
    methods: {
      checkedChange(value) {
        if (value.length) {
          this.checkboxGroup = [value[value.length - 1]]
        }
      },
      async queryClassList() {
        this.tableData.loading = true
        // bought:我的课程
        const params = {...this.searchForm, accountId: this.currentUser.accountId, bought: true}
        const {data} = await classApi.getClassList(params).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = list || []
        if (list && list.length) {
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
          })
          this.rostersStudent = data
        }
      },
      // 确定座位
      async confirmSeat() {
        if (!this.checkboxGroup.length) return this.$message('请选择座位')
        const array = this.checkboxGroup[0].split(',')
        const params = {
          courseId: this.selectedCourseId,
          seatX: array[0] - 0,
          seatY: array[1] - 0
        }
        console.log('sssss', params)
        // if (params) return
        const {code, msg} = await seatApi.choiceSeat(params).catch(e => e)
        if (code !== '200') return this.$message('选座失败，', msg)
        this.rostersStudent.push({
          rosterSeatX: array[0] - 0,
          rosterSeatY: array[1] - 0,
          user: this.currentUser
        })
        this.$message({type: 'success', message: '选座成功！'})
      }
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
.class-attendance-page .chenk-box-col {
  width: 100px;
  text-align: center;
}
.class-attendance-page .chenk-box {
  width: 100px;
  text-align: center;

}
.class-attendance-page .chenk-box-img {
  width: 105px;
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