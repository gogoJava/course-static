<template>
  <div class="order-class-list-page">
    <el-card class="box-card">
      <div v-if="isSuperAdmin" style="float: right">
        <el-button type="primary" size="small" @click="$router.push('/home/class/create')">新建课程</el-button>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
        <el-table-column prop="courseName" label="课程名称">
        </el-table-column>
        <!--<el-table-column prop="user.name" label="任课教师">-->
        <!--</el-table-column>-->
        <el-table-column prop="courseStartTime" label="上课时间">
          <template slot-scope="scope">
            <span>{{$moment(scope.row.courseStartTime).format('YYYY-MM-DD')}} 至 {{$moment(scope.row.courseEndTime).format('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="courseTotal" label="总课时">
        </el-table-column>
         <el-table-column prop="orderStatus" label="订单状态">
           <template slot-scope="scope">
            <span>{{scope.row.orderStatus | orderStatusMsg}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column v-if="isStudent" prop="bought" label="支付状态">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.bought ? '已支付' : '未支付'}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.bought" type="text" @click.native="$router.push('/home/class/edit/' + scope.row.courseId)">详情</el-button>
            <el-tooltip class="item" effect="dark" content="微信扫码支付" placement="top">
              <icon-font icon="wxpay" class="icon" size="32px" style="color: #67C23A" @click.native="goPay(scope.row, 'wechat')"></icon-font>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="支付宝扫码支付" placement="top">
              <icon-font icon="zhifubao" class="icon" size="32px" style="color: #409EFF" @click.native="goPay(scope.row, 'alipay')"></icon-font>
            </el-tooltip>
            <!--<el-button v-if="!scope.row.bought" type="text" @click.native="goPay(scope.row, 'wechat')">微信支付</el-button>-->
            <!--<el-button v-if="!scope.row.bought" type="text" @click.native="goPay(scope.row, 'alipay')">支付宝支付</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <my-pagination
              :total="tableData.total"
              :currentPage.sync="searchForm.pageNum"
              :page-size.sync="searchForm.pageSize"
              @current-change="onCurrentPageChange">
      </my-pagination>
      <el-dialog :visible.sync="dialogVisible" :show-close="false" custom-class="qrcode-img">
        <qr-code :value="'url'" :size="240" v-loading="qrCodeLoading"></qr-code>
        <div style="text-align: center;padding-top: 15px;">微信/支付宝扫码支付</div>
        <div>
          <el-button type="primary" @click.native="testPay">Test Pay</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
  // components
  import MyPagination from '../../../../components/pagination/MyPagination.vue'
  // API
  import * as courseOrderApi from '../../../../apis/courseOrderApi'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../../store/modules/account/types'
  import IconFont from "../../../../components/icon-font/IconFont"
  import QrCode from "../../../components/qrcode/QrCode"
  export default {
    title: '支付管理',
    name: 'order-class-list-page',
    components: {
      IconFont,
      MyPagination,
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
          pageSize: 10,
        },
        dialogVisible: false,
        qrCodeLoading: false,
        orderInfo: null
      })
    },
    computed: {
      ...mapGetters($account.namespace, {
        currentUser: $account.getters.currentUser
      }),
      defaultActive() {
        return this.$route.path
      },
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
    },
    filters: {
      orderStatusMsg(status) {
        // 状态(0未支付1成功2部分退款3申请退款)
        let msg = ''
        switch (status) {
          case '0':
            msg = '未支付'
            break
          case '1':
            msg = '支付成功'
            break
          case '2':
            msg = '部分退款'
            break
          case '3':
            msg = '申请退款'
            break
        }
        return msg
      },
    },
    methods: {
      onCurrentPageChange(page) {
        this.searchForm.pageNum = page
        this.queryClassList()
      },
      async queryClassList() {
        this.tableData.loading = true
        const params = {...this.searchForm, accountId: this.currentUser.accountId}
        const {data} = await courseOrderApi.courseOrderList(params).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = list || []
        this.tableData.loading = false
      },
      // 去购买
      async goPay(info, type) {
        this.orderInfo = info
        this.dialogVisible = true
        if (this.dialogVisible) return
        const params = {
          gofalse: 'baidu.com',
          gotrue: 'http://open.taobao.com/doc.htm?docId=73&docType=1',
          orderId: info.orderId,
          type // 支付类型:alipay,wechat
        }
        const res = await courseOrderApi.payCourseOrder(params).catch(e => e)
        console.log('res', res)
      },
      // test pay 模拟支付
      async testPay() {
        const params = {
          orderId: this.orderInfo.orderId
        }
        const res = await courseOrderApi.testCourseOrder(params).catch(e => e)
        console.log('res', res)
        if (res.code !== '200') return this.$message('支付失败，' + res.msg)
        this.$message({type: 'success', message: '支付成功！'})
        this.dialogVisible = false
        this.queryClassList()
      }
    },
    mounted() {
      this.queryClassList()
    }
  }
</script>
<style>
  .order-class-list-page .icon {
    line-height: 32px;
    cursor: pointer;
  }
  .qrcode-img {
    text-align: center;
    width: 300px;
    /*height: 360px;*/
  }
</style>