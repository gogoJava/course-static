<template>
  <div class="class-attendance-page">
    <el-card class="content">
      <div slot="header" class="clearfix" v-if="tableData.list.length">
        <div>
          <span style="padding-right: 15px;">课程:</span>
          <el-select v-model="selectedCourseId" filterable placeholder="请选择">
            <el-option v-for="(item, index) in tableData.list" :key="index" :label="item.courseName" :value="item.courseId">
            </el-option>
          </el-select>
          <span style="padding-left: 30px;">
            <el-button v-if="!rosterId && !loading && bought" type="primary" @click.native="confirmSeat" size="small">确定座位</el-button>
            <el-button v-if="!bought && !orderStatus" type="primary" @click.native="goPayCourse" size="small">购买课程</el-button>
          </span>
        </div>
        <div style="font-size: 24px;font-weight: bold;height: 42px;padding-top: 15px;">
          <el-col :span="6"><div>任课教师：{{courseTeacher.name}}</div></el-col>
          <el-col :span="18"><div style="padding-left: 90px;">上课时间：{{courseStartTime + ' 至 ' + courseEndTime}}</div></el-col>
        </div>
        <div v-if="orderStatus">
          <div style="font-size: 24px;font-weight: bold;height: 42px;padding-top: 15px; float: left;">订单状态：{{orderStatus | orderStatusMsg}}</div>
          <div style="position: relative;height: 52px;padding-top: 10px;left: 45px;">
            <el-tooltip v-if="orderStatus && orderStatus === '0'" class="item" effect="dark" content="微信扫码支付" placement="top">
              <icon-font icon="wxpay" class="icon" size="32px" style="color: #67C23A" @click.native="goPay('wechat')"></icon-font>
            </el-tooltip>
            <el-tooltip v-if="orderStatus && orderStatus === '0'" class="item" effect="dark" content="支付宝扫码支付" placement="top">
              <icon-font icon="zhifubao" class="icon" size="32px" style="color: #409EFF" @click.native="goPay('alipay')"></icon-font>
            </el-tooltip>
            <el-button v-if="orderStatus && orderStatus === '1'" type="text" @click.native="applyBack()">申请退款</el-button>
          </div>
        </div>
      </div>
      <div v-if="!tableData.list.length" style="text-align: center;">
        <div style="padding-top: 30px;">
          <icon-font icon="ico_meiyoushuju" class="icon" size="120px"></icon-font>
        </div>
        <div style="padding-top: 30px;color: #999999;">您暂时还没有购买课程，请去购买课程哦</div>
      </div>
      <el-col :span="24" v-if="tableData.list.length">
        <el-row :gutter="0" v-for="(item, i) of seatRowsList" :key="i" style="min-width: 900px;">
          <el-col :span="8" style="width: 280px;">
            <el-checkbox-group v-model="checkboxGroup" size="small" text-color="#F56C6C" fill="#F56C6C">
              <el-checkbox class="chenk-box" v-for="(item, a) of seatLeftList" :key="a" :label="(a + ',' + i)" border :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId) || isChecked || !bought">{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, a) of seatLeftList" :key="a">
              <img :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl" class="chenk-box-img" />
            </el-col>
          </el-col>
          <el-col :span="8" style="width: 280px;">
            <el-checkbox-group v-model="checkboxGroup" size="small" text-color="#F56C6C" fill="#F56C6C">
              <el-checkbox class="chenk-box" v-for="(item, b) of seatMidList" :key="b" :label="(b + seatLayout.seatLeft) + ',' + i" border :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId) || isChecked || !bought">{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, b) of seatMidList" :key="b">
              <img :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl" class="chenk-box-img" />
            </el-col>
          </el-col>
          <el-col :span="8" style="width: 280px;">
            <el-checkbox-group v-model="checkboxGroup" size="small" text-color="#F56C6C" fill="#F56C6C">
              <el-checkbox class="chenk-box" v-for="(item, c) of seatRightList" :key="c" :label="(c + seatLayout.seatLeft + seatLayout.seatMid) + ',' + i" border :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId) || isChecked || !bought">{{item && item[i] ? item[i].name : ''}}</el-checkbox>
            </el-checkbox-group>
            <el-col class="chenk-box-col" :gutter="0" :span="8" v-for="(item, c) of seatRightList" :key="c">
              <img :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl" class="chenk-box-img" />
            </el-col>
          </el-col>
        </el-row>
      </el-col>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :show-close="false" custom-class="qrcode-img">
      <qr-code :value="'url'" :size="240" v-loading="qrCodeLoading"></qr-code>
      <div style="text-align: center;padding-top: 15px;">微信/支付宝扫码支付</div>
      <div>
        <el-button type="primary" @click.native="testPay">Test Pay</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // API
  import * as classApi from '../../../../apis/classApi'
  import * as seatApi from '../../../../apis/seatApi'
  import * as classRosterApi from '../../../../apis/classRosterApi'
  import * as courseOrderApi from '../../../../apis/courseOrderApi'
  // components
  import IconFont from '../../../../components/icon-font/IconFont'
  import QrCode from "../../../components/qrcode/QrCode"
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../../store/modules/account/types'
  export default {
    title: '课程支付管理',
    name: 'class-my',
    components: {
      IconFont,
      QrCode
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
        courseStartTime: null, // 上课时间
        courseEndTime: null, // 结束时间
        courseName: null,
        classStatus: null, // // 0上课1下课-1未开始(字符串)
        loading: false,
        bought: true, // 是否已购买课程
        orderStatus: null, // 状态(0未支付1成功2申请退款3退款)(字符串)
        orderId: null,
        dialogVisible: false,
        qrCodeLoading: false,
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
        this.loading = true
        this.checkboxGroup = []
        this.rostersStudent = []
        this.rosterId = null
        this.orderStatus = null
        this.orderId = null
        this.tableData.list.forEach(element => {
          if (element.courseId === value) {
            // console.log('element', element)
            this.seatLayout = element.seatLayout
            this.courseTotal = element.courseTotal
            this.courseCurrent = element.courseCurrent
            this.courseTeacher = element.user
            this.courseStartTime = element.courseStartTime
            this.courseEndTime = element.courseEndTime
            this.courseName = element.courseName
            this.classStatus = element.classStatus
            this.bought = element.bought
            this.orderStatus = element.orderStatus
            this.orderId = element.orderId
          }
        })
        await Promise.all([
          this.queryClassRosters(),
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
        return this.currentUser.accountId === info.accountId
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
            // ids.push({
            //   rosterId: item.rosterId || this.rosterId,
            //   seatX: item.rosterSeatX,
            //   sertY: item.rosterSeatY
            // })
          })
          const data = {
            courseId: this.selectedCourseId,
            ids
          }
          // console.log('data', data)
          const {code, msg} = await classRosterApi.updateClassRoster(data).catch(e => e)
          if (code !== '200') return this.$message('选座失败，', msg)
          this.$message({type: 'success', message: '选座成功！'})
        } else {
          // 新增选择座位
          const params = {
            courseId: this.selectedCourseId,
            seatX: info.rosterSeatX,
            seatY: info.rosterSeatY
          }
          const {code, msg} = await seatApi.choiceSeat(params).catch(e => e)
          if (code !== '200') return this.$message('选座失败，', msg)
          this.$message({type: 'success', message: '选座成功！'})
        }
      },
      // 购买课程
      async goPayCourse() {
        this.$confirm('是否确定购买该课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code, msg} = await courseOrderApi.createCourseOrder({courseId: this.selectedCourseId}).catch(e => e)
          if (code !== '200') return this.$message('购买失败，' + msg)
          this.$message({type: 'success', message: '购买成功！请去完成支付！'})
          this.bought = true
          this.orderStatus = '0'
          await this.queryClassList()
          this.queryOrderList()
        }).catch(() => {})
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
              this.tableData.list[index] = {...this.tableData.list[index], ...item}
              if (this.selectedCourseId === item.courseId) {
                this.orderId = item.orderId
                this.orderStatus = item.orderStatus
              }
            }
          })
        }
      },
      // 支付
      async goPay(type) {
        this.dialogVisible = true
        if (this.dialogVisible) return
        const params = {
          gofalse: 'baidu.com',
          gotrue: 'http://open.taobao.com/doc.htm?docId=73&docType=1',
          orderId: this.orderId,
          type // 支付类型:alipay,wechat
        }
        const res = await courseOrderApi.payCourseOrder(params).catch(e => e)
        console.log('res', res)
      },
      // test pay 模拟支付
      async testPay() {
        const params = {
          orderId: this.orderId
        }
        const res = await courseOrderApi.testCourseOrder(params).catch(e => e)
        // console.log('res', res)
        if (res.code !== '200') return this.$message('支付失败，' + res.msg)
        this.$message({type: 'success', message: '支付成功！'})
        this.bought = true
        this.dialogVisible = false
        this.orderStatus = '1'
        this.queryOrderList()
      },
      // 申请退款
      async applyBack() {
        this.$confirm('是否确定申请退款该课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code, msg} = await courseOrderApi.courseOrderApplyBack({orderId: this.orderId}).catch(e => e)
          if (code !== '200') return this.$message('申请退款失败，请联系管理员！' + msg)
          this.$message({type: 'success', message: '已申请退款，请耐心等候审核！'})
          this.orderStatus = '2'
          this.bought = false
          this.queryOrderList()
        }).catch(() => {})
      }
    },
    async mounted() {
      await this.queryClassList()
      this.queryOrderList()
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
    width: 80px;
    text-align: center;
  }
  .class-attendance-page .chenk-box {
    width: 80px;
    text-align: center;

  }
  .class-attendance-page .el-checkbox__label {
    padding: 0;
  }
  .class-attendance-page .chenk-box-img {
    width: 80px;
    padding: 10px;
  }
  .class-attendance-page .chenk-box .el-checkbox__input {
    display: none;
  }
  .class-attendance-page .seat-icon {
    width: 90px;
    text-align: center;
    padding-top: 15px;
  }
  .class-attendance-page .seat-icon .icon {
    color: #606266;
  }
  .class-attendance-page .seat-icon .icon-selected {
    /*color: #409EFF;*/
  }
  .qrcode-img {
    text-align: center;
    width: 300px;
    /*height: 360px;*/
  }
</style>