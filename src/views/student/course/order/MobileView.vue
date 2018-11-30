<template>
  <div v-loading="pageLoading">
    <div>
      <div class="mobile-class-attendance-page">
        <div
          class="clearfix"
          v-if="tableData.list.length"
        >
          <div>
            <span style="padding-right: 5px;">课程:</span>
            <el-select
              v-model="selectedCourseId"
              size="mini"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in tableData.list"
                :key="index"
                :label="item.courseName"
                :value="item.courseId"
              >
              </el-option>
            </el-select>
            <span
              style="padding-left: 10px;color: #409EFF;font-size: 12px;"
              @click="centerDialogVisible = true"
            >课程详情</span>
            <span
              style="padding-left: 10px;color: #409EFF;font-size: 12px;"
              v-if="!rosterId && !loading && bought"
              @click="confirmSeat"
            >确定座位</span>
            <span
              style="padding-left: 10px;color: #409EFF;font-size: 12px;"
              v-if="!bought && !orderStatus"
              @click="buyCourseShow = true"
            >购买课程</span>
          </div>
          <!-- <a target="_blank" :href="payUrl" id="wechatPay" ref="wechatPay">test</a> -->
          <div v-if="orderStatus">
            <div style="font-size: 14px;font-weight: bold;padding-top: 15px;">
              <span>订单状态：{{orderStatus | orderStatusMsg}}</span>
              <span style="position: relative;left: 45px;">
                <span
                  v-if="orderStatus && orderStatus === '0' && orderId"
                  class="item"
                >
                  <span>微信支付：</span>
                  <icon-font
                    icon="wxpay"
                    class="icon"
                    size="22px"
                    style="color: #67C23A;cursor: pointer;"
                    @click.native="goPay()"
                  ></icon-font>
                </span>
                <el-button
                  v-if="orderStatus && orderStatus === '1'"
                  type="text"
                  @click.native="applyBack()"
                >申请退款</el-button>
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="!tableData.list.length"
          style="text-align: center;padding-top: 30px;"
        >
          <div style="padding-top: 30px;">
            <icon-font
              icon="ico_meiyoushuju"
              class="icon"
              size="120px"
            ></icon-font>
          </div>
          <div style="padding-top: 30px;color: #999999;">您暂时还没有购买课程，请去购买课程哦</div>
        </div>
        <div
          v-if="tableData.list.length"
          style="padding-top: 30px;overflow-x: auto;"
        >
          <div
            v-for="(item, i) of seatRowsList"
            :key="i"
            style="display: flex;"
          >
            <div class="item-div">
              <el-checkbox-group
                v-model="checkboxGroup"
                size="mini"
                text-color="#F56C6C"
                fill="#F56C6C"
              >
                <el-checkbox
                  class="chenk-box"
                  v-for="(item, a) of seatLeftList"
                  :key="a"
                  :label="(a + ',' + i)"
                  border
                  :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId) || !bought || (isChecked && !isMy(item ? item[i] : null))"
                >{{item && item[i] ? item[i].name : ''}}</el-checkbox>
              </el-checkbox-group>
              <el-col
                class="chenk-box-col"
                :gutter="0"
                :span="8"
                v-for="(item, a) of seatLeftList"
                :key="a"
              >
                <img
                  :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl"
                  class="chenk-box-img"
                />
              </el-col>
            </div>
            <div class="item-div">
              <el-checkbox-group
                v-model="checkboxGroup"
                size="mini"
                text-color="#F56C6C"
                fill="#F56C6C"
              >
                <el-checkbox
                  class="chenk-box"
                  v-for="(item, b) of seatMidList"
                  :key="b"
                  :label="(b + seatLayout.seatLeft) + ',' + i"
                  border
                  :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId) || !bought || (isChecked && !isMy(item ? item[i] : null))"
                >{{item && item[i] ? item[i].name : ''}}</el-checkbox>
              </el-checkbox-group>
              <el-col
                class="chenk-box-col"
                :gutter="0"
                :span="8"
                v-for="(item, b) of seatMidList"
                :key="b"
              >
                <img
                  :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl"
                  class="chenk-box-img"
                />
              </el-col>
            </div>
            <div class="item-div">
              <el-checkbox-group
                v-model="checkboxGroup"
                size="mini"
                text-color="#F56C6C"
                fill="#F56C6C"
              >
                <el-checkbox
                  class="chenk-box"
                  v-for="(item, c) of seatRightList"
                  :key="c"
                  :label="(c + seatLayout.seatLeft + seatLayout.seatMid) + ',' + i"
                  border
                  :disabled="(item && item[i] && item[i].accountId !== currentUser.accountId) || !bought || (isChecked && !isMy(item ? item[i] : null))"
                >{{item && item[i] ? item[i].name : ''}}</el-checkbox>
              </el-checkbox-group>
              <el-col
                class="chenk-box-col"
                :gutter="0"
                :span="8"
                v-for="(item, c) of seatRightList"
                :key="c"
              >
                <img
                  :src="(item && item[i]) ? (item[i].accountId === currentUser.accountId ? mySeatImgUrl : checkedSeatImgUrl) : seatImgUrl"
                  class="chenk-box-img"
                />
              </el-col>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="buyCourseShow"
      title="提示"
      :show-close="false"
      width="80%"
      top="120px"
      class="buy-show"
    >
      <div>是否确定购买该课程?</div>
      <span slot="footer">
        <div style="text-align: center;">
          <el-button
            @click="buyCourseShow = false"
            size="small"
          >取消</el-button>
          <el-button
            @click="goPayCourse"
            size="small"
            type="primary"
          >确定</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      custom-class="qrcode-img"
    >
      <div
        v-if="!payUrl"
        style="color: #999999;"
      >系统繁忙，请联系管理员！</div>
      <span>如果识别不了二维码，请点击<a :href="payUrl"> 去支付 </a></span>
      <vue-qr :text="payUrl" :size="240"></vue-qr>
      <div
        v-if="payUrl"
        style="text-align: center;padding-top: 15px;"
      >长按二维码识别支付</div>
      <div
        v-if="payUrl"
        style="text-align: center;padding-top: 15px;color: #999999;"
      >支付成功后请耐心等待，若太久请尝试刷新页面</div>
    </el-dialog>
    <el-dialog
      title="课程详情"
      :visible.sync="centerDialogVisible"
      width="80%"
      center
    >
      <div style="font-size: 14px;font-weight: bold;">
        <div v-if="courseTeacher">任课教师：{{courseTeacher.name}}</div>
        <div>课程进度：{{courseCurrent}} / {{courseTotal}}</div>
        <!--<div>我的未上课时：{{rosterCourseCountRest === null ? courseTotal : rosterCourseCountRest}}</div>-->
        <div>上课日期：{{courseStartDateStr + ' 至 ' + courseEndDateStr}}</div>
        <div>上课时间：{{classStartTimeStr + ' 至 ' + classEndTimeStr}}</div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="centerDialogVisible = false"
          size="mini"
        >关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// API
import * as classApi from "../../../../apis/classApi";
import * as seatApi from "../../../../apis/seatApi";
import * as classRosterApi from "../../../../apis/classRosterApi";
import * as courseOrderApi from "../../../../apis/courseOrderApi";
// components
import IconFont from "../../../../components/icon-font/IconFont";
import VueQr from 'vue-qr'
// store
import { mapGetters } from "vuex";
import * as $account from "../../../../store/modules/account/types";
export default {
  title: "课程支付管理",
  name: "class-my",
  components: {
    IconFont,
    VueQr
  },
  data() {
    return {
      tableData: {
        loading: true,
        list: [],
        total: 0
      },
      searchForm: {
        pageNum: 1,
        pageSize: 9999
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
      seatImgUrl: require("../../../../assets/seat/seat.png"),
      checkedSeatImgUrl: require("../../../../assets/seat/seat-checked.png"),
      mySeatImgUrl: require("../../../../assets/seat/seat-me.png"),
      rosterId: null, // 当前用户座位id
      courseTeacher: null, // 任课老师
      courseStartDateStr: null, // 上课日期
      courseEndDateStr: null, // 结束日期
      classStartTimeStr: null, // 上课时间
      classEndTimeStr: null, // 下课时间
      courseName: null,
      classStatus: null, // // 0上课1下课-1未开始(字符串)
      loading: false,
      pageLoading: false,
      bought: true, // 是否已购买课程
      orderStatus: null, // 状态(0未支付1成功2申请退款3退款)(字符串)
      orderId: null,
      dialogVisible: false,
      qrCodeLoading: false,
      payUrl: null, // 支付地址
      tableData2: {
        // 签到情况
        loading: true,
        list: []
      },
      queryNum: 0, // 轮询次数
      centerDialogVisible: false,
      buyCourseShow: false
    };
  },
  filters: {
    attendTypeMsg(status) {
      // 1学生签到2老师签到3学生串课签到4缺席
      let msg = "";
      switch (status) {
        case "1":
          msg = "已签到";
          break;
        case "2":
          msg = "老师签到";
          break;
        case "3":
          msg = "串课已签到";
          break;
        case "4":
          msg = "缺席";
          break;
      }
      return msg;
    },
    orderStatusMsg(status) {
      // 状态(0未支付1成功2申请退款3退款)
      let msg = "";
      switch (status) {
        case "0":
          msg = "未支付";
          break;
        case "1":
          msg = "支付成功";
          break;
        case "2":
          msg = "申请退款";
          break;
        case "3":
          msg = "已退款";
          break;
      }
      return msg;
    }
  },
  computed: {
    ...mapGetters($account.namespace, {
      currentUser: $account.getters.currentUser
    }),
    // 超级管理员
    isSuperAdmin() {
      return this.currentUser && this.currentUser.type === "-1";
    },
    // 管理员
    isAdmin() {
      return this.currentUser && this.currentUser.type === "0";
    },
    // 教师
    isTeacher() {
      return this.currentUser && this.currentUser.type === "2";
    },
    // 学生
    isStudent() {
      return this.currentUser && this.currentUser.type === "1";
    },
    // 左边座位
    seatLeftList() {
      if (!this.seatLayout) return [];
      // const list = new Array(this.seatLayout.seatLeft)
      const list = new Array(); //先声明一维
      for (let i = 0; i < this.seatLayout.seatLeft; i++) {
        //一维长度
        list[i] = new Array(); //再声明二维
        for (let j = 0; j < this.seatLayout.seatRows; j++) {
          //二维长度
          list[i][j] = null;
        }
      }
      // 学生匹配座位
      this.rostersStudent.forEach(item => {
        if (item.rosterSeatX < this.seatLayout.seatLeft) {
          // list[item.rosterSeatX] = new Array(this.seatLayout.seatRows)
          list[item.rosterSeatX][item.rosterSeatY] = {
            ...item.user,
            accountId: item.accountId
          };
        }
      });
      return list;
    },
    // 中间座位
    seatMidList() {
      if (!this.seatLayout) return [];
      // const list = new Array(this.seatLayout.seatMid)
      const list = new Array(); //先声明一维
      for (let i = 0; i < this.seatLayout.seatMid; i++) {
        //一维长度
        list[i] = new Array(); //再声明二维
        for (let j = 0; j < this.seatLayout.seatRows; j++) {
          //二维长度
          list[i][j] = null;
        }
      }
      // 学生匹配座位
      this.rostersStudent.forEach(item => {
        if (
          item.rosterSeatX <
            this.seatLayout.seatMid + this.seatLayout.seatLeft &&
          item.rosterSeatX >= this.seatLayout.seatLeft
        ) {
          const x = item.rosterSeatX - this.seatLayout.seatLeft;
          if (list[x]) {
            list[x][item.rosterSeatY] = {
              ...item.user,
              accountId: item.accountId
            };
          }
        }
      });
      return list;
    },
    // 右边座位
    seatRightList() {
      if (!this.seatLayout) return [];
      const list = new Array(); //先声明一维
      for (let i = 0; i < this.seatLayout.seatRight; i++) {
        //一维长度
        list[i] = new Array(); //再声明二维
        for (let j = 0; j < this.seatLayout.seatRows; j++) {
          //二维长度
          list[i][j] = null;
        }
      }
      // 学生匹配座位
      this.rostersStudent.forEach(item => {
        if (
          item.rosterSeatX >=
          this.seatLayout.seatMid + this.seatLayout.seatLeft
        ) {
          const x =
            item.rosterSeatX -
            this.seatLayout.seatMid -
            this.seatLayout.seatLeft;
          if (list[x]) {
            list[x][item.rosterSeatY] = {
              ...item.user,
              accountId: item.accountId
            };
          }
        }
      });
      return list;
    },
    // 座位行数
    seatRowsList() {
      if (!this.seatLayout) return [];
      const list = new Array(this.seatLayout.seatRows);
      return list;
    },
    // 学生自己是否已选
    isChecked() {
      return (
        this.rostersStudent.findIndex(
          value => value.accountId === this.currentUser.accountId
        ) !== -1
      );
    }
  },
  watch: {
    async selectedCourseId(value) {
      this.loading = true;
      this.checkboxGroup = [];
      this.rostersStudent = [];
      this.rosterId = null;
      this.orderStatus = null;
      this.orderId = null;
      this.tableData.list.forEach(element => {
        if (element.courseId === value) {
          this.seatLayout = element.seatLayout;
          this.courseTotal = element.courseTotal;
          this.courseCurrent = element.courseCurrent;
          this.courseTeacher = element.user;
          this.courseStartDateStr = element.courseStartDateStr;
          this.courseEndDateStr = element.courseEndDateStr;
          this.classStartTimeStr = element.classStartTimeStr;
          this.classEndTimeStr = element.classEndTimeStr;
          this.courseName = element.courseName;
          this.classStatus = element.classStatus;
          this.bought = element.bought;
          this.orderStatus = element.orderStatus;
          this.orderId = element.orderId;
        }
      });
      await Promise.all([this.queryClassRosters()]);
      this.loading = false;
    },
    checkboxGroup() {
      const rostersStudent = [];
      this.checkboxGroup.forEach(item => {
        const array = item.split(",");
        const info = this.rostersStudent.find(
          indexItem =>
            indexItem.rosterSeatX === array[0] - 0 &&
            indexItem.rosterSeatY === array[1] - 0
        );
        if (info) {
          rostersStudent.push(info);
        } else {
          const index = this.rostersStudent.findIndex(
            value => value.accountId === this.currentUser.accountId
          );
          if (index === -1) {
            rostersStudent.push({
              rosterSeatX: array[0] - 0,
              rosterSeatY: array[1] - 0,
              accountId: this.currentUser.accountId,
              user: this.currentUser
            });
          }
        }
      });
      this.rostersStudent = [...rostersStudent];
    }
  },
  methods: {
    isMy(info) {
      if (!info) return false;
      return (
        this.currentUser.accountId === info.accountId &&
        this.orderStatus &&
        this.orderStatus === "1" &&
        !this.rosterId
      );
    },
    async queryClassList() {
      this.tableData.loading = true;
      let params = null;
      if (this.isSuperAdmin || this.isAdmin) {
        params = { ...this.searchForm };
      } else if (this.isTeacher) {
        params = { ...this.searchForm, accountId: this.currentUser.accountId };
      } else if (this.isStudent) {
        params = { ...this.searchForm };
      }
      const { data } = await classApi.getClassList(params).catch(e => e);
      const { total, list } = data;
      this.tableData.total = total || 0;
      this.tableData.list = list || [];
      if (list && list.length && this.selectedCourseId) {
        const index = list.findIndex(
          value => value.courseId === this.selectedCourseId
        );
        if (index !== -1) {
          const item = this.tableData.list[index];
          this.seatLayout = item.seatLayout;
          this.courseTotal = item.courseTotal;
          this.courseCurrent = item.courseCurrent;
          this.courseTeacher = item.user;
          this.courseStartDateStr = item.courseStartDateStr;
          this.courseEndDateStr = item.courseEndDateStr;
          this.classStartTimeStr = item.classStartTimeStr;
          this.classEndTimeStr = item.classEndTimeStr;
          this.courseName = item.courseName;
          this.classStatus = item.classStatus;
          this.bought = item.bought;
          this.orderStatus = item.orderStatus;
          this.orderId = item.orderId;
          if (this.orderStatus !== "0") {
            // this.bought = true
            this.dialogVisible = false;
          }
        }
        this.queryClassRosters();
      }
      if (list && list.length && !this.selectedCourseId) {
        this.selectedCourseId = list[0].courseId;
      }
      this.tableData.loading = false;
    },
    // 获取课程名单
    async queryClassRosters() {
      const { data } = await classRosterApi
        .getClassRosterList({ courseId: this.selectedCourseId })
        .catch(e => e);
      this.rostersStudent = [];
      this.checkboxGroup = [];
      if (data && data.length) {
        data.forEach(value => {
          this.checkboxGroup.push(value.rosterSeatX + "," + value.rosterSeatY);
          if (value.accountId === this.currentUser.accountId) {
            this.rosterId = value.rosterId;
          }
        });
        this.rostersStudent = data;
      }
    },
    // 确定座位
    async confirmSeat() {
      if (this.orderStatus && this.orderStatus === "0")
        return this.$message("请先完成支付，再选座位！");
      const info = this.rostersStudent.find(
        indexItem => indexItem.accountId === this.currentUser.accountId
      );
      if (!info) return this.$message("请选择座位");
      if (this.rosterId) {
        // 修改
        const ids = [];
        this.rostersStudent.forEach(item => {
          ids.push(
            (item.rosterId || this.rosterId) +
              "," +
              item.rosterSeatX +
              "," +
              item.rosterSeatY
          );
        });
        const params = {
          courseId: this.selectedCourseId,
          ids
        };
        const { code, msg, data } = await classRosterApi
          .updateClassRoster(params)
          .catch(e => e);
        if (code !== "200") return this.$message("选座失败，", msg);
        this.rosterId = data.rosterId;
        this.$message({ type: "success", message: "选座成功！" });
      } else {
        // 新增选择座位
        const params = {
          courseId: this.selectedCourseId,
          seatX: info.rosterSeatX,
          seatY: info.rosterSeatY
        };
        const { code, msg, data } = await seatApi
          .choiceSeat(params)
          .catch(e => e);
        if (code !== "200") return this.$message("选座失败，", msg);
        this.rosterId = data.rosterId;
        this.$message({ type: "success", message: "选座成功！" });
      }
    },
    // 购买课程
    async goPayCourse() {
      const { code, msg } = await courseOrderApi
        .createCourseOrder({ courseId: this.selectedCourseId })
        .catch(e => e);
      if (code !== "200") return this.$message("购买失败，" + msg);
      this.$message({ type: "success", message: "购买成功！请去完成支付！" });
      this.orderStatus = "0";
      this.buyCourseShow = false;
      await this.queryClassList();
    },
    // 支付
    async goPay() {
      const params = {
        orderId: this.orderId
      };
      this.pageLoading = true;
      const { data } = await courseOrderApi
        .payCourseOrder(params)
        .catch(e => e);
      this.pageLoading = false;
      this.payUrl = data || "";
      this.dialogVisible = true
      this.getOrderStatus();
    },
    // 轮询查订单状态(5秒)
    async getOrderStatus() {
      setTimeout(async () => {
        // await this.queryOrderList().catch(e => e)
        await this.queryClassList().catch(e => e);
        this.queryNum++;
        if (this.dialogVisible && this.queryNum < 10) {
          this.getOrderStatus();
        } else {
          this.queryNum = 0;
        }
      }, 6000);
    },
    // test pay 模拟支付
    async testPay() {
      const params = {
        orderId: this.orderId
      };
      const res = await courseOrderApi.testCourseOrder(params).catch(e => e);
      if (res.code !== "200") return this.$message("支付失败，" + res.msg);
      this.$message({ type: "success", message: "支付成功！" });
      this.bought = true;
      this.dialogVisible = false;
      this.orderStatus = "1";
      // this.queryOrderList()
    },
    // 申请退款
    async applyBack() {
      this.$confirm("是否确定申请退款该课程?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { code, msg } = await courseOrderApi
            .courseOrderApplyBack({ orderId: this.orderId })
            .catch(e => e);
          if (code !== "200")
            return this.$message("申请退款失败，请联系管理员！" + msg);
          this.$message({
            type: "success",
            message: "已申请退款，请耐心等候审核！"
          });
          this.orderStatus = "2";
          this.bought = false;
          // this.queryOrderList()
        })
        .catch(() => {});
    }
  },
  async mounted() {
    if (this.$route.query.courseId) {
      this.selectedCourseId = this.$route.query.courseId - 0;
    }
    this.queryClassList();
    // await this.queryOrderList()
  }
};
</script>
<style>
.mobile-class-attendance-page {
  font-size: 14px;
  padding: 15px 15px 15px 15px;
  overflow-y: auto;
}
.mobile-class-attendance-page .content .el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.mobile-class-attendance-page .chenk-box-col {
  width: 50px;
  text-align: center;
}
.mobile-class-attendance-page .chenk-box {
  width: 50px;
  text-align: center;
}
.mobile-class-attendance-page .el-checkbox__label {
  padding: 0;
  color: #000000 !important;
}

.mobile-class-attendance-page .chenk-box-img {
  width: 45px;
  padding: 5px;
}
.mobile-class-attendance-page .chenk-box .el-checkbox__input {
  display: none;
}
.mobile-class-attendance-page .seat-icon {
  width: 90px;
  text-align: center;
  padding-top: 15px;
}
.mobile-class-attendance-page .seat-icon .icon {
  color: #606266;
}
.mobile-class-attendance-page .item-div {
  flex: 1;
}
.mobile-class-attendance-page .el-checkbox-group {
  font-size: 12px;
  display: flex;
  padding: 0;
}
.mobile-class-attendance-page
  .el-checkbox-group
  .el-checkbox.is-bordered.el-checkbox--mini {
  padding: 3px 0;
  height: 24px;
}
.mobile-class-attendance-page
  .el-checkbox-group
  .el-checkbox.is-bordered
  + .el-checkbox.is-bordered {
  margin-left: 2px;
}
.mobile-class-attendance-page .chenk-box {
  width: 50px;
  text-align: center;
  flex: 1;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mobile-class-attendance-page .el-checkbox__label {
  padding: 0;
  color: #000000 !important;
}
.mobile-class-attendance-page
  .el-checkbox-group
  .el-checkbox.is-bordered.el-checkbox--mini {
  padding: 3px 0;
  height: 24px;
}
.qrcode-img {
  text-align: center;
  width: 300px;
  /*height: 360px;*/
}
.buy-show .el-dialog__body {
  padding: 15px 30px;
}
</style>