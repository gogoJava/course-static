<template>
  <div class="course-order-refund-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>退费订单</span>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%" @selection-change="handleSelectionChange">
        <!--<el-table-column type="selection" width="55">-->
        <!--</el-table-column>-->
        <el-table-column prop="orderId" label="订单Id">
        </el-table-column>
        <el-table-column prop="user.name" label="学生姓名">
        </el-table-column>
        <el-table-column prop="courseName" label="退费课程">
        </el-table-column>
        <el-table-column prop="createTime" label="时间">
          <template slot-scope="scope">
            <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="申请退款金额">
          <template slot-scope="scope">
            <span>¥ {{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actualAmount" label="实际退款金额">
          <template slot-scope="scope">
            <span>¥ {{scope.row.actualAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="courseAmount" label="课程总额">
          <template slot-scope="scope">
            <span>¥ {{scope.row.courseAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.refundStatus === '3'">已退款</div>
            <el-button v-if="scope.row.refundStatus === '2'" type="text" @click.native="refundOrderConfirm(scope.row)">确认退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;padding-top: 15px;padding-right: 120px;">
        <div>总计：{{totalIncomeAmount}}元</div>
      </div>
      <my-pagination
              :total="tableData.total"
              :currentPage.sync="searchForm.pageNum"
              :page-size.sync="searchForm.pageSize"
              @current-change="onCurrentPageChange">
      </my-pagination>
    </el-card>
  </div>
</template>
<script>
  // components
  import MyPagination from '../../../../components/pagination/MyPagination.vue'
  // API
  // import * as courseApi from '../../../../apis/courseApi'
  import * as refuntOrderApi from '../../../../apis/refuntOrderApi'
  export default {
    title: '退费订单',
    name: 'course-order-refund-list',
    components: {
      MyPagination
    },
    data() {
      return ({
        tableData: {
          loading: true,
          list: [],
          total: 0
        },
        searchForm: {
          keyword: '',
          pageNum: 1,
          pageSize: 10,
        },
        totalIncomeAmount: 0
      })
    },
    watch: {
      'searchForm.pageSize'() {
        this.queryCourseOrderList()
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.totalIncomeAmount = 0
        val.forEach(item => {
          this.totalIncomeAmount = this.totalIncomeAmount + item.courseCost
        })
      },
      onCurrentPageChange(page) {
        this.searchForm.pageNum = page
        this.queryCourseOrderList()
      },
      async queryCourseOrderList() {
        this.tableData.loading = true
        const {data} = await refuntOrderApi.refundOrderList({
          ...this.searchForm,
          // orderStatus: 2, //
        }).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = list || []
        this.tableData.loading = false
      },
      async refundOrderConfirm(order) {
        this.$confirm('是否确定退款该课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code, msg} = await refuntOrderApi.refundOrderConfirm({refundId: order.refundId}).catch(e => e)
          if (code !== '200') return this.$message('退款失败！' + msg)
          this.$message({type: 'success', message: '退款成功！'})
          this.queryCourseOrderList()
        }).catch(() => {})
      }
    },
    mounted() {
      this.queryCourseOrderList()
    }
  }
</script>
<style></style>