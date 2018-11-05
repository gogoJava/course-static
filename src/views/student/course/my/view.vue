<template>
  <div class="class-attendance-page">
    <el-card class="content">
      <div slot="header" class="clearfix" v-if="tableData.list.length">
        <span style="padding-right: 15px;">课程:</span>
        <el-select v-model="selectedCourseId" filterable placeholder="请选择">
          <el-option v-for="(item, index) in tableData.list" :key="index" :label="item.courseName" :value="item.courseId">
          </el-option>
        </el-select>
        <span style="padding-bottom: 15px;padding-left: 30px;">课程进度：{{courseCurrent}} / {{courseTotal}}</span>
      </div>
      <div v-if="!tableData.list.length" style="text-align: center;">
        <div style="padding-top: 30px;">
          <icon-font icon="ico_meiyoushuju" class="icon" size="120px"></icon-font>
        </div>
        <div style="padding-top: 30px;color: #999999;">您暂时还没有购买课程，请去购买课程哦</div>
      </div>
      <el-col :span="24" v-if="tableData.list.length">
        <el-row :gutter="20" v-for="(item, i) of seatRowsList" :key="i">
          <el-col :span="8">
            <el-checkbox-group v-model="checkboxGroup" size="small" text-color="#F56C6C" fill="#F56C6C">
              <el-checkbox class="chenk-box" v-for="(item, a) of seatLeftList" :key="a" :label="(a + ',' + i)" border :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId)">{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, a) of seatLeftList" :key="a">
              <img :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-col>
          </el-col>
          <el-col :span="8">
            <el-checkbox-group v-model="checkboxGroup" size="small" text-color="#F56C6C" fill="#F56C6C">
              <el-checkbox class="chenk-box" v-for="(item, b) of seatMidList" :key="b" :label="(b + seatLayout.seatLeft) + ',' + i" border :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId)">{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, b) of seatMidList" :key="b">
              <img :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-col>
          </el-col>
          <el-col :span="8">
            <el-checkbox-group v-model="checkboxGroup" size="small" text-color="#F56C6C" fill="#F56C6C">
              <el-checkbox class="chenk-box" v-for="(item, c) of seatRightList" :key="c" :label="(c + seatLayout.seatLeft + seatLayout.seatMid) + ',' + i" border :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId)">{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, c) of seatRightList" :key="c">
              <img :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl" style="width: 88px;" class="chenk-box-img" />
            </el-col>
          </el-col>
        </el-row>
      </el-col>
      <div v-if="tableData.list.length">
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
        seatImgUrl: require('../../../../assets/seat/seat.png'),
        checkedSeatImgUrl: require('../../../../assets/seat/seat-checked.png'),
        mySeatImgUrl: require('../../../../assets/seat/seat-me.png')
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
            list[item.rosterSeatX][item.rosterSeatY] = {...item.user, accountId: item.accountId}
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
            list[x][item.rosterSeatY] = {...item.user, accountId: item.accountId}
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
            list[x][item.rosterSeatY] = {...item.user, accountId: item.accountId}
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
      checkboxGroup() {
        console.log('watch checkboxGroup', this.checkboxGroup)
        console.log('rostersStudent 1', this.rostersStudent)
        const indexItem = this.rostersStudent.find(item =>item.accountId === this.currentUser.accountId)
        // if (index !== -1) {
        //   // 原来数组存在，则去除
        //   this.rostersStudent.splice(index, 1)
        // }
        const index = this.checkboxGroup.findIndex(item => {
          const array = item.split(',')
         return indexItem.rosterSeatX === (array[0] - 0) && indexItem.rosterSeatY === (array[1] - 0)
        })
        if (index !== -1) {
          // 原来数组存在，则去除
          this.checkboxGroup.splice(index, 1)
        }
        const rostersStudent = []
        this.checkboxGroup.forEach((item) => {
          this.rostersStudent.every(value => {
            console.log('sasa')
            const array = item.split(',')
            if (value.rosterSeatX === (array[0] - 0) && value.rosterSeatY === (array[1] - 0)) {
              console.log('+++')
              rostersStudent.push(value)
              return
            } else {
              console.log('----')
              rostersStudent.push({
                rosterSeatX: array[0] - 0,
                rosterSeatY: array[1] - 0,
                user: this.currentUser,
                accountId: this.currentUser.accountId
              })
            }
          })
        })
        console.log('index', rostersStudent)
        // this.rostersStudent = rostersStudent
        // console.log('rostersStudent 3', this.rostersStudent)
      }
    },
    methods: {
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